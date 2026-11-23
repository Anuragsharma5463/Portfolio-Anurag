"use client";
import { useState } from "react";

type N = { id: string; label: string; x: number; y: number; detail: string };
type D = { nodes: N[]; edges: [string, string][]; caption: string };

export const diagrams: Record<string, D> = {
  rag: {
    caption: "Simulated agentic RAG flow. Illustrative only: no live backend calls happen here.",
    nodes: [
      { id: "q", label: "User Query", x: 65, y: 50, detail: "The question enters the graph." },
      { id: "r", label: "Router", x: 195, y: 50, detail: "Decides whether the question needs the private knowledge base." },
      { id: "p", label: "Pinecone Retrieval", x: 325, y: 50, detail: "Embeds the query and fetches the closest knowledge-base chunks." },
      { id: "g", label: "Evidence Grader", x: 455, y: 50, detail: "Judges whether retrieved evidence is good enough to answer." },
      { id: "a", label: "Response", x: 580, y: 50, detail: "Generates the final grounded answer." },
      { id: "w", label: "Query Rewriter", x: 455, y: 170, detail: "If evidence is insufficient, reformulates the query for a better search." },
      { id: "t", label: "Tavily Search", x: 325, y: 170, detail: "Web-search fallback when internal knowledge is not enough." },
    ],
    edges: [["q", "r"], ["r", "p"], ["p", "g"], ["g", "a"], ["g", "w"], ["w", "t"], ["t", "a"]],
  },
  face: {
    caption: "Simulated identity-matching pipeline. No real biometric data is shown and no accuracy is claimed.",
    nodes: [
      { id: "c", label: "Camera Capture", x: 65, y: 50, detail: "Camera or video frames used for enrollment and verification." },
      { id: "d", label: "RetinaFace", x: 195, y: 50, detail: "Detects faces and landmarks in each frame." },
      { id: "qg", label: "Quality Gate", x: 325, y: 50, detail: "Rejects blurry, dark or badly posed images before they reach the index." },
      { id: "e", label: "ArcFace 512-d", x: 455, y: 50, detail: "Turns an aligned face into a 512-dimensional embedding." },
      { id: "h", label: "HNSW Search", x: 580, y: 50, detail: "Approximate nearest-neighbour search over stored embeddings." },
      { id: "m", label: "Cosine Match", x: 580, y: 170, detail: "Compares similarity of the nearest candidates against a threshold." },
      { id: "an", label: "Analytics", x: 440, y: 170, detail: "Match events feed the PostgreSQL-backed analytics dashboard." },
    ],
    edges: [["c", "d"], ["d", "qg"], ["qg", "e"], ["e", "h"], ["h", "m"], ["m", "an"]],
  },
  automation: {
    caption: "Simulated automation network. Illustrative only: no workflow is executed here.",
    nodes: [
      { id: "h", label: "AI Assistant", x: 320, y: 130, detail: "Central orchestrator that plans tasks and calls modules." },
      { id: "pl", label: "Task Planner", x: 100, y: 50, detail: "Pluggable planning step that breaks a request into actions." },
      { id: "me", label: "Memory", x: 100, y: 210, detail: "Keeps conversational context between turns." },
      { id: "sp", label: "Speech I/O", x: 320, y: 30, detail: "Speech-based interaction in and out." },
      { id: "nl", label: "NLP / Summaries", x: 540, y: 50, detail: "NLP reasoning and text summarization." },
      { id: "n8", label: "n8n Workflow", x: 540, y: 210, detail: "Triggers n8n workflows for automation." },
      { id: "ap", label: "Third-party APIs", x: 320, y: 225, detail: "External services reached through workflows." },
    ],
    edges: [["h", "pl"], ["h", "me"], ["h", "sp"], ["h", "nl"], ["h", "n8"], ["n8", "ap"]],
  },
};

export function FlowDiagram({ id, title }: { id: string; title: string }) {
  const d = diagrams[id];
  const [sel, setSel] = useState(d.nodes[0].id);
  const by = Object.fromEntries(d.nodes.map((n) => [n.id, n]));
  return (
    <figure>
      <svg viewBox="0 0 640 260" role="group" aria-label={`${title} diagram`} className="w-full">
        {d.edges.map(([a, b]) => (
          <line key={a + b} x1={by[a].x} y1={by[a].y} x2={by[b].x} y2={by[b].y} stroke="#22D3EE" strokeOpacity=".7" strokeWidth="1.5" className="flow-line" />
        ))}
        {d.nodes.map((n) => {
          const on = sel === n.id;
          return (
            <g key={n.id} role="button" tabIndex={0} aria-pressed={on} aria-label={`${n.label}: ${n.detail}`} className="cursor-pointer"
              onClick={() => setSel(n.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSel(n.id))}>
              <rect x={n.x - 56} y={n.y - 18} width="112" height="36" rx="10" fill="#0b1024" stroke={on ? "#22D3EE" : "#8B5CF6"} strokeWidth={on ? 2 : 1} />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fill="#e6e8f5" fontSize="10.5" fontFamily="var(--font-mono)">{n.label}</text>
            </g>
          );
        })}
      </svg>
      <p aria-live="polite" className="mt-2 min-h-12 rounded-lg bg-white/5 p-3 text-sm text-slate-200"><strong className="text-cyan">{by[sel].label}:</strong> {by[sel].detail}</p>
      <figcaption className="mt-2 text-xs text-slate-400">{d.caption}</figcaption>
    </figure>
  );
}

const pts: [number, number][] = [[60,40],[100,30],[140,40],[45,80],[155,80],[75,70],[125,70],[100,95],[80,125],[100,132],[120,125],[60,150],[100,170],[140,150]];
export function LandmarkViz() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Abstract facial landmark points joined by vector lines" className="mx-auto mb-4 h-40">
      {pts.map((p, i) => pts.slice(i + 1, i + 4).map((q, j) => <line key={`${i}-${j}`} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke="#8B5CF6" strokeOpacity=".5" />))}
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#22D3EE" className="pulse-dot" style={{ animationDelay: `${i * 0.15}s` }} />)}
    </svg>
  );
}
