# Contacto de YuyoDev

El formulario sólo confirma éxito cuando SMTP acepta el único destinatario configurado. La aceptación SMTP no garantiza entrega final. Faltas de configuración, validación, Turnstile o SMTP devuelven el mismo error genérico y no se registran datos del formulario ni excepciones del proveedor. No hay envíos simulados.

## Variables y configuración local

Copiar `.env.example` a `.env.local` para desarrollo. Todos sus valores son obligatorios para enviar; nunca usar credenciales reales en fixtures ni subir archivos `.env`. Next.js expande `$` en archivos `.env`: escapar como `\$` si forma parte de una contraseña.

| Variable | Uso |
| --- | --- |
| `SMTP_HOST` | Hostname del proveedor, sin protocolo ni puerto |
| `SMTP_PORT` | Sólo `465` (TLS directo) o `587` (STARTTLS obligatorio) |
| `SMTP_USER`, `SMTP_PASS` | Autenticación SMTP, sólo servidor |
| `SMTP_FROM` | Una dirección de correo simple autorizada por el proveedor, sin nombre visible |
| `CONTACT_TO` | Una dirección de destino simple, independiente del usuario y remitente |
| `TURNSTILE_SECRET_KEY` | Secreto de Siteverify, sólo servidor |
| `TURNSTILE_EXPECTED_HOSTNAME` | Hostname exacto permitido, sin protocolo, puerto ni ruta; `localhost` en desarrollo |
| `TURNSTILE_EXPECTED_ACTION` | Acción esperada, por ejemplo `contact`; entre 1 y 32 letras ASCII, dígitos, `_` o `-` |
| `TURNSTILE_SITE_KEY` | Clave pública del widget |

`TURNSTILE_SITE_KEY` y la acción se entregan al navegador desde la página dinámica en tiempo de ejecución. No se usa `NEXT_PUBLIC_*` ni `next.config.env`: ninguna variable de contacto necesita estar disponible al compilar.

Para pruebas locales de interfaz, crear un widget de desarrollo autorizado para `localhost`, con su par de claves, y usar un servidor SMTP de pruebas que admita TLS y certificados válidos. Las claves públicas de prueba de Cloudflare no pueden habilitar envíos en producción: el secreto de prueba se rechaza con `NODE_ENV=production`. No desactivar verificación de certificados. Las pruebas automatizadas no necesitan variables, red ni correos: `npm test` usa mocks de ambos proveedores.

## Docker y Caddy

El Dockerfile usa Node.js 24 LTS, etapas separadas, `npm ci` y un usuario sin privilegios. `.dockerignore` excluye `.env*` (salvo el ejemplo vacío), dependencias locales y artefactos locales. La imagen final copia sólo build, archivos públicos, configuración de Next y dependencias de producción. Nunca pasar secretos mediante `ARG`, `ENV` del Dockerfile o build args; tampoco copiar un `.env` dentro de `public` o del código fuente.

Construcción y ejecución local de referencia, sin tocar Compose:

```sh
docker build -t yuyodev-contact:local .
docker run --rm --env-file /ruta/privada/contacto.env -p 127.0.0.1:3000:3000 yuyodev-contact:local
```

El archivo de runtime debe quedar fuera del repositorio y contexto de build, con permisos restrictivos. Para `--env-file` de Docker usar valores literales, sin el escape de `$` propio de Next. En la publicación se deben inyectar estas variables al contenedor mediante la configuración privada de runtime. El `docker-compose.yml` existente no se modifica y actualmente no realiza esa inyección.

Detrás de Caddy, comprobar HTTPS y que `Origin` y el host público conservado o `X-Forwarded-Host` coincidan para las Server Actions de Next.js. No agregar comodines a `allowedOrigins` ni desactivar su comprobación CSRF. La aplicación no confía en `X-Forwarded-For` para autorizar envíos ni envía la IP a Siteverify. Verificar conectividad saliente a SMTP y a `challenges.cloudflare.com:443`, y que cualquier CSP permita el script y frame de Turnstile. Estos cambios no modifican el proxy, firewall ni VPS.

## Validación y límites antiabuso

