import { defaultLimit } from "../data/users";

interface ShowingCountProps {
  count: number;
  itemName: string;
  totalCount?: number;
}

const ShowingCount = ({
  count,
  itemName,
  totalCount = defaultLimit,
}: ShowingCountProps) => {
  return (
    <p className="mt-3 text-xs text-slate-400">
      Showing {count.toLocaleString()} of {totalCount.toLocaleString()}{" "}
      {itemName}
    </p>
  );
};

export default ShowingCount;
