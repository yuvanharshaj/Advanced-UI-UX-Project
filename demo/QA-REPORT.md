# TransitOne - Comprehensive Cross-Script QA & Verification Report (v2.0)

## 1. Test Matrix & Environment
- **Automation Engine**: Playwright Headless Chromium (`tests/cross_script_suite.py`)
- **Local Server**: Python `http.server` (port 8000)
- **Viewports Tested**:
  1. `360x740` (Standard Android baseline)
  2. `390x844` (iPhone 14/15/16 baseline)
  3. `768x1024` (iPad / Tablet portrait)
  4. `320x568` (Compact Reflow stress test)
- **Languages Tested**: English (`en`), Hindi (`hi`), Kannada (`kn`), Urdu (`ur`).

---

## 2. Automated Test Results (12/12 Passed)

| Workflow & Criteria | Verification Method | Result | Status |
| :--- | :--- | :--- | :---: |
| **CSS Logical Properties** | Scanned all rules across `demo/css/` for `left` or `right` property tokens. | 0 physical properties found (100% logical). | **PASS** |
| **Bidi Dir & Lang Sync** | Verified dynamic `<html lang="..." dir="...">` attributes per language. | `dir="rtl"` applied for Urdu; `ltr` for en/hi/kn. | **PASS** |
| **Horizontal Reflow** | Evaluated `scrollWidth <= clientWidth` on all screens and viewports. | Zero horizontal overflow across all screens. | **PASS** |
| **ARIA Combobox Search** | Simulated typing "kbs" into Origin input; selected matching option from listbox. | Matched Majestic via alias and populated input. | **PASS** |
| **Mode & Sorting Chips** | Clicked mode filter (`bus`) and sort chip (`cheapest`). | Dynamically filtered and ordered route cards. | **PASS** |
| **Save Route Persistence** | Clicked `#btn-toggle-save-route` on route details. | Toggled favourite state and persisted to storage. | **PASS** |
| **Ticket Booking & QR** | Stepped passenger count to 2, filled details, clicked confirm. | Ticket generated with custom vector SVG QR pass. | **PASS** |
| **Numerals Switching** | Toggled `#toggle-numerals` in Settings. | Re-formatted currency into native Deva/Knda/Arabext digits. | **PASS** |
| **Font Metrics & Baseline** | Checked Design System metrics lab with baseline rulers and stacked glyphs. | Zero vertical clipping of matras and ottu ligatures. | **PASS** |
| **Mirroring Lab** | Verified side-by-side LTR and RTL live interactive route cards. | Directional arrows mirrored; transit vehicles unmirrored. | **PASS** |
| **Offline App Shell** | Verified Service Worker v2 registration and shell caching in `sw.js`. | App shell cached; offline banner displays when network disconnected. | **PASS** |
| **WCAG 2.2 AA Contrast** | Measured 14 text/background color pairs in normal and high-contrast modes. | All pairs exceed 4.5:1 (normal text) and 3:1 (UI focus). | **PASS** |

---

## 3. Bugs Identified & Fixed Across Phases

1. **Bug**: In-flight DOM re-render detached button handle during automated Playwright test.
   - *Fix*: Switched test suite from stale `ElementHandle.click()` to resilient selector-based `page.click("#btn-details-buy-ticket")`.
2. **Bug**: Number formatting defaulted to Latin digits for all languages regardless of user preference.
   - *Fix*: Created `intl-helpers.js` with dynamic `Intl.NumberFormat(lang + '-u-nu-' + sys)` and user toggle in Settings.
3. **Bug**: Combobox dropdown did not dismiss on outside click or Escape key.
   - *Fix*: Added global document click listener and Escape key handler to clear `state.activeCombobox`.
4. **Bug**: Phone number input in Urdu RTL flipped country code prefix to the wrong side.
   - *Fix*: Applied strict `dir="ltr"` on `#input-passenger-phone` wrapped in `<bdi>`.
5. **Bug**: Long route pairs on small screens pushed transit code off-screen.
   - *Fix*: Configured flexible shrinking with `min-inline-size: 0` and flex wrap on `.route-card-headings`.
