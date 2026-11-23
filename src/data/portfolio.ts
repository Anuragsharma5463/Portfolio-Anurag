// Central, typed content file. Edit here; nothing else needs to change.
// Leave a URL as "" to hide its button. Social URLs can also come from env vars.
export type Experience = { role: string; company: string; period: string; points: string[] };
export type Project = {
  id: string; diagram: "rag" | "face" | "automation"; title: string; intro: string;
  stack: string[]; highlights: string[]; github: string; demo: string;
};

export const portfolio = {
  name: "Anurag Kumar Vishwakarma",
  firstName: "Anurag",
  location: "Mohali, Punjab, India",
  email: "anuragncc@gmail.com",
  resumePath: "/resume.pdf",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  social: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL ?? "",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "",
  },
  roles: ["AI/ML Engineer", "Generative AI Developer", "Agentic AI Engineer", "LLM & RAG Developer"],
  tagline: "I build intelligent AI systems that reason, retrieve knowledge, automate workflows, and transform complex problems into practical solutions.",
  about: [
    "I'm Anurag Kumar Vishwakarma, an AI/ML Engineer focused on building practical Generative AI applications, intelligent agents, Retrieval-Augmented Generation systems, and AI-powered automation platforms.",
    "My experience includes developing end-to-end AI applications, working with language models, building backend APIs, implementing vector search, and deploying containerized solutions.",
    "I enjoy turning emerging AI capabilities into reliable applications that solve meaningful real-world problems.",
  ],
  stats: [
    { value: "3", label: "End-to-End AI Projects" },
    { value: "4", label: "LLM API Ecosystems" },
    { value: "3", label: "Vector Search Technologies" },
    { value: "AI", label: "Engineering & LLM Evaluation experience" },
  ],
  skills: [
    { category: "Generative AI", items: ["Large Language Models", "Prompt Engineering", "Agentic RAG", "LangGraph", "LangChain", "Google ADK", "LLM Evaluation", "Hugging Face", "Claude", "OpenAI GPT-4", "Gemini", "Groq"] },
    { category: "Vector Search", items: ["Pinecone", "ChromaDB", "FAISS", "Embeddings", "Semantic Search"] },
    { category: "Machine Learning", items: ["PyTorch", "TensorFlow", "Scikit-learn", "NLP", "Computer Vision", "OpenCV"] },
    { category: "Backend & MLOps", items: ["FastAPI", "Flask", "Docker", "CI/CD", "AWS", "n8n"] },
    { category: "Programming & Data", items: ["Python", "SQL", "C++", "NumPy", "Pandas", "Git/GitHub"] },
  ],
  projects: [
    {
      id: "it-support-rag", diagram: "rag",
      title: "Enterprise IT Support Agentic RAG Copilot",
      intro: "An intelligent Agentic RAG copilot that routes user queries, retrieves information from a private knowledge base, evaluates evidence quality, and falls back to web search when internal knowledge is insufficient.",
      stack: ["LangGraph", "Pinecone", "Groq", "Tavily", "FastAPI", "Docker"],
      highlights: ["LangGraph-based agent orchestration", "Intelligent query routing", "Pinecone vector retrieval", "Evidence grading and query rewriting", "Tavily web-search fallback", "FastAPI backend", "Admin-protected document ingestion", "Hugging Face embeddings", "SQLite audit logging", "Docker deployment"],
      github: "", demo: "",
    },
    {
      id: "face-platform", diagram: "face",
      title: "AI Face Recognition Employee Management & Analytics Platform",
      intro: "An AI-powered employee management platform featuring face detection, identity verification, vector similarity search, and analytics.",
      stack: ["FastAPI", "React", "InsightFace", "PostgreSQL", "Docker"],
      highlights: ["RetinaFace face detection", "ArcFace 512-dimensional embeddings", "Camera/video-based enrollment", "Image quality gating", "HNSW vector indexing", "Cosine similarity matching", "Asynchronous background workers", "PostgreSQL analytics dashboard", "Docker Compose deployment"],
      github: "", demo: "",
    },
    {
      id: "genai-assistant", diagram: "automation",
      title: "Generative AI Assistant & Automation Platform",
      intro: "A modular generative AI assistant that combines intelligent task planning, contextual memory, speech interaction, NLP capabilities, and workflow automation.",
      stack: ["Python", "LangChain", "n8n"],
      highlights: ["Modular AI assistant architecture", "Pluggable task planning", "Contextual memory", "Speech-based interaction", "NLP reasoning", "Text summarization", "n8n workflow integration", "Third-party API automation"],
      github: "", demo: "",
    },
  ] as Project[],
  experience: [
    {
      role: "AI/ML Engineer Intern", company: "Ansh Infotech", period: "January 2026 – June 2026",
      points: ["Contributed to an M.Tech research project involving machine learning, deep learning, and computer vision.", "Enhanced LLM agents and RAG pipelines using Pinecone and ChromaDB retrieval.", "Worked on improving grounded responses and reducing inaccurate outputs.", "Containerized applications using Docker.", "Built GitHub-based CI/CD workflows."],
    },
    {
      role: "Prompt Engineer — LLM Evaluation & RLHF", company: "Outlier.ai", period: "2024 – 2025",
      points: ["Evaluated and ranked LLM responses.", "Assessed helpfulness, quality, and correctness.", "Refined prompts to improve answer quality.", "Fact-checked LLM outputs to identify hallucinations."],
    },
  ] as Experience[],
  education: { degree: "Bachelor of Technology — Computer Science Engineering", school: "Gulzar Group of Institutes, Ludhiana", period: "August 2022 – August 2026", cgpa: "7.5 / 10" },
  certifications: ["C++ Programming Training — RCPL (IIT Kanpur)", "LeetCode Star Badge"],
};
