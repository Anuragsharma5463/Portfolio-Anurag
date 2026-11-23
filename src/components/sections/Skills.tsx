"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { portfolio } from "@/data/portfolio";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const SkillSphere = dynamic(() => import("@/components/three/PortfolioScenes").then((m) => m.SkillSphere), { ssr: false });

export function Skills() {
  const [cat, setCat] = useState<string>("All");
  const groups = portfolio.skills;
  const all = groups.flatMap((g) => g.items.map((name) => ({ name, category: g.category })));
  const shown = cat === "All" ? all : all.filter((s) => s.category === cat);
  const tabs = ["All", ...groups.map((g) => g.category)];
  return (
    <Section id="expertise" title="Expertise" kicker="Choose a category to filter. Hover or focus a skill to see where it belongs.">
      <div role="group" aria-label="Filter skills by category" className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t} aria-pressed={cat === t} onClick={() => setCat(t)}
            className={cn("min-h-11 rounded-full border px-4 text-sm transition", cat === t ? "border-cyan bg-cyan/15 text-cyan" : "border-violet/30 text-slate-300 hover:border-violet")}>{t}</button>
        ))}
      </div>
      <div className="mt-8">
        <SkillSphere skills={shown} />
        <p className="mt-2 text-center text-xs text-slate-400">Drag the sphere to rotate it. Every skill is also listed in plain text below.</p>
      </div>
      <motion.ul layout className="mt-8 flex flex-wrap gap-3">
        <AnimatePresence mode="popLayout">
          {shown.map((s) => (
            <motion.li layout key={s.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              title={`${s.name} — ${s.category}`} tabIndex={0}
              className="glass group rounded-xl px-4 py-2.5 font-mono text-sm text-slate-100 hover:border-cyan/60">
              {s.name}
              <span className="ml-2 hidden text-xs text-cyan group-hover:inline group-focus:inline">{s.category}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </Section>
  );
}
