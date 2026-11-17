/* EcoSpark Admin · sign in (SI1 to SI10, H1, H2, ST7), team (TM1 to TM6, ST4), account (AT1 to AT5) */
(function(){
const A=window.ADMIN;const {S,PEOPLE,me,esc,ic,btn,status,disc,phead,empty,field,toggle,radio,kv,val,go,later,dialog,sheet,close,toast,openMenu,render,shell,SCREENS,DIALOGS,SHEETS,ACTIONS}=A;

/* ---------- Sign in ---------- */
function authPage(inner){return `<div class="auth"><div class="logo"><span class="mark">${ic('sprout','s18')}</span><span class="name">EcoSpark</span><span class="sub" style="margin-left:2px">Admin</span></div><div class="card">${inner}</div></div>`}
let signErr=null,signBusy=false;
function signin(out){return authPage(`${out?`<div class="note ok" role="status">${ic('circle-check')}<span class="m">You signed out.</span></div>`:''}
 <div class="col gap4"><h1>Sign in</h1>${out?'':'<p class="muted">For the Kapitol team.</p>'}</div>
 <form class="col gap16" data-form="signin" onsubmit="return false">
 ${field('Email',S.lastEmail||'grace@kapitol.co.uk',{id:'si-email',type:'email',err:signErr&&signErr.f==='email'?signErr.m:''})}
 ${field('Password',out?'':'kapitol-pilot-1',{id:'si-pw',type:'password',ph:'Your password',labelRight:out?'':`<a href="#a/forgot" data-go="a/forgot" class="textlink" style="float:right;font-weight:500">Forgot password?</a>`,err:signErr&&signErr.f==='pw'?signErr.m:''})}
 ${signBusy?btn('Signing in…',{block:true,disabled:true,icon:'refresh-cw',cls:'spin'}):btn('Sign in',{block:true,act:'signIn'})}
 </form>${out?'':'<p class="muted t-sm" style="text-align:center">No account? Ask your admin for an invite.</p>'}`)}
SCREENS['a/signin']=()=>signin(false);
SCREENS['a/signed-out']=()=>signin(true);
ACTIONS.signIn=()=>{const em=val('si-email').trim().toLowerCase(),pw=val('si-pw');signErr=null;
  const who=Object.keys(PEOPLE).find(k=>PEOPLE[k].email===em);
  if(!em||!/@/.test(em))signErr={f:'email',m:'Enter your work email.'};
  else if(!who)signErr={f:'email',m:'No admin account uses this email. Ask your admin for an invite.'};
  else if(!pw)signErr={f:'pw',m:'Enter your password.'};
  if(signErr){A.dirty=null;render();return}
  S.lastEmail=em;S.pendingMe=who;signBusy=true;A.dirty=null;render();
  later(900,()=>{signBusy=false;if(S.lockedUntil&&Date.now()<S.lockedUntil){go('a/locked')}else{S.codeTries=3;S.codeErr=null;S.codeSent=null;go('a/code')}})};
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.closest('[data-form="signin"]')){e.preventDefault();ACTIONS.signIn()}});

/* Two-step code */
SCREENS['a/code']=()=>{const email=(PEOPLE[S.pendingMe]||PEOPLE.grace).email;const bad=!!S.codeErr;const wait=Math.max(0,Math.ceil(((S.codeResentAt||0)+60000-Date.now())/1000));
 if(wait>0)later(1000,()=>{const el=document.getElementById('resend-wait');if(el)render()});
 return authPage(`${disc('mail-check','primary')}<div class="col gap4"><h1>Enter your code</h1><p class="muted">We sent a 6-digit code to ${esc(email)}. It works for 10 minutes.</p></div>
 ${S.codeSent?`<div class="note ok" role="status">${ic('circle-check')}<span>New code sent. The old one no longer works.</span></div>`:''}
 <div class="code ${bad?'bad':''}" data-form="code" role="group" aria-label="6-digit code">${[0,1,2,3,4,5].map(i=>`<input inputmode="numeric" maxlength="1" aria-label="Digit ${i+1}" data-ci="${i}" value="${esc((S.codeDraft||'')[i]||'')}">`).join('')}</div>
 ${bad?`<p class="err t-sm" role="alert" style="color:var(--red-700)">${esc(S.codeErr)}</p>`:''}
 ${btn('Verify',{block:true,act:'verify'})}
 ${wait>0?`<p class="muted t-sm" id="resend-wait">You can ask for another code in 0:${String(wait).padStart(2,'0')}.</p>`:`<div class="row between">${btn('Send a new code',{v:'link',act:'resend'})}${S.inviteJoin?'':btn('Use another account',{v:'link',act:'otherAccount',cls:'muted'})}</div>`}`)};
