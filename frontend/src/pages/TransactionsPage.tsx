import { useState } from 'react'
import { Search, Filter, ArrowDownLeft, ArrowUpRight } from 'lucide-react'

export function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('ALL')

  const transactions = [
    { id: '1', title: 'Uber a la Universidad', amount: -15000, bank: 'Nequi', date: '23 Oct 2026, 11:20 AM', category: 'Transporte', status: 'CONFIRMED', type: 'EXPENSE' },
    { id: '2', title: 'Almuerzo Restaurante', amount: -28000, bank: 'Bancolombia', date: '23 Oct 2026, 01:15 PM', category: 'Gastos Generales', status: 'AUTO_RESOLVED', type: 'EXPENSE' },
    { id: '3', title: 'Pago Nómina / Freelance', amount: 1850000, bank: 'Nu', date: '23 Oct 2026, 09:30 AM', category: 'Ingresos', status: 'CONFIRMED', type: 'INCOME' },
    { id: '4', title: 'Retiro en Cajero Éxito', amount: -100000, bank: 'Bancolombia', date: '22 Oct 2026, 05:40 PM', category: 'Efectivo', status: 'CONFIRMED', type: 'INTERNAL_TRANSFER' },
  ]

  const filtered = transactions.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'ALL' || t.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Historial de Transacciones</h1>
        <p className="text-sm text-slate-400">Libro contable relacional con filtros y trazabilidad completa.</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por descripción, comercio o categoría..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {['ALL', 'EXPENSE', 'INCOME', 'INTERNAL_TRANSFER'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filterType === t
                  ? 'bg-brand-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t === 'ALL' ? 'Todos' : t === 'EXPENSE' ? 'Gastos' : t === 'INCOME' ? 'Ingresos' : 'Transferencias'}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="divide-y divide-slate-800/80">
          {filtered.map((tx) => (
            <div key={tx.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-850/40 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{tx.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="font-medium text-slate-300">{tx.bank}</span>
                    <span>•</span>
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">{tx.category}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-slate-100'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('es-CO')} COP
                </p>
                <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                  tx.status === 'CONFIRMED'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
