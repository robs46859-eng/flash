import { LISTINGS, RESEARCHED_AT, DOWNTOWN, EVENT_LOCATIONS } from './data.mjs';
export function plainText(html) {
 return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&#x([\da-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/\s+/g,' ').trim();
}
export function structuredData(html) {
 const nodes=[];function walk(v){if(!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(walk);return;}if(v['@type'])nodes.push(v);for(const [k,x] of Object.entries(v))if(k!=='@context')walk(x);}
 for(const match of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){try{walk(JSON.parse(match[1]));}catch{}}
 return nodes;
}
export function distanceMiles(lat,lng){if(!Number.isFinite(lat)||!Number.isFinite(lng))return null;const rad=x=>x*Math.PI/180;const dlat=rad(lat-39.7527),dlng=rad(lng+104.9992);const a=Math.sin(dlat/2)**2+Math.cos(rad(lat))*Math.cos(rad(39.7527))*Math.sin(dlng/2)**2;return Math.round(3958.8*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))*10)/10;}
export function safeURL(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}}
export function extractPrice(rule,text){
 const rules={certified:/Tiny\s*2[\s\S]{0,45}?\$([\d,]+)/i,minimum:/shop\s+minimum\s*(?::|is)?\s*\$([\d,]+)/i,instagram:/\$([\d,]+)\s+INSTAGRAM SPECIAL FLASH ONLY/i,haircut:/(?:^|\s)Haircut\s+\$([\d,]+)/i,lake:/\$([\d,]+)\s+DAY PASS/i,oakwell:/packages start at\s*\$([\d,]+)/i,rush:/two rush tickets per school ID for\s*\$([\d,]+)/i};
 if(rule==='zeitgeist')return /pre-drawn designs[\s\S]{0,130}lower than our standard hourly rate/i.test(text)?{price:null,label:'Ask for a quote'}:null;
 const m=rules[rule]?.exec(text);if(!m)return null;const price=Number(m[1].replaceAll(',',''));if(!Number.isFinite(price)||price<0||price>5000)return null;
 const label=rule==='minimum'?`$${price} minimum`:rule==='haircut'?`$${price} haircut`:rule==='lake'?`$${price} day pass`:rule==='oakwell'?`from $${price} / suite`:rule==='rush'?`$${price} student rush`:`from $${price}`;return {price,label};
}
export function parseSocials(html){const urls=[...html.matchAll(/(?:https?:)?\/\/(?:www\.)?(?:instagram|facebook|tiktok)\.com\/[\w.\/-]+/g)].map(m=>safeURL(m[0].startsWith('//')?'https:'+m[0]:m[0])).filter(Boolean);return [...new Set(urls)].filter(x=>!/(squarespace|glossgenius|2008\/fbml|sharer|\/share\b|facebook\.com\/tr(?:\/|$))/i.test(x)).slice(0,8);}
export function updateListing(base,html,now){
 const text=plainText(html);const price=extractPrice(base.rule,text);const out={...base,checkedAt:now,sourceStatus:price?'confirmed':'changed',verifiedAt:price?now:null,priceVerified:!!price,distance:distanceMiles(base.lat,base.lng)};
 if(price){out.price=price.price;out.priceLabel=price.label;if(price.price!==base.price){out.priceNote='The starting price changed on the official page. Review the current offer and conditions at the source.';}}
 else {out.price=null;out.priceLabel='Check current pricing';}
 const allSocials=parseSocials(html);const knownProfile=base.instagram?new URL(base.instagram).pathname.replaceAll('/','').toLowerCase():null;const socials=allSocials.filter(u=>knownProfile&&new URL(u).pathname.replaceAll('/','').toLowerCase()===knownProfile);if(socials.length){out.socials=socials;const ig=socials.find(x=>/instagram/.test(x));if(ig)out.instagram=ig;}
 const streetNumber=base.address.match(/^\d+/)?.[0];const business=structuredData(html).find(n=>(n.openingHours||n.openingHoursSpecification)&&String(n.address?.streetAddress||n.address||'').startsWith(streetNumber));
 if(business?.openingHours){out.hours=Array.isArray(business.openingHours)?business.openingHours.join(' · '):String(business.openingHours);out.hoursVerified=true;}
 if(base.rule==='event')return updateEvent(out,structuredData(html),now);
 return out;
}
export function updateEvent(base,nodes,now){
 const node=nodes.find(n=>(Array.isArray(n['@type'])?n['@type']: [n['@type']]).some(t=>/Event$/.test(t))&&n.startDate);
 if(!node)return {...base,sourceStatus:'changed',priceVerified:false,verifiedAt:null,price:null,priceLabel:'Check current pricing'};
 const offer=Array.isArray(node.offers)?node.offers[0]:node.offers;
 const rawPrice=offer?.price??(node.isAccessibleForFree===true?0:null);const p=rawPrice!==null&&rawPrice!==''&&Number.isFinite(Number(rawPrice))?Number(rawPrice):null;
 const address=node.location?.address;const addr=address&&typeof address==='object'?[address.streetAddress,address.addressLocality,address.addressRegion,address.postalCode].filter(Boolean).join(', '):typeof address==='string'?address:base.address;
 const cancelled=/Cancelled|Postponed/.test(node.eventStatus||'');const start=Date.parse(node.startDate);const end=Date.parse(node.endDate||node.startDate);if(!Number.isFinite(start)||!Number.isFinite(end))return {...base,sourceStatus:'changed',priceVerified:false};
 const expired=end<Date.parse(now);
 return {...base,name:plainText(String(node.name||base.name)),address:addr,startDate:node.startDate,endDate:node.endDate||node.startDate,price:p,priceLabel:p===0?'Free entry':p===null?'Check ticket price':`from $${p}`,priceVerified:p!==null,sourceStatus:cancelled?'cancelled':expired?'expired':'confirmed',verifiedAt:now,checkedAt:now,hours:new Intl.DateTimeFormat('en-US',{timeZone:'America/Denver',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(start)),hoursData:[],hoursVerified:true};
}
export async function fetchPage(url,fetcher=fetch){
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),11000);
 try{const response=await fetcher(url,{signal:controller.signal,redirect:'follow',cache:'no-store',headers:{'User-Agent':'DenverAfterhours/1.0 (+public local-deal directory)','Accept':'text/html'}});if(!response.ok)throw new Error(`HTTP ${response.status}`);if(!/text\/html/i.test(response.headers.get('content-type')||''))throw new Error('Unsupported source');const html=await response.text();if(html.length<300||/cf-chl-|Just a moment\.\.\.|Verify you are human/i.test(html.slice(0,20000)))throw new Error('Source requires a browser');return html.slice(0,2500000);}finally{clearTimeout(timer);}
}
export async function refreshListings(fetcher=fetch,now=new Date().toISOString()){
 const sources=[...new Set(LISTINGS.map(x=>x.source).concat('https://denverbazaar.com/'))];const pages=new Map();
 // Bound parallel requests and only read configured public hosts.
 for(let i=0;i<sources.length;i+=6)await Promise.all(sources.slice(i,i+6).map(async url=>{try{pages.set(url,{html:await fetchPage(url,fetcher)});}catch(e){pages.set(url,{error:e.message});}}));
 const listings=LISTINGS.map(base=>{const source=pages.get(base.source);return source?.html?updateListing(base,source.html,now):{...base,price:null,priceLabel:'Check current pricing',sourceStatus:'unavailable',checkedAt:now,verifiedAt:null,priceVerified:false,distance:distanceMiles(base.lat,base.lng)};});
 const calendar=pages.get('https://denverbazaar.com/')?.html;
 if(calendar){const urls=new Set();for(const node of structuredData(calendar))if(node['@type']==='ListItem'&&node.url){try{const u=new URL(node.url);if(u.hostname==='denverbazaar.com'&&u.pathname.startsWith('/holiday/'))urls.add(u.href);}catch{}}
 const more=[...urls].filter(url=>!pages.has(url)).slice(0,6);await Promise.all(more.map(async url=>{try{
 const html=await fetchPage(url,fetcher);const nodes=structuredData(html);const ev=nodes.find(n=>n['@type']==='Event'&&n.startDate);if(!ev)return;const a=ev.location?.address;if(!a||a.addressRegion!=='CO')return;
 const place=EVENT_LOCATIONS[String(a.streetAddress).match(/^\d+/)?.[0]];const geo=ev.location?.geo;const lat=Number(geo?.latitude??place?.lat),lng=Number(geo?.longitude??place?.lng);if(!Number.isFinite(lat)||!Number.isFinite(lng)||distanceMiles(lat,lng)>30)return;
 const base={...LISTINGS.find(x=>x.id==='bazaar-cherry'),id:'event-'+new URL(url).pathname.split('/').pop(),name:plainText(String(ev.name)),source:url,area:place?.area||a.addressLocality,lat,lng,photo:'market2',title:'A new date for your Denver calendar.',distance:distanceMiles(lat,lng)};listings.push(updateEvent(base,nodes,now));
 }catch{/* The known listings remain usable if a new event page cannot be read. */}}));}
 return {listings,refreshedAt:now,researchAt:RESEARCHED_AT,downtown:DOWNTOWN,confirmed:listings.filter(x=>x.sourceStatus==='confirmed').length,total:listings.length};
}
