import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // This fixes the path issue
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist'
  }
})
