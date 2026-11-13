import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import {
  createMonument,
  getMaterials,
} from "../src/utils/monumentGenerators.js";
import { disposeObjectTree } from "../src/utils/sceneLifecycle.js";
import { VADODARA_PLACES } from "../src/data/places.js";

test("every rendering style provides the complete model material palette", () => {
  for (const mode of ["realistic", "blueprint", "sandstone"]) {
    const palette = getMaterials(mode, "day");
    for (const key of [
      "sandstone",
      "brick",
      "marble",
      "gold",
      "dome",
      "water",
      "roof",
      "grass",
      "foliage",
      "metal",
      "aluminum",
      "glass",
      "stone",
      "glow",
    ]) {
      assert.ok(palette[key]?.isMaterial, `${mode} is missing ${key}`);
    }
    new Set(Object.values(palette)).forEach((material) => material.dispose());
  }
});

for (const place of VADODARA_PLACES) {
  test(`${place.id} builds finite geometry in all materials and lighting presets`, () => {
    for (const mode of ["realistic", "blueprint", "sandstone"]) {
      for (const time of ["day", "golden", "night"]) {
        const model = createMonument(place.id, mode, time);
        const bounds = new THREE.Box3().setFromObject(model);
        assert.ok(!bounds.isEmpty());
        assert.ok(
          [...bounds.min.toArray(), ...bounds.max.toArray()].every(
            Number.isFinite,
          ),
        );
        model.traverse((node) => {
          if (node.isMesh) assert.ok(node.geometry && node.material);
        });
        disposeObjectTree(model);
      }
    }
  });
}
