# Tablero de Tareas & Checklist Oficial: Draftly

> **Instrucción para Agentes (Breyner & Daniel):**  
> Cada vez que un desarrollador comience, termine o mergee una tarea, **el agente correspondiente DEBE actualizar este archivo** marcando el checkbox `[x]`, actualizando el estado y añadiendo el enlace al PR correspondiente.

---

## 📊 Resumen General del Proyecto

* **Sprint Actual:** **Sprint 1 (Cimientos y Autenticación) — ¡100% Completado! 🎉**
* **Progreso Total:** 5 / 24 Tareas completadas (21%)

---

## 🏁 Sprint 1: Cimientos, Base de Datos y Autenticación

| Estado | Tarea | Resp. | Rama | PR | Entregable Técnico |
| :---: | :--- | :---: | :--- | :---: | :--- |
| [x] | **S1-01: Scaffolding Backend & Docker** | **Daniel** | `feature/s1-01-backend-scaffold` | Merged | FastAPI modular, Dockerfile, Compose, Multi-IA |
| [x] | **S1-02: Scaffolding Frontend** | **Breyner** | `feature/s1-02-frontend-scaffold` | Merged | React 19 + Vite + TypeScript + Tailwind CSS |
| [x] | **S1-03: Modelos de DB & Migraciones** | **Breyner** | `feature/s1-03-db-models` | [#1](https://github.com/Brxynxr/Draftly/pull/1) | Tablas Core Ledger con `NUMERIC(14,2)` y Alembic |
| [x] | **S1-04A: Endpoints Auth JWT** | **Daniel** | `feature/s1-04-auth-api` | [#2](https://github.com/Brxynxr/Draftly/pull/2) | Registro, Login, hashing y token para MacroDroid |
| [x] | **S1-04B: UI Login & Registro** | **Daniel** | `feature/s1-04-auth-ui` | Pending PR | Vistas de Auth en React, Zustand y guardias |
| [x] | **S1-05: Layout Principal & Navegación** | **Breyner** | `feature/s1-05-main-layout` | [#4](https://github.com/Brxynxr/Draftly/pull/4) | Sidebar colapsable, Header con perfil y shell |

> **Hito:** Con la finalización de **S1-04B** y **S1-05**, el **Sprint 1 ha sido completado al 100%**. Ambos desarrolladores (Breyner & Daniel) tienen listos sus entregables base para dar inicio al **Sprint 2 (Core Ledger & Dashboard)**.

---

## 💼 Sprint 2: Core Ledger & Dashboard Visual

| Estado | Tarea | Resp. | Rama | PR | Entregable Técnico |
| :---: | :--- | :---: | :--- | :---: | :--- |
| [ ] | **S2-01: API Cuentas & Categorías** | **Breyner** | `feature/s2-01-accounts-api` | - | CRUD cuentas (Efectivo, Nequi, etc.) y categorías |
| [ ] | **S2-02: API Transacciones & Filtros** | **Daniel** | `feature/s2-02-transactions-api` | - | CRUD transacciones con balance y filtros |
| [ ] | **S2-03: UI Gestión de Cuentas** | **Breyner** | `feature/s2-03-accounts-ui` | - | Cards interactivas por bolsillo (Nequi, Nu, etc.) |
| [ ] | **S2-04: UI Tabla de Transacciones** | **Daniel** | `feature/s2-04-transactions-ui` | - | Data-table con paginación, filtros y badges |
| [ ] | **S2-05: Dashboard con Métricas** | **Breyner** | `feature/s2-05-dashboard-metrics` | - | Cards de balance y gráfico de dona Recharts |

---

## 📱 Sprint 3: Ingesta Móvil (MacroDroid) & Bandeja de Pendientes

| Estado | Tarea | Resp. | Rama | PR | Entregable Técnico |
| :---: | :--- | :---: | :--- | :---: | :--- |
| [ ] | **S3-01: Webhook MacroDroid** | **Daniel** | `feature/s3-01-webhook-macrodroid` | - | `/api/v1/webhooks/mobile-notifications` |
| [ ] | **S3-02: Gemini Parser Estructurado** | **Breyner** | `feature/s3-02-gemini-parser` | - | Extracción Pydantic y filtro de phishing |
| [ ] | **S3-03: Prevención de Duplicados** | **Daniel** | `feature/s3-03-idempotency-hash` | - | Hash SHA-256 (SMS vs Push) |
| [ ] | **S3-04: Worker Timeout (30 min)** | **Daniel** | `feature/s3-04-timeout-worker` | - | Auto-resolución a *Gastos Generales* |
| [ ] | **S3-05: UI Bandeja de Pendientes** | **Breyner** | `feature/s3-05-pending-inbox-ui` | - | Banner flotante con confirmación en 1 click |
| [ ] | **S3-06: Pantalla Configuración Móvil** | **Daniel** | `feature/s3-06-mobile-setup-ui` | - | Vista con Token y guía de MacroDroid |

---

## 💬 Sprint 4: Smart Natural Language Input & Copilot IA

| Estado | Tarea | Resp. | Rama | PR | Entregable Técnico |
| :---: | :--- | :---: | :--- | :---: | :--- |
| [ ] | **S4-01: Parseo de Texto Libre** | **Daniel** | `feature/s4-01-ai-text-parse` | - | Endpoint para frases libres (*"gasté 100k..."*) |
| [ ] | **S4-02: Floating Quick-Input UI** | **Breyner** | `feature/s4-02-quick-input-ui` | - | Barra rápida tipo Spotlight con dictado por voz |
| [ ] | **S4-03: Agente con Tool Calling** | **Breyner** | `feature/s4-03-copilot-tools` | - | Consultas deterministas en SQL sin alucinación |
| [ ] | **S4-04: Chat Drawer Copilot UI** | **Daniel** | `feature/s4-04-copilot-chat-ui` | - | Panel lateral desplegable tipo Copilot |

---

## 🎯 Sprint 5: Simulador de Metas Financieras, Auditoría & Deploy

| Estado | Tarea | Resp. | Rama | PR | Entregable Técnico |
| :---: | :--- | :---: | :--- | :---: | :--- |
| [ ] | **S5-01: Motor Proyección de Metas** | **Daniel** | `feature/s5-01-goals-engine` | - | Algoritmo de cuotas y tiempo de ahorro (moto) |
| [ ] | **S5-02: UI Metas de Ahorro** | **Breyner** | `feature/s5-02-goals-ui` | - | Barra de progreso y sliders interactivos |
| [ ] | **S5-03: Auditoría Pre-Deploy** | **Ambos** | `feature/s5-03-audit-pre-deploy` | - | OWASP, linters y tests de punta a punta |
| [ ] | **S5-04: Despliegue Producción (\$0)** | **Ambos** | `feature/s5-04-prod-deploy` | - | Vercel (Front) + Render (Back) + Supabase (DB) |
