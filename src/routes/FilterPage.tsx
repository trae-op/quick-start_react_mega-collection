import { useMemo, useState, useDeferredValue } from "react";
import { FilterEngine } from "@devisfuture/mega-collection/filter";
import type { FilterCriterion } from "@devisfuture/mega-collection/filter";
import { ages, cities, users } from "../data/users";
import type { User } from "../data/users";
import VirtualizedUserCards from "../components/VirtualizedUserCards";

import ShowingCount from "../components/ShowingCount";

import PageHeader from "../components/PageHeader";

const engine = new FilterEngine<User>({
  data: users,
  fields: ["city", "age"],
  filterByPreviousResult: true,
});

function FilterPage() {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<number[]>([]);

  const deferredCities = useDeferredValue(selectedCities);
  const deferredAges = useDeferredValue(selectedAges);

  const result = useMemo(() => {
    const criteria: FilterCriterion<User>[] = [];

    if (deferredCities.length > 0) {
      criteria.push({ field: "city", values: deferredCities });
    }

    if (deferredAges.length > 0) {
      criteria.push({ field: "age", values: deferredAges });
    }

    return engine.filter(criteria);
  }, [deferredCities, deferredAges]);

  const isPending =
    deferredCities !== selectedCities || deferredAges !== selectedAges;

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

  const resetFilters = () => {
    setSelectedCities([]);
    setSelectedAges([]);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <PageHeader
        title="Filter"
        description={
          <>
            Uses <strong>FilterEngine</strong> with stored data,
            <code>fields</code>
            for <code>city</code> and <code>age</code>, plus
            <code>filter(criteria)</code> over the engine memory.
          </>
        }
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={resetFilters}
          className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700"
        >
          Reset filters
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-slate-800">Cities</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {cities.map((city) => {
              const onClick = () => toggleCity(city);

              return (
                <button
                  key={city}
                  type="button"
                  onClick={onClick}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    selectedCities.includes(city)
                      ? "border-slate-700 bg-slate-700 text-white"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-800">Ages</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ages.map((age) => {
              const onClick = () => toggleAge(age);
              return (
                <button
                  key={age}
                  type="button"
                  onClick={onClick}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    selectedAges.includes(age)
                      ? "border-slate-700 bg-slate-700 text-white"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  {age}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <ShowingCount count={result.length} itemName="users" />

      <div className={isPending ? "opacity-30 transition-opacity" : ""}>
        <VirtualizedUserCards items={result} />
      </div>
    </section>
  );
}

export default FilterPage;
