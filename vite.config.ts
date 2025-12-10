import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  assetsInclude: ["**/*.png", "**/*.json"],
  server: {
    port: 1818,
    host: true,
    open: true
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: '미루기 방지 앱',
        short_name: '미루기방지',
        description: '할 일을 미루지 않고 완료하도록 도와주는 앱',
        theme_color: '#2196f3',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/icon-20.png',
            sizes: '20x20',
            type: 'image/png'
          },
          {
            src: '/icon-29.png',
            sizes: '29x29',
            type: 'image/png'
          },
          {
            src: '/icon-40.png',
            sizes: '40x40',
            type: 'image/png'
          },
          {
            src: '/icon-58.png',
            sizes: '58x58',
            type: 'image/png'
          },
          {
            src: '/icon-60.png',
            sizes: '60x60',
            type: 'image/png'
          },
          {
            src: '/icon-76.png',
            sizes: '76x76',
            type: 'image/png'
          },
          {
            src: '/icon-80.png',
            sizes: '80x80',
            type: 'image/png'
          },
          {
            src: '/icon-87.png',
            sizes: '87x87',
            type: 'image/png'
          },
          {
            src: '/icon-120.png',
            sizes: '120x120',
            type: 'image/png'
          },
          {
            src: '/icon-152.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: '/icon-167.png',
            sizes: '167x167',
            type: 'image/png'
          },
          {
            src: '/icon-180.png',
            sizes: '180x180',
            type: 'image/png'
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1년
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // node_modules의 패키지를 별도 청크로 분리
          if (id.includes('node_modules')) {
            // React 관련 라이브러리
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // 차트 라이브러리
            if (id.includes('recharts')) {
              return 'charts';
            }
            // 나머지 node_modules는 vendor로
            return 'vendor';
          }
        }
      }
    },
    // 청크 크기 경고 임계값 조정 (500KB -> 600KB)
    chunkSizeWarningLimit: 600
  }
})

