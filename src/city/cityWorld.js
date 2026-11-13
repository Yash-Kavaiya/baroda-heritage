import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { createMonument } from "../utils/monumentGenerators.js";
import { disposeObjectTree } from "../utils/sceneLifecycle.js";
import { VADODARA_PLACES } from "../data/places.js";
import {
  CITY_BOUNDS,
  LANDMARK_LAYOUT,
  PARKS,
  RIVER_CURVE,
  RIVER_WIDTH,
  ROADS,
  distanceToPolyline,
  isBuildable,
  isInPark,
} from "./cityLayout.js";

const PAVAGADH = LANDMARK_LAYOUT["pavagadh-champaner"].position;

function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash2(x, z) {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function valueNoise(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z);
  const xf = x - xi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = zf * zf * (3 - 2 * zf);
  const a = hash2(xi, zi), b = hash2(xi + 1, zi), c = hash2(xi, zi + 1), d = hash2(xi + 1, zi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

const smoothstep = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function cityEdgeDistance(x, z) {
  const midX = (CITY_BOUNDS.minX + CITY_BOUNDS.maxX) / 2;
  const midZ = (CITY_BOUNDS.minZ + CITY_BOUNDS.maxZ) / 2;
  const halfW = (CITY_BOUNDS.maxX - CITY_BOUNDS.minX) / 2;
  const halfH = (CITY_BOUNDS.maxZ - CITY_BOUNDS.minZ) / 2;
  return Math.max(Math.abs(x - midX) - halfW, Math.abs(z - midZ) - halfH);
}

/** Flat strip following a 2D polyline, facing +Y. */
function ribbonGeometry(points, width, y) {
  const positions = [], uvs = [], indices = [];
  let along = 0;
  for (let i = 0; i < points.length; i++) {
    const prev = points[Math.max(0, i - 1)], next = points[Math.min(points.length - 1, i + 1)];
    let dx = next[0] - prev[0], dz = next[1] - prev[1];
    const len = Math.hypot(dx, dz) || 1;
    dx /= len; dz /= len;
    const nx = -dz, nz = dx;
    const [x, z] = points[i];
    if (i > 0) along += Math.hypot(x - points[i - 1][0], z - points[i - 1][1]);
    positions.push(x + nx * width / 2, y, z + nz * width / 2, x - nx * width / 2, y, z - nz * width / 2);
    uvs.push(0, along / width, 1, along / width);
    if (i < points.length - 1) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/** Walk a polyline at a fixed spacing, yielding position, unit direction and distance. */
function* walkPolyline(points, spacing) {
  let offset = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const [ax, az] = points[i], [bx, bz] = points[i + 1];
    const len = Math.hypot(bx - ax, bz - az);
    if (len === 0) continue;
    const dx = (bx - ax) / len, dz = (bz - az) / len;
    let s = offset;
    for (; s < len; s += spacing) yield { x: ax + dx * s, z: az + dz * s, dx, dz };
    offset = s - len;
  }
}

function buildPolylineTrack(points) {
  const segments = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const [ax, az] = points[i], [bx, bz] = points[i + 1];
    const len = Math.hypot(bx - ax, bz - az);
    segments.push({ ax, az, dx: (bx - ax) / len, dz: (bz - az) / len, start: total, len });
    total += len;
  }
  return { segments, length: total };
}

function sampleTrack(track, s) {
  for (const seg of track.segments) {
    if (s <= seg.start + seg.len) {
      const local = s - seg.start;
      return { x: seg.ax + seg.dx * local, z: seg.az + seg.dz * local, dx: seg.dx, dz: seg.dz };
    }
  }
  const last = track.segments[track.segments.length - 1];
  return { x: last.ax + last.dx * last.len, z: last.az + last.dz * last.len, dx: last.dx, dz: last.dz };
}

function facadeTextures(rows, cols, seed) {
  const rng = mulberry32(seed);
  const size = 128;
  const make = () => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    return canvas;
  };
  const colorCanvas = make(), glowCanvas = make();
  const c = colorCanvas.getContext("2d"), g = glowCanvas.getContext("2d");
  c.fillStyle = "#ffffff";
  c.fillRect(0, 0, size, size);
  g.fillStyle = "#000000";
  g.fillRect(0, 0, size, size);
  const cw = size / cols, rh = size / rows;
  for (let r = 0; r < rows; r++) {
    for (let k = 0; k < cols; k++) {
      const x = k * cw + cw * 0.22, y = r * rh + rh * 0.25, w = cw * 0.56, h = rh * 0.5;
      c.fillStyle = "#4a5260";
      c.fillRect(x, y, w, h);
      c.fillStyle = "#d9d2c3";
      c.fillRect(x - 2, y + h, w + 4, 3);
      if (rng() < 0.55) {
        g.fillStyle = rng() < 0.8 ? "#ffcf7a" : "#bfe3ff";
        g.fillRect(x, y, w, h);
      }
    }
  }
  const toTexture = (canvas) => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  };
  return { map: toTexture(colorCanvas), emissiveMap: toTexture(glowCanvas) };
}

