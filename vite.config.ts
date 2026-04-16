import { defineConfig } from 'vite'
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
  }
})
