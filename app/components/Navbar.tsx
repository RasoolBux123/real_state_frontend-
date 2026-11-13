"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Home,
  Search,
  Heart,
  Bell,
  ChevronDown,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useAuthModal } from "../store/authModalStore";
import { useFavorites } from "../store/favoritesStore";
import NotificationBell from "./NotificationBell";

const propertyLinks = [
  { label: "All Properties", href: "/properties" },
  { label: "For Sale", href: "/properties?listingType=SALE" },
  { label: "For Rent", href: "/properties?listingType=RENT" },
  { label: "Houses", href: "/properties?type=HOUSE" },
  { label: "Flats", href: "/properties?type=FLAT" },
  { label: "Plots", href: "/properties?type=PLOT" },
  { label: "Commercial", href: "/properties?type=COMMERCIAL" },
];

const simpleLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const SELL_PATH = "/dashboard/properties/new";
const FAV_PATH = "/favorites";

const item =
  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-[15px] text-white/90 hover:bg-white/10";
const iconBtn =
  "relative flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const openModal = useAuthModal((s) => s.openModal);

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState<"props" | "user" | null>(null);
  const [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => setMounted(true), []);

  // load / clear the heart list when the user logs in / out
  const loadFavorites = useFavorites((f) => f.load);
  const clearFavorites = useFavorites((f) => f.clear);
  useEffect(() => {
    if (user) loadFavorites();
    else clearFavorites();
  }, [user, loadFavorites, clearFavorites]);

  // page change par dropdowns band
  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  // bahar click par dropdown band
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const pill = (active: boolean) =>
    `rounded-full px-5 py-2.5 text-base font-medium transition ${
      active ? "bg-white/90 text-indigo-600 shadow" : "text-white/90 hover:bg-white/10"
    }`;

  function handleLogout() {
    logout();
    setOpen(null);
    setMobile(false);
    router.push("/");
  }

  // Login / Sign up: popup kholo, page wahi rahe
  function openAuth(e: React.MouseEvent, mode: "login" | "register") {
    e.preventDefault();
    setOpen(null);
    setMobile(false);
    openModal(mode);
  }

  // Sell Property / Favorites: login nahi to popup, login ke baad wahan jao
  function requireLogin(e: React.MouseEvent, target: string) {
    if (user) return; // login hai to normal link chale
    e.preventDefault();
    setOpen(null);
    setMobile(false);
    openModal("login", target);
  }

  return (
    <header ref={ref} className="fixed inset-x-0 top-6 z-50 px-4">
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/25 bg-slate-900/60 px-6 py-3.5 shadow-lg backdrop-blur-xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white">
          <Home size={30} className="text-indigo-400" />
          <span>
            Real <span className="text-indigo-300">Estate</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-2 xl:flex">
          <Link href="/" className={pill(isActive("/"))}>
            Home
          </Link>

          <div className="relative">
            <button
              onClick={() => setOpen(open === "props" ? null : "props")}
              className={`${pill(isActive("/properties"))} flex items-center gap-1.5`}
            >
              Properties
              <ChevronDown
                size={16}
                className={`transition ${open === "props" ? "rotate-180" : ""}`}
              />
            </button>

            {open === "props" && (
              <div className="absolute left-0 top-full mt-3 w-56 rounded-2xl border border-white/20 bg-slate-900/90 p-2 shadow-xl backdrop-blur-xl">
                {propertyLinks.map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setOpen(null)} className={item}>
                    {l.label}
                  </Link>
                ))}
                <hr className="my-2 border-white/10" />
                <Link
                  href={SELL_PATH}
                  onClick={(e) => requireLogin(e, SELL_PATH)}
                  className={`${item} font-medium text-indigo-300`}
                >
                  <PlusCircle size={16} /> Sell Property
                </Link>
              </div>
            )}
          </div>

          {simpleLinks.map((l) => (
            <Link key={l.href} href={l.href} className={pill(isActive(l.href))}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href={SELL_PATH}
            onClick={(e) => requireLogin(e, SELL_PATH)}
            className="hidden items-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 sm:flex"
          >
            <PlusCircle size={17} /> Add Property
          </Link>
          <Link href="/properties" aria-label="Search properties" className={iconBtn}>
            <Search size={20} />
          </Link>
          <Link
            href={FAV_PATH}
            onClick={(e) => requireLogin(e, FAV_PATH)}
            aria-label="Favorites"
            className={iconBtn}
          >
            <Heart size={20} />
          </Link>

          {!mounted ? (
            <div className="h-12 w-28" />
          ) : user ? (
            <>
              <NotificationBell className={iconBtn} />

              <div className="relative">
                <button
                  onClick={() => setOpen(open === "user" ? null : "user")}
                  className="flex items-center gap-1.5 text-white"
                  aria-label="Account menu"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 text-lg font-semibold">
                   {user.name?.[0]?.toUpperCase() ?? "U"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition ${open === "user" ? "rotate-180" : ""}`}
                  />
                </button>

                {open === "user" && (
                  <div className="absolute right-0 top-full mt-3 w-64 rounded-2xl border border-white/20 bg-slate-900/90 p-2 shadow-xl backdrop-blur-xl">
                    <div className="px-4 py-2">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-white/60">{user.email}</p>
                      <span className="mt-2 inline-block rounded-full bg-indigo-500/30 px-2 py-0.5 text-xs font-medium text-indigo-200">
                        {user.role}
                      </span>
                    </div>
                    <hr className="my-1 border-white/10" />

                                        {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setOpen(null)}
                        className={`${item} font-medium text-indigo-300`}
                      >
                        <LayoutDashboard size={16} /> Admin Panel
                      </Link>
                    )}

                    {(user.role === "SELLER" || user.role === "USER") && (
                      <>
                        <Link href="/dashboard" onClick={() => setOpen(null)} className={item}>
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                        <Link href={SELL_PATH} onClick={() => setOpen(null)} className={item}>
                          <PlusCircle size={16} /> Add Property
                        </Link>
                      </>
                    )}
                    <Link href={FAV_PATH} onClick={() => setOpen(null)} className={item}>
                      <Heart size={16} /> Favorites
                    </Link>

                    <hr className="my-1 border-white/10" />
                    <button
                      onClick={handleLogout}
                      className={`${item} w-full text-red-300 hover:bg-red-500/10`}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                onClick={(e) => openAuth(e, "login")}
                className="rounded-full px-5 py-2.5 text-base font-medium text-white/90 hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={(e) => openAuth(e, "register")}
                className="rounded-full bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-500"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobile((m) => !m)}
            aria-label="Menu"
            className={`${iconBtn} xl:hidden`}
          >
            {mobile ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobile && (
          <div className="absolute left-0 right-0 top-full mt-3 space-y-1 rounded-3xl border border-white/20 bg-slate-900/95 p-4 shadow-xl backdrop-blur-xl xl:hidden">
            <Link href="/" className={item}>Home</Link>

            <p className="px-4 pt-2 text-xs font-semibold uppercase text-white/40">Properties</p>
            {propertyLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobile(false)} className={item}>
                {l.label}
              </Link>
            ))}

            <hr className="my-2 border-white/10" />
            {simpleLinks.map((l) => (
              <Link key={l.href} href={l.href} className={item}>
                {l.label}
              </Link>
            ))}
            <Link
              href={SELL_PATH}
              onClick={(e) => requireLogin(e, SELL_PATH)}
              className={`${item} font-medium text-indigo-300`}
            >
              <PlusCircle size={16} /> Sell Property
            </Link>

            <hr className="my-2 border-white/10" />
            {mounted && user ? (
              <button onClick={handleLogout} className={`${item} w-full text-red-300`}>
                <LogOut size={16} /> Logout ({(user.name ?? "").split(" ")[0]})
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={(e) => openAuth(e, "login")}
                  className="flex-1 rounded-full border border-white/30 py-2.5 text-center text-base text-white"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={(e) => openAuth(e, "register")}
                  className="flex-1 rounded-full bg-indigo-600 py-2.5 text-center text-base text-white"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
