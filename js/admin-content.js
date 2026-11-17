/* EcoSpark Admin · Overview (OV, FT), Builds (CB, AB, BS, MN, MV, DL, H3 to H5, H7, H9, H10, EB1), preview modal */
(function(){
const A=window.ADMIN;const {S,me,esc,ic,btn,ibtn,status,disc,stat,phead,tabs,empty,field,toggle,cbox,radio,kv,bars,val,sk,go,later,dialog,sheet,preview,close,toast,openMenu,render,shell,SCREENS,DIALOGS,SHEETS,ACTIONS}=A;
const lc=s=>s.charAt(0).toLowerCase()+s.slice(1);
const ageTxt=a=>a.replace('–',' to ');
const B=id=>S.builds.find(b=>b.id===id);

/* ---------- loading skeleton (ST1) ---------- */
function skeleton(active,crumb){return shell(active,[crumb],`<div class="phead"><div class="col gap8">${sk(160,28)}${sk(520,14)}</div></div><div class="card" style="overflow:hidden"><div class="toolbar">${sk(220,28)}</div>${Array.from({length:8},(_,i)=>`<div class="row gap16" style="padding:16px;border-bottom:${i<7?'1px solid var(--border)':'0'}">${sk(40)}${sk(200+((i*37)%120))}<span class="grow"></span>${sk(160)}${sk(56,20)}</div>`).join('')}</div>`)}
A.withLoading=(active,crumb,fn)=>{if(A.loading===A.cur()){later(450,()=>{A.loading=null;render()});return skeleton(active,crumb)}return fn()};

/* ---------- Overview ---------- */
function setupSteps(){const live=S.builds.filter(b=>b.status==='live').length;const learn=Object.values(S.paths).some(p=>p.some(x=>x==='live'));const team=S.team.length>1||S.invited.length>0;
 return [[live>0,'Publish your first builds',live>0?`${live} of the ${S.builds.length} builds ${live===1?"is":"are"} live.`:`${S.builds.length} builds are ready from the Build It content. 0 are live.`,'Open builds','a/builds'],
  [learn,'Add a Learn path','A video, a quiz and an audio story for one material.','Open Learn','a/learn'],
  [team,'Invite your team','Add a content editor and a moderator.','Invite','a/team'],
  [S.setupDone.alerts,'Check the alerts','Choose when to warn the team about the queue, AI cost and errors.','Alert settings','a/alert-settings']]}
SCREENS['a/overview']=()=>{const m=me();
 if(S.setup==='first'){const st=setupSteps();const done=st.filter(x=>x[0]).length;
  if(done<4)return shell('Overview',['Overview'],`${phead(`Welcome to EcoSpark Admin, ${m.first}`,'Get the pilot ready in four steps. Families see the app once builds and Learn paths are live.')}
  <div class="card"><div class="row between" style="padding:20px 20px 12px"><div class="section-title">Get the pilot ready</div><span class="muted">${done} of 4 done</span></div><div class="list">${st.map(([ok,t,d,b,r],i)=>`<div class="li">${ok?disc('check','primary'):`<span class="disc neutral m">${i+1}</span>`}<div class="col grow"><span class="m">${t}</span><span class="muted">${d}</span></div>${ok?status('Done','success'):btn(b,{v:'outline',go:r})}</div>`).join('')}</div></div>
  <div class="grid2"><div class="card pad row gap12">${disc('shield-check','neutral')}<div class="col"><span class="m">Nothing to check yet</span><span class="muted">Flagged photos, answers and reports show here once children play.</span></div></div><div class="card pad row gap12">${disc('chart-column','neutral')}<div class="col"><span class="m">No pilot numbers yet</span><span class="muted">Usage shows here after the first family plays. All anonymous.</span></div></div></div>`)}
 const n=A.modCount();const ph=S.photos.length,an=S.answers.length,rp=S.reports.length;const drafts=S.builds.filter(b=>b.status==='draft');
 const parts=[ph&&`${ph} photo${ph>1?'s':''}`,an&&`${an} answer${an>1?'s':''}`,rp&&`${rp} report${rp>1?'s':''}`].filter(Boolean);
 const list=a=>a.length>1?a.slice(0,-1).join(', ')+' and '+a[a.length-1]:a[0]||'';
 const needs=[];
 if(n)needs.push(['shield-check','primary',`${n} waiting`,`${list(parts)}. ${S.photos.length?`The oldest came in ${S.photos[0].ago}.`:''}`,'Open moderation','a/moderation']);
 if(S.alerts.length)needs.push(['bell','warning',`${S.alerts.length} alert${S.alerts.length>1?'s':''}`,S.alerts.map(x=>x.id==='queue'?'The review queue is growing.':x.id==='cost'?"AI cost is at 74% of this week's budget.":x.t+'.').join(' '),'See alerts','a/alerts']);
 if(drafts.length)needs.push(['hammer','neutral',`${drafts.length} draft${drafts.length>1?'s':''}`,`${list(drafts.map(d=>d.name))} ${drafts.length>1?'are':'is'} not live yet.`,'Open builds','a/builds/drafts']);
 const th=S.themes[0];const usage=S.usageEmpty;
 return shell('Overview',['Overview'],`${phead(`Good evening, ${m.first}`,'Monday 16 November · pilot week 3')}
 <div class="col gap12"><div class="section-title">Needs you</div>${n||needs.length?`<div class="grid3">${needs.map(([i,t,h,d,l,r])=>`<div class="card pad col gap12"><div class="row gap12">${disc(i,t)}<span class="t-xl b">${h}</span></div><p class="muted">${esc(d)}</p><a href="#${r}" data-go="${r}" class="textlink">${l} ${ic('chevron-right','s14')}</a></div>`).join('')}</div>`:''}
 ${!n?`<div class="card pad row gap16">${disc('circle-check','primary',true)}<div class="col"><span class="t-base b">All caught up</span><span class="muted">Nothing is waiting for review. New photos, answers and reports will show here.</span></div></div>`:''}</div>
 <div class="col gap12"><div class="row gap8"><span class="section-title">Pilot this week</span><span class="muted">Anonymous, all families together</span><a href="#a/usage" data-go="a/usage" class="textlink" style="margin-left:auto">Open usage ${ic('chevron-right','s14')}</a></div>
 <div class="grid4">${usage?stat('Active families','–','of 15 invited','users')+stat('Scans','–','No scans yet','sparkles')+stat('Builds completed','–','Confirmed by a parent','hammer')+stat('Came back','–','Of children who played last week','refresh-cw'):stat('Active families','12','of 15 invited','users')+stat('Scans','342','+12% on last week','sparkles')+stat('Builds completed','48','Confirmed by a parent','hammer')+stat('Came back','75%','Of children who played last week','refresh-cw')}</div></div>
 <div class="cols-wide"><div class="card pad col gap8"><div class="section-title">Scans per day</div>${usage?`<p class="muted" style="padding:40px 0;text-align:center">No scans yet.</p>`:bars([72,84,99,89,116,110,80],4)}</div>
 ${th?`<div class="card pad col gap12"><div class="row between"><span class="muted m">This week's theme</span>${status('To confirm','info')}</div><div class="t-xl b">${esc(th.n)}</div><span class="muted">16 to 22 November</span><div class="row gap8">${ic('hammer')}<span>Featured: ${esc(th.b.join(', '))}</span></div><div class="row gap8">${ic('book-open')}<span>Lesson: ${esc(th.l)}</span></div><div class="row gap8">${ic('bird')}<span>Garden visitor: ${esc(lc(th.v))}</span></div><a href="#a/themes" data-go="a/themes" class="textlink">Open weekly themes ${ic('chevron-right','s14')}</a></div>`:`<div class="card pad col gap12"><span class="muted m">This week's theme</span><p class="muted">No theme this week.</p>${btn('Add theme',{v:'outline',go:'a/new-theme'})}</div>`}</div>`)};

/* Prototype data switches (called from the settings panel) */
window.PANEL_FN=fn=>{const d=A.defaults();
 if(fn==='first'){S.builds.forEach(b=>b.status='draft');Object.keys(S.paths).forEach(k=>S.paths[k]=[null,null,null]);S.videos=[];S.quizzes=[];S.stories=[];S.themes=[];S.pastThemes=[];S.team=S.team.filter(m=>m.k==='grace');S.invited=[];S.photos=[];S.answers=[];S.reports=[];S.alerts=[];S.usageEmpty=true;S.setupDone={alerts:false};S.me='grace'}
 if(fn==='pilot'){['builds','paths','videos','quizzes','stories','themes','pastThemes','team','invited','photos','answers','reports','alerts','resolved','setupDone'].forEach(k=>S[k]=d[k]);S.usageEmpty=false;S.emptyLists=false}
 if(fn==='empty'){S.builds=[];S.videos=[];S.quizzes=[];S.stories=[];Object.keys(S.paths).forEach(k=>S.paths[k]=[null,null,null]);S.themes=[];S.pastThemes=[]}
 if(fn==='full'){['builds','paths','videos','quizzes','stories','themes','pastThemes'].forEach(k=>S[k]=d[k])}};

/* ---------- Builds list ---------- */
const PER=10;
SCREENS['a/builds']=tab=>A.withLoading('Builds','Builds',()=>{
 if(S.failNext)return shell('Builds',['Builds'],`${phead('Builds',`The ${S.builds.length} builds from the Build It content.`,btn('Add build',{go:'a/new-build/1'}))}<div class="card">${empty('circle-alert',"We couldn't load the builds",'Check your connection and try again. Nothing was lost.',btn('Try again',{v:'outline',icon:'refresh-cw',act:'retryBuilds'}),'danger')}</div>`);
 const sub=S.builds.length?`The ${S.builds.length} builds from the Build It content. The app shows a live build when it matches what a child has scanned.`:'The builds children can make. The app shows a live build when it matches what a child has scanned.';
 if(!S.builds.length)return shell('Builds',['Builds'],`${phead('Builds',sub,btn('Add build',{go:'a/new-build/1'}))}<div class="card">${empty('hammer','No builds yet','Add a build with its steps, materials and grown-up help. It stays a draft until you publish it.',btn('Add build',{go:'a/new-build/1'}))}</div>`);
 const t=tab==='live'?'Live':tab==='drafts'?'Drafts':'All';const q=(S.buildQ||'').trim().toLowerCase();
 let rows=S.builds.filter(b=>t==='All'||(t==='Live'?b.status==='live':b.status==='draft'));
 if(S.buildAges)rows=rows.filter(b=>b.ages===S.buildAges.replace(' to ','–'));
 if(q)rows=rows.filter(b=>(b.name+' '+b.start+' '+b.id).toLowerCase().includes(q));
 const live=S.builds.filter(b=>b.status==='live').length;const pages=Math.max(1,Math.ceil(rows.length/PER));S.buildPage=Math.min(S.buildPage||1,pages);const p=S.buildPage;
 const shown=rows.slice((p-1)*PER,p*PER);
 const tb=`<div class="toolbar">${tabs([['All','a/builds',S.builds.length],['Live','a/builds/live',live],['Drafts','a/builds/drafts',S.builds.length-live]],t)}<span class="spacer"></span><label class="search">${ic('search')}<input type="search" placeholder="Search builds" value="${esc(S.buildQ||'')}" data-onin="buildQ" aria-label="Search builds"></label>${S.buildAges?`<button class="chip on" data-act="agesMenu">Ages: ${esc(S.buildAges)}<span class="x" data-act="clearAges" role="button" aria-label="Clear the ages filter">${ic('x','s14')}</span></button>`:`<button class="chip" data-act="agesMenu" aria-haspopup="menu">${ic('funnel','s14')}Ages</button>`}</div>`;
 let body;
 if(!rows.length&&q)body=empty('search',`No builds match "${S.buildQ}"`,`Try another word, or clear the search to see all ${S.builds.length} builds.`,btn('Clear search',{v:'outline',act:'clearSearch'}));
 else if(!rows.length)body=empty('hammer',t==='Drafts'?'No drafts':'No live builds',t==='Drafts'?'Every build is live. New builds start here as drafts.':'Publish a draft to show it to children.','');
 else body=`<table><thead><tr><th>ID</th><th>Build</th><th>Starting item</th><th>Ages</th><th>Time</th><th>Grown-up steps</th><th>Status</th><th></th></tr></thead><tbody>${shown.map(b=>{const gh=b.steps.filter(s=>s.grownup).length;return `<tr class="click" data-go="a/build/${b.id}" tabindex="0"><td class="id">${b.id}</td><td class="name">${esc(b.name)}</td><td class="muted">${esc(b.start)}</td><td>${b.ages}</td><td>${b.mins} min</td><td class="${gh?'':'muted'}">${gh||'None'}</td><td>${status(b.status==='live'?'Live':'Draft')}</td><td class="more"><button class="rowmenu" data-act="buildMenu" data-arg="${b.id}" aria-label="More for ${esc(b.name)}" aria-haspopup="menu">${ic('ellipsis')}</button></td></tr>`}).join('')}</tbody></table>
  ${rows.length>PER?`<div class="foot"><span class="muted">Showing ${(p-1)*PER+1} to ${Math.min(p*PER,rows.length)} of ${rows.length}</span>${btn('Previous',{v:'outline',sm:true,act:'page',arg:-1,disabled:p===1})}${btn('Next',{v:'outline',sm:true,act:'page',arg:1,disabled:p===pages})}</div>`:''}`;
 return shell('Builds',['Builds'],`${phead('Builds',sub,btn('Add build',{go:'a/new-build/1'}))}<div class="card" style="overflow:hidden">${tb}${body}</div>`)});
ACTIONS.retryBuilds=()=>{S.failNext=false;A.loading=A.cur();render()};
ACTIONS.buildQ=v=>{S.buildQ=v;S.buildPage=1;clearTimeout(window._bq);window._bq=setTimeout(()=>{render();const i=document.querySelector('[data-onin="buildQ"]');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}},200)};
ACTIONS.clearSearch=()=>{S.buildQ='';render()};
ACTIONS.page=d=>{S.buildPage=(S.buildPage||1)+(+d);render()};
ACTIONS.agesMenu=(a,el,e)=>{if(e.target.closest('.x'))return;openMenu(['5 to 9','7 to 9'].map(x=>({label:x,on:S.buildAges===x,run:()=>{S.buildAges=S.buildAges===x?null:x;S.buildPage=1;render()}})),el,'Ages')};
ACTIONS.clearAges=(a,el,e)=>{e.stopPropagation();S.buildAges=null;render()};
ACTIONS.buildMenu=(id,el,e)=>{e.stopPropagation();const b=B(id);
 openMenu(b.status==='live'?[{label:'Edit',icon:'pencil',run:()=>go('a/build/'+id)},{label:'Preview in the app',icon:'smartphone',run:()=>openBuildPreview(id,1)},{label:'Move to drafts',icon:'undo-2',run:()=>dialog('toDrafts',id)}]
  :[{label:'Edit',icon:'pencil',run:()=>go('a/build/'+id)},{label:'Publish',icon:'upload',run:()=>dialog('publish',id)},{label:'Delete draft',icon:'trash-2',danger:true,run:()=>dialog('deleteDraft',id)}],el)};
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('tr[data-go]'))go(e.target.dataset.go)});
DIALOGS.toDrafts=id=>{const b=B(id);return {title:`Move ${b.name} to drafts?`,desc:"Children won't be offered it any more. A child who already started it can still finish, and the parent can still approve it.",actions:btn('Cancel',{v:'outline',act:'close'})+btn('Move to drafts',{act:'toDrafts',arg:id})}};
ACTIONS.toDrafts=id=>{const b=B(id);b.status='draft';A.overlay=null;A.dirty=null;render();toast(`${b.name} moved to drafts`,{undo:()=>{b.status='live';render()}})};
function checks(b){const gh=b.steps.filter(s=>s.grownup).length;return [`${b.steps.length} steps, each with a GIF and a still`,`${gh} step${gh===1?'':'s'} marked Grown-up helps`,`Read-aloud text checked for ages ${ageTxt(b.ages==='7–9'?'7–9':'5–8')}`]}
DIALOGS.publish=id=>{const b=B(id);return {title:`Publish ${b.name}?`,desc:`From today, children whose Treasury has ${/^(a|an|the) /i.test(b.start)?'':/^[aeiou]/i.test(b.start)?'an ':'a '}${esc(lc(b.start))} can see it in the app.`,body:`<div class="col gap8">${checks(b).map(c=>`<div class="row gap8">${ic('circle-check','s18')}<span>${esc(c)}</span></div>`).join('')}</div>`.replace(/class="ic s18"/g,'class="ic s18" style="color:var(--primary)"'),actions:btn('Cancel',{v:'outline',act:'close'})+btn('Publish',{act:'publish',arg:id})}};
ACTIONS.publish=id=>{const b=B(id);b.status='live';b.since=b.since||'today';A.overlay=null;A.dirty=null;render();toast(`${b.name} is live`)};
DIALOGS.deleteDraft=id=>{const b=B(id);return {title:`Delete ${b.name}?`,desc:'The draft, its steps and pictures are deleted. This cannot be undone.',actions:btn('Cancel',{v:'outline',act:'close'})+btn('Delete draft',{v:'destructive',act:'deleteDraft',arg:id})}};
ACTIONS.deleteDraft=id=>{const b=B(id);S.builds=S.builds.filter(x=>x.id!==id);A.overlay=null;A.dirty=null;const onPage=A.cur().startsWith('a/build/');if(onPage)go('a/builds/drafts',{force:true});else render();toast(`${b.name} deleted`,{icon:'trash-2'})};

