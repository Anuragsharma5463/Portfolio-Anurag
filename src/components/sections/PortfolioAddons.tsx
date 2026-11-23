"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Search, RotateCcw } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";

const ERAAVisualizer = dynamic(() => import("@/components/three/PortfolioScenes").then((m) => m.ERAAVisualizer), { ssr: false });
const NeuralNetworkCanvas = dynamic(() => import("@/components/three/PortfolioScenes").then((m) => m.NeuralNetworkCanvas), { ssr: false });

export function AtGlance() {
  const items = [
    ["Focus", "Generative AI, LLMs, RAG, agentic systems"],
    ["Latest role", "AI/ML Engineer Intern, Ansh Infotech (Jan-Jun 2026)"],
    ["Core stack", "Python, LangGraph, Pinecone, FastAPI, Docker"],
    ["Based in", portfolio.location],
  ];
  return (
    <section aria-label="At a glance" className="-mt-8 px-5 sm:px-8">
      <dl className="glass mx-auto grid max-w-6xl grid-cols-1 gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([label, value]) => (
          <div key={label} className="border-violet/20 p-5 sm:border-r">
            <dt className="font-mono text-xs text-cyan">{label}</dt>
            <dd className="mt-1 text-sm text-slate-300">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mx-auto mt-3 max-w-6xl text-center text-xs text-slate-400">Tip: press Ctrl/⌘ + K to jump anywhere, or try the retrieval demo below.</p>
    </section>
  );
}

