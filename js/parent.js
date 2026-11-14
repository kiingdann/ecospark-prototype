/* EcoSpark for Kids · parent zone screens (Mobile — Parent zone Flow page) */
(function(){
const {S,save,defaults,esc,ic,sprout,btn,round,topbar,go,back,later,sheet,dialog,closeOverlay,toast,render,SCREENS,SHEETS,DIALOGS,ACTIONS}=EC;
const P=()=>S.parentName||'Hannah';
function ptab(active){const t=[['Home','UI/Home','p/home'],['Approvals','UI/Check','p/approvals'],['Family','UI/Family','p/family'],['Account','UI/Settings','p/account']];
 return `<nav class="ptabbar">${t.map(([l,i,r])=>`<button class="ptab ${active===l?'active':''}" data-go="${r}"><span class="pill">${ic(i)}</span>${l}${l==='Approvals'&&S.approvals.length?'':''}</button>`).join('')}</nav>`}
function phead(title){return `<div class="row" style="justify-content:space-between;padding:6px 16px 14px"><div class="display-lg">${esc(title)}</div>${btn('Kid mode',{style:'secondary',size:'sm',block:false,go:'k/w1'})}</div>`}
function field(label,val,o={}){return `<div class="field ${o.error?'error':''}"><label for="${o.id}">${esc(label)}</label><input id="${o.id}" type="${o.type||'text'}" value="${esc(val||'')}" ${o.ph?`placeholder="${esc(o.ph)}"`:''} autocomplete="off">${o.help?`<div class="help">${esc(o.help)}</div>`:''}</div>`}
function check(text,on,act,arg){return `<button class="check ${on?'on':''}" data-act="${act}" data-arg="${arg}"><span class="box">${on?ic('UI/Check'):''}</span><span>${esc(text)}</span></button>`}
function page(inner,bottom){return `<div class="screen"><div class="top-space"></div>${inner}${bottom?`<div class="col gap8 pad" style="padding-bottom:28px;padding-top:8px">${bottom}</div>`:''}</div>`}
const val=id=>(document.getElementById(id)||{}).value||'';
function childCard(c,sub,go){return `<button class="listcard" data-go="${go}"><span class="avatar ${c.colour}">${esc(c.name[0])}</span><span class="grow col"><span class="title-md">${esc(c.name)}</span><span class="body-sm muted" style="font-weight:600">${esc(sub)}</span></span>${ic('UI/Chevron right','s20')}</button>`}
function waitCard(a,i,sub){return `<button class="listcard ${a.doneItem?'done':''}" data-go="${a.doneItem?'':'p/review/'+i}"><span class="thumb">${ic('Build/'+a.build,'s36')}</span><span class="grow col"><span class="title-sm">${esc(a.kid)} made a ${esc(a.build)}</span><span class="body-sm muted" style="font-weight:600">${esc(sub)}</span></span>${ic('UI/Chevron right','s20')}</button>`}

/* A · App start */
SCREENS['p/splash']=()=>({html:`<div class="screen splash">${sprout('Wave up',140)}<div class="display-xl" style="margin-top:12px">EcoSpark</div><div class="title-md muted">for Kids</div><div class="dots-load"><i></i><i></i><i></i></div></div>`,after(){later(1800,()=>go('p/welcome',{replace:true}))}});
SCREENS['p/welcome']=()=>{const G=window.GARDEN||{};return `<div class="screen sky"><div class="garden"><div class="gwrap" style="position:absolute;left:50%;top:50%;width:393px;height:852px;margin-top:-140px">${['base','feeder','v-bird','v-butterfly','v-bee','flowers','next'].map(k=>`<div class="layer">${G[k]||''}</div>`).join('')}</div></div>
 <div class="grow"></div><div style="position:relative;z-index:2;padding:0 24px 36px"><div class="card col gap12" style="padding:24px 22px;border-radius:28px"><div class="display-lg">Find treasures. Build. Grow.</div><div class="body-md muted">A recycling adventure for children aged 5 to 12, with their grown-ups.</div>
 ${btn('Set up for my family',{go:'p/signup'})}${btn('I have an account',{style:'secondary',go:'p/signin'})}<div class="body-sm muted center">For grown-ups. Setup takes about 3 minutes.</div></div></div></div>`};

/* U · Create an account */
let uErr=false;
SCREENS['p/signup']=()=>page(`${topbar('Create account')}<div class="scroll"><div class="col gap16 pad"><div class="display-lg">Hello, grown-up!</div><div class="body-md muted">Your account keeps your family's progress safe.</div>
 ${field('Your first name',P(),{id:'f-name'})}${field('Email',S.email,{id:'f-email',type:'email'})}${field('Password','',{id:'f-pass',type:'password',help:uErr?'Use at least 8 characters.':'At least 8 characters',error:uErr,ph:'••••••••'})}</div></div>`,
 `${btn('Continue',{act:'signup'})}<button class="link" data-go="p/signin">I already have an account</button>`);
ACTIONS.signup=()=>{if(val('f-pass').length<8){uErr=true;render();return}uErr=false;S.parentName=val('f-name')||'Hannah';S.email=val('f-email')||S.email;go('p/code')};
let codeErr=false,codeTimer=42;
function codeInputs(){return `<div class="code ${codeErr?'err':''}">${[0,1,2,3,4,5].map(i=>`<input inputmode="numeric" maxlength="1" data-ci="${i}" value="${['4','8','2'][i]||''}" aria-label="Digit ${i+1}">`).join('')}</div>`}
SCREENS['p/code']=()=>({html:page(`${topbar('Check your email')}<div class="scroll"><div class="col gap16 pad">${codeErr?'':`<div class="lockdisc" style="margin:0;color:var(--green)">${ic('UI/Mail','s32')}</div>`}<div class="display-lg">Enter the code</div><div class="body-md muted">We sent a 6-digit code to ${esc(S.email)}.</div>${codeInputs()}
 ${codeErr?`<div class="body-sm danger-text">That code didn't work. Check it and try again.</div>`:`<div class="body-sm muted" id="codeTimer">Send a new code in 0:${String(codeTimer).padStart(2,'0')}</div>`}</div></div>`,
 `${btn(codeErr?'Try again':'Confirm',{act:'confirmCode'})}<button class="link" data-act="${codeErr?'newCode':'back'}">${codeErr?'Send a new code':'Change email'}</button>`),
 after(app){const ins=[...app.querySelectorAll('[data-ci]')];const f=ins.find(i=>!i.value);if(f)f.focus();
  ins.forEach((inp,i)=>{inp.addEventListener('input',()=>{inp.value=inp.value.replace(/\D/g,'').slice(-1);if(inp.value&&ins[i+1])ins[i+1].focus()});inp.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!inp.value&&ins[i-1])ins[i-1].focus()})});
  if(!codeErr){const t=setInterval(()=>{const el=document.getElementById('codeTimer');if(!el){clearInterval(t);return}codeTimer=Math.max(0,codeTimer-1);el.textContent=codeTimer?`Send a new code in 0:${String(codeTimer).padStart(2,'0')}`:'Send a new code';if(!codeTimer){el.className='link';el.style.textAlign='left';el.style.padding=0;el.dataset.act='newCode';clearInterval(t)}},1000)}}});
