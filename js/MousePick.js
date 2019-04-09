//
//  MousePick.js
//
/* jshint -W117 */

"use strict";

class MousePick {
// MousePick shall only be substantiated once but can be binded to
// different Object3Ds. focusArray will be shared among them.

    constructor () {
        
        this.enable = true;
        this.focus = true;  // true for focus, false for desert
        this.rayCaster = new THREE.Raycaster();
        this.lastMousePickCallTime = Date.now();
        this.INTERSECTED = null;
        this.focusArray = [];
        this.desertArray = [];
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
                    this.INTERSECTED = shadowArray[ nameParse(intersects[0].object.name) ];
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
            console.warn( "Mouse pick cost too much time: " + String(Date.now() - this.lastMousePickCallTime) + "ms. Consider disable mouse pick, refresh page or suppress render quality.");
        }
    }, 

    onPick: function () {
    // Assume INTERSECTED not null

        // TEXT disp logic
        if (text.topInfoPanelEnable === true) {
            text.setText(text.topInfoPanel, this.INTERSECTED.name);
            text.showTopInfoPanel();
        }

        // MousePick logic
        this.INTERSECTED.recoverHex = this.INTERSECTED.material.emissive.getHex();
        this.INTERSECTED.material.emissive.setHex( gui.mousePickConfig.onPickColor.replace("#", "0x") );
    }, 

    onLeft: function () {
    // Undo onPick changes

        if (this.INTERSECTED) {

            // TEXT disp logic
            text.hideTopInfoPanel();

            // MousePick logic
            this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.recoverHex);
            this.INTERSECTED = null;
        }
    },

    //////////////////////////////////////////////////////////////////////////////
    // Focus

    onFocus: function () {
    // Assume this.INTERSECTED not null

        let index = nameParse( this.INTERSECTED.name );
        
        if (!this.focusArray.find( e => nameParseStr(e.name) == index )) {

            // TEXT Left Info Panel
            text.addToLeftInfoPanel(this.INTERSECTED.name);

            // WARNING: The sequence here is non-interchangeable and bug-prone
            this.focusArray.push( this.INTERSECTED );  // push by reference (not copy)?
            this.INTERSECTED.protected = true;
            this.INTERSECTED.protectedRecoverHex = this.INTERSECTED.recoverHex;
            this.INTERSECTED.material.emissive.setHex( gui.mousePickConfig.onFocusColor.replace("#", "0x") );
            this.INTERSECTED.recoverHex = this.INTERSECTED.material.emissive.getHex();
        }
    }, 

    setAsFocus: function(parent, indexArray) {
        // Put objects of 'parent' whose index in 'indexArray' into focusArray
        // FIXME : did not check whether existed
    
        let temp = this.INTERSECTED;
        for (let i=0; i<indexArray.length; i+=1) {

            this.INTERSECTED = parent.children[indexArray[i]];
            this.onPick();
            this.onFocus();
            // this.onLeft(); Logically should onLeft, but does not change anything
        }
        this.INTERSECTED = temp;
    },

    resetFocusArray: function () {
    // Use 'clearFocused' if the model will be destructed

        console.log("MousePick.js::Reset " + this.focusArray.length + " protected selections.");
        for (let i=0; i<this.focusArray.length; i+=1) {

            let INTERSECTED = this.focusArray[i];

            // TEXT Left Info Panel
            text.removeFromLeftInfoPanel(INTERSECTED.name);

            INTERSECTED.protected = false;
            INTERSECTED.material.emissive.setHex(INTERSECTED.protectedRecoverHex);
        }
        this.focusArray = [];
    },

    getFocusIndexArray: function ( targetArray ) {
    // return focusArray index

        if (this.focusArray.length > 0) {

            for (let i=0; i<this.focusArray.length; i+=1) {

                targetArray.push( nameParse(mousePick.focusArray[i].name) );
            }
        }
    },

    clearFocused: function() {
    // Clear focusArray and INTERSECTED
    // Use 'reset' instead if the model is not destructed
        
        this.INTERSECTED = null;
        this.focusArray = [];
    },

    reRenderFocusArray: function () {
    // Not completely re-render

        for (let i=0; i<this.focusArray.length; i+=1) {

            this.focusArray[i].material.emissive.setHex( gui.mousePickConfig.onFocusColor.replace("#", "0x") );
        }
    },

    //////////////////////////////////////////////////////////////////////////////
    // Desert

    onDesert: function () {
    // Assume this.INTERSECTED not null

        let index = nameParse( this.INTERSECTED.name );

        if (!this.desertArray.find( e => nameParseStr(e.name) == index )) {  // in focusArray and desertArray?? FIXME

            // TEXT Left Info Panel
            text.addToLeftInfoPanel(this.INTERSECTED.name);

            this.desertArray.push( this.INTERSECTED );
            this.INTERSECTED.material.transparent = true;
            this.INTERSECTED.material.opacity = 0.3;
        }
    },

    reRenderDesertArray: function () {
    // Not completely re-render

        for (let i=0; i<this.desertArray.length; i+=1) {

            this.desertArray[i].material.opacity = gui.mousePickConfig.onDesertOpacity;
        }
    },

} );

// End of MousePick.js