El servidor exige un único string para cada campo, sin archivos ni campos extra: nombre de 2 a 100 caracteres con letras Unicode y puntuación de nombres; email ASCII válido de hasta 254 caracteres; mensaje de 10 a 5000 caracteres sin controles peligrosos; honeypot `website` vacío y token de hasta 2048 caracteres. El honeypot está visualmente oculto, fuera del recorrido de tabulación y etiquetado para indicar a lectores de pantalla que debe dejarse vacío. El HTML escapa datos del visitante y conserva saltos de línea; asunto y remitente son controlados por el servidor.

Next.js limita a **32 KiB** el body de las Server Actions antes de invocar la función, incluyendo el multipart. La validación adicional limita los valores a 24 000 bytes. Un body demasiado grande puede producir un error de transporte/framework; la interfaz captura esa excepción y muestra el error genérico conservando los campos. El límite de Next es global para Server Actions.

Siteverify es obligatorio: timeout de 5 segundos, sin redirecciones ni caché; sólo se envía después de validar datos y configuración. Se exige `success === true`, hostname y acción exactos. Una falla de red, JSON, HTTP, token o configuración bloquea SMTP. La interfaz bloquea doble clic con una referencia síncrona, muestra espera y errores, y descarta/resetea el token después de cada intento, exitoso o fallido; expiración y errores del widget también lo invalidan.

Existe un presupuesto global de **10 intentos SMTP con token verificado por ventana fija de un minuto por proceso**. Se comprueba antes de llamar a Siteverify y nuevamente al reservar el envío, para evitar sobrepasarlo por concurrencia. Un token inventado, repetido o rechazado no consume este cupo. Hay un máximo de **4 verificaciones Siteverify simultáneas**, con timeout de 5 s y liberación del cupo incluso ante excepciones. Se guardan hashes SHA-256 de tokens verificados o en vuelo, con caducidad lógica de 5 minutos y purga al recibir otra solicitud válida (límite absoluto de 1000 entradas); las verificaciones fallidas eliminan su entrada. No se almacenan IP ni datos personales.

Estos controles protegen recursos del proceso y el cupo SMTP, pero **no son un rate limiter por visitante**. Se reinician con el proceso y no se comparten entre réplicas. Un atacante capaz de conseguir tokens válidos aún puede agotar el cupo compartido para otros visitantes; también puede competir por las 4 verificaciones en vuelo o generar muchas solicitudes secuenciales rechazadas por Siteverify. La ventana fija permite ráfagas a ambos lados del cambio de ventana. No hay persistencia, garantía de envío exactamente una vez entre procesos ni protección completa contra saturación de conexiones. No se introduce Redis ni base de datos.

### Mitigación mínima propuesta para el VPS

Antes de habilitar el formulario públicamente, aplicar en el perímetro un límite **por IP a los POST de `/contacto` y `/contacto/`**, como punto de partida 10/minuto con ráfaga máxima de 3, rechazo `429` con `Retry-After` y almacenamiento local acotado con expiración. Mantener el presupuesto global como protección del proveedor, no usarlo como sustituto del límite por IP. Ajustar los valores con tráfico real: usuarios detrás de NAT pueden compartir IP y un atacante distribuido puede eludir el límite.

Caddy estándar no ofrece una directiva `rate_limit` integrada. Proveer ese control mediante un módulo de rate limiting mantenido, cuya instalación y configuración se revisen en una tarea de infraestructura, o mediante el WAF del perímetro si el dominio ya está proxied allí. No copiar una directiva `rate_limit` de terceros a un Caddy sin ese módulo. Propuesta operativa: mapa local por IP con expiración y capacidad máxima en una única instancia Caddy; no requiere Redis. Validar el comportamiento al alcanzar la capacidad del mapa y al reiniciar.

Restringir el puerto de Next a la red interna/loopback y permitir acceso público sólo por Caddy; de lo contrario se evita el límite del perímetro. Usar la IP del socket; si existe CDN delante, confiar en headers de IP sólo desde sus rangos explícitos y actualizados. Nunca usar un `X-Forwarded-For` arbitrario del visitante. Mantener `Host`/`X-Forwarded-Host` público y la comprobación CSRF de Next.

Añadir además un límite de body en Caddy (además del existente en Next) para ambas rutas. Fragmento de referencia para integrar y validar con la versión instalada de Caddy, **no aplicado al VPS**:

```caddyfile
@contactPost {
    method POST
    path /contacto /contacto/
}
request_body @contactPost {
    max_size 32768
}
```

