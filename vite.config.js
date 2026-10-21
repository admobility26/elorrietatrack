import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {manifest:true,rollupOptions:{output:{onlyExplicitManualChunks:true,manualChunks(id){if(id.includes('/src/premium/')||id.includes('/node_modules/@capacitor'))return 'premium-workspace';}}}},
});
