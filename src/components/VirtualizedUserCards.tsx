import { List, type RowComponentProps } from "react-window";
import { AutoSizer } from "react-virtualized-auto-sizer";
import { defaultLimit, type User } from "../data/users";

const ROW_HEIGHT = 84;

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
          {user.city} • {user.age} years
        </p>
      </article>
    </div>
  );
}

function VirtualizedUserCards({
  items,
  limit = defaultLimit,
}: VirtualizedUserCardsProps) {
  const visibleItems = items.slice(0, limit);

  if (visibleItems.length === 0) {
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
              rowCount={visibleItems.length}
              rowHeight={ROW_HEIGHT}
              rowComponent={UserRow}
              rowProps={{ items: visibleItems }}
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
