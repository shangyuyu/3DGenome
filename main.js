//
// main.js
//

"use strict";

let canvas;
let gl;

let numSubDivide = 4;

let materialShininess = 20.0;
let lightPosition = glMatrix.vec4.fromValues(1.0, 1.0, 1.0, 1.0);
let lightColor = glMatrix.vec3.fromValues(1.0, 1.0, 1.0);
let ambientColor = glMatrix.vec3.fromValues(0.2, 0.2, 0.2);

let materialColor = glMatrix.vec3.fromValues(1.0, 0.8, 0.0);

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
    gl.enable(gl.DEPTH_TEST);  // enable z-buffer

    // Create both shaders
    // Compile Shaders
    // Create gl program
    let program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    /////////////////////////////////////////////////////
    // Generate model

    Tetrahedron([0, 0, -1, 1], [0, 0.942809, 0.333333, 1], 
                [-0.816497, -0.471405, 0.333333, 1], [0.816497, -0.471405, 0.333333, 1], 
                numSubDivide);

    /////////////////////////////////////////////////////
    // Create and bind buffer

    let posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointsArray), gl.STATIC_DRAW);

    let a_position_loc = gl.getAttribLocation(program, "a_position");
    gl.vertexAttribPointer(
        a_position_loc, 
        3, 
        gl.FLOAT, 
        gl.FALSE, 
        3 * Float32Array.BYTES_PER_ELEMENT, 
        0);
    gl.enableVertexAttribArray(a_position_loc);

    let norBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, norBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalsArray), gl.STATIC_DRAW);

    let a_normal_loc = gl.getAttribLocation(program, "a_normal");
    gl.vertexAttribPointer(
        a_normal_loc, 
        3, 
        gl.FLOAT, 
        gl.FALSE, 
        3 * Float32Array.BYTES_PER_ELEMENT, 
        0);
    gl.enableVertexAttribArray(a_normal_loc);

    /////////////////////////////////////////////////////
    // Set uniform values

    let u_lightPosition_loc = gl.getUniformLocation(program, "u_lightPosition");
    let u_lightColor_loc = gl.getUniformLocation(program, "u_lightColor");
    let u_shininess_loc = gl.getUniformLocation(program, "u_shininess");
    let u_ambientColor_loc = gl.getUniformLocation(program, "u_ambientColor");
    
    let u_color_loc = gl.getUniformLocation(program, "u_color");

    let u_VM_loc = gl.getUniformLocation(program, "u_VM");  // temporary fix
    let u_PVM_loc = gl.getUniformLocation(program, "u_PVM");
    // PVM transformation matrices
    let modelMatrix = new Float32Array(16);
    let viewMatrix = new Float32Array(16);
    let projMatrix = new Float32Array(16);
    let VMMatrix = new Float32Array(16);
    let PVMMatrix = new Float32Array(16);
    glMatrix.mat4.identity(modelMatrix);
    glMatrix.mat4.lookAt(viewMatrix, [2, 0, 5], [0, 0, 0], [0, 1, 0]);
    //glMatrix.mat4.identity(viewMatrix);
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
    //glMatrix.mat4.identity(projMatrix);
    glMatrix.mat4.mul(VMMatrix, viewMatrix, modelMatrix);
    glMatrix.mat4.mul(PVMMatrix, projMatrix, VMMatrix);
    glMatrix.mat4.mul(lightPosition, VMMatrix, lightPosition);  // [ IN CAMERA SPACE ]

    gl.uniform4fv(u_lightPosition_loc, lightPosition);
    gl.uniform3fv(u_lightColor_loc, lightColor);
    gl.uniform3fv(u_ambientColor_loc, ambientColor);
    gl.uniform3fv(u_color_loc, materialColor);
    gl.uniform1f(u_shininess_loc, materialShininess);

    /////////////////////////////////////////////////////
    // Render

    Render();

    function Render () {
    
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  // color buffer & z-buffer
    
        /////////////////////////////////////////////////////
        // Set uniform values
        gl.uniformMatrix4fv(u_VM_loc, gl.FALSE, VMMatrix);
        gl.uniformMatrix4fv(u_PVM_loc, gl.FALSE, PVMMatrix);
    
        // Start rendering
        for (let i=0; i<index; i+=3)
            gl.drawArrays(gl.TRIANGLES, i, 3);
    
        window.requestAnimationFrame(Render);  // call for new frame
    
    }
};




// End of main.js
