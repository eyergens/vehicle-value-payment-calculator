import {defineConfig} from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0];
          }
        }
      }
    }
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
