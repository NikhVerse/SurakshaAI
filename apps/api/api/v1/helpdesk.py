"""
SurakshaAI Help Desk AI Guidance & Model-Switching Router
Concise, natural, user-friendly guidance with minimal words.
"""
from typing import List, Dict, Any, Optional
import httpx
from fastapi import APIRouter
from apps.api.app.config import get_settings
from apps.api.schemas.schemas import (
    HelpDeskModelItem,
    HelpDeskChatRequest,
    HelpDeskChatResponse,
)

router = APIRouter(prefix="/helpdesk", tags=["Help Desk & AI Guidance"])
settings = get_settings()

AVAILABLE_MODELS: List[HelpDeskModelItem] = [
    # Google Gemini Models
    HelpDeskModelItem(
        id="gemini-2.5-flash",
        name="Gemini 2.5 Flash",
        provider="Google Gemini",
        description="Fast & direct safety guidance",
        badge="Gemini",
        is_active=True,
        context_window="1M",
    ),
    HelpDeskModelItem(
        id="gemini-1.5-pro",
        name="Gemini 1.5 Pro",
        provider="Google Gemini",
        description="Deep hazard reasoning & compliance",
        badge="Gemini Pro",
        is_active=True,
        context_window="2M",
    ),
    # OpenAI Models
    HelpDeskModelItem(
        id="gpt-4o",
        name="GPT-4o",
        provider="OpenAI",
        description="Multimodal inspection & procedures",
        badge="GPT-4o",
        is_active=True,
        context_window="128k",
    ),
    HelpDeskModelItem(
        id="gpt-4o-mini",
        name="GPT-4o Mini",
        provider="OpenAI",
        description="High-speed operational evaluation",
        badge="OpenAI Mini",
        is_active=True,
        context_window="128k",
    ),
    # Free Ollama Models (Local / Open-Source)
    HelpDeskModelItem(
        id="llama3.2",
        name="Llama 3.2 (Ollama)",
        provider="Ollama (Free Local)",
        description="Free, sovereign local open-weights model",
        badge="Free Local",
        is_active=True,
        context_window="128k",
    ),
    HelpDeskModelItem(
        id="mistral",
        name="Mistral 7B (Ollama)",
        provider="Ollama (Free Local)",
        description="Free, fast on-premises safety intelligence",
        badge="Free Local",
        is_active=True,
        context_window="32k",
    ),
]


