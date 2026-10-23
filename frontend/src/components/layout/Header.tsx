import { useEffect, useState } from 'react'
import { Menu, Plus, Activity, Bell } from 'lucide-react'

interface HeaderProps {
  onOpenMobile: () => void
  onQuickExpenseClick?: () => void
}

interface BackendHealth {
  status: string
  service: string
  version: string
  ai_engine: {
    provider: string
    model: string
  }
}

export function Header({ onOpenMobile, onQuickExpenseClick }: HeaderProps) {
  const [health, setHealth] = useState<BackendHealth | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)

  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then((data) => {
        setHealth(data)
        setIsConnecting(false)
      })
      .catch(() => {
        setIsConnecting(false)
      })
  }, [])

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile trigger & context info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-200">Espacio de Trabajo:</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            Personal (COP)
          </span>
        </div>
      </div>

      {/* Right: Actions, Live Health & User Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live Backend Connection Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              health ? 'bg-emerald-500 animate-pulse' : isConnecting ? 'bg-amber-500' : 'bg-rose-500'
            }`}
          />
          <Activity className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          <span className="text-slate-300 font-medium">
            {health ? (
              <span className="hidden sm:inline">
                API Activa <span className="text-slate-500">({health.ai_engine.provider})</span>
              </span>
            ) : isConnecting ? (
              'Conectando...'
            ) : (
              'Offline'
            )}
          </span>
        </div>

        {/* Quick Add Action Button */}
        <button
          onClick={onQuickExpenseClick}
          className="inline-flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-semibold px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-brand-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Nuevo Gasto</span>
        </button>

        {/* Notifications Icon (Mock) */}
        <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 absolute top-2 right-2" />
        </button>

        {/* User Pill / Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center shadow-sm">
            BM
          </div>
          <div className="hidden lg:block leading-none text-left">
            <p className="text-xs font-bold text-white">Breyner Manga</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Admin & Dev</p>
          </div>
        </div>
      </div>
    </header>
  )
}
