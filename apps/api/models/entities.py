import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Text, Float, Integer, Boolean, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from apps.api.models.database import Base


def get_utc_now():
    return datetime.now(timezone.utc)


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="HSE_ANALYST", nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=get_utc_now)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)

    reviews = relationship("ReviewTask", back_populates="reviewer")


class Site(Base):
    __tablename__ = "sites"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=True)
    operational_unit = Column(String(255), nullable=True)
    risk_level = Column(String(50), default="STANDARD")
    created_at = Column(DateTime, default=get_utc_now)

    reports = relationship("Report", back_populates="site")


class Activity(Base):
    __tablename__ = "activities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)

    reports = relationship("Report", back_populates="activity")


class Barrier(Base):
    __tablename__ = "barriers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=True)
    expected_function = Column(Text, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)


class LifeSavingRule(Base):
    __tablename__ = "life_saving_rules"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    guidance = Column(Text, nullable=True)
    icon_name = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=get_utc_now)


class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    report_uid = Column(String(50), unique=True, index=True, nullable=False)
    report_type = Column(String(50), default="NEAR_MISS", nullable=False)
    date_time = Column(DateTime, default=get_utc_now, nullable=False)
    site_id = Column(String(36), ForeignKey("sites.id"), nullable=True)
    location = Column(String(255), nullable=True)
    activity_id = Column(String(36), ForeignKey("activities.id"), nullable=True)
    equipment = Column(String(255), nullable=True)
    contractor_internal = Column(String(50), default="INTERNAL")
    narrative = Column(Text, nullable=False)
    actual_outcome = Column(Text, nullable=True)
    potential_consequence = Column(Text, nullable=True)
    source = Column(String(100), default="HSE Direct Entry")
    tags = Column(JSON, default=list)
    data_origin = Column(String(50), default="SYNTHETIC", nullable=False)
    review_status = Column(String(50), default="PENDING", index=True)
    created_at = Column(DateTime, default=get_utc_now)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)

    site = relationship("Site", back_populates="reports")
    activity = relationship("Activity", back_populates="reports")
    entities = relationship("ReportEntity", back_populates="report", cascade="all, delete-orphan")
    psif_prediction = relationship("PSIFPrediction", back_populates="report", uselist=False, cascade="all, delete-orphan")
    lsr_predictions = relationship("ReportLSRPrediction", back_populates="report", cascade="all, delete-orphan")
    review_tasks = relationship("ReviewTask", back_populates="report", cascade="all, delete-orphan")


class ReportEntity(Base):
    __tablename__ = "report_entities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    report_id = Column(String(36), ForeignKey("reports.id"), nullable=False, index=True)
    entity_type = Column(String(50), nullable=False)  # HAZARD, ENERGY, EXPOSURE, BARRIER, BARRIER_STATE, DEVIATION, CONSEQUENCE
    value = Column(String(255), nullable=False)
    text_span = Column(Text, nullable=False)
    start_char = Column(Integer, nullable=False)
    end_char = Column(Integer, nullable=False)
    confidence = Column(Float, default=1.0)

    report = relationship("Report", back_populates="entities")


class PSIFPrediction(Base):
    __tablename__ = "psif_predictions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    report_id = Column(String(36), ForeignKey("reports.id"), unique=True, nullable=False, index=True)
    psif_probability = Column(Float, nullable=False)
    priority_score = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    is_calibrated = Column(Boolean, default=True)
    primary_barrier_id = Column(String(36), ForeignKey("barriers.id"), nullable=True)
    barrier_state = Column(String(50), nullable=True)  # Present, Verified, Failed, Degraded, Bypassed, Absent, Unknown
    credible_consequence = Column(Text, nullable=True)
    explanation_summary = Column(Text, nullable=True)
    shap_values = Column(JSON, default=dict)
    model_version = Column(String(50), default="psif-ensemble-v1.0.0")
    created_at = Column(DateTime, default=get_utc_now)

    report = relationship("Report", back_populates="psif_prediction")
    barrier = relationship("Barrier")