export function ERAA() {
  return (
    <section id="eraa" aria-labelledby="eraa-h" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <Reveal>
        <div className="glass grid items-center gap-8 rounded-3xl p-6 md:grid-cols-[1.15fr_1fr] sm:p-8">
          <div className="relative h-72 touch-pan-y overflow-hidden rounded-2xl bg-void/60 sm:h-96">
            <ERAAVisualizer />
            <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-mono text-sm tracking-[.35em] text-white">ERAA</p>
            <p className="absolute inset-x-0 bottom-2 text-center text-xs text-slate-400">Concept visual, not a live system. Drag to rotate; click to pulse.</p>
          </div>
          <div>
            <p className="font-mono text-sm text-cyan">Currently building</p>
            <h2 id="eraa-h" className="mt-2 font-display text-3xl font-semibold sm:text-4xl">ERAA: a super AI intelligent system</h2>
            <p className="mt-4 text-slate-300">A personal project I am working on myself. ERAA is still in development, so I am sharing it as work in progress rather than a finished product. More details, architecture notes and visuals will appear here as it takes shape.</p>
            <ul className="mt-5 flex flex-wrap gap-2 font-mono text-xs text-cyan">
              <li className="rounded-md border border-cyan/30 px-3 py-1">In development</li>
              <li className="rounded-md border border-cyan/30 px-3 py-1">Personal project</li>
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function ADK() {
  return (
    <section id="adk" aria-labelledby="adk-h" className="mx-auto max-w-6xl px-5 py-5 sm:px-8">
      <Reveal>
        <div className="glass flex flex-wrap items-center justify-between gap-6 rounded-2xl p-6 sm:p-8">
          <div className="max-w-3xl">
            <p className="font-mono text-sm text-cyan">Learning and building</p>
            <h2 id="adk-h" className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Google ADK (Agent Development Kit)</h2>
            <p className="mt-3 text-slate-300">I am learning Google ADK and building projects with it, alongside LangGraph and LangChain. Project details will be added here once they are ready to share.</p>
          </div>
          <ul className="flex flex-wrap gap-2 font-mono text-xs text-cyan">
            <li className="rounded-md border border-cyan/30 px-3 py-1">Learning</li>
            <li className="rounded-md border border-cyan/30 px-3 py-1">Building projects</li>
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

const createWeights = (seed: number) => {
  const layers = [3, 6, 6, 4, 2];
  let state = seed >>> 0;
  const random = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
  return layers.slice(0, -1).map((count, layer) =>
    Array.from({ length: count }, () =>
      Array.from({ length: layers[layer + 1] }, () => (random() * 2 - 1) * 1.3)));
};

const calculateActivations = (inputs: number[], weights: number[][][]) => {
  const layers = [inputs];
  weights.forEach((matrix, layer) => {
    layers.push(matrix[0].map((_, target) =>
      Math.tanh(layers[layer].reduce((sum, value, source) => sum + value * matrix[source][target], 0))));
  });
  return layers;
};

export function NeuralLab() {
  const [inputs, setInputs] = useState([0.6, -0.4, 0.8]);
  const [weights, setWeights] = useState(() => createWeights(1337));
  const activations = useMemo(() => calculateActivations(inputs, weights), [inputs, weights]);
  const outputs = activations[activations.length - 1];

  return (
    <Section id="nn" title="Inside a neural network" kicker="A small network running live in your browser: three inputs, random weights and real forward-pass math. Move a slider to send a signal through the layers, or drag the scene to look around. It is an illustration, not a trained model and not one of my projects.">
      <Reveal>
        <div className="glass grid items-center gap-6 rounded-3xl p-6 md:grid-cols-[1.6fr_1fr]">
          <div>
            <NeuralNetworkCanvas activations={activations} weights={weights} />
            <p className="mt-2 text-center text-xs text-slate-400">Layers: 3, 6, 6, 4, 2 neurons. Cyan is positive; violet is negative.</p>
          </div>
          <div>
            {["A", "B", "C"].map((label, i) => (
              <label key={label} className="mb-4 block text-sm text-slate-400">
                Input {label}: <span className="font-mono text-cyan">{inputs[i].toFixed(2)}</span>
                <input className="mt-2 h-8 w-full accent-violet" type="range" min="-1" max="1" step="0.05" value={inputs[i]}
                  onChange={(e) => setInputs((old) => old.map((v, k) => k === i ? Number(e.target.value) : v))} />
              </label>
            ))}
            <button type="button" onClick={() => setWeights(createWeights(Math.floor(Math.random() * 2 ** 32)))} className="flex min-h-11 items-center gap-2 rounded-full border border-violet/40 px-4 text-sm text-slate-100">
              <RotateCcw size={15} /> Randomize weights
            </button>
            <div className="mt-5 space-y-3 font-mono text-sm" aria-live="polite">
              {outputs.map((value, i) => (
                <div key={i}>
                  <div className="mb-1 flex justify-between"><span>Output {i + 1}</span><b className={value >= 0 ? "text-cyan" : "text-violet"}>{value >= 0 ? "+" : ""}{value.toFixed(2)}</b></div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-violet to-cyan" style={{ width: `${Math.abs(value) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

const facts = [
  ...portfolio.about,
  ...portfolio.experience.map((item) => `${item.role} at ${item.company}, ${item.period}. ${item.points.join(" ")}`),
  ...portfolio.projects.map((project) => `${project.title}. ${project.intro} Technologies: ${project.stack.join(", ")}. ${project.highlights.join(". ")}`),
  ...portfolio.skills.map((group) => `${group.category} skills: ${group.items.join(", ")}.`),
  `Vector databases and search technologies: ${portfolio.skills.find((group) => group.category === "Vector Search")?.items.join(", ") ?? ""}.`,
  `Education: ${portfolio.education.degree} at ${portfolio.education.school}, ${portfolio.education.period}, CGPA ${portfolio.education.cgpa}.`,
  `Certifications: ${portfolio.certifications.join(", ")}.`,
  `Based in ${portfolio.location}. Contact email ${portfolio.email}.`,
  "Currently building ERAA, a personal in-development super AI intelligent system.",
  "Learning Google ADK (Agent Development Kit) alongside LangGraph and LangChain.",
];

const stopWords = new Set("a an and are as at be by can do does for from has he how i in is it me my of on or the this to used use what which who with".split(" "));
const tokenize = (text: string) => text.toLowerCase().replace(/[^a-z0-9+#\s]/g, " ").split(/\s+/).filter((word) => word && !stopWords.has(word));
const documentTokens = facts.map(tokenize);
const documentFrequency = new Map<string, number>();
documentTokens.forEach((tokens) => {
  new Set(tokens).forEach((token) => documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1));
});
const vectorize = (tokens: string[]) => {
  const counts = new Map<string, number>();
  tokens.forEach((token) => counts.set(token, (counts.get(token) ?? 0) + 1));
  const vector = new Map<string, number>();
  let magnitude = 0;
  counts.forEach((count, token) => {
    const weight = count * Math.log(1 + facts.length / (documentFrequency.get(token) ?? 0.5));
    vector.set(token, weight);
    magnitude += weight * weight;
  });
  const norm = Math.sqrt(magnitude) || 1;
  vector.forEach((weight, token) => vector.set(token, weight / norm));
  return vector;
};
const documentVectors = documentTokens.map(vectorize);

export function PortfolioAsk() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<{ fact: string; score: number }[]>([]);
  const [fallback, setFallback] = useState(false);
  const suggestions = ["What vector databases has he used?", "Tell me about his RAG project", "Does he know Docker?", "What is ERAA?", "Does he know Google ADK?"];

  const retrieve = (q: string) => {
    const query = vectorize(tokenize(q));
    const ranked = documentVectors.map((vector, i) => {
      let score = 0;
      query.forEach((weight, token) => { score += weight * (vector.get(token) ?? 0); });
      return { fact: facts[i], score };
    }).sort((a, b) => b.score - a.score).filter((item) => item.score >= 0.08).slice(0, 3);
    const insufficient = ranked.length === 0;
    setFallback(insufficient);
    setAnswer(insufficient
      ? [{ fact: "Insufficient evidence in the portfolio facts. This demo would rewrite the query and perform a simulated web-search fallback.", score: 0 }]
      : ranked);
  };

  return (
    <Section id="ask" title="Ask my portfolio" kicker="A browser-only retrieval demo over facts from this portfolio: keyword retrieval, evidence ranking and an insufficient-evidence fallback. No LLM or live web search is involved.">
      <Reveal>
        <div className="glass rounded-3xl p-6">
          <div className="mb-4 flex flex-wrap gap-2 font-mono text-xs text-slate-400" aria-label="Retrieval pipeline">
            {["1 Router", "2 Vector retrieval", "3 Evidence grader", fallback ? "4 Rewrite + web search (simulated)" : "4 Response"].map((stage, i) => (
              <span key={i} className={`rounded-full border px-3 py-1 ${answer.length && (i < 3 || i === 3) ? i === 3 && fallback ? "border-amber-400/50 text-amber-300" : "border-cyan/40 text-cyan" : "border-violet/25"}`}>{stage}</span>
            ))}
          </div>
          <form className="flex flex-wrap gap-3" onSubmit={(e) => { e.preventDefault(); retrieve(question); }}>
            <label className="sr-only" htmlFor="portfolio-question">Ask a question</label>
            <input id="portfolio-question" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. What vector databases has he used?"
              className="min-h-12 min-w-0 flex-1 rounded-xl border border-violet/40 bg-void px-4 text-slate-100 outline-none focus:border-cyan" />
            <button type="submit" className="flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-r from-violet to-cyan px-5 font-medium text-void"><Search size={16} />Retrieve</button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestions.map((q) => <button key={q} type="button" onClick={() => { setQuestion(q); retrieve(q); }} className="min-h-11 rounded-full border border-violet/30 px-4 text-sm text-slate-300 hover:border-cyan">{q}</button>)}
          </div>
          {answer.length > 0 && (
            <div className="mt-5 space-y-2" aria-live="polite">
              {answer.map((x, i) => <p key={i} className="rounded-xl bg-white/5 p-3 text-sm text-slate-300"><b className={`mr-2 font-mono ${fallback ? "text-amber-300" : "text-cyan"}`}>{x.score ? `Similarity ${x.score.toFixed(2)}` : "Fallback"}</b>{x.fact}</p>)}
            </div>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