document.addEventListener('input',e=>{const t=e.target;if(t.dataset.ci===undefined)return;const v=t.value.replace(/\D/g,'');
  if(v.length>1){const ins=[...document.querySelectorAll('[data-ci]')];v.slice(0,6).split('').forEach((d,i)=>{if(ins[i])ins[i].value=d});(ins[Math.min(5,v.length)]||ins[5]).focus();return}
  t.value=v;if(v){const n=document.querySelector(`[data-ci="${+t.dataset.ci+1}"]`);if(n)n.focus()}});
document.addEventListener('keydown',e=>{const t=e.target;if(t.dataset&&t.dataset.ci!==undefined){if(e.key==='Backspace'&&!t.value){const p=document.querySelector(`[data-ci="${+t.dataset.ci-1}"]`);if(p){p.focus();p.value=''}}if(e.key==='Enter')ACTIONS.verify()}});
document.addEventListener('paste',e=>{const t=e.target;if(t.dataset&&t.dataset.ci!==undefined){e.preventDefault();const v=(e.clipboardData.getData('text')||'').replace(/\D/g,'').slice(0,6);const ins=[...document.querySelectorAll('[data-ci]')];v.split('').forEach((d,i)=>ins[i].value=d);(ins[Math.min(5,v.length)]).focus()}});
ACTIONS.verify=()=>{const code=[...document.querySelectorAll('[data-ci]')].map(i=>i.value).join('');S.codeDraft=code;
  if(code.length<6){S.codeErr='Enter all 6 digits.';render();return}
  if(code==='000000'){S.codeTries--;S.codeDraft='';if(S.codeTries<=0){S.lockedUntil=Date.now()+15*60000;S.codeErr=null;go('a/locked');return}
    S.codeErr=`That code doesn't match. ${S.codeTries} ${S.codeTries===1?'try':'tries'} left.`;S.codeSent=null;render();return}
  S.codeErr=null;S.codeDraft='';S.codeSent=null;S.auth='in';S.me=S.pendingMe||'grace';const joined=S.inviteJoin;S.inviteJoin=false;
  go('a/overview');if(joined)toast(`Welcome, ${me().first}. Your account is ready.`)};
ACTIONS.resend=()=>{S.codeResentAt=Date.now();S.codeSent=true;S.codeErr=null;S.codeDraft='';render()};
ACTIONS.otherAccount=()=>{S.codeErr=null;go('a/signin')};
SCREENS['a/locked']=()=>{const t=new Date(S.lockedUntil||Date.now()+15*60000);const hh=String(t.getHours()).padStart(2,'0')+':'+String(t.getMinutes()).padStart(2,'0');
 return authPage(`${disc('lock','danger')}<div class="col gap4"><h1>Too many tries</h1><p class="muted">For your safety, sign-in is paused for 15 minutes. You can try again at ${hh}.</p></div>${btn('Back to sign in',{v:'outline',block:true,go:'a/signin'})}<p class="muted t-sm" style="text-align:center">Not you? Tell your admin straight away.</p>`)};

/* Forgot password */
let fpErr=null;
SCREENS['a/forgot']=()=>authPage(`<div class="col gap4"><h1>Reset your password</h1><p class="muted">Enter your work email and we'll send you a link.</p></div>${field('Email',S.lastEmail||'grace@kapitol.co.uk',{id:'fp-email',type:'email',err:fpErr})}${btn('Send link',{block:true,act:'sendLink'})}${btn('Back to sign in',{v:'link',go:'a/signin',cls:'',block:false})}`);
ACTIONS.sendLink=()=>{const em=val('fp-email').trim();if(!/@/.test(em)){fpErr='Enter your work email.';render();return}fpErr=null;S.resetEmail=em;go('a/link-sent')};
SCREENS['a/link-sent']=()=>authPage(`${disc('mail','primary')}<div class="col gap4"><h1>Check your email</h1><p class="muted">If ${esc(S.resetEmail||'grace@kapitol.co.uk')} has an account, a reset link is on its way. It works for 30 minutes.</p></div>${btn('Back to sign in',{v:'outline',block:true,go:'a/signin'})}${btn('Send it again',{v:'link',act:'linkAgain'})}`);
ACTIONS.linkAgain=()=>toast('We sent the link again.',{icon:'mail'});
let npErr={};
SCREENS['a/new-password']=()=>authPage(`<div class="col gap4"><h1>Choose a new password</h1><p class="muted">You will sign in with it from now on.</p></div>${field('New password','',{id:'np1',type:'password',help:npErr.a?'':'At least 12 characters.',err:npErr.a})}${field('Confirm password','',{id:'np2',type:'password',err:npErr.b})}${btn('Save password',{block:true,act:'savePw'})}`);
ACTIONS.savePw=()=>{const a=val('np1'),b=val('np2');npErr={};if(a.length<12)npErr.a='Use at least 12 characters.';else if(a!==b)npErr.b="The passwords don't match.";if(npErr.a||npErr.b){render();return}S.pwChanged='today';S.auth='out';go('a/password-changed')};
SCREENS['a/password-changed']=()=>authPage(`${disc('circle-check','primary')}<div class="col gap4"><h1>Password changed</h1><p class="muted">Sign in with your new password. We signed you out on your other devices.</p></div>${btn('Sign in',{block:true,go:'a/signin'})}`);