ACTIONS.confirmCode=()=>{const c=[...document.querySelectorAll('[data-ci]')].map(i=>i.value).join('');if(c.length<6||c==='000000'||c==='482000'&&false){codeErr=c.length===6||codeErr;if(c.length<6){toast('Type all 6 digits','UI/Mail');return}render();return}codeErr=false;go('p/consent')};
ACTIONS.newCode=()=>{codeErr=false;codeTimer=42;toast('New code sent to '+S.email,'UI/Mail');render()};

/* C · Family setup */
let consent=[false,false,false];
SCREENS['p/consent']=()=>{const names=S.children.length?S.children.map(c=>c.name).join(' and '):'my children';
 return page(`${topbar('Before we start')}<div class="scroll"><div class="col gap16 pad"><div class="display-lg">A few things to agree</div><div class="body-md muted">EcoSpark is made for children, so we ask you first.</div>
 ${check(`I am ${S.children.length?names+"'s":'the children\'s'} parent or guardian`,consent[0],'consent',0)}${check('I agree to the terms and the privacy notice',consent[1],'consent',1)}${check('I understand how photos work: scan photos are deleted straight away. Build photos stay in our family until I delete them.',consent[2],'consent',2)}
 <button class="link" data-act="privacy">Read the privacy notice</button></div></div>`,btn('Agree and continue',{act:'agree',disabled:!consent.every(Boolean)}))};
ACTIONS.consent=i=>{consent[i]=!consent[i];render()};
ACTIONS.agree=()=>{S._setup=true;go('p/child-add')};
ACTIONS.privacy=()=>sheet('privacy');
SHEETS.privacy=()=>`<div class="display-lg">Privacy and photos</div><div class="col gap12">${['Scan photos are checked, then deleted straight away.','Build photos stay in your family until you delete them.','Photos of people are blocked.','Only your family sees your children\'s builds.'].map((t,i)=>`<div class="steprow"><span class="num">${i+1}</span><span class="txt" style="font-size:16px">${t}</span></div>`).join('')}</div>${btn('Manage photos',{go:'p/photos'})}${btn('Close',{style:'secondary',act:'close'})}`;
let draft={name:'',age:null,colour:'Yellow'};
SCREENS['p/child-add']=()=>{const n=draft.name||'';const init=(n[0]||'L').toUpperCase();
 return page(`${topbar('Add a child')}<div class="scroll"><div class="col gap16 pad"><div class="display-lg">Who will play?</div><div class="body-md muted">We only need a first name and an age.</div>
 <div class="row gap16">${['Yellow','Green','Orange','Blue'].map(c=>`<button class="avatar ${c} ${draft.colour===c?'sel':''}" data-act="colour" data-arg="${c}" aria-label="${c}">${esc(init)}</button>`).join('')}</div>
 ${field('First name',n,{id:'f-child',ph:'Leo'})}<div class="label-md">Age</div><div class="col gap8">${[[5,6,7,8],[9,10,11,12]].map(r=>`<div class="row gap8">${r.map(a=>`<button class="chip ${draft.age===a?'sel':''}" data-act="age" data-arg="${a}">${a}</button>`).join('')}</div>`).join('')}</div>
 <div class="body-sm muted" style="font-weight:600">5 to 8: everything is read aloud. 9 to 12: more to read, harder builds.</div></div></div>`,btn(n?`Add ${n}`:'Add child',{act:'addChild'}))};
