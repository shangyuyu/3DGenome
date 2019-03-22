//
// camera.js
//

"use strict";

class Camera {

    constructor(position, target, up) {
        this.position = position;
        this.target = target;
        this.up = up;
        this.fov = 60;  // glMatrix.glMatrix.toRadian(60);
        this.near = 0.1;
        this.far = 1000.0;
    }

    
}

// End of camera.js