/* ---------- Build page (CB2, AB6, H3, H4, ST3) ---------- */
const STARTS=()=>[...new Set(S.builds.map(b=>b.start).concat(['Rigid plastic cup','Yoghurt pot','Tin can','Plastic bottle','Egg box']))];
let bEdit=null;
SCREENS['a/build']=id=>{const b=B(id);if(!b)return SCREENS['a/404']();
 if(!bEdit||bEdit.id!==id)bEdit={id,saved:false};
 const live=b.status==='live';const gh=b.steps.filter(s=>s.grownup).length;
 const sub=`${b.id} · ${live?(bEdit.saved?'live · saved just now by '+me().name:`live since ${b.since||'2 November'}${b.edited?' · '+b.edited:''}`):(bEdit.saved?'draft · saved just now by '+me().name:'draft')}`;
 const saveBtn=btn(live?'Save changes':'Save draft',{v:live?'primary':'outline',act:'saveBuild',arg:id,disabled:S.offline});
 const actions=btn('Preview in the app',{v:'outline',act:'previewBuild',arg:id})+(live?saveBtn:saveBtn+btn('Publish',{act:'publishFromPage',arg:id,disabled:S.offline}));
 return shell('Builds',[['Builds','a/builds'],b.name],`${phead(b.name,`<span id="bsub">${esc(sub)}</span>`,actions)}
 ${!live?`<div class="note warn">${ic('info')}<span>Draft. Children can't see it yet. Publish it when it's ready.</span></div>`:''}
 <div class="cols-main"><div class="col gap16">
  <div class="card pad col gap16" data-form="build"><div class="section-title">Details</div>
   <div class="grid2">${field('Name',b.name,{id:'b-name'})}${field('Starting item',b.start,{id:'b-start',options:STARTS()})}</div>
   ${field('Child goal',b.goal,{id:'b-goal'})}
   <div class="grid2">${field('Ages',ageTxt(b.ages),{id:'b-ages',options:['5 to 9','7 to 9','9 to 12']})}${field('Time',`About ${b.mins} minutes`,{id:'b-time'})}</div></div>
  <div class="card" style="overflow:hidden"><div class="row between" style="padding:20px 20px 12px"><span class="section-title">Steps</span><span class="t-xs muted">One step at a time in the app. GIF, with a still for reduced motion.</span></div>
   <div class="list" style="border-top:1px solid var(--border)">${b.steps.map((s,i)=>`<div class="steprow"><span class="grip">${ic('grip-vertical')}</span><button class="play" data-act="previewBuild" data-arg="${id}|${i+1}" aria-label="Preview step ${i+1}">${ic('play')}</button><div class="col grow"><span class="m">${i+1}&nbsp; ${esc(s.title)}</span><span class="muted t-sm">${esc(s.text)}</span></div>${s.grownup?status('Grown-up helps'):''}${s.optional?status('Optional'):''}<button class="rowmenu" data-act="editStep" data-arg="${id}|${i}" aria-label="Edit step ${i+1}">${ic('pencil')}</button></div>`).join('')}</div></div>
 </div><div class="col gap16">
  <div class="card pad col gap12"><div class="row between"><span class="section-title">Status</span>${status(live?'Live':'Draft')}</div><p class="muted">${live?`Shown to children whose Treasury has ${/^[aeiou]/i.test(b.start)?'an':'a'} ${esc(lc(b.start))}.`:"Children can't see it yet."}</p>${live?btn('Move to drafts',{v:'outline',block:true,act:'toDraftsAsk',arg:id}):btn('Delete draft',{v:'outline',block:true,act:'deleteAsk',arg:id})}</div>
  <div class="card pad col gap12"><span class="section-title">Materials</span>${b.materials.map(m=>`<div class="row between gap12"><span>${esc(m.name)}</span><span class="muted t-sm" style="text-align:right">${esc(m.grownup?'Grown-up only':m.qty)}</span></div>`).join('')||'<span class="muted">No materials yet.</span>'}</div>
  <div class="card pad col gap8"><span class="section-title">Grown-up preparation</span><p class="muted">${esc(b.prep||'Not written yet.')}</p></div>
 </div></div>`)};
