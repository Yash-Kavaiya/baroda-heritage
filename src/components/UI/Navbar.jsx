import React from "react";
import {
  Compass,
  Sun,
  Sunset,
  Moon,
  CloudRain,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Camera,
  Layers,
  HelpCircle,
  MapPin,
  Flame,
  Award,
  Maximize2,
  Minimize2
} from "lucide-react";

export default function Navbar({
  places,
  selectedPlace,
  onSelectPlace,
  timeOfDay,
  onChangeTimeOfDay,
  renderMode,
  onChangeRenderMode,
  weather,
  onChangeWeather,
  isAudioPlaying,
  onToggleAudio,
  isAutoTour,
  onToggleAutoTour,
  onOpenQuiz,
  onOpenDevFest,
  onOpenPhotobooth,
  onToggleMap,
  isMapOpen,
  isFullScreen3D,
  onToggleFullScreen3D,
  onScrollToSection
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-amber-500/20 text-slate-100 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400 font-bold text-lg">
              વ
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Vadodara 3D
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                DevFest '26
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>વડોદરા ૩ડી</span>
              <span className="text-amber-500/60">•</span>
              <span>Sanskarinagari Cultural Capital</span>
            </p>
          </div>
        </div>

        {/* Website Navigation Anchors */}
        <nav className="hidden lg:flex items-center gap-1 border-x border-slate-800/80 px-3 text-xs font-semibold text-slate-300">
          <button
            onClick={() => onScrollToSection("3d-studio")}
            className="px-2.5 py-1.5 rounded-lg hover:text-amber-300 hover:bg-slate-900 transition-all flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>3D Studio</span>
          </button>
          <button
            onClick={() => onScrollToSection("landmarks-section")}
            className="px-2.5 py-1.5 rounded-lg hover:text-amber-300 hover:bg-slate-900 transition-all"
          >
            Landmarks
          </button>
          <button
            onClick={() => onScrollToSection("timeline-section")}
            className="px-2.5 py-1.5 rounded-lg hover:text-amber-300 hover:bg-slate-900 transition-all"
          >
            Timeline
          </button>
          <button
            onClick={() => onScrollToSection("guide-section")}
            className="px-2.5 py-1.5 rounded-lg hover:text-amber-300 hover:bg-slate-900 transition-all"
          >
            24h Guide
          </button>
        </nav>

        {/* Quick Monument Carousel / Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-full md:max-w-md lg:max-w-sm">
          {places.map((place) => {
            const isSelected = selectedPlace.id === place.id;
            return (
              <button
                key={place.id}
                onClick={() => onSelectPlace(place)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30 scale-105"
                    : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isSelected ? "#020617" : place.colorTheme }}
                />
                <span>{place.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls & Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time of Day Toggle */}
          <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => onChangeTimeOfDay("day")}
              title="Day Sunlight"
              className={`p-1.5 rounded-md transition-all ${
                timeOfDay === "day"
                  ? "bg-amber-500 text-slate-950"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeTimeOfDay("golden")}
              title="Golden Hour"
              className={`p-1.5 rounded-md transition-all ${
                timeOfDay === "golden"
                  ? "bg-amber-500 text-slate-950"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeTimeOfDay("night")}
              title="Dev Deepavali / Night Illumination"
              className={`p-1.5 rounded-md transition-all ${
                timeOfDay === "night"
                  ? "bg-amber-500 text-slate-950"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Render Mode Switcher */}
          <button
            onClick={() => {
              const modes = ["realistic", "blueprint", "sandstone"];
              const nextIndex = (modes.indexOf(renderMode) + 1) % modes.length;
              onChangeRenderMode(modes[nextIndex]);
            }}
            title={`Current View: ${renderMode.toUpperCase()}. Click to switch architectural style`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 text-xs font-mono text-slate-300 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span className="capitalize hidden sm:inline">{renderMode}</span>
          </button>

          {/* Ambient Music & Tanpura Synthesizer */}
          <button
            onClick={onToggleAudio}
            title={isAudioPlaying ? "Mute Ambient Sitar/Tanpura" : "Play Heritage Tanpura & Temple Bells"}
            className={`p-1.5 rounded-lg border transition-all ${
              isAudioPlaying
                ? "bg-amber-500/20 border-amber-500/50 text-amber-400 animate-pulse"
                : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Guided Auto-Tour Mode */}
          <button
            onClick={onToggleAutoTour}
            title={isAutoTour ? "Pause Cinematic Flythrough" : "Start Guided Drone Tour"}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isAutoTour
                ? "bg-emerald-500 text-slate-950 border-emerald-400"
                : "bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {isAutoTour ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isAutoTour ? "Touring" : "Tour"}</span>
          </button>

          {/* City Radar Map Toggle */}
          <button
            onClick={onToggleMap}
            title="Toggle Vadodara City Heritage Map"
            className={`p-1.5 rounded-lg border transition-all ${
              isMapOpen
                ? "bg-amber-500 text-slate-950 border-amber-400"
                : "bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <MapPin className="w-4 h-4" />
          </button>

          {/* Photobooth Snapshot */}
          <button
            onClick={onOpenPhotobooth}
            title="Capture 3D Heritage Postcard"
            className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-amber-400 transition-all"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Sanskarinagari Quiz */}
          <button
            onClick={onOpenQuiz}
            title="Play Vadodara Heritage Quiz"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 text-xs font-semibold transition-all"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Quiz</span>
          </button>

          {/* Toggle Full-Screen 3D Studio Mode */}
          <button
            onClick={onToggleFullScreen3D}
            title={isFullScreen3D ? "Exit Full-Screen 3D View" : "Expand 3D Studio Fullscreen"}
            className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-amber-400 transition-all"
          >
            {isFullScreen3D ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
