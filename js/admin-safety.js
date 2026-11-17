/* EcoSpark Admin · Moderation (MD1 to MD17, H11, H15 to H17), Alerts (AL1 to AL8, H6), Usage (US1 to US5), Page not found (ST6) */
(function(){
const A=window.ADMIN;const {S,me,esc,ic,btn,ibtn,status,disc,stat,phead,tabs,empty,field,toggle,cbox,radio,kv,bars,val,go,later,dialog,sheet,close,toast,openMenu,render,shell,SCREENS,DIALOGS,SHEETS,ACTIONS}=A;
const lc=s=>s.charAt(0).toLowerCase()+s.slice(1);

/* ---------- Moderation ---------- */
const MSUB='Flagged photos and answers, and reports parents send to the safety team.';
function sorted(list){const l=list.slice();if(S.modSort==='Newest first')l.reverse();if(S.modSort==='Ages 5 to 8 first')l.sort((a,b)=>(a.ages==='5 to 8'?0:1)-(b.ages==='5 to 8'?0:1));return l}
SCREENS['a/moderation']=tab=>A.withLoading('Moderation','Moderation',()=>{const t=tab==='answers'?'Answers':tab==='reports'?'Reports':'Photos';
 const tb=`<div class="toolbar">${tabs([['Photos','a/moderation',S.photos.length],['Answers','a/moderation/answers',S.answers.length],['Reports','a/moderation/reports',S.reports.length]],t)}<span class="spacer"></span><button class="chip" data-act="modSort" aria-haspopup="menu">${ic('arrow-up-down','s14')}${esc(S.modSort)}</button></div>`;
 let body;
 if(t==='Photos')body=S.photos.length?`<table><thead><tr><th>Photo</th><th>Build</th><th>Why it was flagged</th><th>Ages</th><th>Family</th><th>Sent</th></tr></thead><tbody>${sorted(S.photos).map(p=>`<tr class="click" data-act="openPhoto" data-arg="${p.id}" tabindex="0"><td style="width:88px"><span class="thumb">${ic('eye-off')}</span></td><td class="name">${esc(p.build)}</td><td>${status(p.why,'warning')}</td><td>${p.ages}</td><td>${p.fam}</td><td class="muted">${p.ago}</td></tr>`).join('')}</tbody></table>`:empty('circle-check','All caught up','No photos to check. New flagged photos show here.','','primary');
 if(t==='Answers')body=S.answers.length?`<table><thead><tr><th>What was scanned</th><th>The app said</th><th>Flag</th><th>Ages</th><th>Sent</th></tr></thead><tbody>${sorted(S.answers).map(a=>`<tr class="click" data-act="openAnswer" data-arg="${a.id}" tabindex="0"><td class="name">${esc(a.scanned)}</td><td>${esc(a.said)}</td><td>${status(a.flag,a.kind==='safety'?'danger':'warning')}</td><td>${a.ages}</td><td class="muted">${a.ago}</td></tr>`).join('')}</tbody></table>`:empty('circle-check','All caught up','No answers to check. Answers a child marks "That\'s not right" show here.','','primary');
 if(t==='Reports')body=S.reports.length?`<table><thead><tr><th>Report</th><th>Where</th><th>Family</th><th>Ages</th><th>Sent</th><th>Status</th></tr></thead><tbody>${sorted(S.reports).map(r=>`<tr class="click" data-act="openReport" data-arg="${r.id}" tabindex="0"><td class="name">${esc(r.what)}</td><td>${esc(r.where)}</td><td>${r.fam}</td><td>${r.ages}</td><td class="muted">${r.at}</td><td>${status(r.hidden?'Content hidden':'New',r.hidden?'warning':'info')}</td></tr>`).join('')}</tbody></table>`:empty('circle-check','All caught up','No reports. When a parent sends a report to the safety team, it shows here.','','primary');
 return shell('Moderation',['Moderation'],`${phead('Moderation',MSUB)}<div class="card" style="overflow:hidden">${tb}${body}</div>`)});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('tr[data-act]'))e.target.click()});
