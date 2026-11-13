import { useState } from "react";
import heroImage from "../../assets/hero.png";

export default function HeroSection({ searchTerm, onSearchChange }) {
  const [localSearch, setLocalSearch] = useState(searchTerm || "");

  const handleSearch = (e) => {
    setLocalSearch(e.target.value);
    onSearchChange(e.target.value);
  };

  return (
    <section className="relative w-full h-[520px] overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
          Explore Vadodara
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-6">
          Discover the cultural capital of Gujarat
        </p>

        {/* Search bar */}
        <div className="relative max-w-lg mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search places to visit..."
            value={localSearch}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-white/30 bg-white/15 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-white/60 focus:bg-white/25 transition-all duration-300 text-base"
          />
        </div>
      </div>
    </section>
  );
}
