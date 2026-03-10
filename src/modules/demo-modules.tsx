import { createContext, useContext, type ReactNode } from "react";
import { MergeEngines } from "@devisfuture/mega-collection";
import { FilterEngine } from "@devisfuture/mega-collection/filter";
import { TextSearchEngine } from "@devisfuture/mega-collection/search";
import { SortEngine } from "@devisfuture/mega-collection/sort";
import {
  createNestedUsers,
  createUsers,
  type User,
  type UserWithOrders,
} from "../data/users";

export type DemoDataRegistry = {
  users: User[];
  nestedUsers: UserWithOrders[];
};

export type DemoEngineRegistry = {
  search: TextSearchEngine<User>;
  searchNested: TextSearchEngine<UserWithOrders>;
  filter: FilterEngine<User>;
  filterNested: FilterEngine<UserWithOrders>;
  sort: SortEngine<User>;
  merge: MergeEngines<User>;
  filterMutableExclude: FilterEngine<User>;
  mergeNested: MergeEngines<UserWithOrders>;
};

export type DemoDataMap = Map<
  keyof DemoDataRegistry,
  DemoDataRegistry[keyof DemoDataRegistry]
>;

export type DemoEngineMap = Map<
  keyof DemoEngineRegistry,
  DemoEngineRegistry[keyof DemoEngineRegistry]
>;

type BootstrapStatus = "idle" | "loading" | "ready" | "error";

export type DemoModulesSnapshot = {
  status: BootstrapStatus;
  progress: number;
  message: string;
  dataModules: DemoDataMap;
  engineModules: DemoEngineMap;
  error: Error | null;
};

const DemoModulesContext = createContext<DemoModulesSnapshot | null>(null);

const listeners = new Set<(snapshot: DemoModulesSnapshot) => void>();

let bootstrapPromise: Promise<DemoModulesSnapshot> | null = null;

let snapshot: DemoModulesSnapshot = {
  status: "idle",
  progress: 0,
  message: "Waiting to initialize demo modules.",
  dataModules: new Map(),
  engineModules: new Map(),
  error: null,
};

const pauseForMainThread = () =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, 0);
  });

const publishSnapshot = (nextSnapshot: DemoModulesSnapshot) => {
  snapshot = nextSnapshot;
  listeners.forEach((listener) => listener(snapshot));
};

const updateSnapshot = (partial: Partial<DemoModulesSnapshot>) => {
  publishSnapshot({
    ...snapshot,
    ...partial,
  });
};

function toProgress(
  start: number,
  end: number,
  processed: number,
  total: number,
) {
  const ratio = total === 0 ? 1 : processed / total;
  return Math.round(start + (end - start) * ratio);
}

