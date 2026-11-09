# TransitOne - Unified Indic & RTL Public Transport Prototype (v2.0)

> **Problem Statement 64: Unified RTL and Indic Design System Localisation**  
> Engineering a single, cohesive design system that provides equal visual hierarchy, accessibility, and fluid responsiveness across Left-to-Right Latin scripts (English), complex Indic scripts with vertical conjuncts (Hindi in Devanagari & Kannada), and Right-to-Left bidirectional scripts (Urdu in Arabic script) without separate per-language layouts.

---

## 1. Project Overview & Architecture

TransitOne is an ultra-fast, zero-dependency multilingual transit web prototype engineered for commuter corridors. Built using pure vanilla web standards (HTML5, CSS Logical Properties, and ES Modules), TransitOne demonstrates that modern CSS and semantic HTML can support complex multilingual layouts without frameworks, bundlers, build steps, or CDNs.

- **WCAG Conformance**: WCAG 2.2 Level AA Compliant (Text contrast >= 6.21:1 on brand orange fills, 3px high-contrast focus rings, 44×44px minimum touch targets).
- **Project Documentation**: [Project Report PDF](docs/Project%20Report%20on-Unified%20RTL%20and%20Indic%20Design%20System-Yuvan%20Harshaj%20%5B1EP24CS181%5D.pdf) (Complete 39-page comprehensive project report with Certificate, specifications, and evaluation).
- **Zero-Dependency**: 100% static ES modules; static-hostable on Vercel, Netlify, or GitHub Pages.
- **Offline / PWA**: Full Service Worker v2 app-shell caching with offline detection and Web App Manifest.

---

## 2. Supported Languages & Script Engineering

| Language | Code | Script | Direction | Typography Stack | Line Height |
| :--- | :---: | :--- | :---: | :--- | :---: |
| **English** | `en` | Latin | LTR | System UI, Inter, -apple-system, sans-serif | `1.5` |
| **हिन्दी (Hindi)** | `hi` | Devanagari | LTR | Noto Sans Devanagari, Mangal, Nirmala UI, sans-serif | `1.7` |
| **ಕನ್ನಡ (Kannada)** | `kn` | Kannada | LTR | Noto Sans Kannada, Tunga, Kedage, sans-serif | `1.75` |
| **اردو (Urdu)** | `ur` | Arabic / Nastaliq | RTL | Noto Nastaliq Urdu, Noto Sans Arabic, Arial, sans-serif | `1.8` |

### Key Architectural Pillars:
1. **100% CSS Logical Properties**:
   Every spatial layout rule is declared with logical properties (`margin-inline-start`, `padding-inline`, `inset-inline-start`, `text-align: start`). There are **zero physical left/right properties** anywhere in the stylesheet.
2. **Preventing Indic Glyphic Clipping**:
   Kannada (*ottu* sub-glyphs) and Hindi (*matras*) demand extended vertical bounding boxes. Line heights are elevated per script (`1.7`–`1.8`), container heights are flexible (`min-block-size`), and descender padding buffers prevent clipping.
3. **Selective Icon Mirroring via Unified SVG Sprite**:
   Single source of truth in `demo/assets/sprite.svg`:
   - *Mirrored in RTL* (`data-mirror="true"`, `.mirror-rtl`): Back navigation arrows, drill-down chevrons, route flow arrows, and "See all" forward indicators.
   - *Never Mirrored* (`data-mirror="false"`): Symmetrical or real-world icons (globe, search lens, clock, map pin, bus/metro outlines, currency glyphs, tickets, QR codes, stars).
4. **Bidirectional Isolation (`<bdi>`)**:
   Latin route codes (e.g. `Metro M1`, `Bus 500-D`) and phone numbers embedded in Urdu RTL sentences are wrapped in `<bdi>` elements to prevent Unicode bidirectional algorithm reordering errors.
