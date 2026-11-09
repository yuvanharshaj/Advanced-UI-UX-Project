# TransitOne - Icon & RTL Mirroring Rules

## 1. Directional Mirroring Matrix

| Icon Type | Mirror in RTL? | Implementation | Rationale |
| :--- | :---: | :--- | :--- |
| **Back Arrow** (`arrow-back`) | **YES** | `.mirror-rtl` (`transform: scaleX(-1)`) | Points toward the start of reading flow; in RTL, previous pages are to the right. |
| **Forward Chevron** (`chevron-forward`) | **YES** | `.mirror-rtl` (`transform: scaleX(-1)`) | Indicates drill-down progression into hierarchy. |
| **Route Flow Arrow** (`arrow-forward`) | **YES** | `.mirror-rtl` (`transform: scaleX(-1)`) | Origin-to-destination flow follows script direction (Right to Left in Urdu). |
| **See All Arrow** (`arrow-see-all`) | **YES** | `.mirror-rtl` (`transform: scaleX(-1)`) | Indicates expanding view in reading direction. |
| **Globe** (`globe`) | **NO** | Standard orientation | Symmetrical spherical representation of the Earth. |
| **Search Lens** (`search`) | **NO** | Standard orientation | Physical magnifying glass convention is universal. |
| **Home** (`home`) | **NO** | Standard orientation | Symmetrical architectural representation of a house. |
| **Settings Gear** (`settings`) | **NO** | Standard orientation | Symmetrical mechanical gear. |
| **Clock** (`clock`) | **NO** | Standard orientation | Mechanical and physical clocks run clockwise in all world locales. |
| **Map Pin** (`pin`, `pin-dot`) | **NO** | Standard orientation | Symmetrical vertical teardrop pointing to geographic coordinates. |
| **Vertical Swap** (`swap-vertical`) | **NO** | Standard orientation | Vertical bidirectional exchange between top and bottom inputs. |
| **Bus / Metro** (`bus`, `metro`) | **NO** | Standard orientation | Head-on symmetrical public transit vehicle outlines. |
| **Rupee Sign** (`₹`) | **NO** | Standard glyph | Currency symbols maintain standard typography. |
| **Ticket** (`ticket`) | **NO** | Standard orientation | Physical ticket silhouette with stub perforation. |
| **Checkmark** (`check`) | **NO** | Standard orientation | Universal confirmation glyph. |

---

## 2. Cultural Sensitivity & Neutral Iconography Rules

1. **Thumbs-up gesture Avoidance**:
   - *Risk*: Highly offensive in parts of the Middle East, Iran, and West Asia.
   - *Alternative*: Standard checkmark (`check`) or explicit affirmative text label.

2. **Open Hand / Palm Gestures**:
   - *Risk*: Signifies an insult ("moutza") or harsh reprimand in Mediterranean, Greek, and Middle Eastern contexts.
   - *Alternative*: Use neutral pin icons, informational badges, or clear descriptive text.

3. **US Curbside Mailbox**:
   - *Risk*: Unrecognized in India, Europe, and Asia where pillar boxes or wall slots are standard.
   - *Alternative*: Classic envelope silhouette or localized text label.

4. **Color-Only State Communication**:
   - *Risk*: Fails accessibility for red-green color blindness; color associations vary across cultures.
   - *Alternative*: Always pair color changes with text labels, icons (e.g. checkmark for success, exclamation circle for error), and ARIA announcements.

