# BAWERK /site3

Isolated Next.js App Router page for `https://bawerk.solutions/site3/`.

Files:
- `app/site3/page.tsx`: metadata and route.
- `app/site3/Site3Client.tsx`: site and interaction logic.
- `app/site3/Globe3D.tsx`: React Three Fiber interactive particle globe.
- `app/site3/land-mask.ts`: simplified Natural Earth coastline sampling, generated from a GeoJSON country map.
- `app/site3/site3.css`: styles scoped under `.site3-root`.

Existing `package.json` already contains `three`, `@react-three/fiber`, `@react-three/drei`, and `lucide-react`; no dependency additions required.

## Run

`pnpm install` then `pnpm dev`. Visit `http://localhost:3000/site3/`.

## Deploy

Push the production branch that is connected to the BAWERK hosting deployment. A Git commit by itself cannot publish to an external host unless a GitHub/Vercel/hosting deployment integration is configured. If you serve the domain from cPanel/static hosting rather than a Next server, this route requires a Next.js deployment or a static export workflow for the complete app.

## Privacy / location

The public geolocation API `ipapi.co` is called once per session (cached in sessionStorage, during browser idle time, 3.5s timeout). Approximate IP city and coordinates are used solely in the client to position the blue location marker. Rejecting optional preferences leaves a generic global marker. No API key or database is needed.

## Content

Case study examples are labeled as scenarios rather than claiming unverified project results, customer counts, or awards. Contact links use the existing BAWERK WhatsApp contact number.

## Performance notes
- Globe pauses rendering when off-screen or when the tab is hidden (`frameloop`), no `occlude` raycasting, no wireframe shell, dpr capped at 1.5.
- Fonts loaded with `next/font` instead of CSS `@import`.
- Global `ScrollEffects` (blur reveal + scroll listener) is disabled on `/site3`.
- `Site3Client.tsx` and `site3.css` are legacy and unused; safe to delete.
