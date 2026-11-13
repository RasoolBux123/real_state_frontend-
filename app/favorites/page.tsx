"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import PropertyCard from "../components/PropertyCard";
import { getFavorites } from "../lib/favoriteApi";
import { useFavorites } from "../store/favoritesStore";
import type { Property } from "../types";

function Favorites() {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const ids = useFavorites((s) => s.ids);

  useEffect(() => {
    getFavorites().then(setItems).finally(() => setLoading(false));
  }, []);

  // an item un-hearted on this page disappears
  const shown = items.filter((p) => ids.includes(p.id) || loading);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Favorites</h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : shown.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <p className="font-semibold">No saved properties yet</p>
          <Link href="/properties" className="mt-3 inline-block font-semibold text-indigo-600 hover:underline">Browse properties</Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => <PropertyCard key={p.id} p={p} index={i} />)}
        </div>
      )}
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <ProtectedRoute message="Log in to see your saved properties.">
      <Favorites />
    </ProtectedRoute>
  );
}
