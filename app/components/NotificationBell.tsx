"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getNotifications, markAllRead } from "../lib/notificationApi";
import { formatDate } from "../lib/format";
import type { AppNotification } from "../types";

export default function NotificationBell({ className }: { className: string }) {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const r = await getNotifications();
      setItems(r.data);
      setUnread(r.unread);
    } catch {
      /* keep old list */
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 30000); // refresh every 30s
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) {
      await markAllRead().catch(() => undefined);
      setUnread(0);
    }
  }

  return (
    <div ref={box} className="relative">
      <button aria-label="Notifications" onClick={toggle} className={className}>
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white ring-2 ring-slate-800">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-0 top-full z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-white/20 bg-slate-900/95 shadow-xl backdrop-blur-xl"
          >
            <p className="border-b border-white/10 px-4 py-3 text-sm font-semibold text-white">Notifications</p>
            {items.length === 0 ? (
              <p className="p-6 text-center text-sm text-white/50">Nothing new yet.</p>
            ) : (
              <ul className="max-h-96 divide-y divide-white/10 overflow-y-auto">
                {items.map((n) => {
                  const inner = (
                    <>
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-white/60">{n.body}</p>
                      <p className="mt-1 text-[11px] text-white/40">{formatDate(n.createdAt)}</p>
                    </>
                  );
                  return (
                    <li key={n.id} className={n.read ? "" : "bg-indigo-500/10"}>
                      {n.link ? (
                        <Link href={n.link} onClick={() => setOpen(false)} className="block px-4 py-3 hover:bg-white/5">
                          {inner}
                        </Link>
                      ) : (
                        <div className="px-4 py-3">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
