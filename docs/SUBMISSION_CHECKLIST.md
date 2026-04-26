# Submission Checklist

## Product

- [ ] Extension loads via `chrome://extensions` → Load unpacked
- [ ] Demo Mode works: Strong Fit, Risky Fit, Low Fit
- [ ] Profile persistence works across popup reopen
- [ ] Recruiter Message Studio: all 3 variants switch correctly
- [ ] Copy message works (clipboard)
- [ ] Save analysis works → appears in Saved Jobs
- [ ] Export JSON works
- [ ] Clear saved jobs works
- [ ] No console errors in popup
- [ ] No external network calls (verify in DevTools Network tab)

## Tests

- [ ] `npm test` passes (15/15)
- [ ] `node -e "JSON.parse(require('fs').readFileSync('extension/manifest.json','utf8'))"` — valid JSON

## Landing Page

- [ ] `landing/index.html` renders correctly locally
- [ ] Hero section: title, subtitle, CTAs
- [ ] Problem section: 3 problem cards
- [ ] How it works: 4-step flow
- [ ] Demo section: Strong/Risky/Low/Message cards
- [ ] Privacy section: data boundaries
- [ ] Install section: step-by-step guide
- [ ] Footer: final CTA + credits
- [ ] Responsive on mobile
- [ ] Deployed to GitHub Pages or Vercel
- [ ] URL works publicly

## GitHub Repository

- [ ] README is polished and professional
- [ ] Description updated on GitHub About section
- [ ] Topic tags added
- [ ] All docs up to date
- [ ] No API keys in source
- [ ] No .env files committed
- [ ] Security tests pass

## Demo Video

- [ ] 75–90 second length
- [ ] Shows problem → product → features → privacy
- [ ] Uses Demo Mode for reproducible results
- [ ] Voiceover recorded
- [ ] Uploaded to YouTube (unlisted) or Loom
- [ ] Link added to landing page and README

## Submission

- [ ] Primary link: landing page URL
- [ ] Secondary link: GitHub repo
- [ ] Demo video: YouTube/Loom link
- [ ] Short description written
- [ ] Submitted before April 29 (buffer day before April 30 deadline)

## Short Description (for submission form)

> SponsorLens is a local-first Chrome extension that helps international students stop applying blindly. It reads visible job postings, detects work-authorization friction, flags contradictions, and gives a clear Strong / Risky / Low application decision with recruiter-safe next steps. Built with Codex.
