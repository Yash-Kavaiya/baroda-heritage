/** Dispose an owned Three.js hierarchy, including resources shared by descendants.
 * Reuse `disposed` for the lifetime of a scene to make repeated cleanup safe.
 */
export function disposeObjectTree(root, disposed = new WeakSet()) {
  const inspected = new WeakSet();
  const release = (resource) => {
    if (!resource?.dispose || disposed.has(resource)) return;
    disposed.add(resource);
    resource.dispose();
  };
  const releaseTextures = (value) => {
    if (!value || typeof value !== "object" || inspected.has(value)) return;
    inspected.add(value);
    if (value.isTexture) {
      release(value);
    } else if (
      Array.isArray(value) ||
      Object.getPrototypeOf(value) === Object.prototype
    ) {
      Object.values(value).forEach(releaseTextures);
    }
  };
  const releaseMaterial = (material) => {
    if (!material || disposed.has(material)) return;
    Object.values(material).forEach(releaseTextures);
    release(material);
  };

  root?.traverse((node) => {
    release(node.geometry);
    const materials = Array.isArray(node.material)
      ? node.material
      : [node.material];
    materials.forEach(releaseMaterial);
    releaseMaterial(node.customDepthMaterial);
    releaseMaterial(node.customDistanceMaterial);
    releaseTextures(node.skeleton?.boneTexture);
    release(node.skeleton);
    release(node.shadow);
    releaseTextures(node.background);
    releaseTextures(node.environment);
  });
  return disposed;
}

/** Fit all eight corners in camera space, rather than just the largest dimension.
 * This accounts for horizontal FOV, depth and an elevated, oblique museum view.
 */
export function fitCameraToBounds(
  bounds,
  preset,
  { aspect = 1, fov = 42, padding = 1.12, oblique = false } = {},
) {
  if (!bounds || bounds.isEmpty())
    return { pos: [...preset.pos], target: [...preset.target] };
  const target = bounds.getCenter(new Vector3());
  const direction = new Vector3()
    .fromArray(preset.pos)
    .sub(new Vector3().fromArray(preset.target));
  if (oblique && Math.abs(direction.x) < 0.01) {
    direction.set(
      0.52,
      Math.max(0.48, direction.y / Math.max(Math.abs(direction.z), 1)),
      1,
    );
  }
  if (direction.lengthSq() < 0.001) direction.set(0.52, 0.48, 1);
  direction.normalize();
  const right = new Vector3(0, 1, 0).cross(direction).normalize();
  if (right.lengthSq() < 0.001) right.set(1, 0, 0);
  const up = direction.clone().cross(right).normalize();
  const tanY = Math.tan((fov * Math.PI) / 360);
  const tanX = tanY * Math.max(0.1, aspect);
  let distance = 1;
  for (const x of [bounds.min.x, bounds.max.x]) {
    for (const y of [bounds.min.y, bounds.max.y]) {
      for (const z of [bounds.min.z, bounds.max.z]) {
        const corner = new Vector3(x, y, z).sub(target);
        const depth = corner.dot(direction);
        distance = Math.max(
          distance,
          depth + (padding * Math.abs(corner.dot(right))) / tanX,
          depth + (padding * Math.abs(corner.dot(up))) / tanY,
          depth + 1,
        );
      }
    }
  }
  return {
    pos: target.clone().addScaledVector(direction, distance).toArray(),
    target: target.toArray(),
  };
}
import { Vector3 } from "three";
