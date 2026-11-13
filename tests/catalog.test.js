import assert from "node:assert/strict";
import test from "node:test";
import { filterPlaces, parseSavedPlaces } from "../src/utils/placeCatalog.js";
import { VADODARA_PLACES } from "../src/data/places.js";

test("the nature collection contains the garden and the lake", () => {
  assert.deepEqual(
    filterPlaces(VADODARA_PLACES, { collection: "nature" }).map(
      (place) => place.id,
    ),
    ["sursagar-lake", "sayaji-baug"],
  );
});

test("saved places reject invalid JSON, duplicates and stale identifiers", () => {
  assert.deepEqual(parseSavedPlaces("broken", VADODARA_PLACES), []);
  assert.deepEqual(parseSavedPlaces("null", VADODARA_PLACES), []);
  assert.deepEqual(
    parseSavedPlaces('{"id":"laxmi-vilas-palace"}', VADODARA_PLACES),
    [],
  );
  assert.deepEqual(
    parseSavedPlaces(
      '["sursagar-lake","sursagar-lake","missing",8]',
      VADODARA_PLACES,
    ),
    ["sursagar-lake"],
  );
});

test("place search works in Gujarati, ignores case and trims whitespace", () => {
  assert.equal(
    filterPlaces(VADODARA_PLACES, { query: "  SURSaGAR " })[0].id,
    "sursagar-lake",
  );
  assert.equal(
    filterPlaces(VADODARA_PLACES, { query: "સયાજી" })[0].id,
    "sayaji-baug",
  );
  assert.deepEqual(
    filterPlaces(VADODARA_PLACES, { query: "not a real landmark" }),
    [],
  );
});

test("saved and category filters compose without mutating the catalogue", () => {
  const before = VADODARA_PLACES.length;
  assert.deepEqual(
    filterPlaces(VADODARA_PLACES, {
      collection: "nature",
      savedOnly: true,
      savedIds: ["sayaji-baug", "laxmi-vilas-palace"],
    }).map((place) => place.id),
    ["sayaji-baug"],
  );
  assert.equal(VADODARA_PLACES.length, before);
});
