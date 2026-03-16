import { useDeferredValue, useMemo, useState } from "react";
import type { FilterCriterion } from "@devisfuture/mega-collection/filter";
import { type User, cities, ages } from "../data/users";
import VirtualizedUserCards from "../components/VirtualizedUserCards";
import ShowingCount from "../components/ShowingCount";
import PageHeader from "../components/PageHeader";
import { useDemoEngine } from "../modules/demo-modules";
import { SortSelect } from "../components/SortSelect";

type SortField = "age" | "name" | "city";
type SortDirection = "asc" | "desc";

function MergePage() {
  const engine = useDemoEngine("merge");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

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
  const isSearchPending = deferredQuery !== query;
  const isPending = isSearchPending || isFilterPending || isSortPending;

  const result = useMemo(() => {
    const criteria: FilterCriterion<User>[] = [];
    const trimmedQuery = deferredQuery.trim();

    if (deferredCities.length > 0) {
      criteria.push({ field: "city", values: deferredCities });
    }
    if (deferredAges.length > 0) {
      criteria.push({ field: "age", values: deferredAges });
    }

    return engine
      .search(trimmedQuery)
      .filter(criteria)
      .sort([{ field: deferredSortField, direction: deferredSortDirection }]);
  }, [
    engine,
    deferredQuery,
    deferredCities,
    deferredAges,
    deferredSortField,
    deferredSortDirection,
  ]);

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

  const resetPipeline = () => {
    setQuery("");
    setSelectedCities([]);
    setSelectedAges([]);
    setSortField("age");
    setSortDirection("asc");
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <PageHeader
        title="Merge"
        description={
          <>
            Search, filter, and sort users in one chain using{" "}
            <strong>MergeEngines</strong>.
            <br />
            <code>{`engine
  .search("query...")
  .filter([{ field: "city", values: ["Chicago"] }])
  .sort([{ field: "createdAt", direction: "desc" }]);`}</code>
          </>
        }
      />

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-800">Search</p>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or city…"
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>

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

      <div className="mt-4 flex flex-wrap gap-3">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-800">Sort field</p>
          <SortSelect onChange={onChangeSortField} field={sortField} />
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

        <div className="flex items-end">
          <button
            type="button"
            onClick={resetPipeline}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          >
            Reset pipeline
          </button>
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
