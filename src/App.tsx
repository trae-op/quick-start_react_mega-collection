import { AutoSizer } from "react-virtualized-auto-sizer";
import { List, type RowComponentProps } from "react-window";

type CardItem = {
  id: number;
  title: string;
  description: string;
  tag: string;
};

const cards: CardItem[] = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  title: `Card #${index + 1}`,
  description: `This is card item number ${index + 1} in a virtualized list using react-window.`,
  tag: index % 2 === 0 ? "Even" : "Odd",
}));

type RowData = {
  cards: CardItem[];
};

const Row = ({ index, style, cards }: RowComponentProps<RowData>) => {
  const item = cards[index];

  return (
    <div style={style} className="px-4 py-2">
      <article className="h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">
            {item.title}
          </h2>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
            {item.tag}
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-600">{item.description}</p>
        <p className="mt-3 text-xs font-medium text-slate-500">ID: {item.id}</p>
      </article>
    </div>
  );
};

function App() {
  return (
    <main className="h-screen bg-slate-50 p-4 md:p-6">
      <section className="mx-auto flex h-full w-full max-w-4xl flex-col gap-4">
        <header className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Virtualized 1000 Cards
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Built with Tailwind CSS, react-window, and
            react-virtualized-auto-sizer.
          </p>
        </header>

        <div className="min-h-0 flex-1 rounded-xl border border-slate-200 bg-slate-100/60">
          <AutoSizer
            renderProp={({ height, width }) => {
              if (!height || !width) {
                return null;
              }

              return (
                <List
                  rowCount={cards.length}
                  rowHeight={116}
                  rowComponent={Row}
                  rowProps={{ cards }}
                  overscanCount={8}
                  style={{ height, width }}
                />
              );
            }}
          />
        </div>
      </section>
    </main>
  );
}

export default App;