NATURAL_GUIDANCE: List[Dict[str, Any]] = [
    {
        "id": "greetings",
        "keywords": ["hi", "hello", "hey", "good morning", "good afternoon", "how are you", "what's up", "hey there", "greetings"],
        "reply": (
            "Hello! I'm doing well, thanks for asking. How can I help you today? "
            "Feel free to ask about reporting incidents, checking barrier health, or understanding safety scores."
        ),
        "links": [
            {"title": "New Report", "href": "/app/reports/new"},
            {"title": "Barrier Health", "href": "/app/barriers"},
        ],
        "actions": ["Report incident", "What is pSIF?", "Barrier health"],
    },
    {
        "id": "identity",
        "keywords": ["who are you", "what are you", "what can you do", "help me", "how does this work", "about suraksha", "tell me about yourself"],
        "reply": (
            "I'm your SurakshaAI safety assistant. I can help you log incidents, track barrier integrity, "
            "interpret pSIF risk scores, and search regulatory safety standards."
        ),
        "links": [
            {"title": "Dashboard", "href": "/app/dashboard"},
            {"title": "New Report", "href": "/app/reports/new"},
        ],
        "actions": ["What is pSIF?", "Report incident", "Barrier health"],
    },
    {
        "id": "gratitude",
        "keywords": ["thank you", "thanks", "appreciate", "helpful", "good job", "great", "awesome", "perfect"],
        "reply": "You're very welcome! Stay safe out there, and let me know whenever you need anything else.",
        "links": [],
        "actions": ["Report incident", "Triage queue"],
    },
    {
        "id": "farewell",
        "keywords": ["bye", "goodbye", "see you", "take care", "later"],
        "reply": "Take care and have a safe shift! Feel free to reach back out anytime you need assistance.",
        "links": [],
        "actions": [],
    },
    {
        "id": "report_incident",
        "keywords": ["report", "submit", "new incident", "create", "log", "file", "near miss", "unsafe act", "hazard", "observation"],
        "reply": (
            "To log an incident or near-miss, head over to **[New Report](/app/reports/new)**. "
            "Enter your site location, activity, and description — the platform evaluates safety barriers and computes a pSIF score automatically."
        ),
        "links": [
            {"title": "New Report", "href": "/app/reports/new"},
            {"title": "View Incidents", "href": "/app/reports"},
        ],
        "actions": ["Report incident", "Triage queue", "Barriers"],
    },
    {
        "id": "psif_score",
        "keywords": ["psif", "probability", "score", "prediction", "fatal", "serious", "sif", "severity", "risk calculation"],
        "reply": (
            "**pSIF** stands for *Potential Serious Injury or Fatality*. It's our calibrated risk score (0 to 1) estimating the probability of life-altering harm. "
            "Scores at 0.70 or higher trigger high-priority alerts in the **[Triage Queue](/app/triage)**."
        ),
        "links": [
            {"title": "Triage Queue", "href": "/app/triage"},
            {"title": "Dashboard", "href": "/app/dashboard"},
        ],
        "actions": ["Triage queue", "Barriers"],
    },
    {
        "id": "barriers",
        "keywords": ["barrier", "matrix", "iogp", "integrity", "hardware", "safeguard"],
        "reply": (
            "We continuously monitor 10 critical safety barriers (like gas detection, LOTO, and relief systems). "
            "You can inspect live failure rates and field inspection proofs in **[Barrier Health](/app/barriers)**."
        ),
        "links": [
            {"title": "Barrier Health", "href": "/app/barriers"},
        ],
        "actions": ["Barrier health", "Report incident"],
    },
    {
        "id": "loto",
        "keywords": ["loto", "lockout", "tagout", "energy isolation", "padlock", "zero energy"],
        "reply": (
            "**LOTO (Lockout/Tagout)** isolates hazardous energy (electrical, hydraulic, pneumatic) before maintenance. "
            "You can review active lockout tags and inspection photos in **[Barrier Health](/app/barriers)**."
        ),
        "links": [
            {"title": "Barrier Health", "href": "/app/barriers"},
        ],
        "actions": ["Barrier health", "Report incident"],
    },
    {
        "id": "gas_testing",
        "keywords": ["gas", "gas test", "h2s", "oxygen", "flammable", "toxic", "lel", "confined space"],
        "reply": (
            "**Gas Testing** verifies safe breathing air and checks for combustible vapors or toxic gases like H2S before hot work or confined space entry. "
            "View live detection telemetry in **[Barrier Health](/app/barriers)**."
        ),
        "links": [
            {"title": "Barrier Health", "href": "/app/barriers"},
        ],
        "actions": ["Barrier health", "New report"],
    },
    {
        "id": "fall_protection",
        "keywords": ["fall", "harness", "scaffold", "scaffolding", "height", "working at height", "lanyard"],
        "reply": (
            "**Fall Protection** requires certified anchor points, harnesses, and green-tagged scaffolding for work above 1.8 meters. "
            "Always inspect gear before use, and log any damaged equipment in **[New Report](/app/reports/new)**."
        ),
        "links": [
            {"title": "New Report", "href": "/app/reports/new"},
            {"title": "Barrier Health", "href": "/app/barriers"},
        ],
        "actions": ["Report incident", "Barrier health"],
    },
    {
        "id": "emergency",
        "keywords": ["emergency", "stop work", "danger", "evacuate", "alarm", "life threatening", "urgent"],
        "reply": (
            "If there is immediate danger, exercise **Stop Work Authority (SWA)** right away to halt the operation. "
            "Once everyone is in a safe muster zone, report the occurrence at **[New Report](/app/reports/new)**."
        ),
        "links": [
            {"title": "New Report", "href": "/app/reports/new"},
        ],
        "actions": ["Report incident", "Triage queue"],
    },
    {
        "id": "triage",
        "keywords": ["triage", "queue", "review", "approve", "pending", "officer"],
        "reply": (
            "The **[Triage Queue](/app/triage)** is where safety officers evaluate high-risk incidents, verify barrier statuses, "
            "and assign corrective action plans to site teams."
        ),
        "links": [
            {"title": "Triage Queue", "href": "/app/triage"},
        ],
        "actions": ["Triage queue", "Report incident"],
    },
    {
        "id": "precursors",
        "keywords": ["precursor", "cluster", "pattern", "trend", "signal", "early warning"],
        "reply": (
            "Precursors are repeated warning signs or near-miss patterns spotted before major accidents occur. "
            "Check trending clusters in **[Precursor Signals](/app/precursors)** to intervene early."
        ),
        "links": [
            {"title": "Precursors", "href": "/app/precursors"},
        ],
        "actions": ["Precursor signals", "Dashboard"],
    },
    {
        "id": "knowledge_rag",
        "keywords": ["knowledge", "document", "manual", "search", "rag", "osha", "oisd", "standard", "regulation"],
        "reply": (
            "You can search safety manuals (OSHA, OISD, IOGP) or upload your facility's procedures in the **[Knowledge Base](/app/knowledge)**."
        ),
        "links": [
            {"title": "Knowledge Base", "href": "/app/knowledge"},
            {"title": "Upload Manual", "href": "/app/knowledge/upload"},
        ],
        "actions": ["Knowledge base", "New report"],
    },
    {
        "id": "models",
        "keywords": ["switch model", "change model", "models", "gemini", "gpt", "openai", "ollama", "llama", "mistral"],
        "reply": (
            "You can switch reasoning models anytime using the top selector: "
            "**Gemini** (Flash / Pro) for instant reasoning, **OpenAI** (GPT-4o / GPT-4o Mini) for advanced procedure analysis, "
            "and **Free Ollama** (Llama 3.2 / Mistral) for sovereign, local privacy with zero cloud API costs."
        ),
        "links": [],
        "actions": ["Report incident", "Barrier health"],
    },
]


