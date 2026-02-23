import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@devisfuture/mega-collection/search": fileURLToPath(
        new URL("./src/mega/search.ts", import.meta.url),
      ),
      "@devisfuture/mega-collection/filter": fileURLToPath(
        new URL("./src/mega/filter.ts", import.meta.url),
      ),
      "@devisfuture/mega-collection/sort": fileURLToPath(
        new URL("./src/mega/sort.ts", import.meta.url),
      ),
    },
  },
});
