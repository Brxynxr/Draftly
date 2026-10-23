import { Wallet, Plus, Smartphone, CreditCard, ArrowUpRight } from 'lucide-react'

export function AccountsPage() {
  const accounts = [
    { id: '1', name: 'Nequi Personal', type: 'Billetera Digital', balance: 485000, color: 'bg-purple-900/40 border-purple-700/50', icon: Smartphone },
    { id: '2', name: 'Bancolombia Ahorros', type: 'Cuenta de Ahorros (*6331)', balance: 1840000, color: 'bg-yellow-950/30 border-yellow-700/40', icon: CreditCard },
    { id: '3', name: 'Nu Colombia + Cajita', type: 'Cuenta con Rendimientos', balance: 920000, color: 'bg-[#820ad1]/20 border-[#820ad1]/50', icon: Wallet },
    { id: '4', name: 'Efectivo en Mano', type: 'Bolsillo Físico', balance: 85000, color: 'bg-emerald-950/30 border-emerald-700/40', icon: Wallet },
  ]

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Cuentas & Bolsillos</h1>
          <p className="text-sm text-slate-400">Control de liquidez y saldos verificados en el Core Ledger.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-slate-950 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-brand-500/20">
          <Plus className="w-4 h-4" />
          <span>Nueva Cuenta</span>
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800/80 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Patrimonio Líquido Total</span>
          <p className="text-3xl font-extrabold text-white mt-1">
            $ {totalBalance.toLocaleString('es-CO')} <span className="text-sm font-normal text-slate-400">COP</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-lg">
          <ArrowUpRight className="w-4 h-4" />
          <span>4 Bolsillos sincronizados</span>
        </div>
      </div>

      {/* Grid of Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {accounts.map((acc) => {
          const Icon = acc.icon
          return (
            <div key={acc.id} className={`p-5 rounded-2xl border ${acc.color} flex items-center justify-between`}>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{acc.name}</h3>
                  <p className="text-xs text-slate-400">{acc.type}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Saldo</span>
                <p className="text-lg font-extrabold text-white">$ {acc.balance.toLocaleString('es-CO')}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
