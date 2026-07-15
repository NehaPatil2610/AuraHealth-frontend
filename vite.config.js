import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: 'localhost',
    port: 5174,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8060',
        changeOrigin: true,
        secure: false,
        timeout: 15_000,
        proxyTimeout: 15_000,
      },
      // Spring Security OAuth2 login start + callback. These live at the
      // backend root (NOT under /api), so they need their own proxy entries
      // for the full-page redirect flow to reach the backend in dev.
      '/oauth2': {
        target: 'http://localhost:8060',
        changeOrigin: true,
        secure: false,
      },
      '/login/oauth2': {
        target: 'http://localhost:8060',
        changeOrigin: true,
        secure: false,
      },
    }
  }
})
