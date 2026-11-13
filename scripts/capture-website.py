"""Capture the actual rendered website and check desktop/mobile overflow."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
out=root/"artifacts"
out.mkdir(exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=["--use-angle=swiftshader","--enable-unsafe-swiftshader"])
    results=[]
    for name,width,height in [("desktop",1440,1080),("mobile",390,844)]:
        page=browser.new_page(viewport={"width":width,"height":height},device_scale_factor=1)
        errors=[]
        page.on("pageerror",lambda error:errors.append(str(error)))
        page.goto(os.environ.get("APP_URL","http://127.0.0.1:5174"),wait_until="domcontentloaded")
        page.locator("canvas[data-status=ready]").wait_for(timeout=30000)
        page.wait_for_timeout(1300)
        try: page.evaluate("() => Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,4000))])")
        except Exception: pass
        page.evaluate("""async () => { const images=[...document.images]; images.forEach(i=>i.loading='eager'); await Promise.all(images.map(i=>i.decode().catch(()=>{}))); }""")
        page.screenshot(path=str(out/f"baroda-{name}.png"),full_page=True)
        result=page.evaluate("""() => ({width:innerWidth,body:document.documentElement.scrollWidth,cards:document.querySelectorAll('[data-place-card]').length,brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),canvas:document.querySelector('canvas').dataset})""")
        result.update(name=name,errors=errors)
        results.append(result)
        assert result['body']<=width, result
        assert not result['brokenImages'], result
        assert not errors,errors
        print(json.dumps(result),flush=True)
        page.close()
    browser.close()
(out/"visual-checks.json").write_text(json.dumps(results,indent=2),encoding="utf-8")
