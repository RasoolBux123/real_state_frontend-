"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import PropertyForm, { type PropertyPayload } from "../../../components/PropertyForm";
import { createProperty } from "../../../lib/propertyApi";

// Admin listings are published immediately (backend sets status = approved for admins)
export default function AdminAddProperty() {
  const [done, setDone] = useState<string | null>(null);

  async function submit(payload: PropertyPayload) {
    const created = await createProperty(payload);
    setDone(String(created.id));
  }

  return (
    <div className="space-y-5">
      <Link href="/admin/listings" className="inline-flex items-center gap-1 text-sm text-indigo-300 hover:underline">
        <ArrowLeft size={15} /> Back to listings
      </Link>

      {done ? (
        <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8">
          <h2 className="text-xl font-semibold text-green-200">Property published</h2>
          <p className="mt-1 text-sm text-green-100/80">It is now visible on the public site.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/properties/${done}`} className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500">View on site</Link>
            <button onClick={() => setDone(null)} className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">Add another</button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-5 text-gray-900 sm:p-8">
          <PropertyForm onSubmit={submit} submitLabel="Publish property" />
        </div>
      )}
    </div>
  );
}
