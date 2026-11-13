"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { useAuthStore } from "../store/authStore";

export type PropertyPayload = {
  title: string;
  description: string;
  listingType: "SALE" | "RENT";
  type: "HOUSE" | "FLAT" | "PLOT" | "COMMERCIAL";
  subType: string;
  city: string;
  address: string;
  plotNumber: string | null;
  price: number;
  areaSize: number;
  areaUnit: "MARLA" | "KANAL" | "SQFT";
  areaSqft: number;
  installmentAvailable: boolean;
  readyForPossession: boolean;
  bedrooms: number | null;
  bathrooms: number | null;
  amenities: string[];
  email: string;
  phone: string;
  whatsapp: string | null;
  videoUrl: string | null;
  images: File[];
};

type Props = {
  onSubmit: (data: PropertyPayload) => Promise<void>;
  submitLabel?: string;
};

type Tab = "HOME" | "PLOT" | "COMMERCIAL";

const subTypes: Record<Tab, { label: string; value: string }[]> = {
  HOME: [
    { label: "House", value: "HOUSE" },
    { label: "Flat", value: "FLAT" },
    { label: "Upper Portion", value: "UPPER_PORTION" },
    { label: "Lower Portion", value: "LOWER_PORTION" },
    { label: "Farm House", value: "FARM_HOUSE" },
    { label: "Room", value: "ROOM" },
    { label: "Penthouse", value: "PENTHOUSE" },
  ],
  PLOT: [
    { label: "Residential Plot", value: "RESIDENTIAL_PLOT" },
    { label: "Commercial Plot", value: "COMMERCIAL_PLOT" },
    { label: "Agricultural Land", value: "AGRICULTURAL_LAND" },
  ],
  COMMERCIAL: [
    { label: "Office", value: "OFFICE" },
    { label: "Shop", value: "SHOP" },
    { label: "Warehouse", value: "WAREHOUSE" },
    { label: "Building", value: "BUILDING" },
  ],
};

const tabLabel: Record<Tab, string> = { HOME: "Home", PLOT: "Plots", COMMERCIAL: "Commercial" };

// 1 marla = 272.25 sq ft, 1 kanal = 20 marla
const sqftPerUnit = { MARLA: 272.25, KANAL: 5445, SQFT: 1 } as const;

const amenityList = [
  "Parking", "Gas", "Electricity", "Water supply", "Internet", "Security guard", "CCTV",
  "Lawn / garden", "Servant quarter", "Lift", "Furnished", "Backup generator", "Central AC",
  "Near mosque", "Near park", "Near school",
];

const bedOptions = ["Studio", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "10+"];
const bathOptions = ["1", "2", "3", "4", "5", "6", "6+"];

const input = "w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-green-600";
const label = "mb-1.5 block text-sm font-semibold";

