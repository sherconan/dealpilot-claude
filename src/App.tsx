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
const DecisionPack = lazy(() => import('./pages/DecisionPack'))

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

function NotFound() {
  return (
    <div className="px-4 md:px-8 py-12 max-w-[700px] mx-auto text-center">
      <div className="bg-white border border-ink-200 rounded-2xl p-10">
        <div className="num text-[48px] font-semibold tracking-tight text-ink-300">404</div>
        <h1 className="text-[18px] font-semibold tracking-tight mt-2">页面未找到</h1>
        <p className="text-[13px] text-ink-600 mt-2">该路径不存在。返回 <a href="/" className="text-brand-700 underline">驾驶舱</a> 或按 <kbd className="bg-ink-100 border border-ink-200 px-1 rounded num text-[11px]">⌘ K</kbd> 唤起命令面板。</p>
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
        <Route path="/deal/:id/decision-pack" element={<Suspense fallback={<PageLoader />}><DecisionPack /></Suspense>} />
        <Route path="/unicorns" element={<Suspense fallback={<PageLoader />}><Unicorns /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
