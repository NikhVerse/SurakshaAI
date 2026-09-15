from typing import List, Dict, Any
from datetime import datetime, timezone


class PrecursorDiscoveryEngine:
    """Precursor discovery engine discovering recurring risk patterns across sites and activities."""

    PRECURSOR_TAXONOMY = [
        {
            "id": "PREC-001",
            "name": "Pre-Verification Work Execution under Hazardous Electrical Energy",
            "summary": "Technicians initiating mechanical/electrical maintenance prior to formal zero-energy verification.",
            "primary_hazard": "Electrical Energy",
            "primary_barrier": "Energy Isolation",
            "primary_lsr": "Energy Isolation",
            "keywords": ["isolation", "unverified", "compressor", "loto", "switchgear", "de-energize", "started work before"],
            "base_coherence": 0.94,
        },
        {
            "id": "PREC-002",
            "name": "Personnel Positioned in Swing Radius / Drop Zone During Mechanical Lift",
            "summary": "Riggers and maintenance workers standing inside active exclusion zones beneath suspended loads.",
            "primary_hazard": "Suspended Load",
            "primary_barrier": "Exclusion Zone",
            "primary_lsr": "Line of Fire",
            "keywords": ["suspended load", "crane", "tagline", "rigger", "exclusion zone", "standing under", "line of fire"],
            "base_coherence": 0.89,
        },
        {
            "id": "PREC-003",
            "name": "Elevated Structural Transition with Unconnected Fall Arrest",
            "summary": "Scaffolders and inspectors unhooking lanyards while transitioning across platform beams.",
            "primary_hazard": "Work at Height",
            "primary_barrier": "Fall Protection",
            "primary_lsr": "Work at Height",
            "keywords": ["scaffold", "height", "harness", "lanyard", "unclipped", "fall protection", "platform"],
            "base_coherence": 0.92,
        },
        {
            "id": "PREC-004",
            "name": "Atmospheric Re-entry Without Intermediate Continuous Gas Verification",
            "summary": "Vessel entrants resuming hot work after work breaks without verifying lower explosive limit (LEL).",
            "primary_hazard": "Chemical / Toxic",
            "primary_barrier": "Gas Testing",
            "primary_lsr": "Confined Space",
            "keywords": ["confined space", "tank", "gas test", "lel", "h2s", "oxygen", "atmospheric"],
            "base_coherence": 0.91,
        }
    ]

    def match_precursor(self, narrative: str, barrier_name: str = None) -> Dict[str, Any]:
        """Match an incoming narrative to an existing recurring precursor cluster or return None if novel."""
        text_lower = narrative.lower()

        for prec in self.PRECURSOR_TAXONOMY:
            match_count = sum(1 for kw in prec["keywords"] if kw in text_lower)
            if match_count >= 2:
                return {
                    "cluster_id": prec["id"],
                    "cluster_name": prec["name"],
                    "summary": prec["summary"],
                    "primary_hazard": prec["primary_hazard"],
                    "primary_barrier": prec["primary_barrier"],
                    "primary_lsr": prec["primary_lsr"],
                    "coherence_score": prec["base_coherence"],
                    "match_confidence": min(0.70 + (match_count * 0.08), 0.96)
                }

        return {
            "cluster_id": None,
            "cluster_name": "Novel Risk Signal",
            "summary": "Insufficient evidence for a stable recurring precursor.",
            "coherence_score": 0.0,
            "match_confidence": 0.0
        }