/* Invite */
let ivErr=null;
SCREENS['a/invite']=()=>authPage(`<div class="col gap4"><h1>Join EcoSpark Admin</h1><p class="muted">Grace Bennett invited you as Moderator.</p></div>${field('Your name','Priya Shah',{id:'iv-name'})}${field('Email','priya@kapitol.co.uk',{id:'iv-email',type:'email'})}${field('Password','',{id:'iv-pw',type:'password',help:ivErr?'':'At least 12 characters.',err:ivErr})}${btn('Create account',{block:true,act:'join'})}<p class="muted t-sm">Next, we send a code to your email to finish setting up two-step sign-in.</p>`);
ACTIONS.join=()=>{if(val('iv-pw').length<12){ivErr='Use at least 12 characters.';render();return}ivErr=null;S.pendingMe='priya';S.inviteJoin=true;S.codeTries=3;S.codeErr=null;S.codeSent=null;go('a/code')};
SCREENS['a/invite-expired']=()=>authPage(`${disc('clock','neutral')}<div class="col gap4"><h1>This invite has expired</h1><p class="muted">Invites last 7 days. Ask Grace Bennett to send you a new one.</p></div>${btn('Back to sign in',{v:'outline',block:true,go:'a/signin'})}`);

/* ---------- Team ---------- */
const ROLES=[['Admin','Everything, including the team'],['Content editor','Builds, Learn and weekly themes'],['Moderator','Moderation and alerts']];
const ROLES_LONG=[['Admin','Everything, including the team, alerts and the scan limit.'],['Content editor','Builds, Learn and weekly themes. Can publish.'],['Moderator','Moderation and alerts. Sees usage.']];
SCREENS['a/team']=()=>{if(S.me!=='grace')return shell('Team',['Team'],`<div class="card">${empty('lock','Only admins can manage the team','Ask Grace Bennett if you need access.',btn('Back to Overview',{v:'outline',go:'a/overview'}))}</div>`);
 const rows=S.team.map(m=>{const p=PEOPLE[m.k];const you=m.k===S.me;return `<tr class="click" data-act="${you?'':'member'}" data-arg="${m.k}" ${you?'':'tabindex="0"'}><td><div class="row gap12"><span class="avatar soft">${p.ini}</span><div class="col"><span class="m">${esc(p.name)}${you?' (you)':''}</span><span class="t-xs muted">${esc(p.email)}</span></div></div></td><td>${esc(m.role||p.role)}</td><td>${m.two}</td><td class="muted">${esc(m.last)}</td><td>${status(m.st)}</td><td class="more">${you?'':`<button class="rowmenu" data-act="member" data-arg="${m.k}" aria-label="Open ${esc(p.name)}">${ic('chevron-right')}</button>`}</td></tr>`}).join('')
  +S.invited.map((m,i)=>`<tr><td><div class="row gap12"><span class="avatar soft">${esc(m.ini)}</span><div class="col"><span class="m">${esc(m.name)}</span><span class="t-xs muted">${esc(m.email)}</span></div></div></td><td>${esc(m.role)}</td><td class="muted">–</td><td class="muted">${esc(m.when)}</td><td>${status('Invited')}</td><td class="more"><button class="rowmenu" data-act="inviteMenu" data-arg="${i}" aria-label="Invite options">${ic('ellipsis')}</button></td></tr>`).join('');
 return shell('Team',['Team'],`${phead('Team','Who can use the admin, and what they can do.',btn('Invite member',{act:'invite',icon:'user-plus'}))}
 <div class="card" style="overflow:hidden"><table><thead><tr><th>Member</th><th>Role</th><th>Two-step</th><th>Last active</th><th>Status</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
 <div class="col gap12"><div class="section-title">What each role can do</div><div class="grid3">${ROLES_LONG.map(([r,d])=>`<div class="card pad col gap4"><span class="m">${r}</span><span class="muted">${d}</span></div>`).join('')}</div></div>`)};
