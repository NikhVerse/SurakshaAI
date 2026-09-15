"""
SurakshaAI Taxonomy API — Sites, Activities, Barriers, Life-Saving Rules
"""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from apps.api.models.database import get_db
from apps.api.models.entities import Site, Activity, Barrier, LifeSavingRule
from apps.api.schemas.schemas import BarrierItem, LSRItem

router = APIRouter(tags=["Taxonomy"])


@router.get("/sites")
def list_sites(db: Session = Depends(get_db)):
    return db.query(Site).all()


@router.get("/activities")
def list_activities(db: Session = Depends(get_db)):
    return db.query(Activity).all()


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
