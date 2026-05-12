import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    cssMinify: false,
  },
  // VITE_API_BASE_URL can be set in frontend/.env for production
  // e.g. VITE_API_BASE_URL=https://your-api.com/api
})