let inv={email:'',role:'Moderator',err:null};
ACTIONS.invite=()=>{inv={email:'',role:'Moderator',err:null};dialog('invite')};
DIALOGS.invite=()=>({title:'Invite a team member',desc:'They get an email to set a password and two-step sign-in. The invite lasts 7 days.',
  body:`${field('Work email',inv.email,{id:'inv-email',type:'email',ph:'name@kapitol.co.uk',icon:'mail',err:inv.err})}<div class="col gap8" role="radiogroup" aria-label="Role"><span class="flabel">Role</span>${ROLES.map(([r,d])=>radio(r,d,inv.role===r,'invRole',r)).join('')}</div>`,
  actions:btn('Cancel',{v:'outline',act:'close'})+btn('Send invite',{act:'sendInvite'})});
ACTIONS.invRole=r=>{inv.email=val('inv-email');inv.role=r;A.dialog('invite')};
ACTIONS.sendInvite=()=>{const em=val('inv-email').trim().toLowerCase();inv.email=em;
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){inv.err='Enter a work email, like sam@kapitol.co.uk.';A.dialog('invite');return}
  if(Object.values(PEOPLE).some(p=>p.email===em)||S.invited.some(m=>m.email===em)){inv.err='This person is already on the team.';A.dialog('invite');return}
  const local=em.split('@')[0];const name=local==='sam'?'Sam Okoro':local.split(/[._-]/).map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');
  S.invited.push({email:em,name,ini:name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(),role:inv.role,when:'Invite sent today'});
  A.overlay=null;render();toast('Invite sent to '+em,{icon:'mail'})};
ACTIONS.inviteMenu=(i,el)=>{const m=S.invited[+i];openMenu([{label:'Resend invite',icon:'mail',run:()=>{m.when='Invite sent again today';render();toast('Invite sent again to '+m.email,{icon:'mail'})}},{label:'Cancel invite',icon:'x',danger:true,run:()=>{const removed=S.invited.splice(+i,1)[0];render();toast('Invite to '+m.email+' cancelled',{undo:()=>{S.invited.splice(+i,0,removed);render()}})}}],el)};
let memRole=null;
ACTIONS.member=k=>{if(!k)return;const m=S.team.find(x=>x.k===k);memRole=m.role||PEOPLE[k].role;sheet('member',k)};
SHEETS.member=k=>{const p=PEOPLE[k],m=S.team.find(x=>x.k===k);return {title:p.name,sub:m.role||p.role,
  body:`${kv([['Email',esc(p.email)],['Two-step sign-in','On (email code)'],['Last active',esc(m.last)],['Joined',esc(m.joined||'2 November')]])}<div class="col gap8" role="radiogroup" aria-label="Role"><span class="flabel">Role</span>${ROLES.map(([r,d])=>radio(r,d,memRole===r,'memRole',k+'|'+r)).join('')}</div>`,
  actions:`<span class="grow">${btn('Remove from team',{v:'destructive',act:'removeAsk',arg:k})}</span>`+btn('Save',{act:'memSave',arg:k})}};
ACTIONS.memRole=a=>{const [k,r]=a.split('|');memRole=r;sheet('member',k)};
ACTIONS.memSave=k=>{const m=S.team.find(x=>x.k===k);const changed=(m.role||PEOPLE[k].role)!==memRole;m.role=memRole;A.overlay=null;render();toast(changed?`${PEOPLE[k].name} is now ${memRole==='Admin'?'an':'a'} ${memRole}`:'No changes to save',{icon:changed?'circle-check':'info'})};
ACTIONS.removeAsk=k=>dialog('remove',k);
DIALOGS.remove=k=>{const p=PEOPLE[k];const he=k==='tom'?['He','he']:['She','she'];return {title:`Remove ${p.name} from the team?`,desc:`${he[0]} can't sign in any more. Builds and lessons ${he[1]} made stay as they are.`,actions:btn('Cancel',{v:'outline',act:'close'})+btn('Remove',{v:'destructive',act:'remove',arg:k})}};
ACTIONS.remove=k=>{const i=S.team.findIndex(x=>x.k===k);const m=S.team.splice(i,1)[0];A.overlay=null;render();toast(PEOPLE[k].name+' removed from the team',{undo:()=>{S.team.splice(i,0,m);render()}})};

