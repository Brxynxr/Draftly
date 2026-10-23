import { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'

export function CopilotPage() {
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      text: '¡Hola Breyner! Soy tu Copilot financiero en Draftly. Tengo acceso a tus cuentas de Nequi, Bancolombia y Nu. Puedes preguntarme cuánto has gastado, pedirme consejos o simular metas como comprar una moto.',
    },
  ])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMsg = { id: Date.now().toString(), role: 'user', text: inputMessage }
    const assistantMsg = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: `Entendido. He analizado tu consulta sobre "${inputMessage}". Con base en tu flujo de caja mensual actual, tienes un ahorro libre promedio de $450.000 COP al mes. Si necesitas financiar una compra de 12 millones, una opción viable a 24 meses tendría cuotas estimadas de aproximadamente $610.000 COP.`,
    }

    setMessages([...messages, userMsg, assistantMsg])
    setInputMessage('')
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          Copilot Financiero con IA
          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-semibold">
            Gemini 1.5 Flash
          </span>
        </h1>
        <p className="text-sm text-slate-400">Asesor financiero conversacional con Tool Calling sobre tu Core Ledger.</p>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 max-w-2xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              m.role === 'assistant' ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'bg-slate-800 text-white'
            }`}>
              {m.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
              m.role === 'assistant' ? 'bg-slate-900 border border-slate-800 text-slate-200' : 'bg-brand-500 text-slate-950 font-medium'
            }`}>
              <p>{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs text-slate-400">
        <span>Sugerencias:</span>
        <button
          onClick={() => setInputMessage('¿Cuánto gasté en transporte este mes?')}
          className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:text-white transition-colors whitespace-nowrap"
        >
          ¿Cuánto gasté en transporte este mes?
        </button>
        <button
          onClick={() => setInputMessage('Quiero comprar una moto de 12 millones, ¿cómo puedo pagarla?')}
          className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:text-white transition-colors whitespace-nowrap"
        >
          Quiero comprar una moto de 12M...
        </button>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Haz una pregunta financiera a tu Copilot..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
        />
        <button
          type="submit"
          className="bg-brand-500 hover:bg-brand-600 text-slate-950 font-semibold px-5 py-3 rounded-xl text-sm transition-all shadow-md shadow-brand-500/20 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Enviar</span>
        </button>
      </form>
    </div>
  )
}
