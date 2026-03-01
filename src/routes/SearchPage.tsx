import { useState, useCallback } from "react";
import { TextSearchEngine } from "@devisfuture/mega-collection/search";
import { users } from "../data/users";
import VirtualizedUserCards from "../components/VirtualizedUserCards";

import ShowingCount from "../components/ShowingCount";

import PageHeader from "../components/PageHeader";

type User = (typeof users)[number];

const engine = new TextSearchEngine<User>({
  data: users,
  fields: ["city", "name"],
  minQueryLength: 2,
});

function SearchPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<User[]>(users);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;
      const trimmed = raw.trim();
      setQuery(raw);

      setResult(engine.search(trimmed));
    },
    [],
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <PageHeader
        title="Search"
        description={
          <>
            Uses <strong>TextSearchEngine</strong> to searching.
          </>
        }
      />

      <input
        value={query}
        onChange={handleSearch}
        className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
      />

      <ShowingCount count={result.length} itemName="users" />

      <div className="mt-4">
        <VirtualizedUserCards items={result} />
      </div>
    </section>
  );
}

export default SearchPage;