function keepName(){const el=document.getElementById('f-child');if(el)draft.name=el.value.trim()}
ACTIONS.colour=c=>{keepName();draft.colour=c;render()};
ACTIONS.age=a=>{keepName();draft.age=+a;render()};
document.addEventListener('input',e=>{if(e.target.id==='f-child'){draft.name=e.target.value.trim();const b=document.querySelector('[data-act="addChild"] span');if(b)b.textContent=draft.name?`Add ${draft.name}`:'Add child';document.querySelectorAll('.avatar').forEach(a=>{if(a.dataset.act==='colour')a.textContent=(draft.name[0]||'L').toUpperCase()})}
 if(e.target.id==='f-del'){const b=document.querySelector('[data-act="deleteAccount"]');if(b)b.disabled=e.target.value.trim()!=='DELETE'}});
ACTIONS.addChild=()=>{keepName();if(!draft.name){toast('Add a first name','UI/Family');return}if(!draft.age){toast('Pick an age','UI/Family');return}
 if(S._setup&&!S._addedOne){S.children=[];S._addedOne=true}const i=S.children.findIndex(c=>c.name===draft.name);if(i>=0)S.children[i]={...draft};else S.children.push({...draft});
 draft={name:'',age:null,colour:['Green','Orange','Blue','Yellow'][S.children.length%4]};if(S._fromFamily){S._fromFamily=false;toast('Child added','UI/Family');go('p/family');return}go('p/children')};
SCREENS['p/children']=()=>page(`${topbar('Your children')}<div class="scroll"><div class="col gap12 pad"><div class="display-lg">Your children</div>${S.children.map(c=>childCard(c,'Age '+c.age,'p/child-add')).join('')}${btn('Add another child',{style:'secondary',go:'p/child-add'})}</div></div>`,btn('Continue',{go:'p/camera'}));
SCREENS['p/camera']=()=>{const names=S.children.map(c=>c.name).join(' and ')||'your children';return page(`${topbar('Camera')}<div class="scroll"><div class="col gap16 pad center">${sprout('Talk A',96)}<div class="display-md">Let ${esc(names)} use the camera</div><div class="col gap4 fill" style="text-align:left">
 ${['To scan treasures and photograph builds.','Photos of people are blocked.','Scan photos are deleted straight away.'].map((t,i)=>`<div class="steprow"><span class="num">${i+1}</span><span class="txt" style="font-size:16px">${t}</span></div>`).join('')}</div></div></div>`,
 `${btn('Allow camera',{icon:'UI/Camera',act:'allowCam',arg:1})}<button class="link" data-act="allowCam" data-arg="0">Not now</button>`)};
ACTIONS.allowCam=v=>{S.cameraAllowed=v==='1';if(v==='1')toast('Camera allowed','UI/Camera');go('p/pin')};
let pinMode='create',newPin='',pinBuf2='',pinMsg='';
function pinScreen(title,sub){return page(`${topbar('Grown-up PIN')}<div class="scroll col gap16 center" style="padding-top:30px"><div class="display-lg">${title}</div><div class="body-md muted pad" style="max-width:320px">${pinMsg?`<span class="danger-text">${pinMsg}</span>`:sub}</div>
 <div class="pin-dots ${pinMsg?'shake':''}" style="margin:14px 0 28px">${[0,1,2,3].map(i=>`<i class="${i<pinBuf2.length?'on':''}"></i>`).join('')}</div>
 <div class="pinpad">${[1,2,3,4,5,6,7,8,9].map(n=>`<button class="key" data-act="ppin" data-arg="${n}">${n}</button>`).join('')}<span class="key blank"></span><button class="key" data-act="ppin" data-arg="0">0</button><button class="key" data-act="ppin" data-arg="del" aria-label="Delete">⌫</button></div></div>`)}
