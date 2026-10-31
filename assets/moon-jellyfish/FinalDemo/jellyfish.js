"use strict";

var gl;
var program;

var canvas;

var bellPositions = [];
var bellNormals   = [];
var bellIndices   = [];

var frillPositions = [];
var frillNormals   = [];
var frillIndices   = [];

var bellPosBuffer, bellNormBuffer, bellIndexBuffer;
var frillPosBuffer, frillNormBuffer, frillIndexBuffer;

var aPositionLoc, aNormalLoc;
var uModelViewLoc, uProjectionLoc, uTimeLoc;
var uLightDirLoc, uBaseColorLoc, uGlowColorLoc, uInnerColorLoc;
var uLightIntensityLoc;   // NEW

var startTime = Date.now();


// Camera orbit parameters

var camRadius    = 4.0;   // distance from jellyfish
var camTheta     = 0.0;   // horizontal angle around Y axis
var camPhi       = 0.3;   // vertical angle (up/down)
var camRadiusMin = 2.0;
var camRadiusMax = 10.0;


// Global background color 

var globalBG = [0.01, 0.01, 0.12];  


// Color schemes (4 buttons)

var colorSchemes = [
    // 0: deep blue glow
    {
        base:  [0.15, 0.35, 1.0],
        glow:  [0.45, 0.85, 1.0],
        inner: [0.9,  0.95, 1.0],
        bg:    [0.0,  0.0,  0.03]
    },
    // 1: pale white
    {
        base:  [0.9,  0.95, 1.0],
        glow:  [0.85, 0.9,  1.0],
        inner: [1.0,  1.0,  1.0],
        bg:    [0.0,  0.0,  0.02]
    },
    // 2: warm pink in blue water
    {
        base:  [1.0,  0.6,  0.85],
        glow:  [1.0,  0.8,  0.95],
        inner: [1.0,  0.9,  0.9],
        bg:    [0.02, 0.02, 0.2]
    },
    // 3: neon green
    {
        base:  [0.1,  0.9,  0.35],
        glow:  [0.3,  1.0,  0.6],
        inner: [0.8,  1.0,  0.9],
        bg:    [0.0,  0.03, 0.0]
    }
];

var currentScheme = 0;

// Light intensity [0,1]
var lightIntensity = 1.0;


// Init

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL not available");
        return;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Set global background color (same for all schemes)
    gl.clearColor(globalBG[0], globalBG[1], globalBG[2], 1.0);

    // Build geometry: bell + frill ribbons
    buildBell(1.45, 40, 40);
    buildFrills(80, 70);  // (numRibbons, segments)
    uploadBuffers();

    // Attribute locations
    aPositionLoc  = gl.getAttribLocation(program, "aPosition");
    aNormalLoc    = gl.getAttribLocation(program, "aNormal");

    // Uniform locations
    uModelViewLoc   = gl.getUniformLocation(program, "uModelView");
    uProjectionLoc  = gl.getUniformLocation(program, "uProjection");
    uTimeLoc        = gl.getUniformLocation(program, "uTime");
    uLightDirLoc    = gl.getUniformLocation(program, "uLightDir");
    uBaseColorLoc   = gl.getUniformLocation(program, "uBaseColor");
    uGlowColorLoc   = gl.getUniformLocation(program, "uGlowColor");
    uInnerColorLoc  = gl.getUniformLocation(program, "uInnerColor");
    uLightIntensityLoc = gl.getUniformLocation(program, "uLightIntensity"); // NEW

    // Light coming a bit from above/right
    gl.uniform3fv(uLightDirLoc, new Float32Array([0.3, 0.8, 0.6]));

    // Start with scheme 0
    setColorScheme(0);

    // Initialize light intensity
    gl.uniform1f(uLightIntensityLoc, lightIntensity);  // NEW

    // Keyboard controls for orbit camera
    window.addEventListener("keydown", handleKeyDown);

    requestAnimFrame(render);
};


// Make canvas match window
function resizeCanvas() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
}


// Keyboard handler for 3D orbit camera

function handleKeyDown(e) {
    var key = e.key;

    var angleStep = 0.08;   // radians per press
    var phiStep   = 0.06;
    var zoomStep  = 0.3;

    switch (key) {
        case "ArrowLeft":
            camTheta -= angleStep;   // orbit left
            break;
        case "ArrowRight":
            camTheta += angleStep;   // orbit right
            break;
        case "ArrowUp":
            camPhi += phiStep;       // look up
            break;
        case "ArrowDown":
            camPhi -= phiStep;       // look down
            break;

        case "w":
        case "W":
            camRadius -= zoomStep;   // zoom in
            break;
        case "s":
        case "S":
            camRadius += zoomStep;   // zoom out
            break;

        case "r":
        case "R":
            // reset camera
            camRadius = 4.0;
            camTheta  = 0.0;
            camPhi    = 0.3;
            break;
    }

    // Clamp distance
    if (camRadius < camRadiusMin) camRadius = camRadiusMin;
    if (camRadius > camRadiusMax) camRadius = camRadiusMax;

    // Clamp vertical angle to avoid flipping
    var maxPhi = Math.PI / 2.0 - 0.1;
    var minPhi = -maxPhi;
    if (camPhi > maxPhi) camPhi = maxPhi;
    if (camPhi < minPhi) camPhi = minPhi;
}


