import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const isNgrok = !!process.env.NGROK_URL;

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['.ngrok-free.dev'],   // important for ngrok
    hmr: isNgrok
      ? { clientPort: 443 }             // use 443 only when tunneling via ngrok
      : true,                           // default HMR for local dev
  }
})