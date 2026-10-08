import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/product_details/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
  build: {
    rollupOptions: {
      input: {
        web: resolve(__dirname, 'index.html'),
        mcp: resolve(__dirname, 'mcp.html'),
      },
    },
  },
});
