import { getPlaceDetails } from "./placeCatalog.js";

const ORDER = ["eme-temple", "sayaji-baug", "baroda-museum", "kirti-mandir", "laxmi-vilas-palace", "khanderao-market", "nyay-mandir", "sursagar-lake", "pavagadh-champaner"];
export const TOUR_DURATIONS = [8000, 16000, 25000];
export const TOUR_STORAGE_KEY = "baroda.tour-progress.v1";

export function getTourStops(places) {
  const known = ORDER.filter(id => places.some(place => place.id === id));
  const city = known.filter(id => id !== "pavagadh-champaner");
  const extra = places.filter(place => !known.includes(place.id)).map(place => place.id);
  const ids = [...city, ...extra, ...known.filter(id => id === "pavagadh-champaner")];
  return ids.map(id => {
    const place = places.find(item => item.id === id);
    const details = getPlaceDetails(place);
    const excursion = id === "pavagadh-champaner";
    return { id, place, name: details.name, guide: details.blurb, excursion };
  });
}

export function createTourState(total) {
  return { total, status: "idle", index: 0, elapsedMs: 0, durationMs: 16000, visited: [] };
}

function visit(state, index, status) {
  return { ...state, index, status, elapsedMs: 0, visited: [...new Set([...state.visited, index])] };
}

export function tourReducer(state, action) {
  if (!state.total) return state;
  switch (action.type) {
    case "START": return { ...createTourState(state.total), durationMs: state.durationMs, status: "playing", visited: [0] };
    case "PAUSE": return state.status === "playing" ? { ...state, status: "paused" } : state;
    case "TOGGLE": return state.status === "playing" ? { ...state, status: "paused" } : state.status === "paused" ? { ...state, status: "playing" } : tourReducer(state, { type: "START" });
    case "STOP": return { ...createTourState(state.total), durationMs: state.durationMs, visited: state.visited };
    case "JUMP": return Number.isInteger(action.index) && action.index >= 0 && action.index < state.total ? visit(state, action.index, state.status === "playing" ? "playing" : "paused") : state;
    case "PREVIOUS": return visit(state, Math.max(0, state.index - 1), state.status === "playing" ? "playing" : "paused");
    case "NEXT": return state.index < state.total - 1 ? visit(state, state.index + 1, state.status === "playing" ? "playing" : "paused") : { ...state, status: "complete", elapsedMs: state.durationMs };
    case "SET_DURATION": return TOUR_DURATIONS.includes(action.durationMs) ? { ...state, durationMs: action.durationMs, elapsedMs: Math.min(state.elapsedMs, action.durationMs) } : state;
    case "TICK": {
      if (state.status !== "playing" || !Number.isFinite(action.deltaMs) || action.deltaMs <= 0) return state;
      let next = { ...state, elapsedMs: state.elapsedMs + action.deltaMs };
      while (next.elapsedMs >= next.durationMs) {
        const remainder = next.elapsedMs - next.durationMs;
        if (next.index === next.total - 1) return { ...next, status: "complete", elapsedMs: next.durationMs };
        next = { ...visit(next, next.index + 1, "playing"), elapsedMs: remainder };
      }
      return next;
    }
    default: return state;
  }
}

export function readTourProgress(raw, total) {
  const initial = createTourState(total);
  try {
    const value = JSON.parse(raw);
    if (!value || !Number.isInteger(value.index) || value.index < 0 || value.index >= total) return initial;
    const durationMs = TOUR_DURATIONS.includes(value.durationMs) ? value.durationMs : initial.durationMs;
    const visited = [...new Set((Array.isArray(value.visited) ? value.visited : []).filter(index => Number.isInteger(index) && index >= 0 && index < total))];
    const elapsedMs = Number.isFinite(value.elapsedMs) ? Math.max(0, Math.min(value.elapsedMs, durationMs)) : 0;
    const status = value.status === "idle" ? "idle" : value.status === "complete" ? "complete" : "paused";
    return { ...initial, index: value.index, status, durationMs, visited, elapsedMs };
  } catch { return initial; }
}
