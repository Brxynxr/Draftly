# Guía de Configuración: MacroDroid para Android en Draftly

> **Objetivo:** Conectar las notificaciones en tiempo real de tu celular (Bancolombia, Nequi y Nu) con tu backend de Draftly de forma gratuita, privada y automática.

---

## 1. ¿Qué es MacroDroid y por qué lo usamos?
* **MacroDroid** es una app de automatización para Android (más de 10 millones de descargas en Google Play).
* Es **gratuita** (permite hasta 7 macros activos; solo usaremos 1).
* **Consumo de batería:** Menor al 1% al día, ya que no sondea ni se ejecuta en bucle; solo reacciona en el milisegundo en que llega una notificación bancaria.

---

## 2. Paso a Paso de Instalación y Configuración

### Paso 1: Instalar y Otorgar Permisos
1. Descarga **MacroDroid** desde la Google Play Store en tu celular Android.
2. Abre la app y concédele el permiso de **Acceso a Notificaciones** cuando te lo solicite (esto le permite leer el texto de la barra superior).

---

### Paso 2: Crear el Macro de Draftly

1. En la pantalla principal de MacroDroid, toca en **"Añadir macro"** (el botón con signo `+`).
2. Dale un nombre en la parte superior, por ejemplo: **`Draftly - Ingesta Bancaria`**.

#### A. Configurar el Disparador (Trigger)
1. Toca el botón rojo **`+`** de la sección **Disparadores**.
2. Busca la categoría **Eventos del dispositivo** $\rightarrow$ **Notificación**.
3. Selecciona **Notificación recibida** y luego marca **Seleccionar aplicaciones**.
4. Busca y marca las apps bancarias que utilices:
   * **Nequi**
   * **Bancolombia Personas**
   * **Nu** (Nubank)
5. En las opciones de texto déjalo como *"Cualquiera"* y toca **Aceptar**.

#### B. Configurar la Acción (HTTP Request)
1. Toca el botón azul **`+`** de la sección **Acciones**.
2. Busca la categoría **Conectividad** $\rightarrow$ **Solicitud HTTP**.
3. Configura los campos de la solicitud:
   * **Método:** `POST`
   * **URL:** `https://api.tudominio.com/api/v1/webhooks/mobile-notifications` *(o tu URL de desarrollo / túnel ngrok)*
   * **Tipo de contenido:** `application/json`
   * **Encabezados de solicitud (Headers):** Toca en agregar encabezado:
     * Nombre: `X-User-Token`
     * Valor: `TU_TOKEN_SECRETO_DE_DRAFTLY` *(se obtiene en la vista de configuración de la app web)*
   * **Cuerpo de la solicitud (Body):** Pega exactamente este JSON usando las variables de MacroDroid:
     ```json
     {
       "app": "[notif_app_name]",
       "package": "[notif_package_name]",
       "title": "[notif_title]",
       "text": "[notif_text]",
       "timestamp": "[system_time]"
     }
     ```
     *(En MacroDroid puedes insertar variables tocando el botón de tres puntos `...` al lado del campo de texto)*.
4. Toca **Aceptar**.

#### C. Guardar y Activar
1. Toca el botón de guardar (icono de disco o chulito en la esquina inferior derecha).
2. Asegúrate de que el interruptor del macro esté en **Activado**.

---

## 3. Modo Offline y Reintentos (Sin Datos en la Calle)

En la configuración de la acción HTTP dentro de MacroDroid:
- Activa la casilla **"Reintentar si falla la solicitud"**.
- Si compras algo en una zona sin cobertura celular, MacroDroid guardará el evento y lo enviará automáticamente apenas tu teléfono se conecte a WiFi o recupere señal de datos.

---

## 4. Cómo Probar que Funciona (Simulación Local)

Puedes probar el macro sin gastar dinero real:
1. En MacroDroid, agrega temporalmente una app de mensajería (ej. Telegram o WhatsApp) al disparador de notificaciones.
2. Pídete un mensaje que simule una notificación bancaria:
   > *"Bancolombia te informa pago por $15.000 a OXXO desde cta *1234"*
3. Revisa la consola de tu backend de FastAPI: verás la petición llegar, a Gemini extrayendo los datos y el nuevo movimiento en estado `PENDING_REVIEW` listo en tu base de datos.
