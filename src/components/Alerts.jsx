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
} from "lucide-react";
import { useLanguage } from "../i18n";

const allAlerts = [
  {
    id: 1,
    severity: "critical",
    title: "NDVI Decline — Significant Vegetation Loss Detected",
    site: "Bowen Basin S3",
    region: "Queensland",
    description: "NDVI has dropped by 0.08 over 2 weeks, indicating significant stress event. Immediate field inspection recommended. Possible drought stress or erosion event.",
    timestamp: "Today, 08:14 AEST",
    ndviChange: -0.08,
    cause: "Drought stress / erosion",
    acknowledged: false,
    category: "NDVI",
  },
  {
    id: 2,
    severity: "critical",
    title: "Compliance Deadline Approaching — 45 Days",
    site: "Bowen Basin S3",
    region: "Queensland",
    description: "Site is currently tracking 23% below required NDVI threshold for regulatory compliance. Without intervention, the June 2025 milestone will be missed.",
    timestamp: "Yesterday, 14:00 AEST",
    acknowledged: false,
    category: "Compliance",
  },
  {
    id: 3,
    severity: "warning",
    title: "Satellite Imagery Quality — Cloud Cover > 80%",
    site: "Pilbara West",
    region: "Western Australia",
    description: "Latest Sentinel-2 acquisition on 2 May had >80% cloud contamination. NDVI values for this period are unreliable. Next clear acquisition estimated in 5 days.",
    timestamp: "Today, 06:42 AEST",
    acknowledged: false,
    category: "Data Quality",
  },
  {
    id: 4,
    severity: "warning",
    title: "NDVI Growth Plateau — Stagnation Over 6 Weeks",
    site: "Pilbara West",
    region: "Western Australia",
    description: "NDVI has not increased for 6 consecutive weeks. Current value of 0.38 is below the quarterly growth trajectory. Site assessment recommended.",
    timestamp: "3 May 2025",
    ndviChange: 0.0,
    acknowledged: true,
    category: "NDVI",
  },
  {
    id: 5,
    severity: "warning",
    title: "Extreme Heat Event — Vegetation Stress Risk",
    site: "Kalgoorlie North",
    region: "Western Australia",
    description: "BOM forecast indicates temperatures exceeding 42°C for the next 5 days. Risk of heat-induced vegetation stress. Monitor NDVI closely.",
    timestamp: "4 May 2025",
    cause: "Extreme heat",
    acknowledged: false,
    category: "Weather",
  },
  {
    id: 6,
    severity: "info",
    title: "New Sentinel-2 Mosaic Available",
    site: "All Sites",
    region: "National",
    description: "Sentinel-2 Level-2A mosaic for April 2025 is now available. Processing complete with 94% valid pixels. NDVI analysis updated.",
    timestamp: "30 Apr 2025",
    acknowledged: true,
    category: "Data",
  },
  {
    id: 7,
    severity: "info",
    title: "Rainfall Event — Potential NDVI Increase",
    site: "Hunter Valley",
    region: "New South Wales",
    description: "78mm of rainfall recorded on 29 Apr. Expected NDVI increase in next 2–3 week acquisition window. Positive signal for Q2 targets.",
    timestamp: "29 Apr 2025",
    ndviChange: +0.04,
    acknowledged: true,
    category: "Weather",
  },
  {
    id: 8,
    severity: "resolved",
    title: "Target NDVI Achieved — Site Milestone",
    site: "Mount Isa Central",
    region: "Queensland",
    description: "NDVI has reached and exceeded the 0.60 rehabilitation target. Site milestone achieved 3 months ahead of schedule. Certificate of rehabilitation triggered.",
    timestamp: "28 Apr 2025",
    ndviChange: +0.03,
    acknowledged: true,
    category: "Milestone",
  },
];

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
    color: "text-[#00FF88]",
    bg: "bg-[#00FF88]/10",
    border: "border-[#00FF88]/25",
    badge: "text-[#00FF88] bg-[#00FF88]/10 border-[#00FF88]/25",
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
  Compliance: AlertCircle,
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
  const [alerts, setAlerts] = useState(allAlerts);
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
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1F2535] border border-[#00FF88]/15 text-slate-300 hover:text-slate-100 text-sm transition-colors">
          <Bell className="w-4 h-4" />
          {t("alerts.configure")}
        </button>
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
              className={`rounded-xl border p-4 text-left transition-all ${
                filter === sev ? `${cfg.bg} ${cfg.border}` : "bg-[#1A1F2B] border-[#00FF88]/10 hover:border-[#00FF88]/20"
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
                ? "bg-[#00FF88]/15 border border-[#00FF88]/30 text-[#00FF88]"
                : "border border-[#00FF88]/10 text-slate-500 hover:text-slate-300 hover:border-[#00FF88]/20"
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
              className={`rounded-xl border transition-all ${
                alert.acknowledged
                  ? "bg-[#1A1F2B]/60 border-[#00FF88]/8 opacity-75"
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
                        <span className={`text-xs font-mono ${alert.ndviChange < 0 ? "text-red-400" : "text-[#00FF88]"}`}>
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
                      <button
                        onClick={() => acknowledge(alert.id)}
                        className="px-4 py-2 rounded-lg bg-[#00FF88]/15 border border-[#00FF88]/25 text-[#00FF88] hover:bg-[#00FF88]/20 text-xs transition-colors"
                      >
                        {t("alerts.acknowledge")}
                      </button>
                    )}
                    <button className="px-4 py-2 rounded-lg bg-[#252D3D] border border-[#252D3D] text-slate-300 hover:bg-[#2D3548] text-xs transition-colors">
                      {t("alerts.viewSite")}
                    </button>
                    <button
                      onClick={() => dismiss(alert.id)}
                      className="ml-auto px-3 py-2 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 text-xs transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      {t("alerts.dismiss")}
                    </button>
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
