document.addEventListener('DOMContentLoaded',()=>{
const total=7;const screens=[...Array(total)].map((_,i)=>document.getElementById('screen'+i));
let currentScreen=0;

// Cursor
const cg=document.getElementById('cursorGlow');let mx=0,my=0,gx=0,gy=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cg.style.opacity='1'});
(function ag(){gx+=(mx-gx)*.12;gy+=(my-gy)*.12;cg.style.left=gx+'px';cg.style.top=gy+'px';requestAnimationFrame(ag)})();

// Particles
const pc=document.getElementById('particlesContainer');const syms=['⭐','✨','🎂','🎁','🎈','🎉','💫','🌟'];
function mkP(){const p=document.createElement('span');p.className='floating-particle';p.textContent=syms[Math.random()*syms.length|0];
p.style.setProperty('--sz',(Math.random()*16+12)+'px');p.style.setProperty('--left',Math.random()*100+'%');
p.style.setProperty('--dur',(Math.random()*8+8)+'s');p.style.setProperty('--del',(Math.random()*5)+'s');
p.style.setProperty('--op',(Math.random()*.4+.15).toFixed(2));p.style.setProperty('--rot',(Math.random()*60-30)+'deg');
pc.appendChild(p);setTimeout(()=>p.remove(),20000)}
for(let i=0;i<10;i++)setTimeout(mkP,i*400);setInterval(mkP,2500);

// Sparkles
const sc=document.getElementById('sparklesContainer');
function mkS(){const s=document.createElement('span');s.className='sparkle';s.style.setProperty('--sz',(Math.random()*5+3)+'px');
s.style.setProperty('--left',Math.random()*100+'%');s.style.setProperty('--top',Math.random()*100+'%');
s.style.setProperty('--dur',(Math.random()*3+2)+'s');s.style.setProperty('--del',(Math.random()*4)+'s');
sc.appendChild(s);setTimeout(()=>s.remove(),10000)}
for(let i=0;i<15;i++)mkS();setInterval(mkS,1500);

// Sakura petals
const petC=document.getElementById('petalsContainer');const petalSyms=['🌸','🏵️','💮','✿'];
function mkPetal(){const p=document.createElement('span');p.className='petal';
p.textContent=petalSyms[Math.random()*petalSyms.length|0];
p.style.setProperty('--sz',(Math.random()*14+12)+'px');p.style.setProperty('--left',Math.random()*100+'%');
p.style.setProperty('--dur',(Math.random()*6+6)+'s');p.style.setProperty('--del',(Math.random()*8)+'s');
p.style.setProperty('--sway',(Math.random()*80-40)+'px');
petC.appendChild(p);setTimeout(()=>p.remove(),20000)}
for(let i=0;i<20;i++)setTimeout(()=>mkPetal(),i*500);setInterval(mkPetal,1200);

// Navigation
window.goToScreen=function(idx){
if(idx<0||idx>=total||idx===currentScreen)return;
// Pause sakura audio when leaving screen 5
if(currentScreen===5){const sa=document.getElementById('sakuraAudio');sa.pause();document.getElementById('sakuraPlayBtn').textContent='▶'}
// Pause gift audio when leaving screen 6
if(currentScreen===6){
    const ga=document.getElementById('giftAudio');
    if(!ga.paused){ga.pause();document.getElementById('playPauseBtn').textContent='▶';document.getElementById('vinylDisc').classList.remove('spinning');clearInterval(noteInterval);noteInterval=null}
}
screens[currentScreen].classList.remove('active');currentScreen=idx;
screens[idx].classList.add('active');
document.body.style.overflow=(idx===0||idx===1)?'hidden':'auto';
const inner=screens[idx].querySelector('.screen-inner');if(inner)inner.scrollTop=0;
setTimeout(()=>{screens[idx].querySelectorAll('.aoe').forEach((el,i)=>{setTimeout(()=>el.classList.add('visible'),i*120)})},300);
// Autoplay sakura audio when entering screen 5
if(idx===5){setTimeout(()=>{const sa=document.getElementById('sakuraAudio');sa.play().then(()=>{document.getElementById('sakuraPlayBtn').textContent='⏸'}).catch(()=>{})},800)}
};

// Open surprise → go to riddle
document.getElementById('btnOpen').addEventListener('click',()=>{
burst(window.innerWidth/2,window.innerHeight/2);confetti();
setTimeout(()=>goToScreen(1),800);
});

// ── RIDDLE LOGIC ──
const riddleInput=document.getElementById('riddleInput');
const riddleSubmit=document.getElementById('riddleSubmit');
const riddleHint=document.getElementById('riddleHint');
const gateOverlay=document.getElementById('gateOverlay');
const acceptedAnswers=['little sister','friend','sister','lil sister','choti sister','best friend','moti','bahana'];
let riddleSolved=false;

