# SponsorLens Product Requirements Document (PRD)

## Product Name
SponsorLens

## One-liner
SponsorLens helps international students stop applying blindly by turning confusing work-authorization language into a clear Apply / Risky / Skip decision.

## Target User
A U.S.-based university student, commonly on F-1 status, evaluating internship and full-time postings with CPT/OPT/STEM OPT considerations.

## Problem
Students lose time on applications when job postings contain hidden sponsorship restrictions, ambiguous wording, or contradictions.

## Why Current Job Boards Are Not Enough
- Employer fields are self-reported.
- Work-authorization fields can be incomplete.
- Job descriptions may contradict checkboxes.
- Students need profile-aware guidance, not raw fields.

> SponsorLens does not replace Handshake; it adds a decision-support interpretation layer.

## Solution
A local-first Chrome extension that:
1. Extracts visible job text.
2. Detects work-authorization signals.
3. Flags contradictions.
4. Applies profile-aware scoring.
5. Returns Strong Fit / Risky Fit / Low Fit with reasons and a recruiter-safe message.

## MVP Scope
- Manifest V3 extension popup UI
- Local text extraction
- Rule-based analyzer
- Student profile persistence (local only)
- Contradiction detection
- Demo mode
- Disclaimer and privacy-first posture

## Non-goals
- Visa outcome prediction
- Legal/immigration advice
- Auto-apply
- Resume/document ingestion
- Backend or external API in MVP

## User Stories
- As a student, I want a fast fit assessment before long applications.
- As a student, I want contradictions called out clearly.
- As a student, I want a safe recruiter clarification message.
- As a presenter, I want reliable demo flows even if extraction fails.

## Acceptance Criteria
- Extension loads via `chrome://extensions` unpacked mode.
- Analyze flow returns fit, score, reasons, phrases, contradictions, action, message, disclaimer.
- Profile persists in `chrome.storage.local`.
- Demo mode always works.
- No external API key required.
- No sensitive personal document collection.

## Success Metrics
- % of analyzed roles receiving actionable output.
- Time-saved estimate adoption in user feedback.
- Demo reliability rate in pitch sessions.
- Qualitative clarity ratings from students/career staff.

## Risks and Mitigations
- **Risk:** Extraction blocked on some sites.  
  **Mitigation:** Demo mode + fallback messaging.
- **Risk:** Overconfidence in deterministic scoring.  
  **Mitigation:** Strong disclaimer + contradiction warnings.
- **Risk:** Scope creep into legal advice.  
  **Mitigation:** Guardrail language across product/docs.
