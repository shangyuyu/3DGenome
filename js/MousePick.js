//
//  MousePick.js
//
/* jshint -W117 */

"use strict";

class MousePick {

    constructor () {
        
        this.enable = true;
        this.rayCaster = new THREE.Raycaster();
        this.lastMousePickCallTime = Date.now();
        this.INTERSECTED = null;
        this.pickedArray = [];
    }
}

Object.assign(MousePick.prototype, {

    call: function (objectArray, shadowArray) {

        if (this.enable === false) return;
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

        this.INTERSECTED.recoverHex = this.INTERSECTED.material.emissive.getHex();
        this.INTERSECTED.material.emissive.setHex(0xff0000);
    }, 

    onLeft: function () {
    // undo onPick changes

        if (this.INTERSECTED) {

            this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.recoverHex);
            this.INTERSECTED = null;
        }
    },

    onFocus: function () {

        let index = Number( this.INTERSECTED.name.slice(4) );
        
        if (!this.pickedArray.find( e => e.name.slice(4) == index )) {

            // WARNING: The sequence here is non-interchangeable and bug-prone
            this.pickedArray.push( this.INTERSECTED );  // push by reference (not copy)?
            this.INTERSECTED.protected = true;
            this.INTERSECTED.protectedRecoverHex = this.INTERSECTED.recoverHex;
            this.INTERSECTED.material.emissive.setHex(0x00ff00);
            this.INTERSECTED.recoverHex = this.INTERSECTED.material.emissive.getHex();
        }
    }, 

    reset: function (shadowArray) {

        console.log("MousePick.js::Reset " + this.pickedArray.length + " protected selections.");
        for (let i=0; i<this.pickedArray.length; i+=1) {

            let INTERSECTED = this.pickedArray[i];
            INTERSECTED.protected = false;
            INTERSECTED.material.emissive.setHex(INTERSECTED.protectedRecoverHex);
        }
        this.pickedArray = [];
    }

} );

// End of MousePick.js
