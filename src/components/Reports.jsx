import { AlertTriangle, Database, FileBarChart2, Leaf, Map, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLanguage } from "../i18n";
import {
  portfolioNdviClasses,
  quarterlyNdvi,
  siteColors,
  siteLabels,
} from "../data/demoNdviData";

export function Reports() {
  const { t } = useLanguage();

  const summaryKpis = [
    { label: t("reports.meanGain"), value: t("dashboard.trend"), sub: t("reports.sinceBaseline"), icon: TrendingUp, color: "text-blue-300" },
    { label: t("common.vegetatedArea"), value: t("dashboard.good"), sub: t("reports.acrossAllSites"), icon: Leaf, color: "text-emerald-300" },
    { label: t("dashboard.dataConfidence"), value: t("reports.ready"), sub: t("dashboard.dataConfidenceSub"), icon: FileBarChart2, color: "text-violet-300" },
  ];

  const evidenceOutputs = [
    { label: t("reports.ndviMapOutput"), value: "NDVI + RGB", sub: t("reports.ndviMapOutputSub"), icon: Map },
    { label: t("reports.ndviStatsOutput"), value: "Mean / min / max", sub: t("reports.ndviStatsOutputSub"), icon: Database },
    { label: t("reports.alertOutput"), value: "Risk flags", sub: t("reports.alertOutputSub"), icon: AlertTriangle },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-slate-200">{t("reports.title")}</h2>
        <p className="mt-1 text-sm text-slate-500">{t("reports.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-lg border border-zinc-800 bg-[#111113] p-4">
              <Icon className={`h-5 w-5 ${kpi.color}`} />
              <div className={`mt-3 text-2xl ${kpi.color}`}>{kpi.value}</div>
              <div className="mt-1 text-sm text-slate-300">{kpi.label}</div>
              <div className="mt-0.5 text-xs text-slate-500">{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-lg border border-zinc-800 bg-[#111113] p-5">
          <h3 className="text-slate-200">{t("reports.ndviBySite")}</h3>
          <p className="mt-1 text-xs text-slate-500">{t("reports.quarterlyView", { period: "pilot" })}</p>

          <div className="mt-5 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={quarterlyNdvi} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <defs>
                  {Object.entries(siteColors).map(([key, color]) => (
                    <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="q" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 0.75]} tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "8px", color: "#e2e8f0", fontSize: 12 }}
                />
                {Object.entries(siteColors).map(([key, color]) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={color}
                    fill={`url(#grad-${key})`}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: color }}
                    name={siteLabels[key]}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-[#111113] p-5">
          <h3 className="text-slate-200">{t("reports.evidencePackage")}</h3>
          <p className="mt-1 text-xs text-slate-500">{t("reports.evidencePackageSub")}</p>
          <div className="mt-4 space-y-3">
            {evidenceOutputs.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-lg border border-zinc-800 bg-[#18181b]/60 p-3">
                  <div className="flex gap-3">
                    <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" />
                    <div>
                      <div className="text-sm text-slate-300">{item.label}</div>
                      <div className="mt-0.5 text-xs text-emerald-300">{item.value}</div>
                      <div className="mt-1 text-xs text-slate-500">{item.sub}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-[#111113] p-5">
        <h3 className="text-slate-200">{t("dashboard.areaClasses")}</h3>
        <p className="mt-1 text-xs text-slate-500">{t("dashboard.areaClassesSub")}</p>
        <div className="mt-4 grid gap-2 md:grid-cols-5">
          {portfolioNdviClasses.map((item) => {
            return (
              <div key={item.labelKey} className="rounded-lg border border-zinc-800 bg-[#18181b]/60 p-3">
                <span className="block h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <div className="mt-3 text-sm text-slate-300">{t(item.labelKey)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
