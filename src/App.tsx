import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import FilterPage from "./routes/FilterPage";
import MergePage from "./routes/MergePage";
import SearchPage from "./routes/SearchPage";
import SortPage from "./routes/SortPage";

const navItems = [
  { to: "/search", label: "Search" },
  { to: "/filter", label: "Filter" },
  { to: "/sort", label: "Sort" },
  { to: "/merge", label: "Merge" },
];

function App() {
  return (
    <main className="min-h-full bg-slate-50 p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <nav className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Routes>
          <Route path="/search" element={<SearchPage />} />
          <Route path="/filter" element={<FilterPage />} />
          <Route path="/sort" element={<SortPage />} />
          <Route path="/merge" element={<MergePage />} />
          <Route path="*" element={<Navigate to="/search" replace />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
