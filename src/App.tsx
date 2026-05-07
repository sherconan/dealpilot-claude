import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'

// 懒加载次级页面 — 首屏只下载 Dashboard，其它页路由切换时按需获取
const Pipeline = lazy(() => import('./pages/Pipeline'))
const DealDetail = lazy(() => import('./pages/DealDetail'))
const ICMemo = lazy(() => import('./pages/ICMemo'))
const Memory = lazy(() => import('./pages/Memory'))
const Thesis = lazy(() => import('./pages/Thesis'))
const Sources = lazy(() => import('./pages/Sources'))
const Upload = lazy(() => import('./pages/Upload'))
const Risk = lazy(() => import('./pages/Risk'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const Signals = lazy(() => import('./pages/Signals'))
const Docs = lazy(() => import('./pages/Docs'))
const Compare = lazy(() => import('./pages/Compare'))
const Briefings = lazy(() => import('./pages/Briefings'))
const Changelog = lazy(() => import('./pages/Changelog'))
const DealBrief = lazy(() => import('./pages/DealBrief'))
const Unicorns = lazy(() => import('./pages/Unicorns'))

function PageLoader() {
  return (
    <div className="px-8 py-12 max-w-[1400px] mx-auto">
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-1/3 bg-ink-100 rounded" />
        <div className="h-4 w-2/3 bg-ink-100 rounded" />
        <div className="h-32 bg-ink-100 rounded mt-6" />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/pipeline" element={<Suspense fallback={<PageLoader />}><Pipeline /></Suspense>} />
        <Route path="/thesis" element={<Suspense fallback={<PageLoader />}><Thesis /></Suspense>} />
        <Route path="/memory" element={<Suspense fallback={<PageLoader />}><Memory /></Suspense>} />
        <Route path="/sources" element={<Suspense fallback={<PageLoader />}><Sources /></Suspense>} />
        <Route path="/upload" element={<Suspense fallback={<PageLoader />}><Upload /></Suspense>} />
        <Route path="/risk" element={<Suspense fallback={<PageLoader />}><Risk /></Suspense>} />
        <Route path="/portfolio" element={<Suspense fallback={<PageLoader />}><Portfolio /></Suspense>} />
        <Route path="/signals" element={<Suspense fallback={<PageLoader />}><Signals /></Suspense>} />
        <Route path="/docs" element={<Suspense fallback={<PageLoader />}><Docs /></Suspense>} />
        <Route path="/compare" element={<Suspense fallback={<PageLoader />}><Compare /></Suspense>} />
        <Route path="/briefings" element={<Suspense fallback={<PageLoader />}><Briefings /></Suspense>} />
        <Route path="/changelog" element={<Suspense fallback={<PageLoader />}><Changelog /></Suspense>} />
        <Route path="/deal/:id" element={<Suspense fallback={<PageLoader />}><DealDetail /></Suspense>} />
        <Route path="/deal/:id/memo" element={<Suspense fallback={<PageLoader />}><ICMemo /></Suspense>} />
        <Route path="/deal/:id/brief" element={<Suspense fallback={<PageLoader />}><DealBrief /></Suspense>} />
        <Route path="/unicorns" element={<Suspense fallback={<PageLoader />}><Unicorns /></Suspense>} />
      </Route>
    </Routes>
  )
}
