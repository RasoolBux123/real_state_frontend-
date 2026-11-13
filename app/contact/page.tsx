"use client";

import { useEffect, useState } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { AGENCY } from "../lib/config";
import { sendContact, type ContactPayload } from "../lib/contactApi";
import { getErrorMessage } from "../lib/authApi";
import { useAuthStore } from "../store/authStore";
import ContactButtons from "../components/ContactButtons";

const kinds: { value: ContactPayload["kind"]; label: string }[] = [
  { value: "message", label: "Send a message" },
  { value: "callback", label: "Request a call back" },
  { value: "viewing", label: "Book a property viewing" },
];

const field = "w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-indigo-500";

export default function ContactPage() {
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", kind: "message" as ContactPayload["kind"], message: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  // pre-fill for logged-in users
  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email, phone: f.phone || (user.phone ?? "") }));
  }, [user]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setState("sending");
    try {
      await sendContact(form);
      setState("sent");
    } catch (err) {
      setError(getErrorMessage(err));
      setState("idle");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Contact us</h1>
        <p className="mt-1 text-gray-600">Ask a question, request a call back or book a viewing. Our team gets your request instantly.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm lg:col-span-3"
        >
          {state === "sent" ? (
            <div className="rounded-xl bg-green-50 p-6 text-green-800">
              <h2 className="text-lg font-semibold">Thank you, we received your request</h2>
              <p className="mt-1 text-sm">Our team will get back to you shortly.</p>
              <button type="button" onClick={() => { setState("idle"); setForm((f) => ({ ...f, message: "", subject: "" })); }} className="mt-3 font-semibold underline">
                Send another
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <input required minLength={2} placeholder="Your name" value={form.name} onChange={set("name")} className={field} />
                <input required type="email" placeholder="Email" value={form.email} onChange={set("email")} className={field} />
                <input placeholder="Phone (optional)" value={form.phone} onChange={set("phone")} className={field} />
                <select value={form.kind} onChange={set("kind")} className={field}>
                  {kinds.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
                </select>
              </div>
              <input placeholder="Subject (optional)" value={form.subject} onChange={set("subject")} className={field} />
              <textarea required minLength={10} rows={6} placeholder="How can we help? (at least 10 characters)" value={form.message} onChange={set("message")} className={field} />
              {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <button disabled={state === "sending"} className="rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60">
                {state === "sending" ? "Sending..." : "Send request"}
              </button>
            </>
          )}
        </motion.form>

        <div className="space-y-4 lg:col-span-2">
          <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-semibold">Talk to us directly</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-center gap-3"><Phone size={18} className="text-indigo-600" /> {AGENCY.phone}</li>
              <li className="flex items-center gap-3"><MessageCircle size={18} className="text-green-600" /> WhatsApp available</li>
              <li className="flex items-center gap-3"><Mail size={18} className="text-indigo-600" /> {AGENCY.email}</li>
              <li className="flex items-center gap-3"><MapPin size={18} className="text-indigo-600" /> Mon - Sat, 9am - 7pm</li>
            </ul>
            <ContactButtons />
          </div>
        </div>
      </div>
    </div>
  );
}
