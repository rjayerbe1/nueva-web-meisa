# 🏗️ Nueva Web MEISA - Sitio Moderno

## 📋 Descripción

Nueva plataforma web moderna para **MEISA (Metálicas e Ingeniería S.A.)** construida con tecnologías de vanguardia. Incluye un sistema completo de gestión de proyectos, animaciones avanzadas y un panel administrativo intuitivo.

## 🚀 Tecnologías

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animaciones)
- **Three.js / React Three Fiber** (3D)
- **Shadcn/ui** (componentes)

### Backend
- **Next.js API Routes**
- **Prisma ORM**
- **PostgreSQL**
- **NextAuth.js** (autenticación)
- **Uploadcare** (gestión de archivos)

### Deployment
- **Docker** (containerización)
- **Vercel** (hosting)
- **GitHub Actions** (CI/CD)

## 🏃‍♂️ Inicio Rápido

### Prerrequisitos
```bash
- Node.js 18+
- PostgreSQL 15+
- npm o yarn
```

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/nueva-web-meisa.git
cd nueva-web-meisa
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/meisa_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-aqui"
UPLOADCARE_PUBLIC_KEY="tu-uploadcare-key"
```

4. **Configurar base de datos**
```bash
npx prisma db push
npx prisma db seed
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
nueva-web-meisa/
├── app/                    # Next.js 14 App Router
│   ├── admin/             # Panel administrativo
│   ├── api/               # API Routes
│   ├── auth/              # Autenticación
│   └── proyectos/         # Páginas de proyectos
├── components/
│   ├── ui/                # Componentes base (Shadcn)
│   ├── admin/             # Componentes del admin
│   └── animations/        # Componentes animados
├── lib/
│   ├── auth.ts           # Configuración NextAuth
│   ├── prisma.ts         # Cliente Prisma
│   └── utils.ts          # Utilidades
├── prisma/
│   ├── schema.prisma     # Esquema de base de datos
│   └── seed.ts           # Datos iniciales
└── types/                # Tipos TypeScript
```

## 🗄️ Base de Datos

### Modelos Principales

- **User** - Usuarios del sistema
- **Proyecto** - Proyectos de MEISA
- **ImagenProyecto** - Imágenes de proyectos
- **ProgresoProyecto** - Seguimiento de progreso
- **Servicio** - Servicios ofrecidos
- **MiembroEquipo** - Equipo de trabajo
- **ContactForm** - Formularios de contacto

### Comandos Útiles

```bash
# Ver la base de datos
npx prisma studio

# Aplicar cambios al esquema
npx prisma db push

# Generar el cliente
npx prisma generate

# Resetear y sembrar datos
npx prisma migrate reset
```

## 🎨 Componentes y Animaciones

### Componentes Principales

- **HeroSection** - Hero con animaciones 3D
- **ProjectCard** - Cards de proyectos animados
- **AnimatedSection** - Secciones con scroll animations
- **ProjectForm** - Formulario completo de proyectos
- **DashboardStats** - Estadísticas animadas

### Sistema de Animaciones

```tsx
// Ejemplo de uso
<AnimatedSection direction="up" delay={0.2}>
  <ProjectCard proyecto={proyecto} />
</AnimatedSection>
```

## 🛠️ Panel Administrativo

### Características

- **Dashboard** con estadísticas en tiempo real
- **Gestión de proyectos** completa (CRUD)
- **Sistema de roles** (Admin, Editor, Viewer)
- **Upload de archivos** con Uploadcare
- **Seguimiento de progreso** por fases
- **Gestión de equipo y servicios**

### Rutas del Admin

- `/admin` - Dashboard principal
- `/admin/proyectos` - Gestión de proyectos
- `/admin/servicios` - Gestión de servicios
- `/admin/equipo` - Gestión del equipo
- `/admin/contactos` - Formularios de contacto

## 🚀 Deployment

### Desarrollo Local con Docker

```bash
# Construir y ejecutar con Docker Compose
docker-compose up --build

# Solo ejecutar (si ya está construido)
docker-compose up
```

### Producción con Vercel

1. **Conectar repositorio** en Vercel
2. **Configurar variables de entorno** en el dashboard
3. **Deploy automático** en cada push a main

### Producción con Docker

```bash
# Construir imagen
docker build -t meisa-web .

# Ejecutar contenedor
docker run -p 3000:3000 meisa-web
```

## 🔐 Autenticación y Roles

### Roles del Sistema

- **ADMIN** - Acceso completo
- **EDITOR** - Crear y editar contenido
- **VIEWER** - Solo lectura

### Protección de Rutas

```tsx
// Middleware automático en /admin
export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/admin/:path*"]
}
```

## 📊 APIs Disponibles

### Proyectos
- `GET /api/proyectos` - Listar proyectos
- `POST /api/proyectos` - Crear proyecto
- `PUT /api/proyectos/[id]` - Actualizar proyecto
- `DELETE /api/proyectos/[id]` - Eliminar proyecto

### Estadísticas
- `GET /api/admin/stats` - Estadísticas del dashboard

### Autenticación
- `POST /api/auth/signup` - Registro de usuario
- `POST /api/auth/signin` - Inicio de sesión

## 🎯 Características Principales

### Frontend Público
- ✅ Hero animado con Three.js
- ✅ Portafolio de proyectos filtrable
- ✅ Galería de imágenes optimizada
- ✅ Formularios de contacto
- ✅ SEO optimizado
- ✅ PWA (Progressive Web App)
- ✅ Responsive design

### Panel Administrativo
- ✅ Dashboard con métricas
- ✅ CRUD completo de proyectos
- ✅ Sistema de upload de archivos
- ✅ Gestión de progreso por fases
- ✅ Control de roles y permisos
- ✅ Búsqueda y filtros avanzados

### Optimizaciones
- ✅ Image optimization automática
- ✅ Code splitting inteligente
- ✅ Server-side rendering (SSR)
- ✅ Static generation (SSG)
- ✅ API caching strategies

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construir para producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run type-check   # Verificar tipos
npm run db:push      # Aplicar cambios a BD
npm run db:studio    # Abrir Prisma Studio
npm run db:seed      # Sembrar datos iniciales
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📞 Soporte

Para soporte técnico, contactar:
- **Email**: desarrollo@meisa.com.co
- **Documentación**: [Docs internas]

## 📄 Licencia

Este proyecto es propiedad de **MEISA - Metálicas e Ingeniería S.A.**

---

**Desarrollado con ❤️ para MEISA** 🏗️