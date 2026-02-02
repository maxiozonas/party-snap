# 🎉 PartySnap

Aplicación web para compartir fotos en tiempo real durante eventos, diseñada para celebraciones especiales como cumpleaños, bodas, graduaciones y más.

## 🎨 Características

### Para Invitados
- **Subida de fotos fácil**: Los invitados escanean un QR y suben fotos desde sus móviles
- **Compresión automática**: Las imágenes se comprimen en el cliente antes de subir (mejor rendimiento)
- **Interfaz intuitiva**: Diseño mobile-first con animaciones fluidas
- **Visualización instantánea**: Las fotos aparecen automáticamente sin recargar

### Para Organizadores
- **Modo TV (/live)**: Proyección automática de fotos en pantalla grande con slideshow
- **Panel de Administración (/admin)**: Gestión completa de fotos y configuración
- **Personalización en vivo**: Cambia título y subtítulo del evento en tiempo real
- **Eliminación por lotes**: Selecciona y elimina múltiples fotos con confirmación
- **Actualizaciones en tiempo real**: Server-Sent Events (SSE) para 50+ usuarios concurrentes

### Sistema de Notificaciones
- **Toast notifications**: Feedback visual para todas las acciones (éxito/error)
- **Diálogos de confirmación**: Previene eliminaciones accidentales
- **Estados de carga**: Indicadores claros durante operaciones

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** con TypeScript
- **Vite** para build ultrarrápido
- **Tailwind CSS** con tema "Aqua Sky" (agua/cielo)
- **Framer Motion** para animaciones fluidas
- **SWR** para fetching de datos y cache en tiempo real
- **Sonner** para notificaciones toast
- **browser-image-compression** para optimizar imágenes

### Backend
- **Laravel 12** (PHP 8.3+)
- **MySQL** para base de datos
- **Cloudinary** para almacenamiento de imágenes
- **Server-Sent Events (SSE)** para actualizaciones en tiempo real

### Infraestructura
- **Turborepo** para mono-repo management
- **pnpm** para paquetes eficiente
- **Axios** para cliente HTTP

## 📦 Estructura del Proyecto

```
party-snap/
├── apps/
│   ├── frontend/               # React + Vite
│   │   ├── src/
│   │   │   ├── components/     # Componentes UI reutilizables
│   │   │   │   ├── ui/        # Componentes base (button, dialog)
│   │   │   │   ├── PhotoCard.tsx
│   │   │   │   ├── PhotoGrid.tsx
│   │   │   │   ├── UploadModal.tsx
│   │   │   │   ├── SettingsEditor.tsx
│   │   │   │   ├── AdminStats.tsx
│   │   │   │   └── PhotoCardAdmin.tsx
│   │   │   ├── views/         # Páginas principales
│   │   │   │   ├── Home.tsx           # Página principal
│   │   │   │   ├── TVMode.tsx         # Modo slideshow
│   │   │   │   └── Admin.tsx          # Panel de admin
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   │   ├── use-photos.ts
│   │   │   │   ├── use-settings.ts
│   │   │   │   └── use-photo-stream.ts
│   │   │   ├── lib/           # Utilidades
│   │   │   │   ├── api/       # Cliente Axios
│   │   │   │   └── toast.ts   # Notificaciones
│   │   │   └── types/         # TypeScript types
│   │   └── package.json
│   │
│   └── backend/               # Laravel API
│       ├── app/
│       │   ├── Http/
│       │   │   ├── Controllers/
│       │   │   │   ├── PhotoController.php
│       │   │   │   ├── PhotoStreamController.php   # SSE endpoint
│       │   │   │   ├── PartySettingController.php  # Settings API
│       │   │   │   └── WebhookController.php
│       │   │   └── Requests/
│       │   │       └── UploadPhotoRequest.php
│       │   ├── Models/
│       │   │   ├── Photo.php
│       │   │   └── PartySetting.php
│       │   └── Services/
│       │       └── CloudinaryService.php
│       ├── database/
│       │   └── migrations/
│       │       ├── create_photos_table.php
│       │       └── create_party_settings_table.php
│       └── routes/
│           └── api.php
│
├── package.json               # Root dependencies
├── pnpm-workspace.yaml        # Workspace config
├── turbo.json                 # Turborepo config
├── AGENTS.md                  # Guía de desarrollo
├── README.md                  # Este archivo
├── ADMIN_PANEL.md             # Documentación del panel admin
└── SSE_IMPLEMENTATION.md      # Documentación de SSE
```

## 🚀 Instalación

### Requisitos Previos

