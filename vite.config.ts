import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import typescript from '@rollup/plugin-typescript';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [typescript(), react(), VitePWA({
    registerType: 'prompt',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'P2P Chat',
      short_name: 'P2P Chat',
      description: 'Peer to peer chat using WebRTC & decentralised sync',
      theme_color: '#fafafa',
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
