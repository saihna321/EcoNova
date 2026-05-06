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
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../i18n";
import {
  dashboardKpis,
  ndviTrend,
  radarData,
  recentImagery,
  siteProgress,
} from "../data/demoNdviData";

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

const iconByKey = {
  activity: Activity,
  alertTriangle: AlertTriangle,
  leaf: Leaf,
  mapPin: MapPin,
};

export function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useLanguage();

  const localizedKpis = dashboardKpis.map((kpi) => ({
    ...kpi,
    icon: iconByKey[kpi.iconKey] ?? Activity,
    label: t(kpi.labelKey),
    sub: t(kpi.subKey),
  }));

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const mainMapImage = recentImagery[0];

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
                <div className={`flex items-center gap-1 text-xs ${kpi.positive === false ? "text-red-400" : "text-[#00FF88]"}`}>
                  {kpi.positive === true && <ArrowUpRight className="w-3 h-3" />}
                  {kpi.positive === false && <ArrowDownRight className="w-3 h-3" />}
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

      {/* Primary NDVI map */}
      <div className="rounded-xl bg-[#1A1F2B] border border-[#00FF88]/12 overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#00FF88]/10">
          <div>
            <h3 className="text-slate-200">{t("dashboard.ndviMap")}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{t("dashboard.ndviMapSub")}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-[#00FF88]/20 bg-[#00FF88]/8 px-3 py-1.5 text-xs text-[#00FF88]">
            <span className="h-2 w-2 rounded-full bg-[#00FF88]" />
            Sentinel-2
          </div>
        </div>
        <div className="relative h-[420px] min-h-[360px] overflow-hidden bg-[#0d1117]">
          <ImageWithFallback
            src={mainMapImage.url}
            alt={mainMapImage.site}
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 mix-blend-multiply opacity-70"
            style={{
              background:
                "radial-gradient(circle at 30% 35%, rgba(0,255,136,0.68), transparent 28%), radial-gradient(circle at 68% 46%, rgba(132,204,22,0.58), transparent 26%), radial-gradient(circle at 52% 72%, rgba(234,179,8,0.44), transparent 24%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: "linear-gradient(rgba(34,197,94,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.28) 1px, transparent 1px)",
              backgroundSize: "96px 96px",
            }}
          />
          <div className="absolute left-5 top-5 rounded-lg border border-black/20 bg-black/55 px-4 py-3 backdrop-blur">
            <div className="text-xs text-slate-400">{mainMapImage.site}</div>
            <div className="mt-1 text-3xl text-[#00FF88]">{mainMapImage.ndvi.toFixed(2)}</div>
            <div className="text-xs text-slate-300">{t("common.ndvi")}</div>
          </div>
          <div className="absolute bottom-5 left-5 right-5">
            <div className="rounded-lg border border-white/10 bg-black/55 p-3 backdrop-blur">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                <span>{t("dashboard.timeline")}</span>
                <span>{mainMapImage.date}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                defaultValue={86}
                className="w-full accent-[#00FF88]"
                aria-label={t("dashboard.timeline")}
              />
            </div>
          </div>
          <div className="absolute bottom-24 right-5 rounded-lg border border-white/10 bg-black/55 px-3 py-2 text-xs text-slate-300 backdrop-blur">
            {t("dashboard.sentinelOnly")}
          </div>
        </div>
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

    </div>
  );
}
