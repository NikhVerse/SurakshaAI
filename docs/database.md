# SurakshaAI — Database Architecture & Dual-Mode Data Layer

## 1. Dual-Mode Storage Architecture

SurakshaAI supports two operational execution modes:
1. **Zero-Friction Local Execution (SQLite)**: Instant out-of-the-box operation with zero external service dependencies.
2. **Containerized Production (PostgreSQL 16)**: High-concurrency ACID transactions, explicit foreign key constraints, and relational indexes.

---

## 2. Entity Relational Model

Key tables:
- `users`: User credentials, Argon2id password hashes, and organizational roles (`HSE_ANALYST`, `HSE_MANAGER`, `DATA_SCIENTIST`, `ADMINISTRATOR`).
- `sites`: Operational complexes, field locations, and normalized risk tiers.
- `activities`: High-risk industrial work scopes (e.g. Compressor Overhaul, Crane Rigging).
- `barriers`: Critical controls, categories, and expected functions.
- `life_saving_rules`: The 9 IOGP Life-Saving Rules.
- `reports`: Normalized incident reports with report UID, narrative, actual outcome, potential consequence, and data origin.
- `report_entities`: Typed spans (HAZARD, ENERGY, EXPOSURE, BARRIER, etc.) with character offsets.
- `psif_predictions`: Calibrated pSIF probabilities, Suraksha Priority Scores, and SHAP vector contributions.
- `report_lsr_predictions`: Multi-label classifications linking reports to Life-Saving Rules.
- `precursor_clusters`: Unsupervised HDBSCAN clusters with occurrence counts and trend status.
- `review_tasks`: Human-in-the-loop review workflow records and decision justifications.
- `knowledge_documents` & `knowledge_chunks`: Governed procedure manuals and vector chunks.
- `audit_logs`: Immutable append-only audit trail.
