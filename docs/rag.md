# SurakshaAI — Grounded Retrieval-Augmented Generation (RAG)

## 1. Grounded Source Governance

Standard RAG implementations in enterprise tools suffer from hallucination and lack of authority boundaries. SurakshaAI enforces strict source governance:

1. **Source Register**: Every document in the knowledge base belongs to an explicit authority category (`MANDATORY_STANDARD`, `OPERATIONAL_PROCEDURE`, `LESSONS_LEARNED`, or `CHECKLIST`).
2. **Attribution Retention**: Every retrieved text chunk preserves its `document_title`, `source_authority`, `page_number`, and `section_heading`.
3. **Evidence Excerpts**: Generated answers cite the exact paragraphs from the approved standard.

The model is strictly prohibited from claiming that external or user-uploaded manuals represent corporate OIL policy without verified institutional approval.