5. **Intl Engine & Numerals Switching**:
   Supports both Latin digits (1, 2, 3) and Native script numerals (Devanagari १, २, ३; Kannada ೧, ೨, ೩; Eastern Arabic numerals ۱, ۲, ۳) with localized plural rules (`Intl.PluralRules`).

---

## 3. Screen Inventory & Features

1. **Welcome / Onboarding** (`#/welcome`): Native script selection in a 2×2 grid, high-resolution hero rail illustration, instant language preview, and keyboard arrow navigation.
2. **Journey Planner / Home** (`#/home`): Top brand bar with pink-tinted language pill, ARIA 1.2 combobox search for origin/destination with multi-script substring and alias matching (e.g. "kbs" → Majestic, "bial" → Airport), swap button, recent searches (last 5), and saved routes.
3. **Available Routes** (`#/results`): Route summary banner, mode filtering (All, Metro, Bus), live sorting (Fastest, Cheapest, Fewest stops), live departure countdown chips with pulsing green dot (`Live • 4 min`), duration, stops count, and fares.
4. **Route Details & Timetable** (`#/route/:id`): Upcoming departures bar (next 3 departure countdowns & clock times), full vertical stops timeline, Save Route toggle (persisted to storage), Share Route action (Web Share API with clipboard fallback toast), and primary "Buy ticket" CTA.
5. **Ticket Booking & Digital Pass** (`#/buy` & `#/ticket/:id`): Passenger count stepper (1–6), traveler contact info (`dir="ltr"`), payment method selector (UPI, Transit Card, Cash), dynamic fare calculation, and generated digital vector SVG QR boarding pass.
6. **Settings & Accessibility** (`#/settings`): Radio language selection, Latin vs Native numerals switch, Larger Text mode (125%), High Contrast mode (WCAG AAA 4.8:1), Data Management (Clear saved data), and Prototype Tools.
7. **Design System Specification** (`#/design-system`): Living style guide featuring live WCAG contrast calculation, script direction matrix, Font Metrics Lab with baseline rulers & stacked glyph stress tests, Side-by-Side LTR vs RTL Mirroring Lab, and Cultural Icons audit.
8. **Edge States**: Real UI views for `empty`, `loading` (shimmer skeletons), `error` (same origin/dest with inline alert), `offline` banner, and `denied` geolocation.

---

## 4. Verification & Testing Suite

An automated end-to-end verification suite is included in `tests/cross_script_suite.py`:

```bash
# Run the automated cross-script test suite
python tests/cross_script_suite.py
```

The suite validates:
- 100% CSS logical properties audit (zero physical left/right properties).
- 12/12 screen and language combinations across mobile (`360x740`), iPhone (`390x844`), and tablet (`768x1024`).
- ARIA combobox typed alias search, filter/sorting, ticket booking, and numeral switching.
- Zero horizontal overflow across all scripts.

---

## 5. Local Setup

Run the application locally with Python:

```bash
# Start local development server
python -m http.server 8000 --directory demo
```

Open `http://localhost:8000` in your web browser.

---

## 6. Vercel Deployment Guide

TransitOne is configured for **zero-configuration instant deployment on Vercel**:

### Option A: Direct Zero-Config (Recommended)
1. In your [Vercel Dashboard](https://vercel.com/dashboard), click **"Add New Project"** and import `https://github.com/yuvanharshaj/Advanced-UI-UX-Project`.
2. Keep the default **Root Directory** (`./`).
3. Click **Deploy**.
4. The root [`vercel.json`](file:///vercel.json) automatically routes all traffic, static assets, service worker, and web manifest directly to the application with optimal caching and security headers.

### Option B: Custom Root Directory
If you choose to set the **Root Directory** to `demo` in Vercel Project Settings:
1. Framework Preset: **Other**
2. Root Directory: `demo`
3. Click **Deploy**.
4. The application will serve directly using [`demo/vercel.json`](file:///demo/vercel.json).
