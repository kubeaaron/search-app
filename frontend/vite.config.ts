import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/search': {
        target: 'http://backend:8080', // your backend port
        changeOrigin: true,
        rewrite: path => path
      }
    }
  }
})

