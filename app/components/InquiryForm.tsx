"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useAuthModal } from "../store/authModalStore";
import { sendInquiry, requestVisit } from "../lib/inquiryApi";
import { getErrorMessage } from "../lib/authApi";

type Mode = "message" | "visit";

// Message the seller or request a visit. Both reach the seller AND the admin (bell + email).
export default function InquiryForm({ propertyId }: { propertyId: string }) {
  const user = useAuthStore((s) => s.user);
  const openModal = useAuthModal((s) => s.openModal);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("message");
  const [message, setMessage] = useState("");
  const [when, setWhen] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-32" />;

  if (!user) {
    return (
      <div className="space-y-3 text-center">
        <p className="text-sm text-gray-600">Log in to message the seller or book a visit.</p>
        <button
          onClick={() => openModal("login")}
          className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Login to continue
        </button>
        <button onClick={() => openModal("register")} className="text-sm font-medium text-indigo-600 hover:underline">
          Create account
        </button>
      </div>
    );
  }

  if (state === "sent")
    return (
      <div className="rounded-xl bg-green-50 p-4 text-sm text-green-800">
        {mode === "visit"
          ? "Visit request sent. The seller and our team have been notified."
          : "Message sent. The seller and our team have been notified."}
        <button onClick={() => setState("idle")} className="mt-2 block font-semibold underline">
          Send another
        </button>
      </div>
    );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setState("sending");
    try {
      if (mode === "visit") await requestVisit(propertyId, when, message);
      else await sendInquiry(propertyId, message);
      setMessage("");
      setWhen("");
      setState("sent");
    } catch (err) {
      setError(getErrorMessage(err));
      setState("idle");
    }
  }

  const tab = (m: Mode) =>
    `flex-1 rounded-lg py-2 text-sm font-semibold transition ${
      mode === m ? "bg-white text-indigo-600 shadow" : "text-gray-600"
    }`;

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
        <button type="button" onClick={() => setMode("message")} className={tab("message")}>Send message</button>
        <button type="button" onClick={() => setMode("visit")} className={tab("visit")}>Book a visit</button>
      </div>

      {mode === "visit" && (
        <input
          type="datetime-local"
          required
          value={when}
          min={new Date(Date.now() + 3600_000).toISOString().slice(0, 16)}
          onChange={(e) => setWhen(e.target.value)}
          className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
        />
      )}

      <textarea
        required={mode === "message"}
        minLength={mode === "message" ? 10 : undefined}
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={mode === "visit" ? "Anything the seller should know? (optional)" : "I'm interested in this property. Is it still available?"}
        className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
      />

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <button
        disabled={state === "sending"}
        className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {state === "sending" ? "Sending..." : mode === "visit" ? "Request visit" : "Send message"}
      </button>
    </form>
  );
}
