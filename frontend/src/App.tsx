import { useState, useEffect } from 'react'
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Smartphone, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  CreditCard,
  Send
} from 'lucide-react'

interface BackendHealth {
  status: string
  service: string
  version: string
  ai_engine: {
    provider: string
    model: string
  }
}

export function App() {
  const [health, setHealth] = useState<BackendHealth | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)
  const [inputExpense, setInputExpense] = useState('')
  const [mockTransactions, setMockTransactions] = useState([
    { id: '1', title: 'Uber a la Universidad', amount: -15000, bank: 'Nequi', time: 'Hace 12 min', category: 'Transporte', status: 'CONFIRMED' },
    { id: '2', title: 'Almuerzo Gourmet', amount: -28000, bank: 'Bancolombia', time: 'Hace 45 min', category: 'Gastos Generales', status: 'AUTO_RESOLVED' },
    { id: '3', title: 'Pago Freelance Proyecto', amount: 850000, bank: 'Nu', time: 'Hoy 09:30 AM', category: 'Ingresos', status: 'CONFIRMED' },
  ])

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

  const handleSimulateExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputExpense.trim()) return

    const newTx = {
      id: Date.now().toString(),
      title: inputExpense,
      amount: -35000,
      bank: 'Nequi',
      time: 'Justo ahora',
      category: 'Procesado con IA',
      status: 'PENDING_REVIEW',
    }

    setMockTransactions([newTx, ...mockTransactions])
    setInputExpense('')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Draftly
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  AI Finance
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <span className={`w-2 h-2 rounded-full ${health ? 'bg-emerald-500 animate-pulse' : isConnecting ? 'bg-amber-500' : 'bg-rose-500'}`} />
              <span className="text-slate-400">
                Backend API: {health ? `${health.service} (${health.ai_engine.provider})` : isConnecting ? 'Conectando...' : 'Sin conexión local'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-brand-400">
              B&D
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Hero Quick Input Spotlight */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-900/40 border border-slate-800/80 p-6 sm:p-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Control de finanzas sin registro manual.
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-400">
              Dile a Draftly lo que gastaste o deja que MacroDroid capture tus compras de Bancolombia, Nequi y Nu en segundo plano.
            </p>

            <form onSubmit={handleSimulateExpense} className="mt-6 flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputExpense}
                  onChange={(e) => setInputExpense(e.target.value)}
                  placeholder="Ej: Hoy me gasté 100mil en ir a la u o pagué 15k de café con Nequi..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-slate-950 font-semibold px-5 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-brand-500/20 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Registrar</span>
              </button>
            </form>
          </div>
        </section>

        {/* 3 Bank Pocket Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Nequi Card */}
          <div className="rounded-xl p-5 bg-[#20002c]/40 border border-purple-900/40 relative overflow-hidden group hover:border-purple-600/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-900/50 text-purple-300 border border-purple-700/50">
                Nequi
              </span>
              <Smartphone className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-4">
              <span className="text-xs text-slate-400">Disponible</span>
              <p className="text-2xl font-bold text-white mt-1">$ 485,000 <span className="text-xs font-normal text-slate-400">COP</span></p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-purple-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>MacroDroid Webhook Conectado</span>
            </div>
          </div>

          {/* Bancolombia Card */}
          <div className="rounded-xl p-5 bg-yellow-950/20 border border-yellow-700/30 relative overflow-hidden group hover:border-yellow-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-yellow-900/50 text-yellow-300 border border-yellow-600/40">
                Bancolombia
              </span>
              <CreditCard className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="mt-4">
              <span className="text-xs text-slate-400">Cuenta Ahorros *6331</span>
              <p className="text-2xl font-bold text-white mt-1">$ 1,840,000 <span className="text-xs font-normal text-slate-400">COP</span></p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-yellow-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Balance verificado determinista</span>
            </div>
          </div>

          {/* Nu Card */}
          <div className="rounded-xl p-5 bg-[#820ad1]/15 border border-[#820ad1]/40 relative overflow-hidden group hover:border-[#820ad1]/70 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#820ad1]/40 text-purple-200 border border-[#820ad1]/60">
                Nu Colombia
              </span>
              <Wallet className="w-4 h-4 text-purple-300" />
            </div>
            <div className="mt-4">
              <span className="text-xs text-slate-400">Cuenta Nu + Cajita</span>
              <p className="text-2xl font-bold text-white mt-1">$ 920,000 <span className="text-xs font-normal text-slate-400">COP</span></p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-purple-300">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              <span>13% E.A. Rendimientos activos</span>
            </div>
          </div>
        </div>

        {/* Live Transaction Feed with Status */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Últimos Movimientos</h2>
              <p className="text-xs text-slate-400">Bandeja de transacciones con ciclo de revisión de 30 minutos.</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              {mockTransactions.length} movimientos
            </span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {mockTransactions.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {tx.amount > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{tx.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span>{tx.bank}</span>
                      <span>•</span>
                      <span>{tx.time}</span>
                      <span>•</span>
                      <span className="text-slate-300">{tx.category}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-slate-100'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('es-CO')} COP
                  </p>
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                    tx.status === 'CONFIRMED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : tx.status === 'PENDING_REVIEW'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {tx.status === 'CONFIRMED' ? 'Confirmado' : tx.status === 'PENDING_REVIEW' ? 'Por Clasificar' : 'Auto 30m'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Draftly &copy; 2026 — Diseñado con ❤️ para Breyner & Daniel. React 19 + FastAPI + Gemini AI.
      </footer>
    </div>
  )
}

export default App
