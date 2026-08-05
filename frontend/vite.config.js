import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://your-backend-url.vercel.app', // Update after backend deploy
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://your-backend-url.vercel.app',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
});