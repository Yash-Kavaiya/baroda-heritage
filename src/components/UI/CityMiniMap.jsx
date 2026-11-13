import React from "react";
import { X, MapPin, Compass, Navigation, ExternalLink } from "lucide-react";

export default function CityMiniMap({
  places,
  selectedPlace,
  onSelectPlace,
  isOpen,
  onClose
}) {
  if (!isOpen) return null;

  // City radar map coordinates normalized to 0-100% SVG box
  const mapCoordinates = {
    "sayaji-baug": { x: 38, y: 35 },
    "kirti-mandir": { x: 44, y: 46 },
    "sursagar-lake": { x: 52, y: 55 },
    "nyay-mandir": { x: 55, y: 56 },
    "laxmi-vilas-palace": { x: 48, y: 72 },
    "eme-temple": { x: 32, y: 18 },
    "pavagadh-champaner": { x: 88, y: 22 }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-lg font-bold text-white">
                Vadodara Heritage Radar & City Map
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive map of Sanskarinagari (Baroda) landmarks and historic corridors
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Visual Container */}
        <div className="relative my-4 flex-1 min-h-[320px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          {/* Stylized SVG Map Graphics */}
          <svg className="w-full h-full absolute inset-0 opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid Lines */}
            <defs>
              <pattern id="radarGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#radarGrid)" />

            {/* Vishwamitri River Blue Curve */}
            <path
              d="M 28 0 C 35 25, 42 45, 40 65 C 38 80, 46 95, 50 100"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.45"
            />
            <text x="36" y="8" fill="#38bdf8" fontSize="2.8" opacity="0.6">
              Vishwamitri River
            </text>

            {/* City Ring Corridors */}
            <circle cx="50" cy="52" r="28" fill="none" stroke="#334155" strokeWidth="0.6" strokeDasharray="1,1" />
            <circle cx="50" cy="52" r="42" fill="none" stroke="#334155" strokeWidth="0.4" strokeDasharray="2,2" />

            {/* Halol-Pavagadh Highway to the East */}
            <path
              d="M 55 52 Q 70 38, 88 22"
              fill="none"
              stroke="#eab308"
              strokeWidth="1.2"
              strokeDasharray="2,2"
              opacity="0.5"
            />
            <text x="68" y="30" fill="#facc15" fontSize="2.2" opacity="0.8">
              Halol Highway → Pavagadh (45km)
            </text>
          </svg>

          {/* Location Pins Overlay */}
          {places.map((place) => {
            const coords = mapCoordinates[place.id] || { x: 50, y: 50 };
            const isSelected = selectedPlace.id === place.id;

            return (
              <button
                key={place.id}
                onClick={() => {
                  onSelectPlace(place);
                  onClose();
                }}
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-10 ${
                  isSelected ? "scale-125 z-20" : "hover:scale-115"
                }`}
              >
                <div className="relative flex flex-col items-center">
                  {/* Pin Dot / Beacon */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-amber-400 border-white shadow-lg shadow-amber-500/80 ring-4 ring-amber-500/30"
                        : "bg-slate-900 border-amber-400 hover:bg-amber-500"
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                  </div>

                  {/* Pin Label */}
                  <div
                    className={`mt-1 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap border shadow-md transition-all ${
                      isSelected
                        ? "bg-amber-500 text-slate-950 border-amber-400"
                        : "bg-slate-900/90 text-slate-200 border-slate-700 group-hover:border-amber-400"
                    }`}
                  >
                    {place.name.split(" ")[0]}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Compass Rose */}
          <div className="absolute bottom-3 right-3 p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-1.5 text-xs text-slate-400">
            <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span className="font-mono text-[10px]">N 22°18' E 73°12'</span>
          </div>
        </div>

        {/* Selected Place Quick Info in Map */}
        <div className="flex items-center justify-between pt-2 text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-200">
              Selected: <span className="text-amber-400">{selectedPlace.name}</span>
            </span>
            <span className="text-slate-400 text-[11px]">({selectedPlace.distanceFromStation})</span>
          </div>

          <div className="text-slate-400 text-[11px] font-mono">
            Click any pin above to teleport immediately into its 3D model!
          </div>
        </div>
      </div>
    </div>
  );
}
