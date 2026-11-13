import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";

import { VADODARA_PLACES } from "../src/data/places.js";
import { createMonument } from "../src/utils/monumentGenerators.js";
import { disposeObjectTree } from "../src/utils/sceneLifecycle.js";

const sceneModule = await import("../src/utils/cityTourScene.js").catch((error) => {
  if (error.code !== "ERR_MODULE_NOT_FOUND") throw error;
  return {};
});

function triangleCount(root) {
  let triangles = 0;
  root.traverse((node) => {
    if (!node.isMesh) return;
    const geometry = node.geometry;
    triangles += (geometry.index?.count ?? geometry.attributes.position.count) / 3;
  });
  return triangles;
}

function horizontalBounds(root) {
  const bounds = assertFiniteBounds(root);
  return new THREE.Box2(
    new THREE.Vector2(bounds.min.x, bounds.min.z),
    new THREE.Vector2(bounds.max.x, bounds.max.z),
  );
}

function assertFiniteBounds(root) {
  const bounds = new THREE.Box3().setFromObject(root);
  assert.ok(!bounds.isEmpty(), `${root.name} has empty bounds`);
  assert.ok(
    [...bounds.min.toArray(), ...bounds.max.toArray()].every(Number.isFinite),
    `${root.name} has non-finite bounds`,
  );
  return bounds;
}

test("builds all nine supplied landmarks with their complete procedural geometry", () => {
  assert.equal(typeof sceneModule.createCityTourScene, "function");
  const city = sceneModule.createCityTourScene(VADODARA_PLACES);
  try {
    assert.ok(city.group.isGroup);
    assert.ok(city.landmarks instanceof Map);
    assert.equal(city.landmarks.size, 9);
    assert.deepEqual([...city.landmarks.keys()], VADODARA_PLACES.map(({ id }) => id));
    assert.ok(city.route.isLine);
    assert.ok(Array.isArray(city.pickables));
    for (const place of VADODARA_PLACES) {
      const landmark = city.landmarks.get(place.id);
      const original = createMonument(place.id, "realistic", "golden");
      try {
        assert.ok(landmark.isGroup);
        assert.equal(landmark.userData.placeId, place.id);
        assert.equal(landmark.parent, city.group);
        assertFiniteBounds(landmark);
        assert.equal(triangleCount(landmark), triangleCount(original), place.id);
        assert.ok(triangleCount(landmark) > 100, `${place.id} is not a placeholder`);
      } finally {
        disposeObjectTree(original);
      }
    }
  } finally {
    disposeObjectTree(city.group);
  }
});

test("uses stable exact-ID placements with clear footprints and an outlying excursion", () => {
  const city = sceneModule.createCityTourScene(VADODARA_PLACES);
  const reversed = sceneModule.createCityTourScene([...VADODARA_PLACES].reverse());
  try {
    const entries = [...city.landmarks];
    assert.equal(city.group.userData.illustrative, true);
    assert.equal(city.group.userData.geographicAccuracy, false);
    assert.match(city.group.userData.description, /not to scale/i);
    for (let index = 0; index < entries.length; index++) {
      const [id, landmark] = entries[index];
      assert.deepEqual(landmark.position.toArray(), reversed.landmarks.get(id).position.toArray());
      const footprint = horizontalBounds(landmark);
      const size = footprint.getSize(new THREE.Vector2());
      assert.ok(Math.max(size.x, size.y) <= 24.01, `${id} exceeds its miniature lot`);
      for (const [otherId, other] of entries.slice(index + 1)) {
        assert.ok(!footprint.intersectsBox(horizontalBounds(other)), `${id} overlaps ${otherId}`);
        assert.ok(landmark.position.distanceTo(other.position) >= 28);
      }
    }
    const excursion = city.landmarks.get("pavagadh-champaner");
    assert.equal(excursion.userData.isExcursion, true);
    assert.match(excursion.userData.description, /outside|outlying/i);
    for (const [id, landmark] of entries) {
      if (id === "pavagadh-champaner") continue;
      assert.ok(excursion.position.distanceTo(landmark.position) >= 48);
    }
  } finally {
    disposeObjectTree(city.group);
    disposeObjectTree(reversed.group);
  }
});