ACTIONS.modSort=(a,el)=>openMenu(['Oldest first','Newest first','Ages 5 to 8 first'].map(x=>({label:x,on:S.modSort===x,run:()=>{S.modSort=x;render()}})),el,'Sort');
/* photos */
let shown=false;
const P=id=>S.photos.find(p=>p.id===id);
ACTIONS.openPhoto=id=>{shown=false;sheet('photo',id)};
SHEETS.photo=id=>{const p=P(id);return {title:'Flagged photo',sub:`${p.build} · ${p.fam}`,
 body:`<div class="photo ${shown?'shown':''}">${shown?`${ic('hammer','s24')}<span class="cap">Photo of the build (${esc(p.desc)})</span>${btn('Hide photo',{v:'outline',sm:true,icon:'eye-off',act:'togglePhoto',arg:id})}`:`${ic('eye-off','s24')}<span>Photo hidden</span>${btn('Show photo',{v:'outline',sm:true,icon:'eye',act:'togglePhoto',arg:id})}`}</div>
  ${kv([['Build',esc(p.build)],['Why',esc(p.whyLong)],['Ages',p.ages],['Family',p.fam],['Sent',p.at]])}<div class="note">${ic('info')}<span>Allow: it goes to the parent for approval. Remove: it is deleted and the child is asked for a new photo with just the build.</span></div>`,
 actions:btn('Remove photo',{v:'destructive',act:'removePhotoAsk',arg:id})+btn('Allow',{act:'allowPhoto',arg:id})}};
ACTIONS.togglePhoto=id=>{shown=!shown;sheet('photo',id)};
ACTIONS.allowPhoto=id=>{const i=S.photos.findIndex(p=>p.id===id);const p=S.photos.splice(i,1)[0];A.overlay=null;render();toast('Photo allowed. It went to the parent for approval.',{undo:()=>{S.photos.splice(i,0,p);render()}})};
let reason=0;
ACTIONS.removePhotoAsk=id=>{reason=0;dialog('removePhoto',id)};
const REASONS=['It shows a person',"It isn't a build",'Something unsafe'];
DIALOGS.removePhoto=id=>({title:'Remove this photo?',desc:'It is deleted straight away. This cannot be undone.',body:`<div class="col gap8" role="radiogroup" aria-label="Reason">${REASONS.map((r,i)=>radio(r,'',reason===i,'reason',id+'|'+i)).join('')}</div><div class="col gap8"><span class="flabel">The family sees</span><div class="quote">"We couldn't use this photo. Try another one, with just your build."</div></div>`,actions:btn('Cancel',{v:'outline',act:'close'})+btn('Remove photo',{v:'destructive',act:'removePhoto',arg:id})});
ACTIONS.reason=a=>{const [id,i]=a.split('|');reason=+i;dialog('removePhoto',id)};
ACTIONS.removePhoto=id=>{S.photos=S.photos.filter(p=>p.id!==id);A.overlay=null;render();const n=S.photos.length;toast(n?`Photo removed. ${n} photo${n>1?'s':''} left.`:'Photo removed. All photos checked.',{icon:'trash-2'})};
/* answers */
const AN=id=>S.answers.find(a=>a.id===id);
ACTIONS.openAnswer=id=>sheet('answer',id);
SHEETS.answer=id=>{const a=AN(id);const wrong=a.kind==='wrong';
 return {title:wrong?'Flagged answer':'Safety answer',sub:`${wrong?a.said:a.scanned} · ${a.fam}`,
 body:`${kv(wrong?[['Scanned',a.at],['The app said',esc(a.said)],['Flag','The child tapped "That\'s not right"'],['Ages',a.ages],['Family',a.fam]]:[['Scanned',a.at],['Flag',esc(a.flag)],['Ages',a.ages],['Family',a.fam]])}
  <div class="col gap8"><span class="flabel">What the child saw</span>${wrong?['Treasure: Plastic bottle','You can build: Plant Pal','Learn: What is a plastic bottle?'].map(x=>`<div class="blk">${x}</div>`).join(''):S.safetyTip.split(/(?<=\.) /).map(x=>`<div class="blk">${esc(x)}</div>`).join('')}</div>
  ${wrong?'<p class="t-xs muted">The photo was deleted after the scan. You only see what the app answered.</p>':''}`,
 actions:wrong?btn('The answer was right',{v:'outline',act:'answerOk',arg:id})+btn('Fix the answer',{act:'fixAsk',arg:id}):btn('Edit the tip',{v:'outline',act:'tipAsk',arg:id})+btn('The tip is right',{act:'answerOk',arg:id})}};
