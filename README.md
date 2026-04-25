# SponsorLens
**Apply smarter as an international student.**

SponsorLens is a local-first Chrome Extension MVP for the OpenAI Codex Creator Challenge. It helps international students analyze visible job posting language for work-authorization friction, contradictions, and application risk.

## Problem
International students (especially F-1 students navigating CPT/OPT/STEM OPT pathways) often face unclear or contradictory sponsorship language. Job board fields can be incomplete, ambiguous, or conflict with the description itself.

## Solution
SponsorLens adds a decision-support layer:
1. Extract visible job text.
2. Detect work-authorization signals.
3. Flag contradictions.
4. Apply student-profile-aware scoring.
5. Return **Strong Fit / Risky Fit / Low Fit** with reasons and next steps.

> SponsorLens does not replace Handshake. It interprets visible posting language and adds profile-aware guidance.

## Why useful even with Handshake fields
- Employer fields are self-reported.
- Fields can be ambiguous.
- Job descriptions may contradict checkboxes.
- Students need profile-aware interpretation, not just raw values.
- Students need next-step messaging for recruiter clarification.
- SponsorLens works across Handshake and other job pages.

## Features
- Manifest V3 Chrome extension MVP
- Local phrase scanner and contradiction detector
- Student profile matching via `chrome.storage.local`
- Strong/Risky/Low fit score and explanation layer
- Recruiter-safe message generator
- Demo mode (Strong / Risky / Low)
- Privacy-first, local-only analysis

## Privacy and disclaimer
- No resumes collected
- No immigration documents collected
- No government IDs collected
- No external API calls in MVP
- Optional student profile stored locally only

SponsorLens is a non-commercial educational prototype. It does not provide legal, immigration, or employment advice and does not guarantee sponsorship, eligibility, or hiring outcomes.

## Documentation
- [PRD](docs/PRD.md)
- [Kano Model](docs/KANO.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Scoring Model](docs/SCORING_MODEL.md)
- [Privacy & Compliance](docs/PRIVACY_AND_COMPLIANCE.md)
- [Demo Script](docs/DEMO_SCRIPT.md)
- [Test Plan](docs/TEST_PLAN.md)
- [Roadmap](docs/ROADMAP.md)
- [Challenge Submission](docs/CHALLENGE_SUBMISSION.md)

## Run tests
```bash
npm test
```

## Load extension locally
1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click **Load unpacked**
4. Select the `extension/` folder
5. Open a job posting
6. Click the SponsorLens icon


> Note: This repository currently avoids binary image assets to keep PR tooling compatible (default Chrome extension icon is used).

## Built for
OpenAI Codex Creator Challenge.
