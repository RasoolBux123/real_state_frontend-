export const metadata = { title: "About | Real Estate" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <h1 className="text-3xl font-bold">About Real Estate</h1>
      <p className="text-gray-700">
        We connect buyers, sellers and renters with verified property listings. Every listing is reviewed
        by our team before it goes live, so what you see is real.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Verified listings", "Each property is approved by an admin before it is public."],
          ["One account", "Buy, rent and sell with the same account."],
          ["Direct support", "Call, WhatsApp or mail our team any time."],
        ].map(([t, d]) => (
          <div key={t} className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-semibold">{t}</h2>
            <p className="mt-2 text-sm text-gray-600">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
