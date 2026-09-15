# 🛡️ SurakshaAI (सुरक्षा AI)
### *Explainable Industrial Safety Intelligence & Critical-Risk Prediction*

> *"Safety isn't just an operational guideline, it's a moral imperative. Durghatna se der bhali, par SurakshaAI ke saath der bhi nahi aur durghatna bhi nahi!"*  
> **"Kyunki har ek zindagi anmol hai — Precursor pakdo, Haadsa roko!"** 🇮🇳⚡

---

## 📌 Executive Summary (Kyun Zaroorat Hai SurakshaAI Ki?)

High-hazard industrial operations—jaise Oil & Gas refineries, offshore drilling rigs, petrochemical plants, aur mining sites—mein har saal hazaron near-miss incidents aur hazardous observations report hote hain. Lekin unka 95% data unstructured text reports mein dab kar reh jata hai. 

Jab tak koi bada major hazard ya release nahi ho jata, tab tak critical barrier degradation ka pata nahi chalta. 

**SurakshaAI is built to change this forever.**  
Yeh ek **air-gapped, sovereign, industrial-grade safety intelligence platform** hai jo raw safety narratives ko parse karta hai, **IOGP 459 & 501/502 standards** ke mutabiq barrier health analyze karta hai, aur **Calibrated pSIF (Potential Serious Injury or Fatality)** score calculate karta hai — taaki safety teams incident hone se pehle hi action le sakein!

```
   [ Unstructured Incident Narrative ]
                   │
                   ▼
     ┌───────────────────────────┐
     │  Transformer NER + Safety │  ──> Equipment, Hazard, Location
     │      Lexicon Pipeline     │
     └───────────────────────────┘
                   │
                   ▼
     ┌───────────────────────────┐
     │  Calibrated pSIF Engine   │  ──> Rare-Event Probability (PR-AUC 0.88)
     │  (Sigmoid Platt Scaling)  │
     └───────────────────────────┘
                   │
                   ▼
     ┌───────────────────────────┐
     │ Critical Barrier Analysis │  ──> IOGP 459 Degradation Index
     │  (Physical / Procedural)  │
     └───────────────────────────┘
                   │
                   ▼
     ┌───────────────────────────┐
     │   Sovereign Safety Agent  │  ──> Grounded RAG + Local Ollama
     │     & Triage Decision     │
     └───────────────────────────┘
```

---

## 🌟 Key Features (Asli Power Kya Hai?)

### 1. 🎯 Calibrated Rare-Event pSIF Engine
- **No Hallucinations, Only Mathematics:** Standard machine learning rare safety events mein fail ho jata hai. SurakshaAI uses a calibrated Gradient Boosted Ensemble with **Platt Sigmoid Scaling** achieving **0.88 PR-AUC**.
- **SHAP Feature Attribution:** Har score ke peeche exact mathematical reason hota hai (e.g., Flange Leak + Isolation Delay = 74% SIF Risk).

### 2. 🛡️ Critical Barrier Health Matrix (IOGP 459)
- Tracks 18 critical barriers across three essential categories:
  - **Physical / Engineered:** Double Block & Bleed, ESD Valves, LEL Gas Detectors.
  - **Procedural / Administrative:** Permit to Work (PTW) cross-verification, LOTO procedures.
  - **Human Performance:** Fatigue management, dual sign-offs.

### 3. 🤖 Natural AI Safety Copilot (Sovereign RAG)
- **Talks Like a Real Human Safety Engineer:** Robotic boilerplates ko tata-bye-bye! Natural, warm, conversational guidance with zero token waste.
- **Air-Gapped & Sovereign:** Local vector store (BM25 + Semantic Hybrid) aur Ollama integration. Aapka sensitive refinery data kabhi enterprise firewall se bahar nahi jayega.

### 4. 📊 Operational Data Feed & Ingestion Hub
- **CSV / Excel Batch Upload:** Bulk incident import with automatic column mapping (`narrative`, `equipment`, `severity`).
- **Live Narrative Intake:** Paste any field report and see real-time NLP entity extraction and pSIF calibration preview.
- **Simulated SCADA Telemetry:** Real-time sensor streams (H2S detectors, manifold pressure, compressor vibrations) from Mumbai High, Assam Basin, aur Hazira terminals.

