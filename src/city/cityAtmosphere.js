import * as THREE from "three";

export const ATMOSPHERES = {
  day: {
    label: "Day",
    skyTop: 0x3f86c6, horizon: 0xcfe1ee, fogDensity: 0.00105,
    sun: 0xfff3df, sunIntensity: 2.7, sunDir: [0.45, 0.8, 0.35],
    hemiSky: 0xd6ebff, hemiGround: 0x6b5a3a, hemiIntensity: 1.05, exposure: 1.0, stars: false,
  },
  golden: {
    label: "Golden hour",
    skyTop: 0x4a5f8f, horizon: 0xf2b27a, fogDensity: 0.0012,
    sun: 0xffb169, sunIntensity: 2.5, sunDir: [0.8, 0.32, 0.45],
    hemiSky: 0xffd8a8, hemiGround: 0x5a3b2a, hemiIntensity: 0.85, exposure: 1.05, stars: false,
  },
  night: {
    label: "Night",
    skyTop: 0x02040c, horizon: 0x18244a, fogDensity: 0.0014,
    sun: 0x9fb6ff, sunIntensity: 0.5, sunDir: [-0.4, 0.7, -0.35],
    hemiSky: 0x2f4380, hemiGround: 0x07080d, hemiIntensity: 0.5, exposure: 1.1, stars: true,
  },
};

export function createAtmosphere(scene) {
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      top: { value: new THREE.Color() },
      horizon: { value: new THREE.Color() },
      sunColor: { value: new THREE.Color() },
      sunDir: { value: new THREE.Vector3(0, 1, 0) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 top; uniform vec3 horizon; uniform vec3 sunColor; uniform vec3 sunDir;
      varying vec3 vDir;
      void main() {
        float h = max(vDir.y, 0.0);
        vec3 color = mix(horizon, top, pow(h, 0.55));
        float sun = max(dot(normalize(vDir), normalize(sunDir)), 0.0);
        color += sunColor * (pow(sun, 900.0) * 1.6 + pow(sun, 12.0) * 0.22);
        gl_FragColor = vec4(color, 1.0);
      }`,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(2400, 32, 16), skyMat);
  sky.frustumCulled = false;
  sky.renderOrder = -1;
  scene.add(sky);

  const starCount = 1600;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2, phi = Math.acos(Math.random() * 0.95);
    starPositions.set([Math.sin(phi) * Math.cos(theta) * 2200, Math.cos(phi) * 2200, Math.sin(phi) * Math.sin(theta) * 2200], i * 3);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.85 }));
  stars.frustumCulled = false;
  scene.add(stars);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffffff, 2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.6;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 900;
  scene.add(sun, sun.target);

  scene.fog = new THREE.FogExp2(0xffffff, 0.001);
  const sunDir = new THREE.Vector3();
  let shadowSpan = 0;

  return {
    apply(time, renderer) {
      const a = ATMOSPHERES[time] ?? ATMOSPHERES.golden;
      skyMat.uniforms.top.value.setHex(a.skyTop);
      skyMat.uniforms.horizon.value.setHex(a.horizon);
      skyMat.uniforms.sunColor.value.setHex(a.sun);
      sunDir.fromArray(a.sunDir).normalize();
      skyMat.uniforms.sunDir.value.copy(sunDir);
      scene.fog.color.setHex(a.horizon);
      scene.fog.density = a.fogDensity;
      scene.background = new THREE.Color(a.horizon);
      hemi.color.setHex(a.hemiSky);
      hemi.groundColor.setHex(a.hemiGround);
      hemi.intensity = a.hemiIntensity;
      sun.color.setHex(a.sun);
      sun.intensity = a.sunIntensity;
      stars.visible = a.stars;
      renderer.toneMappingExposure = a.exposure;
    },
    /** Keep the sky centred on the camera and the shadow map focused where the user looks. */
    follow(camera, focus) {
      sky.position.copy(camera.position);
      stars.position.copy(camera.position);
      const span = THREE.MathUtils.clamp(camera.position.distanceTo(focus) * 0.75, 60, 320);
      if (Math.abs(span - shadowSpan) > 4) {
        shadowSpan = span;
        const cam = sun.shadow.camera;
        cam.left = -span; cam.right = span; cam.top = span; cam.bottom = -span;
        cam.updateProjectionMatrix();
      }
      sun.target.position.copy(focus);
      sun.position.copy(focus).addScaledVector(sunDir, 450);
    },
    dispose() {
      sky.geometry.dispose();
      skyMat.dispose();
      starGeo.dispose();
      stars.material.dispose();
      sun.shadow.map?.dispose();
    },
  };
}