const LABELS={'b-name':'name','b-start':'starting item','b-goal':'child goal','b-ages':'ages','b-time':'time'};
document.addEventListener('input',e=>{const id=e.target.id;if(LABELS[id]&&A.cur().startsWith('a/build/')){A.dirty=A.cur();window.DIRTY_DESC=`You changed the ${LABELS[id]}. If you leave now, the change is lost.`;const s=document.getElementById('bsub');const b=B(A.cur().split('/')[2]);if(s&&b)s.textContent=`${b.id} · ${b.status} · unsaved changes`}});
document.addEventListener('change',e=>{if(e.target.tagName==='SELECT')e.target.dispatchEvent(new Event('input',{bubbles:true}))});
function readBuild(b){const name=val('b-name').trim();if(!name){toast('Give the build a name',{icon:'circle-alert'});return false}
 b.name=name;b.start=val('b-start');b.goal=val('b-goal');b.ages=val('b-ages').replace(' to ','–');const m=parseInt(val('b-time'));if(m)b.mins=m;return true}
ACTIONS.saveBuild=id=>{const b=B(id);if(!readBuild(b))return;A.dirty=null;window.DIRTY_DESC=null;bEdit={id,saved:true};render();toast(b.status==='live'?'Changes saved. Children see them now.':'Draft saved')};
ACTIONS.publishFromPage=id=>{const b=B(id);if(!readBuild(b))return;A.dirty=null;dialog('publish',id)};
ACTIONS.toDraftsAsk=id=>dialog('toDrafts',id);
ACTIONS.deleteAsk=id=>dialog('deleteDraft',id);
/* edit one step of an existing build (sheet with the BS editor) */
let stepEd=null;
ACTIONS.editStep=a=>{const [id,i]=a.split('|');const s=B(id).steps[+i];stepEd={id,i:+i,title:s.title,text:s.text,grownup:s.grownup,optional:s.optional,gif:s.fig?s.fig+'.gif · 7 s, loops':'',still:s.fig?s.fig+'.png':''};sheet('step')};
SHEETS.step=()=>({title:`Step ${stepEd.i+1}`,sub:B(stepEd.id).name,body:stepEditorFields(stepEd,'se'),actions:btn('Cancel',{v:'ghost',act:'close'})+btn('Save step',{act:'saveStepSheet',disabled:S.offline})});
ACTIONS.saveStepSheet=()=>{const t=val('se-title').trim(),x=val('se-text').trim();if(!t||!x){stepEd.err=!t?'title':'text';stepEd.title=t;stepEd.text=x;sheet('step');return}
 const s=B(stepEd.id).steps[stepEd.i];Object.assign(s,{title:t,text:x,grownup:stepEd.grownup,optional:stepEd.optional});A.overlay=null;render();toast(`Step ${stepEd.i+1} saved`)};
