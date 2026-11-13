"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import PropertyCard from "../components/PropertyCard";
import SearchSuggest from "../components/SearchSuggest";
import { getProperties, PAGE_SIZE } from "../lib/api";
import type { Property } from "../types";

const sel = "w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500";

export default function PropertiesView() {
  const router = useRouter();
  const params = useSearchParams();
  const key = params.toString();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [city, setCity] = useState(params.get("city") ?? "");
  const [type, setType] = useState(params.get("type") ?? "");
  const [listingType, setListingType] = useState(params.get("listingType") ?? "");
  const [minPrice, setMinPrice] = useState(params.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") ?? "");

  const [items, setItems] = useState<Property[]>([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // keep inputs in sync when the URL changes (navbar links, back button)
  useEffect(() => {
    setQ(params.get("q") ?? "");
    setCity(params.get("city") ?? "");
    setType(params.get("type") ?? "");
    setListingType(params.get("listingType") ?? "");
    setMinPrice(params.get("minPrice") ?? "");
    setMaxPrice(params.get("maxPrice") ?? "");
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  // depends on the query-string TEXT (stable), not the params object (new every render)
  const fetchPage = useCallback(
    async (p: number) => {
      const sp = new URLSearchParams(key);
      const res = await getProperties({
        q: sp.get("q") ?? undefined,
        city: sp.get("city") ?? undefined,
        type: sp.get("type") ?? undefined,
        listingType: sp.get("listingType") ?? undefined,
        minPrice: sp.get("minPrice") ?? undefined,
        maxPrice: sp.get("maxPrice") ?? undefined,
        page: String(p),
      });
      return res.data;
    },
    [key]
  );

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchPage(1)
      .then((d) => {
        setItems(d);
        setPage(1);
        setMore(d.length === PAGE_SIZE);
      })
      .catch(() => setError("Could not load properties. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [fetchPage]);

  async function loadMore() {
    const d = await fetchPage(page + 1);
    setItems((list) => [...list, ...d]);
    setPage(page + 1);
    setMore(d.length === PAGE_SIZE);
  }

  const apply = useCallback(
    (override?: { q?: string }) => {
      const next = new URLSearchParams();
      const values = { q: override?.q ?? q, city, type, listingType, minPrice, maxPrice };
      Object.entries(values).forEach(([k, v]) => v && next.set(k, v));
      router.push(next.toString() ? `/properties?${next}` : "/properties");
    },
    [q, city, type, listingType, minPrice, maxPrice, router]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Properties</h1>
        <p className="mt-1 text-gray-600">Browse approved listings. No account needed.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply();
        }}
        className="space-y-3 rounded-2xl border bg-white p-4 shadow-sm"
      >
        <div className="flex gap-3">
          <SearchSuggest
            value={q}
            onChange={setQ}
            onSubmit={() => apply()}
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-indigo-500"
          />
          <button className="flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-6 font-semibold text-white hover:bg-indigo-500">
            <Search size={18} /> Search
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <select value={listingType} onChange={(e) => setListingType(e.target.value)} className={sel}>
            <option value="">Buy or Rent</option>
            <option value="SALE">For Sale</option>
            <option value="RENT">For Rent</option>
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className={sel}>
            <option value="">Any type</option>
            <option value="HOUSE">House</option>
            <option value="FLAT">Flat</option>
            <option value="PLOT">Plot</option>
            <option value="COMMERCIAL">Commercial</option>
          </select>
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className={sel} />
          <input value={minPrice} onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ""))} placeholder="Min price" className={sel} />
          <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))} placeholder="Max price" className={sel} />
        </div>
        <p className="flex items-center gap-1 text-xs text-gray-400">
          <SlidersHorizontal size={12} /> Prices in PKR
        </p>
      </form>

      {loading ? (
        <p className="py-16 text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="rounded-xl bg-red-50 p-6 text-center text-red-700">{error}</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border bg-white p-12 text-center text-gray-500">No properties match your search.</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <PropertyCard key={p.id} p={p} index={i} />
            ))}
          </div>
          {more && (
            <div className="text-center">
              <button onClick={loadMore} className="rounded-full border border-indigo-600 px-8 py-3 font-semibold text-indigo-600 hover:bg-indigo-50">
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
