# Scoring Model

## Overview

SponsorLens uses a deterministic, rule-based scoring engine to evaluate job postings against work-authorization signals. The model is intentionally transparent — every signal, weight, and guardrail is documented here.

## Base Score

All analyses start at a base score of **70/100**, then adjust based on detected signals.

## Signal Categories

### Positive Signals (+10 to +30)

| Signal | Weight | Example Phrases |
|--------|--------|----------------|
| Visa sponsorship available | +30 | "visa sponsorship available" |
| OPT candidates welcome | +30 | "OPT candidates welcome" |
| CPT eligible / welcome | +25 | "CPT eligible", "CPT candidates welcome" |
| International students encouraged | +25 | "international students encouraged" |
| Sponsorship available | +25 | "sponsorship available" |
| STEM OPT | +20 | "STEM OPT" |
| E-Verify | +15 | "E-Verify employer" |
| Internship / Entry level / New grad | +10 | "internship", "entry level", "new grad" |

### Restrictive Signals (−35 to −60)

| Signal | Weight | Example Phrases |
|--------|--------|----------------|
| U.S. citizens only / required | −60 | "U.S. citizens only", "must be a U.S. citizen" |
| Security clearance required | −50 | "security clearance required", "active security clearance" |
| Green card or citizen | −50 | "green card or U.S. citizen", "citizen or permanent resident" |
| No sponsorship / future | −40 to −45 | "no visa sponsorship", "will not sponsor now or in the future" |
| Permanent authorization | −35 | "must be permanently authorized to work" |

### Ambiguous Signals (−10 to −20)

| Signal | Weight | Example Phrases |
|--------|--------|----------------|
| Must be authorized to work | −10 | "must be authorized to work in the U.S." |
| Work authorization required | −10 | "work authorization required" |
| Future sponsorship | −15 | "future sponsorship", "may require sponsorship" |
| Without restriction | −20 | "authorized to work without restriction" |

## Profile Adjustments

| Condition | Adjustment |
|-----------|-----------|
| STEM OPT eligible + posting mentions E-Verify/STEM OPT | +15 |
| CPT seeking + posting mentions internship/CPT | +15 |
| Looking for Internship + posting mentions internship | +10 |
| Looking for Full-time + posting mentions full-time/entry level | +5 |
| Needs future sponsorship + restrictive language detected | −20 |
| Sponsorship needs unsure + ambiguous language detected | −5 |

## Guardrails

- **Citizenship/clearance cap**: If citizenship or security-clearance restrictions are detected, the score is capped at 44 (Low Fit)
- **Contradiction downgrade**: If contradictions are found and the score would be Strong Fit, the verdict is downgraded to Risky Fit
- **Score clamping**: Final score is always bounded between 0 and 100

## Output Fields

| Field | Description |
|-------|-------------|
| `fit` | `strong`, `risky`, or `low` |
| `label` | Human-readable verdict |
| `score` | 0–100 numeric score |
| `confidence` | `high`, `medium`, or `low` based on text length, contradictions, extraction quality |
| `evidence_level` | `strong`, `mixed`, or `limited` |
| `detected_phrases` | All matched signal labels |
| `contradictions` | List of conflicting signal descriptions |
| `reasons` | Contextual explanations |
| `signal_summary` | Counts of hard-negative, ambiguous, positive signals and contradictions |
| `top_evidence` | Top 5 matched signals with severity labels |
| `recommended_action` | Apply / Clarify / Skip guidance |
| `recruiter_message_variants` | Short, polite, and cover letter message options |
