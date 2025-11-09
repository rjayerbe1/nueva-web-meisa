# 🚀 Guía de Deployment - MEISA Web en Google Cloud Run

## ✅ Pre-requisitos Completados

- ✅ Node 20 configurado
- ✅ Dockerfile optimizado
- ✅ next.config.js con `output: 'standalone'`
- ✅ .dockerignore creado
- ✅ cloudrun.yaml configurado

---

## 📋 Paso 1: Crear Cuenta y Proyecto en Google Cloud

### 1.1 Crear cuenta Google Cloud

1. Ve a: https://console.cloud.google.com/
2. Si es tu primera vez:
   - Click en "Empezar gratis"
   - Ingresa tarjeta de crédito (NO te cobran sin autorización)
   - **Recibes $300 USD gratis** por 90 días
3. Inicia sesión con tu cuenta de Google

### 1.2 Crear nuevo proyecto

```bash
# Opción A: Desde la web
1. Ve a: https://console.cloud.google.com/projectcreate
2. Nombre del proyecto: "MEISA Web Production"
3. ID del proyecto: "meisa-web-prod" (o el que te asigne Google)
4. Click "Crear"

# Opción B: Desde terminal (después de instalar gcloud)
gcloud projects create meisa-web-prod \
  --name="MEISA Web Production"
```

**Anota el ID del proyecto**, lo necesitarás después.

---

## 📥 Paso 2: Instalar Google Cloud CLI

### En macOS (tu caso):

```bash
# Opción 1: Con Homebrew (recomendado)
brew install --cask google-cloud-sdk

# Opción 2: Descarga directa
# Ve a: https://cloud.google.com/sdk/docs/install
```

### Verificar instalación:

```bash
gcloud --version
# Debe mostrar: Google Cloud SDK 4XX.X.X
```

---

## 🔐 Paso 3: Autenticar y Configurar

```bash
# 1. Login a Google Cloud
gcloud auth login
# Se abre navegador, inicia sesión con tu cuenta

# 2. Configurar proyecto
gcloud config set project meisa-web-prod
# Reemplaza "meisa-web-prod" con tu ID de proyecto

# 3. Habilitar APIs necesarias
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com

# Esto toma 1-2 minutos
```

---

## 🗄️ Paso 4: Configurar Base de Datos PostgreSQL

### Opción A: Neon PostgreSQL (GRATIS - Recomendado para empezar)

```bash
# 1. Ve a: https://neon.tech/
# 2. Crea cuenta gratis
# 3. Crea nuevo proyecto: "meisa-production"
# 4. Región: US East (Ohio) - cercano a Cloud Run
# 5. Copia la CONNECTION STRING, se ve así:
#    postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb
```

### Opción B: Cloud SQL PostgreSQL (Pago ~$7/mes)

```bash
# Crear instancia Cloud SQL
gcloud sql instances create meisa-postgres \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Crear base de datos
gcloud sql databases create meisa_db \
  --instance=meisa-postgres

# Crear usuario
gcloud sql users create meisa_user \
  --instance=meisa-postgres \
  --password=TU_PASSWORD_SEGURO_AQUI
```

---

## 🔑 Paso 5: Preparar Variables de Entorno

Crea un archivo temporal `env-vars.txt` con tus variables:

```bash
# NO subas este archivo a Git
# Crea este archivo localmente

DATABASE_URL=postgresql://user:password@host:5432/meisa_db
NEXTAUTH_SECRET=genera-un-secreto-aleatorio-largo-aqui-min-32-caracteres
NEXTAUTH_URL=https://tu-dominio-temporal.run.app
UPLOADCARE_PUBLIC_KEY=tu-clave-publica-uploadcare
UPLOADCARE_SECRET_KEY=tu-clave-secreta-uploadcare
```

### Generar NEXTAUTH_SECRET:

```bash
# En terminal:
openssl rand -base64 32
# Copia el resultado y úsalo en NEXTAUTH_SECRET
```

---

## 🚀 Paso 6: Hacer el Deployment

### 6.1 Deployment Inicial (primera vez)

```bash
# Asegúrate de estar en la carpeta del proyecto
cd "/Users/rjayerbe/Web Development Local/meisa.com.co/nueva-web-meisa"

# Deploy a Cloud Run
gcloud run deploy meisa-web \
  --source . \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1 \
  --max-instances=10 \
  --min-instances=0 \
  --timeout=60s \
  --set-env-vars="NODE_ENV=production,PORT=3000" \
  --set-env-vars="DATABASE_URL=TU_DATABASE_URL_AQUI" \
  --set-env-vars="NEXTAUTH_SECRET=TU_NEXTAUTH_SECRET_AQUI" \
  --set-env-vars="UPLOADCARE_PUBLIC_KEY=TU_UPLOADCARE_KEY_AQUI"

# ⏱️ Este proceso toma 5-10 minutos la primera vez
```

### 6.2 Ver progreso

