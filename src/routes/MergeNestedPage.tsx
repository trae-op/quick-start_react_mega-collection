import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { MergeEngines } from "@devisfuture/mega-collection";
import type { FilterCriterion } from "@devisfuture/mega-collection/filter";
import { TextSearchEngine } from "@devisfuture/mega-collection/search";
import { FilterEngine } from "@devisfuture/mega-collection/filter";
import { SortEngine } from "@devisfuture/mega-collection/sort";
import {
  ages,
  cities,
  nestedUsers,
  orderStatuses,
  type UserWithOrders,
} from "../data/users";
import PageHeader from "../components/PageHeader";
import ShowingCount from "../components/ShowingCount";
import VirtualizedNestedUserCards from "../components/VirtualizedNestedUserCards";

const engine = new MergeEngines<UserWithOrders>({
  imports: [TextSearchEngine, FilterEngine, SortEngine],
  data: nestedUsers,
  search: { fields: ["name", "city", "orders.status"], minQueryLength: 2 },
  filter: {
    fields: ["city", "age", "orders.status"],
    filterByPreviousResult: true,
  },
  sort: { fields: ["age", "name", "city"] },
});

type SortField = "age" | "name" | "city";
type SortDirection = "asc" | "desc";

function MergeNestedPage() {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] =
    useState<UserWithOrders[]>(nestedUsers);

  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const deferredCities = useDeferredValue(selectedCities);
  const deferredAges = useDeferredValue(selectedAges);
  const deferredStatuses = useDeferredValue(selectedStatuses);

  const [sortField, setSortField] = useState<SortField>("age");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const deferredSortField = useDeferredValue(sortField);
  const deferredSortDirection = useDeferredValue(sortDirection);

  const result = useMemo(() => {
    const criteria: FilterCriterion<UserWithOrders>[] = [];

    if (deferredCities.length > 0) {
      criteria.push({ field: "city", values: deferredCities });
    }

    if (deferredAges.length > 0) {
      criteria.push({ field: "age", values: deferredAges });
    }

    if (deferredStatuses.length > 0) {
      criteria.push({ field: "orders.status", values: deferredStatuses });
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
    deferredStatuses,
    deferredSortField,
    deferredSortDirection,
  ]);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;
      setQuery(raw);
      setSearchResult(engine.search(raw.trim()));
    },
    [],
  );

  const isPending =
    deferredCities !== selectedCities ||
    deferredAges !== selectedAges ||
    deferredStatuses !== selectedStatuses ||
    deferredSortField !== sortField ||
    deferredSortDirection !== sortDirection;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <PageHeader
        title="Merge Nested"
        description={
          <>
            Combines nested <strong>search</strong>, <strong>filter</strong>,
            and
            <strong> sort</strong> with dot-path support for
            <code>orders.status</code>.
          </>
        }
      />

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-800">Search</p>
        <input
          value={query}
          onChange={handleSearch}
          placeholder="Search name, city, or order status..."
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-sm font-medium text-slate-800">Cities</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() =>
                  setSelectedCities((prev) =>
                    prev.includes(city)
                      ? prev.filter((value) => value !== city)
                      : [...prev, city],
                  )
                }
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
          <p className="text-sm font-medium text-slate-800">Ages</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ages.map((age) => (
              <button
                key={age}
                type="button"
                onClick={() =>
                  setSelectedAges((prev) =>
                    prev.includes(age)
                      ? prev.filter((value) => value !== age)
                      : [...prev, age],
                  )
                }
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

        <div>
          <p className="text-sm font-medium text-slate-800">Order status</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {orderStatuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() =>
                  setSelectedStatuses((prev) =>
                    prev.includes(status)
                      ? prev.filter((value) => value !== status)
                      : [...prev, status],
                  )
                }
                className={`rounded-full border px-3 py-1 text-xs ${
                  selectedStatuses.includes(status)
                    ? "border-slate-700 bg-slate-700 text-white"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <select
          value={sortField}
          onChange={(event) => setSortField(event.target.value as SortField)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="age">age</option>
          <option value="name">name</option>
          <option value="city">city</option>
        </select>

        <select
          value={sortDirection}
          onChange={(event) =>
            setSortDirection(event.target.value as SortDirection)
          }
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="asc">asc</option>
          <option value="desc">desc</option>
        </select>
      </div>

      <ShowingCount count={result.length} itemName="users" />

      <div className={isPending ? "opacity-30 transition-opacity" : ""}>
        <VirtualizedNestedUserCards items={result} />
      </div>
    </section>
  );
}

export default MergeNestedPage;