function resolveAnswer(id,msg,o={}){const i=S.answers.findIndex(a=>a.id===id);const a=S.answers.splice(i,1)[0];A.overlay=null;render();toast(msg,Object.assign({undo:o.undo===false?null:()=>{S.answers.splice(i,0,a);render()}},o))}
ACTIONS.answerOk=id=>{const a=AN(id);resolveAnswer(id,a.kind==='wrong'?'Marked as right. The answer stays.':'Checked. The tip stays as it is.')};
let fix={what:'Glass jar',note:'Clear jar with a lid, read as a bottle.'};
ACTIONS.fixAsk=id=>{fix={what:AN(id).scanned,note:'Clear jar with a lid, read as a bottle.'};dialog('fix',id)};
const MATERIALS=['Tin can','Drinks can','Plastic bottle','Bottle top','Yoghurt pot','Plastic cup','Cardboard box','Egg box','Newspaper','Kitchen roll tube','Glass jar','Glass bottle'];
DIALOGS.fix=id=>{const a=AN(id);return {title:'Fix the answer',desc:`The child's Treasury changes from ${esc(a.said)} to the right treasure.`,body:`${field('What was it?',fix.what,{id:'fx-what',options:MATERIALS})}${field('Note for the team (optional)',fix.note,{id:'fx-note',textarea:true,rows:2})}`,actions:btn('Cancel',{v:'outline',act:'close'})+btn('Save fix',{act:'fix',arg:id})}};
ACTIONS.fix=id=>{const w=val('fx-what');resolveAnswer(id,`Fixed. The child's Treasury now shows ${/^[aeiou]/i.test(w)?'an':'a'} ${lc(w)}.`,{undo:false})};
let tip='';
ACTIONS.tipAsk=id=>{tip=S.safetyTip;dialog('tip',id)};
DIALOGS.tip=id=>({title:'Edit the safety tip for batteries',desc:'Shown every time a child scans a battery. Keep it short: it is read aloud.',
 body:`<div class="field"><label for="tp">Tip</label><textarea class="input" id="tp" rows="3" maxlength="120" data-onin="tipIn">${esc(tip)}</textarea><div class="help" id="tp-n">${tip.length} of 120 characters</div></div><div class="col gap8"><span class="flabel">Children see</span><div class="quote" id="tp-prev">"${esc(tip)}"</div></div>`,
 actions:btn('Cancel',{v:'outline',act:'close'})+btn('Save tip',{act:'tipSave',arg:id})});
