# SponsorLens Optional Backend (Not required for MVP)

This backend is **optional** and is not required for the default local-first extension workflow.

## Why this exists
- Provide a safe place for future explanation mode (`POST /explain`).
- Keep API keys server-side only (never in extension code).

## Run
```bash
cd backend
npm start
```

## Endpoint
`POST /explain`

Input:
```json
{
  "analysisResult": {},
  "jobMetadata": {},
  "studentProfile": {}
}
```

Output:
```json
{
  "enhanced_summary": "...",
  "safer_recruiter_message": "...",
  "caveats": []
}
```

## Important
- If `OPENAI_API_KEY` is missing, backend returns deterministic mock output.
- Even if a key exists, current challenge skeleton keeps deterministic behavior.
- Extension is **not connected** to backend by default.
