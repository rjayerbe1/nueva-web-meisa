/**
 * Prioriza las 13 landings SEO según la demanda REAL que MEISA ya recibe
 * por cada tema en Search Console (impresiones/posición de queries que
 * contienen la keyword del tema), ventana 90 días.
 */
import fs from "node:fs"; import { JWT } from "google-auth-library"
const env={}; for(const l of fs.readFileSync(".env.local","utf8").split("\n")){const m=l.match(/^([A-Z0-9_]+)=(.*)$/); if(m){let v=m[2].trim(); if((v[0]==='"'&&v.endsWith('"'))||(v[0]==="'"&&v.endsWith("'")))v=v.slice(1,-1); env[m[1]]=v}}
const c=JSON.parse(env.ANALYTICS_SA_KEY_JSON)
const jwt=new JWT({email:c.client_email,key:c.private_key.replace(/\\n/g,"\n"),scopes:["https://www.googleapis.com/auth/webmasters.readonly"]})
const {token}=await jwt.getAccessToken()
const SITE=encodeURIComponent(env.SC_SITE_URL)
const endpoint=`https://www.googleapis.com/webmasters/v3/sites/${SITE}/searchAnalytics/query`
const d=x=>x.toISOString().slice(0,10)
const today=new Date(); const start=new Date(); start.setDate(start.getDate()-90)
const startDate=d(start), endDate=d(today)

async function q(body){
  const r=await fetch(endpoint,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify(body)})
  if(!r.ok){console.error("ERR",r.status,(await r.text()).slice(0,200)); return {rows:[]}}
  return r.json()
}

// Landing -> términos que disparan demanda de ese tema (operador contains, OR via varios filtros)
const LANDINGS=[
  {cluster:"Solución", url:"/soluciones/estructura-metalica-para-bodegas", terms:["bodega","galpon","galpón"]},
  {cluster:"Solución", url:"/soluciones/puentes-metalicos", terms:["puente"]},
  {cluster:"Solución", url:"/soluciones/cubiertas-metalicas", terms:["cubierta","fachada"]},
  {cluster:"Solución", url:"/soluciones/estructura-metalica-centros-comerciales", terms:["centro comercial","comercial"]},
  {cluster:"Solución", url:"/soluciones/estructura-metalica-escenarios-deportivos", terms:["deportivo","coliseo","estadio","escenario"]},
  {cluster:"Solución", url:"/soluciones/edificios-en-estructura-metalica", terms:["edificio"]},
  {cluster:"Guía", url:"/precios-estructuras-metalicas", terms:["precio","costo","valor","cuanto cuesta","cuánto cuesta"]},
  {cluster:"Guía", url:"/estructura-metalica-vs-concreto", terms:["concreto","hormigon","hormigón","vs"]},
  {cluster:"Guía", url:"/tipos-de-estructuras-metalicas", terms:["tipos de","tipo de estructura","clases de"]},
  {cluster:"Guía", url:"/peso-estructura-metalica-por-m2", terms:["peso","kg/m","kilos","cuanto pesa"]},
  {cluster:"Ciudad", url:"/estructuras-metalicas/cali", terms:["cali"]},
  {cluster:"Ciudad", url:"/estructuras-metalicas/bogota", terms:["bogota","bogotá"]},
  {cluster:"Ciudad", url:"/estructuras-metalicas/popayan", terms:["popayan","popayán"]},
]

// Demanda genérica de la categoría madre (para contexto)
const generic=await q({startDate,endDate,dimensions:["query"],
  dimensionFilterGroups:[{filters:[{dimension:"query",operator:"contains",expression:"estructura"}]}],rowLimit:500})
const genImpr=(generic.rows??[]).reduce((a,r)=>a+(r.impressions||0),0)
const genClk=(generic.rows??[]).reduce((a,r)=>a+(r.clicks||0),0)
console.log(`Ventana: ${startDate} -> ${endDate} (90d)`)
console.log(`Demanda genérica "estructura*": ${genImpr} impr, ${genClk} clicks, ${(generic.rows??[]).length} queries\n`)

const results=[]
for(const L of LANDINGS){
  // un request por término, sumamos (dedupe por query)
  const seen=new Map()
  for(const t of L.terms){
    const res=await q({startDate,endDate,dimensions:["query"],
      dimensionFilterGroups:[{filters:[{dimension:"query",operator:"contains",expression:t}]}],rowLimit:200})
    for(const r of res.rows??[]){
      const k=r.keys[0]
      if(!seen.has(k)) seen.set(k,r)
    }
  }
  const rows=[...seen.values()]
  const impr=rows.reduce((a,r)=>a+(r.impressions||0),0)
  const clk=rows.reduce((a,r)=>a+(r.clicks||0),0)
  const wpos=impr? rows.reduce((a,r)=>a+(r.position||0)*(r.impressions||0),0)/impr : 0
  const top=rows.sort((a,b)=>b.impressions-a.impressions).slice(0,4)
    .map(r=>`${r.keys[0]} (${r.impressions}i/${r.clicks}c/p${(r.position||0).toFixed(0)})`)
  results.push({...L, impr, clk, nq:rows.length, wpos, top})
}

results.sort((a,b)=>b.impr-a.impr)
console.log("=== DEMANDA POR LANDING (orden desc por impresiones, 90d) ===\n")
for(const r of results){
  console.log(`${String(r.impr).padStart(4)} impr | ${String(r.clk).padStart(3)} clk | pos ${r.wpos? r.wpos.toFixed(1):"-"} | ${r.nq} queries | [${r.cluster}] ${r.url}`)
  if(r.top.length) console.log(`        top: ${r.top.join("  ·  ")}`)
}

// Páginas viejas (WordPress) que ya rankean -> verticales con demanda probada
console.log("\n=== PÁGINAS ACTUALES QUE YA RECIBEN IMPRESIONES (90d, top 25) ===")
const pages=await q({startDate,endDate,dimensions:["page"],rowLimit:40})
for(const r of (pages.rows??[]).slice(0,25)){
  console.log(`${String(r.impressions).padStart(4)} impr | ${String(r.clicks).padStart(3)} clk | pos ${(r.position||0).toFixed(1)} | ${r.keys[0].replace("https://meisa.com.co","").replace("http://www.meisa.com.co","[www]").replace("http://meisa.com.co","[http]")}`)
}
