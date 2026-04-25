# SponsorLens Challenge Submission Package

## Short Project Description
SponsorLens is a privacy-first Chrome extension that helps international students evaluate job postings for work-authorization friction before investing application time.

## Long Project Description
SponsorLens is a local-first Manifest V3 extension that reads visible job posting language, detects sponsorship and authorization signals, flags contradictions, and returns a profile-aware Strong Fit / Risky Fit / Low Fit decision. It includes recruiter-safe next-step messaging and a demo mode for reliable pitch scenarios.

## Problem Statement
International students frequently encounter unclear or conflicting work-authorization language in job postings, leading to wasted effort and uncertainty.

## Solution Statement
SponsorLens adds a decision-support layer on top of job board data by interpreting posting text directly and providing actionable guidance.

## Why This Is Useful
- Saves application time
- Improves screening clarity
- Surfaces contradictions early
- Produces safe recruiter outreach language

## Why This Is Creative
It bridges static job board metadata and personalized decision-support without requiring backend infrastructure in MVP.

## How Codex Helped
Codex accelerated implementation of extension architecture, scoring logic, testing harness, and product documentation package.

## How to Demo
1. Open popup on a real job page.
2. Run Analyze flow.
3. Show result sections and recruiter-safe message copy.
4. Run Strong/Risky/Low demo buttons.
5. Show contradiction demo and explain warning behavior.

## Privacy Statement
Local-first MVP; no resumes, immigration documents, or IDs collected; no external API calls.

## Disclaimer
SponsorLens is a non-commercial educational prototype. It does not provide legal, immigration, or employment advice and does not guarantee sponsorship, eligibility, or hiring outcomes.

## Suggested Screenshots / Video Moments
- Popup profile + analyze button
- Strong Fit result card
- Risky Fit with clarification action
- Low Fit with time-saved estimate
- Contradiction warning example
- Demo mode buttons in action

## Judging Criteria Mapping
- **Clarity:** clear fit labels, reasons, and recommendations
- **Usefulness:** time-saving triage for real student workflow
- **Creativity:** contradiction-aware interpretation layer
- **Execution:** working MV3 extension + tests + docs
- **Polish & Thoughtfulness:** startup-style UI, privacy-first framing, explicit guardrails
