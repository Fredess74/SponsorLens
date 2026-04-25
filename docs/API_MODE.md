# SponsorLens API Mode Notes

## Credit clarification
The **$100 student credits** in the Codex challenge context are for Codex usage during building workflows, **not** runtime OpenAI API usage credits.

## Runtime API billing
Runtime OpenAI API calls require separate API billing or API credits on the OpenAI API platform.

## Key safety
- Extension must never store API keys.
- API keys must remain server-side only.

## Mode defaults
- **Default mode:** local-first extension analysis, no backend needed.
- **Optional mode:** backend `/explain` endpoint for future enhancement.

## Current status
SponsorLens MVP ships with local mode enabled and optional backend disconnected by default.
