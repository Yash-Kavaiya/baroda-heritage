import { PLACE_IMAGES, PLACE_RATINGS, PLACE_CATEGORIES } from "../../data/placesUI";

export default function PlaceCard({ place }) {
  const image = PLACE_IMAGES[place.id] || "/previews/sayaji-baug.webp";
  const rating = PLACE_RATINGS[place.id] || 4.0;
  const categories = PLACE_CATEGORIES[place.id] || [];

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <img
          src={image}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-sm font-semibold text-amber-600 flex items-center gap-1 shadow-sm">
          <svg className="w-4 h-4 fill-amber-500" viewBox="0 0 20 20">
            <path d="M10 15l-5.35 2.68 1.04-5.97L.44 6.82l6.03-.88L10 0l3.53 5.94 6.03.88-5.25 4.89 1.04 5.97z" />
          </svg>
          {rating}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 mb-2">
          {place.name}
        </h3>
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1 1 0 01-1.414 0l-4.243-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{place.location || "Vadodara, Gujarat"}</span>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.map((cat) => {
            const labels = {
              landmarks: "Landmarks",
              spiritual: "Spiritual",
              "parks-gardens": "Parks",
              "art-culture": "Culture",
              "markets-heritage": "Heritage",
              "forts-ruins": "Forts",
            };
            return (
              <span
                key={cat}
                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
              >
                {labels[cat] || cat}
              </span>
            );
          })}
        </div>

        {/* Know more button */}
        <button className="w-full py-2 rounded-xl border-2 border-amber-500 text-amber-600 text-sm font-semibold hover:bg-amber-500 hover:text-white transition-all duration-300">
          Know more
        </button>
      </div>
    </div>
  );
}
