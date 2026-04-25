# SponsorLens Scoring Model (Advanced MVP)

## Base scoring
- Start at 70
- Apply weighted hard-negative, ambiguous, and positive signals
- Clamp score between 0 and 100

## Advanced outputs
- `confidence`: high/medium/low
- `evidence_level`: strong/mixed/limited
- `signal_summary` counts by signal severity and contradiction count
- `top_evidence` list for user transparency

## Confidence logic
- Low when extraction/text is limited or contradictions exist
- High when evidence is strong and internally consistent
- Medium otherwise

## Evidence level
- Strong: clear directional signals without conflict
- Mixed: positive and restrictive conflict
- Limited: too little text or too few reliable signals

## Guardrails
- Citizenship/security-clearance restrictions cap fit toward Low
- Contradictions usually prevent Strong Fit
- Tool remains decision-support only, not visa prediction
