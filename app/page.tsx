import Link from "next/link";
import { Home as HomeIcon, Play, ArrowRight } from "lucide-react";
import HeroSearch from "./components/HeroSearch";
import PropertyCard from "./components/PropertyCard";
import Reveal from "./components/Reveal";
import CountUp from "./components/CountUp";
import AnimatedBg from "./components/AnimatedBg";
import { getProperties } from "./lib/api";
import type { Property } from "./types";
import HeroTitle from "./components/HeroTitle";

// always fetch fresh listings from the backend
export const dynamic = "force-dynamic";

export default async function Home() {
  let data: Property[] = [];
  try {
    data = (await getProperties()).data;
  } catch {
    data = []; // backend offline: page still renders
  }
  const stats = [{ icon: HomeIcon, value: String(data.length), label: "Live listings" }];

  return (
    <>
      {/* Poore page ka fixed background */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-900">
        <AnimatedBg />
        {/* readability overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-slate-950/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30" />
        <div className="absolute inset-0 bg-slate-950/40 lg:hidden" />
      </div>

      <div className="space-y-20">
        {/* Hero (full screen) */}
        <section className="flex min-h-[calc(100vh-7rem)] flex-col justify-between pb-8 pt-10">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-indigo-500/30 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                <HomeIcon size={16} /> Find Your Dream Home
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <HeroTitle />
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-4 max-w-md text-lg text-white/80">
                Explore premium properties, expert guidance, and a seamless buying experience.
              </p>
            </Reveal>

            <Reveal delay={0.3} className="mt-8 max-w-5xl">
              <HeroSearch />
            </Reveal>
          </div>

          <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
            <Reveal delay={0.4} className="flex flex-wrap gap-3">
              {stats.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-white/25 bg-white/15 px-5 py-4 text-white backdrop-blur-xl"
                >
                  <Icon size={28} className="text-indigo-300" />
                  <div>
                    <p className="text-xl font-bold leading-none">
                      <CountUp to={Number(value)} />
                    </p>
                    <p className="mt-1 text-sm text-white/80">{label}</p>
                  </div>
                </div>
              ))}
            </Reveal>

            <button
              type="button"
              className="hidden items-center gap-3 rounded-2xl border border-white/25 bg-white/15 p-2 pr-6 text-white backdrop-blur-xl md:flex"
            >
              <img src="/background.png" alt="" className="h-14 w-20 rounded-xl object-cover" />
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600">
                <Play size={14} fill="white" />
              </span>
              <span className="text-sm font-medium">Watch Video</span>
            </button>
          </div>
        </section>

        {/* Featured (glass panel) */}
        <Reveal>
          <section className="rounded-3xl border border-white/20 bg-slate-900/60 p-6 backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Featured properties</h2>
              <Link
                href="/properties"
                className="flex items-center gap-1 text-sm font-medium text-indigo-300 hover:underline"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {data.length === 0 ? (
              <p className="py-10 text-center text-white/70">No properties available right now.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.slice(0, 6).map((p, i) => (
                  <PropertyCard key={p.id} p={p} index={i} />
                ))}
              </div>
            )}
          </section>
        </Reveal>
      </div>
    </>
  );
}