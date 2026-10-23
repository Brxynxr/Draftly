import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet,
  ReceiptText,
  Sparkles,
  Target,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isMobileOpen: boolean
  onCloseMobile: () => void
}

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/accounts', label: 'Cuentas & Bolsillos', icon: Wallet, badge: '3 Activas' },
  { to: '/transactions', label: 'Transacciones', icon: ReceiptText },
  { to: '/copilot', label: 'Copilot Financiero', icon: Sparkles, badge: 'IA Flash' },
  { to: '/goals', label: 'Metas de Ahorro', icon: Target },
  { to: '/mobile-setup', label: 'Conectar Celular', icon: Smartphone, highlight: true },
]

export function Sidebar({ isMobileOpen, onCloseMobile }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navContent = (
    <div className="flex flex-col h-full bg-slate-900/95 border-r border-slate-800 text-slate-100 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
            <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                Draftly
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  MVP
                </span>
              </span>
              <span className="text-[11px] text-slate-400 mt-1">AI Personal Ledger</span>
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Desktop Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                  isActive
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60',
                  item.highlight && !isActive && 'border border-dashed border-slate-700/60'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-5 h-5 shrink-0 transition-transform group-hover:scale-110',
                      isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  />
                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between overflow-hidden">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            'text-[10px] px-1.5 py-0.5 rounded-md font-semibold tracking-wide',
                            isActive
                              ? 'bg-brand-500/20 text-brand-300'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2.5 py-1 rounded-md bg-slate-800 text-white text-xs whitespace-nowrap shadow-xl border border-slate-700 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Micro Status Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">MacroDroid Link</p>
              <p className="text-[10px] text-emerald-400 truncate">Telemetría Activa</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          'hidden md:block shrink-0 transition-all duration-300 ease-in-out sticky top-0 h-screen z-30',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {navContent}
      </aside>

      {/* Mobile Drawer (with Backdrop) */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  )
}
