# SurakshaAI — Vector Engine & Qdrant Integration

## 1. Role of Vector Retrieval

In SurakshaAI, vector similarity retrieval addresses two primary tasks:
1. **Similar Report Retrieval**: Finding historical unsafe acts, conditions, or near misses that share latent semantic patterns with an incoming event.
2. **Grounded RAG**: Retrieving authorized procedure excerpts to support explanations.

---

## 2. Payload Schema

Every indexed vector record retains rich operational metadata:
```json
{
  "report_id": "REP-2026-001",
  "site_id": "SITE-ALPHA",
  "activity_id": "ACT-MAINT",
  "barrier_id": "BAR-01",
  "lsr_ids": ["LSR-04", "LSR-08"],
  "report_date": "2026-09-15T10:00:00Z",
  "data_origin": "SYNTHETIC",
  "document_id": "HSE-STD-014"
}
```

---

## 3. Dual-Mode Fallback

If Qdrant is running via Docker Compose (`http://localhost:6333`), the client indexes into Qdrant collections (`suraksha_reports`, `suraksha_knowledge`). If Qdrant is unavailable, SurakshaAI automatically operates using an in-process normalized vector store to maintain full functionality.
