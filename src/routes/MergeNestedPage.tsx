import { useDeferredValue, useMemo, useState, type ChangeEvent } from "react";
import type { FilterCriterion } from "@devisfuture/mega-collection/filter";
import {
  ages,
  cities,
  orderStatuses,
  type UserWithOrders,
} from "../data/users";
import PageHeader from "../components/PageHeader";
import ShowingCount from "../components/ShowingCount";
import VirtualizedNestedUserCards from "../components/VirtualizedNestedUserCards";
import { useDemoEngine } from "../modules/demo-modules";
import { SortSelect } from "src/components/SortSelect";

type SortField = "age" | "name" | "city";
type SortDirection = "asc" | "desc";

function MergeNestedPage() {
  const engine = useDemoEngine("mergeNested");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

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
    const trimmedQuery = deferredQuery.trim();

    if (deferredCities.length > 0) {
      criteria.push({ field: "city", values: deferredCities });
    }

    if (deferredAges.length > 0) {
      criteria.push({ field: "age", values: deferredAges });
    }

    if (deferredStatuses.length > 0) {
      criteria.push({ field: "orders.status", values: deferredStatuses });
    }

    return engine
      .search(trimmedQuery)
      .filter(criteria)
      .sort([{ field: deferredSortField, direction: deferredSortDirection }]);
  }, [
    deferredQuery,
    deferredCities,
    deferredAges,
    deferredStatuses,
    deferredSortField,
    deferredSortDirection,
  ]);

  const isPending =
    deferredQuery !== query ||
    deferredCities !== selectedCities ||
    deferredAges !== selectedAges ||
    deferredStatuses !== selectedStatuses ||
    deferredSortField !== sortField ||
    deferredSortDirection !== sortDirection;

  const searchQuery = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const resetPipeline = () => {
    setQuery("");
    setSelectedCities([]);
    setSelectedAges([]);
    setSelectedStatuses([]);
    setSortField("age");
    setSortDirection("asc");
  };

  const onChangeSortField = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortField(event.target.value as SortField);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <PageHeader
        title="Merge Nested"
        description={
          <>
            Combines nested <strong>search</strong>, <strong>filter</strong>,
            and <strong>sort</strong> with dot-path support for
            <code>orders.status</code> through chained
            <code> MergeEngines </code>
            calls.
          </>
        }
      />

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-800">Search</p>
        <input
          value={query}
          onChange={searchQuery}
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
        <div>
          <p className="mb-1 text-sm font-medium text-slate-800">Sort field</p>

          <SortSelect onChange={onChangeSortField} field={sortField} />
        </div>

        <div>
          <p className="mb-1 text-sm font-medium text-slate-800">Direction</p>
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
        <VirtualizedNestedUserCards items={result} />
      </div>
    </section>
  );
}

export default MergeNestedPage;
