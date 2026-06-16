/**
 * Vigía del sitemap en Search Console: poll cada 5 min hasta que Google
 * lo re-descargue (lastDownloaded deja de ser null) o se agoten los intentos.
 */
import fs from "node:fs"; import { JWT } from "google-auth-library"
const env={}; for(const l of fs.readFileSync(".env.local","utf8").split("\n")){const m=l.match(/^([A-Z0-9_]+)=(.*)$/); if(m){let v=m[2].trim(); if((v[0]==='"'&&v.endsWith('"'))||(v[0]==="'"&&v.endsWith("'")))v=v.slice(1,-1); env[m[1]]=v}}
const c=JSON.parse(env.ANALYTICS_SA_KEY_JSON)
const site=encodeURIComponent(env.SC_SITE_URL)
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))

async function check(){
  const jwt=new JWT({email:c.client_email,key:c.private_key.replace(/\\n/g,"\n"),scopes:["https://www.googleapis.com/auth/webmasters.readonly"]})
  const {token}=await jwt.getAccessToken()
  const r=await fetch(`https://www.googleapis.com/webmasters/v3/sites/${site}/sitemaps`,{headers:{Authorization:`Bearer ${token}`}})
  const j=await r.json()
  return (j.sitemap??[])[0] ?? {}
}

const MAX=24 // 24 x 5min = 2h
for(let i=1;i<=MAX;i++){
  let s
  try{ s=await check() }catch(e){ console.log(`[${i}] error: ${e.message}`); await sleep(300000); continue }
  const dl=s.lastDownloaded??null
  console.log(`[intento ${i}/${MAX}] lastDownloaded=${dl??"(aún no)"} pending=${s.isPending??false} errors=${s.errors??0} warnings=${s.warnings??0}`)
  if(dl){
    console.log(`\n✅✅ GOOGLE RE-DESCARGÓ EL SITEMAP a las ${dl}`)
    console.log(`   errors=${s.errors??0} warnings=${s.warnings??0}`)
    console.log(s.errors>0 ? "   ⚠️ tiene errores — revisar en Search Console" : "   Sin errores. El sitemap quedó OK; ahora empieza a descubrir las 305 URLs.")
    process.exit(0)
  }
  if(i<MAX) await sleep(300000)
}
console.log("\n⏳ 2h sin re-descarga todavía. Normal si el sitio es nuevo para Google; volver a correr el vigía o revisar mañana.")
