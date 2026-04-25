# Security Policy

## Supported Version
- SponsorLens MVP (current repository mainline)

## Reporting a Security Issue
Please open a private report through repository security reporting (if enabled) or contact the maintainers directly with:
- reproducible steps
- impact assessment
- affected file(s)
- proposed mitigation (optional)

## Data Collection Boundaries
SponsorLens MVP:
- does **not** collect resumes
- does **not** collect immigration documents
- does **not** collect government IDs
- does **not** persist raw page text
- stores only optional student profile preferences locally (`chrome.storage.local`)

## External Communications
- No external API calls
- No backend
- No analytics endpoint in MVP

## Permissions Explanation
`manifest.json` uses only:
- `activeTab` (analyze currently active job page)
- `scripting` (inject local extractor script)
- `storage` (optional local profile persistence)

No `host_permissions` and no `tabs` permission are requested.

## Disclaimer Boundary
SponsorLens is a non-commercial educational prototype and does not provide legal, immigration, or employment advice. It does not guarantee sponsorship, eligibility, or hiring outcomes.

## Known Security Limitations
- Browser extension context can read visible page text on the active tab during analysis.
- Malicious page content can still be noisy or misleading; rule-based analysis may inherit source ambiguity.
- The tool is decision-support only and relies on user judgment for final decisions.
