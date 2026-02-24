import { useMemo, useState } from "react";
import { FilterEngine } from "@devisfuture/mega-collection/filter";
import { users } from "../data/users";
import type { User } from "../data/users";
import VirtualizedUserCards from "../components/VirtualizedUserCards";

const filterEngine = new FilterEngine<User>()
  .buildIndex(users, "city")
  .buildIndex(users, "age");

const cityOptions = ["Kyiv", "Lviv", "Odesa", "Kharkiv", "Dnipro"];
const ageOptions = [22, 26, 30, 34, 38, 42];

function FilterPage() {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<number[]>([]);

  const result = useMemo(() => {
    const criteria: Array<{ field: keyof User; values: User[keyof User][] }> =
      [];

    if (selectedCities.length > 0) {
      criteria.push({ field: "city", values: selectedCities });
    }

    if (selectedAges.length > 0) {
      criteria.push({ field: "age", values: selectedAges });
    }

    if (criteria.length === 0) {
      return users;
    }

    return filterEngine.filter(users, criteria);
  }, [selectedCities, selectedAges]);

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
      <h1 className="text-xl font-semibold text-slate-900">Filter route</h1>
      <p className="mt-1 text-sm text-slate-600">
        Uses <strong>FilterEngine</strong> with indexed city/age criteria.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-slate-800">Cities</p>
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
          <p className="text-sm font-medium text-slate-800">Ages</p>
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

      <p className="mt-4 text-xs text-slate-500">
        Showing {Math.min(result.length, 1000)} of {users.length} users
      </p>

      <VirtualizedUserCards items={result} />
    </section>
  );
}

export default FilterPage;
