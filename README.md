<p align="center">
  <img src="extension/icons/icon128.png" alt="SponsorLens icon" width="80" />
</p>

<h1 align="center">SponsorLens</h1>
<p align="center">
  <strong>AI-powered Chrome extension that reads job postings for work-authorization signals,<br/>helping international students decide whether to apply, clarify, or skip.</strong>
</p>

<p align="center">
  <a href="https://fredess74.github.io/SponsorLens/landing/"><img src="https://img.shields.io/badge/Landing_Page-Live-059669?style=for-the-badge&logo=github" alt="Landing Page" /></a>
  <a href="https://fredess74.github.io/SponsorLens/landing/product-demo.html"><img src="https://img.shields.io/badge/Product_Demo-Interactive-3b82f6?style=for-the-badge&logo=googlechrome" alt="Product Demo" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-Manifest_V3-4285F4?logo=googlechrome&logoColor=white" alt="Chrome Manifest V3" />
  <img src="https://img.shields.io/badge/Privacy-Local_First-16a34a" alt="Privacy: Local First" />
  <img src="https://img.shields.io/badge/Tests-15_passing-16a34a" alt="Tests: 15 passing" />
  <img src="https://img.shields.io/badge/API-Not_Required-6b7280" alt="No API required" />
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="MIT License" />
</p>

<p align="center">
  <em>Built for the OpenAI × Handshake Codex Creator Challenge</em>
</p>

---

## The Problem

International students on F-1 visas spend **30–60 minutes per job application** — only to discover buried language like *"U.S. citizens only"* or *"no visa sponsorship"* after submitting. Job boards show what employers *selected* in a dropdown; they don't show what the posting *actually says*.

SponsorLens fixes this with a one-click analysis that reads the full job description and returns a clear verdict:

> **Apply** · **Clarify** · **Skip**

## How It Works

```
Open any job posting → Click SponsorLens → Get your verdict in seconds
```

| Step | What Happens |
|------|-------------|
| **1. Extract** | `content.js` pulls visible text + structured metadata from the page |
| **2. Analyze** | `analyzer.js` matches 25+ authorization signal patterns locally |
| **3. Score** | Profile-aware scoring adjusts for CPT, OPT, STEM OPT, or full-time |
| **4. Decide** | Popup displays verdict, evidence, contradictions, and recommended action |

**No data leaves your browser. Ever.**

## Key Features

| Feature | Description |
|---------|-------------|
| **Signal Analyzer** | 25+ work-authorization patterns across positive, ambiguous, and restrictive categories |
| **Contradiction Detection** | Catches conflicts (e.g., "sponsorship available" alongside "no visa sponsorship") |
| **Profile-Aware Scoring** | Adjusts fit based on visa status, work path, and sponsorship needs |
| **Confidence & Evidence** | Reports confidence level, evidence strength, and top matched signals |
| **Recruiter Message Studio** | Three message variants ready to copy — clarification, recruiter message, cover letter |
| **Saved Job Tracker** | Save analyses locally, view verdict counts, export as JSON |
| **Demo Mode** | Three built-in scenarios for testing without a live job page |

## Scoring Model

| Score | Verdict | Action |
|:-----:|:-------:|--------|
| **80–100** | **Strong Fit** | Apply and tailor your application |
| **45–79** | **Risky Fit** | Ask the recruiter to clarify before investing time |
| **0–44** | **Low Fit** | Skip — estimated 40 minutes saved |

Base score starts at 70 and adjusts based on detected signals, student profile, and contradiction analysis. Citizenship or clearance restrictions automatically push toward Low Fit. Full details: [Scoring Model →](docs/SCORING_MODEL.md)

## Quick Start

### Install the Extension

```bash
git clone https://github.com/Fredess74/SponsorLens.git
```

1. Open `chrome://extensions` in Chrome
2. Enable **Developer Mode** (top-right toggle)
3. Click **Load unpacked** → select the `extension/` folder
4. Navigate to any job posting and click the SponsorLens icon

### Run Tests

```bash
npm test
```

15 tests total — 9 analyzer tests + 6 security tests.

## Architecture

```
SponsorLens/
├── extension/                # Chrome Extension (Manifest V3)
│   ├── manifest.json         # Permissions: activeTab, scripting, storage
│   ├── content.js            # Page text extraction with noise filtering
│   ├── analyzer.js           # Signal matching, scoring, contradiction engine
│   ├── storageHelpers.js     # Saved job sanitization and JSON export
│   ├── popup.html/css/js     # Extension popup UI
│   └── icons/                # Extension icons (16/32/48/128)
│
├── landing/                  # GitHub Pages site
│   ├── index.html            # Landing page
│   ├── product-demo.html     # Interactive product demonstration
│   ├── styles.css            # Design system
│   └── script.js             # Scroll animations
│
├── tests/                    # Automated tests
│   ├── analyzer.test.js      # Scoring, confidence, evidence tests
│   └── security.test.js      # Permission, injection, key leak tests
│
├── docs/                     # Technical documentation
│   ├── PRD.md                # Product Requirements Document
│   ├── ARCHITECTURE.md       # Data flow and component boundaries
│   ├── SCORING_MODEL.md      # Signal weights and guardrails
│   ├── PRIVACY_AND_COMPLIANCE.md
│   └── ...                   # Kano, Roadmap, Demo Script, etc.
│
└── SECURITY.md               # Security policy
```

## Privacy & Security

| Guarantee | How |
|-----------|-----|
| **No external API calls** | All analysis runs locally in the browser |
| **No PII collection** | No resumes, immigration docs, or government IDs |
| **No stored page text** | Saved analyses contain only summary metadata |
| **Minimal permissions** | `activeTab`, `scripting`, `storage` only |
| **CSP enforced** | `script-src 'self'; object-src 'none'` |
| **Automated security tests** | Verify no `fetch`, `XMLHttpRequest`, `innerHTML`, or API keys in source |

Full details: [Privacy & Compliance →](docs/PRIVACY_AND_COMPLIANCE.md) · [Security Policy →](SECURITY.md)

## Documentation

| Document | Description |
|----------|-------------|
| [Product Requirements](docs/PRD.md) | Problem statement, user stories, acceptance criteria |
| [Architecture](docs/ARCHITECTURE.md) | Data flow, component responsibilities, security boundaries |
| [Scoring Model](docs/SCORING_MODEL.md) | Signal weights, confidence logic, guardrails |
| [Kano Model](docs/KANO.md) | Feature prioritization framework |
| [Privacy & Compliance](docs/PRIVACY_AND_COMPLIANCE.md) | Data handling and advice disclaimers |
| [Demo Script](docs/DEMO_SCRIPT.md) | 60-second and 3-minute presentation flows |
| [Roadmap](docs/ROADMAP.md) | MVP → Pro Prototype → Intelligence Layer → Ecosystem |
| [Test Plan](docs/TEST_PLAN.md) | Testing strategy and coverage |

## Links

| Resource | URL |
|----------|-----|
| **Landing Page** | [fredess74.github.io/SponsorLens/landing](https://fredess74.github.io/SponsorLens/landing/) |
| **Interactive Demo** | [Product Demo](https://fredess74.github.io/SponsorLens/landing/product-demo.html) |
| **GitHub Repository** | [github.com/Fredess74/SponsorLens](https://github.com/Fredess74/SponsorLens) |

---

<p align="center">
  <strong>SponsorLens</strong> is an educational prototype. It does not provide legal, immigration, or employment advice.<br/>
  Built with care for international students navigating the U.S. job market.
</p>