// Geometry: Bell (hemisphere)

function buildBell(radius, latBands, longBands) {
    bellPositions = [];
    bellNormals   = [];
    bellIndices   = [];

    for (var lat = 0; lat <= latBands; ++lat) {
        // Hemisphere: 0 .. pi/2
        var theta = (lat / latBands) * (Math.PI * 0.5);
        var sinT = Math.sin(theta);
        var cosT = Math.cos(theta);

        for (var lon = 0; lon <= longBands; ++lon) {
            var phi = lon * 2.0 * Math.PI / longBands;
            var sinP = Math.sin(phi);
            var cosP = Math.cos(phi);

            var x = cosP * sinT;
            var y = cosT;
            var z = sinP * sinT;

            // Slightly flattened dome
            y *= 0.75;

            bellPositions.push(radius * x, radius * y, radius * z);

            // Normal (use original direction)
            bellNormals.push(x, y, z);
        }
    }

    for (var lat2 = 0; lat2 < latBands; ++lat2) {
        for (var lon2 = 0; lon2 < longBands; ++lon2) {
            var first  = lat2 * (longBands + 1) + lon2;
            var second = first + longBands + 1;

            bellIndices.push(first, second, first + 1);
            bellIndices.push(second, second + 1, first + 1);
        }
    }
}


// Ribbon-like frills

function buildFrills(numRibbons, segments) {
    frillPositions = [];
    frillNormals   = [];
    frillIndices   = [];

    // Rim where bell ends in object space
    var rimRadius = 1.0;
    var rimY      = 0.75;   // bottom of hemisphere
    var baseLength = 1.1;  // typical frill length

    // Rim ribbons (around bell)

    for (var i = 0; i < numRibbons; ++i) {
        var angle = (i / numRibbons) * 2.0 * Math.PI;
        var cosA = Math.cos(angle);
        var sinA = Math.sin(angle);

        // Small random variation per ribbon
        var lengthScale = 1.2 + Math.random() * 1.7;
        var length = baseLength * lengthScale;

        var widthBase = 0.025 + Math.random() * 0.035;
        var phase = Math.random() * Math.PI * 2.0;

        // Index where this ribbon starts in frillPositions
        var baseIndex = frillPositions.length / 3;

        for (var j = 0; j <= segments; ++j) {
            var t = j / segments;   // 0 at rim, 1 at tip

            // Drop down from rim
            var y = rimY - length * t;

            // Curve inward under the bell slightly
            var inward = 0.25 * t;
            var r = rimRadius - inward;

            var cx = r * cosA;
            var cz = r * sinA;

            // Subtle twisting / ruffle along the ribbon
            var wave = 0.75 * Math.sin(t * 100.0 + phase);
            cx += (-sinA) * wave * 0.04;
            cz += ( cosA) * wave * 0.04;

            // Ribbon width, tapering to the tip
            var w = widthBase * (1.0 - 0.999999 * t);

            // Tangent direction around the circle
            var tx = -sinA;
            var tz =  cosA;

            // Two vertices across the width (left/right)
            var lx = cx + tx * w;
            var lz = cz + tz * w;
            var rx = cx - tx * w;
            var rz = cz - tz * w;

            frillPositions.push(lx, y, lz);
            frillPositions.push(rx, y, rz);

            // Approximate normal: outward + slightly downward
            var nx = cosA;
            var ny = -0.5;
            var nz = sinA;
            var len = Math.sqrt(nx * nx + ny * ny + nz * nz);
            nx /= len; ny /= len; nz /= len;

            frillNormals.push(nx, ny, nz);
            frillNormals.push(nx, ny, nz);

            // Build triangles for this ribbon strip
            if (j < segments) {
                var row      = j * 2;
                var nextRow  = (j + 1) * 2;
                var i0 = baseIndex + row;
                var i1 = baseIndex + row + 1;
                var i2 = baseIndex + nextRow;
                var i3 = baseIndex + nextRow + 1;

                frillIndices.push(i0, i2, i1);
                frillIndices.push(i1, i2, i3);
            }
        }
    }

    // Central long frill ribbon

    var centerSegments = segments + 4;
    var centerLength   = baseLength * 4.0;   // longer
    var centerWidth    = 0.19;               // thinner than a big slab
    var centerBaseIndex = frillPositions.length / 3;

    for (var k = 0; k <= centerSegments; ++k) {
        var t2 = k / centerSegments;

        // Start just under bell center, then drop down
        var y2 = rimY - centerLength * t2;

        // Gentle S-curve sway in XZ so it looks organic
        var sway = 0.18 * Math.sin(t2 * 12.0);
        var cx2  = sway * 0.38;
        var cz2  = sway * 0.32;

        // Taper width slightly
        var w2 = centerWidth * (1.0 - 0.999 * t2);

        // Use X axis for width direction
        var lx2 = cx2 - w2;
        var rx2 = cx2 + w2;
        var lz2 = cz2;
        var rz2 = cz2;

        frillPositions.push(lx2, y2, lz2);
        frillPositions.push(rx2, y2, rz2);

        // Normal mostly downward, so it catches glow from below
        var nx2 = 0.0;
        var ny2 = -1.0;
        var nz2 = 0.0;

        frillNormals.push(nx2, ny2, nz2);
        frillNormals.push(nx2, ny2, nz2);

        if (k < centerSegments) {
            var row2     = k * 2;
            var nextRow2 = (k + 1) * 2;
            var j0 = centerBaseIndex + row2;
            var j1 = centerBaseIndex + row2 + 1;
            var j2 = centerBaseIndex + nextRow2;
            var j3 = centerBaseIndex + nextRow2 + 1;

            frillIndices.push(j0, j2, j1);
            frillIndices.push(j1, j2, j3);
        }
    }
}


