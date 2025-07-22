import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env,
  },
  build: {
    rollupOptions: {
      external: ['@google/generative-ai'] // Add this
    }
  }
});
