import { useState, useRef, useEffect, useCallback } from "react";
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Info,
  Maximize2,
  SlidersHorizontal,
  Crosshair,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../i18n";
import { demoSites } from "../data/demoSites";
import {
  bandOptions,
  dateRange,
  imageUrls,
  ndviLegendStops,
  satellites,
} from "../data/demoSatelliteData";

function NDVILegend({ title }) {
  return (
    <div className="rounded-lg bg-[#1A1F2B]/90 border border-[#00FF88]/15 p-3">
      <div className="text-xs text-slate-400 mb-2">{title}</div>
      <div className="flex gap-0.5">
        {ndviLegendStops.map((s) => (
          <div key={s.value} className="flex flex-col items-center gap-1">
            <div className="w-6 h-4 rounded-sm" style={{ backgroundColor: s.color }} />
            <span className="text-[10px] text-slate-500 whitespace-nowrap">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simulated NDVI overlay drawn on canvas
function NDVIOverlay({ ndvi, active, opacity }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Create a simulated NDVI heatmap
    const imageData = ctx.createImageData(W, H);

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        // Generate pseudo-random but smooth NDVI values
        const nx = x / W;
        const ny = y / H;
        // Base using sin waves for smooth variation
        const noise =
          Math.sin(nx * 8 + 1.2) * 0.15 +
          Math.sin(ny * 6 + 0.8) * 0.12 +
          Math.sin((nx + ny) * 12) * 0.08 +
          Math.sin(nx * ny * 20) * 0.05;
        const val = Math.max(-0.1, Math.min(0.9, ndvi + noise - 0.1));

        let r, g, b;
        if (val < 0) { r = 26; g = 26; b = 122; }
        else if (val < 0.1) { r = 139; g = 0; b = 0; }
        else if (val < 0.2) { r = 255; g = 69; b = 0; }
        else if (val < 0.3) { r = 255; g = 140; b = 0; }
        else if (val < 0.4) { r = 255; g = 215; b = 0; }
        else if (val < 0.5) { r = 154; g = 205; b = 50; }
        else if (val < 0.6) { r = 50; g = 205; b = 50; }
        else if (val < 0.7) { r = 34; g = 139; b = 34; }
        else { r = 0; g = 100; b = 0; }

        const idx = (y * W + x) * 4;
        imageData.data[idx] = r;
        imageData.data[idx + 1] = g;
        imageData.data[idx + 2] = b;
        imageData.data[idx + 3] = Math.round(opacity * 255);
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [ndvi, active, opacity]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "multiply" }}
    />
  );
}

export function SatelliteViewer() {
  const [selectedSite, setSelectedSite] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedBand, setSelectedBand] = useState("ndvi");
  const [selectedSatellite, setSelectedSatellite] = useState(0);
  const [ndviOpacity, setNdviOpacity] = useState(0.7);
  const [ndviActive, setNdviActive] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [crosshair, setCrosshair] = useState(null);
  const { t } = useLanguage();
  const viewerRef = useRef(null);
  const currentSite = demoSites[selectedSite] ?? demoSites[0];
  const currentDate = dateRange[selectedDate] ?? dateRange[0];
  const currentSatellite = satellites[selectedSatellite] ?? satellites[0];
  const imgIdx = selectedSite % imageUrls.length;
  const currentImageUrl = imageUrls[imgIdx] ?? imageUrls[0];

  const currentNdvi = currentDate.ndvi;
  const localizedBandOptions = bandOptions.map((band) => ({
    ...band,
    label: band.id === "ndvi" ? t("common.ndvi") :
      band.id === "rgb" ? t("satellite.trueColor") : band.label,
    description: band.id === "ndvi" ? t("satellite.vegetationIndex") :
      band.id === "rgb" ? t("satellite.rgbComposite") : band.description,
  }));

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      }
      // Simulate pixel probe
      if (viewerRef.current) {
        const rect = viewerRef.current.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const noise = Math.sin(x * 8) * 0.1 + Math.sin(y * 6) * 0.08;
        const ndviVal = Math.max(0, Math.min(0.9, currentNdvi + noise));
        setCrosshair({ x: e.clientX - rect.left, y: e.clientY - rect.top, ndvi: ndviVal });
      }
    },
    [isDragging, dragStart, currentNdvi]
  );

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => { setIsDragging(false); setCrosshair(null); };

  return (
    <div className="flex h-full">
      {/* Left panel */}
      <div className="w-72 flex-shrink-0 bg-[#1A1F2B] border-r border-[#00FF88]/10 flex flex-col overflow-y-auto">
        {/* Site selector */}
        <div className="p-4 border-b border-[#00FF88]/10">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">{t("satellite.mineSite")}</div>
          <div className="space-y-1">
            {demoSites.map((site, i) => (
              <button
                key={site.id}
                onClick={() => setSelectedSite(i)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                  selectedSite === i
                    ? "bg-[#00FF88]/12 border border-[#00FF88]/25 text-[#00FF88]"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-300"
                }`}
              >
                <div className="text-sm">{site.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{site.coords} - {site.area} ha</div>
              </button>
            ))}
          </div>
        </div>

        {/* Date selector */}
        <div className="p-4 border-b border-[#00FF88]/10">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {t("satellite.acquisitionDate")}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setSelectedDate(Math.max(0, selectedDate - 1))}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-white/5 disabled:opacity-30"
              disabled={selectedDate === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex-1 text-center text-sm text-slate-200">{dateRange[selectedDate].label}</div>
            <button
              onClick={() => setSelectedDate(Math.min(dateRange.length - 1, selectedDate + 1))}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-white/5 disabled:opacity-30"
              disabled={selectedDate === dateRange.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {dateRange.map((d, i) => (
              <button
                key={d.label}
                onClick={() => setSelectedDate(i)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs transition-all ${
                  selectedDate === i ? "bg-[#00FF88]/12 text-[#00FF88]" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                <span>{d.label}</span>
                <span className="font-mono">{d.ndvi.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Satellite source */}
        <div className="p-4 border-b border-[#00FF88]/10">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">{t("satellite.source")}</div>
          <div className="flex flex-wrap gap-2">
            {satellites.map((s, i) => (
              <button
                key={s}
                onClick={() => setSelectedSatellite(i)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  selectedSatellite === i
                    ? "bg-blue-500/20 border border-blue-500/40 text-blue-300"
                    : "border border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Band selector */}
        <div className="p-4 border-b border-[#00FF88]/10">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            {t("satellite.bandComposite")}
          </div>
          <div className="space-y-1">
            {localizedBandOptions.map((band) => (
              <button
                key={band.id}
                onClick={() => { setSelectedBand(band.id); setNdviActive(band.id === "ndvi"); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                  selectedBand === band.id
                    ? "bg-violet-500/15 border border-violet-500/30 text-violet-300"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                <span>{band.label}</span>
                <span className="text-slate-600">{band.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overlay controls */}
        <div className="p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {t("satellite.overlayControls")}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{t("satellite.ndviOverlay")}</span>
              <button
                onClick={() => setNdviActive(!ndviActive)}
                className={`relative w-9 h-5 rounded-full transition-colors ${ndviActive ? "bg-[#00FF88]" : "bg-slate-700"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-[#0a0e15] transition-transform ${ndviActive ? "translate-x-4" : ""}`} />
              </button>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{t("satellite.opacity")}</span>
                <span>{Math.round(ndviOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={ndviOpacity}
                onChange={(e) => setNdviOpacity(Number(e.target.value))}
                className="w-full accent-[#00FF88] h-1.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main viewer */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Viewer toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1F2B]/90 border-b border-[#00FF88]/10">
          <div className="text-sm text-slate-300">{currentSite.name}</div>
          <span className="text-slate-700">-</span>
          <div className="text-xs text-slate-500">{currentDate.label}</div>
          <span className="text-slate-700">-</span>
          <div className="text-xs text-slate-500">{currentSatellite}</div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setZoom(Math.min(3, zoom + 0.25))}
              className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-white/10"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
              className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-white/10"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
              className="px-2 py-1 text-xs rounded text-slate-400 hover:text-slate-200 hover:bg-white/10"
            >
              {t("common.reset")}
            </button>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-1.5 rounded transition-colors ${showInfo ? "bg-[#00FF88]/15 text-[#00FF88]" : "text-slate-400 hover:text-slate-200 hover:bg-white/10"}`}
            >
              <Info className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-white/10">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-white/10">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewer area */}
        <div className="flex-1 relative overflow-hidden bg-[#0d1117]">
          <div
            ref={viewerRef}
            className="absolute inset-0 cursor-crosshair"
            style={{ cursor: isDragging ? "grabbing" : "crosshair" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="absolute inset-0 transition-transform"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: "center center",
              }}
            >
              <ImageWithFallback
                src={currentImageUrl}
                alt={currentSite.name}
                className="w-full h-full object-cover select-none"
                draggable={false}
              />
              <NDVIOverlay ndvi={currentNdvi} active={ndviActive} opacity={ndviOpacity * 0.6} />
            </div>

            {/* Grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: "linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)",
                backgroundSize: "80px 80px",
              }}
            />

            {/* Crosshair info */}
            {crosshair && (
              <div
                className="absolute pointer-events-none"
                style={{ left: crosshair.x + 12, top: crosshair.y + 12 }}
              >
                <div className="bg-[#1A1F2B]/90 border border-[#00FF88]/30 rounded-lg p-2 text-xs text-slate-200 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Crosshair className="w-3 h-3 text-[#00FF88]" />
                    <span className="text-[#00FF88]">{t("satellite.pixelProbe")}</span>
                  </div>
                  <div>{t("common.ndvi")}: <span className="text-[#00FF88]">{crosshair.ndvi.toFixed(3)}</span></div>
                  <div>{currentSite.coords}</div>
                </div>
              </div>
            )}

            {/* Corner coords */}
            <div className="absolute bottom-4 left-4 text-xs text-slate-400/70 font-mono">
              {currentSite.coords}
            </div>

            {/* Scale bar */}
            <div className="absolute bottom-4 right-4 flex items-end gap-2">
              <div className="flex flex-col items-center gap-0.5">
                <div className="h-1 w-16 bg-white/60 relative">
                  <div className="absolute left-0 top-0 h-3 w-px bg-white/60 -translate-y-1" />
                  <div className="absolute right-0 top-0 h-3 w-px bg-white/60 -translate-y-1" />
                </div>
                <span className="text-xs text-white/60">500m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info panel */}
        {showInfo && (
          <div className="bg-[#1A1F2B]/95 border-t border-[#00FF88]/10 p-4">
            <div className="grid grid-cols-4 gap-4 text-xs">
              <div>
                <div className="text-slate-500">{t("satellite.siteArea")}</div>
                <div className="text-slate-200 mt-0.5">{currentSite.area} ha</div>
              </div>
              <div>
                <div className="text-slate-500">{t("satellite.meanNdvi")}</div>
                <div className="text-[#00FF88] mt-0.5">{currentNdvi.toFixed(3)}</div>
              </div>
              <div>
                <div className="text-slate-500">{t("satellite.acquisition")}</div>
                <div className="text-slate-200 mt-0.5">{currentDate.label}</div>
              </div>
              <div>
                <div className="text-slate-500">{t("satellite.resolution")}</div>
                <div className="text-slate-200 mt-0.5">10m x 10m</div>
              </div>
            </div>
          </div>
        )}

        {/* NDVI Legend at bottom */}
        <div className="px-4 py-3 bg-[#13171F] border-t border-[#00FF88]/10">
          <NDVILegend title={t("satellite.ndviScale")} />
        </div>
      </div>
    </div>
  );
}
