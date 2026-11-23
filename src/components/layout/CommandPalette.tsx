"use client";

import { useEffect, useMemo, useState } from "react";

const destinations = [
  ["Home", "hero"], ["Particle playground", "play"], ["At a glance", "top"], ["About", "about"], ["Expertise", "expertise"],
  ["Projects", "projects"], ["ERAA", "eraa"], ["Google ADK", "adk"], ["Neural network lab", "nn"],
  ["Ask my portfolio", "ask"], ["Experience", "experience"], ["Contact", "contact"],
] as const;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const filtered = useMemo(() => destinations.filter(([label]) => label.toLowerCase().includes(query.toLowerCase())), [query]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setSelected(0);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const jump = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex justify-center bg-void/85 px-4 pt-[15vh] backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Command menu"
      onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="glass h-fit w-full max-w-xl rounded-2xl p-3">
        <input autoFocus value={query} onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
            if (e.key === "ArrowDown") { e.preventDefault(); setSelected((v) => (v + 1) % Math.max(filtered.length, 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setSelected((v) => (v - 1 + filtered.length) % Math.max(filtered.length, 1)); }
            if (e.key === "Enter" && filtered[selected]) jump(filtered[selected][1]);
          }}
          placeholder="Jump to..." aria-label="Search sections"
          className="h-12 w-full rounded-xl border border-violet/40 bg-void px-4 text-slate-100 outline-none focus:border-cyan" />
        <ul className="mt-2">
          {filtered.map(([label, id], i) => (
            <li key={id}>
              <button type="button" onClick={() => jump(id)} className={`w-full rounded-lg px-4 py-3 text-left ${i === selected ? "bg-violet/25 text-white" : "text-slate-300 hover:bg-white/5"}`}>{label}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
