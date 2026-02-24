import { useState, useTransition, useRef, useCallback } from "react";
import { TextSearchEngine } from "@devisfuture/mega-collection/search";
import { users } from "../data/users";
import VirtualizedUserCards from "../components/VirtualizedUserCards";

import ShowingCount from "../components/ShowingCount";

import PageHeader from "../components/PageHeader";

type User = (typeof users)[number];

// minQueryLength: 2 — prevents 1-gram posting list scans (~70-80 k candidates
// for single chars like "a") that would block the main thread on 100 k items.
const engine = new TextSearchEngine<User>({ minQueryLength: 2 });
engine.buildIndex(users, "city").buildIndex(users, "name");

/** Delay (ms) after the last keystroke before the search is executed. */
const DEBOUNCE_MS = 150;

function SearchPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<User[]>(users);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;
      // Update the controlled input immediately so typing feels snappy.
      setQuery(raw);

      // Cancel any pending debounced search.
      if (debounceRef.current !== null) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        const trimmed = raw.trim();

        // startTransition marks the result update as non-urgent — React won't
        // block user input while it processes the state change.
        startTransition(() => {
          if (!trimmed) {
            setResult(users);
            return;
          }

          const byCity = engine.search("city", trimmed);
          const byName = engine.search("name", trimmed);

          // Deduplicate: a user matching both fields should appear only once.
          const seenIds = new Set(byCity.map((u) => u.id));
          const combined = [
            ...byCity,
            ...byName.filter((u) => !seenIds.has(u.id)),
          ];

          setResult(combined);
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
