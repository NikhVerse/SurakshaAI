# SurakshaAI — Local Ollama Private AI Integration

## 1. Zero Cloud Dependency & Private Inference

In high-hazard energy infrastructure, safety incident reports contain proprietary operational details, equipment IDs, and contractor references. Transmission of these sensitive safety narratives to multi-tenant public cloud LLMs poses severe compliance and confidentiality risks.

SurakshaAI mandates **local, private inference**:
- Default engine: **Ollama** running locally on host or within private cluster infrastructure.
- Default models: `mistral` (reasoning/synthesis) and `nomic-embed-text` (local vector embeddings).

```text
Frontend (Browser)
       ↓
FastAPI Backend Gateway
       ↓
Analysis Orchestrator (LangGraph)
       ↓
Ollama Local Daemon (http://localhost:11434)
```

Browser JavaScript never connects directly to Ollama. The FastAPI backend owns and governs the inference connection.

---

## 2. Configuration Parameters

Configured via environment variables (`.env`):
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
```

---

## 3. Graceful Degraded Mode

If the Ollama daemon is not running or the model is still loading:
1. The diagnostic endpoint (`GET /api/v1/system/llm/health`) returns status `"unavailable"` with `mode: "DEGRADED_FALLBACK"`.
2. The UI displays an anchored service notice: *"Local AI unavailable. Core records, deterministic risk scoring, and existing analysis remain fully operational."*
3. The application never crashes; explanations fall back to deterministic safety reasoning summaries.
