import { useMemo, useState } from "react";
import { TextSearchEngine } from "@devisfuture/mega-collection/search";
import { users } from "../data/users";
import VirtualizedUserCards from "../components/VirtualizedUserCards";

const searchEngine = new TextSearchEngine<(typeof users)[number]>();
// searchEngine.buildIndex(users, "name");
searchEngine.buildIndex(users, "city");

function SearchPage() {
  const [query, setQuery] = useState("");

  const result = useMemo(() => {
    const normalized = query.trim();

    if (!normalized) {
      return users;
    }

    // const byName = searchEngine.search("name", normalized);
    const byCity = searchEngine.search("city", normalized);
    // const unique = new Map<number, (typeof users)[number]>();

    // for (const item of [...byName, ...byCity]) {
    //   unique.set(item.id, item);
    // }

    // return [...unique.values()];
    return byCity;
  }, [query]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Search route</h1>
      <p className="mt-1 text-sm text-slate-600">
        Uses <strong>TextSearchEngine</strong> to search by name and city.
      </p>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Type name or city..."
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
