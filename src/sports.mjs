// Source-specific schedule adapters. Prices are deliberately independent of schedule checks.
const zone='America/Denver';
export function denverDay(iso){return new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(iso));}
export function denverISO(year,month,day,hour,minute=0){
 const wall=Date.UTC(year,month-1,day,hour,minute);
 const offset=new Intl.DateTimeFormat('en-US',{timeZone:zone,timeZoneName:'shortOffset'}).formatToParts(new Date(wall)).find(x=>x.type==='timeZoneName')?.value;
 const m=offset?.match(/^GMT([+-])(\d{1,2})(?::(\d{2}))?$/);if(!m)return null;
 const minutes=(Number(m[2])*60+Number(m[3]||0))*(m[1]==='-'?-1:1);
 return new Date(wall-minutes*60000).toISOString();
}
export function sportsResult(base,raw,nodes,text,now){
 const failed={...base,price:null,priceLabel:'See ticket prices',priceVerified:false,scheduleVerified:false,sourceStatus:'changed',verifiedAt:null,checkedAt:now};
 let start,venue,ticket,status;
 if(base.rule==='sports-nhl'){
  let feed;try{feed=JSON.parse(raw);}catch{return failed;}
  const game=feed.games?.find(g=>String(g.id)===String(base.gameId)&&g.homeTeam?.abbrev===base.homeCode&&g.awayTeam?.abbrev===base.awayCode);
  if(!game)return failed;
  start=game.startTimeUTC;venue=game.venue?.default;ticket=game.ticketsLink;
  status=/PPD|POSTPON|CANCEL/i.test(game.gameScheduleState||'')?'postponed':'scheduled';
 }else if(base.rule==='sports-event'){
  const events=nodes.filter(n=>(Array.isArray(n['@type'])?n['@type']:[n['@type']]).includes('SportsEvent'));
  const node=events.find(n=>base.eventKey?n['@id']===base.eventKey:(n.homeTeam?.name===base.homeTeam&&n.awayTeam?.name===base.awayTeam&&Number.isFinite(Date.parse(n.startDate))&&denverDay(n.startDate)===base.eventDay));
  if(!node||node.homeTeam?.name!==base.homeTeam||node.awayTeam?.name!==base.awayTeam)return failed;
  start=node.startDate;
  // This NFL schedule publishes timezone-less UTC values; its visible MST listing was cross-checked.
  if(!/Z$|[+-]\d{2}:?\d{2}$/.test(start)){if(base.sourceTimeZone!=='UTC')return failed;start+='Z';}
  venue=node.location?.name;const offer=Array.isArray(node.offers)?node.offers[0]:node.offers;ticket=offer?.url;status=node.eventStatus;
 }else if(base.rule==='sports-du'){
  const card=raw.match(new RegExp('<li\\b[^>]*\\bid=["\\\']events-list-item-'+String(base.gameId)+'["\\\'][^>]*>([\\s\\S]*?)<\\/li>','i'))?.[1];
  if(!card)return failed;
  const clean=card.replace(/<[^>]*>/g,' ').replace(/&#39;|&apos;/g,"'").replace(/\s+/g,' ');
  const m=clean.match(/Upcoming Event:\s*Men's Basketball versus ([\w .'-]+?) on ([A-Za-z]+)\.? (\d{1,2}), (\d{4}) at (\d{1,2})(?::(\d{2}))?\s*([ap])\.?m\.?\s*MT/i);
  if(!m||m[1].trim()!==base.opponent)return failed;
  if(!text.includes('vs '+base.opponent+' '+base.venue))return failed;
  const month=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(m[2].slice(0,3).toLowerCase())+1;
  if(!month)return failed;const hour=Number(m[5])%12+(m[7].toLowerCase()==='p'?12:0);start=denverISO(Number(m[4]),month,Number(m[3]),hour,Number(m[6]||0));venue=base.venue;status='scheduled';
  ticket=card.match(/href=["'](https:\/\/denverpioneers\.evenue\.net\/[^"']*)["']/i)?.[1]?.replaceAll('&amp;','&');
 }else return failed;
 const date=Date.parse(start);if(!Number.isFinite(date))return failed;
 // A venue change needs review so an old address and distance cannot masquerade as current.
 if(!venue||!venue.toLowerCase().includes(base.venue.toLowerCase()))return failed;
 const cancelled=/Cancel|Postpon/i.test(status||'');const end=new Date(date+6*3600000).toISOString();
 let safeTicket=base.ticketUrl;try{const u=new URL(ticket);if(u.protocol==='https:')safeTicket=u.href;}catch{}
 return {...base,startDate:new Date(date).toISOString(),endDate:end,price:null,priceLabel:'See ticket prices',priceVerified:false,scheduleVerified:true,sourceStatus:cancelled?'cancelled':Date.parse(end)<Date.parse(now)?'expired':'confirmed',verifiedAt:now,checkedAt:now,ticketUrl:safeTicket,hoursVerified:false};
}
