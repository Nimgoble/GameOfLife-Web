import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: './setupTests.ts',
    environment: 'jsdom',
    threads: false,
  },
});