import { Activity, Leaf, MapPin } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLanguage } from "../i18n";
import { demoSites } from "../data/demoSites";

function ndviColor(value) {
  if (value >= 0.6) return "#22c55e";
  if (value >= 0.45) return "#84cc16";
  if (value >= 0.3) return "#eab308";
  if (value >= 0.15) return "#f97316";
  return "#ef4444";
}

function statusStyle(status) {
  if (status === "on-track") return "text-emerald-300 bg-emerald-500/10 border-emerald-500/25";
  if (status === "at-risk") return "text-yellow-300 bg-yellow-500/10 border-yellow-500/25";
  if (status === "critical") return "text-red-300 bg-red-500/10 border-red-500/25";
  return "text-slate-300 bg-slate-500/10 border-slate-500/25";
}

export function Sites() {
  const { t } = useLanguage();

  const stats = [
    { label: t("sites.totalArea"), value: t("dashboard.monitoredSites"), icon: MapPin, color: "text-blue-300" },
    { label: t("common.vegetatedArea"), value: t("dashboard.good"), icon: Leaf, color: "text-emerald-300" },
    { label: t("sites.avgNdvi"), value: t("dashboard.moderate"), icon: Activity, color: "text-yellow-300" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-slate-200">{t("sites.title")}</h2>
        <p className="mt-1 text-sm text-slate-500">{t("sites.activeZones", { count: demoSites.length })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-lg border border-zinc-800 bg-[#111113] p-4">
              <Icon className={`h-5 w-5 ${stat.color}`} />
              <div className={`mt-3 text-2xl ${stat.color}`}>{stat.value}</div>
              <div className="mt-1 text-xs text-slate-500">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {demoSites.map((site) => (
          <div key={site.id} className="rounded-lg border border-zinc-800 bg-[#111113] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-slate-200">{site.name}</h3>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {site.region}
                </div>
              </div>
              <span className={`rounded-full border px-2 py-0.5 text-xs ${statusStyle(site.status)}`}>
                {t(`status.${site.status}`)}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div>
                <div className="text-xs text-slate-500">{t("common.baselineNdvi")}</div>
                <div className="mt-1 text-sm text-slate-300">{t("dashboard.bare")}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">{t("common.currentNdvi")}</div>
                <div className="mt-1 text-sm" style={{ color: ndviColor(site.currentNdvi) }}>
                  {site.status === "at-risk" ? t("dashboard.moderate") : t("dashboard.good")}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">{t("sites.targetNdvi")}</div>
                <div className="mt-1 text-sm text-slate-300">{t("dashboard.dense")}</div>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">{t("dashboard.rehabProgress")}</span>
                <span className="text-slate-300">{site.status === "at-risk" ? t("status.at-risk") : t("status.on-track")}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#27272a]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${site.progress}%`, backgroundColor: ndviColor(site.currentNdvi) }}
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-zinc-800 bg-[#18181b]/60 p-3">
                <div className="text-slate-500">{t("common.vegetatedArea")}</div>
                <div className="mt-1 text-emerald-300">{t("dashboard.good")}</div>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-[#18181b]/60 p-3">
                <div className="text-slate-500">{t("common.decliningArea")}</div>
                <div className="mt-1 text-red-300">{site.decliningArea > 20 ? t("status.at-risk") : t("status.on-track")}</div>
              </div>
            </div>

            <div className="mt-5 h-28">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={site.ndviHistory} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="m" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 0.75]} tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "8px", color: "#e2e8f0", fontSize: 11 }}
                  />
                  <Line type="monotone" dataKey="v" stroke={ndviColor(site.currentNdvi)} strokeWidth={2} dot={false} name={t("common.ndvi")} />
                  <Line type="monotone" dataKey="t" stroke="#475569" strokeDasharray="4 2" strokeWidth={1.5} dot={false} name={t("common.target")} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