const OLD_CITY_PALETTE = [0xf1e3c8, 0xf6f1e7, 0xf3d27a, 0xe8b4a6, 0xa9c8de, 0xd98f5f, 0xb5d6b2, 0xe7c9a0];
const MODERN_PALETTE = [0xe8edf2, 0xc9d6e2, 0xdfd8cc, 0x9fb4c8, 0xf2efe8, 0xb8c4cc];
const TREE_GREENS = [0x2f6b2a, 0x3d7a32, 0x4a8a3a, 0x356b3f, 0x5b8f3a, 0x2b5e33];
const FIELD_COLORS = [0x7a9a4a, 0x93a85a, 0xb8a466, 0x6f8f3f, 0xa58f5a, 0x5e7f3a, 0x88a050];

function buildGround(root) {
  const size = 2800, seg = 200;
  const geo = new THREE.PlaneGeometry(size, size, seg, seg);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const color = new THREE.Color(), urban = new THREE.Color(0xb3a68e), grass = new THREE.Color(0x4f8a3a), bank = new THREE.Color(0x6b7f45);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const edge = cityEdgeDistance(x, z);
    const urbanMix = 1 - smoothstep(-30, 25, edge);
    const field = FIELD_COLORS[Math.floor(hash2(Math.floor(x / 46), Math.floor(z / 46)) * FIELD_COLORS.length)];
    color.setHex(field).multiplyScalar(0.85 + valueNoise(x / 25, z / 25) * 0.3);
    color.lerp(urban.clone().multiplyScalar(0.92 + valueNoise(x / 12, z / 12) * 0.14), urbanMix);
    if (isInPark(x, z, 4)) color.lerp(grass, 0.9);
    const riverDist = distanceToPolyline(x, z, RIVER_CURVE);
    if (riverDist < RIVER_WIDTH / 2 + 12) color.lerp(bank, 0.7);
    colors.set([color.r, color.g, color.b], i * 3);

    let roadDist = Infinity;
    for (const road of ROADS) roadDist = Math.min(roadDist, distanceToPolyline(x, z, road.points));
    const rural = smoothstep(40, 170, edge) * smoothstep(RIVER_WIDTH, RIVER_WIDTH + 40, riverDist) * smoothstep(8, 30, roadDist);
    pos.setY(i, (valueNoise(x / 90, z / 90) - 0.45) * 9 * rural);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const ground = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 }));
  ground.receiveShadow = true;
  root.add(ground);
}

function buildRiver(root, mats) {
  const bank = new THREE.Mesh(ribbonGeometry(RIVER_CURVE, RIVER_WIDTH + 7, 0.04), mats.riverBank);
  bank.receiveShadow = true;
  const water = new THREE.Mesh(ribbonGeometry(RIVER_CURVE, RIVER_WIDTH, 0.09), mats.water);
  water.receiveShadow = true;
  root.add(bank, water);
}

