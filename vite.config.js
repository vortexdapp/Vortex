import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // Ensures all paths are relative
  build: {
    outDir: 'dist', // Output directory
  },
  plugins: [react()],
});
