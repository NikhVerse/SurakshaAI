import re
from typing import List, Dict, Any


class SafetyEntityExtractor:
    """Industrial safety entity extractor mapping narrative spans to ontology concepts."""

    LEXICON = {
        "HAZARD": [
            (r"\belectrical\s+energy\b|\belectricity\b|\blive\s+cable\b|\bhigh\s+voltage\b", "Electrical Energy"),
            (r"\bhigh\s+pressure\b|\bpressurized\s+line\b|\bpressure\s+surge\b", "Pressure"),
            (r"\brotating\s+equipment\b|\bmoving\s+parts\b|\bmachinery\b", "Mechanical Movement"),
            (r"\bstored\s+energy\b|\bspring\s+tension\b|\baccumulator\b", "Stored Energy"),
            (r"\btoxic\s+gas\b|\bh2s\b|\bhydrocarbon\b|\bchemical\s+splash\b|\bflammable\b", "Chemical / Toxic"),
            (r"\bfire\b|\bexplosion\b|\bhot\s+work\b|\bspark\b", "Fire / Thermal"),
            (r"\bwork\s+at\s+height\b|\belevated\s+platform\b|\bscaffold\b|\bladder\b", "Work at Height"),
            (r"\bsuspended\s+load\b|\boverhead\s+crane\b|\brigger\b|\blifting\s+gear\b", "Suspended Load"),
            (r"\bconfined\s+space\b|\btank\s+entry\b|\bvessel\s+entry\b|\bpipeline\b", "Confined Space"),
            (r"\bheavy\s+vehicle\b|\bforklift\b|\btraffic\b|\bmobile\s+plant\b", "Traffic / Mobile Plant"),
        ],
        "ENERGY": [
            (r"\belectrical\b|\belectric\b|\bvolts?\b|\bkw\b|\bamps?\b", "Electrical"),
            (r"\bhydraulic\b|\bfluid\s+power\b", "Hydraulic"),
            (r"\bpneumatic\b|\bcompressed\s+air\b", "Pneumatic"),
            (r"\bpressure\b|\bpsi\b|\bbar\b", "Pressure"),
            (r"\bthermal\b|\bheat\b|\bsteam\b|\bhot\b", "Thermal"),
            (r"\bchemical\b|\bgas\b|\bacid\b|\btoxic\b", "Chemical"),
            (r"\bgravitational\b|\bfalling\b|\belevation\b", "Gravitational"),
            (r"\bkinetic\b|\bmomentum\b|\bmoving\b", "Kinetic"),
            (r"\bmechanical\b", "Mechanical"),
        ],
        "EXPOSURE": [
            (r"\btechnician\b|\btechnicians\b", "Technician"),
            (r"\boperator\b|\boperators\b", "Operator"),
            (r"\bworker\b|\bworkers\b|\bpersonnel\b|\bcrew\b", "Worker"),
            (r"\brigger\b|\briggers\b", "Rigger"),
            (r"\bline\s+of\s+fire\b", "Line of Fire"),
            (r"\bentered\b|\bentering\b|\binside\b", "Enclosure Entry"),
            (r"\bproximity\b|\bstanding\s+under\b|\bunderneath\b", "Proximity to Danger"),
            (r"\bhand\s+placement\b|\bfinger\s+pinch\b|\bcontact\b", "Physical Contact"),
        ],
        "BARRIER": [
            (r"\belectrical\s+isolation\b|\bisolation\b|\bloto\b|\blockout\b|\btagout\b", "Energy Isolation"),
            (r"\bpermit\s+to\s+work\b|\bwork\s+permit\b|\bptw\b|\bwork\s+authorization\b", "Work Authorisation"),
            (r"\bgas\s+test(ing)?\b|\batmospheric\s+test\b|\bmultigas\b", "Gas Testing"),
            (r"\bguard(ing)?\b|\binterlock(s)?\b|\bphysical\s+barrier\b", "Guarding / Interlock"),
            (r"\bfall\s+protection\b|\bfall\s+arrest\b|\bharness\b|\blanyard\b|\blifeline\b", "Fall Protection"),
            (r"\bexclusion\s+zone\b|\bbarricade\b|\bwarning\s+tape\b", "Exclusion Zone"),
            (r"\blifting\s+plan\b|\blifting\s+permit\b|\btagline\b", "Lifting Control"),
            (r"\bseatbelt\b|\bspeed\s+limit\b|\bjourney\s+plan\b", "Traffic Control"),
        ],
        "BARRIER_STATE": [
            (r"\bverified\b|\bconfirmed\b|\btested\s+effective\b", "Verified"),
            (r"\bfailed\b|\bmalfunctioned\b|\bbroken\b|\bleaked\b", "Failed"),
            (r"\bbypassed\b|\boverridden\b|\bdisabled\b|\bjumpered\b", "Bypassed"),
            (r"\bdegraded\b|\bdamaged\b|\bworn\b|\bcorroded\b", "Degraded"),
            (r"\babsent\b|\bmissing\b|\bnot\s+installed\b|\bwithout\b", "Absent"),
            (r"\bunverified\b|\bbefore\s+confirming\b|\bbefore\s+verifying\b|\bnot\s+verified\b", "Unverified"),
        ],
        "DEVIATION": [
            (r"\bstarted\s+work\s+before\s+confirming\b", "Work Started Before Verification"),
            (r"\bwork(ed)?\s+without\s+a?\s*permit\b", "Unpermitted Work Execution"),
            (r"\bfailure\s+to\s+isolate\b|\bno\s+loto\b", "Failure to Isolate Hazardous Energy"),
            (r"\bbypassed\s+(guard|safety|interlock)\b", "Safety Control Bypass"),
            (r"\bunhooked\s+harness\b|\bdetached\s+lanyard\b", "Detached Fall Arrest Device"),
            (r"\bwalked\s+under\s+load\b|\bstanding\s+in\s+line\s+of\s+fire\b", "Positioned In Line of Fire"),
        ],
        "CONSEQUENCE": [
            (r"\belectric\s+shock\b|\barc[- ]flash\b|\belectrocution\b", "Electric Shock / Arc Flash"),
            (r"\bfall\s+from\s+height\b|\bfall\b", "Fall from Height"),
            (r"\btoxic\s+inhalation\b|\basphyxiation\b", "Toxic Inhalation / Asphyxiation"),
            (r"\bcrush(ing)?\b|\bpch-point\b|\bentrapment\b", "Crush Injury / Entrapment"),
            (r"\bstruck\s+by\s+(falling\s+)?(object|load)\b", "Struck by Suspended Object"),
            (r"\bhydrocarbon\s+release\b|\bfire\s+outbreak\b", "Loss of Containment / Fire"),
        ],
        "ACTIVITY": [
            (r"\bmaintenance\b|\bservicing\b|\brepair\b", "Maintenance"),
            (r"\bdrilling\b|\bworkover\b|\bwell\s+intervention\b", "Drilling / Well Ops"),
            (r"\blifting\b|\brigging\b|\bcrane\s+lift\b", "Mechanical Lifting"),
            (r"\bwelding\b|\bcutting\b|\bgrinding\b|\bhot\s+work\b", "Hot Work"),
            (r"\btank\s+cleaning\b|\bconfined\s+space\s+entry\b", "Confined Space Entry"),
            (r"\bdriving\b|\btransport(ation)?\b|\bhauling\b", "Vehicle Transport"),
            (r"\binspection\b|\bpatrol\b|\bwalkdown\b", "Inspection"),
        ],
        "EQUIPMENT": [
            (r"\bcompressor\b", "Compressor"),
            (r"\bcrane\b|\bhoist\b|\bderrick\b", "Crane / Hoist"),
            (r"\bpump\b|\bmotor\b", "Pump / Motor"),
            (r"\bvalve\b|\bflange\b|\bmanifold\b", "Valve / Manifold"),
            (r"\bgenerator\b|\btransformer\b|\bswitchgear\b|\bmcc\b", "Electrical Switchgear / Generator"),
            (r"\bscaffold(ing)?\b", "Scaffold"),
            (r"\bpipeline\b|\bpipe\b|\bfull-bore\b", "Piping"),
            (r"\bvessel\b|\bseparator\b|\btank\b", "Vessel / Tank"),
        ]
    }

    def extract_entities(self, narrative: str) -> List[Dict[str, Any]]:
        """Extract all matching entity spans from the text."""
        entities = []
        seen_spans = set()

        for entity_type, patterns in self.LEXICON.items():
            for pattern, canonical_val in patterns:
                for match in re.finditer(pattern, narrative, re.IGNORECASE):
                    start, end = match.span()
                    text_span = match.group(0)

                    # Deduplicate overlapping spans of the same entity type
                    span_key = (start, end, entity_type)
                    if span_key not in seen_spans:
                        seen_spans.add(span_key)
                        entities.append({
                            "entity_type": entity_type,
                            "value": canonical_val,
                            "text_span": text_span,
                            "start_char": start,
                            "end_char": end,
                            "confidence": 0.95
                        })

        # Sort entities by starting character position
        entities.sort(key=lambda x: x["start_char"])
        return entities
