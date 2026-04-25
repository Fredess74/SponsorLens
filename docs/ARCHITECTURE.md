# SponsorLens Architecture (Advanced Local-First MVP)

## Current default architecture (local mode)
- Manifest V3 popup extension with minimal permissions.
- `content.js` extracts visible text + metadata from the active page.
- `analyzer.js` scores signals locally and returns fit + confidence/evidence data.
- `popup.js` renders results, message studio, and saved-job tracker.
- `chrome.storage.local` stores optional student profile and saved analysis records (no full page text).

### Data flow
User opens job posting  
→ Clicks SponsorLens  
→ `content.js` extracts visible text + metadata  
→ `popup.js` calls `analyzer.js` locally  
→ result card shows verdict, evidence, action, and message studio  
→ optional save stores summary fields only

## Optional backend architecture (not default)
- `backend/server.js` exposes `POST /explain`.
- Returns deterministic mock explanation when no API key exists.
- Intended future place for server-side LLM explanations.
- Extension is not wired to backend by default.

## Security boundaries
- Local-first default, no external runtime calls from extension.
- API keys (future) must stay server-side only.
- No legal/immigration outcome guarantees.
