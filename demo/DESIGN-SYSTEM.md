# TransitOne - Unified Indic & RTL Design System (Specification v2.0)

A singular, coherent design system architecture tailored for multilingual public transport interfaces supporting Left-to-Right (English), complex Indic scripts (Hindi in Devanagari, Kannada), and Right-to-Left (Urdu in Arabic script) without per-language branching.

---

## 1. Core Principles

1. **Logical Layout Properties Only**:
   - Zero physical `left`, `right`, `margin-left`, `margin-right`, `padding-left`, or `padding-right` rules across all components.
   - Complete adoption of CSS Logical Properties: `margin-inline-start`, `margin-inline-end`, `padding-inline`, `padding-block`, `inset-inline-start`, `inset-inline-end`, and `text-align: start`.
   - The entire UI mirrors naturally when `<html dir="rtl">` is set for Urdu.

2. **Font Metrics & Complex Ligature Safety**:
   - Devanagari (*matras*) and Kannada (*ottu* conjunct sub-glyphs) extend both above the mean line and below the baseline.
   - `line-height` is dynamically scaled per script: `1.5` (en), `1.7` (hi), `1.75` (kn), `1.8` (ur).
   - Text containers avoid fixed height clipping; `min-block-size` is used throughout.

3. **Bidirectional Isolation (`<bdi>`)**:
   - Numbers, route codes (e.g. `Bus 500`, `Metro M1`), phone numbers (`+91 98765 43210`), and currency values are wrapped in `<bdi>` to prevent neutral punctuation and Latin digits from visually re-ordering inside RTL paragraphs.

4. **Unified Icon Semantics**:
   - **Directional icons**: `arrow-back`, `chevron-forward`, `arrow-forward`, `arrow-see-all` receive `.mirror-rtl` (`transform: scaleX(-1)`).
   - **Symmetrical icons**: `globe`, `search`, `home`, `clock`, `pin`, `bus`, `metro`, `ticket`, `star`, `qr-code` never mirror.

---

## 2. Design Tokens Reference

### Color Palette & WCAG AA Contrast
- Brand Orange: `--color-brand-orange: #FF8A00`
- Orange Tint: `--color-orange-tint: #FFE3C2`
- Dark Text on Orange: `--color-text-on-orange: #1F2937` (6.21:1 contrast ratio)
- High Contrast Brand Orange: `#B54A00` with white text (5.32:1 contrast ratio)
- Primary Dark Text: `--color-text: #1F2937`
- Muted Text: `--color-text-muted: #5B6573`
- Error Crimson: `--color-error: #B42318`

### Spacing Scale
- `4px` (`--space-4`), `8px` (`--space-8`), `12px` (`--space-12`), `16px` (`--space-16`), `24px` (`--space-24`), `32px` (`--space-32`)

### Touch Targets
- Minimum interactive touch bounding box: `44×44px` (`--touch-target-min`)

---

## 3. Supported Scripts & Typography

| Language | Script | Direction | Font Family Fallbacks | Line-Height |
| :--- | :--- | :---: | :--- | :---: |
| **English** | Latin | LTR | System UI, Inter, -apple-system, sans-serif | `1.5` |
| **Hindi** | Devanagari | LTR | Noto Sans Devanagari, Mangal, Nirmala UI, sans-serif | `1.7` |
| **Kannada** | Kannada | LTR | Noto Sans Kannada, Tunga, Kedage, sans-serif | `1.75` |
| **Urdu** | Arabic / Nastaliq | RTL | Noto Nastaliq Urdu, Noto Sans Arabic, Arial, sans-serif | `1.8` |

---

## 4. Components Matrix

- **App Header**: Sticky 56px header with brand mark, tagline, and accessible language bottom sheet trigger.
- **Search Card**: Unified orange container with dual combobox input fields (origin / destination) and swap action.
- **Route Cards**: High-speed transit cards displaying mode badge, corridor path, live countdown chip, duration, stops, and fare.
- **Timeline**: Accessible vertical timeline illustrating ordered stops with dynamic timestamps.
- **Ticket Pass**: Digital transit pass with 2D QR matrix barcode and traveler details.

