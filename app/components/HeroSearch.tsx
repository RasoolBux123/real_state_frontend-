"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Home, CircleDollarSign, ChevronDown, Search, type LucideIcon } from "lucide-react";
import SearchSuggest from "./SearchSuggest";

type Option = { label: string; value: string };

const cities: Option[] = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan"].map(
  (c) => ({ label: c, value: c })
);

const types: Option[] = [
  { label: "House", value: "HOUSE" },
  { label: "Flat", value: "FLAT" },
  { label: "Plot", value: "PLOT" },
  { label: "Commercial", value: "COMMERCIAL" },
];

// value format: "min-max" (PKR)
const budgets: Option[] = [
  { label: "Under 50 Lakh", value: "0-5000000" },
  { label: "50 Lakh to 1 Crore", value: "5000000-10000000" },
  { label: "1 to 2 Crore", value: "10000000-20000000" },
  { label: "2 to 5 Crore", value: "20000000-50000000" },
  { label: "5 Crore+", value: "50000000-" },
];

function Field({
  icon: Icon,
  label,
  placeholder,
  value,
  onChange,
  options,
}: {
  icon: LucideIcon;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}) {
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative flex flex-1 items-center gap-3 px-4 py-3">
      <Icon size={22} className="shrink-0 text-indigo-300" />
      <div className="min-w-0 flex-1 text-left">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="truncate text-sm text-white/70">{selected ? selected.label : placeholder}</p>
      </div>
      <ChevronDown size={16} className="shrink-0 text-white/70" />

      {/* native select, invisible, poore field par */}
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function HeroSearch() {
  const router = useRouter();
  const [kw, setKw] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (kw.trim()) q.set("q", kw.trim());
    if (city) q.set("city", city);
    if (type) q.set("type", type);
    if (budget) {
      const [min, max] = budget.split("-");
      if (min && min !== "0") q.set("minPrice", min);
      if (max) q.set("maxPrice", max);
    }
    const qs = q.toString();
    router.push(qs ? `/properties?${qs}` : "/properties");
  }

  function submitNow() {
    // used when a suggestion is picked: search immediately
    const q = new URLSearchParams();
    if (kw.trim()) q.set("q", kw.trim());
    router.push(`/properties?${q}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-1 rounded-3xl border border-white/30 bg-white/15 p-2 backdrop-blur-xl lg:flex-row lg:items-center"
    >
      <div className="flex flex-[1.3] items-center gap-3 px-4 py-3">
        <Search size={22} className="shrink-0 text-indigo-300" />
        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm font-semibold text-white">Search</p>
          <SearchSuggest
            dark
            value={kw}
            onChange={setKw}
            onSubmit={submitNow}
            placeholder="City or area"
            className="w-full bg-transparent text-sm text-white placeholder-white/60 outline-none"
          />
        </div>
      </div>
      <div className="hidden h-10 w-px bg-white/25 lg:block" />
      <Field
        icon={MapPin}
        label="Location"
        placeholder="Select a city"
        value={city}
        onChange={setCity}
        options={cities}
      />
      <div className="hidden h-10 w-px bg-white/25 lg:block" />
      <Field
        icon={Home}
        label="Property Type"
        placeholder="Any Type"
        value={type}
        onChange={setType}
        options={types}
      />
      <div className="hidden h-10 w-px bg-white/25 lg:block" />
      <Field
        icon={CircleDollarSign}
        label="Budget"
        placeholder="Any Budget"
        value={budget}
        onChange={setBudget}
        options={budgets}
      />

      <button className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-indigo-500">
        <Search size={20} /> Search
      </button>
    </form>
  );
}