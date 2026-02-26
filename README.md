# Demonstration of the @devisfuture/mega-collection package with React

This project shows how to work with 100K+ item collections in React. It uses `@devisfuture/mega-collection` for data operations and `react-window`/`react-virtualized-auto-sizer` to render long lists without slowing down the UI.

## Architecture

### Data Manipulation: @devisfuture/mega-collection

The `@devisfuture/mega-collection` package provides three engines:

| Engine               | Purpose                        | Complexity                 | Use Case                          |
| -------------------- | ------------------------------ | -------------------------- | --------------------------------- |
| **TextSearchEngine** | Trigram-based full-text search | O(candidates)              | Finding items by name/description |
| **FilterEngine**     | Multi-criteria AND filtering   | O(k) indexed / O(n) linear | Narrowing results by attributes   |
| **SortEngine**       | Sorting                        | O(n) cached / O(n log n)   | Ordering results by fields        |

### UI Rendering: Virtualization Libraries

When rendering large collections, it helps to virtualize the list:

| Library                          | Purpose                             | Benefit                                                                                 |
| -------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------- |
| **react-window**                 | Efficiently renders large lists     | Only renders ~10-15 visible items instead of 100K+, reducing DOM nodes and memory usage |
| **react-virtualized-auto-sizer** | Dynamically measures container size | Automatically adjusts virtualized list dimensions as window resizes                     |

**Without virtualization:** Rendering 100K+ items = 100K+ DOM nodes = massive memory usage & slow interactions
**With virtualization:** Only ~20 DOM nodes visible at any time = smooth scrolling & instant interactions

## Project Structure

```
src/
  data/
    users.ts                    — 100K+ user dataset
  components/
    VirtualizedUserCards.tsx    — Virtualized list component (react-window)
    PageHeader.tsx              — Section headers
    ShowingCount.tsx            — Result counter
  routes/
    SearchPage.tsx              — Full-text search demo
    FilterPage.tsx              — Multi-criteria filtering demo
    SortPage.tsx                — Dynamic sorting demo
    MergePage.tsx               — Combined search + filter + sort demo
  App.tsx                        — Main app with router
  main.tsx                       — Entry point
```

## Route Components

### 1. SearchPage.tsx — Full-Text Search

**Engine:** `TextSearchEngine`

```tsx
const engine = new TextSearchEngine<User>({
  data: users,
  fields: ["city", "name"],
  minQueryLength: 2,
});
```

**Features:**

- Trigram-based search across name and city fields
- Minimum 2-character query requirement
- Real-time search results as user types
- Result count display
- Virtualized rendering of results

**Performance:**

- Search time: O(candidates) — typically <5ms for 100K items
- Supports instant-as-you-type UX with `useCallback`

### 2. FilterPage.tsx — Multi-Criteria Filtering

**Engine:** `FilterEngine`

```tsx
const engine = new FilterEngine<User>({
  data: users,
  fields: ["city", "age"],
  filterByPreviousResult: true,
});
```

**Features:**

- Filter by city and age simultaneously
- Sequential filtering: each filter operates on previous result
- Index-accelerated O(1) lookups
- Visual feedback with Tailwind styling
- `useDeferredValue` for non-blocking UI updates

**Performance:**

- Filter time: O(k) — where k is number of selected criteria
- Multiple filter combinations evaluated instantly

### 3. SortPage.tsx — Dynamic Sorting

**Engine:** `SortEngine`

```tsx
const engine = new SortEngine<User>({
  data: users,
  fields: ["age", "name", "city"],
});
```

**Features:**

- Single or multi-field sorting
- Ascending/descending directions
- Pre-computed sort indexes for cached O(n) performance
- Dropdown UI for field and direction selection
- `useDeferredValue` for smooth transitions

**Performance:**

- Cached single-field sort: O(n)
- Multi-field sort: O(n log n)
- Results ready before UI updates complete

### 4. MergePage.tsx — Combined Operations

**Engine:** `MergeEngines` (unified facade)

```tsx
const engine = new MergeEngines<User>({
  imports: [TextSearchEngine, SortEngine, FilterEngine],
  data: users,
  search: { fields: ["name", "city"], minQueryLength: 2 },
  filter: { fields: ["city", "age"], filterByPreviousResult: true },
  sort: { fields: ["age", "name", "city"] },
});
```

**Features:**

- Search, filter, and sort in a single interface
- All three operations work on the same shared dataset
- Compose operations: search → filter → sort
- Complex queries with minimal code

**Data Flow:**

```
User Input (search query)
    ↓
engine.search(query)           → searchResult
    ↓
engine.filter(searchResult)    → filtered
    ↓
engine.sort(filtered)          → final results
    ↓
VirtualizedUserCards           → Render ~20 items
```

## VirtualizedUserCards Component

**Location:** `src/components/VirtualizedUserCards.tsx`

This component shows how virtualization works:

```tsx
import { List } from "react-window";
import { AutoSizer } from "react-virtualized-auto-sizer";

function VirtualizedUserCards({ items, limit = defaultLimit }) {
  return (
    <div className="h-[350px]">
      <AutoSizer>
        {({ height, width }) => (
          <List
            rowCount={items.length}
            rowHeight={84} // 84px per user card
            overscanCount={1} // Render 1 extra row above/below viewport
            {...otherProps}
          />
        )}
      </AutoSizer>
    </div>
  );
}
```

**How it Works:**

1. **AutoSizer** measures the container (350px height, full width)
2. **List** (from react-window) calculates visible rows
3. Only items in viewport are rendered as DOM nodes
4. As user scrolls, rows are recycled/reused
5. `overscanCount={1}` renders 1 extra row for smooth scrolling

**Performance Impact:**

- Without virtualization: rendering 100K items creates 100K DOM nodes and uses a lot of memory
- With virtualization: only about 15 DOM nodes are in the DOM at any time
- Scrolling stays responsive

## React Patterns Used

### 1. useDeferredValue for Non-Blocking Updates

```tsx
const deferredCities = useDeferredValue(selectedCities);

const result = useMemo(() => {
  // Expensive operation happens in background
  return engine.filter([{ field: "city", values: deferredCities }]);
}, [deferredCities]);
```

- UI remains responsive while data operation completes
- Users see opacity fade instead of lag

### 2. useCallback to Prevent Search Engine Rebuilds

```tsx
const handleSearch = useCallback(
  (event: React.ChangeEvent<HTMLInputElement>) => {
    const trimmed = event.target.value.trim();
    setResult(trimmed ? engine.search(trimmed) : users);
  },
  [],
);
```

- Engine reference stays stable across renders
- Trigram index reused across multiple searches

### 3. useMemo for Expensive Operations

```tsx
const result = useMemo(
  () => engine.sort([{ field, direction }]),
  [field, direction],
);
```

- Sort computation only runs when dependencies change
- Results cached between renders

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## License

MIT
