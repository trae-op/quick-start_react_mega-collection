import { useState, useTransition, useRef, useCallback } from "react";
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

const DEBOUNCE_MS = 150;

function SearchPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<User[]>(users);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;

      setQuery(raw);

      if (debounceRef.current !== null) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        const trimmed = raw.trim();

        startTransition(() => {
          if (!trimmed) {
            setResult(users);
            return;
          }

          setResult(engine.search(trimmed));
        });
      }, DEBOUNCE_MS);
    },
    [],
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <PageHeader
        title="Search route"
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

      <div className={isPending ? "opacity-60 transition-opacity" : ""}>
        <VirtualizedUserCards items={result} />
      </div>
    </section>
  );
}

export default SearchPage;
