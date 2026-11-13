"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  MessageSquare,
} from "lucide-react";
import { getAdminProperties, getAdminStats, setPropertyStatus } from "../lib/adminApi";
import { formatPrice } from "../lib/format";
import { AdminProperty, AdminStats, Property } from "../types";
import StatusToggle from "../components/StatusToggle";
import { popupError, toast } from "../lib/popup";
import AdminCharts from "./AdminCharts";
const cards = (s: AdminStats) => [
  { label: "Total listings", value: s.totalListings, icon: Building2, tone: "bg-indigo-500/15 text-indigo-300" },
  { label: "Pending approval", value: s.pending, icon: Clock, tone: "bg-yellow-500/15 text-yellow-300" },
  { label: "Approved", value: s.approved, icon: CheckCircle2, tone: "bg-green-500/15 text-green-300" },
  { label: "Rejected", value: s.rejected, icon: XCircle, tone: "bg-red-500/15 text-red-300" },
  { label: "Users", value: s.users, icon: Users, tone: "bg-sky-500/15 text-sky-300" },
  { label: "Inquiries", value: s.inquiries, icon: MessageSquare, tone: "bg-purple-500/15 text-purple-300" },
];

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pending, setPending] = useState<AdminProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [all, setAll] = useState<AdminProperty[]>([]);
  const load = useCallback(async () => {
    try {
      const [s, list] = await Promise.all([getAdminStats(), getAdminProperties()]);
setStats(s);
setAll(list);
setPending(list.filter((p) => p.status === "PENDING").slice(0, 5));
    } catch {
      setError("Could not load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function decide(id: string, status: Property["status"]) {
    setBusy(id);
    try {
      await setPropertyStatus(id, status);
      toast(status === "APPROVED" ? "Listing enabled" : "Listing disabled");
      await load();
    } catch {
      popupError("Action failed, please try again");
    } finally {
      setBusy(null);
    }
  }

  if (loading) return <p className="text-white/60">Loading...</p>;
  if (error || !stats) return <p className="text-red-300">{error || "No data"}</p>;

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {cards(stats).map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
              <Icon size={20} />
            </span>
            <p className="mt-4 text-3xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-white/60">{label}</p>
          </div>
        ))}
      </div>

      {/* Pending approvals */}
      <section className="rounded-2xl border border-white/10 bg-slate-900">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        {/* Charts */}
        <AdminCharts items={all} />
          <h2 className="font-semibold">Pending approvals</h2>
          <Link href="/admin/listings" className="text-sm font-medium text-indigo-300 hover:underline">
            View all listings
          </Link>
        </div>

        {pending.length === 0 ? (
          <p className="p-10 text-center text-sm text-white/50">No listings waiting for approval.</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {pending.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0] ?? "/background.png"} alt="" className="h-14 w-20 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 font-medium">{p.title}</p>
                  <p className="text-xs text-white/50">
                    {p.city} · by {p.sellerName} · {formatPrice(p.price)}
                  </p>
                </div>
                <StatusToggle status={p.status} busy={busy === p.id} onChange={(next) => decide(p.id, next)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}