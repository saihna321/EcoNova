import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import { useLanguage } from "../i18n";

function getRouteErrorDetails(error, t) {
  if (isRouteErrorResponse(error)) {
    return {
      title: `${error.status} ${error.statusText}`,
      message: error.data?.message ?? t("error.pageFailed"),
    };
  }

  if (error instanceof Error) {
    return {
      title: t("error.pageFailed"),
      message: error.message,
    };
  }

  return {
    title: t("error.pageFailed"),
    message: t("error.unknownRoute"),
  };
}

export function RouteError() {
  const error = useRouteError();
  const { t } = useLanguage();
  const details = getRouteErrorDetails(error, t);

  console.error("Route error", error);

  return (
    <div className="min-h-full bg-[#13171F] text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-xl border border-red-500/25 bg-[#1A1F2B] p-6">
        <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <h1 className="text-slate-100">{details.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{details.message}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-lg border border-[#00FF88]/25 bg-[#00FF88]/15 px-4 py-2 text-sm text-[#00FF88]"
          >
            <RefreshCw className="w-4 h-4" />
            {t("error.retry")}
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"
          >
            <Home className="w-4 h-4" />
            {t("nav.dashboard")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-full bg-[#13171F] text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-[#00FF88]/15 bg-[#1A1F2B] p-6 text-center">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#00FF88]/10 text-[#00FF88]">
          404
        </div>
        <h1 className="text-slate-100">{t("error.notFound")}</h1>
        <p className="mt-2 text-sm text-slate-500">{t("error.notFoundMessage")}</p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#00FF88]/25 bg-[#00FF88]/15 px-4 py-2 text-sm text-[#00FF88]"
        >
          <Home className="w-4 h-4" />
          {t("error.backDashboard")}
        </Link>
      </div>
    </div>
  );
}
