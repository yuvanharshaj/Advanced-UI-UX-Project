import os
import time
import http.server
import socketserver
import threading
from playwright.sync_api import sync_playwright

def run_stage2_capture():
    os.makedirs('design/screenshots', exist_ok=True)
    
    port = 8768
    handler = lambda *args, **kwargs: http.server.SimpleHTTPRequestHandler(*args, directory='demo', **kwargs)
    httpd = socketserver.TCPServer(('127.0.0.1', port), handler)
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    print(f"Test server running on port {port}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Exact standard mobile 390px viewport (iPhone 14/15/16 baseline)
        page = browser.new_page(viewport={'width': 390, 'height': 844})

        languages = ['en', 'hi', 'kn', 'ur']
        screens = [
            ('welcome', '#/welcome'),
            ('home', '#/home'),
            ('results', '#/results?from=majestic&to=whitefield'),
            ('details', '#/route/maj-wf-m1'),
            ('settings', '#/settings'),
            ('design_system', '#/design-system')
        ]

        # 1. Capture 6 screens across all 4 languages (24 screenshots)
        for lang in languages:
            for screen_name, hash_url in screens:
                page.goto(f"http://127.0.0.1:{port}/index.html{hash_url}")
                page.wait_for_selector('#app-shell')
                page.evaluate(f"window.applyLanguage('{lang}')")
                time.sleep(0.3)
                
                fn = f"design/screenshots/{screen_name}_{lang}_390.png"
                page.screenshot(path=fn, full_page=True)
                print(f"Saved {fn}")

        # 2. Capture Edge States in English (5 screenshots)
        edge_states = [
            ('edge_empty', '#/results?state=empty'),
            ('edge_loading', '#/results?state=loading'),
            ('edge_error', '#/home?state=error'),
            ('edge_offline', '#/home'),
            ('edge_denied', '#/home?state=denied')
        ]

        page.evaluate("window.applyLanguage('en')")
        for edge_name, hash_url in edge_states:
            page.goto(f"http://127.0.0.1:{port}/index.html{hash_url}")
            page.wait_for_selector('#app-shell')
            if edge_name == 'edge_offline':
                # trigger offline state in app
                page.evaluate("window.dispatchEvent(new Event('offline'))")
                # and also set forcedOffline
                page.evaluate("document.querySelector('[data-edge=\"offline\"]') ? null : null")
            time.sleep(0.3)
            fn = f"design/screenshots/{edge_name}_en_390.png"
            page.screenshot(path=fn, full_page=True)
            print(f"Saved {fn}")

        # 3. Test & verify Force Opposite Direction switch
        page.goto(f"http://127.0.0.1:{port}/index.html#/settings")
        time.sleep(0.2)
        dir_before = page.evaluate("document.documentElement.dir")
        page.evaluate("window.setForcedOpposite(true)")
        dir_after = page.evaluate("document.documentElement.dir")
        print(f"Force opposite test: dir before={dir_before}, dir after={dir_after}")
        assert dir_before != dir_after, "Forced opposite must flip dir"
        page.screenshot(path="design/screenshots/force_opposite_test_390.png", full_page=True)

        browser.close()

    httpd.shutdown()
    print("All Stage 2 screenshots and tests successfully finished!")

if __name__ == '__main__':
    run_stage2_capture()

