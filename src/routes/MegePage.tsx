import {
  useState,
  useMemo,
  useRef,
  useCallback,
  useTransition,
  useDeferredValue,
} from "react";
import { MergeEngines } from "@devisfuture/mega-collection";
import { TextSearchEngine } from "@devisfuture/mega-collection/search";
import { FilterEngine } from "@devisfuture/mega-collection/filter";
import { SortEngine } from "@devisfuture/mega-collection/sort";
import { users, type User } from "../data/users";
import VirtualizedUserCards from "../components/VirtualizedUserCards";
import ShowingCount from "../components/ShowingCount";
import PageHeader from "../components/PageHeader";

// ---------------------------------------------------------------------------
// MergeEngines instance — combines all three engines around one shared dataset.
// Initialised once at module level so indexes are built only on first import.
// ---------------------------------------------------------------------------
const engine = new MergeEngines<User>({
  imports: [TextSearchEngine, SortEngine, FilterEngine],
  data: users,
  search: { fields: ["name", "city"], minQueryLength: 2 },
  filter: { fields: ["city", "age"] },
  sort: { fields: ["age", "name", "city"] },
});

// ---------------------------------------------------------------------------
// Static options for filter controls
// ---------------------------------------------------------------------------
const cityOptions = ["Kyiv", "Lviv", "Odesa", "Kharkiv", "Dnipro"] as const;
const ageOptions = [22, 26, 30, 34, 38, 42] as const;
type SortField = "age" | "name" | "city";
type SortDirection = "asc" | "desc";

/** Delay (ms) after the last keystroke before running the search. */
const DEBOUNCE_MS = 150;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
function MegePage() {
  // --- search state ---
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<User[]>(users);
  const [isSearchPending, startSearchTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- filter state ---
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<number[]>([]);
  const deferredCities = useDeferredValue(selectedCities);
  const deferredAges = useDeferredValue(selectedAges);

  // --- sort state ---
  const [sortField, setSortField] = useState<SortField>("age");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const deferredSortField = useDeferredValue(sortField);
  const deferredSortDirection = useDeferredValue(sortDirection);

  // --- pending indicator ---
  const isFilterPending =
    deferredCities !== selectedCities || deferredAges !== selectedAges;
  const isSortPending =
    deferredSortField !== sortField || deferredSortDirection !== sortDirection;
  const isPending = isSearchPending || isFilterPending || isSortPending;

  // ---------------------------------------------------------------------------
  // Pipeline: search → filter → sort
  //
  // 1. `searchResult` holds the output of engine.search() (or all users when
  //    the query is blank). Updated reactively via debounce + useTransition.
  //
  // 2. useMemo applies filter then sort on top of `searchResult` whenever
  //    filter/sort state changes, using the explicit-dataset overloads so that
  //    the engines operate on the already-narrowed search subset.
  // ---------------------------------------------------------------------------
  const result = useMemo(() => {
    // Build filter criteria from deferred state so toggle buttons feel instant.
    const criteria: Array<{ field: keyof User; values: User[keyof User][] }> =
      [];

    if (deferredCities.length > 0) {
      criteria.push({ field: "city", values: deferredCities });
    }
    if (deferredAges.length > 0) {
      criteria.push({ field: "age", values: deferredAges });
    }

    const filtered =
      criteria.length > 0
        ? engine.filter(searchResult, criteria)
        : searchResult;

    return engine.sort(filtered, [
      { field: deferredSortField, direction: deferredSortDirection },
    ]);
  }, [
    searchResult,
    deferredCities,
    deferredAges,
    deferredSortField,
    deferredSortDirection,
  ]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;
      setQuery(raw);

      if (debounceRef.current !== null) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        const trimmed = raw.trim();
        startSearchTransition(() => {
          setSearchResult(trimmed ? engine.search(trimmed) : users);
        });
      }, DEBOUNCE_MS);
    },
    [],
  );

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city],
    );
  };

  const toggleAge = (age: number) => {
    setSelectedAges((prev) =>
      prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age],
    );
  };

  const onChangeSortField = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortField(event.target.value as SortField);
  };

  const onChangeSortDirection = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSortDirection(event.target.value as SortDirection);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <PageHeader
        title="MergeEngines route"
        description={
          <>
            Combines <strong>TextSearchEngine</strong>,{" "}
            <strong>FilterEngine</strong>, and <strong>SortEngine</strong>{" "}
            through a single <strong>MergeEngines</strong> facade. The pipeline
            runs <em>search → filter → sort</em> on 100k users.
          </>
        }
      />

      {/* Search */}
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-800">Search</p>
        <input
          value={query}
          onChange={handleSearch}
          placeholder="Search by name or city…"
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>

      {/* Filter */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-slate-800">Filter by city</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {cityOptions.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => toggleCity(city)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  selectedCities.includes(city)
                    ? "border-slate-700 bg-slate-700 text-white"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-800">Filter by age</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ageOptions.map((age) => (
              <button
                key={age}
                type="button"
                onClick={() => toggleAge(age)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  selectedAges.includes(age)
                    ? "border-slate-700 bg-slate-700 text-white"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="mt-4 flex flex-wrap gap-3">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-800">Sort field</p>
          <select
            value={sortField}
            onChange={onChangeSortField}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="age">age</option>
            <option value="name">name</option>
            <option value="city">city</option>
          </select>
        </div>

        <div>
          <p className="mb-1 text-sm font-medium text-slate-800">Direction</p>
          <select
            value={sortDirection}
            onChange={onChangeSortDirection}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="asc">asc</option>
            <option value="desc">desc</option>
          </select>
        </div>
      </div>

      <ShowingCount count={result.length} itemName="users" />

      <div className={isPending ? "opacity-60 transition-opacity" : ""}>
        <VirtualizedUserCards items={result} />
      </div>
    </section>
  );
}

export default MegePage;
