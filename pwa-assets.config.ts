import {
    defineConfig,
    minimal2023Preset as preset,
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
    headLinkOptions: {
        preset: '2023',
    },
    preset,
    images: ['public/favicon.svg'],
    // images: ['public/favicon.ico', 'public/apple-touch-icon.png', 'public/pwa-192x192.png', 'public/pwa-512x512.png'],
})
