# Deploy Instructions: Guest Session Feature

## 🚀 Deploy en VPS

Ejecuta estos comandos en tu terminal local para conectarte al VPS:

```bash
ssh root@srv1297224
```

Luego en el VPS, ejecuta:

```bash
cd /var/www/demo.xenova.com.ar/party-snap
git pull origin main

# Backend migrations
cd apps/backend
composer install --no-dev
php artisan migrate --force
php artisan db:seed --class=GuestSessionSeeder --force

# Frontend build
cd /var/www/demo.xenova.com.ar/party-snap
pnpm install
pnpm --filter frontend build

# Permissions
chown -R www-data:www-data apps/frontend/dist

# Reload nginx
nginx -t
systemctl reload nginx
```

## 🎟️ Obtener el Token de Invitados

Después de ejecutar el seeder, verás un output como este:

```
==================================================
  🔑 TOKEN GENERADO PARA LA FIESTA:
  a1b2c3d4e5f6... (64 caracteres)

  📱 QR Code URL:
  https://demo.xenova.com.ar/party-snap?token=a1b2c3d4e5f6...
==================================================
```

**IMPORTANTE:** Copia ese token y guárdalo. Lo necesitas para generar el QR.

## 📱 Generar QR Code

Opción 1: Usar un generador online
- Ve a: https://www.qrcode-generator.com/
- Pega la URL completa: `https://demo.xenova.com.ar/party-snap?token=TU_TOKEN_AQUI`
- Descarga el QR en PNG o PDF
- Imprímelo y colócalo en el evento

Opción 2: Usar línea de comandos
```bash
# Instalar qrencode (si no lo tienes)
sudo apt install qrencode

# Generar QR
qrencode -o qr.png "https://demo.xenova.com.ar/party-snap?token=TU_TOKEN_AQUI"
```

## ✅ Testing del Sistema

### Test 1: Escanear QR por primera vez
1. Abre: `https://demo.xenova.com.ar/party-snap?token=TU_TOKEN`
2. Debería aparecer el modal "¡Bienvenido a PartySnap! 🎉"
3. Ingresa tu nombre: "Test User"
4. Deberías poder ver la app y subir fotos

### Test 2: Intentar subir sin escanear QR
1. Abre: `https://demo.xenova.com.ar/party-snap` (sin token)
2. Puedes ver las fotos
3. Al hacer clic en "Subir Foto", deberías ver:
   "Para subir fotos, necesitas escanear el QR en el evento 🎉"

### Test 3: Upload con nombre automático
1. Después de escanear QR e ingresar nombre
2. Sube una foto
3. La foto debería aparecer con tu nombre automáticamente
4. No te debería pedir nombre de nuevo

### Test 4: Persistencia de sesión
1. Escanea QR e ingresa nombre
2. Recarga la página (F5)
3. No debería pedir el nombre de nuevo
4. Debería poder seguir subiendo fotos

## 🔍 Troubleshooting

### Error: "Token inválido o expirado"
- Verifica que el token tiene exactamente 64 caracteres
- Revisa la tabla `guest_sessions` en MySQL:
  ```sql
  SELECT * FROM guest_sessions ORDER BY first_seen_at DESC LIMIT 1;
  ```

### Error: "Migration failed"
- Verifica que la tabla `guest_sessions` no exista:
  ```sql
  DROP TABLE IF EXISTS guest_sessions;
  ```
- Ejuta migrations de nuevo:
  ```bash
  php artisan migrate:fresh --seed
  ```

### Las fotos no se suben
- Verifica que el header `X-Guest-Token` se envíe (devtools Network tab)
- Revisa logs de Laravel:
  ```bash
  tail -f apps/backend/storage/logs/laravel.log
  ```

### El modal no aparece
- Abre DevTools Console
- Busca errores de JavaScript
- Verifica que `useGuestSession` hook se esté ejecutando

## 📊 Ver Estadísticas

Para ver cuántas sesiones activas hay:

```sql
SELECT 
    COUNT(*) as total_sessions,
    SUM(photos_count) as total_photos,
    AVG(photos_count) as avg_photos_per_session
FROM guest_sessions 
WHERE is_active = 1;
```

## 🔄 Regenerar Token

Si necesitas un nuevo token (ej: para otra fiesta):

```sql
-- Desactivar token anterior
UPDATE guest_sessions SET is_active = 0;

-- Generar nuevo token (desde PHP artisan tinker)
php artisan tinker

>>> use Illuminate\Support\Str;
>>> $token = Str::random(64);
>>> App\Models\GuestSession::create([
...   'id' => Str::uuid(),
...   'token' => $token,
...   'guest_name' => 'Admin Test',
...   'first_seen_at' => now(),
...   'last_seen_at' => now()
... ]);
>>> echo $token;
```

## 🎨 Frontend Development

Si necesitas hacer cambios en el frontend:

```bash
cd /var/www/demo.xenova.com.ar/party-snap
pnpm --filter frontend dev
```

Luego accede a: `http://localhost:3000` (con port forwarding)

## 🗄️ Base de Datos

Acceder a MySQL:

```bash
mysql -u party_snap_user -p party_snap
# Password: (tu contraseña)
```

Ver sesiones:
```sql
SELECT id, token, guest_name, photos_count, first_seen_at 
FROM guest_sessions 
ORDER BY first_seen_at DESC;
```

Ver fotos con sesión:
```sql
SELECT p.id, p.guest_name, g.guest_name as session_name, p.created_at
FROM photos p
LEFT JOIN guest_sessions g ON p.guest_session_id = g.id
ORDER BY p.created_at DESC
LIMIT 10;
```

## ✅ Checklist Post-Deploy

- [ ] Migraciones ejecutadas correctamente
- [ ] Seeder generó el token (ver output)
- [ ] Frontend build exitoso
- [ ] Permisos correctos (www-data:www-data)
- [ ] Nginx reload sin errores
- [ ] QR generado con el token correcto
- [ ] Test: Escanear QR → Pedir nombre
- [ ] Test: Subir foto con nombre automático
- [ ] Test: Sin token → No puede subir
- [ ] Test: Refrescar página → Mantiene sesión

¡Listo! 🎉
