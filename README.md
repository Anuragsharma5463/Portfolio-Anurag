# Anurag Kumar Vishwakarma: AI/ML Engineer Portfolio

Next.js 14 (App Router) · TypeScript · Tailwind CSS · React Three Fiber · Framer Motion. No database, no API keys, no backend.

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production check
npm run typecheck
```

## Edit content
Everything lives in `src/data/portfolio.ts` (bio, skills, projects, experience, education).

## Social links
Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_GITHUB_URL`, `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_SITE_URL`. On Vercel add the same names under Project → Settings → Environment Variables. Empty values hide the matching buttons. Per-project `github` / `demo` URLs are set in `portfolio.ts`; empty ones are hidden.

## Add your resume
Put your PDF at `public/resume.pdf`. The build works without it, but the Download Resume buttons will 404 until it exists.

## Replace concept visuals with real screenshots
Drop images into `public/images/`, then render them with `next/image` (with meaningful `alt` text) in `src/components/sections/Projects.tsx` beside or instead of `FlowDiagram`.

## Deploy to Vercel
Push to GitHub → vercel.com/new → import the repo → framework auto-detected as Next.js → set the env vars → Deploy.

## Notes
- The 3D hero/contact core is procedural (no model files), lazy-loaded, DPR-capped, reduced on mobile, and static when `prefers-reduced-motion` is set. Without WebGL the page still works.
- Project diagrams are labelled simulations; they make no live backend calls.

## Two versions in this zip
- **`/` (Next.js app):** the original architecture (React Three Fiber hero, typed content in `src/data/portfolio.ts`). It does not yet include the newest add-ons below.
- **`standalone/index.html`:** the complete, latest design as one self-contained file. It includes your photo, ERAA 3D scene, Google ADK section, 3D skill sphere, scroll-driven 3D background, particle morph playground, neural-network lab, retrieval demo ("Ask my portfolio") and the Ctrl/Cmd+K menu. Open it directly in a browser, or deploy it to Vercel by importing this repo with **Root Directory = `standalone`** (Framework: Other). Put `resume.pdf` beside `index.html`. GitHub/LinkedIn buttons are not in this version yet: add `<a class="b" href="YOUR_URL">GitHub</a>` in the Contact section when you have real URLs.
- `public/images/anurag.jpg` is your cropped portrait, ready for use in the Next.js app with `next/image`.
