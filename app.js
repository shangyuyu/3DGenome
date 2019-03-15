"use strict";

var vertexShaderText = [
    'precision mediump float;',
    '',
    'attribute vec3 vertPosition;',
    'attribute vec3 vertColor;',
    'uniform mat4 mWorld;',
    'uniform mat4 mView;',
    'uniform mat4 mProj;',
    'varying vec4 v_vertColor;',
    '',
    'void main(){',
    '   v_vertColor = vec4(vertColor, 1.0);',
    '   gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
    '}',
].join('\n');

var fragmentShaderText = [
    'precision mediump float;',
    '',
    'varying vec4 v_vertColor;',
    '',
    'void main(){',
    '   gl_FragColor = v_vertColor;',
    '}',
].join('\n');


var Init = function () {
    console.log("JavaScript Working.");

    var canvas = document.getElementById("canvas_gl");
    var gl = canvas.getContext("webgl");

    if (!gl) {
        console.log("WebGL not supported, trying experimental-webgl.");
        gl = canvas.getContext("experimental-webgl");
    }

    if (!gl) {
        alert("Your brower does not support WebGL.");
    }

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create both shaders
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    // Compile Shaders
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling vertexShader!", gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling fragmentShader!", gl.getShaderInfoLog(fragmentShader));
        return;
    }

    // Create gl program
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("ERROR linking program!", gl.getProgramInfoLog(program));
        return;
    }

    /////////////////////////////////////////////////////

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

    gl.useProgram(program);

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



    // Main loop
    var identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    var angle = 0;
    var loop = function () {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        glMatrix.mat4.rotate(worldMatrix, identityMatrix, angle, [0.0, 1, 0.0]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 12);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);  // call the function for new frame
};
