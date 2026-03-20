import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: [
      'ai-powered-conversational-form-builder-spf4.onrender.com',
      'localhost', // You can add localhost if you're testing locally as well
      // Add other allowed hosts here if necessary
    ],
  },
})
