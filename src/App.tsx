import { useMemo, useState } from "react";
import { TextSearchEngine } from "@devisfuture/mega-collection/search";
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

const engine = new TextSearchEngine<CardItem>();
engine.buildIndex(cards, "title");
engine.buildIndex(cards, "description");

function App() {
  const [query, setQuery] = useState("");

  const filteredCards = useMemo(() => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return cards;
    }

    const titleMatches = engine.search("title", normalizedQuery);
    const descriptionMatches = engine.search("description", normalizedQuery);

    const matchedIds = new Set(
      [...titleMatches, ...descriptionMatches].map((item) => item.id),
    );

    return cards.filter((item) => matchedIds.has(item.id));
  }, [query]);

  return (
    <main className="h-screen bg-slate-50 p-4 md:p-6">
      <section className="mx-auto flex h-full w-full max-w-4xl flex-col gap-4">
        <header className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Virtualized 1000 Cards + TextSearchEngine
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Search cards by title or description with
            @devisfuture/mega-collection TextSearchEngine.
          </p>

          <form
            className="mt-4 flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="card-search" className="sr-only">
              Search cards
            </label>
            <input
              id="card-search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title or description..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-slate-300 placeholder:text-slate-400 focus:ring-2"
            />
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear
            </button>
          </form>

          <p className="mt-2 text-xs text-slate-500">
            Showing {filteredCards.length} of {cards.length} cards
          </p>
        </header>

        <div className="min-h-0 flex-1 rounded-xl border border-slate-200 bg-slate-100/60">
          {filteredCards.length === 0 ? (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-500">
              No cards found for “{query.trim()}”
            </div>
          ) : (
            <AutoSizer
              renderProp={({ height, width }) => {
                if (!height || !width) {
                  return null;
                }

                return (
                  <List
                    rowCount={filteredCards.length}
                    rowHeight={116}
                    rowComponent={Row}
                    rowProps={{ cards: filteredCards }}
                    overscanCount={8}
                    style={{ height, width }}
                  />
                );
              }}
            />
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
