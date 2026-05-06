import { useState } from "react";
import {
  Mountain,
  MapPin,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  BarChart2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../i18n";
import { demoSites, siteImages } from "../data/demoSites";

function ndviColor(v) {
  if (v >= 0.6) return "#00FF88";
  if (v >= 0.45) return "#84cc16";
  if (v >= 0.3) return "#eab308";
  if (v >= 0.15) return "#f97316";
  return "#ef4444";
}

function statusStyle(s) {
  const map = {
    achieved: "text-[#00FF88] bg-[#00FF88]/10 border-[#00FF88]/25",
    "on-track": "text-blue-400 bg-blue-400/10 border-blue-500/30",
    "at-risk": "text-yellow-400 bg-yellow-400/10 border-yellow-500/30",
    critical: "text-red-400 bg-red-400/10 border-red-500/30",
  };
  return map[s] ?? "text-slate-400";
}

function complianceStyle(c) {
  if (c === "Compliant") return "text-emerald-400";
  if (c === "Under Review") return "text-yellow-400";
  return "text-red-400";
}

function complianceKey(c) {
  if (c === "Compliant") return "status.compliant";
  if (c === "Under Review") return "status.underReview";
  if (c === "Non-Compliant") return "status.nonCompliant";
  return "common.status";
}

export function Sites() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedSite, setExpandedSite] = useState(null);
  const { t } = useLanguage();

  const stats = [
    { label: t("sites.totalArea"), value: "1,059 ha", color: "text-[#00FF88]", bg: "bg-[#00FF88]/10 border-[#00FF88]/20" },
    { label: t("sites.onTrack"), value: "4 / 5", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { label: t("sites.avgNdvi"), value: "0.556", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
    { label: t("sites.targetAchievement"), value: "81.6%", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  ];

  const filtered = demoSites.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.region.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || s.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-slate-200">{t("sites.title")}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{t("sites.activeZones", { count: demoSites.length })}</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("sites.search")}
              className="pl-9 pr-4 py-2 bg-[#1A1F2B] border border-[#00FF88]/15 rounded-lg text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#00FF88]/35 w-52"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#1A1F2B] border border-[#00FF88]/15 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-[#00FF88]/35 appearance-none cursor-pointer"
            >
              <option value="all">{t("sites.allStatus")}</option>
              <option value="achieved">{t("status.achieved")}</option>
              <option value="on-track">{t("status.on-track")}</option>
              <option value="at-risk">{t("status.at-risk")}</option>
              <option value="critical">{t("status.critical")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-xl border p-4 ${stat.bg}`}>
            <div className={`text-xl ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#00FF88]/15 bg-[#1A1F2B]/60 p-8 text-center">
            <div className="text-sm text-slate-300">{t("sites.noMatches")}</div>
            <div className="mt-1 text-xs text-slate-500">{t("sites.adjustFilters")}</div>
          </div>
        )}
        {filtered.map((site, idx) => {
          const isExpanded = expandedSite === site.id;
          return (
            <div
              key={site.id}
              className="rounded-xl bg-[#1A1F2B] border border-[#00FF88]/10 overflow-hidden"
            >
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/2 transition-colors"
                onClick={() => setExpandedSite(isExpanded ? null : site.id)}
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={siteImages[idx % siteImages.length]}
                    alt={site.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-slate-200">{site.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${statusStyle(site.status)}`}>
                          {t(`status.${site.status}`)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{site.region}</span>
                        <span>{site.type}</span>
                        <span>{site.area} ha</span>
                        <span>{site.coords}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-center">
                        <div className="text-sm" style={{ color: ndviColor(site.currentNdvi) }}>
                          {site.currentNdvi.toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-600">{t("common.ndvi")}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-slate-300">{site.progress}%</div>
                        <div className="text-xs text-slate-600">{t("common.progress")}</div>
                      </div>
                      <div className="text-center hidden sm:block">
                        <div className={`text-xs ${complianceStyle(site.compliance)}`}>{t(complianceKey(site.compliance))}</div>
                        <div className="text-xs text-slate-600">{t("common.status")}</div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </div>
                  <div className="mt-2.5 h-1.5 bg-[#252D3D] rounded-full overflow-hidden max-w-md">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${site.progress}%`,
                        backgroundColor: ndviColor(site.currentNdvi),
                      }}
                    />
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-[#00FF88]/8 p-4 bg-[#1F2535]/50">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <Mountain className="w-3.5 h-3.5" />
                          {t("sites.details")}
                        </div>
                        <div className="space-y-2">
                          {[
                            { label: t("sites.rehabStarted"), value: site.rehabStart },
                            { label: t("sites.targetDate"), value: site.targetDate },
                            { label: t("sites.targetNdvi"), value: site.targetNdvi.toFixed(2) },
                            { label: t("common.currentNdvi"), value: site.currentNdvi.toFixed(2) },
                            { label: t("sites.speciesCount"), value: site.species },
                            { label: t("sites.lastCapture"), value: site.lastCapture },
                          ].map((row) => (
                            <div key={row.label} className="flex justify-between text-xs">
                              <span className="text-slate-500">{row.label}</span>
                              <span className="text-slate-300">{row.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <BarChart2 className="w-3.5 h-3.5" />
                        {t("sites.ndviHistory")}
                      </div>
                      <ResponsiveContainer width="100%" height={140}>
                        <LineChart data={site.ndviHistory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#252D3D" />
                          <XAxis dataKey="m" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                          <YAxis domain={[0, 0.75]} tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#1F2535", border: "1px solid rgba(0,255,136,0.25)", borderRadius: "8px", color: "#e2e8f0", fontSize: 11 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="v"
                            stroke={ndviColor(site.currentNdvi)}
                            strokeWidth={2}
                            dot={{ fill: ndviColor(site.currentNdvi), r: 3 }}
                            activeDot={{ fill: "#ffffff", r: 4, stroke: ndviColor(site.currentNdvi), strokeWidth: 2 }}
                            name={t("common.ndvi")}
                          />
                          <Line
                            type="monotone"
                            dataKey="t"
                            stroke="#475569"
                            strokeDasharray="4 2"
                            strokeWidth={1.5}
                            dot={false}
                            name={t("common.target")}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
