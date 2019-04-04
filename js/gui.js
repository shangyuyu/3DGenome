//
// main.js
//
/* jshint -W117 */

"use strict";

// Global configuration
let renderConfig = {
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


function colorUpdate(parent, type) {
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
}


function guiHandler(gui, scene, parent, ambientLight) {

    let renderConfigFolder= gui.addFolder( "Render Configuration" );

    renderConfigFolder.addColor(renderConfig, "background").onChange( function (value) {
        scene.background.setHex( value.replace("#", "0x") );
        scene.fog.color.setHex( value.replace("#", "0x") );
    } );

    renderConfigFolder.addColor(renderConfig, "materialColor").onChange( 
        colorUpdate( parent, "color" )
    );
    renderConfigFolder.addColor(renderConfig, "materialEmissive").onChange(
        colorUpdate( parent, "emissive" )
    );
    renderConfigFolder.addColor(renderConfig, "materialSpecular").onChange(
        colorUpdate( parent, "specular" )
    );
    renderConfigFolder.add(renderConfig, "ambientIntensity", 0, 1, 0.01).onChange( function (value) {
        ambientLight.intensity = value;
    } );
    renderConfigFolder.add(renderConfig, "tubularSegment", 1, 20, 1).onFinishChange( function () {
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