class ReportLSRPrediction(Base):
    __tablename__ = "report_lsr_predictions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    report_id = Column(String(36), ForeignKey("reports.id"), nullable=False, index=True)
    lsr_id = Column(String(36), ForeignKey("life_saving_rules.id"), nullable=False)
    confidence = Column(Float, nullable=False)
    supporting_evidence = Column(Text, nullable=True)
    rank = Column(Integer, default=1)

    report = relationship("Report", back_populates="lsr_predictions")
    rule = relationship("LifeSavingRule")


class PrecursorCluster(Base):
    __tablename__ = "precursor_clusters"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    coherence_score = Column(Float, default=0.85)
    occurrence_count = Column(Integer, default=1)
    primary_hazard = Column(String(100), nullable=True)
    primary_barrier_id = Column(String(36), ForeignKey("barriers.id"), nullable=True)
    primary_lsr_id = Column(String(36), ForeignKey("life_saving_rules.id"), nullable=True)
    first_seen = Column(DateTime, default=get_utc_now)
    latest_seen = Column(DateTime, default=get_utc_now)
    trend_status = Column(String(50), default="STABLE")  # INCREASING, DECREASING, STABLE, SUDDEN_EMERGENCE
    affected_sites = Column(JSON, default=list)
    affected_activities = Column(JSON, default=list)
    example_report_ids = Column(JSON, default=list)

    barrier = relationship("Barrier")
    rule = relationship("LifeSavingRule")


class ReviewTask(Base):
    __tablename__ = "review_tasks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    report_id = Column(String(36), ForeignKey("reports.id"), nullable=False, index=True)
    reviewer_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    status = Column(String(50), default="PENDING")  # PENDING, IN_PROGRESS, COMPLETED
    decision = Column(String(50), nullable=True)  # CONFIRMED, MODIFIED, REJECTED, NEEDS_INFO, ESCALATED
    modified_psif = Column(Float, nullable=True)
    modified_barrier_id = Column(String(36), nullable=True)
    modified_lsr_id = Column(String(36), nullable=True)
    reason = Column(String(255), nullable=True)
    comments = Column(Text, nullable=True)
    is_training_feedback = Column(Boolean, default=False)
    created_at = Column(DateTime, default=get_utc_now)
    completed_at = Column(DateTime, nullable=True)

    report = relationship("Report", back_populates="review_tasks")
    reviewer = relationship("User", back_populates="reviews")


class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    document_type = Column(String(100), default="PROCEDURE")
    source_org = Column(String(255), default="OIL")
    source_authority = Column(String(255), default="Corporate HSE")
    version = Column(String(50), default="1.0")
    effective_date = Column(DateTime, default=get_utc_now)
    checksum = Column(String(64), nullable=True)
    confidentiality = Column(String(50), default="INTERNAL")
    ingestion_status = Column(String(50), default="INDEXED")
    chunk_count = Column(Integer, default=0)
    file_path = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=get_utc_now)

    chunks = relationship("KnowledgeChunk", back_populates="document", cascade="all, delete-orphan")


class KnowledgeChunk(Base):
    __tablename__ = "knowledge_chunks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("knowledge_documents.id"), nullable=False, index=True)
    chunk_index = Column(Integer, nullable=False)
    page_number = Column(Integer, default=1)
    section_heading = Column(String(255), nullable=True)
    text_content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=get_utc_now)

    document = relationship("KnowledgeDocument", back_populates="chunks")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    alert_type = Column(String(50), default="CRITICAL")  # CRITICAL, RECURRENCE, TREND, NOVELTY
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(50), default="HIGH")  # CRITICAL, HIGH, MEDIUM, LOW
    report_id = Column(String(36), nullable=True)
    site_id = Column(String(36), nullable=True)
    barrier_id = Column(String(36), nullable=True)
    is_acknowledged = Column(Boolean, default=False)
    acknowledged_by = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=get_utc_now)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    timestamp = Column(DateTime, default=get_utc_now, index=True)
    user_id = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(255), nullable=True)
    details = Column(JSON, default=dict)
    ip_address = Column(String(50), default="127.0.0.1")
