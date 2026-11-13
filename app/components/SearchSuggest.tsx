"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, MapPin, Search } from "lucide-react";
import { getSuggestions } from "../lib/suggestApi";
import type { Suggestion } from "../types";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string; // input classes
  dark?: boolean; // dropdown colours
};

// Search box with suggestions while typing (cities, areas, property titles)
export default function SearchSuggest({ value, onChange, onSubmit, placeholder, className = "", dark }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const skip = useRef(false);

  useEffect(() => {
    if (skip.current) {
      skip.current = false;
      return;
    }
    const q = value.trim();
    if (q.length < 2) {
      setItems([]);
      return;
    }
    const t = setTimeout(async () => {
      setItems(await getSuggestions(q));
      setOpen(true);
    }, 250);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function pick(s: Suggestion) {
    setOpen(false);
    if (s.type === "property" && s.id) {
      router.push(`/properties/${s.id}`);
      return;
    }
    skip.current = true;
    onChange(s.value);
    setTimeout(() => onSubmit?.(), 0);
  }

  return (
    <div ref={box} className="relative w-full">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => items.length && setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setOpen(false);
          }
        }}
        placeholder={placeholder ?? "Search city, area or property"}
        autoComplete="off"
        className={className}
      />
      {open && items.length > 0 && (
        <ul
          className={`absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border shadow-xl ${
            dark ? "border-white/20 bg-slate-900/95 text-white backdrop-blur-xl" : "border-gray-200 bg-white text-gray-800"
          }`}
        >
          {items.map((s, i) => (
            <li key={`${s.type}-${s.value}-${i}`}>
              <button
                type="button"
                onClick={() => pick(s)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm ${
                  dark ? "hover:bg-white/10" : "hover:bg-gray-50"
                }`}
              >
                {s.type === "property" ? <Building2 size={15} /> : s.type === "city" ? <MapPin size={15} /> : <Search size={15} />}
                <span className="flex-1 truncate">{s.label}</span>
                <span className="text-xs uppercase opacity-50">{s.type}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
