#!/usr/bin/env bash
# www.meisa.com.co → https://meisa.com.co con 301 en el edge de Cloudflare (un solo salto).
# Token: CLOUDFLARE_API_TOKEN en .env.local (permisos: Zone DNS Edit + Dynamic Redirect Edit, zona meisa.com.co).
# Orden seguro: 1) regla 301  2) solo si la regla quedó, pasa el CNAME www a proxied.
# Deshacer: poner www en nube gris (proxied:false) desde el dashboard.
set -euo pipefail
cd "$(dirname "$0")/.."
T=$(grep -E '^CLOUDFLARE_API_TOKEN=' .env.local | cut -d= -f2- | tr -d '"' | tr -d "'")
[ -n "$T" ] || { echo "Falta CLOUDFLARE_API_TOKEN en .env.local"; exit 1; }
API=https://api.cloudflare.com/client/v4/zones/c864ed8a9847e5e41ef7cd79db4dbd9a
H=(-H "Authorization: Bearer $T" -H "Content-Type: application/json")
ok() { python3 -c 'import sys,json; j=json.load(sys.stdin); print("   ok" if j["success"] else "   ERROR: %s" % j["errors"]); sys.exit(0 if j["success"] else 1)'; }

echo "1) Regla 301..."
curl -s -X PUT "${H[@]}" "$API/rulesets/phases/http_request_dynamic_redirect/entrypoint" --data @- <<'JSON' | ok || { echo "No se tocó el DNS."; exit 1; }
{"rules":[{"description":"www → meisa.com.co (301)","expression":"(http.host eq \"www.meisa.com.co\")","action":"redirect","action_parameters":{"from_value":{"status_code":301,"preserve_query_string":true,"target_url":{"expression":"concat(\"https://meisa.com.co\", http.request.uri.path)"}}},"enabled":true}]}
JSON

echo "2) www a nube naranja..."
ID=$(curl -s "${H[@]}" "$API/dns_records?type=CNAME&name=www.meisa.com.co" | python3 -c 'import sys,json; print(json.load(sys.stdin)["result"][0]["id"])')
curl -s -X PATCH "${H[@]}" "$API/dns_records/$ID" --data '{"proxied":true}' | ok && echo "   LISTO"
