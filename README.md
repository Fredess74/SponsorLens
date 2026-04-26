<h1 align="center">SponsorLens</h1>
<p align="center"><strong>Stop applying to jobs you can't legally start.</strong></p>

<p align="center">
  <a href="https://fredess74.github.io/SponsorLens/landing/"><img src="https://img.shields.io/badge/Landing_Page-Live-059669?style=for-the-badge" alt="Landing Page" /></a>&nbsp;
  <a href="https://fredess74.github.io/SponsorLens/landing/product-demo.html"><img src="https://img.shields.io/badge/Product_Demo-Watch-3b82f6?style=for-the-badge" alt="Product Demo" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-4285F4?logo=googlechrome&logoColor=white" />
  <img src="https://img.shields.io/badge/Privacy-Local_Only-16a34a" />
  <img src="https://img.shields.io/badge/Tests-15_passing-16a34a" />
  <img src="https://img.shields.io/badge/Network_Calls-Zero-6b7280" />
</p>

---

## Why This Exists

**1.58 million** international students were enrolled in U.S. institutions in 2024 ([ICE SEVIS](https://www.ice.gov/sevis)). Over **380,000** used OPT, CPT, or STEM OPT for work authorization. Every single one of them applies to jobs through the same portals — LinkedIn, Handshake, Indeed — and faces the same invisible problem:

> Job boards show what employers **selected in a dropdown**.
> They don't show what the posting **actually says**.

A filter might say "Will sponsor." Paragraph 8 says *"We are unable to provide immigration sponsorship at this time."* The student doesn't find this until **after** spending 30–60 minutes tailoring a resume, writing a cover letter, and submitting the application.

### The numbers behind the problem

| Metric | Value | Source |
|--------|-------|--------|
| F-1 students on OPT/CPT/STEM OPT | 381,140 | ICE SEVIS 2024 |
| Applications submitted vs. domestic peers | **2× more** | Interstride 2025 |
| Offer rate vs. domestic graduates | **30% lower** | Interstride 2025 |
| Employment rate (international vs. domestic) | 44.6% vs. 62.1% | Interstride 2025 |
| Time wasted per mismatched application | 30–60 min | Self-reported surveys |
| Career center usage (international students) | 85% | Interstride 2025 |

International students are **not less qualified**. They are systematically disadvantaged by ambiguous language, contradictory signals, and a system that doesn't surface authorization requirements until it's too late.

SponsorLens reads the actual posting text and gives a clear verdict: **Apply**, **Clarify**, or **Skip**.

---

## What It Does

```
Open any job posting → Click SponsorLens → Get your verdict in seconds
```

The extension extracts the full visible text from any job posting page, runs it through a local signal-matching engine (25+ authorization patterns), and returns:

- **Verdict** — Strong Fit / Risky Fit / Low Fit with a 0–100 score
- **Evidence** — Exact phrases detected, with positive/negative/ambiguous classification
- **Contradictions** — Flags when positive and negative signals coexist
- **Recommended action** — Apply, ask the recruiter, or skip entirely
- **Recruiter Message Studio** — Three message variants ready to copy
- **Time saved estimate** — How many minutes the student avoided wasting

Everything runs locally. No API calls. No data leaves the browser.

---

## Install

```bash
git clone https://github.com/Fredess74/SponsorLens.git
```

1. Open `chrome://extensions` → enable **Developer Mode**
2. Click **Load unpacked** → select the `extension/` folder
3. Navigate to any job posting → click the SponsorLens icon

To run tests: `npm test` (15 tests — 9 analyzer, 6 security).

---

## Scoring

| Score | Verdict | What to do |
|:-----:|:-------:|------------|
| 80–100 | **Strong Fit** | Apply. Tailor your application. |
| 45–79 | **Risky Fit** | Ask the recruiter before investing 40 minutes. |
| 0–44 | **Low Fit** | Skip. Move on. Time saved: ~40 min. |

The engine starts at a base score of 70, then adjusts based on detected signals (positive phrases increase it, restrictive phrases decrease it), the student's profile (CPT/OPT/STEM OPT), and contradiction analysis. Citizenship-only or security-clearance requirements automatically push toward Low Fit.

Full model details: [Scoring Model →](docs/SCORING_MODEL.md)

---

## Privacy Model

This is a tool for people who handle **immigration documents, government IDs, and visa timelines**. The privacy bar is not optional — it's the product.

| Principle | Implementation |
|-----------|---------------|
| Local-only analysis | All signal matching runs in the browser. Zero network calls. |
| No PII collection | No resumes, no immigration docs, no government IDs. |
| No stored page text | Saved analyses contain only summary metadata. |
| Minimal permissions | `activeTab`, `scripting`, `storage` — nothing else. |
| CSP enforced | `script-src 'self'; object-src 'none'` |
| Automated verification | Security tests check for `fetch`, `XMLHttpRequest`, `innerHTML`, API keys |

Full details: [Privacy & Compliance →](docs/PRIVACY_AND_COMPLIANCE.md) · [Security Policy →](SECURITY.md)

---

## Architecture

```
extension/
├── manifest.json         # Manifest V3 — activeTab, scripting, storage
├── content.js            # Page text extractor with noise filtering
├── analyzer.js           # Signal matching, scoring, contradiction engine
├── storageHelpers.js     # Saved job sanitization and JSON export
├── popup.html/css/js     # Extension popup UI
└── icons/                # Extension icons

landing/                  # GitHub Pages site
├── index.html            # Landing page with embedded demo
├── product-demo.html     # Interactive product demonstration
├── styles.css            # Design system
└── script.js             # Scroll animations

tests/
├── analyzer.test.js      # Scoring, confidence, evidence coverage
└── security.test.js      # Permission, injection, key leak checks

docs/                     # Technical documentation
├── PRD.md                # Product requirements
├── ARCHITECTURE.md       # Data flow and boundaries
├── SCORING_MODEL.md      # Signal weights and guardrails
├── PRIVACY_AND_COMPLIANCE.md
├── DEMO_SCRIPT.md        # Presentation guide
└── ROADMAP.md            # Product evolution plan
```

---

## What's Next

SponsorLens v1 solves the **individual analysis** problem. The roadmap addresses the **systemic** problem.

### Near-term (v2)
- **Browser-native NLP** — Move from regex to on-device language models (WebLLM / Chrome AI APIs) for context-aware signal detection
- **Batch analysis** — Analyze saved job lists and rank by fit, not just one posting at a time
- **Employer history lookup** — Cross-reference with USCIS Employer Data Hub (30,000+ employers with H-1B petition history)

### Mid-term (v3)
- **Community intelligence** — Anonymized, aggregated signal data from opted-in users to surface which employers actually follow through on sponsorship language
- **University career center integration** — Dashboard for career advisors to see aggregate student outcomes and flag problematic postings
- **Handshake / LinkedIn deep integration** — Overlay verdicts directly on job listing pages without opening the popup

### Long-term vision
- **Market analytics layer** — Which industries, roles, and regions show improving or declining sponsorship intent over time?
- **Policy impact tracking** — How do regulatory changes (H-1B lottery rules, STEM OPT extensions) shift employer language patterns?
- **Global expansion** — Adapt the signal engine for UK (Tier 2/Skilled Worker), Canada (PGWP), Australia (482/485) visa systems

The job market generates millions of postings per year. Every one of them contains language that signals something about work authorization. SponsorLens turns that language into structured, actionable data.

---

## Documentation

| Document | What it covers |
|----------|---------------|
| [Product Requirements](docs/PRD.md) | Problem statement, user stories, acceptance criteria |
| [Architecture](docs/ARCHITECTURE.md) | Data flow, component boundaries, security model |
| [Scoring Model](docs/SCORING_MODEL.md) | Signal taxonomy, weight system, guardrails |
| [Privacy & Compliance](docs/PRIVACY_AND_COMPLIANCE.md) | Data handling guarantees and legal disclaimers |
| [Demo Script](docs/DEMO_SCRIPT.md) | 60-second and 3-minute presentation flows |
| [Roadmap](docs/ROADMAP.md) | Product evolution: MVP → Intelligence Layer → Ecosystem |

---

<p align="center">
  <strong>SponsorLens</strong> is an educational prototype. It does not provide legal, immigration, or employment advice.<br/>
  Built for the international students who deserve a fair shot at the job market.
</p>
