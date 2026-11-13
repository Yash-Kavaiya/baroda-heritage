# Baroda 3D explorer

The active entry point is `src/components/HeritageExplorer.jsx`. The previous App and Website components are retained without replacing their content.

Run `npm run dev` and use the URL Vite prints. The site needs WebGL2 for interactive 3D, with an accessible fallback when unavailable. No API keys or backend are needed.

The collection currently includes nine entries from `src/data/places.js`; models are original procedural geometry in `src/utils/monumentGenerators.js`. They are artistic interpretations, not architectural scans. Champaner–Pavagadh is outside Vadodara, in Panchmahal district.

Controls: drag to orbit, scroll/pinch to zoom, camera presets in Scene settings, day/golden/night lighting, Natural/Blueprint/Terracotta materials, and optional Monsoon/Festive particles. Focus the canvas and use arrow keys, +/- or R. Animation respects reduced-motion preferences. Audio is opt-in.

Saved places use browser localStorage only. Selection is deep-linked via `?place=...`. Download your view exports the actual WebGL render as PNG. The illustrated map is not to scale and is not for navigation.

Verification:

- `npm run lint`
- `npm run build`
- `node --test tests/*.test.js`
- `python tests/browser_smoke.py` (Python Playwright and Chromium required; set APP_URL as appropriate)
- `python scripts/capture-website.py` (writes actual browser evidence into artifacts)

Regenerate static model previews against a running Vite development server: `APP_URL=http://127.0.0.1:5174 python scripts/render-previews.py`. This uses Python Playwright and Pillow. Do not point the preview generator at a production server because the source-module URLs are development-only.
