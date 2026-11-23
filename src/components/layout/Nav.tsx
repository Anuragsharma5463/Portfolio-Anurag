"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [["Home", "hero"], ["About", "about"], ["Expertise", "expertise"], ["Projects", "projects"], ["ERAA", "eraa"], ["ADK", "adk"], ["Experience", "experience"], ["Ask", "ask"], ["Contact", "contact"]] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(([, id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-violet/20 bg-void/70 backdrop-blur-lg">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="font-display text-lg font-semibold">Anurag<span className="text-cyan">.ai</span></a>
        <ul className="hidden gap-0.5 lg:flex">
          {links.map(([label, id]) => (
            <li key={id} className="relative">
              <a href={`#${id}`} aria-current={active === id ? "true" : undefined}
                className={`block px-2 py-2 text-sm transition ${active === id ? "text-white" : "text-slate-400 hover:text-white"}`}>{label}</a>
              {active === id && <motion.span layoutId="nav-ind" className="absolute inset-x-3 -bottom-px h-px bg-cyan" />}
            </li>
          ))}
        </ul>
        <button className="grid size-11 place-items-center rounded-lg border border-violet/30 lg:hidden" aria-expanded={open}
          aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      {open && (
        <ul id="mobile-menu" className="glass border-x-0 px-5 pb-4 lg:hidden">
          {links.map(([label, id]) => (
            <li key={id}><a href={`#${id}`} onClick={() => setOpen(false)} className="block py-3 text-slate-200">{label}</a></li>
          ))}
        </ul>
      )}
    </header>
  );
}
