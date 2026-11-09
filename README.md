# TransitOne - Unified RTL & Indic Public Transport Web Prototype

> **Problem Statement 64: Unified RTL and Indic Design System**  
> Engineering a single, cohesive design system that provides equal visual hierarchy, accessibility, and fluid responsiveness across Left-to-Right Latin scripts (English), complex Indic scripts with vertical conjuncts (Hindi & Kannada), and Right-to-Left bidirectional scripts (Urdu) without separate per-language layouts.

---

## 1. Overview & Architecture

TransitOne is an ultra-fast, zero-dependency multilingual transit prototype designed for Karnataka and Bangalore commuter corridors. Built using pure vanilla web standards (HTML5, modern CSS logical properties, and ES modules), TransitOne demonstrates that modern CSS and semantic HTML can support complex multilingual layouts without frameworks, bundlers, or CDNs.

- **Design Reference**: [Figma Reference Design](https://www.figma.com/file/placeholder-transitone-prototype)
- **WCAG Conformance**: WCAG 2.2 Level AA Compliant (Text contrast >= 6.2:1 on brand fills, 3px persistent high-contrast focus rings, 44x44px minimum touch targets).
- **Offline / PWA**: Full Service Worker app-shell caching with offline detection and Web App Manifest.

---

## 2. Supported Languages & Script Engineering

| Language | Code | Script | Direction | Font Stack | Line Height |
| :--- | :---: | :--- | :---: | :--- | :---: |
| **English** | `en` | Latin | LTR | `Inter`, system-ui, sans-serif | `1.5` |
| **हिन्दी (Hindi)** | `hi` | Devanagari | LTR | `Noto Sans Devanagari`, sans-serif | `1.7` |
| **ಕನ್ನಡ (Kannada)** | `kn` | Kannada | LTR | `Noto Sans Kannada`, sans-serif | `1.75` |
| **اردو (Urdu)** | `ur` | Arabic / Naskh | RTL | `Noto Naskh Arabic`, serif | `1.8` |

### Key Architectural Pillars:
1. **CSS Logical Properties Only**:
   Every spatial layout rule is declared with logical properties (`margin-inline-start`, `padding-inline`, `inset-inline-start`, `text-align: start`). There are zero physical `left`/`right` rules anywhere in the stylesheet.
2. **Preventing Indic Glyphic Clipping**:
   Kannada (*ottu*) and Hindi matras demand extended vertical bounding boxes. Line heights are elevated per script (`1.7` - `1.8`), container heights are flexible (`min-block-size`), and `overflow: visible` prevents clipping of complex ligatures.
3. **Selective Icon Mirroring**:
   - *Mirrored in RTL* (`.mirror-rtl`): Back navigation arrows, drilldown chevrons, route journey flow arrows, and "See all" forward indicators.
   - *Never Mirrored*: Symmetrical or universal real-world icons (globe, search lens, clock, map pin, bus/metro outlines, currency glyphs, tickets).
4. **Bidirectional Isolation (`<bdi>`)**:
   Latin route codes (e.g. `Metro M1`, `Bus 500`) and phone numbers embedded in Urdu RTL sentences are wrapped in `<bdi>` elements to prevent Unicode bidirectional algorithm reordering errors.
5. **Layout Torture Testing**:
   The built-in "Force Opposite Direction" test flips `document.documentElement.dir` independently of language to verify pure direction-agnostic agility.

---

## 3. Screen Inventory

1. **Welcome / Onboarding** (`#/welcome`): Native script selection in a 2x2 grid, high-resolution hero rail illustration, instant language preview, and keyboard arrow navigation.
2. **Journey Planner / Home** (`#/home`): Top brand bar with pink-tinted language pill, origin/destination inputs with localized datalists, white square swap button, and quick-route corridor cards.
3. **Available Routes** (`#/results?from=&to=`): Route summary banner, highlighted primary route card, duration chips, stop counts, and ticket fares.
4. **Route Details & Timetable** (`#/route/:id`): Departure timeline with vertical stop connector line that flips dynamically in RTL.
5. **Settings & Accessibility** (`#/settings`): Radio language selection, Larger Text mode (125%), High Contrast mode (WCAG AAA 4.8:1), About dialog, and Prototype Tools.
6. **Design System Specification** (`#/design-system`): Complete 8-section living style guide with live WCAG contrast calculation, token scale, bidirectional comparison, and +40% text-expansion stress testing.
7. **Edge States**: Real UI views for `empty`, `loading` (shimmer skeletons), `error` (same origin/dest with inline alert), `offline` banner, and `denied` geolocation.

---

## 4. Getting Started Locally

Serve the `demo/` folder directly with any static HTTP server:

```bash
# Using Python 3
python -m http.server 8000 --directory demo
```

Open [http://localhost:8000/index.html](http://localhost:8000/index.html) in your browser.

---

## 5. Deployment (Vercel)

TransitOne is configured for instant zero-config deployment on Vercel:
- **Framework Preset**: Other
- **Root Directory**: `demo`
- **Build Command**: *(leave empty)*
- **Output Directory**: *(leave empty)*

The included `demo/vercel.json` ensures `cleanUrls: true`, cache headers (`no-cache` for `index.html` and `sw.js`, 1-year immutable caching for `/assets`).

---

## 6. Project Structure

```
├── demo/
│   ├── index.html                 # Entrypoint shell & accessible landmarks
│   ├── manifest.webmanifest       # PWA Web App Manifest
│   ├── sw.js                      # Service Worker offline shell cache
│   ├── vercel.json                # Vercel static deployment configuration
│   ├── CONTRAST.md                # WCAG 2.2 AA Contrast Compliance Audit
│   ├── ICON-RULES.md              # RTL Icon & Cultural Sensitivity Guide
│   ├── TESTING-TEMPLATE.md        # Blank Usability Testing Protocol Template
│   ├── QA-REPORT.md               # Cross-Device QA Test Report
│   ├── assets/
│   │   ├── logo.svg               # Vector brand logo
│   │   ├── hero.png               # High-res train illustration
│   │   ├── icon-192.png           # PWA 192px app icon
│   │   ├── icon-512.png           # PWA 512px app icon
│   │   └── apple-touch-icon.png   # iOS touch icon
│   ├── css/
│   │   ├── tokens.css             # Theme variables, WCAG colors, typography
│   │   ├── base.css               # Reset, transitions, safe areas, skip link
│   │   ├── components.css         # Cards, buttons, sheets, inputs, skeletons
│   │   └── screens.css            # Welcome, timeline, settings, design system
│   └── js/
│       ├── app.js                 # Main UI controller & state engine
│       ├── i18n.js                # Translations & live language switcher
│       ├── router.js              # Hash client router
│       ├── data.js                # Localized Bangalore corridor data
│       └── icons.js               # SVG icon library & mirroring metadata
├── design/
│   └── screenshots/               # 30 full-page 390px mobile QA screenshots
└── tools/
    ├── capture_stage2_screenshots.py
    └── cross_device_qa.py
```

