import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Leaf,
  AlertTriangle,
  MapPin,
  Activity,
} from "lucide-react";
import { Link } from "react-router";
import { Card } from "./ui";
import { useLanguage } from "../i18n";
import {
  dashboardKpis,
  ndviTrend,
  siteProgress,
} from "../data/demoNdviData";

function ndviColor(value) {
  if (value >= 0.6) return "#22c55e";
  if (value >= 0.45) return "#84cc16";
  if (value >= 0.3) return "#eab308";
  if (value >= 0.15) return "#f97316";
  return "#ef4444";
}

function statusColor(status) {
  switch (status) {
    case "achieved": return "text-emerald-300 bg-emerald-500/10 border-emerald-500/30";
    case "on-track": return "text-blue-400 bg-blue-400/10 border-blue-500/30";
    case "at-risk": return "text-yellow-400 bg-yellow-400/10 border-yellow-500/30";
    case "critical": return "text-red-400 bg-red-400/10 border-red-500/30";
    default: return "text-slate-400";
  }
}

const colorMap = {
  mint: "border-emerald-500/20 bg-emerald-500/5 text-emerald-300",
  blue: "border-blue-500/20 bg-blue-500/5 text-blue-300",
  violet: "border-violet-500/20 bg-violet-500/5 text-violet-300",
  red: "border-red-500/20 bg-red-500/5 text-red-300",
};

const iconBgMap = {
  mint: "bg-emerald-500/10 text-emerald-300",
  blue: "bg-blue-500/10 text-blue-300",
  violet: "bg-violet-500/10 text-violet-300",
  red: "bg-red-500/10 text-red-300",
};

const iconByKey = {
  activity: Activity,
  alertTriangle: AlertTriangle,
  leaf: Leaf,
  mapPin: MapPin,
};

export function Dashboard() {
  const { t } = useLanguage();

  const localizedKpis = dashboardKpis.map((kpi) => ({
    ...kpi,
    icon: iconByKey[kpi.iconKey] ?? Activity,
    label: t(kpi.labelKey),
    sub: t(kpi.subKey),
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {localizedKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className={`p-5 ${colorMap[kpi.color]}`}>
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgMap[kpi.color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl text-slate-100">{kpi.value}</div>
                <div className="text-sm text-slate-300 mt-0.5">{kpi.label}</div>
                <div className="text-xs text-slate-500 mt-1">{kpi.sub}</div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <Card className="xl:col-span-3 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-zinc-800">
            <div>
              <h3 className="text-slate-200">{t("dashboard.ndviMap")}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{t("dashboard.ndviMapSub")}</p>
            </div>
            <Link to="/satellite" className="text-xs text-emerald-300 hover:text-emerald-200">
              {t("dashboard.openViewer")} -&gt;
            </Link>
          </div>
          <div className="h-[360px] bg-[#0d1117] p-5">
            <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-3">
              {siteProgress.map((site) => (
                <div key={site.site} className="rounded-lg border border-zinc-800 bg-[#111113] p-4">
                  <div className="flex h-full flex-col">
                    <div>
                      <h4 className="text-sm text-slate-200">{site.site}</h4>
                      <span className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-xs ${statusColor(site.status)}`}>
                        {t(`status.${site.status}`)}
                      </span>
                    </div>
                    <div className="mt-auto">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-slate-500">{t("common.currentNdvi")}</span>
                        <span className="text-slate-300">{site.status === "at-risk" ? t("dashboard.moderate") : t("dashboard.good")}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#27272a]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min((site.ndvi / site.target) * 100, 100)}%`,
                            backgroundColor: ndviColor(site.ndvi),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="xl:col-span-2 rounded-lg bg-[#111113] border border-zinc-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-slate-200">{t("dashboard.ndviTrend")}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{t("dashboard.ndviTrendSub")}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-500 inline-block" />{t("common.ndvi")}</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-slate-600 inline-block" />{t("dashboard.baseline")}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ndviTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ndviGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 0.7]} tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "8px", color: "#e2e8f0" }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Area type="monotone" dataKey="baseline" stroke="#374151" strokeDasharray="4 2" fill="none" dot={false} strokeWidth={1.5} />
              <Area type="monotone" dataKey="ndvi" stroke="#22c55e" fill="url(#ndviGrad)" dot={false} strokeWidth={2.5} activeDot={{ fill: "#22c55e", r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg bg-[#111113] border border-zinc-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-slate-200">{t("dashboard.siteProgress")}</h3>
              <p className="text-xs text-slate-500">{t("dashboard.siteProgressSub")}</p>
            </div>
            <Link to="/sites" className="text-xs text-emerald-300 hover:text-[#16a34a] transition-colors">
              {t("common.viewAll")} -&gt;
            </Link>
          </div>

          <div className="space-y-3">
            {siteProgress.map((site) => (
              <div key={site.site} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="min-w-0">
                      <span className="block truncate text-sm text-slate-300">{site.site}</span>
                      <span className="text-xs text-slate-500">{t("dashboard.vsBaseline")}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${statusColor(site.status)}`}>
                        {t(`status.${site.status}`)}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#27272a] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((site.ndvi / site.target) * 100, 100)}%`,
                        backgroundColor: ndviColor(site.ndvi),
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-zinc-800">
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-xs text-slate-500 mr-2">{t("dashboard.ndviScale")}:</span>
              {[
                { label: t("dashboard.bare"), color: "#ef4444" },
                { label: t("dashboard.sparse"), color: "#f97316" },
                { label: t("dashboard.moderate"), color: "#eab308" },
                { label: t("dashboard.good"), color: "#84cc16" },
                { label: t("dashboard.dense"), color: "#22c55e" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1 mr-3">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-500 whitespace-nowrap">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
}