ACTIONS.seToggle=k=>{stepEd.title=val('se-title');stepEd.text=val('se-text');stepEd[k]=!stepEd[k];A.overlay&&A.overlay.type==='sheet'?sheet('step'):render()};
ACTIONS.seFile=k=>{stepEd.title=val('se-title');stepEd.text=val('se-text');upload(stepEd,k,()=>A.overlay&&A.overlay.type==='sheet'?sheet('step'):render())};

/* shared step editor fields */
function dropRow(label,file,o){const up=o.progress!=null&&o.progress<100;return `<div class="drop ${file&&!up?'filled':''}"><span class="ph">${ic(label==='GIF'?'play':'image')}</span><div class="col grow"><span class="m">${label}</span>${up?`<span class="muted t-xs">${esc(o.name)} · uploading, ${o.progress}%</span><div class="progress"><i style="width:${o.progress}%"></i></div>`:`<span class="muted t-xs">${file?esc(file):(o.hint||`Drop a ${label==='GIF'?'GIF':'PNG'}, or browse`)}</span>`}</div>${up?`<button class="rowmenu" data-act="${o.cancel}" aria-label="Cancel upload">${ic('x')}</button>`:file?btn('Replace',{v:'ghost',sm:true,act:o.act,arg:o.arg}):btn('Browse',{v:'outline',sm:true,act:o.act,arg:o.arg})}</div>`}
function stepEditorFields(st,p){return `<div class="col gap16">${field('Title',st.title,{id:p+'-title',ph:'For example, Check the cup',err:st.err==='title'?'Give the step a title.':''})}
 ${field('What the child hears',st.text,{id:p+'-text',textarea:true,rows:2,ph:'Short, one idea. Read aloud for ages 5 to 8.',help:'Keep text out of the GIF: the app shows and reads these words.',err:st.err==='text'?'Write what the child hears.':''})}
 ${dropRow('GIF',st.gif,{act:p+'File',arg:'gif',progress:st.gifProg,name:st.gifName,cancel:p+'Cancel'})}
 ${dropRow('Still',st.still,{act:p+'File',arg:'still',hint:st.gif&&!st.still?'Add a still for children who turn motion off.':'',progress:st.stillProg,name:st.stillName,cancel:p+'Cancel'})}
 ${toggle('Grown-up helps','Shows "With a grown-up" in the app',st.grownup,p+'Toggle','grownup')}${toggle('Optional','The child can skip it',st.optional,p+'Toggle','optional')}</div>`}
