"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  LayoutDashboard,
  Building2,
  Users,
  MessageSquare,
  PlusCircle,
  Globe,
  LogOut,
  Menu,
  ShieldAlert,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useAuthModal } from "../store/authModalStore";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/listings", label: "Listings", icon: Building2 },
  { href: "/admin/listings/new", label: "Add property", icon: PlusCircle },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
];

const titles: Record<string, string> = {
  "/admin": "Overview",
  "/admin/listings": "Listings",
  "/admin/listings/new": "Add property",
  "/admin/users": "Users",
  "/admin/inquiries": "Inquiries",
};

const screen = "flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const openModal = useAuthModal((s) => s.openModal);

  const [mounted, setMounted] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setSidebar(false), [pathname]);

  if (!mounted) {
    return (
      <div className={screen}>
        <p className="text-white/60">Loading...</p>
      </div>
    );
  }

  // login nahi
  if (!user) {
    return (
      <div className={screen}>
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-8 text-center">
          <ShieldAlert size={36} className="mx-auto text-indigo-300" />
          <h1 className="mt-4 text-xl font-bold">Admin login required</h1>
          <p className="mt-2 text-sm text-white/60">Log in with an admin account to continue.</p>
          <button
            onClick={() => openModal("login", pathname)}
            className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500"
          >
            Log in
          </button>
          <Link href="/" className="mt-4 block text-sm text-white/60 hover:text-white">
            Back to website
          </Link>
        </div>
      </div>
    );
  }

  // login hai lekin admin nahi
  if (user.role !== "ADMIN") {
    return (
      <div className={screen}>
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-8 text-center">
          <ShieldAlert size={36} className="mx-auto text-red-300" />
          <h1 className="mt-4 text-xl font-bold">Access denied</h1>
          <p className="mt-2 text-sm text-white/60">This area is only for administrators.</p>
          <Link
            href="/"
            className="mt-6 block rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500"
          >
            Back to website
          </Link>
        </div>
      </div>
    );
  }

  const isActive = (href: string) =>
    href === "/admin" || href === "/admin/listings" ? pathname === href : pathname.startsWith(href);

  const link = (active: boolean) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      active ? "bg-indigo-600 text-white shadow" : "text-white/70 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* mobile backdrop */}
      {sidebar && (
        <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setSidebar(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-slate-900 transition-transform md:translate-x-0 ${
          sidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
          <Home size={24} className="text-indigo-400" />
          <span className="text-lg font-bold">
            Real <span className="text-indigo-300">Estate</span>
          </span>
          <span className="ml-auto rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-indigo-200">
            Admin
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={link(isActive(href))}>
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          <Link href="/" className={link(false)}>
            <Globe size={18} /> View website
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebar(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 md:hidden"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold">{titles[pathname] ?? "Admin"}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">{user.name}</p>
              <p className="text-xs text-white/50">{user.email}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-semibold">
              {user.name[0]?.toUpperCase()}
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}