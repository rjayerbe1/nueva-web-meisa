# Integración: código de referido en el portal de colaboradores

## Qué es esto

MEISA tiene un Programa de Referidos ("Referidos que Construyen"): cada colaborador
tiene un código único que puede compartir con alguien a quien quiera referir para
una vacante operativa de planta (soldador, armador, ayudante). Si el candidato
referido aplica en `meisa.com.co/trabaja-con-nosotros` con ese código y supera el
periodo de prueba, el colaborador recibe una bonificación por nómina.

Este documento explica cómo el **portal de colaboradores** puede consultar el
código de un colaborador específico para mostrárselo dentro de su propia
aplicación (ej. "Tu código de referido es `JUANP482`, compártelo con quien quieras
referir").

## Endpoint

```
GET https://meisa.com.co/api/integraciones/colaboradores/codigo-referido?cedula=<numero>
```

(en dev: `https://dev.meisa.com.co/...`, mismos datos — comparte base de datos con prod)

### Autenticación

Llamada **servidor a servidor únicamente**. El backend del portal de colaboradores
debe enviar la API key en el header `Authorization`:

```
Authorization: Bearer <PORTAL_COLABORADORES_API_KEY>
```

La llave la genera y entrega MEISA (pídesela a Ricardo). **Nunca debe llegar al
navegador del empleado** ni a un bundle de frontend — es un secreto de backend.
Sin este header (o con uno incorrecto) el endpoint responde `401` siempre,
incluso si la cédula es válida.

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `cedula` | string (query param) | Sí | Número de cédula del colaborador logueado en el portal. Solo se usan los dígitos (se limpian puntos/espacios automáticamente). |

### Respuesta exitosa — `200`

```json
{
  "nombreEmpleado": "Juan Pérez",
  "codigo": "JUANP482",
  "activo": true,
  "urlPostulacion": "https://meisa.com.co/trabaja-con-nosotros"
}
```

- `codigo`: el código que el colaborador debe compartir con su referido.
- `urlPostulacion`: el link donde el referido debe aplicar (útil para armar el
  mensaje que el colaborador comparte, ej. por WhatsApp).

**El código se genera automáticamente la primera vez que se consulta esa cédula**
(no hace falta que un admin lo cree manualmente de antemano en MEISA). Si el
colaborador ya tenía código, se devuelve el mismo — llamadas repetidas con la
misma cédula siempre devuelven el mismo código.

### Errores

| Status | Cuándo | Body |
|---|---|---|
| `401` | Falta el header `Authorization` o la llave es incorrecta | `{"error": "No autorizado"}` |
| `400` | Falta el parámetro `cedula` o no tiene dígitos | `{"error": "Falta o es inválido el parámetro cedula"}` |
| `404` | No existe un colaborador **activo** con esa cédula en el directorio de MEISA (Firestore `produccion-reportes/colaboradores`) | `{"error": "No hay un colaborador activo con esa cédula"}` |
| `403` | El código de ese colaborador fue desactivado manualmente en MEISA | `{"error": "El código de este colaborador está inactivo"}` |
| `500` | Error interno | `{"error": "Error interno del servidor"}` |

### Ejemplo (curl)

```bash
curl -s "https://meisa.com.co/api/integraciones/colaboradores/codigo-referido?cedula=1234567890" \
  -H "Authorization: Bearer $PORTAL_COLABORADORES_API_KEY"
```

## Notas de diseño

- **Fuente de verdad del colaborador**: el mismo directorio Firestore
  (`produccion-reportes/colaboradores`) que ya usa el admin de MEISA para generar
  códigos manualmente — no hay dos fuentes distintas de "quién es colaborador
  activo".
- **El código en sí vive solo en Prisma/Neon** (tabla `codigos_referido` de
  MEISA), no en Firestore. Este endpoint es la única forma pensada para que un
  sistema externo lo consulte — evita duplicar el dato en dos bases.
- **Privacidad**: el endpoint solo devuelve datos del colaborador cuya cédula se
  pasó explícitamente (no hay listados, no hay búsqueda parcial). Combinado con
  la API key, no es alcanzable desde el navegador ni indexable en internet.
- Si en el futuro el portal necesita más datos (ej. cuántos referidos ha hecho,
  cuántos fueron contratados), se puede extender esta misma respuesta — avisar
  a MEISA antes de asumir campos nuevos.

## Contacto

Cualquier duda o cambio necesario en esta integración, contactar a Ricardo
Ayerbe (equipo de desarrollo de meisa.com.co).
