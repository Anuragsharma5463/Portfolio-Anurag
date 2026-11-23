import { portfolio } from "@/data/portfolio";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Experience() {
  const e = portfolio.education;
  return (
    <Section id="experience" title="Experience">
      <ol className="relative space-y-8 border-l border-violet/40 pl-6 sm:pl-8">
        {portfolio.experience.map((x) => (
          <li key={x.role} className="relative">
            <span className="absolute -left-[31px] top-2 size-3 rounded-full bg-cyan shadow-[0_0_0_4px_#050510] sm:-left-[39px]" aria-hidden />
            <Reveal>
              <div className="glass rounded-2xl p-6">
                <p className="font-mono text-sm text-cyan">{x.period}</p>
                <h3 className="mt-1 font-display text-xl font-semibold">{x.role}</h3>
                <p className="text-slate-400">{x.company}</p>
                <ul className="mt-4 list-disc space-y-1.5 pl-5 text-slate-300 marker:text-violet">{x.points.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
      <Reveal className="mt-16">
        <h3 className="font-display text-2xl font-semibold">Education &amp; certifications</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <p className="font-mono text-sm text-cyan">{e.period}</p>
            <p className="mt-1 font-display text-lg font-semibold">{e.degree}</p>
            <p className="text-slate-400">{e.school}</p>
            <p className="mt-2 text-slate-300">CGPA: {e.cgpa}</p>
          </div>
          <ul className="glass space-y-3 rounded-2xl p-6 text-slate-200">
            {portfolio.certifications.map((c) => <li key={c} className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet" aria-hidden />{c}</li>)}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
