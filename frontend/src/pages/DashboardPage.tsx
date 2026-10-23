import { useState } from 'react'
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  Send,
  Zap,
} from 'lucide-react'

export function DashboardPage() {
  const [inputExpense, setInputExpense] = useState('')
  const [mockTransactions, setMockTransactions] = useState([
    {
      id: '1',
      title: 'Uber a la Universidad',
      amount: -15000,
      bank: 'Nequi',
      time: 'Hace 12 min',
      category: 'Transporte',
      status: 'CONFIRMED',
    },
    {
      id: '2',
      title: 'Almuerzo Restaurante',
      amount: -28000,
      bank: 'Bancolombia',
      time: 'Hace 45 min',
      category: 'Gastos Generales',
      status: 'AUTO_RESOLVED',
    },
    {
      id: '3',
      title: 'Pago Nómina / Freelance',
      amount: 1850000,
      bank: 'Nu',
      time: 'Hoy 09:30 AM',
      category: 'Ingresos',
      status: 'CONFIRMED',
    },
  ])

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
    <div className="space-y-8">
      {/* Quick Input Spotlight */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Registro Rápido con IA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ¿Qué movimiento realizaste hoy?
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Escribe en lenguaje natural o deja que MacroDroid capture tus compras de Bancolombia, Nequi y Nu en segundo plano.
          </p>

          <form onSubmit={handleSimulateExpense} className="mt-6 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={inputExpense}
              onChange={(e) => setInputExpense(e.target.value)}
              placeholder="Ej: Hoy me gasté 100mil en ir a la u o pagué 15k de almuerzo..."
              className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-slate-950 font-semibold px-5 py-3 rounded-xl text-sm transition-all shadow-lg shadow-brand-500/20 active:scale-95"
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
        <div className="rounded-2xl p-5 bg-[#20002c]/40 border border-purple-900/40 relative overflow-hidden group hover:border-purple-600/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-900/50 text-purple-300 border border-purple-700/50">
              Nequi
            </span>
            <Smartphone className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-4">
            <span className="text-xs text-slate-400">Disponible</span>
            <p className="text-2xl font-bold text-white mt-1">
              $ 485,000 <span className="text-xs font-normal text-slate-400">COP</span>
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-purple-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>MacroDroid Webhook Conectado</span>
          </div>
        </div>

        {/* Bancolombia Card */}
        <div className="rounded-2xl p-5 bg-yellow-950/20 border border-yellow-700/30 relative overflow-hidden group hover:border-yellow-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-yellow-900/50 text-yellow-300 border border-yellow-600/40">
              Bancolombia
            </span>
            <CreditCard className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="mt-4">
            <span className="text-xs text-slate-400">Cuenta Ahorros *6331</span>
            <p className="text-2xl font-bold text-white mt-1">
              $ 1,840,000 <span className="text-xs font-normal text-slate-400">COP</span>
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-yellow-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Balance determinista verificado</span>
          </div>
        </div>

        {/* Nu Card */}
        <div className="rounded-2xl p-5 bg-[#820ad1]/15 border border-[#820ad1]/40 relative overflow-hidden group hover:border-[#820ad1]/70 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#820ad1]/40 text-purple-200 border border-[#820ad1]/60">
              Nu Colombia
            </span>
            <Wallet className="w-4 h-4 text-purple-300" />
          </div>
          <div className="mt-4">
            <span className="text-xs text-slate-400">Cuenta Nu + Cajita</span>
            <p className="text-2xl font-bold text-white mt-1">
              $ 920,000 <span className="text-xs font-normal text-slate-400">COP</span>
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-purple-300">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>13% E.A. Rendimientos</span>
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
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}
                >
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
                  {tx.amount > 0 ? '+' : ''}
                  {tx.amount.toLocaleString('es-CO')} COP
                </p>
                <span
                  className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                    tx.status === 'CONFIRMED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : tx.status === 'PENDING_REVIEW'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {tx.status === 'CONFIRMED'
                    ? 'Confirmado'
                    : tx.status === 'PENDING_REVIEW'
                    ? 'Por Clasificar'
                    : 'Auto 30m'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
