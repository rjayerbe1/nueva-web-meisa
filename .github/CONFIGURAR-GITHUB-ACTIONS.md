# Configurar GitHub Actions para Deploy Automático

Este documento te guía paso a paso para configurar el deploy automático a Google Cloud Run usando GitHub Actions.

## ✅ Ya Configurado (por Claude)

1. ✅ Service Account creado: `github-actions-deployer@meisa-web-prod-2025.iam.gserviceaccount.com`
2. ✅ Permisos configurados:
   - `roles/run.admin` - Para desplegar a Cloud Run
   - `roles/iam.serviceAccountUser` - Para actuar como service account
   - `roles/cloudbuild.builds.builder` - Para construir imágenes Docker
3. ✅ Llave JSON creada: `/Users/rjayerbe/github-actions-key.json`
4. ✅ Workflow configurado: `.github/workflows/deploy-to-cloudrun.yml`

## ⏳ Pendiente (Requiere Acceso a GitHub.com)

Necesitas agregar **4 secretos** en GitHub para que el workflow funcione.

### Paso 1: Ir a la Configuración de Secretos

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral izquierdo, ve a **Secrets and variables** → **Actions**
4. Haz clic en **New repository secret**

### Paso 2: Agregar el Secreto GCP_SA_KEY

Este es el contenido del archivo JSON del Service Account.

**Nombre del secreto:** `GCP_SA_KEY`

**Valor:** Copia TODO el contenido del archivo `/Users/rjayerbe/github-actions-key.json`

```bash
# Para copiar el contenido al portapapeles en Mac:
cat ~/github-actions-key.json | pbcopy

# O abre el archivo y copia su contenido:
cat ~/github-actions-key.json
```

El contenido se ve así (NO compartas este contenido):
```json
{
  "type": "service_account",
  "project_id": "meisa-web-prod-2025",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "github-actions-deployer@meisa-web-prod-2025.iam.gserviceaccount.com",
  "client_id": "...",
  ...
}
```

### Paso 3: Agregar el Secreto DATABASE_URL

**Nombre del secreto:** `DATABASE_URL`

**Valor:**
```
postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Paso 4: Agregar el Secreto NEXTAUTH_SECRET

**Nombre del secreto:** `NEXTAUTH_SECRET`

**Valor:** Genera una clave secreta aleatoria de 32+ caracteres.

```bash
# Puedes generar una así:
openssl rand -base64 32

# O usar este comando:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copia el resultado y úsalo como valor del secreto.

### Paso 5: Agregar el Secreto NEXTAUTH_URL

**Nombre del secreto:** `NEXTAUTH_URL`

**Valor:** La URL de producción de tu aplicación en Cloud Run

```
https://meisa-web-660800767729.us-central1.run.app
```

(Nota: Esta URL puede cambiar si el servicio se recrea. Verifica la URL actual después del primer deploy)

## 🚀 Cómo Funciona

Una vez configurados los secretos:

1. **Push a main** → GitHub Actions se activa automáticamente
2. **Build** → Cloud Build construye la imagen Docker de la aplicación
3. **Deploy** → Cloud Run despliega la nueva versión
4. **Live** → Tu sitio web se actualiza automáticamente

### Workflow Automático

```
git add .
git commit -m "mi cambio"
git push origin main
```

↓ ↓ ↓

```
GitHub Actions se activa
   ↓
Cloud Build construye imagen
   ↓
Cloud Run despliega
   ↓
✅ Sitio actualizado en producción
```

## 🔍 Monitorear Deploys

Puedes ver el progreso de los deploys en:

1. **GitHub Actions**: https://github.com/TU_USUARIO/nueva-web-meisa/actions
2. **Cloud Build**: https://console.cloud.google.com/cloud-build/builds?project=meisa-web-prod-2025
3. **Cloud Run**: https://console.cloud.google.com/run?project=meisa-web-prod-2025

## ⚠️ Importante

1. **NO compartas** el contenido de `github-actions-key.json` con nadie
2. **NO subas** el archivo `github-actions-key.json` a GitHub
3. Después de agregar los secretos, **borra** el archivo local:
   ```bash
   rm ~/github-actions-key.json
   ```

## 📝 Próximos Pasos

1. ✅ Agregar los 4 secretos en GitHub (como se explicó arriba)
2. ✅ Hacer push a main para probar el deploy automático
3. ✅ Verificar que el deploy se ejecuta correctamente
4. ✅ Borrar el archivo local `~/github-actions-key.json`

## 🆘 Troubleshooting

**Error: "permission denied"**
- Verifica que los 4 secretos estén configurados correctamente
- Verifica que copiaste TODO el contenido del JSON (incluyendo las llaves `{` `}`)

**Error: "failed to build"**
- Verifica que el código compile localmente: `npm run build`
- Revisa los logs en Cloud Build para ver el error específico

**Error: "service not found"**
- El workflow creará el servicio automáticamente en el primer deploy
- Verifica el nombre del servicio en el archivo `.github/workflows/deploy-to-cloudrun.yml`

## 📚 Recursos

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [Workflow File](.github/workflows/deploy-to-cloudrun.yml)
