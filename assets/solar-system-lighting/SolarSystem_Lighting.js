"use strict";

// ---------- Config ----------
var segStacks = 24;   // sphere stacks
var segSlices = 48;   // sphere slices
var T = 8.0;

var gl;
var progPhong, progGouraud, progUnlit;
var usePhong = true;

var uLoc = {}; // uniform/attrib caches per program
var attribs = {};

var buffers = {
  sphere: { pos:null, nor:null, count:0 },
  orbit : {}
};

var eye, at, up, proj;
var startTime = 0;

// Scene scale similar to original
var Y = 0.4;
var X = 5 * Y;
var size = { sun:5*Y, mercury:1*Y, venus:2*Y, earth:3*Y };

// Mercury’s orbit slightly farther out so it’s visible beside the sun
var dist = {
  mercury: 1*X + 0.25*Y,
  venus:   2*X,
  earth:   3.8*X   // Earth moved farther away
};

var spin = { M:4.0, V:2.5, E:2.0 };

// Materials (diffuse colors picked; ambient small; specular mostly white)
var materials = {
  sun:     { ambient:[0.0,0.0,0.0], diffuse:[1.0,0.6,0.25], specular:[0.0,0.0,0.0], shininess:1.0 },
  mercury: { ambient:[0.08,0.08,0.08], diffuse:[0.7,0.7,0.75], specular:[1.0,1.0,1.0], shininess:1000.0 },
  venus:   { ambient:[0.12,0.07,0.02], diffuse:[1.0,0.6,0.15], specular:[0.85,0.85,0.85], shininess:100.0 },
  earth:   { ambient:[0.02,0.06,0.11], diffuse:[0.2,0.5,0.9], specular:[0.6,0.6,0.6], shininess:30.0 }
};

// Light (sun) — orange
var light = {
  pos: [0.0, 0.0, 0.0],
  color: [1.0, 0.5, 0.2],
  atten: { a:0.03, b:0.06, c:0.01 } // softer falloff for this scene scale
};

// ---------- Init ----------
window.onload = function() {
  var c = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(c);
  if(!gl){ alert("WebGL not available"); return; }

  gl.viewport(0,0,c.width,c.height);
  gl.clearColor(0,0,0,1);
  gl.enable(gl.DEPTH_TEST);

  // Enable transparency for orbit lines
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Camera
  var asp = c.width/c.height;
  proj = perspective(45, asp, 0.1, 1000.0);
  eye = vec3(0,0,20);
  at  = vec3(0,0,0);
  up  = vec3(0,1,0);

  // Programs
  progPhong   = initShaders(gl, "phong-vert",   "phong-frag");
  progGouraud = initShaders(gl, "gouraud-vert", "gouraud-frag");
  progUnlit   = initShaders(gl, "unlit-vert",   "unlit-frag");

  cacheLocations();

  // Geometry
  makeSphere(segStacks, segSlices);
  buffers.orbit.mercury = makeOrbit(dist.mercury);
  buffers.orbit.venus   = makeOrbit(dist.venus);
  buffers.orbit.earth   = makeOrbit(dist.earth);

  // UI toggle
  document.getElementById("toggle").onclick = function(){
    usePhong = !usePhong;
    this.textContent = "Shading: " + (usePhong ? "Phong" : "Gouraud") + " (click to toggle)";
  };

  startTime = performance.now();
  requestAnimationFrame(render);
};

// ---------- Shader location caches ----------
function cacheLocations(){
  function grab(prog, name){ return gl.getAttribLocation(prog, name); }
  attribs.phong   = { vPosition: grab(progPhong,"vPosition"), vNormal: grab(progPhong,"vNormal") };
  attribs.gouraud = { vPosition: grab(progGouraud,"vPosition"), vNormal: grab(progGouraud,"vNormal") };
  attribs.unlit   = { vPosition: gl.getAttribLocation(progUnlit,"vPosition") };

  function u(prog, name){ return gl.getUniformLocation(prog, name); }

  uLoc.phong = {
    uModel: u(progPhong,"uModel"), uView: u(progPhong,"uView"), uProj: u(progPhong,"uProj"),
    uNormalMat: gl.getUniformLocation(progPhong,"uNormalMat"),
    uLightPos: u(progPhong,"uLightPos"), uViewPos: u(progPhong,"uViewPos"), uLightColor: u(progPhong,"uLightColor"),
    uMatAmbient: u(progPhong,"uMatAmbient"), uMatDiffuse: u(progPhong,"uMatDiffuse"),
    uMatSpecular: u(progPhong,"uMatSpecular"), uShininess: u(progPhong,"uShininess"),
    uA: u(progPhong,"uA"), uB: u(progPhong,"uB"), uC: u(progPhong,"uC"),
    uIsEarth: u(progPhong,"uIsEarth")
  };

  uLoc.gouraud = {
    uModel: u(progGouraud,"uModel"), uView: u(progGouraud,"uView"), uProj: u(progGouraud,"uProj"),
    uNormalMat: gl.getUniformLocation(progGouraud,"uNormalMat"),
    uLightPos: u(progGouraud,"uLightPos"), uViewPos: u(progGouraud,"uViewPos"), uLightColor: u(progGouraud,"uLightColor"),
    uMatAmbient: u(progGouraud,"uMatAmbient"), uMatDiffuse: u(progGouraud,"uMatDiffuse"),
    uMatSpecular: u(progGouraud,"uMatSpecular"), uShininess: u(progGouraud,"uShininess"),
    uA: u(progGouraud,"uA"), uB: u(progGouraud,"uB"), uC: u(progGouraud,"uC"),
    uIsEarth: u(progGouraud,"uIsEarth")
  };

  uLoc.unlit = {
    uModel: gl.getUniformLocation(progUnlit,"uModel"),
    uView:  gl.getUniformLocation(progUnlit,"uView"),
    uProj:  gl.getUniformLocation(progUnlit,"uProj"),
    uColor: gl.getUniformLocation(progUnlit,"uColor") 
  };
}