function buildRoads(root, mats, rng) {
  const dashes = [], posts = [], lamps = [];
  for (const road of ROADS) {
    const mesh = new THREE.Mesh(ribbonGeometry(road.points, road.width, 0.14), mats.asphalt);
    mesh.receiveShadow = true;
    root.add(mesh);

    let bridge = null;
    for (const step of walkPolyline(road.points, 1.5)) {
      const overRiver = distanceToPolyline(step.x, step.z, RIVER_CURVE) < RIVER_WIDTH / 2 + 3;
      if (overRiver) {
        bridge ??= { start: step, end: step };
        bridge.end = step;
        for (const side of [-1, 1]) {
          posts.push([step.x - step.dz * side * (road.width / 2 + 0.3), step.z + step.dx * side * (road.width / 2 + 0.3)]);
        }
      } else if (bridge) {
        addBridgeDeck(root, mats, bridge, road.width);
        bridge = null;
      }
    }
    for (const step of walkPolyline(road.points, 7)) {
      dashes.push(step);
    }
    for (const step of walkPolyline(road.points, 18)) {
      if (distanceToPolyline(step.x, step.z, RIVER_CURVE) < RIVER_WIDTH / 2 + 6) continue;
      if (cityEdgeDistance(step.x, step.z) > 10 && road.name !== "Halol Highway") continue;
      for (const side of [-1, 1]) {
        const off = road.width / 2 + 1.2;
        const x = step.x - step.dz * side * off, z = step.z + step.dx * side * off;
        if (rng() < 0.85) lamps.push([x, z]);
      }
    }
  }

  const dummy = new THREE.Object3D();
  const dashMesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.35, 2.6).rotateX(-Math.PI / 2), mats.roadPaint, dashes.length);
  dashes.forEach((d, i) => {
    dummy.position.set(d.x, 0.17, d.z);
    dummy.rotation.set(0, Math.atan2(d.dx, d.dz), 0);
    dummy.updateMatrix();
    dashMesh.setMatrixAt(i, dummy.matrix);
  });
  root.add(dashMesh);

  const postMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.3, 1.1, 0.3).translate(0, 0.55, 0), mats.railing, posts.length);
  posts.forEach(([x, z], i) => {
    dummy.position.set(x, 0.5, z);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    postMesh.setMatrixAt(i, dummy.matrix);
  });
  postMesh.castShadow = true;
  root.add(postMesh);

  const poleMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.08, 0.12, 5, 5).translate(0, 2.5, 0), mats.metal, lamps.length);
  const bulbMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.34, 8, 6), mats.lampBulb, lamps.length);
  lamps.forEach(([x, z], i) => {
    dummy.position.set(x, 0, z);
    dummy.updateMatrix();
    poleMesh.setMatrixAt(i, dummy.matrix);
    dummy.position.set(x, 5.15, z);
    dummy.updateMatrix();
    bulbMesh.setMatrixAt(i, dummy.matrix);
  });
  root.add(poleMesh, bulbMesh);
}

function addBridgeDeck(root, mats, bridge, width) {
  const dx = bridge.end.x - bridge.start.x, dz = bridge.end.z - bridge.start.z;
  const len = Math.hypot(dx, dz) + 4;
  const deck = new THREE.Mesh(new THREE.BoxGeometry(width + 1.2, 0.6, len), mats.bridge);
  deck.position.set((bridge.start.x + bridge.end.x) / 2, -0.18, (bridge.start.z + bridge.end.z) / 2);
  deck.rotation.y = Math.atan2(bridge.start.dx, bridge.start.dz);
  deck.castShadow = true;
  root.add(deck);
}

