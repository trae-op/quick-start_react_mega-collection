import { useMemo, useState, useDeferredValue } from "react";
import { SortEngine } from "@devisfuture/mega-collection/sort";
import { users, type User } from "../data/users";
import VirtualizedUserCards from "../components/VirtualizedUserCards";

import ShowingCount from "../components/ShowingCount";

import PageHeader from "../components/PageHeader";

const engine = new SortEngine<User>({
  data: users,
  fields: ["age", "name", "city"],
});

function SortPage() {
  const [field, setField] = useState<"name" | "city" | "age">("age");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const deferredField = useDeferredValue(field);
  const deferredDirection = useDeferredValue(direction);

  const result = useMemo(
    () => engine.sort([{ field: deferredField, direction: deferredDirection }]),
    [deferredField, deferredDirection],
  );

  const isPending = deferredField !== field || deferredDirection !== direction;

  const onChangeField = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setField(event.target.value as "name" | "city" | "age");
  };

  const onChangeDirection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDirection(event.target.value as "asc" | "desc");
  };

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
          onChange={onChangeField}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="age">age</option>
          <option value="name">name</option>
          <option value="city">city</option>
        </select>

        <select
          value={direction}
          onChange={onChangeDirection}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="asc">asc</option>
          <option value="desc">desc</option>
        </select>
      </div>

      <ShowingCount count={result.length} itemName="users" />

      <div className={isPending ? "opacity-30 transition-opacity" : ""}>
        <VirtualizedUserCards items={result} />
      </div>
    </section>
  );
}

export default SortPage;
