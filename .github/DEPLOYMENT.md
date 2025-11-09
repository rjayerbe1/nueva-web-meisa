# Configuración de Deployment Automático a Google Cloud Run

Este repositorio está configurado para hacer deployment automático a Google Cloud Run cada vez que se hace push a la rama `main`.

## Paso 1: Crear Service Account en Google Cloud

1. Ve a la [Consola de Google Cloud](https://console.cloud.google.com/)
2. Selecciona el proyecto `meisa-web-prod-2025`
3. Ve a **IAM & Admin** > **Service Accounts**
4. Click en **CREATE SERVICE ACCOUNT**
5. Nombre: `github-actions-deployer`
6. Asigna estos roles:
   - Cloud Run Admin
   - Service Account User
   - Storage Admin (para Cloud Build)

7. Click en la service account creada
8. Ve a **KEYS** > **ADD KEY** > **Create new key**
9. Selecciona **JSON** y descarga el archivo
10. Copia el contenido completo del archivo JSON

## Paso 2: Configurar Secretos en GitHub

1. Ve a tu repositorio en GitHub
2. Click en **Settings** > **Secrets and variables** > **Actions**
3. Click en **New repository secret**

Agrega los siguientes secretos:

### GCP_SA_KEY
- **Valor**: El contenido completo del archivo JSON descargado en el Paso 1

### DATABASE_URL
- **Valor**: `postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require`

### NEXTAUTH_SECRET
- **Valor**: Una cadena aleatoria segura (puedes generar una con `openssl rand -base64 32`)

### NEXTAUTH_URL
- **Valor**: `https://meisa-web-660800767729.us-central1.run.app`

## Paso 3: Activar GitHub Actions

1. Ve a la pestaña **Actions** en tu repositorio
2. Si GitHub Actions está deshabilitado, haz click en **I understand my workflows, go ahead and enable them**

## Cómo Funciona

Una vez configurado, el deployment automático funciona así:

1. Haces cambios en tu código localmente
2. Haces commit: `git commit -m "tu mensaje"`
3. Haces push a main: `git push origin main`
4. GitHub Actions detecta el push
5. Automáticamente construye y despliega a Cloud Run
6. Puedes ver el progreso en la pestaña **Actions** de GitHub

## Flujo de Trabajo Recomendado

### Desarrollo
```bash
# Trabajar en una rama de feature
git checkout -b feature/nueva-funcionalidad

# Hacer cambios y commits
git add .
git commit -m "feat: agregar nueva funcionalidad"

# Push a la rama de feature
git push origin feature/nueva-funcionalidad
```

### Deploy a Producción
```bash
# Merge a main (esto dispara el deployment automático)
git checkout main
git merge feature/nueva-funcionalidad
git push origin main

# O crear un Pull Request en GitHub y hacer merge desde ahí
```

## Monitorear Deployments

- Ve a la pestaña **Actions** en GitHub para ver el estado del deployment
- Ve a [Cloud Run Console](https://console.cloud.google.com/run?project=meisa-web-prod-2025) para ver el servicio en producción
- URL del sitio: https://meisa-web-660800767729.us-central1.run.app

## Troubleshooting

Si el deployment falla:

1. Revisa los logs en la pestaña **Actions** de GitHub
2. Verifica que todos los secretos estén configurados correctamente
3. Asegúrate de que la Service Account tenga los permisos necesarios
4. Revisa los logs de Cloud Build en la consola de Google Cloud
