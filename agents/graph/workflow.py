from typing import Dict, Any, List
from ml.preprocessing.safety_nlp import SafetyNLPPreprocessor
from ml.ner.entity_extractor import SafetyEntityExtractor
from ml.psif.risk_engine import PSIFRiskEngine
from ml.lsr.classifier import LifeSavingRuleClassifier
from ml.barriers.barrier_intelligence import BarrierIntelligenceEngine
from agents.tools.bounded_tools import BoundedSafetyTools
from apps.api.services.llm_provider import get_llm_provider


class SafetyReasoningGraph:
    """Controlled state machine executing the 11-stage safety reasoning workflow."""

    def __init__(self):
        self.preprocessor = SafetyNLPPreprocessor()
        self.extractor = SafetyEntityExtractor()
        self.risk_engine = PSIFRiskEngine()
        self.lsr_classifier = LifeSavingRuleClassifier()
        self.barrier_engine = BarrierIntelligenceEngine()
        self.tools = BoundedSafetyTools()
        self.llm = get_llm_provider()

    async def execute(self, narrative: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        state = {
            "narrative": narrative.strip(),
            "metadata": metadata or {},
            "errors": [],
            "status": "INIT"
        }

        # Stage 1: Validate Report
        if not state["narrative"] or len(state["narrative"]) < 5:
            state["errors"].append("Narrative too short or empty")
            state["status"] = "INVALID"
            return state

        # Stage 2: Extract Safety Entities & Context
        context_flags = self.preprocessor.extract_contextual_flags(state["narrative"])
        entities = self.extractor.extract_entities(state["narrative"])
        state["context_flags"] = context_flags
        state["entities"] = entities

        # Stage 3: Classify Life-Saving Rules (Multi-label)
        lsr_matches = self.lsr_classifier.classify(state["narrative"], entities)
        state["lsr_matches"] = lsr_matches

        # Stage 4: Barrier Intelligence
        barrier_analysis = self.barrier_engine.analyze_barrier(entities, state["narrative"])
        state["barrier_analysis"] = barrier_analysis

        # Stage 5: Analyze Risk (Calibrated pSIF + Priority Score + SHAP)
        risk_result = self.risk_engine.compute_risk(entities, state["narrative"])
        state["risk_result"] = risk_result

        # Stage 6: Retrieve Semantically Similar Cases
        similar_cases = self.tools.search_similar_reports(state["narrative"], limit=3)
        state["similar_cases"] = similar_cases

        # Stage 7: Detect Precursor Patterns
        precursor = self.tools.check_precursor_clusters(
            state["narrative"],
            barrier_name=barrier_analysis["barrier_name"]
        )
        state["precursor"] = precursor

        # Stage 8: Retrieve Grounded Knowledge Snippets
        knowledge_snippets = self.tools.lookup_barrier_knowledge(barrier_analysis["barrier_name"])
        state["knowledge_snippets"] = knowledge_snippets

        # Stage 9: Generate Grounded Explanation
        # If OpenAI is connected, prompt it with strict grounded context; otherwise use deterministic summary
        explanation = risk_result["explanation_summary"]
        health = await self.llm.check_health()
        if health.get("status") == "connected":
            prompt = (
                f"Narrative: {state['narrative']}\n"
                f"Hazard: {risk_result.get('primary_barrier')}\n"
                f"Barrier State: {risk_result.get('barrier_state')}\n"
                f"Credible Consequence: {risk_result.get('credible_consequence')}\n"
                "Summarize the critical risk pathway in 2 clear sentences without inventing facts or claiming certainty."
            )
            llm_text = await self.llm.generate(prompt)
            if llm_text:
                explanation = llm_text
        state["grounded_explanation"] = explanation

        # Stage 10: Route to HSE Review
        # High-probability pSIF or high-priority or unverified barriers trigger human review
        requires_review = (
            risk_result["psif_probability"] >= 0.60 or
            risk_result["priority_score"] >= 65.0 or
            barrier_analysis["is_compromised"]
        )
        state["review_routing"] = {
            "requires_review": requires_review,
            "triage_urgency": "HIGH" if risk_result["psif_probability"] >= 0.75 else ("MEDIUM" if requires_review else "LOW"),
            "initial_status": "PENDING_HSE_REVIEW" if requires_review else "AUTO_TRIAGED"
        }

        state["status"] = "COMPLETED"
        return state


# Singleton instance
safety_graph = SafetyReasoningGraph()


def get_safety_graph() -> SafetyReasoningGraph:
    return safety_graph
