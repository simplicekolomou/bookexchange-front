import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"
import * as path from "node:path";
import {viteStaticCopy} from "vite-plugin-static-copy";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
    tsconfigPaths(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/firebase-messaging-sw.js',
          dest: '.',
        },
      ],
    }),
  ],
  server: {
    proxy: {
      '/api': {  // Proxy tout ce qui commence par /api
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Enlève le /api
      }
    }
  },
  // Permet d'utiliser @ pour référencer le dossier src, à condition d'importer 'path' en haut du fichier
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  }
})
