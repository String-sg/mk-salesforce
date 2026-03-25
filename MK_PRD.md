# MOE Kindergarten (MK) Portal
## PRD

**Version:** 1.0
**Status:** Draft
**Date:** 2026-03-25
**Product Team:** Jasmine Tay, Aung A Mon, Mike Tan

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-25 | DXD | Initial PRD created covering MKPI, CDF/Child Details/Medical, Movement/Attendance, and Case Management tracks |
| 1.1 | 2026-03-25 | DXD | Added Section 1.2 Child Records to Track 1 as the foundational data layer for MKPI; renumbered subsequent sub-sections |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Background & Context](#2-background--context)
3. [Problem Statement](#3-problem-statement)
4. [Vision](#4-vision)
5. [Goals & Success Metrics](#5-goals--success-metrics)
6. [Target Users & Roles](#6-target-users--roles)
7. [Product Scope & Features](#7-product-scope--features)
   - [Track 1: MKPI](#track-1-mkpi)
   - [Track 2: CDF, Child Details & Medical](#track-2-cdf-child-details--medical)
   - [Track 3: Movement, Attendance, Commit Allocation & Vacancy](#track-3-movement-attendance-commit-allocation--vacancy)
   - [Track 4: Case Management](#track-4-case-management)
   - [Cross-cutting: Data Dashboard](#cross-cutting-data-dashboard)
8. [System Integrations](#8-system-integrations)
9. [Technical Platform](#9-technical-platform)
10. [Key Dependencies](#10-key-dependencies)
11. [Assumptions & Constraints](#11-assumptions--constraints)
12. [Roadmap & Timeline](#12-roadmap--timeline)
13. [Team & Ownership](#13-team--ownership)
14. [Open Questions](#14-open-questions)

---

## 1. Executive Summary

MK Portal is a one-stop system for MOE Kindergarten staff, built on Salesforce Edu Cloud. It consolidates fragmented administrative workflows — currently spread across multiple systems, Excel spreadsheets, and hardcopy forms — into a single, cohesive platform.

The system serves approximately **1,400 MK staff** and **44 PEB staff**, and is designed to reduce educator administrative burden, automate and streamline data flows between government systems, and provide data-informed insights to support children's learning outcomes.

The product is delivered across multiple feature tracks — Child Progress (MKPI), Child and Caregiver Details (CDF/SDF/Medical), Movement, Attendance, and Case Management — rolling out in phases from 2026 to 2028.

---

## 2. Background & Context

Today, the main system that MK staff interact with to manage school operations is School Cockpit (SC). However, SC presents a few problems ranging from legacy infrastructure, inflexibie iterations, cost heavy, and inefficient UX. Additionally, some school processes are not incorporated within SC and still rely on manual excel spreadshoot workflows, such as MKPI.

MK was initiated to address this at a system level: replacing fragmented tools with a unified, integrated platform that supports teachers, centre heads, and PEB HQ staff.

---

## 3. Problem Statement

### 3.1 Fragmented Workflows
MK staff currently juggle multiple mediums — systems, Excel spreadsheets, and personal devices — for data logging. This causes confusion, duplicated effort, and significant time loss. Information does not flow cleanly between systems, leading to re-entry and broken handoffs.

### 3.2 Manual Processes
Key processes such as MKPI reporting and case management remain Excel-based. Data interchange between systems (e.g., uploading CDF data to SC) requires manual file uploads, creating bottlenecks and vulnerability to human error.

> *"Current MS Excel-based MKPI reporting system remains highly manual, onerous and time-intensive."*

> *"MKCDF approach is not sustainable due to enormous time/effort to collect data and vulnerability to data errors."*

### 3.3 Unsustainable Administrative Burden
Teachers spend disproportionate time on administrative tasks — logging observations, re-entering unchanged records, chasing approvals — at the cost of teaching quality and staff wellbeing. This is misaligned with the Ministry's focus on supporting teacher wellbeing through technology.

---

## 4. Vision

> **"How might we design and integrate a cohesive, data-informed, user-centred system for MK that reduces educator's administrative burden, streamlines workflows, and enhances learning outcomes for all children?"**

---

## 5. Goals & Success Metrics

### Goals
- Reduce time spent on data logging and insight extraction

### Phase 1 Success Metrics *(to be quantified post-discovery)*

| Metric | Baseline | Target |
|--------|----------|--------|
| Time to complete MKPI cycle per term | TBD | Reduced (% TBD) |
| Back-and-forth between teachers and centre heads | TBD | Reduced (% TBD) |
| User satisfaction score (teachers & centre heads) | TBD | TBD |
| Data accuracy / error rate in MKPI submissions | TBD | Reduced (% TBD) |
| Time spent on manual data uploads between systems | TBD | Eliminated or reduced |

---

## 6. Target Users & Roles

**Total users:** ~1,400 MK staff + 44 PEB staff

| Role | Description | Key Responsibilities |
|------|-------------|---------------------|
| MK Educator | Classroom teachers (EL & MT) | Log child progress indicators; write remarks |
| Key Appointment Holder (KAH) | Senior educators with dual role | Log and/or review submissions |
| Level Head / Centre Head | Centre leadership | Review, approve, generate centre-level reports |
| MK Administrator | Admin staff | Manage indicators, dates, class allocations |
| PEB Staff (HQ) | Preschool Education Branch | Set indicators; cross-MK oversight and analysis |

---

## 7. Product Scope & Features

---

### Track 1: MKPI

**Purpose:** Digitise and streamline the MK Performance Indicators process, replacing the current Excel-based bi-annual reporting workflow.

#### 1.1 Authorisation & Access
- Login via EduPass
- Role-based access control:
  - Teachers: access to own class(es) only
  - KAHs / Centre Heads: access to all classes; can assign roles
  - MKPI Administrators / MK Coordinators: manage indicators and dates
  - PEB HQ: read-only cross-MK access for oversight
- User provisioning with linking to MK, role, and class assignments
- Account creation and deactivation workflows
- Session management, security policies, and audit logging

#### 1.2 Child Records
Child Records is the foundational data object in Track 1 — all MKPI performance records are linked to a child record. Records are seeded from SDT via a one-time portover from SC and kept in sync going forward.

**Core child profile fields:**
- Full name (English) and mother tongue name
- NRIC / FIN
- Date of birth
- Gender
- Nationality / citizenship
- Race / ethnicity
- Class and level assignment (K1 / K2)
- Active enrolment status

**Caregiver information:**
- Primary caregiver name and relationship to child
- Contact number and email address

**Access:**
- View-only for teachers (scoped to their assigned class)
- Editable by MK Administrators and Centre Heads only

#### 1.3 Class Module
- Class list view: all students assigned to the teacher's class(es)
- Quick access to each child's record and MKPI performance history from within the class view

#### 1.4 Performance Records Management
- Log child performance records directly or via template, based on standardised MKPI indicators by domain and sub-domain
- Multilingual remarks/observations field: English, Chinese, Malay, Tamil
- Draft and save functionality for progressive logging
- Submission workflow: Teacher submits → KAH/Level Head reviews → Centre Head approves
- Commenting and annotation during review to flag issues or return submissions
- Amendment handling: post-deadline edits with justification captured
- Generate multilingual MKPI reports by student, class, and level
- Teachers do not need to re-enter unchanged records from previous cycle

#### 1.5 Data Flows
| Source | Destination | Description |
|--------|-------------|-------------|
| EduPass | Salesforce | Staff authentication and role mapping |
| SDT | Salesforce | Student, class, level info; staff authorisation details (one-time portover) |
| Salesforce | SC | Numeracy and Literacy Indicators |
| Salesforce | Parent Gateway (PG) | Child's MKPI performance report (one-way, recurring sync) |

#### 1.6 Data Migration
- Migrate existing MKPI data from Excel spreadsheets into Salesforce

---

### Track 2: CDF, Child Details & Medical

**Purpose:** Centralise child profile management, replacing fragmented forms and manual CDF uploads to SC.

#### 2.1 Child Details
- Manage personal information for each child: name, DOB, gender, NRIC/FIN, nationality
- Linked parent and guardian information
- View and edit child profile records

#### 2.2 Child Detail Form (CDF)
- Capture secondary child information (beyond core demographics)
- Medical records and health conditions
- Family background and welfare notes
- Replace current manual CDF upload process to SC

#### 2.3 KCare Management
- Manage children registered in Kindergarten Care (KCare)
- Track KCare enrolment status and details

#### 2.4 Data Flows
| Source | Destination | Description |
|--------|-------------|-------------|
| FormSG | Salesforce | Registration, waitlist, student details forms |
| Salesforce | SC (SDT) | Children details sync |
| Salesforce | iSFS (SFS) | Billing integration |

---

### Track 3: Movement, Attendance, Commit Allocation & Vacancy

**Purpose:** Digitise the full learning journey from registration to graduation, replacing manual tracking across systems.

#### 3.1 Registration & Admission
- Manage registrations and waitlists
- Class allocation and placement
- Manage commit allocation and vacancy information across centres

#### 3.2 Attendance Tracking
- Daily attendance logging for MK students
- KCare attendance tracking
- Attendance reporting and patterns

#### 3.3 Movement of Children
- Transfer In / Transfer Out between centres
- Withdrawal management
- Learning progression: K1 → K2 transition; K2 Graduation

#### 3.4 Data Flows
| Source | Destination | Description |
|--------|-------------|-------------|
| FormSG | Salesforce | Registration and waitlist forms |
| Salesforce | SH (Student History) | Children details and movement records |
| Salesforce | EduHub | HQ data visualisation and reporting |
| Salesforce | ECDA | Early childhood data sharing |

---

### Track 4: Case Management

**Purpose:** Provide a standardised digital workflow for logging and managing child case records, replacing manual processes.

#### 4.1 Case Records
- Log case records based on standardised indicators
- Capture interventions, observations, and follow-up notes
- Link case records to child profiles

#### 4.2 Case Reports
- Generate individual child case reports
- Centre-level case summary views for Centre Heads
- PEB HQ oversight and cross-MK case trends

---

### Cross-cutting: Data Dashboard

**Purpose:** Transform MK from a data entry system into a decision-support platform across all tracks.

**Owner:** Zhen Yi, Boon Chee (across all tracks)

#### Teacher-level views
- Class-level summary of children's progress across domains (at a glance)
- Identification of children needing additional support based on indicator patterns
- Longitudinal view per child showing progress trends across terms and years

#### Centre Head / Level Head views
- Centre-level dashboard with submission completion rates, progress distribution, and outliers
- Trend analysis across cohorts and terms
- Cross-class comparison within centre for planning and resource allocation

#### PEB / HQ views
- Cross-MK consolidated dashboard comparing performance and trends across centres
- Benchmarking: how individual MKs compare against each other or PEB-set indicators
- Export functionality for structured downloads, replacing manual data consolidation

---

## 8. Potential System Integrations

| System | Direction | Description |
|--------|-----------|-------------|
| EduPass | → Salesforce | Staff authentication and role mapping |
| SC | ↔ Salesforce | Student/class info in; Numeracy & Literacy Indicators out |
| FormSG | → Salesforce | Registration, waitlist, and student detail forms |
| PG (Parent Gateway) | ← Salesforce | Children's MKPI and learning journey reports |
| iSFS / SFS (Billing) | ← Salesforce | Billing data |
| EduHub | ← Salesforce | HQ data visualisation |
| ECDA | ← Salesforce | Early childhood data sharing |

---

## 9. Technical Platform

**Platform:** Salesforce Edu Cloud

- Custom fields configured for MK-specific data requirements
- Role-based access control via Salesforce profiles and permission sets
- Multilingual support (English, Chinese, Malay, Tamil)
- 2-week agile development cycles
- Integration layer connecting Salesforce to MOE government systems

---

## 10. Assumptions & Constraints

### Assumptions
- Salesforce Edu Cloud is the confirmed implementation platform
- EduPass SSO integration will be evaluated; Email OTP is the fallback
- Existing SDT data quality is sufficient for the one-time portover

### Constraints
- Integrations with legacy systems (SC, SH, iSFS) may have technical limitations and require coordination with system owners
- Pilot rollouts are limited to selected MKs before full rollout

---

## 11. Roadmap & Timeline

Each track follows the same delivery lifecycle: **Product Discovery → Interview Analysis → Solution Refinement → Development (2-week cycles) → Data Migration → End-to-End Testing → Deployment Preparation → Training → Pilot Rollout → Full Rollout → Support**

| Track | Discovery | Development | Pilot Rollout | Full Rollout | Support |
|-------|-----------|-------------|---------------|--------------|---------|
| **MKPI** | Q1–Q2 2026 | Q2–Q3 2026 | Q3–Q4 2026 | Q4 2026 | Q1 2027 |
| **CDF, Child Details & Medical** | Q2–Q3 2026 | Q3–Q4 2026 | Q1–Q2 2027 | Q2–Q3 2027 | Q3 2027 |
| **Movement, Attendance, Commit Allocation & Vacancy** | Q3–Q4 2026 | Q4 2026–Q1 2027 | Q2–Q3 2027 | Q4 2027 | Q4 2027+ |
| **Case Management** | Q1 2026 (alongside MKPI) | Q4 2027 | Q1–Q2 2028 | Q3–Q4 2028 | Q4 2028 |

### Key Milestones

| Milestone | Target Date |
|-----------|-------------|
| Funding secured & team onboarded | Q1 2026 |
| MKPI product discovery complete | Q2 2026 |
| MKPI pilot rollout begins | Q3 2026 |
| MKPI full rollout | Q4 2026 |
| CDF/Child Details pilot rollout | Q1 2027 |
| Movement/Attendance full rollout | Q4 2027 |
| Case Management full rollout | Q3–Q4 2028 |

---

## 12. PEB Stakeholders & Ownership

| Track | Product / Feature Owner(s) | Data Dashboard |
|-------|---------------------------|----------------|
| MKPI | Juliet, Janeth, Zhen Yi, Ruth, Ken | Zhen Yi, Boon Chee |
| CDF, Child Details & Medical | Ruth, Zhen Yi, Mei Xia | Zhen Yi, Boon Chee |
| Movement, Attendance, Commit Allocation & Vacancy | Mei Xia, Ken, Zhen Yi | Zhen Yi, Boon Chee |
| Case Management | Ruth, Wendy | Zhen Yi, Boon Chee |

---

*This document will be updated as product discovery progresses and decisions are made. Refer to the changelog for a history of significant changes.*
