import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// O Tauri CLI define essa variavel de ambiente ao rodar o beforeBuildCommand.
// So existe PWA (instalar no celular) pro site publicado - o app desktop nao
// precisa e nao deve ter service worker, pra nao prender uma versao antiga
// em cache dentro do proprio instalador.
const isTauriBuild = !!process.env.TAURI_ENV_PLATFORM;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ...(isTauriBuild
      ? []
      : [
          VitePWA({
            registerType: 'autoUpdate',
            manifest: false,
            includeAssets: [
              'apple-touch-icon.png',
              'icon-192.png',
              'icon-512.png',
              'manifest.webmanifest',
            ],
            workbox: {
              navigateFallback: 'index.html',
            },
          }),
        ]),
  ],
})
