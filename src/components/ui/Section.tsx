export function Section({ id, title, kicker, children }: { id: string; title: string; kicker?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <h2 id={`${id}-h`} className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
      {kicker && <p className="mt-3 max-w-2xl text-slate-300">{kicker}</p>}
      <div className="mt-10">{children}</div>
    </section>
  );
}