ACTIONS.tipIn=v=>{tip=v;const n=document.getElementById('tp-n');if(n)n.textContent=v.length+' of 120 characters';const p=document.getElementById('tp-prev');if(p)p.textContent='"'+v+'"'};
ACTIONS.tipSave=id=>{if(!tip.trim()){toast('The tip cannot be empty',{icon:'circle-alert'});return}S.safetyTip=tip.trim();resolveAnswer(id,'Tip saved. Children see it from the next scan.',{undo:false})};
/* reports */
const R=id=>S.reports.find(r=>r.id===id);
ACTIONS.openReport=id=>sheet('report',id);
SHEETS.report=id=>{const r=R(id);const href=r.kind==='video'?'a/video/What is a tin can?':'a/build/P03';
 return {title:'Report',sub:`${r.what} · ${r.fam}`,body:`${kv([['What the child chose',esc(r.what)],['Where',esc(r.where)],['When',r.at],['Family',r.fam],['Ages',r.ages],['Sent by','The parent, after talking with the child']])}
  <div class="blk row gap12">${disc(r.kind==='video'?'play':'hammer','neutral')}<div class="col grow"><span class="m">${esc(r.content)}</span><span class="muted t-sm">${esc(r.hidden?r.csub.replace('Live','Hidden'):r.csub)}</span></div><a href="#${esc(href)}" data-go="${esc(href)}" class="textlink">Open</a></div>`,
 actions:(r.hidden?'':btn(r.kind==='video'?'Hide the video':'Hide the build',{v:'outline',act:'hideAsk',arg:id}))+btn('Resolve',{act:'resolveAsk',arg:id})}};
DIALOGS.hide=id=>{const r=R(id);return r.kind==='video'?{title:`Hide "${esc(r.content)}"?`,desc:`Children won't see it until you show it again. Step 1 of the Tin can path shows "coming soon" meanwhile.`,actions:btn('Cancel',{v:'outline',act:'close'})+btn('Hide video',{v:'destructive',act:'hide',arg:id})}
 :{title:'Hide Puzzle Rescue?',desc:"Children won't be offered it until you publish it again. It moves to drafts.",actions:btn('Cancel',{v:'outline',act:'close'})+btn('Hide build',{v:'destructive',act:'hide',arg:id})}};
ACTIONS.hideAsk=id=>dialog('hide',id);
ACTIONS.hide=id=>{const r=R(id);r.hidden=true;if(r.kind==='video'){const v=S.videos.find(x=>x.t===r.content);if(v)v.st='draft';S.paths['Tin can'][0]='draft'}else{const b=S.builds.find(x=>x.id==='P03');if(b)b.status='draft'}A.overlay=null;render();sheet('report',id);toast(r.kind==='video'?'Video hidden. Step 1 shows "coming soon".':'Puzzle Rescue hidden. It is now a draft.',{icon:'eye-off'})};
let res={o:0,msg:'',email:true};
ACTIONS.resolveAsk=id=>{const r=R(id);res={o:r.hidden?2:0,email:true,msg:r.kind==='video'?'Thank you for telling us. We watched the video again and it is fine for ages 5 to 8. Leo can talk to you any time something worries him.':'Thank you for telling us. We checked step 2 of Puzzle Rescue with our team.'};dialog('resolve',id)};
const OUT=['The content is fine','We changed the content','We hid the content'];
DIALOGS.resolve=id=>({title:'Resolve this report',desc:'The report moves to Resolved. The family code stays, no names.',
 body:`<div class="col gap8" role="radiogroup" aria-label="What did you find?"><span class="flabel">What did you find?</span>${OUT.map((o,i)=>radio(o,'',res.o===i,'resOut',id+'|'+i)).join('')}</div>${field('Message to the parent',res.msg,{id:'rs-msg',textarea:true,rows:4})}${cbox('Email the parent (to confirm with Kapitol)',res.email,'resEmail',id)}`,
 actions:btn('Cancel',{v:'outline',act:'close'})+btn('Resolve report',{act:'resolve',arg:id})});
ACTIONS.resOut=a=>{const [id,i]=a.split('|');res.msg=val('rs-msg');res.o=+i;dialog('resolve',id)};
ACTIONS.resEmail=id=>{res.msg=val('rs-msg');res.email=!res.email;dialog('resolve',id)};
ACTIONS.resolve=id=>{S.reports=S.reports.filter(r=>r.id!==id);A.overlay=null;render();toast(res.email?'Report resolved. The parent was told.':'Report resolved.')};