async function buildDemoModules(): Promise<DemoModulesSnapshot> {
  updateSnapshot({
    status: "loading",
    progress: 1,
    message: "Generating users dataset...",
    error: null,
  });

  const users = await createUsers({
    onProgress: ({ processed, total }) => {
      updateSnapshot({
        progress: toProgress(1, 34, processed, total),
        message: `Generating users dataset (${processed.toLocaleString()}/${total.toLocaleString()})...`,
      });
    },
  });

  updateSnapshot({
    progress: 35,
    message: "Generating nested users dataset...",
  });

  const nestedUsers = await createNestedUsers(users, {
    onProgress: ({ processed, total }) => {
      updateSnapshot({
        progress: toProgress(35, 54, processed, total),
        message: `Generating nested dataset (${processed.toLocaleString()}/${total.toLocaleString()})...`,
      });
    },
  });

  const dataModules: DemoDataMap = new Map();
  dataModules.set("users", users);
  dataModules.set("nestedUsers", nestedUsers);

  updateSnapshot({
    progress: 55,
    message: "Building search modules...",
    dataModules,
  });

  const search = new TextSearchEngine<User>({
    data: users,
    fields: ["city", "name"],
    minQueryLength: 2,
  });

  await pauseForMainThread();

  const searchNested = new TextSearchEngine<UserWithOrders>({
    data: nestedUsers,
    fields: ["name", "city"],
    nestedFields: ["orders.status"],
    minQueryLength: 2,
  });

  updateSnapshot({
    progress: 66,
    message: "Building filter modules...",
  });

  await pauseForMainThread();

  const filter = new FilterEngine<User>({
    data: users,
    fields: ["id", "city", "age"],
    filterByPreviousResult: true,
  });

  const filterMutableExclude = new FilterEngine<User>({
    data: users,
    fields: ["id", "city", "age"],
    filterByPreviousResult: true,
    mutableExcludeField: "id",
  });

  const filterNested = new FilterEngine<UserWithOrders>({
    data: nestedUsers,
    fields: ["city", "age"],
    nestedFields: ["orders.status"],
    filterByPreviousResult: true,
  });

  updateSnapshot({
    progress: 77,
    message: "Building sort module...",
  });

  await pauseForMainThread();

  const sort = new SortEngine<User>({
    data: users,
    fields: ["age", "name", "city"],
  });

  updateSnapshot({
    progress: 84,
    message: "Building merge modules...",
  });

  await pauseForMainThread();

  const merge = new MergeEngines<User>({
    imports: [TextSearchEngine, SortEngine, FilterEngine],
    data: users,
    search: { fields: ["name", "city"], minQueryLength: 2 },
    filter: { fields: ["city", "age"], filterByPreviousResult: true },
    sort: { fields: ["age", "name", "city"] },
  });

  const mergeNested = new MergeEngines<UserWithOrders>({
    imports: [TextSearchEngine, FilterEngine, SortEngine],
    data: nestedUsers,
    search: {
      fields: ["name", "city"],
      minQueryLength: 2,
      nestedFields: ["orders.status"],
    },
    filter: {
      fields: ["city", "age"],
      nestedFields: ["orders.status"],
      filterByPreviousResult: true,
    },
    sort: { fields: ["age", "name", "city"] },
  });

  const engineModules: DemoEngineMap = new Map();
  engineModules.set("search", search);
  engineModules.set("searchNested", searchNested);
  engineModules.set("filter", filter);
  engineModules.set("filterNested", filterNested);
  engineModules.set("sort", sort);
  engineModules.set("merge", merge);
  engineModules.set("mergeNested", mergeNested);
  engineModules.set("filterMutableExclude", filterMutableExclude);

  const readySnapshot: DemoModulesSnapshot = {
    status: "ready",
    progress: 100,
    message: "All demo modules are ready.",
    dataModules,
    engineModules,
    error: null,
  };

  publishSnapshot(readySnapshot);

  return readySnapshot;
}

export function initializeDemoModules() {
  if (!bootstrapPromise) {
    bootstrapPromise = buildDemoModules().catch((error: unknown) => {
      const resolvedError =
        error instanceof Error
          ? error
          : new Error("Failed to initialize demo modules.");

      const failedSnapshot: DemoModulesSnapshot = {
        ...snapshot,
        status: "error",
        error: resolvedError,
        message: resolvedError.message,
      };

      publishSnapshot(failedSnapshot);
      throw resolvedError;
    });
  }

  return bootstrapPromise;
}

export function getDemoModulesSnapshot() {
  return snapshot;
}

export function subscribeToDemoModules(
  listener: (nextSnapshot: DemoModulesSnapshot) => void,
) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function DemoModulesProvider({
  value,
  children,
}: {
  value: DemoModulesSnapshot;
  children: ReactNode;
}) {
  return (
    <DemoModulesContext.Provider value={value}>
      {children}
    </DemoModulesContext.Provider>
  );
}

function useDemoModulesContext() {
  const context = useContext(DemoModulesContext);

  if (!context) {
    throw new Error("Demo modules context is not available.");
  }

  return context;
}

export function useDemoModules() {
  return useDemoModulesContext();
}

export function getDemoData<K extends keyof DemoDataRegistry>(
  dataModules: DemoDataMap,
  key: K,
) {
  const dataModule = dataModules.get(key);

  if (!dataModule) {
    throw new Error(`Missing data module: ${key}`);
  }

  return dataModule as DemoDataRegistry[K];
}

export function getDemoEngine<K extends keyof DemoEngineRegistry>(
  engineModules: DemoEngineMap,
  key: K,
) {
  const engineModule = engineModules.get(key);

  if (!engineModule) {
    throw new Error(`Missing engine module: ${key}`);
  }

  return engineModule as DemoEngineRegistry[K];
}

export function useDemoData<K extends keyof DemoDataRegistry>(key: K) {
  const { dataModules } = useDemoModulesContext();
  return getDemoData(dataModules, key);
}

export function useDemoEngine<K extends keyof DemoEngineRegistry>(key: K) {
  const { engineModules } = useDemoModulesContext();
  return getDemoEngine(engineModules, key);
}
