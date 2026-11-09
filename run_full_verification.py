import subprocess
import time
import sys
import urllib.request

print("Starting local test server on port 8000...")
server_proc = subprocess.Popen([sys.executable, "-m", "http.server", "8000", "--directory", "demo"],
                               stdout=subprocess.PIPE, stderr=subprocess.PIPE)

try:
    # Wait for server to be responsive
    for _ in range(10):
        try:
            urllib.request.urlopen("http://127.0.0.1:8000", timeout=1)
            print("Server is up and responding!")
            break
        except Exception:
            time.sleep(0.5)

    print("Executing tests/cross_script_suite.py...")
    test_proc = subprocess.run([sys.executable, "-u", "tests/cross_script_suite.py"],
                               capture_output=True, text=True, encoding="utf-8")
    print(test_proc.stdout)
    if test_proc.stderr:
        print("STDERR:\n", test_proc.stderr)
    if test_proc.returncode != 0:
        print(f"Test suite failed with exit code {test_proc.returncode}")
        sys.exit(test_proc.returncode)
    print("Verification completed successfully!")
finally:
    print("Stopping test server...")
    server_proc.terminate()
    server_proc.wait()

