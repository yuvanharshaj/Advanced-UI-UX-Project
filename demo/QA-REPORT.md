# TransitOne - Cross-Device QA & Usability Report

## 1. Test Matrix & Environment
- **Automation Engine**: Playwright Headless Chromium
- **Local Server**: Python `http.server` (port 8770)
- **Viewports Tested**:
  1. `320x568` (iPhone SE / Compact Mobile)
  2. `360x740` (Standard Android baseline)
  3. `390x844` (iPhone 14/15/16 baseline)
  4. `430x932` (iPhone Pro Max / Large Android)
  5. `768x1024` (iPad / Tablet portrait)
  6. `1280x800` (Desktop / Laptop landscape)
- **Languages Tested**: English (`en`), Hindi (`hi`), Kannada (`kn`), Urdu (`ur`).

---

## 2. Tested Workflows & Criteria

| Target Feature | Test Procedure | Observed Result | Status |
| :--- | :--- | :--- | :---: |
| **Input Font Size** | Verified `getComputedStyle` font size on `#input-from` across all 6 viewports. | Measured 16.0px (prevents iOS auto-zoom). | **PASS** |
| **100dvh Shell Behavior** | Measured `#app-shell` block size under mobile and tablet viewports. | Full height on mobile (`100dvh`), centered 430px column on tablet/desktop. | **PASS** |
| **Horizontal Reflow** | Evaluated `scrollWidth <= clientWidth` on all screens down to 320px. | Exactly zero horizontal overflow on all viewports. | **PASS** |
| **Origin/Dest Swap** | Clicked `#btn-swap-locations` on Home screen. | Swapped values between From and To cleanly. | **PASS** |
| **Stops Timetable** | Navigated to `#/route/maj-wf-m1`. | Rendered 6+ ordered stops with vertical connector line. | **PASS** |
| **Urdu RTL Mirroring** | Loaded `applyLanguage('ur')`. | `dir="rtl"` applied, back/chevrons mirrored, symmetrical icons unmirrored. | **PASS** |
| **Kannada Line Height** | Rendered Kannada script at `line-height: 1.75`. | Zero clipping of *ottu* and *matra* conjunct ligatures. | **PASS** |
| **Larger Text Toggle** | Checked `#toggle-larger-text` in Settings. | Applied `html.larger-text` (125% root font size), persisted in storage. | **PASS** |
| **High Contrast Mode** | Checked `#toggle-high-contrast` in Settings. | Swapped to pure black text, #B54A00 dark orange with white text (4.8:1). | **PASS** |
| **Force Opposite Dir** | Toggled `#toggle-force-opposite` in Prototype Tools. | Inverted document `dir` live to prove direction-agnostic agility. | **PASS** |
| **+40% Text Expansion** | Toggled `#toggle-text-expansion` on Design System page. | Strings expanded by +40%; chips and cards wrapped cleanly with no clipping. | **PASS** |
| **Offline Shell Caching**| Registered `sw.js` and verified service worker activation. | Service Worker active (`controller = True`); app shell cached. | **PASS** |

---

## 3. Bugs Identified & Fixed

1. **Bug**: `ReferenceError: translations is not defined` during Design System language table rendering.
   - *Fix*: Imported `translations` table from `./i18n.js` into `./app.js`.
2. **Bug**: Quick route items on Home wrapped text and icons vertically in RTL Urdu.
   - *Fix*: Restored flex container styles (`.route-card`, `.route-card-main`, `.route-endpoints`) with logical gap spacing.
3. **Bug**: Toggle switch input was visually hidden with `0x0` dimensions, failing automated focus/click events.
   - *Fix*: Added `role="switch"` and `aria-checked` attributes; wired label clickability for assistive devices.
4. **Bug**: Focused interactive elements could be obscured under the fixed bottom navigation bar on short screens.
   - *Fix*: Added `scroll-padding-bottom: 88px` on `html` so keyboard focus scrolling always leaves space above the nav.
5. **Bug**: Missing skip-link landmark for keyboard users.
   - *Fix*: Added `<a href="#main-content" class="skip-link">Skip to content</a>` with high-contrast focus indicator.

