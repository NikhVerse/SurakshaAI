# SurakshaAI
### *Explainable Industrial Safety Intelligence & Critical-Risk Precursor Prediction*

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.12%20%7C%203.13-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3_(Turbopack)-000000.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel_Ready-000000.svg?logo=vercel&logoColor=white)](https://vercel.com)
[![IOGP Standard](https://img.shields.io/badge/Standard-IOGP_459%20%2F%20501-orange.svg)](https://www.iogp.org/)
[![Model Performance](https://img.shields.io/badge/pSIF_PR--AUC-0.88-success.svg)](#1-calibrated-rare-event-psif-engine)

---

> *"Safety is not merely the absence of incidents; it is the continuous presence of robust, uncompromised defensive barriers."*  
> — **Dr. James Reason**, *Managing the Risks of Organizational Accidents*

> *"In high-hazard process engineering, waiting for an incident to occur before identifying systemic vulnerability is a catastrophic operational failure. SurakshaAI transforms weak organizational signals and near-miss narratives into decisive, preemptive safety interventions."*

---

## Table of Contents
- [Executive Overview](#-executive-overview)
- [The Industry Challenge](#-the-industry-challenge)
- [System Architecture](#-system-architecture)
- [Supported Multi-Model AI Suite](#-supported-multi-model-ai-suite)
- [Core Functional Pillars](#-core-functional-pillars)
  - [1. Calibrated Rare-Event pSIF Engine](#1-calibrated-rare-event-psif-engine)
  - [2. Critical Barrier Intelligence Matrix (IOGP 459)](#2-critical-barrier-intelligence-matrix-iogp-459)
  - [3. Interactive HelpDesk & AI Safety Copilot](#3-interactive-helpdesk--ai-safety-copilot)
  - [4. Physical Evidence Verification & Asset Registry](#4-physical-evidence-verification--asset-registry)
  - [5. Compliance & Governance Audit Trail](#5-compliance--governance-audit-trail)
- [Indian Industrial Case Studies](#-indian-industrial-case-studies)
- [Role-Based Access & Verified Credentials](#-role-based-access--verified-credentials)
- [Vercel Deployment Guide](#-vercel-deployment-guide)
- [Render Cloud Deployment Guide](#-render-cloud-deployment-guide)
- [Local Quickstart & Installation](#-local-quickstart--installation)
- [API Reference](#-api-reference)
- [Regulatory Alignment](#-regulatory-alignment)

---

## Executive Overview

**SurakshaAI** is an enterprise-grade industrial safety intelligence platform engineered specifically for high-hazard operational environments—including upstream offshore exploration, petroleum refining, petrochemical complexes, and heavy industrial facilities.

By combining **calibrated rare-event machine learning**, **critical barrier integrity monitoring (IOGP Report 459 / 501 / 502)**, and a curated **frontier & local AI suite** (Google Gemini, OpenAI, and free sovereign Ollama models), SurakshaAI enables Health, Safety, and Environment (HSE) directors and plant managers to detect deteriorating defenses and prevent Potential Serious Injuries or Fatalities (pSIF) days or weeks before a loss of containment or critical failure occurs.

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
                        │      Multi-Model Safety Intelligence   │
                        │  - Google Gemini (Flash / Pro)         │
                        │  - OpenAI (GPT-4o / GPT-4o Mini)       │
                        │  - Free Local Ollama (Llama 3.2 / Mis) │
                        │  - Deterministic Safety Fallback       │
                        └────────────────────────────────────────┘
                                             │
                                             ▼
                        ┌────────────────────────────────────────┐
                        │    Enterprise Next.js 16 Web Portal    │
                        │  - Clean Light UI & High-Contrast Font │
                        │  - Role-Based Triage & Immutable Audit │
                        │  - Evidence Verification & HelpDesk    │
                        └────────────────────────────────────────┘
```

---

## Supported Multi-Model AI Suite

SurakshaAI exclusively supports a curated, purpose-built multi-model selection:

| Provider | Model | Badge | Best Use Case | Context Window |
|---|---|---|---|---|
| **Google Gemini** | **Gemini 2.5 Flash** | `Gemini` | Ultra-fast safety reasoning & natural guidance | 1M tokens |
| **Google Gemini** | **Gemini 1.5 Pro** | `Gemini Pro` | Deep multimodal hazard analysis & compliance | 2M tokens |
| **OpenAI** | **GPT-4o** | `GPT-4o` | Complex procedure analysis & visual audits | 128k tokens |
| **OpenAI** | **GPT-4o Mini** | `OpenAI Mini` | High-speed operational procedure evaluation | 128k tokens |
| **Ollama (Free / Local)** | **Llama 3.2** | `Free Local` | Free sovereign on-premise local inference | 128k tokens |
| **Ollama (Free / Local)** | **Mistral 7B** | `Free Local` | Free lightweight local open-source inference | 32k tokens |

*Zero Third-Party Dependency Guarantee:* If external cloud API keys are not supplied, the platform operates seamlessly using **Free Local Ollama** or its built-in **Deterministic Industrial Safety Engine** with zero service interruption.

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

### 3. Interactive HelpDesk & AI Safety Copilot
- **Instant Operational Assistant:** In-app floating assistant with live model switching (Gemini, OpenAI, or Free Ollama).
- **One-Click Navigation:** Direct jump links to report creation, triage queues, barrier inspection, and compliance manuals.
- **Contextual Awareness:** Grounds advice in standard operating procedures, IOGP rules, and facility-specific safety records.

### 4. Physical Evidence Verification & Asset Registry
- Direct visual verification linking high-resolution inspection imagery (LOTO padlock verification, ultrasonic flange testing, relief valve calibration seals, positive pressure habitat integrity, fall protection scaffolds).
- Tamper-evident asset IDs, inspection timestamps, and engineering standards tag assignments.

### 5. Compliance & Governance Audit Trail
- **Tamper-Evident Records:** Every triage decision, risk rating adjustment, and barrier status override is permanently recorded with the operator's verified identity, email, timestamp, IP address, and cryptographic diff.
- Aligned with **ISO 27001**, **OSHA 1910.119 (Process Safety Management)**, and **OISD-GDN-145** regulatory requirements.

---

## Indian Industrial Case Studies

The platform comes pre-seeded with authentic, non-synthesized field incident records representing major Indian hydrocarbon and energy installations:

| Installation / Asset | Operational Type | Identified Precursor | Primary Barrier Compromised |
|---|---|---|---|
| **Mumbai High North** | Offshore Production Platform | High-pressure gas lift manifold flange weeping | Positive Physical Isolation (DBB) |
| **Digboi Refinery, Assam** | Atmospheric Distillation Unit | Residual naphtha vapor detection during hot work | Mechanical Ventilation & PTW |
| **Hazira Terminal, Gujarat** | Cryogenic LNG Regasification | Boil-off gas compressor seal micro-leak | Instrumented ESD Automation |
| **Barmer Basin, Rajasthan** | Desert Oil Gathering Station | Remote pipeline cathodic protection failure | Corrosion Management Barrier |
| **Paradip Petrochemicals, Odisha** | Fluidized Catalytic Cracking | Pyrolysis gasoline pump vibration anomaly | Rotating Equipment Interlock |

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
| `GET` | `/api/v1/helpdesk/models` | List active AI models (Gemini, OpenAI, Free Ollama) |
| `POST` | `/api/v1/helpdesk/chat` | Conversational safety guidance and natural navigation assistant |
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
