//
//  utils.js
//
/* jshint -W117 */

"use strict";


Object.defineProperty(Array.prototype, 'flat', {
    // .flat() has not been implemented in common browsers

    value: function(depth = 1) {
      return this.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth-1)) ? toFlatten.flat(depth-1) : toFlatten);
      }, []);
    }
});


function mix (u, v, r) {
// mix vector u and v with a ratio r

    let result = [];
    for (let i=0; i<u.length; i++) {
        result.push( r*u[i] + (1-r)*v[i] );
    }

    return result;
}


function getRandomInt (max) {
    
    return Math.floor(Math.random() * Math.floor(max));
}


function getRandomArbitrary (min, max) {
    
    return Math.random() * (max - min) + min;
}


function nameParse (name) {

    return Number(name.slice(7));  // Segment/Lineseg
}


function nameParseStr (name) {

    return name.slice(7);  // Segment/Lineseg
}


function openTab (event, Name) {
// Triggered by leftInfoPanel.html event

    let i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");

    for (i = 0; i < tablinks.length; i++) {

        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(Name).style.display = "block";
    event.currentTarget.className += " active";
}


function removeObject (id) {
// Triggered by leftInfoPanel.html event
// NOTE: Not supposed to be called by any other function
//       Use functions in MousePick to remove objects
// Assume object exist in corresponding panel/array

    // jQuery mouseleave
    // Assume "mouseover" has been triggered
    $("#"+id).trigger("mouseleave");
    // TEXT
    text.removeFromLeftInfoPanel(id);
    // MousePick
    if (id[0] == "F")
        mousePick.removeFromFocusArray( id.slice(1) );
    else
        mousePick.removeFromDesertArray( id.slice(1) );
}


function uniqueID2string (uniqueID) {

    return `CHR-${uniqueID.CHR}\u00A0\u00A0\u00A0${uniqueID.start}-${uniqueID.end}`;
}


function disposeNode (node) {
    // REF: https://stackoverflow.com/a/33199591/9338178

    if (node instanceof THREE.Mesh)
    {
        if (node.geometry)
        {
            node.geometry.dispose ();
        }

        if (node.material)
        {
            if (node.material instanceof THREE.MeshFaceMaterial)
            {
                $.each (node.material.materials, function (idx, mtrl)
                {
                    if (mtrl.map)           mtrl.map.dispose ();
                    if (mtrl.lightMap)      mtrl.lightMap.dispose ();
                    if (mtrl.bumpMap)       mtrl.bumpMap.dispose ();
                    if (mtrl.normalMap)     mtrl.normalMap.dispose ();
                    if (mtrl.specularMap)   mtrl.specularMap.dispose ();
                    if (mtrl.envMap)        mtrl.envMap.dispose ();

                    mtrl.dispose ();    // disposes any programs associated with the material
                });
            }
            else
            {
                if (node.material.map)          node.material.map.dispose ();
                if (node.material.lightMap)     node.material.lightMap.dispose ();
                if (node.material.bumpMap)      node.material.bumpMap.dispose ();
                if (node.material.normalMap)    node.material.normalMap.dispose ();
                if (node.material.specularMap)  node.material.specularMap.dispose ();
                if (node.material.envMap)       node.material.envMap.dispose ();

                node.material.dispose ();   // disposes any programs associated with the material
            }
        }
    }
}   // disposeNode


function disposeHierarchy (node, callback) {
    // REF: https://stackoverflow.com/a/33199591/9338178

    for (let i = node.children.length - 1; i >= 0; i--)
    {
        let child = node.children[i];
        disposeHierarchy (child, callback);
        callback (child);
    }
    node.children = [];
}

// Event callback functions

function onDocumentMouseMove (event) {

    event.preventDefault();

    mousePick.mouse.position.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mousePick.mouse.position.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    mousePick.mouse.lastMoveTime = Date.now();
}


function onDocumentMouseDown (event) {

    event.preventDefault();
    
}


function onDocumentDoubleClick (event) {

    event.preventDefault();

    // Picked object stay focused or put into desert
    if (mousePick.INTERSECTED) {
        
        if (mousePick.function) 
            mousePick.onFocus();
        else
            mousePick.onDesert();
    }
}


function onDocumentKeyDown (event) {

    if (event.keyCode === 16)  // shift
        mousePick.changeMousepickFunction();
    if (event.keyCode === 80){  // P
        
        text.searchPanelEnable = (text.searchPanelEnable == false) ? true : false;
        $("#searchPanel").css("display", (text.searchPanelEnable == true) ? "block" : "none");
    }
}


function onWindowResize (event) {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    // Override CSS setting on resize
    $("#topInfoPanel").css("margin-left" , Math.floor((window.innerWidth - 200)/2.0));

}

// End of utils.js
