import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";
import {
  Leaf,
  AlertTriangle,
  MapPin,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../i18n";

const ndviTrend = [
  { month: "Jun '24", ndvi: 0.21, baseline: 0.18 },
  { month: "Jul '24", ndvi: 0.23, baseline: 0.18 },
  { month: "Aug '24", ndvi: 0.25, baseline: 0.18 },
  { month: "Sep '24", ndvi: 0.28, baseline: 0.18 },
  { month: "Oct '24", ndvi: 0.32, baseline: 0.18 },
  { month: "Nov '24", ndvi: 0.35, baseline: 0.18 },
  { month: "Dec '24", ndvi: 0.38, baseline: 0.18 },
  { month: "Jan '25", ndvi: 0.36, baseline: 0.18 },
  { month: "Feb '25", ndvi: 0.40, baseline: 0.18 },
  { month: "Mar '25", ndvi: 0.43, baseline: 0.18 },
  { month: "Apr '25", ndvi: 0.46, baseline: 0.18 },
  { month: "May '25", ndvi: 0.48, baseline: 0.18 },
];

const siteProgress = [
  { site: "Kalgoorlie North", ndvi: 0.52, target: 0.60, area: 124, status: "on-track" },
  { site: "Pilbara West", ndvi: 0.38, target: 0.55, area: 287, status: "at-risk" },
  { site: "Mount Isa Central", ndvi: 0.61, target: 0.60, area: 95, status: "achieved" },
  { site: "Hunter Valley", ndvi: 0.44, target: 0.50, area: 212, status: "on-track" },
  { site: "Bowen Basin S3", ndvi: 0.29, target: 0.55, area: 341, status: "critical" },
];

const radarData = [
  { metric: "Vegetation Cover", value: 72 },
  { metric: "Soil Stability", value: 68 },
  { metric: "Species Diversity", value: 55 },
  { metric: "Canopy Height", value: 48 },
  { metric: "Water Retention", value: 63 },
  { metric: "Carbon Seq.", value: 41 },
];

const recentImagery = [
  {
    id: 1,
    site: "Kalgoorlie North",
    date: "May 3, 2025",
    satellite: "Sentinel-2",
    ndvi: 0.52,
    url: "https://images.unsplash.com/photo-1570979872224-a1ea9f1248b0?w=400&q=80",
  },
  {
    id: 2,
    site: "Pilbara West",
    date: "May 2, 2025",
    satellite: "Landsat-8",
    ndvi: 0.38,
    url: "https://images.unsplash.com/photo-1776012203102-a024822685cc?w=400&q=80",
  },
  {
    id: 3,
    site: "Mount Isa Central",
    date: "May 1, 2025",
    satellite: "Sentinel-2",
    ndvi: 0.61,
    url: "https://images.unsplash.com/photo-1686011872096-4010d5203166?w=400&q=80",
  },
  {
    id: 4,
    site: "Hunter Valley",
    date: "Apr 30, 2025",
    satellite: "MODIS",
    ndvi: 0.44,
    url: "https://images.unsplash.com/photo-1661619135472-4c85cdb3dc90?w=400&q=80",
  },
];

function ndviColor(value) {
  if (value >= 0.6) return "#00FF88";
  if (value >= 0.45) return "#84cc16";
  if (value >= 0.3) return "#eab308";
  if (value >= 0.15) return "#f97316";
  return "#ef4444";
}

function statusColor(status) {
  switch (status) {
    case "achieved": return "text-[#00FF88] bg-[#00FF88]/10 border-[#00FF88]/30";
    case "on-track": return "text-blue-400 bg-blue-400/10 border-blue-500/30";
    case "at-risk": return "text-yellow-400 bg-yellow-400/10 border-yellow-500/30";
    case "critical": return "text-red-400 bg-red-400/10 border-red-500/30";
    default: return "text-slate-400";
  }
}

const kpis = [
  {
    label: "Average NDVI",
    value: "0.48",
    change: "+0.06",
    positive: true,
    icon: Leaf,
    sub: "vs. last quarter",
    color: "mint",
  },
  {
    label: "Rehab Progress",
    value: "68.4%",
    change: "+3.2%",
    positive: true,
    icon: Activity,
    sub: "of target achieved",
    color: "blue",
  },
  {
    label: "Active Sites",
    value: "12",
    change: "+2",
    positive: true,
    icon: MapPin,
    sub: "3 sites monitored",
    color: "violet",
  },
  {
    label: "Critical Alerts",
    value: "3",
    change: "-1",
    positive: true,
    icon: AlertTriangle,
    sub: "requires action",
    color: "red",
  },
];

const colorMap = {
  mint: "bg-[#00FF88]/10 border-[#00FF88]/20 text-[#00FF88]",
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  violet: "bg-violet-500/10 border-violet-500/20 text-violet-400",
  red: "bg-red-500/10 border-red-500/20 text-red-400",
};

const iconBgMap = {
  mint: "bg-[#00FF88]/15 text-[#00FF88]",
  blue: "bg-blue-500/20 text-blue-400",
  violet: "bg-violet-500/20 text-violet-400",
  red: "bg-red-500/20 text-red-400",
};

export function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useLanguage();

  const localizedKpis = [
    { ...kpis[0], label: t("dashboard.averageNdvi"), sub: t("dashboard.vsLastQuarter") },
    { ...kpis[1], label: t("dashboard.rehabProgress"), sub: t("dashboard.ofTarget") },
    { ...kpis[2], label: t("dashboard.activeSites"), sub: t("dashboard.monitoredSites") },
    { ...kpis[3], label: t("dashboard.criticalAlerts"), sub: t("dashboard.requiresAction") },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-200">{t("dashboard.overview")}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{t("dashboard.overviewSub")}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00FF88]/15 border border-[#00FF88]/25 text-[#00FF88] hover:bg-[#00FF88]/20 transition-colors text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          {t("dashboard.refresh")}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {localizedKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`rounded-xl border p-5 ${colorMap[kpi.color]}`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgMap[kpi.color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs ${kpi.positive ? "text-[#00FF88]" : "text-red-400"}`}>
                  {kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl text-slate-100">{kpi.value}</div>
                <div className="text-sm text-slate-300 mt-0.5">{kpi.label}</div>
                <div className="text-xs text-slate-500 mt-1">{kpi.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* NDVI Trend Chart */}
        <div className="xl:col-span-2 rounded-xl bg-[#1A1F2B] border border-[#00FF88]/12 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-slate-200">{t("dashboard.ndviTrend")}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{t("dashboard.ndviTrendSub")}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#00FF88] inline-block" />{t("common.ndvi")}</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-slate-600 inline-block" />{t("dashboard.baseline")}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ndviTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ndviGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF88" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00FF88" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#252D3D" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 0.7]} tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2535", border: "1px solid rgba(0,255,136,0.25)", borderRadius: "8px", color: "#e2e8f0" }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Area type="monotone" dataKey="baseline" stroke="#374151" strokeDasharray="4 2" fill="none" dot={false} strokeWidth={1.5} />
              <Area type="monotone" dataKey="ndvi" stroke="#00FF88" fill="url(#ndviGrad)" dot={false} strokeWidth={2.5} activeDot={{ fill: "#00FF88", r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Rehabilitation Radar */}
        <div className="rounded-xl bg-[#1A1F2B] border border-[#00FF88]/12 p-5">
          <div className="mb-3">
            <h3 className="text-slate-200">{t("dashboard.rehabIndicators")}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{t("dashboard.rehabIndicatorsSub")}</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#252D3D" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#64748b", fontSize: 10 }} />
              <Radar dataKey="value" stroke="#00FF88" fill="#00FF88" fillOpacity={0.12} strokeWidth={2} dot={{ fill: "#00FF88", r: 3 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Site Progress + Bar Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Site Progress */}
        <div className="xl:col-span-2 rounded-xl bg-[#1A1F2B] border border-[#00FF88]/12 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-slate-200">{t("dashboard.siteProgress")}</h3>
              <p className="text-xs text-slate-500">{t("dashboard.siteProgressSub")}</p>
            </div>
            <Link to="/sites" className="text-xs text-[#00FF88] hover:text-[#00cc6e] transition-colors">
              {t("common.viewAll")} -&gt;
            </Link>
          </div>

          <div className="space-y-3">
            {siteProgress.map((site) => (
              <div key={site.site} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300 truncate">{site.site}</span>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <span className="text-xs text-slate-400">{(site.ndvi * 100).toFixed(0)}% / {(site.target * 100).toFixed(0)}%</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${statusColor(site.status)}`}>
                        {t(`status.${site.status}`)}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#252D3D] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(site.ndvi / site.target) * 100}%`,
                        backgroundColor: ndviColor(site.ndvi),
                      }}
                    />
                  </div>
                </div>
                <div className="text-xs text-slate-500 flex-shrink-0 w-16 text-right">{site.area} ha</div>
              </div>
            ))}
          </div>

          {/* NDVI legend */}
          <div className="mt-5 pt-4 border-t border-[#00FF88]/10">
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-xs text-slate-500 mr-2">{t("dashboard.ndviScale")}:</span>
              {[
                { label: `< 0.15 ${t("dashboard.bare")}`, color: "#ef4444" },
                { label: `0.15-0.3 ${t("dashboard.sparse")}`, color: "#f97316" },
                { label: `0.3-0.45 ${t("dashboard.moderate")}`, color: "#eab308" },
                { label: `0.45-0.6 ${t("dashboard.good")}`, color: "#84cc16" },
                { label: `> 0.6 ${t("dashboard.dense")}`, color: "#00FF88" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1 mr-3">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-500 whitespace-nowrap">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NDVI Bar Chart */}
        <div className="rounded-xl bg-[#1A1F2B] border border-[#00FF88]/12 p-5">
          <div className="mb-3">
            <h3 className="text-slate-200">{t("dashboard.ndviBySite")}</h3>
            <p className="text-xs text-slate-500">{t("dashboard.currentVsTarget")}</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={siteProgress} layout="vertical" margin={{ top: 0, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252D3D" horizontal={false} />
              <XAxis type="number" domain={[0, 0.75]} tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="site" tick={{ fill: "#94a3b8", fontSize: 10 }} tickLine={false} axisLine={false} width={100}
                tickFormatter={(v) => v.split(" ")[0] + " " + (v.split(" ")[1] ?? "")}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2535", border: "1px solid rgba(0,255,136,0.25)", borderRadius: "8px", color: "#e2e8f0", fontSize: 12 }}
              />
              <Bar dataKey="target" fill="#252D3D" radius={[0, 4, 4, 0]} name={t("common.target")} />
              <Bar dataKey="ndvi" radius={[0, 4, 4, 0]} name={t("common.currentNdvi")}>
                {siteProgress.map((entry, i) => (
                  <Cell key={`ndvi-cell-${i}`} fill={ndviColor(entry.ndvi)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Satellite Imagery */}
      <div className="rounded-xl bg-[#1A1F2B] border border-[#00FF88]/12 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-slate-200">{t("dashboard.recentImagery")}</h3>
            <p className="text-xs text-slate-500">{t("dashboard.recentImagerySub")}</p>
          </div>
          <Link to="/satellite" className="flex items-center gap-1.5 text-xs text-[#00FF88] hover:text-[#00cc6e] transition-colors">
            <Layers className="w-3.5 h-3.5" />
            {t("dashboard.openViewer")} -&gt;
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {recentImagery.map((img) => (
            <div key={img.id} className="rounded-lg overflow-hidden border border-[#00FF88]/10 group cursor-pointer">
              <div className="relative h-32 overflow-hidden">
                <ImageWithFallback
                  src={img.url}
                  alt={img.site}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  className="absolute inset-0 mix-blend-multiply opacity-40 group-hover:opacity-20 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${ndviColor(img.ndvi)}88, transparent)`,
                  }}
                />
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-xs bg-black/60 text-slate-200">
                  {img.satellite}
                </div>
                <div
                  className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-xs text-black font-semibold"
                  style={{ backgroundColor: ndviColor(img.ndvi) + "dd" }}
                >
                  {img.ndvi.toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-[#1F2535]">
                <div className="text-sm text-slate-300 truncate">{img.site}</div>
                <div className="text-xs text-slate-500 mt-0.5">{img.date}</div>
                <div className="mt-2 h-1.5 bg-[#252D3D] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${img.ndvi * 100}%`, backgroundColor: ndviColor(img.ndvi) }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
