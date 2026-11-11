# Hugo Neves — Dentro e fora de campo

Approved custom photographic design, implemented for web.

Immersive Portuguese web portfolio. Approved custom direction: the supplied rugby photograph is a full-screen camera canvas. Scroll and clickable points zoom to the player, ball and field. No generated video.

Actual design tokens: background #10130f, foreground #f3f4ee, muted #b6bbb0, accent #d5fa57. Barlow Condensed uppercase display and Poppins body. Thin separators, outlined chips, circular hotspots; no card grids. Desktop has a left photographic canvas with right editorial text and 48px gutters. Mobile uses bottom gradients and compact typography.

Five chapters: overview, profile, programming, rugby, contact. Smooth interpolated camera on scroll; persistent buttons and keyboard alternatives. Respect reduced motion and provide an explicit toggle. Complete CV-derived timeline in a keyboard-accessible dialog. No database or API needed. Email contact only; do not publish private address or phone. Accenture internship is ongoing as of November 2026; February 2027 is a planned end.

## Brand & Colors

CSS variables in `packages/web/src/web/portfolio.css`. Ink #10130f, paper #f3f4ee, lime #d5fa57, soft #b6bbb0, translucent hairlines. Dark photographic design only.

## Typography

Barlow Condensed, uppercase display; Poppins body. Responsive type scales and compact desktop treatment below 800px viewport height prevent collision with persistent navigation.

## Pages & Screens

`/` uses `pages/portfolio.tsx`. Five fixed-stage chapters across a 500vh document. Native dialog contains full professional experience, training, skills and languages.

## Key User Flows

1. Open → scroll or click photographic hotspots → camera focuses → corresponding chapter appears.
2. Programming → complete timeline dialog → Escape or close → focus returns to trigger.
3. Contact → mailto link opens email client.
4. Motion control pauses camera travel; system reduced-motion preference is respected.

## Architecture

Managed Bun/Vite/React template. Frontend-only portfolio; no added API, auth or database. Original photograph under `public/images/`. Keep platform analytics and runtime components intact.