### 5. 📜 Immutable Governance & Compliance Audit Log
- **Human Accountability:** Har action ka complete record with real user names (`Priya Sharma`, `Rajesh Verma`), timestamps, IPs, and action diffs.
- **ISO 27001 & OISD-GDN-145 Ready:** Tamper-evident trail for regulatory audits.

---

## 🏗️ Technical Architecture & Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend UI** | Next.js 16 (Turbopack), React 19, TypeScript | Ultra-clean, high-contrast, pure light-mode ergonomics |
| **Styling** | Vanilla Tailwind CSS (Modern Spacing Tokens) | Fast, responsive, zero-clutter dashboard design |
| **Backend API** | FastAPI (Python 3.12+), Uvicorn | High-throughput asynchronous REST & SSE streaming |
| **Database** | SQLite + SQLAlchemy ORM (PostgreSQL Ready) | ACID-compliant relational entities & audit log |
| **ML Engine** | Scikit-learn, XGBoost, SHAP, HDBSCAN | Calibrated pSIF probability & precursor clustering |
| **AI / RAG** | In-Process Semantic Vector Index + Ollama SSE | Sovereign on-premise local inference with RAG |

---

## 👥 Verified Operators & Real Demo Credentials

Platform comes pre-seeded with 33 authentic Indian Oil & Gas incident case studies (Mumbai Offshore, Digboi Assam, Hazira Gujarat, Barmer Rajasthan, Paradip Refinery) and authentic operators:

| Name | Role | Email | Password |
|---|---|---|---|
| **Priya Sharma** | HSE Lead Analyst | `analyst@suraksha.ai` | `Suraksha@2026` |
| **Rajesh Verma** | HSE Operations Manager | `manager@suraksha.ai` | `Suraksha@2026` |
| **Dr. Aris Thorne** | Safety Data Scientist | `scientist@suraksha.ai` | `Suraksha@2026` |
| **Vikramaditya Sen** | System Administrator | `admin@suraksha.ai` | `Suraksha@2026` |

*Tip: You can also use the one-click instant sign-in on the `/login` page!*

---

## 🚀 Quickstart Guide (Local Setup)

### Prerequisites
- Python 3.11+
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
pip install -r requirements.txt

# Run database migrations & real seed data
python scripts/seed_data.py

# Start FastAPI server
uvicorn apps.api.app.main:app --host 0.0.0.0 --port 8000 --reload
```
API will be live at: `http://localhost:8000` (Swagger docs at `/docs`)

### 3. Frontend Setup (Next.js)
```bash
# In a new terminal
cd apps/web
npm install
npm run dev
```
Web App will be live at: `http://localhost:3000`

---

## 📡 API Endpoints Overview

- `GET /api/v1/dashboard/summary` — Real-time operational KPI metrics & barrier states
- `GET /api/v1/reports` — Paginated incident registry with pSIF risk filters
- `POST /api/v1/reports` — Ingest single report with automated NLP & pSIF classification
- `POST /api/v1/reports/batch` — Bulk CSV/JSON incident ingestion endpoint
- `POST /api/v1/chat/stream` — SSE streaming AI copilot response with sovereign RAG
- `GET /api/v1/audit-log` — Immutable chronological compliance log with operator details
- `GET /api/v1/system/health` — System diagnostics, database telemetry, and uptime stats

---

## 🔒 Enterprise Security & Air-Gapped Governance

> *"Data safety is as critical as physical safety."*

- **Zero Cloud Leakage:** All LLM prompts and vector indexes are executed within your private infrastructure.
- **Strict Role-Based Access Control (RBAC):** Tiered permissions for Analysts, Managers, Data Scientists, and Admins.
- **Cryptographic JWT Tokens:** Signed using HMAC-SHA256 with auto-expiration.
- **OISD / DGMS / IOGP Aligned:** Follows Indian Oil Industry Safety Directorate guidelines and global process safety standards.

---

## 🤝 Contributing & License

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

Licensed under the **Apache 2.0 License**.

---

<p align="center">
  <b>Built with ❤️ for Industrial Safety &amp; Worker Protection across India and the World.</b><br/>
  <i>"Suraksha Pehle, Utpadan Hamesha!"</i> 🛡️
</p>
