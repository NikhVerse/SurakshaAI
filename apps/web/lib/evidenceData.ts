export type { EvidenceItem, ExternalSource } from "@/components/ui/DetailDrawer";
import type { EvidenceItem, ExternalSource } from "@/components/ui/DetailDrawer";

export const EVIDENCE_REGISTRY: Record<string, EvidenceItem> = {
  loto_valve: {
    url: "/evidence/loto_valve.jpg",
    title: "High-Pressure Manifold LOTO Lockout Verification",
    caption:
      "Physical verification of zero energy state with Master Lock 410 safety padlock and danger isolation tag #7845 affixed to primary manifold valve.",
    timestamp: "2026-09-22 08:42 UTC",
    assetId: "VLV-LOTO-7845",
    tag: "LOTO / ISO-459",
  },
  flange_inspection: {
    url: "/evidence/flange_inspection.jpg",
    title: "Ultrasonic Flange Thickness & Torque Seal Inspection",
    caption:
      "Certified NDT technician verifying wall thickness (8.4mm nominal) and torque-seal tamper indicator on 600# raised-face hydrocarbon flange.",
    timestamp: "2026-09-23 11:15 UTC",
    assetId: "FLG-NDT-600R",
    tag: "NDT / ASME B31.3",
  },
  psv_relief: {
    url: "/evidence/psv_relief.jpg",
    title: "Dual Pressure Relief System Calibration & Lead Wire Seal",
    caption:
      "PSV-102A/B safety relief system on separator vessel V-102 inspected with intact lead wire calibration seals (Set: 42.5 bar, Tag #CAL-2026-09).",
    timestamp: "2026-09-21 14:05 UTC",
    assetId: "PSV-102-SYS",
    tag: "API 520 / 526",
  },
  hotwork_habitat: {
    url: "/evidence/hotwork_habitat.jpg",
    title: "Pressurised Hot Work Habitat & Continuous Gas Detection",
    caption:
      "Certified flame-retardant welding habitat operating at +50 Pa positive differential pressure with calibrated optical HC gas detection wand at 0.0% LEL.",
    timestamp: "2026-09-24 07:30 UTC",
    assetId: "HAB-HW-04",
    tag: "Zone 1 / IEC 60079",
  },
  fall_protection: {
    url: "/evidence/fall_protection.jpg",
    title: "Certified Fall Arrest Harness & Anchor Clamp with Scafftag",
    caption:
      "Miller heavy-duty I-beam clamp anchor rated for 5,000 lbs (22.2 kN) with Sala shock-absorbing lanyard and valid green Scafftag #10492.",
    timestamp: "2026-09-24 09:15 UTC",
    assetId: "FPE-HARN-10492",
    tag: "EN 361 / OSHA 1926",
  },
  crane_rigging: {
    url: "/evidence/crane_rigging.jpg",
    title: "Certified Spreader Bar Rigging & Overhead Lift Exclusion Zone",
    caption:
      "25-tonne SWL yellow spreader bar with certified Crosby bow shackles, active green inspection colour-code tags, and barricaded exclusion zone.",
    timestamp: "2026-09-23 15:20 UTC",
    assetId: "RIG-SWL-25T",
    tag: "ASME B30.9 / LOLER",
  },
};

export const EXTERNAL_STANDARDS_REGISTRY: Record<string, ExternalSource> = {
  iogp_459: {
    name: "IOGP Report 459: Life-Saving Rules",
    url: "https://www.iogp.org/bookstore/product/iogp-report-459-life-saving-rules/",
    authority: "International Association of Oil & Gas Producers",
    code: "IOGP 459",
  },
  iogp_501: {
    name: "IOGP Report 501: Process Safety Recommended Practice on KPIs",
    url: "https://www.iogp.org/bookstore/product/report-501-process-safety-recommended-practice-on-key-performance-indicators/",
    authority: "International Association of Oil & Gas Producers",
    code: "IOGP 501",
  },
  oisd_145: {
    name: "OISD-STD-145: Work Permit & Isolation Systems",
    url: "https://www.oisd.gov.in/standards",
    authority: "Oil Industry Safety Directorate (Govt. of India)",
    code: "OISD 145",
  },
  osha_1910_147: {
    name: "OSHA 29 CFR 1910.147: Control of Hazardous Energy (LOTO)",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147",
    authority: "Occupational Safety and Health Administration (US DOL)",
    code: "29 CFR 1910.147",
  },
  osha_1910_119: {
    name: "OSHA 29 CFR 1910.119: Process Safety Management of Hazardous Chemicals",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.119",
    authority: "Occupational Safety and Health Administration (US DOL)",
    code: "29 CFR 1910.119",
  },
  osha_1910_146: {
    name: "OSHA 29 CFR 1910.146: Permit-Required Confined Spaces",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.146",
    authority: "Occupational Safety and Health Administration (US DOL)",
    code: "29 CFR 1910.146",
  },
  osha_1926_502: {
    name: "OSHA 29 CFR 1926.502: Fall Protection Systems Criteria & Practices",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.502",
    authority: "Occupational Safety and Health Administration (US DOL)",
    code: "29 CFR 1926.502",
  },
  osha_1926_251: {
    name: "OSHA 29 CFR 1926.251 / ASME B30.9: Rigging Equipment for Material Handling",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.251",
    authority: "Occupational Safety and Health Administration (US DOL)",
    code: "29 CFR 1926.251",
  },
  ccps_rbps: {
    name: "CCPS / AIChE: Guidelines for Risk Based Process Safety",
    url: "https://www.aiche.org/ccps",
    authority: "Center for Chemical Process Safety",
    code: "CCPS RBPS",
  },
  iso_45001: {
    name: "ISO 45001:2018: Occupational Health & Safety Management Systems",
    url: "https://www.iso.org/standard/63787.html",
    authority: "International Organization for Standardization",
    code: "ISO 45001",
  },
};

