import { useState } from "react";
import { VADODARA_PLACES } from "../../data/places";
import { PLACE_FILTER_CATEGORIES } from "../../data/placesUI";
import HeroSection from "./HeroSection";
import FilterChips from "./FilterChips";
import PlaceCard from "./PlaceCard";

export default function PlacesGridSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = VADODARA_PLACES.filter((place) => {
    const matchesSearch =
      !searchTerm ||
      place.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || (place.filterCategories && place.filterCategories.includes(activeCategory));
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Hero */}
      <HeroSection searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Filters */}
      <div className="relative -mt-6 z-10 bg-gradient-to-b from-transparent to-gray-900/20">
        <div className="max-w-7xl mx-auto">
          <FilterChips
            categories={PLACE_FILTER_CATEGORIES}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-white/60">
            <p className="text-lg">No places found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
