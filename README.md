# Actividad entregable UD6 - Node.js, MongoDB, GitHub Actions y Render

Proyecto basado en la actividad entregable de la UD5. Incluye autenticación JWT, tests, MongoDB, comprobación de salud, logs, workflow de GitHub Actions y despliegue automático en Render.

## Requisitos de la actividad cubiertos

### 1. Workflow de GitHub Actions

Archivo incluido:

```bash
.github/workflows/test-and-deploy-render.yml
```

El workflow hace lo siguiente:

1. Descarga el repositorio con `actions/checkout`.
2. Configura Node.js 20 con `actions/setup-node`.
3. Instala dependencias con `npm install`.
4. Revisa sintaxis con `npm run check`.
5. Ejecuta tests con `npm test`.
6. Ejecuta un paso extra de cobertura con `npm run coverage`.
7. Sube el informe de cobertura como artefacto.
8. Si todo pasa en la rama `main`, lanza el despliegue en Render mediante un Deploy Hook.

Para que el despliegue automático funcione, en GitHub debes crear el secret:

```bash
RENDER_DEPLOY_HOOK_URL
```

Ese valor se obtiene en Render desde el servicio web, en la opción de Deploy Hook.

## 2. Ruta de comprobación de salud

Ruta incluida:

```http
GET /health
```

Comprueba:

- que la API responde;
- que Mongoose está conectado;
- que MongoDB responde a un `ping` real.

Respuesta correcta:

```json
{
  "status": "ok",
  "api": "ok",
  "database": "connected",
  "timestamp": "2026-05-15T00:00:00.000Z"
}
```

Si la base de datos no está conectada, devuelve `503`.

## 3. Logs

Se han añadido logs en formato JSON.

Archivos principales:

```bash
utils/logger.js
middlewares/requestLogger.js
```

Se registran, entre otros:

- arranque del servidor;
- conexión correcta o error de MongoDB;
- cada petición HTTP;
- resultado de la ruta `/health`.

Ejemplo de log:

```json
{"timestamp":"2026-05-15T10:00:00.000Z","level":"info","message":"HTTP request","method":"GET","path":"/health","statusCode":200,"durationMs":15}
```

Estos logs se pueden ver directamente en el panel de logs de Render.

## 4. Configuración en Render

Se incluye `render.yaml` con:

```yaml
healthCheckPath: /health
buildCommand: npm install
startCommand: npm start
```

Variables necesarias en Render:

```bash
NODE_ENV=production
MONGODB_URI=tu_uri_real_de_mongodb
JWT_SECRET=secreto_access_token
JWT_REFRESH_SECRET=secreto_refresh_token
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

No subas nunca el archivo `.env` real a GitHub. Usa `.env.example` como plantilla.

## 5. Paso extra del workflow

El workflow incluye el paso extra:

```bash
npm run coverage
```

Ese comando usa `c8` para calcular cobertura de pruebas y genera la carpeta `coverage/`, que también se sube como artefacto en GitHub Actions.

## Instalación local

```bash
npm install
```

Copia las variables de entorno:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Edita `.env` con tus valores reales.

## Ejecutar el proyecto

```bash
npm start
```

La API arrancará por defecto en:

```http
http://localhost:3000
```

## Ejecutar tests

```bash
npm test
```

## Ejecutar cobertura

```bash
npm run coverage
```

## Comprobar health check en local

```http
http://localhost:3000/health
```

## Capturas que debes añadir a la entrega

En la carpeta:

```bash
docs/render-capturas/
```

Incluye estas capturas:

1. `/health` funcionando en Render.
2. Logs visibles en Render.
3. Configuración de `Health Check Path: /health` en Render.
4. Workflow de GitHub Actions ejecutado correctamente.

## Rúbrica

### Workflow

Cumple el nivel Excelente porque descarga y configura el proyecto, instala dependencias, ejecuta tests y despliega automáticamente en Render mediante Deploy Hook.

### Comprobación de salud

Cumple el nivel Excelente porque `/health` verifica la API y la conexión real con MongoDB mediante `mongoose.connection.db.admin().ping()`. Además, `render.yaml` configura `healthCheckPath: /health`.

### Logs

Cumple el nivel Excelente porque se han configurado logs JSON y se pueden visualizar en Render al arrancar la API, hacer peticiones o consultar `/health`.

### Paso extra

Cumple el nivel Excelente porque el workflow calcula cobertura de pruebas con `c8` y sube el informe como artefacto.
