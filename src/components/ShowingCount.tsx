import React from "react";
import { defaultLimit, users } from "../data/users";

interface ShowingCountProps {
  count: number;
  itemName: string;
}

const ShowingCount: React.FC<ShowingCountProps> = ({ count, itemName }) => {
  return (
    <p className="mt-3 text-xs text-slate-500">
      Showing {Math.min(count, defaultLimit)} of {users.length} {itemName}
    </p>
  );
};

export default ShowingCount;