// ---------- Geometry ----------
function makeSphere(stacks, slices){
  var pos = [], nor = [];
  for(var i=0; i<stacks; i++){
    var v0 = i / stacks;
    var v1 = (i+1) / stacks;
    var phi0 = v0 * Math.PI;
    var phi1 = v1 * Math.PI;

    for(var j=0; j<=slices; j++){
      var u = j / slices;
      var theta = u * 2.0 * Math.PI;

      var x0 = Math.sin(phi0)*Math.cos(theta);
      var y0 = Math.cos(phi0);
      var z0 = Math.sin(phi0)*Math.sin(theta);

      var x1 = Math.sin(phi1)*Math.cos(theta);
      var y1 = Math.cos(phi1);
      var z1 = Math.sin(phi1)*Math.sin(theta);

      pos.push(vec3(x0,y0,z0)); nor.push(vec3(x0,y0,z0));
      pos.push(vec3(x1,y1,z1)); nor.push(vec3(x1,y1,z1));
    }
  }
  buffers.sphere.countPerStrip = (slices+1)*2;
  buffers.sphere.stripCount = stacks;
  buffers.sphere.count = buffers.sphere.countPerStrip * buffers.sphere.stripCount;

  buffers.sphere.pos = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.sphere.pos);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pos), gl.STATIC_DRAW);

  buffers.sphere.nor = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.sphere.nor);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(nor), gl.STATIC_DRAW);
}

function makeOrbit(r){
  var pts = [];
  for(var i=0;i<128;i++){
    var t = i/128 * 2*Math.PI;
    pts.push(vec3(r*Math.cos(t), r*Math.sin(t), 0));
  }
  var b = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pts), gl.STATIC_DRAW);
  return { pos:b, count:128 };
}

function transpose3(m){
  return mat3(
    vec3(m[0][0], m[1][0], m[2][0]),
    vec3(m[0][1], m[1][1], m[2][1]),
    vec3(m[0][2], m[1][2], m[2][2])
  );
}
function inverse3(m){
  var a = m[0][0], b=m[0][1], c=m[0][2];
  var d = m[1][0], e=m[1][1], f=m[1][2];
  var g = m[2][0], h=m[2][1], i=m[2][2];
  var A =   e*i - f*h;
  var B = -(d*i - f*g);
  var C =   d*h - e*g;
  var D = -(b*i - c*h);
  var E =   a*i - c*g;
  var F = -(a*h - b*g);
  var G =   b*f - c*e;
  var H = -(a*f - c*d);
  var I =   a*e - b*d;
  var det = a*A + b*B + c*C;
  if(Math.abs(det) < 1e-8) return mat3();
  var invdet = 1.0/det;
  return mat3(
    vec3(A*invdet, D*invdet, G*invdet),
    vec3(B*invdet, E*invdet, H*invdet),
    vec3(C*invdet, F*invdet, I*invdet)
  );
}

function drawOrbit(o){
  var view = lookAt(eye,at,up);
  gl.useProgram(progUnlit);
  var a = attribs.unlit;

  gl.bindBuffer(gl.ARRAY_BUFFER, o.pos);
  gl.vertexAttribPointer(a.vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a.vPosition);

  gl.uniformMatrix4fv(uLoc.unlit.uModel,false, flatten(mat4()));
  gl.uniformMatrix4fv(uLoc.unlit.uView, false, flatten(view));
  gl.uniformMatrix4fv(uLoc.unlit.uProj, false, flatten(proj));


  gl.uniform4fv(uLoc.unlit.uColor, new Float32Array([0.5, 0.6, 0.9, 0.20]));

  gl.drawArrays(gl.LINE_LOOP, 0, o.count);
}

