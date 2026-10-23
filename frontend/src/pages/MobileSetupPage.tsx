import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export function MobileSetupPage() {
  const { user } = useAuthStore()
  const [copiedToken, setCopiedToken] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  const webhookUrl = `${window.location.origin}/api/v1/webhooks/mobile-notifications`
  const personalToken = user?.webhook_token || 'draftly_usr_8f7a2d4c9b1e3f6a'

  const copyToClipboard = (text: string, isToken: boolean) => {
    navigator.clipboard.writeText(text)
    if (isToken) {
      setCopiedToken(true)
      setTimeout(() => setCopiedToken(false), 2000)
    } else {
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    }
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          Conectar Celular (MacroDroid en Android)
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
            Costo $0
          </span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Captura notificaciones en tiempo real de Bancolombia, Nequi y Nu sin pagar servicios de Open Banking.
        </p>
      </div>

      {/* Credentials Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Tus Credenciales de Enlace</h2>

        {/* Webhook URL */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-medium">URL de Webhook (Destino en MacroDroid):</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={webhookUrl}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono"
            />
            <button
              onClick={() => copyToClipboard(webhookUrl, false)}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors shrink-0"
            >
              {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Personal Token */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-medium">Header Secreto (X-User-Token):</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={personalToken}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono"
            />
            <button
              onClick={() => copyToClipboard(personalToken, true)}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors shrink-0"
            >
              {copiedToken ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3 Step Tutorial */}
      <div className="space-y-4">
        <h3 className="font-bold text-white text-base">Instrucciones Rápidas (Toma 2 minutos):</h3>
        
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-brand-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
          <div>
            <p className="text-sm font-semibold text-white">Instala MacroDroid en tu teléfono</p>
            <p className="text-xs text-slate-400 mt-0.5">Descarga la app gratuita desde Google Play Store y concédele el permiso de Notificaciones.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-brand-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
          <div>
            <p className="text-sm font-semibold text-white">Crea un Macro con Disparador de Notificaciones</p>
            <p className="text-xs text-slate-400 mt-0.5">Selecciona las aplicaciones: Nequi, Bancolombia Personas y Nu.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-brand-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
          <div>
            <p className="text-sm font-semibold text-white">Agrega la acción 'Solicitud HTTP POST'</p>
            <p className="text-xs text-slate-400 mt-0.5">Pega la URL de arriba y añade el encabezado `X-User-Token`. Cada movimiento viajará directo a tu Core Ledger.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
