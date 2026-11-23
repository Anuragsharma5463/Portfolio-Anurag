"use client";

import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const words = ["ANURAG", "GEN AI", "AGENTS", "ERAA"];

export function ParticlePlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const setWordRef = useRef<(index: number, snap?: boolean) => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    type Particle = { x: number; y: number; tx: number; ty: number; vx: number; vy: number };
    const particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let activeWord = wordIndex;
    let visible = false;
    let pointerX = -999;
    let pointerY = -999;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      const ratio = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const setWord = (index: number, snap = false) => {
      activeWord = index;
      resize();
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offscreenContext = offscreen.getContext("2d");
      if (!offscreenContext) return;
      const fontSize = Math.min(height * 0.62, width / (words[index].length * 0.66));
      offscreenContext.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
      offscreenContext.textAlign = "center";
      offscreenContext.textBaseline = "middle";
      offscreenContext.fillStyle = "#fff";
      offscreenContext.fillText(words[index], width / 2, height / 2);
      const image = offscreenContext.getImageData(0, 0, offscreen.width, offscreen.height);
      const pixels = image.data;
      const targets: [number, number][] = [];
      const step = width < 600 ? 4 : 3;
      for (let y = 0; y < image.height; y += step) {
        for (let x = 0; x < image.width; x += step) {
          if (pixels[(y * image.width + x) * 4 + 3] > 128) targets.push([x, y]);
        }
      }
      for (let i = targets.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [targets[i], targets[j]] = [targets[j], targets[i]];
      }
      const count = width < 600 ? 1300 : 2600;
      while (particles.length < count) {
        particles.push({ x: Math.random() * width, y: Math.random() * height, tx: 0, ty: 0, vx: 0, vy: 0 });
      }
      particles.forEach((particle, i) => {
        const target = targets[i % targets.length];
        if (!target) return;
        particle.tx = target[0];
        particle.ty = target[1];
        if (snap || reduced) {
          particle.x = target[0];
          particle.y = target[1];
        }
      });
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
    };
    const clearPointer = () => { pointerX = -999; pointerY = -999; };

    const draw = () => {
      frame = 0;
      if (!visible) return;
      context.clearRect(0, 0, width, height);
      particles.forEach((particle, i) => {
        const dx = particle.x - pointerX;
        const dy = particle.y - pointerY;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        if (!reduced && distance < 90) {
          const force = (90 - distance) / 90 * 7;
          particle.vx += dx / distance * force;
          particle.vy += dy / distance * force;
        }
        particle.vx = (particle.vx + (particle.tx - particle.x) * 0.045) * 0.86;
        particle.vy = (particle.vy + (particle.ty - particle.y) * 0.045) * 0.86;
        particle.x += particle.vx;
        particle.y += particle.vy;
        context.fillStyle = i % 2 ? "#22D3EE" : "#8B5CF6";
        context.fillRect(particle.x, particle.y, 2, 2);
      });
      frame = requestAnimationFrame(draw);
    };

    setWordRef.current = setWord;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(draw);
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { rootMargin: "100px" });
    observer.observe(canvas);
    setWord(activeWord, reduced);
    const rotate = window.setInterval(() => {
      if (reduced || !visible || document.hidden) return;
      const next = (activeWord + 1) % words.length;
      setWordIndex(next);
    }, 5000);
    if (document.fonts) void document.fonts.ready.then(() => setWord(activeWord, reduced));
    canvas.addEventListener("pointermove", updatePointer);
    canvas.addEventListener("pointerleave", clearPointer);
    const handleResize = () => setWord(activeWord, true);
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(rotate);
      observer.disconnect();
      canvas.removeEventListener("pointermove", updatePointer);
      canvas.removeEventListener("pointerleave", clearPointer);
      window.removeEventListener("resize", handleResize);
      setWordRef.current = () => {};
    };
  }, []);

  useEffect(() => setWordRef.current(wordIndex), [wordIndex]);

  return (
    <Section id="play" title="Play with it" kicker="Move your cursor or finger through the particles, then choose a word to watch them reshape.">
      <Reveal>
        <div className="glass overflow-hidden rounded-3xl">
          <canvas ref={canvasRef} onClick={() => setWordIndex((i) => (i + 1) % words.length)}
            className="block h-64 w-full cursor-crosshair sm:h-80 md:h-96"
            role="img" aria-label="Interactive particle display that morphs into portfolio words" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Choose a particle word">
          {words.map((word, i) => (
            <button key={word} type="button" aria-pressed={wordIndex === i} onClick={() => setWordIndex(i)}
              className={`min-h-11 rounded-full border px-4 text-sm transition ${wordIndex === i ? "border-cyan bg-cyan/15 text-cyan" : "border-violet/30 text-slate-300 hover:border-violet"}`}>{word}</button>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
