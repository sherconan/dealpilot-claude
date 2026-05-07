import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base 用环境变量控制：GitHub Pages 走 /dealpilot-claude/，Vercel / 本地走 /
const base = process.env.DEPLOY_TARGET === 'gh-pages' ? '/dealpilot-claude/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
  server: { port: 3005, host: true, strictPort: true },
  build: {
    chunkSizeWarningLimit: 1500, // pdfjs worker 超 500KB 是必须的，不警告
    rollupOptions: {
      output: {
        manualChunks: {
          // React 生态独立 chunk — 利用浏览器缓存
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // PDF 解析单独成包，仅在 Upload 页加载
          'pdfjs-vendor': ['pdfjs-dist'],
        },
      },
    },
  },
})