- **Node.js** 20+
- **pnpm** 9+
- **PHP** 8.3+
- **Composer** 2+
- **MySQL** 8+
- **Cuenta Cloudinary** (gratuita)

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd party-snap
```

### 2. Instalar Dependencias

```bash
# Instalar dependencias del mono-repo
pnpm install

# Instalar dependencias del backend
cd apps/backend
composer install

# Volver al root
cd ../..
```

### 3. Configurar Backend

```bash
cd apps/backend

# Copiar archivo de entorno
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate

# Crear base de datos MySQL
mysql -u root -p
CREATE DATABASE party_snap CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Configurar CLOUDINARY_URL en .env
# Obtén tus credenciales en https://cloudinary.com
```

### 4. Configurar Cloudinary

1. Crear cuenta en [Cloudinary](https://cloudinary.com) (gratis)
2. Ir al Dashboard → Settings → Environment Variable
3. Copiar el `CLOUDINARY_URL`
4. Pegar en `apps/backend/.env`:

```env
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

### 5. Ejecutar Migraciones

```bash
cd apps/backend
php artisan migrate
```

Esto creará las tablas:
- `photos` - Almacena las fotos subidas
- `party_settings` - Configuración del evento (singleton)

### 6. Iniciar Aplicación

```bash
# Terminal 1: Backend (Laravel)
cd apps/backend
php artisan serve
# → http://localhost:8000

# Terminal 2: Frontend (Vite)
cd apps/frontend
pnpm dev
# → http://localhost:3000
```

## 📱 Uso

### Para Invitados (Subir Fotos)

1. **Escanear QR**: Apuntar la cámara del móvil al QR code del evento
2. **Abrir URL**: Se abrirá la página de PartySnap
3. **Tocar "Subir Foto"**: Botón grande y visible
4. **Seleccionar foto**: Elegir del carrete o tomar nueva foto
5. **Añadir nombre (opcional)**: Para identificar la foto
6. **Confirmar**: La foto se comprime y sube automáticamente

**Características:**
- Compresión automática (máximo 2MB, calidad 80%)
- Formatos soportados: JPEG, PNG, WebP
- Tiempo de subida: ~2-5 segundos según conexión

### Para Organizadores (Modo TV)

1. **Abrir `/live`** en el navegador
2. **Conectar a proyector**: Usar HDMI o AirPlay
3. **Pantalla completa**: Presionar `F11` (Windows/Linux) o `Cmd+Ctrl+F` (Mac)
4. **Slideshow automático**: Las fotos rotan cada 5 segundos
5. **Actualizaciones en vivo**: Nuevas fotos aparecen automáticamente

**Características del slideshow:**
- Transiciones suaves (fade)
- Efecto zoom en cada foto
- Contador de fotos en esquina
- Reinicio automático al terminar

### Panel de Administración (/admin)

1. **Abrir `/admin`** (no hay link público, solo conoce la URL)
2. **Ver estadísticas**: Total de fotos, fotos seleccionadas
3. **Seleccionar fotos**: Click en foto para seleccionar/deseleccionar
4. **Eliminar fotos**: Click en botón rojo de basura
5. **Confirmación**: Dialog asking "¿Eliminar esta foto?"
6. **Toast notification**: "Foto eliminada exitosamente"

**Funciones disponibles:**
- ✅ Ver todas las fotos con grid responsive
- ✅ Seleccionar múltiples fotos (checkbox)
- ✅ Eliminar fotos individuales
- ✅ Eliminar por lotes (batch delete)
- ✅ Personalizar título y subtítulo del evento
- ✅ Vista previa en tiempo real de cambios

## 🔧 Configuración del Evento

### Personalizar Título y Subtítulo

1. Entrar al panel de administración (`/admin`)
2. Buscar sección "⚙️ Configuración de la Fiesta"
3. Editar campos:
   - **Título**: "🎉 Mis 20 Años" (máx 100 caracteres)
   - **Subtítulo**: "Una celebración inolvidable" (máx 500 caracteres)
   - **Fecha del evento**: Opcional, formato YYYY-MM-DD
4. **Vista previa**: Se actualiza mientras escribes
5. **Click en "Guardar Cambios"**
6. **Toast**: "Configuración guardada exitosamente"
7. **Aplicación inmediata**: Home y TVMode se actualizan automáticamente

### Rutas de la Aplicación

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/` | Página principal (subida de fotos) | Pública |
| `/live` | Modo TV (slideshow) | Pública |
| `/admin` | Panel de administración | Privada (sin link) |

### API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/photos` | Listar todas las fotos |
| `POST` | `/api/v1/upload` | Subir nueva foto |
| `DELETE` | `/api/v1/admin/photo/{id}` | Eliminar foto |
| `GET` | `/api/v1/settings` | Obtener configuración del evento |
| `PUT` | `/api/v1/settings` | Actualizar configuración |
| `GET` | `/api/v1/photos/stream` | SSE endpoint (actualizaciones en vivo) |

