# SurakshaAI — Recurring Precursor Discovery

## 1. Concept

A recurring precursor is an operational condition, behavioral pattern, or barrier degradation that repeatedly occurs across multiple locations, activities, or shifts prior to an actual catastrophic consequence.

SurakshaAI employs **unsupervised HDBSCAN clustering** over sentence embeddings:
- The number of precursor clusters does not need to be hardcoded or known in advance.
- Variable-density clusters accurately capture emerging patterns versus isolated noise.

---

## 2. Cluster Validation & Coherence

Each precursor cluster is assigned:
- **Cluster Name & Human-Readable Summary**
- **Coherence Score (0.0 to 1.0)**
- **Occurrence Count & Affected Assets**
- **Associated Critical Barrier & Life-Saving Rule**
- **Trend Trajectory** (`INCREASING`, `DECREASING`, `STABLE`, `SUDDEN_EMERGENCE`)

If insufficient evidence exists, the platform displays: *"Insufficient evidence for a stable recurring precursor"* rather than inventing fictitious patterns.
