# TransitOne - WCAG 2.2 AA Contrast Compliance Audit

| Mode | Foreground Element | FG Hex | Background Element | BG Hex | Contrast Ratio | Threshold | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Normal | Primary Button Text (#1F2937) | #1F2937 | Brand Orange (#FF8A00) | #FF8A00 | **6.21:1** | 4.5:1 | **PASS** |
| Normal | Orange Tint Pill Text (#1F2937) | #1F2937 | Orange Tint (#FFE3C2) | #FFE3C2 | **11.90:1** | 4.5:1 | **PASS** |
| Normal | Page Body Text (#1F2937) | #1F2937 | Page BG (#F7F9FC) | #F7F9FC | **13.92:1** | 4.5:1 | **PASS** |
| Normal | Card Surface Text (#1F2937) | #1F2937 | White Surface (#FFFFFF) | #FFFFFF | **14.68:1** | 4.5:1 | **PASS** |
| Normal | Muted Secondary Text (#5B6573) | #5B6573 | White Surface (#FFFFFF) | #FFFFFF | **5.91:1** | 4.5:1 | **PASS** |
| Normal | Error Message Text (#FFFFFF) | #FFFFFF | Error Red (#B42318) | #B42318 | **6.57:1** | 4.5:1 | **PASS** |
| Normal | Active Nav Pill Text (#1F2937) | #1F2937 | Nav Pill Peach (#FDD5A8) | #FDD5A8 | **10.67:1** | 4.5:1 | **PASS** |
| Normal | UI Focus Ring (#000000) | #000000 | Page BG (#F7F9FC) | #F7F9FC | **19.91:1** | 3.0:1 | **PASS** |
| High Contrast | Primary Button Text (#FFFFFF) | #FFFFFF | Dark Brand Orange (#B54A00) | #B54A00 | **5.32:1** | 4.5:1 | **PASS** |
| High Contrast | Page Body Text (#000000) | #000000 | White Surface (#FFFFFF) | #FFFFFF | **21.00:1** | 4.5:1 | **PASS** |
| High Contrast | Muted Secondary Text (#111827) | #111827 | White Surface (#FFFFFF) | #FFFFFF | **17.74:1** | 4.5:1 | **PASS** |
| High Contrast | Tinted Pill Text (#000000) | #000000 | High Contrast Tint (#FED7AA) | #FED7AA | **15.51:1** | 4.5:1 | **PASS** |
| High Contrast | Error Banner Text (#FFFFFF) | #FFFFFF | Error Crimson (#B42318) | #B42318 | **6.57:1** | 4.5:1 | **PASS** |
| High Contrast | UI Focus Ring (#000000) | #000000 | White Page (#FFFFFF) | #FFFFFF | **21.00:1** | 3.0:1 | **PASS** |

## Summary

- Total audited pairs: 14
- Failures: 0
- Standards: WCAG 2.2 Level AA (4.5:1 for normal body text, 3:1 for large text and UI focus indicators).
- Design Decision: Strict dark text (#1F2937) on standard #FF8A00 yields 6.21:1 (WCAG AA PASS). In high-contrast mode, dark orange (#B54A00) with white yields 4.88:1 (WCAG AA PASS).