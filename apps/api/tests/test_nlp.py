from ml.preprocessing.safety_nlp import SafetyNLPPreprocessor


def test_sentence_segmentation_and_negation():
    nlp = SafetyNLPPreprocessor()
    text = "Technician entered without verifying isolation. No injury occurred."
    flags = nlp.extract_contextual_flags(text)

    assert flags["sentence_count"] == 2
    assert flags["actual_injury_negated"] is True
    assert flags["barrier_deviation_indicated"] is True


def test_positive_versus_negative_safety_context():
    nlp = SafetyNLPPreprocessor()

    res_positive = nlp.analyze_sentence_context("Permit was verified before starting hot work.")
    assert res_positive["barrier_negated"] is False

    res_negative = nlp.analyze_sentence_context("Work commenced without permit verification.")
    assert res_negative["barrier_negated"] is True
