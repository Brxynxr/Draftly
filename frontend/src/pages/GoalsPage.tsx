import { Target, Plus } from 'lucide-react'

export function GoalsPage() {
  const goals = [
    {
      id: '1',
      name: 'Moto Yamaha MT-03',
      target: 28000000,
      saved: 8500000,
      targetDate: 'Diciembre 2027',
      monthlyCommitment: 800000,
      status: 'En Progreso',
    },
    {
      id: '2',
      name: 'Fondo de Emergencia (6 meses)',
      target: 12000000,
      saved: 7200000,
      targetDate: 'Junio 2027',
      monthlyCommitment: 400000,
      status: 'En Progreso',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Metas Financieras</h1>
          <p className="text-sm text-slate-400">Planes de ahorro y simulación de compras respaldados por el Copilot.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-slate-950 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-brand-500/20">
          <Plus className="w-4 h-4" />
          <span>Nueva Meta</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {goals.map((g) => {
          const percentage = Math.round((g.saved / g.target) * 100)
          return (
            <div key={g.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{g.name}</h3>
                    <p className="text-xs text-slate-400">Meta para {g.targetDate}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>Ahorrado: ${g.saved.toLocaleString('es-CO')}</span>
                  <span>Objetivo: ${g.target.toLocaleString('es-CO')}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Ahorro mensual sugerido:</span>
                <span className="font-bold text-white">${g.monthlyCommitment.toLocaleString('es-CO')} COP</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
