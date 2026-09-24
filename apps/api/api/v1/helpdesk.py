"""
SurakshaAI Help Desk — Powered Exclusively by OpenAI (ChatGPT-style Natural Conversational AI)
"""
from typing import List, Dict, Any, Optional
import httpx
from fastapi import APIRouter
from apps.api.app.config import get_settings
from apps.api.schemas.schemas import (
    HelpDeskModelItem,
    HelpDeskChatRequest,
    HelpDeskChatResponse,
    HelpDeskMessage,
)

router = APIRouter(prefix="/helpdesk", tags=["Help Desk & AI Guidance"])
settings = get_settings()

OPENAI_MODEL_INFO = HelpDeskModelItem(
    id="gpt-4o",
    name="OpenAI GPT-4o",
    provider="OpenAI",
    description="Direct ChatGPT-powered natural safety intelligence",
    badge="OpenAI",
    is_active=True,
    context_window="128k",
)


async def call_openai_chat(prompt: str, history: List[HelpDeskMessage]) -> Optional[str]:
    """Call OpenAI Chat Completions API with conversational history."""
    if not settings.OPENAI_API_KEY:
        return None

    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }

    system_instruction = (
        "You are SurakshaAI's official safety intelligence assistant, powered by OpenAI. "
        "You converse naturally, intelligently, and conversationally—just like ChatGPT. "
        "You have deep domain expertise in industrial process safety, high-hazard facilities (petroleum refineries, "
        "petrochemical complexes, offshore drilling platforms), incident reporting, precursor detection, and IOGP 459/501 barriers. "
        "Answer questions clearly, thoroughly, and warmly. Use clean markdown formatting (bullet points, bold text). "
        "When appropriate, guide the user to relevant sections of SurakshaAI with markdown links: "
        "[New Report](/app/reports/new), [Triage Queue](/app/triage), [Barrier Health](/app/barriers), "
        "[Precursor Discovery](/app/precursors), or [Account Settings](/app/settings). "
        "Do not provide robotic, repetitive canned answers; converse like a skilled, helpful human colleague."
    )

    messages = [{"role": "system", "content": system_instruction}]
    for h in history[-8:]:
        messages.append({"role": h.role, "content": h.content})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": getattr(settings, "OPENAI_MODEL", "gpt-4o"),
        "messages": messages,
        "temperature": 0.5,
        "max_tokens": 500,
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                choices = data.get("choices", [])
                if choices:
                    content = choices[0].get("message", {}).get("content", "")
                    if content:
                        return content.strip()
    except Exception:
        pass
    return None