Configurar timeouts de lectura de headers/body y límites de conexiones acordes al VPS, y comprobar rechazo de cuerpos grandes con y sin `Content-Length`, solicitudes lentas, respuesta `429` y aislamiento entre IP. No registrar bodies, tokens o datos del formulario en Caddy/WAF. La versión, módulos y configuración actual del VPS no se inspeccionaron ni modificaron; estos controles son requisitos operativos pendientes, no garantías ya desplegadas. Referencias: [restricción de body de Caddy](https://caddyserver.com/docs/caddyfile/directives/request_body), [rate limiting no estándar](https://caddyserver.com/docs/json/apps/http/servers/routes/handle/rate_limit), [headers y proxies confiables](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy#headers).

SMTP valida certificados con TLS mínimo 1.2; usa timeouts de DNS 5 s, conexión y saludo 10 s e inactividad 20 s. Son límites de etapas/inactividad, no una garantía de duración total del envío. No se reintenta SMTP automáticamente: si se pierde la respuesta tras la aceptación puede haber un envío aunque la interfaz muestre error.

## Verificación antes de publicar

Ejecutar `npm test`, `npm run lint` y `npm run build` en un entorno sin secretos de contacto. El build usa la fuente Geist de Google y necesita acceso a Google Fonts. Verificar también la imagen Docker, que los secretos se inyecten sólo en runtime, la configuración real del widget (host y acción), el remitente autorizado y SPF/DKIM/DMARC del proveedor, y el paso de headers de Caddy. La comprobación de entrega real queda pendiente y debe hacerse de manera autorizada al publicar; estas pruebas no envían correos reales.

Referencias: [Next.js y variables de entorno](https://nextjs.org/docs/app/guides/environment-variables), [validación de Turnstile](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [SMTP y TLS de Nodemailer](https://nodemailer.com/smtp), [headers del reverse proxy de Caddy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy#headers).

## Candidata de dependencias y auditoría

Revisión del 21 de noviembre de 2026. El audit inicial de producción agrupaba **7 paquetes vulnerables** (1 crítico, 5 altos y 1 moderado); un paquete puede agrupar varios avisos, no equivale a 7 CVE. Se actualizaron las dependencias directas explícitamente, sin `npm audit fix --force`, y sólo se refrescaron las transitivas necesarias dentro de sus rangos. No hay overrides ni exclusiones para ocultar hallazgos. El lockfile fija las versiones e integridades usadas por `npm ci`.

| Paquete | Anterior en lockfile | Candidata | Hallazgo inicial y referencia oficial |
| --- | --- | --- | --- |
| Next.js | 16.2.7 | 16.4.6 | Crítico agrupado: RCE, DoS de Server Actions, SSRF y problemas de caché; [avisos de Next](https://github.com/vercel/next.js/security/advisories) y [release de seguridad de noviembre](https://nextjs.org/blog/november-2026-security-release) |
| Nodemailer | 8.0.11 | 10.6.1 | Alto agrupado: parsing de direcciones, DoS, acceso a contenido y aislamiento TLS; [avisos de Nodemailer](https://github.com/nodemailer/nodemailer/security/advisories) |
| Sharp | 0.34.5 | 0.35.5 | Alto: vulnerabilidades en libvips/libheif/librsvg; [aviso de librsvg](https://github.com/lovell/sharp/security/advisories/GHSA-wq5f-xc86-pv6w) |
| PostCSS | 8.4.31 anidado y 8.5.15 | 8.5.23, deduplicado | Alto agrupado: XSS y lectura de archivos/mapas; [aviso de sourceMappingURL](https://github.com/postcss/postcss/security/advisories/GHSA-fxqj-rqcc-2cmp) |
| source-map-js | 1.2.1 | 1.2.4 | Alto: bloqueo del event loop mediante offsets; [corrección upstream](https://github.com/7rulnik/source-map-js/releases/tag/v1.2.2) |
| nanoid | 3.3.12 | 3.3.20 | Alto: bucles con tamaños negativos/cero; [corrección upstream](https://github.com/ai/nanoid/releases/tag/3.3.18) |
| baseline-browser-mapping | 2.10.34 | 2.11.39 | Moderado: terminación del proceso con parámetros inválidos; [corrección upstream](https://github.com/web-platform-dx/baseline-browser-mapping/releases/tag/v2.11.0) |

La exposición depende de cada vector: por ejemplo, este portfolio no procesa CSS o source maps de visitantes ni usa funciones `use cache` con argumentos binarios. Se actualizaron también esas dependencias, sin basar la remediación sólo en la ausencia de una ruta de explotación. El límite de body y Turnstile no reemplazan los parches de Next.

React y React DOM permanecen en **19.2.4**, dentro del peer range de Next 16.4.6. `eslint-config-next` pasa de 16.2.7 a **16.4.6**. `@types/node` pasa de 20.19.42 a **24.19.2**. Se elimina `@types/nodemailer` 8.0.1: Nodemailer 10 aporta tipos propios y mantiene sus imports de compatibilidad. Los tipos React instalados son `@types/react` **19.2.17** y `@types/react-dom` **19.2.3**. Next exige Node >=20.9 y Nodemailer >=20; se validó la candidata sobre **Node 24.22.3 LTS** en Docker. [Migración de Nodemailer 10](https://github.com/nodemailer/nodemailer/releases/tag/v10.0.0).

La auditoría ampliada detectó además 11 grupos de desarrollo (7 moderados y 4 altos) en herramientas de lint/compilación. Se corrigieron con actualizaciones selectivas de `typescript-eslint` y sus paquetes a 8.73.0, `brace-expansion` a 1.1.22/5.0.13, `browserslist` a 4.29.6, `js-yaml` a 4.3.2, `minimatch` de la rama afectada a 11.0.9 y `zod` a 4.6.7. La copia de `minimatch` 3.1.5 permanece porque está fuera del rango afectado por el aviso actual. Estas herramientas no se incluyen en la imagen final, pero se actualizaron también para proteger el entorno de construcción.

Resultado tras la actualización: **0 vulnerabilidades conocidas tanto en `npm audit` como en `npm audit --omit=dev`** al momento de esta revisión. No se aceptaron excepciones ni hallazgos residuales de producción. Esto no es un escaneo de la imagen base/OS ni una garantía de ausencia de vulnerabilidades futuras; repetir auditoría y reconstruir con parches de Node/Alpine antes de publicar y periódicamente.

Se agregan regresiones de concurrencia y cupo SMTP (tokens falsos no consumen presupuesto, liberación ante fallos, límite concurrente y carrera por el último envío) y una prueba de MIME/envelope con el transporte real de Nodemailer en memoria, sin sockets ni entrega. El flujo SMTP/Turnstile, validaciones, error genérico, TLS y diseño se conservan.

Decisión: candidata para validación operativa; habilitación pública condicionada a inyección privada de variables, widget con hostname/action correctos, remitente autorizado, controles del perímetro descritos arriba y verificación de Caddy/TLS/conectividad. No se configuraron secretos, probaron credenciales reales ni enviaron correos. La recepción/entrega real continúa pendiente de una prueba autorizada al publicar. No hubo push ni despliegue.

### Verificaciones de la candidata

| Comprobación ejecutada | Resultado |
| --- | --- |
| `npm test` dentro del builder Node 24.22.3, sin red | PASS, 15 pruebas, 0 omitidas |
| `npm run lint` local y dentro del builder Node 24.22.3 | PASS |
| `npm run build` con Next 16.4.6 sobre Node 24, sin archivos `.env` | PASS |
| `npm audit --omit=dev` | PASS, 0 vulnerabilidades |
| `npm audit` incluyendo desarrollo | PASS, 0 vulnerabilidades |
| Docker con `--pull --no-cache`, `npm ci` y `npm ci --omit=dev` | PASS |
| Arranque de imagen sin red ni puertos publicados, usuario no root, sin `.env` ni secretos de contacto inyectados | PASS |
| Contrato ESM de Nodemailer en memoria y optimización Sharp de la imagen local | PASS |
| HTTP: error genérico sin configuración, rechazo de body mayor a 32 KiB, rechazo CSRF y aceptación del host público reenviado | PASS |
| Integridad del `docker-compose.yml` preexistente mediante SHA-256 | PASS, sin modificaciones |

En Next 16.4.6 los rechazos HTTP de body/CSRF probados devuelven un error genérico de Server Action con estado HTTP 500; el error interno de body lleva código 413. La interfaz maneja la excepción sin afirmar éxito ni borrar los campos. La comprobación de host reenviado simula los headers localmente y no certifica la configuración real de Caddy. No se usaron proveedores reales ni se validó la entrega SMTP final.
