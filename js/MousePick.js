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
        this.function = true;  // true for Focus, false for Desert
        this.rayCaster = new THREE.Raycaster();
        this.lastMousePickCallTime = Date.now();
        this.INTERSECTED = null;
        this.focusArray = [];
        this.desertArray = [];
        this.mouse = {
            position: new THREE.Vector2(-1, 1), 
            lastMoveTime: 0
        };
    }
}

Object.assign(MousePick.prototype, {

    call: function (objectArray, shadowArray) {

        if (this.enable === false) return;
        this.lastMousePickCallTime = Date.now();

        this.rayCaster.setFromCamera( this.mouse.position, camera );
        this.rayCaster.linePrecision = gui.renderConfig.radius;

        let intersects = this.rayCaster.intersectObjects( objectArray, false );

        // desertArray objects cannot be selected
        let first = -1;
        for (let i=0; i<intersects.length; i+=1) {

            if (shadowArray[ nameParse(intersects[i].object.name) ].deserted === false) {
            // Note: intersects are objectArray data, deserted property defined in shadowArray

                first = i;
                break;
            }
        }

        if (first > -1) {
            if (this.INTERSECTED != intersects[first].object) {
            // new intersected detected
                this.onLeft();

                if (shadowArray)
                    // The index in 'objectArray' and 'shadowArray' must match
                    this.INTERSECTED = shadowArray[ nameParse(intersects[first].object.name) ];
                else
                    this.INTERSECTED = intersects[first].object;

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
        // Cannot focus those who have been put in desert

            // TEXT Left Info Panel
            text.addToLeftInfoPanel(this.INTERSECTED.name, "focus");

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
        text.removeAllFocusLeftInfoPanel();
        for (let i=0; i<this.focusArray.length; i+=1) {

            let INTERSECTED = this.focusArray[i];

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
    // Use 'resetFocusArray' instead if the model is not destructed
        
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
            text.addToLeftInfoPanel(this.INTERSECTED.name, "desert");

            this.desertArray.push( this.INTERSECTED );
            this.INTERSECTED.deserted = true;
            this.INTERSECTED.material.transparent = true;
            this.INTERSECTED.material.opacity = gui.mousePickConfig.onDesertOpacity;
        }
    },

    setAsDesert: function(parent, indexArray) {
        // Put objects of 'parent' whose index in 'indexArray' into desertArray
        // FIXME : did not check whether existed
    
        let temp = this.INTERSECTED;
        for (let i=0; i<indexArray.length; i+=1) {

            this.INTERSECTED = parent.children[indexArray[i]];  // FIXME BUG! index is not unique identifier!
            this.onPick();
            this.onDesert();
            this.onLeft();
        }
        this.INTERSECTED = temp;
    },

    resetDesertArray: function () {
    // Use 'clearDeserted' if the model will be destructed

        console.log("MousePick.js::Reset " + this.desertArray.length + " deserted selections.");
        text.removeAllDesertLeftInfoPanel();
        for (let i=0; i<this.desertArray.length; i+=1) {

            let INTERSECTED = this.desertArray[i];

            INTERSECTED.deserted = false;
            INTERSECTED.material.transparent = false;
        }
        this.desertArray = [];
    },

    getDesertIndexArray: function ( targetArray ) {
    // return focusArray index

        if (this.desertArray.length > 0) {

            for (let i=0; i<this.desertArray.length; i+=1) {

                targetArray.push( nameParse(mousePick.desertArray[i].name) );
            }
        }
    },

    clearDeserted: function() {
    // Clear desertArray and INTERSECTED
    // Use 'resetDesertArray' instead if the model is not destructed
        
        this.INTERSECTED = null;
        this.desertArray = [];
    },

    reRenderDesertArray: function () {
    // Not completely re-render

        for (let i=0; i<this.desertArray.length; i+=1) {

            this.desertArray[i].material.opacity = gui.mousePickConfig.onDesertOpacity;
        }
    },

    //////////////////////////////////////////////////////////////////////////////
    // Auxiliary

    changeMousepickFunction: function () {

        let result = (gui.mousePickConfig.function ? false : true);
        
        gui.mousePickConfig.function  = result;
        mousePick.function = result;
    },

} );

// End of MousePick.js
