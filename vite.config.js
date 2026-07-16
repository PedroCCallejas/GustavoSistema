import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
  ],
})
