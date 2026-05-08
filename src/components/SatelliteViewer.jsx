import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ndviOverlayImage from "../assets/image.png";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Download,
  Info,
  Layers,
  Maximize2,
  SlidersHorizontal,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useLanguage } from "../i18n";
import {
  makeSquareGeometryFromSite,
  parseSiteCoordinate,
} from "../api";
import { demoSites } from "../data/demoSites";
import {
  bandOptions,
  dateRange,
  ndviLegendStops,
} from "../data/demoSatelliteData";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const MAPBOX_STYLE = "mapbox://styles/mapbox/satellite-v9";
const SITE_SOURCE_ID = "site-boundary";
const SITE_FILL_LAYER_ID = "site-boundary-fill";
const SITE_LINE_LAYER_ID = "site-boundary-line";
const NDVI_SOURCE_ID = "sentinel-ndvi";
const NDVI_LAYER_ID = "sentinel-ndvi";

const NDVI_CLASSES = [
  { key: "bare", labelKey: "satellite.ndviBare", range: "< 0.20", color: "#a50026" },
  { key: "sparse", labelKey: "satellite.ndviSparse", range: "0.20-0.35", color: "#d73027" },
  { key: "moderate", labelKey: "satellite.ndviModerate", range: "0.35-0.50", color: "#fdae61" },
  { key: "healthy", labelKey: "satellite.ndviHealthy", range: "0.50-0.65", color: "#66bd63" },
  { key: "dense", labelKey: "satellite.ndviDense", range: "> 0.65", color: "#006837" },
];

if (MAPBOX_ACCESS_TOKEN) {
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
}

