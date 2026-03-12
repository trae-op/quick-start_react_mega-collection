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
        className="rounded-lg border border-slate-200 bg-slate-50 p-3"
      >
        <p className="text-sm font-medium text-slate-900">{user.name}</p>
        <p className="text-xs text-slate-600">
          {user.city} • {user.age} yo • Dates:{" "}
          {user?.createdAt?.toLocaleDateString()} -{" "}
          {user?.updatedAt?.toLocaleDateString()}
        </p>
      </article>
    </div>
  );
}

function VirtualizedUserCards({ items }: VirtualizedUserCardsProps) {
  if (items.length === 0) {
    return (
      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        No users found.
      </div>
    );
  }

  return (
    <div className="mt-4 h-[350px] rounded-lg border border-slate-200 bg-white p-2">
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
