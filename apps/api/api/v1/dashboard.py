"""
SurakshaAI Dashboard Summary API
GET /api/v1/dashboard/summary — all real metrics in one call
"""
import time
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from apps.api.models.database import get_db
from apps.api.models.entities import (
    Report, PSIFPrediction, ReviewTask, Barrier, Alert, AuditLog
)
from apps.api.services.llm_provider import get_llm_provider

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
llm_provider = get_llm_provider()


@router.get("/summary")
async def get_dashboard_summary(db: Session = Depends(get_db)):
    """Single-call dashboard summary — all real database metrics."""
    # Core counts from DB
    total_reports = db.query(Report).count()
    psif_priority = (
        db.query(PSIFPrediction)
        .filter(PSIFPrediction.psif_probability >= 0.60)
        .count()
    )
    pending_reviews = (
        db.query(ReviewTask)
        .filter(ReviewTask.status == "PENDING")
        .count()
    )
    active_barriers = db.query(Barrier).count()
    unacknowledged_alerts = (
        db.query(Alert)
        .filter(Alert.is_acknowledged == False)
        .count()
    )

    # Barrier state breakdown from PSIF predictions
    barrier_states_raw = (
        db.query(PSIFPrediction.barrier_state, func.count(PSIFPrediction.id))
        .group_by(PSIFPrediction.barrier_state)
        .all()
    )
    barrier_states = {state: count for state, count in barrier_states_raw if state}

    # Top unacknowledged alerts
    top_alerts = (
        db.query(Alert)
        .filter(Alert.is_acknowledged == False)
        .order_by(Alert.created_at.desc())
        .limit(5)
        .all()
    )

    # Recent audit activity (last 10)
    recent_activity = (
        db.query(AuditLog)
        .order_by(AuditLog.timestamp.desc())
        .limit(10)
        .all()
    )

    # Monthly trend (last 6 months from real data)
    monthly_trend = []
    now = datetime.now(timezone.utc)
    for months_ago in range(5, -1, -1):
        month_start = (now.replace(day=1) - timedelta(days=months_ago * 30)).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        month_end = (month_start + timedelta(days=31)).replace(day=1)
        month_total = (
            db.query(Report)
            .filter(Report.date_time >= month_start, Report.date_time < month_end)
            .count()
        )
        month_psif = (
            db.query(PSIFPrediction)
            .join(Report, PSIFPrediction.report_id == Report.id)
            .filter(
                Report.date_time >= month_start,
                Report.date_time < month_end,
                PSIFPrediction.psif_probability >= 0.60,
            )
            .count()
        )
        density = round((month_psif / month_total * 100) if month_total > 0 else 0, 1)
        monthly_trend.append({
            "month": month_start.strftime("%b"),
            "total_reports": month_total,
            "psif_priority": month_psif,
            "psif_density": density,
        })

    # Barrier health breakdown per barrier name
    barrier_health = []
    barriers = db.query(Barrier).all()
    for b in barriers:
        verified = (
            db.query(PSIFPrediction)
            .filter(PSIFPrediction.primary_barrier_id == b.id, PSIFPrediction.barrier_state == "Present")
            .count()
        )
        failed = (
            db.query(PSIFPrediction)
            .filter(PSIFPrediction.primary_barrier_id == b.id, PSIFPrediction.barrier_state.in_(["Failed", "Absent", "Bypassed"]))
            .count()
        )
        degraded = (
            db.query(PSIFPrediction)
            .filter(PSIFPrediction.primary_barrier_id == b.id, PSIFPrediction.barrier_state == "Degraded")
            .count()
        )
        if verified + failed + degraded > 0:
            barrier_health.append({
                "name": b.name[:20],
                "code": b.code,
                "verified": verified,
                "unverified": degraded,
                "failed": failed,
            })

    # Ollama status
    try:
        llm_health = await llm_provider.check_health()
        ollama_status = llm_health.get("status", "unavailable")
        ollama_mode = llm_health.get("mode", "DEGRADED_FALLBACK")
        available_models = llm_health.get("available_models", [])
    except Exception:
        ollama_status = "unavailable"
        ollama_mode = "DEGRADED_FALLBACK"
        available_models = []

    return {
        "total_reports": total_reports,
        "psif_priority_count": psif_priority,
        "pending_reviews": pending_reviews,
        "active_barriers": active_barriers,
        "unacknowledged_alerts": unacknowledged_alerts,
        "barrier_states": barrier_states,
        "monthly_trend": monthly_trend,
        "barrier_health": barrier_health,
        "top_alerts": [
            {
                "id": a.id,
                "alert_type": a.alert_type,
                "severity": a.severity,
                "title": a.title,
                "message": a.message,
                "report_id": a.report_id,
                "created_at": a.created_at.isoformat() if a.created_at else None,
            }
            for a in top_alerts
        ],
        "recent_activity": [
            {
                "id": l.id,
                "action": l.action,
                "entity_type": l.entity_type,
                "entity_id": l.entity_id,
                "user_id": l.user_id,
                "details": l.details,
                "timestamp": l.timestamp.isoformat() if l.timestamp else None,
            }
            for l in recent_activity
        ],
        "ollama_status": ollama_status,
        "ollama_mode": ollama_mode,
        "available_models": available_models,
    }
