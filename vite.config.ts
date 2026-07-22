import {defineConfig} from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  server: {
    port: 5173
  },
  test: {
    coverage: {
      provider: 'v8'
    },
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.netlify/**",
    ]
  }
});
