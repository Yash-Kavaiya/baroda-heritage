import { useRef } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Search, X } from "lucide-react";
import {
  COLLECTIONS,
  filterPlaces,
  getPlaceDetails,
} from "../../utils/placeCatalog";

export default function LandmarkCollection({
  places,
  selectedPlace,
  onSelectPlace,
  savedIds,
  onToggleSaved,
  savedOnly,
  onChangeSavedOnly,
  collection,
  onChangeCollection,
  query,
  onChangeQuery,
}) {
  const railRef = useRef(null);
  const filtered = filterPlaces(places, {
    collection,
    query,
    savedOnly,
    savedIds,
  });
  const scrollRail = (direction) =>
    railRef.current?.scrollBy({
      left: direction * railRef.current.clientWidth * 0.7,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });

  return (
    <section
      className="landmark-collection"
      id="places"
      aria-label="Landmark collection"
    >
      <div className="collection-heading">
        <div>
          <span className="eyebrow">A FEW PLACES. A THOUSAND STORIES.</span>
          <h2>Where will curiosity take you?</h2>
        </div>
        <div className="rail-navigation">
          <span className="mono">
            {String(filtered.length).padStart(2, "0")} PLACES TO EXPLORE
          </span>
          <button
            className="icon-button"
            onClick={() => scrollRail(-1)}
            aria-label="Previous places"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            className="icon-button"
            onClick={() => scrollRail(1)}
            aria-label="More places"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <div className="collection-filters">
        <div className="filter-tabs" aria-label="Place categories">
          {COLLECTIONS.map((item) => (
            <button
              key={item.id}
              aria-pressed={collection === item.id && !savedOnly}
              onClick={() => {
                onChangeCollection(item.id);
                onChangeSavedOnly(false);
              }}
            >
              {item.label}
              {item.id === "all" && (
                <span>{String(places.length).padStart(2, "0")}</span>
              )}
            </button>
          ))}
          {savedOnly && (
            <button
              className="saved-filter"
              aria-pressed="true"
              onClick={() => onChangeSavedOnly(false)}
            >
              Saved <X size={13} />
            </button>
          )}
        </div>
        <label className="place-search">
          <Search size={16} />
          <input
            aria-label="Search places"
            placeholder="Find a little wonder…"
            value={query}
            onChange={(event) => onChangeQuery(event.target.value)}
          />
          {query && (
            <button onClick={() => onChangeQuery("")} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </label>
      </div>
      <div className="place-rail" ref={railRef}>
        {filtered.map((place) => {
          const details = getPlaceDetails(place);
          const selected = place.id === selectedPlace.id;
          const saved = savedIds.includes(place.id);
          return (
            <article
              className={`place-card ${selected ? "is-selected" : ""}`}
              key={place.id}
              data-place-card={place.id}
            >
              <button
                className="place-select"
                onClick={() => onSelectPlace(place)}
                aria-label={`Explore ${details.name}`}
                aria-pressed={selected}
              >
                <div className="place-preview">
                  <img
                    src={`/previews/${place.id}.webp`}
                    alt=""
                    width="220"
                    height="160"
                    loading="lazy"
                  />
                  <span className="preview-index">
                    {String(places.indexOf(place) + 1).padStart(2, "0")}
                  </span>
                  {selected && (
                    <span className="viewing-tag">
                      <span /> IN VIEW
                    </span>
                  )}
                </div>
                <div className="place-card-copy">
                  <span className="place-category">{details.label}</span>
                  <h3>{details.name}</h3>
                  <p>
                    {details.area}
                    <ArrowRight size={15} />
                  </p>
                </div>
              </button>
              <button
                className={`save-place ${saved ? "is-saved" : ""}`}
                onClick={() => onToggleSaved(place.id)}
                aria-label={`${saved ? "Unsave" : "Save"} ${details.name}`}
                aria-pressed={saved}
              >
                <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
              </button>
            </article>
          );
        })}
        {!filtered.length && (
          <div className="empty-places">
            <Search size={24} />
            <h3>
              {savedOnly
                ? "Your next adventure starts here."
                : "No places found. Keep wandering."}
            </h3>
            <p>
              {savedOnly
                ? "Save a place with the bookmark icon to find it here."
                : "Try a different name or explore another collection."}
            </p>
            <button
              className="text-link"
              onClick={() => {
                onChangeQuery("");
                onChangeCollection("all");
                onChangeSavedOnly(false);
              }}
            >
              Explore all places <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
