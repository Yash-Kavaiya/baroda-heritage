import React from "react";
import { Clock, Calendar, Crown, Landmark, Sparkles, Building2 } from "lucide-react";

export default function HeritageTimelineSection() {
  const timelineEvents = [
    {
      era: "8th – 16th Century",
      title: "Ancient Fortifications of Pavagadh",
      subtitle: "Chauhan Rajputs & Mahmud Begada",
      desc: "Champaner-Pavagadh develops into a heavily fortified mountain stronghold with sacred Kalika Mata temple atop the 800m summit and revolutionary monsoon water storage stepwells.",
      tag: "UNESCO World Heritage",
      color: "#f97316"
    },
    {
      era: "1721 – 1875",
      title: "Rise of the Gaekwad Dynasty",
      subtitle: "Maratha Confederation & State of Baroda",
      desc: "Pilajirao Gaekwad establishes the Maratha dynasty in Gujarat. Vadodara blossoms from a regional administrative center into an independent, prosperous princely state.",
      tag: "Dynastic Foundation",
      color: "#eab308"
    },
    {
      era: "1875 – 1939",
      title: "The Golden Era of Sayajirao III",
      subtitle: "The Renaissance of Sanskarinagari",
      desc: "Maharaja Sayajirao Gaekwad III transforms Baroda into one of India's most modern cities. He builds Sayaji Baug (1879), commissions Laxmi Vilas Palace (1890), Nyay Mandir (1896), Baroda Museum, and Kirti Mandir (1936), while introducing free primary education.",
      tag: "Golden Renaissance",
      color: "#f59e0b"
    },
    {
      era: "1966",
      title: "Secular Synthesis: EME Temple",
      subtitle: "Corps of Electrical & Mechanical Engineers",
      desc: "Indian Army engineers construct the world's only aluminum-clad geodesic dome temple, integrating sacred motifs of 5 major religions under one geodesic roof.",
      tag: "Modernist Heritage",
      color: "#8b5cf6"
    },
    {
      era: "2002 – Present",
      title: "111-ft Golden Shiva & Tech Capital",
      subtitle: "Cultural Hub & GDG DevFest Baroda",
      desc: "The monumental 111-foot gilded Sarveshwar Mahadev is consecrated at Sursagar Lake. Vadodara today bridges centuries of royal art and literature with premier tech institutions and developer communities.",
      tag: "Living Culture",
      color: "#10b981"
    }
  ];

  return (
    <section id="timeline-section" className="py-20 px-4 bg-slate-950/70 border-t border-slate-800">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>Chronicle of Baroda's Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Centuries in Stone & Dimension
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Trace the evolutionary milestones that sculpted Vadodara into Gujarat's cultural and architectural capital.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative border-l-2 border-amber-500/30 ml-4 sm:ml-32 space-y-12">
          {timelineEvents.map((ev, idx) => (
            <div key={idx} className="relative pl-8 group">
              {/* Timeline Node Icon */}
              <div
                className="absolute -left-[17px] top-1 w-8 h-8 rounded-full border-2 border-slate-950 flex items-center justify-center transition-all duration-300 group-hover:scale-125 shadow-lg"
                style={{ backgroundColor: ev.color }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
              </div>

              {/* Year Stamp on Desktop */}
              <div className="sm:absolute sm:-left-36 sm:top-1 sm:text-right sm:w-28 mb-1 sm:mb-0">
                <span className="text-xs font-mono font-bold text-amber-400 block">
                  {ev.era}
                </span>
              </div>

              {/* Content Card */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 group-hover:border-amber-500/40 transition-all shadow-xl">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    {ev.title}
                  </h3>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-950"
                    style={{ backgroundColor: ev.color }}
                  >
                    {ev.tag}
                  </span>
                </div>
                <h4 className="text-xs font-medium text-amber-400/90 mb-2">
                  {ev.subtitle}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {ev.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
