import { useDeferredValue, useMemo, useState, type ChangeEvent } from "react";
import { TextSearchEngine } from "@devisfuture/mega-collection/search";
import { nestedUsers, type UserWithOrders } from "../data/users";
import PageHeader from "../components/PageHeader";
import ShowingCount from "../components/ShowingCount";
import VirtualizedNestedUserCards from "../components/VirtualizedNestedUserCards";

type SearchField = "all" | "name" | "city" | "orders.status";

const engine = new TextSearchEngine<UserWithOrders>({
  data: nestedUsers,
  fields: ["name", "city"],
  nestedFields: ["orders.status"],
  minQueryLength: 2,
});

function SearchNestedPage() {
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
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <PageHeader
        title="Search Nested"
        description={
          <>
            Uses <strong>TextSearchEngine</strong> with indexed flat fields and
            nested dot-path search through <code>orders.status</code>.
          </>
        }
      />

      <div className="mt-4 grid gap-3 md:grid-cols-[220px_minmax(0,1fr)]">
        <label className="block">
          <span className="text-sm font-medium text-slate-800">
            Search mode
          </span>
          <select
            value={searchField}
            onChange={onChangeSearchField}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="all">All indexed fields</option>
            <option value="name">Only name</option>
            <option value="city">Only city</option>
            <option value="orders.status">Only orders.status</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Query</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try: John, Chicago, pending, delivered"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          />
        </label>
      </div>

      <ShowingCount count={result.length} itemName="users" />

      <div className={isPending ? "opacity-30 transition-opacity" : ""}>
        <VirtualizedNestedUserCards items={result} />
      </div>
    </section>
  );
}

export default SearchNestedPage;
