"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, PlusCircle, Search, Trash2 } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import StatusToggle from "../../components/StatusToggle";
import { deleteAdminProperty, getAdminProperties, setPropertyStatus } from "../../lib/adminApi";
import { formatDate, formatPrice } from "../../lib/format";
import { confirmDelete, popupError, toast } from "../../lib/popup";
import { AdminProperty, Property } from "../../types";

type Filter = "ALL" | Property["status"];

const tabs: { key: Filter; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
];

const iconBtn =
  "rounded-lg border border-white/15 p-2 transition hover:bg-white/10 disabled:opacity-40";

export default function AdminListings() {
  const [items, setItems] = useState<AdminProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    getAdminProperties()
      .then(setItems)
      .catch(() => setError("Could not load listings"))
      .finally(() => setLoading(false));
  }, []);

  const count = (k: Filter) =>
    k === "ALL" ? items.length : items.filter((p) => p.status === k).length;

  const q = query.trim().toLowerCase();
  const rows = items.filter(
    (p) =>
      (filter === "ALL" || p.status === filter) &&
      (!q ||
        p.title.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q))
  );

  async function changeStatus(id: string, status: Property["status"]) {
    setBusy(id);
    try {
      await setPropertyStatus(id, status);
      setItems((list) => list.map((p) => (p.id === id ? { ...p, status } : p)));
      toast(status === "APPROVED" ? "Listing enabled" : "Listing disabled");
    } catch {
      popupError("Could not update status, please try again");
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!(await confirmDelete("Delete this listing?", "It will be removed permanently with its photos."))) return;
    setBusy(id);
    try {
      await deleteAdminProperty(id);
      setItems((list) => list.filter((p) => p.id !== id));
      toast("Listing deleted");
    } catch {
      popupError("Could not delete, please try again");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === t.key
                  ? "bg-indigo-600 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/15"
              }`}
            >
              {t.label} <span className="ml-1 opacity-70">{count(t.key)}</span>
            </button>
          ))}
        </div>

        <Link href="/admin/listings/new" className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold hover:bg-indigo-500">
          <PlusCircle size={16} /> Add property
        </Link>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, city or seller"
            className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-white/40 focus:border-indigo-400"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900">
        {loading ? (
          <p className="p-10 text-center text-sm text-white/60">Loading...</p>
        ) : error ? (
          <p className="p-10 text-center text-sm text-red-300">{error}</p>
        ) : rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-white/50">No listings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase text-white/50">
                <tr>
                  <th className="px-5 py-3">Property</th>
                  <th className="px-5 py-3">Seller</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Posted</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {rows.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images[0] ?? "/background.png"} alt="" className="h-12 w-16 rounded-md object-cover" />
                        <div>
                          <p className="line-clamp-1 font-medium">{p.title}</p>
                          <p className="text-xs text-white/50">
                            {p.city} · For {p.listingType === "SALE" ? "Sale" : "Rent"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p>{p.sellerName}</p>
                      <p className="text-xs text-white/50">{p.sellerEmail}</p>
                    </td>
                    <td className="px-5 py-3 font-medium">{formatPrice(p.price)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-3 text-white/60">{formatDate(p.createdAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/properties/${p.id}`} title="View" className={iconBtn}>
                          <Eye size={15} />
                        </Link>

                        <StatusToggle
                          status={p.status}
                          busy={busy === p.id}
                          onChange={(next) => changeStatus(p.id, next)}
                        />

                        <button
                          title="Delete"
                          disabled={busy === p.id}
                          onClick={() => remove(p.id)}
                          className={`${iconBtn} text-red-300`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}