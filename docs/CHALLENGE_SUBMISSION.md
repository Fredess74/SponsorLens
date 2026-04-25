# Challenge Submission

## Project

**SponsorLens** — AI-powered job-fit copilot for international students

## Problem

International students on F-1 visas spend significant time applying to jobs with unclear, contradictory, or restrictive work-authorization language. Current job boards surface employer-reported fields without interpretation — leading to blind applications, wasted hours, and preventable rejections.

## Solution

A privacy-first Chrome extension that reads visible job posting text, detects 25+ work-authorization signals, flags contradictions, and returns an actionable Strong Fit / Risky Fit / Low Fit verdict — all without external API calls.

## What Makes It Different

- **Contradiction-aware**: Detects when postings say both "sponsorship available" and "no visa sponsorship" simultaneously
- **Profile-aware**: Adjusts scoring based on student's visa status, work path, and sponsorship needs
- **Transparent**: Exposes confidence level, evidence strength, and every matched signal
- **Actionable**: Provides recruiter message templates ready to copy, not just a score
- **Privacy-first**: Zero data leaves the browser. No resumes, no documents, no tracking

## Demo Highlights

1. Analyze a real job posting → see structured verdict with confidence and evidence
2. View contradictions and top evidence signals
3. Switch between recruiter message variants (short / polite / cover letter)
4. Save the analysis → view cumulative Strong/Risky/Low counts and time saved
5. Run built-in demo scenarios for a clean, deterministic walkthrough

## Technical Stack

- Chrome Manifest V3 extension
- Vanilla JavaScript (no frameworks, no build step)
- `chrome.storage.local` for profile and saved analyses
- 15 automated tests (9 analyzer + 6 security)
- GitHub Actions CI pipeline

## Privacy Commitment

- No external API calls in default mode
- No resumes or immigration documents collected
- No full page text stored
- Minimal permissions: `activeTab`, `scripting`, `storage`

## Disclaimer

SponsorLens is a non-commercial educational prototype. It does not provide legal, immigration, or employment advice.
