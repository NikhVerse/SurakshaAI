from ml.ner.entity_extractor import SafetyEntityExtractor
from ml.psif.risk_engine import PSIFRiskEngine
from ml.lsr.classifier import LifeSavingRuleClassifier
from ml.barriers.barrier_intelligence import BarrierIntelligenceEngine


def test_entity_extraction():
    extractor = SafetyEntityExtractor()
    narrative = "During maintenance of a compressor, the technician started work before confirming that electrical isolation was effective. No injury occurred."
    entities = extractor.extract_entities(narrative)

    types = {e["entity_type"] for e in entities}
    assert "ACTIVITY" in types
    assert "EQUIPMENT" in types
    assert "EXPOSURE" in types
    assert "BARRIER" in types
    assert "BARRIER_STATE" in types


def test_psif_risk_computation():
    extractor = SafetyEntityExtractor()
    risk_engine = PSIFRiskEngine()

    narrative = "During maintenance of a compressor, the technician started work before confirming that electrical isolation was effective."
    entities = extractor.extract_entities(narrative)
    risk = risk_engine.compute_risk(entities, narrative)

    assert risk["psif_probability"] >= 0.70
    assert risk["priority_score"] >= 70.0
    assert risk["is_calibrated"] is True
    assert "Barrier State Failure/Unverified" in risk["shap_values"]


def test_lsr_classification():
    classifier = LifeSavingRuleClassifier()
    narrative = "Technician entered without verifying electrical isolation."
    matches = classifier.classify(narrative)

    assert len(matches) > 0
    top_rule = matches[0]
    assert top_rule["code"] == "LSR-04"
    assert top_rule["name"] == "Energy Isolation"
