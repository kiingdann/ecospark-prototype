/* EcoSpark for Kids · kid app screens (Mobile — Kid app Flow page) */
(function(){
const {S,save,MATERIALS,FAMILY,esc,ic,sprout,btn,round,topbar,speak,go,back,later,sheet,dialog,closeOverlay,toast,render,SCREENS,SHEETS,DIALOGS,ACTIONS}=EC;

/* Story data. Crayon Crew and Pencil pot copy come from the Figma file. */
const BUILDS={
 'Crayon Crew':{tag:'Give your crayons a tidy home.',needs:['Yoghurt pot'],guNote:'A grown-up helps with step 1',
  have:[['From your treasures',[['Clean yoghurt pot','Material/Yoghurt pot','have']]],['From home',[['Short crayons','Build/Crayon Crew','have'],['Scrap-paper strip','Material/Newspaper','opt'],['Paper glue','Material/Cardboard box','opt'],['Scissors','UI/Hand','gu']]]]},
 'Pencil pot':{tag:'Make a pot for your pencils.',needs:['Tin can'],guNote:'A grown-up helps with one step',
  have:[['From your treasures',[['Tin can','Material/Tin can','tin'],['Scrap paper','Material/Newspaper','have']]],['From home',[['Crayons to decorate','Build/Crayon Crew','opt']]]]},
 'Bird feeder':{tag:'Make a feeder for garden birds.',needs:['Plastic bottle','Plastic bottle'],guNote:'A grown-up helps with cutting',outside:true,
  have:[['From your treasures',[['Plastic bottle','Material/Plastic bottle','bottle']]],['From home',[['Bird seed','Visitor/Bird','have'],['String','UI/Steps','opt']]]]},
 'Plant Pal':{tag:'Grow a little plant in a bottle.',needs:['Plastic bottle','Plastic bottle','Plastic bottle'],guNote:'A grown-up helps with cutting',
  have:[['From your treasures',[['Plastic bottles','Material/Plastic bottle','bottles']]],['From home',[['Soil and a seed','Plant/Sprout','have']]]]},
 'Desk Post':{tag:'A little post box for your notes.',needs:['Cardboard box'],guNote:'A grown-up helps with step 1',have:[['From your treasures',[['Cardboard box','Material/Cardboard box','have']]]]},
};
const STEPS=[
 {pic:'Material/Yoghurt pot',gu:true,title:'Check your pot',text:'Ask a grown-up to wash, dry and check your pot.'},
 {pic:'Material/Newspaper',opt:true,title:'Make a picture label',text:'Want a label? Draw a picture on your paper strip. No label? Skip straight to step four.'},
 {pic:'Material/Yoghurt pot',opt:true,title:'Wrap the label',text:'If you made a label, wrap it around the pot. Glue the paper ends together, keeping glue off the pot.'},
 {pic:'Build/Crayon Crew',title:'Move your crayons in',text:'Put a few short crayons inside. Pick one out: can your pot stay standing?',text912:'Put a few short crayons inside, tips up. Pick one out and put it back: if the pot tips, use fewer crayons or a wider pot. A wide base keeps things steady.'}];
const SCAN={ 'Tin can':{fact:'A tin can can be recycled again and again, forever!',build:'Pencil pot',facts:['4 steps','10 min'],
   ready:[['Rinse it with water.'],['Check the edges. Sharp lids are for grown-ups.',1],['Put it in your rescue box.']],
   recycle:[['Rinse it.'],['Squash it if you can.'],['Ask a grown-up which bin it goes in. Every council is different.',1]]},
 'Plastic bottle':{fact:'A plastic bottle can come back as a new bottle, or even a fleece jumper!',build:'Bird feeder',facts:['5 steps','20 min'],
   recycle:[['Empty it and rinse it.'],['Put the lid back on.'],['Ask a grown-up which bin it goes in. Every council is different.',1]]}};
const kidName=()=>S.kid||'Leo';
const parent=()=>S.parentName||'Hannah';

/* shared pieces */
function kidHeader(title){return `<div class="kidhead"><div class="display-lg">${esc(title||kidName())}</div><div class="sparks">${ic('UI/Sparks')}${S.sparks}</div></div>`}
function tabbar(active){const t=[['Garden','UI/Garden','k/garden'],['Treasury','UI/Shed','k/treasury'],['Scan','UI/Camera','k/scan'],['Learn','UI/Learn','k/learn'],['Grown-ups','UI/Grown-ups','k/gate']];
 return `<nav class="tabbar">${t.map(([l,i,r])=>`<button class="tab ${l==='Scan'?'scan':''} ${active===l?'active':''}" data-go="${r}"><span class="tile">${ic(i)}</span>${l}</button>`).join('')}</nav>`}
function sproutBubble(pose,msg,size=64){return `<div class="row gap8">${sprout(pose,size)}<div class="bubble multi">${esc(msg)}</div></div>`}
function found(){return Object.keys(S.shelf).length}
function slots(name,small){const need=(BUILDS[name]||{}).needs||[];const st=S.builds[name];const missing=st==='ready'||st==='built'?0:name==='Plant Pal'?2:1;
 return `<div class="slots">${need.map((m,i)=>`<span class="slot ${i>=need.length-missing?'missing':''}">${ic('Material/'+m)}</span>`).join('')}</div>`}
function buildCard(name){return `<div class="buildcard"><div class="thumb">${ic('Build/'+name,'s44')}</div><div class="grow"><div class="title-md">${esc(name)}</div>${slots(name)}</div>${btn('Build it',{size:'md',block:false,go:'k/build/'+name})}</div>`}
function needText(name){return {'Bird feeder':'1 more bottle','Pencil pot':'1 more tin can','Plant Pal':'2 more bottles'}[name]||'1 more'}
function stageObj(icon,dim){return icon?`<span class="ic cam-object ${dim?'dim':''}">${(window.ICONS||{})[icon]}</span>`:''}
function vf(){return '<div class="viewfinder"><i></i><i></i><i></i><i></i></div>'}
function camTop(o={}){const pill=o.noPill?'<span></span>':`<span class="scans-pill">${ic('UI/Camera')}${S.scansLeft<=0?'No scans left today':S.scansLeft+' scan'+(S.scansLeft===1?'':'s')+' left today'}</span>`;
 return `<div class="cam-top">${round('UI/Close',o.close||'data-act="back"',{dark:true,label:'Close'})}${pill}<span class="spacer"></span></div>`}
function msgCard(pose,title,line,primary,secondary){return `<div class="msgcard">${sprout(pose,64)}<div class="display-md">${esc(title)}</div><div class="body-sm muted" style="font-weight:600">${esc(line)}</div>${primary?btn(primary[0],{size:'md',...primary[1]}):''}${secondary?btn(secondary[0],{size:'md',style:'secondary',...secondary[1]}):''}</div>`}
function confetti(){const c=['#E45B4A','#2E7D32','#FFD54F','#8FD0EA','#C65A11'];let s='';for(let i=0;i<14;i++)s+=`<i style="left:${i*19}px;top:${i%2?13:0}px;background:${c[i%5]};--r:${(i%3-1)*25}deg;animation-delay:${i*.12}s"></i>`;return `<div class="confetti">${s}</div>`}

/* W1 · Who's playing */
SCREENS['k/w1']=()=>`<div class="screen"><div class="top-space"></div><div class="scroll col center gap24" style="padding:40px 16px 0">${sprout('Wave up',120)}<div class="display-xl" style="font-size:34px">Who's playing?</div>
 <div class="row gap16 fill" style="justify-content:center">${S.children.map(c=>`<button class="action-tile" style="max-width:158px;min-height:168px;gap:14px" data-act="pickKid" data-arg="${esc(c.name)}"><span class="avatar big ${c.colour}">${esc(c.name[0])}</span><span class="title-md">${esc(c.name)}</span></button>`).join('')}</div></div>
 <button class="row gap8 center label-md muted" style="padding:16px 0 40px;font-size:16px" data-go="k/gate">${ic('UI/Lock','s20')}Grown-ups</button></div>`;
ACTIONS.pickKid=n=>{S.kid=n;go('k/garden')};

/* G · Garden home */
function gardenLayers(empty){return window.GARDEN_SCENE({empty})}
function continueCard(){let k=S.continueKind;if(S.offline)k='offline';else if(S.firstDay)k='first';
 const C={news:['Build/Desk Post',`${parent()} says: Proud of you!`,'Your Desk Post is on your shelf','k/builds/Desk Post'],
  progress:['Build/Crayon Crew',`Crayon Crew: step ${Math.max(2,S.buildStep||2)} of 4`,'Pick up where you left off','k/step/'+Math.max(2,S.buildStep||2)],
  almost:['Build/Bird feeder','Bird feeder: 1 more bottle','Scan a plastic bottle to finish it','k/scan'],
  scan:['UI/Camera','Scan a treasure','Find something to rescue at home','k/scan'],
  first:['UI/Camera','Scan your first treasure','Your garden grows when you scan, build and learn','k/scan'],
  offline:['UI/Wifi off','No internet right now','Your garden is safe. Try again in a bit.','']}[k];
 return `<button class="continue" ${C[3]?`data-go="${C[3]}"`:'data-act="retry"'}><span class="peek">${sprout('Idle',84)}</span><span class="ictile">${ic(C[0],'s36')}</span><span class="grow col gap4"><span class="title-md">${esc(C[1])}</span><span class="body-sm muted">${esc(C[2])}</span></span>${ic('UI/Chevron right','s20')}</button>`}
SCREENS['k/garden']=(arg)=>{
 if(S.kidCelebrate&&!arg)return SCREENS['k/approved']('');
 if(S.kidRetry&&!arg)return SCREENS['k/retry']('');
 return {html:`<div class="screen sky"><div class="garden">${gardenLayers(S.firstDay)}</div><div class="top-space" style="position:relative;z-index:2"></div><div style="position:relative;z-index:2">${kidHeader()}</div>
 ${S.weekly&&!S.firstDay?`<div style="position:relative;z-index:2;padding:0 16px"><button class="theme-pill" data-act="theme">${ic('Visitor/Bird')}This week: Autumn birds</button></div>`:''}
 <div class="grow"></div><div style="position:relative;z-index:2;padding:0 16px 14px">${continueCard()}</div>${tabbar('Garden')}</div>`,
 after(){if(arg&&!EC.overlay){EC.replaceRoute('k/garden');}if(arg&&!EC.overlay)ACTIONS[{plant:'plant',visitor:'visitor',recycled:'recycled',theme:'theme'}[arg]]?.('Sunflower')}};
};
ACTIONS.plant=k=>sheet('plant',k||'Sunflower');
ACTIONS.visitor=()=>sheet('visitor');
ACTIONS.recycled=()=>sheet('recycled');
ACTIONS.theme=()=>sheet('theme');
ACTIONS.nextFlower=()=>toast(`${100-Math.min(100,S.firstDay?0:S.garden)} more sparks to grow your next flower`);
ACTIONS.retry=()=>{toast('Still no internet. Try again in a bit.','UI/Wifi off')};
SHEETS.plant=k=>`<div class="row gap16">${ic('Plant/'+k,'s64')}<div class="col gap4"><div class="display-lg">${esc(k)}</div><div class="body-md muted">Grew with your sparks</div><div class="label-sm muted">10 Nov</div></div></div>${btn('Close',{act:'close'})}`;
SHEETS.visitor=()=>`<div class="row gap16">${ic('Visitor/Bird','s96')}<div class="col gap4 grow"><div class="display-lg">A robin came to visit!</div><div class="body-md muted">Your Bird feeder is outside. Robins love seeds in autumn.</div></div></div>${btn('Yay!',{act:'close'})}`;
SHEETS.recycled=()=>`<div class="row gap12"><span class="icon-tile" style="width:64px;height:64px;border-radius:16px">${ic('Material/Yoghurt pot','s44')}</span><div class="display-md grow">What happened to your yoghurt pot?</div></div>
 <div class="col gap12"><button class="qa" style="height:64px;flex-direction:row" data-act="endPot" data-arg="built">I built with it</button><button class="qa" style="height:64px;flex-direction:row" data-act="endPot" data-arg="recycled">I recycled it</button></div>
 <div class="body-md muted center">Both are a great ending!</div><button class="link muted" data-act="close">Not yet</button>`;
ACTIONS.endPot=v=>{closeOverlay();S.sparks+=5;toast(v==='built'?'Great building! +5 sparks':'Great recycling! +5 sparks')};
SHEETS.theme=()=>`<div class="row gap12">${ic('Visitor/Bird','s64')}<div class="col gap4"><div class="label-sm" style="color:var(--orange)">THIS WEEK</div><div class="display-lg">Autumn birds</div></div></div><div class="body-md">Robins are looking for food. Build a feeder and one might visit your garden!</div>
 <div class="section-title">Build</div>${buildCard('Bird feeder')}<div class="section-title">Learn</div>${learnRow('Plastic bottle')}${btn("Let's go!",{act:'close'})}`;

/* S · Scan */
function nextOutcome(){if(S.nextScan!=='auto')return S.nextScan;return S.scanCount===0?'new':S.scanCount===1?'again':'again'}
function outcomeItem(o){return o==='new'?'Tin can':o==='again'?'Plastic bottle':null}
SCREENS['k/scan']=()=>{
 if(!S.cameraAllowed)return SCREENS['k/state']('camera');
 if(S.scansLeft<=0)return SCREENS['k/state']('nomore');
 const item=outcomeItem(nextOutcome());
 return {light:true,html:`<div class="screen dark">${'<div class="top-space"></div>'}${camTop({close:'data-go="k/garden"'})}<div class="stage">${stageObj(item?'Material/'+item:null)}${vf()}</div>
 <div class="hint-chip">Hold it still</div><div class="cam-bottom">${sproutBubble('Talk A','Show me one thing. No people, just things!')}<button class="shutter" data-act="shoot" aria-label="Take the photo">${ic('UI/Camera')}</button></div></div>`}};
ACTIONS.shoot=()=>{document.querySelector('.device').insertAdjacentHTML('beforeend','<div class="flash"></div>');setTimeout(()=>document.querySelector('.flash')?.remove(),400);
 if(S.offline)return go('k/state/offline');go('k/checking',{replace:true})};
SCREENS['k/checking']=()=>{const o=nextOutcome();const item=outcomeItem(o);
 return {light:true,html:`<div class="screen dark"><div class="top-space"></div>${camTop({close:'data-go="k/garden"'})}<div class="stage">${stageObj(item?'Material/'+item:null)}${vf()}</div>${msgCard('Blink','Checking…','Looking closely…')}</div>`,
 after(){later(1600,()=>{
  if(item){S.scanCount++;S.scansLeft=Math.max(0,S.scansLeft-1);S.rescued++;
   if(o==='new'){S.shelf['Tin can']=(S.shelf['Tin can']||0)+1;S.sparks+=10;S.garden=Math.min(100,S.garden+10);if(S.builds['Pencil pot']==='almost'){S.builds['Pencil pot']='ready';S.justReady='Pencil pot'}}
   else{S.shelf['Plastic bottle']=(S.shelf['Plastic bottle']||0)+1;if(S.builds['Bird feeder']==='almost'){S.builds['Bird feeder']='ready';S.justReady='Bird feeder'}}
   S.firstDay=false;go('k/result/'+item,{replace:true});if(o==='new')setTimeout(()=>EC.burst('small'),150)}
  else go('k/state/'+o,{replace:true})})}}};
SCREENS['k/state']=k=>{const ST={
  person:['Surprised',"Let's try again",'I can only see things, not people. Show me just one thing.',['Try again',{go:'k/scan'}]],
  unsure:['Talk A',"Hmm, I'm not sure",'Try one thing, closer, in good light.',['Try again',{go:'k/scan'}]],
  battery:['Surprised','Careful! Grown-ups only','Batteries can be dangerous. Ask a grown-up to take it to a special recycling point.',['Ask a grown-up',{go:'k/gate'}],['Scan something else',{go:'k/scan'}]],
  nomore:['Blink',"That's all for today",'Come back tomorrow for more treasure hunting!',['Build something',{go:'k/builds'}],['Back to my Garden',{go:'k/garden'}]],
  camera:['Talk A','I need the camera','Ask a grown-up to turn it on so I can see your treasures.',['Ask a grown-up',{go:'k/gate'}],['Back',{go:'k/garden'}]],
  offline:['Surprised','No internet right now','Scanning needs the internet. Try again in a bit.',['Try again',{go:'k/scan'}],['Back to my Garden',{go:'k/garden'}]],
  other:['Talk A',"Let's pick something else",'Try a bottle, a box or a tin.',['Try again',{go:'k/scan'}]]}[k]||[];
 if((k==='person'||k==='unsure'||k==='other')&&S.nextScan!=='auto')S.nextScan='auto';
 return {light:true,html:`<div class="screen dark"><div class="top-space"></div>${camTop({close:'data-go="k/garden"',noPill:k==='camera'})}<div class="stage">${vf()}</div>${msgCard(ST[0],ST[1],ST[2],ST[3],ST[4])}</div>`}};
SCREENS['k/result']=item=>{item=item||'Tin can';const isNew=item==='Tin can';const d=SCAN[item]||SCAN['Tin can'];const n=found();
 return `<div class="screen"><div class="top-space"></div><div class="cam-top">${round('UI/Close','data-go="k/garden"',{label:'Close'})}<span class="scans-pill light">${ic('UI/Camera')}${S.scansLeft<=0?'No scans left today':S.scansLeft+' scan'+(S.scansLeft===1?'':'s')+' left today'}</span>${round('UI/Speaker',`data-act="speak" data-arg="${esc(item+'. '+(isNew?'New treasure! '+n+' of 12 found':'Found again. Great rescue!'))}"`)}</div>
 <div class="scroll"><div class="col gap16 pad" style="padding-top:8px;padding-bottom:24px"><div class="col center gap8"><div class="icon-tile">${ic('Material/'+item,'s64')}</div><div class="display-lg">${esc(item)}</div><span class="family-chip">${FAMILY[item]}</span></div>
 ${isNew?`<div class="banner">${ic('UI/Star')}<span class="grow">New treasure! ${n} of 12 found</span><span class="plus">${ic('UI/Sparks')}+10</span></div>`:`<div class="banner again">${ic('UI/Star')}<span class="grow">Found ×${S.shelf[item]||2}. Great rescue!</span></div>`}
 <div class="section-title" style="font-size:16px">You can make</div>${buildCard(d.build)}
 <div class="actions3">${isNew?`<button class="action-tile" data-go="k/info/ready/${item}"><span class="disc">${ic('UI/Hand')}</span>Get it ready</button>`:''}<button class="action-tile" data-go="k/info/recycle/${item}"><span class="disc">${ic('UI/Refresh')}</span>Recycle it</button><button class="action-tile" data-go="k/info/fact/${item}"><span class="disc">${ic('UI/Star')}</span>Fun fact</button></div></div></div>
 <div class="col gap8 pad" style="padding-bottom:28px">${btn('Scan another',{icon:'UI/Camera',act:'scanAnother'})}<button class="link muted" data-act="notRight">That's not right</button></div></div>`};
ACTIONS.scanAnother=()=>go(S.scansLeft<=0?'k/state/nomore':'k/scan');
ACTIONS.notRight=()=>{toast("Thanks for telling me! Let's try again.",'UI/Refresh');go('k/scan')};
SCREENS['k/info']=arg=>{const [kind,item0]=arg.split('/');const item=item0||'Tin can';const d=SCAN[item]||SCAN['Tin can'];
 const title={ready:'Get it ready',recycle:'Recycle it',fact:'Fun fact'}[kind];const btnL={ready:'Done',recycle:'Got it',fact:'Cool!'}[kind];
 const lines=kind==='fact'?null:(kind==='ready'?d.ready||SCAN['Tin can'].ready:d.recycle);
 const body=lines?lines.map((l,i)=>`<div class="steprow ${l[1]?'gu':''}"><span class="num">${i+1}</span><span class="txt">${esc(l[0])}</span>${l[1]?`<span class="hand">${ic('UI/Hand','s20')}</span>`:''}</div>`).join(''):`<div class="body-lg">${esc(d.fact)}</div>`;
 return {light:true,html:`<div class="screen dark"><div class="top-space"></div>${camTop({close:'data-act="back"'})}<div class="stage" style="align-items:flex-start;padding-top:60px">${stageObj('Material/'+item,true)}</div>
 <div class="sheet" style="animation:none;gap:14px"><div class="handle"></div><div class="row gap12">${round('UI/Arrow left','data-act="back"',{small:true,label:'Back'})}<div class="display-lg grow">${title}</div>${round('UI/Speaker',`data-act="speak" data-arg="${esc(title+'. '+(lines?lines.map(l=>l[0]).join(' '):d.fact))}"`,{small:true})}</div>
 <div class="picture">${ic('Material/'+item,'s64')}</div><div class="col gap4">${body}</div>${btn(btnL,{act:'back'})}</div></div>`}};

/* T · Treasury */
function shed(empty){const items=empty?[]:Object.entries(S.shelf);const tiles=[];for(let i=0;i<12;i++){const it=items[i];tiles.push(it?`<button class="ttile" data-act="treasure" data-arg="${esc(it[0])}" aria-label="${esc(it[0])}">${ic('Material/'+it[0])}${it[1]}</button>`:'<button class="ttile missing" data-act="treasure" data-arg="?" aria-label="Missing treasure">?</button>')}
 return `<div class="shed"><div class="roof">${(window.GARDEN||{}).roof||''}<button class="roof-sign" data-go="k/builds">My builds ${ic('UI/Chevron right','s20')}</button></div><div class="wall">${[0,1,2].map(r=>`<div class="shelf">${tiles.slice(r*4,r*4+4).join('')}</div>`).join('')}</div></div>`}
function progressCard(empty){const n=empty?0:found();const hideScans=S.c5==='B'&&S.scansLeft>0;
 const pill=hideScans?'':`<span class="scans-pill light">${ic('UI/Camera')}${S.scansLeft<=0?'Back tomorrow':S.scansLeft+' scan'+(S.scansLeft===1?'':'s')+' left today'}</span>`;
 if(S.a2==='B'&&!empty)return `<div class="progcard"><div class="row" style="justify-content:space-between"><div class="title-md">${S.rescued} items rescued</div>${pill}</div><div class="body-sm muted" style="margin-top:6px">3 new this week. Keep going!</div></div>`;
 return `<div class="progcard"><div class="row" style="justify-content:space-between"><div class="title-md">${n} of 12 treasures</div>${pill}</div><div class="segs">${Array.from({length:12},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('')}</div></div>`}
function readyBuilds(){return Object.keys(S.builds).filter(b=>S.builds[b]==='ready')}
function almostBuilds(){return Object.keys(S.builds).filter(b=>S.builds[b]==='almost'||S.builds[b]==='need')}
SCREENS['k/treasury']=()=>{const empty=S.firstDay;const ready=readyBuilds();const first=S.justReady&&ready.includes(S.justReady)?S.justReady:ready[0];
 let msg,zone;
 if(empty){zone=`${sproutBubble('Wave up',`Hi ${kidName()}! Let's find your first treasure.`,44)}`}
 else if(found()>=12){zone=sproutBubble('Happy','You found all 12 treasures!',44)}
 else{msg=S.sentBuild?`${parent()} is looking at your ${S.sentBuild}!`:S.scansLeft<=0?(S.c5==='B'?'Great scanning today! More tomorrow.':'Scans are back tomorrow!'):S.justReady&&first===S.justReady?`${first} is ready!`:S.a2==='B'?'What can you rescue today?':first?`You can build ${first}!`:'Find 1 more bottle for the Bird feeder';
  const others=almostBuilds();
  zone=`${sproutBubble('Talk A',msg,44)}${S.sentBuild?`<div class="buildcard" style="box-shadow:0 0 0 2px var(--line)"><div class="thumb">${ic('Build/'+S.sentBuild,'s44')}</div><div class="grow"><div class="title-md">Waiting for ${parent()}</div><div class="body-sm muted">Your ${esc(S.sentBuild)} is on its way</div></div><div class="spinner" style="width:28px;height:28px"></div></div>`:first?buildCard(first):''}
  ${others.length?`<button class="morelink" data-go="k/builds"><span class="mini">${ic('Build/'+others[0])}</span>${others[1]?`<span class="mini" style="margin-left:-12px">${ic('Build/'+others[1])}</span>`:''}${others.length} more almost ready ${ic('UI/Chevron right','s20')}</button>`:''}`}
 return `<div class="screen"><div class="top-space"></div>${kidHeader('Treasury')}<div class="scroll"><div class="col gap16 pad" style="padding-bottom:24px">${progressCard(empty)}${shed(empty)}<div class="zone">${zone}</div>
 ${empty?btn('Scan something',{icon:'UI/Camera',go:'k/scan'}):''}${!empty&&found()>=12?btn('See my builds',{style:'accent',go:'k/builds'}):''}</div></div>${tabbar('Treasury')}</div>`};

/* TS · Treasure sheet (TL2, Proposal, 14 Nov) */
ACTIONS.treasure=m=>sheet('treasure',m);
SHEETS.treasure=m=>{if(m==='?')return `<div class="row gap16"><span class="icon-tile" style="width:88px;height:88px"><span class="display-xl">?</span></span><div class="col gap4 grow"><div class="display-lg">Find this one!</div><div class="body-md muted">Scan something new to fill this spot.</div></div></div>${btn('Scan',{icon:'UI/Camera',act:'sheetGo',arg:'k/scan'})}${btn('Close',{style:'secondary',act:'close'})}`;
 const n=S.shelf[m]||1;const hasLearn=LEARN.includes(m);const p=hasLearn?lp(m):null;
 return `<div class="row gap16"><span class="icon-tile" style="width:88px;height:88px">${ic('Material/'+m,'s64')}</span><div class="col gap4 grow"><div class="display-lg">${esc(m)}</div><div class="body-md muted">You found ${n}. Great rescue!</div><span class="family-chip" style="align-self:flex-start">${FAMILY[m]||'Other'}</span></div></div>
 ${hasLearn?`<div class="learnrow" style="padding:12px 16px"><span class="name">Learn</span><span class="mini3"><i class="${p.video?'done':''}">${ic('UI/Video')}</i><i class="${p.quiz?'done':''}">${ic('UI/Quiz')}</i><i class="${p.story?'done':''}">${ic('UI/Headphones')}</i></span></div>${btn('Learn about it',{icon:'UI/Learn',act:'sheetGo',arg:'k/path/'+m})}${btn('What can I build?',{style:'secondary',act:'sheetGo',arg:'k/builds'})}`
 :`<div class="offline">${ic('UI/Clock','s20')}Videos about the ${esc(m.toLowerCase())} are coming soon.</div>${btn('What can I build?',{act:'sheetGo',arg:'k/builds'})}${btn('Close',{style:'secondary',act:'close'})}`}`};
ACTIONS.sheetGo=r=>go(r);

/* MB2 · My builds */
SCREENS['k/builds']=arg=>{const st=s=>Object.keys(S.builds).filter(b=>S.builds[b]===s);
 const groups=[['Ready to build',st('ready')],['Almost there',st('almost')],['Need more',st('need')],['Built',st('built').concat(st('sent'))]];
 const tile=b=>{const s=S.builds[b];return `<div role="button" tabindex="0" class="btile ${s==='ready'?'ready':''}" ${s==='built'||s==='sent'?`data-act="builtSheet" data-arg="${esc(b)}"`:`data-go="k/build/${b}"`}><span class="pic">${ic('Build/'+b,'s44')}</span><span class="title-sm">${esc(b)}</span>
  ${s==='ready'?btn('Build it',{size:'sm',go:'k/build/'+b}):s==='built'?`<span class="need" style="color:var(--green)">${ic('Status/Check badge','s16')}Built</span>`:s==='sent'?`<span class="need">Waiting for ${parent()}</span>`:`<span class="need"><span class="slot missing">${ic('Material/'+(BUILDS[b].needs[0]))}</span>${needText(b)}</span>`}</div>`};
 const r=st('ready').length,a=st('almost').length+st('need').length,bu=st('built').length+st('sent').length;
 return {html:`<div class="screen"><div class="top-space"></div>${topbar('My builds')}<div class="scroll"><div class="col gap16 pad" style="padding-bottom:28px"><div class="progcard"><div class="title-md">${r} ready to build</div><div class="body-sm muted" style="margin-top:4px;font-weight:600">${a} almost there · ${bu} built</div></div>
 ${groups.filter(g=>g[1].length).map(([t,l])=>`<div class="col gap8"><div class="row" style="justify-content:space-between"><div class="title-md">${t}</div><span class="label-md muted">${l.length}</span></div><div class="shelfbox"><div class="btiles">${l.map(tile).join('')}</div></div></div>`).join('')}</div></div></div>`,
 after(){if(arg&&!EC.overlay){EC.replaceRoute('k/builds');ACTIONS.builtSheet(arg)}}}};
ACTIONS.builtSheet=b=>sheet('built',b);
SHEETS.built=b=>`<div class="row gap16"><span class="icon-tile" style="width:96px;height:96px">${ic('Build/'+b,'s64')}</span><div class="col gap4"><div class="display-lg">${esc(b)}</div><div class="body-sm muted" style="font-weight:600">${S.builds[b]==='sent'?'Waiting for '+parent():'Built on 10 Nov · '+parent()+' loved it'}</div>${ic('Plant/Daisy','s36')}</div></div>${btn('Build it again',{go:'k/build/'+b})}${btn('Close',{style:'secondary',act:'close'})}`;

/* B · Build it */
SCREENS['k/build']=name=>{name=name||'Crayon Crew';const d=BUILDS[name]||BUILDS['Crayon Crew'];const st=S.builds[name];const ready=st==='ready'||st==='built'||st==='sent';
 const row=([n,icn,s])=>{const miss=!ready&&(s==='tin'||s==='bottle'||s==='bottles');const state=miss?`<span class="state" style="color:var(--orange)">${needText(name).replace(/^(\d+) more.*/,'$1 more')}</span>`:s==='opt'?'<span class="state muted">Optional</span>':s==='gu'?'<span class="state" style="color:var(--orange-ink)">Grown-up only</span>':`<span class="state green">${ic('Status/Check badge')}Got it</span>`;
  return `<div class="ingr ${miss?'missing':''}"><span class="pic">${ic(icn)}</span><span class="name">${esc(n)}</span>${state}</div>`};
 return `<div class="screen"><div class="top-space"></div>${topbar(name)}<div class="scroll"><div class="col gap12 pad" style="padding-bottom:20px"><div class="hero">${ic('Build/'+name,'s96')}</div>
 <div class="body-md">${esc(d.tag)}</div><div class="row gap8" style="flex-wrap:wrap"><span class="info-chip">${ic('UI/Steps')}4 steps</span><span class="info-chip">${ic('UI/Clock')}About 10 min</span><span class="info-chip">${ic('UI/Star')}Ages 5 to 9</span></div>
 <div class="gu-note">${esc(d.guNote)}<span class="hand">${ic('UI/Hand')}</span></div>
 ${!ready?`<div class="gu-note" style="background:var(--yellow);color:var(--cocoa)">Find ${needText(name)} to build this</div>`:''}
 <div class="display-md" style="margin-top:6px">What you need</div>${d.have.map(([g,rows])=>`<div class="label-md muted">${g}</div>${rows.map(row).join('')}`).join('')}</div></div>
 <div class="col gap8 pad" style="padding-bottom:22px;padding-top:8px">${ready?btn('Start building',{act:'startBuild',arg:name}):btn('Scan '+(name==='Pencil pot'?'a tin can':'a plastic bottle'),{go:'k/scan'})}${ready?`<button class="link" data-act="forGrownups">For grown-ups: read before you start</button>`:btn('Back',{style:'secondary',act:'back'})}</div></div>`};
ACTIONS.forGrownups=()=>sheet('grownups');
SHEETS.grownups=()=>`<div class="gu-note" style="font:700 18px/22px var(--f-display)"><span class="hand" style="margin:0">${ic('UI/Hand')}</span>For grown-ups</div>
 <div class="col gap8"><div class="body-md-bold">Check the item</div><div class="body-md muted" style="font-size:15px">Use an empty, clean, dry yoghurt pot with a broad base and smooth, unbroken rim. Remove the foil lid completely. Choose short crayons that stick out above the rim.</div>
 <div class="body-md-bold">Get ready</div><div class="body-md muted" style="font-size:15px">Wash, dry and inspect the pot. The label is optional. Keep scissors with you. Use child-suitable paper glue only on the paper overlap.</div></div>${btn("We're ready",{act:'startBuild',arg:'Crayon Crew'})}`;
ACTIONS.startBuild=name=>{if(name!=='Crayon Crew'){closeOverlay();toast(`Only Crayon Crew has steps in this prototype`,'UI/Steps');return}S.currentBuild=name;S.buildStep=1;go('k/step/1')};
SCREENS['k/step']=n=>{n=Math.min(4,Math.max(1,+n||1));const s=STEPS[n-1];S.buildStep=n;if(n>1)S.continueKind=S.continueKind==='news'?S.continueKind:S.continueKind;
 const text=n===4&&S.ages==='9-12'?s.text912:s.text;
 return `<div class="screen"><div class="top-space"></div><div class="cam-top" style="padding:0 16px">${round('UI/Close','data-act="quitBuild"',{label:'Close'})}<div class="stepprog">Step ${n} of 4<div class="segs">${[1,2,3,4].map(i=>`<i class="${i<=n?'on':''}"></i>`).join('')}</div></div>${round('UI/Speaker',`data-act="speak" data-arg="${esc(s.title+'. '+text)}"`)}</div>
 <div class="scroll"><div class="col gap16 pad" style="padding-top:16px;padding-bottom:16px"><div class="stepcard"><div class="gif">${ic(s.pic,'s120')}</div>
 ${s.gu?`<span class="gu-chip"><span class="hand">${ic('UI/Hand')}</span>With a grown-up</span>`:''}${s.opt?`<span class="opt-chip"><span class="star">${ic('UI/Star')}</span>You can skip this one</span>`:''}
 <div class="display-lg">${esc(s.title)}</div><div class="body-md" style="font-weight:600">${esc(text)}</div></div>
 <div class="stepnav">${btn('Back',{style:'secondary',act:n===1?'back':'stepGo',arg:n-1})}${btn(n===4?'I made it!':'Next',{act:n===4?'madeIt':'stepGo',arg:n+1})}</div>
 ${s.opt?`<button class="link" data-act="stepGo" data-arg="4">Skip this step</button>`:''}</div></div></div>`};
ACTIONS.stepGo=n=>go('k/step/'+n,{replace:true});
ACTIONS.quitBuild=()=>{S.continueKind='progress';toast('Saved. Pick up where you left off.','UI/Garden');go('k/garden')};
ACTIONS.madeIt=()=>{S.buildStep=0;if(S.continueKind==='progress')S.continueKind='scan';go(S.a1?'k/where':'k/made')};
let where=null;
SCREENS['k/where']=()=>`<div class="screen"><div class="top-space"></div><div class="scroll col gap20 pad center" style="padding-top:40px">${sprout('Talk A',96)}<div class="display-lg">Where will your ${esc(S.currentBuild)} live?</div>
 <div class="row gap12 fill"><button class="action-tile ${where==='out'?'selected':''}" data-act="where" data-arg="out"><span class="disc">${ic('Plant/Sprout')}</span>Outside</button><button class="action-tile ${where==='in'?'selected':''}" data-act="where" data-arg="in"><span class="disc">${ic('UI/Home')}</span>Inside</button></div>
 <div class="body-md muted">Outside builds can bring a visitor to your garden!</div></div><div class="pad" style="padding-bottom:28px">${btn('Next',{go:'k/made',disabled:!where})}</div></div>`;
ACTIONS.where=v=>{where=v;render()};
SCREENS['k/made']=()=>{const b=S.currentBuild||'Crayon Crew';return {after(){EC.burst()},html:`<div class="screen"><div class="top-space"></div><div class="scroll col gap16 pad center" style="padding-top:24px">${confetti()}${sprout('Happy',120)}<div class="display-xl">You made it!</div>
 <div class="photo-frame"><div class="ph">${ic('Build/'+b,'s64')}</div></div><div class="body-md" style="font-weight:600">Take a photo to show ${parent()} your ${esc(b)}.</div></div>
 <div class="col gap12 pad" style="padding-bottom:28px">${btn('Take a photo',{icon:'UI/Camera',go:'k/photo'})}${btn('Later',{style:'secondary',act:'madeLater'})}</div></div>`}};
ACTIONS.madeLater=()=>{S.builds[S.currentBuild]='built';go('k/garden')};

/* R · Share it */
SCREENS['k/photo']=()=>{const b=S.currentBuild||'Bird feeder';return {light:true,html:`<div class="screen dark"><div class="top-space"></div>${camTop({noPill:true,close:'data-act="back"'})}<div class="stage">${stageObj('Build/'+b)}${vf()}</div>
 <div class="hint-chip">Just the build, no people</div><div class="cam-bottom">${sproutBubble('Talk A','Show me what you made!')}<button class="shutter" data-act="shootBuild" aria-label="Take the photo">${ic('UI/Camera')}</button></div></div>`}};
ACTIONS.shootBuild=()=>{document.querySelector('.device').insertAdjacentHTML('beforeend','<div class="flash"></div>');setTimeout(()=>document.querySelector('.flash')?.remove(),400);go('k/photo-check',{replace:true})};
SCREENS['k/photo-check']=()=>{const b=S.currentBuild;return {light:true,html:`<div class="screen dark"><div class="top-space"></div>${camTop({noPill:true,close:'data-act="back"'})}<div class="stage">${stageObj('Build/'+b)}${vf()}</div>${msgCard('Blink','Checking your build…','Looking closely…')}</div>`,
 after(){later(1600,()=>{if(S.nextPhoto==='person'){S.nextPhoto='ok';go('k/photo-blocked',{replace:true});return}
  S.sentBuild=b;S.builds[b]='sent';S.approvals.unshift({kid:kidName(),build:b,when:'Today, just now',ago:'Just now',outside:where==='out'||!!(BUILDS[b]||{}).outside});go('k/sent',{replace:true})})}}};
SCREENS['k/photo-blocked']=()=>({light:true,html:`<div class="screen dark"><div class="top-space"></div>${camTop({noPill:true,close:'data-go="k/garden"'})}<div class="stage">${stageObj('Build/'+S.currentBuild)}${vf()}</div>${msgCard('Surprised',"Let's take it again",'I can only see things, not people. Take a photo of just your build.',['Take it again',{go:'k/photo'}])}</div>`});
SCREENS['k/sent']=()=>{const b=S.sentBuild||S.currentBuild||'Bird feeder';return `<div class="screen"><div class="top-space"></div><div class="scroll col gap20 pad center" style="padding-top:40px">${sprout('Happy',120)}<div class="display-xl" style="font-size:34px">Sent to ${parent()}!</div>
 <div class="photo-frame"><div class="ph">${ic('Build/'+b,'s64')}</div></div><div class="body-lg">${parent()} will look at your ${esc(b)} soon.</div></div><div class="pad" style="padding-bottom:28px">${btn('Back to my Garden',{go:'k/garden'})}</div></div>`};
SCREENS['k/approved']=()=>{const c=S.kidCelebrate||{build:'Bird feeder',reaction:'Proud of you!',outside:true};
 return {after(){EC.burst()},html:`<div class="screen"><div class="top-space"></div><div class="scroll col gap16 pad center" style="padding-top:16px">${confetti()}${sprout('Happy',104)}<div class="display-xl" style="font-size:34px">${parent()} loved it!</div>
 <div class="photo-frame"><div class="ph">${ic('Build/'+c.build,'s64')}</div></div><span class="reaction">${ic('UI/Star')}${esc(c.reaction)}</span>
 <div class="body-lg">${c.outside?`Your ${esc(c.build)} is outside. Watch your Garden for a visitor!`:`Your ${esc(c.build)} is on your shelf.`}</div><span class="sparks sm">${ic('UI/Sparks')}+20</span></div>
 <div class="pad" style="padding-bottom:28px">${btn('See my Garden',{act:'seeGarden'})}</div></div>`}};
ACTIONS.seeGarden=()=>{const c=S.kidCelebrate;S.kidCelebrate=null;if(c&&c.outside){go('k/garden/visitor')}else go('k/garden')};
SCREENS['k/retry']=()=>{const r=S.kidRetry||{build:'Bird feeder',note:'Can you add a stick for the birds to stand on?'};
 return `<div class="screen"><div class="top-space"></div><div class="scroll col gap16 pad center" style="padding-top:36px">${sprout('Talk A',104)}<div class="display-xl" style="font-size:32px">Let's try once more</div>
 <div class="photo-frame"><div class="ph">${ic('Build/'+r.build,'s64')}</div></div><div class="body-lg">${parent()} has an idea for your ${esc(r.build)}.</div><div class="body-lg" style="color:var(--orange-ink)">"${esc(r.note)}"</div></div>
 <div class="col gap12 pad" style="padding-bottom:28px">${btn('Try again',{act:'retryBuild'})}${btn('Back to my Garden',{style:'secondary',act:'retryLater'})}</div></div>`};
ACTIONS.retryBuild=()=>{const r=S.kidRetry;S.kidRetry=null;if(r)S.currentBuild=r.build;go('k/photo')};
ACTIONS.retryLater=()=>{S.kidRetry=null;go('k/garden/x')};

/* L · Learn */
const LEARN=['Tin can','Plastic bottle','Bottle top','Cardboard box'];
function lp(m){return S.learn[m]||(S.learn[m]={video:false,quiz:false,story:false})}
function learnRow(m){const p=lp(m);return `<button class="learnrow" data-go="k/path/${m}"><span class="pic">${ic('Material/'+m)}</span><span class="name">${esc(m)}</span><span class="mini3"><i class="${p.video?'done':''}">${ic('UI/Video')}</i><i class="${p.quiz?'done':''}">${ic('UI/Quiz')}</i><i class="${p.story?'done':''}">${ic('UI/Headphones')}</i></span></button>`}
SCREENS['k/learn']=()=>{
 if(S.firstDay)return `<div class="screen"><div class="top-space"></div>${kidHeader('Learn')}<div class="grow col center gap24 pad">${sproutBubble('Wave up','Scan a treasure to unlock its videos!',96)}${btn('Scan something',{icon:'UI/Camera',go:'k/scan'})}</div>${tabbar('Learn')}</div>`;
 const t=lp('Tin can');const nxt=!t.video?['1 · What is it?','video']:!t.quiz?['2 · What does it become?','quiz']:!t.story?['3 · How it helps wildlife','story']:null;
 return `<div class="screen"><div class="top-space"></div>${kidHeader('Learn')}<div class="scroll"><div class="col gap12 pad" style="padding-bottom:20px">
 ${S.offline?`<div class="offline">${ic('UI/Wifi off')}No internet. Videos and stories need it. Your progress is saved.</div>`:nxt?`<button class="keepgoing" data-go="k/${nxt[1]}/Tin can"><span class="thumb">${ic('UI/Video')}</span><span class="grow col"><span class="label-sm">Keep going · Tin can</span><span class="title-sm">${nxt[0]}</span></span>${ic('UI/Play')}</button>`:''}
 ${LEARN.slice(0,S.offline?3:4).map(learnRow).join('')}${S.offline?btn('Try again',{style:'secondary',act:'retry'}):''}</div></div>${tabbar('Learn')}</div>`};
SCREENS['k/path']=m=>{m=m||'Tin can';const p=lp(m);const nextKey=!p.video?'video':!p.quiz?'quiz':!p.story?'story':null;
 const stop=(k,i,icn,lab,sub)=>`<button class="stop ${p[k]?'done':''} ${nextKey===k?'next':''}" data-act="openStop" data-arg="${k}/${m}"><span class="disc">${ic(p[k]?'UI/Check':icn)}</span><span class="col"><span class="label-sm muted">${i} · ${lab}</span><span class="title-sm">${esc(sub)}</span></span></button>`;
 return `<div class="screen"><div class="top-space"></div>${topbar(m)}<div class="scroll"><div class="col gap20 pad" style="padding-bottom:20px">${stop('video',1,'UI/Video','Watch','What is it? Where does it go?')}${stop('quiz',2,'UI/Quiz','Play','What does it become?')}${stop('story',3,'UI/Headphones','Listen','How it helps wildlife')}
 ${sproutBubble('Talk A',`Finish all 3 to become a ${m} expert!`,64)}${btn('Then: build something',{style:'secondary',icon:'UI/Star',go:'k/builds'})}</div></div>${tabbar('Learn')}</div>`};
ACTIONS.openStop=a=>{if(S.offline&&a.split('/')[0]!=='quiz'){toast('Videos and stories need the internet','UI/Wifi off');return}go('k/'+a)};
function media(kind,m){return `<div class="media"><div class="track"><i id="trk" style="width:${lp(m)[kind]?100:0}%"></i></div><button class="play" data-act="play" data-arg="${kind}/${m}" aria-label="Play">${ic('UI/Play')}</button></div>`}
let playing=null;
ACTIONS.play=(a,el)=>{const [kind,m]=a.split('/');if(playing){clearInterval(playing);playing=null;el.innerHTML=ic('UI/Play');return}el.innerHTML=ic('UI/Pause');let w=parseFloat(document.getElementById('trk').style.width)||0;if(w>=100)w=0;
 playing=setInterval(()=>{w+=4;const t=document.getElementById('trk');if(!t){clearInterval(playing);playing=null;return}t.style.width=w+'%';if(w>=100){clearInterval(playing);playing=null;finish(kind,m)}},200)};
function finish(kind,m){const p=lp(m);const was=p[kind];p[kind]=true;if(!was){S.sparks+=5;S.garden=Math.min(100,S.garden+5)}
 if(p.video&&p.quiz&&p.story&&!was){go('k/expert/'+m,{replace:true});return}toast(was?'Well done!':'+5 sparks. Well done!');back('k/path/'+m)}
SCREENS['k/video']=m=>{m=m||'Tin can';return `<div class="screen"><div class="top-space"></div>${topbar(`What is a ${m.toLowerCase()}?`)}<div class="pad"><div class="video">${ic('Material/'+m,'s120')}</div>${media('video',m)}<div class="label-md muted center" style="margin-top:14px">Captions on · +5 sparks when you finish</div></div></div>`};
SCREENS['k/story']=m=>{m=m||'Tin can';return `<div class="screen"><div class="top-space"></div>${topbar('Step 3 · Story')}<div class="pad col gap16"><div class="video" style="background:#cde9f7;height:260px">${ic('Material/'+m,'s120')}</div><div class="display-md center">How ${m==='Tin can'?'tins':m.toLowerCase()+'s'} help wildlife</div>${media('story',m)}<div class="label-md muted center">+5 sparks when you finish</div></div></div>`};
const QUIZ=[['What can an old tin can become?',[['A new can','Material/Tin can',1],['A tree','Build/Plant Pal',0]],'Yes! Tins come back again and again.'],
 ['What do you do first?',[['Rinse it','UI/Refresh',1],['Throw it away','UI/Trash',0]],'Yes! A clean tin is easier to recycle.'],
 ['Who checks sharp edges?',[['A grown-up','UI/Hand',1],['Nobody','UI/Close',0]],'Yes! Sharp lids are for grown-ups.']];
let quiz={q:0,pick:null};
SCREENS['k/quiz']=m=>{m=m||'Tin can';const [qq,ans,ok]=QUIZ[quiz.q];const picked=quiz.pick!==null;const right=picked&&ans[quiz.pick][2];
 return `<div class="screen"><div class="top-space"></div><div class="cam-top" style="padding:0 16px">${round('UI/Close','data-act="quitQuiz"',{label:'Close'})}<div class="stepprog">Question ${quiz.q+1} of 3<div class="segs" style="width:120px">${[0,1,2].map(i=>`<i class="${i<=quiz.q?'on':''}"></i>`).join('')}</div></div>${round('UI/Speaker',`data-act="speak" data-arg="${esc(qq+' '+ans.map(a=>a[0]).join(' or '))}"`)}</div>
 <div class="scroll"><div class="col gap20 pad" style="padding-top:20px"><div class="display-lg center">${esc(qq)}</div><div class="quiz">${ans.map((a,i)=>`<button class="qa ${picked?(a[2]?'correct':i===quiz.pick?'wrong':''):''}" data-act="answer" data-arg="${i}">${ic(a[1])}${esc(a[0])}${picked&&a[2]?`<span class="badge">${ic('Status/Check badge','s28')}</span>`:''}</button>`).join('')}</div>
 ${picked?sproutBubble(right?'Happy':'Talk A',right?ok:'Not quite. Try the other one!',64):''}${picked&&right?btn('Next',{act:'nextQ',arg:m}):''}</div></div></div>`};
ACTIONS.answer=i=>{if(quiz.pick!==null&&QUIZ[quiz.q][1][quiz.pick][2])return;quiz.pick=+i;render()};
ACTIONS.nextQ=m=>{if(quiz.q<2){quiz={q:quiz.q+1,pick:null};render()}else{quiz={q:0,pick:null};finish('quiz',m)}};
ACTIONS.quitQuiz=()=>{quiz={q:0,pick:null};back('k/learn')};
SCREENS['k/expert']=m=>{m=m||'Tin can';return {after(){EC.burst()},html:`<div class="screen"><div class="top-space"></div><div class="scroll col gap16 pad center" style="padding-top:30px">${confetti()}${sprout('Happy',112)}<div class="display-xl" style="font-size:34px">${esc(m)} expert!</div><div class="row gap12">${ic('UI/Star','s44')}${ic('UI/Star','s44')}${ic('UI/Star','s44')}</div>
 <div class="body-md" style="font-weight:600">You finished all 3 steps. Harder ${esc(m.toLowerCase())} builds are now open!</div><span class="sparks sm">${ic('UI/Sparks')}+10</span></div>
 <div class="col gap12 pad" style="padding-bottom:28px">${btn(`See ${m.toLowerCase()} builds`,{act:'expertDone',arg:'k/builds'})}${btn('Back to Learn',{style:'secondary',act:'expertDone',arg:'k/learn'})}</div></div>`}};
ACTIONS.expertDone=r=>{S.sparks+=10;go(r)};

/* P · Grown-ups gate, RC · Report a concern */
let pinBuf='',pinErr=false;
SCREENS['k/gate']=()=>{const locked=Date.now()<S.lockUntil;const msg=locked?`Too many tries. Wait ${Math.max(1,Math.ceil((S.lockUntil-Date.now())/60000))} minute.`:pinErr?"That's not right. Try again.":'Ask a grown-up to type the PIN.';
 return {html:`<div class="screen"><div class="top-space"></div><div style="padding:0 16px">${round('UI/Arrow left','data-act="gateBack"',{label:'Back'})}</div><div class="scroll col gap16 center" style="padding-top:8px"><div class="lockdisc">${ic('UI/Lock','s32')}</div><div class="display-lg">Grown-ups only</div><div class="body-md muted" ${pinErr||locked?'style="color:var(--danger)"':''}>${msg}</div>
 <div class="pin-dots ${pinErr?'shake':''}">${[0,1,2,3].map(i=>`<i class="${pinErr?'err':i<pinBuf.length?'on':''}"></i>`).join('')}</div>
 <div class="pinpad" style="margin-top:8px">${[1,2,3,4,5,6,7,8,9].map(n=>`<button class="key" data-act="pin" data-arg="${n}" ${locked?'disabled style="opacity:.5"':''}>${n}</button>`).join('')}<span class="key blank"></span><button class="key" data-act="pin" data-arg="0">0</button><button class="key" data-act="pin" data-arg="del" aria-label="Delete">⌫</button></div>
 ${S.tellUs?`<button class="tellus" data-go="k/tell">${ic('UI/Hand','s20')}Something worrying? Tell us</button>`:''}</div></div>`,
 after(){if(locked)later(S.lockUntil-Date.now()+50,()=>{S.pinTries=0;pinErr=false;render()})}}};
ACTIONS.gateBack=()=>{pinBuf='';pinErr=false;back('k/garden')};
ACTIONS.pin=k=>{if(Date.now()<S.lockUntil)return;pinErr=false;if(k==='del')pinBuf=pinBuf.slice(0,-1);else if(pinBuf.length<4)pinBuf+=k;render();
 if(pinBuf.length===4)setTimeout(()=>{if(pinBuf===S.pin){pinBuf='';S.pinTries=0;go('p/home')}else{pinBuf='';pinErr=true;S.pinTries++;if(S.pinTries>=3){S.lockUntil=Date.now()+60000;pinErr=false}render()}},250)};
let worry=null;
SCREENS['k/tell']=()=>`<div class="screen"><div class="top-space"></div><div class="cam-top" style="padding:0 16px">${round('UI/Close','data-act="back"',{label:'Close'})}${round('UI/Speaker','data-act="speak" data-arg="You\'re not in trouble. What worried you? Something I saw. Something I heard. I feel sad or scared. Something else."')}</div>
 <div class="scroll"><div class="col gap16 pad" style="padding-top:12px">${sproutBubble('Talk A',"You're not in trouble.",64)}<div class="display-lg">What worried you?</div>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${[['Something I saw','UI/Video'],['Something I heard','UI/Speaker'],['I feel sad or scared','UI/Hand'],['Something else','UI/Quiz']].map(([l,i])=>`<button class="action-tile ${worry===l?'selected':''}" data-act="worry" data-arg="${esc(l)}"><span class="disc">${ic(i)}</span>${l}</button>`).join('')}</div></div></div>
 <div class="pad" style="padding-bottom:28px">${btn('Send',{act:'sendWorry',disabled:!worry})}</div></div>`;
ACTIONS.worry=v=>{worry=v;render()};
ACTIONS.sendWorry=()=>{S.reports.unshift({kid:kidName(),what:worry,where:'Grown-ups gate',when:'Today, just now',handled:false});worry=null;go('k/thanks',{replace:true})};
SCREENS['k/thanks']=()=>`<div class="screen"><div class="top-space"></div><div class="grow col center gap16 pad">${sprout('Happy',120)}<div class="display-xl" style="font-size:34px">Thank you for telling us</div><div class="body-lg">${parent()} will know right away. You can also talk to her now.</div>${btn('Back to my Garden',{go:'k/garden'})}</div></div>`;

window.KID={BUILDS,learnRow};
})();
