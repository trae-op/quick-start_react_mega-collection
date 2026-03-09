import { useEffect, useRef, useState } from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import FilterPage from "./routes/FilterPage";
import FilterNestedPage from "./routes/FilterNestedPage";
import FilterRemovePage from "./routes/FilterRemovePage";
import MergePage from "./routes/MergePage";
import MergeNestedPage from "./routes/MergeNestedPage";
import SearchPage from "./routes/SearchPage";
import SearchNestedPage from "./routes/SearchNestedPage";
import SortPage from "./routes/SortPage";
import {
  DemoModulesProvider,
  getDemoModulesSnapshot,
  initializeDemoModules,
  subscribeToDemoModules,
} from "./modules/demo-modules";

const navItems = [
  { to: "/search", label: "Search" },
  { to: "/search-nested", label: "Search Nested" },
  { to: "/filter", label: "Filter" },
  { to: "/filter-remove", label: "Filter Remove" },
  { to: "/filter-nested", label: "Filter Nested" },
  { to: "/sort", label: "Sort" },
  { to: "/merge", label: "Merge" },
  { to: "/merge-nested", label: "Merge Nested" },
];

function App() {
  const isInitialized = useRef(true);
  const [modulesSnapshot, setModulesSnapshot] = useState(() =>
    getDemoModulesSnapshot(),
  );

  useEffect(() => subscribeToDemoModules(setModulesSnapshot), []);

  useEffect(() => {
    if (isInitialized.current) {
      isInitialized.current = false;
      initializeDemoModules();
    }
  }, []);

  const isReady = modulesSnapshot.status === "ready";
  const isErrored = modulesSnapshot.status === "error";

  return (
    <DemoModulesProvider value={modulesSnapshot}>
      <main className="min-h-full bg-slate-50 p-4 md:p-6">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
          <nav
            className={`flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm ${
              isReady ? "" : "opacity-70"
            }`}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                aria-disabled={!isReady}
                tabIndex={isReady ? 0 : -1}
                onClick={(event) => {
                  if (!isReady) {
                    event.preventDefault();
                  }
                }}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isReady
                      ? isActive
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "cursor-not-allowed bg-slate-100 text-slate-400"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {isErrored ? (
            <section className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
              <h1 className="text-base font-semibold text-red-900">
                Failed to initialize demo data
              </h1>
              <p className="mt-2">{modulesSnapshot.message}</p>
            </section>
          ) : isReady ? (
            <Routes>
              <Route path="/search" element={<SearchPage />} />
              <Route path="/search-nested" element={<SearchNestedPage />} />
              <Route path="/filter" element={<FilterPage />} />
              <Route path="/filter-remove" element={<FilterRemovePage />} />
              <Route path="/filter-nested" element={<FilterNestedPage />} />
              <Route path="/sort" element={<SortPage />} />
              <Route path="/merge" element={<MergePage />} />
              <Route path="/merge-nested" element={<MergeNestedPage />} />
              <Route path="*" element={<Navigate to="/search" replace />} />
            </Routes>
          ) : (
            <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
                <div className="space-y-1">
                  <h1 className="text-lg font-semibold text-slate-900">
                    Loading 100K demo records
                  </h1>
                  <p className="text-sm text-slate-600">
                    {modulesSnapshot.message}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    {modulesSnapshot.progress}% complete
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </DemoModulesProvider>
  );
}

export default App;
