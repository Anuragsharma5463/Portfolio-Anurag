import { Github, ExternalLink } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import { FlowDiagram, LandmarkViz } from "@/components/projects/FlowDiagram";

const accents = ["from-cyan/20", "from-violet/25", "from-blue-500/20"];

export function Projects() {
  return (
    <Section id="projects" title="Featured projects" kicker="Three end-to-end AI systems. The diagrams are interactive simulations that explain the architecture; they are not live demos.">
      <div className="space-y-10">
        {portfolio.projects.map((p, i) => (
          <Reveal key={p.id}>
            <article aria-labelledby={`${p.id}-h`} className={`glass overflow-hidden rounded-3xl bg-gradient-to-br ${accents[i]} to-transparent p-6 sm:p-8`}>
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h3 id={`${p.id}-h`} className="font-display text-2xl font-semibold sm:text-3xl">{p.title}</h3>
                  <p className="mt-3 text-slate-300">{p.intro}</p>
                  <ul aria-label="Tech stack" className="mt-4 flex flex-wrap gap-2">
                    {p.stack.map((s) => <li key={s} className="rounded-md border border-cyan/30 px-2.5 py-1 font-mono text-xs text-cyan">{s}</li>)}
                  </ul>
                  <h4 className="mt-6 font-display text-sm font-medium text-slate-100">Technical highlights</h4>
                  <ul className="mt-2 grid gap-1.5 text-sm text-slate-300 sm:grid-cols-2">
                    {p.highlights.map((h) => <li key={h} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet" aria-hidden />{h}</li>)}
                  </ul>
                  {(p.github || p.demo) && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {p.github && <LinkButton href={p.github} external><Github size={16} />GitHub</LinkButton>}
                      {p.demo && <LinkButton href={p.demo} external variant="solid"><ExternalLink size={16} />Live demo</LinkButton>}
                    </div>
                  )}
                </div>
                <div className="rounded-2xl bg-void/60 p-4">
                  {p.diagram === "face" && <LandmarkViz />}
                  <FlowDiagram id={p.diagram} title={p.title} />
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
