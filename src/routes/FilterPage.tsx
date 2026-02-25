import { useMemo, useState, useDeferredValue } from "react";
import { FilterEngine } from "@devisfuture/mega-collection/filter";
import { users } from "../data/users";
import type { User } from "../data/users";
import VirtualizedUserCards from "../components/VirtualizedUserCards";

import ShowingCount from "../components/ShowingCount";

import PageHeader from "../components/PageHeader";

const engine = new FilterEngine<User>({
  data: users,
  fields: ["city", "age"],
  filterByPreviousResult: true,
});

const cityOptions = ["Kyiv", "Lviv", "Odesa", "Kharkiv", "Dnipro"];
const ageOptions = [22, 26, 30, 34, 38, 42];

function FilterPage() {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<number[]>([]);

  // Defer filter criteria so toggle buttons respond instantly while the
  // engine.filter() call (even O(k) indexed) is scheduled as a low-priority update.
  const deferredCities = useDeferredValue(selectedCities);
  const deferredAges = useDeferredValue(selectedAges);

  const result = useMemo(() => {
    const criteria: Array<{ field: keyof User; values: User[keyof User][] }> =
      [];

    if (deferredCities.length > 0) {
      criteria.push({ field: "city", values: deferredCities });
    }

    if (deferredAges.length > 0) {
      criteria.push({ field: "age", values: deferredAges });
    }

    if (criteria.length === 0) {
      return users;
    }

    return engine.filter(criteria);
  }, [deferredCities, deferredAges]);

  // True while React is computing the deferred filter result.
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

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <PageHeader
        title="Filter route"
        description={
          <>
            Uses <strong>FilterEngine</strong> with indexed city/age criteria.
          </>
        }
      />

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-slate-800">Cities</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {cityOptions.map((city) => {
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
            {ageOptions.map((age) => {
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

      <div className={isPending ? "opacity-60 transition-opacity" : ""}>
        <VirtualizedUserCards items={result} />
      </div>
    </section>
  );
}

export default FilterPage;
