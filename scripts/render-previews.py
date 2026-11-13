"""Render original local 3D models into static WebP collection thumbnails."""
import base64
import io
import os
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
output = root / "public" / "previews"
output.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    page = browser.new_page()
    page.goto(os.environ.get("APP_URL", "http://localhost:5173"), wait_until="domcontentloaded")
    ids = page.evaluate("""async () => { const {VADODARA_PLACES}=await import('/src/data/places.js'); return VADODARA_PLACES.map(p=>p.id); }""")
    for place_id in ids:
        data = page.evaluate("""async (id) => {
            const T = await import('/node_modules/.vite/deps/three.js');
            const { createMonument } = await import('/src/utils/monumentGenerators.js');
            const renderer = new T.WebGLRenderer({antialias:true, preserveDrawingBuffer:true});
            renderer.setSize(640,440); renderer.setPixelRatio(1);
            renderer.setClearColor(0xeae8dc); renderer.outputColorSpace=T.SRGBColorSpace;
            renderer.toneMapping=T.ACESFilmicToneMapping; renderer.toneMappingExposure=1.15;
            const scene = new T.Scene(); const model=createMonument(id,'realistic','day'); scene.add(model);
            scene.add(new T.HemisphereLight(0xfff8e8,0x858c77,2.7));
            const light=new T.DirectionalLight(0xffe0b7,3.2); light.position.set(12,24,20); scene.add(light);
            const box=new T.Box3().setFromObject(model); const sphere=box.getBoundingSphere(new T.Sphere());
            const camera = new T.PerspectiveCamera(40,640/440,.1,500);
            camera.position.copy(sphere.center).add(new T.Vector3(.65,.62,1).normalize().multiplyScalar(sphere.radius*3.05));
            camera.lookAt(sphere.center); renderer.render(scene,camera);
            const data=renderer.domElement.toDataURL('image/png');
            const resources=new Set(); scene.traverse(o=>{if(o.geometry)resources.add(o.geometry); if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>resources.add(m));});
            resources.forEach(r=>r.dispose()); renderer.dispose(); renderer.forceContextLoss(); return data;
        }""", place_id)
        image = Image.open(io.BytesIO(base64.b64decode(data.split(",",1)[1])))
        image.save(output / f"{place_id}.webp", "WEBP", quality=86)
        print(place_id, image.size, flush=True)
    browser.close()
print(f"Rendered {len(ids)} original landmark previews into {output}")
