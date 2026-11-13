import React, { useState } from "react";
import { Sparkles, Music, Volume2, VolumeX, Moon, Flame, Heart } from "lucide-react";
import { audioEngine } from "../../utils/audioSynthesizer";

export default function NavratriSection({ onActivateNavratriLighting }) {
  const [isDholPlaying, setIsDholPlaying] = useState(false);

  const handleToggleDhol = () => {
    if (isDholPlaying) {
      audioEngine.stopGarbaBeats();
      setIsDholPlaying(false);
    } else {
      audioEngine.startGarbaBeats();
      setIsDholPlaying(true);
    }
  };

  return (
    <section id="navratri-section" className="py-20 px-4 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-950/40 via-amber-950/30 to-slate-900 border border-purple-500/30 relative overflow-hidden shadow-2xl">
          {/* Decorative Background Glows */}
          <div className="absolute w-72 h-72 rounded-full bg-purple-500/10 blur-3xl -top-20 -left-20 pointer-events-none" />
          <div className="absolute w-72 h-72 rounded-full bg-amber-500/10 blur-3xl -bottom-20 -right-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Garba Capital of the World • ગરબાની રાજધાની</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Navratri in Sanskarinagari
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Vadodara is internationally celebrated for hosting the purest, most synchronized folk dance celebrations on the planet. Over 30,000+ traditionally clad dancers move in concentric circles to traditional Gujarati folk melodies under starlit palace skies.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/20">
                  <span className="text-[10px] text-purple-400 font-mono block">UNITED WAY OF BARODA</span>
                  <span className="text-sm font-bold text-white block mt-0.5">30,000+ Dancers</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Atul Purohit traditional vocals</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/20">
                  <span className="text-[10px] text-purple-400 font-mono block">MAA SHAKTI GARBA</span>
                  <span className="text-sm font-bold text-white block mt-0.5">Limca Record</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Largest single-venue gathering</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/20">
                  <span className="text-[10px] text-purple-400 font-mono block">PALACE HERITAGE GARBA</span>
                  <span className="text-sm font-bold text-white block mt-0.5">Laxmi Vilas Grounds</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Royal courtyard tradition</span>
                </div>
              </div>
            </div>

            {/* Interactive Audio & Festive Actions */}
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <button
                onClick={handleToggleDhol}
                className={`px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl ${
                  isDholPlaying
                    ? "bg-purple-600 text-white shadow-purple-600/40 animate-pulse"
                    : "bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/40"
                }`}
              >
                {isDholPlaying ? <Volume2 className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                <span>{isDholPlaying ? "Playing Traditional 3-Tali Dhol" : "Play Authentic Garba Dhol Beats 🥁"}</span>
              </button>

              <button
                onClick={onActivateNavratriLighting}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-purple-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Switch 3D Scene to Navratri Illumination</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
