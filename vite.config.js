import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Use an absolute path for deployment
  build: {
    outDir: 'dist',
  },
  plugins: [react()],
});
