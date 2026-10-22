# Plan de Sincronización Automática y Continua en Google Sheets para Inducción SENA

Sistema automatizado de sincronización en tiempo real y en segundo plano entre la plataforma de inducción del SENA y Google Sheets en Google Drive, eliminando la necesidad de acciones manuales repetitivas por parte del usuario.

## Revisión de Usuario y Decisiones Críticas

> [!IMPORTANT]
> A continuación se resumen las decisiones acordadas para la automatización total de la sincronización:

- **Desencadenante Automático**: En tiempo real por eventos de aprendizaje. Se sincroniza automáticamente tan pronto como el aprendiz se registra, avanza en una lección, o culmina una evaluación gamificada (sin necesidad de pulsar botones de sincronización manual).
- **Estructura en Google Sheets**: Actualización en sitio por fila única. La plataforma busca la fila correspondiente al documento de identidad del aprendiz y actualiza sus valores (progreso, módulos aprobados, puntajes y fecha de última actividad) en lugar de duplicar filas, manteniendo la hoja limpia y consolidada.
- **Experiencia de Usuario Silenciosa**: Conexión permanente en segundo plano. Tras autorizar una sola vez, la aplicación guarda la vinculación del archivo y efectúa las llamadas a la API de Google Sheets silenciosamente sin ventanas de confirmación bloqueantes ni advertencias invasivas.

---

## 1. Visión General y Flujo Automatizado

### Propósito del Sistema
Permitir que cualquier avance, registro de aprendiz, resultado de cuestionario de los 5 módulos formativos del Reglamento (Acuerdo 009 de 2024) y emisión de certificados se refleje instantáneamente en la hoja de cálculo oficial en Google Drive sin que el instructor ni el aprendiz tengan que realizar configuraciones constantes.

### Audiencia y Contexto
- **Aprendices del SENA**: Desarrollan su inducción y evaluaciones sin interrupciones ni ventanas de error.
- **Instructores y Coordinadores**: Consultan la hoja de Google Sheets en tiempo real para verificar el estado de cohortes, aprendices en riesgo y emisión de certificados directamente en su Drive.

---

## 2. Experiencia de Usuario y Diseño Visual

### Flujo Continuo sin Fricción
1. **Inicio Transparente**: Al ingresar por primera vez, el aprendiz o instructor se vincula con un solo clic. Si ya existe la hoja `SENA Inducción Digital - Registro y Resultados de Aprendices`, se reutiliza automáticamente; si no, se crea al instante con las pestañas formateadas.
2. **Event-Driven Background Sync**: 
   - Al registrar o cambiar datos del aprendiz $\rightarrow$ Sincronización automática de perfil.
   - Al responder y aprobar un cuestionario $\rightarrow$ Actualización inmediata de puntaje y XP en la fila del aprendiz en Google Sheets.
   - Al desbloquear todas las insignias y emitir el certificado $\rightarrow$ Actualización a estado "Completado" con el código oficial de verificación.
3. **Indicador Discreto de Estado**: En la barra superior, un micro-indicador muestra de forma no invasiva el estado de guardado en la nube (`Guardado en Drive`) con transición sutil de color institucional SENA (`#39A900`), sin interrumpir la navegación.
4. **Acceso Permanente**: El enlace directo a la hoja de Google Sheets se mantiene accesible en la cabecera y en el panel de control para abrirla en una pestaña nueva con un solo clic.

---

## 3. Decisiones de Producto y Arquitectura de Datos

- **Decisión 1: Sincronización Basada en Eventos + Cola en Segundo Plano (Debounced Queue)**
  - *Enfoque*: Implementar un gestor de sincronización en segundo plano (`autoSyncService`) con cola de tareas y retraso prudente (debounce de 500ms) para evitar exceder las cuotas de la API de Google Sheets cuando se responden preguntas sucesivas.
  - *Razón*: Garantiza que ningún dato se pierda y evita bloqueos de red o errores de cuota (`429 Too Many Requests`).
- **Decisión 2: Búsqueda y Actualización Inteligente por Fila (Upsert)**
  - *Enfoque*: Consultar la columna `Documento Identidad` (columna A). Si el documento ya existe, ejecutar una actualización `PUT` en el rango exacto de esa fila (ej. `Aprendices_Registro!A4:H4`). Si no existe, hacer `append` de una nueva fila.
  - *Razón*: Mantiene la hoja organizada con exactamente un registro por aprendiz, facilitando tablas dinámicas y reportes del instructor.
- **Decisión 3: Supresión de Modales de Confirmación Repetitivos**
  - *Enfoque*: Reemplazar el `window.confirm()` manual por una autorización implícita otorgada al momento de conectar Google Drive. El usuario solo confirma la primera vez; las sincronizaciones posteriores son automáticas y silenciosas.
  - *Razón*: Elimina la molestia de confirmar continuamente cada acción dentro de la plataforma.

---

## 4. Arquitectura Técnica y Modelo de Datos

```
┌────────────────────────────────────────────────────────────────────────┐
│                       Plataforma de Inducción SENA                     │
│                                                                        │
│  ┌──────────────────────┐         ┌─────────────────────────────────┐  │
│  │  Módulos / Lecciones │         │ Cuestionarios / Casos Dilema    │  │
│  └──────────┬───────────┘         └────────────────┬────────────────┘  │
│             │                                      │                   │
│             ▼                                      ▼                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Induction State Manager                       │  │
│  │  - Estado del Aprendiz (Progreso %, XP, Módulos aprobados)       │  │
│  │  - Cohorte en Vivo (Alumnos activos, Estados, Promedios)         │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│                                     │ (Emite evento de cambio)         │
│                                     ▼                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │             Auto-Sync Background Engine (googleSheetsService)    │  │
│  │  - Token de acceso en memoria (Firebase Auth)                   │  │
│  │  - Cola de actualización silenciosa (Debounce 500ms)             │  │
│  │  - Upsert por Documento de Identidad (Sin duplicados)            │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────────────┼──────────────────────────────────┘
                                      │
                                      ▼ (HTTPS REST con Bearer Token)
┌────────────────────────────────────────────────────────────────────────┐
│                     Google Workspace (Drive & Sheets API)              │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Hoja: "SENA Inducción Digital - Registro y Resultados"          │  │
│  │                                                                  │  │
│  │  [Tab 1: Aprendices_Registro]   -> 1 fila por aprendiz (upsert)  │  │
│  │  [Tab 2: Resultados_Evaluaciones]-> Desglose por módulo y XP     │  │
│  │  [Tab 3: Cohorte_Consolidado]   -> Estadísticas por ficha        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Plan de Componentes y Cambios
1. **`src/services/googleSheetsService.ts`**:
   - Implementar método `upsertApprenticeRecord`: localiza la fila por documento y actualiza valores existentes sin duplicar filas.
   - Implementar cola de sincronización silenciosa (`triggerSilentSync`) que recibe el nuevo estado del aprendiz y lo envía sin pedir confirmaciones manuales.
2. **`src/components/GoogleSheetsSyncBanner.tsx`**:
   - Simplificar la interfaz: eliminar botones redundantes y mostrar el estado de sincronización continua en tiempo real.
   - Persistir el ID de la hoja en sesión para reconexión instantánea.
3. **`src/App.tsx`**:
   - Conectar los eventos de culminación de módulos, registro y finalización de cuestionarios al motor de sincronización automática.
   - Mostrar el enlace permanente de Google Drive directamente en la cabecera institucional.
