"use client";

import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // admin ki apni screen hai, public navbar/footer nahi
  if (pathname.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-8 pt-32">{children}</main>
      <Footer />
    </>
  );
}