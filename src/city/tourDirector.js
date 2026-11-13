import { Vector3 } from "three";

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** A drone-style arc between two camera views: rises mid-flight, then settles. */
export class Flight {
  constructor(fromPos, fromTarget, toPos, toTarget, { minDuration = 3.5, maxDuration = 9, speed = 55 } = {}) {
    this.fromPos = new Vector3().fromArray(fromPos);
    this.fromTarget = new Vector3().fromArray(fromTarget);
    this.toPos = new Vector3().fromArray(toPos);
    this.toTarget = new Vector3().fromArray(toTarget);
    const distance = this.fromPos.distanceTo(this.toPos);
    this.duration = Math.min(maxDuration, Math.max(minDuration, distance / speed));
    const cruise = Math.max(this.fromPos.y, this.toPos.y) + Math.min(160, Math.max(18, distance * 0.3));
    this.control = this.fromPos.clone().add(this.toPos).multiplyScalar(0.5).setY(cruise);
    this.elapsed = 0;
  }

  get done() {
    return this.elapsed >= this.duration;
  }

  step(delta, outPos, outTarget) {
    this.elapsed = Math.min(this.duration, this.elapsed + delta);
    const t = easeInOut(this.elapsed / this.duration);
    const a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
    outPos.set(
      a * this.fromPos.x + b * this.control.x + c * this.toPos.x,
      a * this.fromPos.y + b * this.control.y + c * this.toPos.y,
      a * this.fromPos.z + b * this.control.z + c * this.toPos.z,
    );
    outTarget.lerpVectors(this.fromTarget, this.toTarget, t);
    return this.elapsed / this.duration;
  }
}

/**
 * Plays an ordered list of stops: fly to each stop's view, slowly orbit it for
 * `dwell` seconds (longer while `shouldHold()` is true, e.g. narration), advance.
 */
export class TourDirector {
  constructor(stops, { onStop, onFinish, shouldHold } = {}) {
    this.stops = stops;
    this.onStop = onStop;
    this.onFinish = onFinish;
    this.shouldHold = shouldHold ?? (() => false);
    this.index = -1;
    this.phase = "idle";
    this.paused = false;
    this.flight = null;
    this.dwellElapsed = 0;
    this.orbitAngle = 0;
  }

  get active() {
    return this.phase !== "idle";
  }

  start(cameraPos, cameraTarget, index = 0) {
    this.paused = false;
    this.goTo(index, cameraPos, cameraTarget);
  }

  goTo(index, cameraPos, cameraTarget) {
    if (index >= this.stops.length) {
      this.stop();
      this.onFinish?.();
      return;
    }
    this.index = Math.max(0, index);
    const stop = this.stops[this.index];
    this.flight = new Flight(cameraPos, cameraTarget, stop.view.pos, stop.view.target);
    this.phase = "flying";
    this.dwellElapsed = 0;
    this.orbitAngle = 0;
    this.onStop?.(this.index, stop);
  }

  /** Re-approach the current stop from wherever the user left the camera. */
  resume(cameraPos, cameraTarget) {
    if (!this.active) return;
    this.paused = false;
    const stop = this.stops[this.index];
    this.flight = new Flight(cameraPos, cameraTarget, stop.view.pos, stop.view.target, { minDuration: 2 });
    this.phase = "flying";
  }

  stop() {
    this.phase = "idle";
    this.flight = null;
    this.paused = false;
  }

  /** Advances the camera. Returns overall tour progress 0..1. */
  update(delta, outPos, outTarget) {
    if (!this.active || this.paused) return this.progress();
    const stop = this.stops[this.index];
    if (this.phase === "flying") {
      this.flight.step(delta, outPos, outTarget);
      if (this.flight.done) this.phase = "dwelling";
      return this.progress();
    }

    this.dwellElapsed += delta;
    this.orbitAngle += delta * 0.11;
    const [px, py, pz] = stop.view.pos;
    const [tx, ty, tz] = stop.view.target;
    const dx = px - tx, dz = pz - tz;
    const cos = Math.cos(this.orbitAngle), sin = Math.sin(this.orbitAngle);
    outPos.set(tx + dx * cos - dz * sin, py, tz + dx * sin + dz * cos);
    outTarget.set(tx, ty, tz);

    if (this.dwellElapsed >= stop.dwell && !this.shouldHold()) {
      this.goTo(this.index + 1, outPos.toArray(), outTarget.toArray());
    }
    return this.progress();
  }

  stopProgress() {
    if (!this.active) return 0;
    const stop = this.stops[this.index];
    if (this.phase === "flying") return 0.35 * (this.flight.elapsed / this.flight.duration);
    return 0.35 + 0.65 * Math.min(1, this.dwellElapsed / stop.dwell);
  }

  progress() {
    if (!this.active) return 0;
    return (this.index + this.stopProgress()) / this.stops.length;
  }
}
