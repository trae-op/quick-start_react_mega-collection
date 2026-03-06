import { useCallback, useState } from "react";
import { TextSearchEngine } from "@devisfuture/mega-collection/search";
import { nestedUsers, type UserWithOrders } from "../data/users";
import PageHeader from "../components/PageHeader";
import ShowingCount from "../components/ShowingCount";
import VirtualizedNestedUserCards from "../components/VirtualizedNestedUserCards";

const engine = new TextSearchEngine<UserWithOrders>({
  data: nestedUsers,
  fields: ["name", "city", "orders.status"],
  minQueryLength: 2,
});

function SearchNestedPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<UserWithOrders[]>(nestedUsers);

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
        title="Search Nested"
        description={
          <>
            Uses <strong>TextSearchEngine</strong> with dot-path fields like
            <code> orders.status </code>.
          </>
        }
      />

      <input
        value={query}
        onChange={handleSearch}
        placeholder="Search by name, city, or order status..."
        className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
      />

      <ShowingCount count={result.length} itemName="users" />

      <VirtualizedNestedUserCards items={result} />
    </section>
  );
}

export default SearchNestedPage;
