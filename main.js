//
// main.js
//

"use strict";

let canvas;
let gl;

let numSubDivide = 3;

// The init function
window.onload = function init() {

    console.log("JavaScript init Working.");

    /////////////////////////////////////////////////////
    // Initialize canvas and GL

    canvas = document.getElementById("canvas_gl");
    
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("Your brower does not support WebGL."); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  // color buffer & z-buffer
    gl.enable(gl.DEPTH_TEST);  // enable z-buffer

    // Create both shaders
    // Compile Shaders
    // Create gl program
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    /////////////////////////////////////////////////////
    // Generate model

    Tetrahedron([0, 0, -1, 1], [0, 0.942809, 0.333333, 1], 
                [-0.816497, -0.471405, 0.333333, 1], [0.816497, -0.471405, 0.333333, 1], 
                numSubDivide);


    // Create buffer

    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
    var colorAttribLocation = gl.getAttribLocation(program, "vertColor");

    gl.vertexAttribPointer(
        positionAttribLocation, 
        3, // number of elements per attribute
        gl.FLOAT, 
        gl.FALSE, 
        6 * Float32Array.BYTES_PER_ELEMENT, 
        0
    );
    gl.vertexAttribPointer(
        colorAttribLocation, 
        3, // number of elements per attribute
        gl.FLOAT, 
        gl.FALSE, 
        6 * Float32Array.BYTES_PER_ELEMENT, 
        3 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    //

    var matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
    var matViewUniformLocation = gl.getUniformLocation(program, "mView");
    var matProjUniformLocation = gl.getUniformLocation(program, "mProj");

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    glMatrix.mat4.identity(worldMatrix);
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, -5], [0, 0, 0], [0, 1, 0]);
    //glMatrix.mat4.identity(viewMatrix);
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
    //glMatrix.mat4.identity(projMatrix);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);


    //
    // Main loop
    //
    var identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    var angle = 0;

    var loop = function () {
        angle = performance.now() / 1000 / 12 * 2 * Math.PI;
        glMatrix.mat4.rotate(worldMatrix, identityMatrix, angle, [0.0, 1, 0.1]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 12);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);  // call the function for new frame
};
