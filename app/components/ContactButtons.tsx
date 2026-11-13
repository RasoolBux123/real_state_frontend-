"use client";

import { MessageCircle, Phone, Mail } from "lucide-react";
import { AGENCY } from "../lib/config";

type Props = { title?: string; propertyId?: string; className?: string; compact?: boolean };

// WhatsApp / Call / Mail go to the agency (admin) - the seller's private details stay hidden.
export default function ContactButtons({ title, propertyId, className = "", compact }: Props) {
  const text = title
    ? `Hi, I'm interested in "${title}"${propertyId ? ` (ID ${propertyId})` : ""}.`
    : "Hi, I'd like some help with a property.";
  const wa = `https://wa.me/${AGENCY.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
  const tel = `tel:${AGENCY.phone.replace(/[^\d+]/g, "")}`;
  const mail = `mailto:${AGENCY.email}?subject=${encodeURIComponent(title ? `Inquiry: ${title}` : "Inquiry")}&body=${encodeURIComponent(text)}`;
  const base = `flex flex-1 items-center justify-center gap-2 rounded-xl font-semibold transition ${
    compact ? "px-3 py-2 text-sm" : "px-4 py-3 text-sm"
  }`;

  return (
    <div className={`flex gap-2 ${className}`}>
      <a href={wa} target="_blank" rel="noopener noreferrer" className={`${base} bg-green-600 text-white hover:bg-green-500`}>
        <MessageCircle size={16} /> WhatsApp
      </a>
      <a href={tel} className={`${base} bg-indigo-600 text-white hover:bg-indigo-500`}>
        <Phone size={16} /> Call
      </a>
      <a href={mail} className={`${base} border border-gray-300 bg-white text-gray-800 hover:bg-gray-50`}>
        <Mail size={16} /> Mail
      </a>
    </div>
  );
}