function setCommonUniforms(p, model){
  var u = uLoc[p];
  var view = lookAt(eye,at,up);

  gl.uniformMatrix4fv(u.uModel, false, flatten(model));
  gl.uniformMatrix4fv(u.uView,  false, flatten(view));
  gl.uniformMatrix4fv(u.uProj,  false, flatten(proj));

  var N = mat3();
  var m = model;
  N[0][0]=m[0][0]; N[0][1]=m[0][1]; N[0][2]=m[0][2];
  N[1][0]=m[1][0]; N[1][1]=m[1][1]; N[1][2]=m[1][2];
  N[2][0]=m[2][0]; N[2][1]=m[2][1]; N[2][2]=m[2][2];
  N = inverse3(transpose3(N));
  gl.uniformMatrix3fv(u.uNormalMat, false, flatten(N));

  gl.uniform3fv(u.uLightPos,  new Float32Array(light.pos));
  gl.uniform3fv(u.uViewPos,   new Float32Array([eye[0],eye[1],eye[2]]));
  gl.uniform3fv(u.uLightColor,new Float32Array(light.color));
  gl.uniform1f(u.uA, light.atten.a);
  gl.uniform1f(u.uB, light.atten.b);
  gl.uniform1f(u.uC, light.atten.c);
}

function setMaterial(p, mat){
  var u = uLoc[p];
  gl.uniform3fv(u.uMatAmbient,  new Float32Array(mat.ambient));
  gl.uniform3fv(u.uMatDiffuse,  new Float32Array(mat.diffuse));
  gl.uniform3fv(u.uMatSpecular, new Float32Array(mat.specular));
  gl.uniform1f(u.uShininess, mat.shininess);
}

function bindSphereAttribs(pName){
  var a = attribs[pName];
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.sphere.pos);
  gl.vertexAttribPointer(a.vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a.vPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.sphere.nor);
  gl.vertexAttribPointer(a.vNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a.vNormal);
}

function drawSphereStrips(){
  for(var i=0;i<buffers.sphere.stripCount;i++){
    var first = i * buffers.sphere.countPerStrip;
    gl.drawArrays(gl.TRIANGLE_STRIP, first, buffers.sphere.countPerStrip);
  }
}

// ---------- Render ----------
function render(now){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  var t = (now - startTime) / 1000.0;

  var view = lookAt(eye,at,up);

  // --- Draw orbits FIRST so they appear behind planets ---
  drawOrbit(buffers.orbit.mercury);
  drawOrbit(buffers.orbit.venus);
  drawOrbit(buffers.orbit.earth);

  // --- Sun (unlit) ---
  gl.useProgram(progUnlit);
  var sunM = mult(rotate(0.5*t*57.3,0,0,1), scalem(size.sun,size.sun,size.sun));
  gl.uniformMatrix4fv(uLoc.unlit.uModel,false, flatten(sunM));
  gl.uniformMatrix4fv(uLoc.unlit.uView, false, flatten(view));
  gl.uniformMatrix4fv(uLoc.unlit.uProj, false, flatten(proj));
  gl.uniform4fv(uLoc.unlit.uColor, new Float32Array([1.0,0.55,0.25,1.0]));
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.sphere.pos);
  gl.vertexAttribPointer(attribs.unlit.vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribs.unlit.vPosition);
  drawSphereStrips();

  // --- Planets (lighting) ---
  var prog = usePhong ? progPhong : progGouraud;
  gl.useProgram(prog);
  bindSphereAttribs(usePhong ? "phong" : "gouraud");

  function mvMat(ang, d, spinRate, sz){
    var R = rotate(ang,0,0,1);
    var Tr= translate(d,0,0);
    var Rs= rotate(spinRate*t*57.3,0,0,1);
    var S = scalem(sz,sz,sz);
    return mult(R, mult(Tr, mult(Rs, S)));
  }

  var aM=(t/T)*360;
  var aV=(t/(1.5*T))*360;
  var aE=(t/(2*T))*360;

  // Mercury (uIsEarth = false)
  var mM = mvMat(aM, dist.mercury, spin.M, size.mercury);
  setCommonUniforms(usePhong ? "phong" : "gouraud", mM);
  setMaterial(usePhong ? "phong" : "gouraud", materials.mercury);
  gl.uniform1i(uLoc[usePhong ? "phong" : "gouraud"].uIsEarth, 0);
  drawSphereStrips();

  // Venus (uIsEarth = false)
  var mV = mvMat(aV, dist.venus, spin.V, size.venus);
  setCommonUniforms(usePhong ? "phong" : "gouraud", mV);
  setMaterial(usePhong ? "phong" : "gouraud", materials.venus);
  gl.uniform1i(uLoc[usePhong ? "phong" : "gouraud"].uIsEarth, 0);
  drawSphereStrips();

  // Earth (uIsEarth = true)
  var mE = mvMat(aE, dist.earth, spin.E, size.earth);
  setCommonUniforms(usePhong ? "phong" : "gouraud", mE);
  setMaterial(usePhong ? "phong" : "gouraud", materials.earth);
  gl.uniform1i(uLoc[usePhong ? "phong" : "gouraud"].uIsEarth, 1);
  drawSphereStrips();

  requestAnimationFrame(render);
}