function upload(st,k,repaint){const base=(st.figBase||'P'+S.nextId+'-'+String(8+(st.n||0)).padStart(2,'0'));const name=base+(k==='gif'?'.gif':'.png');
 if(k==='still'){st.still=name;repaint();return}
 st.gifProg=0;st.gifName=name;repaint();const tick=()=>{if(st.gifProg==null)return;st.gifProg=Math.min(100,st.gifProg+(st.gifProg<60?14:10));if(st.gifProg>=100){st.gifProg=null;st.gif=name+' · 7 s, loops'}repaint();if(st.gifProg!=null)setTimeout(tick,220)};setTimeout(tick,220)}
ACTIONS.seCancel=()=>{stepEd.gifProg=null;sheet('step')};

/* ---------- Add a build (AB1 to AB6, BS1 to BS7) ---------- */
function nbNew(){return {name:'',start:'',goal:'',ages:'5 to 9',time:'',pics:{start:'',finished:''},steps:[],materials:[],suit:'',prep:'',ed:null,touched:false}}
const WZ=['Details','Steps','Materials and safety','Review'];
function nbProblems(nb){const p=[];nb.steps.forEach((s,i)=>{if(!s.gif||!s.still)p.push([`Step ${i+1} has no ${!s.gif&&!s.still?'GIF or still':!s.gif?'GIF':'still'}`,'2',i])});if(nb.steps.length<4)p.unshift([`${nb.steps.length} of 4 steps`,'2']);if(!nb.prep.trim())p.push(['Grown-up preparation is empty','3']);if(nb.steps.some(s=>!s.text.trim()))p.push(['A step has no read-aloud text','2']);return p}
SCREENS['a/new-build']=n=>{n=Math.min(4,Math.max(1,+n||1));if(!S.nb)S.nb=nbNew();const nb=S.nb;const title=nb.name||'New build';
 const stepper=`<div class="stepper">${WZ.map((w,i)=>{const k=i+1;const cls=k===n?'on':k<n?'done':'';return `${i?'<span class="line"></span>':''}<button class="st ${cls}" ${k<n?`data-act="wzGo" data-arg="${k}"`:'disabled'}><span class="n">${k<n?ic('check','s14'):k}</span>${w}</button>`}).join('')}</div>`;
 const probs=nbProblems(nb);
 const next=n<4?btn('Next',{act:'wzNext',arg:n}):btn('Publish',{act:'nbPublish',disabled:probs.length>0||S.offline});
 const head=phead(title,'New build · draft, not live',btn('Cancel',{v:'ghost',act:'nbCancel'})+btn('Save draft',{v:'outline',act:'nbSave',disabled:S.offline})+next);
 let body='';
 if(n===1)body=`<div class="cols-wide"><div class="card pad col gap16" data-form="nb"><div class="section-title">Details</div>
  <div class="grid2">${field('Name',nb.name,{id:'nb-name',ph:'For example, Brush Bath',err:nb.err==='name'?'Give the build a name.':''})}${field('Starting item (what the child scans)',nb.start,{id:'nb-start',ph:'For example, Rigid plastic cup',err:nb.err==='start'?'Say what the child scans to find this build.':''})}</div>
  ${field('Child goal',nb.goal,{id:'nb-goal',ph:'For example, Reuse a cup to rinse your paintbrush.'})}
  <div class="grid2">${field('Ages',nb.ages,{id:'nb-ages',options:['5 to 9','7 to 9','9 to 12']})}${field('Time',nb.time,{id:'nb-time',ph:'About 5 minutes'})}</div></div>
  <div class="card pad col gap12"><div class="section-title">Pictures</div>${dropRow('Starting item',nb.pics.start,{act:'nbPic',arg:'start',hint:'Drop a PNG, or browse'}).replace('>'+ic('image')+'<','>'+ic('image')+'<')}${dropRow('Finished creation',nb.pics.finished,{act:'nbPic',arg:'finished',hint:'Drop a PNG, or browse'})}<p class="t-xs muted">PNG at 1600 × 1200. Keep text out of the picture: the app reads it aloud.</p></div></div>`;
 if(n===2){const ed=nb.ed;const list=nb.steps.length||ed?`<div class="card" style="overflow:hidden"><div class="row between" style="padding:20px 20px 12px"><span class="section-title">Steps</span><span class="t-xs muted">${nb.steps.length+(ed&&ed.isNew?1:0)} of 4 steps</span></div><div class="list" style="border-top:1px solid var(--border)">
   ${nb.steps.map((s,i)=>`<div class="steprow ${ed&&!ed.isNew&&ed.i===i?'on':''}"><span class="grip">${ic('grip-vertical')}</span><span class="play">${ic(s.gif?'play':'upload')}</span><button class="col grow" style="text-align:left" data-act="nbEditStep" data-arg="${i}"><span class="m">${i+1}&nbsp; ${esc(s.title)}</span></button>${s.grownup?status('Grown-up helps'):''}${s.optional?status('Optional'):''}${!s.gif?status('No pictures yet','neutral'):!s.still?status('Still missing','neutral'):''}<button class="rowmenu" data-act="nbStepMenu" data-arg="${i}" aria-label="More for step ${i+1}" aria-haspopup="menu">${ic('ellipsis')}</button></div>`).join('')}
   ${ed&&ed.isNew?`<div class="steprow on"><span class="grip">${ic('grip-vertical')}</span><span class="play">${ic('upload')}</span><span class="m grow">${nb.steps.length+1}&nbsp; ${esc(ed.title||'New step')}</span></div>`:''}
   <div style="padding:16px 20px">${nb.steps.length<4&&!(ed&&ed.isNew)?btn('Add step',{v:'outline',icon:'plus',act:'nbAddStep'}):nb.steps.length>=4?'<span class="muted t-sm">Builds have 4 steps.</span>':''}</div></div></div>`:'';
  if(!nb.steps.length&&!ed)body=`<div class="cols-wide"><div class="card">${empty('list-checks','No steps yet','Each step needs a title, the words the child hears, a GIF and a still. Builds have 4 steps.',btn('Add the first step',{icon:'plus',act:'nbAddStep'}))}</div>
   <div class="card pad col gap8"><span class="section-title">Good steps</span><span class="muted">·&nbsp; One action per step.</span><span class="muted">·&nbsp; Mark every step where a grown-up cuts, pours or checks.</span><span class="muted">·&nbsp; GIF 960 × 720, about 7 seconds, loops, no sound.</span><span class="muted">·&nbsp; Still 1600 × 1200 PNG, for children who turn motion off.</span></div></div>`;
  else body=`<div class="cols-wide">${list}${ed?`<div class="card pad col gap16"><span class="section-title">${ed.isNew?'New step '+(nb.steps.length+1):'Step '+(ed.i+1)}</span>${stepEditorFields(ed,'nbs')}<div class="row gap8" style="justify-content:flex-end">${btn('Cancel',{v:'ghost',act:'nbStepCancel'})}${btn('Save step',{act:'nbStepSave'})}</div></div>`:`<div class="card pad col gap8"><span class="section-title">Good steps</span><span class="muted">Pick a step to edit it, or add the next one.</span></div>`}</div>`}
 if(n===3){const gh=nb.steps.filter(s=>s.grownup).length;body=`<div class="cols-even"><div class="card" style="overflow:hidden"><div style="padding:20px 20px 12px" class="section-title">Materials</div><div class="list" style="border-top:1px solid var(--border)">${nb.materials.map((m,i)=>`<div class="li"><div class="col grow"><span class="m">${esc(m.name)}</span><span class="muted t-sm">${esc(m.qty)}</span></div>${m.grownup?status('Grown-up only'):''}<button class="rowmenu" data-act="nbMatDel" data-arg="${i}" aria-label="Remove ${esc(m.name)}">${ic('trash-2')}</button></div>`).join('')}<div style="padding:16px 20px">${btn('Add material',{v:'outline',icon:'plus',act:'nbMatAdd'})}</div></div></div>
  <div class="card pad col gap16" data-form="nb"><span class="section-title">Safety</span>${field('Item suitability',nb.suit,{id:'nb-suit',textarea:true,ph:'Which items are safe to use, and which are not.'})}${field('Grown-up preparation',nb.prep,{id:'nb-prep',textarea:true,ph:'What the grown-up does before the child starts.'})}${gh?`<div class="note">${ic('info')}<span>${gh} step${gh>1?'s need':' needs'} a grown-up, so the app marks this build "With a grown-up" and the parent confirms when it is done.</span></div>`:''}</div></div>`}
 if(n===4){const gh=nb.steps.filter(s=>s.grownup).length;const ok=[[`${nb.steps.length} steps${nb.steps.length===4&&nb.steps.every(s=>s.gif&&s.still)?', each with a GIF and a still':''}`,nb.steps.length===4],[`${gh} step${gh===1?'':'s'} marked Grown-up helps`,true],['Materials and grown-up preparation',!!nb.prep.trim()],['Read-aloud text for every step',nb.steps.length>0&&nb.steps.every(s=>s.text.trim())],[`Starting item: ${nb.start||'not set'}`,!!nb.start]];
  const rows=probs.length?[...ok.filter(x=>x[1]).map(x=>[x[0],true]),...probs.map(p=>[p[0],false,p[1],p[2]])]:ok;
  body=`<div class="cols-even"><div class="card pad col gap12"><span class="section-title">${probs.length?`${probs.length} thing${probs.length>1?'s':''} to fix before you publish`:'Ready to publish'}</span>${rows.map(([t,good,step,si])=>`<div class="row gap8"><span style="color:${good?'var(--primary)':'var(--red-700)'}">${ic(good?'circle-check':'circle-alert','s18')}</span><span class="grow">${esc(t)}</span>${good?'':btn('Fix',{v:'link',act:'nbFix',arg:step+'|'+(si==null?'':si)})}</div>`).join('')}</div>
  <div class="card pad col gap12"><span class="section-title">How it shows in the app</span><div class="blk row gap12"><span class="thumb">${ic('hammer')}</span><div class="col"><span class="m">${esc(nb.name||'New build')}</span><span class="muted t-sm">${esc(nb.time||'About 5 minutes')}${gh?' · with a grown-up':''}</span></div></div><p class="muted">Shown to children whose Treasury has ${nb.start?(/^[aeiou]/i.test(nb.start)?'an ':'a ')+esc(lc(nb.start)):'the starting item'}.</p>${nb.steps.length?btn('Preview in the app',{v:'outline',act:'previewNew'}):''}</div></div>`}
 return shell('Builds',[['Builds','a/builds'],'New build'],head+stepper+body)};
