# SponsorLens Scoring Model

## Baseline
- Start score: **70**

## Hard Negative Signals (large penalties)
Examples:
- U.S. citizens only
- Security clearance required
- No visa sponsorship
- Must be permanently authorized

These can quickly move a role into Low Fit territory.

## Ambiguous Signals (moderate penalties)
Examples:
- Authorized to work in the U.S.
- Work authorization required
- Future sponsorship language

These often indicate risk and need recruiter clarification.

## Positive Signals (boosts)
Examples:
- OPT candidates welcome
- CPT eligible
- International students encouraged
- Visa sponsorship available
- STEM OPT / E-Verify

## Student Profile Adjustments
- STEM OPT eligible + STEM OPT/E-Verify language: boost
- CPT seeking + internship/CPT language: boost
- Needs future sponsorship = Yes + no-sponsorship language: additional penalty
- Needs future sponsorship = Unsure + ambiguous language: small penalty
- Looking for Internship + internship mention: boost
- Looking for Full-time + full-time/entry-level language: boost

## Contradiction Rules
Flag when positive and restrictive sponsorship signals coexist (e.g., “visa sponsorship available” + “no visa sponsorship”).

When contradictions exist:
- Add contradiction reasons.
- Cap confidence (Strong can be reduced to Risky unless signals are overwhelmingly positive).

## Fit Thresholds
- **80–100:** Strong Fit
- **45–79:** Risky Fit
- **0–44:** Low Fit

## Limitations
- Uses visible text only (site structure may vary).
- Rule-based approach cannot infer hidden policy or recruiter intent.
- Does not determine legal eligibility.

## Decision-support framing
This is **not** a visa predictor. SponsorLens is a decision-support tool that helps students prioritize time and ask better clarification questions.
