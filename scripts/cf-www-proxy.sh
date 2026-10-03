#!/usr/bin/env bash
# Pone www.meisa.com.co en nube naranja (proxied) usando el token DNS de la VM mcp-server.
# Con SSL "full", Cloudflare llama a Cloud Run por HTTPS → la app responde 308 → meisa.com.co (un solo salto).
# Uso: bash scripts/cf-www-proxy.sh [true|false]   (false = deshacer)
set -euo pipefail
P="${1:-true}"
gcloud compute ssh mcp-server --zone=us-central1-a --project=produccion-reportes --tunnel-through-iap --command="
T=\$(sed -n '/BEGIN ARGO TUNNEL TOKEN/,/END ARGO TUNNEL TOKEN/p' ~/.cloudflared/cert.pem | grep -v ARGO | tr -d '\n' | base64 -d | python3 -c 'import sys,json; print(json.load(sys.stdin)[\"apiToken\"])')
API=https://api.cloudflare.com/client/v4/zones/c864ed8a9847e5e41ef7cd79db4dbd9a/dns_records/59e0ddaad16cf5d6175faff68a2a574c
curl -s -X PATCH -H \"Authorization: Bearer \$T\" -H 'Content-Type: application/json' \"\$API\" --data '{\"proxied\":$P}' | python3 -c 'import sys,json; j=json.load(sys.stdin); print(\"ok proxied=\", j[\"result\"][\"proxied\"]) if j[\"success\"] else print(\"ERROR\", j[\"errors\"])'
"
