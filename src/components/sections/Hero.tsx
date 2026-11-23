"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, Mail, Layers } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { LinkButton } from "@/components/ui/LinkButton";

const NeuralCore = dynamic(() => import("@/components/three/NeuralCore"), { ssr: false });

export function Hero() {
  const [i, setI] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % portfolio.roles.length), 2400);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (!profileOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !profileRef.current?.contains(event.target)) setProfileOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        avatarRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [profileOpen]);

  const copyEmail = async () => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard access is unavailable");
      await navigator.clipboard.writeText(portfolio.email);
      setProfileMessage("Email copied");
    } catch {
      setProfileMessage(`Could not copy automatically. Email: ${portfolio.email}`);
    }
  };

  const tiltAvatar = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    const image = event.currentTarget.querySelector("img");
    if (image) image.style.transform = `rotateY(${x * 24}deg) rotateX(${-y * 24}deg) scale(1.06)`;
  };
  return (
    <section id="hero" aria-labelledby="hero-h" className="relative flex min-h-screen items-center overflow-hidden">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="absolute -left-40 top-1/3 size-[480px] rounded-full bg-violet/20 blur-[120px]" aria-hidden />
      <div className="absolute inset-y-0 right-0 w-full opacity-50 md:w-3/5 md:opacity-100"><NeuralCore /></div>
      <div ref={profileRef} className="absolute left-5 top-20 z-10 sm:left-8">
        <button ref={avatarRef} type="button" onClick={() => setProfileOpen((v) => !v)} onPointerMove={tiltAvatar}
          onPointerLeave={(event) => { const image = event.currentTarget.querySelector("img"); if (image) image.style.transform = ""; }}
          aria-expanded={profileOpen} aria-haspopup="dialog" aria-controls="profile-card"
          aria-label="Open profile card" className="relative size-20 rounded-full p-1 sm:size-28">
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-violet to-cyan p-[3px]" />
          <Image src="/images/anurag.jpg" alt="Portrait of Anurag Kumar Vishwakarma" width={128} height={128} className="relative size-full rounded-full object-cover transition-transform duration-150" />
        </button>
        {profileOpen && (
          <div id="profile-card" role="dialog" aria-label="Profile card" className="glass absolute left-0 top-24 w-72 rounded-2xl p-4 sm:top-32">
            <p className="font-display font-semibold">{portfolio.name}</p>
            <p className="mt-1 font-mono text-xs text-cyan">AI/ML Engineer, {portfolio.location}</p>
            <div className="mt-4 flex gap-2">
              <LinkButton href="#contact" variant="solid">Contact</LinkButton>
              <button type="button" onClick={copyEmail} className="min-h-11 rounded-full border border-violet/40 px-4 text-sm">Copy email</button>
            </div>
            <p aria-live="polite" className="mt-2 text-xs text-cyan">{profileMessage}</p>
          </div>
        )}
      </div>
      <div className="relative mx-auto w-full max-w-6xl px-5 pt-44 sm:px-8 sm:pt-52 lg:pt-24">
        <p className="font-mono text-sm tracking-wide text-cyan">Hello, I&apos;m {portfolio.firstName}</p>
        <h1 id="hero-h" className="mt-4 max-w-2xl font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
          Building Intelligence.<br />Engineering the Future.
        </h1>
        <p className="mt-5 h-8 font-mono text-lg text-violet" aria-live="off">
          <span className="sr-only">{portfolio.roles.join(", ")}</span>
          <span aria-hidden>{portfolio.roles[i]}</span>
        </p>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-300">{portfolio.tagline}</p>
        <a href="#eraa" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-4 font-mono text-xs text-cyan">
          <span className="size-2 animate-pulse rounded-full bg-cyan" aria-hidden />
          Now building: ERAA, a super AI intelligent system
        </a>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="#projects" variant="solid"><Layers size={16} />Explore My Work</LinkButton>
          <LinkButton href={portfolio.resumePath} download><Download size={16} />Download Resume</LinkButton>
          <LinkButton href="#contact"><Mail size={16} />Let&apos;s Connect</LinkButton>
        </div>
      </div>
      <a href="#about" aria-label="Scroll to About" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-400"><ChevronDown className="animate-bounce" /></a>
    </section>
  );
}
