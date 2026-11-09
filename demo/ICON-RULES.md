# TransitOne - Unified Icon Mirroring & Cultural Semantics (v2.0)

Single source of truth for the 24px grid iconography and bidirectional rendering rules across English (LTR), Hindi (Devanagari), Kannada (Indic complex), and Urdu (RTL Arabic script).

---

## 1. Directional Icons Matrix (`data-mirror="true"`)

Directional icons communicate horizontal chronological flow, hierarchical progression, or corridor paths. In RTL contexts (Urdu), these are mirrored via the `.mirror-rtl` utility (`transform: scaleX(-1)`).

| Sprite Symbol ID | Mirror in RTL | Visual Purpose | RTL Linguistic & Reading Rationale |
| :--- | :---: | :--- | :--- |
| `icon-arrow-back` | **YES** | Return to previous view | Reading flows from right to left; historical screens are to the right. |
| `icon-chevron-forward` | **YES** | Drill-down progression | Forward hierarchical depth points toward the reading progression. |
| `icon-arrow-forward` | **YES** | Route transit path (From → To) | Transit direction from origin to destination matches reading direction. |
| `icon-arrow-see-all` | **YES** | Expand corridors list | Points in the direction of textual expansion. |

---

## 2. Symmetrical & Physical Reality Icons (`data-mirror="false"`)

Icons representing physical objects, symmetrical geometry, or universal clock conventions **MUST NEVER BE MIRRORED** in RTL.

| Sprite Symbol ID | Mirror in RTL | Visual Purpose | Physical / Cultural Invariance Rationale |
| :--- | :---: | :--- | :--- |
| `icon-globe` | **NO** | Multilingual selection | Symmetrical planetary geography. Continents do not flip. |
| `icon-search` | **NO** | Search bar action | Universal right-handed optical lens convention across all global platforms. |
| `icon-home` | **NO** | Primary navigation | Symmetrical architectural silhouette of a shelter. |
| `icon-settings` | **NO** | Preferences & tools | Symmetrical circular gear. |
| `icon-clock` | **NO** | Timetable & minutes | Mechanical and physical clocks run clockwise in all world locales. |
| `icon-pin` | **NO** | Destination stop | Symmetrical vertical teardrop pointing to coordinates. |
| `icon-pin-dot` | **NO** | Origin stop dot | Symmetrical circular geometry. |
| `icon-swap-vertical` | **NO** | Exchange origin & destination | Vertical exchange axes are unaffected by horizontal reading direction. |
| `icon-bus` | **NO** | City public bus | Head-on symmetrical public transit bus silhouette. |
| `icon-metro` | **NO** | High-speed rail / Metro | Head-on symmetrical rail vehicle silhouette. |
| `icon-ticket` | **NO** | Boarding pass / Fare | Physical boarding pass silhouette with vertical perforation. |
| `icon-star` / `icon-star-filled` | **NO** | Save favourite route | Symmetrical 5-point star geometry. |
| `icon-share` | **NO** | Share route link | Canonical graph node structure. |
| `icon-qr-code` | **NO** | Automated transit gate pass | 2D matrix barcode format requires fixed orientation for optical scanner cameras. |
| `icon-check` | **NO** | Action confirmation | Universal affirmative glyph. |
| `icon-alert-circle` | **NO** | Non-blocking inline warning | Symmetrical warning badge. |
| `icon-wifi-off` | **NO** | Offline banner state | Symmetrical broadcast waves with cancellation stroke. |

---

## 3. Cultural Icons Audit & Replacement Rationale

| Replaced Convention | Cultural Hazard / Rationale | TransitOne Solution |
| :--- | :--- | :--- |
| **Thumbs-Up Gesture** (👍) | Considered vulgar and offensive in parts of the Middle East, Iran, and West Asia. | Replaced universally by the neutral affirmative checkmark (`icon-check`). |
| **Open Palm / Hand Wave** (✋) | Sign of reprimand or insult ("moutza") in Mediterranean and Arab regions. | Replaced by clear text status or neutral geographic pin badge. |
| **US Curbside Mailbox** (📬) | Flagged mailbox design is exclusively North American and unrecognizable in India and Asia. | Replaced by direct digital pass, QR token, and clear localized labels. |
| **Color-Only Status Cues** | Red/Green signaling excludes users with color vision deficiencies and carries varied cultural connotations. | Status cues are always triple-encoded: WCAG AA colors + distinct SVG iconography + localized descriptive text. |

---

## 4. Architectural Rules Summary

1. **Sprite Format**: `<symbol id="icon-[name]" viewBox="0 0 24 24" data-mirror="true|false">` in `demo/assets/sprite.svg`.
2. **Single Utility Rule**: Directional icons receive `.mirror-rtl` dynamically in `icons.js`.
3. **Strict Touch Target**: Every icon used as a standalone interactive control has a minimum bounding box of 44×44px.
