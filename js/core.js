/* EcoSpark for Kids · prototype core: state, router, helpers, settings panel */
(function(){
const LS='ecospark-proto-v1';
const MATERIALS=['Plastic bottle','Bottle top','Cardboard box','Egg box','Newspaper','Tin can','Yoghurt pot','Drinks can','Plastic cup','Kitchen roll tube','Glass jar','Glass bottle'];
const FAMILY={'Tin can':'Metal','Drinks can':'Metal','Plastic bottle':'Plastic','Bottle top':'Plastic','Yoghurt pot':'Plastic','Plastic cup':'Plastic','Cardboard box':'Paper','Egg box':'Paper','Newspaper':'Paper','Kitchen roll tube':'Paper','Glass jar':'Glass','Glass bottle':'Glass'};
function defaults(){return{
  persona:'kid',kid:'Leo',sparks:120,garden:80,scansLeft:3,
  shelf:{'Plastic bottle':1,'Bottle top':4,'Cardboard box':3,'Egg box':1,'Newspaper':2},
  rescued:11,scanCount:0,lastResult:null,
  builds:{'Crayon Crew':'ready','Bird feeder':'almost','Pencil pot':'almost','Plant Pal':'need','Desk Post':'built'},
  justReady:null,buildStep:0,currentBuild:'Crayon Crew',
  continueKind:'news',sentBuild:null,kidCelebrate:null,kidRetry:null,visitorPending:false,
  learn:{'Tin can':{video:true,quiz:false,story:false}},learnSeen:false,
  offline:false,cameraAllowed:true,firstDay:false,
  nextScan:'auto',nextPhoto:'ok',c5:'A',a2:'A',weekly:false,a1:false,ages:'5-9',tellUs:true,
  pin:'1234',pinTries:0,lockUntil:0,
  approvals:[{kid:'Leo',build:'Bird feeder',when:'Today, 16:20',ago:'10 min ago',outside:true},{kid:'Maya',build:'Pencil pot',when:'Yesterday',ago:'Yesterday',outside:false}],
  done:[{kid:'Leo',build:'Desk Post',when:'10 Nov · Approved'}],
  reports:[{kid:'Leo',what:'Something I saw',where:'Learn · video "What is a tin can?"',when:'Today, 16:20',handled:false}],
  children:[{name:'Leo',age:7,colour:'Yellow'},{name:'Maya',age:10,colour:'Green'}],
  screenTime:{Leo:'30 min',Maya:'45 min'},curfew:true,notifs:[true,true,true,false],
  photos:['Bird feeder','Desk Post','Crayon Crew','Pencil pot','Plant Pal','Crayon Crew'],
  parentName:'Hannah',email:'hannah@email.co.uk',
  draftChild:null,newPin:'',gardenTime:'auto',
};}
let S;
try{S=Object.assign(defaults(),JSON.parse(localStorage.getItem(LS)||'{}'))}catch(e){S=defaults()}
function save(){try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}}

/* helpers */
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function ic(name,cls=''){const svg=(window.ICONS||{})[name]||'';return `<span class="ic ${cls}" aria-hidden="true">${svg}</span>`}
const POSE={'Idle':'idle','Blink':'blink','Happy':'happy','Talk A':'talk-a','Talk B':'talk-b','Surprised':'surprised','Wave up':'wave-up','Wave down':'wave-down'};
function sprout(pose='Idle',w=120,style=''){const k=POSE[pose]||pose;const still=((window.SPROUT||{})[k]||'').replace('class="sprout-svg"','class="sprout-svg still"');return `<span class="sprout" data-pose="${k}" role="img" aria-label="Sprout" style="width:${w}px;height:${w*1.5}px;${style}">${still}</span>`}
/* Sprout animation: Lottie files exported from Figma by Dahaba (assets/lottie). Falls back to the still pose. */
function mountSprouts(root){if(!window.lottie||!window.SPROUT_LOTTIE)return;try{lottie.destroy()}catch(e){}
 const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 root.querySelectorAll('.sprout[data-pose]').forEach(el=>{const data=SPROUT_LOTTIE[el.dataset.pose];if(!data)return;const still=el.innerHTML;el.innerHTML='';
  try{const a=lottie.loadAnimation({container:el,renderer:'svg',loop:true,autoplay:!reduce,animationData:data,rendererSettings:{preserveAspectRatio:'xMidYMid meet'}});if(reduce)a.goToAndStop(0,true)}catch(e){el.innerHTML=still}})}
function btn(label,o={}){const st=o.style||'primary',sz=o.size||'lg';const a=o.go?`data-go="${o.go}"`:o.act?`data-act="${o.act}" ${o.arg!==undefined?`data-arg="${esc(o.arg)}"`:''}`:'';
  return `<button class="btn btn-${st} btn-${sz} ${o.block===false?'':'block'} ${o.cls||''}" ${a} ${o.disabled?'disabled':''} ${o.id?`id="${o.id}"`:''}>${o.icon?ic(o.icon):''}<span>${esc(label)}</span></button>`}
function round(icon,a,o={}){return `<button class="round ${o.small?'small':''} ${o.dark?'dark':''}" ${a} aria-label="${o.label||icon.split('/')[1]}">${ic(icon)}</button>`}
function topbar(title,back='back'){return `<div class="topbar">${round('UI/Chevron left',back==='back'?'data-act="back"':`data-go="${back}"`,{label:'Back'})}<div class="display-lg">${esc(title)}</div></div>`}
function statusbar(light){return `<div class="statusbar ${light?'light':''}">9:41</div>`}

/* speech */
function speak(t){try{const u=new SpeechSynthesisUtterance(t);u.lang='en-GB';u.rate=.95;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}toast('Sprout reads it out loud','UI/Speaker')}

/* router */
let stack=[];let navId=0;let overlay=null;let toastMsg=null;let toastTimer;
function cur(){return location.hash.replace(/^#\/?/,'')||''}
function go(r,o={}){overlay=null;if(o.replace){stack[stack.length-1]=r}else stack.push(r);navId++;
  if(cur()===r)render();else{history[o.replace?'replaceState':'pushState'](null,'','#'+r);render()}}
function back(fallback){overlay=null;if(stack.length>1){stack.pop();const r=stack[stack.length-1];history.replaceState(null,'','#'+r);navId++;render()}else go(fallback||home(),{replace:true})}
function replaceRoute(r){stack[stack.length-1]=r;history.replaceState(null,'','#'+r)}
function home(){return S.persona==='parent'?'p/home':'k/garden'}
function later(ms,fn){const id=navId;setTimeout(()=>{if(id===navId)fn()},ms)}
function sheet(name,arg){overlay={type:'sheet',name,arg};render()}
function dialog(name,arg){overlay={type:'dialog',name,arg};render()}
function closeOverlay(){overlay=null;render()}
function toast(msg,icon='UI/Sparks'){toastMsg={msg,icon};clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toastMsg=null;const t=document.querySelector('.toast');if(t)t.remove()},2600);const t=document.querySelector('.toast');if(t)t.remove();const app=document.getElementById('app');if(app)app.insertAdjacentHTML('beforeend',toastHTML())}
function toastHTML(){return toastMsg?`<div class="toast" role="status">${ic(toastMsg.icon)}<span>${esc(toastMsg.msg)}</span></div>`:''}

const SCREENS={};const SHEETS={};const DIALOGS={};const ACTIONS={};
function render(){const r=cur()||'k/w1';if(!stack.length)stack=[r];
  let key=r,arg='';const m=Object.keys(SCREENS).sort((a,b)=>b.length-a.length).find(k=>r===k||r.startsWith(k+'/'));
  if(m){key=m;arg=decodeURIComponent(r.slice(m.length+1))}
  S.persona=r.startsWith('p/')?'parent':'kid';
  let out;try{out=m?SCREENS[m](arg):SCREENS['k/w1']('')}catch(e){console.error(e);out=`<div class="screen center col"><p>Something went wrong: ${esc(e.message)}</p></div>`}
  if(typeof out==='string')out={html:out};
  let html=statusbar(out.light)+out.html;
  if(overlay&&overlay.type==='sheet'&&SHEETS[overlay.name])html+=`<div class="scrim" data-act="close"></div><div class="sheet" role="dialog"><div class="handle"></div>${SHEETS[overlay.name](overlay.arg)}</div>`;
  if(overlay&&overlay.type==='dialog'&&DIALOGS[overlay.name])html+=`<div class="dialog-scrim" data-act="close"></div><div class="dialog" role="alertdialog">${DIALOGS[overlay.name](overlay.arg)}</div>`;
  html+=toastHTML();
  const app=document.getElementById('app');app.innerHTML=html;save();fitGarden();mountSprouts(app);if(out.after)out.after(app);syncPanel()}
/* Celebration confetti (canvas-confetti), drawn inside the phone frame */
let confettiFx=null;
function burst(level='big'){if(!window.confetti)return;if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const dev=document.querySelector('.device');if(!dev)return;let cv=dev.querySelector('canvas.fx');
 if(!cv){cv=document.createElement('canvas');cv.className='fx';dev.appendChild(cv);confettiFx=confetti.create(cv,{resize:true})}
 const colors=['#E45B4A','#2E7D32','#FFD54F','#8FD0EA','#C65A11','#43A047','#FFE58A'];
 const base={colors,ticks:260,gravity:.9,scalar:1.1,shapes:['square','circle','star']};
 if(level==='small'){confettiFx({...base,particleCount:60,spread:70,startVelocity:32,origin:{x:.5,y:.32}});return}
 confettiFx({...base,particleCount:90,spread:100,startVelocity:45,origin:{x:.5,y:.3}});
 setTimeout(()=>{confettiFx({...base,particleCount:60,angle:60,spread:60,startVelocity:55,origin:{x:0,y:.75}});confettiFx({...base,particleCount:60,angle:120,spread:60,startVelocity:55,origin:{x:1,y:.75}})},250);
 setTimeout(()=>confettiFx({...base,particleCount:50,spread:160,startVelocity:30,scalar:.8,origin:{x:.5,y:.2}}),700)}
function fitGarden(){const app=document.getElementById('app');if(!app)return;const w=app.clientWidth,h=app.clientHeight;app.querySelectorAll('.gwrap').forEach(g=>{const s=Math.max(w/393,h/852);g.style.transform=`translate(-50%,-50%) scale(${s})`})}

document.addEventListener('click',e=>{const t=e.target.closest('[data-go],[data-act]');if(!t||t.closest('.proto-panel'))return;
  if(t.dataset.go){e.preventDefault();go(t.dataset.go)}else{const a=t.dataset.act;e.preventDefault();
    if(a==='back')back(t.dataset.arg);else if(a==='close')closeOverlay();else if(a==='speak')speak(t.dataset.arg||document.querySelector('.speakable')?.innerText||'');
    else if(ACTIONS[a])ACTIONS[a](t.dataset.arg,t,e)}});
window.addEventListener('popstate',()=>{const r=cur();const i=stack.lastIndexOf(r);if(i>=0)stack=stack.slice(0,i+1);else stack.push(r);overlay=null;navId++;render()});
window.addEventListener('resize',fitGarden);

/* Settings panel (prototype only) */
const JUMPS=[
 ['Kid app',[['k/w1','W1 · Who\'s playing'],['k/garden','G1 · Garden home'],['k/garden/plant','G6 · Plant sheet'],['k/garden/visitor','G7 · Visitor sheet'],['k/garden/recycled','G8 · Built or recycled'],['k/garden/theme','WT2 · Weekly theme sheet'],
  ['k/scan','S1 · Camera'],['k/state/person','S8 · Not allowed'],['k/state/unsure','S9 · Not sure'],['k/state/battery','S10 · Careful'],['k/state/nomore','S11 · No scans left'],['k/state/camera','S12 · Camera off'],['k/state/offline','S13 · No internet'],['k/state/other','S14 · Pick something else'],
  ['k/result/Tin can','S3 · New treasure'],['k/result/Plastic bottle','S4 · Found again'],['k/info/ready','S5 · Get it ready'],['k/info/recycle','S6 · Recycle it'],['k/info/fact','S7 · Fun fact'],
  ['k/treasury','T1 · Treasury (tap a treasure: TS1 to TS3)'],['k/builds','MB2 · My builds'],['k/build/Crayon Crew','B1 · Build detail'],['k/build/Pencil pot','B7 · Build not ready'],['k/step/1','B4 · Step 1'],['k/step/2','B5 · Step 2'],['k/step/3','B3 · Step 3'],['k/step/4','B6 · Last step'],['k/where','BE2 · Where will it live'],['k/made','BE1 · You made it'],
  ['k/photo','R1 · Photo of the build'],['k/sent','R3 · Sent to Hannah'],['k/approved','R5 · Approved'],['k/retry','R6 · Not this time'],
  ['k/learn','L1 · Learn home'],['k/path/Tin can','L2 · 3-step path'],['k/video/Tin can','L3 · Video'],['k/quiz/Tin can','L4 · Quiz'],['k/story/Tin can','L5 · Story'],['k/expert/Tin can','L6 · Expert'],
  ['k/gate','P1 · Grown-ups only'],['k/tell','RC2 · What worried you'],['k/thanks','RC3 · Thank you']]],
 ['Parent zone',[['p/splash','A1 · Splash'],['p/welcome','A2 · Welcome'],['p/signup','U1 · Create account'],['p/code','U2 · Email code'],['p/consent','C1 · Consent'],['p/child-add','C2 · Add a child'],['p/children','C3 · Your children'],['p/camera','C4 · Camera'],['p/pin','C5 · Create PIN'],['p/how','C7 · How it works'],['p/handover','C8 · Hand over'],
  ['p/signin','I1 · Sign in'],['p/locked','I3 · Too many tries'],['p/forgot','I4 · Forgot password'],['p/link-sent','I5 · Link sent'],
  ['p/push','PZ2 · Push alert'],['p/home','PZ1 · Parent home'],['p/approvals','AP1 · Approvals'],['p/review/0','AP2 · Review build'],['p/nottime/0','AP3 · Not this time'],
  ['p/family','FA1 · Family'],['p/child/Leo','FA2 · Leo'],['p/photos','FA3 · Photos'],['p/time','FA4 · Screen time'],['p/report','FA5 · Report'],
  ['p/account','AC1 · Account'],['p/password','AC2 · Change password'],['p/notifs','AC3 · Notifications'],['p/delete','AC4 · Delete account']]]];
function opt(key,val,label){return `<button class="opt ${S[key]===val?'on':''}" data-set="${key}" data-val="${esc(JSON.stringify(val))}">${label}</button>`}
function panelHTML(){return `<div class="row" style="justify-content:space-between"><h3>Prototype settings</h3><button class="opt" data-closepanel>Close</button></div><p class="note">Controls for testing. They are not part of the app.</p>
 <h4>Start as</h4><div class="opts"><button class="opt" data-start="kid">Kid app (Leo)</button><button class="opt" data-start="parent">Parent zone (Hannah)</button><button class="opt" data-start="launch">First launch</button></div>
 <h4>Jump to a screen</h4><select data-jump><option value="">Choose a screen…</option>${JUMPS.map(([g,l])=>`<optgroup label="${g}">${l.map(([r,n])=>`<option value="${esc(r)}">${esc(n)}</option>`).join('')}</optgroup>`).join('')}</select>
 <h4>Kid app states</h4><div class="opts">${opt('offline',false,'Online')}${opt('offline',true,'Offline')}</div>
 <div class="opts" style="margin-top:6px">${opt('firstDay',false,'Normal day')}${opt('firstDay',true,'First day')}</div>
 <div class="opts" style="margin-top:6px">${opt('cameraAllowed',true,'Camera on')}${opt('cameraAllowed',false,'Camera off')}</div>
 <h4>Scans left today</h4><div class="opts">${opt('scansLeft',3,'3')}${opt('scansLeft',1,'1')}${opt('scansLeft',0,'0')}</div>
 <h4>Next scan result</h4><div class="opts">${[['auto','Story order'],['new','New treasure'],['again','Found again'],['person','A person'],['unsure','Not sure'],['battery','Battery'],['other','Something else']].map(([v,l])=>opt('nextScan',v,l)).join('')}</div>
 <h4>Next build photo</h4><div class="opts">${opt('nextPhoto','ok','Just the build')}${opt('nextPhoto','person','Has a person')}</div>
 <h4>Garden time of day (Proposal)</h4><div class="opts">${opt('gardenTime','auto','Device clock')}${opt('gardenTime','morning','Morning')}${opt('gardenTime','day','Day')}${opt('gardenTime','dusk','Evening')}</div>
 <h4>Garden continue card</h4><div class="opts">${[['news','Parent news'],['progress','Build in progress'],['almost','Almost ready'],['scan','Nothing waiting']].map(([v,l])=>opt('continueKind',v,l)).join('')}</div>
 <h4>To confirm with the client</h4><div class="opts">${opt('c5','A','C5-A counter always')}${opt('c5','B','C5-B counter at limit')}</div><div class="opts" style="margin-top:6px">${opt('a2','A','A2-A treasures')}${opt('a2','B','A2-B items rescued')}</div>
 <h4>Proposals</h4><div class="opts">${opt('weekly',true,'Weekly theme on')}${opt('weekly',false,'off')}</div><div class="opts" style="margin-top:6px">${opt('a1',true,'Inside or outside on')}${opt('a1',false,'off')}</div><div class="opts" style="margin-top:6px">${opt('ages','9-12','Ages 9 to 12 text')}${opt('ages','5-9','Ages 5 to 9')}</div><div class="opts" style="margin-top:6px">${opt('tellUs',true,'Report link on')}${opt('tellUs',false,'off')}</div>
 <h4>Parent zone</h4><div class="opts"><button class="opt" data-jumpto="p/push">Send the push alert</button></div>
 <p class="note" style="margin-top:8px">Grown-up PIN: <b>${esc(S.pin)}</b>. Email code: any 6 digits (000000 shows the error).</p>
 <button class="reset" data-reset>Reset the prototype</button>`}
function syncPanel(){const p=document.querySelector('.proto-panel');if(p&&p.classList.contains('open'))p.innerHTML=panelHTML()}
function initPanel(){const fab=document.createElement('button');fab.className='proto-fab';fab.setAttribute('aria-label','Prototype settings');fab.innerHTML=ic('UI/Settings');
  const p=document.createElement('div');p.className='proto-panel';document.body.append(fab,p);
  fab.onclick=()=>{p.classList.toggle('open');if(p.classList.contains('open'))p.innerHTML=panelHTML()};
  p.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
    if(t.dataset.set){S[t.dataset.set]=JSON.parse(t.dataset.val);save();render()}
    else if(t.dataset.start){const s=t.dataset.start;stack=[];go(s==='kid'?'k/w1':s==='parent'?'p/home':'p/splash')}
    else if(t.dataset.jumpto){go(t.dataset.jumpto)}
    else if(t.hasAttribute('data-closepanel')){p.classList.remove('open')}
    else if(t.hasAttribute('data-reset')){const keep={};Object.assign(S,defaults());save();stack=[];toast('Prototype reset','UI/Refresh');go('k/w1')}});
  p.addEventListener('change',e=>{if(e.target.dataset.jump!==undefined&&e.target.value){const r=e.target.value;stack=[];go(r)}})}

window.EC={burst,replaceRoute,S,save,defaults,MATERIALS,FAMILY,esc,ic,sprout,btn,round,topbar,speak,go,back,later,sheet,dialog,closeOverlay,toast,render,SCREENS,SHEETS,DIALOGS,ACTIONS,get overlay(){return overlay}};
window.addEventListener('DOMContentLoaded',()=>{initPanel();const q=new URLSearchParams(location.search).get('start');
  if(!location.hash){const r=q==='parent'?'p/home':q==='launch'?'p/splash':'k/w1';history.replaceState(null,'','#'+r)}
  stack=[cur()];render()});
})();
