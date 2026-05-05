import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LanguageProvider } from "./i18n";

export default function App() {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </LanguageProvider>
  );
}
