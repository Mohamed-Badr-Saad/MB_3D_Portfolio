import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // three.js lives in the lazily loaded Stage chunk (~280 kB gzipped); the page itself paints without it.
    chunkSizeWarningLimit: 1100,
  },
});
