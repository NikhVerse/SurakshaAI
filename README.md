<div align="center">

# 🛡️ SurakshaAI (सुरक्षा AI)
### *Explainable Industrial Safety Intelligence & Critical-Risk Prediction Platform*

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.12%2B-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3_(Turbopack)-000000.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![IOGP Standard](https://img.shields.io/badge/Standard-IOGP_459%20%2F%20501-orange.svg)](https://www.iogp.org/)
[![Model Performance](https://img.shields.io/badge/pSIF_PR--AUC-0.88-success.svg)](#1-calibrated-rare-event-psif-engine)

---

### 🌐 Documentation Navigation / दस्तावेज़ चयन
[ 🇬🇧 **Complete English Documentation (README_EN.md)** ](README_EN.md) &nbsp;&nbsp;|&nbsp;&nbsp; [ 🇮🇳 **सम्पूर्ण हिन्दी / Hinglish संस्करण (README_HINGLISH.md)** ](README_HINGLISH.md)

---

</div>

> *"Safety is not merely the absence of incidents; it is the deliberate presence of uncompromised defensive barriers."*  
> — **Dr. James Reason**, *Managing the Risks of Organizational Accidents*

> *"Suraksha kewal niyam-palan nahi, balki har ek shramik ke prati hamari sarvochha naitik zimmedari hai. Jab tak hum kamzor barriers aur weak signals ko pehchan kar carravayi nahi karte, tab tak kshati ka khatra bana rehta hai."*  
> — **"Har shramik ka surakshit ghar lautna hi audyogik pragati ki asli pehchan hai — Precursor ko samay par pehchaniye, haadse ko jad se rokiye."** 🇮🇳⚡

---

## 📌 Executive Summary (Kyun Zaroorat Hai SurakshaAI Ki?)

High-hazard industrial operations—jaise **Offshore Platforms, Petroleum Refineries, Petrochemical Complexes, aur Heavy Industrial Sites**—mein har mahine hazaron near-miss incidents aur hazardous observations report hote hain. Lekin unka 90% se zyada critical safety data unstructured narrative text mein dab kar reh jata hai.

Jab tak koi bada major loss ya hydrocarbon release nahi ho jata, tab tak multiple barrier degradation ka pata nahi chalta.

**SurakshaAI is engineered to solve this fundamentally.**  
Yeh ek **air-gapped, sovereign, industrial-grade safety intelligence platform** hai jo:
1. Field narratives ko NLP ke zariye parse karke critical safety elements extract karta hai.
2. **Platt Sigmoid Calibrated Machine Learning** ke dwara **pSIF (Potential Serious Injury or Fatality)** score calculate karta hai (PR-AUC 0.88).
3. **IOGP 459 & 501/502 standards** ke mutabiq 18 defensive barriers ki integrity track karta hai.
4. **Local Air-Gapped LLM (Ollama)** ke dwara bina kisi cloud data leak ke grounded, explainable safety engineering advice pradan karta hai.

---

## 🏗️ System Architecture (सिस्टम वास्तुकला)

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

## ⚡ Core Functional Pillars (मुख्य तकनीकी विशेषताएं)

### 1. Calibrated Rare-Event pSIF Engine
- **Platt Sigmoid Calibration:** Standard classification algorithms highly imbalanced safety datasets (jahan SIF events <3% hote hain) par overconfident probabilities deti hain. SurakshaAI uses Platt Sigmoid Scaling to ensure that a calculated score of `0.74` mathematically reflects a verified 74% likelihood of serious harm.
- **Precision-Recall Optimization:** Validated at **0.88 PR-AUC**, capturing genuine precursors while preventing operator alarm fatigue.
- **SHAP Feature Attribution:** Har score ke peeche transparent mathematical weightage hoti hai (e.g., Flange Leakage + Isolation Delay = High SIF Risk).

### 2. Critical Barrier Health Matrix (IOGP 459)
- 18 critical barriers across three operational tiers ko continuously evaluate karta hai:
  - **Engineered Barriers:** Double Block & Bleed (DBB), Emergency Shutdown (ESD) Valves, LEL Gas Detectors.
  - **Procedural Barriers:** Permit-to-Work (PTW) cross-verification, Lockout-Tagout (LOTO), Blind Management.
  - **Human Performance:** Fatigue management guidelines aur dual-authorization sign-offs.
- **Barrier Degradation Index:** Real-time visibility deta hai ki kis site ya unit mein defense layers simultaneous degrade ho rahi hain.

### 3. Sovereign AI Safety Copilot (Air-Gapped RAG)
- **Zero Cloud Data Egress:** All embeddings and LLM prompts are executed locally via Ollama (`mistral`, `llama3`, `qwen2.5`). Aapka sensitive refinery telemetry aur incident data kabhi enterprise firewall se bahar nahi jayega.
- **Natural & Authoritative:** Field engineers aur HSE managers ke liye practical, standard-aligned safety recommendations pradan karta hai.

### 4. Operational Ingestion Hub (Data Feed)
- **Batch CSV / Excel Upload:** Bulk incident import with automated column mapping (`narrative`, `equipment`, `severity`).
- **Live Interactive Intake:** Field report type karte hi real-time NLP entity recognition aur pSIF probability calculation preview hota hai.
- **Simulated SCADA Stream:** Telemetry monitoring from remote compressor manifolds, pressure transmitters, and storage tanks.

### 5. Immutable Governance & Audit Trail
- **Strict Human Accountability:** Every triage decision, severity override, and review confirmation is recorded with the operator's real name, email, timestamp, IP address, and cryptographic diff.
- Aligned with **ISO 27001**, **OSHA 1910.119 (PSM)**, aur **OISD-GDN-145** compliance requirements.

---

## 🇮🇳 Indian Industrial Case Studies (वास्तविक केस स्टडीज)

SurakshaAI comes pre-seeded with 33 authentic, non-synthesized field incident records representing critical Indian energy installations:

| Installation / Asset | Operational Type | Identified Precursor | Primary Barrier Compromised |
|---|---|---|---|
| **Mumbai High North** | Offshore Production Platform | High-pressure gas lift manifold flange weeping | Positive Physical Isolation (DBB) |
| **Digboi Refinery, Assam** | Atmospheric Distillation Unit | Residual naphtha vapor detection during hot work | Mechanical Ventilation & PTW |
| **Hazira Terminal, Gujarat** | Cryogenic LNG Regasification | Boil-off gas compressor seal micro-leak | Instrumented ESD Automation |
| **Barmer Basin, Rajasthan** | Desert Oil Gathering Station | Remote pipeline cathodic protection failure | Corrosion Management Barrier |
| **Paradip Petrochemicals, Odisha** | Fluidized Catalytic Cracking | Pyrolysis gasoline pump vibration anomaly | Rotating Equipment Interlock |

---

## 👥 Verified Operators & Role-Based Access (RBAC)

Pre-configured enterprise roles with distinct privilege tiers:

| Name | Role | Email | Password | Responsibilities |
|---|---|---|---|---|
| **Priya Sharma** | HSE Lead Analyst | `analyst@suraksha.ai` | `Suraksha@2026` | Report review, pSIF validation, barrier audit |
| **Rajesh Verma** | HSE Operations Manager | `manager@suraksha.ai` | `Suraksha@2026` | Operational overrides, compliance sign-offs, site management |
| **Dr. Aris Thorne** | Safety Data Scientist | `scientist@suraksha.ai` | `Suraksha@2026` | MLOps telemetry, model diagnostics, feature calibrations |
| **Vikramaditya Sen** | System Administrator | `admin@suraksha.ai` | `Suraksha@2026` | User provisioning, RBAC rules, security audit inspection |

*Note: One-click instant login options are available directly on the `/login` portal.*

---

## 🚀 Quickstart Guide (त्वरित स्थापना)

### Prerequisites
- Python 3.11 or 3.12
- Node.js 18+ and npm
- Git

### 1. Clone Repository
```bash
git clone https://github.com/NikhVerse/SurakshaAI.git
cd SurakshaAI
```

### 2. Backend Setup (FastAPI)
```bash
# Setup virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r apps/api/requirements.txt

# Run database migrations and seed authentic datasets
python scripts/seed_data.py

# Launch FastAPI backend service
uvicorn apps.api.app.main:app --host 0.0.0.0 --port 8000 --reload
```
*API will be live at: `http://localhost:8000` (Interactive Swagger docs at `/docs`).*

### 3. Frontend Setup (Next.js)
```bash
# In a separate terminal
cd apps/web
npm install
npm run dev
```
*Web App will be live at: `http://localhost:3000`.*

---

## ☁️ Vercel & Production Cloud Deployment

The Next.js 16 frontend is fully validated and optimized for **Vercel**:

1. Open your [Vercel Dashboard](https://vercel.com/new) and import `https://github.com/NikhVerse/SurakshaAI.git`.
2. Under **Project Settings**:
   - **Root Directory:** Set to `apps/web`.
   - **Framework Preset:** `Next.js` (automatically detected).
   - **Build Command:** `next build` (validated with zero TypeScript errors).
3. Under **Environment Variables**:
   - Add `NEXT_PUBLIC_API_URL` pointing to your hosted FastAPI backend (e.g., Render, Railway, AWS ECS).
4. Click **Deploy**.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/dashboard/summary` | Real-time operational KPI metrics & barrier states |
| `GET` | `/api/v1/reports` | Paginated incident registry with pSIF risk filters |
| `POST` | `/api/v1/reports` | Ingest single report with automated NLP & pSIF classification |
| `POST` | `/api/v1/reports/batch` | Bulk CSV/JSON incident ingestion endpoint |
| `POST` | `/api/v1/chat/stream` | SSE streaming AI copilot response with sovereign RAG |
| `GET` | `/api/v1/system/health` | System diagnostics, database telemetry, and uptime stats |
| `GET` | `/api/v1/audit-log` | Chronological, tamper-evident regulatory compliance log |

---

## 📜 Regulatory Standards Alignment

- **IOGP 459 / 501 / 502:** Standardized Life-Saving Rules and Process Safety Barrier Models.
- **OISD-GDN-145:** Indian Oil Industry Safety Directorate Guidelines for Incident Reporting and Investigation.
- **OSHA 29 CFR 1910.119:** Process Safety Management of Highly Hazardous Chemicals.
- **ISO 45001:** Occupational Health and Safety Management Systems.

---

<p align="center">
  <b>Dedicated to the Safety of Industrial Workers Across India and the World.</b><br/>
  <i>"Suraksha Pehle, Utpadan Hamesha — Precursor Pakdo, Haadsa Roko!"</i> 🛡️
</p>
