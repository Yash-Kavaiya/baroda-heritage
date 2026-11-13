import React, { useState, useEffect } from "react";
import {
  Compass,
  RotateCcw,
  Eye,
  Sliders,
  ChevronUp,
  ChevronDown,
  Navigation,
  MousePointer,
  Footprints,
  Volume2,
  VolumeX
} from "lucide-react";
import { narrator } from "../../utils/speechNarration";

export default function BottomControls({
  selectedPlace,
  onApplyCameraPreset,
  onResetCamera,
  onCourtyardWalk,
  isDrawerOpen,
  onToggleDrawer
}) {
  const [isNarrating, setIsNarrating] = useState(false);

  useEffect(() => {
    narrator.onStateChange = (speaking) => {
      setIsNarrating(speaking);
    };
    return () => {
      narrator.stop();
    };
  }, []);

  const handleToggleNarrator = () => {
    narrator.toggle(selectedPlace);
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-2 max-w-[95vw] flex-wrap justify-center pointer-events-auto">
      {/* Main Glass Pill */}
      <div className="bg-slate-950/90 backdrop-blur-md border border-amber-500/30 rounded-2xl p-1.5 shadow-2xl flex items-center gap-1.5 text-xs text-slate-200">
        {/* Reset Camera */}
        <button
          onClick={onResetCamera}
          title="Reset Camera Viewpoint"
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-800 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline font-medium">Reset</span>
        </button>

        {/* View Angles */}
        <div className="hidden sm:flex items-center gap-1 px-1 border-x border-slate-800/80">
          {["overview", "dramatic", "aerial", "closeup"].map((preset) => (
            <button
              key={preset}
              onClick={() => onApplyCameraPreset(preset)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900/60 hover:bg-amber-500 hover:text-slate-950 text-[11px] font-mono text-slate-300 transition-all capitalize"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Eye-Level Courtyard Walk */}
        <button
          onClick={onCourtyardWalk}
          title="Drop to Eye-Level (1.7m) Courtyard Walk"
          className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-all border border-slate-800 flex items-center gap-1.5"
        >
          <Footprints className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline font-medium">Courtyard Walk</span>
        </button>

        {/* Voice Audio Guide Narrator */}
        <button
          onClick={handleToggleNarrator}
          title={isNarrating ? "Stop Audio Guide" : "Listen to Voice Heritage Guide"}
          className={`px-2.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            isNarrating
              ? "bg-amber-500 text-slate-950 font-bold animate-pulse shadow-lg shadow-amber-500/30"
              : "bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
          }`}
        >
          {isNarrating ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
          <span className="hidden md:inline">{isNarrating ? "Stop Voice" : "Voice Guide"}</span>
        </button>

        {/* 3D Interaction Hint Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 text-[11px] text-slate-400 font-mono">
          <MousePointer className="w-3 h-3 text-amber-400" />
          <span>Drag: Orbit • Scroll: Zoom</span>
        </div>

        {/* Toggle Architectural Dossier Drawer */}
        <button
          onClick={onToggleDrawer}
          className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 text-xs transition-all shadow-md ${
            isDrawerOpen
              ? "bg-slate-800 text-amber-300 border border-amber-500/30"
              : "bg-amber-500 text-slate-950 hover:bg-amber-400"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{isDrawerOpen ? "Close Dossier" : "Landmark Dossier"}</span>
          {isDrawerOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
}
