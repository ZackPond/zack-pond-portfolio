/* Self-contained WebGL holographic War Table — no external dependencies. */
(function(){'use strict';
const TAU=Math.PI*2,R=5;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function init(root,labels){
 const canvas=root.querySelector('canvas');let gl;try{gl=canvas.getContext('webgl',{alpha:true,antialias:true,depth:true,premultipliedAlpha:false})||canvas.getContext('experimental-webgl');}catch(e){console.warn('Citadel WebGL context unavailable',e);return null;}if(!gl)return null;
 const vs=`attribute vec3 aPos;attribute vec3 aNormal;attribute vec3 aColor;attribute float aEmission;attribute float aTerrain;varying float vTerrain;uniform mat4 uMatrix;uniform float uAngle;uniform float uTime;varying vec3 vNormal;varying vec3 vColor;varying vec3 vWorld;varying float vEmission;varying vec3 vLocal;void main(){vLocal=aPos;vEmission=aEmission;vTerrain=aTerrain;float c=cos(uAngle),s=sin(uAngle);vec3 raw=aPos;

 vec3 p=vec3(raw.x*c-raw.z*s,raw.y,raw.x*s+raw.z*c);vec3 n=vec3(aNormal.x*c-aNormal.z*s,aNormal.y,aNormal.x*s+aNormal.z*c);vNormal=n;vColor=aColor;vWorld=p;gl_Position=uMatrix*vec4(p,1.);}`;
 // V195: high-definition, high-contrast material pass. Stronger separation makes
 // stone, wood, slate, grass, water, snow, and metal read more clearly while
 // preserving the same geometry, controls, and project landmarks.
 const fs=`precision highp float;
 varying vec3 vNormal;varying vec3 vColor;varying vec3 vWorld;
 varying vec3 vLocal;varying float vEmission;varying float vTerrain;uniform float uPulse;uniform float uTime;
 float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
 return mix(mix(hash21(i),hash21(i+vec2(1.,0.)),f.x),mix(hash21(i+vec2(0.,1.)),hash21(i+vec2(1.,1.)),f.x),f.y);}
 void main(){
 vec3 n=normalize(vNormal);
 vec3 key=normalize(vec3(-.54,1.0,.73));
 vec3 fill=normalize(vec3(.78,.40,-.57));
 float diffuse=max(dot(n,key),0.);
 float bounce=max(dot(n,fill),0.);
 float sky=.5+.5*n.y;
 vec3 light=vec3(.42,.45,.48)+vec3(.67,.64,.58)*diffuse
            +vec3(.16,.18,.21)*bounce+vec3(.13,.16,.20)*sky;
 vec3 an=abs(n);
 vec2 uv=an.y>.64?vLocal.xz:(an.x>an.z?vLocal.zy:vLocal.xy);
 float coarse=noise2(uv*6.5), mid=noise2(uv*17.0), fine=noise2(uv*46.0);
 float luminance=dot(vColor,vec3(.299,.587,.114));
 float redBias=vColor.r-max(vColor.g,vColor.b);
 float greenBias=vColor.g-max(vColor.r,vColor.b);
 float blueBias=vColor.b-max(vColor.r,vColor.g);
 float neutral=1.0-clamp(length(vColor-vec3(luminance))*2.6,0.,1.);
 float radius=length(vLocal.xz);
 float isSnow=smoothstep(.76,.88,min(min(vColor.r,vColor.g),vColor.b));
 float isMetal=smoothstep(4.55,4.77,radius)*(1.-smoothstep(.4,.9,vLocal.y));
 float isWater=(1.-isMetal)*smoothstep(.05,.16,blueBias)*(1.-smoothstep(.44,.66,luminance));
 float isGreen=(1.-isWater)*(1.-isSnow)*(1.-isMetal)*smoothstep(.018,.11,greenBias+.02*luminance);
 float isWood=(1.-isWater)*(1.-isSnow)*(1.-isMetal)*smoothstep(.03,.16,redBias+.08*(vColor.r-vColor.b))*smoothstep(.01,.12,vColor.r-vColor.g);
 float isSlate=(1.-isWater)*(1.-isSnow)*(1.-isMetal)*(1.-isWood)*smoothstep(.01,.10,vColor.b-vColor.r)*smoothstep(.22,.72,luminance)*smoothstep(.22,.74,neutral);
 float isEarth=(1.-isWater)*(1.-isSnow)*(1.-isMetal)*(1.-isWood)*(1.-isGreen)*(1.-isSlate)*smoothstep(.00,.11,vColor.r-vColor.g)*smoothstep(.00,.09,vColor.g-vColor.b);
 float isStone=max(0.,(1.-isGreen)*(1.-isWood)*(1.-isWater)*(1.-isMetal)*(1.-isSnow)-isSlate*.75-isEarth*.45);
 float stoneMineral=(coarse-.5)*.12+(fine-.5)*.06;
 float stoneFlecks=smoothstep(.83,.98,noise2(uv*82.0))*.085;
 float blockLines=(1.0-smoothstep(.46,.50,max(abs(fract(uv.x*2.8)-.5),abs(fract(uv.y*2.8)-.5))))*.035;
 float longGrain=noise2(vec2(uv.x*4.0,uv.y*96.0));
 float woodBands=sin(uv.y*42.0 + coarse*2.4)*.5+.5;
 float woodGrain=(longGrain-.5)*.16+(woodBands-.5)*.10+(coarse-.5)*.05;
 float leaf=(noise2(uv*15.0)-.5)*.12+(fine-.5)*.035;
 float earth=(mid-.5)*.10+(fine-.5)*.03;
 float slateStrata=(noise2(vec2(uv.x*24.0,uv.y*6.0))-.5)*.06;
 float slateBands=(1.0-smoothstep(.40,.49,abs(fract(uv.y*8.0)-.5)))*.05;
 float waterRipples=(noise2(vec2((uv.x-uTime*.27)*17.0,uv.y*7.0))-.5)*.05 + (sin((uv.x-uTime*.31)*11.0+uv.y*3.5)*.5+.5-.5)*.03;
 float snowSparkle=(fine-.5)*.02 + smoothstep(.88,.98,noise2(uv*70.0))*.03;
 // Approximately 200% stronger texture contrast than V194 (3x amplitude).
 // The range is bounded so this remains a tactile finish, not color noise.
 float variation=isStone*(stoneMineral+stoneFlecks-blockLines)+isWood*woodGrain+isGreen*leaf+isEarth*earth+isSlate*(slateStrata-slateBands)+isWater*waterRipples+isSnow*snowSparkle;
 float textureStrength=mix(1.5,.42,vTerrain*(1.-isWater));
 variation=clamp(variation*textureStrength,-.25,.25);
 vec3 albedo=vColor*(1.0+variation);
 albedo+=textureStrength*isStone*(stoneFlecks*vec3(.035,.032,.024)-blockLines*vec3(.05,.045,.04));
 albedo+=textureStrength*isWood*((woodBands-.5)*vec3(.055,.024,-.008)+(longGrain-.5)*vec3(.030,.012,-.005));
 albedo+=textureStrength*isGreen*vec3(.00,.025,.00)*(leaf+.4);
 albedo+=textureStrength*isEarth*vec3(.032,.016,-.004)*(earth+.35);
 albedo+=textureStrength*isSlate*(slateBands*vec3(-.020,-.018,-.012)+slateStrata*vec3(.010,.012,.018));
 albedo+=1.5*isWater*vec3(.000,.020,.040)*(waterRipples+.35);
 albedo+=textureStrength*isSnow*vec3(.018,.020,.026)*snowSparkle;
 albedo=clamp(albedo,vec3(.014),vec3(1.0));
 vec3 col=albedo*light;
 // V198: snow keeps a clean white appearance even on faces away from the key light.
 float brightSnow=smoothstep(.88,.985,min(min(vColor.r,vColor.g),vColor.b));
 col=mix(col,vec3(.965,.974,.990)*(0.94+0.06*diffuse),brightSnow*.93);
 float valley=clamp((vWorld.y+.10)/3.5,0.,1.);
 col+=vec3(.013,.024,.032)*(1.-valley);
 vec3 viewDir=normalize(vec3(0.,3.7,9.5)-vWorld);
 vec3 halfVec=normalize(key+viewDir);
 float ndh=max(dot(n,halfVec),0.);
 float stoneSheen=pow(ndh,15.0)*.020*isStone;
 float woodSheen=pow(ndh,20.0)*.010*isWood;
 float slateSheen=pow(ndh,24.0)*.030*isSlate;
 float earthSheen=pow(ndh,14.0)*.006*isEarth;
 float waterSheen=pow(ndh,40.0)*.22*isWater;
 float metalSheen=pow(ndh,62.0)*.28*isMetal;
 float snowSheen=pow(ndh,16.0)*.030*isSnow;
 col+=vec3(.82,.85,.89)*(stoneSheen+woodSheen+slateSheen+earthSheen+waterSheen+metalSheen+snowSheen);
 float rim=pow(1.-max(dot(n,viewDir),0.),3.0)*.030;
 col+=vec3(.15,.22,.29)*rim;
 float glow=clamp(vEmission/2.,0.,1.);

 vec3 lantern=vec3(1.0,.70,.29)*(1.15+.20*uPulse);
 col=mix(col,lantern,glow);
 col=col/(vec3(1.)+max(col-vec3(.79),vec3(0.))*.42);
 col=pow(max(col,vec3(0.)),vec3(.96));
 gl_FragColor=vec4(clamp(col,0.,1.),1.);
 }`;
 const compile=(type,source)=>{let shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader));return shader};
 let prog;try{prog=gl.createProgram();gl.attachShader(prog,compile(gl.VERTEX_SHADER,vs));gl.attachShader(prog,compile(gl.FRAGMENT_SHADER,fs));gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(prog));}catch(e){console.error('Citadel WebGL shader error',e);return null}
 gl.useProgram(prog);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);
 const positions=[],normals=[],colors=[],emissions=[],terrainFlags=[];let emission=0;
 function tri(a,b,c,color){const nx=(b[1]-a[1])*(c[2]-a[2])-(b[2]-a[2])*(c[1]-a[1]),ny=(b[2]-a[2])*(c[0]-a[0])-(b[0]-a[0])*(c[2]-a[2]),nz=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);const L=Math.hypot(nx,ny,nz)||1;for(const p of [a,b,c]){positions.push(...p);normals.push(nx/L,ny/L,nz/L);colors.push(...color);emissions.push(emission);terrainFlags.push(0)}}
 function quad(a,b,c,d,col){tri(a,b,c,col);tri(a,c,d,col)}
 function annulus(ro,ri,y,depth,color,side){for(let j=0;j<96;j++){let t=j*TAU/96,q=(j+1)*TAU/96;const polar=(r,z,k)=>[Math.cos(z)*r,k,Math.sin(z)*r];quad(polar(ri,t,y),polar(ro,t,y),polar(ro,q,y),polar(ri,q,y),color);if(depth)quad(polar(ro,t,y),polar(ro,t,y-depth),polar(ro,q,y-depth),polar(ro,q,y),side||color)}}
 // Decorative metallic platter and glowing circular table edge.
 annulus(5.28,4.75,-.12,.52,[.36,.50,.62],[.10,.18,.27]);annulus(5.23,5.12,-.075,0,[.78,.86,.92]);annulus(4.92,4.80,-.065,0,[.44,.67,.83]);annulus(4.72,4.60,-.09,0,[.12,.28,.44]);
 const landmarkAngles=[0,1.12,2.36,3.24,4.22,5.34], landmarkRadii=[3.06,2.31,1.46,3.52,2.16,3.47];
 const landmarkPads=landmarkAngles.map((a,i)=>({x:Math.sin(a)*landmarkRadii[i],z:Math.cos(a)*landmarkRadii[i],inner:i===2?.56:(i===3?.57:.68),outer:i===2?.98:(i===3?1.07:1.02)}));
 function baseHeight(x,z){
  let r=Math.hypot(x,z);if(r>4.63)return 0;
  // V128: broader mountain systems so they read as ranges instead of isolated spikes.
  // V196: distinct overlapping summits and lower connecting saddles, not a solid wall.
  const peaks=[
    [-3.00,-2.13,1.48,.69],[-2.19,-2.42,1.06,.58],
    // Tall signature summit with a cloud belt; distinct from the observatory peak.
    [-1.55,-2.33,3.85,.74],[-.96,-2.11,.28,.55],
    // Broad, lower summit centered on the original Observatory anchor.
    [-.345,-3.50,1.77,.92],[-.37,-2.66,.48,.62],
    [.64,-2.44,1.14,.69],[1.61,-2.53,1.00,.67],
    [2.55,-2.11,1.18,.61],[3.26,-1.58,.71,.57],
    [-3.06,.84,.88,.97],[-2.42,1.26,.64,.84],
    [1.78,1.36,.60,.90],[2.38,1.72,.46,.70]
  ];
  const ridges=[
    {x1:-3.05,z1:-2.14,x2:3.16,z2:-1.92,amp:.16,width:.41},
    {x1:-2.72,z1:-2.64,x2:2.56,z2:-2.40,amp:.12,width:.35},
    {x1:-3.20,z1:.66,x2:-2.12,z2:1.42,amp:.17,width:.39}
  ];
  let h=.07;
  for(const [px,pz,t,spread] of peaks){
    let d=Math.hypot((x-px)/spread,(z-pz)/spread);
    h+=t*Math.exp(-d*d*1.68);
  }
  for(const rg of ridges){
    const vx=rg.x2-rg.x1,vz=rg.z2-rg.z1;
    const wx=x-rg.x1,wz=z-rg.z1;
    const t=clamp((wx*vx+wz*vz)/(vx*vx+vz*vz),0,1);
    const px=rg.x1+vx*t,pz=rg.z1+vz*t;
    const dist=Math.hypot(x-px,z-pz);
    h+=rg.amp*Math.exp(-(dist*dist)/(rg.width*rg.width));
  }
  // V129: define one broad king's pass instead of several scattered cuts,
  // so the road logic can funnel cross-range travel through a single believable corridor.
  for(const [px,pz,amp,spread] of [[.16,-2.28,.42,.56],[.06,-2.58,.18,.40],[.34,-1.92,.12,.34]]){
    let d=Math.hypot((x-px)/spread,(z-pz)/spread);h-=amp*Math.exp(-d*d*1.55);
  }
  // Carve the riverbed and tunnel approaches into the terrain so the river
  // visually flows through the hills rather than stepping up over them.
  h-=riverCarve(x,z);
  let ridgedetail=.075*Math.sin(x*3.1+z*1.4)*Math.sin(z*3.6-x*1.2)+.024*Math.sin(x*8.4+z*2.8)*Math.cos(z*6.1-x*3.2);
  // Let the circular terrain die down smoothly before its raised rim.
  const edge=1-smooth(4.20,4.68,r);
  return .055 + Math.max(0,h+(h>.75?ridgedetail:0)-.055)*edge;
 }
 function height(x,z){
  let h=baseHeight(x,z);
  for(const p of landmarkPadTargets){
   const d=Math.hypot(x-p.x,z-p.z);
   if(d>=p.outer) continue;
   const t=1-smooth(p.inner,p.outer,d);
   // Blend the terrain toward a level build pad, while preserving a gentle edge falloff.
   const target=p.target + (d<p.inner?0:(1-t)*0.012);
   h=h*(1-t)+target*t;
  }
  return h;
 }
 function riverZ(x){return 1.08+.48*Math.sin(x*1.04+.5)+.19*Math.sin(x*2.6)}
 // V133: the river now passes through two separate hills, so hide the surface
 // water within both tunnel spans rather than painting blue up a mountainside.
 const riverTunnels=[
  // Extended so the river fully disappears inside both hills instead of
  // visibly climbing the slopes before reaching the culvert mouths.
  {start:-3.88,end:-1.72},
  {start:1.18,end:2.66}
 ];
 function inRiverTunnel(x,margin=0){return riverTunnels.some(t=>x>t.start-margin && x<t.end+margin)}
 function tunnelEase(x,a,b){return smooth(a,b,x)*(1-smooth(b,b+(b-a),x))}
 function riverCarve(x,z){
  const dz=Math.abs(z-riverZ(x));
  let cut=.18*(1-smooth(.06,.34,dz));
  // Broader valleys approaching the tunnel mouths keep the water from reading
  // like it is climbing a staircase up the hillsides.
  for(const t of riverTunnels){
    const span=smooth(t.start-.40,t.start+.40,x)*(1-smooth(t.end-.40,t.end+.40,x));
    const mouthL=1-smooth(.0,.62,Math.abs(x-t.start));
    const mouthR=1-smooth(.0,.62,Math.abs(x-t.end));
    cut+=.14*span*(1-smooth(.08,.42,dz));
    cut+=.20*Math.max(mouthL,mouthR)*(1-smooth(.05,.40,dz));
  }
  return cut;
 }

 // V130: vertex-interpolated terrain palette. Instead of abrupt tile-wise
 // altitude thresholds, interpolate grass, pine slopes, stone and snow smoothly.
 function mix3(a,b,t){t=clamp(t,0,1);return a.map((v,i)=>v+(b[i]-v)*t)}
 const smooth=(a,b,t)=>{t=clamp((t-a)/(b-a),0,1);return t*t*(3-2*t)};
 // Evaluate the pad heights only after river geometry and easing helpers exist.
 const landmarkPadTargets=landmarkPads.map(p=>({...p,target:baseHeight(p.x,p.z)}));
 function terrainColor(x,z,y){
  const meadow=[.36,.43,.29],pine=[.24,.39,.29],rock=[.48,.49,.47],snow=[.99,.995,1.0];
  let c=mix3(meadow,pine,smooth(.19,.95,y));
  c=mix3(c,rock,smooth(1.08,2.33,y));
  const snowLine=1.42+.12*Math.sin(x*7.7+z*3.1)+.09*Math.sin(z*12.3-x*5.8);
  const snowCoverage=smooth(snowLine,snowLine+.52,y);
  c=mix3(c,snow,snowCoverage);
  // Natural variation, much smaller than the height-driven color gradient.
  const variation=.014*Math.sin(x*2.4+z*.9)*Math.cos(z*2.7-x*.65)+.004*Math.sin(x*17.8+z*9.3)*Math.cos(z*13.5-x*4.8);
  c=c.map(v=>clamp(v+variation,0,1));
  // Fine sediment and exposed scree emerge on steep hillsides. These values
  // blend with the existing height-based biomes rather than repainting roads.
  const slope=Math.hypot(height(x+.045,z)-height(x-.045,z),height(x,z+.045)-height(x,z-.045))/.09;
  const scree=smooth(.75,2.3,slope)*smooth(.55,1.2,y)*.27;
  c=mix3(c,[.53,.53,.50],scree*(1.-snowCoverage*.52));
  const highSnow=smooth(1.46,2.20,y)*(.09+.08*Math.sin(x*13.+z*11.));
  c=mix3(c,[1.,1.,1.],highSnow);
  const shore=Math.abs(z-riverZ(x));
  // Do not paint water up and over the hill between the masonry portals.
  // The concealed section is a real absence of surface water, not a dark stripe.
  const visibleWater=inRiverTunnel(x)?0:1;
  c=mix3(c,[.27,.43,.30],(1-smooth(.21,.43,shore))*visibleWater);
  c=mix3(c,[.14,.38,.60],(1-smooth(.105,.21,shore))*visibleWater);
  return c;
 }
 function terrainTriangle(a,b,c){
  const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2];
  const vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];
  const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,L=Math.hypot(nx,ny,nz)||1;
  for(const v of [a,b,c]){positions.push(...v);normals.push(nx/L,ny/L,nz/L);colors.push(...terrainColor(v[0],v[2],v[1]));emissions.push(0);terrainFlags.push(1)}
 }
 // V196: circular radial topology, flush with the inner edge of the bezel.
 // The former square cell mask left a visibly jagged, inconsistent rim.
 const terrainRadius=4.70, radialSteps=92, angularSteps=256;
 function groundPoint(r,t){
  const x=Math.cos(t)*r,z=Math.sin(t)*r;
  return [x,height(x,z),z];
 }
 for(let ring=0;ring<radialSteps;ring++){
  const r0=terrainRadius*ring/radialSteps;
  const r1=terrainRadius*(ring+1)/radialSteps;
  for(let j=0;j<angularSteps;j++){
   const a=TAU*j/angularSteps,b=TAU*(j+1)/angularSteps;
   const p0=groundPoint(r0,a),p1=groundPoint(r1,a);
   const p2=groundPoint(r1,b),p3=groundPoint(r0,b);
   terrainTriangle(p0,p1,p2);
   if(ring>0)terrainTriangle(p0,p2,p3);
   // Vertical edge closes the terrain against the inner metal rim.
   if(ring===radialSteps-1){
    const edgeColor=[.34,.35,.32], floorY=-.105;
    quad(p1,[p1[0],floorY,p1[2]],[p2[0],floorY,p2[2]],p2,edgeColor);
   }
  }
 }
 for(let r=4.1;r>1.1;r-=1.2)annulus(r+.008,r-.008,.055,0,[.22,.34,.42]);
 // Little conifer trees are extruded conical meshes and cast real polygon normals.
 function cone(x,z,y,r,h,col,segments=7){for(let k=0;k<segments;k++){let a=k*TAU/segments,b=(k+1)*TAU/segments;tri([x+Math.cos(a)*r,y,z+Math.sin(a)*r],[x+Math.cos(b)*r,y,z+Math.sin(b)*r],[x,y+h,z],col)}}
 let seed=47;const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
 for(let k=0;k<52;k++){let x=(rand()-.5)*8.7,z=(rand()-.5)*8.7;if(Math.hypot(x,z)>4.35||Math.abs(z-riverZ(x))<.38||height(x,z)>1.20)continue;let h=.23+rand()*.33,r=.095+rand()*.06;cone(x,z,height(x,z),r,h,[.11,.34+rand()*.12,.14],6)}
 // V197: a broken, soft-edged cloud belt around the tall summit.
 // Low-poly ellipsoids deliberately have no alpha sorting or depth glitches.
 function cloudPuff(cx,cy,cz,rx,ry,rz,tint){
   const slices=12,stacks=6;
   const at=(a,b)=>[cx+rx*Math.cos(b)*Math.cos(a),cy+ry*Math.sin(b),cz+rz*Math.cos(b)*Math.sin(a)];
   for(let j=0;j<stacks;j++){
     const b0=-Math.PI/2+Math.PI*j/stacks,b1=-Math.PI/2+Math.PI*(j+1)/stacks;
     for(let i=0;i<slices;i++){
       const a0=TAU*i/slices,a1=TAU*(i+1)/slices;
       quad(at(a0,b0),at(a1,b0),at(a1,b1),at(a0,b1),tint);
     }
   }
 }
 const cloudCenter={x:-1.55,z:-2.33};
 const cloudY=2.48;
 // Thin, irregular white wisps: several offset, broken cloud strands.
 for(let layer=0;layer<3;layer++){
  const count=34;
  for(let j=0;j<count;j++){
   const a=TAU*(j+(layer*.29))/count;
   if((j+layer*7)%13===0 || (j+layer*5)%17===0)continue;
   const r=.82+layer*.115+.09*Math.sin(j*2.17+layer);
   const x=cloudCenter.x+Math.cos(a)*r,z=cloudCenter.z+Math.sin(a)*r;
   const y=cloudY+(layer-1)*.085+.055*Math.sin(j*1.67+layer*2.);
   cloudPuff(x,y,z,.23+.075*Math.sin(a*3.+layer),.033+(j%4)*.008,.095+(j%5)*.017,[.985,.991,1.0]);
  }
 }
 // Landmark miniature architecture. All meshes share the table's world-space Y axis.
 const angles=landmarkAngles,radii=landmarkRadii;
 function cuboid(x,z,y,w,d,h,col,roofCol){
  let X=x-w/2,Z=z-d/2,T=y+h;
  quad([X,y,Z],[X+w,y,Z],[X+w,T,Z],[X,T,Z],col);
  quad([X+w,y,Z+d],[X,y,Z+d],[X,T,Z+d],[X+w,T,Z+d],col);
  quad([X+w,y,Z],[X+w,y,Z+d],[X+w,T,Z+d],[X+w,T,Z],col);
  quad([X,y,Z+d],[X,y,Z],[X,T,Z],[X,T,Z+d],col);
  quad([X,T,Z],[X+w,T,Z],[X+w,T,Z+d],[X,T,Z+d],roofCol||col);
 }
 function discAt(x,z,y,r,col,segments=18){for(let k=0;k<segments;k++){let a=k*TAU/segments,b=(k+1)*TAU/segments;tri([x,y,z],[x+Math.cos(a)*r,y,z+Math.sin(a)*r],[x+Math.cos(b)*r,y,z+Math.sin(b)*r],col)}}
 function tower(x,z,scale=1,baseY=height(x,z)){let y=baseY;cuboid(x,z,y,.34*scale,.34*scale,.52*scale,[.42,.42,.40],[.54,.53,.50]);cone(x,z,y+.52*scale,.30*scale,.40*scale,[.32,.29,.31],8)}
 function path(x1,z1,x2,z2,steps=18,width=.06,color=[.57,.47,.34]){
  // V130: no road geometry on mountainsides. Entire road segments disappear
  // on elevated or steep surfaces, instead of being painted over cliff faces.
  for(let j=0;j<steps;j++){
   const t=j/steps,q=(j+1)/steps;
   const xa=x1+(x2-x1)*t,za=z1+(z2-z1)*t,xb=x1+(x2-x1)*q,zb=z1+(z2-z1)*q;
   const dx=xb-xa,dz=zb-za,L=Math.hypot(dx,dz)||1,nx=-dz/L*width,nz=dx/L*width;
   const mx=(xa+xb)*.5,mz=(za+zb)*.5;
   const heights=[height(xa+nx,za+nz),height(xa-nx,za-nz),height(xb-nx,zb-nz),height(xb+nx,zb+nz),height(mx,mz)];
   if(Math.max(...heights)>.63 || Math.max(...heights)-Math.min(...heights)>.125)continue;
   quad([xa+nx,heights[0]+.028,za+nz],[xa-nx,heights[1]+.028,za-nz],[xb-nx,heights[2]+.028,zb-nz],[xb+nx,heights[3]+.028,zb+nz],color);
  }
 }
 function arc(x,z,y,r1,r2,col){for(let k=0;k<24;k++){let a=k*TAU/24,b=(k+1)*TAU/24;quad([x+Math.cos(a)*r1,y,z+Math.sin(a)*r1],[x+Math.cos(a)*r2,y,z+Math.sin(a)*r2],[x+Math.cos(b)*r2,y,z+Math.sin(b)*r2],[x+Math.cos(b)*r1,y,z+Math.sin(b)*r1],col)}}
 // Each building group is recognizable from a seated camera angle. Their center is the actual software marker.
 const landmarkNames=['Sentinel Fortress','Ironworks','Circle of the Ancients','Observatory','Clockwork Mill','Vault of Cards'];
 const landmarkTypes=['fortress','ironworks','circle','observatory','mill','vault'];
 const anchors=angles.map((a,i)=>{let x=Math.sin(a)*radii[i],z=Math.cos(a)*radii[i];return {x,z,y:height(x,z),type:landmarkTypes[i]}});
 anchors.forEach((p,i)=>{
  let {x,z,y,type}=p;emission=.44;
  if(type==='fortress'){
   cuboid(x,z,y,.78,.64,.60,[.49,.51,.48],[.59,.60,.56]);tower(x-.43,z-.33,.75);tower(x+.43,z-.33,.75);tower(x-.43,z+.33,.75);tower(x+.43,z+.33,.75);
   tower(x,z,1.18,y+.60);path(x,z+.44,x*.77,z*.77,16,.075);
  }else if(type==='ironworks'){
   cuboid(x,z,y,.68,.56,.44,[.43,.34,.27],[.41,.26,.22]);cuboid(x-.28,z-.20,y,.14,.15,.90,[.43,.39,.36]);cuboid(x+.27,z-.1,y,.15,.15,.69,[.41,.35,.32]);
   // The ironworks stands alone; redundant cottages removed.
  }else if(type==='circle'){
   discAt(x,z,y+.05,.48,[.27,.38,.29]);for(let k=0;k<9;k++){let a=k*TAU/9,px=x+Math.cos(a)*.42,pz=z+Math.sin(a)*.42; cuboid(px,pz,height(px,pz),.10,.10,.38,[.58,.60,.51])}
   cone(x+.66,z-.27,height(x+.66,z-.27),.22,.55,[.16,.33,.18],7);
  }else if(type==='observatory'){
   cuboid(x,z,y,.58,.58,.68,[.52,.55,.59],[.58,.62,.64]);cone(x,z,y+.68,.39,.42,[.36,.39,.48],12);
   tower(x+.51,z-.38,.64);
  }else if(type==='mill'){
   cuboid(x,z,y,.79,.61,.41,[.56,.46,.33],[.41,.31,.25]); // A single gabled roof is installed in the finishing pass.
   let wheelX=x+.44,wheelZ=z+.15;for(let k=0;k<12;k++){let a=k*TAU/12,b=(k+1)*TAU/12;let r1=.25,r2=.31;quad([wheelX,wheelZ?y+Math.cos(a)*r1:y,wheelZ+Math.sin(a)*r1],[wheelX,y+Math.cos(a)*r2,wheelZ+Math.sin(a)*r2],[wheelX,y+Math.cos(b)*r2,wheelZ+Math.sin(b)*r2],[wheelX,y+Math.cos(b)*r1,wheelZ+Math.sin(b)*r1],[.34,.26,.20])}
  }else{
   cuboid(x,z,y,.82,.78,.50,[.57,.55,.49],[.62,.62,.57]); // Use one gabled roof, not a second intersecting pyramidal roof.
   cuboid(x-.47,z,y,.18,.26,.52,[.47,.45,.42]);cuboid(x+.47,z,y,.18,.26,.52,[.47,.45,.42]);
  }
  // Secondary architecture: coherent fantasy details rather than generic towers.
  emission=.17;
  if(type==='fortress'){
    for(let k=-2;k<=2;k++){cuboid(x+k*.16,z-.40,height(x+k*.16,z-.40),.12,.12,.16,[.65,.66,.60]);cuboid(x+k*.16,z+.40,height(x+k*.16,z+.40),.12,.12,.16,[.65,.66,.60])}
    cuboid(x,z+.34,height(x,z+.34),.18,.08,.32,[.24,.22,.20]);
    path(x,z+.60,x+.20,z+1.15,12,.07,[.60,.49,.36]);
    // Keep the fortress grounds uncluttered.
  }else if(type==='ironworks'){
    // Remove the repeated workers’ huts beside the forge.
    cuboid(x+.40,z-.38,height(x+.40,z-.38),.22,.20,.82,[.42,.39,.34]);
    cuboid(x-.36,z-.36,height(x-.36,z-.36),.20,.17,.64,[.48,.42,.36]);
    discAt(x,z-.72,height(x,z-.72)+.03,.27,[.52,.36,.22]);
    path(x,z+.54,x-.92,z+.92,13,.065,[.58,.42,.26]);
  }else if(type==='circle'){
    for(let k=0;k<15;k++){let a=k*TAU/15,r=.78+(k%3)*.09,xx=x+Math.cos(a)*r,zz=z+Math.sin(a)*r; if(height(xx,zz)<1.3)cone(xx,zz,height(xx,zz),.10,.36,[.10,.28,.13],7)}
    discAt(x,z,y+.070,.20,[.39,.48,.35]);path(x,z+.63,x+.44,z+1.05,11,.04,[.49,.45,.31]);
  }else if(type==='observatory'){
    for(let k=0;k<7;k++){let a=k*TAU/7,xx=x+Math.cos(a)*.62,zz=z+Math.sin(a)*.62; cuboid(xx,zz,height(xx,zz),.12,.12,.25,[.54,.55,.55])}
    cuboid(x,z-.45,height(x,z-.45)+.02,.13,.28,.26,[.55,.56,.57]);
    for(let k=0;k<3;k++)discAt(x+.45-k*.10,z-.46+k*.15,height(x+.45-k*.10,z-.46+k*.15)+.05,.085,[.52,.55,.54]);
  }else if(type==='mill'){
    cuboid(x+.73,z,height(x+.73,z),.34,.34,.30,[.52,.43,.31]);
    path(x-.36,z+.48,x-1.1,z+.62,20,.075,[.53,.44,.31]);
    // The mill itself remains the focal point.
    // Mill race: stone channel cut beside the workshop.
    path(x+.38,z-.85,x+.55,z+.88,26,.11,[.21,.43,.58]);
  }else{
    for(let k=-2;k<=2;k++){cuboid(x+k*.17,z+.51,height(x+k*.17,z+.51),.13,.12,.22,[.55,.55,.53])}
    // Eliminate the row of miniature outbuildings.
    cuboid(x,z-.54,height(x,z-.54)+.02,.13,.20,.36,[.50,.47,.46]);
  }
  // Lit architecture: orange-gold window openings and magical seams are real emissive meshes.
  // These surfaces share the buildings' 3D transforms and vanish correctly behind hills.
  emission=2.65;
  function windowFace(cx,cz,yy,ww=.095,hh=.13){
    const front=cz+.014;
    quad([cx-ww/2,yy,front],[cx+ww/2,yy,front],[cx+ww/2,yy+hh,front],[cx-ww/2,yy+hh,front],[1.0,.69,.29]);
  }
  const faceZ=z+(type==='circle'?.025:type==='mill'?.315:type==='vault'?.395:type==='fortress'?.33:.30);
  if(type==='fortress'){
    for(let col=-1;col<=1;col++) windowFace(x+col*.21,faceZ,y+.22,.10,.18);
    for(let col=-1;col<=1;col++) windowFace(x+col*.21,z-.32,y+.34,.07,.13);
  }else if(type==='ironworks'){
    for(let col=-1;col<=1;col++) windowFace(x+col*.19,faceZ,y+.16,.11,.17);
    windowFace(x-.28,z-.108,y+.70,.065,.14);
  }else if(type==='circle'){
    for(let k=0;k<9;k++){let a=k*TAU/9,px=x+Math.cos(a)*.42,pz=z+Math.sin(a)*.42;
      discAt(px,pz,height(px,pz)+.41,.053,[.85,.96,.85],10)
    }
  }else if(type==='observatory'){
    for(let col=-1;col<=1;col++)windowFace(x+col*.16,faceZ,y+.35,.072,.17);
    // Omit planar glowing ring through the observatory dome (visible z-fighting).
  }else if(type==='mill'){
    for(let col=-1;col<=1;col++) windowFace(x+col*.20,faceZ,y+.16,.085,.15);
    windowFace(x+.73,z+.175,y+.11,.085,.13);
  }else{
    for(let col=-1;col<=1;col++) windowFace(x+col*.20,faceZ,y+.22,.092,.17);
    for(let col=-1;col<=1;col++) windowFace(x+col*.20,z-.39,y+.26,.065,.13);
  }
  // Small gilded perimeter runes function as a restrained, pulsing halo on the building itself.
  const ground=height(x,z)+.045;
  arc(x,z,ground,.49,.515,[.63,.72,.48]);
  emission=0;
  // Store precise screen anchor at the building's highest recognizable roof, not at a guessed altitude.
  const roofOffset={fortress:1.25,ironworks:1.02,circle:.48,observatory:1.12,mill:.70,vault:.94}[type];
  // Detailed windows and lantern-lit trim are part of the rotating 3D mesh, not screen overlays.
  emission=1.9;
  const warm=[.96,.69,.31], pale=[.89,.81,.59];
  if(type==='fortress'){
   for(let side of [-1,1]){for(let k=-1;k<=1;k++){
    cuboid(x+k*.18,z+side*.325,y+.28,.075,.018,.15,warm);
   }}
   cuboid(x,z+.405,y+.30,.13,.023,.25,warm);
  }else if(type==='ironworks'){
   for(let k=-1;k<=1;k++)cuboid(x+k*.20,z+.294,y+.15,.095,.02,.17,warm);
   cuboid(x-.28,z-.20,y+.74,.16,.16,.045,pale);
   cuboid(x+.27,z-.10,y+.57,.17,.17,.04,pale);
  }else if(type==='circle'){
   for(let k=0;k<9;k++){let a=k*TAU/9,xx=x+Math.cos(a)*.42,zz=z+Math.sin(a)*.42;
    cuboid(xx,zz,height(xx,zz)+.28,.11,.11,.035,warm);
   }
   discAt(x,z,y+.062,.115,warm);
  }else if(type==='observatory'){
   for(let k=0;k<4;k++){let a=k*TAU/4;let xx=x+Math.sin(a)*.27,zz=z+Math.cos(a)*.27;
    cuboid(xx,zz,y+.30,.105,.105,.22,pale);
   }
   cuboid(x,z,y+1.065,.14,.14,.07,warm);
  }else if(type==='mill'){
   for(let k=-1;k<=1;k++)cuboid(x+k*.19,z+.315,y+.16,.095,.02,.16,warm);
   cuboid(x+.44,z+.15,y+.22,.06,.11,.08,pale);
  }else if(type==='vault'){
   for(let k=-1;k<=1;k++)cuboid(x+k*.21,z+.397,y+.22,.11,.024,.18,warm);
   cuboid(x,z+.4,y+.045,.20,.027,.30,pale);
  }
  emission=.0;
  p.labelY=y+roofOffset*.52;
  p.glowY=y+roofOffset*.52;
  emission=0;
 });
 // V125: handcrafted fantasy landmark embellishments; no clouds or overlays.
 anchors.forEach((p,i)=>{
   const {x,z,y,type}=p;
   const stone=[.58,.56,.53],trim=[.72,.66,.50],slate=[.30,.34,.39],wood=[.34,.26,.20];
   emission=0;
   if(type==='fortress'){
     for(const side of [-1,1]){
       for(let j=-2;j<=2;j++){const xx=x+j*.15,zz=z+side*.35;cuboid(xx,zz,height(xx,zz)+.53,.10,.12,.14,stone)}
       const xx=x+side*.43;cuboid(xx,z,height(xx,z),.10,.65,.47,stone);
       for(let j=-1;j<=1;j++)cuboid(xx,z+j*.22,height(xx,z+j*.22)+.48,.11,.11,.12,trim);
     }
     cuboid(x,z+.46,height(x,z+.46),.37,.17,.37,stone);
     cuboid(x,z+.55,height(x,z+.55)+.06,.16,.020,.29,wood);
     for(const side of [-1,1]){const xx=x+side*.23;cuboid(xx,z+.62,height(xx,z+.62)+.14,.025,.025,.42,wood)}
   }else if(type==='ironworks'){
     for(const side of [-1,1]){const xx=x+side*.43;
       cuboid(xx,z+.08,height(xx,z+.08),.32,.48,.25,[.43,.36,.29]);
       cone(xx,z+.08,height(xx,z+.08)+.25,.27,.23,slate,4);
       for(let j=0;j<3;j++)cuboid(xx-.12+j*.12,z+.35,height(xx-.12+j*.12,z+.35),.075,.09,.18,wood);
     }
     for(const dx of [-.28,.27]){cuboid(x+dx,z-.20,height(x+dx,z-.20)+.65,.21,.21,.11,stone);
       cuboid(x+dx,z-.20,height(x+dx,z-.20)+.77,.16,.16,.065,[.22,.20,.20])}
     cuboid(x,z+.70,height(x,z+.70),.46,.15,.12,[.34,.41,.45]);
   }else if(type==='circle'){
     arc(x,z,y+.060,.24,.30,trim);
     for(let j=0;j<4;j++){const a=j*TAU/4,xx=x+Math.sin(a)*.62,zz=z+Math.cos(a)*.62;
       cuboid(xx,zz,height(xx,zz),.14,.14,.42,stone);
       cuboid(xx,zz,height(xx,zz)+.42,.20,.19,.055,trim)}
     for(let j=0;j<6;j++){const a=(j+.5)*TAU/6,xx=x+Math.cos(a)*.88,zz=z+Math.sin(a)*.88;
       if(height(xx,zz)<1.2)cone(xx,zz,height(xx,zz),.11,.34,[.13,.30,.15],7)}
   }else if(type==='observatory'){
     for(let j=0;j<8;j++){const a=j*TAU/8,xx=x+Math.cos(a)*.30,zz=z+Math.sin(a)*.30;
       cuboid(xx,zz,height(xx,zz)+.47,.075,.075,.20,stone)}
     cuboid(x+.64,z+.23,height(x+.64,z+.23),.35,.27,.39,stone);
     cone(x+.64,z+.23,height(x+.64,z+.23)+.39,.25,.18,slate,8);
     cuboid(x-.28,z-.35,height(x-.28,z-.35)+.52,.09,.09,.30,trim);
     cuboid(x-.35,z-.42,height(x-.35,z-.42)+.79,.29,.12,.08,slate);
   }else if(type==='mill'){
     for(const dz of [-.22,.22]){cuboid(x+.47,z+dz,height(x+.47,z+dz),.09,.13,.34,wood);
       cuboid(x+.47,z+dz,height(x+.47,z+dz)+.29,.16,.13,.046,trim)}
     cuboid(x-.55,z-.16,height(x-.55,z-.16),.36,.32,.41,[.48,.39,.29]);
     cone(x-.55,z-.16,height(x-.55,z-.16)+.41,.30,.23,slate,4);
     for(let j=0;j<4;j++){const xx=x-.49+j*.15,zz=z+.58;cuboid(xx,zz,height(xx,zz),.12,.12,.15,[.44,.29,.16])}
   }else if(type==='vault'){
     for(const side of [-1,1])for(const dz of [-.39,.39]){const xx=x+side*.39,zz=z+dz;
       cuboid(xx,zz,height(xx,zz),.16,.16,.60,stone);
       cone(xx,zz,height(xx,zz)+.60,.14,.25,slate,6)}
     for(let j=0;j<3;j++)cuboid(x,z+.58+j*.10,height(x,z+.58+j*.10),.49-j*.11,.16,.055,stone);
     cuboid(x,z-.03,y+.85,.11,.11,.14,trim);
   }
   // True emissive door-side lanterns stay fixed to the 3D building.
   if(type!=='circle'){
     emission=2.2;
     for(const side of [-1,1]){const xx=x+side*.29,zz=z+.40;
       cuboid(xx,zz,height(xx,zz)+.23,.055,.055,.14,[.99,.77,.40])}
   }
   emission=0;
 });
 // V131: finishing architectural pass. Extra meshes are anchored to the actual
 // six project sites and rotate with the terrain; no label/glow calculations changed.
 const finishStone=[.62,.60,.55],finishDark=[.30,.31,.34],finishOak=[.36,.25,.19],finishCopper=[.55,.38,.25],finishGold=[.78,.65,.38];
 function pitchedRoof(cx,cz,base,w,d,rise,roofCol){
   const X=cx-w/2,Z=cz-d/2,T=base+rise;
   quad([X,base,Z],[cx,T,Z],[cx,T,Z+d],[X,base,Z+d],roofCol);
   quad([cx,T,Z],[X+w,base,Z],[X+w,base,Z+d],[cx,T,Z+d],roofCol);
   tri([X,base,Z],[X+w,base,Z],[cx,T,Z],finishDark);
   tri([X+w,base,Z+d],[X,base,Z+d],[cx,T,Z+d],finishDark);
   cuboid(cx,cz,base+rise-.02,.035,d+.03,.055,finishCopper);
 }
 function framedDoor(cx,front,base,width=.20,high=.30){
   cuboid(cx,front,base,width,.033,high,finishDark);
   for(const side of [-1,1])cuboid(cx+side*width*.58,front+.018,base,.028,.044,high+.04,finishStone);
   cuboid(cx,front+.018,base+high,.30,.062,.048,finishStone);
   emission=1.5;cuboid(cx+width*.32,front+.026,base+high*.48,.024,.018,.025,[.90,.75,.39]);emission=0;
 }
 function crossBeam(cx,cz,base,w,h){
   cuboid(cx-w*.46,cz,base,.048,.065,h,finishOak);
   cuboid(cx+w*.46,cz,base,.048,.065,h,finishOak);
   cuboid(cx,cz,base+h*.82,w,.064,.045,finishOak);
 }
 anchors.forEach(p=>{
   const {x,z,y,type}=p;emission=0;
   if(type==='fortress'){
     // Main gate arch, proper ramparts, banners and signal braziers.
     framedDoor(x,z+.352,y,.21,.32);
     cuboid(x,z-.34,y+.62,.72,.07,.08,[.70,.69,.64]);
     for(let j=-3;j<=3;j++){const xx=x+j*.115;
       cuboid(xx,z-.34,y+.70,.07,.09,.10,[.69,.68,.63]);
     }
     for(const side of [-1,1]){
       const tx=x+side*.43;
       cuboid(tx,z+.34,height(tx,z+.34)+.49,.08,.16,.20,finishGold);
       cuboid(tx,z+.435,height(tx,z+.435)+.39,.10,.018,.21,[.28,.37,.55]);
       emission=1.55;cone(tx,z+.23,height(tx,z+.23)+.68,.072,.16,[.94,.52,.24],6);emission=0;
     }
     cuboid(x,z+.49,y+.08,.48,.29,.06,finishStone);
   }else if(type==='ironworks'){
     // Distinct pitched annex roofs, chimney stonework, timber trusses and forge.
     pitchedRoof(x,z,y+.49,.83,.73,.31,finishDark);
     pitchedRoof(x-.56,z+.28,height(x-.56,z+.28)+.33,.30,.33,.15,finishCopper);
     crossBeam(x,z+.30,y+.02,.59,.41);
     framedDoor(x,z+.315,y,.19,.27);
     for(const dx of [-.28,.28]){
       const xx=x+dx;
       cuboid(xx,z-.20,y+.74,.21,.21,.085,finishStone);
       cuboid(xx,z-.20,y+.85,.13,.13,.06,[.20,.20,.22]);
     }
     cuboid(x+.64,z+.52,height(x+.64,z+.52)+.01,.24,.18,.10,finishOak);
     emission=1.8;cuboid(x+.60,z+.48,height(x+.60,z+.48)+.14,.22,.05,.055,[.93,.43,.19]);emission=0;
   }else if(type==='circle'){
     // Stepped ritual floor, carved lintels and four tiny glowing rune tablets.
     for(let j=0;j<12;j++){
       const a=j*TAU/12,xx=x+Math.cos(a)*.57,zz=z+Math.sin(a)*.57;
       cuboid(xx,zz,height(xx,zz)+.012,.18,.10,.075,finishStone);
     }
     for(let j=0;j<4;j++){
       const a=(j+.5)*TAU/4,xx=x+Math.cos(a)*.32,zz=z+Math.sin(a)*.32;
       cuboid(xx,zz,height(xx,zz)+.06,.12,.12,.20,[.48,.52,.46]);
       emission=1.9;cuboid(xx,zz,height(xx,zz)+.21,.07,.07,.025,[.70,.86,.69]);emission=0;
     }
     cuboid(x,z,y+.07,.24,.24,.11,[.62,.63,.55]);
     emission=1.4;discAt(x,z,y+.19,.11,[.66,.82,.75],12);emission=0;
   }else if(type==='observatory'){
     // A domed telescope station with copper meridian bands and lookout balcony.
     for(let k=0;k<8;k++){
       const a=k*TAU/8,xx=x+Math.cos(a)*.32,zz=z+Math.sin(a)*.32;
       cuboid(xx,zz,y+.58,.05,.05,.11,finishGold);
     }
     // The former horizontal copper band intersected the sloping dome.
     cuboid(x-.11,z-.02,y+1.09,.24,.16,.055,finishGold);
     cuboid(x-.25,z-.07,y+1.15,.10,.10,.17,finishDark);
     framedDoor(x,z+.298,y,.18,.29);
     cuboid(x+.64,z+.28,height(x+.64,z+.28)+.43,.30,.23,.06,finishStone);
     for(const dx of [-.10,.10])cuboid(x+.64+dx,z+.40,height(x+.64+dx,z+.40)+.31,.03,.03,.12,finishGold);
   }else if(type==='mill'){
     // Timber-framed mill with a ridged roof, slatted wheel and grain loading dock.
     pitchedRoof(x,z,y+.43,.84,.66,.29,[.39,.32,.28]);
     crossBeam(x,z+.318,y,.73,.38);
     framedDoor(x-.12,z+.329,y,.19,.27);
     cuboid(x-.60,z+.48,height(x-.60,z+.48)+.01,.38,.19,.09,finishOak);
     for(let j=-2;j<=2;j++){
       cuboid(x-.60+j*.075,z+.49,height(x-.60+j*.075,z+.49)+.10,.03,.22,.032,finishStone);
     }
     for(let j=0;j<8;j++){
       const a=j*TAU/8,cx=x+.49,cz=z+.15,base=y+.24;
       quad([cx,base,cz],[cx,base+Math.cos(a)*.28,cz+Math.sin(a)*.28],
        [cx,base+Math.cos(a+.14)*.28,cz+Math.sin(a+.14)*.28],[cx,base,cz],finishOak);
     }
   }else if(type==='vault'){
     // Gabled archive wing, protected entry and engraved roofline ornaments.
     pitchedRoof(x,z,y+.52,.86,.80,.34,finishDark);
     for(const dx of [-.31,.31])pitchedRoof(x+dx,z-.58,height(x+dx,z-.58)+.27,.22,.32,.12,[.35,.38,.42]);
     framedDoor(x,z+.41,y,.22,.33);
     for(const dx of [-.28,.28]){
       cuboid(x+dx,z+.40,y+.33,.10,.028,.16,finishGold);
       cuboid(x+dx,z+.414,y+.40,.055,.016,.055,finishDark);
     }
     cuboid(x,z-.06,y+.87,.055,.055,.16,finishGold);
     cone(x,z-.06,y+1.03,.08,.11,finishCopper,6);
   }
   emission=0;
 });
 // Roads between settlement landmarks & little hamlets to unify the terrain.
 // V129: cross-range travel is intentionally funneled through one king's pass.
 const kingsPassSouth=[.06,-2.66], kingsPassMid=[.16,-2.28], kingsPassNorth=[.34,-1.62];
 const mainRoads=[
   // Southern realm roads gather toward the mountain pass.
   [[anchors[4].x,anchors[4].z],[-1.32,-1.46],[-.62,-2.02],kingsPassSouth,kingsPassMid],
   [[anchors[3].x,anchors[3].z],[-.18,-3.06],[-.02,-2.84],kingsPassSouth],
   [[anchors[2].x,anchors[2].z],[.78,-1.48],[.44,-1.98],kingsPassSouth,kingsPassMid],
   // Northern realm roads branch from the far side of the pass.
   [kingsPassNorth,[-.18,-.78],[.02,.86],[anchors[0].x,anchors[0].z]],
   [kingsPassNorth,[.98,-.76],[1.58,.04],[anchors[1].x,anchors[1].z]],
   [kingsPassNorth,[-.84,-.62],[-1.72,.62],[anchors[5].x,anchors[5].z]],
   // The pass itself.
   [kingsPassSouth,kingsPassMid,kingsPassNorth]
 ];
 for(const pts of mainRoads)route(pts,.046,[.48,.39,.29]);
 // Remove randomly scattered cottages; preserve the road network.
 // Secondary roads are now local connectors, not alternate mountain crossings.
 const sideTracks=[
   [[anchors[5].x,anchors[5].z],[-2.10,1.58],[-1.04,2.38],[anchors[0].x,anchors[0].z]],
   [[anchors[0].x,anchors[0].z],[1.02,2.18],[1.78,1.44],[anchors[1].x,anchors[1].z]],
   [[anchors[4].x,anchors[4].z],[-1.28,-1.88],[-.82,-2.44],[anchors[3].x,anchors[3].z]],
   [[anchors[3].x,anchors[3].z],[.06,-2.92],[.86,-2.16],[anchors[2].x,anchors[2].z]]
 ];
 for(const pts of sideTracks)route(pts,.024,[.47,.43,.32]);
 // V133 — sculpted stone-faced river tunnels through both hills the river crosses.
 // All tunnel mouths are integrated into the actual rotating map geometry.
 function riverArch(x,facesEast){
  // V199: single coherent vaulted masonry culvert. No opaque central slab.
  const z=riverZ(x),ground=height(x,z),base=ground+.024;
  const outward=facesEast?1:-1;
  const outside=x+outward*.035, inside=x-outward*.35;
  const stone=[.54,.53,.50],cap=[.70,.67,.60],dark=[.16,.19,.22],water=[.14,.38,.60];
  const half=.24, spring=.18, rise=.24, thick=.105;
  const arch=(theta,rad)=>[Math.cos(theta)*rad,base+spring+Math.sin(theta)*rad];
  // Left and right sidewalls, separated by the water channel.
  for(const side of [-1,1]){
   const zz=z+side*(half+thick*.5);
   cuboid((outside+inside)*.5,zz,base-.045,Math.abs(outside-inside)+.05,thick,spring+.07,stone,cap);
   cuboid(outside+outward*.05,z+side*(half+thick*.5),base-.055,.14,thick+.035,spring+.10,cap);
  }
  // Roof is an actual curved barrel vault extending back into the hillside.
  // Inner and outer surfaces remain above the open arched water passage.
  for(let j=0;j<24;j++){
   const a=Math.PI*j/24,b=Math.PI*(j+1)/24;
   const i0=arch(a,rise),i1=arch(b,rise),o0=arch(a,rise+thick),o1=arch(b,rise+thick);
   const P=(xx,t)=>[xx,t[1],z+t[0]];
   quad(P(outside,i0),P(inside,i0),P(inside,i1),P(outside,i1),dark);
   quad(P(outside,o1),P(inside,o1),P(inside,o0),P(outside,o0),stone);
   // Each face consists of a single visible stone segment, not overlapping fills.
   quad(P(outside+outward*.012,i0),P(outside+outward*.012,i1),P(outside+outward*.012,o1),P(outside+outward*.012,o0),j%4===0?cap:stone);
  }
  // Low stone banks frame the uninterrupted water, in front of and through portal.
  for(const side of [-1,1]){
   const bankZ=z+side*(half+.046);
   cuboid(outside+outward*.21,bankZ,base-.018,.53,.075,.095,stone,cap);
  }
  // Stream flows on the X-axis, through an uncovered arch and out of the mouth.
  for(let j=0;j<11;j++){
   const xa=inside+(outside-inside)*j/11;
   const xb=inside+(outside-inside)*(j+1)/11;
   const za=riverZ(xa),zb=riverZ(xb);
   quad([xa,base-.035,za-.17],[xa,base-.035,za+.17],
        [xb,base-.035,zb+.17],[xb,base-.035,zb-.17],water);
  }
  // No raised exterior apron: the continuous dark river terrain is the visible surface.

 }
 for(const t of riverTunnels){
   riverArch(t.start,false);
   riverArch(t.end,true);
 }
 // Stone bridges crossing the blue waterways.
 for(const bx of [-2.2,.25]){let bz=riverZ(bx);let by=height(bx,bz)+.045;
   cuboid(bx,bz,by,.26,.69,.10,[.58,.56,.49],[.74,.70,.60]);
   for(let j=-1;j<=1;j++){let x=bx+j*.105;cuboid(x,bz-.33,height(x,bz-.33),.055,.07,.19,[.62,.61,.57]);cuboid(x,bz+.33,height(x,bz+.33),.055,.07,.19,[.62,.61,.57])}
 }
 // Hamlets, scattered standing stones and cultivated fields.
 for(let j=0;j<10;j++){let a=(j+.5)*2.39996,r=1.1+(j%5)*.46,x=Math.cos(a)*r,z=Math.sin(a)*r;
   if(Math.hypot(x,z)>4.2||height(x,z)>1||Math.abs(z-riverZ(x))<.38)continue;
   if(j%3===0){/* Former redundant hamlet: leave a natural clearing. */}
   else if(j%3===1){cuboid(x,z,height(x,z),.28,.24,.04,[.47,.47,.26],[.49,.48,.25]);cuboid(x+.32,z,height(x+.32,z),.28,.24,.04,[.45,.40,.20],[.45,.40,.20])}
   else{for(let k=0;k<3;k++)cone(x+k*.12,z+((k%2)-.5)*.20,height(x+k*.12,z+((k%2)-.5)*.20),.07,.24,[.10,.29,.14],6)}
 }
 // V126: readable hand-crafted terrain motifs, spaced between the six landmarks.
 // A low-detail landscape stays legible, but now has riverbanks, rocky shelves,
 // irregular groves, cultivated clearings and tiny traversable features.
 const rock=[.43,.44,.43],rockLight=[.59,.57,.52],moss=[.26,.37,.23];
 function terrainPoint(x,z){return Math.hypot(x,z)<4.43 && Math.abs(z-riverZ(x))>.34 && anchors.every(p=>Math.hypot(x-p.x,z-p.z)>.86)}
 // Low stone outcrops break up flat ground without becoming another mountain range.
 for(let i=0;i<18;i++){
   let a=i*2.3999632297+.3,r=2.05+(i%6)*.35,x=Math.cos(a)*r,z=Math.sin(a)*r;
   if(!terrainPoint(x,z)||height(x,z)>1.3)continue;
   let h=height(x,z),scale=.12+(i%4)*.036;
   cone(x,z,h,scale,.11+(i%3)*.046,i%3===0?rockLight:rock,5);
   if(i%3===0)cone(x+.13,z-.08,height(x+.13,z-.08),scale*.53,.085,moss,5);
 }
 // Forest clusters have a few varying-height pine trees plus understory, not dense scatter.
 for(const [gx,gz] of [[-3.55,-.72],[-2.92,1.75],[-1.70,2.70],[.85,3.30],[3.24,.10],[2.68,-1.18]]){
   for(let k=0;k<7;k++){
     let a=k*TAU/7,r=k%2?.31:.18,x=gx+Math.cos(a)*r,z=gz+Math.sin(a)*r;
     if(!terrainPoint(x,z)||height(x,z)>1.27)continue;
     let h=height(x,z),t=.29+(k%3)*.065;
     cone(x,z,h,.10+(k%2)*.028,t,k%3===0?[.16,.34,.19]:[.10,.27,.14],7);
     if(k%2===0)cone(x,z,h+t*.38,.075,t*.55,[.13,.32,.16],7);
   }
 }
 // Short pale stone terraces on the higher hillside suggest ancient traveled routes.
 for(const [tx,tz] of [[-2.92,-1.53],[-1.42,-1.85],[1.04,-1.89],[2.83,-.68]]){
   for(let j=0;j<3;j++){
     let x=tx+j*.18,z=tz+j*.08;
     if(!terrainPoint(x,z))continue;
     cuboid(x,z,height(x,z)+.018,.21,.09,.07,[.51,.49,.42]);
   }
 }
 // River stones and reeds make a clear shoreline transition against the terrain.
 for(let i=0;i<30;i++){
   let x=-4.03+i*.276,z=riverZ(x)+(i%2?1:-1)*(.28+(i%3)*.036);
   if(Math.hypot(x,z)>4.37||height(x,z)>1.15||inRiverTunnel(x))continue;
   if(i%3===0)cone(x,z,height(x,z)+.008,.075,.073,[.55,.53,.46],5);
   else {
     for(let j=0;j<2;j++){
       let rx=x+j*.045,rz=z+(j-.5)*.035;
       cone(rx,rz,height(rx,rz),.027,.15+(j*.04),[.34,.47,.22],5);
     }
   }
 }
 // Small wooden footbridges at three paths; plank breaks are visible up close.
 for(const [bx,bz] of [[-1.18,riverZ(-1.18)],[1.43,riverZ(1.43)]]){
   const deck=height(bx,bz)+.09;
   for(let j=-2;j<=2;j++){
     let x=bx+j*.12;cuboid(x,bz,deck,.105,.48,.035,[.51,.37,.23]);
   }
   for(const dz of [-.25,.25]){
     cuboid(bx-.28,bz+dz,deck,.055,.05,.25,[.43,.30,.18]);
     cuboid(bx+.28,bz+dz,deck,.055,.05,.25,[.43,.30,.18]);
   }
 }
 // Each destination gets a modest clearing bordered by terrain-native paving.
 for(let i=0;i<anchors.length;i++){
   const p=anchors[i],r=p.type==='circle'?.95:.78;
   for(let j=0;j<10;j++){
     let a=j*TAU/10,xx=p.x+Math.cos(a)*r,zz=p.z+Math.sin(a)*r;
     if(Math.hypot(xx,zz)>4.4||Math.abs(zz-riverZ(xx))<.22)continue;
     discAt(xx,zz,height(xx,zz)+.014,.055,j%2?[.39,.38,.31]:[.50,.46,.36],8);
   }
 }
 // Small meadow flecks add color to open ground, away from the important structures.
 for(let i=0;i<75;i++){
   let a=(i+4)*2.3999632297,r=1.15+(i%17)*.198;
   let x=Math.cos(a)*r,z=Math.sin(a)*r;
   if(!terrainPoint(x,z)||height(x,z)>1.05)continue;
   discAt(x,z,height(x,z)+.013,.018,i%5===0?[.73,.61,.36]:[.43,.53,.29],6);
 }
 // Quiet map coordinates: not software links, so they are deliberately less vivid.
 for(const [x,z] of [[-2.35,-1.4],[.28,-2.2],[0,riverZ(0)],[-.9,.85]]){let y=height(x,z)+.035;arc(x,z,y,.065,.105,[.46,.49,.39])}
 // V127: give the perimeter purpose — roads head toward border settlements,
 // little passes and outposts, so the kingdom feels larger than the tabletop.
 function route(points,width=.05,color=[.50,.40,.29]){for(let i=0;i<points.length-1;i++)path(points[i][0],points[i][1],points[i+1][0],points[i+1][1],18,width,color)}
 const borderSites=[
   {x:0,z:-4.08,kind:'gate'},
   {x:2.98,z:-3.04,kind:'hamlet'},
   {x:4.00,z:.18,kind:'watch'},
   {x:2.88,z:3.02,kind:'hamlet'},
   {x:-.82,z:4.02,kind:'ford'},
   {x:-3.46,z:2.40,kind:'watch'},
   {x:-4.02,z:-.62,kind:'gate'},
   {x:-2.78,z:-3.05,kind:'hamlet'}
 ];
 const roadPlans=[
   // Northern exits stay with northern settlements.
   [[anchors[0].x,anchors[0].z],[.48,3.28],[-.82,4.02]],
   [[anchors[1].x,anchors[1].z],[2.24,1.34],[3.08,.88],[4.00,.18]],
   [[anchors[5].x,anchors[5].z],[-3.02,2.18],[-3.46,2.40]],
   // Southern exits stay with southern settlements.
   [[anchors[2].x,anchors[2].z],[1.78,-1.84],[2.16,-2.42],[2.98,-3.04]],
   [[anchors[3].x,anchors[3].z],[-.22,-3.30],[0,-4.08]],
   [[anchors[3].x,anchors[3].z],[-1.16,-2.98],[-2.10,-3.06],[-2.78,-3.05]],
   [[anchors[4].x,anchors[4].z],[-2.46,-.58],[-3.18,-.36],[-4.02,-.62]],
   // One royal road carries border-to-border travel through the pass instead of over ridges.
   [[-2.78,-3.05],[-1.72,-2.98],[-.62,-2.88],kingsPassSouth,kingsPassMid,kingsPassNorth,[.88,-.84],[2.04,-.08],[3.08,.88],[4.00,.18]]
 ];
 for(const pts of roadPlans)route(pts,.048,[.52,.42,.30]);
 // Border sites: tiny destinations so the roads visibly lead somewhere.
 for(const site of borderSites){
   const y=height(site.x,site.z);
   if(site.kind==='gate'){
     cuboid(site.x,site.z,y,.42,.18,.34,[.55,.53,.48]);
     cuboid(site.x-.15,site.z,y,.10,.24,.48,[.53,.51,.45]);
     cuboid(site.x+.15,site.z,y,.10,.24,.48,[.53,.51,.45]);
     cuboid(site.x,site.z+.14,y+.16,.18,.02,.20,[.35,.24,.18]);
   }else if(site.kind==='watch'){
     tower(site.x,site.z,.62);
     cone(site.x+.28,site.z-.12,height(site.x+.28,site.z-.12),.11,.25,[.12,.29,.15],7);
   }else if(site.kind==='ford'){
     for(let k=-1;k<=1;k++)cuboid(site.x+k*.11,site.z,y+.03,.10,.40,.03,[.51,.38,.24]);
     for(const dz of [-.18,.18]){cuboid(site.x-.22,site.z+dz,y+.03,.05,.05,.17,[.42,.29,.18]);cuboid(site.x+.22,site.z+dz,y+.03,.05,.05,.17,[.42,.29,.18]);}
   }else{
     // Retain the settlement clearing without the miniature house cluster.
     discAt(site.x,site.z,y+.015,.20,[.47,.43,.31],8);
   }
 }
 // Edge terrain variety: shallow cliffs, scrub groves and small field walls.
 for(const [x,z,s] of [[-3.95,1.22,.18],[-3.62,-2.16,.21],[-1.02,-4.02,.22],[1.72,-3.86,.20],[3.86,-1.18,.17],[3.34,2.56,.19]]){
   if(Math.hypot(x,z)>4.42)continue;
   cone(x,z,height(x,z),s,.13,rock,5);
   cone(x+.12,z-.08,height(x+.12,z-.08),s*.7,.10,rockLight,5);
   cone(x-.08,z+.10,height(x-.08,z+.10),s*.45,.08,moss,5);
 }
 for(const [x,z] of [[-3.72,1.78],[-3.14,-1.58],[-.24,-3.94],[2.48,-3.36],[3.76,-.36],[3.08,2.56],[-1.76,3.62]]){
   for(let k=0;k<4;k++){
     const xx=x+(k%2)*.16,zz=z+Math.floor(k/2)*.16;
     if(Math.hypot(xx,zz)>4.45||height(xx,zz)>1.1)continue;
     cone(xx,zz,height(xx,zz),.08+(k%2)*.02,.24+(k%3)*.05,[.12,.30,.15],7);
   }
 }
 for(const [x,z] of [[-2.46,3.08],[-.36,3.44],[1.68,3.10],[3.16,1.96],[3.06,-2.12],[-2.18,-3.12]]){
   for(let j=0;j<3;j++)cuboid(x+j*.16,z+j*.05,height(x+j*.16,z+j*.05)+.012,.18,.055,.06,[.49,.45,.36]);
 }
 // V187: crafted vegetation and boulders. These are real 3D meshes, rotated
 // with the map. Keep all six project clearings and the river unobstructed.
 function pineDetail(x,z,scale){
   if(!terrainPoint(x,z)||height(x,z)>1.18)return;
   const y=height(x,z),trunk=[.32,.245,.17];
   cuboid(x,z,y,.035*scale,.035*scale,.20*scale,trunk);
   cone(x,z,y+.11*scale,.125*scale,.28*scale,[.10,.245,.18],8);
   cone(x,z,y+.23*scale,.103*scale,.24*scale,[.13,.32,.22],8);
   cone(x,z,y+.35*scale,.078*scale,.20*scale,[.16,.37,.24],8);
 }
 // Deterministically distributed accent groves, deliberately sparse near roads.
 for(let k=0;k<88;k++){
   const a=k*2.39996322972865+.55,r=1.44+(k%29)*.104;
   const x=Math.cos(a)*r,z=Math.sin(a)*r;
   if(Math.abs(z-riverZ(x))<.47||anchors.some(p=>Math.hypot(x-p.x,z-p.z)<1.04))continue;
   if(k%3!==0)pineDetail(x,z,.74+(k%5)*.095);
 }
 // Faceted weathered stone clusters with inset caps, for scale and contact.
 for(let k=0;k<24;k++){
   const a=k*2.3999632297+1.4,r=2.05+(k%9)*.23;
   const x=Math.cos(a)*r,z=Math.sin(a)*r;
   if(!terrainPoint(x,z)||height(x,z)>1.12)continue;
   const y=height(x,z),q=.085+(k%4)*.016;
   cone(x,z,y,q,.09+(k%3)*.03,[.43,.45,.43],6);
   cone(x+.055,z+.028,height(x+.055,z+.028),q*.55,.045,[.61,.60,.55],5);
 }
 // A finely machined ornamental double bezel and indexed compass ticks provide
 // a deliberate finished edge without covering the playable terrain.
 annulus(5.30,5.275,-.055,0,[.72,.58,.32]);
 annulus(5.115,5.10,-.062,0,[.75,.66,.45]);
 for(let i=0;i<72;i++){
   const t=i*TAU/72,major=i%6===0;
   const inner=major?4.96:5.015,outer=major?5.075:5.055;
   const polar=(r,y)=>[Math.cos(t)*r,y,Math.sin(t)*r];
   const tangent=[-Math.sin(t)*.009,0,Math.cos(t)*.009];
   const a=polar(inner,-.056),b=polar(outer,-.056);
   quad([a[0]-tangent[0],a[1],a[2]-tangent[2]],[b[0]-tangent[0],b[1],b[2]-tangent[2]],[b[0]+tangent[0],b[1],b[2]+tangent[2]],[a[0]+tangent[0],a[1],a[2]+tangent[2]],major?[.88,.73,.41]:[.54,.61,.64]);
 }
 function buffer(data,location){let b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,3,gl.FLOAT,false,0,0);return b}
 const terrainAttributes=[
  {buffer:buffer(positions,gl.getAttribLocation(prog,'aPos')),location:gl.getAttribLocation(prog,'aPos'),size:3},
  {buffer:buffer(normals,gl.getAttribLocation(prog,'aNormal')),location:gl.getAttribLocation(prog,'aNormal'),size:3},
  {buffer:buffer(colors,gl.getAttribLocation(prog,'aColor')),location:gl.getAttribLocation(prog,'aColor'),size:3}
 ];
 let tb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,tb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(terrainFlags),gl.STATIC_DRAW);
 const tl=gl.getAttribLocation(prog,'aTerrain');if(tl>=0){gl.enableVertexAttribArray(tl);gl.vertexAttribPointer(tl,1,gl.FLOAT,false,0,0);terrainAttributes.push({buffer:tb,location:tl,size:1});}
 let eb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,eb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(emissions),gl.STATIC_DRAW);const el=gl.getAttribLocation(prog,'aEmission');gl.enableVertexAttribArray(el);gl.vertexAttribPointer(el,1,gl.FLOAT,false,0,0);terrainAttributes.push({buffer:eb,location:el,size:1});
 function bindTerrain(){gl.useProgram(prog);for(const a of terrainAttributes){if(a.location<0)continue;gl.bindBuffer(gl.ARRAY_BUFFER,a.buffer);gl.enableVertexAttribArray(a.location);gl.vertexAttribPointer(a.location,a.size,gl.FLOAT,false,0,0)}}
 const matmul=(a,b)=>{let r=new Float32Array(16);for(let col=0;col<4;col++)for(let row=0;row<4;row++)for(let k=0;k<4;k++)r[col*4+row]+=a[k*4+row]*b[col*4+k];return r};
 const perspective=(fov,aspect,n,f)=>{let t=1/Math.tan(fov/2);return new Float32Array([t/aspect,0,0,0,0,t,0,0,0,0,(f+n)/(n-f),-1,0,0,2*f*n/(n-f),0])};
 const lookAt=(eye,target)=>{const norm=v=>{let l=Math.hypot(...v)||1;return v.map(x=>x/l)},sub=(a,b)=>a.map((v,i)=>v-b[i]),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];let z=norm(sub(eye,target)),x=norm(cross([0,1,0],z)),y=norm(cross(z,x));return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-x.reduce((s,v,i)=>s+v*eye[i],0),-y.reduce((s,v,i)=>s+v*eye[i],0),-z.reduce((s,v,i)=>s+v*eye[i],0),1])};
 let target=0,angle=0,frame=0,last=0,lastInteraction=performance.now();const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 // Dragging the WebGL table rotates the physical base and terrain together.
 // Project markers are separate buttons and retain their click interactions.
 let dragPointer=null,dragX=0,dragStart=0,dragMoved=false;
 canvas.style.touchAction='pan-y';
 canvas.style.cursor='grab';
 const startDrag=e=>{
   if(e.button!==undefined&&e.button!==0)return;
   dragPointer=e.pointerId;dragX=e.clientX;dragStart=e.clientX;dragMoved=false;
   target=angle;lastInteraction=performance.now();
   canvas.setPointerCapture(e.pointerId);
   canvas.style.cursor='grabbing';
 };
 const moveDrag=e=>{
   if(dragPointer!==e.pointerId)return;
   const dx=e.clientX-dragX;
   if(Math.abs(e.clientX-dragStart)>4)dragMoved=true;
   if(dragMoved){target-=dx*.0037;dragX=e.clientX;lastInteraction=performance.now();e.preventDefault();}
 };
 const endDrag=e=>{
   if(dragPointer!==e.pointerId)return;
   dragPointer=null;lastInteraction=performance.now();canvas.style.cursor='grab';
   if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);
 };
 canvas.addEventListener('pointerdown',startDrag);
 canvas.addEventListener('pointermove',moveDrag);
 canvas.addEventListener('pointerup',endDrag);
 canvas.addEventListener('pointercancel',endDrag);
 // Don't rotate while visitors read or activate a project. Keyboard and touch
 // input count as interaction too; reduced-motion disables auto-spin entirely.
 const interrupt=()=>{lastInteraction=performance.now();};
 root.addEventListener('pointerenter',interrupt);
 root.addEventListener('pointermove',interrupt);
 root.addEventListener('focusin',interrupt);
 root.addEventListener('touchstart',interrupt,{passive:true});
 function draw(now){if(!root.isConnected)return;const w=Math.max(1,root.clientWidth),h=Math.max(1,root.clientHeight),ratio=Math.min(devicePixelRatio||1,1.7);if(canvas.width!==Math.round(w*ratio)||canvas.height!==Math.round(h*ratio)){canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio)}gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  const dt=last?Math.min(64,now-last):16;
  const pausedForVisitor=root.matches(':hover')||root.contains(document.activeElement);
  const idle=!reduced&&dragPointer===null&&!pausedForVisitor&&now-lastInteraction>5500;
  if(idle){
    // Gentle continuous rotation: one revolution approximately every 95 sec.
    // Rebase the target on the current angle to avoid snapping after a drag.
    target=angle+dt*.000066;
    angle=target;
  }else{
    angle=reduced?target:angle+(target-angle)*Math.min(.15,Math.max(.025,dt/150));
  }
  last=now;
  const eye=w<650?[0,4.0,10.72]:[0,3.7,9.50];const view=lookAt(eye,[0,.85,0]);// Preserve V167's on-screen table scale even when the viewer gets taller.
  // A fixed vertical FOV causes the model to grow in pixels with canvas height.
  // Scale tan(FOV/2) with the canvas height relative to V167's viewer height.
  const viewportWidth=window.innerWidth;
  const previousViewerHeight=viewportWidth>900
    ?Math.max(750,Math.min(viewportWidth*.77,1120))
    :viewportWidth>680
      ?Math.max(660,Math.min(viewportWidth*.94,850))
      :680;
  const baseFov=w<650?1.04:.84;
  const adjustedFov=2*Math.atan(Math.tan(baseFov/2)*h/previousViewerHeight / .9); // 10% smaller on screen, unchanged camera eye and marker projection
  const projection=perspective(adjustedFov,w/h,.1,100);const vp=matmul(projection,view);bindTerrain();gl.uniformMatrix4fv(gl.getUniformLocation(prog,'uMatrix'),false,vp);gl.uniform1f(gl.getUniformLocation(prog,'uAngle'),angle);gl.uniform1f(gl.getUniformLocation(prog,'uPulse'),.5+.5*Math.sin(now*.0022));gl.uniform1f(gl.getUniformLocation(prog,'uTime'),now*.001);gl.drawArrays(gl.TRIANGLES,0,positions.length/3);
  // Show the actual 3D canvas as soon as the draw succeeds. Sampling a single pixel
  // incorrectly hid valid scenes when that pixel fell on a dark patch of terrain.
  if(!root.classList.contains('is-rendering')) {
   let visiblePixels=0;
   const pixels=new Uint8Array(4);
   for(let gy=1;gy<=5;gy++)for(let gx=1;gx<=7;gx++){
     gl.readPixels(Math.floor(canvas.width*gx/8),Math.floor(canvas.height*gy/6),1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
     // Clear color roughly RGB(6,15,27); only show WebGL after drawing actual terrain.
     if(pixels[3]>40)visiblePixels++;
   }
   if(visiblePixels>=3)root.classList.add('is-rendering');
  }
  labels.forEach((label,i)=>{const c=Math.cos(angle),sn=Math.sin(angle),site=anchors[i];let x=site.x*c-site.z*sn,z=site.x*sn+site.z*c,y=site.y+(site.labelY-site.y)*.52;const p=[x,y,z,1];let clip=Array.from({length:4},(_,row)=>vp[row]*p[0]+vp[4+row]*p[1]+vp[8+row]*p[2]+vp[12+row]);let visible=clip[3]>.1 && Math.abs(clip[0]/clip[3])<.94 && Math.abs(clip[1]/clip[3])<.96;
   // Occlude project markers behind terrain: test sight line in the unrotated map frame.
   // This keeps stations hidden behind peaks until the user turns the actual table.
   const invX=Math.cos(angle)*eye[0]+Math.sin(angle)*eye[2];
   const invZ=-Math.sin(angle)*eye[0]+Math.cos(angle)*eye[2];
   const markerX=anchors[i].x,markerZ=anchors[i].z;
   // Anchor each glow and card in the same model coordinate frame as the actual 3D building.
   if(visible){for(let t=.08;t<.94;t+=.038){
     const sx=invX+(markerX-invX)*t,sz=invZ+(markerZ-invZ)*t;
     const rayY=eye[1]+(y-eye[1])*t;
     if(Math.hypot(sx,sz)<4.60 && height(sx,sz)>rayY+.10){visible=false;break;}
   }}
   // Project names on the far hemisphere stay hidden until rotated to face the viewer.
   if(z < -2.25) visible=false;
   let px=(clip[0]/clip[3]*.5+.5)*w,py=(.5-clip[1]/clip[3]*.5)*h;label.style.left=px+'px';label.style.top=py+'px';label.style.visibility=visible?'visible':'hidden';label.style.zIndex=String(Math.round((z+6)*10));label.style.opacity=visible?"1":"0";label.style.setProperty("--landmark-depth",String(z));label.style.setProperty("--aura-scale",String(clamp(10/(11.7-z),.65,1.35)))});
  // Pin the action beside the currently selected site using the same actual
  // WebGL projection as its nameplate; it moves with the rotating terrain.
  const offer=root.querySelector('#citadelMapOffer');
  if(offer&&offer.classList.contains('is-visible')){
   const active=labels.find(el=>el.getAttribute('aria-pressed')==='true');
   if(active){
    const name=active.querySelector('.citadel-marker-name');
    if(name && active.style.visibility!=='hidden'){
     const sceneRect=root.getBoundingClientRect(), nameRect=name.getBoundingClientRect();
     const ow=offer.offsetWidth||150,oh=offer.offsetHeight||38;
     const left=nameRect.left-sceneRect.left+(nameRect.width-ow)/2;
     // Anchor the action immediately below the nameplate, not below the map.
     const top=nameRect.bottom-sceneRect.top+11;
     offer.style.left=clamp(left,8,Math.max(8,w-ow-8))+'px';
     offer.style.top=clamp(top,8,Math.max(8,h-oh-8))+'px';
     offer.style.visibility='visible';
    }else offer.style.visibility='hidden';
   }
  }
  frame=requestAnimationFrame(draw)}
 frame=requestAnimationFrame(draw);return {rotateTo:step=>{
  lastInteraction=performance.now();
  const index=((step%6)+6)%6;
  // The D&D circle and Shorts Clip Studio sit on the mountain-side of the table.
  // Match the view of the nearest accessible neighboring landmark so they face
  // the viewer from the valley, not the back of the mountain ridge.
  const facingIndex=index===2?1:index===4?5:index;
  target=angles[facingIndex]+Math.round((angle-angles[facingIndex])/TAU)*TAU;
 },destroy:()=>{cancelAnimationFrame(frame);canvas.removeEventListener('pointerdown',startDrag);canvas.removeEventListener('pointermove',moveDrag);canvas.removeEventListener('pointerup',endDrag);canvas.removeEventListener('pointercancel',endDrag);root.removeEventListener('pointerenter',interrupt);root.removeEventListener('pointermove',interrupt);root.removeEventListener('focusin',interrupt);root.removeEventListener('touchstart',interrupt)}};
}
window.CitadelTerrain={init};
})();