function NDVILegend({ title }) {
  return (
    <div className="rounded-lg bg-[#111113]/90 border border-zinc-800 p-3">
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

function getGeometryBounds(geometry) {
  const bounds = new mapboxgl.LngLatBounds();
  geometry.coordinates[0].forEach((coordinate) => bounds.extend(coordinate));
  return bounds;
}

function getImageCoordinates(geometry) {
  const ring = geometry.coordinates[0];
  return [ring[3], ring[2], ring[1], ring[0]];
}

function makeBoundaryFeature(geometry) {
  return {
    type: "Feature",
    properties: {},
    geometry,
  };
}

function getProbeNdvi(point, baseNdvi) {
  const noise =
    Math.sin(point.lng * 8) * 0.1 +
    Math.sin(point.lat * 6) * 0.08;
  return Math.max(0, Math.min(0.9, baseNdvi + noise));
}

function getStaticMapUrl(site) {
  if (!MAPBOX_ACCESS_TOKEN) return "";

  const { latitude, longitude } = parseSiteCoordinate(site.coords);
  return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${longitude},${latitude},15,0/1280x900@2x?access_token=${MAPBOX_ACCESS_TOKEN}`;
}

function getSiteDateNdvi(site, dateIndex) {
  const date = dateRange[dateIndex] ?? dateRange[0];
  const siteOffset = site.currentNdvi - dateRange[0].ndvi;
  return Math.max(0.05, Math.min(0.86, date.ndvi + siteOffset));
}

function getNdviClassStats(site, ndvi, dateIndex) {
  const recovery = Math.max(0, Math.min(1, (ndvi - site.baselineNdvi) / (site.targetNdvi - site.baselineNdvi)));
  const monthDrag = dateIndex * 0.9;
  const bare = Math.max(8, 34 - recovery * 18 + monthDrag);
  const sparse = Math.max(12, 32 - recovery * 10 + monthDrag * 0.5);
  const moderate = Math.max(18, 34 - Math.abs(recovery - 0.5) * 12);
  const healthy = Math.max(7, 13 + recovery * 8 - monthDrag * 0.25);
  const dense = Math.max(4, 100 - bare - sparse - moderate - healthy);
  const total = bare + sparse + moderate + healthy + dense;

  return NDVI_CLASSES.map((item) => {
    const raw = { bare, sparse, moderate, healthy, dense }[item.key];
    const percent = (raw / total) * 100;
    return {
      ...item,
      hectares: (site.area * percent) / 100,
      percent,
    };
  });
}

function getNdviClass(value) {
  if (value < 0.2) return NDVI_CLASSES[0];
  if (value < 0.35) return NDVI_CLASSES[1];
  if (value < 0.5) return NDVI_CLASSES[2];
  if (value < 0.65) return NDVI_CLASSES[3];
  return NDVI_CLASSES[4];
}

function getNdviBandLabel(value) {
  if (value < 0.35) return "Low";
  if (value < 0.55) return "Moderate";
  return "Recovering";
}

function fitSiteBounds(map, geometry, options = {}) {
  const container = map.getContainer();
  const width = container.clientWidth;
  const height = container.clientHeight;
  if (width < 160 || height < 160) return;

  map.resize();
  map.fitBounds(getGeometryBounds(geometry), {
    duration: 900,
    maxZoom: 17,
    padding: Math.min(70, Math.floor(Math.min(width, height) / 5)),
    ...options,
  });
}

export function SatelliteViewer() {
  const [selectedSite, setSelectedSite] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedBand, setSelectedBand] = useState("ndvi");
  const [ndviOpacity, setNdviOpacity] = useState(0.72);
  const [ndviActive, setNdviActive] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [crosshair, setCrosshair] = useState(null);
  const [mapError, setMapError] = useState(
    MAPBOX_ACCESS_TOKEN ? "" : "Add VITE_MAPBOX_ACCESS_TOKEN to .env and restart Vite."
  );
  const [mapReady, setMapReady] = useState(false);
  const { t } = useLanguage();

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const currentSite = demoSites[selectedSite] ?? demoSites[0];
  const currentDate = dateRange[selectedDate] ?? dateRange[0];
  const currentGeometry = useMemo(() => makeSquareGeometryFromSite(currentSite), [currentSite]);
  const staticMapUrl = useMemo(() => getStaticMapUrl(currentSite), [currentSite]);
  const currentNdvi = getSiteDateNdvi(currentSite, selectedDate);
  const displayedNdviUrl = ndviOverlayImage;
  const ndviStats = useMemo(
    () => getNdviClassStats(currentSite, currentNdvi, selectedDate),
    [currentSite, currentNdvi, selectedDate]
  );
  const currentNdviClass = getNdviClass(currentNdvi);

  const showStaticNdviOverlay = selectedBand === "ndvi" && ndviActive;

  const localizedBandOptions = bandOptions.map((band) => ({
    ...band,
    label: band.id === "ndvi" ? t("common.ndvi") :
      band.id === "rgb" ? t("satellite.trueColor") : band.label,
    description: band.id === "ndvi" ? t("satellite.vegetationIndex") :
      band.id === "rgb" ? t("satellite.rgbComposite") : band.description,
  }));

  useEffect(() => {
    if (!MAPBOX_ACCESS_TOKEN) {
      return undefined;
    }

    if (!mapContainerRef.current || mapRef.current) {
      return undefined;
    }

    const { latitude, longitude } = parseSiteCoordinate(currentSite.coords);
    const map = new mapboxgl.Map({
      attributionControl: true,
      center: [longitude, latitude],
      container: mapContainerRef.current,
      dragRotate: false,
      pitchWithRotate: false,
      style: MAPBOX_STYLE,
      zoom: 14,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    map.on("load", () => setMapReady(true));
    map.on("error", (event) => {
      setMapError(event.error?.message ?? "Mapbox failed to load.");
    });

    return () => {
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [currentSite.coords]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const boundary = makeBoundaryFeature(currentGeometry);

    if (map.getSource(SITE_SOURCE_ID)) {
      map.getSource(SITE_SOURCE_ID).setData(boundary);
    } else {
      map.addSource(SITE_SOURCE_ID, {
        type: "geojson",
        data: boundary,
      });
      map.addLayer({
        id: SITE_FILL_LAYER_ID,
        type: "fill",
        source: SITE_SOURCE_ID,
        paint: {
          "fill-color": "#10b981",
          "fill-opacity": 0.08,
        },
      });
      map.addLayer({
        id: SITE_LINE_LAYER_ID,
        type: "line",
        source: SITE_SOURCE_ID,
        paint: {
          "line-color": "#34d399",
          "line-width": 2,
        },
      });
    }

    requestAnimationFrame(() => fitSiteBounds(map, currentGeometry));
  }, [currentGeometry, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !displayedNdviUrl) return;

    const coordinates = getImageCoordinates(currentGeometry);
    if (map.getSource(NDVI_SOURCE_ID)) {
      map.getSource(NDVI_SOURCE_ID).updateImage({
        url: displayedNdviUrl,
        coordinates,
      });
    } else {
      map.addSource(NDVI_SOURCE_ID, {
        type: "image",
        url: displayedNdviUrl,
        coordinates,
      });
      map.addLayer({
        id: NDVI_LAYER_ID,
        type: "raster",
        source: NDVI_SOURCE_ID,
        paint: {
          "raster-fade-duration": 0,
          "raster-opacity": 0,
          "raster-resampling": "nearest",
        },
      });
    }
  }, [currentGeometry, displayedNdviUrl, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !map.getLayer(NDVI_LAYER_ID)) return;
    map.setPaintProperty(NDVI_LAYER_ID, "raster-resampling", "nearest");
    map.setPaintProperty(NDVI_LAYER_ID, "raster-opacity", showStaticNdviOverlay ? ndviOpacity : 0);
  }, [mapReady, ndviOpacity, showStaticNdviOverlay]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return undefined;

    const handleMouseMove = (event) => {
      setCrosshair({
        x: event.point.x,
        y: event.point.y,
        ndvi: getProbeNdvi(event.lngLat, currentNdvi),
      });
    };
    const handleMouseOut = () => setCrosshair(null);

    map.on("mousemove", handleMouseMove);
    map.on("mouseout", handleMouseOut);

    return () => {
      map.off("mousemove", handleMouseMove);
      map.off("mouseout", handleMouseOut);
    };
  }, [currentNdvi, mapReady]);

  return (
    <div className="flex h-screen min-h-[640px]">
      <div className="w-72 flex-shrink-0 bg-[#111113] border-r border-zinc-800 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-zinc-800">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">{t("satellite.mineSite")}</div>
          <div className="space-y-1">
            {demoSites.map((site, i) => (
              <button
                key={site.id}
                onClick={() => setSelectedSite(i)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                  selectedSite === i
                    ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-300"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-300"
                }`}
              >
                <div className="text-sm">{site.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{site.region}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-b border-zinc-800">
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
                  selectedDate === i ? "bg-emerald-500/10 text-emerald-300" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                <span>{d.label}</span>
                {i === selectedDate && <span className="text-emerald-300">{getNdviBandLabel(getSiteDateNdvi(currentSite, i))}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-b border-zinc-800">
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
                className={`relative w-9 h-5 rounded-full transition-colors ${ndviActive ? "bg-emerald-500" : "bg-slate-700"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-[#052e16] transition-transform ${ndviActive ? "translate-x-4" : ""}`} />
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
                className="w-full accent-emerald-500 h-1.5"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">{t("satellite.ndviAnalytics")}</div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 mb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-slate-500">{t("satellite.formula")}</div>
                <div className="mt-1 font-mono text-[11px] text-emerald-300">NDVI = (NIR - RED) / (NIR + RED)</div>
                <div className="mt-1 text-[11px] text-slate-500">Sentinel-2 B08 + B04</div>
              </div>
              <div className="text-right">
                <div className="text-lg text-emerald-300">{getNdviBandLabel(currentNdvi)}</div>
                <div className="text-[11px] text-slate-500" style={{ color: currentNdviClass.color }}>
                  {t(currentNdviClass.labelKey)}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {ndviStats.map((item) => (
              <div key={item.key}>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {t(item.labelKey)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#111113]/90 border-b border-zinc-800">
          <div className="text-sm text-slate-300">{currentSite.name}</div>
          <span className="text-slate-700">-</span>
          <div className="text-xs text-slate-500">{currentDate.label}</div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => mapRef.current?.zoomIn()}
              className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-white/10"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => mapRef.current?.zoomOut()}
              className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-white/10"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (mapRef.current) {
                  fitSiteBounds(mapRef.current, currentGeometry, { duration: 700 });
                }
              }}
              className="px-2 py-1 text-xs rounded text-slate-400 hover:text-slate-200 hover:bg-white/10"
            >
              {t("common.reset")}
            </button>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-1.5 rounded transition-colors ${showInfo ? "bg-emerald-500/15 text-emerald-300" : "text-slate-400 hover:text-slate-200 hover:bg-white/10"}`}
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

        <div className="flex-1 relative overflow-hidden bg-[#0d1117]">
          {staticMapUrl && (
            <img
              src={staticMapUrl}
              alt={`${currentSite.name} satellite`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                mapReady && !mapError ? "opacity-0" : "opacity-100"
              }`}
            />
          )}
          {showStaticNdviOverlay && (!mapReady || mapError) && (
            <img
              src={displayedNdviUrl}
              alt={`${currentSite.name} demo NDVI`}
              className="absolute inset-0 h-full w-full object-cover pointer-events-none"
              style={{ imageRendering: "pixelated", opacity: ndviOpacity }}
            />
          )}
          <div
            ref={mapContainerRef}
            className={`absolute inset-0 transition-opacity duration-500 ${
              mapReady && !mapError ? "opacity-100" : "opacity-0"
            }`}
          />
          {!mapReady && !mapError && (
            <div className="absolute top-4 right-4 rounded-lg bg-[#111113]/90 border border-zinc-800 px-3 py-2 text-xs text-slate-300">
              Loading Mapbox satellite...
            </div>
          )}
          {mapError && (
            <div className="absolute top-4 right-4 max-w-sm rounded-lg bg-[#111113]/90 border border-red-500/30 px-3 py-2 text-xs text-red-300">
              {mapError}
            </div>
          )}

          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: "linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          {crosshair && (
            <div
              className="absolute pointer-events-none"
              style={{ left: crosshair.x + 12, top: crosshair.y + 12 }}
            >
              <div className="bg-[#111113]/90 border border-emerald-500/30 rounded-lg p-2 text-xs text-slate-200 whitespace-nowrap">
                <div className="flex items-center gap-1.5 mb-1">
                  <Crosshair className="w-3 h-3 text-emerald-300" />
                  <span className="text-emerald-300">{t("satellite.pixelProbe")}</span>
                </div>
                <div>{t("common.ndvi")}: <span className="text-emerald-300">{getNdviBandLabel(crosshair.ndvi)}</span></div>
              </div>
            </div>
          )}

          {mapReady && (
            <div className="absolute top-4 left-4 rounded-lg bg-[#111113]/90 border border-zinc-800 px-3 py-2 text-xs pointer-events-none">
              <div className="text-emerald-300">
                {showStaticNdviOverlay ? t("satellite.demoNdviLayer") : "Mapbox satellite"}
              </div>
              {showStaticNdviOverlay && (
                <div className="mt-1 text-slate-400">
                  {t("satellite.recoveredArea")}: <span className="text-slate-200">visible recovery zones</span>
                </div>
              )}
            </div>
          )}

          <div className="absolute bottom-4 right-4 flex items-end gap-2 pointer-events-none">
            <div className="flex flex-col items-center gap-0.5">
              <div className="h-1 w-16 bg-white/70 relative">
                <div className="absolute left-0 top-0 h-3 w-px bg-white/70 -translate-y-1" />
                <div className="absolute right-0 top-0 h-3 w-px bg-white/70 -translate-y-1" />
              </div>
              <span className="text-xs text-white/70">500m</span>
            </div>
          </div>
        </div>

        {showInfo && (
          <div className="bg-[#111113]/95 border-t border-zinc-800 p-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-xs">
              <div>
                <div className="text-slate-500">{t("satellite.siteArea")}</div>
                <div className="text-slate-200 mt-0.5">pilot zone</div>
              </div>
              <div>
                <div className="text-slate-500">{t("satellite.meanNdvi")}</div>
                <div className="text-emerald-300 mt-0.5">{getNdviBandLabel(currentNdvi)}</div>
              </div>
              <div>
                <div className="text-slate-500">{t("satellite.acquisition")}</div>
                <div className="text-slate-200 mt-0.5">
                  {currentDate.label}
                </div>
              </div>
              <div>
                <div className="text-slate-500">{t("satellite.resolution")}</div>
                <div className="text-slate-200 mt-0.5">10m</div>
              </div>
              <div>
                <div className="text-slate-500">{t("common.validPixels")}</div>
                <div className="text-emerald-300 mt-0.5">clear</div>
              </div>
              <div>
                <div className="text-slate-500">{t("common.cloudCover")}</div>
                <div className="text-slate-200 mt-0.5">low</div>
              </div>
              <div>
                <div className="text-slate-500">{t("satellite.recoveredArea")}</div>
                <div className="text-emerald-300 mt-0.5">mapped</div>
              </div>
              <div>
                <div className="text-slate-500">{t("satellite.class")}</div>
                <div className="mt-0.5" style={{ color: currentNdviClass.color }}>{t(currentNdviClass.labelKey)}</div>
              </div>
            </div>
          </div>
        )}

        <div className="px-4 py-3 bg-[#09090b] border-t border-zinc-800">
          <NDVILegend title={t("satellite.ndviScale")} />
        </div>
      </div>
    </div>
  );
}
