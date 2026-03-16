import {
  useDeferredValue,
  useMemo,
  useState,
  useCallback,
  useTransition,
  startTransition,
  memo,
} from "react";
import AddModal from "../components/AddModal";
import VirtualizedUserCards from "../components/VirtualizedUserCards";
import ShowingCount from "../components/ShowingCount";
import PageHeader from "../components/PageHeader";
import { useDemoEngine } from "../modules/demo-modules";
import { SortSelect, type SortField } from "../components/SortSelect";

type TSortDirection = "asc" | "desc";

type TAddUserProps = {
  onAdd: (payload: { name: string; age: number; city: string }) => void;
  isPending: boolean;
};

const AddUser = memo((props: TAddUserProps) => {
  const { onAdd, isPending } = props;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddUser = useCallback(
    ({ age, city, name }: { name: string; age: number; city: string }) => {
      onAdd({ name, age, city });
      setIsAddModalOpen(false);
    },
    [onAdd],
  );

  return (
    <>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setIsAddModalOpen(true)}
        className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isPending ? "Processing…" : "Add user"}
      </button>

      <AddModal
        isOpen={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
      />
    </>
  );
});

const AddPage = memo(() => {
  const engine = useDemoEngine("add");
  const [dataVersion, setDataVersion] = useState(0);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<TSortDirection>("desc");

  const [isComputePending, startComputeTransition] = useTransition();

  const deferredSortField = useDeferredValue(sortField);
  const deferredSortDirection = useDeferredValue(sortDirection);

  const isPending =
    isComputePending ||
    deferredSortField !== sortField ||
    deferredSortDirection !== sortDirection;

  const result = useMemo(
    () =>
      engine.sort([
        { field: deferredSortField, direction: deferredSortDirection },
      ]),
    [dataVersion, engine, deferredSortField, deferredSortDirection],
  );

  const handleAddUser = useCallback(
    ({ name, age, city }: { name: string; age: number; city: string }) => {
      engine.add([
        {
          id: Date.now(),
          name,
          age,
          city,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      startComputeTransition(() => {
        setDataVersion((current) => current + 1);
      });
    },
    [engine, startComputeTransition],
  );

  const onChangeSortField = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSortField(event.target.value as SortField);
    },
    [],
  );

  const onChangeSortDirection = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSortDirection(event.target.value as TSortDirection);
    },
    [],
  );

  const resetPipeline = useCallback(() => {
    startTransition(() => {
      setSortField("createdAt");
      setSortDirection("desc");
    });
  }, []);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <PageHeader
        title="Add"
        description={
          <>
            Add new users to the collection and keep the list sorted.
            <br />
            <code>{`engine.add([{ id: Date.now(), name, age, city, createdAt: new Date(), updatedAt: new Date() }]);`}</code>
          </>
        }
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <div className="flex items-end">
          <AddUser onAdd={handleAddUser} isPending={isPending} />
        </div>

        <div>
          <p className="mb-1 text-sm font-medium text-slate-800">Sort field</p>
          <SortSelect onChange={onChangeSortField} field={sortField} />
        </div>

        <div>
          <p className="mb-1 text-sm font-medium text-slate-800">Direction</p>
          <select
            value={sortDirection}
            onChange={onChangeSortDirection}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="asc">asc</option>
            <option value="desc">desc</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={resetPipeline}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          >
            Reset pipeline
          </button>
        </div>
      </div>

      <ShowingCount count={result.length} itemName="users" />

      <div className={isPending ? "opacity-30 transition-opacity" : ""}>
        <VirtualizedUserCards items={result} />
      </div>
    </section>
  );
});

export default AddPage;
