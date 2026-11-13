import React, { useState, useEffect } from "react";
import { X, Download, Share2, Sparkles, Camera } from "lucide-react";

export default function PhotoboothModal({
  isOpen,
  onClose,
  snapshotUrl,
  place,
  timeOfDay
}) {
  const [framedImageUrl, setFramedImageUrl] = useState(null);

  useEffect(() => {
    if (!isOpen || !snapshotUrl || !place) return;

    // Create a 2D canvas to render the postcard frame over the WebGL screenshot
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = snapshotUrl;

    img.onload = () => {
      const w = 1200;
      const h = 800;
      canvas.width = w;
      canvas.height = h;

      // Dark luxury background
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, w, h);

      // Gold border
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, w - 40, h - 40);

      // Inner thin gold frame
      ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
      ctx.lineWidth = 2;
      ctx.strokeRect(32, 32, w - 64, h - 64);

      // Draw the 3D screenshot
      const photoMargin = 45;
      const photoBottomOffset = 140;
      ctx.drawImage(
        img,
        photoMargin,
        photoMargin,
        w - photoMargin * 2,
        h - photoMargin - photoBottomOffset
      );

      // Bottom Postcard Footer Plate
      ctx.fillStyle = "#090d16";
      ctx.fillRect(photoMargin, h - photoBottomOffset, w - photoMargin * 2, photoBottomOffset - photoMargin);

      // Monument Name Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 28px 'Cinzel', 'Times New Roman', serif";
      ctx.fillText(place.name.toUpperCase(), photoMargin + 25, h - 85);

      // Gujarati Subtitle
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 20px 'Noto Sans Gujarati', sans-serif";
      ctx.fillText(place.gujaratiName, photoMargin + 25, h - 55);

      // Stamp Text on the right
      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px 'JetBrains Mono', monospace";
      ctx.textAlign = "right";
      ctx.fillText("VADODARA • SANSKARINAGARI", w - photoMargin - 25, h - 85);
      ctx.fillText("GDG DEVFEST BARODA '26 • 22.3072° N", w - photoMargin - 25, h - 60);

      setFramedImageUrl(canvas.toDataURL("image/jpeg", 0.95));
    };
  }, [isOpen, snapshotUrl, place, timeOfDay]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!framedImageUrl) return;
    const a = document.createElement("a");
    a.href = framedImageUrl;
    a.download = `Vadodara3D-${place.id}-${Date.now()}.jpg`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Heritage Postcard Snapshot
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Postcard Preview */}
        <div className="my-4 rounded-xl overflow-hidden border border-amber-500/30 bg-slate-950 shadow-inner flex items-center justify-center min-h-[300px]">
          {framedImageUrl ? (
            <img
              src={framedImageUrl}
              alt="Vadodara 3D Postcard"
              className="w-full h-auto object-contain max-h-[55vh]"
            />
          ) : (
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Rendering 3D heritage postcard...</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-400">
            High-resolution souvenir from your 3D exploration of {place.name}.
          </p>
          <button
            onClick={handleDownload}
            disabled={!framedImageUrl}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 text-xs transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download Postcard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
