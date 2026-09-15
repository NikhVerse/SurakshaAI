# SurakshaAI — Safety Reasoning Model

## 1. Conceptual Framework

Industrial safety literature and empirical evidence demonstrate that conventional incident frequency (lagging injury counts) fails to predict catastrophic events and fatalities. A site can experience declining lost-time injury rates while simultaneously accumulating latent barrier failures that culminate in a serious injury or fatality (pSIF).

SurakshaAI operationalizes an explainable, ontology-driven reasoning chain:

```text
Hazard
  ↓
Hazardous Energy
  ↓
Human / Asset Exposure
  ↓
Required Critical Barrier
  ↓
Barrier State
  ↓
Deviation / Failure
  ↓
Credible Consequence
  ↓
pSIF Potential
```

---

## 2. Taxonomies & Ontological Classes

### Hazards
- **Electrical Energy**: Live cables, high-voltage switchgear, unverified isolations.
- **Pressure**: Hydrocarbon lines, wellhead manifolds, gas accumulators, vessels.
- **Mechanical Movement**: Rotating shafts, conveyor nip-points, pumps, drill drives.
- **Stored Energy**: Spring tension, hydraulic accumulator pressure, counterweights.
- **Chemical / Toxic**: H2S, flammable gas, sour water, acids, caustic agents.
- **Fire / Thermal**: Hot surfaces, steam leaks, open flames, welding arcs.
- **Work at Height**: Scaffolds, platform ladders, elevated pipe racks, derricks.
- **Suspended Load**: Crane boom lifts, hoist lines, pipe bundles, heavy rig equipment.
- **Confined Space**: Flash tanks, storage separators, ballast tanks, enclosed manifolds.
- **Traffic / Mobile Plant**: Forklifts, haul trucks, crew transports, heavy cranes.

### Barrier States
SurakshaAI categorizes every identified control into one of seven mutually exclusive operational states:
1. **Verified**: Tested, physically confirmed, and proven effective.
2. **Failed**: Malfunctioned, breached, or broken during active operation.
3. **Bypassed**: Intentionally or inadvertently overridden, jumpered, or disabled.
4. **Degraded**: Partially impaired, corroded, or physically worn.
5. **Absent**: Required by standard but completely missing from the job site.
6. **Unverified**: Presumed in place without empirical confirmation or zero-energy testing.
7. **Unknown**: Insufficient narrative evidence to establish control health.

---

## 3. Evidence Spans

Predictions are never presented as black-box outputs. Each detected safety entity is anchored to explicit character spans within the narrative text, providing transparent provenance for HSE reviewers.
