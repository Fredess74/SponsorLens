# Architecture

## System Overview

SponsorLens is a Manifest V3 Chrome extension with a privacy-first, local-only architecture. No data leaves the browser during analysis.

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│  Chrome Browser                                         │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────┐  │
│  │  Job Posting  │───▶│  content.js  │───▶│ popup.js  │  │
│  │  (any site)   │    │  extractor   │    │  UI layer │  │
│  └──────────────┘    └──────────────┘    └─────┬─────┘  │
│                                                │        │
│                                          ┌─────▼─────┐  │
│                                          │ analyzer.js│  │
│                                          │  scoring   │  │
│                                          └─────┬─────┘  │
│                                                │        │
│                                          ┌─────▼─────┐  │
│                                          │  chrome.   │  │
│                                          │  storage.  │  │
│                                          │  local     │  │
│                                          └───────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Role |
|-----------|------|
| `content.js` | Injected into the active tab. Extracts visible text, strips noise (nav, footer, scripts), returns structured metadata: title, company, URL, extraction quality |
| `analyzer.js` | Scores extracted text against 25+ signal patterns. Detects contradictions. Returns fit verdict, confidence, evidence level, and recruiter message variants |
| `storageHelpers.js` | Sanitizes saved job records (strips full page text), provides summary counts and JSON export |
| `popup.html/css/js` | Renders student profile form, analysis results, message studio, and saved job tracker |
| `manifest.json` | Declares minimal permissions (`activeTab`, `scripting`, `storage`) and enforces CSP |

## Security Boundaries

- **No external network calls** from the extension at runtime
- **No `host_permissions`** — only reads the currently active tab when the user clicks Analyze
- **No `innerHTML` injection** — all DOM updates use `textContent` and `createElement`
- **CSP enforced**: `script-src 'self'; object-src 'none'`
- **No API keys** stored anywhere in extension code

## Local Storage Schema

```
chrome.storage.local
├── sponsorlens_student_profile    # Optional student preferences
└── sponsorlens_saved_jobs         # Array of sanitized analysis summaries (max 200)
                                   # Never contains full page text
```
