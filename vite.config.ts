// Configuración de Vite
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import type { UserConfig } from 'vite';
import type { InlineConfig } from 'vitest';

/// <reference types="vitest" />

export default defineConfig(({ mode }): UserConfig & { test: InlineConfig } => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './test/setup.ts',
      include: ['**/*.{test,spec}.{js,ts}']
    },
    define: {
      'process.env.SECRET_KEY': JSON.stringify(env.VITE_SECRET_KEY),
      'import.meta.env.VITE_SECRET_KEY': JSON.stringify(env.VITE_SECRET_KEY)
    },
    plugins: [vue()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      watch: {
        usePolling: true,  
        interval: 100,     
      },
      port: 5173,
      strictPort: true,
      host: true,          
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "sass:math";
            @import "vuetify/lib/styles/settings/_variables";
          `,
        },
      },
    },
  };
});
