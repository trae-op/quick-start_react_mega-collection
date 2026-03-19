import { useMemo, useState } from "react";
import { List, type RowComponentProps } from "react-window";
import { AutoSizer } from "react-virtualized-auto-sizer";
import PageHeader from "../components/PageHeader";
import Code from "../components/Code";
import ShowingCount from "../components/ShowingCount";
import type { User } from "../data/users";
import { useDemoEngine } from "../modules/demo-modules";

const ROW_HEIGHT = 84;

type RemovableUserRowProps = {
  checkedIdSet: Set<number>;
  items: User[];
  onToggle: (id: number) => void;
};

function RemovableUserRow({
  ariaAttributes,
  index,
  style,
  checkedIdSet,
  items,
  onToggle,
}: RowComponentProps<RemovableUserRowProps>) {
  const user = items[index];

  if (!user) {
    return null;
  }

  return (
    <div style={style} className="px-0.5 py-1">
      <article
        {...ariaAttributes}
        className="rounded-lg border border-slate-700 bg-slate-900 p-3"
      >
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={checkedIdSet.has(user.id)}
            onChange={() => onToggle(user.id)}
            className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-slate-100 focus:ring-slate-500"
          />

          <div>
            <p className="text-sm font-medium text-slate-100">{user.name}</p>
            <p className="text-xs text-slate-400">
              #{user.id} • {user.city} • {user.age} years
            </p>
          </div>
        </label>
      </article>
    </div>
  );
}

function DeletePage() {
  const engine = useDemoEngine("filterMutableExclude");
  const [dataVersion, setDataVersion] = useState(0);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  const result = useMemo(() => engine.getOriginData(), [engine, dataVersion]);

  const checkedIdSet = useMemo(() => new Set(checkedIds), [checkedIds]);

  const toggleChecked = (id: number) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  };

  const deleteChecked = () => {
    if (checkedIds.length === 0) {
      return;
    }

    engine.delete("id", checkedIds);

    setDataVersion((current) => current + 1);
    setCheckedIds([]);
  };

  const resetRemoved = () => {
    setCheckedIds([]);
  };

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-950 p-4 shadow-sm">
      <PageHeader
        title="Filter Remove"
        description={
          <>
            Delete checked users from origin data via{" "}
            <strong>FilterEngine</strong>.
            <br />
            <Code
              code={`
import { FilterEngine } from "@devisfuture/mega-collection/filter";
...
const filterMutableExclude = new FilterEngine<User>({
  data: users,
  fields: ["id", "city", "age"],
  filterByPreviousResult: true
});
...
filterMutableExclude.delete("id", [1, 4]);`}
            />
          </>
        }
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={deleteChecked}
          disabled={checkedIds.length === 0}
          className="cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-600"
        >
          Delete ({checkedIds.length})
        </button>

        <button
          type="button"
          onClick={resetRemoved}
          className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100"
        >
          Reset collection
        </button>
      </div>

      <ShowingCount count={result.length} itemName="users" />

      {result.length === 0 ? (
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm text-slate-400">
          No users left in the collection.
        </div>
      ) : (
        <div
          className={`mt-4 h-[calc(100vh-300px)] rounded-lg border border-slate-700 bg-slate-950 p-2 `}
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
                    checkedIdSet,
                    items: result,
                    onToggle: toggleChecked,
                  }}
                  overscanCount={2}
                  style={{ height, width }}
                />
              );
            }}
          />
        </div>
      )}
    </section>
  );
}

export default DeletePage;
