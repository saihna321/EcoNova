import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router";
import {
  LayoutDashboard,
  Mountain,
  FileBarChart2,
  Bell,
  Satellite,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Settings,
  Menu,
  X,
  Globe2,
} from "lucide-react";
import { useLanguage } from "../i18n";

const navItems = [
  { to: "/", icon: LayoutDashboard, labelKey: "nav.dashboard" },
  { to: "/sites", icon: Mountain, labelKey: "nav.sites" },
  { to: "/satellite", icon: Satellite, labelKey: "nav.satellite" },
  { to: "/reports", icon: FileBarChart2, labelKey: "nav.reports" },
  { to: "/alerts", icon: Bell, labelKey: "nav.alerts" },
];

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { dateLocale, language, languages, setLanguage, t } = useLanguage();

  const currentPage = navItems.find((item) =>
    item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to)
  );

  return (
    <div className="flex h-screen bg-[#09090b] text-slate-100 overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-30 h-full flex flex-col
          bg-[#111113] border-r border-zinc-800
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-16" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-zinc-800">
          <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-[#052e16]" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-emerald-300 text-sm font-semibold whitespace-nowrap">EcoNova</div>
              <div className="text-slate-500 text-xs whitespace-nowrap">{t("common.platform")}</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, labelKey, badge }) => {
            const label = t(labelKey);
            return (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative
                  ${isActive
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm whitespace-nowrap">{label}</span>
                )}
                {badge && !collapsed && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {badge}
                  </span>
                )}
                {badge && collapsed && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {badge}
                  </span>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-[#27272a] text-slate-200 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-zinc-800">
                    {label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse button */}
        <div className="p-3 border-t border-zinc-800">
          {!collapsed && (
            <label className="mb-3 flex md:hidden items-center gap-2 rounded-lg border border-zinc-800 bg-[#18181b] px-3 py-2 text-xs text-slate-400">
              <Globe2 className="h-4 w-4 text-emerald-300" />
              <span className="sr-only">{t("common.language")}</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-xs text-slate-300 outline-none"
                aria-label={t("common.language")}
              >
                {languages.map((option) => (
                  <option key={option.code} value={option.code} className="bg-[#111113] text-slate-200">
                    {option.shortLabel} - {option.label}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs">{t("common.collapse")}</span>
              </>
            )}
          </button>
          {!collapsed && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-emerald-500/5 border border-zinc-800">
              <div className="text-xs text-slate-500">{t("common.lastSync")}</div>
              <div className="text-xs text-emerald-300 mt-0.5">{t("common.syncTime")}</div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-4 px-6 py-4 bg-[#111113]/90 backdrop-blur border-b border-zinc-800 flex-shrink-0">
          <button
            className="lg:hidden text-slate-400 hover:text-slate-200"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div>
            <h1 className="text-slate-100">{currentPage ? t(currentPage.labelKey) : t("nav.dashboard")}</h1>
            <p className="text-xs text-slate-500">
              Sentinel-2 / Sentinel Hub / {new Date().toLocaleDateString(dateLocale, { dateStyle: "long" })}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <label className="hidden md:flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#18181b] px-2 py-1.5 text-xs text-slate-400">
              <Globe2 className="h-4 w-4 text-emerald-300" />
              <span className="sr-only">{t("common.language")}</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="bg-transparent text-xs text-slate-300 outline-none"
                aria-label={t("common.language")}
              >
                {languages.map((option) => (
                  <option key={option.code} value={option.code} className="bg-[#111113] text-slate-200">
                    {option.shortLabel} - {option.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-300">{t("common.liveFeed")}</span>
            </div>

            <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>

            <button className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5">
              <Settings className="w-5 h-5" />
            </button>

            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-[#052e16] text-xs font-semibold">
              GS
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#09090b]">
          <div key={location.pathname} className="page-transition min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
