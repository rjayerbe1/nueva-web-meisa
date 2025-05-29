# 🚀 INICIO RÁPIDO - NUEVA WEB MEISA

## 📋 Pre-requisitos

- **Node.js 18+** instalado
- **PostgreSQL** o **Docker** para la base de datos

## 🏃 Iniciar en 30 segundos

### Opción 1: Script Automático (RECOMENDADO)

```bash
# Hacer el script ejecutable (solo la primera vez)
chmod +x start-dev.sh

# Iniciar el servidor
./start-dev.sh
```

El script automáticamente:
- ✅ Verifica Node.js
- ✅ Instala dependencias
- ✅ Crea archivo de configuración
- ✅ Configura la base de datos
- ✅ Inicia el servidor

### Opción 2: Con Docker (Todo incluido)

```bash
# Hacer el script ejecutable (solo la primera vez)
chmod +x start-docker.sh

# Iniciar con Docker
./start-docker.sh
```

Selecciona opción 1 para desarrollo rápido con PostgreSQL en Docker.

### Opción 3: Manual

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar configuración
cp .env.example .env.local

# 3. Editar .env.local con tus credenciales
# DATABASE_URL="postgresql://usuario:password@localhost:5432/meisa_db"

# 4. Configurar base de datos
npx prisma db push

# 5. Iniciar servidor
npm run dev
```

## 🌐 Acceder a la aplicación

- **Web pública**: http://localhost:3000
- **Panel admin**: http://localhost:3000/admin

## 🗄️ Base de datos rápida con Docker

Si no tienes PostgreSQL instalado:

```bash
docker run -d \
  --name meisa-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=meisa_db \
  -p 5432:5432 \
  postgres:15-alpine
```

Luego usa esta conexión en `.env.local`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/meisa_db"
```

## 🛠️ Scripts disponibles

### Deploy completo con menú interactivo:
```bash
./deploy.sh
```

Opciones del menú:
1. 🏠 Iniciar servidor de desarrollo
2. 🏗️ Build de producción
3. 🚀 Deploy con Docker
4. ☁️ Deploy a Vercel
5. 🛠️ Setup inicial completo
6. 🗄️ Solo configurar base de datos
7. 🧹 Limpiar e instalar todo
8. ❌ Salir

## 🔑 Usuario Admin por defecto

Después de configurar la BD, crea un usuario admin:

```bash
# Opción 1: Usar Prisma Studio
npx prisma studio
# Crear usuario manualmente en la interfaz

# Opción 2: Script SQL
psql -U postgres -d meisa_db << EOF
INSERT INTO users (id, email, password, name, role)
VALUES (
  'clxxxxxxxxxxxxxxxxxx',
  'admin@meisa.com.co',
  '\$2a\$10\$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', -- secret
  'Admin MEISA',
  'ADMIN'
);
EOF
```

Credenciales:
- Email: admin@meisa.com.co
- Password: secret

## ❗ Solución de problemas

### Error de conexión a BD
```bash
# Verificar que PostgreSQL esté corriendo
docker ps | grep postgres

# Si no está corriendo, iniciarlo
docker start meisa-postgres
```

### Error de dependencias
```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Puerto 3000 ocupado
```bash
# Cambiar puerto en package.json
"dev": "next dev -p 3001"
```

## 📞 Ayuda

Si tienes problemas:
1. Revisa los logs: `npm run dev`
2. Verifica `.env.local`
3. Asegúrate que PostgreSQL esté corriendo
4. Revisa el README.md completo

---

**¡Listo! Tu nueva web MEISA moderna está corriendo** 🎉