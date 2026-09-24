const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("suraksha_token") : null;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let detail = `API error ${response.status}`;
    try {
      const body = await response.json();
      detail = body?.detail || body?.message || detail;
    } catch { }
    throw new Error(detail);
  }

  return (await response.json()) as T;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

// Domain-specific API helpers
export const dashboardApi = {
  getSummary: () => fetchApi<DashboardSummary>("/api/v1/dashboard/summary"),
  getStats: () => fetchApi<DashboardStats>("/api/v1/dashboard/stats"),
};

export const reportsApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetchApi<ReportListItem[]>(`/api/v1/reports${qs}`);
  },
  getById: (id: string) => fetchApi<ReportDetail>(`/api/v1/reports/${id}`),
  create: (payload: unknown) => fetchApi<ReportDetail>("/api/v1/reports", { method: "POST", body: JSON.stringify(payload) }),
  updateStatus: (id: string, status: string) =>
    fetchApi<ReportDetail>(`/api/v1/reports/${id}/status?status=${encodeURIComponent(status)}`, { method: "PATCH" }),
};

export const casesApi = reportsApi;

export const triageApi = {
  list: (status?: string) => {
    const qs = status ? `?status_filter=${status}` : "";
    return fetchApi<TriageTask[]>(`/api/v1/triage${qs}`);
  },
  submitDecision: (taskId: string, decision: unknown) =>
    fetchApi(`/api/v1/triage/${taskId}/decision`, { method: "POST", body: JSON.stringify(decision) }),
};

export const taxonomyApi = {
  getSites: () => fetchApi<Site[]>("/api/v1/sites"),
  getActivities: () => fetchApi<Activity[]>("/api/v1/activities"),
  getBarriers: () => fetchApi<Barrier[]>("/api/v1/barriers"),
  getLSRs: () => fetchApi<LSR[]>("/api/v1/life-saving-rules"),
};

export const precursorsApi = {
  list: () => fetchApi<PrecursorCluster[]>("/api/v1/precursors"),
  getById: (id: string) => fetchApi<PrecursorCluster>(`/api/v1/precursors/${id}`),
};

export const systemApi = {
  getHealth: () => fetchApi("/api/v1/system/health"),
  getLLMHealth: () => fetchApi("/api/v1/system/llm/health"),
  getModelHealth: () => fetchApi<ModelHealth>("/api/v1/model-health"),
  getGovernance: () => fetchApi("/api/v1/governance"),
  getAuditLog: (limit?: number) => fetchApi<AuditEntry[]>(`/api/v1/audit-log?limit=${limit || 50}`),
  getAlerts: (acknowledged?: boolean) => fetchApi<AlertItem[]>(`/api/v1/alerts?acknowledged=${acknowledged ?? false}`),
  acknowledgeAlert: (id: string) => fetchApi(`/api/v1/alerts/${id}/acknowledge`, { method: "POST" }),
};

export const usersApi = {
  getMe: () => fetchApi<UserItem>("/api/v1/users/me"),
  updateMe: (payload: { full_name?: string; phone?: string; profile_image?: string }) =>
    fetchApi<UserItem>("/api/v1/users/me", { method: "PATCH", body: JSON.stringify(payload) }),
  listUsers: (params?: { role?: string; status?: string; limit?: number }) => {
    const qs = params ? "?" + new URLSearchParams(params as any).toString() : "";
    return fetchApi<UserItem[]>(`/api/v1/users${qs}`);
  },
  updateUserRole: (userId: string, role?: string, accountStatus?: string) => {
    const params = new URLSearchParams();
    if (role) params.set("role", role);
    if (accountStatus) params.set("account_status", accountStatus);
    return fetchApi<UserItem>(`/api/v1/users/${userId}/role?${params.toString()}`, { method: "PATCH" });
  },
};

// Type definitions
export interface DashboardStats {
  total_users: number;
  active_users: number;
  registered_responders: number;
  total_reports: number;
  open_cases: number;
  resolved_cases: number;
  critical_signals: number;
  active_barriers: number;
  unacknowledged_alerts: number;
}

export interface DashboardSummary {
  total_reports: number;
  psif_priority_count: number;
  pending_reviews: number;
  active_barriers: number;
  unacknowledged_alerts: number;
  barrier_states: Record<string, number>;
  monthly_trend: MonthlyTrendItem[];
  barrier_health: BarrierHealthItem[];
  top_alerts: AlertItem[];
  recent_activity: AuditEntry[];
  ollama_status: string;
  ollama_mode: string;
  available_models: string[];
}

