# SponsorLens
**Apply smarter as an international student.**

SponsorLens is a local-first Manifest V3 Chrome extension MVP for international students (F-1/CPT/OPT/STEM OPT). It analyzes visible posting language and returns **Strong Fit / Risky Fit / Low Fit** guidance.

## Advanced MVP Features
- Local analyzer with contradiction detection
- Evidence-based outputs (confidence + evidence level)
- Recruiter Message Studio (3 safe variants)
- Saved Job Tracker (local summaries only)
- Privacy-first defaults and test coverage

## Public Landing Page
- Landing source: [`landing/`](landing/)
- Suggested public URL placeholder: `https://YOUR-LANDING-URL`

## Demo video placeholder
- Demo link placeholder currently uses `#` in the landing page CTA.
- Replace it in `landing/index.html` when your video is ready.

## Local-first by default
- No backend required to run extension
- No OpenAI API key required
- No external runtime API calls from extension mode

## Optional API backend (future-ready)
An optional `backend/` skeleton exists for later explain-mode experiments.
It is **not connected by default** and **not required** for extension demos.

## Run all checks
```bash
npm test
```

## Load extension locally
1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click **Load unpacked**
4. Select the `extension/` folder
5. Open a job posting
6. Click SponsorLens icon

## How to deploy landing page for free
### GitHub Pages
1. Push repo to GitHub
2. Enable Pages in repository settings
3. Publish site and point to landing content

### Vercel
1. Import repository
2. Set output directory to `landing`
3. Deploy

## Security & Privacy
- [Security policy](SECURITY.md)
- [Threat model](docs/THREAT_MODEL.md)
- [Privacy & Compliance](docs/PRIVACY_AND_COMPLIANCE.md)

## Docs
- [Architecture](docs/ARCHITECTURE.md)
- [Challenge Submission](docs/CHALLENGE_SUBMISSION.md)
- [Demo Script](docs/DEMO_SCRIPT.md)
- [Landing Page Plan](docs/LANDING_PAGE_PLAN.md)
- [API Mode](docs/API_MODE.md)

> Note: binary icon assets are intentionally omitted for PR compatibility (Chrome default icon is used).
