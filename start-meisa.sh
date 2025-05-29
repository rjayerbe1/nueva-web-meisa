#!/bin/bash

echo "🚀 Iniciando sistema MEISA..."

# Verificar que PostgreSQL esté corriendo
if ! pgrep -x "postgres" > /dev/null; then
    echo "📦 Iniciando PostgreSQL..."
    brew services start postgresql@15
    sleep 3
fi

# Matar procesos en puertos 3000 y 3001
echo "🔄 Liberando puertos..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Iniciar servidor en puerto 3000
echo "🌐 Iniciando servidor Next.js en puerto 3000..."
export DATABASE_URL="postgresql://rjayerbe@localhost:5432/meisa_db"
npm run dev

echo ""
echo "✅ Sistema MEISA iniciado correctamente!"
echo ""
echo "🔗 URLs disponibles:"
echo "   Sitio web: http://localhost:3000"
echo "   Login admin: http://localhost:3000/auth/signin"
echo "   Panel admin: http://localhost:3000/admin"
echo ""
echo "🔐 Credenciales de acceso:"
echo "   Email: admin@meisa.com.co"
echo "   Password: admin123"