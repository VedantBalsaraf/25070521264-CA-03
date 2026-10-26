import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@components': path.resolve(import.meta.dirname, './src/components'),
      '@pages': path.resolve(import.meta.dirname, './src/pages'),
      '@services': path.resolve(import.meta.dirname, './src/services'),
      '@context': path.resolve(import.meta.dirname, './src/context'),
      '@hooks': path.resolve(import.meta.dirname, './src/hooks'),
      '@utils': path.resolve(import.meta.dirname, './src/utils'),
      '@styles': path.resolve(import.meta.dirname, './src/styles'),
      '@assets': path.resolve(import.meta.dirname, './src/assets')
    }
  },
  server: {
    // Dedicated port (not 5173) so this project never collides with another
    // dev server. strictPort makes a clash fail loudly instead of silently
    // moving to a random port.
    port: 5180,
    strictPort: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5100',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('gsap')) {
              return 'motion';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor';
            }
            if (id.includes('lucide-react') || id.includes('recharts')) {
              return 'ui';
            }
            if (id.includes('date-fns') || id.includes('zod') || id.includes('axios')) {
              return 'utils';
            }
            return 'vendor';
          }
        }
      }
    }
  }
});
