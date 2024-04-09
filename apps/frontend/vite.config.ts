import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { fileURLToPath, URL } from 'node:url';
// import devtools from 'solid-devtools/vite';
import { version } from './package.json';

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __APP_BUILD_VERSION__: JSON.stringify(version),
    __APP_BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
  },
});
