import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Tier 2 — PRIMARY: components + routes across the app, jsdom
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    globals: true,
    css: false,
    environment: 'jsdom',
    include: ['src/components/**/*.test.tsx', 'src/app/**/*.test.tsx'],
    setupFiles: ['tests/setup.app.ts'],
  },
});
