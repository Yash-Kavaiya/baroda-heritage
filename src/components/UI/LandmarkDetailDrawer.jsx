import React, { useState } from "react";
import {
  X,
  ChevronRight,
  Info,
  Clock,
  MapPin,
  Compass,
  Sparkles,
  Maximize2,
  Eye,
  Building,
  Calendar,
  User,
  ShieldCheck,
  Navigation
} from "lucide-react";

export default function LandmarkDetailDrawer({
  place,
  selectedHotspot,
  onSelectHotspot,
  onApplyCameraPreset,
  isOpen,
  onClose
}) {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "hotspots" | "visit"

  if (!isOpen || !place) return null;

  return (
    <aside className="absolute right-0 top-0 bottom-0 z-30 w-full sm:w-[440px] bg-slate-950/95 backdrop-blur-xl border-l border-amber-500/25 shadow-2xl flex flex-col text-slate-100 transition-all duration-300">
      {/* Header Banner */}
      <div className="p-5 border-b border-slate-800/80 relative bg-gradient-to-b from-amber-950/30 to-transparent">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-950"
            style={{ backgroundColor: place.colorTheme || "#f59e0b" }}
          >
            {place.category}
          </span>
          <span className="text-xs text-amber-400/80 font-mono">Est. {place.builtYear}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex flex-col">
          <span>{place.name}</span>
          <span className="text-sm font-normal text-amber-300/80 font-serif">
            {place.gujaratiName}
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-2 italic leading-relaxed">
          "{place.tagline}"
        </p>

        {/* Camera Quick Presets */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-mono">Angles:</span>
          {["overview", "dramatic", "aerial", "closeup"].map((presetKey) => (
            <button
              key={presetKey}
              onClick={() => onApplyCameraPreset(presetKey)}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[11px] font-medium border border-slate-800 transition-all capitalize"
            >
              {presetKey}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 py-2.5 text-center transition-all border-b-2 ${
            activeTab === "overview"
              ? "border-amber-400 text-amber-300 bg-amber-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          History & Lore
        </button>
        <button
          onClick={() => setActiveTab("hotspots")}
          className={`flex-1 py-2.5 text-center transition-all border-b-2 flex items-center justify-center gap-1.5 ${
            activeTab === "hotspots"
              ? "border-amber-400 text-amber-300 bg-amber-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>3D Hotspots</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 text-[10px]">
            {place.hotspots?.length || 0}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("visit")}
          className={`flex-1 py-2.5 text-center transition-all border-b-2 ${
            activeTab === "visit"
              ? "border-amber-400 text-amber-300 bg-amber-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Visitor Guide
        </button>
      </div>

      {/* Tab Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Architectural Profile Card */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-mono">ARCHITECTURAL STYLE</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">{place.style}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-mono">VISIONARY PATRON</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">{place.patron}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 col-span-2">
                <span className="text-[10px] text-slate-400 block font-mono">MASTER ARCHITECT</span>
                <span className="font-semibold text-amber-300 mt-0.5 block">{place.architect}</span>
              </div>
            </div>

            {/* Overview paragraph */}
            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
              <p>{place.overview}</p>
            </div>

            {/* Architectural Highlights */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Key Highlights & Heritage Lore</span>
              </h4>
              <ul className="space-y-2">
                {place.highlights.map((highlight, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/60 text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Specs */}
            {place.specs && (
              <div className="pt-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Technical & Dimensional Specs
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(place.specs).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block font-mono">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="font-semibold text-slate-200 mt-0.5 block">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "hotspots" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 leading-relaxed">
              Click any architectural feature below to smoothly zoom and inspect that 3D detail:
            </p>
            <div className="space-y-2">
              {place.hotspots?.map((spot) => {
                const isSelected = selectedHotspot?.id === spot.id;
                return (
                  <button
                    key={spot.id}
                    onClick={() => onSelectHotspot(spot)}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                      isSelected
                        ? "bg-amber-500/15 border-amber-500/60 shadow-lg"
                        : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isSelected ? "bg-amber-400 animate-ping" : "bg-amber-500/60"
                          }`}
                        />
                        <h4 className="text-xs font-bold text-slate-100">{spot.name}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed pl-4">
                        {spot.desc}
                      </p>
                    </div>
                    <Eye className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "visit" && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200 block">Visiting Timings</span>
                  <span className="text-slate-400 text-[11px] mt-0.5 block">{place.timings}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-800/80">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200 block">Exact Address</span>
                  <span className="text-slate-400 text-[11px] mt-0.5 block">{place.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-800/80">
                <Navigation className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200 block">From Vadodara Junction Station</span>
                  <span className="text-slate-400 text-[11px] mt-0.5 block">
                    {place.distanceFromStation}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-300 space-y-1.5">
              <span className="font-bold text-amber-300 block text-xs">DevFest Baroda Travel Tip:</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Vadodara city offers convenient auto-rickshaws and BRTS bus connections. For Laxmi Vilas Palace and Sayaji Baug, morning hours between 9:00 AM and 11:30 AM offer the best golden natural lighting for photography!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Action */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-mono text-[11px]">
          Coord: 22.3072° N, 73.1812° E
        </span>
        <button
          onClick={() => onApplyCameraPreset("overview")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-all text-xs"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Reset Camera</span>
        </button>
      </div>
    </aside>
  );
}