function buildBuildings(root, mats, rng, occupied) {
  const classes = { low: [], mid: [], tall: [] };
  const tanks = [];
  const towerZones = [[-150, 70, 45], [160, 115, 40], [150, -120, 35], [-150, -200, 30]];
  const oldCity = [70, -15, 75];
  const spacing = 8.5;
  for (let x = CITY_BOUNDS.minX; x <= CITY_BOUNDS.maxX; x += spacing) {
    for (let z = CITY_BOUNDS.minZ; z <= CITY_BOUNDS.maxZ; z += spacing) {
      const jx = x + (rng() - 0.5) * 2, jz = z + (rng() - 0.5) * 2;
      const inOld = Math.hypot(jx - oldCity[0], jz - oldCity[1]) < oldCity[2];
      const inTower = towerZones.some(([tx, tz, r]) => Math.hypot(jx - tx, jz - tz) < r);
      const r = Math.hypot(jx - 20, jz);
      const chance = inOld ? 0.96 : Math.max(0.25, 0.92 - r / 430);
      if (rng() > chance) continue;
      const w = 4 + rng() * 2.6, d = 4 + rng() * 2.6;
      if (!isBuildable(jx, jz, Math.max(w, d) / 2)) continue;
      let h;
      if (inTower && rng() < 0.65) h = 16 + rng() * 24;
      else if (inOld) h = 3.5 + rng() * 6;
      else h = rng() < 0.12 ? 9 + rng() * 7 : 3.5 + rng() * 7;
      const palette = h > 14 ? MODERN_PALETTE : OLD_CITY_PALETTE;
      const entry = { x: jx, z: jz, w, d, h, color: palette[Math.floor(rng() * palette.length)] };
      (h < 7 ? classes.low : h < 14 ? classes.mid : classes.tall).push(entry);
      if (h < 14 && rng() < 0.45) tanks.push([jx + (rng() - 0.5) * (w - 1.5), h, jz + (rng() - 0.5) * (d - 1.5)]);
      for (let ox = -w / 2; ox <= w / 2; ox += 2) {
        for (let oz = -d / 2; oz <= d / 2; oz += 2) occupied.add(`${Math.round((jx + ox) / 2)},${Math.round((jz + oz) / 2)}`);
      }
    }
  }

  const box = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  for (const [key, list] of Object.entries(classes)) {
    const wall = mats.facades[key];
    const mesh = new THREE.InstancedMesh(box, [wall, wall, mats.roof, mats.roof, wall, wall], list.length);
    list.forEach((b, i) => {
      dummy.position.set(b.x, 0, b.z);
      dummy.scale.set(b.w, b.h, b.d);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, color.setHex(b.color));
    });
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
  }

  const tankMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.55, 0.55, 1.1, 10).translate(0, 0.55, 0), mats.tank, tanks.length);
  tanks.forEach(([x, y, z], i) => {
    dummy.position.set(x, y, z);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    tankMesh.setMatrixAt(i, dummy.matrix);
  });
  tankMesh.castShadow = true;
  root.add(tankMesh);
}

function buildTrees(root, mats, rng, occupied) {
  const trees = [];
  const free = (x, z) => {
    if (occupied.has(`${Math.round(x / 2)},${Math.round(z / 2)}`)) return false;
    for (const id in LANDMARK_LAYOUT) {
      const { position, footprint } = LANDMARK_LAYOUT[id];
      if (Math.hypot(x - position[0], z - position[2]) < footprint + 2) return false;
    }
    if (distanceToPolyline(x, z, RIVER_CURVE) < RIVER_WIDTH / 2 + 1.5) return false;
    return ROADS.every((road) => distanceToPolyline(x, z, road.points) > road.width / 2 + 1.5);
  };
  const plant = (x, z, size = 1) => {
    if (free(x, z)) trees.push({ x, z, size: size * (0.8 + rng() * 0.7), tint: TREE_GREENS[Math.floor(rng() * TREE_GREENS.length)] });
  };

  for (const { center, radius } of PARKS) {
    const count = Math.round(radius * radius * 0.06);
    for (let i = 0; i < count; i++) {
      const a = rng() * Math.PI * 2, r = Math.sqrt(rng()) * radius;
      plant(center[0] + Math.cos(a) * r, center[1] + Math.sin(a) * r, 1.3);
    }
  }
  for (const step of walkPolyline(RIVER_CURVE, 3)) {
    for (const side of [-1, 1]) {
      if (rng() < 0.7) {
        const off = RIVER_WIDTH / 2 + 3 + rng() * 9;
        plant(step.x - step.dz * side * off, step.z + step.dx * side * off, 1.2);
      }
    }
  }
  for (const road of ROADS) {
    for (const step of walkPolyline(road.points, 11)) {
      for (const side of [-1, 1]) {
        if (rng() < 0.5) {
          const off = road.width / 2 + 3.4;
          plant(step.x - step.dz * side * off, step.z + step.dx * side * off);
        }
      }
    }
  }
  for (let i = 0; i < 700; i++) {
    plant(CITY_BOUNDS.minX + rng() * (CITY_BOUNDS.maxX - CITY_BOUNDS.minX), CITY_BOUNDS.minZ + rng() * (CITY_BOUNDS.maxZ - CITY_BOUNDS.minZ));
  }
  for (let i = 0; i < 9000 && trees.length < 4200; i++) {
    const a = rng() * Math.PI * 2, r = 250 + rng() * 900;
    const x = 20 + Math.cos(a) * r, z = Math.sin(a) * r;
    if (cityEdgeDistance(x, z) < 15) continue;
    if (Math.hypot(x - PAVAGADH[0], z - PAVAGADH[2]) < 78) continue;
    if (valueNoise(x / 70, z / 70) < 0.58) continue;
    plant(x, z, 1.4);
  }

  const trunkMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.2, 0.32, 1.8, 5).translate(0, 0.9, 0), mats.trunk, trees.length);
  const crownMesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), mats.foliage, trees.length);
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  trees.forEach((t, i) => {
    const y = groundHeightAt(t.x, t.z);
    dummy.position.set(t.x, y, t.z);
    dummy.rotation.set(0, rng() * Math.PI, 0);
    dummy.scale.set(t.size, t.size, t.size);
    dummy.updateMatrix();
    trunkMesh.setMatrixAt(i, dummy.matrix);
    dummy.position.set(t.x, y + 1.8 * t.size + 1.1 * t.size, t.z);
    dummy.scale.set(t.size * 1.7, t.size * 1.45, t.size * 1.7);
    dummy.updateMatrix();
    crownMesh.setMatrixAt(i, dummy.matrix);
    crownMesh.setColorAt(i, color.setHex(t.tint));
  });
  trunkMesh.castShadow = true;
  crownMesh.castShadow = true;
  crownMesh.receiveShadow = true;
  root.add(trunkMesh, crownMesh);
}

