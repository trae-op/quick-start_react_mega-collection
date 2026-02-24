import { useState } from "react";
import { TextSearchEngine } from "@devisfuture/mega-collection/search";
import { users } from "../data/users";
import VirtualizedUserCards from "../components/VirtualizedUserCards";

type User = (typeof users)[number];

const engine = new TextSearchEngine<User>();
engine.buildIndex(users, "city").buildIndex(users, "name");

function SearchPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<User[]>(users);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const trimmed = raw.trim();
    setQuery(raw);

    if (!trimmed) {
      setResult(users);
      return;
    }

    const byCity = engine.search("city", trimmed);
    const byName = engine.search("name", trimmed);
    setResult([...byCity, ...byName]);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Search route</h1>
      <p className="mt-1 text-sm text-slate-600">
        Uses <strong>TextSearchEngine</strong> to searching.
      </p>

      <input
        value={query}
        onChange={handleSearch}
        className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
      />

      <p className="mt-3 text-xs text-slate-500">
        Showing {Math.min(result.length, 1000)} of {users.length} users
      </p>

      <VirtualizedUserCards items={result} />
    </section>
  );
}

export default SearchPage;
