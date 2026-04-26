# SponsorLens Manual QA Checklist

## Core loading and run
- [ ] Open `chrome://extensions`
- [ ] Enable Developer Mode
- [ ] Load unpacked `extension/`
- [ ] Open a job page
- [ ] Click SponsorLens and run **Analyze this job**

## Demo validation
- [ ] Demo: Strong Fit renders expected verdict and score
- [ ] Demo: Risky Fit renders expected verdict and score
- [ ] Demo: Low Fit renders expected verdict and score

## Functional checks
- [ ] Copy recruiter message works (or graceful fallback shown)
- [ ] Profile selections persist after reopening popup
- [ ] Restricted page shows: “Could not read this page. Try Demo Mode or open a full job posting page.”
- [ ] Extraction quality + char count + confidence/evidence lines are visible
- [ ] Disclaimer remains visible in result card

## Accessibility checks
- [ ] Tab/Shift+Tab reaches all controls
- [ ] Focus ring visible on buttons/selects/textarea
- [ ] Status updates are announced through live region
- [ ] Verdict text is explicit (not color-only)

## Security/privacy checks
- [ ] No external network calls from extension runtime code
- [ ] No raw page text persisted in storage
- [ ] No host permissions requested in manifest
