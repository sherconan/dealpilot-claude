import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Pipeline from './pages/Pipeline'
import DealDetail from './pages/DealDetail'
import ICMemo from './pages/ICMemo'
import Memory from './pages/Memory'
import Thesis from './pages/Thesis'
import Sources from './pages/Sources'
import Upload from './pages/Upload'
import Risk from './pages/Risk'
import Portfolio from './pages/Portfolio'
import Signals from './pages/Signals'
import Docs from './pages/Docs'
import Compare from './pages/Compare'
import Briefings from './pages/Briefings'
import Changelog from './pages/Changelog'
import DealBrief from './pages/DealBrief'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/thesis" element={<Thesis />} />
        <Route path="/memory" element={<Memory />} />
        <Route path="/sources" element={<Sources />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/risk" element={<Risk />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/signals" element={<Signals />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/briefings" element={<Briefings />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/deal/:id" element={<DealDetail />} />
        <Route path="/deal/:id/memo" element={<ICMemo />} />
        <Route path="/deal/:id/brief" element={<DealBrief />} />
      </Route>
    </Routes>
  )
}
