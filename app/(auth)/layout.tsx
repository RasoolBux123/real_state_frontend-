export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative -mt-24 flex min-h-[760px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 pb-16 pt-36">
      <div
        className="absolute inset-0 bg-[length:100%_auto] bg-right-bottom bg-no-repeat opacity-30 lg:bg-[length:55%_auto] lg:opacity-70"
        style={{ backgroundImage: "url('/hero.svg')" }}
      />
      <div className="relative w-full max-w-md rounded-3xl border border-white/25 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        {children}
      </div>
    </section>
  );
}