# SponsorLens Architecture (MVP)

## Stack
- Chrome Extension Manifest V3
- Plain HTML/CSS/JavaScript
- No backend
- No external API calls

## Components
- `content.js`: extracts visible page text (title, heading, company-like text, main/article, body fallback).
- `popup.js`: controls UI, storage, interactions, and rendering.
- `analyzer.js`: local scoring engine with contradiction detection and message generation.
- `chrome.storage.local`: stores optional student profile.

## Data Flow
User opens job posting  
→ Clicks SponsorLens  
→ content.js extracts visible text  
→ popup sends text to analyzer  
→ analyzer detects phrases and contradictions  
→ result card displays verdict, reasons, action, and recruiter message

## Security/Privacy Posture
- Local-only processing in MVP
- No outbound data pipeline
- Minimal extension permissions

## Future Backend Sketch (Post-MVP)
Potential architecture if expanded later:
- Optional API layer for richer explanation and normalization
- Privacy-safe telemetry with explicit consent
- Employer signal knowledge service
- Role/company normalization service

Not included in current challenge MVP.
