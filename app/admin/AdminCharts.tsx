"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AdminProperty } from "../types";

const COLORS = { approved: "#22c55e", pending: "#eab308", rejected: "#ef4444", brand: "#818cf8", sky: "#38bdf8" };
const typeLabel: Record<string, string> = { HOUSE: "House", FLAT: "Flat", PLOT: "Plot", COMMERCIAL: "Commercial" };

const tooltipStyle = {
  contentStyle: { background: "#0f172a", border: "1px solid rgba(255,255,255,.15)", borderRadius: 12, color: "#f1f5f9", fontSize: 12 },
  itemStyle: { color: "#f1f5f9" },
  labelStyle: { color: "#94a3b8" },
  cursor: { fill: "rgba(255,255,255,.05)" },
};

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900 p-5">
      <h2 className="font-semibold">{title}</h2>
      {subtitle && <p className="text-xs text-white/50">{subtitle}</p>}
      <div className="mt-4 h-64">{children}</div>
    </section>
  );
}

export default function AdminCharts({ items }: { items: AdminProperty[] }) {
  // 1) status split
  const statusData = [
    { name: "Enabled", value: items.filter((p) => p.status === "APPROVED").length, color: COLORS.approved },
    { name: "Pending", value: items.filter((p) => p.status === "PENDING").length, color: COLORS.pending },
    { name: "Disabled", value: items.filter((p) => p.status === "REJECTED").length, color: COLORS.rejected },
  ].filter((d) => d.value > 0);

  // 2) listings posted in the last 6 months
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString("en", { month: "short" }), listings: 0 };
  });
  items.forEach((p) => {
    const d = new Date(p.createdAt);
    const m = months.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (m) m.listings += 1;
  });

  // 3) by property type, split sale / rent
  const typeData = Object.keys(typeLabel).map((t) => ({
    name: typeLabel[t],
    Sale: items.filter((p) => p.type === t && p.listingType === "SALE").length,
    Rent: items.filter((p) => p.type === t && p.listingType === "RENT").length,
  }));

  // 4) top cities
  const cityCount = new Map<string, number>();
  items.forEach((p) => cityCount.set(p.city, (cityCount.get(p.city) ?? 0) + 1));
  const cityData = [...cityCount.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const axis = { stroke: "#64748b", fontSize: 12, tickLine: false, axisLine: false } as const;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Listing status" subtitle="Enabled, pending and disabled">
        {statusData.length === 0 ? (
          <p className="pt-20 text-center text-sm text-white/50">No listings yet.</p>
        ) : (
          <ResponsiveContainer>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3} stroke="none">
                {statusData.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#cbd5e1" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card title="Listings posted" subtitle="Last 6 months">
        <ResponsiveContainer>
          <AreaChart data={months} margin={{ left: -20, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.brand} stopOpacity={0.5} />
                <stop offset="100%" stopColor={COLORS.brand} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
            <XAxis dataKey="label" {...axis} />
            <YAxis allowDecimals={false} {...axis} />
            <Tooltip {...tooltipStyle} />
            <Area type="monotone" dataKey="listings" name="Listings" stroke={COLORS.brand} strokeWidth={2.5} fill="url(#g1)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Property types" subtitle="For sale vs for rent">
        <ResponsiveContainer>
          <BarChart data={typeData} margin={{ left: -20, right: 8, top: 8 }}>
            <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
            <XAxis dataKey="name" {...axis} />
            <YAxis allowDecimals={false} {...axis} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#cbd5e1" }} />
            <Bar dataKey="Sale" fill={COLORS.brand} radius={[6, 6, 0, 0]} />
            <Bar dataKey="Rent" fill={COLORS.sky} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Top cities" subtitle="Where most listings are">
        {cityData.length === 0 ? (
          <p className="pt-20 text-center text-sm text-white/50">No listings yet.</p>
        ) : (
          <ResponsiveContainer>
            <BarChart data={cityData} layout="vertical" margin={{ left: 10, right: 16, top: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,.07)" horizontal={false} />
              <XAxis type="number" allowDecimals={false} {...axis} />
              <YAxis type="category" dataKey="name" width={80} {...axis} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" name="Listings" fill={COLORS.approved} radius={[0, 6, 6, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}