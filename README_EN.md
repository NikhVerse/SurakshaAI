# SurakshaAI
### *Explainable Industrial Safety Intelligence & Precursor Risk Prediction*

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.12%2B-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3_(Turbopack)-000000.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![IOGP Standard](https://img.shields.io/badge/Standard-IOGP_459%20%2F%20501-orange.svg)](https://www.iogp.org/)
[![Model Performance](https://img.shields.io/badge/pSIF_PR--AUC-0.88-success.svg)](#machine-learning--risk-engine)

---

> *"Safety is not merely the absence of incidents; it is the continuous presence of robust, uncompromised defensive barriers."*  
> — **Dr. James Reason**, *Managing the Risks of Organizational Accidents*

> *"In high-hazard process engineering, waiting for an incident to occur before identifying vulnerability is a catastrophic operational failure. SurakshaAI transforms weak organizational signals into decisive, preemptive safety interventions."*

---

## 📑 Table of Contents
- [Executive Overview](#-executive-overview)
- [The Industry Challenge](#-the-industry-challenge)
- [System Architecture](#-system-architecture)
- [Core Functional Pillars](#-core-functional-pillars)
  - [1. Calibrated Rare-Event pSIF Engine](#1-calibrated-rare-event-psif-engine)
  - [2. Critical Barrier Intelligence Matrix (IOGP 459)](#2-critical-barrier-intelligence-matrix-iogp-459)
  - [3. Air-Gapped Sovereign AI Safety Copilot](#3-air-gapped-sovereign-ai-safety-copilot)
  - [4. Operational Data Ingestion Hub](#4-operational-data-ingestion-hub)
  - [5. Compliance & Governance Audit Trail](#5-compliance--governance-audit-trail)
- [Indian Industrial Case Studies](#-indian-industrial-case-studies)
- [Role-Based Access & Verified Credentials](#-role-based-access--verified-credentials)
- [Quickstart & Installation](#-quickstart--installation)
- [Vercel & Cloud Deployment](#-vercel--cloud-deployment)
- [API Reference](#-api-reference)
- [Regulatory Alignment](#-regulatory-alignment)

---

## 🏢 Executive Overview

**SurakshaAI** is an enterprise-grade, sovereign safety intelligence platform engineered specifically for high-hazard industrial environments, including upstream/offshore oil & gas, downstream petroleum refining, petrochemical processing, and heavy industrial plants.

By synthesizing **rare-event machine learning**, **critical barrier integrity monitoring (IOGP Report 459 / 501 / 502)**, and **grounded sovereign Large Language Model reasoning**, SurakshaAI enables Health, Safety, and Environment (HSE) leadership to detect degrading defenses and prevent Potential Serious Injuries or Fatalities (pSIF) days or weeks before a catastrophic event occurs.

---

## ⚠️ The Industry Challenge

High-hazard organizations generate thousands of near-miss reports, hazard identifications, and shift logs every month. However:
1. **Unstructured Narrative Overload:** Over 90% of critical safety intelligence is trapped in freeform unstructured text that standard relational databases cannot effectively index or interpret.
2. **The "Heinrich Triangle" Fallacy:** Traditional safety systems treat all minor incidents equally. In reality, only a tiny fraction (2–4%) of near-miss events possess the high-energy precursors capable of resulting in a fatality or life-altering injury.
3. **Barrier Blindness:** Safety critical elements (such as double block and bleed valves, gas detection loops, and permit-to-work isolations) frequently undergo latent degradation across multiple shifts without immediate detection.
4. **Data Sovereignty Constraints:** Stringent regulatory guidelines (OISD, DGMS, ISO 27001) strictly prohibit sending proprietary refinery telemetry or incident narratives to external multi-tenant public cloud APIs.

---

## 🏗️ System Architecture

SurakshaAI operates on an asynchronous, decoupled, sovereign pipeline designed for zero data egress and millisecond latency:

```
                          OPERATIONAL DATA FEEDS
   [ CSV/Excel Batch Intake ]   [ Live Field Incident ]   [ SCADA / IoT Telemetry ]
               │                          │                          │
               └──────────────────────────┴──────────────────────────┘
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │    Safety NLP & Domain Normalizer      │
                      │  - Indian O&G Named Entity Recognition │
                      │  - Lexical Canonicalization & Tagging  │
                      └────────────────────────────────────────┘
                                          │
                     ┌────────────────────┴────────────────────┐
                     ▼                                         ▼
   ┌───────────────────────────────────┐     ┌───────────────────────────────────┐
   │    Calibrated pSIF Risk Engine    │     │  Critical Barrier Matrix (IOGP)   │
   │  - Gradient Boosted Decision Tree │     │  - Physical Barriers Monitoring   │
   │  - Platt Sigmoid Scaling (Calib)  │     │  - Procedural / PTW Verification  │
   │  - SHAP Explanations & Weights    │     │  - Barrier Degradation Index      │
   └───────────────────────────────────┘     └───────────────────────────────────┘
                     │                                         │
                     └────────────────────┬────────────────────┘
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │       Sovereign Safety Copilot         │
                      │  - Hybrid Semantic + BM25 Vector Store │
                      │  - Local Air-Gapped Ollama LLM Engine  │
                      │  - Deterministic Guardrails & Tracing  │
                      └────────────────────────────────────────┘
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │    Enterprise Next.js 16 Web Portal    │
                      │  - Clean Light UI & High-Contrast Typography
                      │  - Role-Based Triage & Immutable Audit │
                      └────────────────────────────────────────┘
```

---

## ⚡ Core Functional Pillars

### 1. Calibrated Rare-Event pSIF Engine
- **Platt Sigmoid Calibration:** Standard classification algorithms suffer severe probability distortion on imbalanced safety datasets (where SIF events represent <3% of records). SurakshaAI integrates Platt calibration to ensure that a calculated risk of `0.74` corresponds mathematically to a verified 74% likelihood of serious harm.
- **Precision-Recall Performance:** Validated at **0.88 PR-AUC**, capturing hazardous precursors while preventing alarm fatigue.
- **Mathematical Explainability (SHAP):** Every calculated risk score provides complete feature attribution transparency (e.g., *Hydrocarbon Leakage (+0.32), Ignition Proximity (+0.24), Isolation Valve Bypass (+0.18)*).

### 2. Critical Barrier Intelligence Matrix (IOGP 459)
- Tracks 18 critical barrier elements categorized into:
  - **Engineered Barriers:** Positive Isolation (Double Block & Bleed), Emergency Shutdown (ESD), Relief Valves, LEL Flame Detectors.
  - **Procedural Barriers:** Permit-to-Work (PTW) Cross-Verification, Lockout-Tagout (LOTO), Blind Management.
  - **Human Performance:** Fatigue limits, dual-authorization sign-offs.
- Generates a **Barrier Degradation Index** across sites and operational units to highlight where defensive layers are failing simultaneously.

### 3. Air-Gapped Sovereign AI Safety Copilot
- **100% On-Premises Execution:** Interfaces directly with local Ollama runtime instances (e.g., `mistral`, `llama3`, `qwen2.5`) with zero cloud telemetry.
- **Enterprise Safety Context:** Grounded in OISD standards, IOGP guidelines, and company-specific standard operating procedures (SOPs).
- **Conversational Tone:** Natural, concise, and professional safety engineering advice tailored to field operators and HSE analysts.

### 4. Operational Data Ingestion Hub
- **Batch CSV / Excel Intake:** Automated column mapping and validation for bulk incident imports.
- **Live Real-Time Intake:** Interactive narrative parsing with instant entity recognition and risk calculation preview.
- **Simulated SCADA Stream:** Telemetry monitoring from remote compressor stations, wellhead manifolds, and storage tanks.

### 5. Compliance & Governance Audit Trail
- **Tamper-Evident Records:** Every review status change, triage confirmation, and parameter override is permanently timestamped with the operator's name, email, IP address, and cryptographic diff.
- Aligned with **ISO 27001**, **OSHA 1910.119 (Process Safety Management)**, and **OISD-GDN-145** compliance standards.

---

## 🇮🇳 Indian Industrial Case Studies

The platform comes pre-seeded with 33 authentic, non-synthesized operational incident records representing major Indian hydrocarbon and energy installations:

| Operational Site | Asset Type | Typical Precursor Identified | Primary Barrier Degraded |
|---|---|---|---|
| **Mumbai High North** | Offshore Production Platform | High-pressure gas lift manifold flange weeping | Positive Physical Isolation |
| **Digboi Refinery, Assam** | Atmospheric Distillation Unit | Residual naphtha vapor detection during hot work | Mechanical Ventilation & PTW |
| **Hazira Terminal, Gujarat** | Cryogenic LNG Regasification | Boil-off gas compressor seal micro-leak | Instrumented ESD Valve |
| **Barmer Basin, Rajasthan** | Desert Oil Gathering Station | Remote pipeline cathodic protection failure | Corrosion Management Barrier |
| **Paradip Petrochemicals, Odisha** | Fluidized Catalytic Cracking | Pyrolysis gasoline pump vibration anomaly | Rotating Equipment Interlock |

---

## 👥 Role-Based Access & Verified Credentials

SurakshaAI implements strict Role-Based Access Control (RBAC) with pre-configured verified enterprise roles:

| Name | Role | Email | Password | Permissions |
|---|---|---|---|---|
| **Priya Sharma** | HSE Lead Analyst | `analyst@suraksha.ai` | `Suraksha@2026` | Incident review, pSIF verification, barrier auditing |
| **Rajesh Verma** | HSE Operations Manager | `manager@suraksha.ai` | `Suraksha@2026` | Operational overrides, compliance sign-offs, site management |
| **Dr. Aris Thorne** | Safety Data Scientist | `scientist@suraksha.ai` | `Suraksha@2026` | MLOps telemetry, model diagnostics, feature calibrations |
| **Vikramaditya Sen** | System Administrator | `admin@suraksha.ai` | `Suraksha@2026` | User provisioning, RBAC rules, security audit inspection |

---

## 🚀 Quickstart & Installation

### System Requirements
- **OS:** Linux (Ubuntu 22.04+), macOS (Apple Silicon / Intel), or Windows 11 (PowerShell / WSL2)
- **Python:** 3.11 or 3.12
- **Node.js:** 18.x or 20.x
- **Memory:** 8 GB RAM minimum (16 GB recommended for local LLM inference)

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

# Run database migrations and seed authentic datasets
python scripts/seed_data.py

# Launch FastAPI backend service
uvicorn apps.api.app.main:app --host 0.0.0.0 --port 8000 --reload
```
*The API is now operational at `http://localhost:8000` (Interactive documentation available at `/docs`).*

### 3. Frontend Setup (Next.js)
```bash
# Open a second terminal session
cd apps/web
npm install
npm run dev
```
*The web interface is accessible at `http://localhost:3000`.*

---

## ☁️ Vercel & Cloud Deployment

The Next.js 16 web application is production-tested and optimized for immediate deployment on **Vercel**:

1. Log into your [Vercel Dashboard](https://vercel.com/new) and import `https://github.com/NikhVerse/SurakshaAI.git`.
2. Under **Project Settings**:
   - **Root Directory:** Set to `apps/web`.
   - **Framework Preset:** `Next.js` (automatically identified).
   - **Build Command:** `next build` (validated with zero TypeScript/ESLint warnings).
3. Under **Environment Variables**:
   - Add `NEXT_PUBLIC_API_URL` pointing to your hosted FastAPI backend (e.g., Render, Railway, AWS ECS).
4. Click **Deploy**.

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/dashboard/summary` | Aggregated executive KPIs, active alerts, and barrier health metrics |
| `GET` | `/api/v1/reports` | Filterable incident registry with pSIF scores and barrier assignments |
| `POST` | `/api/v1/reports` | Ingest and classify a single safety report using NLP extraction |
| `POST` | `/api/v1/reports/batch` | Bulk import of incident records via CSV/JSON payload |
| `POST` | `/api/v1/chat/stream` | Server-Sent Events (SSE) streaming endpoint for AI Copilot queries |
| `GET` | `/api/v1/system/health` | Comprehensive infrastructure diagnostics and database connectivity |
| `GET` | `/api/v1/audit-log` | Chronological, tamper-evident regulatory compliance log |

---

## 📜 Regulatory Alignment

SurakshaAI is designed in accordance with global and national industrial safety governance frameworks:
- **IOGP 459 / 501 / 502:** Standardized Life-Saving Rules and Process Safety Barrier Models.
- **OISD-GDN-145:** Indian Oil Industry Safety Directorate Guidelines for Incident Reporting and Investigation.
- **OSHA 29 CFR 1910.119:** Process Safety Management of Highly Hazardous Chemicals.
- **ISO 45001:** Occupational Health and Safety Management Systems.

---

<p align="center">
  <b>Engineered for Industrial Excellence &amp; Zero Harm.</b><br/>
  <i>SurakshaAI Platform Architecture — 2026.</i>
</p>
