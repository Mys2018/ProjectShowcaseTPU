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
      ...(hasCerts && {
        https: {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath)
        }
      })
    }
  })()
})
