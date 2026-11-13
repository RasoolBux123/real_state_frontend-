"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Bath, Bed, Check, Heart, MapPin, Ruler, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import ImageGallery from "../../components/ImageGallery";
import ContactButtons from "../../components/ContactButtons";
import InquiryForm from "../../components/InquiryForm";
import StatusBadge from "../../components/StatusBadge";
import { getProperty } from "../../lib/api";
import { formatPrice } from "../../lib/format";
import { useAuthStore } from "../../store/authStore";
import { useAuthModal } from "../../store/authModalStore";
import { useFavorites } from "../../store/favoritesStore";
import type { Property } from "../../types";

const typeName = { HOUSE: "House", FLAT: "Flat", PLOT: "Plot", COMMERCIAL: "Commercial" } as const;

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const openModal = useAuthModal((s) => s.openModal);
  const liked = useFavorites((s) => s.ids.includes(id));
  const toggle = useFavorites((s) => s.toggle);

  const [p, setP] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getProperty(id).then(setP).finally(() => setLoading(false));
  }, [id, user?.id]);

  if (loading) return <p className="py-20 text-center text-gray-500">Loading...</p>;
  if (!p)
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Property not found</h1>
        <p className="mt-2 text-gray-600">It may have been removed or is not approved yet.</p>
        <Link href="/properties" className="mt-4 inline-block font-semibold text-indigo-600 hover:underline">Browse properties</Link>
      </div>
    );

  const isOwner = !!user && String(p.sellerId) === String(user.id);

  async function share() {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: p!.title, url }).catch(() => undefined);
    else {
      await navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Link href="/properties" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline">
        <ArrowLeft size={15} /> All properties
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ImageGallery images={p.images} title={p.title} />

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                    For {p.listingType === "SALE" ? "Sale" : "Rent"}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">{typeName[p.type]}</span>
                  {p.status !== "APPROVED" && <StatusBadge status={p.status} />}
                </div>
                <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{p.title}</h1>
                <p className="mt-2 flex items-center gap-1 text-gray-500">
                  <MapPin size={16} /> {p.address}, {p.city}
                </p>
              </div>
              <p className="text-2xl font-bold text-indigo-600">
                {formatPrice(p.price)}
                {p.listingType === "RENT" && <span className="text-sm font-medium text-gray-500"> / month</span>}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-5 sm:grid-cols-4">
              {!!p.bedrooms && <Spec icon={<Bed size={18} />} label="Bedrooms" value={p.bedrooms} />}
              {!!p.bathrooms && <Spec icon={<Bath size={18} />} label="Bathrooms" value={p.bathrooms} />}
              <Spec icon={<Ruler size={18} />} label="Area" value={`${p.areaSqft} sqft`} />
              {p.areaSize && p.areaUnit && p.areaUnit !== "SQFT" && (
                <Spec icon={<Ruler size={18} />} label="Size" value={`${p.areaSize} ${p.areaUnit.toLowerCase()}`} />
              )}
            </div>

            {(p.installmentAvailable || p.readyForPossession) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.installmentAvailable && <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">Installments available</span>}
                {p.readyForPossession && <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">Ready for possession</span>}
              </div>
            )}
          </div>

          {p.description && (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="mt-3 whitespace-pre-line text-gray-700">{p.description}</p>
            </div>
          )}

          {!!p.amenities?.length && (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Features & amenities</h2>
              <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {p.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check size={15} className="text-green-600" /> {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          <div className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Contact us about this property</h2>
            <ContactButtons title={p.title} propertyId={p.id} />
            <div className="flex gap-2">
              <button
                onClick={() => (user ? toggle(p.id) : openModal("login"))}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium hover:bg-gray-50"
              >
                <Heart size={16} className={liked ? "fill-red-500 text-red-500" : ""} /> {liked ? "Saved" : "Save"}
              </button>
              <button onClick={share} className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium hover:bg-gray-50">
                <Share2 size={16} /> {copied ? "Link copied" : "Share"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            {isOwner ? (
              <p className="text-sm text-gray-600">This is your listing. Buyers' messages and visit requests appear in your notifications.</p>
            ) : p.status !== "APPROVED" ? (
              <p className="text-sm text-gray-600">This listing is not public yet.</p>
            ) : (
              <InquiryForm propertyId={p.id} />
            )}
          </div>
        </aside>
      </div>
    </motion.div>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
      <span className="text-indigo-600">{icon}</span>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
