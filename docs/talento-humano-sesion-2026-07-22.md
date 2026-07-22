# Talento Humano - Sesion 2026-07-22

## Contexto

Se trabajo sobre el modulo de administracion de Talento Humano, principalmente en:

- Programa de referidos.
- Conexion con colaboradores del proyecto Firestore `produccion-reportes`.
- Mejora del selector para generar codigos de referido.
- Filtros para la tabla/listado de comparativos de candidatos.
- Claridad sobre donde se guarda el codigo generado.

La necesidad inicial era evitar escribir manualmente nombres de colaboradores, aprovechar la base existente de empleados del otro modulo (`reportes-produccion`) y facilitar la seleccion/filtrado de candidatos cuando hay muchos registros.

## Decision De Datos

El codigo de referido queda guardado solo en Prisma/Neon, en la tabla `codigos_referido`.

Firestore se usa como fuente de lectura para los colaboradores:

```text
Firestore produccion-reportes/colaboradores
  -> se consulta empleado activo
  -> se toma id, cedula, nombre, cargo y area

Prisma/Neon codigos_referido
  -> se guarda el codigo generado
  -> se guarda colaboradorId de Firestore
  -> se guarda snapshot de nombre/cargo/area

Prisma/Neon candidatos
  -> cuando un candidato aplica con codigo, se relaciona contra codigos_referido
```

No se escribe en Firestore actualmente. Esto evita duplicar el estado del codigo en dos bases distintas. Si el modulo `reportes-produccion` necesita ver los codigos, la opcion recomendada es exponer una API segura desde esta web usando `colaboradorId`. La alternativa seria espejar el codigo en Firestore, pero eso requiere manejo de sincronizacion, permisos de escritura y correccion de inconsistencias.

## Cambios Implementados

### Referidos

- Se agrego consulta de colaboradores activos desde Firestore.
- Se creo endpoint admin para listar colaboradores disponibles.
- El formulario de referidos ya no depende de escribir el nombre manualmente.
- Se cambio el control por un selector con busqueda para encontrar rapidamente un colaborador.
- Al generar un codigo, el backend valida que el `colaboradorId` exista y este activo en Firestore.
- Si ya existe un codigo para ese `colaboradorId`, se evita duplicar.
- Si habia un codigo legacy creado con nombre libre y coincide con el nombre del colaborador, se vincula ese codigo existente al `colaboradorId`.
- Los codigos nuevos guardan:
  - `colaboradorId`
  - `cedulaEmpleado`
  - `nombreEmpleado`
  - `cargoEmpleado`
  - `areaEmpleado`
  - `codigo`
  - `notas`

### Firestore

- Se agrego helper para leer `produccion-reportes/colaboradores` usando `google-auth-library`.
- Soporta autenticacion por:
  - `FIRESTORE_SA_KEY_JSON`
  - `FIRESTORE_SA_EMAIL` + `FIRESTORE_SA_PRIVATE_KEY`
  - `GOOGLE_APPLICATION_CREDENTIALS`
  - variables legacy de servicio Google existentes
- Filtra colaboradores activos.
- Normaliza campos comunes de nombre, cedula, cargo y area.
- Ordena por nombre.
- Usa cache de 5 minutos para evitar llamadas repetidas a Firestore.

### Comparativos

- Se agregaron filtros para organizar la seleccion de candidatos.
- El objetivo es poder revisar por area/perfil/candidato sin tener que seleccionar uno por uno en una lista desorganizada.
- Se mantuvo la logica existente de comparativos, pero con controles mas practicos para listas grandes.

### Prisma

Se amplio el modelo `CodigoReferido`:

```prisma
model CodigoReferido {
  id             String   @id @default(cuid())
  colaboradorId  String?  @unique
  cedulaEmpleado String?
  nombreEmpleado String
  cargoEmpleado  String?
  areaEmpleado   String?
  codigo         String   @unique
  activo         Boolean  @default(true)
  notas          String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  candidatos Candidato[]

  @@map("codigos_referido")
}
```

La base de datos de produccion en Neon fue actualizada con `npm run db:push`.

## Archivos Principales

- `prisma/schema.prisma`
  - Campos nuevos para vincular codigos de referido con colaboradores de Firestore.

- `lib/talento/colaboradores-firestore.ts`
  - Consulta REST a Firestore.
  - Mapeo y filtro de colaboradores activos.

- `app/api/admin/talento/colaboradores/route.ts`
  - Endpoint admin para listar colaboradores activos.

- `app/api/admin/talento/referidos/route.ts`
  - Generacion de codigos usando `colaboradorId`.
  - Validacion contra Firestore.
  - Persistencia en Prisma/Neon.
  - Vinculacion de codigos legacy por nombre normalizado.

- `components/admin/talento/ReferidosTab.tsx`
  - Selector con busqueda para colaboradores.
  - Interfaz de generacion de codigos.

- `components/admin/talento/ComparativosTab.tsx`
  - Filtros para organizar candidatos.

- `components/admin/talento/types.ts`
  - Tipos actualizados para los campos nuevos.

- `app/admin/talento/page.tsx`
  - Carga/serializacion de datos actualizada para referidos.

- `.env.example`
  - Variables documentadas para conectar con Firestore.

## Validaciones Realizadas

- Se probo la conexion local a Firestore usando credenciales del proyecto `reportes-produccion`.
- La consulta devolvio 249 colaboradores activos.
- Se aplico el cambio de esquema a Neon con `npm run db:push`.
- Se verifico que Prisma no reportara diferencias despues del push.
- Se valido la UI en desktop y mobile con Playwright.
- Se ejecuto typecheck y paso correctamente.

## Comportamiento Actual Del Flujo

1. Admin abre Talento Humano > Referidos.
2. La app consulta colaboradores activos desde Firestore.
3. Admin busca y selecciona un colaborador en el selector.
4. Admin genera el codigo.
5. El backend valida el colaborador contra Firestore.
6. El codigo se guarda en Prisma/Neon.
7. Cuando un candidato aplica y escribe el codigo, `app/api/talento/postular/route.ts` busca el codigo en Prisma.
8. Si el codigo existe y esta activo, el candidato queda relacionado al codigo mediante `codigoReferidoId`.

## Pendientes Recomendados

- Definir si `reportes-produccion` necesita consultar los codigos de referido.
- Si necesita consultarlos, implementar una API segura desde esta web antes de duplicar datos en Firestore.
- Revisar permisos/roles para decidir quienes pueden generar, desactivar o eliminar codigos.
- Agregar pruebas automatizadas de API para:
  - colaborador inexistente/inactivo
  - colaborador con codigo existente
  - vinculacion de codigo legacy
  - candidato que aplica con codigo valido/invalido

## Respuesta Corta Sobre Donde Queda El Codigo

El codigo generado queda guardado en Prisma/Neon, no en Firestore. Firestore solo se usa para leer la lista de empleados activos y tomar sus datos como referencia.
