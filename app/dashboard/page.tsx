"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { deleteMyProperty, getMyProperties } from "../lib/propertyApi";
import { formatPrice } from "../lib/format";
import type { Property } from "../types";

const statusStyles: Record<Property["status"], string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function SellerDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyProperties()
      .then(setProperties)
      .catch(() => setError("Could not load your listings. Please sign in again and retry."))
      .finally(() => setLoading(false));
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this listing permanently?")) return;
    try {
      await deleteMyProperty(id);
      setProperties((list) => list.filter((x) => x.id !== id));
    } catch {
      alert("Could not delete, please try again");
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-7 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Seller workspace</p>
          <h1 className="mt-2 text-3xl font-bold">My properties</h1>
          <p className="mt-2 text-gray-600">Track each listing’s review status and approval.</p>
        </div>
        <Link href="/dashboard/properties/new" className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-500">
          <PlusCircle size={18} /> Add property
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {loading ? <p className="p-8 text-center text-gray-500">Loading your listings...</p>
          : error ? <p className="p-8 text-center text-red-600">{error}</p>
            : properties.length === 0 ? (
              <div className="p-10 text-center">
                <p className="font-semibold">No listings yet</p>
                <p className="mt-1 text-sm text-gray-600">Submit a property to start your seller account.</p>
                <Link href="/dashboard/properties/new" className="mt-4 inline-block font-semibold text-indigo-600 hover:underline">Add your first property</Link>
              </div>
            ) : (
              <ul className="divide-y">
                {properties.map((property) => (
                  <li key={property.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <Link href={`/properties/${property.id}`} className="block truncate font-semibold hover:text-indigo-600">{property.title}</Link>
                      <p className="mt-1 text-sm text-gray-600">{property.city} · {property.address}</p>
                      <p className="mt-1 text-sm font-medium text-indigo-700">{formatPrice(property.price)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[property.status]}`}>
                        {property.status === "PENDING" ? "Awaiting admin approval" : property.status}
                      </span>
                      <button onClick={() => remove(property.id)} aria-label="Delete" className="rounded-lg border p-2 text-red-600 hover:bg-red-50">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
      </div>
    </div>
  );
}
