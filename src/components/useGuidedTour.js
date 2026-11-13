import { useEffect, useReducer, useRef } from "react";
import { createTourState, readTourProgress, TOUR_STORAGE_KEY, tourReducer } from "../utils/tourController";

export default function useGuidedTour(stops, enabled) {
  const [state, dispatch] = useReducer(tourReducer, stops.length, (total) => {
    const params = new URLSearchParams(location.search);
    if (params.get("view") === "landmark") return createTourState(total);
    const index = stops.findIndex(stop => stop.id === params.get("stop"));
    if (index >= 0) return tourReducer(createTourState(total), {type:"JUMP",index});
    try { return readTourProgress(localStorage.getItem(TOUR_STORAGE_KEY),total); } catch { return createTourState(total); }
  });
  const lastSave = useRef(0);
  useEffect(() => {
    if(state.status === "playing" && performance.now()-lastSave.current<2000)return;
    try { localStorage.setItem(TOUR_STORAGE_KEY,JSON.stringify(state)); lastSave.current=performance.now(); } catch { /* The tour remains fully usable without storage. */ }
  },[state]);

  useEffect(() => {
    if(state.status!=="playing"||!enabled)return;
    let previous=performance.now(),frame;
    const visibility = () => { previous=performance.now(); };
    document.addEventListener("visibilitychange",visibility);
    const tick = now => {
      const deltaMs=Math.min(now-previous,500);
      previous=now;
      if(!document.hidden)dispatch({type:"TICK",deltaMs});
      frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);
    return ()=>{cancelAnimationFrame(frame);document.removeEventListener("visibilitychange",visibility);};
  },[state.status,enabled]);
  return [state,dispatch];
}
