import {
  useCallback,
  useDeferredValue,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";

import ShowingCount from "../components/ShowingCount";

import PageHeader from "../components/PageHeader";
import Code from "../components/Code";
import { useDemoEngine } from "../modules/demo-modules";
import type { User } from "../data/users";
import UpdateModal from "../components/UpdateModal";
import { AutoSizer } from "react-virtualized-auto-sizer";
import { List, type RowComponentProps } from "react-window";

type SearchField = "all" | "name" | "city";
const ROW_HEIGHT = 73;

type RemovableUserRowProps = {
  items: User[];
  onUpdate: (user: User) => void;
};

function RemovableUserRow({
  ariaAttributes,
  index,
  style,
  items,
  onUpdate,
}: RowComponentProps<RemovableUserRowProps>) {
  const user = items[index];

  if (!user) {
    return null;
  }

  return (
    <div style={style} className="px-0.5 py-1">
      <article
        {...ariaAttributes}
        className="rounded-lg border border-slate-200 bg-slate-50 p-3"
      >
        <label className="flex cursor-pointer items-start gap-3">
          <button
            type="button"
            onClick={() => onUpdate(user)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Update
          </button>

          <div>
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-600">
              #{user.id} • {user.city} • {user.age} years
            </p>
          </div>
        </label>
      </article>
    </div>
  );
}

function UpdatePage() {
  const engine = useDemoEngine("update");
  const [query, setQuery] = useState("");

  const [user, setUser] = useState<User | null>(null);
  const [dataVersion, setDataVersion] = useState(0);

  const [searchField, setSearchField] = useState<SearchField>("all");
  const deferredQuery = useDeferredValue(query);

  const result = useMemo(() => {
    const trimmedQuery = deferredQuery.trim();

    if (searchField === "all") {
      return engine.search(trimmedQuery);
    }

    return engine.search(searchField, trimmedQuery);
  }, [deferredQuery, searchField, dataVersion]);

  const isPending = deferredQuery !== query;

  const onChangeSearchField = (event: ChangeEvent<HTMLSelectElement>) => {
    setSearchField(event.target.value as SearchField);
  };

  const handleUpdateUser = useCallback(
    (item: { name: string; age: number; city: string }) => {
      if (!user) {
        return;
      }

      engine.update({
        field: "id",
        data: {
          ...user,
          name: item.name,
          age: item.age,
          city: item.city,
        },
      });

      setDataVersion((current) => current + 1);
      setUser(null);
    },
    [engine, user],
  );

  const onUpdate = (user: User) => {
    setUser(user);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <UpdateModal
        item={user}
        onCancel={() => setUser(null)}
        onUpdate={handleUpdateUser}
      />
      <PageHeader
        title="Update"
        description={
          <>
            Search users and update a selected record by <code>id</code>.
            <br />
            <Code
              code={`engine.update({ field: "id", data: { ...user, name: "…" } });`}
            />
          </>
        }
      />

      <div className="mt-4 grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
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
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Query</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try: John, Miami, Los Angeles"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          />
        </label>
      </div>

      <ShowingCount count={result.length} itemName="users" />

      <div
        className={`mt-4 h-[calc(100vh-300px)] rounded-lg border border-slate-200 bg-white p-2 ${
          isPending ? "opacity-30 transition-opacity" : ""
        }`}
      >
        <AutoSizer
          renderProp={({ height, width }) => {
            if (!height || !width) {
              return null;
            }

            return (
              <List
                rowCount={result.length}
                rowHeight={ROW_HEIGHT}
                rowComponent={RemovableUserRow}
                rowProps={{
                  items: result,
                  onUpdate,
                }}
                overscanCount={2}
                style={{ height, width }}
              />
            );
          }}
        />
      </div>
    </section>
  );
}

export default UpdatePage;