/* ---------- Alerts ---------- */
const ASUB='Errors, a growing review queue and AI costs, so problems are fixed before families notice them.';
function alertCard(a,open){const click=!!a.go;return `<div class="li ${click?'click':''}" ${click?`data-go="${a.go}" tabindex="0" role="link"`:''}>${disc(a.icon||'bell',open?(a.tone||'warning'):'neutral')}<div class="col grow"><span class="m">${esc(a.t)}</span><span class="muted">${esc(a.d)}</span></div><span class="muted t-sm" style="white-space:nowrap">${esc(a.at)}</span>${open&&a.link?`<a href="#${a.link[1]}" data-go="${a.link[1]}" class="textlink" style="white-space:nowrap">${a.link[0]} ${ic('chevron-right','s14')}</a>`:click?ic('chevron-right'):''}</div>`}
SCREENS['a/alerts']=tab=>A.withLoading('Alerts','Alerts',()=>{const res=tab==='resolved';
 const tb=`<div class="toolbar">${tabs([['Open','a/alerts',S.alerts.length],['Resolved','a/alerts/resolved',S.resolved.length]],res?'Resolved':'Open')}</div>`;
 const list=res?S.resolved:S.alerts;
 const body=list.length?`<div class="list">${list.map(a=>alertCard(a,!res)).join('')}</div>`:empty('circle-check',res?'Nothing resolved yet':'No open alerts',res?'Resolved alerts show here.':"Everything is running normally. We'll tell you here and by email if something needs you.",'','primary');
 return shell('Alerts',['Alerts'],`${phead('Alerts',ASUB,btn('Alert settings',{v:'outline',icon:'settings',go:'a/alert-settings'}))}<div class="card" style="overflow:hidden">${tb}${body}</div>`)});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('.li[data-go]'))go(e.target.dataset.go)});
function resolveAlert(id,msg){const i=S.alerts.findIndex(a=>a.id===id);if(i<0)return;const a=S.alerts.splice(i,1)[0];const r=Object.assign({},a,{d:`Resolved by ${me().name}.`,at:'Today',go:a.go,link:null});S.resolved.unshift(r);go('a/alerts');toast(msg,{undo:()=>{S.resolved.shift();S.alerts.splice(i,0,a);render()}})}
const isOpen=id=>S.alerts.some(a=>a.id===id);
SCREENS['a/alert']=k=>{
 if(k==='cost'){const open=isOpen('cost');return shell('Alerts',[['Alerts','a/alerts'],'AI cost'],`${phead("AI cost is at 74% of this week's budget",open?'Opened today at 09:00 · warning at 70%':`Opened today at 09:00 · resolved by ${esc(me().name)}`,open?btn('Mark as resolved',{v:'outline',act:'resolveCost'}):status('Resolved'))}
  <div class="grid3">${stat('Spent this week','£18.40',`of £${S.alertSet.budget} budget`,'pound-sterling')}${stat('Cost per scan','£0.054','Average this week','sparkles')}${stat('Scans this week','342','12 active families','users')}</div>
  <div class="cols-wide"><div class="card pad col gap8"><div class="section-title">Cost per day</div>${bars([76,86,101,90,119,112,79],4,undefined,'cost')}</div>
  <div class="card pad col gap12"><div class="section-title">Daily scan limit</div><div class="t-lg b">${S.scanLimit} scans per child a day</div><p class="muted">A lower limit keeps the cost predictable. Children only see the limit when they reach it.</p><div>${btn('Change limit',{v:'outline',act:'limitAsk',disabled:S.me!=='grace'})}</div>${S.me!=='grace'?'<p class="t-xs muted">Only admins can change the limit.</p>':''}</div></div>`)}
 if(k==='queue'){const open=isOpen('queue');const n=A.modCount();return shell('Alerts',[['Alerts','a/alerts'],'Review queue'],`${phead('The review queue is growing',open?'Opened today at 10:40 · items should be checked within 2 h':'Opened today at 10:40 · resolved',(open?btn('Mark as resolved',{v:'outline',act:'resolveQueue'}):status('Resolved'))+btn('Open moderation',{go:'a/moderation'}))}
  <div class="grid3">${stat('Waiting',String(n),`${S.photos.length} photos, ${S.answers.length} answers, ${S.reports.length} reports`,'shield-check')}${stat('Oldest',n?'3 h':'–','Limit 2 h','clock')}${stat('Checked today','11','By Priya Shah and Grace Bennett','circle-check')}</div>
  <div class="card pad col gap8"><div class="section-title">Why it matters</div><p class="muted">A child waits for every flagged photo before the parent can approve it. Nothing is lost, but it should not take long.</p></div>`)}
 if(k==='errors')return shell('Alerts',[['Alerts','a/alerts'],'Scan errors'],`${phead('Scan errors: 12 failed scans in 10 minutes','Yesterday 18:02 to 18:14 · resolved by Grace Bennett',status('Resolved'))}
  <div class="card pad col gap16"><div class="section-title">What happened</div>${[['18:02','Scans started failing. Children saw "Let\'s try again in a moment". No scan was counted against their limit.'],['18:05','Alert sent to Grace Bennett and Priya Shah.'],['18:14','The scan service is back to normal.'],['18:20','Grace Bennett marked it as resolved: "Provider outage, nothing to do on our side."']].map(([t,d])=>`<div class="row gap16" style="align-items:flex-start"><span class="m" style="width:48px">${t}</span><span class="grow">${esc(d)}</span></div>`).join('')}</div>`);
 return SCREENS['a/404']()};
