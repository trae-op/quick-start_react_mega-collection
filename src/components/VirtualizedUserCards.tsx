import { List, type RowComponentProps } from "react-window";
import { AutoSizer } from "react-virtualized-auto-sizer";
import { type User } from "../data/users";

const ROW_HEIGHT = 73;

type UserRowProps = {
  items: User[];
};

type VirtualizedUserCardsProps = {
  items: User[];
  limit?: number;
};

function UserRow({
  ariaAttributes,
  index,
  style,
  items,
}: RowComponentProps<UserRowProps>) {
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
        <p className="text-sm font-medium text-slate-100">{user.name}</p>
        <p className="text-xs text-slate-400">
          {user.city} • {user.age} yo •{" "}
          {user.createdAt !== undefined && user.updatedAt !== undefined
            ? `created at: ${user.createdAt.toLocaleDateString()} - updated at: ${user.updatedAt.toLocaleDateString()}`
            : "N/A"}
        </p>
      </article>
    </div>
  );
}

function VirtualizedUserCards({ items }: VirtualizedUserCardsProps) {
  if (items.length === 0) {
    return (
      <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm text-slate-400">
        No users found.
      </div>
    );
  }

  return (
    <div className="mt-4 h-[350px] rounded-lg border border-slate-700 bg-slate-950 p-2">
      <AutoSizer
        renderProp={({ height, width }) => {
          if (!height || !width) {
            return null;
          }

          return (
            <List
              rowCount={items.length}
              rowHeight={ROW_HEIGHT}
              rowComponent={UserRow}
              rowProps={{ items }}
              overscanCount={1}
              style={{ height, width }}
            />
          );
        }}
      />
    </div>
  );
}

export default VirtualizedUserCards;
