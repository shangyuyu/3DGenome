//
// gui.js
//
/* jshint -W117 */

"use strict";

class GUIManager {

    constructor (scene = null, parent = null) {

        this.parent = parent;
        this.gui = new dat.GUI();
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

            for (let i=0; i<200; i+=1) {  // WARNING: Change the 200 later
                
                if (type === "color")
                    parent.children[i].material.color.setHex(value);
                else if (type === "emissive")
                    parent.children[i].material.emissive.setHex(value);
                else if (type === "specular")
                    parent.children[i].material.specular.setHex(value);
                else 
                    alert("Error gui.js::colorUpdate unknown type.");
            }
        };
    }, 

    activate: function () {

        this.folders[0] = this.gui.addFolder( "Render Configuration" );

        // NOTE: 'this' does not represent this class in the following callback functions
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
        } );
        this.folders[0].add(this.renderConfig, "radialSegment", 1, 10, 1).onFinishChange( function () {
            bindTube(gui.parent);
        } );
        this.folders[0].add(this.renderConfig, "radius", 0.05, 1).onFinishChange( function () {
            bindTube(gui.parent);
        } );

        this.folders[0].open();
    }, 

    bindParent: function (parent) {

        this.parent = parent;
    }

} );

// End of gui.js
