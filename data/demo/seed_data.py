import os
import sys
from datetime import datetime, timedelta, timezone

# Ensure project root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from apps.api.models.database import SessionLocal, engine, Base
from apps.api.models.entities import (
    User, Site, Activity, Barrier, LifeSavingRule, Report, ReportEntity,
    PSIFPrediction, ReportLSRPrediction, PrecursorCluster, KnowledgeDocument,
    KnowledgeChunk, AuditLog, ReviewTask, Alert
)
from apps.api.auth.security import get_password_hash
from rag.knowledge_engine import get_knowledge_engine

knowledge_engine = get_knowledge_engine()


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing data if re-seeding
    db.query(AuditLog).delete()
    db.query(Alert).delete()
    db.query(ReviewTask).delete()
    db.query(ReportLSRPrediction).delete()
    db.query(PSIFPrediction).delete()
    db.query(ReportEntity).delete()
    db.query(Report).delete()
    db.query(KnowledgeChunk).delete()
    db.query(KnowledgeDocument).delete()
    db.query(PrecursorCluster).delete()
    db.query(LifeSavingRule).delete()
    db.query(Barrier).delete()
    db.query(Activity).delete()
    db.query(Site).delete()
    db.query(User).delete()
    db.commit()

    print("Seeding Users...")
    users = [
        User(
            email="analyst@suraksha.ai",
            full_name="Priya Sharma (HSE Lead Analyst)",
            hashed_password=get_password_hash("Suraksha@2026"),
            role="HSE_ANALYST"
        ),
        User(
            email="manager@suraksha.ai",
            full_name="Rajesh Verma (HSE Operations Manager)",
            hashed_password=get_password_hash("Suraksha@2026"),
            role="HSE_MANAGER"
        ),
        User(
            email="scientist@suraksha.ai",
            full_name="Dr. Aris Thorne (Lead Safety Data Scientist)",
            hashed_password=get_password_hash("Suraksha@2026"),
            role="DATA_SCIENTIST"
        ),
        User(
            email="admin@suraksha.ai",
            full_name="System Administrator",
            hashed_password=get_password_hash("Suraksha@2026"),
            role="ADMINISTRATOR"
        ),
    ]
    db.add_all(users)
    db.flush()

    print("Seeding Sites...")
    sites = [
        Site(code="SITE-ALPHA", name="Site Alpha - Central Processing Complex", location="Assam Field Basin", operational_unit="Upstream Oil & Gas", risk_level="HIGH"),
        Site(code="RIG-07", name="Rig 07 - Deep Exploration Platform", location="Offshore Bay Complex", operational_unit="Offshore Drilling", risk_level="CRITICAL"),
        Site(code="TERM-DELTA", name="Terminal Delta - Storage & Loading", location="Coastal Terminal Zone", operational_unit="Midstream Logistics", risk_level="STANDARD"),
        Site(code="WELL-SEC4", name="Wellhead Sector 4 - Gas Gathering", location="Northern Valley Network", operational_unit="Field Gathering", risk_level="MEDIUM"),
    ]
    db.add_all(sites)
    db.flush()

    print("Seeding Activities...")
    activities = [
        Activity(code="ACT-MAINT", name="Compressor Overhaul & Electrical Maintenance", category="Maintenance", description="Preventative and corrective mechanical/electrical maintenance."),
        Activity(code="ACT-LIFT", name="Heavy Crane Mechanical Rigging & Lifting", category="Lifting", description="Overhead crane operations and pipe bundle transfers."),
        Activity(code="ACT-HEIGHT", name="Structural Scaffold Erection & Beam Inspection", category="Height Work", description="Work executed at heights above 2 meters."),
        Activity(code="ACT-CONF", name="Pressure Vessel Cleaning & Internal Inspection", category="Confined Space", description="Manned entry into enclosed process equipment."),
        Activity(code="ACT-HOT", name="High-Pressure Flare Line Welding & Cutting", category="Hot Work", description="Spark-producing maintenance in hydrocarbon zones."),
        Activity(code="ACT-TRANS", name="Heavy Plant & Rig Site Transport Operations", category="Logistics", description="Vehicle movement and heavy haul road transport."),
    ]
    db.add_all(activities)
    db.flush()

    print("Seeding Barriers...")
    barriers = [
        Barrier(code="BAR-01", name="Energy Isolation", category="Physical/Administrative", expected_function="Positively disconnect, lock out, and verify zero energy state prior to work access."),
        Barrier(code="BAR-02", name="Work Authorisation", category="Administrative", expected_function="Formal risk assessment, prerequisite checks, and permit validation before task execution."),
        Barrier(code="BAR-03", name="Gas Testing", category="Detection", expected_function="Continuous atmospheric testing for toxic, flammable, and oxygen-deficient conditions."),
        Barrier(code="BAR-04", name="Guarding / Interlock", category="Engineered", expected_function="Physical machine guards and trip interlocks preventing mechanical contact with moving parts."),
        Barrier(code="BAR-05", name="Fall Protection", category="Physical", expected_function="Full-body harness with 100% tie-off to rated anchor points preventing falls from height."),
        Barrier(code="BAR-06", name="Exclusion Zone", category="Administrative/Physical", expected_function="Restricted perimeter barricades preventing personnel from entering line of fire."),
        Barrier(code="BAR-07", name="Lifting Control", category="Procedural", expected_function="Engineered lifting plans, certified rigging gear, and dedicated tag lines."),
        Barrier(code="BAR-08", name="Traffic Control", category="Administrative", expected_function="Vehicle speed governors, designated pedestrian pathways, and journey management plans."),
    ]
    db.add_all(barriers)
    db.flush()

    print("Seeding 9 IOGP Life-Saving Rules...")
    rules = [
        LifeSavingRule(code="LSR-01", name="Bypassing Safety Controls", description="Obtain authorization before overriding or disabling safety controls.", icon_name="shield-alert"),
        LifeSavingRule(code="LSR-02", name="Confined Space", description="Obtain authorization before entering a confined space.", icon_name="box"),
        LifeSavingRule(code="LSR-03", name="Driving", description="Follow safe driving rules: wear seatbelts, adhere to speed limits, and avoid distractions.", icon_name="truck"),
        LifeSavingRule(code="LSR-04", name="Energy Isolation", description="Verify isolation and zero energy state before starting work.", icon_name="zap-off"),
        LifeSavingRule(code="LSR-05", name="Hot Work", description="Identify and control flammables and obtain authorization before hot work.", icon_name="flame"),
        LifeSavingRule(code="LSR-06", name="Line of Fire", description="Position yourself and others away from moving equipment, suspended loads, and stored energy.", icon_name="crosshair"),
        LifeSavingRule(code="LSR-07", name="Safe Mechanical Lifting", description="Plan lifting operations and control the lift area.", icon_name="anchor"),
        LifeSavingRule(code="LSR-08", name="Work Authorisation", description="Work with a valid permit when required and understand the scope and controls.", icon_name="file-check"),
        LifeSavingRule(code="LSR-09", name="Work at Height", description="Protect yourself against a fall when working at height.", icon_name="arrow-up-circle"),
    ]
    db.add_all(rules)
    db.flush()

    print("Seeding Precursor Clusters...")
    clusters = [
        PrecursorCluster(
            name="Pre-Verification Work Execution under Hazardous Electrical Energy",
            summary="Technicians initiating mechanical/electrical maintenance prior to formal zero-energy verification.",
            coherence_score=0.94,
            occurrence_count=7,
            primary_hazard="Electrical Energy",
            primary_barrier_id=barriers[0].id,
            primary_lsr_id=rules[3].id,
            trend_status="INCREASING",
            affected_sites=["Site Alpha - Central Processing Complex", "Wellhead Sector 4 - Gas Gathering"],
            affected_activities=["Compressor Overhaul & Electrical Maintenance"]
        ),
        PrecursorCluster(
            name="Personnel Positioned in Swing Radius / Drop Zone During Mechanical Lift",
            summary="Riggers and maintenance workers standing inside active exclusion zones beneath suspended loads.",
            coherence_score=0.89,
            occurrence_count=5,
            primary_hazard="Suspended Load",
            primary_barrier_id=barriers[5].id,
            primary_lsr_id=rules[5].id,
            trend_status="STABLE",
            affected_sites=["Rig 07 - Deep Exploration Platform", "Terminal Delta - Storage & Loading"],
            affected_activities=["Heavy Crane Mechanical Rigging & Lifting"]
        ),
        PrecursorCluster(
            name="Elevated Structural Transition with Unconnected Fall Arrest",
            summary="Scaffolders and inspectors unhooking lanyards while transitioning across platform beams.",
            coherence_score=0.92,
            occurrence_count=4,
            primary_hazard="Work at Height",
            primary_barrier_id=barriers[4].id,
            primary_lsr_id=rules[8].id,
            trend_status="DECREASING",
            affected_sites=["Site Alpha - Central Processing Complex", "Rig 07 - Deep Exploration Platform"],
            affected_activities=["Structural Scaffold Erection & Beam Inspection"]
        ),
        PrecursorCluster(
            name="Atmospheric Re-entry Without Intermediate Continuous Gas Verification",
            summary="Vessel entrants resuming hot work after work breaks without verifying lower explosive limit (LEL).",
            coherence_score=0.91,
            occurrence_count=3,
            primary_hazard="Chemical / Toxic",
            primary_barrier_id=barriers[2].id,
            primary_lsr_id=rules[1].id,
            trend_status="STABLE",
            affected_sites=["Terminal Delta - Storage & Loading"],
            affected_activities=["Pressure Vessel Cleaning & Internal Inspection"]
        ),
    ]
    db.add_all(clusters)
    db.flush()

    print("Seeding Knowledge Documents...")
    docs_data = [
        {
            "title": "Corporate Standard HSE-STD-014: Hazardous Energy Isolation and Lockout/Tagout (LOTO)",
            "type": "MANDATORY_STANDARD",
            "org": "OIL Corporate Safety",
            "authority": "Executive Committee for HSE Governance",
            "version": "4.2",
            "text": (
                "Section 1: Scope & Mandatory Verification Requirements.\n"
                "Before any technician, engineer, or contractor begins mechanical servicing, disassembly, or electrical "
                "contact on high-voltage compressors, pumps, or switchgear, positive physical isolation must be established.\n\n"
                "Section 2: Zero Energy State Verification.\n"
                "Testing for dead is non-negotiable. Isolation is deemed unverified until a calibrated voltmeter or visual air-break "
                "proves that electrical energy is fully dissipated. Starting work before confirmation constitutes an immediate Stop Work Obligation.\n\n"
                "Section 3: Lockout and Padlock Management.\n"
                "Each individual worker exposed to the potential release of stored electrical or mechanical energy must attach a personal padlock "
                "to the group lockout box. Bypassing locks or verbal handovers without physical inspection is strictly prohibited."
            )
        },
        {
            "title": "IOGP Report 459: Life-Saving Rules Implementation & Barrier Verification Guide",
            "type": "INDUSTRY_STANDARD",
            "org": "IOGP / OIL HSE",
            "authority": "International Association of Oil & Gas Producers",
            "version": "2026.1",
            "text": (
                "Section 1: The Nine Life-Saving Rules.\n"
                "The 9 Life-Saving Rules target the critical activities responsible for the majority of potential serious injuries "
                "and fatalities (pSIF) across industrial operations.\n\n"
                "Section 2: Energy Isolation & Work Authorisation.\n"
                "Whenever an energy barrier fails or remains unverified, the hazard must be treated as active and lethal. "
                "No work may proceed under presumptive isolation. Work authorization permits expire immediately upon any deviation in operating parameters.\n\n"
                "Section 3: Line of Fire and Suspended Loads.\n"
                "Never stand under a suspended load. Physical barriers and exclusion zones must be maintained at 1.5 times the radius of the crane boom reach."
            )
        },
        {
            "title": "Operational Procedure HSE-SOP-032: Confined Space Entry and Atmospheric Testing",
            "type": "OPERATIONAL_PROCEDURE",
            "org": "OIL Upstream Operations",
            "authority": "Field Safety Directorate",
            "version": "3.1",
            "text": (
                "Section 1: Pre-Entry Atmospheric Testing Protocol.\n"
                "Atmospheric testing must confirm Oxygen content between 19.5% and 23.5%, flammable vapor below 1% LEL, and H2S below 5 ppm.\n\n"
                "Section 2: Continuous Monitoring.\n"
                "Testing must continue continuously while personnel occupy the vessel. If work stops for longer than 30 minutes, "
                "re-testing of all interior levels is mandatory before personnel re-enter."
            )
        }
    ]

    for d in docs_data:
        k_doc = KnowledgeDocument(
            title=d["title"],
            document_type=d["type"],
            source_org=d["org"],
            source_authority=d["authority"],
            version=d["version"],
            ingestion_status="INDEXED",
            chunk_count=3
        )
        db.add(k_doc)
        db.flush()

        paragraphs = d["text"].split("\n\n")
        for p_idx, para in enumerate(paragraphs):
            chunk = KnowledgeChunk(
                document_id=k_doc.id,
                chunk_index=p_idx + 1,
                page_number=p_idx + 1,
                section_heading=f"Section {p_idx+1}",
                text_content=para
            )
            db.add(chunk)

        knowledge_engine.add_document_chunks(
            document_id=k_doc.id,
            document_title=k_doc.title,
            authority=k_doc.source_authority,
            text=d["text"]
        )

    print("Seeding Synthetic Reports & Analysis Records...")
    # Include the signature demonstration case from Section 46!
    reports_seed = [
        {
            "uid": "REP-2026-001",
            "type": "NEAR_MISS",
            "narrative": "During maintenance of a compressor, the technician started work before confirming that electrical isolation was effective. No injury occurred.",
            "site": sites[0],
            "activity": activities[0],
            "outcome": "No injury occurred. Maintenance halted upon lead supervisor discovery.",
            "consequence": "Potential electric shock or arc-flash exposure with fatal or disabling burn potential.",
            "equipment": "Reciprocating Compressor Unit C-102",
            "origin": "SYNTHETIC",
            "psif": 0.91,
            "priority": 88.5,
            "barrier": barriers[0], # Energy Isolation
            "barrier_state": "Unverified",
            "lsr": rules[3], # Energy Isolation
            "secondary_lsr": rules[7], # Work Authorisation
            "entities": [
                ("ACTIVITY", "Maintenance", "maintenance", 7, 18),
                ("EQUIPMENT", "Compressor", "compressor", 24, 34),
                ("EXPOSURE", "Technician", "technician", 40, 50),
                ("DEVIATION", "Work Started Before Verification", "started work before confirming", 51, 81),
                ("ENERGY", "Electrical", "electrical", 87, 97),
                ("BARRIER", "Energy Isolation", "electrical isolation", 87, 107),
                ("BARRIER_STATE", "Unverified", "before confirming that electrical isolation was effective", 64, 121),
            ],
            "review_status": "PENDING"
        },
        {
            "uid": "REP-2026-002",
            "type": "UNSAFE_ACT",
            "narrative": "While lifting a 4-tonne drill collar bundle with the mobile crane, the rigger walked directly under the suspended load to adjust the nylon sling. No load slip occurred.",
            "site": sites[1],
            "activity": activities[1],
            "outcome": "Load landed safely. Rigger reprimanded on scene.",
            "consequence": "Crush injury or fatality resulting from dropped suspended load.",
            "equipment": "Terex 50T Mobile Crane",
            "origin": "SYNTHETIC",
            "psif": 0.86,
            "priority": 82.0,
            "barrier": barriers[5], # Exclusion Zone
            "barrier_state": "Bypassed",
            "lsr": rules[5], # Line of Fire
            "secondary_lsr": rules[6], # Safe Mechanical Lifting
            "entities": [
                ("ACTIVITY", "Mechanical Lifting", "lifting", 6, 13),
                ("EQUIPMENT", "Crane / Hoist", "crane", 56, 61),
                ("EXPOSURE", "Rigger", "rigger", 71, 77),
                ("DEVIATION", "Positioned In Line of Fire", "walked directly under the suspended load", 78, 118),
                ("HAZARD", "Suspended Load", "suspended load", 104, 118),
                ("BARRIER", "Exclusion Zone", "exclusion zone", 104, 118),
                ("BARRIER_STATE", "Bypassed", "walked directly under", 78, 99)
            ],
            "review_status": "PENDING"
        },
        {
            "uid": "REP-2026-003",
            "type": "UNSAFE_CONDITION",
            "narrative": "Scaffolding contractor inspected elevated pipe rack at 6 meters elevation. The primary fall protection lanyard was unclipped while transferring between structural platform beams. No fall occurred.",
            "site": sites[0],
            "activity": activities[2],
            "outcome": "Worker reached platform securely.",
            "consequence": "Fall from height (6m) resulting in severe blunt trauma or fatal impact.",
            "equipment": "Scaffold Bay 4",
            "origin": "SYNTHETIC",
            "psif": 0.84,
            "priority": 79.5,
            "barrier": barriers[4], # Fall Protection
            "barrier_state": "Bypassed",
            "lsr": rules[8], # Work at Height
            "secondary_lsr": rules[0], # Bypassing Safety Controls
            "entities": [
                ("EQUIPMENT", "Scaffold", "Scaffolding", 0, 11),
                ("ACTIVITY", "Height Work", "at 6 meters elevation", 52, 73),
                ("BARRIER", "Fall Protection", "fall protection lanyard", 88, 111),
                ("BARRIER_STATE", "Bypassed", "was unclipped", 112, 125),
                ("DEVIATION", "Detached Fall Arrest Device", "lanyard was unclipped while transferring", 104, 144)
            ],
            "review_status": "CONFIRMED"
        },
        {
            "uid": "REP-2026-004",
            "type": "NEAR_MISS",
            "narrative": "Technicians entering flash vessel V-301 after lunch break did not conduct atmospheric gas testing. Multi-gas detector had been turned off in the tool shed.",
            "site": sites[2],
            "activity": activities[3],
            "outcome": "Entry stopped by plant operator before vessel hatch crossing.",
            "consequence": "Asphyxiation or toxic gas poisoning due to nitrogen/hydrocarbon accumulation.",
            "equipment": "Separation Flash Vessel V-301",
            "origin": "SYNTHETIC",
            "psif": 0.88,
            "priority": 85.0,
            "barrier": barriers[2], # Gas Testing
            "barrier_state": "Absent",
            "lsr": rules[1], # Confined Space
            "secondary_lsr": rules[7], # Work Authorisation
            "entities": [
                ("EXPOSURE", "Technician", "Technicians", 0, 11),
                ("ACTIVITY", "Confined Space Entry", "entering flash vessel", 12, 33),
                ("EQUIPMENT", "Vessel / Tank", "vessel V-301", 26, 38),
                ("DEVIATION", "Unpermitted Work Execution", "did not conduct atmospheric gas testing", 58, 97),
                ("BARRIER", "Gas Testing", "gas testing", 86, 97),
                ("BARRIER_STATE", "Absent", "did not conduct", 58, 73)
            ],
            "review_status": "PENDING"
        },
        {
            "uid": "REP-2026-005",
            "type": "UNSAFE_ACT",
            "narrative": "Forklift operator transporting pallet of 55-gallon chemical drums exceeded posted yard speed limit of 15 km/h while turning sharp corner in wet conditions.",
            "site": sites[2],
            "activity": activities[5],
            "outcome": "Pallet shifted but drums remained upright. No spillage.",
            "consequence": "Vehicle rollover or loss of chemical drum containment causing worker contamination.",
            "equipment": "Hyster 3.5T Forklift",
            "origin": "SYNTHETIC",
            "psif": 0.62,
            "priority": 64.0,
            "barrier": barriers[7], # Traffic Control
            "barrier_state": "Failed",
            "lsr": rules[2], # Driving
            "secondary_lsr": rules[0], # Bypassing Controls
            "entities": [
                ("EQUIPMENT", "Traffic / Mobile Plant", "Forklift", 0, 8),
                ("ACTIVITY", "Vehicle Transport", "transporting pallet", 18, 37),
                ("HAZARD", "Chemical / Toxic", "chemical drums", 51, 65),
                ("DEVIATION", "Safety Control Bypass", "exceeded posted yard speed limit", 66, 98),
                ("BARRIER", "Traffic Control", "speed limit", 87, 98),
                ("BARRIER_STATE", "Failed", "exceeded", 66, 74)
            ],
            "review_status": "AUTO_TRIAGED"
        }
    ]

    for idx, r_data in enumerate(reports_seed):
        rep = Report(
            report_uid=r_data["uid"],
            report_type=r_data["type"],
            date_time=datetime.now(timezone.utc) - timedelta(days=idx*3, hours=4),
            site_id=r_data["site"].id,
            activity_id=r_data["activity"].id,
            equipment=r_data["equipment"],
            narrative=r_data["narrative"],
            actual_outcome=r_data["outcome"],
            potential_consequence=r_data["consequence"],
            data_origin=r_data["origin"],
            review_status=r_data["review_status"]
        )
        db.add(rep)
        db.flush()

        # Add entities
        for ent in r_data["entities"]:
            db.add(ReportEntity(
                report_id=rep.id,
                entity_type=ent[0],
                value=ent[1],
                text_span=ent[2],
                start_char=ent[3],
                end_char=ent[4],
                confidence=0.95
            ))

        # Add PSIF prediction
        shap_vals = {
            "Barrier State Failure/Unverified": round(r_data["psif"] * 0.42, 3),
            "Hazardous Energy In Proximity": round(r_data["psif"] * 0.28, 3),
            "Human Exposure in Line of Fire": 0.18,
            "Procedural Deviation Detected": 0.12,
        }
        db.add(PSIFPrediction(
            report_id=rep.id,
            psif_probability=r_data["psif"],
            priority_score=r_data["priority"],
            confidence=0.92,
            is_calibrated=True,
            primary_barrier_id=r_data["barrier"].id,
            barrier_state=r_data["barrier_state"],
            credible_consequence=r_data["consequence"],
            explanation_summary=(
                f"The report indicates human exposure to hazardous energy while critical barrier "
                f"'{r_data['barrier'].name}' was observed in '{r_data['barrier_state']}' state."
            ),
            shap_values=shap_vals,
            model_version="psif-gradient-boost-calibrated-v1.2"
        ))

        # Add LSR predictions
        db.add(ReportLSRPrediction(
            report_id=rep.id,
            lsr_id=r_data["lsr"].id,
            confidence=0.92,
            supporting_evidence=f"Direct safety match: {r_data['lsr'].name}",
            rank=1
        ))
        if "secondary_lsr" in r_data:
            db.add(ReportLSRPrediction(
                report_id=rep.id,
                lsr_id=r_data["secondary_lsr"].id,
                confidence=0.74,
                supporting_evidence=f"Associated operational context: {r_data['secondary_lsr'].name}",
                rank=2
            ))

        # Add review task if pending
        if r_data["review_status"] == "PENDING":
            db.add(ReviewTask(
                report_id=rep.id,
                status="PENDING",
                reason=f"High-priority pSIF precursor ({r_data['psif']*100:.0f}%) with {r_data['barrier_state']} barrier"
            ))

        # Index in vector store
        knowledge_engine.index_report(
            report_id=rep.id,
            report_uid=rep.report_uid,
            narrative=rep.narrative,
            metadata={
                "hazard": r_data["barrier"].name,
                "primary_barrier": r_data["barrier"].name,
                "psif_probability": r_data["psif"],
                "date_time": rep.date_time
            }
        )

    db.commit()
    print("Database seeding completed successfully!")
    db.close()


if __name__ == "__main__":
    seed_database()
