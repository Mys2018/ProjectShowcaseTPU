import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']]
      }
    }),
    tsconfigPaths(),
    svgr()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: (() => {
    const certDir = path.resolve(__dirname, 'certs')
    const keyPath = path.join(certDir, 'dev.key')
    const certPath = path.join(certDir, 'dev.crt')

    const hasCerts = fs.existsSync(keyPath) && fs.existsSync(certPath)

    return {
      host: true,
      proxy: {
        '/dev/api': {
          target: 'https://tpu.community.design',
          changeOrigin: true,
          cookieDomainRewrite: '',
          cookiePathRewrite: '/',
          configure: (proxy) => {
            proxy.on('proxyReq', (_proxyReq, req) => {
              if (req.url && (req.url.includes('/auth') || req.url.includes('/users/me'))) {
                console.log(`[ProxyReq] ${req.method} ${req.url} | Cookie: ${req.headers['cookie'] || '(none)'}`);
              }
            });
            proxy.on('proxyRes', (proxyRes, req) => {
              if (req.url && req.url.includes('/auth')) {
                console.log(`[ProxyRes] ${req.method} ${req.url} -> ${proxyRes.statusCode} | Set-Cookie:`, proxyRes.headers['set-cookie'] || '(none)');
              }
            });
          }
        }
      },
      ...(hasCerts && {
        https: {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath)
        }
      })
    }
  })()
})
