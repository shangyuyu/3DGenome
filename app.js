
var vertexShaderText = [
    'precision mediump float;',
    '',
    'attribute vec2 vertPosition;',
    '',
    'void main(){',
    '   gl_Position = vec4(vertPosition, 0.0, 1.0);',
    '}',
].join('\n');

var fragmentShaderText = [
    'precision mediump float;',
    '',
    'void main(){',
    '   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
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
    } else {
        console.log("vertexShader compile complete.");
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling fragmentShader!", gl.getShaderInfoLog(fragmentShader));
        return;
    } else {
        console.log("fragmentShader compile complete.");
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
    var triangleVertices = [
        // X, Y
        0.0, 0.5, 
        -0.5, -0.5, 
        0.5, -0.5
    ];

    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
    gl.vertexAttribPointer(
        positionAttribLocation, 
        2, // number of elements per attribute
        gl.FLOAT, 
        gl.FALSE, 
        2 * Float32Array.BYTES_PER_ELEMENT, 
        0
    );

    gl.enableVertexAttribArray(positionAttribLocation);

    // Main loop
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};
