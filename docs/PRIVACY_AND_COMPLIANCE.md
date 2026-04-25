# Privacy & Compliance

## Design Principle

SponsorLens is built **local-first by default**. All job text analysis runs entirely within the browser extension — no data is transmitted externally.

## What SponsorLens Does NOT Collect

| Category | Status |
|----------|--------|
| Resumes | ❌ Never collected |
| Immigration documents | ❌ Never collected |
| Government IDs | ❌ Never collected |
| Personal identifiers | ❌ Not intentionally collected |
| Full page text | ❌ Not persisted to storage |
| Browsing history | ❌ Not tracked |

## What IS Stored Locally (Optional)

| Data | Storage | Purpose |
|------|---------|---------|
| Student profile preferences | `chrome.storage.local` | Profile-aware scoring (visa status, work path) |
| Saved analysis summaries | `chrome.storage.local` | Job tracker (title, company, URL, fit, score only) |

All locally stored data can be cleared by the user at any time.

## Extension Permissions

| Permission | Purpose |
|-----------|---------|
| `activeTab` | Read visible text of the currently active tab when user clicks Analyze |
| `scripting` | Inject the local text extraction script into the active page |
| `storage` | Persist optional student profile and saved analysis summaries |

No `host_permissions`, `tabs`, or network-related permissions are requested.

## Content Security Policy

```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; object-src 'none';"
}
```

## Advice Boundary

SponsorLens is a **decision-support tool** that interprets visible job posting language. It does not provide legal, immigration, or employment advice and does not guarantee visa sponsorship, job eligibility, or hiring outcomes.
