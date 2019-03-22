//
// main.js
//
/* jshint -W117 */

"use strict";

let camera, scene, renderer, stats, material;
let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

init();
animate();


function init() {

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 2000);
    camera.position.z = 1000;

    //////////////////////////////////////////////////////////////

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

    // Geometry
    let geometry = new THREE.BufferGeometry();

    let sprite = new THREE.TextureLoader().load( "./disc.png" );

    let vertice = [];
    for (let i = 0; i < 10000; i++) {

        let x = 2000 * Math.random() - 1000;
        let y = 2000 * Math.random() - 1000;
        let z = 2000 * Math.random() - 1000;

        vertice.push(x, y, z);
    }
    geometry.addAttribute("position", new THREE.Float32BufferAttribute(vertice, 3));

    // Material
    material = new THREE.PointsMaterial( { 
        size: 35, 
        sizeAttenuatation: false, 
        map: sprite, 
        alphaTest: 0.5, 
        transparent: true, 
    } );
    material.color.setHSL( 1.0, 0.3, 0.7);

    // bind Geometry and Material
    let particles = new THREE.Points(geometry, material);
    scene.add(particles);

    //////////////////////////////////////////////////////////////

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //////////////////////////////////////////////////////////////

    stats = new Stats();
    document.body.appendChild( stats.dom );

    //////////////////////////////////////////////////////////////

    let gui = new dat.GUI();

    gui.add( material, "sizeAttenuation" ).onChange( function () {

        material.needsUpdate = true;

    } );

    gui.open();

    //////////////////////////////////////////////////////////////

    document.addEventListener( "mousemove", onDocumentMouseMove, false );
    document.addEventListener( "touchstart", onDocumentTouchStart, false );
    document.addEventListener( "touchmove", onDocumentTouchMove, false );

    document.addEventListener( "resize", onWindowResize, false );

}


function onWindowResize(event) {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.resize( window.innerWidth, window.innerHeight );
}


function onDocumentMouseMove(event) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}


function onDocumentTouchMove(event) {

}


function onDocumentTouchStart(event) {
    
}

/////////////////////////////////////////////////////////////////////

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();
}


function render() {

    let time = Date.now() * 0.00005;

    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += ( - mouseY - camera.position.y) * 0.05;

    camera.lookAt( scene.position );

    let h = (360 * (1.0 + time) % 360) / 360;
    material.color.setHSL(h, 0.5, 0.5);

    renderer.render( scene, camera );
}


// End of main.js
