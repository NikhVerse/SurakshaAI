"""
SurakshaAI Triage API
"""
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from apps.api.models.database import get_db
from apps.api.models.entities import ReviewTask, Report, PSIFPrediction, Barrier, LifeSavingRule, AuditLog
from apps.api.auth.dependencies import get_current_user
from apps.api.schemas.schemas import ReviewDecisionCreate

router = APIRouter(prefix="/triage", tags=["Triage"])


@router.get("")
def list_triage_tasks(
    status_filter: Optional[str] = Query("PENDING"),
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(ReviewTask)
    if status_filter and status_filter != "ALL":
        query = query.filter(ReviewTask.status == status_filter)
    tasks = query.order_by(ReviewTask.created_at.desc()).limit(limit).all()

    results = []
    for t in tasks:
        r = t.report
        if not r:
            continue
        psif = r.psif_prediction
        lsr_pred = r.lsr_predictions[0] if r.lsr_predictions else None
        results.append({
            "task_id": t.id,
            "report_id": r.id,
            "report_uid": r.report_uid,
            "date_time": r.date_time.isoformat() if r.date_time else None,
            "site_name": r.site.name if r.site else "Corporate Operations",
            "activity_name": r.activity.name if r.activity else "General Operations",
            "narrative_snippet": r.narrative[:140] + ("..." if len(r.narrative) > 140 else ""),
            "psif_probability": psif.psif_probability if psif else 0.5,
            "priority_score": psif.priority_score if psif else 0.5,
            "confidence": psif.confidence if psif else 0.7,
            "primary_barrier": psif.barrier.name if (psif and psif.barrier) else "Energy Isolation",
            "barrier_state": psif.barrier_state if psif else "Unknown",
            "primary_lsr": lsr_pred.rule.name if (lsr_pred and lsr_pred.rule) else "LSR-04",
            "status": t.status,
            "decision": t.decision,
            "reason": t.reason,
        })
    return results


@router.post("/{task_id}/decision")
def submit_triage_decision(
    task_id: str,
    payload: ReviewDecisionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    task = db.query(ReviewTask).filter(ReviewTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Triage task not found")

    valid_decisions = {"CONFIRMED", "MODIFIED", "REJECTED", "NEEDS_INFO", "ESCALATED"}
    if payload.decision not in valid_decisions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid decision. Must be one of: {', '.join(valid_decisions)}"
        )

    task.status = "COMPLETED"
    task.decision = payload.decision
    task.modified_psif = payload.modified_psif
    task.modified_barrier_id = payload.modified_barrier_id
    task.modified_lsr_id = payload.modified_lsr_id
    task.reason = payload.reason
    task.comments = payload.comments
    task.is_training_feedback = payload.is_training_feedback
    task.completed_at = datetime.now(timezone.utc)
    task.reviewer_id = current_user.id if current_user else None

    # Update report review status
    if task.report:
        task.report.review_status = "REVIEWED"

    audit = AuditLog(
        user_id=current_user.id if current_user else "SYSTEM",
        action="TRIAGE_DECISION",
        entity_type="REPORT",
        entity_id=task.report_id,
        details={
            "task_id": task.id,
            "decision": payload.decision,
            "report_uid": task.report.report_uid if task.report else None,
        }
    )
    db.add(audit)
    db.commit()

    return {
        "task_id": task.id,
        "decision": task.decision,
        "status": task.status,
        "completed_at": task.completed_at.isoformat() if task.completed_at else None,
    }
