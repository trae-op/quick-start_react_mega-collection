import { useMemo, useState, useDeferredValue } from "react";
import type { FilterCriterion } from "@devisfuture/mega-collection/filter";
import { ages, cities } from "../data/users";
import type { User } from "../data/users";
import VirtualizedUserCards from "../components/VirtualizedUserCards";

import ShowingCount from "../components/ShowingCount";

import PageHeader from "../components/PageHeader";
import Code from "../components/Code";
import { useDemoEngine } from "../modules/demo-modules";

function FilterPage() {
  const engine = useDemoEngine("filter");
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
            Filter users by <code>city</code> and <code>age</code> using{" "}
            <strong>FilterEngine</strong>.
            <br />
            <Code
              code={`engine.filter([{ field: "city", values: ["Chicago"] }, { field: "age", values: [30] }]);`}
            />
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