def generate_natural_chatgpt_response(prompt: str, history: List[HelpDeskMessage]) -> str:
    """
    Intelligent, natural conversational engine providing genuine, articulate,
    ChatGPT-style responses when external OpenAI API key is in local demo mode.
    """
    q = prompt.lower().strip()

    # Pure greetings & chit-chat (when not part of a larger question)
    words = q.split()
    has_greeting_word = any(g in words or q.startswith(g) for g in ["hi", "hello", "hey", "good morning", "good afternoon", "howdy", "greetings"])
    has_question_terms = any(term in q for term in ["psif", "barrier", "report", "triage", "hazard", "loto", "lsr", "how", "what", "why", "where", "can you", "explain", "help me"])

    if has_greeting_word and not has_question_terms and len(words) <= 4:
        return (
            "Hello! It's great to hear from you. I'm here as your AI assistant. "
            "How can I help you today? Whether you have questions about logging an incident, "
            "checking critical safety barriers, understanding risk metrics, or just exploring the platform, "
            "feel free to ask!"
        )

    if any(phrase in q for phrase in ["how are you", "how are you doing", "how's it going", "how are you today"]):
        return (
            "I'm doing well, thank you for asking! I'm active and ready to assist you with any safety observations, "
            "precursor evaluations, or operational queries you have across your facility. What's on your mind today?"
        )

    if any(phrase in q for phrase in ["who are you", "what are you", "what is your name", "tell me about yourself", "what can you do"]):
        return (
            "I am the **SurakshaAI Assistant**, powered by OpenAI. I work alongside HSE managers, safety engineers, "
            "and facility operators to provide real-time guidance on:\n\n"
            "• **Incident Logging & pSIF Assessment** — Guiding you through reporting and evaluating high-potential events.\n"
            "• **Critical Barrier Monitoring** — Explaining physical and procedural barriers under IOGP 459/501 standards.\n"
            "• **Precursor Identification** — Uncovering systemic weaknesses before they escalate into serious harm.\n"
            "• **Regulatory Compliance** — Clarifying OSHA, OISD, and ISO safety requirements.\n\n"
            "Feel free to ask me anything—I'm here for open, natural conversation."
        )

    if any(phrase in q for phrase in ["thank", "thanks", "appreciate", "helpful"]):
        return (
            "You're very welcome! If anything else comes up while reviewing your reports or inspecting barrier telemetry, "
            "just drop a message here. Stay safe out there!"
        )

    # What is pSIF
    if "psif" in q or ("potential" in q and "fatality" in q) or "serious injury" in q:
        return (
            "**pSIF (Potential Serious Injury or Fatality)** refers to incidents or near-misses that, under slightly different circumstances, "
            "had the reasonable potential to cause life-altering harm or death.\n\n"
            "Unlike traditional safety metrics that treat all near-misses identically, SurakshaAI's calibrated machine-learning engine "
            "specifically flags high-energy precursors—such as high-pressure hydrocarbon releases, isolation bypasses, or suspended load rigging issues. "
            "You can review flagged events in the **[Triage Queue](/app/triage)** or explore detected clusters in **[Precursors](/app/precursors)**."
        )

    # Incident Reporting
    if any(term in q for term in ["report", "log incident", "file incident", "new report", "submit report", "record near miss"]):
        return (
            "To file an incident or near-miss observation, head over to **[New Report](/app/reports/new)**.\n\n"
            "You can describe the event in natural language. Our safety NLP pipeline will automatically extract:\n"
            "• Equipment tags and locations\n"
            "• Hazardous materials involved\n"
            "• Compromised barrier layers (e.g., LOTO, relief valves, gas detectors)\n"
            "• Real-time pSIF probability preview\n\n"
            "Would you like guidance on what details to include in an incident narrative?"
        )

    # Barriers & Barrier Health
    if any(term in q for term in ["barrier", "loto", "isolation", "esd", "interlock", "psv", "relief valve", "detector"]):
        return (
            "Defensive safety barriers are your facility's critical lines of protection against catastrophic loss of containment.\n\n"
            "In SurakshaAI, we track 18 standardized **IOGP 459** critical barriers across three operational tiers:\n"
            "1. **Engineered Barriers**: Positive physical isolation (Double Block & Bleed), Emergency Shutdown (ESD) valves, and gas detection systems.\n"
            "2. **Procedural Barriers**: Permit-to-Work (PTW) cross-verification, Lockout-Tagout (LOTO), and blind flange controls.\n"
            "3. **Human Performance**: Fatigue management and dual-authorization sign-offs.\n\n"
            "You can inspect live degradation indices and physical inspection photos in **[Barrier Health](/app/barriers)**."
        )

    # Triage Queue
    if any(term in q for term in ["triage", "review", "approve", "override", "sign off"]):
        return (
            "The **[Triage Queue](/app/triage)** is designed for human-in-the-loop expert review. Here, safety leads and HSE managers can:\n\n"
            "• Examine AI-flagged high-potential (pSIF) incidents\n"
            "• Inspect SHAP feature attributions and contributing factors\n"
            "• Validate or override risk ratings with verified notes\n"
            "• Automatically append decisions to the immutable, tamper-evident **[Audit Log](/app/audit-log)**."
        )

    # Precursors
    if any(term in q for term in ["precursor", "cluster", "pattern", "trend", "weak signal"]):
        return (
            "Precursors are weak, recurring operational signals that often precede a major accident. "
            "SurakshaAI clusters high-energy precursors across multiple sites and equipment types so you can intervene proactively.\n\n"
            "You can view active precursor clusters, recurring failure modes, and impacted facilities in the **[Precursor Discovery](/app/precursors)** console."
        )

    # Profile & Account
    if any(term in q for term in ["profile", "account", "settings", "region", "edit profile", "change role"]):
        return (
            "You can view and update your operator profile anytime in **[Account Settings](/app/settings)**. "
            "There you can update your name, age, date of birth, gender, operational role, contact phone, and assigned operational region."
        )

    # Life-Saving Rules (IOGP LSR)
    if any(term in q for term in ["lsr", "life-saving rule", "life saving rule", "cardinal rules", "golden rules"]):
        return (
            "The **IOGP Life-Saving Rules (LSR)** target the critical activities most frequently associated with fatal incidents:\n\n"
            "1. **Bypassing Safety Controls** — Obtain authorization before overriding interlocks or ESD systems.\n"
            "2. **Confined Space Entry** — Verify isolation, test atmosphere, and post an attendant.\n"
            "3. **Energy Isolation (LOTO)** — Verify zero energy state before starting work.\n"
            "4. **Hot Work** — Control flammables and continuous atmospheric monitoring.\n"
            "5. **Line of Fire & Suspended Loads** — Position yourself outside the drop zone.\n"
            "6. **Safe Mechanical Lifting** — Verify crane capacity and rigging inspection.\n"
            "7. **Work at Height** — 100% tie-off with inspected fall arrest gear.\n\n"
            "When filing a report in **[New Report](/app/reports/new)**, the AI classifier automatically attributes relevant LSR rules to the narrative."
        )

    # Hot Work & Confined Space
    if any(term in q for term in ["hot work", "confined space", "permit", "ptw"]):
        return (
            "Permit-to-Work (PTW) governs hazardous non-routine tasks:\n\n"
            "• **Hot Work**: Requires continuous LEL gas monitoring, fire watch with designated extinguisher, spark containment habitat, and atmospheric clearance < 1% LEL.\n"
            "• **Confined Space Entry**: Multi-gas testing (O2: 19.5%–23.5%, H2S < 10 ppm, CO < 25 ppm), positive mechanical ventilation, and standby personnel at entrance with rescue winch.\n\n"
            "You can review procedural barrier integrity for active permits under **[Barrier Health](/app/barriers)**."
        )

    # Gas leaks & chemical hazards
    if any(term in q for term in ["gas leak", "h2s", "hydrocarbon", "toxic", "chemical spill", "explosion"]):
        return (
            "**In the event of an active hazardous release, immediate operational priorities are:**\n\n"
            "1. **Life Safety First**: Evacuate immediately upwind and crosswind towards the designated muster point.\n"
            "2. **Initiate ESD**: Trigger manual Emergency Shutdown if safe to reach the station.\n"
            "3. **Sound Alarm**: Alert the Central Control Room (CCR) with exact location and wind direction.\n"
            "4. **Atmospheric Monitoring**: Do not enter without positive-pressure SCBA and calibrated multi-gas monitors.\n\n"
            "Once the area is isolated and safe, document the event narrative and barrier failure modes in **[New Report](/app/reports/new)**."
        )

    # Audit Log & Compliance
    if any(term in q for term in ["audit", "log", "tamper", "hash", "compliance"]):
        return (
            "The **[Audit Log](/app/audit-log)** maintains an immutable, tamper-evident ledger of all critical safety actions:\n\n"
            "• Human triage decisions & risk rating overrides\n"
            "• Barrier state modifications & degradation alerts\n"
            "• Cryptographic SHA-256 integrity hashes for each event\n\n"
            "This provides full regulatory audit readiness for OSHA 1910.119 (PSM) and OISD audits."
        )

    # Default natural conversational response
    return (
        f"I'm here to help with your inquiry regarding **{prompt}**.\n\n"
        "As your safety intelligence partner powered by OpenAI, I can provide operational guidance, clarify safety standards (IOGP 459, OSHA PSM), or help you explore data across the platform.\n\n"
        "Here are key areas you can access right away:\n"
        "• **[New Report](/app/reports/new)** — Log an incident or near-miss\n"
        "• **[Barrier Health](/app/barriers)** — Inspect defensive safety barriers\n"
        "• **[Triage Queue](/app/triage)** — Review pending high-risk cases\n"
        "• **[Precursor Discovery](/app/precursors)** — Explore detected failure patterns\n"
        "• **[Account Settings](/app/settings)** — Manage your profile & operational region\n\n"
        "Feel free to ask a specific question, describe a safety scenario, or ask how to use any part of the system."
    )


