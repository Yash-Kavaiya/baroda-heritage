import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";
import { createMonument } from "../utils/monumentGenerators";
import { disposeObjectTree, fitCameraToBounds } from "../utils/sceneLifecycle";

export default function HeritageCanvas({
  selectedPlace,
  timeOfDay,
  renderMode,
  weather,
  isAutoTour,
  selectedHotspot,
  onHotspotClick,
  onCanvasReady,
  onStatusChange,
}) {
  const mount = useRef(null);
  const runtime = useRef(null);
  const latest = useRef({
    selectedPlace,
    timeOfDay,
    renderMode,
    weather,
    isAutoTour,
    onHotspotClick,
  });
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [hover, setHover] = useState(null);
  useEffect(() => {
    latest.current = {
      selectedPlace,
      timeOfDay,
      renderMode,
      weather,
      isAutoTour,
      onHotspotClick,
    };
  }, [
    selectedPlace,
    timeOfDay,
    renderMode,
    weather,
    isAutoTour,
    onHotspotClick,
  ]);

  useEffect(() => {
    const container = mount.current;
    let renderer;
    onStatusChange?.("loading");
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
      });
    } catch {
      // GPU initialization is an external-system failure, not derived React state.
      // oxlint-disable-next-line react/set-state-in-effect
      setError(true);
      onStatusChange?.("unavailable");
      return;
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 500);
    camera.position.set(22, 21, 37);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const canvas = renderer.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      "Interactive 3D landmark. Arrow keys rotate, plus and minus zoom, R resets.",
    );
    canvas.style.cssText =
      "display:block;touch-action:none;cursor:grab;outline-offset:-4px";
    container.appendChild(canvas);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.minDistance = 4;
    controls.maxDistance = 180;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.autoRotateSpeed = 0.7;
    controls.target.set(0, 6, 0);
    const hemi = new THREE.HemisphereLight(0xfff9ed, 0x829077, 2.7);
    const sun = new THREE.DirectionalLight(0xffe1bb, 3);
    sun.position.set(-18, 28, 22);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, {
      left: -23,
      right: 23,
      top: 23,
      bottom: -23,
      near: 0.5,
      far: 95,
    });
    sun.shadow.normalBias = 0.06;
    const fill = new THREE.DirectionalLight(0xdbe9f3, 1.2);
    fill.position.set(15, 10, -15);
    const model = new THREE.Group();
    const pins = new THREE.Group();
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(110, 110),
      new THREE.ShadowMaterial({ color: 0x555f45, opacity: 0.14 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.06;
    floor.receiveShadow = true;
    scene.add(hemi, sun, fill, model, pins, floor);
    const state = {
      renderer,
      scene,
      camera,
      controls,
      model,
      pins,
      hemi,
      sun,
      fill,
      floor,
      particles: null,
      animated: [],
      lost: false,
      frames: 0,
    };
    runtime.current = state;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const move = (preset, fit = false) => {
      if (!preset) return;
      const view = fit
        ? fitCameraToBounds(new THREE.Box3().setFromObject(model), preset, {
            aspect: camera.aspect,
            fov: camera.fov,
            padding: 1.1,
            oblique: true,
          })
        : preset;
      gsap.to(camera.position, {
        x: view.pos[0],
        y: view.pos[1],
        z: view.pos[2],
        duration: motion.matches ? 0 : 0.8,
        overwrite: true,
        ease: "power3.inOut",
      });
      gsap.to(controls.target, {
        x: view.target[0],
        y: view.target[1],
        z: view.target[2],
        duration: motion.matches ? 0 : 0.8,
        overwrite: true,
        ease: "power3.inOut",
      });
    };
    state.move = move;
    const reset = () =>
      move(latest.current.selectedPlace.cameraPresets.overview, true);
    const zoom = (factor) => {
      gsap.killTweensOf(camera.position);
      const offset = camera.position.clone().sub(controls.target);
      offset.setLength(
        THREE.MathUtils.clamp(
          offset.length() * factor,
          controls.minDistance,
          controls.maxDistance,
        ),
      );
      camera.position.copy(controls.target).add(offset);
      controls.update();
    };
    onCanvasReady?.({
      resetCamera: reset,
      zoom,
      applyCameraPreset: (preset) =>
        move(
          preset,
          preset === latest.current.selectedPlace.cameraPresets.overview,
        ),
      captureSnapshot: () => {
        if (state.lost) return null;
        renderer.render(scene, camera);
        return canvas.toDataURL("image/png");
      },
    });
    const resize = () => {
      const w = container.clientWidth,
        h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (model.children.length) reset();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    const cancelFlight = () =>
      gsap.killTweensOf([camera.position, controls.target]);
    controls.addEventListener("start", cancelFlight);
    const keydown = (event) => {
      if (
        ![
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "+",
          "=",
          "-",
          "r",
          "R",
        ].includes(event.key)
      )
        return;
      event.preventDefault();
      cancelFlight();
      if (["+", "=", "-"].includes(event.key))
        return zoom(event.key === "-" ? 1.15 : 0.85);
      if (event.key.toLowerCase() === "r") return reset();
      const polar = new THREE.Spherical().setFromVector3(
        camera.position.clone().sub(controls.target),
      );
      if (event.key === "ArrowLeft") polar.theta -= 0.12;
      if (event.key === "ArrowRight") polar.theta += 0.12;
      if (event.key === "ArrowUp") polar.phi -= 0.1;
      if (event.key === "ArrowDown") polar.phi += 0.1;
      polar.phi = THREE.MathUtils.clamp(polar.phi, 0.1, controls.maxPolarAngle);
      camera.position
        .copy(controls.target)
        .add(new THREE.Vector3().setFromSpherical(polar));
      controls.update();
    };
    canvas.addEventListener("keydown", keydown);
    const lost = (event) => {
      event.preventDefault();
      state.lost = true;
      setError(true);
      onStatusChange?.("unavailable");
    };
    canvas.addEventListener("webglcontextlost", lost);
    const raycaster = new THREE.Raycaster(),
      mouse = new THREE.Vector2();
    let start = null,
      lastHover = 0;
    const pick = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(mouse, camera);
      return raycaster.intersectObjects(pins.children, true)[0]?.object.userData
        .spot;
    };
    const down = (event) => {
      start = [event.clientX, event.clientY];
    };
    const up = (event) => {
      if (!start) return;
      const distance = Math.hypot(
        start[0] - event.clientX,
        start[1] - event.clientY,
      );
      start = null;
      if (distance > 6) return;
      const spot = pick(event);
      if (spot) latest.current.onHotspotClick?.(spot);
    };
    const pointermove = (event) => {
      if (performance.now() - lastHover < 70) return;
      lastHover = performance.now();
      const spot = pick(event);
      canvas.style.cursor = spot ? "pointer" : "grab";
      if (spot) {
        const rect = canvas.getBoundingClientRect();
        setHover({
          name: spot.name,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      } else setHover(null);
    };
    const leave = () => {
      start = null;
      setHover(null);
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointermove", pointermove);
    canvas.addEventListener("pointerleave", leave);
    let frame,
      previous = performance.now(),
      lastData = 0;
    const beginning = performance.now();
    const animate = (now) => {
      frame = requestAnimationFrame(animate);
      const delta = Math.min((now - previous) / 1000, 0.06);
      previous = now;
      if (state.lost || document.hidden) return;
      const elapsed = (now - beginning) / 1000;
      controls.autoRotate =
        latest.current.isAutoTour && !gsap.isTweening(camera.position);
      controls.update(delta);
      if (!motion.matches) {
        for (const child of state.animated) {
          const data = child.userData;
          if (data.isFloralClock) {
            if (data.minuteHand) data.minuteHand.rotation.y = -elapsed * 0.4;
            if (data.hourHand) data.hourHand.rotation.y = -elapsed * 0.035;
          }
          if (data.isToyTrain) child.rotation.y = elapsed * 0.35;
          if (data.isLakeWater)
            child.position.y = 0.35 + Math.sin(elapsed * 1.8) * 0.025;
          if (data.isRopeway) {
            const p = (Math.sin(elapsed * 0.6) + 1) / 2;
            for (const [c, t] of [
              [data.cabin1, p],
              [data.cabin2, 1 - p],
            ])
              if (c)
                c.position.set(
                  THREE.MathUtils.lerp(7.5, 2.5, t),
                  THREE.MathUtils.lerp(5.2, 10.6, t),
                  THREE.MathUtils.lerp(5.5, 0.5, t),
                );
          }
          if (data.isFountainSpray) {
            const attr = child.geometry.attributes.position;
            for (let i = 0; i < attr.count; i++)
              attr.setY(i, data.baseY[i] + Math.sin(elapsed * 4 + i) * 0.08);
            attr.needsUpdate = true;
          }
        }
        if (state.particles) {
          const attr = state.particles.geometry.attributes.position;
          for (let i = 0; i < attr.count; i++) {
            if (latest.current.weather === "monsoon") {
              let y = attr.getY(i) - delta * 16;
              if (y < 0) y = 26;
              attr.setY(i, y);
            } else {
              attr.setY(
                i,
                state.particles.userData.base[i] + Math.sin(elapsed + i) * 0.3,
              );
            }
          }
          attr.needsUpdate = true;
        }
      }
      renderer.render(scene, camera);
      state.frames++;
      if (now - lastData > 200) {
        Object.assign(canvas.dataset, {
          place: latest.current.selectedPlace.id,
          time: latest.current.timeOfDay,
          mode: latest.current.renderMode,
          weather: latest.current.weather,
          autoTour: String(latest.current.isAutoTour),
          camera: camera.position
            .toArray()
            .map((n) => n.toFixed(3))
            .join(","),
          target: controls.target
            .toArray()
            .map((n) => n.toFixed(3))
            .join(","),
          status: "ready",
          frames: String(state.frames),
          geometries: String(renderer.info.memory.geometries),
          triangles: String(renderer.info.render.triangles),
          particles: String(
            state.particles?.geometry.attributes.position.count ?? 0,
          ),
          weatherSample: String(
            state.particles?.geometry.attributes.position.getY(0) ?? 0,
          ),
          motion: motion.matches ? "reduced" : "full",
        });
        lastData = now;
      }
    };
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      cancelFlight();
      controls.removeEventListener("start", cancelFlight);
      controls.dispose();
      canvas.removeEventListener("keydown", keydown);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointermove", pointermove);
      canvas.removeEventListener("pointerleave", leave);
      disposeObjectTree(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      if (runtime.current === state) runtime.current = null;
      onCanvasReady?.(null);
    };
  }, [retry, onCanvasReady, onStatusChange]);

  useEffect(() => {
    const state = runtime.current;
    if (!state || state.lost) return;
    const { scene, model, pins, hemi, sun, fill } = state;
    const night = timeOfDay === "night",
      blueprint = renderMode === "blueprint";
    scene.background = new THREE.Color(
      blueprint ? 0x14202c : night ? 0x101b2b : 0xf4f1ea,
    );
    scene.fog = new THREE.Fog(scene.background, 100, 240);
    hemi.color.setHex(night ? 0x9aafd1 : 0xfff9ec);
    hemi.groundColor.setHex(night ? 0x303e53 : 0x8c977f);
    hemi.intensity = night ? 1.7 : 2.7;
    sun.color.setHex(
      night ? 0x96b5ec : timeOfDay === "day" ? 0xfff8ed : 0xffd9a6,
    );
    sun.intensity = night ? 1.5 : 2.8;
    fill.intensity = night ? 0.7 : 1.2;
    disposeObjectTree(model);
    model.clear();
    disposeObjectTree(pins);
    pins.clear();
    const monument = createMonument(selectedPlace.id, renderMode, timeOfDay);
    state.animated = [];
    monument.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
      const data = child.userData;
      if (
        data.isFloralClock ||
        data.isToyTrain ||
        data.isLakeWater ||
        data.isRopeway ||
        data.isFountainSpray
      ) {
        state.animated.push(child);
        if (data.isFountainSpray)
          data.baseY = Array.from(
            { length: child.geometry.attributes.position.count },
            (_, i) => child.geometry.attributes.position.getY(i),
          );
      }
    });
    model.add(monument);
    for (const spot of selectedPlace.hotspots) {
      const pin = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 12, 8),
        new THREE.MeshBasicMaterial({ color: 0xba6b43 }),
      );
      pin.position.fromArray(spot.position);
      pin.userData.spot = spot;
      pins.add(pin);
    }
    state.move(selectedPlace.cameraPresets.overview, true);
    state.renderer.render(scene, state.camera);
    onStatusChange?.("ready");
    setHover(null);
  }, [selectedPlace, timeOfDay, renderMode, retry, onStatusChange]);

  useEffect(() => {
    const state = runtime.current;
    if (!state) return;
    if (state.particles) {
      state.scene.remove(state.particles);
      disposeObjectTree(state.particles);
      state.particles = null;
    }
    if (weather === "clear") return;
    const count = weather === "monsoon" ? 700 : 220;
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      values[i * 3] = (Math.random() - 0.5) * 40;
      values[i * 3 + 1] = Math.random() * 26;
      values[i * 3 + 2] = (Math.random() - 0.5) * 36;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(values, 3));
    const points = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: weather === "monsoon" ? 0x7896b3 : 0xc39d55,
        size: weather === "monsoon" ? 0.09 : 0.16,
        transparent: true,
        opacity: 0.7,
      }),
    );
    points.userData.base = Array.from(
      { length: count },
      (_, i) => values[i * 3 + 1],
    );
    state.particles = points;
    state.scene.add(points);
  }, [weather, retry]);

  useEffect(() => {
    if (!selectedHotspot || !runtime.current) return;
    const [x, y, z] = selectedHotspot.position;
    runtime.current.move({ pos: [x + 4, y + 2, z + 6], target: [x, y, z] });
  }, [selectedHotspot, retry]);

  return (
    <div
      ref={mount}
      className="three-canvas"
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {error && (
        <div className="canvas-fallback" role="status">
          <strong>A little more graphics power is needed.</strong>
          <p>
            3D is unavailable in this browser. You can still explore every place
            and its story below.
          </p>
          <button
            type="button"
            onClick={() => {
              setError(false);
              setRetry((value) => value + 1);
            }}
          >
            Retry 3D
          </button>
        </div>
      )}
      {hover && !error && (
        <div
          className="canvas-tooltip"
          style={{ left: hover.x, top: hover.y - 15 }}
        >
          {hover.name}
        </div>
      )}
    </div>
  );
}
