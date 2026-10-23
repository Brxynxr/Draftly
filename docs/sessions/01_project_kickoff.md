# Sesión 01: Kickoff, Definición de Arquitectura y Configuración del MVP

> **Fecha:** 23 de Octubre de 2026  
> **Participantes:** Breyner, Daniel & Lead Software Architect Agent  
> **Objetivo:** Definición de arquitectura técnica, modelo de costos \$0, backlog de sprints y creación de AGENTS.md.

---

## 1. Decisiones Clave Tomadas

1. **Tech Stack Confirmado:**
   - **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS + Lucide Icons + TanStack Query + Zustand.
   - **Backend:** Python 3.11+ con FastAPI + Pydantic v2 + SQLAlchemy 2.0 + PostgreSQL (Supabase).
   - **Motor de IA:** Google Gemini 1.5 Flash (Google AI Studio Free Tier).
2. **Estrategia de Ingesta Bancaria (Costo \$0):**
   - Se descartaron APIs de Open Banking de pago (Belvo, Prometeo) por costos inviables de \$200-\$500 USD/mes.
   - Se descartó n8n para no agregar servidores extra innecesarios ni dependencias de correo complejas.
   - **Solución Adoptada:** MacroDroid en Android envía Webhooks directos a FastAPI por cada notificación de Nequi, Bancolombia o Nu en milisegundos.
3. **Flujo de Transacciones Pendientes (Timeout de 30 min):**
   - Las transacciones móviles entran como `PENDING_REVIEW` con sugerencia de categoría de la IA.
   - El usuario tiene 30 minutos para confirmar o reclasificar con 1 click.
   - Si no hay respuesta en 30 minutos, un worker en segundo plano la reclasifica como *Gastos Generales* con el tag `#no_detallado`.
4. **Gobierno y Orquestación:**
   - Creación de `AGENTS.md` (Zen) con reglas estrictas de desarrollo, MCPs activos y pre-commit pipeline.

---

## 2. Archivos Creados en esta Sesión

- `AGENTS.md`: Orquestador maestro para asistentes de IA y desarrollo.
- `README.md`: Resumen ejecutivo y guía de inicio.
- `docs/ARCHITECTURE.md`: Especificación técnica completa, modelos de datos y diagramas.
- `docs/MVP_AND_SPRINTS.md`: Backlog detallado de 5 sprints con asignación de tareas para Breyner y Daniel.
- `docs/MOBILE_MACRODROID_SETUP.md`: Guía de configuración de MacroDroid para Android.

---

## 3. Próximos Pasos (Sprint 1)

1. Inicializar scaffolding de carpetas `frontend/` y `backend/`.
2. Crear conexión a Supabase y esquemas de base de datos con SQLAlchemy/Alembic.
3. Implementar endpoint de webhook `/api/v1/webhooks/mobile-notifications` y parser con Gemini.
