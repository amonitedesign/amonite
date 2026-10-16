import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Tier 1 — MINUTE: pure TS logic, node env, no WebGL/jsdom
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/lib/**/*.test.ts', 'src/store/**/*.test.ts'],
    setupFiles: ['tests/setup.unit.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/lib/**/*.ts', 'src/store/**/*.ts'],
      exclude: ['**/*.test.*', '**/__fixtures__/**'],
      // Enforced on main (test:coverage). Kept just under current levels
      // (91 stmts / 73 branch / 82 funcs) to catch regressions, not noise.
      thresholds: { statements: 85, branches: 70, functions: 80, lines: 85 },
    },
  },
});
