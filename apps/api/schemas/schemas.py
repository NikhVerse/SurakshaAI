from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# Auth Schemas
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    region: Optional[str] = None


class UserRegister(BaseModel):
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    age: Optional[int] = Field(None, ge=20, le=100, description="Age must be between 20 and 100")
    dob: Optional[str] = Field(None, description="Format: dd-mmm-yyyy")
    gender: Optional[str] = Field(None, description="MALE, FEMALE, OTHER")
    role: str = "HSE_ANALYST"
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None
    region: Optional[str] = None
    phone: Optional[str] = None
    account_status: Optional[str] = "ACTIVE"


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    age: Optional[int] = Field(None, ge=20, le=100)
    dob: Optional[str] = None
    gender: Optional[str] = None
    role: Optional[str] = None
    region: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    profile_image: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    age: Optional[int] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    region: Optional[str] = None
    phone: Optional[str] = None
    role: str
    account_status: str = "ACTIVE"
    profile_image: Optional[str] = None
    is_active: bool
    created_at: datetime
    last_login_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Dynamic Dashboard Stats
class DashboardStatsResponse(BaseModel):
    total_users: int = 0
    active_users: int = 0
    registered_responders: int = 0
    total_reports: int = 0
    open_cases: int = 0
    resolved_cases: int = 0
    critical_signals: int = 0
    active_barriers: int = 0
    unacknowledged_alerts: int = 0



# Entity Schemas
class EntitySpan(BaseModel):
    entity_type: str
    value: str
    text_span: str
    start_char: int
    end_char: int
    confidence: float = 1.0


# Life-Saving Rule Schemas
class LSRItem(BaseModel):
    id: str
    code: str
    name: str
    description: Optional[str] = None
    icon_name: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class LSRPredictionItem(BaseModel):
    lsr_id: str
    code: str
    name: str
    confidence: float
    supporting_evidence: Optional[str] = None
    rank: int = 1


# Barrier Schemas
class BarrierItem(BaseModel):
    id: str
    code: str
    name: str
    category: Optional[str] = None
    expected_function: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


# Report Schemas
class ReportCreate(BaseModel):
    report_uid: Optional[str] = None
    report_type: str = "NEAR_MISS"
    date_time: Optional[datetime] = None
    site_id: Optional[str] = None
    location: Optional[str] = None
    activity_id: Optional[str] = None
    equipment: Optional[str] = None
    contractor_internal: str = "INTERNAL"
    narrative: str
    actual_outcome: Optional[str] = None
    potential_consequence: Optional[str] = None
    source: str = "HSE Direct Entry"
    tags: List[str] = []
    data_origin: str = "SYNTHETIC"


class PSIFPredictionResponse(BaseModel):
    psif_probability: float
    priority_score: float
    confidence: float
    is_calibrated: bool
    primary_barrier: Optional[str] = None
    barrier_state: Optional[str] = None
    credible_consequence: Optional[str] = None
    explanation_summary: Optional[str] = None
    shap_values: Dict[str, float] = {}
    model_version: str


class SimilarReportItem(BaseModel):
    report_id: str
    report_uid: str
    narrative_snippet: str
    similarity_score: float
    hazard: Optional[str] = None
    primary_barrier: Optional[str] = None
    psif_probability: float
    date_time: datetime


class ReportDetailResponse(BaseModel):
    id: str
    report_uid: str
    report_type: str
    date_time: datetime
    site_name: Optional[str] = None
    location: Optional[str] = None
    activity_name: Optional[str] = None
    equipment: Optional[str] = None
    contractor_internal: str
    narrative: str
    actual_outcome: Optional[str] = None
    potential_consequence: Optional[str] = None
    data_origin: str
    review_status: str
    entities: List[EntitySpan] = []
    psif_prediction: Optional[PSIFPredictionResponse] = None
    lsr_predictions: List[LSRPredictionItem] = []
    similar_reports: List[SimilarReportItem] = []
    created_at: datetime


class ReportListItem(BaseModel):
    id: str
    report_uid: str
    report_type: str
    date_time: datetime
    site_name: Optional[str] = None
    activity_name: Optional[str] = None
    narrative_snippet: str
    psif_probability: Optional[float] = None
    priority_score: Optional[float] = None
    primary_barrier: Optional[str] = None
    barrier_state: Optional[str] = None
    primary_lsr: Optional[str] = None
    review_status: str
    data_origin: str


# Review & Triage
class ReviewDecisionCreate(BaseModel):
    decision: str  # CONFIRMED, MODIFIED, REJECTED, NEEDS_INFO, ESCALATED
    modified_psif: Optional[float] = None
    modified_barrier_id: Optional[str] = None
    modified_lsr_id: Optional[str] = None
    reason: Optional[str] = None
    comments: Optional[str] = None
    is_training_feedback: bool = True


# Precursor Cluster
class PrecursorClusterResponse(BaseModel):
    id: str
    name: str
    summary: Optional[str] = None
    coherence_score: float
    occurrence_count: int
    primary_hazard: Optional[str] = None
    primary_barrier: Optional[str] = None
    primary_lsr: Optional[str] = None
    trend_status: str
    first_seen: datetime
    latest_seen: datetime
    affected_sites: List[str] = []
    affected_activities: List[str] = []
    example_report_ids: List[str] = []


# Knowledge & RAG
class KnowledgeDocumentResponse(BaseModel):
    id: str
    title: str
    document_type: str
    source_org: str
    source_authority: str
    version: str
    chunk_count: int
    ingestion_status: str
    created_at: datetime


class RAGQueryRequest(BaseModel):
    query: str
    limit: int = 4


class RAGSnippet(BaseModel):
    document_title: str
    source_authority: str
    page_number: int
    section_heading: Optional[str] = None
    text_content: str
    relevance_score: float


class RAGQueryResponse(BaseModel):
    query: str
    answer: str
    sources: List[RAGSnippet]
    grounding_confidence: float


# System Diagnostics
class SystemHealthResponse(BaseModel):
    status: str
    app_version: str
    environment: str
    database: str
    ollama_status: str
    ollama_model: str
    vector_engine: str
    uptime_seconds: float


# Help Desk AI Guidance & Model Switching
class HelpDeskModelItem(BaseModel):
    id: str
    name: str
    provider: str
    description: str
    badge: str
    is_active: bool = True
    context_window: str = "128k"


class HelpDeskMessage(BaseModel):
    role: str  # 'user', 'assistant', 'system'
    content: str


class HelpDeskChatRequest(BaseModel):
    message: str
    model: str = "gpt-4o"
    history: List[HelpDeskMessage] = []


class HelpDeskChatResponse(BaseModel):
    reply: str
    model_used: str
    provider: str
    suggested_actions: List[str] = []
    navigation_links: List[Dict[str, str]] = []