def find_guidance(query: str) -> Optional[Dict[str, Any]]:
    q = query.lower().strip()
    # Exact or keyword matching
    for item in NATURAL_GUIDANCE:
        if any(kw in q for kw in item["keywords"]):
            return item
    return None


async def call_external_llm(prompt: str, model_id: str) -> Optional[str]:
    """Call external LLM (Google Gemini, OpenAI, or Free Local Ollama) concisely if configured."""
    system_instruction = (
        "You are a friendly, natural AI safety assistant for the SurakshaAI industrial platform. "
        "Answer conversationally and naturally, like a helpful safety colleague. "
        "Keep answers to 1-3 sentences with clean markdown links (e.g. [New Report](/app/reports/new), [Triage](/app/triage), [Barrier Health](/app/barriers)). "
        "Avoid robotic jargon, filler words, or walls of text."
    )
    try:
        m_lower = model_id.lower()
        # 1. Google Gemini
        if "gemini" in m_lower and settings.GEMINI_API_KEY:
            api_model = "gemini-1.5-flash" if "flash" in m_lower else "gemini-1.5-pro"
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{api_model}:generateContent?key={settings.GEMINI_API_KEY}"
            payload = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [
                            {
                                "text": f"{system_instruction}\n\nUser Question: {prompt}"
                            }
                        ],
                    }
                ],
                "generationConfig": {"temperature": 0.4, "maxOutputTokens": 200},
            }
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    candidates = resp.json().get("candidates", [])
                    if candidates:
                        text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        if text:
                            return text.strip()

        # 2. OpenAI (GPT-4o, GPT-4o Mini)
        elif ("gpt" in m_lower or "openai" in m_lower) and settings.OPENAI_API_KEY:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                "Content-Type": "application/json",
            }
            payload = {
                "model": model_id,
                "messages": [
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.4,
                "max_tokens": 200,
            }
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(url, json=payload, headers=headers)
                if resp.status_code == 200:
                    choices = resp.json().get("choices", [])
                    if choices:
                        content = choices[0].get("message", {}).get("content", "")
                        if content:
                            return content.strip()

        # 3. Free Local Ollama Models (Llama 3.2, Mistral)
        elif any(kw in m_lower for kw in ["llama", "mistral", "ollama"]):
            target_model = "mistral" if "mistral" in m_lower else "llama3.2"
            url = f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/chat"
            payload = {
                "model": target_model,
                "messages": [
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": prompt},
                ],
                "stream": False,
                "options": {"temperature": 0.3, "num_predict": 200},
            }
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    content = resp.json().get("message", {}).get("content", "")
                    if content:
                        return content.strip()
    except Exception:
        pass
    return None



@router.get("/models", response_model=List[HelpDeskModelItem])
def list_helpdesk_models():
    return AVAILABLE_MODELS


@router.post("/chat", response_model=HelpDeskChatResponse)
async def helpdesk_chat(payload: HelpDeskChatRequest):
    user_msg = payload.message.strip()
    selected_model_id = payload.model or "gemini-2.5-flash"

    model_item = next(
        (m for m in AVAILABLE_MODELS if m.id == selected_model_id),
        AVAILABLE_MODELS[0],
    )

    # 1. External LLM call if configured
    external_reply = await call_external_llm(user_msg, model_item.id)
    if external_reply:
        return HelpDeskChatResponse(
            reply=external_reply,
            model_used=model_item.name,
            provider=model_item.provider,
            suggested_actions=["Report incident", "Triage", "Barriers"],
            navigation_links=[
                {"title": "New Report", "href": "/app/reports/new"},
                {"title": "Triage", "href": "/app/triage"},
            ],
        )

    # 2. Matched conversational guidance
    matched = find_guidance(user_msg)
    if matched:
        return HelpDeskChatResponse(
            reply=matched["reply"],
            model_used=model_item.name,
            provider=model_item.provider,
            suggested_actions=matched.get("actions", []),
            navigation_links=matched.get("links", []),
        )

    # 3. Conversational natural fallback
    natural_fallback = (
        "I'm here to help! Could you share a bit more detail about what you need? "
        "You can log an incident at **[New Report](/app/reports/new)**, check barrier status in **[Barrier Health](/app/barriers)**, "
        "or review high-risk cases in the **[Triage Queue](/app/triage)**."
    )

    return HelpDeskChatResponse(
        reply=natural_fallback,
        model_used=model_item.name,
        provider=model_item.provider,
        suggested_actions=["Report incident", "What is pSIF?", "Barrier health"],
        navigation_links=[
            {"title": "New Report", "href": "/app/reports/new"},
            {"title": "Triage", "href": "/app/triage"},
        ],
    )
