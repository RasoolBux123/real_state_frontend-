import Link from "next/link";
import { Home, Mail, MapPin, Phone } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const propertyLinks = [
  { label: "For Sale", href: "/properties?listingType=SALE" },
  { label: "For Rent", href: "/properties?listingType=RENT" },
  { label: "Houses", href: "/properties?type=HOUSE" },
  { label: "Flats", href: "/properties?type=FLAT" },
  { label: "Plots", href: "/properties?type=PLOT" },
  { label: "Commercial", href: "/properties?type=COMMERCIAL" },
];

// lucide ke naye versions mein brand icons nahi hain, isliye simple inline SVG
const socials = [
  {
    label: "Facebook",
    href: "#",
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
];

const linkClass = "text-sm text-white/70 transition hover:text-white";
const heading = "mb-4 text-sm font-semibold uppercase tracking-wide text-white";

export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <Home size={26} className="text-indigo-400" />
              <span>
                Real <span className="text-indigo-300">Estate</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Explore premium properties, expert guidance, and a seamless buying experience.
            </p>

            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-indigo-600"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className={heading}>Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Properties */}
          <div>
            <h3 className={heading}>Properties</h3>
            <ul className="space-y-3">
              {propertyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={heading}>Contact Us</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-indigo-300" />
                <span>Office address, City, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-indigo-300" />
                <a href="tel:+920000000000" className="hover:text-white">
                  +92 000 0000000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-indigo-300" />
                <a href="mailto:info@example.com" className="hover:text-white">
                  info@example.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Real Estate. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}