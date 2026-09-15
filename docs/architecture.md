# SurakshaAI — System Architecture

```mermaid
graph TD
    UI[Next.js 15 App Router Frontend] -->|REST / JWT| API[FastAPI Backend Gateway]
    
    subgraph Data Layer
        API --> DB[(PostgreSQL / SQLite Dual-Mode)]
        API --> VEC[(Vector Index / Qdrant Client)]
        API --> S3[(MinIO / Local Object Store)]
    end
    
    subgraph AI / ML Engine
        API --> PRE[Safety NLP Preprocessor]
        PRE --> NER[Transformer NER + Domain Lexicon]
        NER --> PSIF[Calibrated pSIF Risk Engine]
        NER --> LSR[Multi-Label LSR Classifier]
        NER --> BAR[Barrier Intelligence Engine]
        BAR --> PREC[HDBSCAN Precursor Discovery]
    end
    
    subgraph Controlled Agentic Workflow
        API --> GRAPH[LangGraph State Machine]
        GRAPH --> LLM[Local Ollama Brain]
        GRAPH --> RAG[Source-Aware Grounded RAG]
    end
    
    subgraph Governance & Review
        API --> REV[Human-in-the-Loop HSE Review]
        API --> AUD[Immutable Append-Only Audit Log]
    end
```

## Architectural Principles

1. **Decoupled Responsibilities**:
   - Web Frontend: Information-dense, light-themed operational UI (React, Tailwind, Lucide, Recharts).
   - Backend Gateway: High-performance typed REST API in FastAPI with Argon2id and JWT authentication.
   - Deterministic ML: Scikit-learn calibrated gradient-boosted ensembles for rare-event pSIF classification.
   - Local Brain: Ollama private LLM for grounded contextual explanations and summarization.
2. **Offline & Degraded Fault Tolerance**:
   - If Ollama is offline or uninstalled, the application operates in **Degraded Mode** without interruption.
   - If Docker/Postgres/Qdrant are absent, the application runs seamlessly via embedded SQLite and local vector indexing.
3. **Data Leakage Prevention**:
   - Predictions strictly utilize information available at initial triage time (narrative, site, equipment, direct observation). Post-investigation root causes are excluded from the initial prediction task.
