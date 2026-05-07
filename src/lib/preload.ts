// 路由 lazy chunk 预加载 — 鼠标悬停 / 聚焦导航链接时触发 import()
// 让"点击 → 等待 chunk 下载"的 200ms 抖动消失

type Loader = () => Promise<unknown>

// 与 App.tsx 中 lazy() 调用 1:1 同步 — 任何新页面加进路由表时这里也要补一行
const PRELOADERS: Record<string, Loader> = {
  '/pipeline': () => import('../pages/Pipeline'),
  '/thesis': () => import('../pages/Thesis'),
  '/memory': () => import('../pages/Memory'),
  '/sources': () => import('../pages/Sources'),
  '/upload': () => import('../pages/Upload'),
  '/risk': () => import('../pages/Risk'),
  '/portfolio': () => import('../pages/Portfolio'),
  '/signals': () => import('../pages/Signals'),
  '/docs': () => import('../pages/Docs'),
  '/compare': () => import('../pages/Compare'),
  '/briefings': () => import('../pages/Briefings'),
  '/changelog': () => import('../pages/Changelog'),
  '/unicorns': () => import('../pages/Unicorns'),
}

// 已经预加载过的不重复触发（即使浏览器层有缓存，少一次 promise 创建总是好的）
const triggered = new Set<string>()

export function preloadRoute(path: string) {
  // /deal/:id 形态走 DealDetail
  let key = path
  if (path.startsWith('/deal/') && path.endsWith('/memo')) key = '__icmemo'
  else if (path.startsWith('/deal/') && path.endsWith('/brief')) key = '__dealbrief'
  else if (path.startsWith('/deal/')) key = '__dealdetail'

  if (triggered.has(key)) return
  triggered.add(key)

  if (key === '__dealdetail') { import('../pages/DealDetail'); return }
  if (key === '__icmemo') { import('../pages/ICMemo'); return }
  if (key === '__dealbrief') { import('../pages/DealBrief'); return }

  const loader = PRELOADERS[path]
  if (loader) loader()
}