riddleSubmit.addEventListener('click',checkRiddle);
riddleInput.addEventListener('keydown',e=>{if(e.key==='Enter')checkRiddle()});

function checkRiddle(){
if(riddleSolved)return;
const answer=riddleInput.value.trim().toLowerCase();
if(!answer){riddleHint.textContent='Type something first! 😊';riddleHint.className='riddle-hint wrong';return}
if(acceptedAnswers.some(a=>answer.includes(a))){
riddleSolved=true;
riddleHint.textContent='Correct! 🎉 You know it!';
riddleHint.className='riddle-hint correct';
riddleInput.style.borderColor='#4CAF50';
// Trigger gate animation
setTimeout(()=>{
gateOverlay.classList.add('active');
burst(window.innerWidth/2,window.innerHeight/2);
},800);
setTimeout(()=>{
gateOverlay.classList.add('opening');
confetti();
},2500);
setTimeout(()=>{
goToScreen(2);
gateOverlay.classList.remove('active','opening');
},4200);
}else{
riddleHint.textContent='Hmm, not quite... try again! 💭';
riddleHint.className='riddle-hint wrong';
// Re-trigger shake
riddleHint.style.animation='none';
riddleHint.offsetHeight;
riddleHint.style.animation='';
riddleInput.style.borderColor='#e74c6f';
setTimeout(()=>{riddleInput.style.borderColor='rgba(255,111,165,.3)'},1500);
}
}

// Burst
const bc=document.getElementById('burstContainer');
function burst(cx,cy){const cols=['#FF6FA5','#FFB6D9','#FFD6E7','#F8B6CC','#fff','#FFD700'];
for(let i=0;i<40;i++){const p=document.createElement('div');p.className='burst-particle';
const sz=Math.random()*10+4,a=(Math.PI*2*i)/40,d=Math.random()*200+80;
p.style.cssText=`width:${sz}px;height:${sz}px;left:${cx}px;top:${cy}px;background:${cols[Math.random()*cols.length|0]}`;
p.style.setProperty('--tx',Math.cos(a)*d+'px');p.style.setProperty('--ty',Math.sin(a)*d+'px');
p.style.setProperty('--dur',(Math.random()*.8+.5)+'s');bc.appendChild(p);setTimeout(()=>p.remove(),1500)}}

// Confetti
function confetti(){const cols=['#FF6FA5','#FFD700','#FF8FBB','#6B2E46','#F8B6CC','#FFB6D9','#fff'];
for(let i=0;i<60;i++){const c=document.createElement('div');c.className='confetti-piece';
c.style.setProperty('--w',(Math.random()*8+4)+'px');c.style.setProperty('--h',(Math.random()*12+6)+'px');
c.style.setProperty('--c',cols[Math.random()*cols.length|0]);c.style.setProperty('--left',Math.random()*100+'%');
c.style.setProperty('--dur',(Math.random()*2+2)+'s');c.style.setProperty('--del',Math.random()+'s');
c.style.setProperty('--rot',(Math.random()*720-360)+'deg');document.body.appendChild(c);setTimeout(()=>c.remove(),5000)}}

// Heart likes
document.addEventListener('click',e=>{if(e.target.classList.contains('pin-heart')){const b=e.target;
if(b.textContent==='♡'){b.textContent='♥';b.style.background='#FF6FA5';b.style.color='#fff';
const r=b.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2)}
else{b.textContent='♡';b.style.background='rgba(255,255,255,.85)';b.style.color='#FF6FA5'}}});

// Letters
window.openLetter=id=>document.getElementById(id).classList.add('open');
window.closeLetter=id=>document.getElementById(id).classList.remove('open');

// BG Music
let bgCtx=null,bgPlaying=false;
window.toggleBgMusic=function(){const bars=document.querySelector('.eq-bars');
if(bgPlaying){if(bgCtx)bgCtx.close();bgCtx=null;bgPlaying=false;bars.classList.remove('playing');return}
bgPlaying=true;bars.classList.add('playing');
bgCtx=new(window.AudioContext||window.webkitAudioContext)();
function loop(){if(!bgPlaying)return;
const ns=[349.2,440,523.3,440,349.2,293.7,349.2,392];let t=bgCtx.currentTime;
ns.forEach(f=>{const o=bgCtx.createOscillator(),g=bgCtx.createGain();o.type='triangle';o.frequency.value=f;
g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.01,t+.9);
o.connect(g);g.connect(bgCtx.destination);o.start(t);o.stop(t+1);t+=1});setTimeout(loop,ns.length*1000)}loop()};

