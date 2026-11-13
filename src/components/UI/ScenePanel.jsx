import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Compass,
  Expand,
  Minus,
  Moon,
  MousePointer2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Sun,
  Sunset,
  Volume2,
  VolumeX,
} from "lucide-react";
const LIGHTS = [
  { id: "day", name: "Daylight", Icon: Sun },
  { id: "golden", name: "Golden hour", Icon: Sunset },
  { id: "night", name: "Night", Icon: Moon },
];
export default function ScenePanel({
  children,
  time,
  onTime,
  mode,
  orbit,
  onOrbit,
  audio,
  onAudio,
  status,
  controls,
  onPhoto,
  onSettings,
  onNotice,
}) {
  const stage = useRef(null);
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    const change = () =>
      setFullscreen(document.fullscreenElement === stage.current);
    document.addEventListener("fullscreenchange", change);
    return () => document.removeEventListener("fullscreenchange", change);
  }, []);
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (stage.current.requestFullscreen)
        await stage.current.requestFullscreen();
      else onNotice("Fullscreen is not supported by this browser.");
    } catch {
      onNotice("Fullscreen is not available in this browser window.");
    }
  };
  return (
    <div
      ref={stage}
      className={`explorer-stage ${time === "night" || mode === "blueprint" ? "is-dark" : ""} ${fullscreen ? "is-fullscreen" : ""}`}
    >
      <div className="scene-canvas">{children}</div>
      <div className="stage-topline">
        <span className="stage-caption mono">
          <span className="live-dot" /> A LITTLE WINDOW INTO BARODA
        </span>
        <div className="lighting-switch" aria-label="Scene lighting">
          {LIGHTS.map(({ id, name, Icon }) => (
            <button
              key={id}
              onClick={() => onTime(id)}
              aria-label={name}
              title={name}
              aria-pressed={time === id}
            >
              <Icon size={16} />
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="scene-tools" aria-label="3D view tools">
        <button
          className="icon-button"
          onClick={() => controls.current?.zoom?.(0.82)}
          disabled={status !== "ready"}
          aria-label="Zoom in"
          title="Zoom in"
        >
          <Plus size={18} />
        </button>
        <button
          className="icon-button"
          onClick={() => controls.current?.zoom?.(1.22)}
          disabled={status !== "ready"}
          aria-label="Zoom out"
          title="Zoom out"
        >
          <Minus size={18} />
        </button>
        <span className="tool-divider" />
        <button
          className="icon-button"
          onClick={() => controls.current?.resetCamera?.()}
          aria-label="Reset view"
          title="Reset view"
        >
          <RotateCcw size={17} />
        </button>
        <button
          className="icon-button"
          onClick={onPhoto}
          disabled={status !== "ready"}
          aria-label="Take a postcard"
          title="Take a postcard"
        >
          <Camera size={18} />
        </button>
        <button
          className="icon-button"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          title="Fullscreen"
        >
          <Expand size={17} />
        </button>
      </div>
      {status === "loading" && (
        <div className="scene-loading" role="status">
          <span /> Bringing a little Baroda to life…
        </div>
      )}
      <div className="north-indicator" aria-hidden="true">
        <span>N</span>
        <Compass size={31} strokeWidth={1} />
      </div>
      <div className="scene-bottomline">
        <div className="scene-hint">
          <MousePointer2 size={15} />
          <span>
            Drag to rotate <b>·</b>{" "}
            <span className="desktop-gesture">Scroll</span>
            <span className="touch-gesture">Pinch</span> to zoom
          </span>
        </div>
        <div className="scene-bottom-actions">
          <button
            className="orbit-button"
            onClick={onOrbit}
            aria-pressed={orbit}
            disabled={status !== "ready"}
          >
            {orbit ? <Pause size={13} /> : <Play size={13} />}
            <span>{orbit ? "Pause orbit" : "Auto orbit"}</span>
          </button>
          <button
            className="icon-button"
            onClick={onAudio}
            aria-label={audio ? "Mute ambience" : "Play ambience"}
            aria-pressed={audio}
          >
            {audio ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
          <button
            className="icon-button"
            onClick={onSettings}
            aria-label="Scene settings"
          >
            <SlidersHorizontal size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