function nbRead(){const nb=S.nb;[['nb-name','name'],['nb-start','start'],['nb-goal','goal'],['nb-ages','ages'],['nb-time','time'],['nb-suit','suit'],['nb-prep','prep']].forEach(([id,k])=>{const e=document.getElementById(id);if(e)nb[k]=e.value});
 if(nb.ed){const t=document.getElementById('nbs-title');if(t){nb.ed.title=t.value;nb.ed.text=val('nbs-text')}}}
document.addEventListener('input',e=>{if(A.cur().startsWith('a/new-build')&&e.target.closest('.content')){S.nb.touched=true;A.dirty=A.cur();window.DIRTY_DESC='This build is not saved yet. If you leave now, it is lost. Save it as a draft to keep it.'}});
ACTIONS.wzGo=k=>{nbRead();A.dirty=null;go('a/new-build/'+k,{replace:true})};
ACTIONS.wzNext=n=>{nbRead();const nb=S.nb;nb.err=null;if(+n===1){if(!nb.name.trim())nb.err='name';else if(!nb.start.trim())nb.err='start';if(nb.err){render();return}}
 if(+n===2&&nb.ed){toast('Save or cancel the step first',{icon:'info'});return}
 A.dirty=null;go('a/new-build/'+(+n+1));A.dirty=S.nb.touched?A.cur():null};
