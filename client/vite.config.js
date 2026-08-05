import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// During `npm run dev`, the Vite dev server proxies API/upload requests to
// the Express server running on :5000 so the client can just call `/api/...`
// with no CORS setup needed, in dev or production.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
});