SCREENS['p/pin']=a=>{pinMode=a==='change'?'change':'create';return pinScreen('Create a 4-digit PIN',"You'll need it to leave kid mode. Keep it secret from the children.")};
SCREENS['p/pin-confirm']=()=>pinScreen('Type it again','Just to be sure.');
ACTIONS.ppin=k=>{pinMsg='';if(k==='del')pinBuf2=pinBuf2.slice(0,-1);else if(pinBuf2.length<4)pinBuf2+=k;render();
 if(pinBuf2.length===4)setTimeout(()=>{const onConfirm=location.hash.includes('pin-confirm');
  if(!onConfirm){newPin=pinBuf2;pinBuf2='';go('p/pin-confirm')}
  else if(pinBuf2===newPin){S.pin=newPin;pinBuf2='';if(pinMode==='change'){toast('PIN changed','UI/Lock');go('p/account')}else go('p/how')}
  else{pinBuf2='';pinMsg="The PINs don't match. Try again.";render()}},200)};
SCREENS['p/how']=()=>{const k=(S.children[0]||{name:'Leo'}).name;return page(`${topbar('How it works')}<div class="scroll"><div class="col gap8 pad"><div class="display-lg">Your part is small</div><div class="body-md muted">Here is what happens, and when we need you.</div>
 ${[[`${k} scans a treasure at home.`],['He builds something new. Some steps need you.',1],['He photographs it. You approve it in one tap.',1],['Sparks grow his garden. A visitor may come!']].map(([t,g],i)=>`<div class="steprow ${g?'gu':''}"><span class="num">${i+1}</span><span class="txt" style="font-size:16px">${t}</span>${g?`<span class="hand">${ic('UI/Hand','s20')}</span>`:''}</div>`).join('')}
 <div class="offline" style="margin-top:8px">${ic('UI/Bell','s20')}We'll send you a notification when something needs you.</div></div></div>`,btn('Got it',{go:'p/handover'}))};
SCREENS['p/handover']=()=>{const names=S.children.map(c=>c.name).join(' or ');return `<div class="screen sky"><div class="top-space"></div><div class="grow col center gap16 pad">${sprout('Happy',140)}<div class="display-xl">All set!</div><div class="body-lg">Give the phone to ${esc(names)}. Kid mode starts now.</div>${btn('Start kid mode',{act:'finishSetup',arg:'k/w1'})}<button class="link" data-act="finishSetup" data-arg="p/home">Go to the Parent zone</button></div></div>`};
ACTIONS.finishSetup=r=>{S._setup=false;S._addedOne=false;consent=[false,false,false];go(r)};

