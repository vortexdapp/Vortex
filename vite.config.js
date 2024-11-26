import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // Use relative paths
  build: {
    outDir: 'dist',
  },
  plugins: [react()],
});

