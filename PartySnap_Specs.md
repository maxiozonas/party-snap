# **📸 PartySnap: Especificación Técnica del Proyecto**

**Stack:** React (Frontend) \+ Laravel (API) \+ MySQL (DB) \+ Cloudinary (Storage)

**Infraestructura:** VPS (Ubuntu/Docker)

**Escala:** \~100 Usuarios Concurrentes

**Objetivo:** Aplicación efímera para subida de fotos en tiempo real mediante QR.

## **1\. Arquitectura del Sistema**

El sistema sigue una arquitectura cliente-servidor tradicional optimizada para medios.

1. **Cliente (React):** Se encarga de la captura, **compresión** y envío de la imagen.  
2. **API (Laravel):** Recibe el blob, valida la petición, sube el archivo a Cloudinary y guarda la referencia en MySQL.  
3. **Storage (Cloudinary):** Almacena los originales y genera miniaturas automáticamente.  
4. **Proyección (React/TV Mode):** Un cliente "pasivo" que consulta la API cada X segundos para mostrar nuevas fotos en el proyector.

## **2\. Base de Datos (MySQL)**

Solo necesitamos una tabla robusta. No usaremos tablas de usuarios (users) ya que el acceso es anónimo/público mediante el token del QR (si deseas seguridad) o simplemente abierto.

CREATE TABLE photos (  
    id BIGINT UNSIGNED AUTO\_INCREMENT PRIMARY KEY,  
    cloudinary\_public\_id VARCHAR(255) NOT NULL, \-- Crucial para borrar la foto después  
    secure\_url TEXT NOT NULL,                   \-- URL optimizada de Cloudinary  
    guest\_name VARCHAR(50) DEFAULT 'Anónimo',   \-- Opcional, input del usuario  
    mime\_type VARCHAR(50),                      \-- jpg, png, webp  
    size\_kb INT,                                \-- Para estadísticas  
    is\_approved BOOLEAN DEFAULT TRUE,           \-- Switch rápido para moderación  
    client\_ip VARCHAR(45),                      \-- Por seguridad (banear trolls)  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
    updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP ON UPDATE CURRENT\_TIMESTAMP  
);

**Índices sugeridos:** INDEX(created\_at) para ordenar el feed rápidamente.

## **3\. Backend: Laravel API**

### **Endpoints Necesarios**

| Verbo | Ruta | Descripción |
| :---- | :---- | :---- |
| GET | /api/photos | Retorna lista paginada de fotos (is\_approved \= 1). |
| POST | /api/upload | Recibe image y guest\_name. |
| GET | /api/stream | (Opcional) Endpoint para Server-Sent Events (SSE) si no quieres polling. |
| DELETE | /api/admin/photo/{id} | Para moderación rápida. Borra de DB y Cloudinary. |

### **Lógica del Controlador (PhotoController)**

El punto crítico es la subida. No guardes la imagen en el disco local del VPS para luego subirla, usa el stream si es posible, o limpia el temporal inmediatamente.

**Configuración Cloudinary (en config/services.php):**

Asegúrate de configurar una transformación por defecto para ahorrar ancho de banda en la visualización.

* *Quality:* auto  
* *Format:* auto (sirve WebP/AVIF si el navegador lo soporta)

**Validación (FormRequest):**

'photo' \=\> 'required|image|mimes:jpeg,png,jpg,webp|max:8192', // Max 8MB (el frontend debe comprimir antes)  
'guest\_name' \=\> 'nullable|string|max:20'

## **4\. Frontend: React App**

### **Estructura de Vistas**

1. **Home (Mobile):** Botón gigante "Subir Foto" \+ Grid de fotos recientes debajo.  
2. **Upload Modal:** Preview de la foto \+ Input opcional de nombre \+ Barra de progreso.  
3. **TV Mode (/live):** Vista limpia, sin botones, ocultando el scrollbar, auto-rotación de fotos nuevas.

