"""
SurakshaAI Taxonomy API — Sites, Activities, Barriers, Life-Saving Rules
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from apps.api.models.database import get_db
from apps.api.models.entities import Site, Activity, Barrier, LifeSavingRule, Report, PSIFPrediction
from apps.api.schemas.schemas import BarrierItem, LSRItem

router = APIRouter(tags=["Taxonomy"])


@router.get("/sites")
def list_sites(db: Session = Depends(get_db)):
    sites = db.query(Site).all()

    report_counts = dict(
        db.query(Report.site_id, func.count(Report.id))
        .filter(Report.site_id.isnot(None))
        .group_by(Report.site_id)
        .all()
    )
    psif_counts = dict(
        db.query(Report.site_id, func.count(Report.id))
        .join(PSIFPrediction, PSIFPrediction.report_id == Report.id)
        .filter(Report.site_id.isnot(None), PSIFPrediction.psif_probability >= 0.60)
        .group_by(Report.site_id)
        .all()
    )

    return [
        {
            "id": s.id,
            "code": s.code,
            "name": s.name,
            "location": s.location,
            "operational_unit": s.operational_unit,
            "risk_level": s.risk_level,
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "total_reports": report_counts.get(s.id, 0),
            "psif_count": psif_counts.get(s.id, 0),
        }
        for s in sites
    ]


@router.get("/activities")
def list_activities(db: Session = Depends(get_db)):
    activities = db.query(Activity).all()

    report_counts = dict(
        db.query(Report.activity_id, func.count(Report.id))
        .filter(Report.activity_id.isnot(None))
        .group_by(Report.activity_id)
        .all()
    )

    return [
        {
            "id": a.id,
            "code": a.code,
            "name": a.name,
            "category": a.category,
            "description": a.description,
            "created_at": a.created_at.isoformat() if a.created_at else None,
            "total_reports": report_counts.get(a.id, 0),
        }
        for a in activities
    ]


@router.get("/barriers", response_model=List[BarrierItem])
def list_barriers(db: Session = Depends(get_db)):
    return db.query(Barrier).all()


@router.get("/barriers/{barrier_id}")
def get_barrier(barrier_id: str, db: Session = Depends(get_db)):
    from fastapi import HTTPException
    b = db.query(Barrier).filter(Barrier.id == barrier_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Barrier not found")
    return b


@router.get("/life-saving-rules", response_model=List[LSRItem])
def list_lsrs(db: Session = Depends(get_db)):
    return db.query(LifeSavingRule).all()


@router.get("/life-saving-rules/{lsr_id}")
def get_lsr(lsr_id: str, db: Session = Depends(get_db)):
    from fastapi import HTTPException
    lsr = db.query(LifeSavingRule).filter(LifeSavingRule.id == lsr_id).first()
    if not lsr:
        raise HTTPException(status_code=404, detail="Life-Saving Rule not found")
    return lsr
