<p align="center">
  <strong>🔍 SponsorLens</strong><br>
  <em>AI-powered job-fit copilot for international students</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-Manifest_V3-4285F4?logo=googlechrome&logoColor=white" alt="Chrome Manifest V3" />
  <img src="https://img.shields.io/badge/Privacy-Local_First-16a34a" alt="Privacy: Local First" />
  <img src="https://img.shields.io/badge/Tests-15_passing-16a34a" alt="Tests: 15 passing" />
  <img src="https://img.shields.io/badge/API-Not_Required-6b7280" alt="No API required" />
</p>

---

## What It Does

SponsorLens analyzes visible job posting language to detect work-authorization friction, contradictions, and sponsorship signals — then returns a clear **Strong Fit / Risky Fit / Low Fit** verdict with actionable next steps.

International students (especially F-1 students navigating CPT, OPT, and STEM OPT pathways) routinely encounter postings with unclear, contradictory, or restrictive sponsorship language. SponsorLens interprets that language so students can invest their application time wisely.

## Key Features

| Feature | Description |
|---------|-------------|
| **Signal Analyzer** | Detects 25+ work-authorization phrases across positive, ambiguous, and restrictive categories using regex pattern matching |
| **Contradiction Detection** | Flags conflicting signals (e.g., "sponsorship available" alongside "no visa sponsorship") |
| **Profile-Aware Scoring** | Adjusts fit score based on student's visa status, work path (CPT/OPT/STEM OPT), and sponsorship needs |
| **Confidence & Evidence** | Reports confidence level (high/medium/low), evidence strength, and top matched signals for full transparency |
| **Recruiter Message Studio** | Three pre-written message variants — short clarification, polite recruiter message, and cover letter paragraph — ready to copy |
| **Saved Job Tracker** | Save analysis summaries locally, view Strong/Risky/Low counts, total time saved, and export as JSON |
| **Demo Mode** | Three built-in scenarios (Strong/Risky/Low) for testing and presentations without a live job page |

## How It Works

```
User opens a job posting
  → Clicks the SponsorLens extension icon
    → content.js extracts visible text + metadata from the page
      → analyzer.js scores signals locally (no network calls)
        → Popup displays verdict, evidence, action, and message studio
          → User can save the analysis or copy a recruiter message
```

## Architecture

```
extension/
├── manifest.json        # Manifest V3 — permissions: activeTab, scripting, storage
├── content.js           # Page text extractor with noise filtering
├── analyzer.js          # Signal matching, scoring, contradiction detection
├── storageHelpers.js    # Saved job sanitization and export
├── popup.html/css/js    # Extension popup UI
└── icons/               # Extension icons

tests/
├── analyzer.test.js     # 9 analyzer tests (scoring, confidence, evidence, export)
└── security.test.js     # 6 security tests (permissions, no fetch, no innerHTML, no keys)
```

## Getting Started

### Install as Chrome Extension

1. Clone this repository:
   ```bash
   git clone https://github.com/Fredess74/SponsorLens.git
   ```
2. Open `chrome://extensions` in Chrome
3. Enable **Developer Mode** (top-right toggle)
4. Click **Load unpacked**
5. Select the `extension/` folder
6. Navigate to any job posting and click the SponsorLens icon

### Run Tests

```bash
npm test
```

Runs both analyzer tests (9) and security tests (6) — **15 tests total**.

## Scoring Model

| Score Range | Verdict | Recommended Action |
|:----------:|:-------:|-------------------|
| **80–100** | 🟢 Strong Fit | Apply and tailor your application |
| **45–79** | 🟡 Risky Fit | Clarify with the recruiter before investing in a full application |
| **0–44** | 🔴 Low Fit | Skip unless independently confirmed by the recruiter |

Base score starts at 70 and adjusts based on detected signals, student profile, and contradiction analysis. Citizenship or security-clearance restrictions automatically cap the score toward Low Fit.

Full details: [Scoring Model →](docs/SCORING_MODEL.md)

## Privacy & Security

- **No external API calls** — all analysis runs locally in the browser
- **No resumes, immigration documents, or government IDs collected**
- **No full page text stored** — saved analyses contain only summary metadata
- **Minimal permissions** — `activeTab`, `scripting`, `storage` only
- **Content Security Policy** enforced: `script-src 'self'; object-src 'none'`
- **Automated security tests** verify no `fetch`, `XMLHttpRequest`, `innerHTML` injection, or API keys in source

Full details: [Privacy & Compliance →](docs/PRIVACY_AND_COMPLIANCE.md) · [Security Policy →](SECURITY.md)

## Documentation

| Document | Description |
|----------|-------------|
| [Product Requirements](docs/PRD.md) | Problem statement, user stories, acceptance criteria |
| [Architecture](docs/ARCHITECTURE.md) | Data flow, component responsibilities, security boundaries |
| [Scoring Model](docs/SCORING_MODEL.md) | Signal weights, confidence logic, guardrails |
| [Kano Model](docs/KANO.md) | Feature prioritization framework |
| [Privacy & Compliance](docs/PRIVACY_AND_COMPLIANCE.md) | Data boundaries and advice disclaimers |
| [Demo Script](docs/DEMO_SCRIPT.md) | 60-second and 3-minute presentation flows |
| [Roadmap](docs/ROADMAP.md) | MVP → Pro Prototype → Intelligence Layer → Ecosystem |
| [Test Plan](docs/TEST_PLAN.md) | Testing strategy and coverage |

## Disclaimer

SponsorLens is a non-commercial educational prototype. It does not provide legal, immigration, or employment advice and does not guarantee visa sponsorship, job eligibility, or hiring outcomes.
