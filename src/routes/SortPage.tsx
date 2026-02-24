import { useMemo, useState } from "react";
import { SortEngine } from "@devisfuture/mega-collection/sort";
import { users, type User } from "../data/users";
import VirtualizedUserCards from "../components/VirtualizedUserCards";

const sortEngine = new SortEngine<User>();

function SortPage() {
  const [field, setField] = useState<"name" | "city" | "age">("age");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const result = useMemo(() => {
    return sortEngine.sort(users, [
      { field, direction },
      { field: "id", direction: "asc" },
    ]);
  }, [field, direction]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Sort route</h1>
      <p className="mt-1 text-sm text-slate-600">
        Uses <strong>SortEngine</strong> for dynamic field sorting.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <select
          value={field}
          onChange={(event) =>
            setField(event.target.value as "name" | "city" | "age")
          }
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="age">age</option>
          <option value="name">name</option>
          <option value="city">city</option>
        </select>

        <select
          value={direction}
          onChange={(event) =>
            setDirection(event.target.value as "asc" | "desc")
          }
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="asc">asc</option>
          <option value="desc">desc</option>
        </select>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Showing {Math.min(result.length, 1000)} of {users.length} users
      </p>

      <VirtualizedUserCards items={result} />
    </section>
  );
}

export default SortPage;
