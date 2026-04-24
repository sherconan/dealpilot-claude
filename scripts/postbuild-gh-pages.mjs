// Post-build: 给 GitHub Pages 注入标准 SPA redirect，避免嵌套路由刷新 404
// 参考：github.com/rafgraph/spa-github-pages
import fs from 'node:fs'
import path from 'node:path'

const dist = 'dist'
const indexPath = path.join(dist, 'index.html')
let html = fs.readFileSync(indexPath, 'utf8')

// index.html 头部注入 decoder：发现 `?/real/path` query 时，replaceState 回真实路径
const decoder =
  "<script>(function(l){if(l.search[1]==='/'){var d=l.search.slice(1).split('&').map(function(s){return s.replace(/~and~/g,'&')}).join('?');window.history.replaceState(null,null,l.pathname.slice(0,-1)+d+l.hash)}}(window.location))</script>"

if (!html.includes('replace(/~and~/g')) {
  html = html.replace('<head>', '<head>' + decoder)
  fs.writeFileSync(indexPath, html)
}

// 生成 404.html redirector：把 `/<base>/foo/bar` 重写成 `/<base>/?/foo/bar`
// segmentsToKeep=1 对应 /dealpilot-claude/ 这一级 base
const redirector = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>Redirecting…</title><script>(function(){var segmentsToKeep=1;var l=window.location;l.replace(l.protocol+'//'+l.hostname+(l.port?':'+l.port:'')+l.pathname.split('/').slice(0,1+segmentsToKeep).join('/')+'/?/'+l.pathname.slice(1).split('/').slice(segmentsToKeep).join('/').replace(/&/g,'~and~')+(l.search?'&'+l.search.slice(1).replace(/&/g,'~and~'):'')+l.hash);})();</script></head><body></body></html>`
fs.writeFileSync(path.join(dist, '404.html'), redirector)

fs.writeFileSync(path.join(dist, '.nojekyll'), '')

console.log('✓ GH Pages SPA redirect + 404 ready')
