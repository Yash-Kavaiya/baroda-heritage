import React from "react";
import { Heart, Sparkles, MapPin, Award, Layers, Code2 } from "lucide-react";
import { DEVFEST_INFO } from "../../data/places";

export default function Footer({ onLaunch3D, onOpenMap, onOpenQuiz }) {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-14 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 pb-10 border-b border-slate-850">
        {/* Brand Column */}
        <div className="max-w-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              વ
            </div>
            <span className="text-base font-extrabold text-white">
              Vadodara 3D
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              DevFest '26
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            An open interactive 3D web platform celebrating the architectural monuments and cultural heritage of Vadodara (Baroda), Gujarat.
          </p>
          <p className="text-[11px] text-amber-400/80 font-serif">
            "A library in every village, a monument for every citizen." — Maharaja Sayajirao Gaekwad III
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">
              Explore 3D
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={onLaunch3D} className="hover:text-amber-400 transition-colors">
                  Laxmi Vilas Palace
                </button>
              </li>
              <li>
                <button onClick={onLaunch3D} className="hover:text-amber-400 transition-colors">
                  Sursagar Lake & Shiva
                </button>
              </li>
              <li>
                <button onClick={onLaunch3D} className="hover:text-amber-400 transition-colors">
                  Sayaji Baug Floral Clock
                </button>
              </li>
              <li>
                <button onClick={onLaunch3D} className="hover:text-amber-400 transition-colors">
                  Kirti Mandir
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">
              Interactive Tools
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={onLaunch3D} className="hover:text-amber-400 transition-colors">
                  3D Viewer & Hotspots
                </button>
              </li>
              <li>
                <button onClick={onOpenMap} className="hover:text-amber-400 transition-colors">
                  City Radar Map
                </button>
              </li>
              <li>
                <button onClick={onOpenQuiz} className="hover:text-amber-400 transition-colors">
                  Sanskarinagari Quiz
                </button>
              </li>
              <li>
                <span className="text-slate-500">Postcard Photobooth</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">
              Event & Community
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="text-amber-400 font-semibold">{DEVFEST_INFO.event}</li>
              <li>{DEVFEST_INFO.city}</li>
              <li className="text-[11px] text-slate-500">Google Developer Groups</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal / Credits */}
      <div className="max-w-7xl mx-auto mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <p>© 2026 Vadodara 3D Project. Built with Three.js, WebGL, React 19 &amp; Vite.</p>
        <p className="flex items-center gap-1.5">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for GDG DevFest Baroda</span>
        </p>
      </div>
    </footer>
  );
}
