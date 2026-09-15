from typing import Dict, Any, List
from rag.knowledge_engine import get_knowledge_engine
from ml.clustering.precursors import PrecursorDiscoveryEngine

knowledge_engine = get_knowledge_engine()
precursor_engine = PrecursorDiscoveryEngine()


class BoundedSafetyTools:
    """Explicitly bounded tools for the safety reasoning workflow (no arbitrary SQL or code execution)."""

    @staticmethod
    def search_similar_reports(narrative: str, limit: int = 3) -> List[Dict[str, Any]]:
        return knowledge_engine.search_similar_reports(query=narrative, limit=limit)

    @staticmethod
    def lookup_barrier_knowledge(barrier_name: str) -> List[Dict[str, Any]]:
        return knowledge_engine.search_knowledge(query=barrier_name, limit=2)

    @staticmethod
    def check_precursor_clusters(narrative: str, barrier_name: str = None) -> Dict[str, Any]:
        return precursor_engine.match_precursor(narrative=narrative, barrier_name=barrier_name)
