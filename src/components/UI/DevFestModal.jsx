import React from "react";
import { X, Code2, Heart, ExternalLink, Globe, Sparkles, Terminal } from "lucide-react";
import { DEVFEST_INFO } from "../../data/places";

export default function DevFestModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              {DEVFEST_INFO.event}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-300">
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/30">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
              GDG BEYOND LIMITS
            </span>
            <p className="text-sm font-bold text-white mt-0.5">
              Vadodara: The Cultural & Tech Capital of Gujarat
            </p>
            <p className="text-slate-400 mt-1">
              Celebrating the visionary legacy of Maharaja Sayajirao Gaekwad III, who pioneered free public education and modern urban planning over a century ago.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>Engine & Interactive 3D Stack</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {DEVFEST_INFO.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="font-bold text-white text-xs block">Key Features Included:</span>
            <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
              <li>Procedurally sculpted 3D models with physical PBR materials</li>
              <li>Real-time lighting based on Golden Hour, Sunset, and Dev Deepavali Night</li>
              <li>Interactive 3D clickable hotspot pins with camera focus</li>
              <li>Web Audio API synthesizer for meditative Tanpura & temple bells</li>
              <li>Atmospheric Monsoon rain and festive fireworks/lanterns</li>
              <li>Postcard snapshot exporter and heritage knowledge quiz</li>
            </ul>
          </div>

          <div className="pt-2 text-center text-slate-500 text-[11px] flex items-center justify-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for DevFest Baroda 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
