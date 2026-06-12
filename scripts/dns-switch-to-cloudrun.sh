#!/bin/bash
# Switch de meisa.com.co (apex + www) de Hostinger a Cloud Run.
# Se ejecuta DENTRO del VM mcp-server (tiene el API token de Cloudflare):
#   gcloud compute ssh mcp-server --zone=us-central1-a --project=produccion-reportes \
#     --tunnel-through-iap --command="bash -s" < scripts/dns-switch-to-cloudrun.sh
#
# Rollback: restaurar los registros originales de Hostinger (ver bloque al final).
set -euo pipefail

ZONE=c864ed8a9847e5e41ef7cd79db4dbd9a
API_KEY=$(sed -n "/BEGIN ARGO TUNNEL TOKEN/,/END ARGO TUNNEL TOKEN/p" ~/.cloudflared/cert.pem | grep -v "ARGO" | tr -d "\n" | base64 -d | python3 -c "import sys,json; print(json.load(sys.stdin)['apiToken'])")
API="https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records"
AUTH=(-H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json")

echo "== 1. Borrando A/AAAA viejos del apex (Hostinger) =="
for id in $(curl -s "${AUTH[@]}" "$API?name=meisa.com.co&type=A" | python3 -c "import sys,json; [print(r['id']) for r in json.load(sys.stdin)['result']]"); do
  curl -s "${AUTH[@]}" -X DELETE "$API/$id" > /dev/null && echo "  A $id borrado"
done
for id in $(curl -s "${AUTH[@]}" "$API?name=meisa.com.co&type=AAAA" | python3 -c "import sys,json; [print(r['id']) for r in json.load(sys.stdin)['result']]"); do
  curl -s "${AUTH[@]}" -X DELETE "$API/$id" > /dev/null && echo "  AAAA $id borrado"
done

echo "== 2. Creando A/AAAA de Cloud Run (DNS only) =="
for ip in 216.239.32.21 216.239.34.21 216.239.36.21 216.239.38.21; do
  curl -s "${AUTH[@]}" -X POST "$API" -d "{\"type\":\"A\",\"name\":\"meisa.com.co\",\"content\":\"$ip\",\"ttl\":1,\"proxied\":false}" | python3 -c "import sys,json; d=json.load(sys.stdin); print('  A '+d['result']['content'] if d['success'] else d['errors'])"
done
for ip6 in 2001:4860:4802:32::15 2001:4860:4802:34::15 2001:4860:4802:36::15 2001:4860:4802:38::15; do
  curl -s "${AUTH[@]}" -X POST "$API" -d "{\"type\":\"AAAA\",\"name\":\"meisa.com.co\",\"content\":\"$ip6\",\"ttl\":1,\"proxied\":false}" | python3 -c "import sys,json; d=json.load(sys.stdin); print('  AAAA '+d['result']['content'] if d['success'] else d['errors'])"
done

echo "== 3. www -> CNAME ghs.googlehosted.com (DNS only) =="
WWW_ID=$(curl -s "${AUTH[@]}" "$API?name=www.meisa.com.co&type=CNAME" | python3 -c "import sys,json; print(json.load(sys.stdin)['result'][0]['id'])")
curl -s "${AUTH[@]}" -X PUT "$API/$WWW_ID" -d '{"type":"CNAME","name":"www","content":"ghs.googlehosted.com","ttl":1,"proxied":false}' | python3 -c "import sys,json; d=json.load(sys.stdin); print('  www OK' if d['success'] else d['errors'])"

echo "== Listo. Cert SSL tarda 5-30 min en emitirse. =="

# ---------------------------------------------------------------------------
# ROLLBACK (volver a Hostinger / WordPress) — registros originales 2026-06-12:
#   A    meisa.com.co -> 92.112.198.190   (proxied=true)
#   A    meisa.com.co -> 148.135.128.249  (proxied=true)
#   AAAA meisa.com.co -> 2a02:4780:51:3fd1:b32c:6bef:627a:e1f8 (proxied=true)
#   AAAA meisa.com.co -> 2a02:4780:4f:93c4:2c4a:8f72:83da:c676 (proxied=true)
#   CNAME www -> www.meisa.com.co.cdn.hstgr.net (proxied=true)
# Borrar los registros de Google y recrear estos. Propaga en minutos.
# ---------------------------------------------------------------------------
