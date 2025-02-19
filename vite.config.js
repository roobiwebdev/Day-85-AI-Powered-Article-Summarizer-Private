import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
    "window.performance": "globalThis.performance",
  },
  optimizeDeps: {
    exclude: ["perf_hooks"],
  },
});
