# SurakshaAI — REST API Specification

All endpoints are versioned under `/api/v1` and use strict Pydantic v2 schemas.

## Authentication
- `POST /api/v1/auth/login`: Issue short-lived JWT bearer token.
- `POST /api/v1/auth/register`: Create user with assigned RBAC role.
- `GET  /api/v1/auth/me`: Current session profile.
- `POST /api/v1/auth/logout`: Revoke session & log audit trail.

## Incident Intake & Risk Intelligence
- `GET  /api/v1/reports`: List reports with filters (site, activity, barrier, review status).
- `POST /api/v1/reports`: Ingest report & execute 11-stage safety reasoning state machine.
- `GET  /api/v1/reports/{id}`: Detailed report inspection with highlighted evidence spans.

## Human Triage & Review
- `GET  /api/v1/triage`: Queue of pending reports requiring expert human evaluation.
- `POST /api/v1/triage/{id}/decision`: Record HSE review decision (`CONFIRMED`, `MODIFIED`, `REJECTED`, `NEEDS_INFO`, `ESCALATED`).

## Knowledge Center & Grounded RAG
- `GET  /api/v1/knowledge/documents`: List indexed safety standards and manuals.
- `POST /api/v1/knowledge/upload`: Ingest new procedure with automatic chunking.
- `POST /api/v1/knowledge/query`: Source-aware grounded query synthesis.

## Diagnostics & Telemetry
- `GET  /api/v1/system/health`: Subsystem health, DB connectivity, and uptime.
- `GET  /api/v1/system/llm/health`: Ollama private brain connectivity and latency.
- `GET  /api/v1/model-health`: Full MLOps metrics (PR-AUC, F2, calibration error, data drift).
- `GET  /api/v1/audit-log`: Immutable chronological audit records.
