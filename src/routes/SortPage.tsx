import { useMemo, useState } from "react";
import { SortEngine } from "@devisfuture/mega-collection/sort";
import { users, type User } from "../data/users";
import VirtualizedUserCards from "../components/VirtualizedUserCards";

import ShowingCount from "../components/ShowingCount";

import PageHeader from "../components/PageHeader";

const engine = new SortEngine<User>();
engine
  .buildIndex(users, "age")
  .buildIndex(users, "name")
  .buildIndex(users, "city");

function SortPage() {
  const [field, setField] = useState<"name" | "city" | "age">("age");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const result = useMemo(() => {
    return engine.sort(users, [
      { field, direction },
      { field: "id", direction: "asc" },
    ]);
  }, [field, direction]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <PageHeader
        title="Sort route"
        description={
          <>
            Uses <strong>SortEngine</strong> for dynamic field sorting.
          </>
        }
      />

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

      <ShowingCount count={result.length} itemName="users" />

      <VirtualizedUserCards items={result} />
    </section>
  );
}

export default SortPage;
