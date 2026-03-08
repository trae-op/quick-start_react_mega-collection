export type User = {
  id: number;
  name: string;
  city: string;
  age: number;
};

export type OrderStatus = "pending" | "delivered";

export type UserWithOrders = User & {
  orders: Array<{
    id: string;
    status: OrderStatus;
  }>;
};

const names = [
  "John",
  "Emma",
  "Liam",
  "Olivia",
  "Noah",
  "Sophia",
  "Mason",
  "Ava",
  "Lucas",
  "Mia",
];

export const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Miami",
  "San Francisco",
];

export const ages = [22, 26, 30, 34, 38, 42];

export const orderStatuses: OrderStatus[] = ["pending", "delivered"];

export const defaultLimit = 100000;

const DEFAULT_CHUNK_SIZE = 5000;

type BuildProgress = {
  processed: number;
  total: number;
};

type BuildOptions = {
  chunkSize?: number;
  onProgress?: (progress: BuildProgress) => void;
};

const pauseForMainThread = () =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, 0);
  });

export async function createUsers({
  chunkSize = DEFAULT_CHUNK_SIZE,
  onProgress,
}: BuildOptions = {}): Promise<User[]> {
  const result = new Array<User>(defaultLimit);

  for (let start = 0; start < defaultLimit; start += chunkSize) {
    const end = Math.min(start + chunkSize, defaultLimit);

    for (let index = start; index < end; index += 1) {
      const id = index + 1;

      result[index] = {
        id,
        name: `${names[index % names.length]} ${id}`,
        city: cities[index % cities.length],
        age: ages[index % ages.length],
      };
    }

    onProgress?.({ processed: end, total: defaultLimit });

    if (end < defaultLimit) {
      await pauseForMainThread();
    }
  }

  return result;
}

export async function createNestedUsers(
  users: User[],
  { chunkSize = DEFAULT_CHUNK_SIZE, onProgress }: BuildOptions = {},
): Promise<UserWithOrders[]> {
  const result = new Array<UserWithOrders>(users.length);

  for (let start = 0; start < users.length; start += chunkSize) {
    const end = Math.min(start + chunkSize, users.length);

    for (let index = start; index < end; index += 1) {
      const user = users[index];
      const mode = index % 4;
      let orders: UserWithOrders["orders"] = [];

      if (mode === 1) {
        orders = [{ id: `${user.id}-1`, status: "pending" }];
      } else if (mode === 2) {
        orders = [{ id: `${user.id}-1`, status: "delivered" }];
      } else if (mode === 3) {
        orders = [
          { id: `${user.id}-1`, status: "pending" },
          { id: `${user.id}-2`, status: "delivered" },
        ];
      }

      result[index] = {
        ...user,
        orders,
      };
    }

    onProgress?.({ processed: end, total: users.length });

    if (end < users.length) {
      await pauseForMainThread();
    }
  }

  return result;
}
