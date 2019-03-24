//
// main.js
//
/* jshint -W117 */

"use strict";

let camera, scene, renderer, stats, controls, material;
let data = [];

init();

function init() {

    let loader = new THREE.FileLoader();
    loader.load("example.txt", function(data_) {
        data = data_.split(/(\s+)/).filter( e => e.trim().length > 0 );
        initScene();
    });

}

function initScene() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 100;

    controls = new THREE.TrackballControls( camera );
    

    //////////////////////////////////////////////////////////////
    // Process data
    let curveData = [];
    for (let i = 0; i < data.length; i+=3) {

        curveData.push( new THREE.Vector3(Number(data[i]), Number(data[i+1]), Number(data[i+2])) );
    }
    data = [];

    //////////////////////////////////////////////////////////////

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x050505 );
    scene.fog = new THREE.Fog( 0x050505, 10, 400);

    // Light
    //scene.add( new THREE.AmbientLight(0x444444), 0.05 );

    let light = new THREE.PointLight( 0xffffff, 1, 0 );
    light.position.set( 0, 200, 0 );
    scene.add(light);

    // Geometry
    let curve = new THREE.CatmullRomCurve3( curveData );

    let geometry = new THREE.TubeBufferGeometry(curve, curveData.length * 2, 0.2, 8, false);

    let material = new THREE.MeshPhongMaterial( {
        color: 0x156289, 
        emissive: 0x072534, 
        side: THREE.DoubleSide, 
        flatShading: true
    } );

    
    // bind Geometry and Material
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    //////////////////////////////////////////////////////////////

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    document.body.appendChild( renderer.domElement );

    //////////////////////////////////////////////////////////////

    stats = new Stats();
    document.body.appendChild( stats.dom );

    //////////////////////////////////////////////////////////////



    //////////////////////////////////////////////////////////////

    document.addEventListener( "resize", onWindowResize, false );

    animate();

}


function onWindowResize(event) {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.resize( window.innerWidth, window.innerHeight );
}



/////////////////////////////////////////////////////////////////////

function animate() {

    requestAnimationFrame( animate );

    controls.update();

    render();
    stats.update();
}


function render() {

    renderer.render( scene, camera );
}


// End of main.js
