import { useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import ExplorerDialog from "./ExplorerDialog";
import { VADODARA_PLACES } from "../../data/places";
import { getPlaceDetails } from "../../utils/placeCatalog";
const POSITIONS = [
  [41, 78],
  [64, 48],
  [36, 31],
  [46, 43],
  [76, 64],
  [25, 16],
  [85, 16],
  [70, 85],
  [24, 40],
];

export default function ExplorerOverlays({
  type,
  place,
  details,
  onClose,
  onSelect,
  mode,
  onMode,
  weather,
  onWeather,
  onPreset,
  onHotspot,
  snapshot,
}) {
  const [tab, setTab] = useState("story");
  const titles = {
    details: details.name,
    settings: "Make it your perspective.",
    map: "A city of little discoveries.",
    about: "Old soul. New medium.",
    postcard: "A little piece of Baroda.",
  };
  return (
    <ExplorerDialog
      title={titles[type]}
      onClose={onClose}
      className={`${type}-dialog`}
    >
      {type === "details" && (
        <div className="dialog-tabs">
          {[
            { id: "story", name: "The story" },
            { id: "details", name: "3D details" },
            { id: "visit", name: "Plan a visit" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              aria-pressed={tab === item.id}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
      <div className="dialog-body">
        {type === "details" && tab === "story" && (
          <>
            <span className="eyebrow">
              {details.label} / {place.builtYear}
            </span>
            <p className="detail-lead">{details.blurb}</p>
            <p>{place.overview}</p>
            <dl className="detail-facts">
              <div>
                <dt>Architecture</dt>
                <dd>{place.style}</dd>
              </div>
              <div>
                <dt>Patron</dt>
                <dd>{place.patron}</dd>
              </div>
            </dl>
            <p className="interpretation-note">
              An artistic interpretation. Scale, layout and architectural
              details are simplified.
            </p>
          </>
        )}
        {type === "details" && tab === "details" && (
          <>
            <p>
              Follow the little beacons. Select a feature to take a closer look
              in 3D.
            </p>
            <div className="hotspot-list">
              {place.hotspots.map((spot, index) => (
                <button key={spot.id} onClick={() => onHotspot(spot)}>
                  <span className="mono">0{index + 1}</span>
                  <span>
                    <strong>{spot.name}</strong>
                    <small>{spot.desc}</small>
                  </span>
                  <ArrowUpRight size={17} />
                </button>
              ))}
            </div>
          </>
        )}
        {type === "details" && tab === "visit" && (
          <>
            <span className="eyebrow">OUT OF THE BROWSER. INTO THE CITY.</span>
            <p className="detail-lead">
              Some things are even better in person.
            </p>
            <p>{place.location}</p>
            <p>
              Opening hours, ticket prices and access rules can change. Confirm
              them with the venue before travelling. This website does not
              provide live visitor information.
            </p>
            {place.id === "eme-temple" && (
              <p>
                The temple is in a military cantonment. Check current ID, entry
                and photography requirements before visiting.
              </p>
            )}
            {place.id === "pavagadh-champaner" && (
              <p>
                Champaner–Pavagadh is in Panchmahal district, outside Vadodara.
                Plan it as a separate day trip.
              </p>
            )}
            <a
              className="primary-action"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.name + " " + place.location)}`}
              target="_blank"
              rel="noreferrer"
            >
              Find on Google Maps <ArrowUpRight size={17} />
            </a>
          </>
        )}
        {type === "settings" && (
          <>
            <p className="dialog-intro">
              The same landmark. A different light, material or point of view.
            </p>
            <fieldset className="setting-field">
              <legend>01 / Architectural material</legend>
              <div className="option-row">
                {[
                  { id: "realistic", name: "Natural" },
                  { id: "blueprint", name: "Blueprint" },
                  { id: "sandstone", name: "Terracotta" },
                ].map((item) => (
                  <button
                    key={item.id}
                    aria-pressed={mode === item.id}
                    onClick={() => onMode(item.id)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="setting-field">
              <legend>02 / Atmosphere</legend>
              <div className="option-row">
                {[
                  { id: "clear", name: "Clear" },
                  { id: "monsoon", name: "Monsoon" },
                  { id: "festive", name: "Festive" },
                ].map((item) => (
                  <button
                    key={item.id}
                    aria-pressed={weather === item.id}
                    onClick={() => onWeather(item.id)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="setting-field">
              <legend>03 / Camera angle</legend>
              <div className="option-row">
                {["overview", "dramatic", "aerial", "closeup"].map((key) => (
                  <button key={key} onClick={() => onPreset(key)}>
                    {key === "closeup" ? "Close-up" : key}
                    <ArrowUpRight size={14} />
                  </button>
                ))}
              </div>
            </fieldset>
            <p className="keyboard-note">
              Focus the canvas, then use arrow keys to rotate, + / − to zoom,
              and R to reset. Reduced-motion preferences are respected.
            </p>
          </>
        )}
        {type === "map" && (
          <>
            <p className="dialog-intro">
              Select a pin or a place below to open its 3D world.
            </p>
            <div className="heritage-map" aria-label="Schematic heritage map">
              <svg
                viewBox="0 0 600 340"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <defs>
                  <pattern
                    id="map-grid"
                    width="30"
                    height="30"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M30 0H0V30"
                      fill="none"
                      stroke="#d6d9cd"
                      strokeWidth=".7"
                    />
                  </pattern>
                </defs>
                <rect width="600" height="340" fill="url(#map-grid)" />
                <path
                  d="M200 -20C130 80 300 130 220 210S290 300 290 360"
                  stroke="#b8ceca"
                  strokeWidth="24"
                  fill="none"
                />
                <path
                  d="M0 220L600 110M50 0L500 340M0 130L600 280M370 0L290 340"
                  stroke="#fffdf8"
                  strokeWidth="7"
                  fill="none"
                />
                <path
                  d="M390 170Q440 80 540 50"
                  stroke="#b6b09e"
                  strokeDasharray="5 5"
                  fill="none"
                />
                <text x="175" y="320" fill="#587b76" fontSize="11">
                  VISHWAMITRI
                </text>
              </svg>
              <span className="map-north">N ↑</span>
              {VADODARA_PLACES.map((item, index) => (
                <button
                  key={item.id}
                  className="map-pin"
                  style={{
                    left: POSITIONS[index][0] + "%",
                    top: POSITIONS[index][1] + "%",
                  }}
                  aria-label={`Map: ${getPlaceDetails(item).name}`}
                  onClick={() => onSelect(item)}
                >
                  <span>0{index + 1}</span>
                  <small>{getPlaceDetails(item).name}</small>
                </button>
              ))}
            </div>
            <p className="map-disclaimer">
              Illustrative map, not to scale. Champaner–Pavagadh is outside the
              city, in Panchmahal.
            </p>
            <div className="map-place-list">
              {VADODARA_PLACES.map((item, index) => (
                <button key={item.id} onClick={() => onSelect(item)}>
                  <span className="mono">0{index + 1}</span>
                  <span>
                    {getPlaceDetails(item).name}
                    <small>{getPlaceDetails(item).area}</small>
                  </span>
                  <ArrowUpRight size={16} />
                </button>
              ))}
            </div>
          </>
        )}
        {type === "about" && (
          <>
            <span className="eyebrow">A LOVE LETTER TO VADODARA</span>
            <p className="detail-lead">
              A city is more than its landmarks. But they’re a lovely place to
              start.
            </p>
            <p>
              Turn a palace around. Watch a garden clock move. See a familiar
              silhouette in a different light. Baroda is an independent
              interactive guide for the curious.
            </p>
            <div className="about-stats">
              <div>
                <strong>
                  {String(VADODARA_PLACES.length).padStart(2, "0")}
                </strong>
                <span>places to discover</span>
              </div>
              <div>
                <strong>360°</strong>
                <span>of curiosity</span>
              </div>
              <div>
                <strong>01</strong>
                <span>city to fall for</span>
              </div>
            </div>
            <p>
              Every scene uses original procedural 3D geometry. These are
              stylized interpretations, not scans or precise architectural
              models. Champaner–Pavagadh is a separate day trip outside
              Vadodara, in Panchmahal district.
            </p>
            <div className="source-links">
              <span className="eyebrow">KEEP EXPLORING</span>
              <a
                href="https://www.gujarattourism.com/central-zone/vadodara/laxmi-vilas-palace.html"
                target="_blank"
                rel="noreferrer"
              >
                Laxmi Vilas Palace · Gujarat Tourism <ArrowUpRight size={15} />
              </a>
              <a
                href="https://www.gujarattourism.com/central-zone/vadodara/sayaji-baug.html"
                target="_blank"
                rel="noreferrer"
              >
                Sayaji Baug · Gujarat Tourism <ArrowUpRight size={15} />
              </a>
              <a
                href="https://whc.unesco.org/en/list/1101/"
                target="_blank"
                rel="noreferrer"
              >
                Champaner–Pavagadh · UNESCO <ArrowUpRight size={15} />
              </a>
            </div>
          </>
        )}
        {type === "postcard" && (
          <>
            <div className="souvenir-postcard">
              <img src={snapshot} alt={`Your 3D view of ${details.name}`} />
              <div>
                <h3>{details.name}</h3>
                <p lang="gu">{place.gujaratiName}</p>
                <span>BARODA. A DIFFERENT PERSPECTIVE.</span>
              </div>
            </div>
            <p className="dialog-intro">
              Your perspective, to keep. Download the rendered 3D view as a PNG.
            </p>
            <a
              className="primary-action"
              href={snapshot}
              download={`baroda-${place.id}.png`}
            >
              <Download size={17} /> Download your view
            </a>
          </>
        )}
      </div>
    </ExplorerDialog>
  );
}
