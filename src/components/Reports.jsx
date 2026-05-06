import { useState } from "react";
import {
  FileBarChart2,
  Download,
  BarChart2,
  TrendingUp,
  Leaf,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useLanguage } from "../i18n";
import {
  annualProgress,
  quarterlyNdvi,
  siteColors,
  siteLabels,
} from "../data/demoNdviData";
import { demoReports } from "../data/demoReports";

function reportStatusStyle(s) {
  if (s === "Final") return "text-emerald-400 bg-emerald-400/10 border-emerald-500/30";
  if (s === "Action Required") return "text-red-400 bg-red-400/10 border-red-500/30";
  if (s === "Processing") return "text-yellow-400 bg-yellow-400/10 border-yellow-500/30";
  return "text-slate-400 bg-slate-400/10 border-slate-500/30";
}

function reportTypeStyle(t) {
  if (t === "Quarterly") return "text-blue-400";
  if (t === "Annual") return "text-violet-400";
  if (t === "Compliance") return "text-orange-400";
  if (t === "Alert") return "text-red-400";
  if (t === "Imagery") return "text-cyan-400";
  return "text-slate-400";
}

export function Reports() {
  const selectedPeriod = "quarterly";
  const [selectedSites, setSelectedSites] = useState(["kalN", "pilW", "mtI"]);
  const { t } = useLanguage();

  const summaryKpis = [
    { label: t("reports.generated"), value: "48", sub: t("reports.thisYear"), icon: FileBarChart2, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { label: t("reports.meanGain"), value: "+0.18", sub: t("reports.sinceBaseline"), icon: TrendingUp, color: "text-[#00FF88]", bg: "bg-[#00FF88]/10 border-[#00FF88]/20" },
    { label: t("reports.vegetationCover"), value: "72%", sub: t("reports.acrossAllSites"), icon: Leaf, color: "text-lime-400", bg: "bg-lime-500/10 border-lime-500/20" },
    { label: t("reports.complianceRate"), value: "83%", sub: "Q1 2025", icon: BarChart2, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  ];

  const toggleSite = (key) => {
    setSelectedSites((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-200">{t("reports.title")}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{t("reports.subtitle")}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00FF88]/15 border border-[#00FF88]/25 text-[#00FF88] hover:bg-[#00FF88]/20 transition-colors text-sm">
          <Download className="w-4 h-4" />
          {t("reports.exportPdf")}
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={`rounded-xl border p-4 ${kpi.bg}`}>
              <div className="flex items-start justify-between">
                <Icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div className={`text-2xl mt-3 ${kpi.color}`}>{kpi.value}</div>
              <div className="text-sm text-slate-300 mt-0.5">{kpi.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Multi-site NDVI chart */}
      <div className="rounded-xl bg-[#1A1F2B] border border-[#00FF88]/12 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
          <div>
            <h3 className="text-slate-200">{t("reports.ndviBySite")}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{t("reports.quarterlyView", { period: selectedPeriod })}</p>
          </div>
          <div className="sm:ml-auto flex flex-wrap gap-2">
            {Object.entries(siteLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleSite(key)}
                className={`px-2.5 py-1 rounded-full text-xs border transition-all ${
                  selectedSites.includes(key)
                    ? "border-transparent text-white"
                    : "border-slate-700 text-slate-600"
                }`}
                style={selectedSites.includes(key) ? { backgroundColor: siteColors[key] + "33", borderColor: siteColors[key] + "66", color: siteColors[key] } : {}}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {selectedSites.length === 0 ? (
          <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed border-[#00FF88]/15 bg-[#13171F]/40 text-sm text-slate-500">
            {t("reports.selectSite")}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={quarterlyNdvi} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <defs>
                {Object.entries(siteColors).map(([key, color]) => (
                  <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#252D3D" />
              <XAxis dataKey="q" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 0.75]} tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2535", border: "1px solid rgba(0,255,136,0.25)", borderRadius: "8px", color: "#e2e8f0", fontSize: 12 }}
              />
              <Legend
                formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 11 }}>{siteLabels[v] ?? v}</span>}
              />
              {Object.entries(siteColors)
                .filter(([key]) => selectedSites.includes(key))
                .map(([key, color]) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={color}
                    fill={`url(#grad-${key})`}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: color }}
                    name={key}
                  />
                ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Annual progress + reports list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Annual progress */}
        <div className="rounded-xl bg-[#1A1F2B] border border-[#00FF88]/12 p-5">
          <h3 className="text-slate-200 mb-1">{t("reports.annualProgress")}</h3>
          <p className="text-xs text-slate-500 mb-4">{t("reports.annualSub")}</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={annualProgress} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252D3D" />
              <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2535", border: "1px solid rgba(0,255,136,0.25)", borderRadius: "8px", color: "#e2e8f0", fontSize: 12 }}
              />
              <Legend formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 11 }}>{v}</span>} />
              <Bar dataKey="completed" name={t("reports.completed")} fill="#00FF88" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="ongoing" name={t("reports.ongoing")} fill="#3b82f6" radius={[0, 0, 0, 0]} stackId="a" />
              <Bar dataKey="notStarted" name={t("reports.notStarted")} fill="#252D3D" radius={[0, 0, 4, 4]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Report list */}
        <div className="rounded-xl bg-[#1A1F2B] border border-[#00FF88]/12 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-200">{t("reports.recentReports")}</h3>
            <button className="text-xs text-[#00FF88] hover:text-[#00cc6e]">{t("common.viewAll")}</button>
          </div>
          <div className="space-y-2">
            {demoReports.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-[#00FF88]/15 hover:bg-white/3 transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#252D3D] flex items-center justify-center flex-shrink-0">
                  <FileBarChart2 className={`w-4 h-4 ${reportTypeStyle(r.type)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-300 truncate">{r.title}</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    <span className={reportTypeStyle(r.type)}>{r.type}</span>
                    <span className="mx-1.5">·</span>
                    {r.date}
                    <span className="mx-1.5">·</span>
                    {r.sites} sites
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${reportStatusStyle(r.status)}`}>
                    {r.status}
                  </span>
                  <Download className="w-3.5 h-3.5 text-slate-600 hover:text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
