import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isNgrok = !!env.NGROK_URL;

  return {
    plugins: [react()],
    server: {
      host: true,
      allowedHosts: ['.ngrok-free.dev'],   // important for ngrok
      hmr: isNgrok
        ? { clientPort: 443 }             // use 443 only when tunneling via ngrok
        : true,                           // default HMR for local dev
      proxy: {
        // All /api calls are forwarded to your local backend.
        // This means friends using the ngrok link also hit your backend
        // through the same tunnel — no second ngrok needed.
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        }
      }
    }
  }
})