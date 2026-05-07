// 项目个人笔记面板 — 按 dealId 自动保存到 localStorage
import { useDealNotes } from '../lib/dealNotes'

export default function NotePanel({ dealId }: { dealId: string }) {
  const { notes, setNotes, saving, lastSavedAt } = useDealNotes(dealId)

  function fmtSavedAt(ts: number | null) {
    if (!ts) return '还未保存'
    const elapsed = Math.round((Date.now() - ts) / 1000)
    if (elapsed < 60) return `${elapsed}s 前已保存`
    if (elapsed < 3600) return `${Math.round(elapsed / 60)}m 前已保存`
    return new Date(ts).toLocaleTimeString('zh-CN', { hour12: false })
  }

  return (
    <section className="bg-white border-2 border-amber-500/30 rounded-xl p-5 mb-5 no-print">
      <header className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-amber-700 font-medium">My Notes · 个人笔记</div>
          <h2 className="text-[15px] font-semibold tracking-tight mt-0.5">合伙人 / GP 自留笔记</h2>
          <p className="text-[11.5px] text-ink-500 mt-0.5">仅你浏览器可见 · 自动保存 · 不上传服务器 · 不进 Markdown 导出（隐私优先）</p>
        </div>
        <div className="text-[11px] text-ink-500 num">
          {saving ? <span className="text-amber-700">保存中…</span> : <span>{fmtSavedAt(lastSavedAt)}</span>}
          <span className="mx-2 text-ink-300">·</span>
          <span>{notes.length} 字</span>
        </div>
      </header>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={6}
        placeholder={'例：访谈反馈 / Reference check 记录 / 还没问到的问题 / IC 表决前关注点…'}
        className="w-full text-[13px] bg-ink-50 border border-ink-200 rounded-lg p-3 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/30"
      />
      <div className="mt-2 flex items-center justify-between text-[10.5px] text-ink-500">
        <span className="num">localStorage key: <code className="bg-ink-100 px-1 rounded">dp:notes:{dealId}</code></span>
        {notes.length > 0 && (
          <button
            onClick={() => {
              if (confirm('清空本项目笔记？无法恢复')) setNotes('')
            }}
            className="text-rose-700 hover:underline"
          >
            清空笔记
          </button>
        )}
      </div>
    </section>
  )
}
