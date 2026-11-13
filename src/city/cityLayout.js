import { VADODARA_PLACES } from "../data/places.js";

// World units are loosely metres-at-model-scale. Positions follow the real
// relative geography of Vadodara (north = -z, east = +x), compressed so every
// landmark fits one flyable map. Pavagadh is ~45 km away, so it sits on the
// eastern horizon at an exaggerated scale.
export const LANDMARK_LAYOUT = {
  "laxmi-vilas-palace": { position: [-10, 0, 95], scale: 1.25, footprint: 17, labelHeight: 23 },
  "kirti-mandir": { position: [-28, 0, 18], scale: 1, footprint: 12, labelHeight: 14 },
  "sursagar-lake": { position: [55, 0, 10], scale: 1, footprint: 15, labelHeight: 16 },
  "nyay-mandir": { position: [62, 0, -45], scale: 1, footprint: 11, labelHeight: 12 },
  "sayaji-baug": { position: [-20, 0, -65], scale: 1.2, footprint: 19, labelHeight: 10 },
  "eme-temple": { position: [-105, 0, -120], scale: 1, footprint: 15, labelHeight: 12 },
  "pavagadh-champaner": { position: [420, 0, -300], scale: 6, footprint: 74, labelHeight: 96 },
};

export const RIVER_PATH = [
  [-120, 340], [-82, 210], [-60, 125], [-56, 60], [-60, 0], [-55, -50],
  [-60, -100], [-76, -160], [-70, -240], [-92, -340],
];
export const RIVER_WIDTH = 12;

export const ROADS = [
  { name: "Jawaharlal Nehru Marg", width: 7, points: [[-210, 45], [210, 45]] },
  { name: "Raopura Road", width: 7, points: [[-210, -20], [210, -20]] },
  { name: "RC Dutt Road", width: 8, points: [[30, 250], [30, -250]] },
  { name: "Mandvi Road", width: 7, points: [[100, 250], [100, -250]] },
  { name: "Fatehgunj Road", width: 7, points: [[100, -98], [-190, -98]] },
  { name: "Old Padra Road", width: 6, points: [[-210, 132], [210, 132]] },
  { name: "Sama Road", width: 6, points: [[-210, -165], [210, -165]] },
  { name: "Halol Highway", width: 9, points: [[100, -20], [180, -60], [262, -140], [338, -214]] },
];

// Green grounds kept free of houses: palace estate, Sayaji Baug, EME cantonment.
export const PARKS = [
  { center: [-10, 95], radius: 34 },
  { center: [-20, -65], radius: 30 },
  { center: [-105, -120], radius: 22 },
];

export const CITY_BOUNDS = { minX: -205, maxX: 205, minZ: -240, maxZ: 240 };
export const CITY_CENTER = [20, 0, 0];

export const TOUR_ORDER = [
  "laxmi-vilas-palace",
  "kirti-mandir",
  "sursagar-lake",
  "nyay-mandir",
  "sayaji-baug",
  "eme-temple",
  "pavagadh-champaner",
];

/** Convert a monument-local camera preset into world space. */
export function presetToWorld(placeId, preset) {
  const layout = LANDMARK_LAYOUT[placeId];
  const [ox, oy, oz] = layout.position;
  const s = layout.scale;
  const toWorld = ([x, y, z]) => [ox + x * s, oy + y * s, oz + z * s];
  return { pos: toWorld(preset.pos), target: toWorld(preset.target) };
}

export function localToWorld(placeId, [x, y, z]) {
  const { position, scale } = LANDMARK_LAYOUT[placeId];
  return [position[0] + x * scale, position[1] + y * scale, position[2] + z * scale];
}

/** Shortest distance from a point to a polyline in the XZ plane. */
export function distanceToPolyline(x, z, points) {
  let best = Infinity;
  for (let i = 0; i < points.length - 1; i++) {
    const [ax, az] = points[i];
    const [bx, bz] = points[i + 1];
    const dx = bx - ax;
    const dz = bz - az;
    const lenSq = dx * dx + dz * dz;
    const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / lenSq));
    const px = ax + t * dx - x;
    const pz = az + t * dz - z;
    best = Math.min(best, Math.hypot(px, pz));
  }
  return best;
}

/** Catmull-Rom resample of a 2D control polyline, used for the river. */
export function smoothPath(points, samplesPerSegment = 12) {
  const out = [];
  const at = (i) => points[Math.max(0, Math.min(points.length - 1, i))];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let s = 0; s < samplesPerSegment; s++) {
      const t = s / samplesPerSegment, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((k) => 0.5 * (
        2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3
      )));
    }
  }
  out.push([...points[points.length - 1]]);
  return out;
}

export const RIVER_CURVE = smoothPath(RIVER_PATH);

export function isInPark(x, z, margin = 0) {
  return PARKS.some(({ center, radius }) => Math.hypot(x - center[0], z - center[1]) < radius + margin);
}

/** Is this XZ spot free for procedural buildings? */
export function isBuildable(x, z, margin = 0) {
  for (const id in LANDMARK_LAYOUT) {
    const { position, footprint } = LANDMARK_LAYOUT[id];
    if (Math.hypot(x - position[0], z - position[2]) < footprint + 5 + margin) return false;
  }
  if (isInPark(x, z, margin)) return false;
  if (distanceToPolyline(x, z, RIVER_CURVE) < RIVER_WIDTH / 2 + 5 + margin) return false;
  for (const road of ROADS) {
    if (distanceToPolyline(x, z, road.points) < road.width / 2 + 2.5 + margin) return false;
  }
  return true;
}

export function buildTourStops(places = VADODARA_PLACES) {
  const byId = Object.fromEntries(places.map((place) => [place.id, place]));
  const stops = [{
    id: "intro",
    kind: "overview",
    title: "Welcome to Vadodara",
    subtitle: "વડોદરા · Sanskari Nagari",
    narration: "Welcome to Vadodara, the cultural capital of Gujarat. Once the royal seat of the Gaekwads of Baroda, the city grew along the banks of the Vishwamitri river. Let's fly across it, landmark by landmark.",
    view: { pos: [210, 170, 260], target: [10, 0, -10] },
    dwell: 7,
  }];
  for (const id of TOUR_ORDER) {
    const place = byId[id];
    if (!place) continue;
    stops.push({
      id,
      kind: "landmark",
      place,
      title: place.name,
      subtitle: place.gujaratiName,
      narration: `${place.name}. ${place.tagline}. ${firstSentences(place.overview, 2)}`,
      view: presetToWorld(id, place.cameraPresets.overview),
      dwell: 10,
    });
  }
  stops.push({
    id: "outro",
    kind: "overview",
    title: "That's Baroda from above",
    subtitle: "Thank you for flying with us",
    narration: "From royal palaces and riverside memorials to the sacred hill of Pavagadh, that was Vadodara in 3D. Explore any landmark freely, or take the tour again.",
    view: { pos: [-260, 190, 230], target: [40, 0, -40] },
    dwell: 8,
  });
  return stops;
}

function firstSentences(text, count) {
  const parts = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  return parts.slice(0, count).join(" ").trim();
}
