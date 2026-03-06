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

export const users: User[] = Array.from(
  { length: defaultLimit },
  (_, index) => {
    const id = index + 1;
    const name = `${names[index % names.length]} ${id}`;
    const city = cities[index % cities.length];
    const age = ages[index % ages.length];

    return {
      id,
      name,
      city,
      age,
    };
  },
);

export const nestedUsers: UserWithOrders[] = users.map((user, index) => {
  // distribute order configurations:
  // 0 -> no orders
  // 1 -> single "pending"
  // 2 -> single "delivered"
  // 3 -> two orders, one of each status
  const mode = index % 4;
  // typed as the same shape as the `orders` property on the user type
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

  return {
    ...user,
    orders,
  };
});