/** Mirrors the terrain displacement in buildGround so trees sit on the hills. */
function groundHeightAt(x, z) {
  const edge = cityEdgeDistance(x, z);
  if (edge < 40) return 0;
  const riverDist = distanceToPolyline(x, z, RIVER_CURVE);
  let roadDist = Infinity;
  for (const road of ROADS) roadDist = Math.min(roadDist, distanceToPolyline(x, z, road.points));
  const rural = smoothstep(40, 170, edge) * smoothstep(RIVER_WIDTH, RIVER_WIDTH + 40, riverDist) * smoothstep(8, 30, roadDist);
  return (valueNoise(x / 90, z / 90) - 0.45) * 9 * rural - 0.15;
}

function buildHills(root, mats, rng) {
  const toPavagadh = Math.atan2(PAVAGADH[2], PAVAGADH[0]);
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + rng() * 0.2;
    if (Math.abs(Math.atan2(Math.sin(a - toPavagadh), Math.cos(a - toPavagadh))) < 0.35) continue;
    const r = 1150 + rng() * 150;
    const hill = new THREE.Mesh(new THREE.ConeGeometry(120 + rng() * 150, 30 + rng() * 45, 7), mats.hill);
    hill.position.set(Math.cos(a) * r, 10, Math.sin(a) * r);
    hill.rotation.y = rng() * Math.PI;
    root.add(hill);
  }
  for (const [ox, oz, radius, height] of [[80, -50, 55, 22], [40, -95, 45, 18], [-60, -85, 50, 16], [95, 40, 40, 14]]) {
    const hill = new THREE.Mesh(new THREE.ConeGeometry(radius, height, 8), mats.hill);
    hill.position.set(PAVAGADH[0] + ox, height / 2 - 1, PAVAGADH[2] + oz);
    hill.castShadow = true;
    hill.receiveShadow = true;
    root.add(hill);
  }
}

