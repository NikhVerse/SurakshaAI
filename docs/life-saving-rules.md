# SurakshaAI — Life-Saving Rules (LSR) Multi-Label Intelligence

## 1. Supported IOGP Life-Saving Rules

SurakshaAI natively implements multi-label classification across the 9 standardized International Association of Oil & Gas Producers (IOGP) Life-Saving Rules:

| Rule Code | Rule Name | Core Objective |
| :--- | :--- | :--- |
| **LSR-01** | Bypassing Safety Controls | Obtain authorization before overriding or disabling safety controls. |
| **LSR-02** | Confined Space | Obtain authorization before entering a confined space. |
| **LSR-03** | Driving | Follow safe driving rules: wear seatbelts, adhere to speed limits. |
| **LSR-04** | Energy Isolation | Verify isolation and zero energy state before starting work. |
| **LSR-05** | Hot Work | Control flammables and obtain authorization before hot work. |
| **LSR-06** | Line of Fire | Position yourself and others away from moving equipment and suspended loads. |
| **LSR-07** | Safe Mechanical Lifting | Plan lifting operations and control the lift area. |
| **LSR-08** | Work Authorisation | Work with a valid permit when required and understand the scope. |
| **LSR-09** | Work at Height | Protect yourself against a fall when working at height. |

---

## 2. Multi-Label Classification Behavior

A single incident frequently breaches or challenges multiple Life-Saving Rules. SurakshaAI never artificially collapses an event into a single category. For example:
- A technician entering a flash vessel without continuous gas testing maps to **Confined Space (LSR-02)** as primary and **Work Authorisation (LSR-08)** as secondary.
- A mechanic working on an unverified compressor maps to **Energy Isolation (LSR-04)** and **Bypassing Safety Controls (LSR-01)**.
