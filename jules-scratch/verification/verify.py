from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    def log_console_message(msg):
        print(f"Browser console: {msg.text}")

    page.on("console", log_console_message)

    page.goto("http://localhost:5173")
    page.wait_for_load_state("networkidle")

    # Click on the "Moods" tab.
    page.get_by_role("button", name="Moods").click()

    # Click on a mood to generate a playlist.
    page.get_by_role("button", name="Chill Vibes").click()

    # Click on a track to play it.
    page.get_by_role("button", name="Play").first.click()
    page.wait_for_timeout(5000) # wait for 5 seconds

    # Wait for the player to be visible
    page.wait_for_selector("text=Peace Of Mind", timeout=60000)

    # Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
