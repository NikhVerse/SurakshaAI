# SurakshaAI — pSIF Model & Calibration Architecture

## 1. Machine Learning Strategy

Rare-event classification requires strict statistical rigor. Optimizing for raw accuracy in safety datasets is inherently deceptive: a trivial model predicting non-pSIF for 99% of reports exhibits 99% accuracy while missing all fatalities.

SurakshaAI decouples the LLM from risk scoring:
```text
Text Embeddings + Structured Safety Signals + Operational Metadata
                               ↓
                 Gradient Boosted Classifier
                               ↓
              Platt Scaling / Isotonic Calibration
                               ↓
                 Calibrated pSIF Probability
```

---

## 2. Probability Calibration

Raw model scores cannot be presented to industrial leaders as trustworthy probabilities. SurakshaAI applies **Platt scaling** (logistic sigmoid transformation of raw decision values) to guarantee that predicted probabilities reflect empirical event frequencies.

Reliability metrics:
- **Brier Score**: Measures overall probabilistic accuracy.
- **Expected Calibration Error (ECE)**: Quantifies deviation from the ideal diagonal reliability curve.
- **PR-AUC (Precision-Recall Area Under Curve)**: The primary evaluation metric for rare-event imbalance.

---

## 3. Suraksha Priority Score

The platform explicitly separates **Statistical Model Probability** from **Organizational Priority**:

$$\text{Priority Score} = w_1 \cdot P(\text{pSIF}) + w_2 \cdot B_{\text{critical}} + w_3 \cdot D_{\text{deviation}} + w_4 \cdot C_{\text{confidence}}$$

- $P(\text{pSIF})$: Calibrated statistical probability (weight: 0.45)
- $B_{\text{critical}}$: Barrier criticality factor (weight: 0.30)
- $D_{\text{deviation}}$: Procedural deviation flag (weight: 0.15)
- $C_{\text{confidence}}$: Extraction confidence (weight: 0.10)

Scale: 0 to 100, where $\ge 75$ represents high triage urgency.
