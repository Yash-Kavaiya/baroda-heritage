import * as THREE from "three";

import { createMonument } from "./monumentGenerators.js";

// Scene units are design coordinates, never kilometres or travel distances.
const STOP_POSITIONS = new Map([
  ["laxmi-vilas-palace", [-32, 32]],
  ["sursagar-lake", [0, 32]],
  ["sayaji-baug", [-32, -32]],
  ["kirti-mandir", [-32, 0]],
  ["nyay-mandir", [32, 0]],
  ["eme-temple", [32, -32]],
  ["pavagadh-champaner", [96, -64]],
  ["khanderao-market", [32, 32]],
  ["baroda-museum", [0, -32]],
]);

function createLandmark(place, renderMode, timeOfDay) {
  const source = createMonument(place.id, renderMode, timeOfDay);
  const bounds = new THREE.Box3().setFromObject(source);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const scale = Math.min(1, 24 / Math.max(size.x, size.z), 18 / size.y);
  source.scale.setScalar(scale);
  source.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);

  const landmark = new THREE.Group();
  landmark.name = place.name ?? place.id;
  landmark.userData = {
    placeId: place.id,
    isExcursion: place.id === "pavagadh-champaner",
    description: place.id === "pavagadh-champaner"
      ? "Outlying Champaner-Pavagadh excursion outside Vadodara; illustrative placement."
      : "Illustrative miniature landmark; not to scale.",
  };
  landmark.add(source);
  return landmark;
}

/** An illustrative miniature, deliberately not a geographic map. */
export function createCityTourScene(
  places,
  renderMode = "realistic",
  timeOfDay = "golden",
) {
  const group = new THREE.Group();
  group.name = "Vadodara illustrative city tour";
  group.userData = {
    illustrative: true,
    geographicAccuracy: false,
    description: "Illustrative miniature city, not to scale. Pavagadh is an outlying excursion; no travel distances implied.",
  };
  const landmarks = new Map();
  const pickables = [];

  places.forEach((place, index) => {
    const landmark = createLandmark(place, renderMode, timeOfDay);
    const [x, z] = STOP_POSITIONS.get(place.id) ?? [-64 - 32 * Math.floor(index / 3), (index % 3) * 32 - 32];
    landmark.position.set(x, 0.14, z);
    landmark.traverse((node) => {
      if (!node.isMesh) return;
      node.userData.placeId = place.id;
      pickables.push(node);
    });
    landmarks.set(place.id, landmark);
    group.add(landmark);
  });

  const route = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(
      [...landmarks.values()].map((landmark) => landmark.position.clone()),
    ),
    new THREE.LineBasicMaterial({ color: 0xb4864b }),
  );
  route.name = "Illustrative tour route";
  group.add(route);
  group.updateMatrixWorld(true);
  return { group, landmarks, route, pickables };
}

