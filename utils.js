//
//  utils.js
//

"use strict";

function mix(u, v, r) {
// mix vector u and v with a ratio r
    let result = [];
    for (let i=0; i<u.length; i++) {
        result.push( r*u[i] + (1-r)*v[i] );
    }

    return result;
}


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
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

// End of utils.js
