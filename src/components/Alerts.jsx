import { AlertTriangle, CheckCircle, Clock, Eye, FileCheck2, MapPin, TrendingDown } from "lucide-react";
import { useLanguage } from "../i18n";
import { demoAlerts } from "../data/demoAlerts";

const severityStyle = {
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-300",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/25",
  },
  info: {
    icon: FileCheck2,
    color: "text-blue-300",
    bg: "bg-blue-500/10",
    border: "border-blue-500/25",
  },
  resolved: {
    icon: CheckCircle,
    color: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
  },
};

const categoryIcons = {
  NDVI: TrendingDown,
  "Report Data": FileCheck2,
  "Data Quality": Eye,
  Milestone: CheckCircle,
};

export function Alerts() {
  const { t } = useLanguage();
  const pitchAlerts = demoAlerts.filter((alert) => [1, 2, 3, 6].includes(alert.id));
  const riskCount = pitchAlerts.filter((alert) => alert.severity === "warning").length;
  const readyCount = pitchAlerts.filter((alert) => alert.category === "Report Data").length;
  const resolvedCount = pitchAlerts.filter((alert) => alert.severity === "resolved").length;

  const summary = [
    { label: t("alerts.needAttention"), value: riskCount, color: "text-yellow-300" },
    { label: t("reports.packageStatus"), value: readyCount, color: "text-blue-300" },
    { label: t("alerts.resolvedIssues"), value: resolvedCount, color: "text-emerald-300" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-slate-200">{t("alerts.title")}</h2>
        <p className="mt-1 text-sm text-slate-500">{t("alerts.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summary.map((item) => (
          <div key={item.label} className="rounded-lg border border-zinc-800 bg-[#111113] p-4">
            <div className={`text-2xl ${item.color}`}>{item.value}</div>
            <div className="mt-1 text-xs text-slate-500">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {pitchAlerts.map((alert) => {
          const style = severityStyle[alert.severity] ?? severityStyle.info;
          const Icon = style.icon;
          const CategoryIcon = categoryIcons[alert.category] ?? FileCheck2;
          return (
            <div key={alert.id} className={`rounded-lg border p-5 ${style.bg} ${style.border}`}>
              <div className="flex items-start gap-4">
                <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${style.color}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-slate-200">{alert.title}</h3>
                    {Number.isFinite(alert.ndviChange) && (
                      <span className={`font-mono text-xs ${alert.ndviChange < 0 ? "text-red-300" : "text-emerald-300"}`}>
                        {alert.ndviChange > 0 ? "+" : ""}{alert.ndviChange.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{alert.description}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {alert.site}
                    </span>
                    <span className="flex items-center gap-1">
                      <CategoryIcon className="h-3.5 w-3.5" />
                      {alert.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {alert.timestamp}
                    </span>
                  </div>
                  {alert.cause && (
                    <div className="mt-3 rounded-lg border border-zinc-800 bg-[#111113]/60 px-3 py-2 text-xs text-slate-400">
                      {t("alerts.probableCause")}: <span className="text-slate-300">{alert.cause}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
