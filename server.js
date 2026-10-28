import express from 'express';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { refreshListings } from './src/engine.mjs';
const app=express();const root=path.dirname(fileURLToPath(import.meta.url));
// Hostinger loads the entry through CommonJS require(), so keep the ESM graph
// synchronous and perform any first-run build inside the startup function.
async function start() {
if (!existsSync(path.join(root,'dist','index.html'))) await import('./scripts/build.mjs');
app.disable('x-powered-by');
app.use((req,res,next)=>{res.set({'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'geolocation=(), camera=(), microphone=()','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com; connect-src 'self'; manifest-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"});next();});
// A single in-flight check is shared across simultaneous visitors. Completed checks
// are never reused: a new refresh reads the sources again.
let inFlight;
app.get('/api/listings',async(req,res)=>{
 res.set('Cache-Control','no-store, max-age=0');
 try{if(!inFlight)inFlight=refreshListings().finally(()=>{inFlight=null;});res.json(await inFlight);}catch{res.status(503).json({error:'Source refresh is temporarily unavailable. Please try again.'});}
});
app.get('/api/health',(_req,res)=>res.set('Cache-Control','no-store').json({status:'ok',service:'denver-afterhours',version:'1.0.0'}));
app.use(express.static(path.join(root,'dist'),{etag:true,maxAge:0,setHeaders(res,file){if(file.endsWith('sw.js'))res.set('Cache-Control','no-store');}}));
app.use((_req,res)=>res.status(404).type('text').send('Not found'));
const port=Number(process.env.PORT||4318);const host=process.env.HOST||'0.0.0.0';
app.listen(port,host,()=>console.log(`Denver Afterhours listening on http://${host}:${port}`));

}
start().catch(error=>{console.error('Application startup failed:',error.message);process.exitCode=1;});
