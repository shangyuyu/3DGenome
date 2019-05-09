//
//  MousePick.js
//
/* jshint -W117 */

"use strict";

class MousePick {
// MousePick shall only be substantiated once but can be binded to
// different Object3Ds. focusArray will be shared among them.

    constructor () {
        
        this.enable = true;  // Does NOT disable the execution of member functions
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

        // NOTE: this function cannot be disabled even when "this.enable === false"
        //       leftInfoPanel will trigger this function when 
        //       "this.enable" is purposely set to false on hover

        // TEXT disp logic
        if (text.topInfoPanelEnable === true) {
            text.setText(text.topInfoPanel, this.INTERSECTED.name);
            text.showTopInfoPanel();
        }
        if (text.leftInfoPanelEnable === true) {
        // leftInfoPanel should work regardless of its 'enable'
        // but visual effect can be omitted

            // Desert Array cannot be picked
            let node = document.getElementById("F" + this.INTERSECTED.name);  // FIXME
            if (node) node.className = "objectInfoHover";  // simulate :hover effect
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
            if (text.leftInfoPanelEnable === true) {
        
                // Desert Array cannot be picked
                let node = document.getElementById("F" + this.INTERSECTED.name);
                if (node) node.className = "objectInfo";  // undo simulation hover effects
            }

            // MousePick logic
            this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.recoverHex);
            this.INTERSECTED = null;
        }
    },

    //////////////////////////////////////////////////////////////////////////////
    // Focus

    onFocus: function () {
    // Assume this.INTERSECTED not null

        // Index is not universal, use UID instead
        // let index = nameParse( this.INTERSECTED.name );
        const uidStr = JSON.stringify(this.INTERSECTED.uniqueID);

        if (!this.focusArray.find( e => JSON.stringify(e.uniqueID) === uidStr )) {
        // Cannot focus (or even pick) those who have been put in desert

            // WARNING: The sequence here is non-interchangeable and bug-prone
            this.focusArray.push( this.INTERSECTED );  // push by reference
            this.INTERSECTED.protected = true;
            this.INTERSECTED.protectedRecoverHex = this.INTERSECTED.recoverHex;
            this.INTERSECTED.material.emissive.setHex( gui.mousePickConfig.onFocusColor.replace("#", "0x") );
            this.INTERSECTED.recoverHex = this.INTERSECTED.material.emissive.getHex();

            // Force angular "left-list.component" to refresh
            // FIXME Against angular.js design
            $("#refresh").trigger('click');
        }
    }, 

    setAsFocus: function (parent, uniqueID) {
    // Use uniqueID as input and push it into focusArray if found in "parent"
    // return true if successfully pushed into focusArray or has been in focusArray

        // Did not call THREE.getObjectByProperty to avoid recursively search
        let object = this.getObjectByUniqueID(parent, uniqueID);

        if (object) {

            const uidStr = JSON.stringify(object.uniqueID);
            if ( !this.focusArray.find( e => JSON.stringify(e.uniqueID) === uidStr ) ) {

                let temp = this.INTERSECTED;

                this.INTERSECTED = object;
                this.onPick();
                this.onFocus();
                // this.onLeft(); 
                // Logically should onLeft, but does not change anything and thus can be omitted

                this.INTERSECTED = temp;
            }

            return true;
        } else 
            return false;
    },

    setAsFocusFromArray: function (parent, uniqueIDArray) {

        for (let i=0; i<uniqueIDArray.length; i+=1) {

            this.setAsFocus(parent, uniqueIDArray[i]);
        }
    },

    removeFromFocusArray: function (uidStr) {
    // Return true if successfully removed and false if not found

        for (let i=0; i<this.focusArray.length; i+=1) {

            if (JSON.stringify(this.focusArray[i].uniqueID) === uidStr) {

                let INTERSECTED = this.focusArray[i];

                INTERSECTED.protected = false;
                INTERSECTED.material.emissive.setHex(INTERSECTED.protectedRecoverHex);

                this.focusArray.splice(i, 1);
                // Force angular "left-list.component" to refresh
                $("#refresh").trigger('click');
                return true;
            }
        }

        return false;
    },

    resetFocusArray: function () {
    // This function should only be called by GUI reset button
    // Use 'clearFocused' if the model will be destructed

        console.log("MousePick.js::Reset " + this.focusArray.length + " protected selections.");
        for (let i=0; i<this.focusArray.length; i+=1) {

            let INTERSECTED = this.focusArray[i];

            INTERSECTED.protected = false;
            INTERSECTED.material.emissive.setHex(INTERSECTED.protectedRecoverHex);
        }
        this.focusArray = [];

        // Force angular "left-list.component" to refresh
        $("#refresh").trigger('click');
    },

    getFocusArrayUniqueID: function ( targetArray ) {
    // return focusArray uniqueIDs

        if (this.focusArray.length > 0) {

            for (let i=0; i<this.focusArray.length; i+=1) {

                targetArray.push( mousePick.focusArray[i].uniqueID );
            }
        }
    },

    clearFocused: function() {
    // Clear focusArray and INTERSECTED
        
        this.INTERSECTED = null;
        this.focusArray = [];
        // Force angular "left-list.component" to refresh
        $("#refresh").trigger('click');
    },

    reRenderFocusArray: function () {
    // Called by GUI display color change
    // Not completely re-render

        for (let i=0; i<this.focusArray.length; i+=1) {

            this.focusArray[i].material.emissive.setHex( gui.mousePickConfig.onFocusColor.replace("#", "0x") );
        }
    },

    //////////////////////////////////////////////////////////////////////////////
    // Desert

    onDesert: function () {
    // Assume this.INTERSECTED not null

        // Index is not universal, use UID instead
        // let index = nameParse( this.INTERSECTED.name );
        const uidStr = JSON.stringify(this.INTERSECTED.uniqueID);

        if (!this.desertArray.find( e => JSON.stringify(e.uniqueID) === uidStr )) {

            this.desertArray.push( this.INTERSECTED );
            this.INTERSECTED.deserted = true;
            this.INTERSECTED.material.transparent = true;
            this.INTERSECTED.material.opacity = gui.mousePickConfig.onDesertOpacity;

            // Force angular "left-list.component" to refresh
            // FIXME Against angular.js design
            $("#refresh").trigger('click');
        }
    },

    setAsDesert: function (parent, uniqueID) {
    // Use uniqueID as input and push it into desertArray if found in "parent"
    // return true if successfully pushed into desertArray or has been in desertArray

        // Did not call THREE.getObjectByProperty to avoid recursively search
        let object = this.getObjectByUniqueID(parent, uniqueID);

        if (object) {

            const uidStr = JSON.stringify(object.uniqueID);
            if ( !this.desertArray.find( e => JSON.stringify(e.uniqueID) === uidStr ) ) {

                let temp = this.INTERSECTED;

                this.INTERSECTED = object;
                this.onPick();
                this.onDesert();
                this.onLeft();

                this.INTERSECTED = temp;
            }

            return true;
        } else 
            return false;
    },

    setAsDesertFromArray: function (parent, uniqueIDArray) {

        for (let i=0; i<uniqueIDArray.length; i+=1) {

            this.setAsDesert(parent, uniqueIDArray[i]);
        }
    },

    removeFromDesertArray: function (uidStr) {
    // Return true if successfully removed and false if not found

        for (let i=0; i<this.desertArray.length; i+=1) {

            if (JSON.stringify(this.desertArray[i].uniqueID) === uidStr) {

                let INTERSECTED = this.desertArray[i];

                INTERSECTED.deserted = false;
                INTERSECTED.material.transparent = false;

                this.desertArray.splice(i, 1);
                // Force angular "left-list.component" to refresh
                $("#refresh").trigger('click');
                return true;
            }
        }

        return false;
    },

    resetDesertArray: function () {
    // This function should only be called by GUI reset button
    // Use 'clearDeserted' if the model will be destructed

        console.log("MousePick.js::Reset " + this.desertArray.length + " deserted selections.");
        text.removeAllDesertLeftInfoPanel();
        for (let i=0; i<this.desertArray.length; i+=1) {

            let INTERSECTED = this.desertArray[i];

            INTERSECTED.deserted = false;
            INTERSECTED.material.transparent = false;
        }
        this.desertArray = [];

        // Force angular "left-list.component" to refresh
        $("#refresh").trigger('click');
    },

    getDesertArrayUniqueID: function ( targetArray ) {
    // return desertArray uniqueIDs

        if (this.desertArray.length > 0) {

            for (let i=0; i<this.desertArray.length; i+=1) {

                targetArray.push( mousePick.desertArray[i].uniqueID );
            }
        }
    },

    clearDeserted: function() {
    // Clear desertArray and INTERSECTED
        
        this.INTERSECTED = null;
        this.desertArray = [];
        // Force angular "left-list.component" to refresh
        $("#refresh").trigger('click');
    },

    reRenderDesertArray: function () {
    // Called by GUI display color change
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

        for (let i in gui.folders[1].__controllers)
            gui.folders[1].__controllers[i].updateDisplay();
    },

    getObjectByUniqueID: function (parent, uniqueID) {

        const childArray = parent.children;
        const uidStr = JSON.stringify(uniqueID);
        let targetUniqueID;

        for (let i=0, l=childArray.length; i<l; i+=1) {
        
            targetUniqueID = childArray[i].uniqueID;

            if (JSON.stringify(targetUniqueID) === uidStr)

                return childArray[i];
        }

        return null;
    }

} );

// End of MousePick.js