// Buffer upload

function uploadBuffers() {
    // Bell
    bellPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bellPosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(bellPositions), gl.STATIC_DRAW);

    bellNormBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bellNormBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(bellNormals), gl.STATIC_DRAW);

    bellIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bellIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                  new Uint16Array(bellIndices), gl.STATIC_DRAW);

    // Frills
    frillPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, frillPosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(frillPositions), gl.STATIC_DRAW);

    frillNormBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, frillNormBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(frillNormals), gl.STATIC_DRAW);

    frillIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, frillIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                  new Uint16Array(frillIndices), gl.STATIC_DRAW);
}


// Color scheme switching

function setColorScheme(index) {
    if (!gl) return;
    currentScheme = Math.max(0, Math.min(3, index));

    var s = colorSchemes[currentScheme];

    // Background stays global; only jellyfish colors change
    gl.useProgram(program);
    gl.uniform3fv(uBaseColorLoc,  new Float32Array(s.base));
    gl.uniform3fv(uGlowColorLoc,  new Float32Array(s.glow));
    gl.uniform3fv(uInnerColorLoc, new Float32Array(s.inner));
}
// expose to HTML
window.setColorScheme = setColorScheme;


// Light intensity control

function setLightIntensity(value) {
    lightIntensity = parseFloat(value);
    if (!gl) return;
    gl.useProgram(program);
    gl.uniform1f(uLightIntensityLoc, lightIntensity);
}
// expose to HTML
window.setLightIntensity = setLightIntensity;


// Render loop

function render() {
    requestAnimFrame(render);

    var time = (Date.now() - startTime) * 0.001;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Orbit camera around the origin (where the jellyfish is)
    var x = camRadius * Math.cos(camPhi) * Math.sin(camTheta);
    var y = camRadius * Math.sin(camPhi);
    var z = camRadius * Math.cos(camPhi) * Math.cos(camTheta);

    var eye = vec3(x, y, z);
    var at  = vec3(0.0, 0.0, 0.0);
    var up  = vec3(0.0, 1.0, 0.0);

    var mv = lookAt(eye, at, up);

    // Rotate the jellyfish slowly
    var rot = rotateY(time * 10.0);
    mv = mult(mv, rot);

    var aspect = canvas.width / canvas.height;
    var proj = perspective(45.0, aspect, 0.1, 100.0);

    gl.uniformMatrix4fv(uModelViewLoc, false, flatten(mv));
    gl.uniformMatrix4fv(uProjectionLoc, false, flatten(proj));
    gl.uniform1f(uTimeLoc, time);

    // Enable attributes
    gl.enableVertexAttribArray(aPositionLoc);
    gl.enableVertexAttribArray(aNormalLoc);

    // ----- Draw bell -----
    gl.bindBuffer(gl.ARRAY_BUFFER, bellPosBuffer);
    gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, bellNormBuffer);
    gl.vertexAttribPointer(aNormalLoc, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bellIndexBuffer);
    gl.drawElements(gl.TRIANGLES, bellIndices.length, gl.UNSIGNED_SHORT, 0);

    // ----- Draw frill ribbons -----
    gl.bindBuffer(gl.ARRAY_BUFFER, frillPosBuffer);
    gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, frillNormBuffer);
    gl.vertexAttribPointer(aNormalLoc, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, frillIndexBuffer);
    gl.drawElements(gl.TRIANGLES, frillIndices.length, gl.UNSIGNED_SHORT, 0);
}