ACTIONS.nbPic=k=>{nbRead();S.nb.pics[k]=`P${S.nextId}-0${k==='start'?1:2}.png · 1600 × 1200`;S.nb.touched=true;render()};
ACTIONS.nbAddStep=()=>{nbRead();S.nb.ed={isNew:true,n:S.nb.steps.length,title:'',text:'',grownup:false,optional:false,gif:'',still:'',figBase:`P${S.nextId}-${String(8+S.nb.steps.length).padStart(2,'0')}`};render();later(0,()=>{const t=document.getElementById('nbs-title');if(t)t.focus()})};
ACTIONS.nbEditStep=i=>{nbRead();const s=S.nb.steps[+i];S.nb.ed=Object.assign({},s,{isNew:false,i:+i,n:+i,err:null});render()};
ACTIONS.nbStepCancel=()=>{S.nb.ed=null;render()};
ACTIONS.nbsToggle=k=>{nbRead();S.nb.ed[k]=!S.nb.ed[k];render()};
ACTIONS.nbsFile=k=>{nbRead();upload(S.nb.ed,k,()=>{if(A.cur().startsWith('a/new-build/2')){nbRead();render()}})};
ACTIONS.nbsCancel=()=>{S.nb.ed.gifProg=null;render()};
ACTIONS.nbStepSave=()=>{nbRead();const ed=S.nb.ed;ed.err=!ed.title.trim()?'title':!ed.text.trim()?'text':null;if(ed.err){render();return}if(ed.gifProg!=null){toast('Wait for the GIF to finish uploading',{icon:'info'});return}
 const s={title:ed.title.trim(),text:ed.text.trim(),grownup:ed.grownup,optional:ed.optional,gif:ed.gif,still:ed.still,figBase:ed.figBase};
 if(ed.isNew){S.nb.steps.push(s);const k=S.nb.steps.length;S.nb.ed=k<4?{isNew:true,n:k,title:'',text:'',grownup:false,optional:false,gif:'',still:'',figBase:`P${S.nextId}-${String(8+k).padStart(2,'0')}`}:null;render();toast(`Step ${k} saved`)}
 else{S.nb.steps[ed.i]=s;S.nb.ed=null;render();toast(`Step ${ed.i+1} saved`)}};
ACTIONS.nbStepMenu=(i,el)=>{i=+i;const st=S.nb.steps;openMenu([{label:'Move up',icon:'chevron-up',run:()=>{if(i>0){[st[i-1],st[i]]=[st[i],st[i-1]];render()}}},{label:'Move down',icon:'chevron-down',run:()=>{if(i<st.length-1){[st[i+1],st[i]]=[st[i],st[i+1]];render()}}},{label:'Delete step',icon:'trash-2',danger:true,run:()=>dialog('nbDelStep',i)}],el)};
DIALOGS.nbDelStep=i=>{const st=S.nb.steps;const after=st.slice(i+1).map((_,k)=>i+2+k);return {title:`Delete step ${i+1}?`,desc:`"${esc(st[i].title)}", its GIF and still are deleted.${after.length?` Step${after.length>1?'s':''} ${after.join(' and ')} move${after.length>1?'':'s'} up.`:''}`,actions:btn('Cancel',{v:'outline',act:'close'})+btn('Delete step',{v:'destructive',act:'nbDelStep',arg:i})}};
ACTIONS.nbDelStep=i=>{S.nb.steps.splice(+i,1);S.nb.ed=null;A.overlay=null;render();toast(`Step ${+i+1} deleted`,{icon:'trash-2'})};
let mat={name:'',qty:'',grownup:false};
ACTIONS.nbMatAdd=()=>{nbRead();mat={name:'',qty:'',grownup:false};dialog('mat')};
DIALOGS.mat=()=>({title:'Add a material',body:`${field('Material',mat.name,{id:'mt-name',ph:'For example, Shallow tray',err:mat.err})}${field('Quantity',mat.qty,{id:'mt-qty',ph:'For example, 1 already owned'})}${cbox('Grown-up only',mat.grownup,'mtGu','1')}`,actions:btn('Cancel',{v:'outline',act:'close'})+btn('Add material',{act:'mtSave'})});
ACTIONS.mtGu=()=>{mat.name=val('mt-name');mat.qty=val('mt-qty');mat.grownup=!mat.grownup;dialog('mat')};
ACTIONS.mtSave=()=>{mat.name=val('mt-name').trim();mat.qty=val('mt-qty').trim();if(!mat.name){mat.err='Name the material.';dialog('mat');return}S.nb.materials.push({name:mat.name,qty:mat.qty||'1',grownup:mat.grownup});A.overlay=null;render()};
ACTIONS.nbMatDel=i=>{nbRead();const m=S.nb.materials.splice(+i,1)[0];render();toast(`${m.name} removed`,{undo:()=>{S.nb.materials.splice(+i,0,m);render()}})};
ACTIONS.nbFix=a=>{const [k,si]=a.split('|');A.dirty=null;go('a/new-build/'+k,{replace:true});if(si!==''&&k==='2'){ACTIONS.nbEditStep(si)}};
function nbToBuild(status){const nb=S.nb;const id='P'+S.nextId++;const mins=parseInt(nb.time)||5;
 const b={id,name:nb.name.trim()||'New build',ages:nb.ages.replace(' to ','–'),mins,goal:nb.goal,start:nb.start||'Not set',materials:nb.materials,suit:nb.suit,prep:nb.prep,status,since:'today',
  steps:nb.steps.map((s,i)=>({n:i+1,title:s.title,text:s.text,grownup:s.grownup,optional:s.optional,fig:''}))};S.builds.push(b);S.nb=null;A.dirty=null;return b}
