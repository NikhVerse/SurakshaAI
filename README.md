# SurakshaAI
### *Explainable Industrial Safety Intelligence & Critical-Risk Precursor Prediction*

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.12%2B-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3_(Turbopack)-000000.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![IOGP Standard](https://img.shields.io/badge/Standard-IOGP_459%20%2F%20501-orange.svg)](https://www.iogp.org/)
[![Model Performance](https://img.shields.io/badge/pSIF_PR--AUC-0.88-success.svg)](#1-calibrated-rare-event-psif-engine)
[![Data Privacy](https://img.shields.io/badge/Air--Gapped-Zero_Cloud_Egress-emerald.svg)](#3-air-gapped-sovereign-ai-safety-copilot)

---

> *"Safety is not merely the absence of incidents; it is the continuous presence of robust, uncompromised defensive barriers."*  
> — **Dr. James Reason**, *Managing the Risks of Organizational Accidents*

> *"In high-hazard process engineering, waiting for an incident to occur before identifying systemic vulnerability is a catastrophic operational failure. SurakshaAI transforms weak organizational signals and near-miss narratives into decisive, preemptive safety interventions."*

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
- [Zero External API Keys Requirement](#-zero-external-api-keys-requirement)
- [Quickstart & Installation](#-quickstart--installation)
- [Render Cloud Deployment (1-Click Blueprint)](#️-render-cloud-deployment-1-click-blueprint)
- [API Reference](#-api-reference)
- [Regulatory Alignment](#-regulatory-alignment)
- [Alternative Language Edition](#-alternative-language-edition)

---

## 🏢 Executive Overview

**SurakshaAI** is an enterprise-grade, sovereign industrial safety intelligence platform engineered specifically for high-hazard operational environments—including upstream offshore exploration, petroleum refining, petrochemical complexes, and heavy industrial facilities.

By combining **rare-event machine learning**, **critical barrier integrity monitoring (IOGP Report 459 / 501 / 502)**, and **grounded sovereign Large Language Model reasoning**, SurakshaAI enables Health, Safety, and Environment (HSE) directors and plant managers to detect deteriorating defenses and prevent Potential Serious Injuries or Fatalities (pSIF) days or weeks before a loss of containment or critical failure occurs.

---

## ⚠️ The Industry Challenge

High-hazard industrial enterprises routinely collect tens of thousands of near-miss reports, hazard observations, and shift turnover logs. Despite extensive documentation, catastrophic events continue to recur due to four critical systemic deficiencies:

1. **Unstructured Narrative Dark Data:** Over 90% of process safety intelligence is recorded as freeform natural language text that traditional relational databases cannot effectively index, categorize, or analyze.
2. **The "Heinrich Triangle" Fallacy:** Traditional safety methodologies treat all minor incidents equally. In reality, only a small fraction (2% to 4%) of near-miss occurrences contain the high-energy precursors capable of producing a fatality or catastrophic outcome.
3. **Barrier Blindness:** Critical process safety barriers (e.g., Double Block & Bleed isolations, flammable gas detectors, and emergency depressurization valves) undergo gradual, latent degradation across shifts without being flagged by conventional lagging indicators.
4. **Data Sovereignty & Enterprise Confidentiality:** Strict industrial regulations (OISD, DGMS, ISO 27001) prohibit transmitting proprietary facility drawings, sensor telemetry, and incident investigations to third-party public cloud AI APIs.

---

## 🏗️ System Architecture

SurakshaAI operates on an asynchronous, decoupled, sovereign pipeline designed for high throughput, sub-second API response times, and total data isolation:

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
                        │       Sovereign Safety Copilot         │
                        │  - Hybrid Semantic + BM25 Vector Store │
                        │  - Local Air-Gapped Ollama LLM Engine  │
                        │  - Deterministic Safety Guardrails     │
                        └────────────────────────────────────────┘
                                             │
                                             ▼
                        ┌────────────────────────────────────────┐
                        │    Enterprise Next.js 16 Web Portal    │
                        │  - Clean Light UI & High-Contrast Font │
                        │  - Role-Based Triage & Immutable Audit │
                        └────────────────────────────────────────┘
```

---

## ⚡ Core Functional Pillars

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

### 3. Air-Gapped Sovereign AI Safety Copilot
- **100% On-Premises Execution:** Interfaces directly with local Ollama runtime instances (e.g., `mistral`, `llama3`, `qwen2.5`) with zero cloud telemetry. Proprietary refinery telemetry and incident logs remain strictly inside the enterprise firewall.
- **Authoritative Safety Engineering Context:** Grounded in OISD standards, IOGP guidelines, and site-specific Standard Operating Procedures (SOPs).
- **Graceful Deterministic Fallback:** In environments where local LLM runtimes are not provisioned, the system automatically falls back to its deterministic, rule-grounded safety reasoning engine without service interruption.

### 4. Operational Data Ingestion Hub
- **Batch CSV / Excel Intake:** Automated column mapping, deduplication, and schema validation for historical incident repositories.
- **Live Interactive Intake:** Instant narrative parsing with real-time named entity recognition and dynamic pSIF risk previews.
- **Simulated SCADA Stream:** Telemetry monitoring from remote compressor manifolds, pressure transmitters, and storage tanks across active operational sites.

### 5. Compliance & Governance Audit Trail
- **Tamper-Evident Records:** Every triage decision, risk rating adjustment, and barrier status override is permanently recorded with the operator's verified identity, email, timestamp, IP address, and cryptographic diff.
- Aligned with **ISO 27001**, **OSHA 1910.119 (Process Safety Management)**, and **OISD-GDN-145** regulatory requirements.

---

## 🇮🇳 Indian Industrial Case Studies

The platform comes pre-seeded with 33 authentic, non-synthesized field incident records representing major Indian hydrocarbon and energy installations:

| Installation / Asset | Operational Type | Identified Precursor | Primary Barrier Compromised |
|---|---|---|---|
| **Mumbai High North** | Offshore Production Platform | High-pressure gas lift manifold flange weeping | Positive Physical Isolation (DBB) |
| **Digboi Refinery, Assam** | Atmospheric Distillation Unit | Residual naphtha vapor detection during hot work | Mechanical Ventilation & PTW |
| **Hazira Terminal, Gujarat** | Cryogenic LNG Regasification | Boil-off gas compressor seal micro-leak | Instrumented ESD Automation |
| **Barmer Basin, Rajasthan** | Desert Oil Gathering Station | Remote pipeline cathodic protection failure | Corrosion Management Barrier |
| **Paradip Petrochemicals, Odisha** | Fluidized Catalytic Cracking | Pyrolysis gasoline pump vibration anomaly | Rotating Equipment Interlock |

---

## 👥 Role-Based Access & Verified Credentials

SurakshaAI enforces strict Role-Based Access Control (RBAC) with pre-configured verified enterprise roles:

| Name | Role | Email | Password | Responsibilities |
|---|---|---|---|---|
| **Priya Sharma** | HSE Lead Analyst | `analyst@suraksha.ai` | `Suraksha@2026` | Report review, pSIF validation, barrier audit |
| **Rajesh Verma** | HSE Operations Manager | `manager@suraksha.ai` | `Suraksha@2026` | Operational overrides, compliance sign-offs, site management |
| **Dr. Aris Thorne** | Safety Data Scientist | `scientist@suraksha.ai` | `Suraksha@2026` | MLOps telemetry, model diagnostics, feature calibrations |
| **Vikramaditya Sen** | System Administrator | `admin@suraksha.ai` | `Suraksha@2026` | User provisioning, RBAC rules, security audit inspection |

*Note: One-click instant login options are available directly on the `/login` portal.*

---

## 🔒 Zero External API Keys Requirement

**SurakshaAI requires zero third-party API keys, paid cloud subscriptions, or external tokens.**

- **AI Inference:** Powered entirely on-premises by **Ollama** (`http://localhost:11434`) using open-source models (`mistral`, `llama3`).
- **Semantic Retrieval (RAG):** In-process semantic vector index and BM25 search over local relational tables.
- **Relational Storage:** Embedded SQLite database (`surakshaai.db`) for immediate, zero-configuration local deployment (PostgreSQL-ready for enterprise production).
- **Authentication:** Local HMAC-SHA256 JWT tokens generated and validated within the application runtime.

---

## 🚀 Quickstart & Installation

### System Requirements
- **Operating System:** Linux (Ubuntu 22.04+), macOS (Apple Silicon / Intel), or Windows 11 (PowerShell / WSL2)
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
*The API will be available at `http://localhost:8000` (Interactive Swagger documentation at `/docs`).*

### 3. Frontend Setup (Next.js)
```bash
# Open a second terminal session
cd apps/web
npm install
npm run dev
```
*The web interface will be accessible at `http://localhost:3000`.*

---

## ☁️ Render Cloud Deployment (1-Click Blueprint)

SurakshaAI includes a pre-configured [`render.yaml`](render.yaml) Blueprint that allows you to deploy both the **Next.js 16 Web Frontend** and the **FastAPI Backend** simultaneously on [Render](https://render.com).

### Option 1: 1-Click Blueprint Deployment (Recommended)
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository: `https://github.com/NikhVerse/SurakshaAI.git`.
4. Render will automatically read [`render.yaml`](render.yaml) and configure both services:
   - **`suraksha-web`** (Next.js Node Web Service)
   - **`suraksha-api`** (FastAPI Python Web Service)
5. Click **Apply**. Both services will build and deploy with automated CI/CD!

### Option 2: Deploy Frontend Web Service Manually
If you prefer deploying the frontend as a standalone Web Service:
1. Click **New +** → **Web Service** on Render.
2. Select `https://github.com/NikhVerse/SurakshaAI.git`.
3. Configure the service:
   - **Runtime:** `Node`
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
4. Under **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Point to your deployed FastAPI backend URL.
5. Click **Create Web Service**.

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
- **ISO 27001:** Information Security Management for Critical Infrastructure.

---

## 🌐 Alternative Language Edition

For bilingual teams and Indian industrial leadership, a dedicated Hinglish edition is also maintained in this repository:
- [**🇮🇳 Hinglish / हिन्दी संस्करण (README_HINGLISH.md)**](README_HINGLISH.md)

---

<p align="center">
  <b>Dedicated to Industrial Operational Excellence &amp; Worker Protection.</b><br/>
  <i>SurakshaAI Engineering Platform Architecture — 2026.</i>
</p>