function buildTraffic(root, mats, rng) {
  const tracks = ROADS.map((road) => ({ road, track: buildPolylineTrack(road.points) }));
  const totalLength = tracks.reduce((sum, t) => sum + t.track.length, 0);
  const pickTrack = () => {
    let pick = rng() * totalLength;
    for (const t of tracks) {
      if ((pick -= t.track.length) <= 0) return t;
    }
    return tracks[0];
  };
  const spawn = (count, speedMin, speedMax) => Array.from({ length: count }, () => {
    const { road, track } = pickTrack();
    return { track, lane: road.width * 0.23, s: rng() * track.length, dir: rng() < 0.5 ? 1 : -1, speed: speedMin + rng() * (speedMax - speedMin) };
  });

  const carGeo = mergeGeometries([
    new THREE.BoxGeometry(1.8, 0.75, 3.8).translate(0, 0.6, 0),
    new THREE.BoxGeometry(1.6, 0.6, 2).translate(0, 1.25, -0.2),
  ]);
  const rickshawBody = new THREE.BoxGeometry(1.3, 1.1, 2.3).translate(0, 0.85, 0);
  const rickshawRoof = new THREE.BoxGeometry(1.4, 0.18, 1.9).translate(0, 1.5, -0.1);
  const tint = (geo, hex) => {
    const c = new THREE.Color(hex);
    geo.setAttribute("color", new THREE.Float32BufferAttribute(Array.from({ length: geo.attributes.position.count }, () => [c.r, c.g, c.b]).flat(), 3));
    return geo;
  };
  const rickshawGeo = mergeGeometries([tint(rickshawBody, 0xffffff), tint(rickshawRoof, 0x1c1c1c)]);

  const fleets = [
    { vehicles: spawn(80, 9, 16), mesh: new THREE.InstancedMesh(carGeo, mats.car, 80), colors: [0xf5f5f5, 0xb91c1c, 0x1f2937, 0x9ca3af, 0x1d4ed8, 0xd97706] },
    { vehicles: spawn(55, 6, 10), mesh: new THREE.InstancedMesh(rickshawGeo, mats.rickshaw, 55), colors: [0x2e9e4f, 0x2e9e4f, 0xf2c230] },
  ];
  const color = new THREE.Color();
  for (const fleet of fleets) {
    fleet.vehicles.forEach((_, i) => fleet.mesh.setColorAt(i, color.setHex(fleet.colors[Math.floor(rng() * fleet.colors.length)])));
    fleet.mesh.castShadow = true;
    root.add(fleet.mesh);
  }

  const dummy = new THREE.Object3D();
  return (delta) => {
    for (const { vehicles, mesh } of fleets) {
      vehicles.forEach((v, i) => {
        v.s = (v.s + v.speed * delta * v.dir + v.track.length) % v.track.length;
        const p = sampleTrack(v.track, v.s);
        const hx = p.dx * v.dir, hz = p.dz * v.dir;
        dummy.position.set(p.x - hz * v.lane, 0.15, p.z + hx * v.lane);
        dummy.rotation.set(0, Math.atan2(hx, hz), 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }
  };
}

function createCityMaterials() {
  const facade = (rows, seed) => {
    const { map, emissiveMap } = facadeTextures(rows, 3, seed);
    return new THREE.MeshStandardMaterial({ map, emissiveMap, emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.85 });
  };
  return {
    facades: { low: facade(2, 11), mid: facade(4, 23), tall: facade(9, 37) },
    roof: new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.95 }),
    tank: new THREE.MeshStandardMaterial({ color: 0x1f2328, roughness: 0.6 }),
    asphalt: new THREE.MeshStandardMaterial({ color: 0x3b3f45, roughness: 0.95, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }),
    roadPaint: new THREE.MeshStandardMaterial({ color: 0xe9e3c9, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }),
    water: new THREE.MeshStandardMaterial({ color: 0x3d7c8c, roughness: 0.12, metalness: 0.35, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }),
    riverBank: new THREE.MeshStandardMaterial({ color: 0x6d6a45, roughness: 1 }),
    bridge: new THREE.MeshStandardMaterial({ color: 0x9a9184, roughness: 0.9 }),
    railing: new THREE.MeshStandardMaterial({ color: 0xd8d2c4, roughness: 0.7 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x4b5563, roughness: 0.5, metalness: 0.6 }),
    lampBulb: new THREE.MeshStandardMaterial({ color: 0xfff1c9, emissive: 0xffc46b, emissiveIntensity: 0 }),
    trunk: new THREE.MeshStandardMaterial({ color: 0x5b4330, roughness: 1 }),
    foliage: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, flatShading: true }),
    hill: new THREE.MeshStandardMaterial({ color: 0x6f7d5a, roughness: 1, flatShading: true }),
    car: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.4 }),
    rickshaw: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, vertexColors: true }),
  };
}

const NIGHT_GLOW = { day: { windows: 0, lamps: 0 }, golden: { windows: 0.15, lamps: 0.6 }, night: { windows: 1.25, lamps: 3 } };

