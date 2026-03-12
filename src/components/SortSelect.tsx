import { memo } from "react";
import { sortList } from "../data/users";

export type SortField = "name" | "city" | "age" | "createdAt" | "updatedAt";

export const SortSelect = memo(
  ({
    onChange,
    field,
  }: {
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    field: SortField;
  }) => {
    return (
      <select
        value={field}
        onChange={onChange}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
      >
        {sortList.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  },
);
