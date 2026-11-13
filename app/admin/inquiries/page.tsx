"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { getAdminInquiries } from "../../lib/adminApi";
import { formatDate } from "../../lib/format";
import type { AdminInquiry } from "../../types";

type Tab = "ALL" | "INQUIRY" | "VISIT" | "CONTACT";

const tabs: { key: Tab; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "INQUIRY", label: "Property inquiries" },
  { key: "VISIT", label: "Visit requests" },
  { key: "CONTACT", label: "Contact page" },
];

const badge: Record<string, string> = {
  INQUIRY: "bg-purple-500/20 text-purple-200",
  VISIT: "bg-sky-500/20 text-sky-200",
  MESSAGE: "bg-indigo-500/20 text-indigo-200",
  CALLBACK: "bg-yellow-500/20 text-yellow-200",
  VIEWING: "bg-green-500/20 text-green-200",
};

const btn = "flex items-center gap-1 rounded-lg border border-white/15 px-2.5 py-1.5 text-xs hover:bg-white/10";

export default function AdminInquiries() {
  const [items, setItems] = useState<AdminInquiry[]>([]);
  const [tab, setTab] = useState<Tab>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminInquiries()
      .then(setItems)
      .catch(() => setError("Could not load inquiries"))
      .finally(() => setLoading(false));
  }, []);

  const isContact = (i: AdminInquiry) => i.kind === "MESSAGE" || i.kind === "CALLBACK" || i.kind === "VIEWING";
  const rows = items.filter((i) => tab === "ALL" || (tab === "CONTACT" ? isContact(i) : i.kind === tab));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${tab === t.key ? "bg-indigo-600" : "bg-white/10 text-white/70 hover:bg-white/15"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900">
        {loading ? (
          <p className="p-10 text-center text-sm text-white/60">Loading...</p>
        ) : error ? (
          <p className="p-10 text-center text-sm text-red-300">{error}</p>
        ) : rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-white/50">Nothing here yet.</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {rows.map((i) => {
              const wa = i.phone ? `https://wa.me/${i.phone.replace(/\D/g, "")}` : null;
              return (
                <li key={i.id} className="space-y-2 px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`rounded-full px-2.5 py-1 font-semibold ${badge[i.kind] ?? "bg-white/10"}`}>{i.kind}</span>
                    <span className="text-white/50">{formatDate(i.createdAt)}</span>
                    {i.visitDate && <span className="text-sky-200">Visit: {new Date(i.visitDate).toLocaleString()}</span>}
                  </div>
                  <p className="text-sm">{i.message}</p>
                  <p className="text-xs text-white/60">
                    {i.buyerName} · {i.buyerEmail}
                    {i.phone && <> · {i.phone}</>} ·{" "}
                    {i.propertyId ? (
                      <Link href={`/properties/${i.propertyId}`} className="text-indigo-300 hover:underline">{i.propertyTitle}</Link>
                    ) : (
                      i.propertyTitle
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a className={btn} href={`mailto:${i.buyerEmail}`}><Mail size={13} /> Reply by mail</a>
                    {i.phone && <a className={btn} href={`tel:${i.phone}`}><Phone size={13} /> Call</a>}
                    {wa && <a className={btn} href={wa} target="_blank" rel="noopener noreferrer"><MessageCircle size={13} /> WhatsApp</a>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
