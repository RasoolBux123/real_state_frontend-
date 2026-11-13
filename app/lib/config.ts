// Backend + agency contact details. Set these in .env.local / Vercel env vars.
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// WhatsApp / Call / Mail buttons use these (the agency), not the seller's private number.
export const AGENCY = {
  name: "Real Estate",
  phone: process.env.NEXT_PUBLIC_AGENCY_PHONE || "+92 300 1234567",
  whatsapp: process.env.NEXT_PUBLIC_AGENCY_WHATSAPP || "923001234567",
  email: process.env.NEXT_PUBLIC_AGENCY_EMAIL || "info@realestate.example",
};
