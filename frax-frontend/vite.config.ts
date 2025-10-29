// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Указываем порт для фронтенда
    proxy: {
      // Проксируем запросы /api на ваш бэкенд
      '/api': {
        target: 'http://localhost:8090', // Адрес нашего Go-сервиса
        changeOrigin: true, // Необходимо для виртуальных хостов
      },
    },
  },
})