export type User = {
  id: number;
  name: string;
  city: string;
  age: number;
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
