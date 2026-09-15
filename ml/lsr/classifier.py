import re
from typing import List, Dict, Any


class LifeSavingRuleClassifier:
    """Multi-label classifier for the 9 standard IOGP Life-Saving Rules."""

    RULES = {
        "LSR-01": {
            "name": "Bypassing Safety Controls",
            "keywords": [r"\bbypass(ed)?\b", r"\boverride\b", r"\bjumper\b", r"\bdisable(d)?\b", r"\binterlock\b", r"\btamper\b"],
            "description": "Obtain authorization before overriding or disabling safety controls."
        },
        "LSR-02": {
            "name": "Confined Space",
            "keywords": [r"\bconfined\s+space\b", r"\btank\s+entry\b", r"\bvessel\b", r"\bmanhole\b", r"\batmospheric\s+test\b", r"\boxygen\b"],
            "description": "Obtain authorization before entering a confined space."
        },
        "LSR-03": {
            "name": "Driving",
            "keywords": [r"\bdriving\b", r"\bvehicle\b", r"\bseatbelt\b", r"\bspeed(ing)?\b", r"\btruck\b", r"\bmobile\s+plant\b", r"\bforklift\b"],
            "description": "Follow safe driving rules: wear seatbelts, adhere to speed limits, and avoid distractions."
        },
        "LSR-04": {
            "name": "Energy Isolation",
            "keywords": [r"\bisolat(ion|ed|e)\b", r"\bloto\b", r"\blockout\b", r"\btagout\b", r"\bzero\s+energy\b", r"\bde-energiz(e|ed)\b", r"\blive\s+cable\b", r"\belectrical\b"],
            "description": "Verify isolation and zero energy state before starting work."
        },
        "LSR-05": {
            "name": "Hot Work",
            "keywords": [r"\bhot\s+work\b", r"\bwelding\b", r"\bflame\b", r"\bspark\b", r"\bgrinding\b", r"\bfire\s+watch\b", r"\btorch\b"],
            "description": "Identify and control flammables and obtain authorization before hot work."
        },
        "LSR-06": {
            "name": "Line of Fire",
            "keywords": [r"\bline\s+of\s+fire\b", r"\bstruck\s+by\b", r"\bpinch[- ]point\b", r"\bunder\s+(the\s+)?load\b", r"\btension(ed)?\b", r"\bstored\s+energy\b", r"\brecoil\b"],
            "description": "Position yourself and others away from moving equipment, suspended loads, and stored energy."
        },
        "LSR-07": {
            "name": "Safe Mechanical Lifting",
            "keywords": [r"\blifting\b", r"\bcrane\b", r"\brigger\b", r"\brigging\b", r"\bsling\b", r"\bhoist\b", r"\bsuspended\s+load\b", r"\btagline\b"],
            "description": "Plan lifting operations and control the lift area."
        },
        "LSR-08": {
            "name": "Work Authorisation",
            "keywords": [r"\bpermit\b", r"\bptw\b", r"\bwork\s+authoris?ation\b", r"\bjob\s+safety\s+analysis\b", r"\bjsa\b", r"\btoolbox\b", r"\btbt\b"],
            "description": "Work with a valid permit when required and understand the scope and controls."
        },
        "LSR-09": {
            "name": "Work at Height",
            "keywords": [r"\bheight(s)?\b", r"\bscaffold(ing)?\b", r"\bharness\b", r"\bfall\s+arrest\b", r"\blanyard\b", r"\belevated\b", r"\bladder\b"],
            "description": "Protect yourself against a fall when working at height."
        }
    }

    def classify(self, narrative: str, entities: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Classify narrative into multiple relevant Life-Saving Rules with supporting evidence."""
        matches = []

        for rule_code, rule_info in self.RULES.items():
            matched_spans = []
            for pattern in rule_info["keywords"]:
                for m in re.finditer(pattern, narrative, re.IGNORECASE):
                    matched_spans.append(m.group(0))

            if matched_spans:
                # Confidence proportional to keyword occurrences and entity support
                confidence = min(0.65 + (len(matched_spans) * 0.12), 0.98)
                matches.append({
                    "code": rule_code,
                    "name": rule_info["name"],
                    "confidence": round(confidence, 2),
                    "supporting_evidence": f"Matched safety indicators: {', '.join(set(matched_spans))}",
                    "description": rule_info["description"]
                })

        # Sort by confidence descending
        matches.sort(key=lambda x: x["confidence"], reverse=True)

        # Assign ranks
        for idx, item in enumerate(matches):
            item["rank"] = idx + 1

        return matches
