import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'GOL_',
  plugins: [react()],
  server: {
    port: 3000
  },
  define: {
    'process.env': {}
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    include: ['src/__tests__/**/*.test.tsx', 'src/__tests__/**/*.test.ts'],
  }
})
