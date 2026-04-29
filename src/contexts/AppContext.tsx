import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { tr, type Lang } from '../i18n/dict'

type Theme = 'light' | 'dark'

interface AppContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
  theme: Theme
  setTheme: (t: Theme) => void
  toggleLang: () => void
  toggleTheme: () => void
}

const Ctx = createContext<AppContextValue | null>(null)

const LS_LANG = 'dp:lang'
const LS_THEME = 'dp:theme'

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'zh'
    return (localStorage.getItem(LS_LANG) as Lang) || 'zh'
  })
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'
    const saved = localStorage.getItem(LS_THEME) as Theme | null
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    localStorage.setItem(LS_LANG, lang)
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en')
  }, [lang])

  useEffect(() => {
    localStorage.setItem(LS_THEME, theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const setLang = (l: Lang) => setLangState(l)
  const setTheme = (t: Theme) => setThemeState(t)
  const toggleLang = () => setLangState((l) => (l === 'zh' ? 'en' : 'zh'))
  const toggleTheme = () => setThemeState((t) => (t === 'light' ? 'dark' : 'light'))
  const t = (key: string) => tr(key, lang)

  return (
    <Ctx.Provider value={{ lang, setLang, t, theme, setTheme, toggleLang, toggleTheme }}>
      {children}
    </Ctx.Provider>
  )
}

export function useApp(): AppContextValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used within AppProvider')
  return v
}
