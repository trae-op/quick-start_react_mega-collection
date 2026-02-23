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

const cities = ["Kyiv", "Lviv", "Odesa", "Kharkiv", "Dnipro"];

export const users: User[] = Array.from({ length: 1000 }, (_, index) => {
  const id = index + 1;
  const name = `${names[index % names.length]} ${id}`;
  const city = cities[index % cities.length];
  const age = 20 + (index % 26);

  return {
    id,
    name,
    city,
    age,
  };
});
