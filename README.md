# Draftly — Plataforma de Finanzas Personales Impulsada por IA

> **Líderes de Proyecto:** Breyner & Daniel  
> **Tech Stack:** React 19 (Vite + TS + Tailwind) + FastAPI (Python 3.11+) + PostgreSQL (Supabase) + Gemini 1.5 Flash (Gratis) + MacroDroid (Android)

---

## 🚀 ¿Qué es Draftly?

**Draftly** es una plataforma de finanzas personales inteligente que resuelve el mayor problema de las apps de control de gastos: **la pereza y la fricción de registrar datos a mano**.

### Características Principales:
1. **Ingesta Automática de Notificaciones Bancarias:** Conexión gratuita en tiempo real con Bancolombia, Nequi y Nu mediante MacroDroid (Android) y Webhooks seguros.
2. **Bandeja de Gastos Pendientes con Auto-resolución:** Las compras entran al instante. Tienes 30 minutos para clasificarlas (ej. *"Pasajes U"*); si no lo haces, la app las clasifica automáticamente en *Gastos Generales* con el tag `#no_detallado`.
3. **Registro en Lenguaje Natural y Voz:** Dile *"Hoy me gasté 100mil en ir a la U"* y la IA extraerá monto, fecha, categoría y cuenta sin tocar un formulario.
4. **Copilot Financiero & Simulador de Metas:** Pregúntale cosas como *"Quiero comprar una moto de 12 millones, ¿cómo puedo pagarla?"* y el asistente calculará tu flujo de caja real y te diseñará planes de ahorro y crédito viables.
5. **Core Ledger Confiable:** Libros contables con separación de cuentas (Efectivo, Débito, Ahorros, Tarjetas) y transferencias internas que garantizan precisión matemática exacta.

---

## 📚 Documentación del Proyecto

Toda la arquitectura, backlog de sprints y guías de configuración están disponibles en la carpeta `docs/`:

- 📐 **[Especificación de Arquitectura Completa](docs/ARCHITECTURE.md):** Diagramas de flujo, diseño del Core Ledger, esquema de base de datos y contratos de API.
- 🎯 **[Plan de MVP y Backlog de Sprints](docs/MVP_AND_SPRINTS.md):** Tareas distribuidas sprint a sprint para Breyner y Daniel con estimaciones.
- 📲 **[Guía de Configuración de MacroDroid](docs/MOBILE_MACRODROID_SETUP.md):** Paso a paso para capturar notificaciones bancarias en Android a costo \$0.
- 🤖 **[Directrices del Orquestador IA (AGENTS.md)](AGENTS.md):** Reglas operativas, MCPs activos, pipeline pre-commit y leyes de arquitectura.

---

## 🛠️ Estructura del Repositorio

```text
Draftly/
├── AGENTS.md                  # Orquestador maestro para asistentes de IA y desarrollo
├── README.md                  # Este documento
├── docs/                      # Documentación completa y bitácoras
│   ├── ARCHITECTURE.md        # Arquitectura del sistema y contratos
│   ├── MVP_AND_SPRINTS.md     # Backlog de desarrollo sprint a sprint
│   ├── MOBILE_MACRODROID_SETUP.md # Guía para el celular
│   ├── adr/                   # Architecture Decision Records
│   └── sessions/              # Handoffs y registros de trabajo
├── frontend/                  # React + Vite + TypeScript + Tailwind CSS
└── backend/                   # FastAPI + Pydantic + SQLAlchemy + Gemini AI
```

---

## ⚡ Guía Rápida de Inicio para Desarrolladores

### 1. Clonar el repositorio y configurar variables de entorno
```bash
git clone https://github.com/tu-usuario/Draftly.git
cd Draftly
```

### 2. Levantar el Backend (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
La documentación interactiva de la API estará disponible en `http://localhost:8000/docs`.

### 3. Levantar el Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
La aplicación web estará disponible en `http://localhost:5173`.

---

## 💡 Modelo de Costos (\$0.00 USD)

| Componente | Proveedor | Costo |
| :--- | :--- | :--- |
| **Base de Datos** | Supabase PostgreSQL | **\$0.00** (Plan Free con 500 MB y pgvector) |
| **Modelos de IA** | Google Gemini 1.5 Flash (AI Studio) | **\$0.00** (15 RPM y 1M tokens/día gratis) |
| **Frontend Hosting**| Vercel / Cloudflare Pages | **\$0.00** (Plan Hobby) |
| **Backend Hosting** | Render / Railway | **\$0.00** (Planes gratuitos / bajo consumo) |
| **Ingesta Celular** | MacroDroid (Android) | **\$0.00** (Hasta 7 macros gratuitos) |
