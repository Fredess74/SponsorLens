# SponsorLens Threat Model (MVP)

## Assets Protected
- Optional student profile stored in extension local storage
- Visible job page text processed during analysis
- Recruiter-safe generated message

## Threats
1. **Accidental sensitive collection**
   - Risk: extension unintentionally captures personal identifiers or unrelated page data.
2. **Malicious or noisy job page content**
   - Risk: hostile/irrelevant DOM content lowers analysis quality.
3. **Extension over-permissioning**
   - Risk: unnecessary permissions increase abuse surface.
4. **Misleading legal interpretation**
   - Risk: users over-trust score as legal/immigration certainty.
5. **Future backend/API risk (out of scope in MVP)**
   - Risk: future network features can introduce data leakage if not designed carefully.

## Mitigations
- Local-only processing
- Minimal permissions (`activeTab`, `scripting`, `storage`)
- No persistent storage of raw extracted page text
- Safe rendering with `textContent`/`value`
- Explicit disclaimer language
- No auto-apply
- No external calls in MVP
- Extraction quality indicators to reduce overconfidence
- Contradiction detection and conservative fit caps for restrictive signals

## Residual Risk
Rule-based analysis may still produce false positives/negatives when postings are ambiguous or incomplete. SponsorLens remains a decision-support prototype, not a legal authority.
