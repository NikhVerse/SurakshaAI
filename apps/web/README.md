# SurakshaAI — Web Frontend

### *Next.js 16 (Turbopack) Industrial Process Safety Intelligence Portal*

[![Next.js](https://img.shields.io/badge/Next.js-16.3_(Turbopack)-000000.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel Deployment](https://img.shields.io/badge/Live_Site-suraksha--ai--six.vercel.app-10b981.svg?logo=vercel&logoColor=white)](https://suraksha-ai-six.vercel.app/)

The web portal for **SurakshaAI** provides high-contrast, enterprise-grade visualization of industrial process safety telemetry, IOGP Report 459 critical barrier matrices, near-miss precursor clusters, and human-in-the-loop SIF triage queues.

---

## Key Frontend Features

1. **Live Edge Serverless Route Handlers (`app/api/v1/[...slug]/route.ts`)**:
   - Built-in Next.js route handlers serving full industrial telemetry directly over HTTPS.
   - Eliminates browser mixed-content blocks when deployed on Vercel (`https://suraksha-ai-six.vercel.app/`).
   - Dynamic in-memory state tracking for new reports, triage approvals, and alert acknowledgments.

2. **Calibrated Industrial Dataset (33 Records across 5 Assets)**:
   - Full coverage across **Mumbai High North**, **Digboi Refinery**, **Hazira LNG Terminal**, **Barmer Basin**, and **Paradip Petrochemicals**.
   - Individual incident reports include extracted NER entities, Platt-calibrated pSIF probabilities, SHAP feature importance vectors, and IOGP Life-Saving Rules.

3. **Governing Standards & Photographic Evidence Base**:
   - Ingested standards from IOGP (459), OSHA (1910.146), OISD (105), API (521), IEC (61511), and DGMS (04/2022).
   - Real photographic field proofs linked to physical barrier integrity tests.
   - Interactive RAG semantic search and document upload support.

4. **Global Design System (+1pt Typography Scale)**:
   - All text tokens scaled up by +1pt across headings, body, inputs, badges, and metadata in `app/globals.css` via modern `@theme` rules.
   - Clean, high-legibility font stack (`Inter`, `system-ui`).

5. **Ergonomic Multi-Column Registration Portal (`/signup`)**:
   - Balanced, responsive multi-column layout (names, demographics, roles, credentials).
   - Removed emoji and favicon clutter in favor of clean, accessible industrial inputs.
   - Strict standardized gender selection (`M`, `F`, `Other`).

---

## Quickstart

```bash
# Install dependencies
npm install

# Start development server with Turbopack
npm run dev

# Create optimized production build
npm run build

# Start production server
npm run start
```

Access the portal locally at `http://localhost:3000`.

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL for FastAPI backend (optional). When unset in browser, routes default to same-origin relative `/api/v1` | `""` (relative) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL for cloud authentication storage | Optional |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anonymous key | Optional |

---

*SurakshaAI Web Architecture — 2026.*
