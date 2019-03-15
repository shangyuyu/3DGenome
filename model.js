
"use strict";

//-------------------------------------------------------------------------

window.Triangle = function (vertices, colors) {
  var self = this;
  self.vertices = vertices;
  self.colors = colors;
}

//-------------------------------------------------------------------------

window.Model = function (name) {
  var self = this;
  self.name = name;
  self.triangles = [];
}

//-------------------------------------------------------------------------

var data = new Float32Array(72);

window.CreatePyramid = function () {
  var vertices, triangle1, triangle2, triangle3, triangle4, triangle;
  var red, green, blue, purple;
  var i, j, k, count;

  // Vertex data
  vertices = [  [ 0.0, -0.25, -0.50],
                [ 0.0,  0.25,  0.00],
                [ 0.5, -0.25,  0.25],
                [-0.5, -0.25,  0.25] ];

  // Colors in RGB
  red    = [1.0, 0.0, 0.0];
  green  = [0.0, 1.0, 0.0];
  blue   = [0.0, 0.0, 1.0];
  purple = [1.0, 0.0, 1.0];

  // Create 4 triangles
  triangle1 = new Triangle([vertices[2], vertices[1], vertices[3]],
                            [blue, blue, blue]);
  triangle2 = new Triangle([vertices[3], vertices[1], vertices[0]],
                            [purple, purple, purple]);
  triangle3 = new Triangle([vertices[0], vertices[1], vertices[2]],
                            [red, red, red]);
  triangle4 = new Triangle([vertices[0], vertices[2], vertices[3]],
                            [green, green, green]);

  // Create a model that is composed of 4 triangles
  var model = new Model("simple");
  model.triangles = [ triangle1, triangle2, triangle3, triangle4 ];

  count = 0;
  for (i=0; i<4; i++) {  // i-th face
    triangle = model.triangles[i];

    for (j=0; j<3; j++) {  // j-th vertice
        for (k=0; k<3; k++, count++) {  // k-th coordinate
            data[count] = triangle.vertices[j][k];
        }
        for (k=0; k<3; k++, count++) {  // k-th coordinate
            data[count] = triangle.colors[j][k];
        }
    }
  }
}

CreatePyramid();