function buildLandmarks(renderMode, timeOfDay) {
  const root = new THREE.Group();
  const entries = new Map();
  const animated = [];
  const plazaMat = new THREE.MeshStandardMaterial({ color: 0xcbbfa6, roughness: 0.95 });
  for (const place of VADODARA_PLACES) {
    const layout = LANDMARK_LAYOUT[place.id];
    if (!layout) continue;
    const monument = createMonument(place.id, renderMode, timeOfDay);
    monument.position.fromArray(layout.position);
    monument.scale.setScalar(layout.scale);
    monument.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
      const data = node.userData;
      if (data.isFountainSpray) data.baseY = Float32Array.from(node.geometry.attributes.position.array);
      if (data.isFloralClock || data.isToyTrain || data.isLakeWater || data.isRopeway || data.isFountainSpray) animated.push(node);
    });
    if (place.id !== "pavagadh-champaner") {
      const plaza = new THREE.Mesh(new THREE.CircleGeometry(layout.footprint + 3, 40).rotateX(-Math.PI / 2), plazaMat);
      plaza.position.set(layout.position[0], 0.05, layout.position[2]);
      plaza.receiveShadow = true;
      root.add(plaza);
    }
    root.add(monument);
    const sphere = new THREE.Box3().setFromObject(monument).getBoundingSphere(new THREE.Sphere());
    entries.set(place.id, {
      place,
      group: monument,
      sphere,
      labelPosition: new THREE.Vector3(layout.position[0], layout.labelHeight, layout.position[2]),
    });
  }
  return { root, entries, animated };
}

function animateLandmarks(animated, elapsed) {
  for (const node of animated) {
    const data = node.userData;
    if (data.isFloralClock) {
      if (data.minuteHand) data.minuteHand.rotation.y = -elapsed * 0.4;
      if (data.hourHand) data.hourHand.rotation.y = -elapsed * 0.035;
    }
    if (data.isToyTrain) node.rotation.y = elapsed * 0.35;
    if (data.isLakeWater) node.position.y = 0.35 + Math.sin(elapsed * 1.8) * 0.04;
    if (data.isRopeway) {
      const t = (Math.sin(elapsed * 0.6) + 1) / 2;
      data.cabin1?.position.set(THREE.MathUtils.lerp(7.5, 2.5, t), THREE.MathUtils.lerp(5.2, 10.6, t), THREE.MathUtils.lerp(5.5, 0.5, t));
      data.cabin2?.position.set(THREE.MathUtils.lerp(2.5, 7.5, t), THREE.MathUtils.lerp(10.6, 5.2, t), THREE.MathUtils.lerp(0.5, 5.5, t));
    }
    if (data.isFountainSpray) {
      const attr = node.geometry.attributes.position;
      for (let i = 0; i < attr.count; i++) attr.setY(i, data.baseY[i * 3 + 1] + Math.sin(elapsed * 4 + i) * 0.12);
      attr.needsUpdate = true;
    }
  }
}

/** Builds the whole explorable Vadodara: terrain, river, roads, city fabric, traffic and monuments. */
export function buildCityWorld({ renderMode = "realistic", timeOfDay = "golden" } = {}) {
  const root = new THREE.Group();
  root.name = "vadodara-city";
  const rng = mulberry32(1879);
  const mats = createCityMaterials();
  const occupied = new Set();

  buildGround(root);
  buildRiver(root, mats);
  buildRoads(root, mats, rng);
  buildBuildings(root, mats, rng, occupied);
  buildTrees(root, mats, rng, occupied);
  buildHills(root, mats, rng);
  const updateTraffic = buildTraffic(root, mats, rng);

  let landmarks = buildLandmarks(renderMode, timeOfDay);
  root.add(landmarks.root);
  const disposed = new WeakSet();

  const world = {
    root,
    get landmarks() {
      return landmarks.entries;
    },
    update(elapsed, delta) {
      updateTraffic(delta);
      animateLandmarks(landmarks.animated, elapsed);
    },
    setTimeOfDay(time) {
      const glow = NIGHT_GLOW[time] ?? NIGHT_GLOW.day;
      Object.values(mats.facades).forEach((mat) => { mat.emissiveIntensity = glow.windows; });
      mats.lampBulb.emissiveIntensity = glow.lamps;
      mats.water.color.setHex(time === "night" ? 0x10324a : 0x3d7c8c);
    },
    rebuildLandmarks(nextMode, nextTime) {
      root.remove(landmarks.root);
      disposeObjectTree(landmarks.root, disposed);
      landmarks = buildLandmarks(nextMode, nextTime);
      root.add(landmarks.root);
    },
    dispose() {
      disposeObjectTree(root, disposed);
    },
  };
  world.setTimeOfDay(timeOfDay);
  return world;
}
