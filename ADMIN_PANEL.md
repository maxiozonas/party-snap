# Panel de Administración - PartySnap

## 📱 Acceso

El panel de admin es **mobile-first** y está disponible en:
```
http://localhost:3000/admin
```

También puedes acceder desde la página principal haciendo clic en el botón **"⚙️ Panel de Admin"**.

---

## 🎯 Funcionalidades

### 1. **Ver todas las fotos**
- Grid responsive optimizado para móvil
- Vista previa de cada foto
- Información: nombre del invitado y hora de subida

### 2. **Seleccionar fotos**
- **Toca una foto** para seleccionarla/deseleccionarla
- **Botón "Seleccionar todas"** para marcar todas
- Indicador visual con borde verde y checkmark

### 3. **Eliminar fotos**
- **Eliminación individual:** Toca el botón rojo de basura en cada foto
- **Eliminación múltiple:** Selecciona varias y usa "Eliminar seleccionadas"
- **Confirmación:** Siempre pide confirmación antes de eliminar

---

## 🎨 Interfaz Mobile-First

### Móvil (< 768px)
- Grid de 2 columnas
- Botones grandes y táctiles
- Info compacta

### Tablet (768px - 1024px)
- Grid de 3 columnas
- Más espacio entre elementos

### Desktop (> 1024px)
- Grid de 4-5 columnas
- Máxima densidad de información

---

## 🔒 Seguridad

**Nota importante:** El panel de admin actual NO tiene autenticación. Para producción:

1. Agregar autenticación (password, PIN)
2. Implementar middleware en Laravel
3. Usar tokens o sesiones

---

## 📊 Estadísticas en tiempo real

El panel muestra:
- **Total** de fotos subidas
- **Seleccionadas** para eliminar
- Actualización automática sin recargar

---

## 🗑️ Flujo de Eliminación

```
1. Seleccionar foto(s)
   ↓
2. Confirmar eliminación
   ↓
3. Llamada a API DELETE /api/v1/admin/photo/{id}
   ↓
4. Backend elimina de Cloudinary + BD
   ↓
5. UI se actualiza automáticamente
   ↓
6. Foto desaparece del grid
```

**Sync completo:**
- ✅ Elimina de Cloudinary
- ✅ Elimina de base de datos
- ✅ Actualiza frontend

---

## 💡 Tips de Uso

### Gestión eficiente:
1. **Selecciona múltiples** fotos para eliminar en lote
2. **Usa "Seleccionar todas"** para limpiar todo
3. **Deselecciona** tocando nuevamente si te equivocaste

### Navegación:
- **"← Volver"** regresa a la página principal
- Botón flotante siempre visible

---

## 🚀 Próximas Mejoras

Opcionales para implementar:

1. **Filtros:**
   - Por nombre de invitado
   - Por fecha/hora
   - Por tamaño

2. **Ordenamiento:**
   - Más recientes primero
   - Más antiguas primero
   - Alfabéticamente

3. **Exportar:**
   - Descargar ZIP con todas las fotos
   - Generar reporte

4. **Bulk actions:**
   - Aprobar/rechazar fotos
   - Marcar como favoritas

---

## 🐛 Solución de Problemas

**Las fotos no se eliminan:**
- Verifica la consola del navegador (F12)
- Revisa que el backend esté corriendo
- Check logs de Laravel: `tail -f storage/logs/laravel.log`

**Error 403/401:**
- El endpoint DELETE requiere autenticación (si configuraste middleware)
- Verifica el archivo de rutas en Laravel

**Panel se ve mal:**
- Limpia el caché del navegador
- Verifica que Vite esté corriendo
- Recarga la página: Ctrl+Shift+R
