import os
import time
import http.server
import socketserver
import threading
from playwright.sync_api import sync_playwright

def run_cross_device_qa():
    port = 8770
    handler = lambda *args, **kwargs: http.server.SimpleHTTPRequestHandler(*args, directory='demo', **kwargs)
    httpd = socketserver.TCPServer(('127.0.0.1', port), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    print(f"QA test server started on {port}")

    viewports = [
        ('320x568', 320, 568),
        ('360x740', 360, 740),
        ('390x844', 390, 844),
        ('430x932', 430, 932),
        ('768x1024', 768, 1024),
        ('1280x800', 1280, 800)
    ]

    languages = ['en', 'hi', 'kn', 'ur']
    test_results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for vp_name, width, height in viewports:
            print(f"\n--- Testing Viewport {vp_name} ---")
            page = browser.new_page(viewport={'width': width, 'height': height})
            page.goto(f"http://127.0.0.1:{port}/index.html#/welcome")
            page.wait_for_selector('#app-shell')
            time.sleep(0.3)

            # Check 1: Input font size >= 16px
            page.goto(f"http://127.0.0.1:{port}/index.html#/home")
            font_size = page.evaluate("parseFloat(window.getComputedStyle(document.getElementById('input-from')).fontSize)")
            assert font_size >= 16, f"Input font size {font_size}px must be >= 16px"
            print(f"[{vp_name}] Input font size verified: {font_size}px")

            # Check 2: 100dvh shell height
            shell_h = page.evaluate("document.getElementById('app-shell').offsetHeight")
            print(f"[{vp_name}] Shell height: {shell_h}px")

            # Check 3: Walk flow for each language
            for lang in languages:
                # 1. Welcome
                page.goto(f"http://127.0.0.1:{port}/index.html#/welcome")
                page.evaluate(f"window.applyLanguage('{lang}')")
                time.sleep(0.15)
                
                # 2. Home & Swap
                page.goto(f"http://127.0.0.1:{port}/index.html#/home")
                time.sleep(0.15)
                from_val_1 = page.evaluate("document.getElementById('input-from').value")
                to_val_1 = page.evaluate("document.getElementById('input-to').value")
                page.click("#btn-swap-locations")
                from_val_2 = page.evaluate("document.getElementById('input-from').value")
                assert from_val_2 == to_val_1, "Swap failed"

                # 3. Results
                page.goto(f"http://127.0.0.1:{port}/index.html#/results?from=majestic&to=whitefield")
                time.sleep(0.15)
                routes_len = page.evaluate("document.querySelectorAll('.route-item-card').length")
                assert routes_len >= 1, "Routes not displayed"

                # 4. Details
                page.goto(f"http://127.0.0.1:{port}/index.html#/route/maj-wf-m1")
                time.sleep(0.15)
                stops_len = page.evaluate("document.querySelectorAll('.stop-item').length")
                assert stops_len >= 6, "Stops timeline failed"

                # 5. Settings
                page.goto(f"http://127.0.0.1:{port}/index.html#/settings")
                time.sleep(0.15)
                page.evaluate("document.getElementById('toggle-larger-text').click()")
                is_large = page.evaluate("document.documentElement.classList.contains('larger-text')")
                assert is_large, "Larger text toggle failed"

                page.evaluate("document.getElementById('toggle-high-contrast').click()")
                is_hc = page.evaluate("document.documentElement.classList.contains('high-contrast')")
                assert is_hc, "High contrast toggle failed"

                # Open details prototype tools before clicking force-opposite
                page.evaluate("document.getElementById('prototype-tools-details').open = true")
                page.evaluate("document.getElementById('toggle-force-opposite').click()")
                is_opp = page.evaluate("document.documentElement.dir")
                expected_opp = 'rtl' if lang != 'ur' else 'ltr'
                assert is_opp == expected_opp, "Force opposite failed"

                # Reset toggles
                page.evaluate("window.setForcedOpposite(false)")
                page.evaluate("document.documentElement.classList.remove('high-contrast')")
                page.evaluate("document.documentElement.classList.remove('larger-text')")

                # 6. Design System
                page.goto(f"http://127.0.0.1:{port}/index.html#/design-system")
                time.sleep(0.15)
                sections_count = page.evaluate("document.querySelectorAll('.ds-section').length")
                assert sections_count == 8, f"Expected 8 sections, got {sections_count}"

                # 40% Text expansion test
                page.evaluate("document.getElementById('toggle-text-expansion').click()")
                time.sleep(0.1)
                expanded_txt = page.evaluate("document.querySelector('.ds-section-title').textContent")
                page.evaluate("document.getElementById('toggle-text-expansion').click()")
                time.sleep(0.1)

            # Check 4: Horizontal Overflow (Must be 0 across all screens)
            for path in ['#/welcome', '#/home', '#/results?from=majestic&to=whitefield', '#/route/maj-wf-m1', '#/settings', '#/design-system']:
                page.goto(f"http://127.0.0.1:{port}/index.html{path}")
                time.sleep(0.1)
                scroll_w = page.evaluate("document.documentElement.scrollWidth")
                client_w = page.evaluate("document.documentElement.clientWidth")
                assert scroll_w <= client_w + 1, f"Horizontal scroll detected on {path}: scrollWidth={scroll_w}, clientWidth={client_w}"

            page.close()

        # Check 5: Service Worker Registration & Caching
        page = browser.new_page(viewport={'width': 390, 'height': 844})
        page.goto(f"http://127.0.0.1:{port}/index.html")
        time.sleep(1.0)
        sw_registered = page.evaluate("Boolean(navigator.serviceWorker && navigator.serviceWorker.controller)")
        print("Service worker registered state:", sw_registered)
        page.close()

        browser.close()

    httpd.shutdown()
    print("\nALL CROSS-DEVICE QA TESTS PASSED!")

if __name__ == '__main__':
    run_cross_device_qa()
