"use client";
import dynamic from "next/dynamic";
import { Download, Github, Linkedin, Mail } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { LinkButton } from "@/components/ui/LinkButton";

const NeuralCore = dynamic(() => import("@/components/three/NeuralCore"), { ssr: false });

export function Contact() {
  const { github, linkedin } = portfolio.social;
  return (
    <section id="contact" aria-labelledby="contact-h" className="relative mt-10 overflow-hidden border-t border-violet/20">
      <div className="absolute inset-0 opacity-40" aria-hidden><NeuralCore count={60} /></div>
      <div className="relative mx-auto max-w-3xl px-5 py-28 text-center sm:px-8">
        <h2 id="contact-h" className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">Have an AI Challenge?<br />Let&apos;s Build Something Intelligent.</h2>
        <p className="mx-auto mt-5 max-w-xl text-slate-300">I&apos;m interested in AI/ML engineering opportunities, Generative AI applications, intelligent agents, and impactful engineering collaborations.</p>
        <p className="mt-4 font-mono text-cyan">{portfolio.email}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href={`mailto:${portfolio.email}`} variant="solid"><Mail size={16} />Send Email</LinkButton>
          {github && <LinkButton href={github} external><Github size={16} />GitHub</LinkButton>}
          {linkedin && <LinkButton href={linkedin} external><Linkedin size={16} />LinkedIn</LinkButton>}
          <LinkButton href={portfolio.resumePath} download><Download size={16} />Download Resume</LinkButton>
        </div>
      </div>
      <footer className="relative border-t border-violet/20 py-6 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} {portfolio.name}. Built with curiosity, code, and intelligence.
      </footer>
    </section>
  );
}
