//
// gui.js
//
/* jshint -W117 */

"use strict";

class GUIManager {

    constructor (parent = null, shadowParent = null) {
    // FIXME GUI should not be binded

        this.parent = parent;
        this.shadowParent = shadowParent;
        this.gui = new dat.GUI( {autoPlace: false} );
        this.folders = [];

        this.renderConfig = {
            background: "#1a1a1a", 
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
            function: true,  // true for Focus, false for Desert
            onPickColor: "#ac0000",
            onFocusColor: "#007d1d",
            onDesertOpacity: 0.3,
            "Reset Focus": function(){mousePick.resetFocusArray();},
            "Reset Desert": function(){mousePick.resetDesertArray();},
        };
        this.infoDispConfig = {
            topInfoPanelEnable: true,
            leftInfoPanelEnable: true,
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

            for (let i=0; i<data.objects.length; i+=1) { 
                
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
            data.bindTube(gui.parent);
            data.bindLine(gui.shadowParent);
        } );
        this.folders[0].add(this.renderConfig, "radialSegment", 1, 8, 1).onFinishChange( function () {
            data.bindTube(gui.parent);
        } );
        this.folders[0].add(this.renderConfig, "radius", 0.05, 1).onFinishChange( function () {
            data.bindTube(gui.parent);
        } );

        this.folders[0].open();

        ////////////////////////////////////////////////////////////////////////////////////
        this.folders[1] = this.gui.addFolder( "Mouse Pick" );

        this.folders[1].add(this.mousePickConfig, "enable").onChange( function (value) {
            mousePick.enable = value;
        } );
        this.folders[1].add(this.mousePickConfig, "function", {Focus: true, Desert: false}).onChange( function (value) {
            mousePick.function = value === "true" ? true : false;
        } );
        this.folders[1].addColor(this.mousePickConfig, "onPickColor");
        this.folders[1].addColor(this.mousePickConfig, "onFocusColor").onChange( function () {
            mousePick.reRenderFocusArray();
        } );
        this.folders[1].add(this.mousePickConfig, "onDesertOpacity", 0, 1, 0.01).onChange( function () {
            mousePick.reRenderDesertArray();
        } );
        this.folders[1].add(this.mousePickConfig, "Reset Focus");
        this.folders[1].add(this.mousePickConfig, "Reset Desert");

        this.folders[1].open();
        
        ////////////////////////////////////////////////////////////////////////////////////
        this.folders[2] = this.gui.addFolder( "Info Display" );

        this.folders[2].add(this.infoDispConfig, "topInfoPanelEnable").onChange( function (value) {
            text.topInfoPanelEnable = value;
        } );
        this.folders[2].add(this.infoDispConfig, "leftInfoPanelEnable").onChange( function (value) {
            text.leftInfoPanelEnable = value;
            if (value)
                text.showLeftInfoPanel();
            else
                text.hideLeftInfoPanel();
        } );

        this.folders[2].open();

        ////////////////////////////////////////////////////////////////////////////////////
    },

    bindParent: function (parent) {

        this.parent = parent;
    },

    bindShadowParent: function (shadowParent) {

        this.shadowParent = shadowParent;
    }

} );

// End of gui.js
