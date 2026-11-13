import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";

import * as lifecycle from "../src/utils/sceneLifecycle.js";

test("disposing a nested model releases shared geometry, material arrays and textures once", () => {
  const root = new THREE.Group();
  const nested = new THREE.Group();
  const geometry = new THREE.BoxGeometry();
  const texture = new THREE.Texture();
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    normalMap: texture,
  });
  const shader = new THREE.ShaderMaterial({
    uniforms: { layers: { value: [texture, { detail: texture }] } },
  });
  nested.add(new THREE.Mesh(geometry, [material, shader]));
  nested.add(new THREE.Mesh(geometry, material));
  root.add(nested);
  const released = [];
  for (const [label, resource] of Object.entries({
    geometry,
    material,
    shader,
    texture,
  })) {
    resource.addEventListener("dispose", () => released.push(label));
  }

  lifecycle.disposeObjectTree?.(root);

  assert.deepEqual(released.sort(), [
    "geometry",
    "material",
    "shader",
    "texture",
  ]);
});

test("fit keeps every palace bounding-box corner inside a mobile and wide canvas", () => {
  const bounds = new THREE.Box3(
    new THREE.Vector3(-13, 0, -9),
    new THREE.Vector3(13, 16.5, 9),
  );
  const preset = { pos: [0, 11, 28], target: [0, 5, 0] };
  for (const aspect of [0.65, 1, 1.6, 2.5]) {
    const view = lifecycle.fitCameraToBounds?.(bounds, preset, {
      aspect,
      fov: 42,
      oblique: true,
    });
    assert.ok(view, "camera fitting must return a view");
    assert.ok(
      view.pos[0] > 0,
      "the museum overview is oblique, not a flat elevation",
    );
    const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 1000);
    camera.position.fromArray(view.pos);
    camera.lookAt(new THREE.Vector3().fromArray(view.target));
    camera.updateMatrixWorld(true);
    for (const x of [bounds.min.x, bounds.max.x]) {
      for (const y of [bounds.min.y, bounds.max.y]) {
        for (const z of [bounds.min.z, bounds.max.z]) {
          const point = new THREE.Vector3(x, y, z).project(camera);
          assert.ok(
            Math.abs(point.x) < 0.92,
            `horizontal clipping at aspect ${aspect}: ${point.x}`,
          );
          assert.ok(
            Math.abs(point.y) < 0.92,
            `vertical clipping at aspect ${aspect}: ${point.y}`,
          );
          assert.ok(point.z > -1 && point.z < 1);
        }
      }
    }
  }
});
