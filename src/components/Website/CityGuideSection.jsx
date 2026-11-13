import React from "react";
import {
  Compass,
  Utensils,
  Sun,
  Moon,
  Clock,
  Sparkles,
  Plane,
  Train,
  Heart
} from "lucide-react";

export default function CityGuideSection({ onOpenMap }) {
  const itinerary = [
    {
      time: "07:00 AM",
      title: "Morning Stroll & Floral Clock",
      location: "Sayaji Baug (Kamati Baug)",
      desc: "Begin your morning amidst 113 acres of lush flora. Witness the 20-foot Floral Clock ticking in flowerbeds and hear the whistle of the vintage narrow-gauge Toy Train."
    },
    {
      time: "10:30 AM",
      title: "Royal Exploration & Darbar Hall",
      location: "Laxmi Vilas Palace",
      desc: "Tour the grand residence of the Gaekwads. Marvel at Belgian stained glass, Venetian mosaic floors, Raja Ravi Varma's original oil paintings, and the 300-ft Clock Tower."
    },
    {
      time: "02:00 PM",
      title: "Art, History & Whales",
      location: "Baroda Museum & Picture Gallery",
      desc: "Explore the 1894 museum modeled after London's Victoria & Albert Museum, housing a genuine 22-meter blue whale skeleton, Egyptian mummy, and European masters."
    },
    {
      time: "05:30 PM",
      title: "Golden Hour & Sacred Waters",
      location: "Sursagar Lake & Nyay Mandir",
      desc: "Watch the sunset illuminate the 111-foot gilded Sarveshwar Mahadev in the center of the lake. Stroll along the ghats opposite Robert Chisholm's Nyay Mandir."
    },
    {
      time: "08:30 PM",
      title: "Sanskarinagari Food Trail",
      location: "Ratri Bazar & Mandvi Havelis",
      desc: "Indulge in authentic Barodian culinary icons: spicy Mahakali Sev Usal, crisp Jagdish Bhakarwadi, Duliram Peda, and steaming Gujarati thali."
    }
  ];

  const foods = [
    { name: "Sev Usal", place: "Mahakali Sev Usal", desc: "Baroda's iconic spicy curry garnished with sev and tari" },
    { name: "Bhakarwadi", place: "Jagdish Farshan", desc: "Crisp spiral snack stuffed with aromatic spices" },
    { name: "Duliram Peda", place: "Raopura", desc: "Legendary melt-in-the-mouth milk fudge sweets" },
    { name: "Kathiyawadi Thali", place: "Kansaar", desc: "Wholesome feast of bajra rotla, ringna no olo and chaas" }
  ];

  return (
    <section id="guide-section" className="py-20 px-4 max-w-7xl mx-auto border-t border-slate-800">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Curated Visitor Guide</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          A Perfect Day in Vadodara
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          The ultimate 24-hour itinerary balancing royal heritage, sacred landmarks, and world-famous Gujarati delicacies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Itinerary Column (2 spans on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>24-Hour Heritage Trail</span>
          </h3>

          <div className="space-y-3">
            {itinerary.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-4 hover:border-amber-500/30 transition-all"
              >
                <div className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold whitespace-nowrap">
                  {item.time}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{item.title}</h4>
                  <span className="text-xs text-amber-400/90 font-medium block mt-0.5">
                    📍 {item.location}
                  </span>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Culture & Food Highlights Column */}
        <div className="space-y-6">
          {/* Famous Food Trail */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>Iconic Baroda Food Trail</span>
            </h3>
            <div className="space-y-3">
              {foods.map((food, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-850">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{food.name}</span>
                    <span className="text-[10px] text-amber-400 font-mono">{food.place}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{food.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Travel Logistics */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plane className="w-4 h-4 text-amber-400" />
              <span>How to Reach Baroda</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li>
                <strong className="text-white">By Air:</strong> Vadodara Airport (BDQ) with daily flights to Mumbai, Delhi, Bengaluru & Hyderabad.
              </li>
              <li>
                <strong className="text-white">By Rail:</strong> Vadodara Junction (BRC) is one of India's busiest railway junctions on the Mumbai-Delhi Western Railway trunk line.
              </li>
              <li>
                <strong className="text-white">Best Season:</strong> October to March (Experience the world's grandest Navratri Garba festivals!).
              </li>
            </ul>

            <button
              onClick={onOpenMap}
              className="w-full mt-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 text-xs font-bold transition-all text-center block"
            >
              Open Interactive City Radar Map 🗺️
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