```bash
# Durante el deployment verás:
# 1. Building... (3-5 min)
# 2. Pushing... (1-2 min)
# 3. Deploying... (1-2 min)
# 4. ✅ Service [meisa-web] deployed

# Al final te dará una URL:
# https://meisa-web-XXXXX-uc.a.run.app
```

---

## ✅ Paso 7: Ejecutar Migraciones de Prisma

```bash
# IMPORTANTE: Después del primer deployment
# Necesitas crear las tablas en la base de datos

# Opción 1: Desde Cloud Run Shell
gcloud run services proxy meisa-web --region=us-central1
# En otra terminal:
npx prisma db push

# Opción 2: Localmente (recomendado)
# 1. Configura DATABASE_URL en tu .env.local con la URL de producción
# 2. Ejecuta:
npx prisma db push

# 3. Crear usuario admin inicial:
npx prisma db seed
```

---

## 🔄 Paso 8: Deployments Posteriores (Updates)

Para actualizar después de hacer cambios:

```bash
# Comando corto para re-deploy
gcloud run deploy meisa-web \
  --source . \
  --region=us-central1

# Solo toma 2-3 minutos
```

---

## 🌐 Paso 9: Configurar Dominio Personalizado (Opcional)

### Para usar meisa.com.co en lugar del dominio temporal:

```bash
# 1. Crear mapeo de dominio
gcloud run domain-mappings create \
  --service=meisa-web \
  --domain=www.meisa.com.co \
  --region=us-central1

# 2. Google te dará registros DNS para configurar:
# Tipo: CNAME
# Nombre: www
# Valor: ghs.googlehosted.com

# 3. Ve a tu proveedor de dominio (GoDaddy, Namecheap, etc.)
# 4. Agrega el registro CNAME
# 5. Espera 5-60 minutos para propagación DNS
```

---

## 📊 Paso 10: Monitoreo y Logs

### Ver logs en tiempo real:

```bash
# Ver logs recientes
gcloud run services logs read meisa-web \
  --region=us-central1 \
  --limit=50

# Seguir logs en tiempo real
gcloud run services logs tail meisa-web \
  --region=us-central1
```

### Ver métricas y costos:

```bash
# Dashboard de Cloud Run
# https://console.cloud.google.com/run

# Facturación
# https://console.cloud.google.com/billing
```

---

## 💰 Estimación de Costos

### Con tu tráfico estimado (100-500 visitas/día):

```
Cloud Run (512MB RAM, 1 CPU):
- Primeros 2M requests: GRATIS
- CPU time: ~$0.50/mes
- Memoria: ~$0.30/mes
- Requests: $0.00 (dentro cuota gratis)

Base de datos:
- Neon PostgreSQL: $0/mes (plan gratis)
- Cloud SQL: $7/mes

Total estimado: $1-8 USD/mes
```

---

## 🆘 Solución de Problemas

### Error: "Permission denied"

```bash
# Asegúrate de tener permisos
gcloud projects add-iam-policy-binding meisa-web-prod \
  --member=user:TU_EMAIL@gmail.com \
  --role=roles/run.admin
```

### Error: "Service unavailable"

```bash
# Ver logs para diagnóstico
gcloud run services logs read meisa-web --region=us-central1

# Revisar que DATABASE_URL esté correcta
gcloud run services describe meisa-web --region=us-central1 --format=json
```

### Error: Build failed

```bash
# Limpiar caché y reintentar
gcloud builds submit --no-cache --tag gcr.io/meisa-web-prod/meisa-web
```

---

## 🎯 Comandos Útiles

```bash
# Ver servicios desplegados
gcloud run services list

# Ver detalles del servicio
gcloud run services describe meisa-web --region=us-central1

# Actualizar variables de entorno
gcloud run services update meisa-web \
  --region=us-central1 \
  --set-env-vars="NEW_VAR=value"

# Escalar manualmente
gcloud run services update meisa-web \
  --region=us-central1 \
  --max-instances=20 \
  --min-instances=1

# Eliminar servicio (si necesitas)
gcloud run services delete meisa-web --region=us-central1
```

---

## 📞 Soporte

- **Documentación Cloud Run**: https://cloud.google.com/run/docs
- **Comunidad**: https://stackoverflow.com/questions/tagged/google-cloud-run
- **Status de Google Cloud**: https://status.cloud.google.com/

---

## ✅ Checklist Final

- [ ] Cuenta Google Cloud creada
- [ ] Proyecto "meisa-web-prod" creado
- [ ] gcloud CLI instalado
- [ ] APIs habilitadas
- [ ] Base de datos PostgreSQL configurada
- [ ] Variables de entorno preparadas
- [ ] Primer deployment exitoso
- [ ] Prisma migrations ejecutadas
- [ ] Usuario admin creado
- [ ] Sitio funcionando en URL temporal
- [ ] (Opcional) Dominio personalizado configurado

---

**¡Listo para deployment! 🚀**

Para empezar, sigue desde el **Paso 1** si no tienes cuenta de Google Cloud, o desde el **Paso 2** si ya la tienes.
