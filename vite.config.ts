import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import typescript from '@rollup/plugin-typescript';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [typescript(), react(), VitePWA({
    registerType: 'prompt',
    injectRegister: 'inline',

    pwaAssets: {
      disabled: false,
      config: true,
    },

    // includeAssets: ['public/favicon.ico', 'public/apple-touch-icon.png', 'public/pwa-192x192.png', 'public/pwa-512x512.png'],
    manifest: {
      name: 'P2P Chat',
      short_name: 'P2P Chat',
      description: 'Peer to peer chat using WebRTC & decentralised sync',
      theme_color: '#fafafa',
      // icons: [
      //   {
      //     src: 'pwa-192x192.png',
      //     sizes: '192x192',
      //     type: 'image/png'
      //   },
      //   {
      //     src: 'pwa-512x512.png',
      //     sizes: '512x512',
      //     type: 'image/png'
      //   },
      //   {
      //     src: 'pwa-512x512.png',
      //     sizes: '512x512',
      //     type: 'image/png',
      //     purpose: 'any'
      //   },
      //   {
      //     src: 'pwa-512x512.png',
      //     sizes: '512x512',
      //     type: 'image/png',
      //     purpose: 'maskable'
      //   }
      // ]
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
});
