# SurakshaAI — Controlled Agentic Workflow & LangGraph State Machine

## 1. Controlled State Machine vs Unrestricted Autonomous Agents

Unrestricted autonomous agents pose extreme risks in mission-critical industrial safety environments. Allowing an agent to execute self-directed loops, unconstrained SQL queries, or arbitrary code is unacceptable.

SurakshaAI employs a **strictly controlled state machine** pattern:

```text
ValidateReport
     ↓
ExtractSafetyEntities
     ↓
ClassifyLifeSavingRules
     ↓
AnalyzeBarrier
     ↓
AnalyzeRisk (pSIF + Priority)
     ↓
RetrieveSimilarCases
     ↓
DetectPrecursorPattern
     ↓
RetrieveKnowledge
     ↓
GenerateGroundedExplanation
     ↓
RouteToHSEReview
```

Each stage:
- Has a single typed responsibility
- Validates tool input and output via Pydantic schemas
- Exposes no unrestricted SQL or shell commands
- Fails gracefully into degraded mode if external services are offline
