import Link from "next/link";
import Reveal from "../components/Reveal";   // path file ki jagah ke hisab se
export const metadata = { title: "Services | Real Estate" };

const services = [
  ["Buy a property", "Browse houses, flats, plots and commercial spaces."],
  ["Rent a property", "Find rentals and book a viewing in a few clicks."],
  ["Sell or rent out yours", "Submit your listing. We review and publish it."],
  ["Property guidance", "Talk to our team about pricing, paperwork and visits."],
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Reveal>
      <h1 className="text-3xl font-bold">Our services</h1></Reveal>
      <div className="grid gap-4 sm:grid-cols-2">
        {services.map(([t, d]) => (
          <div key={t} className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-semibold">{t}</h2>
            <p className="mt-2 text-sm text-gray-600">{d}</p>
          </div>
        ))}
      </div>
      <Link href="/contact" className="inline-block rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500">
        Get in touch
      </Link>
    </div>
  );
}