ACTIONS.resolveCost=()=>resolveAlert('cost','AI cost alert resolved');
ACTIONS.resolveQueue=()=>resolveAlert('queue','Review queue alert resolved');
let lim=4;
ACTIONS.limitAsk=()=>{lim=Math.max(1,S.scanLimit-1);dialog('limit')};
DIALOGS.limit=()=>{const diff=(S.scanLimit-lim)*4;return {title:'Change the daily scan limit',desc:'For every child in the pilot, from tomorrow.',
 body:`<div class="field"><label for="lm">Scans per child a day</label><div class="row gap8">${ibtn('chevron-down',{act:'limStep',arg:-1,title:'Fewer',sm:true,disabled:lim<=1})}<input class="input" id="lm" type="number" min="1" max="10" value="${lim}" style="width:72px;text-align:center" data-onin="limIn">${ibtn('chevron-up',{act:'limStep',arg:1,title:'More',sm:true,disabled:lim>=10})}</div><div class="help">Now ${S.scanLimit}. ${diff>0?`About £${diff} less`:diff<0?`About £${-diff} more`:'No change'}${diff?' a week at this week\'s pace.':'.'}</div></div>
 <div class="col gap8"><span class="flabel">When a child reaches it, they see</span><div class="quote">"That's all the scans for today. Come back tomorrow for more treasure!"</div></div>`,
 actions:btn('Cancel',{v:'outline',act:'close'})+btn('Save limit',{act:'limSave',disabled:lim===S.scanLimit})}};
