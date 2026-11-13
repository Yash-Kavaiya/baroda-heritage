import React, { useState } from "react";
import { Scale, Crown, ShieldAlert, Award, Maximize, Check } from "lucide-react";

export default function ComparisonSection({ onLaunchPlace }) {
  const [selectedComparison, setSelectedComparison] = useState("palace");

  const comparisons = {
    palace: {
      title: "Laxmi Vilas Palace vs. World Palaces",
      subtitle: "Why Maharaja Sayajirao III's residence stunned 19th-century Europe",
      stats: [
        {
          metric: "Estate Grounds",
          lvp: "500+ Acres",
          comp: "39 Acres",
          compName: "Buckingham Palace (London)",
          advantage: "12.8x Larger Grounds"
        },
        {
          metric: "Residence Footprint",
          lvp: "4x Buckingham Palace",
          comp: "Standard Sovereign Residence",
          compName: "British Monarchy",
          advantage: "Largest Private Home of 1890"
        },
        {
          metric: "Clock Tower Height",
          lvp: "300 Feet (91 Metres)",
          comp: "145 Feet (44 Metres)",
          compName: "Mysore Palace",
          advantage: "+155 Feet Taller Spire"
        },
        {
          metric: "1890s Tech Innovations",
          lvp: "Otis Hydraulic Lifts & European Cooling",
          comp: "Traditional Manual Staffing",
          compName: "Contemporary Royal Courts",
          advantage: "Pioneer in Modern Infrastructure"
        }
      ],
      insight:
        "When Major Charles Mant and Robert Chisholm designed Laxmi Vilas Palace for Maharaja Sayajirao Gaekwad III, they spent over £180,000 (an astronomical sum in 1890). It remains four times the size of Buckingham Palace with 170+ rooms, Venetian mosaic floors, Belgian stained glass, and a private 18-hole golf course."
    },
    shiva: {
      title: "111-ft Sarveshwar Mahadev at Sursagar Lake",
      subtitle: "One of the tallest gilded monolithic water statues on Earth",
      stats: [
        {
          metric: "Statue Height",
          lvp: "111 Feet (33.8 Metres)",
          comp: "98 Feet (30 Metres)",
          compName: "Christ the Redeemer (Rio)",
          advantage: "+13 Feet Taller"
        },
        {
          metric: "Surface Finish",
          lvp: "Electroplated 24K Gold Coating",
          comp: "Soapstone Reinforced Concrete",
          compName: "Modern Colossal Monuments",
          advantage: "Pure Liquid Gold Sheen"
        },
        {
          metric: "Foundation Setting",
          lvp: "Anchored in Deep Center Lake Bedrock",
          comp: "Mountain Peak Plinth",
          compName: "Corcovado Mountain",
          advantage: "Unique Sacred Water Architecture"
        },
        {
          metric: "Night Illumination",
          lvp: "Underwater Radial LED Floodlights",
          comp: "External Ridge Searchlights",
          compName: "Standard Statues",
          advantage: "Golden Water Mirroring"
        }
      ],
      insight:
        "The 111-foot Sarveshwar Mahadev stands directly inside Sursagar Lake's deep waters. During Maha Shivratri, over 100,000 devotees gather around the stone ghats for the grand Maha Aarti as fireworks reflect across the rippling surface."
    }
  };

  const current = comparisons[selectedComparison];

  return (
    <section id="comparison-section" className="py-20 px-4 max-w-7xl mx-auto border-t border-slate-800">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
          <Scale className="w-3.5 h-3.5" />
          <span>Architectural Scale &amp; Proportions</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          How Vadodara Compares to the World
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          Analyze the colossal dimensions, engineering feats, and historical records of Baroda's iconic monuments.
        </p>

        {/* Comparison Switcher Tabs */}
        <div className="mt-6 inline-flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedComparison("palace")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedComparison === "palace"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🏰 Laxmi Vilas Palace vs. World Palaces
          </button>
          <button
            onClick={() => setSelectedComparison("shiva")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedComparison === "shiva"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🔱 111-ft Shiva vs. Global Monuments
          </button>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {current.stats.map((s, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider block">
                {s.metric}
              </span>
              <div className="mt-3">
                <span className="text-[11px] text-slate-400 block font-medium">Vadodara Landmark</span>
                <span className="text-xl sm:text-2xl font-black text-white block mt-0.5">
                  {s.lvp}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-850">
                <span className="text-[11px] text-slate-500 block font-medium">{s.compName}</span>
                <span className="text-sm font-semibold text-slate-300 block mt-0.5">
                  {s.comp}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 text-[11px] font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>{s.advantage}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Insight Callout */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-950 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-widest block">
            ARCHITECTURAL SCHOLAR NOTE
          </span>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            {current.insight}
          </p>
        </div>
        <button
          onClick={() => onLaunchPlace(selectedComparison === "palace" ? "laxmi-vilas-palace" : "sursagar-lake")}
          className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
        >
          <span>Inspect 3D Model</span>
          <span>→</span>
        </button>
      </div>
    </section>
  );
}
