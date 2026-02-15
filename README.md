# 🎉 PartySnap

Aplicación web para compartir fotos en tiempo real durante eventos, diseñada para celebraciones especiales como cumpleaños, bodas, graduaciones y más.

## ✨ Nuevas Funcionalidades

### 🔐 Sistema de Autenticación Seguro
- **Login de administrador** con tokens seguros (Laravel Sanctum)
- **Protección de rutas** en panel de administración
- **Cambio de contraseña** directamente desde el panel
- **Sesiones con expiración** automática (30 minutos)

### 📱 Sistema Multi-Usuario con QR
- **Token maestro único** por evento (en QR code)
- **Sesiones individuales** para cada invitado que escanea
- **50+ usuarios simultáneos** sin conflictos de nombres
- **Persistencia de sesión** durante toda la fiesta
- **Fotos mantienen nombre original** del uploader

### 🎨 Mejoras en UX
- **Requerimiento de QR**: No se puede subir sin escanear primero
- **Cambio de nombre fácil**: Botón en modal de subida para editar nombre
- **Banner informativo**: Indica escanear QR cuando no hay sesión
- **Gestión de sesiones**: Múltiples usuarios, cada uno con su propio nombre

## 🎨 Características

### Para Invitados
- **Escanear QR obligatorio**: Deben escanear el QR de la fiesta para poder subir fotos
- **Nombre personalizado**: Cada invitado ingresa su nombre al escanear
- **Cambio de nombre**: Pueden cambiar su nombre fácilmente desde el modal de subida
- **Subida de fotos fácil**: Interfaz intuitiva desde móviles
- **Compresión automática**: Las imágenes se comprimen en el cliente antes de subir
- **Interfaz mobile-first**: Diseño responsive con animaciones fluidas
- **Visualización instantánea**: Las fotos aparecen automáticamente sin recargar

### Para Organizadores
- **Modo TV (/live)**: Proyección automática de fotos en pantalla grande con slideshow
- **Panel de Administración (/admin)**: Gestión completa con autenticación segura
- **Personalización en vivo**: Cambia título y subtítulo del evento en tiempo real
- **Eliminación por lotes**: Selecciona y elimina múltiples fotos con confirmación
- **Actualizaciones en tiempo real**: Server-Sent Events (SSE) para 50+ usuarios concurrentes
- **Gestión de sesiones**: Múltiples invitados pueden subir simultáneamente

### Sistema de Notificaciones
- **Toast notifications**: Feedback visual para todas las acciones
- **Diálogos de confirmación**: Previene eliminaciones accidentales
- **Estados de carga**: Indicadores claros durante operaciones

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** con TypeScript 5.9
- **Vite** para build ultrarrápido
- **Tailwind CSS** con tema "Aqua Sky"
- **Framer Motion** para animaciones fluidas
- **SWR** para fetching de datos y cache en tiempo real
- **Sonner** para notificaciones toast
- **browser-image-compression** para optimizar imágenes

### Backend
- **Laravel 12** (PHP 8.2+)
- **Laravel Sanctum** para autenticación segura
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
│   │   │   │   ├── ui/        # Componentes base (button, dialog, input, label)
│   │   │   │   ├── PhotoCard.tsx
│   │   │   │   ├── PhotoGrid.tsx
│   │   │   │   ├── UploadModal.tsx
│   │   │   │   ├── ScanQRNotice.tsx     # Banner para escanear QR
│   │   │   │   ├── SettingsEditor.tsx
│   │   │   │   ├── AdminStats.tsx
│   │   │   │   └── PhotoCardAdmin.tsx
│   │   │   ├── views/         # Páginas principales
│   │   │   │   ├── Home.tsx           # Página principal
│   │   │   │   ├── TVMode.tsx         # Modo slideshow
│   │   │   │   ├── Admin.tsx          # Panel de admin (protegido)
│   │   │   │   └── AdminLogin.tsx     # Login de admin
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   │   ├── use-photos.ts
│   │   │   │   ├── use-settings.ts
│   │   │   │   ├── use-photo-stream.ts
│   │   │   │   ├── use-guest-session.ts   # Gestión de sesiones de invitados
│   │   │   │   └── use-admin-auth.ts      # Autenticación de admin
│   │   │   └── types/         # TypeScript types
│   │   └── package.json
│   │
│   └── backend/               # Laravel API
│       ├── app/
│       │   ├── Http/
│       │   │   ├── Controllers/
│       │   │   │   ├── PhotoController.php
│       │   │   │   ├── PhotoStreamController.php   # SSE endpoint
│       │   │   │   ├── PartySettingController.php
│       │   │   │   ├── GuestSessionController.php  # Gestión de sesiones
│       │   │   │   ├── AdminAuthController.php     # Autenticación admin
│       │   │   │   └── WebhookController.php
│       │   │   └── Requests/
│       │   ├── Models/
│       │   │   ├── Photo.php
│       │   │   ├── PartySetting.php
│       │   │   ├── GuestSession.php     # Sesiones de invitados
│       │   │   ├── PartyToken.php       # Token maestro para QR
│       │   │   └── Admin.php            # Modelo de administrador
│       │   └── Services/
│       ├── database/
│       │   └── migrations/
│       │       ├── create_photos_table.php
│       │       ├── create_party_settings_table.php
│       │       ├── create_guest_sessions_table.php
│       │       ├── create_party_tokens_table.php
│       │       └── create_admins_table.php
│       └── routes/
│           └── api.php
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── AGENTS.md
└── README.md
```

## 🚀 Instalación

### Requisitos Previos

- **Node.js** 20+
- **pnpm** 9+
- **PHP** 8.2+
- **Composer** 2+
- **MySQL** 8+
- **Cuenta Cloudinary** (gratuita)

### 1. Clonar y Configurar

```bash
git clone <repository-url>
cd party-snap
pnpm install
cd apps/backend && composer install
```

### 2. Configurar Backend

```bash
cd apps/backend
cp .env.example .env
php artisan key:generate