/* I · Sign in */
let tries=5,iErr=false;
SCREENS['p/signin']=()=>page(`${topbar('Sign in')}<div class="scroll"><div class="col gap16 pad"><div class="display-lg">Welcome back</div><div class="body-md muted">Sign in to your family account.</div>
 ${field('Email',S.email,{id:'f-email',type:'email'})}${field('Password',iErr?'':'ecospark1',{id:'f-pass',type:'password',error:iErr,help:iErr?`That password isn't right. ${tries} tr${tries===1?'y':'ies'} left.`:''})}
 <button class="link" style="align-self:flex-start;padding-left:0" data-go="p/forgot">Forgot password?</button></div></div>`,`${btn('Sign in',{act:'signin'})}<button class="link" data-go="p/signup">Create an account</button>`);
ACTIONS.signin=()=>{const p=val('f-pass');if(p.length>=8&&p!=='wrongpass'&&!p.startsWith('wrong')){iErr=false;tries=5;S.email=val('f-email')||S.email;const b=document.querySelector('[data-act="signin"]');b.innerHTML='<div class="spinner" style="width:24px;height:24px;border-top-color:#fff"></div>';later(900,()=>go('p/home'));return}
 tries--;iErr=true;if(tries<=0){tries=5;iErr=false;go('p/locked');return}render()};
SCREENS['p/locked']=()=>page(`<div class="grow col center gap16 pad"><div class="lockdisc">${ic('UI/Hourglass','s32')}</div><div class="display-lg">Too many tries</div><div class="body-md muted">For your family's safety, wait 15 minutes or reset your password.</div></div>`,`${btn('Reset password',{go:'p/forgot'})}${btn('Back',{style:'secondary',go:'p/welcome'})}`);
SCREENS['p/forgot']=()=>page(`${topbar('Reset password')}<div class="scroll"><div class="col gap16 pad"><div class="display-lg">Forgot your password?</div><div class="body-md muted">Enter your email and we'll send you a link.</div>${field('Email',S.email,{id:'f-email',type:'email'})}</div></div>`,btn('Send the link',{act:'sendLink'}));
ACTIONS.sendLink=()=>{S.email=val('f-email')||S.email;go('p/link-sent',{replace:true})};
SCREENS['p/link-sent']=()=>page(`<div class="grow col center gap16 pad"><div class="lockdisc" style="color:var(--green)">${ic('UI/Mail','s32')}</div><div class="display-lg">Check your email</div><div class="body-md muted">If ${esc(S.email)} has an account, a reset link is on its way. It works for 30 minutes.</div></div>`,`${btn('Back to sign in',{go:'p/signin'})}<button class="link" data-act="resend">Send it again</button>`);
ACTIONS.resend=()=>toast('Link sent again','UI/Mail');

/* PZ · Home and alerts */
SCREENS['p/push']=()=>({light:true,html:`<div class="screen notif-screen"><div class="top-space"></div><div class="col center" style="color:#fff;padding-top:30px"><div style="font:700 72px/80px var(--f-display)">16:20</div><div class="body-lg">Saturday 14 November</div></div>
 <div class="pad" style="margin-top:40px"><button class="notif" data-go="p/home"><span class="appicon">${ic('UI/Sparks')}</span><span class="grow col gap4"><span class="row" style="justify-content:space-between"><span class="label-md">EcoSpark</span><span class="label-sm muted">now</span></span><span class="body-md-bold">${esc((S.approvals[0]||{kid:'Leo'}).kid)} made a ${esc((S.approvals[0]||{build:'Bird feeder'}).build)}!</span><span class="body-sm" style="font-weight:600">Tap to see his photo and say well done.</span></span></button></div>
 <div class="grow"></div><div class="body-sm center" style="color:#ffffffcc;padding:0 30px 40px">No answer after 24 h: one reminder, then an email.</div></div>`});
SCREENS['p/home']=()=>{const w=S.approvals;const stats={Leo:'5 treasures · 2 builds · '+S.sparks+' sparks',Maya:'3 treasures · 1 build · 80 sparks'};
 return `<div class="screen"><div class="top-space"></div>${phead('Hello, '+P())}<div class="scroll"><div class="col gap16 pad" style="padding-bottom:20px">
 ${w.length?`<div class="waitbox"><div class="row gap8 title-md" style="color:var(--orange-ink)">${ic('UI/Bell','s20')}${w.length} build${w.length>1?'s':''} waiting for you</div>${waitCard(w[0],0,w[0].ago||w[0].when)}${btn('Review now',{size:'md',go:'p/review/0'})}</div>`
  :`<div class="waitbox" style="background:var(--green-tint)"><div class="row gap8 title-md" style="color:var(--green)">${ic('UI/Check','s20')}All caught up</div><div class="body-sm" style="font-weight:600">We'll tell you when a build is waiting.</div></div>`}
 <div class="section-title">This week</div>${S.children.map(c=>childCard(c,stats[c.name]||'Just started','p/child/'+c.name)).join('')}</div></div>${ptab('Home')}</div>`};

/* AP · Approvals */
SCREENS['p/approvals']=()=>`<div class="screen"><div class="top-space"></div>${phead('Approvals')}<div class="scroll"><div class="col gap12 pad" style="padding-bottom:20px"><div class="section-title">Waiting for you</div>
 ${S.approvals.length?S.approvals.map((a,i)=>waitCard(a,i,a.when)).join(''):`<div class="body-md muted">Nothing waiting. Nice work!</div>`}<div class="section-title" style="margin-top:8px">Done</div>${S.done.map(d=>waitCard({...d,doneItem:true},0,d.when)).join('')}</div></div>${ptab('Approvals')}</div>`;
let reaction='Proud of you!',outside=null;
SCREENS['p/review']=i=>{const a=S.approvals[+i||0];if(!a)return SCREENS['p/approvals']();if(outside===null)outside=!!a.outside;
 return page(`${topbar(`${a.kid}'s ${a.build}`)}<div class="scroll"><div class="col gap12 pad"><div class="hero" style="height:220px">${ic('Build/'+a.build,'s120')}</div><div class="body-md">${esc(a.kid)} built it today. Is it really done?</div>
 ${check(`It went outside (a bird may visit ${a.kid==='Maya'?'her':'his'} garden)`,outside,'toggleOutside','')}<div class="title-md" style="margin-top:6px">Send a reaction</div>
 <div class="row gap8" style="flex-wrap:wrap">${['Proud of you!','Amazing!','So creative!','Well done!'].map(r=>`<button class="chip ${reaction===r?'sel':''}" data-act="react" data-arg="${r}">${r}</button>`).join('')}</div></div></div>`,
 `${btn('Approve and send',{act:'approve',arg:i||0})}${btn('Not this time',{style:'secondary',go:'p/nottime/'+(i||0)})}`)};
ACTIONS.toggleOutside=()=>{outside=!outside;render()};
ACTIONS.react=r=>{reaction=r;render()};
let lastSent=null;
ACTIONS.approve=i=>{const a=S.approvals.splice(+i,1)[0];if(!a)return;S.done.unshift({kid:a.kid,build:a.build,when:'Today · Approved'});
 if(a.kid===(S.kid||'Leo')||a.kid==='Leo'){S.kidCelebrate={build:a.build,reaction,outside};S.sparks+=20;S.builds[a.build]='built';if(S.sentBuild===a.build)S.sentBuild=null}
 lastSent={...a,reaction};outside=null;reaction='Proud of you!';go('p/sent',{replace:true})};
SCREENS['p/sent']=()=>{const a=lastSent||{kid:'Leo',reaction:'Proud of you!'};const n=S.approvals[0];const he=a.kid==='Maya'?'She':'He',his=a.kid==='Maya'?'her':'his';
 return page(`<div class="grow col center gap16 pad"><div class="lockdisc" style="background:var(--green-tint);color:var(--green)">${ic('UI/Check','s36')}</div><div class="display-lg">Sent to ${esc(a.kid)}</div><div class="body-md muted">${he} gets +20 sparks and your "${esc(a.reaction)}".${a.outside?` A bird may visit ${his} garden soon.`:''}</div></div>`,
 `${n?btn(`Next: ${n.kid}'s ${n.build}`,{go:'p/review/0'}):btn('Back to home',{go:'p/home'})}<button class="link" data-go="p/approvals">Back to approvals</button>`)};
let ideas=[true,false,false];
SCREENS['p/nottime']=i=>{const a=S.approvals[+i||0]||{kid:'Leo',build:'Bird feeder'};
 return page(`${topbar('Not this time')}<div class="scroll"><div class="col gap16 pad"><div class="display-lg">Help ${esc(a.kid)} try again</div><div class="body-md muted">Pick a kind idea. ${esc(a.kid)} will see it with ${a.kid==='Maya'?'her':'his'} photo.</div>
 ${['Add a stick for the birds to stand on','Ask me to help with the hard step','The photo is not clear, take another'].map((t,j)=>check(t,ideas[j],'idea',j)).join('')}${field('Or write your own (optional)','',{id:'f-own'})}</div></div>`,btn(`Send to ${a.kid}`,{act:'sendIdea',arg:i||0}))};
ACTIONS.idea=j=>{const own=val('f-own');ideas=ideas.map((_,k)=>k===+j?!ideas[k]:false);render();if(own)document.getElementById('f-own').value=own};
ACTIONS.sendIdea=i=>{const a=S.approvals.splice(+i,1)[0];const own=val('f-own');const opts=['Can you add a stick for the birds to stand on?','Can I help you with the hard step?','Can you take another, clearer photo?'];
 const note=own||opts[ideas.findIndex(Boolean)]||opts[0];if(a&&(a.kid===(S.kid||'Leo')||a.kid==='Leo')){S.kidRetry={build:a.build,note};if(S.sentBuild===a.build)S.sentBuild=null;S.builds[a.build]='ready'}
 ideas=[true,false,false];toast(`Sent to ${a?a.kid:'Leo'}`,'UI/Check');go('p/approvals',{replace:true})};

/* FA · Family */
SCREENS['p/family']=()=>{const rep=S.reports.filter(r=>!r.handled).length;return `<div class="screen"><div class="top-space"></div>${phead('Family')}<div class="scroll"><div class="col gap12 pad" style="padding-bottom:20px">
 ${S.children.map(c=>childCard(c,`Age ${c.age} · ${c.name==='Leo'?Object.keys(S.shelf).length:c.name==='Maya'?3:0} of 12 treasures`,'p/child/'+c.name)).join('')}${btn('Add a child',{style:'secondary',act:'familyAdd'})}
 <div class="section-title" style="margin-top:8px">For the family</div>
 <button class="setrow" data-go="p/photos">${ic('UI/Image','s20')}Photos<span class="val">${S.photos.length} build photos</span>${ic('UI/Chevron right','s20')}</button>
 <button class="setrow" data-go="p/time">${ic('UI/Clock','s20')}Screen time<span class="val">${esc(S.screenTime.Leo)} a day</span>${ic('UI/Chevron right','s20')}</button>
 <button class="setrow" data-go="p/report">${ic('UI/Flag','s20')}Reports<span class="val" ${rep?'style="color:var(--danger);font-weight:800"':''}>${rep?rep+' new':'None'}</span>${ic('UI/Chevron right','s20')}</button></div></div>${ptab('Family')}</div>`};
ACTIONS.familyAdd=()=>{S._fromFamily=true;go('p/child-add')};
SCREENS['p/child']=n=>{const c=S.children.find(x=>x.name===n)||S.children[0]||{name:'Leo'};const leo=c.name==='Leo';
 const acts=leo?[['Build/Bird feeder','Built a Bird feeder','Today'],['UI/Camera','Scanned a tin can','Today'],['UI/Star','Finished "What is a tin can?"','Yesterday'],['Build/Desk Post','Built a Desk Post','10 Nov']]:[['Build/Pencil pot','Built a Pencil pot','Yesterday'],['UI/Camera','Scanned a drinks can','Yesterday'],['UI/Star','Finished "What is a plastic bottle?"','12 Nov']];
 return `<div class="screen"><div class="top-space"></div>${topbar(c.name)}<div class="scroll"><div class="col gap12 pad" style="padding-bottom:20px"><div class="row gap8">${[[leo?Object.keys(S.shelf).length+'/12':'3/12','treasures'],[leo?'2':'1','builds'],[leo?S.sparks:80,'sparks']].map(([v,l])=>`<div class="stat"><div class="display-md">${v}</div><div class="body-sm muted">${l}</div></div>`).join('')}</div>
 <div class="section-title" style="margin-top:6px">Recent</div><div class="col">${acts.map(([i,t,w])=>`<div class="activity"><span class="pic">${ic(i,'s28')}</span><span class="grow body-md-bold">${esc(t)}</span><span class="body-sm muted">${w}</span></div>`).join('')}</div>
 ${btn('Edit '+c.name,{style:'secondary',size:'md',act:'editChild',arg:c.name})}</div></div>${ptab('Family')}</div>`};
ACTIONS.editChild=n=>{const c=S.children.find(x=>x.name===n);if(c)draft={...c};S._fromFamily=true;go('p/child-add')};
let selecting=false,sel=new Set();
SCREENS['p/photos']=()=>`<div class="screen"><div class="top-space"></div>${topbar('Photos')}<div class="scroll"><div class="col gap16 pad" style="padding-bottom:20px"><div class="offline">${ic('UI/Lock','s20')}Only your family sees these. Scan photos are never kept.</div>
 ${S.photos.length?`<div class="grid3">${S.photos.map((p,i)=>`<button class="photo ${sel.has(i)?'sel':''}" data-act="photo" data-arg="${i}" aria-label="${esc(p)}">${ic('Build/'+p)}${selecting?'<span class="tick"></span>':''}</button>`).join('')}</div>`:`<div class="body-md muted center">No build photos yet.</div>`}
 ${selecting?`<div class="row gap8">${btn('Cancel',{style:'secondary',size:'md',act:'selectMode',arg:0})}${btn(`Delete ${sel.size||''}`.trim(),{style:'danger',size:'md',act:'askDelete',disabled:!sel.size})}</div>`:S.photos.length?btn('Select photos to delete',{style:'secondary',size:'md',icon:'UI/Trash',act:'selectMode',arg:1}):''}</div></div>${ptab('Family')}</div>`;
ACTIONS.selectMode=v=>{selecting=v==='1';sel.clear();render()};
ACTIONS.photo=i=>{if(!selecting){sheet('photo',+i);return}i=+i;sel.has(i)?sel.delete(i):sel.add(i);render()};
SHEETS.photo=i=>`<div class="hero" style="height:260px">${ic('Build/'+S.photos[i],'s120')}</div><div class="display-md">${esc(S.photos[i])}</div><div class="body-sm muted">Build photo · only your family sees it</div>${btn('Close',{style:'secondary',act:'close'})}`;
ACTIONS.askDelete=()=>dialog('delPhotos');
DIALOGS.delPhotos=()=>`<div class="display-md">Delete ${sel.size} photo${sel.size>1?'s':''}?</div><div class="body-md muted">They will be deleted for good. This can't be undone.</div>${btn('Delete',{style:'danger',size:'md',act:'doDelete'})}${btn('Keep them',{style:'secondary',size:'md',act:'close'})}`;
ACTIONS.doDelete=()=>{S.photos=S.photos.filter((_,i)=>!sel.has(i));const n=sel.size;sel.clear();selecting=false;closeOverlay();toast(`${n} photo${n>1?'s':''} deleted`,'UI/Trash')};
SCREENS['p/time']=()=>page(`${topbar('Screen time')}<div class="scroll"><div class="col gap16 pad"><div class="display-md">How long can each child play a day?</div>
 ${S.children.map(c=>`<div class="card col gap12" style="padding:14px"><div class="row gap12"><span class="avatar ${c.colour}" style="width:40px;height:40px;font-size:17px">${esc(c.name[0])}</span><span class="title-md">${esc(c.name)}</span></div><div class="row gap8">${['20 min','30 min','45 min','1 h'].map(o=>`<button class="chip ${(S.screenTime[c.name]||'30 min')===o?'sel':''}" data-act="time" data-arg="${esc(c.name+'|'+o)}" style="padding:0 12px">${o}</button>`).join('')}</div></div>`).join('')}
 ${check('No play after 19:30',S.curfew,'curfew','')}<div class="body-sm muted">When time is up, Sprout says goodbye. Nothing is lost.</div></div></div>`,btn('Save',{act:'saved',arg:'p/family'}));
ACTIONS.time=a=>{const [n,o]=a.split('|');S.screenTime[n]=o;render()};
ACTIONS.curfew=()=>{S.curfew=!S.curfew;render()};
ACTIONS.saved=r=>{toast('Saved','UI/Check');go(r,{replace:true})};
SCREENS['p/report']=()=>{const r=S.reports.find(x=>!x.handled);if(!r)return page(`${topbar('Report')}<div class="grow col center gap12 pad"><div class="lockdisc" style="background:var(--green-tint);color:var(--green)">${ic('UI/Check','s32')}</div><div class="display-md">No reports</div><div class="body-md muted">If a child tells us something worried them, you'll see it here.</div></div>`);
 return page(`${topbar('Report')}<div class="scroll"><div class="col gap16 pad"><div class="report"><div class="row gap8 title-md">${ic('UI/Flag','s20')}${esc(r.kid)} told us something worried ${r.kid==='Maya'?'her':'him'}</div>
 <div class="kv"><b>What</b>${esc(r.what)}</div><div class="kv"><b>Where</b>${esc(r.where)}</div><div class="kv"><b>When</b>${esc(r.when)}</div></div>
 <div class="body-md">Talk with ${esc(r.kid)} first. Ask what ${r.kid==='Maya'?'she':'he'} saw and how ${r.kid==='Maya'?'she feels':'he feels'}. You can also send it to the EcoSpark safety team.</div></div></div>`,
 `${btn('Send to the safety team',{act:'handle',arg:'team'})}${btn('Mark as handled',{style:'secondary',act:'handle',arg:'done'})}`)};
ACTIONS.handle=k=>{const r=S.reports.find(x=>!x.handled);if(r)r.handled=true;toast(k==='team'?'Sent to the safety team':'Marked as handled','UI/Check');go('p/family',{replace:true})};

/* AC · Account */
SCREENS['p/account']=()=>`<div class="screen"><div class="top-space"></div>${phead('Account')}<div class="scroll"><div class="col gap12 pad" style="padding-bottom:20px"><div class="card row gap16" style="padding:16px"><span class="avatar Orange">${esc(P()[0])}</span><div class="col"><div class="title-md">${esc(P())}</div><div class="body-sm muted">${esc(S.email)}</div></div></div>
 ${[['UI/Lock','Change password','','p/password'],['UI/Lock','Grown-up PIN','Change','p/pin/change'],['UI/Bell','Notifications',S.notifs[0]?'On':'Off','p/notifs'],['UI/Image','Privacy and photos','','privacy'],['UI/Log out','Sign out','','signout']].map(([i,l,v,r])=>`<button class="setrow" ${r.startsWith('p/')?`data-go="${r}"`:`data-act="${r}"`}>${ic(i,'s20')}${l}${v?`<span class="val">${v}</span>`:'<span class="val"></span>'}${ic('UI/Chevron right','s20')}</button>`).join('')}
 <button class="link danger" data-go="p/delete">Delete my account</button></div></div>${ptab('Account')}</div>`;
ACTIONS.signout=()=>dialog('signout');
DIALOGS.signout=()=>`<div class="display-md">Sign out?</div><div class="body-md muted">The children's progress stays safe. You'll need your password to come back.</div>${btn('Sign out',{size:'md',act:'doSignout'})}${btn('Stay signed in',{style:'secondary',size:'md',act:'close'})}`;
ACTIONS.doSignout=()=>{toast('Signed out','UI/Log out');go('p/welcome')};
SCREENS['p/password']=()=>page(`${topbar('Change password')}<div class="scroll"><div class="col gap16 pad">${field('Current password','ecospark1',{id:'f-cur',type:'password'})}${field('New password','',{id:'f-new',type:'password',help:'At least 8 characters',ph:'••••••••'})}</div></div>`,btn('Save',{act:'savePass'}));
ACTIONS.savePass=()=>{if(val('f-new').length<8){const f=document.getElementById('f-new').closest('.field');f.classList.add('error');f.querySelector('.help').textContent='Use at least 8 characters.';return}toast('Password changed','UI/Lock');go('p/account',{replace:true})};
SCREENS['p/notifs']=()=>page(`${topbar('Notifications')}<div class="scroll"><div class="col gap16 pad">${['Push alerts when a build is waiting','Email if I miss the alert','One reminder after 24 h','Weekly family summary'].map((t,i)=>check(t,S.notifs[i],'notif',i)).join('')}</div></div>`,btn('Save',{act:'saved',arg:'p/account'}));
ACTIONS.notif=i=>{S.notifs[i]=!S.notifs[i];render()};
SCREENS['p/delete']=()=>{const names=S.children.map(c=>c.name).join(' and ');return page(`<div class="top-space" style="height:30px"></div><div class="scroll"><div class="col gap16 pad center"><div class="lockdisc" style="background:#f8dcd8;color:var(--danger)">${ic('UI/Trash','s32')}</div><div class="display-lg">Delete your account?</div><div class="body-md muted">${esc(names)}'s gardens, builds and photos will be deleted for good. This can't be undone.</div><div class="fill" style="text-align:left">${field('Type DELETE to confirm','',{id:'f-del',ph:'DELETE'})}</div></div></div>`,
 `${btn('Delete my account',{style:'danger',act:'deleteAccount',disabled:true})}${btn('Keep my account',{style:'secondary',act:'back'})}`)};
ACTIONS.deleteAccount=()=>{if(val('f-del').trim()!=='DELETE')return;const b=document.querySelector('[data-act="deleteAccount"]');b.innerHTML='<div class="spinner" style="width:24px;height:24px;border-top-color:#fff"></div>';
 later(1200,()=>{const keep=defaults();Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,keep);S.children=[];save();toast('Your account is deleted','UI/Trash');go('p/welcome')})};
ACTIONS.addAnother=()=>go('p/child-add');
})();
