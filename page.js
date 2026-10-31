(()=>{const D=window.PORTFOLIO;const cats={games:['The Arena','Game Design & Development','Gameplay mechanics, environmental systems, simulations, prototypes, and analog game design.'],software:['The Citadel','Software & Systems','Purpose-built applications, creator tools, workflow systems, and practical engineering.'],web:["The Enchanter’s Workshop",'','Interactive websites, experimental frontend experiences, and interface systems.']};const escape=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const ensureModelViewer=()=>{if(window.__mvLoaded)return;window.__mvLoaded=true;const s=document.createElement('script');s.type='module';s.src='https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';document.head.appendChild(s);};
// Each model selects its own visitor-invisible presentation settings.
const MODEL_VIEW_PRESETS=Object.freeze({
 object:{exposure:0.55,shadowIntensity:1.6,environmentImage:'neutral',autoRotate:true,rotationPerSecond:'18deg'},
 material:{exposure:1.0,shadowIntensity:0.9,environmentImage:'neutral',autoRotate:true,rotationPerSecond:'18deg'}
});
const modelViewerAttrs=p=>{const mode=p.viewingMode==='material'?'material':'object';const preset={...MODEL_VIEW_PRESETS[mode],...(p.viewerSettings||{})};const exposure=Math.max(0,Math.min(2,Number(preset.exposure)||0));const shadow=Math.max(0,Math.min(2,Number(preset.shadowIntensity)||0));return `data-viewing-mode=\"${mode}\" exposure=\"${exposure}\" shadow-intensity=\"${shadow}\" environment-image=\"neutral\" ${preset.autoRotate?'auto-rotate':''} rotation-per-second=\"${escape(preset.rotationPerSecond)}\"`;};
const modelAnimationAttrs=p=>p.animation?` animation-name="${escape(p.animation.clip||'')}" data-animation-speed="${Math.max(0.1,Math.min(2,Number(p.animation.timeScale)||1))}" ${p.animation.autoplay?'autoplay':''} ${p.animation.loop?'loop':''}`:'';
const modelAnimationControl=p=>p.animation?`<div class="workshop-animation-controls"><button type="button" class="workshop-play-toggle" aria-label="${p.animation.autoplay?'Pause':'Play'} ${escape(p.name)} animation" aria-pressed="${p.animation.autoplay?'true':'false'}">${p.animation.autoplay?'❚❚ Pause animation':'▶ Play animation'}</button></div>`:'';
const wireAnimationControls=root=>{if(!root)return;root.querySelectorAll('model-viewer').forEach(viewer=>{const control=viewer.closest('.model-stage, .detail-art')?.querySelector('.workshop-play-toggle');if(!control)return;const setPlaying=on=>{if(on){viewer.play({repetitions:Infinity});control.textContent='❚❚ Pause animation'}else{viewer.pause();control.textContent='▶ Play animation'}control.setAttribute('aria-pressed',String(on));control.setAttribute('aria-label',(on?'Pause':'Play')+' animation')};control.addEventListener('click',()=>setPlaying(control.getAttribute('aria-pressed')!=='true'));viewer.addEventListener('load',()=>{viewer.timeScale=Number(viewer.dataset.animationSpeed)||1;const autoplay=viewer.hasAttribute('autoplay');if(autoplay)setPlaying(true);else setPlaying(false);});})};
const workshopPurpose=p=>({
 'head-bust':'CHARACTER SCULPTING & FORM STUDY',
 'panda':'CHARACTER MODELING STUDY',
 'loki-voli':'CHARACTER MODELING & MATERIAL STUDY',
 'ball-into-castle':'3D ANIMATION & PHYSICS STUDY',
 'blender-robot':'HARD-SURFACE MODELING STUDY',
 'moon-jellyfish-webgl':'PROCEDURAL ANIMATION & SHADER STUDY',
 'solar-system-lighting-webgl':'REAL-TIME LIGHTING & SHADER STUDY',
 'lives-rediscovered':'INTERACTIVE EXPERIENCE MAP',
 'decked-out-home':'THREE-PAGE CAPSTONE WEBSITE',
 'decked-out-project':'WEBSITE CONTENT & LAYOUT DESIGN',
 'decked-out-timeline':'WEBSITE TIMELINE DESIGN'
})[p.id]||(p.website?'WEBSITE DESIGN SHOWCASE':p.webgl?'WEBGL GRAPHICS STUDY':'3D MODELING STUDY');
const webglFeature=p=>`<section class="model-feature webgl-feature"><div class="model-feature-copy"><span class="eyebrow">${escape(workshopPurpose(p))}</span><h2>${escape(p.name)}</h2><p>${escape(p.summary)}</p><div class="chips">${(p.tools||[]).map(t=>`<span>${escape(t)}</span>`).join('')}</div><div class="model-feature-actions"><a class="cta" href="project.html?id=${encodeURIComponent(p.id)}">Inspect full details ↗</a></div></div><div class="model-stage webgl-stage"><div class="webgl-player-shell"><iframe class="workshop-webgl-frame" title="${escape(p.name)} interactive WebGL experience" src="${escape(p.webgl)}" loading="lazy" allow="fullscreen" allowfullscreen></iframe></div><div class="workshop-webgl-actions"><button type="button" class="workshop-fullscreen-button">⛶ Enter fullscreen experience</button><a href="${escape(p.webgl)}" target="_blank" rel="noopener noreferrer">Open in new tab ↗</a></div><div class="model-stage-note">${escape(p.webglNote||"Click inside to use arrow keys to orbit / tilt · W / S to zoom · R to reset · Use the on-screen palette and lighting controls")}</div></div></section>`;
const websiteFeature=p=>{
 const deck=!!p.deckedSection;
 const deoPages=[{label:'Homepage',url:'https://sce.nau.edu/capstone/projects/CS/2026/DeckedOut_F25/'},{label:'Project',url:'https://sce.nau.edu/capstone/projects/CS/2026/DeckedOut_F25/project.html'},{label:'Timeline',url:'https://sce.nau.edu/capstone/projects/CS/2026/DeckedOut_F25/timeline.html'}];
 const window=deck?`<div class="decked-real-site-crop" aria-label="Fixed preview of the selected original DeckedOut website section"><iframe class="decked-real-site-frame" tabindex="-1" src="${escape(p.website)}" title="Original website page: ${escape(p.name)}" loading="lazy" allow="fullscreen" allowfullscreen></iframe></div>`:`<div class="education-full-map"><iframe title="Complete original Lives Rediscovered interactive education map" src="assets/lives-rediscovered/education-showcase.html" loading="lazy" allowfullscreen></iframe></div>`;
 const details=deck?`<div class="website-highlight-details"><span class="eyebrow">ORIGINAL WEBSITE · THREE-PAGE EXHIBIT</span><h3>${escape(p.name)}</h3><p>A fixed, non-scrollable view of this original website section. Open the full page to explore it.</p></div>`:`<div class="website-highlight-details"><span class="eyebrow">ORIGINAL INTERACTIVE WEBSITE FEATURE</span><h3>Complete Education Journey</h3><p>The full illustrated education map, including its paths, footsteps, and milestone cards.</p></div>`;
 return `<section class="model-feature website-feature website-highlights"><div class="model-feature-copy"><span class="eyebrow">${escape(workshopPurpose(p))}</span><h2>${escape(p.name)}</h2><p>${escape(p.summary)}</p><div class="chips">${(p.tools||[]).map(t=>`<span>${escape(t)}</span>`).join('')}</div><div class="model-feature-actions"><a class="cta" href="project.html?id=${encodeURIComponent(p.id)}">Inspect full details ↗</a></div></div><div class="model-stage website-stage">${deck?`<nav class="deo-page-nav" aria-label="DeO website pages">${deoPages.map((page,i)=>`<button type="button" class="deo-page-button" data-deo-page="${i}" aria-pressed="${i===0}">${page.label}</button>`).join('')}</nav>`:''}<div class="website-highlight-window"><div class="website-browser-bar"><span class="website-browser-dot"></span><span class="website-browser-dot"></span><span class="website-browser-dot"></span><span class="website-browser-address">${deck?escape(p.name).toUpperCase():'EXPERIENCE MAP · INTERACTIVE WEBSITE'}</span></div>${window}${details}</div><div class="workshop-webgl-actions"><a href="${escape(p.website)}" target="_blank" rel="noopener noreferrer">${deck?'Open this full page ↗':'Explore complete website ↗'}</a>${deck?`<a href="https://sce.nau.edu/capstone/projects/CS/2026/DeckedOut_F25/" target="_blank" rel="noopener noreferrer">DeckedOut website home ↗</a>`:''}</div><div class="model-stage-note">${deck?'Choose Homepage, Project or Timeline above to switch pages. Scrolling inside the preview is disabled. Use the full-page link to explore. If NAU disallows embedding, use that link instead.':'Original education-map animation and interaction from the supplied website.'}</div></div></section>`;
};
const wireWebsiteHighlights=root=>{
 if(!root)return;
 const buttons=[...root.querySelectorAll('[data-deo-page]')];if(!buttons.length)return;
 const frame=root.querySelector('.decked-real-site-frame');const fullLink=root.querySelector('.website-stage .workshop-webgl-actions a');
 const address=root.querySelector('.website-browser-address');const pageTitle=root.querySelector('.website-highlight-details h3');
 const pages=[['Homepage','https://sce.nau.edu/capstone/projects/CS/2026/DeckedOut_F25/'],['Project','https://sce.nau.edu/capstone/projects/CS/2026/DeckedOut_F25/project.html'],['Timeline','https://sce.nau.edu/capstone/projects/CS/2026/DeckedOut_F25/timeline.html']];
 buttons.forEach(button=>button.addEventListener('click',()=>{
  const index=Number(button.dataset.deoPage);const [label,url]=pages[index];
  frame.src=url;frame.title='DeO — '+label;fullLink.href=url;address.textContent='DeO — '+label.toUpperCase();pageTitle.textContent='DeO — '+label;
  buttons.forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
 }));
};
const workshopFeature=p=>`<div class="workshop-stage-heading"><span class="workshop-stage-kind">${escape(workshopPurpose(p))}</span><h2 class="workshop-stage-name">${escape(p.name)}</h2></div>${p.website?websiteFeature(p):p.webgl?webglFeature(p):modelFeature(p)}`;
const wireWorkshopFullscreen=root=>{const button=root?.querySelector('.workshop-fullscreen-button');if(!button)return;const frame=root.querySelector('.workshop-webgl-frame');const shell=root.querySelector('.webgl-player-shell');if(!frame||!shell)return;button.addEventListener('click',()=>{if(document.fullscreenElement){document.exitFullscreen?.();return;}if(frame.requestFullscreen){frame.requestFullscreen().catch(()=>shell.requestFullscreen?.().catch(()=>{}));}else shell.requestFullscreen?.().catch(()=>{});});const update=()=>{button.textContent=document.fullscreenElement?'⛶ Exit fullscreen':'⛶ Enter fullscreen experience';};document.addEventListener('fullscreenchange',update,{signal:window.__workshopFullscreenAbort?.signal});};
const modelFeature=p=>`<section class="model-feature"><div class="model-feature-copy"><span class="eyebrow">${escape(workshopPurpose(p))}</span><h2>${escape(p.name)}</h2><p>${escape(p.summary)}</p><div class="chips">${(p.tools||[]).map(t=>`<span>${escape(t)}</span>`).join('')}</div><div class="model-feature-actions"><a class="cta" href="project.html?id=${encodeURIComponent(p.id)}">Inspect full details ↗</a></div></div><div class="model-stage"><model-viewer src="${escape(p.model)}" alt="Interactive 3D model of ${escape(p.name)}" camera-controls touch-action="pan-y" ${modelViewerAttrs(p)}${modelAnimationAttrs(p)} interaction-prompt="auto" ar-status="not-presenting"></model-viewer>${modelAnimationControl(p)}<div class="model-stage-note">Drag to rotate · Scroll / pinch to zoom · Double-click to reset view</div></div></section>`;
const paths=[['index.html','Home'],['software.html','Citadel'],['games.html','Arena'],['web.html','Workshop'],['archives.html','Archives'],['about.html','The Architect'],['contact.html','Contact']];let kind=location.pathname.split('/').pop().replace('.html','')||'archives';let nav=``;document.body.innerHTML=`<div class="inner realm-interior"><a href="#main" class="skip">Skip navigation</a><header class="realm-masthead"><a aria-label="Zack Pond home" class="crisp-brand" href="index.html"><img alt="Zack Pond luminous panda crest" src="assets/official-crest-v27-vivid.png"/><span><strong>ZACK POND</strong><small>GAMES · INTERACTIVE MEDIA · SOFTWARE</small></span></a><nav aria-label="Main navigation" class="crisp-nav"><a aria-current="page" href="index.html"><img alt="" class="nav-emblem" src="assets/herald-home.svg"/><span>Home</span></a><a href="software.html"><img alt="" class="nav-emblem" src="assets/herald-citadel.svg"/><span>Citadel</span><small>Software</small></a><a href="games.html"><img alt="" class="nav-emblem" src="assets/herald-arena.svg"/><span>Arena</span><small>Games</small></a><a href="web.html"><img alt="" class="nav-emblem" src="assets/herald-workshop.svg"/><span>Workshop</span></a><a href="archives.html"><img alt="" class="nav-emblem" src="assets/herald-archives.svg"/><span>Archives</span><small>All Projects</small></a><a href="about.html"><img alt="" class="nav-emblem" src="assets/herald-architect.svg"/><span>The Architect</span><small>About Zack</small></a><a href="contact.html"><img alt="" class="nav-emblem" src="assets/herald-gateway.svg"/><span>The Gateway</span><small>Contact</small></a></nav><button class="realm-menu-button" aria-expanded="false" aria-controls="interiorMenu">☰ Menu</button></header><div class="realm-mobile-menu" id="interiorMenu" hidden>${paths.map(([u,t])=>`<a href="${u}">${t}</a>`).join('')}</div><main id="main"></main></div>`;document.querySelectorAll('.realm-masthead .crisp-nav a').forEach(a=>{if(a.getAttribute('href')===kind+'.html')a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});const main=document.querySelector('main');const heading=(ey,title,descr)=>`<section class="page-intro"><span class="eyebrow">${escape(ey)}</span>${title?`<h1>${escape(title)}</h1>`:''}<p>${escape(descr)}</p></section><div class="silver-rule"></div>`;const realmHeading=(section,realm,description)=>`<section class="realm-unified-intro"><span class="realm-section-name">${escape(section)}</span><h1>${escape(realm)}</h1><p>${escape(description)}</p></section>`;
const regionArt={archives:'archives',games:'arena',software:'citadel',web:'workshop',projects:'archives',about:'hall',contact:'observatory',project:'realm'};
const regionPanel=(k)=>`<div class="destination-scene destination-${regionArt[k]||'realm'}" aria-hidden="true"><img src="assets/home-art.png" alt=""><span class="destination-sigil"><img src="assets/icon-${regionArt[k]||'realm'}.svg" alt=""></span><span class="destination-runes">✦ &nbsp; THE REALM OF CREATION &nbsp; ✦</span></div>`;
const addRegion=(k)=>{const area=regionArt[k]||'realm'; const env=area==='realm'?'observatory':area;document.querySelector('.realm-interior').classList.add('environment-page','environment-'+env);document.body.classList.add('site-environment-'+env);};
const card=p=>`<article class="project-card"><img src="assets/${encodeURIComponent(p.id)}.svg" alt="Concept illustration for ${escape(p.name)}, not a gameplay screenshot" loading="lazy"><div class="copy"><span class="tag">${escape(p.tag)}</span><h3>${escape(p.name)}</h3><p>${escape(p.summary)}</p><a href="project.html?id=${encodeURIComponent(p.id)}">Inspect project ↗</a></div></article>`;const cards=arr=>`<div class="project-grid">${arr.map(card).join('')}</div>`;if(kind==='games'){
 const games=D.projects.filter(p=>p.category==='games');
 // Official itch.io playable iframe URLs can be inserted here by project ID.
 const embeds={
  paradox:{type:'playable',url:'https://itch.io/embed-upload/19989361?color=04006a'},
  jellyfish:{type:'playable',url:'https://itch.io/embed-upload/16820556?color=080168'},
  lantern:{type:'playable',url:'https://itch.io/embed-upload/17009835?color=343d13'},
  timeslio:{type:'playable',url:'https://itch.io/embed-upload/9298335?color=333333'},
  zombie:{type:'playable',url:'https://itch.io/embed-upload/9298311?color=333333'},
  apple:{type:'playable',url:'https://itch.io/embed-upload/16517823?color=72049c'},
  mission:{type:'playable',url:'https://itch.io/embed-upload/17169658?color=09bde8'},
  'tempest-relics':{type:'playable',url:'https://itch.io/embed-upload/20044552?color=333333'},
  'iron-tide':{type:'github-pages',url:'https://oracle451.github.io/IMG-421-Final-Project/'}
 };
 const safeEmbed=id=>{const value=embeds[id];if(!value || typeof value.url!=='string')return null;try{const url=new URL(value.url);if(url.protocol!=='https:')return null;if(value.type==='github-pages' && id==='iron-tide' && url.hostname==='oracle451.github.io' && url.pathname==='/IMG-421-Final-Project/')return {...value,url:url.href};if(url.hostname!=='itch.io')return null;if(value.type==='playable' && url.pathname.startsWith('/embed-upload/'))return {...value,url:url.href};if(value.type==='widget' && url.pathname.startsWith('/embed/') && /^\d+$/.test(url.pathname.slice(7)))return {...value,url:url.href};return null}catch{return null}};
 const face=p=>`<article class="arena-cylinder-face" data-game="${escape(p.id)}" aria-hidden="true"><div class="arena-game-heading"><span class="eyebrow">${escape(p.tag)}</span><h1>${escape(p.name)}</h1><p>${escape(p.summary)}</p></div><div class="arena-player-group"><h2>Play the Game</h2><div class="arena-player" data-player="${escape(p.id)}"><div class="arena-player-empty"><img src="assets/${encodeURIComponent(p.id)}.svg" alt=""/><strong>${p.id==='iron-tide'?'Iron Tide · Unity WebGL':'Game player'}</strong><p>${p.id==='iron-tide'?'Select this face to open the Unity WebGL player.':'A playable embed is not yet verified for this game.'}</p><a href="${escape(p.link||D.links.itch)}" target="_blank" rel="noopener noreferrer">View game project ↗</a></div></div></div><section class="arena-development"><h2>Behind the Game</h2><div class="arena-development-grid"><article><h3>The Challenge</h3><p>${escape(p.challenge)}</p></article><article><h3>The Approach</h3><p>${escape(p.approach)}</p></article><article><h3>The Result</h3><p>${escape(p.outcome)}</p></article></div><div class="chips">${p.tools.map(t=>`<span>${escape(t)}</span>`).join('')}</div><a class="arena-more" href="project.html?id=${encodeURIComponent(p.id)}">View full project details ↗</a></section></article>`;
 main.innerHTML=realmHeading("GAMES & PLAY","The Arena","Explore playable games, experiments, and interactive worlds.")+`<section class="arena-showcase" aria-label="Nine-sided rotating game gallery"><div class="arena-stage-nav" aria-label="Game carousel navigation"><button type="button" class="arena-arrow arena-side-arrow" id="arenaPrevious" aria-label="Previous game"><span aria-hidden="true">‹</span></button><div class="arena-cylinder-viewport"><div class="arena-cylinder" id="arenaCylinder">${games.map(face).join('')}</div></div><button type="button" class="arena-arrow arena-side-arrow" id="arenaNext" aria-label="Next game"><span aria-hidden="true">›</span></button></div><nav class="arena-indicators" aria-label="Choose a game">${games.map((p,i)=>`<button type="button" class="arena-indicator" data-arena-index="${i}" aria-label="Show ${escape(p.name)}" aria-current="${i===0?'true':'false'}"><span class="sr-only">${escape(p.name)}</span></button>`).join('')}</nav></section>`;
 const requestedGame=new URLSearchParams(location.search).get('project');
 let selected=Math.max(0,games.findIndex(p=>p.id===requestedGame)),step=selected;
 const cylinder=main.querySelector('#arenaCylinder');const faces=[...cylinder.children];const indicators=[...main.querySelectorAll('.arena-indicator')];
 // Match the actual center-column width; never let the 3D face extend under the arrows.
 const arenaViewport=main.querySelector('.arena-cylinder-viewport');
 const sizeArena=()=>{const width=arenaViewport.clientWidth;if(width>0){main.querySelector('.arena-showcase').style.setProperty('--face-width',width+'px');}};
 sizeArena();
 if(typeof ResizeObserver!=='undefined'){new ResizeObserver(sizeArena).observe(arenaViewport);}else{window.addEventListener('resize',sizeArena,{passive:true});}
 const update=()=>{
   cylinder.style.setProperty('--turn',`${-step*(360/games.length)}deg`);
   const active=((selected%games.length)+games.length)%games.length;
   faces.forEach((el,i)=>{const on=i===active;el.setAttribute('aria-hidden',String(!on));if('inert' in el)el.inert=!on;else{el.querySelectorAll('a,button,iframe').forEach(link=>link.tabIndex=on?0:-1)}});
   indicators.forEach((el,i)=>el.setAttribute('aria-current',String(i===active))); 
   faces.forEach((el,i)=>{const player=el.querySelector('[data-player]');const live=player.querySelector('iframe');if(live && i!==active){live.remove();player.innerHTML=`<div class="arena-player-empty"><img src="assets/${encodeURIComponent(games[i].id)}.svg" alt=""/><strong>Game player</strong><p>Choose this face to view its game.</p><a href="${escape(games[i].link||D.links.itch)}" target="_blank" rel="noopener noreferrer">View game project ↗</a></div>`}});
   const embed=safeEmbed(games[active].id);if(embed){const player=faces[active].querySelector('.arena-player');if(embed.type==='github-pages'){player.innerHTML=`<div class="arena-unity-launch"><strong>IRON TIDE · UNITY WEBGL</strong><p>This game uses a 960 × 600 canvas. Open it in the larger player so the Play and fullscreen controls aren't cut off.</p><button type="button" class="arena-launch-unity" id="arenaLaunchUnity">Play Iron Tide in large view ↗</button><a href="${escape(embed.url)}" target="_blank" rel="noopener noreferrer">Or open the game directly in a new tab ↗</a></div>`}else if(embed.type==='playable'){player.innerHTML=`<iframe src="${escape(embed.url)}" title="Play ${escape(games[active].name)}" allow="fullscreen; gamepad" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`}else{player.innerHTML=`<div class="arena-itch-widget"><p>This game's itch.io embed is a project card, not an in-browser player.</p><iframe src="${escape(embed.url)}" title="${escape(games[active].name)} on itch.io" width="552" height="167" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe><a href="${escape(embed.page)}" target="_blank" rel="noopener noreferrer">View ${escape(games[active].name)} on itch.io ↗</a></div>`}}
 };
 const unityUrl='https://oracle451.github.io/IMG-421-Final-Project/';
 const unityOverlay=document.createElement('div');
 unityOverlay.className='arena-unity-overlay';
 unityOverlay.hidden=true;
 unityOverlay.innerHTML=`<div class="arena-unity-dialog" role="dialog" aria-modal="true" aria-label="Iron Tide game"><div class="arena-unity-dialog-bar"><strong>IRON TIDE · FULL PLAYER</strong><div><button type="button" id="arenaUnityFullscreen">⛶ Fullscreen</button><a href="${unityUrl}" target="_blank" rel="noopener noreferrer">Open in new tab ↗</a><button type="button" id="arenaUnityClose" aria-label="Close game player">✕ Close</button></div></div><div class="arena-unity-frame"></div></div>`;
 document.body.appendChild(unityOverlay);
 const openUnity=()=>{
   unityOverlay.hidden=false;
   document.body.classList.add('arena-unity-open');
   unityOverlay.querySelector('.arena-unity-frame').innerHTML=`<iframe src="${unityUrl}" title="Play Iron Tide" allow="fullscreen; gamepad" allowfullscreen></iframe>`;
   unityOverlay.querySelector('#arenaUnityClose').focus();
 };
 const closeUnity=()=>{
   if(document.fullscreenElement===unityOverlay || document.fullscreenElement===unityOverlay.querySelector('.arena-unity-dialog'))document.exitFullscreen?.();
   unityOverlay.hidden=true;
   unityOverlay.querySelector('.arena-unity-frame').replaceChildren();
   document.body.classList.remove('arena-unity-open');
 };
 main.addEventListener('click',e=>{if(e.target.closest('#arenaLaunchUnity'))openUnity()});
 unityOverlay.querySelector('#arenaUnityClose').addEventListener('click',closeUnity);
 unityOverlay.querySelector('#arenaUnityFullscreen').addEventListener('click',()=>{const dialog=unityOverlay.querySelector('.arena-unity-dialog');if(document.fullscreenElement){document.exitFullscreen?.()}else{dialog.requestFullscreen?.().catch(()=>{})}});
 unityOverlay.addEventListener('click',e=>{if(e.target===unityOverlay)closeUnity()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape' && !unityOverlay.hidden && !document.fullscreenElement)closeUnity()});
 const move=delta=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)cylinder.classList.add('no-motion');step+=delta;selected=((step%games.length)+games.length)%games.length;update()};
 main.querySelector('#arenaPrevious').addEventListener('click',()=>move(-1));main.querySelector('#arenaNext').addEventListener('click',()=>move(1));
 indicators.forEach((btn,i)=>btn.addEventListener('click',()=>{const current=((step%games.length)+games.length)%games.length;const forward=(i-current+games.length)%games.length;const backwards=forward-games.length;step+=Math.abs(backwards)<Math.abs(forward)?backwards:forward;selected=i;update()}));
 main.querySelector('.arena-stage-nav').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}if(e.key==='ArrowRight'){e.preventDefault();move(1)}});
 update();
 if(requestedGame&&games.some(p=>p.id===requestedGame))requestAnimationFrame(()=>main.querySelector('.arena-showcase')?.scrollIntoView({block:'start'}));
}
else if(kind==='web'){
 const c=cats[kind],items=D.projects.filter(p=>p.category==='web'),models=items.filter(p=>p.model||p.webgl||p.website);
 const requestedProject=new URLSearchParams(location.search).get('project');
 const first=models.find(p=>p.id===requestedProject)||models.find(p=>p.id==='head-bust')||models[0];if(first)ensureModelViewer();
 const selectorButtons=models.map((p,i)=>`<button class="clockwork-choice" type="button" data-index="${i}" aria-label="Select ${escape(p.name)}: ${escape(workshopPurpose(p))}" title="${escape(workshopPurpose(p))}" aria-pressed="${p===first}"><span class="clockwork-choice-icon" aria-hidden="true">${p.website?'✦':p.webgl?'✧':'◇'}</span><span class="clockwork-choice-name">${escape(p.name)}</span></button>`).join('');
 main.innerHTML=realmHeading("WEB & INTERACTIVE","The Workshop","Explore websites, 3D work, and interactive experiences.")+(first?`<section class="workshop-clockwork" aria-label="Clockwork gallery of interactive exhibits"><div class="clockwork-machine"><div class="clockwork-machine-heading"><span class="eyebrow">THE CLOCKWORK EXHIBITION</span><p>Turn the mechanism to bring an exhibit into focus</p></div><div class="clockwork-rotor" aria-label="Rotating exhibit dial"><div class="silver-main-gear" aria-hidden="true"><div class="silver-gear-inset"></div></div><div class="clockwork-ring" aria-hidden="true"></div><div class="clockwork-nodes">${selectorButtons}</div><div class="clockwork-center" aria-hidden="true"><span class="clockwork-center-star">⚙</span><span>THE WORKSHOP</span></div></div><div class="clockwork-navigation"><button class="clockwork-step" type="button" id="clockworkPrevious" aria-label="Previous exhibit">‹ <span>Previous</span></button><div class="clockwork-indicator" aria-live="polite"></div><button class="clockwork-step" type="button" id="clockworkNext" aria-label="Next exhibit"><span>Next</span> ›</button></div><div class="clockwork-filters" role="group" aria-label="Filter exhibits"><button type="button" data-filter="all" aria-pressed="true">All exhibits</button><button type="button" data-filter="model" aria-pressed="false">3D Models</button><button type="button" data-filter="webgl" aria-pressed="false">WebGL</button><button type="button" data-filter="website" aria-pressed="false">Websites</button></div></div><div class="clockwork-grand-stage" id="workshopFeatured">${workshopFeature(first)}</div></section>`:'')+cards(items.filter(p=>!p.model&&!p.webgl&&!p.website));
 const area=main.querySelector('#workshopFeatured'),choices=[...main.querySelectorAll('.clockwork-choice')],dial=main.querySelector('.clockwork-rotor'),indicator=main.querySelector('.clockwork-indicator');
 let current=Math.max(0,models.indexOf(first)),filter='all';
 const eligible=()=>models.map((p,i)=>i).filter(i=>filter==='all'||(filter==='website'?!!models[i].website:filter==='webgl'?!!models[i].webgl:!!models[i].model));
 const redraw=()=>{
  const available=eligible();const ordinal=available.indexOf(current);
  indicator.textContent=`${ordinal+1} / ${available.length} · ${models[current].name}`;
  choices.forEach((b,i)=>{
   const pos=available.indexOf(i); b.hidden=pos<0; b.setAttribute('aria-pressed',String(i===current));
   if(pos>=0){const n=available.length;const angle=2*Math.PI*((pos-ordinal+n)%n)/n;
    b.style.setProperty('--clock-x',Math.sin(angle).toFixed(5));b.style.setProperty('--clock-y',(-Math.cos(angle)).toFixed(5));
    b.style.setProperty('--clock-depth',Math.cos(angle).toFixed(5)); const radius=dial.clientWidth<570?Math.min(150,dial.clientWidth*.325):Math.min(233,dial.clientWidth*.375);b.style.setProperty('--clock-tx',Math.round(Math.sin(angle)*radius)+'px');b.style.setProperty('--clock-ty',Math.round(-Math.cos(angle)*radius)+'px');
    b.style.zIndex=String(Math.round(10+10*Math.cos(angle)));
   }
  });
  dial.style.setProperty('--gear-angle',(-360*ordinal/Math.max(1,available.length))+'deg');
 };
 let workshopScrollTimer;
 const scrollToWorkshopViewer=()=>{
  const heading=area.querySelector('.workshop-stage-heading')||area;
  const masthead=document.querySelector('.realm-masthead');
  const offset=(masthead?.getBoundingClientRect().height||0)+16;
  const top=window.scrollY+heading.getBoundingClientRect().top-offset;
  window.scrollTo({top:Math.max(0,top),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 };
 const select=i=>{
  clearTimeout(workshopScrollTimer);
  if(i!==current){current=i;area.innerHTML=workshopFeature(models[i]);wireAnimationControls(area);wireWorkshopFullscreen(area);wireWebsiteHighlights(area,models[i]);redraw();}
  // The selected exhibit reaches the front of the clockwork dial first.
  // Only then do we move the visitor to the presentation below it.
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  workshopScrollTimer=setTimeout(scrollToWorkshopViewer,reduced?0:900);
 };
 choices.forEach((b,i)=>b.addEventListener('click',()=>select(i)));
 const step=delta=>{const e=eligible(),n=e.indexOf(current);select(e[(n+delta+e.length)%e.length])};
 main.querySelector('#clockworkPrevious').addEventListener('click',()=>step(-1));
 main.querySelector('#clockworkNext').addEventListener('click',()=>step(1));
 main.querySelectorAll('.clockwork-filters button').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;main.querySelectorAll('.clockwork-filters button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const e=eligible();if(!e.includes(current))select(e[0]);else redraw()}));
 main.querySelector('.clockwork-machine').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();step(e.key==='ArrowLeft'?-1:1)}});
 wireAnimationControls(area);wireWorkshopFullscreen(area);wireWebsiteHighlights(area,first);redraw();window.addEventListener('resize',redraw);
 if(requestedProject&&models.some(p=>p.id===requestedProject))requestAnimationFrame(()=>scrollToWorkshopViewer());
}
else if(kind==='software'){
 const stations=[
  {id:'security',name:'Security Operations Platform',room:'Sentinel Fortress',glyph:'♜',discipline:'Freelance prototype · HTML / CSS / JavaScript',role:'Independent freelance developer',technology:'HTML, CSS, JavaScript',scope:'Community security department · Prototype in active development',lead:'A centralized operational workspace being developed for a community security department, designed to manage daily assignments and accurate property records for approximately 900 residential lots.',focus:['Officer dashboard with assignments and daily work','Individual lot profiles, member records, key numbers and photos','Special Requests and House Watch workflows','Supervisor oversight, calendars, reporting and exports'],challenge:'Designing a reliable property record system that associates images and changing information with the correct property across approximately 900 lots.',solution:'An independently designed, browser-based interface connecting property details with officer duties, special requests and supervisory tools.',status:'Prototype in development · Intended for real departmental use',about:[['Purpose & design','Created as a freelance development project for a community security department, Security Operations Platform aims to consolidate its operational tasks and property information into a single, navigable application. The prototype is designed to support daily officer work and give supervisors a clearer picture of activity across the community.'],['Functionality','The application brings together an Officer Home dashboard, lot and property records, Special Requests, House Watch, calendars, supervisor tools and reports. Lot profiles associate identifying information, key details and images with individual homes, while dedicated views support everyday assignments and operational history.'],['Development challenge','Building a data-management foundation for roughly 900 residential lots has been the largest engineering challenge. Each property needs its own accurate information and images, and the interface must make those records practical to find and maintain. The project remains a prototype in active development, rather than a deployed production system.']]},
  {id:'game-studio',name:'Game Studio',room:'The Ironworks',glyph:'⚙',discipline:'Personal creator tool · Python / FFmpeg',role:'Independent developer',technology:'Python, FFmpeg',scope:'Personal desktop application',lead:'A custom gameplay footage workflow that moves from game-specific libraries through frame-level highlight review to automated music-based montage creation.',focus:['Game-specific workspaces and footage libraries','Frame-level review, clip trimming, scoring and keep/discard decisions','Reusable clip metadata and source timestamp management','Randomized montage arrangements and music-based rendering','Gameplay audio balancing and production output'],challenge:'Learning unfamiliar multimedia engineering concepts while solving clip extraction, persistent review data, automated montage arrangements and music/audio synchronization together.',solution:'Built an integrated review-to-render workflow around Python and FFmpeg to reduce repetitive decisions involved in assembling personal highlight videos.',status:'Independently developed desktop tool',about:[['Purpose & design','Game Studio was built for personal gameplay montages. Rather than juggling multiple utilities, it organizes recordings and clip decisions in dedicated workspaces for games including Valorant, Overwatch 2, League of Legends, Teamfight Tactics and Marvel Rivals.'],['Functionality','The software follows a Library → Review → Build workflow. Source recordings are browsed and evaluated at the frame level; clips can be trimmed, rated, kept or discarded, and retained with their metadata. Approved highlights then enter the montage builder, where arrangements can be generated, varied and rendered around selected music.'],['Development challenge','Video processing was largely new territory. Building reliable clip extraction, preserving review decisions across large footage libraries, varying montage arrangements and synchronizing gameplay audio with music required learning FFmpeg and working through several interconnected engineering problems.']]},
  {id:'dnd',name:'Ash & Starlight — D&D Companion',room:'Circle of the Ancients',glyph:'⚜',discipline:'Solo tabletop RPG companion · Python',role:'Independent developer',technology:'Python, JSON',scope:'Personal campaign companion · Adaptable to other campaigns',lead:'A standalone companion for solo Dungeons & Dragons sessions with ChatGPT, preserving an evolving world of characters, lore, artwork and campaign history.',focus:['Character statistics, equipment, maps and artwork','Interactive tabletop dice tools','Searchable quests, NPCs, items and campaign journal','Chapter-by-chapter story archive','Structured JSON campaign updates and backup transfer'],challenge:'Reliably accepting and formatting evolving ChatGPT JSON campaign exports into the appropriate application panels without losing story continuity.',solution:'Designed a structured import-and-display workflow so campaign records can be updated from JSON instead of maintained through repeated manual entry.',status:'Independent Python desktop application',about:[['Purpose & design','Ash & Starlight was created to accompany solo Dungeons & Dragons campaigns played with ChatGPT. It acts as a persistent reference alongside the conversation, keeping information about the character and the world close at hand without interrupting the roleplaying experience. The approach can be adapted to other campaigns.'],['Functionality','Its interface combines character attributes, dice rolling, map and image viewing, quest and NPC records, lore, items and story history. A searchable journal and chapter archive make it easier to revisit earlier moments in a long-running campaign.'],['Development challenge','The biggest challenge was turning campaign JSON exports into useful, well-formatted interface data. The app needs to accept changing, structured campaign information and route it to the proper records, supporting ongoing continuity through imports and backups.']]},
  {id:'faceless',name:'Faceless Shorts Maker',room:'The Observatory',glyph:'◈',discipline:'Freelance media concept · Python / FFmpeg',role:'Independent developer',technology:'Python, FFmpeg',scope:'Freelance business concept',lead:'A narrated short-form video generator that combines written scripts, synthetic narration, timed captions, vertical background video and optional audio.',focus:['Script input and text-to-speech voice selection','Narration pace controls and preview','Forced alignment and word-by-word highlighted captions','Gameplay background video with vertical 1080 × 1920 cropping','Optional music and source-audio management'],challenge:'Synchronizing generated narration, individual word timing and background video into a coherent final short.',solution:'Built a single production flow that coordinates speech generation, alignment, captions and FFmpeg video assembly.',status:'Independent desktop project · Freelance concept',about:[['Purpose & design','Faceless Shorts Maker explores an automated workflow for producing narrated short-form videos as a freelance business concept. It brings the script, voice, captions and supporting footage together in one production environment.'],['Functionality','A user can supply written narration, choose a voice and speed, select the caption presentation, and pair the result with vertically cropped gameplay footage. Optional music and gameplay audio settings support the final composition.'],['Development challenge','Synchronization was the most difficult technical problem. Word-level caption highlighting depends on accurate timing between the speech audio and individual words, while the finished video also needs to stay coordinated with the background footage and audio mix.']]},
  {id:'shorts',name:'Shorts Clip Studio',room:'Clockwork Mill',glyph:'✧',discipline:'Freelance clipping concept · Python / FFmpeg',role:'Independent developer',technology:'Python, FFmpeg, JSON',scope:'Freelance video clipping business concept',lead:'A desktop production tool for turning externally prepared JSON clipping instructions into edited short-form videos with repeatable campaign settings and branding.',focus:['JSON-driven source clip instructions and timestamp processing','Video extraction and assembly','Reusable campaign production profiles','Subtitle and transcription settings','Custom watermark editing and render queue management'],challenge:'Interpreting external JSON clipping instructions accurately and converting their timestamps and settings into dependable video-processing operations.',solution:'Created a JSON-to-render workflow, supported by campaign configuration, subtitle controls, watermark placement and a managed queue.',status:'Independent desktop application · Freelance concept',about:[['Purpose & design','Shorts Clip Studio was built around the idea of offering freelance video clipping services. Its central premise is that editing decisions can be prepared outside the application and then executed consistently by a dedicated desktop production tool.'],['Functionality','The application accepts structured JSON instructions identifying parts of source recordings, processes the requested clips and prepares them for short-form output. Production profiles preserve repeatable settings; the interface also offers subtitle options, watermark editing, output configuration and a render queue.'],['Development challenge','The hardest task was converting JSON into actual editing operations. The system must interpret the incoming clipping data, match instructions to the correct footage and translate source timestamps into accurate operations for processing and rendering video.']]},
  {id:'deckbox',name:'Digital Deckbox',room:'Vault of Cards',glyph:'♠',discipline:'Sponsored senior capstone · Kotlin mobile application',role:'Team lead · Website development · UI/UX design',technology:'Kotlin',scope:'Senior capstone · Monte Cook Games sponsor · Three-person team',lead:'A sponsored senior capstone developed with Monte Cook Games, exploring digital card collections and remote tabletop play while preserving an in-person game feel.',focus:['Campaign creation and management','Organization of purchased Monte Cook Games cards','Digital deck browsing and card tracking','Virtual tabletop interaction for remote campaigns','Website and interface design'],challenge:'Learning Kotlin for the first time while leading a three-person student team and contributing to a sponsor-backed mobile application.',solution:'Led the team and owned the project website and UI/UX work while learning the mobile technology needed to help deliver the capstone experience.',status:'Senior capstone · Sponsored team project',about:[['Purpose & design','Digital Deckbox was a senior capstone project developed with Monte Cook Games as the external sponsor. The aim was to explore a digital application for its tabletop games, helping players manage campaign materials and connect across distance without losing the shared, tactile feel of playing in person.'],['Functionality','The mobile application supports managing campaigns and purchased Monte Cook Games cards, organizing and tracking cards, and interacting with cards in a virtual tabletop environment. Its interface brings familiar physical-card activities into a format designed for remote participation.'],['Team leadership & development','Developed by a three-person team, the project provided experience collaborating with a sponsor and coordinating student development responsibilities. As team lead, responsibilities also included the companion website and the application’s UI/UX design. Kotlin was entirely unfamiliar at the outset, so learning it while contributing to a sponsored capstone was the primary technical challenge.']]}
 ];
 const requestedStation=new URLSearchParams(location.search).get('project');
 let selected=0;
 const warTable=`<div class="citadel-webgl-scene" id="citadelWebGL"><div class="citadel-terrain-fallback" aria-hidden="true"><svg viewBox="0 0 1120 620" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="fallback-surface"><stop stop-color="#2b6e96"/><stop offset=".76" stop-color="#123654"/><stop offset="1" stop-color="#0a1a2c"/></radialGradient><linearGradient id="fallback-silver" x1="0" y1="0" x2=".65" y2="1"><stop stop-color="#cceaff"/><stop offset=".45" stop-color="#6d95b0"/><stop offset="1" stop-color="#1a3c56"/></linearGradient><linearGradient id="fallback-peak" x1="0" x2=".85" y1="0" y2="1"><stop stop-color="#e8faff"/><stop offset=".27" stop-color="#a3dcff"/><stop offset=".75" stop-color="#36719a"/><stop offset="1" stop-color="#17466d"/></linearGradient><filter id="fallback-glow"><feGaussianBlur stdDeviation="6"/></filter></defs><ellipse cx="560" cy="405" rx="531" ry="189" fill="#050f1d" opacity=".65"/><path d="M38 341Q42 575 560 584Q1078 575 1082 341L1082 386Q1078 607 560 610Q42 607 38 386Z" fill="#0d2439" stroke="#76adcb" stroke-width="6"/><ellipse cx="560" cy="343" rx="520" ry="214" fill="url(#fallback-silver)" stroke="#d3ebff" stroke-width="6"/><ellipse cx="560" cy="341" rx="488" ry="192" fill="url(#fallback-surface)" stroke="#4cc5ff" stroke-width="5"/><path d="M130 349Q330 210 500 360T994 315" fill="none" stroke="#68d8ff" stroke-width="24" opacity=".26"/><path d="M130 349Q330 210 500 360T994 315" fill="none" stroke="#c0f7ff" stroke-width="4" opacity=".8"/><path d="M160 326L232 238L291 312L365 162L434 271L499 112L560 284L618 200L677 283L745 161L827 294L890 251L974 351" fill="url(#fallback-peak)" stroke="#b0dcf0" stroke-width="5"/><path d="M335 197L365 162L399 220L369 206L357 219Z M461 162L499 112L535 174L508 158L492 181Z M715 205L745 161L783 224L746 206L731 222Z" fill="#d9f6ff"/><g fill="#2ea6a9" stroke="#8df1ff" stroke-width="2"><path d="M275 355l17-47 17 47zM309 370l13-34 14 34zM810 361l19-49 18 49zM855 375l14-38 15 38zM630 385l16-40 16 40zM679 391l13-30 13 30z"/></g><g stroke="#8fe7ff" opacity=".4" fill="none"><ellipse cx="560" cy="341" rx="380" ry="140"/><ellipse cx="560" cy="341" rx="310" ry="112"/><path d="M560 162V525M170 340H950"/></g><ellipse cx="560" cy="341" rx="490" ry="192" fill="none" stroke="#effcff" stroke-width="2" opacity=".7"/></svg></div><canvas id="citadelTerrainCanvas" aria-label="Drag to rotate the 3D table featuring six software landmarks"></canvas><div class="citadel-webgl-labels" id="citadelLabels" role="group" aria-label="Software stations">${stations.map((s,i)=>`<button class="citadel-webgl-marker${i===selected?' is-active':''}" data-station="${i}" aria-pressed="${i===selected}" type="button" aria-label="Select ${escape(s.name)}"><span class="citadel-building-aura" aria-hidden="true"></span><span class="citadel-marker-name"><span class="citadel-marker-glyph">${s.glyph}</span><span class="citadel-marker-text">${escape(s.name)}</span></span></button>`).join('')}</div><div class="citadel-rotation-cue" aria-hidden="true"><svg viewBox="0 0 560 170" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="citadelCueStroke" x1="0" x2="1"><stop offset="0" stop-color="#6db7e3" stop-opacity=".10"/><stop offset=".35" stop-color="#c9e8ff"/><stop offset=".78" stop-color="#e7c781"/><stop offset="1" stop-color="#f7e1af"/></linearGradient></defs><path class="citadel-cue-path" d="M 44 73 C 94 159, 443 162, 514 72"/><path class="citadel-cue-tip" d="M 491 77 L 514 72 L 510 96"/></svg><span class="citadel-cue-caption">DRAG TO SPIN</span></div><div class="citadel-webgl-hint">SELECT A LOCATION OR DRAG THE TABLE TO ROTATE</div><div class="citadel-map-offer" id="citadelMapOffer" role="status"><button type="button" id="citadelExploreProject">Explore Project</button></div></div>`;
 const galleryEntries=[
  ['Officer Home dashboard','Supervisor tools','Special Requests'],
  ['Game selection hub','Montage builder','Clip review & analysis'],
  ['Character & world map','Campaign journal','Story archive'],
  ['Narration & video production workspace'],
  ['Production workspace & render queue'],
  ['Deck collections','Card viewer','Tabletop mode','Campaign library']
 ];
 const gallerySources=[
  ['security-1.webp','security-2.webp','security-3.webp'],
  ['game-studio-1.webp','game-studio-2.webp','game-studio-3.webp'],
  ['dnd-1.webp','dnd-2.webp','dnd-3.webp'],
  ['faceless-1.webp'],
  ['shorts-1.webp'],
  ['deckbox-1.webp','deckbox-2.webp','deckbox-3.webp','deckbox-4.webp']
 ];
 const dossier=s=>{
  const i=stations.indexOf(s),slides=galleryEntries[i],portrait=s.id==='deckbox';
  return `<div class="citadel-dossier-inner${portrait?' citadel-dossier-portrait':''}"><button type="button" class="citadel-dossier-back" id="citadelBackToMap" aria-label="Back to the interactive map"><span aria-hidden="true">←</span> Back to map</button><div class="citadel-dossier-kicker">THE CITADEL <span aria-hidden="true">/</span> APPLICATION DOSSIER 0${i+1}</div><header class="citadel-dossier-header"><span class="citadel-dossier-room">${escape(s.room)}</span><h2>${escape(s.name)}</h2><p>${escape(s.discipline)}</p></header><div class="citadel-dossier-top"><section class="citadel-dossier-gallery" aria-label="Screenshots of ${escape(s.name)}"><div class="citadel-gallery-viewport" tabindex="0" aria-label="Application screenshot gallery, use arrow keys to navigate"><div class="citadel-gallery-slides">${slides.map((name,j)=>`<div class="citadel-gallery-slide" aria-hidden="${j!==0}"><figure class="citadel-gallery-figure"><div class="citadel-gallery-imagebox"><img src="assets/software-gallery/${gallerySources[i][j]}" alt="${escape(s.name)} — ${escape(name)}" loading="${j===0?'eager':'lazy'}" decoding="async" title="Click to enlarge screenshot"><button type="button" class="citadel-gallery-expand" aria-label="Expand screenshot" title="Expand screenshot">⤢ <span>Expand</span></button></div><figcaption>${escape(name)}</figcaption></figure></div>`).join('')}</div></div><div class="citadel-gallery-controls"><button type="button" class="citadel-gallery-arrow" data-gallery-dir="-1" aria-label="Previous screenshot">‹</button><div class="citadel-gallery-dots" role="group" aria-label="Choose a screenshot">${slides.map((name,j)=>`<button type="button" class="citadel-gallery-dot${j===0?' is-current':''}" data-slide="${j}" aria-label="Screenshot ${j+1}: ${escape(name)}" aria-pressed="${j===0}"></button>`).join('')}</div><button type="button" class="citadel-gallery-arrow" data-gallery-dir="1" aria-label="Next screenshot">›</button></div><p class="citadel-gallery-caption" id="citadelGalleryCaption" aria-live="polite">${escape(slides[0])} <span>· 1 of ${slides.length}</span></p></section><section class="citadel-dossier-specs" aria-label="Technical breakdown"><h3>Technical Overview</h3><div class="citadel-spec-item"><span class="citadel-spec-label">Development role</span><p>${escape(s.role)}</p></div><div class="citadel-spec-item"><span class="citadel-spec-label">Technology</span><p>${escape(s.technology)}</p></div><div class="citadel-spec-item"><span class="citadel-spec-label">Project context</span><p>${escape(s.scope)}</p></div><div class="citadel-spec-item"><span class="citadel-spec-label">Core capabilities</span><ul>${s.focus.map(f=>`<li>${escape(f)}</li>`).join('')}</ul></div><div class="citadel-spec-item"><span class="citadel-spec-label">Engineering challenge</span><p>${escape(s.challenge)}</p></div><div class="citadel-spec-item"><span class="citadel-spec-label">Approach</span><p>${escape(s.solution)}</p></div><div class="citadel-spec-item"><span class="citadel-spec-label">Project status</span><p>${escape(s.status)}</p></div></section></div><section class="citadel-dossier-story"><div class="citadel-story-heading"><span class="citadel-story-rule"></span><h3>About the Application</h3></div><p class="citadel-dossier-lead">${escape(s.lead)}</p>${s.about.map(([title,body])=>`<h4>${escape(title)}</h4><p>${escape(body)}</p>`).join('')}</section></div>`;
 };
 main.innerHTML=`<section class="citadel-warroom citadel-maproom" aria-label="Citadel War Room"><div class="citadel-warroom-intro citadel-warroom-intro--compact"><span class="eyebrow">SOFTWARE &amp; SYSTEMS</span><h1>The Citadel</h1><p>Select a landmark on the table to explore its software system.</p></div><div class="citadel-map-frame citadel-map-frame-constructed" id="citadelMapSection">${warTable}<div class="citadel-map-caption"><span class="citadel-table-active-label"><span>✦ DRAG TO ROTATE THE TABLE ✦</span><strong id="citadelMapSelected">${escape(stations[selected].name)}</strong></span></div></div></section><section class="citadel-dossier-section" id="citadelDossier" hidden aria-label="Full software project dossier"><div class="citadel-command-stage citadel-battle-report is-revealed" id="citadelBriefing">${dossier(stations[selected])}</div></section>`;
 // Full-resolution screenshot lightbox, shared by every project dossier.
 const lightbox=document.createElement('div');
 lightbox.className='citadel-lightbox';
 lightbox.hidden=true;
 lightbox.setAttribute('role','dialog');
 lightbox.setAttribute('aria-modal','true');
 lightbox.setAttribute('aria-label','Expanded application screenshot');
 lightbox.innerHTML=`<div class="citadel-lightbox-toolbar"><span class="citadel-lightbox-title" id="citadelLightboxTitle"></span><div class="citadel-lightbox-tools"><button type="button" data-zoom="out" aria-label="Zoom out">−</button><span id="citadelLightboxZoom">Fit</span><button type="button" data-zoom="in" aria-label="Zoom in">+</button><button type="button" data-zoom="fit" aria-label="Fit image to screen">Fit</button><button type="button" class="citadel-lightbox-close" aria-label="Close expanded screenshot">✕</button></div></div><div class="citadel-lightbox-stage" tabindex="0"><img alt=""></div><div class="citadel-lightbox-bottom"><button type="button" data-lightbox-move="-1" aria-label="Previous screenshot">‹</button><span id="citadelLightboxCount"></span><button type="button" data-lightbox-move="1" aria-label="Next screenshot">›</button></div>`;
 document.body.appendChild(lightbox);
 const lightboxStage=lightbox.querySelector('.citadel-lightbox-stage');
 const lightboxImage=lightboxStage.querySelector('img');
 let lightboxZoom=1,lightboxTrigger=null;
 const lightboxSizing=()=>{
  if(lightbox.hidden||!lightboxImage.naturalWidth)return;
  const maxW=Math.max(1,lightboxStage.clientWidth-32),maxH=Math.max(1,lightboxStage.clientHeight-32);
  const fit=Math.min(maxW/lightboxImage.naturalWidth,maxH/lightboxImage.naturalHeight,1);
  lightboxImage.style.width=Math.round(lightboxImage.naturalWidth*fit*lightboxZoom)+'px';
  lightboxImage.style.height='auto';
  lightbox.querySelector('#citadelLightboxZoom').textContent=lightboxZoom===1?'Fit':Math.round(lightboxZoom*100)+'%';
 };
 const closeLightbox=()=>{if(lightbox.hidden)return;lightbox.hidden=true;document.body.classList.remove('citadel-lightbox-open');lightboxImage.removeAttribute('src');lightboxTrigger?.focus();};
 const updateLightbox=()=>{
  const active=report.querySelectorAll('.citadel-gallery-slide')[slide];
  if(!active)return;
  const source=active.querySelector('img');
  lightboxImage.alt=source.alt;
  lightboxImage.onload=()=>{lightboxSizing();lightboxStage.scrollTo(0,0)};
  lightboxImage.src=source.currentSrc||source.src;
  lightbox.querySelector('#citadelLightboxTitle').textContent=stations[selected].name+' — '+galleryEntries[selected][slide];
  lightbox.querySelector('#citadelLightboxCount').textContent=`${slide+1} of ${galleryEntries[selected].length} · Scroll to pan when zoomed`;
  lightboxZoom=1;
  lightboxSizing();
 };
 const openLightbox=trigger=>{lightboxTrigger=trigger;lightbox.hidden=false;document.body.classList.add('citadel-lightbox-open');updateLightbox();lightbox.querySelector('.citadel-lightbox-close').focus();};
 lightbox.querySelector('.citadel-lightbox-close').addEventListener('click',closeLightbox);
 lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
 lightbox.querySelectorAll('[data-zoom]').forEach(button=>button.addEventListener('click',()=>{
  const action=button.dataset.zoom;
  lightboxZoom=action==='fit'?1:Math.max(1,Math.min(5,Number((lightboxZoom*(action==='in'?1.5:1/1.5)).toFixed(3))));
  lightboxSizing();
 }));
 lightbox.querySelectorAll('[data-lightbox-move]').forEach(button=>button.addEventListener('click',()=>{showSlide(slide+Number(button.dataset.lightboxMove));updateLightbox()}));
 document.addEventListener('keydown',e=>{
  if(lightbox.hidden)return;
  if(e.key==='Escape'){e.preventDefault();closeLightbox()}
  else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showSlide(slide+(e.key==='ArrowRight'?1:-1));updateLightbox()}
  else if(e.key==='Tab'){
   const focusable=[...lightbox.querySelectorAll('button')];const first=focusable[0],last=focusable[focusable.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
 });
 window.addEventListener('resize',()=>{if(!lightbox.hidden)lightboxSizing()});
 const report=main.querySelector('#citadelBriefing');
 const dossierSection=main.querySelector('#citadelDossier');
 const labels=[...main.querySelectorAll('.citadel-webgl-marker')];
 const reduceMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let terrainController=null,cycle=0,slide=0;
 const jumpTo=el=>el.scrollIntoView({behavior:reduceMotion()?'auto':'smooth',block:'start'});
 const showSlide=index=>{
  const slides=[...report.querySelectorAll('.citadel-gallery-slide')], dots=[...report.querySelectorAll('.citadel-gallery-dot')];
  if(!slides.length)return;
  slide=(index+slides.length)%slides.length;
  report.querySelector('.citadel-gallery-slides').style.transform=`translateX(-${slide*100}%)`;
  slides.forEach((el,i)=>el.setAttribute('aria-hidden',String(i!==slide)));
  dots.forEach((el,i)=>{el.classList.toggle('is-current',i===slide);el.setAttribute('aria-pressed',String(i===slide))});
  report.querySelector('#citadelGalleryCaption').innerHTML=`${escape(galleryEntries[selected][slide])} <span>· ${slide+1} of ${slides.length}</span>`;
 };
 const bindDossier=()=>{
  report.querySelector('#citadelBackToMap').addEventListener('click',()=>jumpTo(main.querySelector('#citadelMapSection')));
  report.querySelectorAll('[data-slide]').forEach(b=>b.addEventListener('click',()=>showSlide(Number(b.dataset.slide))));
  report.querySelectorAll('[data-gallery-dir]').forEach(b=>b.addEventListener('click',()=>showSlide(slide+Number(b.dataset.galleryDir))));
  report.querySelectorAll('.citadel-gallery-expand').forEach(button=>button.addEventListener('click',()=>openLightbox(button)));
  report.querySelectorAll('.citadel-gallery-imagebox img').forEach(img=>img.addEventListener('click',()=>openLightbox(img)));
  const viewport=report.querySelector('.citadel-gallery-viewport');
  viewport.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showSlide(slide+(e.key==='ArrowRight'?1:-1))}});
  let downX=null;
  viewport.addEventListener('touchstart',e=>{downX=e.changedTouches[0]?.clientX??null},{passive:true});
  viewport.addEventListener('touchend',e=>{if(downX===null)return;const dx=(e.changedTouches[0]?.clientX??downX)-downX;downX=null;if(Math.abs(dx)>45)showSlide(slide+(dx<0?1:-1))},{passive:true});
 };
 const activateStation=(index,fromLandmarkClick=false)=>{
  closeLightbox();
  const next=(index+stations.length)%stations.length;
  let delta=next-selected;
  if(delta>stations.length/2)delta-=stations.length;
  if(delta< -stations.length/2)delta+=stations.length;
  cycle+=delta;selected=next;
  labels.forEach((b,i)=>{b.classList.toggle('is-active',i===selected);b.setAttribute('aria-pressed',String(i===selected))});
  main.querySelector('#citadelMapSelected').textContent=stations[selected].name;
  main.querySelector('#citadelMapOffer').classList.toggle('is-visible',fromLandmarkClick);
  if(terrainController)terrainController.rotateTo(cycle);
  main.querySelector('#citadelWebGL')?.style.setProperty('--citadel-fallback-angle',(-cycle*60)+'deg');
  if(!dossierSection.hidden){report.innerHTML=dossier(stations[selected]);slide=0;bindDossier()}
 };
 const openDossier=()=>{
  report.innerHTML=dossier(stations[selected]);slide=0;bindDossier();
  dossierSection.hidden=false;
  requestAnimationFrame(()=>jumpTo(dossierSection));
 };
 labels.forEach(b=>b.addEventListener('click',()=>activateStation(Number(b.dataset.station),true)));
 main.querySelector('#citadelExploreProject').addEventListener('click',openDossier);
 const destinationIndex=stations.findIndex(s=>s.id===requestedStation);
 if(destinationIndex>=0){activateStation(destinationIndex,false);openDossier();}
 const cueScene=main.querySelector('#citadelWebGL');
 let cueIdleTimer;
 const cuePause=()=>{cueScene.classList.add('has-rotated');clearTimeout(cueIdleTimer);cueIdleTimer=setTimeout(()=>{if(!cueScene.matches(':active')&&!cueScene.matches(':focus-within'))cueScene.classList.remove('has-rotated')},6500)};
 cueScene.addEventListener('pointerdown',cuePause);
 cueScene.addEventListener('wheel',cuePause,{passive:true});
 cueScene.addEventListener('keydown',cuePause);
 cueScene.addEventListener('pointerleave',()=>{clearTimeout(cueIdleTimer);cueIdleTimer=setTimeout(()=>cueScene.classList.remove('has-rotated'),1800)});
 const script=document.createElement('script');script.src='citadel-webgl.js';script.onload=()=>{try{terrainController=window.CitadelTerrain?.init(main.querySelector('#citadelWebGL'),labels)}catch(err){console.error('War table could not initialize',err)}if(!terrainController){main.querySelector('#citadelWebGL').classList.add('is-unavailable')}};script.onerror=()=>{main.querySelector('#citadelWebGL').classList.add('is-unavailable')};document.head.appendChild(script);

}
else if(kind==='projects'||cats[kind]){const c=cats[kind];main.innerHTML=realmHeading('ALL PROJECTS','The Archives',c?c[2]:'Explore the projects behind the realm.')+cards(c?D.projects.filter(p=>p.category===kind):D.projects);}
else if(kind==='project'){let id=new URLSearchParams(location.search).get('id');let p=D.projects.find(p=>p.id===id);if(!p){main.innerHTML=heading('The Archives','Project not found','This entry may have moved.')+'<a class="cta" href="archives.html">All projects</a>';return;}let region={games:'games.html',software:'software.html',web:'web.html'}[p.category];regionArt.project={games:'arena',software:'citadel',web:'workshop'}[p.category]||'realm';if(p.model)ensureModelViewer();main.innerHTML=`<section class="project-detail"><div><div class="detail-art">${p.website?`<div class="webgl-player-shell website-frame-shell"><iframe class="workshop-webgl-frame workshop-website-frame" title="${escape(p.name)} website" src="${escape(p.website)}" allow="fullscreen" allowfullscreen loading="lazy"></iframe></div><div class="workshop-webgl-actions"><button type="button" class="workshop-fullscreen-button">⛶ View fullscreen</button><a href="${escape(p.website)}" target="_blank" rel="noopener noreferrer">Open full website ↗</a></div>`:p.webgl?`<div class="webgl-player-shell"><iframe class="workshop-webgl-frame" title="${escape(p.name)} interactive WebGL experience" src="${escape(p.webgl)}" allow="fullscreen" allowfullscreen loading="lazy"></iframe></div><div class="workshop-webgl-actions"><button type="button" class="workshop-fullscreen-button">⛶ Enter fullscreen experience</button><a href="${escape(p.webgl)}" target="_blank" rel="noopener noreferrer">Open in new tab ↗</a></div>`:p.model?`<model-viewer class="detail-model-viewer" src="${escape(p.model)}" alt="Interactive 3D model of ${escape(p.name)}" camera-controls touch-action="pan-y" ${modelViewerAttrs(p)}${modelAnimationAttrs(p)} interaction-prompt="auto"></model-viewer>${modelAnimationControl(p)}`:`<img src="assets/${encodeURIComponent(p.id)}.svg" alt="Concept illustration for ${escape(p.name)}">`}</div><p class="detail-label">${p.website?'LIVE WEBSITE PREVIEW · FULLSCREEN AVAILABLE':p.webgl?'LIVE WEBGL EXPERIENCE · FULLSCREEN AVAILABLE':p.model?'INTERACTIVE 3D VIEWER · DRAG TO ROTATE':'ILLUSTRATIVE CONCEPT ART · REPLACE WITH PROJECT CAPTURE'}</p></div><div><span class="eyebrow">${escape(p.tag)} · ${escape(p.year)}</span><h1>${escape(p.name)}</h1><p>${escape(p.summary)}</p><div class="chips">${p.tools.map(t=>`<span>${escape(t)}</span>`).join('')}</div><div class="detail-columns">${[['Role',p.role],['Challenge',p.challenge],['Approach',p.approach],['Outcome',p.outcome]].map(([t,v])=>`<div class="detail-block"><h3>${t}</h3><p>${escape(v)}</p></div>`).join('')}</div>${p.note?`<p>${escape(p.note)}</p>`:''}${p.id==='decked-out-home'?`<div class="deo-detail-links"><a href="https://sce.nau.edu/capstone/projects/CS/2026/DeckedOut_F25/" target="_blank" rel="noopener noreferrer">Homepage ↗</a><a href="https://sce.nau.edu/capstone/projects/CS/2026/DeckedOut_F25/project.html" target="_blank" rel="noopener noreferrer">Project ↗</a><a href="https://sce.nau.edu/capstone/projects/CS/2026/DeckedOut_F25/timeline.html" target="_blank" rel="noopener noreferrer">Timeline ↗</a></div>`:''}${/^https?:\/\//.test(p.link||'')?`<a class="cta" href="${escape(p.link)}" target="_blank" rel="noopener noreferrer">${escape(p.linkText||'Visit project')} ↗</a>`:''}${p.model?`<a class="cta alt-cta" href="${escape(p.model)}" target="_blank" rel="noopener noreferrer">Open GLB asset ↗</a>`:''}<a class="cta" href="${region}">← Back to ${escape(p.category)}</a></div></section>`;}
else if(kind==='archives'){
 const categoryLabels={games:'The Arena · Games',software:'The Citadel · Software',web:'The Workshop · Interactive Works'};
 // Interleave categories instead of grouping records into separate shelves.
 const streams=['games','software','web'].map(category=>D.projects.filter(p=>p.category===category));
 const mixed=[];let more=true;
 while(more){more=false;for(const stream of streams){if(stream.length){mixed.push(stream.shift());more=true}}}
 const scrolls=mixed.map((p,i)=>`<button type="button" class="archive-scroll scroll-age-${['faded','umber','dark','stained','pale','torn'][i%6]}" data-scroll-id="${escape(p.id)}" aria-label="Unroll ${escape(p.name)}" style="--scroll-turn:${[14,-21,31,-9,25,-33,7,-17,38,-11,19,-27][i%12]}deg;--scroll-size:${[1.14,.82,1.05,.9,1.31,.76,1.18,.97,1.06,.85,1.23,.91][i%12]};--scroll-age:${i%6}"><span class="scroll-end" aria-hidden="true"><span class="scroll-outer-ring"></span><span class="scroll-spiral"></span><span class="scroll-pin"></span></span><span class="scroll-nameplate">${escape(p.name)}</span></button>`).join('');
 main.innerHTML=realmHeading('ALL PROJECTS','The Archives','Select a sealed scroll to uncover its project record.')+`<div class="scroll-library scroll-pile-library" id="scrollLibrary"><div class="library-cornice"><span>✦</span> THE GRAND RECORDS <span>✦</span></div><div class="scroll-pile" aria-label="An unsorted collection of project scrolls">${scrolls}</div><div class="scroll-pile-ledge" aria-hidden="true"></div><p class="library-footnote">Each rolled scroll holds a project account. Select one to read it.</p></div><div class="scroll-overlay" id="scrollOverlay" role="dialog" aria-modal="true" aria-labelledby="scrollProjectTitle" hidden><div class="scroll-scrim"></div><div class="unfurled-scroll"><div class="scroll-top-roller" aria-hidden="true"></div><article class="scroll-parchment"><button type="button" class="scroll-back" aria-label="Roll up scroll and return to library">← <span>Return to Library</span></button><div class="scroll-record" id="scrollRecord"></div></article><div class="scroll-bottom-roller" aria-hidden="true"></div></div></div>`;
 // Scatter mixed scrolls into irregular, overlapping rows rather than a tidy grid.
 const pile=main.querySelector('.scroll-pile');
 const pileButtons=Array.from(pile.querySelectorAll('.archive-scroll'));
 const scatterScrolls=()=>{
   const available=Math.max(270,pile.clientWidth-12);
   const target=available<530?4:available<820?6:8;
   let index=0,y=9;
   const proportions=[1.14,.82,1.05,.9,1.31,.76,1.18,.97,1.06,.85,1.23,.91];
   while(index<pileButtons.length){
     const row=pileButtons.slice(index,index+target);
     const nums=row.map((_,k)=>proportions[(index+k)%proportions.length]);
     const sum=nums.reduce((a,b)=>a+b,0);
     const diameter=Math.min(150,(available+18*(row.length-1))/sum);
     const widths=nums.map(n=>n*diameter);
     const gap=Math.max(-17,Math.min(-4,(available-widths.reduce((a,b)=>a+b,0))/(Math.max(1,row.length-1))));
     const total=widths.reduce((a,b)=>a+b,0)+gap*(row.length-1);
     let x=Math.max(2,(available-total)/2)+(index%2?8:0);
     const maxSize=Math.max(...widths);
     row.forEach((el,k)=>{
       const jitterY=[10,-9,5,-15,16,-4,12,-8,5][(index+k)%9];
       const jitterX=[-3,4,-6,7,0,6,-5,1][(index+k)%8];
       const size=widths[k];
       el.style.width=size+'px';el.style.height=size+'px';
       el.style.left=Math.max(0,x+jitterX)+'px';
       el.style.top=(y+(maxSize-size)*.6+jitterY)+'px';
       el.style.zIndex=String(1+((index+k)*7)%4);
       x+=size+gap;
     });
     y+=maxSize*.81+8;
     index+=row.length;
   }
   pile.style.height=(y+45)+'px';
 };
 scatterScrolls();
 window.addEventListener('resize',scatterScrolls,{passive:true});
 const overlay=main.querySelector('#scrollOverlay');const record=main.querySelector('#scrollRecord');const library=main.querySelector('#scrollLibrary');let lastTrigger=null;let closing=false;let closeTimer=null;
 // A body-level portal avoids the main content's stacking context clipping the dialog under the site header.
 document.body.appendChild(overlay);
 const positionOverlay=()=>{const header=document.querySelector('.realm-masthead');const bottom=header?header.getBoundingClientRect().bottom:0;overlay.style.setProperty('--archive-header-bottom',Math.max(0,Math.round(bottom))+'px')};
 window.addEventListener('resize',positionOverlay,{passive:true});window.addEventListener('scroll',positionOverlay,{passive:true});
 positionOverlay();
 const openScroll=button=>{
   const p=D.projects.find(p=>p.id===button.dataset.scrollId);if(!p)return;
   lastTrigger=button;closing=false;window.clearTimeout(closeTimer);positionOverlay();overlay.classList.remove('is-rolling','is-unrolling');
   const section={games:'games.html',software:'software.html',web:'web.html'}[p.category]||'archives.html';
   const link=`<a class="scroll-visit" href="${section}?project=${encodeURIComponent(p.id)}">Explore ${escape(p.name)} in ${escape(categoryLabels[p.category]||'Portfolio')} →</a>`;
   record.innerHTML=`<div class="scroll-insignia" aria-hidden="true">✦ ⟡ ✦</div><span class="scroll-kind">${escape(categoryLabels[p.category]||'Project Record')}</span><h2 id="scrollProjectTitle">${escape(p.name)}</h2><div class="scroll-divider" aria-hidden="true">❧</div><p class="scroll-summary">${escape(p.summary||'')}</p>${p.role?`<section class="scroll-detail"><h3>My Role</h3><p>${escape(p.role)}</p></section>`:''}${p.challenge?`<section class="scroll-detail"><h3>The Challenge</h3><p>${escape(p.challenge)}</p></section>`:''}${p.approach?`<section class="scroll-detail"><h3>Approach</h3><p>${escape(p.approach)}</p></section>`:''}${p.outcome?`<section class="scroll-detail"><h3>Outcome</h3><p>${escape(p.outcome)}</p></section>`:''}${p.note?`<section class="scroll-detail"><h3>Additional Notes</h3><p>${escape(p.note)}</p></section>`:''}<div class="scroll-record-footer">${link}</div>`;
   overlay.hidden=false;document.body.classList.add('scroll-is-open');library.setAttribute('inert','');overlay.querySelector('.scroll-parchment').scrollTop=0;
   requestAnimationFrame(()=>{overlay.classList.add('is-unrolling');overlay.querySelector('.scroll-back').focus({preventScroll:true})});
 };
 const closeScroll=()=>{if(overlay.hidden||closing)return;closing=true;overlay.classList.remove('is-unrolling');overlay.classList.add('is-rolling');const finish=()=>{overlay.hidden=true;overlay.classList.remove('is-rolling');document.body.classList.remove('scroll-is-open');library.removeAttribute('inert');lastTrigger?.focus({preventScroll:true});closing=false};closeTimer=window.setTimeout(finish,290)};
 main.querySelectorAll('.archive-scroll').forEach(b=>b.addEventListener('click',()=>openScroll(b)));
 overlay.querySelector('.scroll-back').addEventListener('click',closeScroll);
 overlay.querySelector('.scroll-scrim').addEventListener('click',closeScroll);
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!overlay.hidden){event.preventDefault();closeScroll()}});
}
else if(kind==='about'){
main.innerHTML=realmHeading('ABOUT ZACK','The Architect','The developer behind the worlds, interfaces, and systems.')+`
<section class="architect-layout" aria-label="About Zackary Pond">
  <div class="architect-story">
    <span class="eyebrow">BEHIND THE WORK</span>
    <h2>Hi, I’m Zack.</h2>
    <p>I’m a graduate of <span class="architect-value">Northern Arizona University</span> with a B.S. in <span class="architect-value">Immersive Media and Games</span>. I’m interested in game development, programming, and interactive technologies, bringing together software development, engineering, 3D modeling, and a lifelong enthusiasm for games.</p>
    <p>I began in mechanical engineering before following that enthusiasm into game development. The change of direction gave me a foundation in technical design, prototyping, and problem-solving that still shapes how I build software and interactive systems.</p>
    <p>My work spans C, C++, C#, Java, JavaScript, Kotlin, HTML, and CSS, as well as Unity, Unreal Engine, and Godot. I also bring more than seven years of SolidWorks experience and experience with Blender.</p>
    <p>Since 2023, I’ve worked in security at Forest Highlands Golf Club while independently developing software to help support its operations. I value opportunities to put development skills to work on real problems, beyond assignments and prototypes.</p>
    <div class="architect-highlights" aria-label="Background highlights">
      <div><small>EDUCATION</small><span class="architect-value">B.S. · Immersive Media and Games</span><span>NAU · Graduated May 2026 · GPA: 3.62/4.00</span></div>
      <div><small>ACADEMIC HONORS</small><span class="architect-value">Six consecutive semesters on the Dean’s List</span><span>Dean’s List · 3.5+ semester GPA</span></div>
      <div><small>DISCIPLINES</small><span class="architect-value">Games · Software · 3D</span><span>Development, prototyping, and design</span></div>
    </div>
    <h3>Beyond the Workshop</h3>
    <p>Outside development, I enjoy reading high-fantasy novels, hiking, competitive gaming, and getting together for board and card games—especially those from Unstable Games.</p>
    <p>I’ve competed at the collegiate level in <span class="architect-value">Overwatch</span> and <span class="architect-value">Marvel Rivals</span>, and reached a top-15 North American ranking in Overwatch’s Mystery Heroes mode. Competition has shaped the way I think about game mechanics, teamwork, balance, and player experience.</p>
    <p>I also created <span class="architect-value">Game Studio</span>, a tool for finding gameplay highlights and turning clips into montages. The videos on my YouTube channel were produced using this software, connecting my love of games with the tools I enjoy building.</p>
    <p>I’m pursuing opportunities in game development, game design, gameplay programming, and software engineering.</p>
    <div class="profile-actions"><a class="cta" href="assets/Zackary_Pond_Resume.pdf" download>Download résumé ↓</a><a class="cta alt-cta" href="archives.html">Explore my work →</a><a class="cta alt-cta" href="contact.html">Get in touch →</a></div>
  </div>
  <aside class="architect-identity" aria-label="Portrait and socials">
    <div class="architect-portrait-panel">
      <div class="architect-portrait-frame" data-portrait="zack">
        <img class="architect-portrait architect-portrait-zack" src="assets/zack-portrait.jpg" alt="Portrait of Zackary Pond outdoors" loading="eager" decoding="async">
        <img class="architect-portrait architect-portrait-avatar" src="assets/zack-panda-avatar.png" alt="Zack’s panda warrior avatar with blue magical runes" loading="eager" decoding="async" aria-hidden="true">
      </div>
      <div class="architect-toggle" role="group" aria-label="Choose portrait"><button class="is-active" type="button" data-choose-portrait="zack" aria-pressed="true">Zack</button><button type="button" data-choose-portrait="avatar" aria-pressed="false">Avatar</button></div>
      <p class="architect-portrait-caption" id="architectPortraitCaption">THE DEVELOPER</p>
    </div>
    <div class="architect-social-panel"><span class="eyebrow">SOCIALS</span><div class="architect-social-links">
      <a href="https://zdp35nauedu.itch.io/" target="_blank" rel="noopener noreferrer" aria-label="Zack's games on itch.io"><span class="architect-social-symbol" aria-hidden="true">✦</span><span>itch.io</span></a>
      <a href="https://www.linkedin.com/in/zackary-pond-50795b271/" target="_blank" rel="noopener noreferrer" aria-label="Zack on LinkedIn"><span class="architect-social-symbol" aria-hidden="true">in</span><span>LinkedIn</span></a>
      <a href="https://www.youtube.com/@lokiol-g2q" target="_blank" rel="noopener noreferrer" aria-label="Zack's YouTube gaming montages"><span class="architect-social-symbol" aria-hidden="true">▶</span><span>YouTube</span></a>
    </div><p class="architect-social-note">Every video on YouTube was made with my Game Studio software.</p></div>
  </aside>
</section>
</div>`;
const frame=main.querySelector('.architect-portrait-frame');
const caption=main.querySelector('#architectPortraitCaption');
main.querySelectorAll('[data-choose-portrait]').forEach(button=>button.addEventListener('click',()=>{
 const choice=button.dataset.choosePortrait;
 frame.dataset.portrait=choice;
 frame.querySelector('.architect-portrait-zack').setAttribute('aria-hidden',String(choice!=='zack'));
 frame.querySelector('.architect-portrait-avatar').setAttribute('aria-hidden',String(choice!=='avatar'));
 main.querySelectorAll('[data-choose-portrait]').forEach(el=>{const active=el===button;el.classList.toggle('is-active',active);el.setAttribute('aria-pressed',String(active))});
 caption.textContent=choice==='zack'?'THE DEVELOPER':'THE AVATAR';
}));
}
else if(kind==='contact'){
document.body.classList.add('gateway-viewport-page');
main.innerHTML=realmHeading('GET IN TOUCH','The Gateway','Have a question, an opportunity, or a project in mind? Reach out through the form or connect on LinkedIn.')+`
<div class="gateway-environment">
<section class="gateway-stage" aria-label="Animated magical gateway">
  <div class="gateway-portal-scene" aria-hidden="true">
    <div class="gateway-portal-halo"></div>
    <div class="gateway-portal-ring"></div>
    <div class="gateway-portal-core"></div>
    <div class="gateway-portal-stars"></div>
    <div class="gateway-portal-arcs"></div>
    <div class="gateway-portal-particles"><i style="--i:0;--angle:0.00deg;--radius:28%;--size:2px;--dur:3s;--delay:-0.00s"></i><i style="--i:1;--angle:137.51deg;--radius:69%;--size:3px;--dur:4s;--delay:-0.37s"></i><i style="--i:2;--angle:275.02deg;--radius:66%;--size:4px;--dur:5s;--delay:-0.74s"></i><i style="--i:3;--angle:412.52deg;--radius:63%;--size:5px;--dur:6s;--delay:-1.11s"></i><i style="--i:4;--angle:550.03deg;--radius:60%;--size:2px;--dur:7s;--delay:-1.48s"></i><i style="--i:5;--angle:687.54deg;--radius:57%;--size:3px;--dur:8s;--delay:-1.85s"></i><i style="--i:6;--angle:825.05deg;--radius:54%;--size:4px;--dur:9s;--delay:-2.22s"></i><i style="--i:7;--angle:962.56deg;--radius:51%;--size:5px;--dur:3s;--delay:-2.59s"></i><i style="--i:8;--angle:1100.06deg;--radius:48%;--size:2px;--dur:4s;--delay:-2.96s"></i><i style="--i:9;--angle:1237.57deg;--radius:45%;--size:3px;--dur:5s;--delay:-3.33s"></i><i style="--i:10;--angle:1375.08deg;--radius:42%;--size:4px;--dur:6s;--delay:-3.70s"></i><i style="--i:11;--angle:1512.59deg;--radius:39%;--size:5px;--dur:7s;--delay:-4.07s"></i><i style="--i:12;--angle:1650.10deg;--radius:36%;--size:2px;--dur:8s;--delay:-4.44s"></i><i style="--i:13;--angle:1787.60deg;--radius:33%;--size:3px;--dur:9s;--delay:-4.81s"></i><i style="--i:14;--angle:1925.11deg;--radius:30%;--size:4px;--dur:3s;--delay:-5.18s"></i><i style="--i:15;--angle:2062.62deg;--radius:71%;--size:5px;--dur:4s;--delay:-5.55s"></i><i style="--i:16;--angle:2200.13deg;--radius:68%;--size:2px;--dur:5s;--delay:-5.92s"></i><i style="--i:17;--angle:2337.64deg;--radius:65%;--size:3px;--dur:6s;--delay:-6.29s"></i><i style="--i:18;--angle:2475.14deg;--radius:62%;--size:4px;--dur:7s;--delay:-6.66s"></i><i style="--i:19;--angle:2612.65deg;--radius:59%;--size:5px;--dur:8s;--delay:-7.03s"></i><i style="--i:20;--angle:2750.16deg;--radius:56%;--size:2px;--dur:9s;--delay:-7.40s"></i><i style="--i:21;--angle:2887.67deg;--radius:53%;--size:3px;--dur:3s;--delay:-7.77s"></i><i style="--i:22;--angle:3025.18deg;--radius:50%;--size:4px;--dur:4s;--delay:-8.14s"></i><i style="--i:23;--angle:3162.68deg;--radius:47%;--size:5px;--dur:5s;--delay:-8.51s"></i><i style="--i:24;--angle:3300.19deg;--radius:44%;--size:2px;--dur:6s;--delay:-8.88s"></i><i style="--i:25;--angle:3437.70deg;--radius:41%;--size:3px;--dur:7s;--delay:-9.25s"></i><i style="--i:26;--angle:3575.21deg;--radius:38%;--size:4px;--dur:8s;--delay:-9.62s"></i><i style="--i:27;--angle:3712.72deg;--radius:35%;--size:5px;--dur:9s;--delay:-9.99s"></i><i style="--i:28;--angle:3850.22deg;--radius:32%;--size:2px;--dur:3s;--delay:-10.36s"></i><i style="--i:29;--angle:3987.73deg;--radius:29%;--size:3px;--dur:4s;--delay:-10.73s"></i><i style="--i:30;--angle:4125.24deg;--radius:70%;--size:4px;--dur:5s;--delay:-11.10s"></i><i style="--i:31;--angle:4262.75deg;--radius:67%;--size:5px;--dur:6s;--delay:-11.47s"></i><i style="--i:32;--angle:4400.26deg;--radius:64%;--size:2px;--dur:7s;--delay:-11.84s"></i><i style="--i:33;--angle:4537.76deg;--radius:61%;--size:3px;--dur:8s;--delay:-12.21s"></i><i style="--i:34;--angle:4675.27deg;--radius:58%;--size:4px;--dur:9s;--delay:-12.58s"></i><i style="--i:35;--angle:4812.78deg;--radius:55%;--size:5px;--dur:3s;--delay:-12.95s"></i><i style="--i:36;--angle:4950.29deg;--radius:52%;--size:2px;--dur:4s;--delay:-13.32s"></i><i style="--i:37;--angle:5087.80deg;--radius:49%;--size:3px;--dur:5s;--delay:-13.69s"></i><i style="--i:38;--angle:5225.30deg;--radius:46%;--size:4px;--dur:6s;--delay:-14.06s"></i><i style="--i:39;--angle:5362.81deg;--radius:43%;--size:5px;--dur:7s;--delay:-14.43s"></i><i style="--i:40;--angle:5500.32deg;--radius:40%;--size:2px;--dur:8s;--delay:-14.80s"></i><i style="--i:41;--angle:5637.83deg;--radius:37%;--size:3px;--dur:9s;--delay:-15.17s"></i><i style="--i:42;--angle:5775.34deg;--radius:34%;--size:4px;--dur:3s;--delay:-15.54s"></i><i style="--i:43;--angle:5912.84deg;--radius:31%;--size:5px;--dur:4s;--delay:-15.91s"></i><i style="--i:44;--angle:6050.35deg;--radius:28%;--size:2px;--dur:5s;--delay:-16.28s"></i><i style="--i:45;--angle:6187.86deg;--radius:69%;--size:3px;--dur:6s;--delay:-16.65s"></i><i style="--i:46;--angle:6325.37deg;--radius:66%;--size:4px;--dur:7s;--delay:-17.02s"></i><i style="--i:47;--angle:6462.88deg;--radius:63%;--size:5px;--dur:8s;--delay:-17.39s"></i><i style="--i:48;--angle:6600.38deg;--radius:60%;--size:2px;--dur:9s;--delay:-17.76s"></i><i style="--i:49;--angle:6737.89deg;--radius:57%;--size:3px;--dur:3s;--delay:-18.13s"></i><i style="--i:50;--angle:6875.40deg;--radius:54%;--size:4px;--dur:4s;--delay:-18.50s"></i><i style="--i:51;--angle:7012.91deg;--radius:51%;--size:5px;--dur:5s;--delay:-18.87s"></i><i style="--i:52;--angle:7150.42deg;--radius:48%;--size:2px;--dur:6s;--delay:-19.24s"></i><i style="--i:53;--angle:7287.92deg;--radius:45%;--size:3px;--dur:7s;--delay:-19.61s"></i><i style="--i:54;--angle:7425.43deg;--radius:42%;--size:4px;--dur:8s;--delay:-19.98s"></i><i style="--i:55;--angle:7562.94deg;--radius:39%;--size:5px;--dur:9s;--delay:-20.35s"></i><i style="--i:56;--angle:7700.45deg;--radius:36%;--size:2px;--dur:3s;--delay:-20.72s"></i><i style="--i:57;--angle:7837.96deg;--radius:33%;--size:3px;--dur:4s;--delay:-21.09s"></i><i style="--i:58;--angle:7975.46deg;--radius:30%;--size:4px;--dur:5s;--delay:-21.46s"></i><i style="--i:59;--angle:8112.97deg;--radius:71%;--size:5px;--dur:6s;--delay:-21.83s"></i><i style="--i:60;--angle:8250.48deg;--radius:68%;--size:2px;--dur:7s;--delay:-22.20s"></i><i style="--i:61;--angle:8387.99deg;--radius:65%;--size:3px;--dur:8s;--delay:-22.57s"></i><i style="--i:62;--angle:8525.50deg;--radius:62%;--size:4px;--dur:9s;--delay:-22.94s"></i><i style="--i:63;--angle:8663.00deg;--radius:59%;--size:5px;--dur:3s;--delay:-23.31s"></i><i style="--i:64;--angle:8800.51deg;--radius:56%;--size:2px;--dur:4s;--delay:-23.68s"></i><i style="--i:65;--angle:8938.02deg;--radius:53%;--size:3px;--dur:5s;--delay:-24.05s"></i><i style="--i:66;--angle:9075.53deg;--radius:50%;--size:4px;--dur:6s;--delay:-24.42s"></i><i style="--i:67;--angle:9213.04deg;--radius:47%;--size:5px;--dur:7s;--delay:-24.79s"></i><i style="--i:68;--angle:9350.54deg;--radius:44%;--size:2px;--dur:8s;--delay:-25.16s"></i><i style="--i:69;--angle:9488.05deg;--radius:41%;--size:3px;--dur:9s;--delay:-25.53s"></i><i style="--i:70;--angle:9625.56deg;--radius:38%;--size:4px;--dur:3s;--delay:-25.90s"></i><i style="--i:71;--angle:9763.07deg;--radius:35%;--size:5px;--dur:4s;--delay:-26.27s"></i></div>
  </div>
</section>
<section class="gateway-layout" aria-label="Contact Zackary Pond">
  <div class="gateway-correspondence">
    <span class="eyebrow">SEND A MESSAGE</span>
    <h2>Start a conversation</h2>
    <p>I'd love to hear about opportunities in game development, gameplay programming, software engineering, or interactive media. Fill out the form below and your message will be delivered to my inbox.</p>
    <form class="gateway-form" action="https://formsubmit.co/lokiolbusiness@gmail.com" method="POST">
      <input type="hidden" name="_next" value="https://zackpond.github.io/zack-pond-portfolio/">
      <div class="gateway-form-row">
        <label>Name:<input type="text" name="name" autocomplete="name" required></label>
        <label>Email:<input type="email" name="email" autocomplete="email" required></label>
      </div>
      <label>Subject/Topic:<input type="text" name="subject" required></label>
      <label>Message:<textarea name="message" rows="5" required></textarea></label>
      <button class="cta gateway-send" type="submit">Send</button>
    </form>
  </div>
  <aside class="gateway-connections" aria-label="Professional connections and résumé">
    <div class="gateway-connection-item">
      <span class="eyebrow">PROFESSIONAL CONNECTIONS</span>
      <p>Prefer LinkedIn?</p>
      <a class="cta gateway-link" href="https://www.linkedin.com/in/zackary-pond-50795b271/" target="_blank" rel="noopener noreferrer">Message me on LinkedIn ↗</a>
    </div>
    <div class="gateway-connection-item">
      <span class="eyebrow">MY BACKGROUND</span>
      <p>Education, development experience, and technical skills.</p>
      <a class="cta alt-cta gateway-link" href="assets/Zackary_Pond_Resume.pdf" download="Zackary_Pond_Resume.pdf">Download résumé ↓</a>
    </div>
  </aside>
</section>`;
}
if(kind==='project'){wireAnimationControls(main);wireWorkshopFullscreen(main);}
addRegion(kind);
const mobileButton=document.querySelector('.realm-menu-button'),mobileMenu=document.querySelector('#interiorMenu');mobileButton?.addEventListener('click',()=>{const open=mobileButton.getAttribute('aria-expanded')==='true';mobileButton.setAttribute('aria-expanded',String(!open));mobileMenu.hidden=open});
const allCards=Array.from(document.querySelectorAll('.project-card'));
allCards.forEach((el,i)=>{el.style.setProperty('--entry-delay',Math.min(i,10)*45+'ms');el.setAttribute('tabindex','0');el.setAttribute('role','link');el.setAttribute('aria-label','Inspect '+(el.querySelector('h3')?.textContent||'project'));el.addEventListener('click',e=>{if(!e.target.closest('a')) location.href=el.querySelector('a').href});el.addEventListener('keydown',e=>{if(e.key==='Enter' && e.target===el) location.href=el.querySelector('a').href});});
if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){const ob=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('revealed');ob.unobserve(x.target)}}),{threshold:.08});document.querySelectorAll('.project-card,.detail-block,.plain-panel').forEach(el=>ob.observe(el))}else document.querySelectorAll('.project-card,.detail-block,.plain-panel').forEach(el=>el.classList.add('revealed'));

})();
