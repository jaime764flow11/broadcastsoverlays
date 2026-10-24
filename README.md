# Overlays para OBS (Firebase + Netlify) — guía

Todo son archivos estáticos: no necesitas Node, terminal ni servidor.

## 1. Crear el proyecto Firebase
1. Entra en https://console.firebase.google.com → **Crear proyecto** (plan **Spark**, sin pagar). Puedes desactivar Analytics.
2. En la página del proyecto pulsa el icono **</>** (Web) → ponle un nombre → **Registrar app** (sin Hosting).
3. Copia los valores de `firebaseConfig` que te muestra la consola.

## 2. Crear Realtime Database
Menú **Compilación → Realtime Database → Crear base de datos** → elige la ubicación → modo **bloqueado**. Arriba verás su URL (`databaseURL`). Usa la que te dé la consola, no una de ejemplo.

## 3. Reglas
**Realtime Database → Reglas** → pega el contenido de `database.rules.json` → **Publicar**. Subir el archivo a Netlify NO aplica las reglas: hay que publicarlas aquí a mano. El ID del canal ya viene generado al azar y es el mismo en `firebase-config.js` y en las reglas (no lo cambies, o cámbialo en ambos sitios).

⚠️ **Sin autenticación, cualquiera que conozca la ruta del canal puede leer y escribir en ella.** El ID largo evita coincidencias accidentales, pero no es una contraseña. `overlay.html` solo lee (el código no escribe), pero las reglas no pueden impedirlo. No guardes datos privados.

## 4. Configurar `firebase-config.js`
Ábrelo con el Bloc de notas y pega `apiKey`, `authDomain`, `databaseURL`, `projectId`, `storageBucket`, `messagingSenderId` y `appId` entre las comillas. Si falta algo, el panel y la salida muestran qué campo falta. (Estos valores son públicos, no son una contraseña.)

## 5. Publicar en Netlify
Abre https://app.netlify.com/drop y arrastra la carpeta completa. Obtendrás una URL `https://….netlify.app`.

## 6. Abrir las páginas
- Panel: `https://TU-URL.netlify.app/control.html` (arriba debe decir «Firebase conectado» en verde).
- Salida: `https://TU-URL.netlify.app/overlay.html` (añade `?debug` para ver un indicador de conexión).

## 7. OBS Studio
**Fuentes → + → Navegador** → URL de `overlay.html` → ancho 1920, alto 1080. Deja el CSS personalizado por defecto. El fondo es transparente: verás tu vídeo debajo; si ves negro o blanco, revisa que la fuente esté por encima del vídeo y no tenga fondo propio.

## 8. Probar «LOLA ÍNDIGO»
Plantillas → *Lower third · LOLA ÍNDIGO* → **Previsualizar** (no toca OBS) → **Lanzar al directo** → aparece en OBS. Haz clic en la capa de texto «LOLA ÍNDIGO», cambia el campo *Texto* → **Actualizar en emisión** → **Ocultar con animación**.

## 9. Resto de funciones
- *Indicador · Música y voz en directo*: Lanzar / Ocultar (permanente hasta que lo ocultes).
- *Bumper*: usa la duración total (s) del diseño; se oculta solo al terminar sin afectar a otros overlays.
- *Efecto · Viñeta*: permanente hasta ocultarlo.
- Diseño nuevo: duplica una plantilla o usa **+ Texto / Rect. / Círculo / Imagen**, arrastra para mover, esquina azul para redimensionar, **Guardar** para conservarlo en tu biblioteca.
- Imágenes: copia el archivo a `assets/` y escribe `assets/logo.svg` en *URL imagen*, o usa una URL https. Vuelve a publicar la carpeta.

## 10. Actualizar sin perder datos
En Netlify → tu sitio → **Deploys** → arrastra la carpeta nueva. Los diseños viven en Firebase y no se borran. Copia de seguridad: Realtime Database → menú ⋮ → **Exportar JSON**; para recuperar → **Importar JSON**.

## 11. Coste
Consola de Firebase → engranaje → **Uso y facturación** (debe decir Spark) y pestaña **Uso** de Realtime Database. No se garantiza que sea gratis en cualquier circunstancia.

## Limitaciones de esta primera versión (no verificada en OBS ni con Firebase real)
No incluye aún: selección múltiple, agrupar, guías de alineación/distribución, timeline, miniaturas, efectos con Canvas (partículas, bokeh, grano) ni familias de animación como glitch o escritura por letras. Si un bumper está en emisión y recargas OBS, no se vuelve a mostrar una vez pasada su duración (usa la hora del ordenador; los relojes de ambos equipos deben estar en hora). Las imágenes que no cargan simplemente no se ven.
