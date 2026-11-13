import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Bookmark, Info } from "lucide-react";
import ThreeCanvas from "./HeritageCanvas";
import HeroIntro from "./UI/ExplorerChrome";
import ScenePanel from "./UI/ScenePanel";
import LandmarkCollection from "./UI/LandmarkCollection";
import ExplorerOverlays from "./UI/ExplorerOverlays";
import { VADODARA_PLACES } from "../data/places";
import { getPlaceDetails, parseSavedPlaces } from "../utils/placeCatalog";
import { audioEngine } from "../utils/audioSynthesizer";
import "./HeritageExplorer.css";

const SAVED_KEY = "baroda.saved-places.v1";
export default function HeritageExplorer() {
  const [place, setPlace] = useState(
    () =>
      VADODARA_PLACES.find(
        (item) => item.id === new URLSearchParams(location.search).get("place"),
      ) ?? VADODARA_PLACES[0],
  );
  const [time, setTime] = useState("golden");
  const [mode, setMode] = useState("realistic");
  const [weather, setWeather] = useState("clear");
  const [orbit, setOrbit] = useState(false);
  const [audio, setAudio] = useState(false);
  const [hotspot, setHotspot] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [collection, setCollection] = useState("all");
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState(() => {
    try {
      return parseSavedPlaces(localStorage.getItem(SAVED_KEY), VADODARA_PLACES);
    } catch {
      return [];
    }
  });
  const [status, setStatus] = useState("loading");
  const [snapshot, setSnapshot] = useState(null);
  const [notice, setNotice] = useState("");
  const controls = useRef(null);
  const ready = useCallback((value) => {
    controls.current = value;
  }, []);
  const close = useCallback(() => setOverlay(null), []);
  const details = getPlaceDetails(place);

  useEffect(() => {
    const url = new URL(location.href);
    url.searchParams.set("place", place.id);
    history.replaceState(null, "", url);
  }, [place]);
  useEffect(() => {
    if (audio)
      audioEngine.startAmbience(
        place.id === "sursagar-lake"
          ? "lake"
          : ["eme-temple", "kirti-mandir", "pavagadh-champaner"].includes(
                place.id,
              )
            ? "temple"
            : "palace",
      );
    return () => audioEngine.stopAmbience();
  }, [audio, place]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const select = (value) => {
    setPlace(value);
    setHotspot(null);
    setOrbit(false);
  };
  const toggleSaved = (id) => {
    const next = saved.includes(id)
      ? saved.filter((item) => item !== id)
      : [...saved, id];
    setSaved(next);
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    } catch {
      setNotice(
        "Saved for this session. Your browser has disabled local storage.",
      );
    }
  };
  const applyPreset = (key) => {
    setOrbit(false);
    setHotspot(null);
    controls.current?.applyCameraPreset?.(place.cameraPresets[key]);
  };
  const photograph = () => {
    try {
      const image = controls.current?.captureSnapshot?.();
      if (!image) throw new Error("Not ready");
      setSnapshot(image);
      setOverlay("postcard");
    } catch {
      setNotice("The scene is not ready for a photo yet. Please try again.");
    }
  };
  const showSaved = () => {
    setSavedOnly((value) => !value);
    setCollection("all");
    setQuery("");
    document
      .getElementById("places")
      ?.scrollIntoView({ block: "start", behavior: "instant" });
  };

  return (
    <div className="heritage-explorer">
      <a className="skip-explorer" href="#places">
        Skip to landmark collection
      </a>
      <header className="site-header">
        <a
          className="brand"
          href="#explore"
          onClick={() => {
            select(VADODARA_PLACES[0]);
            setCollection("all");
            setQuery("");
            setSavedOnly(false);
          }}
          aria-label="Baroda 3D home"
        >
          <span className="brand-symbol">વ</span>
          <span className="brand-name">
            baroda<span className="brand-period">.</span>
            <small>A DIFFERENT PERSPECTIVE</small>
          </span>
        </a>
        <nav className="main-navigation" aria-label="Main navigation">
          <a href="#explore" className="active">
            Explore <span>3D</span>
          </a>
          <button onClick={() => setOverlay("map")}>City map</button>
          <button onClick={() => setOverlay("about")}>The story</button>
        </nav>
        <div className="header-actions">
          <span className="location-pill">
            <span /> GUJARAT, INDIA
          </span>
          <button
            className="saved-header"
            onClick={showSaved}
            aria-pressed={savedOnly}
            aria-label={`Saved places (${saved.length})`}
          >
            <Bookmark size={17} />
            <span>Saved places</span>
            <b>{saved.length}</b>
          </button>
        </div>
      </header>
      <main>
        <section
          className="explore-hero"
          id="explore"
          aria-label="Interactive Vadodara explorer"
        >
          <HeroIntro
            count={VADODARA_PLACES.length}
            onExplore={() => setOverlay("details")}
          />
          <ScenePanel
            time={time}
            onTime={setTime}
            mode={mode}
            orbit={orbit}
            onOrbit={() => setOrbit((value) => !value)}
            audio={audio}
            onAudio={() => {
              audioEngine.init();
              setAudio((value) => !value);
            }}
            status={status}
            controls={controls}
            onPhoto={photograph}
            onSettings={() => setOverlay("settings")}
            onNotice={setNotice}
          >
            <ThreeCanvas
              selectedPlace={place}
              timeOfDay={time}
              renderMode={mode}
              weather={weather}
              isAutoTour={orbit}
              selectedHotspot={hotspot}
              onHotspotClick={(spot) => {
                setHotspot(spot);
                setOrbit(false);
                setNotice(spot.name + ": " + spot.desc);
              }}
              onCanvasReady={ready}
              onStatusChange={setStatus}
            />
          </ScenePanel>
          <div className="selected-landmark" aria-live="polite">
            <div className="landmark-number mono">
              {String(VADODARA_PLACES.indexOf(place) + 1).padStart(2, "0")}
              <span> / {String(VADODARA_PLACES.length).padStart(2, "0")}</span>
            </div>
            <div className="selected-copy">
              <span className="eyebrow">
                {details.label} · {place.builtYear}
              </span>
              <h2>{details.name}</h2>
              <p lang="gu">{place.gujaratiName}</p>
            </div>
            <div className="selected-actions">
              <button
                className="icon-button"
                onClick={() => toggleSaved(place.id)}
                aria-label={
                  saved.includes(place.id)
                    ? "Unsave current place"
                    : "Save current place"
                }
                aria-pressed={saved.includes(place.id)}
              >
                <Bookmark
                  size={18}
                  fill={saved.includes(place.id) ? "currentColor" : "none"}
                />
              </button>
              <button
                className="text-link"
                onClick={() => setOverlay("details")}
              >
                Discover the story <ArrowUpRight size={17} />
              </button>
            </div>
          </div>
        </section>
        <LandmarkCollection
          places={VADODARA_PLACES}
          selectedPlace={place}
          onSelectPlace={select}
          savedIds={saved}
          onToggleSaved={toggleSaved}
          savedOnly={savedOnly}
          onChangeSavedOnly={setSavedOnly}
          collection={collection}
          onChangeCollection={setCollection}
          query={query}
          onChangeQuery={setQuery}
        />
      </main>
      <footer className="explorer-footer">
        <p>
          Made for the curious. <span>Rooted in Vadodara.</span>
        </p>
        <div>
          <span>Artist-made 3D interpretations, not architectural scans.</span>
          <button onClick={() => setOverlay("about")}>
            About this project <ArrowUpRight size={14} />
          </button>
        </div>
      </footer>
      {notice && (
        <div className="explorer-toast" role="status">
          <Info size={17} />
          {notice}
        </div>
      )}
      {overlay && (
        <ExplorerOverlays
          type={overlay}
          place={place}
          details={details}
          onClose={close}
          onSelect={(item) => {
            select(item);
            close();
          }}
          mode={mode}
          onMode={setMode}
          weather={weather}
          onWeather={setWeather}
          onPreset={(key) => {
            applyPreset(key);
            close();
          }}
          onHotspot={(spot) => {
            setOrbit(false);
            setHotspot(spot);
            close();
            setNotice(spot.name + ": " + spot.desc);
          }}
          snapshot={snapshot}
        />
      )}
    </div>
  );
}