# Crear base de datos MySQL
mysql -u root -p -e "CREATE DATABASE party_snap CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Configurar CLOUDINARY_URL en .env
```

### 3. Ejecutar Migraciones y Seeders

```bash
cd apps/backend
php artisan migrate --force
php artisan db:seed --class=PartyTokenSeeder --force  # Genera token para QR
php artisan db:seed --class=AdminSeeder --force        # Crea admin inicial
```

### 4. Iniciar Aplicación

```bash
# Terminal 1: Backend
cd apps/backend && php artisan serve

# Terminal 2: Frontend
cd apps/frontend && pnpm dev
```

## 📱 Uso

### Para Invitados

1. **Escanear QR**: Apuntar la cámara al QR del evento
2. **Ingresar nombre**: Aparecerá modal pidiendo tu nombre
3. **Subir fotos**: Ahora puedes subir fotos con tu nombre
4. **Cambiar nombre**: En el modal de subida, haz clic en ✏️ para editar

**Nota**: Sin escanear el QR, solo puedes ver fotos pero no subir.

### Generar QR para el Evento

Después de ejecutar `PartyTokenSeeder`, obtendrás:

```
==================================================
  🎉 TOKEN MAESTRO PARA QR:
  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (64 caracteres)

  📱 URL para QR Code:
  https://tu-dominio.com/party-snap?token=XXXXXXXX
==================================================
```

Usa esta URL para generar el QR (con cualquier generador online).

### Panel de Administración (/admin)

1. **Ir a `/admin`**
2. **Login**: Ingresa email y contraseña de administrador
3. **Funciones**:
   - Ver y eliminar fotos
   - Configurar título/subtítulo del evento
   - Cambiar contraseña (menú de usuario)
   - Logout seguro

## 🔧 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/photos` | Listar fotos |
| `POST` | `/api/v1/upload` | Subir foto (requiere sesión) |
| `POST` | `/api/v1/sessions/register` | Registrar sesión desde QR |
| `PUT` | `/api/v1/sessions/{token}` | Actualizar nombre |
| `GET` | `/api/v1/settings` | Configuración del evento |
| `PUT` | `/api/v1/settings` | Actualizar config (auth) |
| `POST` | `/api/v1/admin/login` | Login de admin |
| `POST` | `/api/v1/admin/logout` | Logout (auth) |
| `POST` | `/api/v1/admin/change-password` | Cambiar password (auth) |
| `DELETE` | `/api/v1/admin/photo/{id}` | Eliminar foto (auth) |

## 🎨 Personalización

### Colores del Tema

Editar `apps/frontend/tailwind.config.js`:

```javascript
colors: {
  aqua: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    500: '#14b8a6',
    600: '#0d9488',
  },
}
```

### Configuración del Evento

Desde el panel de administración:
- Título de la fiesta
- Subtítulo
- Fecha del evento

## 🔒 Seguridad

- ✅ Autenticación segura con Laravel Sanctum
- ✅ Tokens con expiración (30 min)
- ✅ Hash de contraseñas con bcrypt
- ✅ Validación de archivos (jpeg, png, webp, max 8MB)
- ✅ Sanitización de inputs
- ✅ CORS configurado
- ✅ Rutas de admin protegidas

## 🧪 Testing

```bash
# Backend
cd apps/backend
php artisan test
php artisan test --filter PhotoController
./vendor/bin/pint --test

# Frontend
cd apps/frontend
pnpm typecheck
pnpm lint
```

## 📄 Documentación Adicional

- `AGENTS.md` - Guía de desarrollo para contribuidores
- `DEPLOY_INSTRUCTIONS.md` - Instrucciones de despliegue

## 📄 Licencia

MIT License - Copyright (c) 2026

---

**¡Que disfrutes tu evento! 🎉**
