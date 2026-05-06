import { useState } from "react";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Bell,
  TrendingDown,
  CloudRain,
  Thermometer,
  Eye,
  X,
  ChevronRight,
  Clock,
  MapPin,
  FileCheck2,
} from "lucide-react";
import { Button } from "./ui";
import { useLanguage } from "../i18n";
import { demoAlerts } from "../data/demoAlerts";

const severityConfig = {
  critical: {
    icon: AlertCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    badge: "text-red-400 bg-red-400/10 border-red-500/30",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    badge: "text-yellow-400 bg-yellow-400/10 border-yellow-500/30",
  },
  info: {
    icon: Info,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    badge: "text-blue-400 bg-blue-400/10 border-blue-500/30",
  },
  resolved: {
    icon: CheckCircle,
    color: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    badge: "text-emerald-300 bg-emerald-500/10 border-emerald-500/25",
  },
};

const defaultSeverityConfig = {
  icon: Info,
  color: "text-slate-400",
  bg: "bg-slate-500/10",
  border: "border-slate-500/25",
  badge: "text-slate-400 bg-slate-400/10 border-slate-500/30",
};

const categoryIcons = {
  NDVI: TrendingDown,
  "Report Data": FileCheck2,
  "Data Quality": Eye,
  Weather: CloudRain,
  Data: Bell,
  Milestone: CheckCircle,
};

function severitySummaryKey(severity) {
  if (severity === "critical") return "alerts.requireImmediate";
  if (severity === "warning") return "alerts.needAttention";
  if (severity === "info") return "alerts.informational";
  return "alerts.resolvedIssues";
}

export function Alerts() {
  const [filter, setFilter] = useState("all");
  const [alerts, setAlerts] = useState(demoAlerts);
  const [expandedId, setExpandedId] = useState(null);
  const { t } = useLanguage();

  const filtered = alerts.filter(
    (a) => filter === "all" || a.severity === filter
  );

  const counts = {
    critical: alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length,
    warning: alerts.filter((a) => a.severity === "warning" && !a.acknowledged).length,
    info: alerts.filter((a) => a.severity === "info").length,
    resolved: alerts.filter((a) => a.severity === "resolved").length,
  };

  const acknowledge = (id) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const dismiss = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-200">{t("alerts.title")}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{t("alerts.subtitle")}</p>
        </div>
        <Button variant="outline">
          <Bell className="w-4 h-4" />
          {t("alerts.configure")}
        </Button>
      </div>

      {/* Summary counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(["critical", "warning", "info", "resolved"]).map((sev) => {
          const cfg = severityConfig[sev] ?? defaultSeverityConfig;
          const Icon = cfg.icon;
          const count = counts[sev] ?? 0;
          return (
            <button
              key={sev}
              onClick={() => setFilter(filter === sev ? "all" : sev)}
              className={`rounded-lg border p-4 text-left transition-all ${
                filter === sev ? `${cfg.bg} ${cfg.border}` : "bg-zinc-950/70 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${cfg.color}`} />
                <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${cfg.badge}`}>{t(`severity.${sev}`)}</span>
              </div>
              <div className={`text-2xl mt-3 ${cfg.color}`}>{count}</div>
              <div className="text-xs text-slate-500 mt-1">
                {t(severitySummaryKey(sev))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "critical", "warning", "info", "resolved"]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all capitalize ${
              filter === f
                ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-300"
                : "border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
            }`}
          >
            {f === "all" ? t("alerts.all", { count: alerts.length }) : t(`severity.${f}`)}
            {f === "critical" && counts.critical > 0 && (
              <span className="ml-1 bg-red-500 text-white rounded-full px-1">{counts.critical}</span>
            )}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-600">
            <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <div>{t("alerts.noCategory")}</div>
          </div>
        )}
        {filtered.map((alert) => {
          const cfg = severityConfig[alert.severity] ?? defaultSeverityConfig;
          const Icon = cfg.icon;
          const CatIcon = categoryIcons[alert.category] ?? Info;
          const isExpanded = expandedId === alert.id;

          return (
            <div
              key={alert.id}
              className={`rounded-lg border transition-all ${
                alert.acknowledged
                  ? "bg-zinc-950/50 border-zinc-800 opacity-75"
                  : `${cfg.bg} ${cfg.border}`
              }`}
            >
              <div
                className="flex items-start gap-4 p-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
              >
                <div className={`mt-0.5 flex-shrink-0 ${cfg.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm ${alert.acknowledged ? "text-slate-400" : "text-slate-200"}`}>
                          {alert.title}
                        </span>
                        {!alert.acknowledged && (
                          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.site}</span>
                        <span>{alert.region}</span>
                        <span className="flex items-center gap-1"><CatIcon className="w-3 h-3" />{alert.category}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{alert.timestamp}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {Number.isFinite(alert.ndviChange) && (
                        <span className={`text-xs font-mono ${alert.ndviChange < 0 ? "text-red-400" : "text-emerald-300"}`}>
                          {alert.ndviChange > 0 ? "+" : ""}{alert.ndviChange.toFixed(2)} NDVI
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${cfg.badge}`}>
                        {t(`severity.${alert.severity}`)}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div className="border-t border-white/5 px-4 py-4">
                  <p className="text-sm text-slate-400 leading-relaxed">{alert.description}</p>
                  {alert.cause && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <Thermometer className="w-3.5 h-3.5" />
                      <span>{t("alerts.probableCause")}: <span className="text-slate-300">{alert.cause}</span></span>
                    </div>
                  )}
                  <div className="mt-4 flex gap-3">
                    {!alert.acknowledged && (
                      <Button
                        onClick={() => acknowledge(alert.id)}
                        size="sm"
                      >
                        {t("alerts.acknowledge")}
                      </Button>
                    )}
                    <Button variant="secondary" size="sm">
                      {t("alerts.viewSite")}
                    </Button>
                    <Button
                      onClick={() => dismiss(alert.id)}
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                    >
                      <X className="w-3.5 h-3.5" />
                      {t("alerts.dismiss")}
                    </Button>
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
