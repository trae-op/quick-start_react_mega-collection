import { useState } from "react";
import { TextSearchEngine } from "@devisfuture/mega-collection/search";
import { users } from "../data/users";
import VirtualizedUserCards from "../components/VirtualizedUserCards";

type User = (typeof users)[number];

const searchEngine = new TextSearchEngine<User>();
searchEngine.buildIndex(users, "city");

function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Search route</h1>
      <p className="mt-1 text-sm text-slate-600">
        Uses <strong>TextSearchEngine</strong> to search by name and city.
      </p>

      <input
        value={query}
        onChange={(event) => {
          const normalized = event.target.value.trim();
          const byCity = searchEngine.search("city", normalized);
          console.log("Search query:", byCity);
          setQuery(event.target.value);
        }}
        placeholder="Type name or city..."
        className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
      />

      <p className="mt-3 text-xs text-slate-500">
        Showing {Math.min(query.length, 1000)} of {users.length} users
      </p>

      <VirtualizedUserCards items={users} />
    </section>
  );
}

export default SearchPage;
