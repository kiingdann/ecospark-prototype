/* EcoSpark Admin · prototype core: state, router, shell, components, overlays, prototype settings.
   Built from the WIP Figma page "Web — Admin" (Batches 28 to 33). */
(function(){
const LS='ecospark-admin-v1';
const PEOPLE={grace:{name:'Grace Bennett',first:'Grace',email:'grace@kapitol.co.uk',ini:'GB',role:'Admin'},tom:{name:'Tom Ellis',first:'Tom',email:'tom@kapitol.co.uk',ini:'TE',role:'Content editor'},priya:{name:'Priya Shah',first:'Priya',email:'priya@kapitol.co.uk',ini:'PS',role:'Moderator'}};
const clone=o=>JSON.parse(JSON.stringify(o));
function defaults(){return{
  auth:'in',me:'grace',setup:'pilot',emptyLists:false,offline:false,failNext:false,
  codeTries:3,lockedUntil:null,codeResentAt:0,
  builds:clone(window.BUILDS||[]),nextId:30,
  paths:{'Tin can':['live','live','live'],'Plastic bottle':['live','live','live'],'Bottle top':['live','live','live'],'Cardboard box':['live','live','live'],'Egg box':[null,null,null],'Newspaper':[null,null,null]},
  videos:[{t:'What is a tin can?',m:'Tin can',ages:'5 to 8',len:'1:40',st:'live',file:'what-is-a-tin-can.mp4 · 52 MB',cap:'A tin can keeps food fresh. It is made of metal…'},
   {t:'What is a tin can? (short)',m:'Tin can',ages:'5 to 8',len:'0:55',st:'draft',hidden:true,file:'what-is-a-tin-can-short.mp4 · 18 MB',cap:''},
   {t:'What is a plastic bottle?',m:'Plastic bottle',ages:'5 to 8',len:'1:55',st:'live'},{t:'What is a bottle top?',m:'Bottle top',ages:'5 to 8',len:'1:20',st:'live'},
   {t:'What is a cardboard box?',m:'Cardboard box',ages:'5 to 8',len:'2:05',st:'live'},{t:'What is an egg box?',m:'Egg box',ages:'5 to 8',len:'1:35',st:'draft',unlinked:true}],
  quizzes:[{t:'What does a tin can become?',m:'Tin can',from:'What is a tin can?',st:'live',qs:[['What can an old tin can become?',['A new can','A tree'],0],['What do you do first?',['Rinse it','Throw it away'],0],['Who checks sharp edges?',['A grown-up','Nobody'],0]]},
   {t:'What does a plastic bottle become?',m:'Plastic bottle',from:'What is a plastic bottle?',st:'live',n:3},{t:'What does a bottle top become?',m:'Bottle top',from:'What is a bottle top?',st:'live',n:3},{t:'What does a cardboard box become?',m:'Cardboard box',from:'What is a cardboard box?',st:'live',n:3}],
  stories:[{t:'How tin cans help wildlife',m:'Tin can',ages:'5 to 8',len:'2:30',st:'live',file:'how-tin-cans-help-wildlife.mp3 · 3 MB',text:'Once, a little tin can found its way to the recycling box…'},{t:'The bottle that became a bird feeder',m:'Plastic bottle',ages:'5 to 8',len:'2:45',st:'live'},{t:'Bottle tops on the beach',m:'Bottle top',ages:'5 to 8',len:'2:10',st:'live'},{t:'A box for the hedgehog',m:'Cardboard box',ages:'5 to 8',len:'3:00',st:'live'}],
  themes:[{w:'16 to 22 Nov',n:'Autumn leaves',b:['Seed Library','Plant Pal'],l:'Cardboard box',v:'Hedgehog',st:'This week'},{w:'23 to 29 Nov',n:'Cosy indoors',b:['Toy Sleepover','Floor Friend'],l:'Plastic bottle',v:'Robin',st:'Scheduled'},{w:'30 Nov to 6 Dec',n:'Winter birds',b:['Little Landing Pad','Seedling Station'],l:'Bottle top',v:'Robin',st:'Scheduled'},{w:'7 to 13 Dec',n:'Gift season',b:['Gift Hug','Desk Post'],l:'Tin can',v:'Robin',st:'Draft'}],
  pastThemes:[{w:'9 to 15 Nov',n:'Conker season',b:['Puzzle Rescue','Desk Roll'],l:'Tin can',v:'Robin',st:'Done'},{w:'2 to 8 Nov',n:'First frost',b:['Brick Drying Bay','Dust Buddy'],l:'Plastic bottle',v:'Hedgehog',st:'Done'}],
  photos:[{id:'ph1',build:'Crayon Crew',why:'Possible face',whyLong:'Possible face (safety check, 62% sure)',ages:'5 to 8',fam:'F-012',ago:'3 h ago',at:'Today, 07:40',desc:'a yoghurt pot with crayons'},
   {id:'ph2',build:'Plant Pal',why:"Not sure it's a build",whyLong:"Not sure it's a build (safety check)",ages:'9 to 12',fam:'F-004',ago:'1 h ago',at:'Today, 09:40',desc:'a plant pot with a seedling'},
   {id:'ph3',build:'Desk Post',why:'Possible name in the photo',whyLong:'Possible name in the photo (safety check)',ages:'5 to 8',fam:'F-009',ago:'25 min ago',at:'Today, 10:15',desc:'a cereal box letter tray'}],
  answers:[{id:'an1',kind:'wrong',scanned:'Glass jar',said:'Plastic bottle',flag:"Child: That's not right",ages:'5 to 8',fam:'F-006',ago:'2 h ago',at:'Today, 08:12'},
   {id:'an2',kind:'safety',scanned:'Battery',said:'Safety tip: battery bin',flag:'Safety check: hazardous item',ages:'9 to 12',fam:'F-011',ago:'40 min ago',at:'Today, 09:31'}],
  reports:[{id:'rp1',what:'Something I saw',where:'Learn · video "What is a tin can?"',kind:'video',content:'What is a tin can?',csub:'Video · Tin can path, step 1 · Live',fam:'F-007',ages:'5 to 8',at:'Today, 16:20',child:'Leo'},
   {id:'rp2',what:'A build step looked unsafe',where:'Build · Puzzle Rescue, step 2',kind:'build',content:'Puzzle Rescue, step 2',csub:'Build · P03 · Live',fam:'F-003',ages:'9 to 12',at:'Yesterday, 18:05'}],
  modSort:'Oldest first',
  safetyTip:'Batteries are not for building. Ask a grown-up to take it to a battery bin.',
  alerts:[{id:'queue',t:'The review queue is growing',d:'7 items are waiting. The oldest came in 3 h ago (your limit is 2 h).',at:'Today, 10:40',link:['Open moderation','a/moderation'],go:'a/alert/queue',tone:'warning',icon:'clock'},
   {id:'cost',t:"AI cost is at 74% of this week's budget",d:'£18.40 of £25 spent. At this pace the week ends at about £27.',at:'Today, 09:00',link:['See details','a/alert/cost'],go:'a/alert/cost',tone:'warning',icon:'pound-sterling'}],
  resolved:[{id:'err',t:'Scan errors: 12 failed scans in 10 minutes',d:'Back to normal at 18:14. Children saw "Let\'s try again in a moment".',at:'Yesterday, 18:02',go:'a/alert/errors',tone:'danger',icon:'triangle-alert'},
   {t:'The review queue was growing',d:'Resolved by Priya Shah after 40 minutes.',at:'Yesterday, 11:20',icon:'clock'},
   {t:"AI cost reached 70% of last week's budget",d:'Resolved by Grace Bennett. Week ended at £23.10.',at:'13 November',icon:'pound-sterling'},
   {t:'Learn videos loading slowly',d:'Resolved by the hosting provider after 25 minutes.',at:'12 November',icon:'video'},
   {t:'The review queue was growing',d:'Resolved by Grace Bennett after 1 h.',at:'10 November',icon:'clock'}],
  scanLimit:3,
  alertSet:{queue:'2 hours',budget:'25',warn:'70% and 90%',errors:'More than 5 in 10 minutes',who:{grace:true,priya:true,tom:false}},
  usagePeriod:'Last 7 days',usageEmpty:false,
  team:[{k:'grace',st:'Active',last:'Now',two:'On'},{k:'tom',st:'Active',last:'Today, 09:12',two:'On',joined:'2 November'},{k:'priya',st:'Active',last:'Today, 10:55',two:'On',joined:'2 November'}],
  invited:[],
  devices:[{n:'Chrome on Mac',d:'This device · London',me:true,icon:'monitor'},{n:'Safari on iPhone',d:'2 days ago · London',icon:'smartphone'}],
  pwChanged:'2 November',notifs:[true,true,false],
  setupDone:{alerts:false},
};}
let S;
try{S=Object.assign(defaults(),JSON.parse(localStorage.getItem(LS)||'{}'))}catch(e){S=defaults()}
if(S.scanLimit===5)S.scanLimit=3; /* 19 Nov: the kid app allows 3 scans a day */
function save(){try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}}
const me=()=>PEOPLE[S.me]||PEOPLE.grace;

/* helpers */
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function ic(n,cls=''){return `<span class="ic ${cls}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${(window.AICONS||{})[n]||''}</svg></span>`}
function attrs(o){let a='';if(o.go)a+=` data-go="${esc(o.go)}"`;if(o.act)a+=` data-act="${esc(o.act)}"`;if(o.arg!==undefined)a+=` data-arg="${esc(o.arg)}"`;if(o.id)a+=` id="${o.id}"`;if(o.disabled)a+=' disabled';if(o.title)a+=` aria-label="${esc(o.title)}"`;return a}
function btn(label,o={}){const v=o.v||'primary';return `<button type="button" class="btn ${v} ${o.sm?'sm':''} ${o.block?'block':''} ${o.cls||''}"${attrs(o)}>${o.icon?ic(o.icon):''}${label?`<span>${esc(label)}</span>`:''}</button>`}
function ibtn(icon,o={}){return `<button type="button" class="btn outline icon ${o.sm?'sm':''}"${attrs(o)} aria-label="${esc(o.title||icon)}">${ic(icon)}</button>`}
const TONE={Live:'success',Draft:'warning',Done:'neutral','This week':'success',Scheduled:'info',New:'info',Active:'success',Invited:'info',Resolved:'success','To confirm':'info','Grown-up helps':'warning',Optional:'neutral','Grown-up only':'warning',On:'success'};
function status(label,tone){return `<span class="status ${tone||TONE[label]||'neutral'}">${esc(label)}</span>`}
function disc(icon,tone='primary',lg){return `<span class="disc ${tone} ${lg?'lg':''}">${ic(icon,lg?'s20':'s18')}</span>`}
function stat(label,value,note,icon){return `<div class="card stat"><div class="lab"><span>${esc(label)}</span>${icon?ic(icon):''}</div><div class="val">${esc(value)}</div><div class="snote">${esc(note)}</div></div>`}
function phead(title,sub,actions=''){return `<div class="phead"><div class="grow"><h1>${esc(title)}</h1>${sub?`<p>${sub}</p>`:''}</div>${actions?`<div class="actions">${actions}</div>`:''}</div>`}
function tabs(list,on){return `<div class="tabs" role="tablist">${list.map(([l,go,n])=>`<button class="tab ${l===on?'on':''}" role="tab" aria-selected="${l===on}" data-go="${go}">${esc(l)}${n!==undefined?` <span class="n">${n}</span>`:''}</button>`).join('')}</div>`}
function empty(icon,title,text,action='',tone='neutral'){return `<div class="empty">${disc(icon,tone,true)}<div class="t">${esc(title)}</div><p>${esc(text)}</p>${action}</div>`}
function field(label,val,o={}){const id=o.id||('f'+Math.random().toString(36).slice(2,7));
  const inner=o.textarea?`<textarea class="input ${o.err?'bad':''}" id="${id}" rows="${o.rows||3}" placeholder="${esc(o.ph||'')}">${esc(val)}</textarea>`
   :o.options?`<select class="input" id="${id}">${o.options.map(x=>`<option ${x===val?'selected':''}>${esc(x)}</option>`).join('')}</select>`
   :`<input class="input ${o.err?'bad':''}" id="${id}" type="${o.type||'text'}" value="${esc(val)}" placeholder="${esc(o.ph||'')}" ${o.max?`maxlength="${o.max}"`:''} autocomplete="off">`;
  const wrapped=o.icon?`<div class="inwrap">${ic(o.icon)}${inner}</div>`:inner;
  return `<div class="field">${label?`<label for="${id}">${esc(label)}${o.labelRight||''}</label>`:''}${wrapped}${o.err?`<div class="err" role="alert">${esc(o.err)}</div>`:''}${o.help?`<div class="help">${esc(o.help)}</div>`:''}</div>`}
function toggle(label,sub,on,act,arg){return `<button type="button" class="toggle" data-act="${act}" ${arg!==undefined?`data-arg="${esc(arg)}"`:''} role="switch" aria-checked="${!!on}"><span class="switch ${on?'on':''}"></span><span class="col"><span class="m">${esc(label)}</span>${sub?`<span class="t-xs muted">${esc(sub)}</span>`:''}</span></button>`}
function cbox(label,on,act,arg){return `<button type="button" class="checkrow" data-act="${act}" data-arg="${esc(arg)}" role="checkbox" aria-checked="${!!on}"><span class="cbox ${on?'on':''}">${on?ic('check'):''}</span><span>${esc(label)}</span></button>`}
function radio(label,sub,on,act,arg){return `<button type="button" class="option ${on?'on':''}" data-act="${act}" data-arg="${esc(arg)}" role="radio" aria-checked="${!!on}"><span class="radio ${on?'on':''}"></span><span class="col"><span class="m">${esc(label)}</span>${sub?`<span class="sub">${esc(sub)}</span>`:''}</span></button>`}
function kv(rows){return `<dl class="kv">${rows.map(([k,v])=>`<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>`}
function bars(vals,hi,labels=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],cls=''){const mx=Math.max(...vals);return `<div class="bars ${cls}">${vals.map((v,i)=>`<div class="bar ${i===hi?'hi':''}" title="${labels[i]}: ${v}"><i style="height:${Math.round(v/mx*100)}%"></i><span>${labels[i]}</span></div>`).join('')}</div>`}
const val=id=>{const e=document.getElementById(id);return e?e.value:''};
function sk(w,h=12){return `<span class="sk" style="display:inline-block;width:${w}px;height:${h}px"></span>`}

/* router */
let overlay=null,menu=null,toastO=null,toastT,dirty=null,navId=0,loading=null;
const SCREENS={},DIALOGS={},SHEETS={},ACTIONS={};
function cur(){return decodeURIComponent(location.hash.replace(/^#\/?/,''))||''}
function go(r,o={}){if(dirty&&!o.force&&r!==cur()){const target=r;overlay={type:'dialog',name:'unsaved',arg:target};paint();return}
  dirty=null;overlay=null;menu=null;navId++;if(o.load)loading=r;
  if(cur()===r)render();else{history[o.replace?'replaceState':'pushState'](null,'','#'+r);render()}}
function later(ms,fn){const id=navId;setTimeout(()=>{if(id===navId)fn()},ms)}
function dialog(name,arg){overlay={type:'dialog',name,arg};menu=null;paint()}
function sheet(name,arg){overlay={type:'sheet',name,arg};menu=null;paint()}
function preview(arg){overlay={type:'preview',arg};menu=null;paint()}
function close(){overlay=null;menu=null;paint()}
function toast(msg,o={}){toastO={msg,undo:o.undo||null,icon:o.icon||'circle-check'};clearTimeout(toastT);toastT=setTimeout(()=>{toastO=null;const t=document.querySelector('.toast');if(t)t.remove()},o.undo?6000:3200);paintToast()}
function paintToast(){const old=document.querySelector('.toast');if(old)old.remove();if(!toastO)return;document.body.insertAdjacentHTML('beforeend',`<div class="toast" role="status">${ic(toastO.icon)}<span class="grow">${esc(toastO.msg)}</span>${toastO.undo?`<button class="undo" data-act="undo">Undo</button>`:''}</div>`)}
function openMenu(items,anchor,head){const r=anchor.getBoundingClientRect();menu={items,head,x:Math.min(r.right,innerWidth-8),y:r.bottom+4,left:r.left};paintMenu()}
function paintMenu(){document.querySelectorAll('.menu,.menu-catch').forEach(e=>e.remove());if(!menu)return;
  document.body.insertAdjacentHTML('beforeend',`<div class="menu-catch" data-act="closeMenu"></div><div class="menu" role="menu">${menu.head?`<div class="mh">${esc(menu.head)}</div>`:''}${menu.items.map((it,i)=>`<button role="menuitem" class="${it.danger?'danger':''}" data-mi="${i}">${it.icon?ic(it.icon):''}<span>${esc(it.label)}</span>${it.on?`<span class="tick">${ic('check')}</span>`:''}</button>`).join('')}</div>`);
  const m=document.querySelector('.menu');const w=m.offsetWidth;let x=menu.x-w;if(x<8)x=menu.left;m.style.left=x+'px';let y=menu.y;if(y+m.offsetHeight>innerHeight-8)y=innerHeight-8-m.offsetHeight;m.style.top=y+'px';m.querySelector('button').focus()}
function paint(){const o=document.getElementById('overlay');if(!o)return render();o.innerHTML=overlayHTML();paintMenu();focusOverlay()}
function focusOverlay(){const f=document.querySelector('.dialog input,.dialog textarea,.dialog button.btn.primary,.sheet .close,.preview .btn');if(f&&overlay)setTimeout(()=>f.focus(),0)}
function overlayHTML(){if(!overlay)return'';
  if(overlay.type==='dialog'&&DIALOGS[overlay.name]){const d=DIALOGS[overlay.name](overlay.arg);return `<div class="scrim" data-act="${d.lock?'':'close'}"></div><div class="dialog ${d.wide?'wide':''}" role="dialog" aria-modal="true" aria-labelledby="dlg-t"><h2 id="dlg-t">${esc(d.title)}</h2>${d.desc?`<p class="desc">${d.desc}</p>`:''}${d.body||''}<div class="actions">${d.actions}</div></div>`}
  if(overlay.type==='sheet'&&SHEETS[overlay.name]){const d=SHEETS[overlay.name](overlay.arg);return `<div class="scrim" data-act="close"></div><aside class="sheet" role="dialog" aria-modal="true" aria-labelledby="sh-t"><div class="sh-head"><div><h2 id="sh-t">${esc(d.title)}</h2><p class="muted">${esc(d.sub||'')}</p></div><button class="close" data-act="close" aria-label="Close">${ic('x')}</button></div><div class="sh-body">${d.body}</div><div class="sh-foot">${d.actions}</div></aside>`}
  if(overlay.type==='preview')return `<div class="scrim" data-act="close"></div>${window.PREVIEW_HTML(overlay.arg)}`;
  return ''}

/* shell */
const NAV=[[null,[['Overview','layout-grid','a/overview']]],['Content',[['Builds','hammer','a/builds'],['Learn','book-open','a/learn'],['Weekly themes','calendar','a/themes']]],['Safety',[['Moderation','shield-check','a/moderation'],['Alerts','bell','a/alerts']]],['Pilot',[['Usage','chart-column','a/usage']]],['Settings',[['Team','users','a/team']]]];
function modCount(){return S.photos.length+S.answers.length+S.reports.length}
function navCount(l){if(l==='Moderation')return modCount();if(l==='Alerts')return S.alerts.length;return 0}
function sidebar(active){const m=me();return `<aside class="side" aria-label="Main"><div class="logo"><span class="mark">${ic('sprout','s18')}</span><span class="col"><span class="name">EcoSpark</span><span class="sub">Admin</span></span></div>
 ${NAV.map(([g,items])=>`${g?`<div class="navgroup">${g}</div>`:''}${items.map(([l,i,r])=>{const n=navCount(l);return `<button class="nav ${active===l?'active':''}" data-go="${r}" data-nav="1" ${active===l?'aria-current="page"':''}>${ic(i)}<span>${l}</span>${n?`<span class="count" aria-label="${n} waiting">${n}</span>`:''}</button>`}).join('')}`).join('')}
 <button class="user ${active==='Account'?'active':''}" data-go="a/account" data-nav="1" aria-label="Account"><span class="avatar">${m.ini}</span><span class="col grow"><span class="m ellipsis">${esc(m.name)}</span><span class="t-xs muted ellipsis">${esc(m.email)}</span></span>${ic('chevron-right','s14')}</button></aside>`}
function topbar(crumbs){const parts=crumbs.map((c,i)=>Array.isArray(c)&&i<crumbs.length-1?`<a href="#${c[1]}" data-go="${c[1]}">${esc(c[0])}</a>`:`<span>${esc(Array.isArray(c)?c[0]:c)}</span>`);
  return `<header class="topbar"><nav class="crumbs" aria-label="Breadcrumb">${parts.join('<span class="sep">/</span>')}</nav><label class="search top">${ic('search')}<input type="search" placeholder="Search builds and lessons" data-search="global" aria-label="Search builds and lessons"><kbd>⌘K</kbd></label><button class="bell" data-go="a/alerts" aria-label="Alerts${S.alerts.length?', '+S.alerts.length+' open':''}">${ic('bell')}${S.alerts.length?'<span class="dot"></span>':''}</button></header>`}
function shell(active,crumbs,body){return `<div class="app">${sidebar(active)}<div class="main">${topbar(crumbs)}<main class="content" id="content">${S.offline?`<div class="offline" role="status">${ic('wifi-off')}<span>You're offline. Your changes are kept on this computer and saved when you're back online.</span></div>`:''}${body}</main></div></div>`}

function render(){let r=cur();if(!r){r=S.auth==='in'?'a/overview':'a/signin';history.replaceState(null,'','#'+r)}
  const keys=Object.keys(SCREENS).sort((a,b)=>b.length-a.length);const k=keys.find(x=>r===x||r.startsWith(x+'/'));
  const authFree=/^a\/(signin|code|locked|forgot|link-sent|new-password|password-changed|invite|invite-expired|signed-out|signing-in)/.test(r);
  if(S.auth!=='in'&&!authFree){history.replaceState(null,'','#a/signin');return render()}
  let html;try{html=k?SCREENS[k](decodeURIComponent(r.slice(k.length+1))):SCREENS['a/404']()}catch(e){console.error(e);html=shell('',['Error'],`<div class="card">${empty('circle-alert','Something went wrong',e.message)}</div>`)}
  document.getElementById('root').innerHTML=html+`<div id="overlay">${overlayHTML()}</div>`;
  paintMenu();paintToast();save();syncPanel();document.title=(document.querySelector('.phead h1,.auth h1')||{}).textContent?((document.querySelector('.phead h1,.auth h1').textContent)+' · EcoSpark Admin'):'EcoSpark Admin';
  if(!overlay)window.scrollTo(0,0);focusOverlay();if(window.AFTER){const f=window.AFTER;window.AFTER=null;f()}}

document.addEventListener('click',e=>{
  const mi=e.target.closest('[data-mi]');if(mi&&menu){const it=menu.items[+mi.dataset.mi];menu=null;paintMenu();it.run&&it.run();return}
  const t=e.target.closest('[data-go],[data-act]');if(!t||t.closest('.proto-panel'))return;
  if(t.dataset.go!==undefined){e.preventDefault();if(t.dataset.go)go(t.dataset.go,{load:t.dataset.nav==='1'});return}
  const a=t.dataset.act;if(!a)return;e.preventDefault();
  if(a==='close'){close();return}if(a==='closeMenu'){menu=null;paintMenu();return}
  if(a==='undo'){const u=toastO&&toastO.undo;toastO=null;paintToast();if(u)u();return}
  if(ACTIONS[a])ACTIONS[a](t.dataset.arg,t,e)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(menu){menu=null;paintMenu()}else if(overlay&&!(overlay.type==='dialog'&&DIALOGS[overlay.name]&&DIALOGS[overlay.name](overlay.arg).lock))close()}
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){const s=document.querySelector('[data-search="global"]');if(s){e.preventDefault();s.focus()}}
  if(e.key==='Enter'&&e.target.dataset&&e.target.dataset.search==='global'){const q=e.target.value.trim();if(q){S.buildQ=q;go('a/builds')}}});
document.addEventListener('input',e=>{const t=e.target;if(t.closest('.content [data-form]')){dirty=dirty||cur()}
  if(t.dataset.onin&&ACTIONS[t.dataset.onin])ACTIONS[t.dataset.onin](t.value,t,e)});
window.addEventListener('popstate',()=>{overlay=null;menu=null;dirty=null;navId++;render()});
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}});

/* Unsaved changes (H4) */
DIALOGS.unsaved=target=>({title:'Leave without saving?',desc:window.DIRTY_DESC||'Your changes on this page are not saved yet. If you leave now, they are lost.',actions:btn('Keep editing',{v:'outline',act:'close'})+btn('Leave without saving',{v:'destructive',act:'leaveAnyway',arg:target})});
ACTIONS.leaveAnyway=t=>{dirty=null;window.DIRTY_DESC=null;go(t,{force:true})};

/* Prototype settings (outside the product) */
const JUMPS=[['Sign in',[['a/signin','SI1 · Sign in'],['a/code','SI2 · Two-step code'],['a/locked','SI4 · Too many tries'],['a/forgot','SI5 · Forgot password'],['a/link-sent','SI6 · Link sent'],['a/new-password','SI7 · New password (from the email link)'],['a/invite','SI9 · Join from an invite'],['a/invite-expired','SI10 · Invite expired'],['a/signed-out','ST7 · Signed out']]],
 ['Overview',[['a/overview','OV1 · Overview']]],
 ['Builds',[['a/builds','CB1 · Builds'],['a/build/P01','CB2 · Edit Crayon Crew'],['a/build/P18','AB6 · Brush Bath draft'],['a/new-build/1','AB1 · Add a build']]],
 ['Learn',[['a/learn','CL1 · Paths'],['a/path/Tin can','CL2 · Tin can path'],['a/path/Egg box','CL7 · Egg box (empty)'],['a/learn/videos','CL3 · Videos'],['a/learn/quizzes','CL8 · Quizzes'],['a/learn/stories','CL6 · Audio stories'],['a/quiz/What does a tin can become?','CL5 · Edit a quiz'],['a/new-quiz/Egg box','QZ1 · New quiz']]],
 ['Weekly themes',[['a/themes','CW1 · Upcoming'],['a/themes/past','CW2 · Past'],['a/new-theme','TH1 · New theme']]],
 ['Moderation',[['a/moderation','MD1 · Photos'],['a/moderation/answers','MD7 · Answers'],['a/moderation/reports','MD12 · Reports']]],
 ['Alerts',[['a/alerts','AL1 · Open'],['a/alerts/resolved','AL5 · Resolved'],['a/alert/cost','AL2 · AI cost'],['a/alert/queue','AL4 · Queue'],['a/alert/errors','AL6 · Scan errors'],['a/alert-settings','AL7 · Settings']]],
 ['Usage, team, account',[['a/usage','US1 · Usage'],['a/team','TM1 · Team'],['a/account','AT1 · Account'],['a/nowhere','ST6 · Page not found']]]];
function opt(key,v,label,fn){return `<button class="opt ${S[key]===v?'on':''}" data-set="${key}" data-val="${esc(JSON.stringify(v))}" ${fn?`data-fn="${fn}"`:''}>${esc(label)}</button>`}
function panelHTML(){return `<div class="row between"><h3>Prototype settings</h3><button class="opt" data-closepanel>Close</button></div><p class="pnote">Controls for testing. They are not part of the admin.</p>
 <h4>Signed in as</h4><div class="opts">${opt('me','grace','Grace · Admin')}${opt('me','tom','Tom · Content editor')}${opt('me','priya','Priya · Moderator')}</div>
 <h4>Account</h4><div class="opts">${opt('setup','pilot','Pilot running','pilot')}${opt('setup','first','First sign-in','first')}</div>
 <h4>Lists</h4><div class="opts">${opt('emptyLists',false,'With content','full')}${opt('emptyLists',true,'Nothing yet (EB1, EL1, ET1)','empty')}</div>
 <div class="opts" style="margin-top:6px">${opt('usageEmpty',false,'Usage data')}${opt('usageEmpty',true,'No usage yet (US5)')}</div>
 <h4>Connection</h4><div class="opts">${opt('offline',false,'Online')}${opt('offline',true,'Offline (ST3)')}</div><div class="opts" style="margin-top:6px">${opt('failNext',false,'Lists load')}${opt('failNext',true,'Builds fail to load (ST2)')}</div>
 <h4>Session</h4><div class="opts"><button class="opt" data-run="expire">Expire the session (ST5)</button><button class="opt" data-run="signout">Sign out</button></div>
 <h4>Emails (they would arrive in the inbox)</h4><div class="opts"><button class="opt" data-jumpto="a/new-password">Open the reset link</button><button class="opt" data-jumpto="a/invite">Open an invite</button><button class="opt" data-jumpto="a/invite-expired">Open an old invite</button></div>
 <h4>Jump to a screen</h4><select data-jump><option value="">Choose a screen…</option>${JUMPS.map(([g,l])=>`<optgroup label="${g}">${l.map(([r,n])=>`<option value="${esc(r)}">${esc(n)}</option>`).join('')}</optgroup>`).join('')}</select>
 <p class="pnote" style="margin-top:10px">Two-step code: any 6 digits. 000000 shows the wrong-code error. Password: anything.</p>
 <p class="pnote">Other apps: <a href="index.html?start=kid">Kid app</a> · <a href="index.html?start=parent">Parent zone</a></p>
 <button class="reset" data-reset>Reset the prototype</button>`}
function syncPanel(){const p=document.querySelector('.proto-panel');if(p&&p.classList.contains('open'))p.innerHTML=panelHTML()}
function initPanel(){const fab=document.createElement('button');fab.className='proto-fab';fab.setAttribute('aria-label','Prototype settings');fab.innerHTML=ic('settings');
  const p=document.createElement('div');p.className='proto-panel';document.body.append(fab,p);
  fab.onclick=()=>{p.classList.toggle('open');if(p.classList.contains('open'))p.innerHTML=panelHTML()};
  p.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
    if(t.dataset.set){S[t.dataset.set]=JSON.parse(t.dataset.val);if(t.dataset.fn&&window.PANEL_FN)window.PANEL_FN(t.dataset.fn);save();overlay=null;dirty=null;render()}
    else if(t.dataset.jumpto){S.auth=/^a\/(new-password|invite)/.test(t.dataset.jumpto)?'out':S.auth;dirty=null;go(t.dataset.jumpto,{force:true})}
    else if(t.dataset.run==='expire'){dirty=null;go('a/overview',{force:true});S.auth='expired';dialog('expired')}
    else if(t.dataset.run==='signout'){S.auth='out';dirty=null;go('a/signed-out',{force:true})}
    else if(t.hasAttribute('data-closepanel'))p.classList.remove('open');
    else if(t.hasAttribute('data-reset')){Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,defaults());save();dirty=null;overlay=null;toast('Prototype reset',{icon:'refresh-cw'});go('a/overview',{force:true})}});
  p.addEventListener('change',e=>{if(e.target.dataset.jump!==undefined&&e.target.value){if(S.auth!=='in'&&!/^a\/(signin|code|locked|forgot|link-sent|new-password|password-changed|invite|signed-out)/.test(e.target.value))S.auth='in';dirty=null;go(e.target.value,{force:true})}})}
DIALOGS.expired=()=>({lock:true,title:"You've been signed out",desc:'For safety, we sign you out after 30 minutes away. Your drafts are saved.',actions:btn('Sign in again',{act:'reSignIn'})});
ACTIONS.reSignIn=()=>{S.auth='out';overlay=null;go('a/signin',{force:true})};

window.ADMIN={S,PEOPLE,me,save,defaults,esc,ic,btn,ibtn,status,disc,stat,phead,tabs,empty,field,toggle,cbox,radio,kv,bars,val,sk,
  go,later,dialog,sheet,preview,close,toast,openMenu,render,shell,SCREENS,DIALOGS,SHEETS,ACTIONS,modCount,
  get loading(){return loading},set loading(v){loading=v},get dirty(){return dirty},set dirty(v){dirty=v},get overlay(){return overlay},set overlay(v){overlay=v},cur};
window.addEventListener('DOMContentLoaded',()=>{initPanel();render()});
})();
