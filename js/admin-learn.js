/* EcoSpark Admin · Learn (CL1 to CL8, AC1, AV2 to AV5, AQ1 to AQ3, QZ1 to QZ6, AS1, AS2, EL1, H8, H12 to H14) and Weekly themes (CW1, CW2, TH1, TH2, ET1) */
(function(){
const A=window.ADMIN;const {S,me,esc,ic,btn,ibtn,status,disc,phead,tabs,empty,field,toggle,cbox,radio,kv,val,go,later,dialog,sheet,close,toast,openMenu,render,shell,SCREENS,DIALOGS,SHEETS,ACTIONS}=A;
const lc=s=>s.charAt(0).toLowerCase()+s.slice(1);
const an=m=>(/^[aeiou]/i.test(m)?'an ':'a ')+lc(m);
const MATS=()=>Object.keys(S.paths);
const ST={live:'Live',draft:'Draft'};
const vidOf=m=>S.videos.find(v=>v.m===m&&!v.hidden&&!v.unlinked)||S.videos.find(v=>v.m===m&&!v.unlinked&&v.st);
function pathVideo(m){return S.paths[m]&&S.paths[m][0]?S.videos.find(v=>v.m===m&&v.inPath!==false&&!v.alt)||S.videos.find(v=>v.m===m):null}
const pathQuiz=m=>S.paths[m]&&S.paths[m][1]?S.quizzes.find(q=>q.m===m):null;
const pathStory=m=>S.paths[m]&&S.paths[m][2]?S.stories.find(q=>q.m===m):null;
const anyLearn=()=>S.videos.length+S.quizzes.length+S.stories.length>0;
const LT=[['Paths','a/learn'],['Videos','a/learn/videos'],['Quizzes','a/learn/quizzes'],['Audio stories','a/learn/stories']];
const SUB='Videos, quizzes and audio stories, in a 3-step path per material. A child sees the path after scanning that material.';

/* ---------- Learn lists ---------- */
SCREENS['a/learn']=tab=>A.withLoading('Learn','Learn',()=>{const t={videos:'Videos',quizzes:'Quizzes',stories:'Audio stories'}[tab]||'Paths';
 const head=phead('Learn',anyLearn()?SUB:'Videos, quizzes and audio stories, in a 3-step path per material.',btn('Add content',{act:'addContent'}));
 const q=(S.learnQ||'').toLowerCase();const ages=S.learnAges;
 const search=t==='Paths'?'':`<span class="spacer"></span><label class="search">${ic('search')}<input type="search" placeholder="Search ${lc(t)}" value="${esc(S.learnQ||'')}" data-onin="learnQ" aria-label="Search ${lc(t)}"></label>${t!=='Quizzes'?(ages?`<button class="chip on" data-act="learnAges">Ages: ${ages}<span class="x" data-act="clearLearnAges" role="button" aria-label="Clear the ages filter">${ic('x','s14')}</span></button>`:`<button class="chip" data-act="learnAges">${ic('funnel','s14')}Ages</button>`):''}`;
 const tb=`<div class="toolbar">${A.tabs(LT.map(([l,r])=>[l,r]),t)}${search}</div>`;
 if(!anyLearn())return shell('Learn',['Learn'],`${head}<div class="card" style="overflow:hidden">${tb}${empty('book-open','No Learn content yet','Start with a video about one material. Then add its quiz and audio story to make a path.',btn('Add a video',{act:'addVideo',arg:''}))}</div>`);
 const f=list=>list.filter(x=>(!q||(x.t+' '+x.m).toLowerCase().includes(q))&&(!ages||x.ages===ages));
 let table='';
 if(t==='Paths'){const cell=(m,i)=>{const st=S.paths[m][i];if(st)return status(ST[st]);if(i===1&&!S.paths[m][0])return '<span class="muted">Add the video first</span>';return `<button class="textlink" data-act="${['addVideo','addQuiz','addStory'][i]}" data-arg="${esc(m)}">${['Add video','Add quiz','Add story'][i]}</button>`};
  const inApp=m=>{const p=S.paths[m];const l=p.filter(x=>x==='live').length;return l===3?'Live':l?`${l} of 3 live`:'Coming soon'};
  table=`<table><thead><tr><th>Material</th><th>1 · What is it? (video)</th><th>2 · What does it become? (quiz)</th><th>3 · How it helps wildlife (story)</th><th>In the app</th><th></th></tr></thead><tbody>${MATS().map(m=>`<tr class="click" data-go="a/path/${esc(m)}" tabindex="0"><td><span class="mat"><span class="thumb" style="width:32px;height:32px">${ic('leaf','s14')}</span>${esc(m)}</span></td>${[0,1,2].map(i=>`<td>${cell(m,i)}</td>`).join('')}<td class="${inApp(m)==='Coming soon'?'muted':''}">${inApp(m)}</td><td class="more">${ic('chevron-right')}</td></tr>`).join('')}</tbody></table>`}
 else if(t==='Videos'){const l=f(S.videos.filter(v=>!v.hidden));table=l.length?`<table><thead><tr><th>Video</th><th>Material</th><th>Ages</th><th>Length</th><th>Used in</th><th>Status</th></tr></thead><tbody>${l.map(v=>`<tr class="click" data-go="a/video/${esc(v.t)}" tabindex="0"><td><span class="mat"><span class="thumb" style="width:40px;height:32px">${ic('play','s14')}</span>${esc(v.t)}</span></td><td>${esc(v.m)}</td><td>${v.ages}</td><td>${v.len}</td><td class="${usedIn(v)?'':'muted'}">${usedIn(v)||'Not in a path yet'}</td><td>${status(ST[v.st])}</td></tr>`).join('')}</tbody></table>`:noMatch()}
 else if(t==='Quizzes'){const l=f(S.quizzes.map(x=>Object.assign({ages:'5 to 8'},x)));table=l.length?`<table><thead><tr><th>Quiz</th><th>Material</th><th>Questions</th><th>Made from</th><th>Status</th></tr></thead><tbody>${l.map(x=>`<tr class="click" data-go="a/quiz/${esc(x.t)}" tabindex="0"><td class="name">${esc(x.t)}</td><td>${esc(x.m)}</td><td>${x.qs?x.qs.length:x.n}</td><td>${esc(x.from)}</td><td>${status(ST[x.st])}</td></tr>`).join('')}</tbody></table>`:noMatch()}
 else{const l=f(S.stories);table=l.length?`<table><thead><tr><th>Audio story</th><th>Material</th><th>Ages</th><th>Length</th><th>Status</th></tr></thead><tbody>${l.map(x=>`<tr class="click" data-go="a/story/${esc(x.t)}" tabindex="0"><td><span class="mat"><span class="thumb" style="width:40px;height:32px">${ic('headphones','s14')}</span>${esc(x.t)}</span></td><td>${esc(x.m)}</td><td>${x.ages}</td><td>${x.len}</td><td>${status(ST[x.st])}</td></tr>`).join('')}</tbody></table>`:noMatch()}
 return shell('Learn',['Learn'],`${head}<div class="card" style="overflow:hidden">${tb}${table}</div>`)});
function noMatch(){return S.learnQ||S.learnAges?empty('search','Nothing matches',`Try another word, or clear the filters.`,btn('Clear filters',{v:'outline',act:'clearLearn'})):empty('book-open','Nothing here yet','Add content to start a path.',btn('Add content',{act:'addContent'}))}
function usedIn(v){const m=S.paths[v.m];return m&&m[0]&&pathVideo(v.m)===v?`${v.m} path`:''}
ACTIONS.learnQ=v=>{S.learnQ=v;clearTimeout(window._lq);window._lq=setTimeout(()=>{render();const i=document.querySelector('[data-onin="learnQ"]');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}},200)};
ACTIONS.learnAges=(a,el,e)=>{if(e.target.closest('.x'))return;openMenu(['5 to 8','9 to 12'].map(x=>({label:x,on:S.learnAges===x,run:()=>{S.learnAges=S.learnAges===x?null:x;render()}})),el,'Ages')};
ACTIONS.clearLearnAges=(a,el,e)=>{e.stopPropagation();S.learnAges=null;render()};
ACTIONS.clearLearn=()=>{S.learnQ='';S.learnAges=null;render()};

/* Add content (AC1) */
let ac={type:'Video',m:'Egg box',err:null};
ACTIONS.addContent=()=>{ac={type:'Video',m:MATS().find(m=>!S.paths[m][0])||'Egg box',err:null};dialog('addContent')};
DIALOGS.addContent=()=>({title:'What do you want to add?',desc:'Each material has a 3-step path: a video, a quiz made from it, and an audio story.',wide:true,
 body:`<div class="typecards" role="radiogroup">${[['Video','video','Step 1: what it is'],['Quiz','list-checks','Step 2: made from the video'],['Audio story','headphones','Step 3: how it helps wildlife']].map(([t,i,d])=>`<button class="typecard ${ac.type===t?'on':''}" data-act="acType" data-arg="${t}" role="radio" aria-checked="${ac.type===t}"><span class="row between">${ic(i,'s20')}<span class="radio ${ac.type===t?'on':''}"></span></span><span class="m">${t}</span><span class="sub">${d}</span></button>`).join('')}</div>${field('Material',ac.m,{id:'ac-m',options:MATS(),err:ac.err})}`,
 actions:btn('Cancel',{v:'outline',act:'close'})+btn('Continue',{act:'acGo'})});
ACTIONS.acType=t=>{ac.m=val('ac-m')||ac.m;ac.type=t;ac.err=null;dialog('addContent')};
ACTIONS.acGo=()=>{const m=val('ac-m');ac.m=m;if(ac.type==='Video')return ACTIONS.addVideo(m);if(ac.type==='Audio story')return ACTIONS.addStory(m);
 if(!S.videos.some(v=>v.m===m)){ac.err=`Add the ${lc(m)} video first. The quiz is made from it.`;dialog('addContent');return}
 if(S.paths[m][1]){ac.err=`${m} already has a quiz. Open its path to change it.`;dialog('addContent');return}
 A.overlay=null;go('a/new-quiz/'+m)};

/* Add a video (CL4, AV2) and an audio story (AS1) */
let up=null;
function newUpload(kind,m){up={kind,m:m||'Egg box',prog:null,file:'',title:'',ages:'5 to 8',text:'',err:null}}
ACTIONS.addVideo=m=>{newUpload('video',m||MATS().find(x=>!S.paths[x][0])||'Egg box');up.title='What is '+an(up.m)+'?';dialog('upload')};
ACTIONS.addStory=m=>{newUpload('story',m||'Egg box');dialog('upload')};
DIALOGS.upload=()=>{const v=up.kind==='video';const done=up.file&&up.prog==null;
 const zone=up.prog!=null?`<div class="drop"><span class="ph">${ic(v?'file-video':'file-audio')}</span><div class="col grow"><span class="m">${esc(up.fname)}</span><span class="muted t-xs">${v?'48 MB · 1:35':'3 MB · 2:20'} · ${up.prog}% uploaded</span><div class="progress"><i style="width:${up.prog}%"></i></div></div><button class="rowmenu" data-act="upCancel" aria-label="Cancel upload">${ic('x')}</button></div>`
  :done?`<div class="drop filled"><span class="ph">${ic(v?'file-video':'file-audio')}</span><div class="col grow"><span class="m">${esc(up.fname)}</span><span class="muted t-xs">${v?'48 MB · 1:35':'2:20'} · uploaded</span></div>${btn('Replace',{v:'ghost',sm:true,act:'upStart'})}</div>`
  :`<button class="dropzone" data-act="upStart">${ic('upload','s20')}<span class="m">${v?'Drop an MP4 here, or browse':'Drop an MP3 here, or browse'}</span><span class="muted t-xs">${v?'Up to 3 minutes. Captions are needed for read-aloud.':'Up to 4 minutes. Add the story text for read-aloud.'}</span></button>`;
 return {title:v?'Add a video':'Add an audio story',desc:v?'One short video per material. The quiz is made from it.':'Step 3 of a path: how the material helps wildlife.',
  body:`${zone}${up.err==='file'?`<p class="t-xs" style="color:var(--red-700)" role="alert">Upload the ${v?'video':'audio'} file first.</p>`:''}${field('Title',up.title,{id:'up-title',ph:v?'What is an egg box?':'The egg box and the blackbird',err:up.err==='title'?'Give it a title.':''})}<div class="grid2">${field('Material',up.m,{id:'up-m',options:MATS()})}${field('Ages',up.ages,{id:'up-ages',options:['5 to 8','9 to 12']})}</div>${field(v?'Captions':'Story text',up.text,{id:'up-text',textarea:true,ph:v?'An egg box keeps eggs safe. It is made of card…':'A blackbird found a cosy nest box made from an egg box…'})}`,
  actions:btn('Cancel',{v:'outline',act:'upClose'})+btn('Save as draft',{v:up.prog!=null?'secondary':'primary',act:'upSave'})}};
function upRead(){['title','m','ages','text'].forEach(k=>{const e=document.getElementById('up-'+k);if(e)up[k]=e.value})}
ACTIONS.upStart=()=>{upRead();up.err=null;up.fname=up.kind==='video'?lc(up.title||'video').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'.mp4':'egg-box-and-the-blackbird.mp3';up.prog=0;dialog('upload');
 const tick=()=>{if(!up||up.prog==null)return;up.prog=Math.min(100,up.prog+(up.kind==='video'?8:20));if(up.prog>=100){up.prog=null;up.file=up.fname}if(A.overlay&&A.overlay.name==='upload'){upRead();dialog('upload')}if(up.prog!=null)setTimeout(tick,180)};setTimeout(tick,180)};
ACTIONS.upCancel=()=>{up.prog=null;up.file='';upRead();dialog('upload')};
ACTIONS.upClose=()=>{if(up)up.prog=null;close()};
ACTIONS.upSave=()=>{upRead();if(up.prog!=null){toast('Wait for the upload to finish',{icon:'info'});return}if(!up.file){up.err='file';dialog('upload');return}if(!up.title.trim()){up.err='title';dialog('upload');return}
 const m=up.m;const step=up.kind==='video'?0:2;
 if(up.kind==='video'){S.videos=S.videos.filter(v=>!(v.m===m&&v.unlinked));S.videos.unshift({t:up.title.trim(),m,ages:up.ages,len:'1:35',st:'draft',file:up.file+' · 48 MB',cap:up.text})}
 else S.stories.unshift({t:up.title.trim(),m,ages:up.ages,len:'2:20',st:'draft',file:up.file+' · 3 MB',text:up.text});
 if(!S.paths[m][step])S.paths[m][step]='draft';
 const kind=up.kind;up=null;A.overlay=null;
 if(kind==='video'){go('a/path/'+m);toast('Video saved as draft')}else{go('a/learn/stories');toast('Audio story saved as draft')}};

/* ---------- Path (CL2, CL7, AV3 to AV5, H14) ---------- */
SCREENS['a/path']=m=>{const p=S.paths[m];if(!p)return SCREENS['a/404']();
 const v=pathVideo(m),q=pathQuiz(m),s=pathStory(m);const live=p.filter(x=>x==='live').length;const firstDraft=p.findIndex(x=>x==='draft');
 const sub=!p.some(Boolean)?'Nothing here yet. In the app, children see "Videos are coming soon".':
  live===3?`Shown after a child scans ${an(m)}. Finishing all 3 makes them a "${m} expert".`:
  p[0]==='draft'?'Step 1 is a draft. Children still see "Videos are coming soon".':
  live?`Step${live>1?'s':''} ${p.map((x,i)=>x==='live'?i+1:0).filter(Boolean).join(' and ')} ${live>1?'are':'is'} live. Children see "coming soon" for the rest.`:`Shown after a child scans ${an(m)}.`;
 const acts=(live?btn('Preview in the app',{v:'outline',act:'previewPath',arg:m}):'')+(firstDraft>=0?btn(`Publish step ${firstDraft+1}`,{act:'pubStepAsk',arg:m+'|'+firstDraft}):'');
 const step=(i,label,item,kind)=>{const st=p[i];const title=['Step 1 · What is it?','Step 2 · What does it become?','Step 3 · How it helps wildlife'][i];
  if(item&&st){const meta=i===0?`Video · ${item.len} · ages ${item.ages}`:i===1?`Quiz · ${item.qs?item.qs.length:item.n} questions · made from the video`:`Audio story · ${item.len} · read aloud`;
   const href=i===0?'a/video/'+item.t:i===1?'a/quiz/'+item.t:'a/story/'+item.t;
   return `<div class="card pad row gap16">${disc(['play','list-checks','headphones'][i],st==='live'?'primary':'warning')}<div class="col grow"><span class="t-xs muted m">${title}</span><a href="#${esc(href)}" data-go="${esc(href)}" class="m">${esc(item.t)}</a><span class="muted t-sm">${meta}</span></div>${status(ST[st])}${btn('Change',{v:'outline',sm:true,act:i===0?'changeVideo':'openItem',arg:i===0?m:href})}</div>`}
  const add=[['Add a video','Upload a short video about this material.','Add video','addVideo'],['Add a quiz',v?`Made from "${v.t}"`:'Add the video first. The quiz is made from it.','Add quiz','addQuiz'],['Add an audio story','A short story children can listen to.','Add story','addStory']][i];
  return `<div class="card pad row gap16">${disc(['play','list-checks','headphones'][i],'neutral')}<div class="col grow"><span class="t-xs muted m">${title}</span><span class="m">${add[0]}</span><span class="muted t-sm">${esc(add[1])}</span></div>${btn(add[2],{v:i===1&&v?'primary':i===1?'secondary':'outline',sm:true,act:add[3],arg:m})}</div>`};
 const side=m==='Tin can'&&live===3?`<div class="card pad col gap12"><span class="section-title">This week</span>${[['Started the path','41'],['Finished all 3','17'],['Quiz right first time','82%']].map(([a,b])=>`<div class="row between"><span class="muted">${a}</span><span class="m">${b}</span></div>`).join('')}<p class="t-xs muted">All children together. No child is shown on their own.</p></div>`:'';
 return shell('Learn',[['Learn','a/learn'],m],`${phead(m,sub,acts)}<div class="cols-main"><div class="col gap12">${step(0,'',v)}${step(1,'',q)}${step(2,'',s)}</div><div class="col gap16">${side}<div class="card pad col gap8"><span class="section-title">Sparks</span><p class="muted">Each step earns sparks once. Watching again is fine, with no sparks.</p></div></div></div>`)};
ACTIONS.openItem=h=>go(h);
ACTIONS.addQuiz=m=>{if(!S.paths[m][0]){toast(`Add the ${lc(m)} video first. The quiz is made from it.`,{icon:'info'});return}go('a/new-quiz/'+m)};
ACTIONS.pubStepAsk=a=>dialog('pubStep',a);
DIALOGS.pubStep=a=>{const [m,i]=a.split('|');const it=[pathVideo(m),pathQuiz(m),pathStory(m)][+i];const rest=[0,1,2].filter(k=>k!==+i&&S.paths[m][k]!=='live').map(k=>k+1);
 return {title:`Publish "${it.t}"?`,desc:`Children who scan ${an(m)} will see step ${+i+1} of the path.${rest.length?` Step${rest.length>1?'s':''} ${rest.join(' and ')} say${rest.length>1?'':'s'} "coming soon".`:''}`,actions:btn('Cancel',{v:'outline',act:'close'})+btn('Publish',{act:'pubStep',arg:a})}};
ACTIONS.pubStep=a=>{const [m,i]=a.split('|');S.paths[m][+i]='live';const it=[pathVideo(m),pathQuiz(m),pathStory(m)][+i];if(it)it.st='live';A.overlay=null;render();toast(`Step ${+i+1} is live`)};
let chosen=null;
ACTIONS.changeVideo=m=>{chosen=pathVideo(m).t;dialog('changeVideo',m)};
DIALOGS.changeVideo=m=>{const list=S.videos.filter(v=>v.m===m);return {title:'Change the video for step 1',desc:`Pick another ${m} video, or add a new one. The quiz stays linked to the path.`,
 body:`<div class="col gap8" role="radiogroup">${list.map(v=>radio(v.t,`${m} · ${v.len} · ${v.st}`,chosen===v.t,'pickVideo',m+'|'+v.t)).join('')}</div><div>${btn('Add a new video',{v:'outline',icon:'plus',act:'addVideo',arg:m})}</div>`,actions:btn('Cancel',{v:'outline',act:'close'})+btn('Use this video',{act:'useVideo',arg:m})}};
ACTIONS.pickVideo=a=>{chosen=a.split('|').slice(1).join('|');dialog('changeVideo',a.split('|')[0])};
ACTIONS.useVideo=m=>{const v=S.videos.find(x=>x.t===chosen);const cur=pathVideo(m);if(v&&cur&&v!==cur){const i=S.videos.indexOf(v);S.videos.splice(i,1);S.videos.splice(S.videos.indexOf(cur),0,v);v.hidden=false;S.paths[m][0]=v.st==='live'?'live':'draft'}A.overlay=null;render();toast(v===cur?'No change':`Step 1 now uses "${v.t}"`,{icon:v===cur?'info':'circle-check'})};
ACTIONS.previewPath=m=>{const q=pathQuiz(m);if(q&&q.qs)window.openQuizPreview(q,0);else toast('The preview shows quizzes with their questions. Open a quiz to preview it.',{icon:'info'})};

/* ---------- Video and story pages (H12, H13) ---------- */
function mediaPage(kind,t){const list=kind==='video'?S.videos:S.stories;const it=list.find(x=>x.t===t);if(!it)return SCREENS['a/404']();
 const v=kind==='video';const inPath=S.paths[it.m]&&(v?pathVideo(it.m)===it:pathStory(it.m)===it);
 const sub=`${v?'Video':'Audio story'} · ${it.len} · ${it.st==='live'?'live':'draft'}${v&&it.t==='What is a tin can?'?' · watched 41 times this week':''}`;
 return shell('Learn',[['Learn','a/learn'],[v?'Videos':'Audio stories',v?'a/learn/videos':'a/learn/stories'],it.t],`${phead(it.t,esc(sub),(it.st==='live'?btn('Move to drafts',{v:'outline',act:'mediaDraft',arg:kind+'|'+t}):btn('Publish',{v:'outline',act:'mediaLive',arg:kind+'|'+t}))+btn('Save changes',{act:'mediaSave',arg:kind+'|'+t,disabled:S.offline}))}
 <div class="cols-even"><div class="card pad col gap16"><div class="photo shown" style="height:220px">${ic(v?'play':'headphones','s24')}</div><div class="row gap12"><span class="grow muted">${esc(it.file||(lc(it.t).replace(/[^a-z0-9]+/g,'-')+(v?'.mp4':'.mp3')))}</span>${btn('Replace file',{v:'outline',sm:true,icon:'upload',act:'replaceFile'})}</div></div>
 <div class="card pad col gap16" data-form="media">${field('Title',it.t,{id:'md-title'})}<div class="grid2">${field('Material',it.m,{id:'md-m',options:MATS()})}${field('Ages',it.ages,{id:'md-ages',options:['5 to 8','9 to 12']})}</div>${field(v?'Captions':'Story text',v?(it.cap||''):(it.text||''),{id:'md-text',textarea:true,rows:4})}
  ${inPath?`<div class="blk row between"><span>Step ${v?1:3} of the ${esc(it.m)} path</span><a href="#a/path/${esc(it.m)}" data-go="a/path/${esc(it.m)}" class="textlink">Open path</a></div>`:`<div class="blk row between"><span class="muted">Not in a path yet</span><a href="#a/path/${esc(it.m)}" data-go="a/path/${esc(it.m)}" class="textlink">Open the ${esc(it.m)} path</a></div>`}</div></div>`)}
SCREENS['a/video']=t=>mediaPage('video',t);
SCREENS['a/story']=t=>mediaPage('story',t);
document.addEventListener('input',e=>{if(e.target.closest('[data-form="media"]')){A.dirty=A.cur();window.DIRTY_DESC='You changed this item. If you leave now, the change is lost.'}});
ACTIONS.replaceFile=()=>toast('New file uploaded. Save to use it.',{icon:'upload'});
function mediaItem(a){const [k,t]=a.split('|');return [(k==='video'?S.videos:S.stories).find(x=>x.t===t),k]}
ACTIONS.mediaSave=a=>{const [it,k]=mediaItem(a);const nt=val('md-title').trim();if(!nt){toast('Give it a title',{icon:'circle-alert'});return}it.t=nt;it.ages=val('md-ages');if(k==='video')it.cap=val('md-text');else it.text=val('md-text');A.dirty=null;go(`a/${k}/${nt}`,{replace:true,force:true});toast(it.st==='live'?'Changes saved. Children see them now.':'Changes saved')};
ACTIONS.mediaDraft=a=>{const [it,k]=mediaItem(a);it.st='draft';const i=k==='video'?0:2;if(S.paths[it.m]&&S.paths[it.m][i]==='live')S.paths[it.m][i]='draft';A.dirty=null;render();toast(`"${it.t}" moved to drafts. Step ${i+1} of the ${it.m} path says "coming soon".`,{undo:()=>{it.st='live';if(S.paths[it.m])S.paths[it.m][i]='live';render()}})};
ACTIONS.mediaLive=a=>{const [it,k]=mediaItem(a);it.st='live';const i=k==='video'?0:2;if(S.paths[it.m]&&S.paths[it.m][i])S.paths[it.m][i]='live';A.dirty=null;render();toast(`"${it.t}" is live`)};

/* ---------- Quiz (CL5, H8) ---------- */
SCREENS['a/quiz']=t=>{const q=S.quizzes.find(x=>x.t===t);if(!q)return SCREENS['a/404']();
 if(!q.qs)q.qs=[[`What can ${an(q.m)} become?`,['Something new','Rubbish'],0],[`What do you do first?`,['Rinse it','Throw it away'],0],['Who helps with sharp bits?',['A grown-up','Nobody'],0]];
 return shell('Learn',[['Learn','a/learn'],['Quizzes','a/learn/quizzes'],q.t],`${phead(q.t,`Quiz · step 2 of the ${esc(q.m)} path · made from "${esc(q.from)}"`,btn('Preview in the app',{v:'outline',act:'quizPreview',arg:t})+btn('Save changes',{act:'quizSave',arg:t,disabled:S.offline}))}
 <div class="col gap12" data-form="quiz">${q.qs.map(([qq,ans,r],i)=>`<div class="card pad col gap12"><div class="row gap8"><span class="t-xs muted m">Question ${i+1}</span></div><input class="input m" id="qq-${i}" value="${esc(qq)}" aria-label="Question ${i+1}"><div class="grid2">${ans.map((a,k)=>`<div class="option ${r===k?'on':''}"><span class="thumb" style="width:48px;height:40px">${ic('image')}</span><input class="input" id="qa-${i}-${k}" value="${esc(a)}" aria-label="Answer ${k+1}" style="border:0;box-shadow:none;background:transparent;padding:0"><button class="row gap6 t-xs m" data-act="quizRight" data-arg="${t}|${i}|${k}" role="radio" aria-checked="${r===k}" style="white-space:nowrap"><span class="radio ${r===k?'on':''}"></span>Right answer</button></div>`).join('')}</div></div>`).join('')}
 <p class="muted t-sm">Two picture answers per question, read aloud for ages 5 to 8. The right answer has a green border. Same quiz as in the kid app.</p></div>`)};
function quizRead(q){q.qs.forEach((x,i)=>{const e=document.getElementById('qq-'+i);if(e){x[0]=e.value;x[1]=[val(`qa-${i}-0`),val(`qa-${i}-1`)]}})}
document.addEventListener('input',e=>{if(e.target.closest('[data-form="quiz"]')){A.dirty=A.cur();window.DIRTY_DESC='You changed this quiz. If you leave now, the change is lost.'}});
ACTIONS.quizRight=a=>{const [t,i,k]=a.split('|');const q=S.quizzes.find(x=>x.t===t);quizRead(q);q.qs[+i][2]=+k;A.dirty=A.cur();render()};
ACTIONS.quizSave=t=>{const q=S.quizzes.find(x=>x.t===t);quizRead(q);if(q.qs.some(x=>!x[0].trim()||x[1].some(a=>!a.trim()))){toast('Every question needs its text and 2 answers',{icon:'circle-alert'});return}A.dirty=null;render();toast(q.st==='live'?'Changes saved. Children see them now.':'Changes saved')};
ACTIONS.quizPreview=t=>{const q=S.quizzes.find(x=>x.t===t);quizRead(q);window.openQuizPreview(q,0)};

/* ---------- New quiz (AQ1 to AQ3, QZ1 to QZ6) ---------- */
function nqNew(m){return {m,from:(S.videos.find(v=>v.m===m)||{}).t||'',qs:[],ed:null,touched:false}}
SCREENS['a/new-quiz']=m=>{if(!S.paths[m])return SCREENS['a/404']();if(!S.nq||S.nq.m!==m)S.nq=nqNew(m);const nq=S.nq;const title=`What does ${an(m)} become?`;
 const head=phead(title,`New quiz · step 2 of the ${esc(m)} path · draft`,btn('Cancel',{v:'ghost',act:'nqCancel'})+btn('Save draft',{v:'outline',act:'nqSave',arg:'draft',disabled:S.offline})+btn('Publish',{act:'nqSave',arg:'live',disabled:S.offline}));
 const vids=S.videos.filter(v=>v.m===m).map(v=>v.t);
 const made=`<div style="max-width:420px">${field('Made from',nq.from,{id:'nq-from',options:vids.length?vids:['No video yet']})}</div>`;
 const ed=nq.ed;
 const list=nq.qs.map((x,i)=>`<div class="card pad row gap16"><div class="col grow"><span class="t-xs muted m">Question ${i+1}</span><span class="m">${esc(x.q)}</span></div><span class="muted t-sm">2 answers</span>${status(x.right==null?'No right answer':'Right answer set',x.right==null?'warning':'success')}<button class="rowmenu" data-act="nqMenu" data-arg="${i}" aria-label="More for question ${i+1}" aria-haspopup="menu">${ic('ellipsis')}</button></div>`).join('');
 const editor=ed?`<div class="card pad col gap16"><span class="section-title">${ed.i==null?`New question ${nq.qs.length+1}`:`Question ${ed.i+1}`}</span>${field('',ed.q,{id:'nq-q',ph:'Type the question. It is read aloud.',err:ed.err==='q'?'Type the question.':''})}
  <div class="grid2">${[0,1].map(k=>`<div class="option ${ed.right===k?'on':''}" style="align-items:stretch"><button class="thumb" style="width:72px;height:64px;flex-direction:column;gap:2px;font-size:11px" data-act="nqPic" data-arg="${k}" aria-label="Add a picture for answer ${k+1}">${ed.pics[k]?`<span style="color:var(--primary)">${ic('image','s20')}</span><span class="m" style="color:var(--foreground)">${esc(ed.pics[k])}</span>`:`${ic('image','s18')}<span>Add a picture</span>`}</button><div class="col gap8 grow"><input class="input" id="nq-a${k}" value="${esc(ed.ans[k])}" placeholder="Answer" aria-label="Answer ${k+1}"><button class="row gap6 t-xs m" data-act="nqRight" data-arg="${k}" role="radio" aria-checked="${ed.right===k}"><span class="radio ${ed.right===k?'on':''}"></span>Right answer</button></div></div>`).join('')}</div>
  ${ed.err==='ans'?'<p class="t-xs" style="color:var(--red-700)" role="alert">Write both answers.</p>':ed.err==='right'?'<p class="t-xs" style="color:var(--red-700)" role="alert">Pick the right answer before you save.</p>':''}
  <div class="row gap8" style="justify-content:flex-end">${btn('Cancel',{v:'ghost',act:'nqEdCancel'})}${btn('Save question',{act:'nqEdSave'})}</div></div>`:'';
 const body=!nq.qs.length&&!ed?`<div class="card">${empty('list-checks','No questions yet','Write 3 short questions about the video. Each has 2 picture answers and one right answer.',btn('Add the first question',{icon:'plus',act:'nqAdd'}))}</div>`
  :`${list}${editor}${!ed?`<div class="row gap12">${nq.qs.length<5?btn('Add question',{v:'outline',icon:'plus',act:'nqAdd'}):''}<span class="muted t-sm">${nq.qs.length} of 3 questions. 3 questions is best for ages 5 to 8.</span></div>`:''}${nq.err?`<div class="note err">${ic('circle-alert')}<span>${esc(nq.err)}</span></div>`:''}`;
 return shell('Learn',[['Learn','a/learn'],['Quizzes','a/learn/quizzes'],'New quiz'],head+made+`<div class="col gap12">${body}</div>`)};
function nqRead(){const nq=S.nq;const f=document.getElementById('nq-from');if(f)nq.from=f.value;if(nq.ed){const q=document.getElementById('nq-q');if(q){nq.ed.q=q.value;nq.ed.ans=[val('nq-a0'),val('nq-a1')]}}}
document.addEventListener('input',e=>{if(A.cur().startsWith('a/new-quiz')&&e.target.closest('.content')){S.nq.touched=true;A.dirty=A.cur();window.DIRTY_DESC='This quiz is not saved yet. If you leave now, it is lost. Save it as a draft to keep it.'}});
ACTIONS.nqAdd=()=>{nqRead();S.nq.err=null;S.nq.ed={i:null,q:'',ans:['',''],right:null,pics:['','']};S.nq.touched=true;A.dirty=A.cur();render();later(0,()=>{const q=document.getElementById('nq-q');if(q)q.focus()})};
ACTIONS.nqRight=k=>{nqRead();S.nq.ed.right=+k;S.nq.ed.err=null;render()};
ACTIONS.nqEdCancel=()=>{S.nq.ed=null;render()};
ACTIONS.nqEdSave=()=>{nqRead();const ed=S.nq.ed;ed.err=!ed.q.trim()?'q':ed.ans.some(a=>!a.trim())?'ans':ed.right==null?'right':null;if(ed.err){render();return}
 const item={q:ed.q.trim(),ans:ed.ans.map(a=>a.trim()),right:ed.right,pics:ed.pics.slice()};const n=ed.i==null?S.nq.qs.push(item):(S.nq.qs[ed.i]=item,ed.i+1);S.nq.ed=null;S.nq.err=null;render();toast(`Question ${n} saved`)};
ACTIONS.nqMenu=(i,el)=>{i=+i;openMenu([{label:'Edit',icon:'pencil',run:()=>{nqRead();const x=S.nq.qs[i];S.nq.ed={i,q:x.q,ans:x.ans.slice(),right:x.right,pics:x.pics.slice()};render()}},{label:'Delete question',icon:'trash-2',danger:true,run:()=>dialog('nqDel',i)}],el)};
DIALOGS.nqDel=i=>({title:`Delete question ${i+1}?`,desc:`"${esc(S.nq.qs[i].q)}" and its 2 answers are deleted.`,actions:btn('Cancel',{v:'outline',act:'close'})+btn('Delete question',{v:'destructive',act:'nqDel',arg:i})});
ACTIONS.nqDel=i=>{S.nq.qs.splice(+i,1);A.overlay=null;render();toast('Question deleted',{icon:'trash-2'})};
let picFor=0,picSel=null;
ACTIONS.nqPic=k=>{nqRead();picFor=+k;picSel=S.nq.ed.pics[picFor]||null;dialog('pic')};
DIALOGS.pic=()=>{const a=S.nq.ed.ans[picFor]||`answer ${picFor+1}`;return {title:`Picture for "${a}"`,desc:'Answers show as pictures for ages 5 to 8.',
 body:`<button class="dropzone" data-act="picUpload">${ic('upload','s20')}<span class="m">Upload your own PNG, or pick one from the build pictures</span></button><div class="grid4" role="radiogroup">${['Seed tray','Egg box','Plant pot','Seedlings'].map(p=>`<button class="typecard ${picSel===p?'on':''}" data-act="picPick" data-arg="${p}" role="radio" aria-checked="${picSel===p}" style="align-items:center"><span class="thumb" style="width:100%;height:56px">${ic(p==='Egg box'?'leaf':'sprout','s20')}</span><span class="t-xs m">${p}</span></button>`).join('')}</div>`,
 actions:btn('Cancel',{v:'outline',act:'close'})+btn('Use picture',{act:'picUse',disabled:!picSel})}};
ACTIONS.picPick=p=>{picSel=p;dialog('pic')};
ACTIONS.picUpload=()=>{picSel='My picture.png';dialog('pic');toast('Picture uploaded',{icon:'image'})};
ACTIONS.picUse=()=>{S.nq.ed.pics[picFor]=picSel;A.overlay=null;render()};
ACTIONS.nqSave=st=>{nqRead();const nq=S.nq;if(nq.ed){toast('Save or cancel the question first',{icon:'info'});return}
 if(st==='live'){if(!nq.qs.length){nq.err='Add at least one question before you publish.';render();return}const bad=nq.qs.findIndex(x=>x.right==null);if(bad>=0){nq.err=`Question ${bad+1}: pick the right answer before you publish.`;render();return}}
 if(!nq.from||nq.from==='No video yet'){nq.err='Add the video first. The quiz is made from it.';render();return}
 const m=nq.m;const q={t:`What does ${an(m)} become?`,m,from:nq.from,st,qs:nq.qs.map(x=>[x.q,x.ans,x.right==null?0:x.right]),pics:{}};nq.qs.forEach(x=>x.pics.forEach((p,k)=>{if(p)q.pics[x.q+'|'+k]=p==='Egg box'?'Material/Egg box':'Build/Plant Pal'}));
 S.quizzes=S.quizzes.filter(x=>x.m!==m);S.quizzes.unshift(q);S.paths[m][1]=st;S.nq=null;A.dirty=null;go('a/learn/quizzes',{force:true});toast(st==='live'?'Quiz published. Step 2 is live.':'Quiz saved as draft')};
ACTIONS.nqCancel=()=>{nqRead();const m=S.nq.m;if(S.nq.touched){A.dirty=A.cur();window.DIRTY_DESC='This quiz is not saved yet. If you leave now, it is lost. Save it as a draft to keep it.'}go('a/path/'+m)};
const leave1=ACTIONS.leaveAnyway;ACTIONS.leaveAnyway=t=>{if(A.cur().startsWith('a/new-quiz'))S.nq=null;leave1(t)};

/* ---------- Weekly themes (CW1, CW2, ET1, TH1, TH2) ---------- */
SCREENS['a/themes']=tab=>A.withLoading('Weekly themes','Weekly themes',()=>{const past=tab==='past';th=null;
 if(!S.themes.length&&!S.pastThemes.length)return shell('Weekly themes',['Weekly themes'],`${phead('Weekly themes','One UK-season theme a week for the child\'s home.',btn('Add theme',{go:'a/new-theme'}))}<div class="card">${empty('calendar','No themes yet','Plan a week: pick the featured builds, a lesson and the Garden visitor.',btn('Add theme',{go:'a/new-theme'}))}</div>`);
 const list=past?S.pastThemes:S.themes;
 return shell('Weekly themes',['Weekly themes'],`${phead('Weekly themes',"One UK-season theme a week. It picks the featured builds, a lesson and the Garden visitor on the child's home.",btn('Add theme',{go:'a/new-theme'}))}
 <div class="card" style="overflow:hidden"><div class="toolbar">${tabs([['Upcoming','a/themes'],['Past','a/themes/past']],past?'Past':'Upcoming')}</div>
 ${list.length?`<table><thead><tr><th>Week</th><th>Theme</th><th>Featured builds</th><th>Lesson</th><th>Visitor</th><th>Status</th><th></th></tr></thead><tbody>${list.map((t,i)=>`<tr class="${past?'':'click'}" ${past?'':`data-go="a/theme/${i}" tabindex="0"`}><td class="muted">${esc(t.w)}</td><td class="name">${esc(t.n)}</td><td>${esc(t.b.join(', '))}</td><td>${esc(t.l)}</td><td>${esc(t.v)}</td><td>${status(t.st)}</td><td class="more">${past?'':ic('chevron-right')}</td></tr>`).join('')}</tbody></table>`:empty('calendar',past?'No past themes yet':'Nothing planned','Add a theme for the coming weeks.','')}</div>`)});
const VISITORS=['Robin','Hedgehog','Bee','Butterfly'];
const WEEKS=['14 to 20 Dec','21 to 27 Dec','28 Dec to 3 Jan','4 to 10 Jan'];
let th=null;
function themeForm(i){const ex=i!=null?S.themes[i]:null;if(!th||th.i!==i)th=ex?{i,w:ex.w,n:ex.n,b:ex.b.slice(),l:ex.l,v:ex.v,st:ex.st}:{i:null,w:WEEKS.find(w=>!S.themes.some(t=>t.w===w))||WEEKS[0],n:'',b:[],l:Object.keys(S.paths).find(m=>S.paths[m].some(x=>x==='live'))||'Tin can',v:'Robin',st:'Draft'};
 const lessons=Object.keys(S.paths).filter(m=>S.paths[m].some(Boolean));
 const head=phead(ex?ex.n:'New theme',"Shown on the child's home for one week.",btn('Cancel',{v:'ghost',go:'a/themes'})+btn('Save draft',{v:'outline',act:'thSave',arg:'Draft'})+btn(ex&&ex.st==='This week'?'Save changes':'Schedule',{act:'thSave',arg:ex&&ex.st==='This week'?'This week':'Scheduled'}));
 const b=th.b;
 return shell('Weekly themes',[['Weekly themes','a/themes'],ex?ex.n:'New theme'],`${head}<div class="cols-wide"><div class="card pad col gap16" data-form="theme">
  <div class="grid2">${ex?`<div class="field"><span class="flabel">Week</span><span class="input" style="display:flex;align-items:center;background:var(--muted)">${esc(th.w)}</span></div>`:field('Week',th.w,{id:'th-w',options:WEEKS.filter(w=>!S.themes.some(t=>t.w===w))})}${field('Name',th.n,{id:'th-n',ph:'For example, Winter warmers',err:th.err==='n'?'Give the theme a name.':''})}</div>
  <div class="col gap8"><span class="flabel">Featured builds</span><div class="row gap8 wrap">${b.map((x,k)=>`<span class="chip">${esc(x)}<button class="x" data-act="thDelB" data-arg="${k}" aria-label="Remove ${esc(x)}">${ic('x','s14')}</button></span>`).join('')}${b.length<3?btn('Add build',{v:'outline',icon:'plus',act:'thAddB'}):''}</div>${th.err==='b'?'<p class="t-xs" style="color:var(--red-700)">Feature at least one build.</p>':''}</div>
  ${field('Lesson',th.l,{id:'th-l',options:lessons.length?lessons:['Tin can']})}
  <div class="col gap8"><span class="flabel">Garden visitor</span><div class="row gap8 wrap" role="radiogroup">${VISITORS.map(v=>`<button class="chip ${th.v===v?'on':''}" data-act="thV" data-arg="${v}" role="radio" aria-checked="${th.v===v}">${v}</button>`).join('')}</div></div></div>
  <div class="card pad col gap12"><span class="section-title">On the child's home</span><div class="quote col gap4"><span class="m">This week: <span id="th-prev-n">${esc(th.n||'…')}</span></span><span>${esc(b.length?`Make a ${b.join(' or a ')}. A ${lc(th.v)} may visit your Garden!`:`A ${lc(th.v)} may visit your Garden!`)}</span></div><p class="t-xs muted">Weekly themes are to confirm with Kapitol.</p></div></div>`)}
SCREENS['a/new-theme']=()=>themeForm(null);
SCREENS['a/theme']=i=>S.themes[+i]?themeForm(+i):SCREENS['a/404']();
function thRead(){['w','n','l'].forEach(k=>{const e=document.getElementById('th-'+k);if(e)th[k]=e.value})}
document.addEventListener('input',e=>{if(e.target.id==='th-n'){const p=document.getElementById('th-prev-n');if(p)p.textContent=e.target.value||'…'}if(e.target.closest('[data-form="theme"]')){A.dirty=A.cur();window.DIRTY_DESC='This theme is not saved yet. If you leave now, the changes are lost.'}});
ACTIONS.thV=v=>{thRead();th.v=v;render()};
ACTIONS.thDelB=k=>{thRead();th.b.splice(+k,1);render()};
ACTIONS.thAddB=(a,el)=>{thRead();const live=S.builds.filter(x=>x.status==='live'&&!th.b.includes(x.name)).slice(0,12);openMenu(live.map(x=>({label:x.name,run:()=>{th.b.push(x.name);th.err=null;render()}})),el,'Live builds')};
ACTIONS.thSave=st=>{thRead();th.err=!th.n.trim()?'n':!th.b.length?'b':null;if(th.err){render();return}
 const row={w:th.w,n:th.n.trim(),b:th.b,l:th.l,v:th.v,st};if(th.i!=null)S.themes[th.i]=row;else S.themes.push(row);const name=row.n;th=null;A.dirty=null;go('a/themes',{force:true});toast(st==='Draft'?`${name} saved as draft`:st==='This week'?'Changes saved. Children see them now.':`${name} is scheduled`)};
const leave2=ACTIONS.leaveAnyway;ACTIONS.leaveAnyway=t=>{th=null;leave2(t)};
})();
