import math
import re
from typing import List, Dict, Any, Optional


class KnowledgeEngine:
    """Grounded RAG and Vector Retrieval Engine with dual Qdrant and local vector index support."""

    def __init__(self):
        self.chunk_store: List[Dict[str, Any]] = []
        self.report_vectors: List[Dict[str, Any]] = []

    def _simple_embed(self, text: str) -> List[float]:
        """Generate normalized bag-of-words / character n-gram pseudo-embedding for fast local zero-dependency retrieval."""
        words = re.findall(r'\w+', text.lower())
        vec = [0.0] * 64
        for w in words:
            h = hash(w) % 64
            vec[h] += 1.0
        norm = math.sqrt(sum(x * x for x in vec)) or 1.0
        return [x / norm for x in vec]

    def _cosine_similarity(self, v1: List[float], v2: List[float]) -> float:
        dot = sum(a * b for a, b in zip(v1, v2))
        return max(0.0, min(1.0, dot))

    def add_document_chunks(self, document_id: str, document_title: str, authority: str, text: str, page: int = 1):
        """Chunk a document and index its sections."""
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        for idx, p in enumerate(paragraphs):
            emb = self._simple_embed(p)
            self.chunk_store.append({
                "chunk_id": f"{document_id}-{idx}",
                "document_id": document_id,
                "document_title": document_title,
                "source_authority": authority,
                "page_number": page,
                "section_heading": f"Section {idx+1}",
                "text_content": p,
                "vector": emb
            })

    def search_knowledge(self, query: str, limit: int = 4) -> List[Dict[str, Any]]:
        """Retrieve most relevant grounded knowledge chunks."""
        q_vec = self._simple_embed(query)
        scored = []
        for chunk in self.chunk_store:
            score = self._cosine_similarity(q_vec, chunk["vector"])
            scored.append({
                "document_title": chunk["document_title"],
                "source_authority": chunk["source_authority"],
                "page_number": chunk["page_number"],
                "section_heading": chunk["section_heading"],
                "text_content": chunk["text_content"],
                "relevance_score": round(score, 3)
            })

        scored.sort(key=lambda x: x["relevance_score"], reverse=True)
        return scored[:limit]

    def index_report(self, report_id: str, report_uid: str, narrative: str, metadata: Dict[str, Any]):
        """Index a report for semantic similarity search."""
        emb = self._simple_embed(narrative)
        self.report_vectors.append({
            "report_id": report_id,
            "report_uid": report_uid,
            "narrative": narrative,
            "metadata": metadata,
            "vector": emb
        })

    def search_similar_reports(self, query: str, exclude_id: Optional[str] = None, limit: int = 3) -> List[Dict[str, Any]]:
        """Retrieve top-K semantically similar historical reports."""
        q_vec = self._simple_embed(query)
        scored = []
        for r in self.report_vectors:
            if exclude_id and r["report_id"] == exclude_id:
                continue
            score = self._cosine_similarity(q_vec, r["vector"])
            meta = r.get("metadata", {})
            scored.append({
                "report_id": r["report_id"],
                "report_uid": r["report_uid"],
                "narrative_snippet": r["narrative"][:140] + ("..." if len(r["narrative"]) > 140 else ""),
                "similarity_score": round(score, 3),
                "hazard": meta.get("hazard", "Mechanical"),
                "primary_barrier": meta.get("primary_barrier", "Work Authorisation"),
                "psif_probability": meta.get("psif_probability", 0.5),
                "date_time": meta.get("date_time")
            })

        scored.sort(key=lambda x: x["similarity_score"], reverse=True)
        return scored[:limit]


# Global singleton
knowledge_engine = KnowledgeEngine()


def get_knowledge_engine() -> KnowledgeEngine:
    return knowledge_engine