// ── GIFT AUDIO + KARAOKE LYRICS ──
const ga=document.getElementById('giftAudio'),ppb=document.getElementById('playPauseBtn');
const pf=document.getElementById('progressFill'),ctEl=document.getElementById('currentTime'),ttEl=document.getElementById('totalTime');
const vd=document.getElementById('vinylDisc');
ga.addEventListener('loadedmetadata',()=>{ttEl.textContent=fmt(ga.duration)});
ga.addEventListener('ended',()=>{ppb.textContent='▶';vd.classList.remove('spinning');clearInterval(noteInterval);noteInterval=null;resetLyrics()});
window.toggleGiftSong=function(){
    if(ga.paused){
        ga.play();ppb.textContent='⏸';vd.classList.add('spinning');startNotes();
    } else {
        ga.pause();ppb.textContent='▶';vd.classList.remove('spinning');clearInterval(noteInterval);noteInterval=null;
    }
};
window.seekAudio=function(e){
    const bar=document.getElementById('progressBar');
    if(ga.duration){
        ga.currentTime=((e.clientX-bar.getBoundingClientRect().left)/bar.offsetWidth)*ga.duration;
        currentLyricIdx=-1; // force re-sync on seek
    }
};

// Karaoke lyrics sync
const lyricsContainer=document.getElementById('lyricsContainer');
const lyricLines=lyricsContainer?[...lyricsContainer.querySelectorAll('.lyric-line')]:[];
let currentLyricIdx=-1;

function syncLyrics(currentTime){
    let activeIdx=-1;
    for(let i=lyricLines.length-1;i>=0;i--){
        const t=parseFloat(lyricLines[i].dataset.time);
        if(currentTime>=t){activeIdx=i;break}
    }
    if(activeIdx===currentLyricIdx)return;
    currentLyricIdx=activeIdx;

    lyricLines.forEach((line,i)=>{
        line.classList.remove('active','passed');
        if(i===activeIdx){
            line.classList.add('active');
            // Auto-scroll to keep active line centered in container
            const container=lyricsContainer;
            const lineTop=line.offsetTop;
            const lineHeight=line.offsetHeight;
            const containerHeight=container.clientHeight;
            const scrollTarget=lineTop - containerHeight/2 + lineHeight/2;
            container.scrollTo({top:Math.max(0,scrollTarget),behavior:'smooth'});
        } else if(i<activeIdx){
            line.classList.add('passed');
        }
    });
}

function resetLyrics(){
    currentLyricIdx=-1;
    lyricLines.forEach(line=>{line.classList.remove('active','passed')});
    if(lyricsContainer)lyricsContainer.scrollTo({top:0,behavior:'smooth'});
}

ga.addEventListener('timeupdate',()=>{
    if(ga.duration){
        pf.style.width=(ga.currentTime/ga.duration*100)+'%';
        ctEl.textContent=fmt(ga.currentTime);
        syncLyrics(ga.currentTime);
    }
});

// Floating music notes while song plays
let noteInterval=null;
const noteSyms=['♪','♫','♬','🎵','🎶','💖','✨'];
function spawnMusicNote(){
    const card=document.querySelector('.lyrics-card');
    if(!card)return;
    const note=document.createElement('span');
    note.className='music-note-particle';
    note.textContent=noteSyms[Math.random()*noteSyms.length|0];
    note.style.left=Math.random()*80+10+'%';
    note.style.bottom='10px';
    note.style.setProperty('--rot',(Math.random()*40-20)+'deg');
    note.style.setProperty('--tx',(Math.random()*80-40)+'px');
    card.appendChild(note);
    setTimeout(()=>note.remove(),3200);
}
function startNotes(){if(!noteInterval)noteInterval=setInterval(spawnMusicNote,800)}

// Sakura audio
const sa=document.getElementById('sakuraAudio'),spb=document.getElementById('sakuraPlayBtn');
const sf=document.getElementById('sakuraFill'),stEl=document.getElementById('sakuraTime');
sa.addEventListener('timeupdate',()=>{if(sa.duration){sf.style.width=(sa.currentTime/sa.duration*100)+'%';stEl.textContent=fmt(sa.currentTime)}});
sa.addEventListener('ended',()=>{spb.textContent='▶'});
window.toggleSakuraAudio=function(){if(sa.paused){sa.play();spb.textContent='⏸'}else{sa.pause();spb.textContent='▶'}};
window.seekSakura=function(e){const bar=document.getElementById('sakuraBar');if(sa.duration)sa.currentTime=((e.clientX-bar.getBoundingClientRect().left)/bar.offsetWidth)*sa.duration};

function fmt(s){const m=Math.floor(s/60),sec=Math.floor(s%60);return m+':'+(sec<10?'0':'')+sec}
document.body.style.overflow='hidden';
});