function chip(active: boolean) {
  return `rounded-full border px-4 py-2 text-sm transition ${
    active ? "border-green-600 bg-green-50 font-semibold text-green-700" : "bg-gray-100 hover:bg-gray-200"
  }`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 border-b pb-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Toggle({
  title, hint, checked, onChange,
}: { title: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-gray-500">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-green-600" : "bg-gray-300"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

function QualityTip({ text, percent }: { text: string; percent: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-green-50/60 px-4 py-3">
      <div>
        <p className="text-sm font-semibold">Quality tip</p>
        <p className="text-xs text-gray-500">{text}</p>
      </div>
      <span className={`rounded px-2 py-1 text-sm font-bold ${percent >= 100 ? "text-green-700" : "text-red-500"}`}>
        {Math.min(percent, 100)}%
      </span>
    </div>
  );
}

export default function PropertyForm({ onSubmit, submitLabel = "Submit" }: Props) {
  const user = useAuthStore((s) => s.user);

  const [listingType, setListingType] = useState<"SALE" | "RENT">("SALE");
  const [tab, setTab] = useState<Tab>("HOME");
  const [subType, setSubType] = useState("HOUSE");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [areaSize, setAreaSize] = useState("");
  const [areaUnit, setAreaUnit] = useState<"MARLA" | "KANAL" | "SQFT">("MARLA");
  const [installment, setInstallment] = useState(false);
  const [possession, setPossession] = useState(false);
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [whatsapp, setWhatsapp] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function changeTab(t: Tab) {
    setTab(t);
    setSubType(subTypes[t][0].value);
    if (t !== "HOME") {
      setBedrooms("");
      setBathrooms("");
    }
  }

  function toggleAmenity(a: string) {
    setAmenities((list) => (list.includes(a) ? list.filter((x) => x !== a) : [...list, a]));
  }

  const toNumber = (v: string) => (v === "Studio" ? 0 : parseInt(v, 10));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!city) return setError("Select a city");
    if (!address.trim()) return setError("Enter the area or address");
    if (title.trim().length < 5) return setError("Title must be at least 5 characters");
    if (!(Number(price) > 0)) return setError("Enter a valid price");
    if (!(Number(areaSize) > 0)) return setError("Enter the area size");
    if (phone.trim().length < 10) return setError("Enter a valid mobile number");
    if (images.length === 0) return setError("Add at least one photo");
    if (videoUrl && !/^https?:\/\//i.test(videoUrl)) return setError("Video link must start with http:// or https://");

    const propertyType =
      tab === "PLOT" ? "PLOT" : tab === "COMMERCIAL" ? "COMMERCIAL" : subType === "FLAT" ? "FLAT" : "HOUSE";

    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        listingType,
        type: propertyType,
        subType,
        city,
        address: address.trim(),
        plotNumber: plotNumber.trim() || null,
        price: Number(price),
        areaSize: Number(areaSize),
        areaUnit,
        areaSqft: Math.round(Number(areaSize) * sqftPerUnit[areaUnit]),
        installmentAvailable: installment,
        readyForPossession: possession,
        bedrooms: bedrooms ? toNumber(bedrooms) : null,
        bathrooms: bathrooms ? toNumber(bathrooms) : null,
        amenities,
        email: email.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || null,
        videoUrl: videoUrl.trim() || null,
        images,
      });
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Could not save the property. Check the fields and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl space-y-8">
      <Section title="Purpose and type">
        <div className="flex gap-2">
          {(["SALE", "RENT"] as const).map((v) => (
            <button type="button" key={v} onClick={() => setListingType(v)} className={chip(listingType === v)}>
              {v === "SALE" ? "Sell" : "Rent"}
            </button>
          ))}
        </div>
        <div className="flex gap-6 border-b">
          {(Object.keys(subTypes) as Tab[]).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => changeTab(t)}
              className={`-mb-px border-b-2 pb-2 text-sm ${
                tab === t ? "border-green-600 font-semibold text-green-700" : "border-transparent text-gray-600"
              }`}
            >
              {tabLabel[t]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {subTypes[tab].map((s) => (
            <button type="button" key={s.value} onClick={() => setSubType(s.value)} className={chip(subType === s.value)}>
              {s.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Location">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>City</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} className={input}>
              <option value="">Select city</option>
              {[
                "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
                "Multan", "Peshawar", "Rahim Yar Khan",
              ].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Plot / house number (optional)</label>
            <input value={plotNumber} onChange={(e) => setPlotNumber(e.target.value)} placeholder="e.g. 45-B" className={input} />
          </div>
        </div>
        <div>
          <label className={label}>Area / address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. DHA Phase 6, Street 12"
            className={input}
          />
        </div>
      </Section>

      <Section title="Price and area">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Price (PKR{listingType === "RENT" ? " / month" : ""})</label>
            <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Area size</label>
            <div className="flex gap-2">
              <input type="number" min={0} value={areaSize} onChange={(e) => setAreaSize(e.target.value)} className={input} />
              <select value={areaUnit} onChange={(e) => setAreaUnit(e.target.value as typeof areaUnit)} className={`${input} w-32`}>
                <option value="MARLA">Marla</option>
                <option value="KANAL">Kanal</option>
                <option value="SQFT">Sq ft</option>
              </select>
            </div>
          </div>
        </div>
        <Toggle title="Installment available" hint="Enable if listing is available on installments" checked={installment} onChange={setInstallment} />
        <Toggle title="Ready for possession" hint="Enable if listing is ready for possession" checked={possession} onChange={setPossession} />
      </Section>

      <Section title="Features and amenities">
        {tab === "HOME" && (
          <>
            <div>
              <label className={label}>Bedrooms</label>
              <div className="flex flex-wrap gap-2">
                {bedOptions.map((b) => (
                  <button type="button" key={b} onClick={() => setBedrooms(bedrooms === b ? "" : b)} className={chip(bedrooms === b)}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={label}>Bathrooms</label>
              <div className="flex flex-wrap gap-2">
                {bathOptions.map((b) => (
                  <button type="button" key={b} onClick={() => setBathrooms(bathrooms === b ? "" : b)} className={chip(bathrooms === b)}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        <div>
          <label className={label}>Amenities</label>
          <div className="flex flex-wrap gap-2">
            {amenityList.map((a) => (
              <button type="button" key={a} onClick={() => toggleAmenity(a)} className={chip(amenities.includes(a))}>
                {a}
              </button>
            ))}
          </div>
        </div>
        <QualityTip text="Add at least 5 amenities" percent={(amenities.length / 5) * 100} />
      </Section>

      <Section title="Title and description">
        <div>
          <label className={label}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="5 Marla house in DHA" className={input} />
        </div>
        <div>
          <label className={label}>Description</label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={input} />
        </div>
      </Section>

      <Section title="Photos and video">
        <ImageUploader value={images} onChange={setImages} />
        <QualityTip
          text={images.length >= 5 ? "Great, you have enough images" : `Add at least ${5 - images.length} more images`}
          percent={(images.length / 5) * 100}
        />
        <div>
          <label className={label}>Video link (optional)</label>
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Upload on YouTube and paste the link here"
            className={input}
          />
        </div>
      </Section>

      <Section title="Contact">
        <div>
          <label className={label}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Mobile</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="03xx xxxxxxx" className={input} />
          </div>
          <div>
            <label className={label}>WhatsApp (optional)</label>
            <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} inputMode="tel" className={input} />
          </div>
        </div>
      </Section>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <button
        disabled={saving}
        className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
      >
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
