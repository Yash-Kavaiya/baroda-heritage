import assert from "node:assert/strict";
import test from "node:test";
import { VADODARA_PLACES } from "../src/data/places.js";
import { createTourState, getTourStops, readTourProgress, tourReducer } from "../src/utils/tourController.js";

test("the route covers every available landmark exactly once and ends with the out-of-city excursion", () => {
  const stops = getTourStops(VADODARA_PLACES);
  assert.equal(stops.length, VADODARA_PLACES.length);
  assert.deepEqual(new Set(stops.map(stop => stop.id)), new Set(VADODARA_PLACES.map(place => place.id)));
  assert.equal(stops.at(-1).id, "pavagadh-champaner");
  assert.equal(stops.at(-1).excursion, true);
  assert.ok(stops.every(stop => stop.place && stop.name && stop.guide));
});

test("play, pause and resume preserve elapsed time without skipping a stop", () => {
  let state = tourReducer(createTourState(9), { type: "START" });
  state = tourReducer(state, { type: "TICK", deltaMs: 1000 });
  state = tourReducer(state, { type: "PAUSE" });
  assert.equal(state.status, "paused");
  state = tourReducer(state, { type: "TICK", deltaMs: 100000 });
  assert.equal(state.elapsedMs, 1000);
  state = tourReducer(state, { type: "TOGGLE" });
  assert.equal(state.status, "playing");
  assert.equal(state.index, 0);
  assert.equal(state.elapsedMs, 1000);
});

test("automatic progression visits every stop and finishes instead of looping forever", () => {
  let state = tourReducer(createTourState(9), { type: "START" });
  for(let index=0;index<9;index++) state=tourReducer(state,{type:"TICK",deltaMs:state.durationMs});
  assert.equal(state.status,"complete");
  assert.equal(state.index,8);
  assert.deepEqual(state.visited,[0,1,2,3,4,5,6,7,8]);
  assert.equal(tourReducer(state,{type:"TICK",deltaMs:50000}),state);
});

test("manual stop navigation is bounded and invalid jumps are rejected", () => {
  let state=createTourState(9);
  assert.equal(tourReducer(state,{type:"JUMP",index:-1}),state);
  assert.equal(tourReducer(state,{type:"JUMP",index:9}),state);
  assert.equal(tourReducer(state,{type:"JUMP",index:NaN}),state);
  state=tourReducer(state,{type:"JUMP",index:3});
  assert.equal(state.index,3);
  assert.equal(state.status,"paused");
  state=tourReducer(state,{type:"PREVIOUS"});
  assert.equal(state.index,2);
  state=tourReducer(state,{type:"NEXT"});
  assert.equal(state.index,3);
});

test("stored progress is sanitized and never resumes autoplay on page load", () => {
  assert.equal(readTourProgress("broken",9).status,"idle");
  assert.equal(readTourProgress('{"index":99,"status":"playing"}',9).index,0);
  const restored=readTourProgress('{"index":3,"durationMs":8000,"elapsedMs":2000,"status":"playing","visited":[0,1,2,3,99,3]}',9);
  assert.equal(restored.index,3);
  assert.equal(restored.status,"paused");
  assert.equal(restored.durationMs,8000);
  assert.equal(restored.elapsedMs,2000);
  assert.deepEqual(restored.visited,[0,1,2,3]);
});

test("stop duration changes are validated and overview stops playback", () => {
  let state=tourReducer(createTourState(9),{type:"START"});
  assert.equal(tourReducer(state,{type:"SET_DURATION",durationMs:0}),state);
  state=tourReducer(state,{type:"SET_DURATION",durationMs:8000});
  assert.equal(state.durationMs,8000);
  state=tourReducer(state,{type:"STOP"});
  assert.equal(state.status,"idle");
  assert.equal(state.elapsedMs,0);
});
