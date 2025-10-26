// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Works locally AND on AWS Cloud9/EC2
export default defineConfig({
  plugins: [react()],
  base: '/',                 // serve assets from site root
  server: {
    host: true,              // allow external access (Cloud9/EC2)
    port: 8080,              // Cloud9-friendly port
  },
  preview: {
    host: true,
    port: 8080,
  },
});
