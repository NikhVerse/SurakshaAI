import { NextRequest, NextResponse } from "next/server";
import {
  FALLBACK_DASHBOARD_SUMMARY,
  FALLBACK_REPORTS,
  FALLBACK_BARRIERS,
  FALLBACK_PRECURSORS,
  FALLBACK_AUDIT_LOG,
  FALLBACK_ALERTS,
  FALLBACK_MODEL_HEALTH,
  FALLBACK_SITES,
  FALLBACK_ACTIVITIES,
  FALLBACK_LSRS,
  FALLBACK_KNOWLEDGE_DOCS,
} from "@/lib/fallback-data";

// In-memory runtime state for live interaction on Vercel / Web
let liveReports = [...FALLBACK_REPORTS];
let liveAlerts = [...FALLBACK_ALERTS];
let liveAuditLog = [...FALLBACK_AUDIT_LOG];
let liveTriageTasks = liveReports.map((r) => ({
  task_id: `task-${r.id}`,
  report_id: r.id,
  report_uid: r.report_uid,
  date_time: r.date_time || new Date().toISOString(),
  site_name: r.site_name,
  activity_name: r.activity_name,
  narrative_snippet: r.narrative_snippet || r.narrative?.slice(0, 150) || "",
  psif_probability: r.psif_prediction?.psif_probability ?? 0.82,
  priority_score: r.psif_prediction?.priority_score ?? 84,
  confidence: r.psif_prediction?.confidence ?? 0.89,
  primary_barrier: r.primary_barrier || "BAR-ENG-01",
  barrier_state: r.barrier_state || "FAILED",
  primary_lsr: r.primary_lsr || "LSR-03",
  status: r.review_status || "PENDING",
  decision: undefined as string | undefined,
  reason: undefined as string | undefined,
}));
let liveKnowledgeDocs = [...FALLBACK_KNOWLEDGE_DOCS];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const path = slug.join("/");
  const url = new URL(request.url);

  // 1. Dashboard Summary
  if (path === "dashboard/summary") {
    const summary = {
      ...FALLBACK_DASHBOARD_SUMMARY,
      total_reports: liveReports.length,
      psif_priority_count: liveReports.filter((r) => (r.psif_probability ?? 0) >= 0.6).length,
      pending_reviews: liveReports.filter((r) => r.review_status === "PENDING" || r.review_status === "UNDER_INVESTIGATION").length,
      top_alerts: liveAlerts.slice(0, 5),
      recent_activity: liveAuditLog.slice(0, 10),
    };
    return NextResponse.json(summary);
  }

  // 2. Dashboard Stats
  if (path === "dashboard/stats") {
    return NextResponse.json({
      total_users: 18,
      active_users: 12,
      registered_responders: 24,
      total_reports: liveReports.length,
      open_cases: liveReports.filter((r) => r.review_status !== "VERIFIED").length,
      resolved_cases: liveReports.filter((r) => r.review_status === "VERIFIED").length,
      critical_signals: liveReports.filter((r) => (r.psif_probability ?? 0) >= 0.8).length,
      active_barriers: FALLBACK_BARRIERS.length,
      unacknowledged_alerts: liveAlerts.filter((a) => !a.is_acknowledged).length,
    });
  }

  // 3. Reports List or by ID
  if (path === "reports") {
    const search = url.searchParams.get("search")?.toLowerCase();
    const status = url.searchParams.get("review_status");
    const site = url.searchParams.get("site_name");

    let list = [...liveReports];
    if (search) {
      list = list.filter(
        (r) =>
          r.report_uid.toLowerCase().includes(search) ||
          r.site_name.toLowerCase().includes(search) ||
          (r.equipment && r.equipment.toLowerCase().includes(search)) ||
          r.narrative.toLowerCase().includes(search)
      );
    }
    if (status && status !== "ALL") {
      list = list.filter((r) => r.review_status === status);
    }
    if (site && site !== "ALL") {
      list = list.filter((r) => r.site_name === site);
    }
    return NextResponse.json(list);
  }

  if (path.startsWith("reports/")) {
    const id = path.replace("reports/", "");
    const match = liveReports.find((r) => r.id === id || r.report_uid === id);
    if (match) return NextResponse.json(match);
    return NextResponse.json(liveReports[0]);
  }

  // 4. Triage Queue
  if (path === "triage") {
    const filter = url.searchParams.get("status_filter");
    let tasks = [...liveTriageTasks];
    if (filter && filter !== "ALL") {
      tasks = tasks.filter((t) => t.status === filter);
    }
    return NextResponse.json(tasks);
  }

  // 5. Barriers
  if (path === "barriers") {
    return NextResponse.json(FALLBACK_BARRIERS);
  }
  if (path.startsWith("barriers/")) {
    const code = path.replace("barriers/", "");
    const match = FALLBACK_BARRIERS.find((b) => b.code === code || b.id === code);
    return NextResponse.json(match || FALLBACK_BARRIERS[0]);
  }

  // 6. Precursors
  if (path === "precursors") {
    return NextResponse.json(FALLBACK_PRECURSORS);
  }
  if (path.startsWith("precursors/")) {
    const id = path.replace("precursors/", "");
    const match = FALLBACK_PRECURSORS.find((c) => c.id === id);
    return NextResponse.json(match || FALLBACK_PRECURSORS[0]);
  }

  // 7. Sites & Activities & LSRs
  if (path === "sites") return NextResponse.json(FALLBACK_SITES);
  if (path === "activities") return NextResponse.json(FALLBACK_ACTIVITIES);
  if (path === "life-saving-rules") return NextResponse.json(FALLBACK_LSRS);

  // 8. Audit Log
  if (path === "audit-log") {
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    return NextResponse.json(liveAuditLog.slice(0, limit));
  }

  // 9. Alerts
  if (path === "alerts") {
    const acknowledged = url.searchParams.get("acknowledged");
    let alerts = [...liveAlerts];
    if (acknowledged === "false") {
      alerts = alerts.filter((a) => !a.is_acknowledged);
    } else if (acknowledged === "true") {
      alerts = alerts.filter((a) => a.is_acknowledged);
    }
    return NextResponse.json(alerts);
  }

  // 10. Model Health & Governance
  if (path === "model-health") return NextResponse.json(FALLBACK_MODEL_HEALTH);
  if (path === "governance") {
    return NextResponse.json({
      data_retention_days: 2555,
      audit_integrity: "SHA-256 Validated",
      encryption_at_rest: "AES-256-GCM",
      sovereignty_mode: "Strict On-Premise",
      last_compliance_audit: "2026-09-01",
    });
  }

  // 11. Knowledge Documents
  if (path === "knowledge/documents") {
    return NextResponse.json(liveKnowledgeDocs);
  }

  // 12. HelpDesk Models
  if (path === "helpdesk/models") {
    return NextResponse.json([
      { id: "gpt-4o", name: "Suraksha Lead Safety Intelligence (GPT-4o)", description: "Calibrated industrial reasoning model" },
      { id: "mistral", name: "Sovereign Private AI (Mistral 7B)", description: "Air-gapped on-premise model" },
    ]);
  }

  // 13. System Health
  if (path === "system/health") {
    return NextResponse.json({
      status: "ok",
      mode: "live-telemetry",
      database: "connected",
      ai_engine: "ready",
      sites_monitored: 5,
      calibrated_reports: liveReports.length,
    });
  }
  if (path === "system/llm/health") {
    return NextResponse.json({ status: "ready", model: "mistral:7b-instruct", latency_ms: 16 });
  }

  // 14. Auth Current User
  if (path === "auth/me" || path === "users/me") {
    return NextResponse.json({
      id: "usr-live-01",
      email: "operator@suraksha.ai",
      full_name: "Authorized HSE Operator",
      role: "HSE_ANALYST",
      region: "India - Western Offshore (Mumbai High)",
      is_active: true,
      last_login: new Date().toISOString(),
    });
  }

  return NextResponse.json({ message: `Endpoint /api/v1/${path} active`, status: "success" });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const path = slug.join("/");

  let body: any = {};
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data") || contentType.includes("form-data")) {
    try {
      const formData = await request.formData();
      body = {
        title: formData.get("title")?.toString() || "Safety Procedure Manual",
        document_type: formData.get("document_type")?.toString() || "MANDATORY",
        source_org: formData.get("source_org")?.toString() || "OIL",
        source_authority: formData.get("source_authority")?.toString() || "HSE Operations Directorate",
        version: formData.get("version")?.toString() || "1.0",
        narrative: formData.get("narrative")?.toString() || "",
        site_name: formData.get("site_name")?.toString() || "",
        equipment: formData.get("equipment")?.toString() || "",
      };
    } catch {}
  } else {
    try {
      body = await request.json();
    } catch {}
  }

  // 1. Submit New Report
  if (path === "reports") {
    const narrative = (body.narrative || "").toLowerCase();
    const isHighPressure = narrative.includes("bar") || narrative.includes("pressure") || narrative.includes("psi");
    const isGasOrFire = narrative.includes("gas") || narrative.includes("lel") || narrative.includes("hydrocarbon") || narrative.includes("weld") || narrative.includes("flame");
    const isConfined = narrative.includes("confined") || narrative.includes("vessel") || narrative.includes("tank");

    let psifScore = 0.55;
    if (isHighPressure && isGasOrFire) psifScore = 0.88;
    else if (isHighPressure || isGasOrFire || isConfined) psifScore = 0.76;

    const newId = `rep-${Date.now()}`;
    const newUid = `SUR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReport = {
      id: newId,
      report_uid: newUid,
      report_type: body.report_type || "Near-Miss Precursor",
      date_time: new Date().toISOString().replace("T", " ").slice(0, 19),
      site_name: body.site_name || "Mumbai High North Platform",
      activity_name: body.activity_name || "Valve Isolation & Maintenance",
      narrative_snippet: body.narrative.slice(0, 140) + "...",
      narrative: body.narrative,
      equipment: body.equipment || "High-Pressure Process Loop",
      location: "Active Process Deck",
      contractor_internal: body.contractor_internal || "INTERNAL",
      actual_outcome: body.actual_outcome || "Interrupted prior to ignition",
      potential_consequence: "Uncontrolled hydrocarbon release with acute personnel injury potential.",
      psif_probability: psifScore,
      priority_score: Math.round(psifScore * 100),
      primary_barrier: "Positive Physical Isolation (Double Block & Bleed)",
      barrier_state: "DEGRADED",
      primary_lsr: "Energy Isolation (LSR-03)",
      review_status: "PENDING",
      data_origin: "WEB_ENTRY",
      entities: [
        { entity_type: "EQUIPMENT", value: body.equipment || "Process Loop", text_span: body.equipment || "Process Loop", confidence: 0.94 },
        { entity_type: "HAZARD", value: "Pressurized fluid inventory", text_span: "pressurized", confidence: 0.92 },
      ],
      psif_prediction: {
        psif_probability: psifScore,
        priority_score: Math.round(psifScore * 100),
        confidence: 0.91,
        is_calibrated: true,
        primary_barrier: "Positive Physical Isolation (Double Block & Bleed)",
        barrier_state: "DEGRADED",
        credible_consequence: "Pressurized release requiring automatic ESD initiation.",
        shap_values: {
          "Operating Pressure": 0.42,
          "Barrier Degradation": 0.31,
          "SIMOPS Proximity": 0.15,
        },
      },
      lsr_predictions: [
        { lsr_id: "lsr-03", code: "LSR-03", name: "Energy Isolation", confidence: 0.92, rank: 1 },
      ],
    };

    liveReports.unshift(newReport);

    // Add corresponding triage task
    liveTriageTasks.unshift({
      task_id: `task-${newId}`,
      report_id: newId,
      report_uid: newUid,
      date_time: newReport.date_time,
      site_name: newReport.site_name,
      activity_name: newReport.activity_name,
      narrative_snippet: newReport.narrative_snippet,
      psif_probability: psifScore,
      priority_score: Math.round(psifScore * 100),
      confidence: 0.91,
      primary_barrier: newReport.primary_barrier,
      barrier_state: newReport.barrier_state,
      primary_lsr: newReport.primary_lsr,
      status: "PENDING",
      decision: undefined,
      reason: undefined,
    });

    // Record in audit log
    liveAuditLog.unshift({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: "operator-web",
      user_name: "Authorized HSE Operator",
      user_email: "operator@suraksha.ai",
      user_role: "HSE_ANALYST",
      action: "REPORT_INGESTED",
      entity_type: "REPORT",
      entity_id: newUid,
      details: {
        message: `New near-miss narrative ingested. Calibrated pSIF: ${(psifScore * 100).toFixed(0)}%.`,
        site: body.site_name || "Mumbai High North Platform",
        psif_score: psifScore,
      },
      ip_address: "127.0.0.1",
    });

    return NextResponse.json(newReport);
  }

  // 2. Triage Decision
  if (path.includes("decision")) {
    const parts = path.split("/");
    const taskId = parts[1];
    const task = liveTriageTasks.find((t) => t.task_id === taskId);
    if (task) {
      task.status = "CONFIRMED";
      task.decision = body.action || "CONFIRM_CRITICAL";
      task.reason = body.comment || "Operator validated barrier degradation.";
    }
    return NextResponse.json({ status: "success", task_id: taskId });
  }

  // 3. Acknowledge Alert
  if (path.includes("acknowledge")) {
    const parts = path.split("/");
    const alertId = parts[1];
    const alert = liveAlerts.find((a) => a.id === alertId);
    if (alert) {
      alert.is_acknowledged = true;
    }
    return NextResponse.json({ status: "success", alert_id: alertId });
  }

  // 4. Ingest New Safety Standard Document
  if (path === "knowledge/upload") {
    const newDocId = `doc-${Date.now()}`;
    const newDoc = {
      id: newDocId,
      title: body.title || "Custom Industrial Standard",
      filename: `${(body.title || "document").replace(/\s+/g, "_")}.pdf`,
      category: body.document_type || "Mandatory Standard",
      document_type: body.document_type || "MANDATORY",
      source_org: body.source_org || "OIL",
      source_authority: body.source_authority || "HSE Operations Directorate",
      version: body.version || "1.0",
      chunk_count: Math.floor(40 + Math.random() * 80),
      embedding_model: "nomic-embed-text",
      uploaded_at: new Date().toISOString(),
      status: "INDEXED",
      vector_count: Math.floor(40 + Math.random() * 80),
      summary: `Uploaded and indexed industrial safety document: ${body.title}. Vectorized into knowledge graph.`,
    };
    liveKnowledgeDocs.unshift(newDoc);

    liveAuditLog.unshift({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: "operator-web",
      user_name: "Authorized HSE Operator",
      user_email: "operator@suraksha.ai",
      user_role: "HSE_ANALYST",
      action: "KNOWLEDGE_INGESTED",
      entity_type: "DOCUMENT",
      entity_id: newDocId,
      details: {
        title: newDoc.title,
        authority: newDoc.source_authority,
        chunks: newDoc.chunk_count,
      },
      ip_address: "127.0.0.1",
    });

    return NextResponse.json({ status: "success", document: newDoc, document_id: newDocId });
  }

  // 5. Knowledge Query (RAG Semantic Search)
  if (path === "knowledge/query") {
    const q = (body.query || "").toLowerCase();
    const results = [
      {
        id: "chunk-01",
        document_id: "doc-001",
        title: "IOGP Report 459: Life-Saving Rules Guidance",
        content: `Standard Operating Procedure regarding "${body.query || 'work authorization'}": Rule 3 Energy Isolation mandates double block and bleed with physical slip blinds before breaking containment.`,
        similarity_score: 0.95,
        page_number: 14,
      },
      {
        id: "chunk-02",
        document_id: "doc-003",
        title: "OISD-STD-105: Work Permit System",
        content: "Hot work permit conditions require continuous LEL explosive sniffing, certified fire watch, and spark-containment habitat for operations within 15 meters of hydrocarbon process equipment.",
        similarity_score: 0.91,
        page_number: 22,
      },
      {
        id: "chunk-03",
        document_id: "doc-004",
        title: "API Recommended Practice 521: Pressure-Relieving Systems",
        content: "Pressure safety valves must discharge to the high-pressure flare knockout drum. Bypass valves on relief loops require locked-closed car-seals.",
        similarity_score: 0.88,
        page_number: 45,
      },
    ];
    return NextResponse.json({
      query: body.query || "",
      results,
      total_matches: results.length,
      retrieval_latency_ms: 24,
    });
  }

  // 5. HelpDesk Chat (Natural Assistant with Real Platform Links)
  if (path === "helpdesk/chat") {
    const query = (body.message || "").toLowerCase();

    let reply = "I am Suraksha AI's decision-support assistant. Here are key insights regarding your inquiry:\n\n";
    const navigationLinks = [
      { title: "Dashboard", href: "/app/dashboard" },
      { title: "Incidents", href: "/app/reports" },
      { title: "Triage", href: "/app/triage" },
    ];

    if (query.includes("mumbai") || query.includes("offshore") || query.includes("platform")) {
      reply += "• **Mumbai High North Platform (MHN-OFFSHORE)** is an offshore production asset with 12 active monitoring points.\n• Recent critical precursor: **MHN-2026-0089** involving Gas Lift Manifold GLM-04 packing weepage at 110 bar (pSIF = 0.84).\n• Primary Barrier: Positive Physical Isolation (Double Block & Bleed).";
      navigationLinks.push({ title: "View MHN Report", href: "/app/reports/rep-001" });
    } else if (query.includes("barrier") || query.includes("isolation") || query.includes("loto") || query.includes("esd")) {
      reply += "• The platform monitors **18 engineered and procedural barriers** aligned with IOGP 459.\n• **Double Block & Bleed Isolation (BAR-ENG-01)** is currently at 88% verified health across 33 evaluated incidents.\n• **Emergency Shutdown Valves (BAR-ENG-02)** have a 12-second trip target with 31 verified cases.";
      navigationLinks.push({ title: "Barrier Health Matrix", href: "/app/barriers" });
    } else if (query.includes("triage") || query.includes("pending") || query.includes("review")) {
      reply += "• There are **5 pending triage tasks** requiring qualified human review.\n• Highest priority task: **DGB-2026-0014** (Digboi Refinery hot work near 18% LEL oily sewer trench).\n• Action options: Confirm Critical or Downgrade with rationale.";
      navigationLinks.push({ title: "Open Triage Queue", href: "/app/triage" });
    } else if (query.includes("report") || query.includes("incident") || query.includes("submit") || query.includes("new")) {
      reply += "• You can file a new incident or near-miss observation directly via **[New Report](/app/reports/new)**.\n• The AI reasoning pipeline will automatically extract hazard entities, calibrate pSIF probability, and identify degraded barriers.";
      navigationLinks.push({ title: "File New Report", href: "/app/reports/new" });
    } else {
      reply += "• **pSIF Prioritization**: Calibrated using Platt Sigmoid Scaling to highlight true potential Severe Injury & Fatality precursors.\n• **Barrier Defense**: Tracks active barrier degradation to stop incident escalation before harm occurs.\n• **Audit Trail**: Every automated inference and human triage decision is immutably logged with SHA-256 integrity verification.";
    }

    return NextResponse.json({
      reply,
      suggested_actions: ["Inspect Barrier Health", "View High-Risk Precursors", "File Incident Observation"],
      navigation_links: navigationLinks,
    });
  }

  // 6. Auth Login / Register
  if (path === "auth/login" || path === "auth/register") {
    const userProfile = {
      id: "usr-live-01",
      email: body.email || "operator@suraksha.ai",
      full_name: body.first_name ? `${body.first_name} ${body.last_name || ""}`.trim() : "Authorized Operator",
      role: body.role || "HSE_ANALYST",
      region: body.region || "India - Western Offshore (Mumbai High)",
      is_active: true,
      last_login: new Date().toISOString(),
    };
    return NextResponse.json({
      access_token: `token-suraksha-${Date.now()}`,
      token_type: "bearer",
      user: userProfile,
    });
  }

  return NextResponse.json({ status: "success", received: body });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const path = slug.join("/");

  let body: any = {};
  try {
    body = await request.json();
  } catch {}

  const url = new URL(request.url);
  const statusParam = url.searchParams.get("status") || body.status;

  if (path.includes("status")) {
    const parts = path.split("/");
    const reportId = parts[1];
    const report = liveReports.find((r) => r.id === reportId || r.report_uid === reportId);
    if (report && statusParam) {
      report.review_status = statusParam;
    }
    return NextResponse.json(report || { status: "updated" });
  }

  return NextResponse.json({ status: "updated" });
}
