//
// model.js
//

"use strict";

let index = 0;  // The number of vertex

let pointsArray = [];
let normalsArray = [];

//-------------------------------------------------------------------------

function Triangle(a, b, c) {
// Push the vertex coordinates and normal vertors to corresponding arrays
    pointsArray.push(a[0], a[1], a[2]);
    pointsArray.push(b[0], b[1], b[2]);
    pointsArray.push(c[0], c[1], c[2]);

    normalsArray.push(a[0], a[1], a[2]);
    normalsArray.push(b[0], b[1], b[2]);
    normalsArray.push(c[0], c[1], c[2]);

    index += 3;
}


function DivideTriangle(a, b, c, count) {
// fractal
    if (count > 0) {
        let ab = mix(a, b, 0.5);
        let ac = mix(a, c, 0.5);
        let bc = mix(b, c, 0.5);

        glMatrix.vec3.normalize(ab, ab);
        glMatrix.vec3.normalize(ac, ac);
        glMatrix.vec3.normalize(bc, bc);

        DivideTriangle(a, ab, ac, count-1);
        DivideTriangle(b, bc, ab, count-1);
        DivideTriangle(c, ac, bc, count-1);
        DivideTriangle(ab, ac, bc, count-1);
    } else {
        Triangle(a, b, c);
    }
}


function Tetrahedron(a, b, c, d, n) {
// form a sphere
// a, b, c, d is four 3-dimensional vector representing vertex
// n is the time of subdivisions
    DivideTriangle(a, b, c, n);
    DivideTriangle(a, b, d, n);
    DivideTriangle(a, c, d, n);
    DivideTriangle(b, c, d, n);
}

// End of model.js