/**
 * Returns photographic evidence corresponding to a given barrier code
 */
export function getEvidenceForBarrier(barrierCode?: string): EvidenceItem[] {
  const code = (barrierCode || "").toUpperCase();

  if (code.includes("EI") || code.includes("ISO") || code.includes("LOCK") || code.includes("BAR-001")) {
    return [EVIDENCE_REGISTRY.loto_valve, EVIDENCE_REGISTRY.flange_inspection];
  }
  if (code.includes("GT") || code.includes("GAS") || code.includes("BAR-002") || code.includes("BAR-010")) {
    return [EVIDENCE_REGISTRY.hotwork_habitat, EVIDENCE_REGISTRY.flange_inspection];
  }
  if (code.includes("WP") || code.includes("PERMIT") || code.includes("BAR-003")) {
    return [EVIDENCE_REGISTRY.hotwork_habitat, EVIDENCE_REGISTRY.loto_valve];
  }
  if (code.includes("EZ") || code.includes("ZONE") || code.includes("BARRICADE") || code.includes("BAR-004")) {
    return [EVIDENCE_REGISTRY.crane_rigging, EVIDENCE_REGISTRY.fall_protection];
  }
  if (code.includes("FP") || code.includes("FALL") || code.includes("BAR-005")) {
    return [EVIDENCE_REGISTRY.fall_protection, EVIDENCE_REGISTRY.crane_rigging];
  }
  if (code.includes("LFT") || code.includes("RIG") || code.includes("CRANE") || code.includes("BAR-008")) {
    return [EVIDENCE_REGISTRY.crane_rigging, EVIDENCE_REGISTRY.fall_protection];
  }
  if (code.includes("ESD") || code.includes("BOP") || code.includes("RELIEF") || code.includes("BAR-007") || code.includes("BAR-009")) {
    return [EVIDENCE_REGISTRY.psv_relief, EVIDENCE_REGISTRY.flange_inspection];
  }

  // Default rich evidence bundle
  return [
    EVIDENCE_REGISTRY.loto_valve,
    EVIDENCE_REGISTRY.flange_inspection,
    EVIDENCE_REGISTRY.psv_relief,
  ];
}

/**
 * Returns external regulatory standards and document links for a barrier
 */
export function getStandardsForBarrier(barrierCode?: string): ExternalSource[] {
  const code = (barrierCode || "").toUpperCase();

  if (code.includes("EI") || code.includes("ISO") || code.includes("BAR-001")) {
    return [
      EXTERNAL_STANDARDS_REGISTRY.osha_1910_147,
      EXTERNAL_STANDARDS_REGISTRY.oisd_145,
      EXTERNAL_STANDARDS_REGISTRY.iogp_459,
    ];
  }
  if (code.includes("GT") || code.includes("GAS") || code.includes("BAR-002") || code.includes("BAR-010")) {
    return [
      EXTERNAL_STANDARDS_REGISTRY.osha_1910_146,
      EXTERNAL_STANDARDS_REGISTRY.oisd_145,
      EXTERNAL_STANDARDS_REGISTRY.iogp_459,
    ];
  }
  if (code.includes("FP") || code.includes("FALL") || code.includes("BAR-005")) {
    return [
      EXTERNAL_STANDARDS_REGISTRY.osha_1926_502,
      EXTERNAL_STANDARDS_REGISTRY.iogp_459,
      EXTERNAL_STANDARDS_REGISTRY.iso_45001,
    ];
  }
  if (code.includes("LFT") || code.includes("RIG") || code.includes("BAR-008") || code.includes("BAR-004")) {
    return [
      EXTERNAL_STANDARDS_REGISTRY.osha_1926_251,
      EXTERNAL_STANDARDS_REGISTRY.iogp_459,
      EXTERNAL_STANDARDS_REGISTRY.iso_45001,
    ];
  }
  if (code.includes("ESD") || code.includes("BOP") || code.includes("BAR-007") || code.includes("BAR-009")) {
    return [
      EXTERNAL_STANDARDS_REGISTRY.osha_1910_119,
      EXTERNAL_STANDARDS_REGISTRY.ccps_rbps,
      EXTERNAL_STANDARDS_REGISTRY.iogp_501,
    ];
  }

  return [
    EXTERNAL_STANDARDS_REGISTRY.iogp_459,
    EXTERNAL_STANDARDS_REGISTRY.iogp_501,
    EXTERNAL_STANDARDS_REGISTRY.oisd_145,
    EXTERNAL_STANDARDS_REGISTRY.osha_1910_119,
  ];
}
