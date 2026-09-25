# SurakshaAI — Unified OpenAI GPT-4o Intelligence Architecture

## 1. Unified Frontier AI Model Standard

SurakshaAI standardizes exclusively on **OpenAI GPT-4o** as its primary reasoning and conversational intelligence engine across the entire platform.

All complex industrial safety narratives, causal pathway syntheses, and interactive operator guidance are driven by OpenAI's state-of-the-art models:
- **Primary Reasoning & Chat**: `OpenAI GPT-4o`
- **Vector Embeddings**: `text-embedding-3-small`

```text
Frontend (Browser / Mobile)
       ↓
FastAPI Backend Gateway
       ↓
Safety Reasoning Graph (LangGraph)
       ↓
OpenAI Frontier API (https://api.openai.com/v1)
```

Browser JavaScript never exposes API keys or connects directly to external providers. The FastAPI backend governs, rate-limits, and audits all inference interactions.

---

## 2. Configuration Parameters

Configured cleanly via environment variables (`.env`):
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o
```

---

## 3. Zero-Downtime Standalone Deterministic Fallback

If `OPENAI_API_KEY` is not provided or during offline network isolation:
1. The diagnostic endpoint (`GET /api/v1/system/llm/health`) reports status `"connected"` with `mode: "STANDALONE_DETERMINISTIC"`.
2. The platform operates seamlessly using calibrated gradient-boosted ensemble ML, IOGP 459 rule engines, and deterministic barrier logic.
3. Zero crashes, zero downtime, and complete offline capability for critical industrial safety workflows.
