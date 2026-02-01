# 🎉 PartySnap

Aplicación web para compartir fotos en tiempo real durante eventos, diseñada para celebraciones especiales como cumpleaños, bodas, y más.

## 🎨 Características

- **Subida de fotos fácil**: Los invitados escanean un QR y suben fotos desde sus móviles
- **Compresión automática**: Las imágenes se comprimen en el cliente antes de subir
- **Modo TV**: Proyección automática de fotos en pantalla grande
- **Diseño elegante**: Estética "Elegante Celebration" perfecta para eventos especiales
- **Tiempo real**: Las fotos aparecen automáticamente sin recargar la página

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** con TypeScript
- **Vite** para build ultrarrápido
- **Tailwind CSS** con tema personalizado
- **Framer Motion** para animaciones fluidas
- **SWR** para fetching de datos en tiempo real
- **browser-image-compression** para optimizar imágenes

### Backend
- **Laravel 12** (PHP 8.2+)
- **MySQL** para base de datos
- **Cloudinary** para almacenamiento de imágenes

## 📦 Estructura del Proyecto

```
party-snap/
├── apps/
│   ├── frontend/          # React + Vite
│   └── backend/           # Laravel API
├── packages/              # Paquetes compartidos
└── turbo.json            # Configuración Turborepo
```

## 🚀 Instalación

### Requisitos Previos

- **Node.js** 20+
- **pnpm** 9+
- **PHP** 8.2+
- **Composer**
- **MySQL** 8+

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
CREATE DATABASE party_snap;
EXIT;

# Configurar CLOUDINARY_URL en .env
# Obtén tus credenciales en https://cloudinary.com
```

### 4. Ejecutar Migraciones

```bash
php artisan migrate
```

### 5. Iniciar Aplicación

```bash
# Terminal 1: Backend (Laravel)
cd apps/backend
php artisan serve

# Terminal 2: Frontend (Vite)
cd apps/frontend
pnpm dev
```

## 📱 Uso

### Para Invitados (Subir Fotos)

1. Escanear el QR code con el móvil
2. Abrir la URL
3. Tocar "Subir Foto"
4. Seleccionar foto del carrete
5. Opcional: Añadir nombre
6. Confirmar subida

### Para Organizadores (Modo TV)

1. Abrir `/live` en el navegador
2. Conectar laptop/TV al proyector
3. Presionar `F` para pantalla completa
4. Las fotos aparecen automáticamente cada 5 segundos

## 🔧 Configuración de Cloudinary

1. Crear cuenta en [Cloudinary](https://cloudinary.com)
2. Copiar el "Environment Variable" desde Dashboard
3. Pegar en `apps/backend/.env`:

```env
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

## 📸 Modos de Uso

### Desarrollo

```bash
# Iniciar ambos servicios
pnpm dev

# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api/v1
```

### Producción

```bash
# Build del frontend
pnpm --filter frontend build

# Desplegar backend en VPS
# Desplegar build/ en Vercel o mismo VPS
```

## 🎨 Personalización

### Colores del Tema

Editar `apps/frontend/tailwind.config.js`:

```javascript
colors: {
  gold: {
    500: '#d4af37',  // Color principal
  },
  champagne: '#f7e7ce',
  cream: '#f5f5dc',
}
```

### Texto del Encabezado

Editar `apps/frontend/src/views/Home.tsx`:

```typescript
<h1>🎉 Tu Nombre Aquí</h1>
```

## 🔒 Seguridad

- CSRF deshabilitado para API endpoints
- Validación de archivos (jpeg, png, webp, max 8MB)
- Compresión automática en cliente
- IP tracking para moderación

## 📄 Licencia

MIT License - Copyright (c) 2024

## 🙏 Agradecimientos

Diseñado para celebraciones inolvidables.