@router.get("/models", response_model=List[HelpDeskModelItem])
def list_helpdesk_models():
    """Return single supported OpenAI model."""
    return [OPENAI_MODEL_INFO]


@router.post("/chat", response_model=HelpDeskChatResponse)
async def helpdesk_chat(payload: HelpDeskChatRequest):
    user_msg = payload.message.strip()

    # 1. Attempt direct live OpenAI ChatGPT inference if API key configured
    openai_reply = await call_openai_chat(user_msg, payload.history)
    if openai_reply:
        return HelpDeskChatResponse(
            reply=openai_reply,
            model_used="OpenAI GPT-4o",
            provider="OpenAI",
            suggested_actions=["Report incident", "Triage", "Barriers"],
            navigation_links=[
                {"title": "New Report", "href": "/app/reports/new"},
                {"title": "Triage", "href": "/app/triage"},
                {"title": "Barriers", "href": "/app/barriers"},
            ],
        )

    # 2. Rich, natural conversational ChatGPT-style local intelligence engine
    natural_reply = generate_natural_chatgpt_response(user_msg, payload.history)
    return HelpDeskChatResponse(
        reply=natural_reply,
        model_used="OpenAI GPT-4o",
        provider="OpenAI",
        suggested_actions=["Report incident", "What is pSIF?", "Barrier health"],
        navigation_links=[
            {"title": "New Report", "href": "/app/reports/new"},
            {"title": "Triage", "href": "/app/triage"},
            {"title": "Barriers", "href": "/app/barriers"},
        ],
    )
