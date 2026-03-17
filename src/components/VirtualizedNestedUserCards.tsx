import { List, type RowComponentProps } from "react-window";
import { AutoSizer } from "react-virtualized-auto-sizer";
import { type UserWithOrders } from "../data/users";

const ROW_HEIGHT = 92;

type UserRowProps = {
  items: UserWithOrders[];
};

type VirtualizedNestedUserCardsProps = {
  items: UserWithOrders[];
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
          {user.city} • {user.age} yo
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Orders: {user.orders.map((order) => order.status).join(", ")}
        </p>
      </article>
    </div>
  );
}

function VirtualizedNestedUserCards({
  items,
}: VirtualizedNestedUserCardsProps) {
  if (items.length === 0) {
    return (
      <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm text-slate-400">
        No users found.
      </div>
    );
  }

  return (
    <div className="mt-4 h-[360px] rounded-lg border border-slate-700 bg-slate-950 p-2">
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
              rowProps={{ items: items }}
              overscanCount={1}
              style={{ height, width }}
            />
          );
        }}
      />
    </div>
  );
}

export default VirtualizedNestedUserCards;
