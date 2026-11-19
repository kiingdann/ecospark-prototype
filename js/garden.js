/* EcoSpark · living garden (GA1 ambient + GA2 tap reactions + time of day). Built from the Figma Garden scene pieces. */
(function(){
const {S,esc,ic,sheet,toast,ACTIONS}=EC;
const G=()=>window.GARDEN||{};
const PHASES={morning:{sky:'linear-gradient(180deg,#FCE3C4 0%,#E3EEF0 45%,#CDE9F7 100%)',sun:[296,236,64,'#FFD54F'],cloud:'#FFF6EC',warm:.06},
 day:{sky:'#CDE9F7',sun:[300,176,64,'#FFD54F'],cloud:'#FFFFFF',warm:0},
 dusk:{sky:'linear-gradient(180deg,#F4A98A 0%,#F8C99A 40%,#FBE2B8 75%,#FDEFD2 100%)',sun:[262,330,84,'#FFB74D'],cloud:'#FCE1DA',warm:.14}};
function phase(){if(S.gardenTime&&S.gardenTime!=='auto')return S.gardenTime;const h=new Date().getHours();return h>=6&&h<11?'morning':h>=11&&h<17?'day':'dusk'}
const rnd=(i,a,b)=>a+((Math.sin(i*12.9898)*43758.5453)%1+1)%1*(b-a);
function piece(p,i,cls,extra=''){return `<div class="gp ${cls}" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;--d:${rnd(i,3.6,6.2).toFixed(2)}s;--dl:-${rnd(i+7,0,5).toFixed(2)}s;--a:${rnd(i+3,2,4.5).toFixed(1)}deg" ${extra}>${p.svg}</div>`}
function scene(o={}){const g=G(),ph=PHASES[phase()];const empty=!!o.empty;const P=g.pieces||[];
 const by=n=>P.filter(p=>p.g===n);const clouds=by('Clouds');
 const cloud=(a,b,i)=>`<div class="gcloud" style="--cd:${i?150:120}s;--cdl:-${i?75:55}s;top:${Math.min(a.y,b.y)}px;left:0"><div style="position:relative;left:${a.x}px">${[a,b].map(c=>`<div style="position:absolute;left:${c.x-a.x}px;top:${c.y-Math.min(a.y,b.y)}px;width:${c.w}px;height:${c.h}px">${c.svg.replace(/fill="white"/g,`fill="${ph.cloud}"`)}</div>`).join('')}</div></div>`;
 const [sx,sy,ss,sc]=ph.sun;
 let h=`<div class="gwrap living" data-phase="${phase()}" style="position:absolute;left:50%;top:50%;width:393px;height:852px;${o.offsetY?`margin-top:${o.offsetY}px;`:''}">
 <div class="gsky" style="background:${ph.sky}"></div>
 <div class="gsun" style="left:${sx}px;top:${sy}px;width:${ss}px;height:${ss}px;background:${sc}"></div>
 ${clouds.length>=4?cloud(clouds[0],clouds[1],0)+cloud(clouds[2],clouds[3],1):''}
 <div class="layer">${g.land||''}</div><div class="gground"></div>
 ${by('Grass · hills').map((p,i)=>piece(p,i+40,'sway grass','data-act="gGrass"')).join('')}
 ${by('Grass · ground').map((p,i)=>piece(p,i+60,'sway grass','data-act="gGrass"')).join('')}`;
 if(!empty){h+=`<div class="layer gfeeder">${g.feeder||''}</div>
  <div class="layer gbird">${g['v-bird']||''}</div>
  <div class="layer gbutterfly"><div class="flap">${g['v-butterfly']||''}</div></div>
  <div class="layer gbee"><div class="bob">${g['v-bee']||''}</div></div>
  ${by('Flowers · back row').map((p,i)=>piece(p,i,'sway flower',`data-act="gFlower" data-arg="${p.n}" role="button" aria-label="${p.n}"`)).join('')}
  ${by('Flowers · front row').map((p,i)=>piece(p,i+20,'sway flower front',`data-act="gFlower" data-arg="${p.n}" role="button" aria-label="${p.n}"`)).join('')}
  <button class="ghit" style="left:20px;top:330px;width:80px;height:70px" data-act="gBird" aria-label="Robin"></button>
  <button class="ghit" style="left:160px;top:318px;width:44px;height:44px" data-act="gButterfly" aria-label="Butterfly"></button>
  <button class="ghit" style="left:266px;top:426px;width:40px;height:36px" data-act="gBee" aria-label="Bee"></button>`}
 h+=`<div class="layer gnext">${g.next||''}</div>${ph.warm?`<div class="gwarm" style="opacity:${ph.warm}"></div>`:''}`;
 if(o.bubble!==false){const pct=empty?0:Math.min(100,S.garden);h+=`<div class="next-bubble" data-act="nextFlower" role="button" aria-label="Next flower: ${100-pct} more sparks"><div class="row">${ic('UI/Garden','s16')}Next flower</div><div class="bar"><i style="width:${pct}%"></i></div></div>`}
 return h+'</div>'}

/* GA2 · tap reactions */
function flash(el,cls,ms){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),ms)}
let ac;function chirp(){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const t=ac.currentTime;[0,.14].forEach(d=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(2600,t+d);o.frequency.exponentialRampToValueAtTime(4200,t+d+.08);g.gain.setValueAtTime(.0001,t+d);g.gain.exponentialRampToValueAtTime(.08,t+d+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d+.1);o.connect(g).connect(ac.destination);o.start(t+d);o.stop(t+d+.12)})}catch(e){}}
ACTIONS.gFlower=(k,el)=>{flash(el,'boing',600);setTimeout(()=>sheet('plant',k||'Sunflower'),380)};
ACTIONS.gBird=()=>{flash(document.querySelector('.gbird'),'hop',700);chirp();setTimeout(()=>sheet('visitor'),650)};
ACTIONS.gBee=()=>flash(document.querySelector('.gbee'),'zip',1600);
ACTIONS.gButterfly=()=>flash(document.querySelector('.gbutterfly'),'away',2200);
ACTIONS.gGrass=(a,el,e)=>{const w=el.closest('.gwrap');if(!w)return;const r=w.getBoundingClientRect();const s=r.width/393;const x=(e.clientX-r.left)/s,y=(e.clientY-r.top)/s;
 flash(el,'rustle',700);for(let i=0;i<6;i++){const d=document.createElement('i');d.className='gspark';d.style.left=x+'px';d.style.top=y+'px';d.style.setProperty('--tx',(Math.cos(i)*26)+'px');d.style.setProperty('--ty',(-18-Math.sin(i*2)*14)+'px');d.innerHTML=ic('UI/Sparks','s16');w.appendChild(d);setTimeout(()=>d.remove(),900)}};
document.addEventListener('visibilitychange',()=>document.body.classList.toggle('bg-paused',document.hidden));
window.GARDEN_SCENE=scene;
})();
