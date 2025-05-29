# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nueva Web MEISA** - A modern Next.js 14 web platform for MEISA (Metálicas e Ingeniería S.A.) featuring a public website with 3D animations and a comprehensive admin panel for project management.

## Common Development Commands

```bash
# Development
npm run dev              # Start development server on port 3000
./start-dev.sh          # Automated setup: installs deps, configures DB, starts server

# Database
npm run db:push         # Apply Prisma schema changes to database
npm run db:studio       # Open Prisma Studio GUI for database management
npm run db:seed         # Seed database with initial data

# Build & Production
npm run build           # Create production build
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript type checking

# Docker
./start-docker.sh       # Start with Docker (includes PostgreSQL)
docker-compose up       # Alternative Docker start
./deploy.sh            # Interactive deployment menu
```

## Architecture & Key Patterns

### Tech Stack
- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, Three.js
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **Auth**: NextAuth.js with role-based access (Admin/Editor/Viewer)
- **UI Components**: Shadcn/ui components in `/components/ui`
- **File Storage**: Uploadcare integration

### Route Structure
- `/app` - Next.js 14 App Router
  - `/admin` - Protected admin panel routes
  - `/api` - API endpoints (auth, projects)
  - Public pages: home, servicios, proyectos, contacto

### Key Components Organization
- `/components/admin` - Admin-specific components (ProjectForm, ImageUploader, etc.)
- `/components/animations` - Framer Motion animated sections
- `/components/home` - Homepage sections
- `/components/layout` - Navbar, Footer
- `/components/ui` - Reusable Shadcn/ui components

### Database Schema (Prisma)
Main models: User, Proyecto, ImagenProyecto, ProgresoProyecto, Servicio, MiembroEquipo, ContactForm

### Authentication Flow
- NextAuth.js configuration in `/lib/auth.ts`
- Protected routes use middleware to check authentication
- Role-based permissions: Admin (full access), Editor (content), Viewer (read-only)

### Environment Variables
Required in `.env.local`:
- `DATABASE_URL` - PostgreSQL connection
- `NEXTAUTH_SECRET` - Auth secret
- `NEXTAUTH_URL` - Base URL
- `UPLOADCARE_PUBLIC_KEY` - File uploads

### Development Workflow
1. Database changes: Edit `prisma/schema.prisma` → Run `npm run db:push`
2. API routes: Create/edit in `/app/api/`
3. UI components: Use existing Shadcn/ui components or create new ones
4. Admin features: Add to `/app/admin/` with proper auth checks

### Deployment
- **Vercel**: Automatic deployment on push to main
- **Docker**: Use provided Dockerfile and docker-compose.yml
- **Manual**: Build with `npm run build`, serve with `npm start`