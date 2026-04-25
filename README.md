# SponsorLens
**Apply smarter as an international student.**

SponsorLens is a local-first Manifest V3 Chrome extension MVP for the OpenAI Codex Creator Challenge. It helps international students interpret visible job-posting language and decide whether a role is **Strong Fit**, **Risky Fit**, or **Low Fit**.

## Advanced MVP Features
- Evidence-based analyzer with confidence + evidence level
- Contradiction detection and fit guardrails
- Recruiter Message Studio (short/polite/cover variants)
- Saved Job Tracker (local summaries only)
- Demo mode for reliable pitch walkthroughs

## Saved Job Tracker
Users can save analysis summaries locally and view:
- Strong/Risky/Low saved counts
- total estimated time saved
- last 5 saved analyses
- clear and export JSON actions

Saved records intentionally exclude full page text.

## Local-first by default
- No backend required
- No OpenAI API key required
- No external runtime API calls in extension mode

## Optional AI Backend (future-ready skeleton)
An optional `backend/` folder provides `POST /explain` with deterministic mock output.
- Not required for local extension demo
- Not connected by default
- API keys (future) must remain server-side only

See [docs/API_MODE.md](docs/API_MODE.md).

## Important credits note
Codex student challenge credits are for building with Codex, not runtime OpenAI API billing credits.

## Run all checks
```bash
npm test
```

## Load extension locally
1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click **Load unpacked**
4. Select the `extension/` folder
5. Open a job posting page
6. Click SponsorLens icon

## Security & Privacy
- [Security policy](SECURITY.md)
- [Threat model](docs/THREAT_MODEL.md)
- [Privacy & Compliance](docs/PRIVACY_AND_COMPLIANCE.md)

## Documentation
- [Architecture](docs/ARCHITECTURE.md)
- [Scoring Model](docs/SCORING_MODEL.md)
- [Demo Script](docs/DEMO_SCRIPT.md)
- [Roadmap](docs/ROADMAP.md)
- [Challenge Submission](docs/CHALLENGE_SUBMISSION.md)
- [API Mode Notes](docs/API_MODE.md)
- [QA Checklist](docs/QA_CHECKLIST.md)

## CI
GitHub Actions workflow runs:
- `npm test`
- manifest JSON validation

> Note: repository intentionally avoids binary icon assets for PR compatibility; Chrome default icon is used.

## Built for
OpenAI Codex Creator Challenge.