export interface MonthlyTrendItem {
  month: string;
  total_reports: number;
  psif_priority: number;
  psif_density: number;
}

export interface BarrierHealthItem {
  name: string;
  code: string;
  verified: number;
  unverified: number;
  failed: number;
}

export interface AlertItem {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  message: string;
  report_id?: string;
  is_acknowledged: boolean;
  created_at?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
  user_role?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
}

export type ReportItem = ReportListItem;

export interface ReportListItem {
  id: string;
  report_uid: string;
  report_type: string;
  date_time: string;
  site_name: string;
  activity_name: string;
  narrative_snippet: string;
  psif_probability?: number;
  priority_score?: number;
  primary_barrier?: string;
  barrier_state?: string;
  primary_lsr?: string;
  review_status: string;
  data_origin?: string;
}

export interface ReportEntity {
  entity_type: string;
  value: string;
  text_span?: string;
  confidence?: number;
}

export interface SimilarReport {
  report_id: string;
  report_uid: string;
  similarity_score: number;
  narrative_snippet: string;
}

export interface ReportDetail extends ReportListItem {
  narrative: string;
  actual_outcome?: string;
  potential_consequence?: string;
  equipment?: string;
  location?: string;
  contractor_internal?: string;
  entities?: ReportEntity[];
  psif_prediction?: PSIFPrediction;
  lsr_predictions?: LSRPrediction[];
  similar_reports?: SimilarReport[];
  created_at?: string;
}

export interface PSIFPrediction {
  psif_probability: number;
  priority_score: number;
  confidence: number;
  is_calibrated: boolean;
  primary_barrier: string;
  barrier_state: string;
  credible_consequence?: string;
  explanation_summary?: string;
  shap_values?: Record<string, number>;
  model_version?: string;
}

export interface LSRPrediction {
  lsr_id: string;
  code: string;
  name: string;
  confidence: number;
  supporting_evidence?: string;
  rank: number;
}

export interface TriageTask {
  task_id: string;
  report_id: string;
  report_uid: string;
  date_time: string;
  site_name: string;
  activity_name: string;
  narrative_snippet: string;
  psif_probability: number;
  priority_score: number;
  confidence: number;
  primary_barrier: string;
  barrier_state: string;
  primary_lsr: string;
  status: string;
  decision?: string;
  reason?: string;
}

export interface Site {
  id: string;
  code: string;
  name: string;
  location: string;
  operational_unit: string;
  risk_level: string;
}

export interface Activity {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
}

export interface Barrier {
  id: string;
  code: string;
  name: string;
  category: string;
  expected_function: string;
}

export interface LSR {
  id: string;
  code: string;
  name: string;
  icon_name: string;
  description: string;
  guidance: string;
}

export interface PrecursorCluster {
  id: string;
  name: string;
  summary: string;
  coherence_score: number;
  occurrence_count: number;
  primary_hazard: string;
  primary_barrier?: string;
  primary_lsr?: string;
  trend_status: string;
  first_seen: string;
  latest_seen: string;
  affected_sites: string[];
  affected_activities: string[];
  example_report_ids: string[];
}

export interface ModelHealth {
  nlp: { model: string; version: string; average_latency_ms: number; status: string; extraction_confidence_avg: number };
  psif: { model: string; version: string; calibration_method: string; is_calibrated: boolean; calibration_percentage: number; pr_auc: number; f2_score: number; total_evaluated_records: number; status: string };
  lsr: { model: string; supported_rules: number; macro_f1: number; micro_f1: number; status: string };
  clustering: { method: string; cluster_count: number; coherence_score_avg: number; status: string };
  llm: Record<string, string | number | boolean> | null;
  data_drift: Record<string, string>;
}

export interface UserItem {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  age?: number;
  dob?: string;
  gender?: string;
  region?: string;
  phone?: string;
  role: string;
  account_status: string;
  profile_image?: string;
  is_active: boolean;
  created_at: string;
  last_login_at?: string;
}

export interface HelpDeskModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  badge: string;
  is_active: boolean;
  context_window: string;
}

export interface HelpDeskMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface HelpDeskChatResponse {
  reply: string;
  model_used: string;
  provider: string;
  suggested_actions: string[];
  navigation_links: Array<{ title: string; href: string }>;
}

export const helpdeskApi = {
  getModels: () => fetchApi<HelpDeskModel[]>("/api/v1/helpdesk/models"),
  sendMessage: (message: string, model: string, history: HelpDeskMessage[] = []) =>
    fetchApi<HelpDeskChatResponse>("/api/v1/helpdesk/chat", {
      method: "POST",
      body: JSON.stringify({ message, model, history }),
    }),
};
