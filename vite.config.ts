import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.',
  base: '',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html')
    }
  },
  server: {
    port: 5173,
    host: true,
  },
})