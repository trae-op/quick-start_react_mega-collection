import { useDeferredValue, useMemo, useState, type ChangeEvent } from "react";
import VirtualizedUserCards from "../components/VirtualizedUserCards";

import ShowingCount from "../components/ShowingCount";

import PageHeader from "../components/PageHeader";
import Code from "../components/Code";
import { useDemoEngine } from "../modules/demo-modules";

type SearchField = "all" | "name" | "city";

function SearchPage() {
  const engine = useDemoEngine("search");
  const [query, setQuery] = useState("");
  const [searchField, setSearchField] = useState<SearchField>("all");
  const deferredQuery = useDeferredValue(query);

  const result = useMemo(() => {
    const trimmedQuery = deferredQuery.trim();

    if (searchField === "all") {
      return engine.search(trimmedQuery);
    }

    return engine.search(searchField, trimmedQuery);
  }, [deferredQuery, searchField]);

  const isPending = deferredQuery !== query;

  const onChangeSearchField = (event: ChangeEvent<HTMLSelectElement>) => {
    setSearchField(event.target.value as SearchField);
  };

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-950 p-4 shadow-sm">
      <PageHeader
        title="Search"
        description={
          <>
            Search users by <code>name</code> or <code>city</code> using{" "}
            <strong>TextSearchEngine</strong>.
            <br />
            <Code
              code={`
import { TextSearchEngine } from "@devisfuture/mega-collection/search";
...
const search = new TextSearchEngine<User>({
  data: users,
  fields: ["city", "name"],
  minQueryLength: 2,
});
...
const search = new TextSearchEngine<User>({ data: users, fields: ["city", "name"], minQueryLength: 2 });\nengine.search("query...");`}
            />
          </>
        }
      />

      <div className="mt-4 grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
        <label className="block">
          <span className="text-sm font-medium text-slate-100">
            Search mode
          </span>
          <select
            value={searchField}
            onChange={onChangeSearchField}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          >
            <option value="all">All indexed fields</option>
            <option value="name">Only name</option>
            <option value="city">Only city</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-100">Query</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try: John, Miami, Los Angeles"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-slate-600"
          />
        </label>
      </div>

      <ShowingCount count={result.length} itemName="users" />

      <div
        className={isPending ? "mt-4 opacity-30 transition-opacity" : "mt-4"}
      >
        <VirtualizedUserCards items={result} />
      </div>
    </section>
  );
}

export default SearchPage;
