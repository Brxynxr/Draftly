# Especificación de Arquitectura de Software: Draftly

> **Versión:** 1.0.0  
> **Fecha:** Octubre 2026  
> **Autores:** Breyner & Daniel  
> **Rol:** Lead Software Architecture Spec  

---

## 1. Visión General del Sistema

**Draftly** es una plataforma web full-stack de finanzas personales que une tres pilares:
1. **Core Ledger Determinista:** Un libro contable relacional que garantiza precisión matemática absoluta en balances, ingresos, egresos y transferencias entre cuentas (efectivo, bancos y billeteras digitales).
2. **Ingesta Autónoma de Movimientos:** Captura de notificaciones bancarias de Colombia (Bancolombia, Nequi, Nu) en tiempo real mediante un Webhook alimentado por MacroDroid en Android sin intermediarios de pago ni scrapers frágiles.
3. **Copilot Financiero con IA:** Asistente conversacional con *Structured Outputs* y *Tool Calling* respaldado por Google Gemini 1.5 Flash (Tier gratuito), capaz de registrar gastos en lenguaje natural, auditar balances y simular metas financieras (ej. compra de moto o vehículo).

---

## 2. Diagrama de Arquitectura Global

```mermaid
flowchart TD
    subgraph Cliente Móvil / Banco
        Bank[Bancolombia / Nequi / Nu] -->|Push Notification| AndroidOS[Android OS]
        AndroidOS -->|Evento Inmediato| MacroDroid[MacroDroid App]
        MacroDroid -->|HTTP POST + X-User-Token| WebhookEndpoint[/api/v1/webhooks/mobile-notifications/]
    end

    subgraph Frontend SPA
        WebUser[Usuario / Breyner / Daniel] -->|Interacción Web / Chat| ReactApp[React 19 + Vite + Tailwind]
        ReactApp -->|REST API + TanStack Query| APIGateway[FastAPI Gateway]
    end

    subgraph Backend FastAPI
        WebhookEndpoint --> IngestService[Notification Ingestion Service]
        APIGateway --> CoreRouter[API Routers: Auth, Accounts, Transactions, Goals]
        APIGateway --> AICopilotRouter[AI Copilot Router]

        IngestService --> Deduplicator{Verificador Anti-Duplicados / Hash}
        Deduplicator -->|Nuevo| LLMParser[Gemini 1.5 Flash: Structured Parser]
        Deduplicator -->|Repetido| Drop[Descartar]

        LLMParser --> PendingQueue[(Tabla: Pending Transactions)]
        
        CoreRouter --> CoreLedgerService[Core Ledger Business Logic]
        AICopilotRouter --> CopilotAgent[Agent con Tool Calling]
        CopilotAgent --> CoreLedgerService
    end

    subgraph Base de Datos Relacional
        CoreLedgerService --> Postgres[(PostgreSQL: Supabase / Neon)]
        PendingQueue --> Postgres
    end

    subgraph Tareas en Segundo Plano
        BackgroundWorker[Background Auto-Resolver: cada 5 min] -->|Revisa transacciones > 30 min| Postgres
    end
```

---

## 3. Modelo del Core Ledger (Base de Datos)

Las finanzas personales no son una simple lista plana de gastos. Cada movimiento afecta una cuenta origen y, en caso de transferencias o retiros, una cuenta destino.

### Entidades Principales

```mermaid
erDiagram
    USERS ||--o{ ACCOUNTS : owns
    USERS ||--o{ CATEGORIES : configures
    USERS ||--o{ TRANSACTIONS : executes
    USERS ||--o{ FINANCIAL_GOALS : defines
    ACCOUNTS ||--o{ TRANSACTIONS : records
    CATEGORIES ||--o{ TRANSACTIONS : classifies

    USERS {
        uuid id PK
        string email UK
        string hashed_password
        string default_currency
        string webhook_token UK
        datetime created_at
    }

    ACCOUNTS {
        uuid id PK
        uuid user_id FK
        string name "Efectivo, Nequi, Nu, Bancolombia"
        string type "CASH, DEBIT, SAVINGS, CREDIT"
        decimal balance
        string currency
        string account_tail "Últimos 4 dígitos opcionales"
        boolean is_active
    }

    CATEGORIES {
        uuid id PK
        uuid user_id FK
        string name "Comida, Transporte, Vivienda, etc."
        string icon
        string color
        boolean is_system
    }

    TRANSACTIONS {
        uuid id PK
        uuid user_id FK
        uuid account_id FK
        uuid category_id FK
        decimal amount
        string type "EXPENSE, INCOME, INTERNAL_TRANSFER"
        string description
        string merchant
        string status "CONFIRMED, PENDING_REVIEW, AUTO_RESOLVED"
        string source "MANUAL, AI_CHAT, MACRODROID_PUSH, BANK_STATEMENT"
        string idempotency_hash UK
        json tags
        datetime transaction_date
        datetime created_at
    }

    FINANCIAL_GOALS {
        uuid id PK
        uuid user_id FK
        string name "Moto Yamaha MT-03"
        decimal target_amount
        decimal current_saved
        datetime target_date
        string status "ACTIVE, COMPLETED, PAUSED"
    }
```

