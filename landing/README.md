# SponsorLens Landing Page

## What this is
A static, no-build landing page for SponsorLens competition submission and public sharing.

## Preview locally
From repository root:
```bash
python -m http.server 5500
```
Then open `http://localhost:5500/landing/`.

## Deploy with GitHub Pages
1. Push repository to GitHub.
2. In repo settings, enable Pages.
3. Select branch and folder (`main` / `/landing` if supported; otherwise publish root with landing path).
4. Share the generated Pages URL.

## Deploy with Vercel
1. Import repository in Vercel.
2. Set output directory to `landing`.
3. Deploy (no build command required).

## Files to edit
- `landing/index.html` (content, links, sections)
- `landing/styles.css` (visual style)
- `landing/script.js` (optional small behavior)

## Replace placeholder demo link
In `landing/index.html`, replace `href="#"` for “Watch Demo Soon” with your final demo video URL.
