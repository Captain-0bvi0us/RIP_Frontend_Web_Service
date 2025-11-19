import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
import react from '@vitejs/plugin-react'



export default defineConfig({
  base: '/RIP_Frontend_Web_Service/',
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'FRAX Calculator',
        short_name: 'FRAX',
        description: 'Сервис для оценки вероятности переломов',
        theme_color: '#E60023',
        background_color: '#FFFFFF',
        start_url: '.',
        display: 'standalone',
        icons: [
          { src: 'logo/logo32.png', type: 'image/png', sizes: '32x32' },
          { src: 'logo/logo192.png', type: 'image/png', sizes: '192x192', purpose: 'any maskable'  },
          { src: 'logo/logo512.png', type: 'image/png', sizes: '512x512', purpose: 'any maskable'  }
        ]
      }
    })

  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8090',
        changeOrigin: true,
      },
    },
  },
})