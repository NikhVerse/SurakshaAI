from typing import List, Dict, Any


class BarrierIntelligenceEngine:
    """Barrier intelligence engine evaluating critical control health and failure modes."""

    BARRIER_METADATA = {
        "Energy Isolation": {
            "expected_function": "Positively disconnect, lock out, and verify zero energy before physical access",
            "lsr_code": "LSR-04",
            "criticality": "HIGH"
        },
        "Work Authorisation": {
            "expected_function": "Formal assessment, prerequisite verification, and authorized permit before task execution",
            "lsr_code": "LSR-08",
            "criticality": "HIGH"
        },
        "Gas Testing": {
            "expected_function": "Continuous or pre-entry atmospheric sampling to detect combustible/toxic gases and oxygen levels",
            "lsr_code": "LSR-02",
            "criticality": "HIGH"
        },
        "Guarding / Interlock": {
            "expected_function": "Physical exclusion and automatic shutdown preventing mechanical contact with moving parts",
            "lsr_code": "LSR-01",
            "criticality": "MEDIUM"
        },
        "Fall Protection": {
            "expected_function": "100% tie-off harness, engineered anchor point, and shock-absorbing lanyard preventing fatal fall",
            "lsr_code": "LSR-09",
            "criticality": "HIGH"
        },
        "Exclusion Zone": {
            "expected_function": "Physical boundary restricting personnel from entering active line-of-fire or swing radius",
            "lsr_code": "LSR-06",
            "criticality": "MEDIUM"
        },
        "Lifting Control": {
            "expected_function": "Certified lifting plan, inspected rigging hardware, and qualified rigger/crane operator coordination",
            "lsr_code": "LSR-07",
            "criticality": "HIGH"
        },
        "Traffic Control": {
            "expected_function": "Segregated vehicle/pedestrian paths, active speed control, and journey management enforcement",
            "lsr_code": "LSR-03",
            "criticality": "MEDIUM"
        }
    }

    def analyze_barrier(self, entities: List[Dict[str, Any]], narrative: str) -> Dict[str, Any]:
        """Determine primary critical barrier, its observed state, and deviation description."""
        barrier_name = "Energy Isolation"
        barrier_state = "Unknown"
        evidence_spans = []

        for entity in entities:
            if entity["entity_type"] == "BARRIER":
                barrier_name = entity["value"]
                evidence_spans.append(entity["text_span"])
            elif entity["entity_type"] == "BARRIER_STATE":
                barrier_state = entity["value"]
                evidence_spans.append(entity["text_span"])

        meta = self.BARRIER_METADATA.get(barrier_name, {
            "expected_function": "Safety control intended to prevent hazardous escalation",
            "lsr_code": "LSR-08",
            "criticality": "STANDARD"
        })

        is_compromised = barrier_state in ["Failed", "Bypassed", "Unverified", "Absent", "Degraded"]

        return {
            "barrier_name": barrier_name,
            "expected_function": meta["expected_function"],
            "observed_state": barrier_state,
            "criticality": meta["criticality"],
            "related_lsr": meta["lsr_code"],
            "is_compromised": is_compromised,
            "evidence_snippets": evidence_spans,
            "confidence": 0.94 if evidence_spans else 0.70
        }
