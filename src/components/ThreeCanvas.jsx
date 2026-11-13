import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";
import { createMonument } from "../utils/monumentGenerators";

export default function ThreeCanvas({
  selectedPlace,
  timeOfDay,
  renderMode,
  weather,
  isAutoTour,
  selectedHotspot,
  onHotspotClick,
  onCanvasReady
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const monumentGroupRef = useRef(null);
  const hotspotsGroupRef = useRef(null);
  const weatherParticlesRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const dirLightRef = useRef(null);
  const hemiLightRef = useRef(null);
  const isAutoTourRef = useRef(isAutoTour);
  const selectedPlaceRef = useRef(selectedPlace);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);

  // Keep refs in sync with props so animation loop always sees latest values
  useEffect(() => { isAutoTourRef.current = isAutoTour; }, [isAutoTour]);
  useEffect(() => { selectedPlaceRef.current = selectedPlace; }, [selectedPlace]);

  // Time of day lighting configurations
  const getLightingConfig = useCallback((time) => {
    switch (time) {
      case "golden":
        return {
          bgColor: 0x2d1b2e,
          fogColor: 0xe07a5f,
          sunColor: 0xf97316,
          sunIntensity: 2.2,
          sunPos: [20, 8, 18],
          hemiSky: 0xfde047,
          hemiGround: 0x78350f,
          hemiIntensity: 0.9
        };
      case "sunset":
        return {
          bgColor: 0x1e152a,
          fogColor: 0xa855f7,
          sunColor: 0xf43f5e,
          sunIntensity: 1.8,
          sunPos: [-22, 5, 14],
          hemiSky: 0xf472b6,
          hemiGround: 0x312e81,
          hemiIntensity: 0.7
        };
      case "night":
        return {
          bgColor: 0x050814,
          fogColor: 0x0b112c,
          sunColor: 0x93c5fd,
          sunIntensity: 0.5,
          sunPos: [-12, 18, -12],
          hemiSky: 0x1e1b4b,
          hemiGround: 0x030712,
          hemiIntensity: 0.4
        };
      case "navratri":
        return {
          bgColor: 0x140428,
          fogColor: 0x3b0764,
          sunColor: 0xf43f5e,
          sunIntensity: 2.2,
          sunPos: [5, 18, 14],
          hemiSky: 0xc084fc,
          hemiGround: 0x581c87,
          hemiIntensity: 1.3
        };
      case "day":
      default:
        return {
          bgColor: 0x87ceeb,
          fogColor: 0xdbeafe,
          sunColor: 0xfff7ed,
          sunIntensity: 2.4,
          sunPos: [18, 26, 16],
          hemiSky: 0xbae6fd,
          hemiGround: 0x475569,
          hemiIntensity: 1.0
        };
    }
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 10, 22);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go below ground
    controls.minDistance = 4;
    controls.maxDistance = 55;
    controls.target.set(0, 3, 0);
    controlsRef.current = controls;

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemiLight.position.set(0, 40, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(15, 25, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 80;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Monument Group
    const monumentGroup = new THREE.Group();
    scene.add(monumentGroup);
    monumentGroupRef.current = monumentGroup;

    // Hotspots Group
    const hotspotsGroup = new THREE.Group();
    scene.add(hotspotsGroup);
    hotspotsGroupRef.current = hotspotsGroup;

    // Starfield for night
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 150;
      starPos[i * 3 + 1] = 15 + Math.random() * 80;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 150;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.6,
      transparent: true,
      opacity: 0.8
    });
    const starField = new THREE.Points(starGeo, starMat);
    starField.userData = { isStarField: true };
    scene.add(starField);

    // Provide canvas snapshot handler to parent
    if (onCanvasReady) {
      onCanvasReady({
        captureSnapshot: () => renderer.domElement.toDataURL("image/png"),
        resetCamera: () => {
          const place = selectedPlaceRef.current;
          if (place?.cameraPresets?.overview) {
            const { pos, target } = place.cameraPresets.overview;
            gsap.to(camera.position, {
              x: pos[0], y: pos[1], z: pos[2],
              duration: 1.5, ease: "power2.inOut"
            });
            gsap.to(controls.target, {
              x: target[0], y: target[1], z: target[2],
              duration: 1.5, ease: "power2.inOut"
            });
          }
        },
        setCourtyardWalk: () => {
          gsap.to(camera.position, {
            x: 0, y: 1.8, z: 9.5,
            duration: 1.8, ease: "power2.inOut"
          });
          gsap.to(controls.target, {
            x: 0, y: 2.5, z: 0,
            duration: 1.8, ease: "power2.inOut"
          });
        },
        applyPreset: (presetKey) => {
          const place = selectedPlaceRef.current;
          const preset = place?.cameraPresets?.[presetKey];
          if (!preset) return;
          const { pos, target } = preset;
          gsap.to(camera.position, {
            x: pos[0], y: pos[1], z: pos[2],
            duration: 1.8, ease: "power3.inOut"
          });
          gsap.to(controls.target, {
            x: target[0], y: target[1], z: target[2],
            duration: 1.8, ease: "power3.inOut"
          });
        }
      });
    }

    // Resize listener
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let prevTime = performance.now();
    let startTime = performance.now();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const currentTime = performance.now();
      const delta = Math.min((currentTime - prevTime) / 1000, 0.1);
      const elapsedTime = (currentTime - startTime) / 1000;
      prevTime = currentTime;

      // Auto tour camera orbit
      if (isAutoTourRef.current && controlsRef.current && cameraRef.current) {
        const radius = 22;
        const speed = 0.25;
        cameraRef.current.position.x = Math.sin(elapsedTime * speed) * radius;
        cameraRef.current.position.z = Math.cos(elapsedTime * speed) * radius;
        cameraRef.current.position.y = 8 + Math.sin(elapsedTime * 0.4) * 2;
        controlsRef.current.target.set(0, 3.5, 0);
      }

      controls.update();

      // Animate Monument-specific mechanics
      if (monumentGroupRef.current) {
        monumentGroupRef.current.traverse((child) => {
          // Sayaji Baug floral clock hands
          if (child.userData?.isFloralClock) {
            if (child.userData.minuteHand) {
              child.userData.minuteHand.rotation.y = -elapsedTime * 0.4;
            }
            if (child.userData.hourHand) {
              child.userData.hourHand.rotation.y = -elapsedTime * 0.035;
            }
          }

          // Sayaji Baug Toy Train moving on track loop
          if (child.userData?.isToyTrain) {
            child.rotation.y = elapsedTime * 0.35;
          }

          // Sursagar Lake Water Waves
          if (child.userData?.isLakeWater) {
            child.position.y = 0.35 + Math.sin(elapsedTime * 1.8) * 0.04;
          }

          // Pavagadh Cable Car Ropeway
          if (child.userData?.isRopeway) {
            const { cabin1, cabin2 } = child.userData;
            const progress = (Math.sin(elapsedTime * 0.6) + 1) / 2; // 0 to 1
            if (cabin1) {
              cabin1.position.x = THREE.MathUtils.lerp(7.5, 2.5, progress);
              cabin1.position.y = THREE.MathUtils.lerp(5.2, 10.6, progress);
              cabin1.position.z = THREE.MathUtils.lerp(5.5, 0.5, progress);
            }
            if (cabin2) {
              cabin2.position.x = THREE.MathUtils.lerp(2.5, 7.5, progress);
              cabin2.position.y = THREE.MathUtils.lerp(10.6, 5.2, progress);
              cabin2.position.z = THREE.MathUtils.lerp(0.5, 5.5, progress);
            }
          }

          // Palace Fountain Water Spray
          if (child.userData?.isFountainSpray) {
            const posAttr = child.geometry.attributes.position;
            for (let i = 0; i < posAttr.count; i++) {
              let y = posAttr.getY(i);
              y += Math.sin(elapsedTime * 4 + i) * 0.015;
              posAttr.setY(i, y);
            }
            posAttr.needsUpdate = true;
          }
        });
      }

      // Animate Weather Particles
      if (weatherParticlesRef.current) {
        const pGeo = weatherParticlesRef.current.geometry;
        const positions = pGeo.attributes.position.array;
        const isRain = weather === "monsoon";

        for (let i = 0; i < positions.length / 3; i++) {
          if (isRain) {
            positions[i * 3 + 1] -= delta * 24; // fall down
            if (positions[i * 3 + 1] < 0) {
              positions[i * 3 + 1] = 30;
            }
          } else {
            // Festive Diya / Petals floating gently
            positions[i * 3 + 1] += Math.sin(elapsedTime + i) * 0.015;
            positions[i * 3] += Math.cos(elapsedTime * 0.5 + i) * 0.015;
          }
        }
        pGeo.attributes.position.needsUpdate = true;
      }

      // Animate Hotspot Beacons
      if (hotspotsGroupRef.current) {
        hotspotsGroupRef.current.children.forEach((beacon, idx) => {
          const ring = beacon.children[1];
          if (ring) {
            const scale = 1 + Math.sin(elapsedTime * 3 + idx) * 0.25;
            ring.scale.set(scale, scale, scale);
          }
          beacon.position.y += Math.sin(elapsedTime * 2 + idx) * 0.002;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [getLightingConfig, onCanvasReady]);

  // Update Lighting and Environment when timeOfDay or renderMode changes
  useEffect(() => {
    if (!sceneRef.current || !dirLightRef.current || !hemiLightRef.current) return;
    const scene = sceneRef.current;
    const dirLight = dirLightRef.current;
    const hemiLight = hemiLightRef.current;

    const config = getLightingConfig(timeOfDay);

    if (renderMode === "blueprint") {
      scene.background = new THREE.Color(0x0f172a);
      scene.fog = new THREE.FogExp2(0x0f172a, 0.02);
      dirLight.color.setHex(0x60a5fa);
      dirLight.intensity = 1.0;
      hemiLight.color.setHex(0x3b82f6);
      hemiLight.intensity = 0.8;
    } else {
      scene.background = new THREE.Color(config.bgColor);
      scene.fog = new THREE.FogExp2(config.fogColor, timeOfDay === "night" ? 0.022 : 0.012);

      dirLight.color.setHex(config.sunColor);
      dirLight.intensity = config.sunIntensity;
      dirLight.position.set(...config.sunPos);

      hemiLight.color.setHex(config.hemiSky);
      hemiLight.groundColor.setHex(config.hemiGround);
      hemiLight.intensity = config.hemiIntensity;
    }

    // Toggle starfield visibility based on time of day
    scene.traverse((child) => {
      if (child.userData?.isStarField) {
        child.visible = timeOfDay === "night" || timeOfDay === "sunset";
      }
    });
  }, [timeOfDay, renderMode, getLightingConfig]);

  // Re-generate 3D Monument when selectedPlace or renderMode changes
  useEffect(() => {
    if (!monumentGroupRef.current || !selectedPlace) return;
    const group = monumentGroupRef.current;

    // Clear old monument meshes safely
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
        else child.material.dispose();
      }
    }

    // Generate new 3D Monument
    const newMonument = createMonument(selectedPlace.id, renderMode, timeOfDay);
    group.add(newMonument);

    // Initial entrance bounce/scale animation
    group.scale.set(0.001, 0.001, 0.001);
    gsap.to(group.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.2,
      ease: "back.out(1.4)"
    });

    // Reset camera to place default preset
    if (cameraRef.current && controlsRef.current && selectedPlace.cameraPresets?.overview) {
      const { pos, target } = selectedPlace.cameraPresets.overview;
      gsap.to(cameraRef.current.position, {
        x: pos[0],
        y: pos[1],
        z: pos[2],
        duration: 1.8,
        ease: "power2.inOut"
      });
      gsap.to(controlsRef.current.target, {
        x: target[0],
        y: target[1],
        z: target[2],
        duration: 1.8,
        ease: "power2.inOut"
      });
    }
  }, [selectedPlace, renderMode, timeOfDay]);

  // Build Interactive 3D Hotspot Pins
  useEffect(() => {
    if (!hotspotsGroupRef.current || !selectedPlace?.hotspots) return;
    const group = hotspotsGroupRef.current;

    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
    }

    selectedPlace.hotspots.forEach((spot) => {
      const beacon = new THREE.Group();
      beacon.position.set(...spot.position);
      beacon.userData = { hotspotData: spot };

      // Core Glowing Sphere
      const sphereMat = new THREE.MeshBasicMaterial({
        color: selectedPlace.colorTheme || 0xf59e0b
      });
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), sphereMat);
      beacon.add(sphere);

      // Pulsing outer ripple ring
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.65, 24), ringMat);
      ring.rotation.x = Math.PI / 2;
      beacon.add(ring);

      group.add(beacon);
    });
  }, [selectedPlace]);

  // Handle Hotspot camera focus when selectedHotspot changes
  useEffect(() => {
    if (!selectedHotspot || !cameraRef.current || !controlsRef.current) return;
    const [hx, hy, hz] = selectedHotspot.position;

    gsap.to(controlsRef.current.target, {
      x: hx,
      y: hy,
      z: hz,
      duration: 1.4,
      ease: "power2.inOut"
    });

    gsap.to(cameraRef.current.position, {
      x: hx + 3.5,
      y: hy + 2.0,
      z: hz + 5.0,
      duration: 1.6,
      ease: "power2.inOut"
    });
  }, [selectedHotspot]);

  // Weather Particles (Monsoon Rain or Festive Confetti/Lanterns)
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    if (weatherParticlesRef.current) {
      scene.remove(weatherParticlesRef.current);
      weatherParticlesRef.current = null;
    }

    if (weather === "clear") return;

    const count = weather === "monsoon" ? 1200 : 350;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = Math.random() * 28;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 45;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const pMat = new THREE.PointsMaterial({
      color: weather === "monsoon" ? 0x93c5fd : 0xfbbf24,
      size: weather === "monsoon" ? 0.22 : 0.45,
      transparent: true,
      opacity: 0.75
    });

    const particles = new THREE.Points(geo, pMat);
    scene.add(particles);
    weatherParticlesRef.current = particles;
  }, [weather]);

  // Raycaster for 3D Hotspot Hover and Click
  const handlePointerDown = (event) => {
    if (!hotspotsGroupRef.current || !cameraRef.current || !rendererRef.current) return;
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(hotspotsGroupRef.current.children, true);
    if (intersects.length > 0) {
      let current = intersects[0].object;
      while (current && !current.userData?.hotspotData) {
        current = current.parent;
      }
      if (current?.userData?.hotspotData) {
        onHotspotClick(current.userData.hotspotData);
      }
    }
  };

  const handlePointerMove = (event) => {
    if (!hotspotsGroupRef.current || !cameraRef.current || !rendererRef.current) return;
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(hotspotsGroupRef.current.children, true);
    if (intersects.length > 0) {
      let current = intersects[0].object;
      while (current && !current.userData?.hotspotData) {
        current = current.parent;
      }
      if (current?.userData?.hotspotData) {
        setHoveredHotspot({
          name: current.userData.hotspotData.name,
          x: event.clientX,
          y: event.clientY
        });
        rendererRef.current.domElement.style.cursor = "pointer";
        return;
      }
    }
    setHoveredHotspot(null);
    rendererRef.current.domElement.style.cursor = "default";
  };

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full overflow-hidden select-none bg-slate-950"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      {/* 3D Hotspot Hover Tooltip */}
      {hoveredHotspot && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full px-3 py-1.5 rounded-lg bg-slate-900/90 text-white text-xs font-semibold shadow-xl border border-amber-500/40 backdrop-blur-md transition-all duration-75 flex items-center gap-1.5"
          style={{
            left: `${hoveredHotspot.x}px`,
            top: `${hoveredHotspot.y - 12}px`
          }}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
          <span>{hoveredHotspot.name}</span>
          <span className="text-amber-400 text-[10px] font-mono">(Click to zoom)</span>
        </div>
      )}
    </div>
  );
}
