import { useState, useMemo, useCallback, useDeferredValue } from "react";
import { MergeEngines } from "@devisfuture/mega-collection";
import { TextSearchEngine } from "@devisfuture/mega-collection/search";
import { FilterEngine } from "@devisfuture/mega-collection/filter";
import { SortEngine } from "@devisfuture/mega-collection/sort";
import { ages, cities, defaultLimit, users, type User } from "../data/users";
import VirtualizedUserCards from "../components/VirtualizedUserCards";
import ShowingCount from "../components/ShowingCount";
import PageHeader from "../components/PageHeader";

const engine = new MergeEngines<User>({
  imports: [TextSearchEngine, SortEngine, FilterEngine],
  data: users,
  search: { fields: ["name", "city"], minQueryLength: 2 },
  filter: { fields: ["city", "age"], filterByPreviousResult: true },
  sort: { fields: ["age", "name", "city"] },
});

type SortField = "age" | "name" | "city";
type SortDirection = "asc" | "desc";

function MergePage() {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<User[]>(users);

  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<number[]>([]);
  const deferredCities = useDeferredValue(selectedCities);
  const deferredAges = useDeferredValue(selectedAges);

  const [sortField, setSortField] = useState<SortField>("age");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const deferredSortField = useDeferredValue(sortField);
  const deferredSortDirection = useDeferredValue(sortDirection);

  const isFilterPending =
    deferredCities !== selectedCities || deferredAges !== selectedAges;
  const isSortPending =
    deferredSortField !== sortField || deferredSortDirection !== sortDirection;
  const isPending = isFilterPending || isSortPending;

  const result = useMemo(() => {
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

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;
      setQuery(raw);

      const trimmed = raw.trim();
      setSearchResult(engine.search(trimmed));
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

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <PageHeader
        title="Merge"
        description={
          <>
            Combines <strong>TextSearchEngine</strong>,{" "}
            <strong>FilterEngine</strong>, and <strong>SortEngine</strong>{" "}
            through a single <strong>MergeEngines</strong> facade. The pipeline
            runs <em>search → filter → sort</em> on {defaultLimit} users.
          </>
        }
      />

      {}
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-800">Search</p>
        <input
          value={query}
          onChange={handleSearch}
          placeholder="Search by name or city…"
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>

      {}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-slate-800">Filter by city</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {cities.map((city) => (
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
            {ages.map((age) => (
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

      {}
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

      <div className={isPending ? "opacity-30 transition-opacity" : ""}>
        <VirtualizedUserCards items={result} />
      </div>
    </section>
  );
}

export default MergePage;
