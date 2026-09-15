import re
from typing import List, Dict, Any, Tuple


class SafetyNLPPreprocessor:
    """Industrial safety NLP preprocessor with negation, temporal, and conditional awareness."""

    NEGATION_PATTERNS = [
        r"\bno\b", r"\bnot\b", r"\bnever\b", r"\bwithout\b", r"\bneither\b",
        r"\bnone\b", r"\bunable to\b", r"\bfailure to\b", r"\bdid not\b",
        r"\bwas not\b", r"\bwere not\b", r"\bcould not\b", r"\bwithout verifying\b",
        r"\bbefore confirming\b", r"\bbefore verifying\b", r"\blacking\b"
    ]

    TEMPORAL_HISTORICAL_PATTERNS = [
        r"\bhistorically\b", r"\bpreviously\b", r"\bin the past\b",
        r"\blast month\b", r"\blast year\b", r"\byesterday\b",
        r"\bprior event\b", r"\bearlier incident\b"
    ]

    CONDITIONAL_PATTERNS = [
        r"\bcould have\b", r"\bmight have\b", r"\bwould have\b",
        r"\bpotential to\b", r"\bif\b", r"\bunlikely\b", r"\bpossibility of\b"
    ]

    def __init__(self):
        self.neg_regex = re.compile("|".join(self.NEGATION_PATTERNS), re.IGNORECASE)
        self.hist_regex = re.compile("|".join(self.TEMPORAL_HISTORICAL_PATTERNS), re.IGNORECASE)
        self.cond_regex = re.compile("|".join(self.CONDITIONAL_PATTERNS), re.IGNORECASE)

    def segment_sentences(self, text: str) -> List[str]:
        """Split text into sentences while preserving domain abbreviations."""
        raw_sentences = re.split(r'(?<=[.!?])\s+', text.strip())
        return [s.strip() for s in raw_sentences if s.strip()]

    def analyze_sentence_context(self, sentence: str) -> Dict[str, Any]:
        """Analyze a single sentence for negation, historical context, and conditional tone."""
        has_negation = bool(self.neg_regex.search(sentence))
        is_historical = bool(self.hist_regex.search(sentence))
        is_conditional = bool(self.cond_regex.search(sentence))

        # Detect specific safety-critical negation semantics like "No injury occurred" vs "No barrier was in place"
        injury_negated = bool(re.search(r"\bno\s+(injury|harm|damage|fatality|loss)\b", sentence, re.IGNORECASE))
        barrier_negated = bool(re.search(r"\b(no|without|before|lacking)\s+(?:verifying\s+|confirming\s+|establishing\s+|conducting\s+)?(permit|isolation|lockout|tagout|guard|test|ppe)\b", sentence, re.IGNORECASE))

        return {
            "sentence": sentence,
            "has_negation": has_negation,
            "is_historical": is_historical,
            "is_conditional": is_conditional,
            "injury_negated": injury_negated,
            "barrier_negated": barrier_negated
        }

    def extract_contextual_flags(self, narrative: str) -> Dict[str, Any]:
        """Process full narrative and produce contextual safety indicators."""
        sentences = self.segment_sentences(narrative)
        sentence_analyses = [self.analyze_sentence_context(s) for s in sentences]

        has_historical_reference = any(a["is_historical"] for a in sentence_analyses)
        has_injury_negation = any(a["injury_negated"] for a in sentence_analyses)
        has_barrier_deviation = any(a["barrier_negated"] for a in sentence_analyses)

        return {
            "sentence_count": len(sentences),
            "sentence_analyses": sentence_analyses,
            "has_historical_reference": has_historical_reference,
            "actual_injury_negated": has_injury_negation,
            "barrier_deviation_indicated": has_barrier_deviation,
        }
