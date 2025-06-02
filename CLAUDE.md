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
  - `/api` - API endpoints (auth, projects, clientes)
  - Public pages: home, servicios, proyectos, contacto

### Key Components Organization
- `/components/admin` - Admin-specific components (ProjectForm, ImageUploader, etc.)
- `/components/animations` - Framer Motion animated sections
- `/components/home` - Homepage sections
- `/components/layout` - Navbar, Footer
- `/components/ui` - Reusable Shadcn/ui components

### Database Schema (Prisma)
Main models: User, Proyecto, ImagenProyecto, ProgresoProyecto, Servicio, MiembroEquipo, ContactForm, Cliente

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

### Git Best Practices
- **ALWAYS create commits on a feature branch, NEVER directly on main**
- Create feature branches: `git checkout -b feature/your-feature-name`
- Make commits on the feature branch: `git commit -m "your commit message"`
- Push to feature branch: `git push origin feature/your-feature-name`
- Create pull request to merge into main

### MEISA Brand Colors & Design Guidelines

**Primary Brand Colors (From Logo):**
- **MEISA Blue**: `#1e40af` (blue-700) - Main brand color for primary elements and structures
- **MEISA Red**: `#dc2626` (red-600) - Logo red for important highlights and accents  
- **MEISA Dark Blue**: `#1e3a8a` (blue-800) - For headings and emphasis
- **MEISA Light Blue**: `#3b82f6` (blue-500) - For accents and hover states

**Secondary Colors:**
- **Steel Gray**: `#64748b` (slate-500) - For text and secondary elements  
- **Dark Gray**: `#334155` (slate-700) - For dark backgrounds
- **Light Gray**: `#f8fafc` (slate-50) - For light backgrounds

**Accent Colors:**
- **Success Green**: `#16a34a` (green-600) - For success states only (environmental/quality context)
- **Warning Amber**: `#f59e0b` (amber-500) - For warnings and attention
- **Error Red**: `#ef4444` (red-500) - For errors and destructive actions

**DO NOT USE:**
- Orange colors (`orange-*`) - Not part of MEISA brand palette
- Emerald colors (`emerald-*`) - Too bright, use regular green instead
- Purple colors - Reserved for specific admin functions only

**Usage Guidelines:**
- Use MEISA Blue for primary CTAs, navigation active states, and brand elements
- Use MEISA Red sparingly for important highlights and brand consistency
- Use Steel Gray for body text and secondary information  
- Avoid bright emerald greens - use darker green-600/700 when green is needed
- Gradients should primarily use blue variations: `from-blue-600 to-blue-700`
- For special highlights, can use red accent: `text-red-600`
- Hover states: transition from lighter to darker blue shades

### Deployment
- **Vercel**: Automatic deployment on push to main
- **Docker**: Use provided Dockerfile and docker-compose.yml
- **Manual**: Build with `npm run build`, serve with `npm start`