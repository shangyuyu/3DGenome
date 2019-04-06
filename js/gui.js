//
// gui.js
//
/* jshint -W117 */

"use strict";

class GUIManager {

    constructor (parent = null, shadowParent = null) {

        this.parent = parent;
        this.shadowParent = shadowParent;
        this.gui = new dat.GUI( {autoPlace: false} );
        this.folders = [];

        this.renderConfig = {
            background: "#050505", 
            ambientColor: "#ffffff",
            materialColor: "#2194ce",  // 156289
            materialEmissive: "#072534", 
            materialSpecular: "#111111",
            ambientIntensity: 0.10,
            tubularSegment: 5, 
            radialSegment: 4, 
            radius: 0.2,
        };
        this.mousePickConfig = {
            enable: true, 
            onPickColor: "#ac0000",
            onFocusColor: "#007d1d",
            reset: function(){mousePick.reset();},
        };
    }
}

Object.assign(GUIManager.prototype, {

    colorUpdate: function (parent, type) {
        // Used for dat.GUI 'addColor' method
        // update CSS-strye string 'value' to Object3D 'parent'

        return function (value) {

            if (typeof value === "string") {
                value = value.replace("#", "0x");
            }

            for (let i=0; i<200; i+=1) {  // WARNING: Change the 200 later FIX ME
                
                if (type === "color")
                    parent.children[i].material.color.setHex(value);
                else if (type === "emissive") {
                    if (!parent.children[i].protected)
                        // When changing emissive color, protected cannot be changed
                        parent.children[i].material.emissive.setHex(value);
                    else
                        // but later if reset...
                        parent.children[i].protectedRecoverHex = value;
                }
                else if (type === "specular")
                    parent.children[i].material.specular.setHex(value);
                else 
                    alert("Error gui.js::colorUpdate unknown type.");
            }
        };
    }, 

    activate: function () {

        // NOTE: 'this' does not represent this class in the following callback functions
        this.folders[0] = this.gui.addFolder( "Model and Render" );

        this.folders[0].addColor(this.renderConfig, "background").onChange( function (value) {
            scene.background.setHex( value.replace("#", "0x") );
            scene.fog.color.setHex( value.replace("#", "0x") );
        } );
        this.folders[0].addColor(this.renderConfig, "materialColor").onChange( 
            gui.colorUpdate( gui.parent, "color" )
        );
        this.folders[0].addColor(this.renderConfig, "materialEmissive").onChange(
            gui.colorUpdate( gui.parent, "emissive" )
        );
        this.folders[0].addColor(this.renderConfig, "materialSpecular").onChange(
            gui.colorUpdate( gui.parent, "specular" )
        );
        this.folders[0].add(this.renderConfig, "ambientIntensity", 0, 1, 0.01).onChange( function (value) {
            let ambientLight = scene.getObjectByProperty("type", "AmbientLight");
            ambientLight.intensity = value;
        } );
        this.folders[0].add(this.renderConfig, "tubularSegment", 1, 20, 1).onFinishChange( function () {
            bindTube(gui.parent);
            bindLine(gui.shadowParent);
        } );
        this.folders[0].add(this.renderConfig, "radialSegment", 1, 8, 1).onFinishChange( function () {
            bindTube(gui.parent);
        } );
        this.folders[0].add(this.renderConfig, "radius", 0.05, 1).onFinishChange( function () {
            bindTube(gui.parent);
        } );

        this.folders[0].open();

        ////////////////////////////////////////////////////////////////////////////////////
        this.folders[1] = this.gui.addFolder( "Mouse Pick" );

        this.folders[1].add(this.mousePickConfig, "enable").onChange( function (value) {
            mousePick.enable = value;
        } );
        this.folders[1].addColor(this.mousePickConfig, "onPickColor");
        this.folders[1].addColor(this.mousePickConfig, "onFocusColor").onChange( function () {
            mousePick.reRenderFocusArray();
        } );
        this.folders[1].add(this.mousePickConfig, "reset");

        this.folders[1].open();
    },

    bindParent: function (parent) {

        this.parent = parent;
    },

    bindShadowParent: function (shadowParent) {

        this.shadowParent = shadowParent;
    }

} );

// End of gui.js
