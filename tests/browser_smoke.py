"""Real Chromium smoke tests. Requires Python Playwright and installed Chromium.

Run: python tests/browser_smoke.py
Set APP_URL to verify a production preview instead of the Vite dev server.
"""
import os
import unittest
import base64
import hashlib
import io
import json
import math
from pathlib import Path

from PIL import Image

from playwright.sync_api import expect, sync_playwright


class ExplorerBrowserTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(
            headless=True,
            args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
        )

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={"width": 1440, "height": 1000})
        self.page = self.context.new_page()
        self.errors = []
        self.page.on("pageerror", lambda error: self.errors.append(str(error)))
        self.page.goto(os.environ.get("APP_URL", "http://localhost:5173"), wait_until="domcontentloaded")

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def test_editorial_explorer_and_landmark_collection(self):
        expect(self.page.get_by_role("heading", name="Vadodara, in a new dimension.")).to_be_visible()
        expect(self.page.get_by_role("region", name="Landmark collection")).to_be_visible()
        expect(self.page.locator("[data-place-card]")).to_have_count(9)
        self.assertEqual(self.errors, [])

    def test_3d_scene_is_live_and_reports_the_current_landmark(self):
        canvas = self.page.locator(".scene-canvas canvas")
        expect(canvas).to_have_attribute("data-status", "ready", timeout=15000)
        expect(canvas).to_have_attribute("data-place", "laxmi-vilas-palace")
        self.assertEqual(self.errors, [])

    def canvas(self):
        canvas = self.page.locator(".scene-canvas canvas")
        expect(canvas).to_have_attribute("data-status", "ready", timeout=15000)
        return canvas

    def camera(self):
        return [float(value) for value in self.canvas().get_attribute("data-camera").split(",")]

    def test_every_landmark_renders_distinct_nonblank_pixels(self):
        expected = ["laxmi-vilas-palace", "sursagar-lake", "sayaji-baug", "kirti-mandir", "nyay-mandir", "eme-temple", "pavagadh-champaner", "khanderao-market", "baroda-museum"]
        self.canvas()
        actual = self.page.locator("[data-place-card]").evaluate_all("cards => cards.map(card => card.dataset.placeCard)")
        self.assertEqual(actual, expected)
        records = []
        for place_id in expected:
            with self.subTest(place=place_id):
                self.page.locator(f'[data-place-card="{place_id}"] .place-select').click()
                canvas = self.canvas()
                expect(canvas).to_have_attribute("data-place", place_id)
                self.page.wait_for_timeout(1150)
                data = canvas.evaluate("canvas => canvas.toDataURL('image/png')")
                raw = base64.b64decode(data.split(",", 1)[1])
                image = Image.open(io.BytesIO(raw)).convert("RGB")
                self.assertGreater(len(image.resize((128, 96)).getcolors(20000)), 100)
                records.append({"id": place_id, "sha256": hashlib.sha256(raw).hexdigest(), "width": image.width, "height": image.height, "geometries": int(canvas.get_attribute("data-geometries")), "triangles": int(canvas.get_attribute("data-triangles"))})
                self.assertGreater(records[-1]["triangles"], 100)
        self.assertEqual(len({item["sha256"] for item in records}), len(expected))
        output = Path(__file__).resolve().parents[1] / "artifacts"
        output.mkdir(exist_ok=True)
        (output / "landmark-render-checks.json").write_text(json.dumps(records, indent=2), encoding="utf-8")

    def test_camera_zoom_presets_orbit_and_keyboard_are_live(self):
        self.canvas()
        self.page.wait_for_timeout(1100)
        before = self.camera()
        target = [float(value) for value in self.canvas().get_attribute("data-target").split(",")]
        self.page.get_by_role("button", name="Zoom in", exact=True).click()
        self.page.wait_for_timeout(350)
        self.assertLess(math.dist(self.camera(), target), math.dist(before, target))
        self.page.get_by_role("button", name="Scene settings").click()
        self.page.get_by_role("button", name="aerial", exact=True).click()
        self.page.wait_for_timeout(1200)
        for actual, expected in zip(self.camera(), [0, 28, 22]):
            self.assertAlmostEqual(actual, expected, delta=0.2)
        self.page.get_by_role("button", name="Auto orbit", exact=True).click()
        expect(self.canvas()).to_have_attribute("data-auto-tour", "true")
        before = self.camera()
        self.page.wait_for_timeout(650)
        self.assertGreater(math.dist(before, self.camera()), 0.05)
        self.page.get_by_role("button", name="Pause orbit", exact=True).click()
        expect(self.canvas()).to_have_attribute("data-auto-tour", "false")
        self.canvas().focus()
        self.page.keyboard.press("ArrowRight")
        self.page.wait_for_timeout(500)
        self.assertGreater(math.dist(before, self.camera()), 0.05)

    def test_lighting_material_and_weather_change_the_live_scene(self):
        canvas = self.canvas()
        self.page.get_by_role("button", name="Night", exact=True).click()
        expect(canvas).to_have_attribute("data-time", "night")
        self.page.get_by_role("button", name="Scene settings").click()
        self.page.get_by_role("button", name="Blueprint", exact=True).click()
        expect(canvas).to_have_attribute("data-mode", "blueprint")
        self.page.get_by_role("button", name="Monsoon", exact=True).click()
        expect(canvas).to_have_attribute("data-weather", "monsoon")
        expect(canvas).to_have_attribute("data-particles", "700")
        first = canvas.get_attribute("data-weather-sample")
        self.page.wait_for_timeout(500)
        self.assertNotEqual(first, canvas.get_attribute("data-weather-sample"))
        self.page.get_by_role("button", name="Terracotta", exact=True).click()
        expect(canvas).to_have_attribute("data-mode", "sandstone")
        self.page.keyboard.press("Escape")
        self.page.get_by_role("button", name="Daylight", exact=True).click()
        expect(canvas).to_have_attribute("data-time", "day")

    def test_search_bookmarks_empty_state_and_deep_link(self):
        search = self.page.get_by_role("textbox", name="Search places")
        search.fill("સયાજી")
        expect(self.page.locator("[data-place-card]")).to_have_count(1)
        self.page.get_by_role("button", name="Explore Sayaji Baug", exact=True).click()
        expect(self.canvas()).to_have_attribute("data-place", "sayaji-baug")
        self.page.get_by_role("button", name="Save Sayaji Baug", exact=True).click()
        self.page.reload(wait_until="domcontentloaded")
        expect(self.canvas()).to_have_attribute("data-place", "sayaji-baug")
        expect(self.page.get_by_role("button", name="Unsave Sayaji Baug", exact=True)).to_have_attribute("aria-pressed", "true")
        self.page.get_by_role("button", name="Saved places (1)", exact=True).click()
        expect(self.page.locator("[data-place-card]")).to_have_count(1)
        self.page.get_by_role("button", name="Unsave Sayaji Baug", exact=True).click()
        expect(self.page.get_by_role("heading", name="Your next adventure starts here.")).to_be_visible()
        self.page.get_by_role("button", name="Explore all places", exact=True).click()
        expect(self.page.locator("[data-place-card]")).to_have_count(9)
        search.fill("no matching place")
        expect(self.page.get_by_role("heading", name="No places found. Keep wandering.")).to_be_visible()
        self.page.get_by_role("button", name="Explore all places", exact=True).click()
        self.page.get_by_role("button", name="Outdoors", exact=True).click()
        expect(self.page.locator("[data-place-card]")).to_have_count(2)

    def test_map_details_dialog_focus_and_postcard_download(self):
        self.canvas()
        self.page.get_by_role("button", name="City map", exact=True).click()
        expect(self.page.get_by_role("dialog")).to_be_visible()
        expect(self.page.locator(".map-pin")).to_have_count(9)
        self.page.get_by_role("button", name="Map: EME Temple", exact=True).click()
        expect(self.canvas()).to_have_attribute("data-place", "eme-temple")
        self.page.get_by_role("button", name="Discover the story", exact=True).click()
        self.page.get_by_role("button", name="Plan a visit", exact=True).click()
        expect(self.page.get_by_role("link", name="Find on Google Maps")).to_have_attribute("target", "_blank")
        self.page.keyboard.press("Escape")
        expect(self.page.get_by_role("dialog")).to_have_count(0)
        self.page.wait_for_timeout(1000)
        self.page.get_by_role("button", name="Take a postcard", exact=True).click()
        expect(self.page.get_by_role("img", name="Your 3D view of EME Temple", exact=True)).to_be_visible()
        with self.page.expect_download() as download:
            self.page.get_by_role("link", name="Download your view").click()
        self.assertEqual(download.value.suggested_filename, "baroda-eme-temple.png")
        raw = Path(download.value.path()).read_bytes()
        self.assertTrue(raw.startswith(b"\x89PNG\r\n\x1a\n"))
        self.assertGreater(len(raw), 10000)

    def test_mobile_layout_reduced_motion_and_all_preview_assets(self):
        self.page.set_viewport_size({"width": 390, "height": 844})
        self.page.emulate_media(reduced_motion="reduce")
        self.page.reload(wait_until="domcontentloaded")
        expect(self.canvas()).to_have_attribute("data-motion", "reduced")
        self.assertEqual(self.page.evaluate("document.documentElement.scrollWidth"), 390)
        self.page.evaluate("async () => { const imgs=[...document.images]; imgs.forEach(i=>i.loading='eager'); await Promise.all(imgs.map(i=>i.decode())); }")
        self.assertEqual(self.page.evaluate("[...document.images].filter(i=>!i.naturalWidth).length"), 0)
        self.page.get_by_role("button", name="City map", exact=True).click()
        expect(self.page.get_by_role("dialog")).to_be_visible()
        self.page.keyboard.press("Escape")
        expect(self.page.get_by_role("button", name="City map", exact=True)).to_be_focused()

    def test_webgl_unavailable_keeps_guide_usable_and_retry_recovers(self):
        self.page.add_init_script("window.realCanvasContext=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.startsWith('webgl')?null:window.realCanvasContext.call(this,type,...args)}")
        self.page.reload(wait_until="domcontentloaded")
        expect(self.page.get_by_role("button", name="Retry 3D")).to_be_visible()
        expect(self.page.locator("[data-place-card]")).to_have_count(9)
        self.page.get_by_role("button", name="Explore Sursagar Lake", exact=True).click()
        expect(self.page.locator(".selected-copy h2")).to_have_text("Sursagar Lake")
        self.page.evaluate("() => { HTMLCanvasElement.prototype.getContext=window.realCanvasContext; }")
        self.page.get_by_role("button", name="Retry 3D").click()
        expect(self.canvas()).to_have_attribute("data-place", "sursagar-lake")


    def test_fullscreen_and_opt_in_audio_work(self):
        self.page.add_init_script("window.liveAudioContexts=[];const Original=window.AudioContext;if(Original)window.AudioContext=class extends Original{constructor(...args){super(...args);window.liveAudioContexts.push(this)}}")
        self.page.reload(wait_until="domcontentloaded")
        self.canvas()
        self.page.get_by_role("button", name="Enter fullscreen", exact=True).click()
        self.page.wait_for_function("document.fullscreenElement !== null")
        self.page.get_by_role("button", name="Exit fullscreen", exact=True).click()
        self.page.wait_for_function("document.fullscreenElement === null")
        self.assertEqual(self.page.evaluate("window.liveAudioContexts.length"), 0)
        self.page.get_by_role("button", name="Play ambience", exact=True).click()
        self.page.wait_for_function("window.liveAudioContexts.some(context=>context.state==='running')")
        expect(self.page.get_by_role("button", name="Mute ambience", exact=True)).to_have_attribute("aria-pressed", "true")
        self.page.get_by_role("button", name="Mute ambience", exact=True).click()
        expect(self.page.get_by_role("button", name="Play ambience", exact=True)).to_have_attribute("aria-pressed", "false")

    def test_lost_gpu_context_can_be_recreated(self):
        canvas = self.canvas()
        available = canvas.evaluate("canvas => { const extension=canvas.getContext('webgl2').getExtension('WEBGL_lose_context'); if (!extension) return false; extension.loseContext(); return true; }")
        self.assertTrue(available)
        expect(self.page.get_by_role("button", name="Retry 3D")).to_be_visible()
        self.page.get_by_role("button", name="Retry 3D").click()
        expect(self.canvas()).to_have_attribute("data-place", "laxmi-vilas-palace")
        expect(self.page.get_by_role("button", name="Retry 3D")).to_have_count(0)

    def test_switching_models_releases_the_previous_gpu_geometry(self):
        canvas = self.canvas()
        self.page.wait_for_timeout(500)
        baseline = int(canvas.get_attribute("data-geometries"))
        for _ in range(3):
            self.page.get_by_role("button", name="Explore Sayaji Baug", exact=True).click()
            expect(canvas).to_have_attribute("data-place", "sayaji-baug")
            self.page.get_by_role("button", name="Explore Laxmi Vilas Palace", exact=True).click()
            expect(canvas).to_have_attribute("data-place", "laxmi-vilas-palace")
            self.assertLessEqual(int(canvas.get_attribute("data-geometries")), baseline + 2)


if __name__ == "__main__":
    unittest.main(verbosity=2)