## 🎨 Personalización

### Colores del Tema

El tema actual es "Aqua Sky" (agua/cielo). Editar `apps/frontend/tailwind.config.js`:

```javascript
colors: {
  aqua: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    500: '#14b8a6',  // Color principal
    600: '#0d9488',  // Hover states
  },
  sky: {
    50: '#f0f9ff',
    700: '#0369a1',  // Texto secundario
  },
}
```

### Textos del Encabezado

**No es necesario editar código**. Usa el panel de administración:
1. Entrar a `/admin`
2. Editar "Título de la Fiesta" y "Subtítulo"
3. Guardar cambios
4. Los cambios se reflejan inmediatamente en Home y TVMode

### Personalización Avanzada

Para cambios más profundos, editar:
- **Título**: `apps/frontend/src/views/Home.tsx` (línea 34)
- **Animaciones**: `apps/frontend/src/components/PhotoGrid.tsx`
- **Tiempo slideshow**: `apps/frontend/src/views/TVMode.tsx` (línea 33)

## 🔒 Seguridad

- ✅ Validación de archivos (jpeg, png, webp, max 8MB)
- ✅ Compresión automática en cliente (máx 2MB)
- ✅ IP tracking para moderación
- ✅ Sanitización de inputs (nombre del invitado)
- ✅ CORS configurado para producción
- ⚠️ CSRF deshabilitado para API endpoints (para simplificar uploads móviles)
- ⚠️ Panel de admin sin autenticación (confiar en URL secreta)

### Recomendaciones de Seguridad para Producción

1. **Autenticación**: Agregar middleware de auth al `/admin`
2. **Rate limiting**: Implementar throttling en endpoints de subida
3. **Moderación**: Queue para aprobar fotos antes de publicar
4. **HTTPS**: Usar certificado SSL en producción
5. **CORS restringido**: Limitar orígenes permitidos

## 🐛 Troubleshooting

### Las fotos no se suben

**Verificar:**
- Cloudinary URL correcta en `.env`
- Conexión a internet estable
- Tamaño de foto < 8MB
- Formato válido (JPEG, PNG, WebP)

### El slideshow no se actualiza

**Verificar:**
- Backend servidor corriendo (`php artisan serve`)
- SSE endpoint accesible: `http://localhost:8000/api/v1/photos/stream`
- Browser console para errores de conexión

### Error "Cargando configuración..." en admin

**Verificar:**
- Migración ejecutada: `php artisan migrate`
- Tabla `party_settings` existe en BD
- API endpoint responde: `curl http://localhost:8000/api/v1/settings`

### Build de frontend falla

**Solución:**
```bash
cd apps/frontend
rm -rf node_modules dist
pnpm install
pnpm build
```

## 📦 Despliegue en Producción

### Frontend (Vercel)

```bash
cd apps/frontend
pnpm build
# Desplegar carpeta 'dist' en Vercel
```

Variables de entorno en Vercel:
- `VITE_API_URL=https://tu-backend.com/api/v1`

### Backend (VPS)

```bash
# En el servidor
cd apps/backend
composer install --no-dev
php artisan key:generate
php artisan migrate
php artisan optimize --force

# Configurar Nginx/Apache
# Configurar supervisor para queue workers
```

## 📸 Modos de Ejecución

### Desarrollo (con hot reload)

```bash
# Terminal 1
cd apps/backend && php artisan serve

# Terminal 2
cd apps/frontend && pnpm dev
```

### Producción

```bash
# Build frontend
pnpm --filter frontend build

# Iniciar backend
cd apps/backend
php artisan serve --host=0.0.0.0 --port=8000
```

## 🧪 Testing

```bash
# Backend
cd apps/backend
php artisan test

# Frontend
cd apps/frontend
pnpm test
pnpm test:coverage
pnpm typecheck
pnpm lint
```

## 📄 Licencia

MIT License - Copyright (c) 2026

## 🙏 Agradecimientos

Diseñado para celebraciones inolvidables. Hecho con ❤️ usando React, Laravel, y Cloudinary.

## 📞 Soporte

Para issues o preguntas:
- Revisar `AGENTS.md` para guía de desarrollo
- Revisar `ADMIN_PANEL.md` para documentación del admin
- Revisar `SSE_IMPLEMENTATION.md` para detalles de SSE

---

**¡Que disfrutes tu evento! 🎉**