ACTIONS.nbSave=()=>{nbRead();if(!S.nb.name.trim()){S.nb.err='name';A.dirty=null;go('a/new-build/1',{replace:true});toast('Give the build a name first',{icon:'circle-alert'});return}const b=nbToBuild('draft');bEdit={id:b.id,saved:true};go('a/build/'+b.id,{force:true});toast('Draft saved')};
ACTIONS.nbPublish=()=>{nbRead();const b=nbToBuild('live');go('a/builds',{force:true});toast(`${b.name} is live`)};
ACTIONS.nbCancel=()=>{nbRead();if(S.nb&&S.nb.touched){A.dirty=A.cur();window.DIRTY_DESC='This build is not saved yet. If you leave now, it is lost. Save it as a draft to keep it.';go('a/builds')}else{S.nb=null;A.dirty=null;go('a/builds')}};
const leave0=ACTIONS.leaveAnyway;ACTIONS.leaveAnyway=t=>{if(A.cur().startsWith('a/new-build'))S.nb=null;leave0(t)};

/* ---------- Preview in the app (H7, H8): the real kid app in a frame ---------- */
let pv=null;
function openBuildPreview(id,step){const b=B(id);pv={kind:'build',id,step:+step||1,ages:'5-9'};preview()}
ACTIONS.previewBuild=a=>{const [id,s]=String(a).split('|');openBuildPreview(id,s)};
ACTIONS.previewNew=()=>{nbRead();pv={kind:'new',step:1,ages:'5-9'};preview()};
window.openQuizPreview=(quiz,q)=>{pv={kind:'quiz',quiz,q:q||0,ages:'5-9'};preview()};
const PIC={'A new can':'Material/Tin can','A tree':'Build/Plant Pal','Rinse it':'UI/Refresh','Throw it away':'UI/Trash','A grown-up':'UI/Hand','Nobody':'UI/Close','A seed tray':'Material/Egg box','Seed tray':'Material/Egg box','Egg box':'Material/Egg box','Plant pot':'Build/Plant Pal','Seedlings':'Build/Plant Pal','A spoon':'UI/Close','The recycling box':'UI/Refresh','The fridge':'UI/Close'};
function frameSrc(){if(pv.kind==='quiz'){const q=pv.quiz;const isTin=q.t==='What does a tin can become?';const data=isTin?null:{quiz:q.qs.map(([t,ans,r])=>[t,ans.map((a,i)=>[a,(q.pics&&q.pics[t+'|'+i])||PIC[a]||'Material/'+q.m,i===r?1:0]),'Yes! That\'s right.']),q:pv.q,ages:pv.ages};
  return `index.html?embed=1&pv=${encodeURIComponent(JSON.stringify(data||{q:pv.q,ages:pv.ages}))}#k/quiz/${encodeURIComponent(q.m)}`}
 const steps=pv.kind==='new'?S.nb.steps:B(pv.id).steps;const isP01=pv.kind==='build'&&pv.id==='P01';
 const data=isP01?{ages:pv.ages}:{ages:pv.ages,steps:steps.map(s=>({title:s.title,text:s.text,gu:s.grownup,opt:s.optional,img:s.fig?`assets/builds/${s.fig}.webp`:'',pic:'Material/Yoghurt pot'}))};
 return `index.html?embed=1&pv=${encodeURIComponent(JSON.stringify(data))}#k/step/${pv.step}`}
window.PREVIEW_HTML=()=>{const isQ=pv.kind==='quiz';const total=isQ?pv.quiz.qs.length:(pv.kind==='new'?S.nb.steps.length:B(pv.id).steps.length);const idx=isQ?pv.q+1:pv.step;
 const s=!isQ&&(pv.kind==='new'?S.nb.steps:B(pv.id).steps)[pv.step-1];
 const line=isQ?`Question ${idx} of ${total}, picture answers, read aloud.`:`Step ${idx} of ${total}${s&&s.grownup?', with a grown-up':''}${s&&s.optional?', optional':''}. Read aloud for ages 5 to 8.`;
 return `<div class="preview" role="dialog" aria-modal="true" aria-label="Preview in the app"><div class="phone"><iframe title="Kid app preview" src="${frameSrc()}"></iframe></div><div class="side-info"><h2 class="t-lg b">Preview in the app</h2><p class="muted">${line}</p>
  <div class="tabs">${[['5-9','Ages 5 to 8'],['9-12','Ages 9 to 12']].map(([k,l])=>`<button class="tab ${pv.ages===k?'on':''}" data-act="pvAges" data-arg="${k}">${l}</button>`).join('')}</div>
  <div class="pager">${ibtn('chevron-left',{act:'pvStep',arg:-1,title:'Previous',disabled:idx<=1,sm:true})}<span>${isQ?'Question':'Step'} ${idx} of ${total}</span>${ibtn('chevron-right',{act:'pvStep',arg:1,title:'Next',disabled:idx>=total,sm:true})}</div>
  <p class="t-xs muted">This is the real kid app layout. Nothing here is shared with families until you publish.</p><div>${btn('Close preview',{v:'outline',act:'close'})}</div></div></div>`};
ACTIONS.pvAges=k=>{pv.ages=k;preview()};
ACTIONS.pvStep=d=>{if(pv.kind==='quiz')pv.q=Math.max(0,Math.min(pv.quiz.qs.length-1,pv.q+(+d)));else pv.step=Math.max(1,pv.step+(+d));preview()};
})();
