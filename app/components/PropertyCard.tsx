"use client";

import Link from "next/link";
import { Bed, Bath, Ruler, MapPin, Heart } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Property } from "../types";
import { formatPrice } from "../lib/format";
import { useAuthStore } from "../store/authStore";
import { useAuthModal } from "../store/authModalStore";
import { useFavorites } from "../store/favoritesStore";
import ContactButtons from "./ContactButtons";

export default function PropertyCard({ p, index = 0 }: { p: Property; index?: number }) {
  const user = useAuthStore((s) => s.user);
  const openModal = useAuthModal((s) => s.openModal);
  const liked = useFavorites((s) => s.ids.includes(p.id));
  const toggle = useFavorites((s) => s.toggle);

  // 3D tilt that follows the mouse
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  function onHeart() {
    if (!user) return openModal("login");
    toggle(p.id);
  }

  return (
    <motion.div
      // pop-in when scrolled into view, one card after another
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 120, damping: 16, delay: Math.min(index, 5) * 0.1 }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-indigo-500/30"
    >
      {/* shine sweep on hover */}
      <span className="pointer-events-none absolute inset-0 z-10 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      <Link href={`/properties/${p.id}`} className="block">
        <div className="relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.images[0] ?? "/background.png"}
            alt={p.title}
            className="h-52 w-full object-cover transition duration-700 group-hover:scale-110"
          />
          <span className="absolute left-3 top-3 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
            For {p.listingType === "SALE" ? "Sale" : "Rent"}
          </span>
        </div>

        <div className="space-y-2 p-4 pb-3">
          <p className="text-lg font-bold text-indigo-600">
            {formatPrice(p.price)}
            {p.listingType === "RENT" && <span className="text-sm font-medium text-gray-500"> / month</span>}
          </p>
          <h3 className="line-clamp-1 font-semibold">{p.title}</h3>
          <p className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin size={14} className="shrink-0" />
            <span className="line-clamp-1">{p.address}, {p.city}</span>
          </p>

          <div className="flex gap-4 border-t pt-3 text-sm text-gray-600">
            {!!p.bedrooms && (
              <span className="flex items-center gap-1"><Bed size={14} /> {p.bedrooms}</span>
            )}
            {!!p.bathrooms && (
              <span className="flex items-center gap-1"><Bath size={14} /> {p.bathrooms}</span>
            )}
            <span className="flex items-center gap-1"><Ruler size={14} /> {p.areaSqft} sqft</span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <ContactButtons title={p.title} propertyId={p.id} compact />
      </div>

      <motion.button
        type="button"
        onClick={onHeart}
        aria-label={liked ? "Remove from favorites" : "Add to favorites"}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 12 }}
        className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow"
      >
        <motion.span
          key={liked ? "on" : "off"}
          initial={{ scale: liked ? 0.4 : 1 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 12 }}
          className="flex"
        >
          <Heart size={18} className={liked ? "fill-red-500 text-red-500" : "text-gray-600"} />
        </motion.span>
      </motion.button>
    </motion.div>
  );
}