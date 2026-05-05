import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { translate } from "../i18n";

function getStoredLanguage() {
  if (typeof window === "undefined") return "en";
  try {
    return window.localStorage.getItem("econova-language") ?? "en";
  } catch {
    return "en";
  }
}

export class ErrorBoundary extends Component {
  state = {
    error: null,
  };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("App render error", error, info);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    const t = (key, vars) => translate(getStoredLanguage(), key, vars);

    return (
      <div className="min-h-screen bg-[#13171F] text-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-xl border border-red-500/25 bg-[#1A1F2B] p-6 shadow-2xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h1 className="text-slate-100">{t("error.title")}</h1>
          <p className="text-sm text-slate-500 mt-2">
            {t("error.message")}
          </p>
          <pre className="mt-4 max-h-32 overflow-auto rounded-lg bg-black/25 p-3 text-xs text-slate-500">
            {this.state.error?.message ?? "Unknown error"}
          </pre>
          <div className="mt-5 flex gap-3">
            <button
              onClick={this.reset}
              className="flex items-center gap-2 rounded-lg border border-[#00FF88]/25 bg-[#00FF88]/15 px-4 py-2 text-sm text-[#00FF88]"
            >
              <RefreshCw className="w-4 h-4" />
              {t("error.tryAgain")}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"
            >
              {t("error.reload")}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
