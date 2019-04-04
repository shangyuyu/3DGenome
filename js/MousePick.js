//
//  MousePick.js
//
/* jshint -W117 */

"use strict";

class MousePick {

    constructor () {
        
        this.rayCaster = new THREE.Raycaster();
        this.lastMousePickCallTime = Date.now();
        this.INTERSECTED = null;
        this.tempHex = null;
    }
}

Object.assign(MousePick.prototype, {

    call: function (objectArray, shadowArray) {

        this.lastMousePickCallTime = Date.now();

        this.rayCaster.setFromCamera( mouse.position, camera );
        this.rayCaster.linePrecision = gui.renderConfig.radius;

        let intersects = this.rayCaster.intersectObjects( objectArray, false );

        if (intersects.length > 0) {
            if (this.INTERSECTED != intersects[0].object) {
            // new intersected detected
                this.onLeft();

                if (shadowArray)
                    // The index in 'objectArray' and 'shadowArray' must match
                    this.INTERSECTED = shadowArray[ Number(intersects[0].object.name.slice(4)) ];
                else
                    this.INTERSECTED = intersects[0].object;

                this.onPick();
            }
        } else {
            this.onLeft();
        }

        if (advancedConfig.mousePickTimeDisp === true) {
            console.log( "Mouse pick time cost: " + String(Date.now() - this.lastMousePickCallTime) + "ms");
        } else if (Date.now() - this.lastMousePickCallTime > 100) {
            console.log( "Mouse pick cost too much time: " + String(Date.now() - this.lastMousePickCallTime) + "ms. Consider refresh page or suppress render quality.");
        }
    }, 

    onPick: function () {

        this.tempHex = this.INTERSECTED.material.emissive.getHex();
        this.INTERSECTED.material.emissive.setHex(0xff0000);
    }, 

    onLeft: function () {
    // undo onPick changes

        if (this.INTERSECTED) {
            this.INTERSECTED.material.emissive.setHex(this.tempHex);
            this.INTERSECTED = null;
        }
    }

} );

// End of MousePick.js
