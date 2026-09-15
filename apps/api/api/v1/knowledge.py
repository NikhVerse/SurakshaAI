import hashlib
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from apps.api.models.database import get_db
from apps.api.models.entities import KnowledgeDocument, KnowledgeChunk, AuditLog
from apps.api.schemas.schemas import (
    KnowledgeDocumentResponse, RAGQueryRequest, RAGQueryResponse, RAGSnippet
)
from apps.api.auth.dependencies import get_current_user
from rag.knowledge_engine import get_knowledge_engine
from apps.api.services.llm_provider import get_llm_provider

router = APIRouter(prefix="/knowledge", tags=["Knowledge Center & Grounded RAG"])
knowledge_engine = get_knowledge_engine()
llm_provider = get_llm_provider()


@router.get("/documents", response_model=List[KnowledgeDocumentResponse])
def list_documents(db: Session = Depends(get_db)):
    return db.query(KnowledgeDocument).all()


@router.post("/upload", response_model=KnowledgeDocumentResponse)
async def upload_knowledge_document(
    title: str = Form(...),
    document_type: str = Form("PROCEDURE"),
    source_org: str = Form("OIL"),
    source_authority: str = Form("Corporate HSE"),
    version: str = Form("1.0"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Read file content safely
    content_bytes = await file.read()
    checksum = hashlib.sha256(content_bytes).hexdigest()

    try:
        text_content = content_bytes.decode("utf-8", errors="replace")
    except Exception:
        text_content = f"Uploaded binary document: {file.filename}. Text extraction parsed."

    # Create document record
    doc = KnowledgeDocument(
        title=title,
        document_type=document_type,
        source_org=source_org,
        source_authority=source_authority,
        version=version,
        checksum=checksum,
        ingestion_status="INDEXED",
        chunk_count=0
    )
    db.add(doc)
    db.flush()

    # Chunk and index document
    paragraphs = [p.strip() for p in text_content.split("\n\n") if p.strip()]
    chunk_count = 0
    for idx, p in enumerate(paragraphs):
        chunk = KnowledgeChunk(
            document_id=doc.id,
            chunk_index=idx + 1,
            page_number=1 + (idx // 4),
            section_heading=f"Section {idx+1}",
            text_content=p
        )
        db.add(chunk)
        chunk_count += 1

    doc.chunk_count = chunk_count
    knowledge_engine.add_document_chunks(
        document_id=doc.id,
        document_title=doc.title,
        authority=doc.source_authority,
        text=text_content
    )

    audit = AuditLog(
        user_id=current_user.id if current_user else "SYSTEM",
        action="KNOWLEDGE_DOCUMENT_UPLOADED",
        entity_type="KNOWLEDGE_DOCUMENT",
        entity_id=doc.id,
        details={"title": doc.title, "authority": doc.source_authority, "chunks": chunk_count}
    )
    db.add(audit)
    db.commit()
    db.refresh(doc)

    return doc


@router.post("/query", response_model=RAGQueryResponse)
async def query_knowledge_rag(payload: RAGQueryRequest):
    """Retrieve grounded knowledge snippets and generate an evidence-backed answer."""
    snippets = knowledge_engine.search_knowledge(payload.query, limit=payload.limit)

    rag_snippets = [
        RAGSnippet(
            document_title=s["document_title"],
            source_authority=s["source_authority"],
            page_number=s["page_number"],
            section_heading=s["section_heading"],
            text_content=s["text_content"],
            relevance_score=s["relevance_score"]
        )
        for s in snippets
    ]

    if not rag_snippets:
        return RAGQueryResponse(
            query=payload.query,
            answer="No approved knowledge documents in the repository match this query.",
            sources=[],
            grounding_confidence=0.0
        )

    # Grounded answer synthesis
    context_text = "\n---\n".join([f"Source: {s.document_title} ({s.source_authority})\n{s.text_content}" for s in rag_snippets])
    prompt = (
        f"Context from approved safety standards:\n{context_text}\n\n"
        f"Question: {payload.query}\n"
        "Provide a concise, grounded answer strictly based on the excerpts above. Citing the source authority."
    )

    health = await llm_provider.check_health()
    if health.get("status") == "connected":
        answer = await llm_provider.generate(prompt)
        if not answer:
            answer = f"Based on approved guidelines from {rag_snippets[0].source_authority}, mandatory controls specify: '{rag_snippets[0].text_content[:200]}...'"
    else:
        answer = f"Based on approved guidelines from {rag_snippets[0].source_authority}, mandatory controls specify: '{rag_snippets[0].text_content[:200]}...'"

    return RAGQueryResponse(
        query=payload.query,
        answer=answer,
        sources=rag_snippets,
        grounding_confidence=round(rag_snippets[0].relevance_score, 2)
    )
