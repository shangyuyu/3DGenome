//
// main.js
//
/* jshint -W117 */

"use strict";

// Global configuration
let renderConfig = {
    background: "#050505", 
    ambientColor: "#ffffff",
    materialColor: "#156289", 
    materialEmissive: "#072534", 
    ambientIntensity: 0.10,
    tubularSegment: 5, 
    radialSegment: 4, 
    radius: 0.2,
};


function colorUpdate(color) {
    // Used for dat.GUI 'addColor' method
    // update CSS-strye string 'value' to THREE.color 'color'

    return function (value) {

        if (typeof value === "string") {
            value = value.replace("#", "0x");
        }

        color.setHex(value);
    };
}


function guiHandler(gui, scene) {

    let renderConfigFolder= gui.addFolder( "Render Configuration" );

    renderConfigFolder.addColor(renderConfig, "background").onChange( function (value) {
        scene.background.setHex( value.replace("#", "0x") );
        scene.fog.color.setHex( value.replace("#", "0x") );
    } );

    renderConfigFolder.addColor(renderConfig, "materialColor").onChange( function () {
        bindTube(parent);
    } );
    renderConfigFolder.addColor(renderConfig, "materialEmissive").onChange( function () {
        bindTube(parent);
    } );
    renderConfigFolder.add(renderConfig, "ambientIntensity", 0, 1, 0.01).onChange( function (value) {
        ambientLight.intensity = value;
    } );
    renderConfigFolder.add(renderConfig, "tubularSegment", 1, 15, 1).onFinishChange( function () {
        bindTube(parent);
    } );
    renderConfigFolder.add(renderConfig, "radialSegment", 1, 10, 1).onFinishChange( function () {
        bindTube(parent);
    } );
    renderConfigFolder.add(renderConfig, "radius", 0.05, 1).onFinishChange( function () {
        bindTube(parent);
    } );

    renderConfigFolder.open();
}


// End of main.js