/* ---------- Account ---------- */
SCREENS['a/account']=()=>{const m=me();const tm=S.team.find(x=>x.k===S.me)||{};
 return shell('Account',['Account'],`${phead('Account','Your profile, sign-in and notifications.')}
 <div class="cols-even"><div class="col gap16">
  <div class="card pad col gap16"><div class="section-title">Profile</div><div class="col gap4"><span class="flabel">Name</span><span>${esc(m.name)}</span></div><div class="col gap4"><span class="flabel">Work email</span><span>${esc(m.email)}</span><span class="t-xs muted">Ask another admin to change it.</span></div><div class="col gap4"><span class="flabel">Role</span><span>${esc(tm.role||m.role)}</span></div></div>
  <div class="card pad col gap16"><div class="section-title">Sign-in</div>
   <div class="row gap12"><div class="col grow"><span class="m">Password</span><span class="muted t-sm">Changed ${esc(S.pwChanged)}</span></div>${btn('Change password',{v:'outline',act:'changePw'})}</div>
   <div class="row gap12"><div class="col grow"><span class="m">Two-step sign-in</span><span class="muted t-sm">On · code by email · needed for everyone</span></div>${status('On')}</div></div>
 </div><div class="col gap16">
  <div class="card pad col gap16"><div class="row between"><div class="section-title">Signed-in devices</div>${S.devices.length>1?btn('Sign out other devices',{v:'outline',sm:true,act:'otherDevicesAsk'}):''}</div>
   ${S.devices.map(d=>`<div class="row gap12">${disc(d.icon,'neutral')}<div class="col"><span class="m">${esc(d.n)}</span><span class="muted t-sm">${esc(d.d)}</span></div></div>`).join('')}</div>
  <div class="card pad col gap12"><div class="section-title">Email me</div>${[['Alerts'],['New reports from parents'],['A weekly usage summary']].map(([l],i)=>toggle(l,'',S.notifs[i],'notif',i)).join('')}</div>
  <div>${btn('Sign out',{v:'outline',icon:'log-out',act:'signOutAsk'})}</div>
 </div></div>`)};
ACTIONS.notif=i=>{S.notifs[+i]=!S.notifs[+i];render();toast(S.notifs[+i]?'You will get these emails':'You will not get these emails',{icon:'mail'})};
let pwErr={};
ACTIONS.changePw=()=>{pwErr={};dialog('changePw')};
DIALOGS.changePw=()=>({title:'Change your password',desc:'You stay signed in on this device.',body:`${field('Current password','',{id:'cp0',type:'password',err:pwErr.c})}${field('New password','',{id:'cp1',type:'password',help:pwErr.a?'':'At least 12 characters.',err:pwErr.a})}${field('Confirm new password','',{id:'cp2',type:'password',err:pwErr.b})}`,actions:btn('Cancel',{v:'outline',act:'close'})+btn('Save password',{act:'cpSave'})});
ACTIONS.cpSave=()=>{const c=val('cp0'),a=val('cp1'),b=val('cp2');pwErr={};if(!c)pwErr.c='Enter your current password.';if(a.length<12)pwErr.a='Use at least 12 characters.';else if(a!==b)pwErr.b="The passwords don't match.";if(pwErr.a||pwErr.b||pwErr.c){A.dialog('changePw');return}S.pwChanged='today';A.overlay=null;render();toast('Password changed')};
ACTIONS.otherDevicesAsk=()=>dialog('otherDevices');
DIALOGS.otherDevices=()=>({title:'Sign out other devices?',desc:`${S.devices.filter(d=>!d.me).map(d=>d.n).join(', ')} will need your password and a code next time.`,actions:btn('Cancel',{v:'outline',act:'close'})+btn('Sign out other devices',{act:'otherDevices'})});
ACTIONS.otherDevices=()=>{S.devices=S.devices.filter(d=>d.me);A.overlay=null;render();toast('Signed out on your other devices')};
ACTIONS.signOutAsk=()=>dialog('signOut');
DIALOGS.signOut=()=>({title:'Sign out?',desc:'You can sign in again any time with your password and a code.',actions:btn('Cancel',{v:'outline',act:'close'})+btn('Sign out',{act:'signOut'})});
ACTIONS.signOut=()=>{S.auth='out';A.overlay=null;go('a/signed-out')};
})();
