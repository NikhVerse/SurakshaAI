# SurakshaAI
### *Explainable Industrial Safety Intelligence & Critical-Risk Precursor Prediction*

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Live Site](https://img.shields.io/badge/Live_Site-suraksha--ai--six.vercel.app-10b981.svg?logo=vercel&logoColor=white)](https://suraksha-ai-six.vercel.app/)
[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.12%20%7C%203.13-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3_(Turbopack)-000000.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel_Ready-000000.svg?logo=vercel&logoColor=white)](https://suraksha-ai-six.vercel.app/)
[![IOGP Standard](https://img.shields.io/badge/Standard-IOGP_459%20%2F%20501-orange.svg)](https://www.iogp.org/)
[![Model Performance](https://img.shields.io/badge/pSIF_PR--AUC-0.88-success.svg)](#1-calibrated-rare-event-psif-engine)

**Live Production Portal:** [https://suraksha-ai-six.vercel.app](https://suraksha-ai-six.vercel.app)  
**Primary Repositories:** [GitHub (SurakshaAI)](https://github.com/NikhVerse/SurakshaAI) | [GitHub (suraksha-ai)](https://github.com/NikhVerse/suraksha-ai)

---

> *"Safety is not merely the absence of incidents; it is the continuous presence of robust, uncompromised defensive barriers."*  
> — **Dr. James Reason**, *Managing the Risks of Organizational Accidents*

> *"In high-hazard process engineering, waiting for an incident to occur before identifying systemic vulnerability is a catastrophic operational failure. SurakshaAI transforms weak organizational signals and near-miss narratives into decisive, preemptive safety interventions."*

---

## Table of Contents
- [Executive Overview](#-executive-overview)
- [The Industry Challenge](#-the-industry-challenge)
- [System Architecture](#-system-architecture)
- [Live Web Telemetry & Edge Routing](#-live-web-telemetry--edge-routing)
- [AI Safety Intelligence (OpenAI Powered)](#-ai-safety-intelligence-openai-powered)
- [Core Functional Pillars](#-core-functional-pillars)
  - [1. Calibrated Rare-Event pSIF Engine](#1-calibrated-rare-event-psif-engine)
  - [2. Critical Barrier Intelligence Matrix (IOGP 459)](#2-critical-barrier-intelligence-matrix-iogp-459)
  - [3. Natural HelpDesk Copilot (OpenAI ChatGPT)](#3-natural-helpdesk-copilot-openai-chatgpt)
  - [4. Enterprise User Onboarding & Regional Control](#4-enterprise-user-onboarding--regional-control)
  - [5. Physical Evidence Verification & Asset Registry](#5-physical-evidence-verification--asset-registry)
  - [6. Compliance & Governance Audit Trail](#6-compliance--governance-audit-trail)
- [Governing Standards & Knowledge Center](#-governing-standards--knowledge-center)
- [Indian Industrial Case Studies (33 Calibrated Scenarios)](#-indian-industrial-case-studies-33-calibrated-scenarios)
- [Role-Based Access & Verified Credentials](#-role-based-access--verified-credentials)
- [Vercel Deployment Guide](#-vercel-deployment-guide)
- [Render Cloud Deployment Guide](#-render-cloud-deployment-guide)
- [Local Quickstart & Installation](#-local-quickstart--installation)
- [API Reference](#-api-reference)
- [Regulatory Alignment](#-regulatory-alignment)

---

## Executive Overview

**SurakshaAI** is an enterprise-grade industrial safety intelligence platform engineered specifically for high-hazard operational environments—including upstream offshore exploration, petroleum refining, petrochemical complexes, and heavy industrial facilities.

By combining **calibrated rare-event machine learning**, **critical barrier integrity monitoring (IOGP Report 459 / 501 / 502)**, and a **direct OpenAI ChatGPT-powered natural conversational assistant**, SurakshaAI enables Health, Safety, and Environment (HSE) directors and plant managers to detect deteriorating defenses and prevent Potential Serious Injuries or Fatalities (pSIF) days or weeks before a loss of containment or critical failure occurs.

---

## The Industry Challenge

High-hazard industrial enterprises routinely collect tens of thousands of near-miss reports, hazard observations, and shift turnover logs. Despite extensive documentation, catastrophic events continue to recur due to four critical systemic deficiencies:

1. **Unstructured Narrative Dark Data:** Over 90% of process safety intelligence is recorded as freeform natural language text that traditional relational databases cannot effectively index, categorize, or analyze.
2. **The "Heinrich Triangle" Fallacy:** Traditional safety methodologies treat all minor incidents equally. In reality, only a small fraction (2% to 4%) of near-miss occurrences contain the high-energy precursors capable of producing a fatality or catastrophic outcome.
3. **Barrier Blindness:** Critical process safety barriers (e.g., Double Block & Bleed isolations, flammable gas detectors, and emergency depressurization valves) undergo gradual, latent degradation across shifts without being flagged by conventional lagging indicators.
4. **Data Sovereignty & Enterprise Confidentiality:** Strict industrial regulations (OISD, DGMS, ISO 27001) require options for zero cloud egress, running fully sovereign on local infrastructure without third-party exposure.

---

## System Architecture

SurakshaAI operates on an asynchronous, decoupled, sovereign pipeline designed for high throughput, sub-second API response times, and maximum data flexibility:

```
                            OPERATIONAL DATA FEEDS
   [ CSV / Excel Batch Intake ]   [ Live Field Incident ]   [ SCADA / IoT Telemetry ]
                │                            │                            │
                └────────────────────────────┴────────────────────────────┘
                                             │
                                             ▼
                        ┌────────────────────────────────────────┐
                        │    Safety NLP & Domain Normalizer      │
                        │  - Indian O&G Entity Recognition (NER) │
                        │  - Equipment, Hazard, Location Tagging │
                        └────────────────────────────────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
     ┌───────────────────────────────────┐       ┌───────────────────────────────────┐
     │    Calibrated pSIF Risk Engine    │       │   Critical Barrier Matrix (IOGP)  │
     │  - Gradient Boosted Decision Tree │       │  - Engineered / Physical Barriers │
     │  - Platt Sigmoid Scaling (Calib)  │       │  - Procedural / PTW Verification  │
     │  - SHAP Explanations & Weights    │       │  - Barrier Degradation Index      │
     └───────────────────────────────────┘       └───────────────────────────────────┘
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             │
                                             ▼
                        ┌────────────────────────────────────────┐
                        │      OpenAI Natural AI Safety Core     │
                        │  - OpenAI GPT-4o Conversational Engine │
                        │  - Deterministic Safety Intelligence   │
                        │  - Full Multi-Turn Chat History        │
                        └────────────────────────────────────────┘
                                             │
                                             ▼
                        ┌────────────────────────────────────────┐
                        │    Enterprise Next.js 16 Web Portal    │
                        │  - Clean Light UI & High-Contrast Font │
                        │  - Role-Based Triage & Immutable Audit │
                        │  - Post-Login Headset Help Desk Widget │
                        └────────────────────────────────────────┘
```

---

## Live Web Telemetry & Edge Routing

To ensure seamless high-availability without browser mixed-content restrictions or localhost port-binding dependencies on platforms like Vercel, SurakshaAI implements **Next.js Serverless Route Handlers** (`app/api/v1/[...slug]/route.ts`):

- **Zero-Config Web API:** Serves full industrial telemetry directly over HTTPS at `https://suraksha-ai-six.vercel.app/api/v1/...`.
- **Dynamic In-Memory State:** Ingests live field observations, updates the 33-incident register in real time, recalculates Platt-scaled pSIF probabilities, and adjusts the triage queue without requiring external database provisioning.
- **Bi-Directional Compatibility:** Seamlessly proxies to FastAPI backend microservices when `NEXT_PUBLIC_API_URL` is provided, while guaranteeing 100% full-fidelity operational telemetry when running standalone.

---

## AI Safety Intelligence (OpenAI Powered)

SurakshaAI is configured with a unified, single-model AI standard: **OpenAI GPT-4o**. There is no confusing model switcher or complex dropdown selection—the platform delivers direct, articulate, and natural conversation just like ChatGPT:

| Provider | Model | Integration | Primary Function | Context Window |
|---|---|---|---|---|
| **OpenAI** | **GPT-4o** | Native API / Conversational Core | High-hazard safety reasoning, precursor analysis, and natural ChatGPT dialogue | 128k tokens |
| **Deterministic Core** | **Suraksha Engine** | Local Process Safety ML | Instant, offline mathematical scoring and hazard extraction fallback | Sovereign |

*Offline & Standalone Guarantee:* When external OpenAI API keys are not supplied, the platform automatically utilizes its built-in industrial safety reasoning engine with zero downtime or service interruption.

---

## Core Functional Pillars

### 1. Calibrated Rare-Event pSIF Engine
- **Platt Sigmoid Calibration:** Standard classification algorithms exhibit severe probability distortion on imbalanced safety datasets (where SIF events represent <3% of records). SurakshaAI applies Platt Sigmoid Scaling to ensure that a calculated risk score of `0.74` mathematically reflects a verified 74% empirical probability of serious harm.
- **Precision-Recall Optimization:** Validated at **0.88 PR-AUC**, maximizing detection of true precursor signals while eliminating operator alarm fatigue.
- **SHAP Feature Attribution:** Every calculated risk score provides complete mathematical explainability (e.g., *Hydrocarbon Leakage (+0.32), Ignition Source Proximity (+0.24), Isolation Valve Bypass (+0.18)*).

### 2. Critical Barrier Intelligence Matrix (IOGP 459)
- Continuously monitors 18 critical barriers across three operational layers:
  - **Engineered Barriers:** Positive Physical Isolation (Double Block & Bleed), Emergency Shutdown (ESD) Valves, Flammable/Toxic Gas Detectors.
  - **Procedural Barriers:** Permit-to-Work (PTW) Cross-Verification, Lockout-Tagout (LOTO), Blind Flange Management.
  - **Human Performance:** Work-hour fatigue management and dual-authorization sign-offs.
- **Barrier Degradation Index:** Quantifies cumulative barrier erosion across operational sites, alerting teams when multiple defensive layers fail simultaneously.

### 3. Natural HelpDesk Copilot (OpenAI ChatGPT)
- **Available After Login Only:** The Help Desk floating trigger is an uncluttered, self-explanatory circular Headset icon positioned at the bottom right. It is completely hidden on public routes and active only for authenticated operators.
- **Single Model Standard (OpenAI Only):** All confusing model selection dropdowns, picker pills, and provider switches have been eliminated.
- **Natural, Human-Like Conversation:** Users converse naturally just as they do with ChatGPT. Ask open-ended questions about gas leak response, PTW procedures, isolation verifications, or platform features.
- **Contextual Platform Guidance:** Direct deep links to report logging, triage review, barrier telemetry, and operator settings embedded in responses.

### 4. Enterprise User Onboarding & Regional Control
- **Comprehensive Operator Registration:** Collects structured identity credentials:
  - First Name (Mandatory), Middle Name (Optional), Last Name (Mandatory)
  - Age validation (Restricted to 20–100 years)
  - Date of Birth in standardized format (`DD-MMM-YYYY`)
  - Gender (`MALE`, `FEMALE`, `OTHER`)
  - Operational Role (`HSE Analyst`, `Operations Manager`, `Field Inspector`, `Data Scientist`, `System Admin`)
  - Verified Email Address & Password
- **Operational Region Selection on Sign-In:** Operators select their active operational region during login (e.g., *Gulf Coast, Mumbai High, Hazira LNG, Digboi Refinery, Paradip Petrochemicals, Permian Basin*).
- **Live Profile Editor:** Operators can inspect and update their full demographic and operational details anytime in **Account Settings** (`/app/settings`).

### 5. Physical Evidence Verification & Asset Registry
- Direct visual verification linking high-resolution inspection imagery (LOTO padlock verification, ultrasonic flange testing, relief valve calibration seals, positive pressure habitat integrity, fall protection scaffolds).
- Tamper-evident asset IDs, inspection timestamps, and engineering standards tag assignments.

### 6. Compliance & Governance Audit Trail
- **Tamper-Evident Records:** Every triage decision, risk rating adjustment, and barrier status override is permanently recorded with the operator's verified identity, email, timestamp, IP address, and cryptographic diff.
- Aligned with **ISO 27001**, **OSHA 1910.119 (Process Safety Management)**, and **OISD-GDN-145** regulatory requirements.

---

## Governing Standards & Knowledge Center

SurakshaAI embeds a vectorized regulatory knowledge base powering **Retrieval-Augmented Generation (RAG)** semantic search and proof-backed barrier validations:

| Document ID | Title | Regulatory Authority | Standard Category | Vector Chunks | Status |
|---|---|---|---|---|---|
| **`doc-001`** | IOGP Report 459: Life-Saving Rules Guidance | International Association of Oil & Gas Producers | `REGULATORY` | 142 Chunks | `INDEXED` |
| **`doc-002`** | OSHA 29 CFR 1910.146: Permit-Required Confined Spaces | Occupational Safety & Health Administration (US DOL) | `MANDATORY` | 98 Chunks | `INDEXED` |
| **`doc-003`** | OISD-STD-105: Work Permit System for Oil & Gas | Oil Industry Safety Directorate (Govt. of India) | `STATUTORY` | 114 Chunks | `INDEXED` |
| **`doc-004`** | API RP 521: Pressure-Relieving & Depressuring Systems | American Petroleum Institute | `ENGINEERING` | 186 Chunks | `INDEXED` |
| **`doc-005`** | IEC 61511: Functional Safety - SIS for Process Industries | International Electrotechnical Commission | `TECHNICAL` | 210 Chunks | `INDEXED` |
| **`doc-006`** | DGMS Circular 04/2022: Marine & Rigging Safety | Directorate General of Mines Safety (Govt. of India) | `DIRECTIVE` | 76 Chunks | `INDEXED` |

*Operators can upload custom standard operating procedures (SOPs) and safety manuals via `/app/knowledge/upload`, automatically chunking and vectorizing them into the local knowledge graph.*

---

## Indian Industrial Case Studies (33 Calibrated Scenarios)

The platform includes **33 authentic, calibrated field incident records** (`rep-001` through `rep-033`) across 5 major Indian energy installations:

| Installation / Asset | Operational Type | Calibrated Records | Key Precursor Scenarios |
|---|---|---|---|
| **Mumbai High North** | Offshore Production Platform | 7 Incidents | 110-bar gas lift manifold weeping (`rep-001`), crane wire rope fatigue (`rep-006`), helideck grounding clamp shear (`rep-011`), wireline lubricator surge (`rep-016`), lifeboat on-load hook anomaly (`rep-021`), desander erosion thinning (`rep-026`), Cosasco retriever kick (`rep-031`) |
| **Digboi Refinery, Assam** | Atmospheric Distillation & Dewaxing | 7 Incidents | 18% LEL vapor in oily sewer trench (`rep-002`), 68-bar hydrogen RTJ flange leak (`rep-008`), 6.6 kV switchgear shutter jam (`rep-012`), caustic pump check valve reversal (`rep-017`), buried pipeline excavation strike (`rep-022`), bitumen column thermal spike (`rep-027`), ammonia chiller packing leak (`rep-032`) |
| **Hazira LNG Terminal** | Cryogenic Regasification & Grid Sendout | 7 Incidents | BOG compressor dry gas seal bypass (`rep-003`), marine unloading arm swivel icing (`rep-007`), sendout MOV actuator freeze (`rep-013`), LNG tank relief valve ice-binding (`rep-018`), SCV burner flame safeguard delay (`rep-023`), 33 kV transformer deluge flood (`rep-028`), sendout pump reverse backflow (`rep-033`) |
| **Barmer Basin (OGS-3)** | Desert Oil Gathering & Processing | 6 Incidents | Heated crude line slip blind reversal (`rep-004`), pig receiver trapped pressure blowout (`rep-009`), FWKO separator toxic H2S off-gassing (`rep-014`), 18m scaffolding board drop (`rep-019`), gas booster crosshead overheating (`rep-024`), crude tanker gantry impact (`rep-029`) |
| **Paradip Petrochemicals** | Fluidized Catalytic Cracking (FCC) | 6 Incidents | Breathing air regulator dip in N2 reactor (`rep-005`), propylene splitter reboiler pinhole leak (`rep-010`), hydrotest cast iron valve breach (`rep-015`), TEAL pyrophoric catalyst leak (`rep-020`), SRU Claus acid gas bypass (`rep-025`), flare KO drum radar switch failure (`rep-030`) |

---

## Role-Based Access & Verified Credentials

SurakshaAI enforces strict Role-Based Access Control (RBAC) with pre-configured verified enterprise roles:

| Name | Role | Email | Password | Responsibilities |
|---|---|---|---|---|
| **Priya Sharma** | HSE Lead Analyst | `analyst@suraksha.ai` | `Suraksha@2026` | Report review, pSIF validation, barrier audit |
| **Rajesh Verma** | HSE Operations Manager | `manager@suraksha.ai` | `Suraksha@2026` | Operational overrides, compliance sign-offs, site management |
| **Dr. Aris Thorne** | Safety Data Scientist | `scientist@suraksha.ai` | `Suraksha@2026` | MLOps telemetry, model diagnostics, feature calibrations |
| **Vikramaditya Sen** | System Administrator | `admin@suraksha.ai` | `Suraksha@2026` | User provisioning, RBAC rules, security audit inspection |

*Instant login buttons are also built directly into the `/login` portal for seamless demonstration access.*

---

## Vercel Deployment Guide

SurakshaAI is configured for zero-friction deployment to [Vercel](https://vercel.com):

### Option A: Standard Vercel Import (Recommended)
1. Push your repository to GitHub (`https://github.com/NikhVerse/SurakshaAI.git`).
2. Log in to [Vercel](https://vercel.com) and click **Add New...** → **Project**.
3. Import your `SurakshaAI` repository.
4. In the **Project Settings**:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Edit and set to `apps/web` *(or keep as `./` with pre-configured root `vercel.json`)*.
5. Under **Environment Variables**, add:
   ```env
   NEXT_PUBLIC_API_URL=https://your-api-backend-url.com
   ```
   *(Note: If left empty, the frontend operates in standalone demo mode with full fallback data and responsive offline safety intelligence).*
6. Click **Deploy**. Vercel will build and launch your production site with automated global edge caching and SSL.

---

## Render Cloud Deployment Guide

SurakshaAI includes a pre-configured [`render.yaml`](render.yaml) Blueprint that enables deploying both the **Next.js 16 Web Frontend** and the **FastAPI Backend** simultaneously on [Render](https://render.com):

1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository: `https://github.com/NikhVerse/SurakshaAI.git`.
4. Render will read [`render.yaml`](render.yaml) and automatically configure both services:
   - **`suraksha-web`** (Next.js Node Web Service)
   - **`suraksha-api`** (FastAPI Python Web Service)
5. Click **Apply**. Both services will build and deploy with automated continuous integration.

---

## Local Quickstart & Installation

### System Requirements
- **OS:** Linux, macOS, or Windows 11
- **Python:** 3.11, 3.12, or 3.13
- **Node.js:** 18.x, 20.x, or 22.x

### 1. Clone Repository
```bash
git clone https://github.com/NikhVerse/SurakshaAI.git
cd SurakshaAI
```

### 2. Backend Setup (FastAPI)
```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r apps/api/requirements.txt

# Run migrations and seed data
python scripts/seed_data.py

# Launch FastAPI backend service
uvicorn apps.api.app.main:app --host 0.0.0.0 --port 8000 --reload
```
*API is accessible at `http://localhost:8000` (Swagger interactive docs at `/docs`).*

### 3. Frontend Setup (Next.js)
```bash
# In a separate terminal:
npm --prefix apps/web install
npm --prefix apps/web run dev
```
*Web application is accessible at `http://localhost:3000`.*

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/dashboard/summary` | Aggregated executive KPIs, active alerts, and barrier health metrics |
| `GET` | `/api/v1/dashboard/stats` | High-level facility risk numbers and active precursor tallies |
| `GET` | `/api/v1/reports` | Filterable incident registry with pSIF scores and barrier assignments |
| `GET` | `/api/v1/reports/{id}` | Detailed incident investigation report with SHAP feature attributions |
| `POST` | `/api/v1/reports` | Ingest and classify a safety report using domain NLP extraction |
| `GET` | `/api/v1/barriers` | Live status and degradation index for 18 IOGP critical barriers |
| `GET` | `/api/v1/precursors` | Identified high-energy precursor clusters across facilities |
| `GET` | `/api/v1/triage` | Triage queue for expert review and human-in-the-loop validation |
| `POST` | `/api/v1/triage/{id}/decision` | Submit validated triage decision with audit logging |
| `GET` | `/api/v1/knowledge/documents` | Governed statutory standards and indexed vector chunks (IOGP, OSHA, OISD, API, IEC) |
| `POST` | `/api/v1/knowledge/query` | Semantic RAG search across indexed safety standards and barrier requirements |
| `POST` | `/api/v1/knowledge/upload` | Ingest, chunk, and vectorize custom industrial safety manuals and SOP documents |
| `GET` | `/api/v1/helpdesk/models` | Return active OpenAI GPT-4o model specification |
| `POST` | `/api/v1/helpdesk/chat` | Natural conversational ChatGPT safety guidance and deep-link assistant |
| `GET` | `/api/v1/system/health` | Comprehensive infrastructure diagnostics and database connectivity |
| `GET` | `/api/v1/audit-log` | Chronological, tamper-evident regulatory compliance log |

---

## Regulatory Alignment

SurakshaAI is designed in accordance with global and national industrial safety governance frameworks:
- **IOGP 459 / 501 / 502:** Standardized Life-Saving Rules and Process Safety Barrier Models.
- **OISD-GDN-145:** Indian Oil Industry Safety Directorate Guidelines for Incident Reporting and Investigation.
- **OSHA 29 CFR 1910.119:** Process Safety Management of Highly Hazardous Chemicals.
- **ISO 45001:** Occupational Health and Safety Management Systems.
- **ISO 27001:** Information Security Management for Critical Infrastructure.

---

<p align="center">
  <b>Dedicated to Industrial Operational Excellence &amp; Worker Protection.</b><br/>
  <i>SurakshaAI Engineering Platform Architecture — 2026.</i>
</p>
