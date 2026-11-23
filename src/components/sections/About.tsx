import { MapPin } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <Section id="about" title="Engineer profile">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <Reveal className="space-y-4 text-lg leading-relaxed text-slate-300">
          {portfolio.about.map((p) => <p key={p}>{p}</p>)}
          <p className="flex items-center gap-2 pt-2 font-mono text-sm text-cyan"><MapPin size={16} />{portfolio.location}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="grid grid-cols-2 gap-3">
            {portfolio.stats.map((s, k) => (
              <li key={s.label} className={`glass rounded-2xl p-5 ${k % 3 === 0 ? "translate-y-3" : ""}`}>
                <p className="font-display text-4xl font-semibold text-white">{s.value}</p>
                <p className="mt-1 text-sm text-slate-300">{s.label}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-slate-400">Counts describe the breadth of my portfolio work, not production-scale usage.</p>
        </Reveal>
      </div>
    </Section>
  );
}
