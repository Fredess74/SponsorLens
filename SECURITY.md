# Security Policy

## Supported Version

Current `main` branch of SponsorLens.

## Reporting a Security Issue

If you find a security vulnerability, please open a private report through GitHub's security reporting feature, or contact the maintainers directly with:

- Steps to reproduce
- Impact assessment
- Affected file(s)
- Proposed mitigation (optional)

## Data Boundaries

SponsorLens:

| Data Type | Collected? |
|-----------|-----------|
| Resumes | ❌ No |
| Immigration documents | ❌ No |
| Government IDs | ❌ No |
| Raw page text | ❌ Not persisted |
| Browsing history | ❌ Not tracked |
| Student profile | ✅ Locally only (`chrome.storage.local`) |

## Network Activity

- **Zero external API calls** in default mode
- **No analytics, telemetry, or tracking endpoints**
- **No backend required** for core functionality

## Extension Permissions

| Permission | Purpose |
|-----------|---------|
| `activeTab` | Read visible text of the currently active tab during analysis |
| `scripting` | Inject the local text extractor script |
| `storage` | Persist optional profile and saved analyses |

No `host_permissions` or `tabs` permission requested.

## Content Security Policy

```
script-src 'self'; object-src 'none';
```

## Security Tests

Automated security tests (`tests/security.test.js`) verify:

- ✅ Manifest permissions remain minimal (no `host_permissions`)
- ✅ No `fetch` or `XMLHttpRequest` in extension code
- ✅ No unsafe `innerHTML` injection (only `innerHTML = ""` for clearing)
- ✅ No API keys in source code
- ✅ No full page text written to `chrome.storage.local`
- ✅ No `.env` or secret files committed

## Known Limitations

- The extension can read visible text on the active tab during analysis — this is a standard content script capability
- Rule-based analysis may inherit ambiguity from the source posting text
- The tool is decision-support only and relies on user judgment for final decisions

## Disclaimer

SponsorLens is a non-commercial educational prototype. It does not provide legal, immigration, or employment advice and does not guarantee visa sponsorship, job eligibility, or hiring outcomes.
