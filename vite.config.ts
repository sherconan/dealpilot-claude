import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base 用环境变量控制：GitHub Pages 走 /dealpilot-claude/，Vercel / 本地走 /
const base = process.env.DEPLOY_TARGET === 'gh-pages' ? '/dealpilot-claude/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
  server: { port: 3005, host: true, strictPort: true },
})