### Reglas Contables del Negocio
1. **Gasto (`EXPENSE`):** Disminuye el balance de la cuenta seleccionada (`ACCOUNTS.balance -= amount`).
2. **Ingreso (`INCOME`):** Aumenta el balance de la cuenta seleccionada (`ACCOUNTS.balance += amount`).
3. **Transferencia Interna (`INTERNAL_TRANSFER`):** Por ejemplo, un retiro en cajero de Nequi a Efectivo. Descuenta de la cuenta bancaria y acredita al bolsillo de Efectivo sin alterar el patrimonio total.
4. **Idempotencia (`idempotency_hash`):** Generado como $\text{SHA256}(\text{user\_id} + \text{amount} + \text{account} + \text{date\_minute})$. Si la notificación llega dos veces por SMS y por Push, la segunda se descarta.

---

## 4. Ciclo de Vida de Transacciones con IA y Timeout de 30 Minutos

Para no obligar al usuario a clasificar todo inmediatamente ni categorizar erróneamente:

1. **Ingesta Inmediata:** Llega la notificación push desde el teléfono.
2. **Extracción Estructurada:** Gemini 1.5 Flash extrae banco, monto, comercio y sugiere una categoría tentativa (ej. *Transporte*).
3. **Estado Inicial:** Se guarda con estado `PENDING_REVIEW`.
4. **Alerta en la App Web:** En el frontend se muestra una alerta tipo *Inbox*:
   > *"Movimiento detectado: -$15.000 en Nequi. ¿Deseas clasificarlo como Transporte?"*
5. **Acción del Usuario:**
   - Si el usuario hace click en **Aceptar**: pasa a estado `CONFIRMED` con la categoría sugerida.
   - Si el usuario selecciona **Cambiar**: se actualiza a la categoría elegida (ej. *Pasajes U*) y pasa a `CONFIRMED`.
6. **Resolución por Timeout (Regla de los 30 minutos):**
   - Si transcurren 30 minutos sin interacción, una tarea en segundo plano actualiza la transacción a:
     - `status`: `AUTO_RESOLVED`
     - `category`: `Gastos Generales`
     - `tags`: `["no_detallado", "autoresuelto"]`
   - El usuario siempre puede re-editarla en el historial cuando desee.

---

## 5. Arquitectura del Asistente y Simulador de Metas

El chat financiero no utiliza un RAG documental plano; utiliza **Tool Calling (Function Calling)** para no alucinar números:

```mermaid
sequenceDiagram
    autonumber
    actor User as Usuario (Breyner / Daniel)
    participant ChatUI as Frontend Chat
    participant API as FastAPI Copilot
    participant LLM as Gemini 1.5 Flash
    participant Tools as Python Deterministic Tools
    participant DB as PostgreSQL

    User->>ChatUI: "Quiero comprar una moto de 12 millones. ¿Cómo voy?"
    ChatUI->>API: POST /api/v1/ai/chat
    API->>LLM: Prompt del sistema + Herramientas disponibles
    LLM->>API: tool_call: get_user_financial_profile(user_id)
    API->>Tools: Ejecutar get_user_financial_profile()
    Tools->>DB: Consultar ingresos prom, gastos fijos y flujo libre
    DB-->>Tools: Ingresos: $3M, Gastos: $2.2M, Ahorro libre: $800k/mes
    Tools-->>API: Resultado financiero verificado
    API->>LLM: Retornar resultado a Gemini
    LLM-->>ChatUI: "Tu capacidad de ahorro es de $800k/mes. Sin financiación tardarías 15 meses. Si financias el 50% a 24 meses, la cuota estimada sería..."
```

---

## 6. Seguridad y Cero Costo de Operación

- **Autenticación Web:** JSON Web Tokens (JWT) con expiración y cookies HttpOnly o Bearer headers.
- **Autenticación de Notificaciones Móviles:** Header `X-User-Webhook-Token` único por usuario, revocable desde el panel de configuración.
- **Costos de Infraestructura:**
  - Base de Datos: **Supabase** Free Tier (500 MB Postgres con backups).
  - API Backend: **Render** / **Railway** Free o Starter.
  - Frontend: **Vercel** / **Cloudflare Pages** Free Tier.
  - IA / LLM: **Google Gemini 1.5 Flash** (15 RPM y 1M tokens/día gratuitos en Google AI Studio).
  - Telemetría Móvil: **MacroDroid** (Gratuito en Android hasta 7 macros).
  - **Costo mensual total esperado para desarrollo y MVP:** **\$0.00 USD**.