### **⚙️ Lógica Crítica: Compresión en el Cliente**

**PROBLEMA:** 100 personas subiendo fotos de 10MB (cámaras modernas) saturarán el Nginx del VPS o agotarán el tiempo de espera de PHP.

**SOLUCIÓN:** Usar browser-image-compression.

**Flujo de Subida:**

1. Usuario selecciona foto.  
2. React intercepta el archivo.  
3. Compresión: maxWidthOrHeight: 1920, maxSizeMB: 1\.  
4. FormData se envía a Laravel.

### **Dependencias Clave**

* axios: Para peticiones HTTP.  
* react-dropzone o input nativo: Para seleccionar archivos.  
* browser-image-compression: **Obligatorio**.  
* swr o react-query: Para manejar el polling del feed de fotos sin complicaciones.  
* framer-motion: Para que las fotos entren con estilo en la vista de TV.

## **5\. Configuración del VPS (Infraestructura)**

Dado que usas un VPS para un evento puntual, la configuración debe priorizar la concurrencia sobre la persistencia a largo plazo.

### **Nginx (Configuración del sitio)**

Debes aumentar los límites por defecto, o las subidas fallarán.

server {  
    client\_max\_body\_size 20M; \# Permite subidas grandes  
      
    \# ... configuración standard de Laravel ...

    location / {  
        try\_files $uri $uri/ /index.php?$query\_string;  
    }  
}

### **PHP.ini (FPM)**

Localiza tu php.ini (usualmente /etc/php/8.x/fpm/php.ini) y ajusta:

upload\_max\_filesize \= 20M  
post\_max\_size \= 20M  
memory\_limit \= 256M  
max\_execution\_time \= 60 ; Dar tiempo extra para la conexión con Cloudinary

### **HTTPS (Certbot)**

**CRÍTICO:** Los navegadores modernos (Chrome/Safari en iOS/Android) **bloquean el acceso a la cámara y al input file** si el sitio no tiene SSL (HTTPS).

* Ejecuta: sudo certbot \--nginx \-d tu-dominio.com

## **6\. Flujo de Funcionamiento Detallado**

### **A. Preparación (Antes de la fiesta)**

1. Despliegas la app en el VPS.  
2. Generas el QR apuntando a https://tu-dominio-vps.com.  
3. Imprimes el QR y lo colocas en las mesas.  
4. Conectas una Laptop al proyector/TV, entras a https://tu-dominio-vps.com/live y pones pantalla completa (F11).

### **B. Durante la Fiesta (El usuario)**

1. Invitado escanea QR.  
2. Abre la web (no login).  
3. Toca "Subir Foto" \-\> Se abre la cámara.  
4. Toma la foto.  
5. El Frontend la reduce de 8MB a \~600KB en milisegundos.  
6. Sube a Laravel \-\> Laravel a Cloudinary.  
7. **Feedback:** Sale un mensaje "¡Foto subida\! Mira la pantalla".

### **C. El Modo TV**

1. El React en la TV consulta /api/photos cada 10-15 segundos.  
2. Detecta si hay IDs nuevos en la respuesta JSON.  
3. Si hay nuevos, los pone en cola y los muestra uno por uno con una animación de entrada.

### **D. Cierre (Post-Fiesta)**

1. Entras al VPS.  
2. Exportas la base de datos (si quieres guardar los nombres/fechas).  
3. Entras a Cloudinary y descargas el zip con todas las fotos.  
4. Ejecutas docker-compose down o borras el droplet/instancia.

## **7\. Plan de Contingencia (Troubleshooting)**

* **El internet del VPS es lento:** Reduce la calidad de compresión en el frontend a 0.6.  
* **Cloudinary falla:** Configura el driver de Laravel Filesystem a local temporalmente y haz un symlink. Las fotos se guardarán en el disco del VPS.  
* **Spam:** Ten a mano una ruta secreta /admin donde veas una grilla con botones de "Borrar" para eliminar fotos inapropiadas al instante.