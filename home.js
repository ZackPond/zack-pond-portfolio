// V13: precise menu affordances, contextual destination feedback, and cinematic navigation.
(()=>{
 const scene=document.querySelector('.scene'), hint=document.getElementById('navHint'),pointer=document.getElementById('magicPointer');
 const zones=[...document.querySelectorAll('.zone')];
 if(!scene || !hint) return;
 const names={
 'z-home':['HOME','Return to the beginning'], 'z-realm':['THE ARCHIVES','Browse every project'],
 'z-citadel-nav':['THE CITADEL','Software & systems'], 'z-arena-nav':['THE ARENA','Games & gameplay'],
 'z-workshop-nav':['THE WORKSHOP','Web & interaction'],
 'z-citadel':['THE CITADEL','Explore software development'],'z-arena':['THE ARENA','Explore games'],
 'z-workshop':['THE WORKSHOP','Explore interactive web'],
 'z-archives':['THE ARCHIVES','Browse every project'],'z-start':['BEGIN THE JOURNEY','Browse the Archives'],
 'z-featured':['LANTERN DRIFT','Inspect featured game'],'z-paradox':['PROJECT PARADOX','Inspect game'],
 'z-shorts':['SHORTS CLIP STUDIO','Inspect software'],'z-dnd':['D&D COMPANION','Inspect application'],
 'z-minigame':['MINIGAME ROYALE','Inspect tabletop game'],'z-itch':['ITCH.IO','Play published games'],
 'z-linkedin':['LINKEDIN','Profile to be added'],'z-youtube':['YOUTUBE','Channel to be added'],
 'z-latest':['ALL PROJECTS','Explore the full library']};
 let active=null;
 function show(el){active=el;const entry=Object.entries(names).find(([c])=>el.classList.contains(c));if(!entry)return;
  hint.replaceChildren();const title=document.createElement('strong'),desc=document.createElement('span');title.textContent=entry[1][0];desc.textContent=entry[1][1];hint.append(title,desc);hint.classList.add('visible');scene.classList.add('is-inspecting');
  const b=el.getBoundingClientRect(),s=scene.getBoundingClientRect();
  let x=Math.max(8,Math.min(77,100*(b.left+b.width/2-s.left)/s.width));
  let y=100*(b.top-s.top)/s.height;
  hint.style.left=x+'%';hint.style.top=(y>19?y-7:y+9)+'%';
 }
 function hide(el){if(active!==el)return; active=null;hint.classList.remove('visible');scene.classList.remove('is-inspecting');}
 zones.forEach(el=>{el.addEventListener('pointerenter',()=>show(el));el.addEventListener('pointerleave',()=>hide(el));el.addEventListener('focus',()=>show(el));el.addEventListener('blur',()=>hide(el));el.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||el.target==='_blank')return;document.body.classList.add('is-departing');});});
 let raf=0;scene.addEventListener('pointermove',e=>{if(!pointer||document.body.classList.contains('still'))return;cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const b=scene.getBoundingClientRect();pointer.style.left=(e.clientX-b.left)+'px';pointer.style.top=(e.clientY-b.top)+'px';});},{passive:true});
 scene.addEventListener('pointerleave',()=>{if(pointer)pointer.style.opacity='0'});
 scene.addEventListener('pointerenter',()=>{if(pointer)pointer.style.opacity='1'});
 document.addEventListener('keydown',e=>{if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;const i=zones.indexOf(document.activeElement);if(i<0)return;e.preventDefault();zones[(i+(e.key==='ArrowRight'?1:-1)+zones.length)%zones.length].focus();});
 window.addEventListener('pageshow',()=>document.body.classList.remove('is-departing'));
})();


// V90: A separate, fixed copy of the real crest and navigation keeps the artwork
// and the scene's absolute-positioned overlays in their original coordinates.
(()=>{
 const source=document.querySelector('.scene .crisp-ui');if(!source)return;
 const mast=document.createElement('header');mast.className='home-fixed-navigation';
 mast.setAttribute('aria-label','Persistent site navigation');
 for(const selector of ['.crisp-brand','.crisp-nav']){
  const element=source.querySelector(selector);if(!element)continue;
  const clone=element.cloneNode(true);clone.removeAttribute('id');mast.appendChild(clone);
  element.setAttribute('aria-hidden','true');element.setAttribute('inert','');
 }
 document.body.insertBefore(mast,document.body.firstChild);
})();


// V178 — restrained navy-blue particles tracking the pointer, homepage only.
(()=>{
 if(!document.body.classList.contains('home') || !window.matchMedia('(pointer:fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const canvas=document.createElement('canvas');canvas.className='home-cursor-motes';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);
 const ctx=canvas.getContext('2d');if(!ctx)return;
 let w=0,h=0,dpr=1,raf=0,last=0,active=false,px=0,py=0,prevX=0,prevY=0;
 const motes=[];const rand=(a,b)=>a+Math.random()*(b-a);
 function resize(){dpr=Math.min(window.devicePixelRatio||1,2);w=innerWidth;h=innerHeight;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
 resize();addEventListener('resize',resize,{passive:true});
 function add(x,y){if(motes.length>46)motes.shift();motes.push({x:x+rand(-7,7),y:y+rand(-7,7),vx:rand(-.42,.42),vy:rand(-.52,.16),r:rand(1.2,2.5),life:rand(26,44),max:44})}
 function move(e){px=e.clientX;py=e.clientY;active=true;if(Math.hypot(px-prevX,py-prevY)>4){for(let i=0;i<2;i++)add(px,py);prevX=px;prevY=py}if(!raf)raf=requestAnimationFrame(draw)}
 function draw(t){raf=0;const dt=Math.min(2,(t-last||16)/16);last=t;ctx.clearRect(0,0,w,h);
  if(active && motes.length<25)add(px,py);
  for(let i=motes.length-1;i>=0;i--){const p=motes[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
   if(p.life<=0){motes.splice(i,1);continue}
   // Dark midnight-blue body, luminous electric-blue center, and a small
   // high-contrast halo. Layered radial gradients are easier to see on the
   // pale painting than CSS-style shadows alone.
   const a=Math.min(1,(p.life/p.max)*1.6);
   const radius=p.r*5.4;
   const halo=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,radius);
   halo.addColorStop(0,`rgba(95,190,255,${a})`);
   halo.addColorStop(.16,`rgba(47,123,237,${a*.92})`);
   halo.addColorStop(.34,`rgba(18,69,156,${a*.9})`);
   halo.addColorStop(.65,`rgba(12,43,107,${a*.62})`);
   halo.addColorStop(1,'rgba(0,6,39,0)');
   ctx.fillStyle=halo;ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.fill();
   ctx.fillStyle=`rgba(17,54,126,${a})`;
   ctx.beginPath();ctx.arc(p.x,p.y,p.r*1.4,0,Math.PI*2);ctx.fill();
   ctx.fillStyle=`rgba(51,160,255,${a})`;
   ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.9,p.r*.76),0,Math.PI*2);ctx.fill();
   ctx.fillStyle=`rgba(225,247,255,${a})`;
   ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.65,p.r*.31),0,Math.PI*2);ctx.fill();
  }ctx.shadowBlur=0;
  if(motes.length||active)raf=requestAnimationFrame(draw);
 }
 addEventListener('pointermove',move,{passive:true});
 document.addEventListener('pointerleave',()=>{active=false});
 addEventListener('blur',()=>{active=false});
})();


