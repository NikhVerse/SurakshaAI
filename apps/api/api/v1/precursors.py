"""
SurakshaAI Precursor Cluster API
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from apps.api.models.database import get_db
from apps.api.models.entities import PrecursorCluster
from apps.api.schemas.schemas import PrecursorClusterResponse

router = APIRouter(prefix="/precursors", tags=["Precursor Intelligence"])


@router.get("", response_model=List[PrecursorClusterResponse])
def list_precursor_clusters(db: Session = Depends(get_db)):
    clusters = db.query(PrecursorCluster).order_by(PrecursorCluster.latest_seen.desc()).all()
    return [
        PrecursorClusterResponse(
            id=c.id,
            name=c.name,
            summary=c.summary,
            coherence_score=c.coherence_score,
            occurrence_count=c.occurrence_count,
            primary_hazard=c.primary_hazard,
            primary_barrier=c.barrier.name if c.barrier else None,
            primary_lsr=c.rule.name if c.rule else None,
            trend_status=c.trend_status,
            first_seen=c.first_seen,
            latest_seen=c.latest_seen,
            affected_sites=c.affected_sites or [],
            affected_activities=c.affected_activities or [],
            example_report_ids=c.example_report_ids or [],
        )
        for c in clusters
    ]


@router.get("/{cluster_id}")
def get_precursor_cluster(cluster_id: str, db: Session = Depends(get_db)):
    c = db.query(PrecursorCluster).filter(PrecursorCluster.id == cluster_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Precursor cluster not found")
    return PrecursorClusterResponse(
        id=c.id, name=c.name, summary=c.summary,
        coherence_score=c.coherence_score, occurrence_count=c.occurrence_count,
        primary_hazard=c.primary_hazard,
        primary_barrier=c.barrier.name if c.barrier else None,
        primary_lsr=c.rule.name if c.rule else None,
        trend_status=c.trend_status, first_seen=c.first_seen, latest_seen=c.latest_seen,
        affected_sites=c.affected_sites or [],
        affected_activities=c.affected_activities or [],
        example_report_ids=c.example_report_ids or [],
    )
