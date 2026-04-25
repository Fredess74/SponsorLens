# SponsorLens Hardening Audit (This Pass)

## 1) Current architecture summary
- Manifest V3 popup extension with `activeTab`, `scripting`, `storage`.
- `popup.js` orchestrates profile loading, extraction requests, and result rendering.
- `content.js` extracts visible page text on demand.
- `analyzer.js` scores language signals and returns fit guidance.
- Tests run locally with Node built-ins.

## 2) Security/privacy review
### What was already good
- Local-first, no backend, no external API keys.
- Minimal permission set.
- Optional profile only in `chrome.storage.local`.

### Risks found before this pass
- Manifest did not explicitly define strict CSP.
- Content extraction returned only plain text (no quality metadata), making reliability hard to assess.
- Analyzer used simple `includes`, increasing false positives and overlap double-counting risk.
- Missing automated security checks for external calls and dangerous rendering patterns.

## 3) Bugs / reliability risks found
- Multiple site structures could cause weak extraction without clear user feedback.
- Analyze flow did not consume extraction quality metadata.
- Analyzer availability failures were not explicitly guarded.

## 4) UX risks found
- Limited extraction quality was not clearly surfaced.
- No confidence/evidence hint in result state.
- Error language could be more direct for restricted pages.

## 5) Analyzer/scoring risks found
- Overlapping signal counting (`visa sponsorship available` vs `sponsorship available`).
- Missing important phrase variants (citizenship wording, unable-to-sponsor wording).
- Contradiction and fit-cap logic needed stronger guardrails for citizenship/clearance restrictions.

## 6) Accessibility risks found
- Form labels were implicit-only.
- Focus styling was weak.
- Status updates needed an explicit live region.

## 7) What was fixed in this pass
- Added strict CSP in `manifest.json`.
- Hardened extraction with noise filtering, job-like container preference, metadata (`source`, `charCount`, `extractionQuality`).
- Added analyzer availability check and clearer extraction failure message.
- Added extraction quality + confidence + evidence lines in result UI.
- Added stronger focus-visible styles and explicit label associations.
- Reworked analyzer to regex-based variant matching with overlap de-dup and severity-based summaries.
- Added contradiction and fit-cap hardening for citizen/clearance restrictions.
- Expanded analyzer tests and added `tests/security.test.js`.
- Added CI workflow for test + manifest validation.

## 8) Intentionally out of scope
- Backend APIs and external intelligence sources.
- Legal advice or visa-outcome prediction.
- Account system, auto-apply, payments, data brokerage.
- Persistent storage of raw extracted page text.
