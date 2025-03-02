import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Fix outdated optimize dependency issue
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["firebase/app", "firebase/auth"], // Ensure Vite optimizes these
  },
});
