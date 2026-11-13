"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useAuthModal } from "../store/authModalStore";

// Wrap pages that need a logged-in user. Shows a login prompt instead of redirecting.
export default function ProtectedRoute({ children, message = "Please log in to continue." }: { children: React.ReactNode; message?: string }) {
  const user = useAuthStore((s) => s.user);
  const openModal = useAuthModal((s) => s.openModal);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="min-h-[40vh]" />;
  if (!user) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold">Login required</h2>
        <p className="mt-2 text-gray-600">{message}</p>
        <button
          onClick={() => openModal("login")}
          className="mt-5 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
        >
          Login
        </button>
      </div>
    );
  }
  return <>{children}</>;
}
