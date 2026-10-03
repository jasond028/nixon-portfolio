# Nixon D — Video Editor Portfolio

A responsive, animated portfolio built with React + Framer Motion for a
video editor. Includes dark/light mode, animated skill counters, an
in-page scrolling video reel with inline play, and a link out to a full
Google Drive work library.

## Run locally

```bash
npm install
npm start
```

Open http://localhost:3000.

## Content

Edit `src/data/portfolioData.js` to change any text: name, tagline,
skills, tools, experience, project descriptions, contact info, resume
file name, and the Google Drive link.

- Resume file lives at `public/resume/Nixon_D_Resume.pdf` (linked from the
  "Download Resume" buttons).
- Reel videos live in `public/videos/` and are referenced by path in
  `portfolioData.js` (`projects[].src`).

## ⚠️ Before you deploy: video file sizes

Current sizes in `public/videos/`:

| File | Size |
|---|---|
| college-event.mp4 | ~94 MB |
| onam-celebration.mp4 | ~90 MB |
| pre-feast-promo.mp4 | ~85 MB |
| church-feast.mp4 | ~68 MB |
| cinematic-intro.mp4 | ~17 MB |

All 5 are now under GitHub's 100 MB per-file push limit, so a plain
`git add`/`git push` will work. Two things still worth knowing:

- Total is ~345 MB. That's fine to commit, but it does make every clone
  of the repo slow, and free tiers on Vercel/Netlify have their own
  total-size/bandwidth limits worth checking before you deploy.
- Large video also means a slower first load for visitors on the live
  site, especially on mobile data.

If that becomes a problem, the fix is the same as before: re-export for
web delivery (1080p, H.264, ~5–10 Mbps) to get each file into the
10–30 MB range, or host them externally (YouTube unlisted, Cloudinary, a
CDN bucket) and point `projects[].src` in `portfolioData.js` at those
URLs instead. Not required right now — just an option if size becomes an
issue later.

## Available Scripts (Create React App)

- `npm start` — development server
- `npm run build` — production build to `build/`
- `npm test` — test runner
