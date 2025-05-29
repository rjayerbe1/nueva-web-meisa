#!/bin/bash

echo "🚀 Configurando base de datos para MEISA..."

# Añadir PostgreSQL al PATH
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"

# Verificar si PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "📦 Instalando PostgreSQL..."
    brew install postgresql@15
    brew services start postgresql@15
else
    echo "✅ PostgreSQL ya está instalado"
fi

# Iniciar PostgreSQL si no está corriendo
brew services start postgresql@15

# Esperar a que PostgreSQL esté listo
sleep 5

# Crear la base de datos
echo "🗄️ Creando base de datos meisa_db..."
/opt/homebrew/opt/postgresql@15/bin/createdb meisa_db 2>/dev/null || echo "Base de datos ya existe"

# Verificar que la base de datos fue creada
if /opt/homebrew/opt/postgresql@15/bin/psql -lqt | cut -d \| -f 1 | grep -qw meisa_db; then
    echo "✅ Base de datos meisa_db creada/verificada"
else
    echo "❌ Error creando la base de datos"
    exit 1
fi

echo "🔄 Sincronizando esquema de Prisma..."
npx prisma db push

echo "📊 Inicializando datos..."
npx tsx scripts/init-db.ts

echo "🎉 ¡Configuración completada!"
echo ""
echo "📝 Credenciales de acceso:"
echo "   Email: admin@meisa.com.co"
echo "   Password: admin123"
echo ""
echo "🌐 Accede al panel admin en: http://localhost:3000/auth/signin"