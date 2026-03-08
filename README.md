# quick-start_react_mega-collection

This app is a simple React demo for `@devisfuture/mega-collection`.

It shows how to work with a large list of users, around 100,000 items, without making the page feel frozen.

A live version is here: [demo](https://trae-op.github.io/quick-start_react_mega-collection/)

## What this app does

The app has a few pages.

- `Search` searches users by text.
- `Search Nested` searches normal fields and nested order fields.
- `Filter` filters users by city and age.
- `Filter Nested` filters users by city, age, and nested order status.
- `Sort` sorts users by name, city, or age.
- `Merge` combines search, filter, and sort.
- `Merge Nested` does the same, but also works with nested order data.

All pages use the same big demo data.

## What it uses

This project uses a few small tools together:

- `React` for the UI.
- `Vite` to run and build the app.
- `TypeScript` for types.
- `react-router-dom` for page routing.
- `Tailwind CSS` for styles.
- `@devisfuture/mega-collection` for search, filter, sort, and merge logic.
- `react-window` to render only visible list items.
- `react-virtualized-auto-sizer` to measure list size automatically.

## Why the app loads data in the background

Creating 100,000 records and building all search and filter modules can take time.

If all of that runs right away during import, the first page load feels slow.

So this app does it in the background:

1. The app opens quickly.
2. A spinner is shown.
3. Navigation is locked while data is loading.
4. The big user list is created step by step.
5. Search, filter, sort, and merge modules are created one time.
6. When everything is ready, navigation becomes active.

## How loading works

The app has one shared loader for all demo pages.

- Data is created asynchronously.
- The data is built in small chunks, not all at once.
- Ready objects are saved in shared `Map` objects.
- The initialization runs only one time.
- Every route reads ready modules from the shared state.

This means the app does not rebuild the same large data again and again when you open different pages.

## Engines from `@devisfuture/mega-collection`

The demo shows these engines:

- `TextSearchEngine` for text search.
- `FilterEngine` for filtering by selected values.
- `SortEngine` for sorting data.
- `MergeEngines` for chaining search, filter, and sort together.

The nested pages also work with `orders.status`.

## Why virtualization is used

Even if the data work is fast, showing 100,000 cards in the browser is still too much.

So the app uses virtualization.

That means:

- the full array stays in memory
- but only a small part of the list is rendered on screen
- scrolling stays smooth
- the DOM stays small

## Project structure

```text
src/
  components/      reusable UI parts
  data/            demo data builders
  modules/         shared async initialization and module storage
  routes/          demo pages
  App.tsx          main app layout and loading flow
  main.tsx         app entry
```

## Important files

- `src/App.tsx` starts the one-time app initialization, shows the spinner, and locks navigation until the data is ready.
- `src/modules/demo-modules.tsx` builds all shared datasets and engine objects, stores them in `Map`, and shares them through React context.
- `src/data/users.ts` creates the large demo datasets in async chunks.
- `src/routes/*` reads ready modules from the shared state and uses them on each page.

## How each page works

### Search pages

These pages use `TextSearchEngine`.

You type text, and the app finds matching users.

The nested search page can also search inside `orders.status`.

### Filter pages

These pages use `FilterEngine`.

You click buttons for city, age, or order status, and the list updates.

### Sort page

This page uses `SortEngine`.

You choose a field and a direction, and the list is sorted.

### Merge pages

These pages use `MergeEngines`.

They let you search, filter, and sort in one place.

## Running the project

Install packages:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build the app:

```bash
npm run build
```
