# SponsorLens Test Plan

## Automated Analyzer Tests
- Run `npm test`
- Covers:
  - Strong fit
  - Risky fit
  - Low fit
  - Contradictions
  - Student profile adjustments
  - Future sponsorship penalty
  - Empty/weak extraction behavior
  - Case-insensitive phrase detection

## Manual Test Checklist
- Load extension unpacked in Chrome.
- Verify popup opens with no console errors.
- Change profile fields and reopen popup to confirm persistence.
- Run "Analyze this job" on a job posting page.
- Verify result sections render and copy button works.
- Validate disclaimer text visibility.

## Chrome Local Loading Steps
1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click Load unpacked
4. Select `extension/`
5. Open job page and click extension icon

## Demo Mode Test
- Run all three demo buttons.
- Confirm each renders expected fit color/status.

## Edge Cases
- Empty page text
- Minimal extracted text
- Mixed capitalization phrases
- Contradictory sponsorship phrases

## Known Limitations
- Some sites may block or limit content extraction.
- Rule-based scoring may miss nuanced employer policy.
- Output is guidance only, not legal determination.
