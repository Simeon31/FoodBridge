import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://127.0.0.1:7066', // Using IPv4 address to avoid DNS issues
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
