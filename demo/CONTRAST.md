# TransitOne - WCAG 2.2 AA Contrast Compliance Audit

All measurements calculated mathematically using relative luminance formulas defined in WCAG 2.2 specifications:
\(L = 0.2126 \times R + 0.7152 \times G + 0.0722 \times B\) and Ratio = \(\frac{L_1 + 0.05}{L_2 + 0.05}\).

| Mode | Foreground Element | FG Hex | Background Element | BG Hex | Contrast Ratio | Min Threshold | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Normal** | Primary Button Text (#1F2937) | `#1F2937` | Brand Orange (#FF8A00) | `#FF8A00` | **6.21:1** | 4.5:1 | **PASS AA** |
| **Normal** | Orange Tint Pill Text (#1F2937) | `#1F2937` | Orange Tint (#FFE3C2) | `#FFE3C2` | **11.90:1** | 4.5:1 | **PASS AAA** |
| **Normal** | Page Body Text (#1F2937) | `#1F2937` | Page BG (#F7F9FC) | `#F7F9FC` | **13.92:1** | 4.5:1 | **PASS AAA** |
| **Normal** | Card Surface Text (#1F2937) | `#1F2937` | White Surface (#FFFFFF) | `#FFFFFF` | **14.68:1** | 4.5:1 | **PASS AAA** |
| **Normal** | Muted Secondary Text (#5B6573) | `#5B6573` | White Surface (#FFFFFF) | `#FFFFFF` | **5.91:1** | 4.5:1 | **PASS AA** |
| **Normal** | Error Message Text (#FFFFFF) | `#FFFFFF` | Error Crimson (#B42318) | `#B42318` | **6.57:1** | 4.5:1 | **PASS AA** |
| **Normal** | Active Nav Pill Text (#1F2937) | `#1F2937` | Nav Pill Peach (#FDD5A8) | `#FDD5A8` | **10.67:1** | 4.5:1 | **PASS AAA** |
| **Normal** | UI Focus Ring (#000000) | `#000000` | Page BG (#F7F9FC) | `#F7F9FC` | **19.91:1** | 3.0:1 | **PASS UI** |
| **High Contrast** | Primary Button Text (#FFFFFF) | `#FFFFFF` | Dark Brand Orange (#B54A00) | `#B54A00` | **5.32:1** | 4.5:1 | **PASS AA** |
| **High Contrast** | Page Body Text (#000000) | `#000000` | White Surface (#FFFFFF) | `#FFFFFF` | **21.00:1** | 4.5:1 | **PASS AAA** |
| **High Contrast** | Muted Secondary Text (#111827) | `#111827` | White Surface (#FFFFFF) | `#FFFFFF` | **17.74:1** | 4.5:1 | **PASS AAA** |
| **High Contrast** | Tinted Pill Text (#000000) | `#000000` | High Contrast Tint (#FED7AA) | `#FED7AA` | **15.51:1** | 4.5:1 | **PASS AAA** |
| **High Contrast** | Error Banner Text (#FFFFFF) | `#FFFFFF` | Error Crimson (#B42318) | `#B42318` | **6.57:1** | 4.5:1 | **PASS AA** |
| **High Contrast** | UI Focus Ring (#000000) | `#000000` | White Page (#FFFFFF) | `#FFFFFF` | **21.00:1** | 3.0:1 | **PASS UI** |

---

## Key Design Architecture Decision

- **Brand Orange Contrast Resolution**:
  Standard white text (`#FFFFFF`) on `#FF8A00` yields only **2.43:1**, failing WCAG AA (requires 4.5:1).
  TransitOne intentionally enforces dark text (`#1F2937`) on standard brand orange fills to achieve **6.21:1** (WCAG AA PASS).
  In high-contrast mode, brand orange shifts to `#B54A00` with white text, achieving **5.32:1** (WCAG AA PASS).