ACTIONS.limStep=d=>{lim=Math.max(1,Math.min(10,lim+(+d)));dialog('limit')};
ACTIONS.limIn=v=>{const n=parseInt(v);if(n>=1&&n<=10){lim=n;clearTimeout(window._lm);window._lm=setTimeout(()=>{dialog('limit');const i=document.getElementById('lm');if(i)i.focus()},400)}};
ACTIONS.limSave=()=>{const old=S.scanLimit;S.scanLimit=lim;A.overlay=null;render();toast(`Daily limit is now ${lim} scans per child, from tomorrow`,{undo:()=>{S.scanLimit=old;render()}})};
/* alert settings (AL7) */
SCREENS['a/alert-settings']=()=>{const s=S.alertSet;const P=A.PEOPLE;
 return shell('Alerts',[['Alerts','a/alerts'],'Settings'],`${phead('Alert settings','When to warn the team, and who gets the email.',btn('Cancel',{v:'outline',go:'a/alerts'})+btn('Save changes',{act:'alertSave',disabled:S.offline}))}
 <div class="cols-even"><div class="col gap16" data-form="alerts">
  <div class="card pad col gap12"><div class="section-title">Review queue</div>${field('Alert when an item waits longer than',s.queue,{id:'as-q',options:['1 hour','2 hours','4 hours','8 hours']})}</div>
  <div class="card pad col gap12"><div class="section-title">AI cost</div>${field('Weekly budget',s.budget,{id:'as-b',type:'number',icon:'pound-sterling',help:'Set with Kapitol once the cost per scan is known.'})}${field('Warn at',s.warn,{id:'as-w',options:['50% and 80%','70% and 90%','80% and 100%']})}</div>
  <div class="card pad col gap12"><div class="section-title">Errors</div>${field('Alert when scans fail',s.errors,{id:'as-e',options:['More than 3 in 10 minutes','More than 5 in 10 minutes','More than 10 in 10 minutes']})}</div>
 </div><div class="card pad col gap12"><div class="section-title">Who gets alerts by email</div>${S.team.map(m=>{const p=P[m.k];return `<div class="row gap12"><span class="avatar soft">${p.ini}</span><div class="col grow"><span class="m">${p.name}</span><span class="muted t-sm">${m.role||p.role}</span></div><button class="switch ${s.who[m.k]?'on':''}" data-act="alertWho" data-arg="${m.k}" role="switch" aria-checked="${!!s.who[m.k]}" aria-label="Email ${p.name}"></button></div>`}).join('')}<p class="t-xs muted">Everyone also sees alerts here and on the bell at the top.</p></div></div>`)};
document.addEventListener('input',e=>{if(e.target.closest('[data-form="alerts"]')){A.dirty=A.cur();window.DIRTY_DESC='You changed the alert settings. If you leave now, the changes are lost.'}});
function asRead(){const s=S.alertSet;const q=document.getElementById('as-q');if(!q)return;s.queue=q.value;s.budget=val('as-b')||s.budget;s.warn=val('as-w');s.errors=val('as-e')}
ACTIONS.alertWho=k=>{asRead();S.alertSet.who[k]=!S.alertSet.who[k];A.dirty=A.cur();render()};
ACTIONS.alertSave=()=>{asRead();if(!(+S.alertSet.budget>0)){toast('Enter a weekly budget',{icon:'circle-alert'});return}S.setupDone.alerts=true;A.dirty=null;go('a/alerts',{force:true});toast('Alert settings saved')};

