import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp"
    }
  },
  build: {
    assetsInlineLimit: 0
  },
  optimizeDeps: {
    exclude: ['@wasmer/sdk']
  }
});
