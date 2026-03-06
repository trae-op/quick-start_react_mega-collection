import { useDeferredValue, useMemo, useState } from "react";
import { FilterEngine } from "@devisfuture/mega-collection/filter";
import type { FilterCriterion } from "@devisfuture/mega-collection/filter";
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

const engine = new FilterEngine<UserWithOrders>({
  data: nestedUsers,
  fields: ["city", "age"],
  nestedFields: ["orders.status"],
  filterByPreviousResult: true,
});

function FilterNestedPage() {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const deferredCities = useDeferredValue(selectedCities);
  const deferredAges = useDeferredValue(selectedAges);
  const deferredStatuses = useDeferredValue(selectedStatuses);

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

    if (criteria.length === 0) {
      return nestedUsers;
    }

    return engine.filter(criteria);
  }, [deferredCities, deferredAges, deferredStatuses]);

  const isPending =
    deferredCities !== selectedCities ||
    deferredAges !== selectedAges ||
    deferredStatuses !== selectedStatuses;

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city)
        ? prev.filter((value) => value !== city)
        : [...prev, city],
    );
  };

  const toggleAge = (age: number) => {
    setSelectedAges((prev) =>
      prev.includes(age)
        ? prev.filter((value) => value !== age)
        : [...prev, age],
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((value) => value !== status)
        : [...prev, status],
    );
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <PageHeader
        title="Filter Nested"
        description={
          <>
            Uses <strong>FilterEngine</strong> with top-level and nested
            criteria including <code>orders.status</code>.
          </>
        }
      />

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-sm font-medium text-slate-800">Cities</p>
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
          <p className="text-sm font-medium text-slate-800">Ages</p>
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

        <div>
          <p className="text-sm font-medium text-slate-800">Order status</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {orderStatuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => toggleStatus(status)}
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

      <ShowingCount count={result.length} itemName="users" />

      <div className={isPending ? "opacity-30 transition-opacity" : ""}>
        <VirtualizedNestedUserCards items={result} />
      </div>
    </section>
  );
}

export default FilterNestedPage;