/* ---------- Usage ---------- */
const DAYS=[38,44,52,47,61,58,42];
SCREENS['a/usage']=()=>A.withLoading('Usage','Usage',()=>{const e=S.usageEmpty;
 const head=phead('Usage','How families use EcoSpark in the pilot. Anonymous and aggregated: no child is shown on their own.',`<button class="chip" data-act="period" aria-haspopup="menu">${ic('calendar-days','s14')}${esc(S.usagePeriod)}${ic('chevron-down','s14')}</button>`+btn('Export CSV',{v:'outline',icon:'download',act:'exportAsk',disabled:e}));
 if(e)return shell('Usage',['Usage'],`${head}<div class="grid4">${stat('Scans per child','–','A week, on average')}${stat('Builds completed','–','Confirmed by a parent')}${stat('Came back','–','Of children who played')}${stat('Reached the daily limit','–','Of days played')}</div><div class="card">${empty('chart-column','No data yet','Numbers show here once the first family has played. Nothing is tracked about a single child.')}</div>`);
 const prog=(l,v,max)=>`<div class="col gap6"><div class="row between"><span>${l}</span><span class="m">${v}</span></div><div class="progressbar"><i style="width:${Math.round(parseFloat(v)/max*100)}%"></i></div></div>`;
 return shell('Usage',['Usage'],`${head}${S.usagePeriod!=='Last 7 days'?`<div class="note">${ic('info')}<span>Prototype: the numbers below are the 7-day figures from the design.</span></div>`:''}
 <div class="grid4">${stat('Scans per child','28','A week, on average','sparkles')}${stat('Builds completed','48','Confirmed by a parent','hammer')}${stat('Came back','75%','Of children who played last week','refresh-cw')}${stat('Reached the daily limit','9%','Of days played','clock')}</div>
 <div class="cols-wide"><div class="card pad col gap8"><div class="section-title">Scans per day</div>${bars(DAYS,4)}</div><div class="card pad col gap16"><div class="section-title">Learning content chosen</div>${prog('Videos','58%',100)}${prog('Quizzes','27%',100)}${prog('Audio stories','15%',100)}</div></div>
 <div class="cols-even"><div class="card pad col gap16"><div class="section-title">Most scanned</div>${[['Cardboard box',96],['Plastic bottle',81],['Tin can',64],['Bottle top',47]].map(([l,v])=>prog(l,v,96)).join('')}</div><div class="card pad col gap16"><div class="section-title">Most built</div>${[['Crayon Crew',11],['Plant Pal',8],['Desk Post',7],['Seed Library',6]].map(([l,v])=>prog(l,v,11)).join('')}</div></div>`)});
ACTIONS.period=(a,el)=>openMenu(['Today','Last 7 days','Last 30 days','Whole pilot'].map(x=>({label:x,on:S.usagePeriod===x,run:()=>{S.usagePeriod=x;render()}})),el);
let exp=[true,true,true,true,true];
const EXP=['Scans per day','Builds completed','Learn content chosen','Came back','Daily limit reached'];
ACTIONS.exportAsk=()=>dialog('export');
DIALOGS.export=()=>({title:'Export usage',desc:'A CSV file for 10 to 16 November.',body:`<div class="field"><span class="flabel">Period</span><span class="input" style="display:flex;align-items:center;background:var(--muted)">${esc(S.usagePeriod)}</span></div><div class="col gap4"><span class="flabel">Include</span>${EXP.map((x,i)=>cbox(x,exp[i],'expT',i)).join('')}</div><div class="note">${ic('shield-check')}<span>Totals per day only. No child, family code or photo is in the file.</span></div>`,
 actions:btn('Cancel',{v:'outline',act:'close'})+btn('Export CSV',{act:'export',disabled:!exp.some(Boolean)})});
ACTIONS.expT=i=>{exp[+i]=!exp[+i];dialog('export')};
ACTIONS.export=()=>{const days=['10 Nov','11 Nov','12 Nov','13 Nov','14 Nov','15 Nov','16 Nov'];const cols=['Day'];if(exp[0])cols.push('Scans');
 const rows=[cols.join(',')].concat(days.map((d,i)=>[d].concat(exp[0]?[DAYS[i]]:[]).join(',')));rows.push('');
 if(exp[1])rows.push('Builds completed (week),48');if(exp[2])rows.push('Learn content chosen (week),Videos 58% / Quizzes 27% / Audio stories 15%');if(exp[3])rows.push('Came back (week),75%');if(exp[4])rows.push('Reached the daily limit (week),9% of days played');
 const blob=new Blob([rows.join('\n')],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ecospark-usage-10-16-nov.csv';document.body.appendChild(a);a.click();a.remove();
 A.overlay=null;render();toast('ecospark-usage-10-16-nov.csv downloaded',{icon:'download'})};

/* ---------- Page not found (ST6) ---------- */
SCREENS['a/404']=()=>shell('',['Not found'],`<div class="card">${empty('search',"This page doesn't exist",'It may have moved, or the link is wrong.',btn('Go to Overview',{v:'outline',go:'a/overview'}))}</div>`);
})();
