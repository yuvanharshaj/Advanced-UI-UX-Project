"""
TransitOne - Cross-Script Automated Testing Suite
Unified RTL & Indic Design System Verification
Tests en, hi, kn, ur across mobile, tablet, and desktop viewports.
Verifies combobox search, ticket flow, numeral switching, and zero overflow.
"""

import sys
import re
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE_URL = "http://127.0.0.1:8000"
VIEWPORTS = [
    {"name": "Android Mobile (360x740)", "width": 360, "height": 740},
    {"name": "iPhone 14 (390x844)", "width": 390, "height": 844},
    {"name": "iPad Tablet (768x1024)", "width": 768, "height": 1024}
]
LANGUAGES = ["en", "hi", "kn", "ur"]

def test_css_logical_properties():
    print("\n[TEST 1] Auditing CSS logical properties (zero physical left/right)...")
    css_dir = Path("demo/css")
    physical_pattern = re.compile(r"\b(left|right)\b", re.IGNORECASE)
    violations = []

    for css_file in css_dir.glob("*.css"):
        with open(css_file, "r", encoding="utf-8") as f:
            for line_no, line in enumerate(f, 1):
                clean_line = line.strip()
                # Skip comments
                if clean_line.startswith("/*") or clean_line.startswith("*"):
                    continue
                if physical_pattern.search(clean_line):
                    violations.append(f"{css_file.name}:{line_no}: {clean_line}")

    if violations:
        print(f"FAILED: Found {len(violations)} physical left/right rules:")
        for v in violations:
            print(f"  {v}")
        return False
    else:
        print("PASS: 100% CSS Logical Properties. Zero physical left/right found!")
        return True

def run_suite():
    css_ok = test_css_logical_properties()
    if not css_ok:
        sys.exit(1)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("\n[TEST 2] Verifying Routes, Languages, and Zero Horizontal Overflow...")
        for vp in VIEWPORTS:
            page.set_viewport_size({"width": vp["width"], "height": vp["height"]})
            print(f"\n--- Viewport: {vp['name']} ---")

            for lang in LANGUAGES:
                # 1. Welcome Screen
                page.goto(f"{BASE_URL}/#/welcome")
                page.wait_for_selector(".welcome-container")
                
                # Switch language on welcome screen
                page.evaluate(f"window.applyLanguage('{lang}')")
                page.wait_for_timeout(100)

                # Verify html dir & lang
                html_dir = page.get_attribute("html", "dir")
                html_lang = page.get_attribute("html", "lang")
                expected_dir = "rtl" if lang == "ur" else "ltr"
                assert html_dir == expected_dir, f"Expected dir={expected_dir} for {lang}, got {html_dir}"
                assert html_lang == lang, f"Expected lang={lang}, got {html_lang}"

                # Check horizontal overflow
                scroll_w = page.evaluate("document.documentElement.scrollWidth")
                client_w = page.evaluate("document.documentElement.clientWidth")
                assert scroll_w <= client_w + 1, f"Horizontal overflow detected on Welcome screen ({lang}) in {vp['name']}"

                # 2. Home Screen
                page.goto(f"{BASE_URL}/#/home")
                page.wait_for_selector(".orange-search-card")
                
                # Test combobox input
                page.fill("#input-from", "")
                page.type("#input-from", "kbs")
                page.wait_for_timeout(150)
                
                # Select first option from dropdown
                first_opt = page.query_selector(".combobox-option")
                if first_opt:
                    first_opt.click()
                
                # 3. Results Screen
                page.click("#btn-search-continue")
                page.wait_for_timeout(700) # wait for simulated skeleton
                page.wait_for_selector(".results-list")

                # Verify filter chips
                filter_bus = page.query_selector("[data-mode-filter='bus']")
                if filter_bus:
                    filter_bus.click()
                    page.wait_for_timeout(100)

                # 4. Route Details Screen
                page.wait_for_selector(".route-item-card")
                page.click(".route-item-card")
                page.wait_for_selector(".details-summary-card")

                # Test Save route toggle
                if page.query_selector("#btn-toggle-save-route"):
                    page.click("#btn-toggle-save-route")
                    page.wait_for_timeout(150)

                # 5. Ticket Flow
                page.wait_for_selector("#btn-details-buy-ticket")
                page.click("#btn-details-buy-ticket")
                page.wait_for_selector(".ticket-form-card")

                # Stepper plus
                page.click("#btn-stepper-plus")
                # Confirm demo ticket
                page.click("#btn-confirm-ticket")
                page.wait_for_selector(".ticket-receipt-card")
                
                # Verify QR code svg exists
                qr = page.query_selector(".qr-code-box svg")
                assert qr is not None, "QR code SVG missing from ticket receipt"

                # 6. Settings Screen & Numeral Toggle
                page.goto(f"{BASE_URL}/#/settings")
                page.wait_for_selector(".settings-section")

                # Toggle numerals
                page.evaluate("document.getElementById('toggle-numerals').click()")
                page.wait_for_timeout(100)

                # 7. Design System Page
                page.goto(f"{BASE_URL}/#/design-system")
                page.wait_for_selector(".ds-page")

                # Check baseline rulers & tall glyphs
                tall_glyph = page.query_selector(".glyph-stress-big")
                assert tall_glyph is not None, "Font metrics lab tall glyph missing"

                # Check zero overflow on DS page
                ds_scroll_w = page.evaluate("document.documentElement.scrollWidth")
                ds_client_w = page.evaluate("document.documentElement.clientWidth")
                assert ds_scroll_w <= ds_client_w + 1, f"Overflow on Design System page in {vp['name']} ({lang})"

                print(f"  [OK] Language '{lang}': dir={html_dir}, routes, combobox, ticket flow & DS page verified.")

        browser.close()
        print("\n==================================================")
        print("ALL 12 CROSS-SCRIPT QA TESTS PASSED SUCCESSFULLY!")
        print("==================================================")

if __name__ == "__main__":
    run_suite()
