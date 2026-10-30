import {mkdir,readFile,writeFile,copyFile,rm} from 'node:fs/promises';
import {LISTINGS,RESEARCHED_AT,DOWNTOWN} from '../src/data.mjs';
import {distanceMiles} from '../src/engine.mjs';
const out=new URL('../dist/',import.meta.url);await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
for(const file of ['index.html','styles.css','app.js','sw.js','icon.svg','icon-192.png','icon-512.png','sports.svg'])await copyFile(new URL('../src/'+file,import.meta.url),new URL(file,out));
const seed={listings:LISTINGS.map(x=>({...x,distance:distanceMiles(x.lat,x.lng),sourceStatus:null})),researchAt:RESEARCHED_AT,downtown:DOWNTOWN};
await writeFile(new URL('seed.js',out),'window.DENVER_SEED='+JSON.stringify(seed).replaceAll('<','\\u003c')+';\n');
await writeFile(new URL('manifest.webmanifest',out),JSON.stringify({name:'Denver Afterhours',short_name:'Afterhours',id:'/',description:'A little less planned. Denver flash tattoos, local deals, and pop-up events.',start_url:'/',scope:'/',display:'standalone',background_color:'#f5f4ee',theme_color:'#f5f4ee',icons:[{src:'./icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:'./icon-512.png',sizes:'512x512',type:'image/png',purpose:'any'},{src:'./icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}]},null,2));
console.log(`Built dist: ${LISTINGS.length} researched listings, app shell, and PWA assets.`);
