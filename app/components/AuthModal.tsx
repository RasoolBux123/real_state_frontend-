"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useAuthModal } from "../store/authModalStore";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function AuthModal() {
  const router = useRouter();
  const { open, mode, redirectTo, setMode, close } = useAuthModal();

  // Esc se band + peeche ka page scroll na ho
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  if (!open) return null;

  function onSuccess() {
    const to = redirectTo;
    close(); // page wahi rehta hai
    if (to) router.push(to); // sirf tab jab koi khaas jagah jana ho (jaise Sell Property)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close(); // bahar click par band
      }}
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center"
    >
      <div className="relative my-8 w-full max-w-md rounded-3xl border border-white/20 bg-slate-900/95 p-8 shadow-2xl">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <X size={18} />
        </button>

        {mode === "login" ? (
          <LoginForm onSuccess={onSuccess} onSwitch={() => setMode("register")} />
        ) : (
          <RegisterForm onSuccess={onSuccess} onSwitch={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}