import { Nav } from "@/components/layout/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { AtGlance, ERAA, ADK, NeuralLab, PortfolioAsk } from "@/components/sections/PortfolioAddons";
import { ParticlePlayground } from "@/components/sections/ParticlePlayground";
import { CommandPalette } from "@/components/layout/CommandPalette";
import dynamic from "next/dynamic";

const AmbientBackground = dynamic(() => import("@/components/three/PortfolioScenes").then((m) => m.AmbientBackground), { ssr: false });

export default function Page() {
  return (
    <>
      <AmbientBackground />
      <Nav />
      <main id="top" className="relative z-10">
        <Hero />
        <ParticlePlayground />
        <AtGlance />
        <About />
        <Skills />
        <Projects />
        <ERAA />
        <ADK />
        <NeuralLab />
        <PortfolioAsk />
        <Experience />
        <Contact />
      </main>
      <CommandPalette />
    </>
  );
}
