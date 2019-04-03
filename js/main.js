//
// main.js
//
/* jshint -W117 */

"use strict";

// Global core elements
let container, camera, scene, selectScene, renderer, stats, controls, rayCaster;
let mouse = new THREE.Vector2();
let curve = [];
let chromosome, selectChromosome, sphere;  // used in function 'Render'
// Global input raw data
let coordData = [];
let posData = [];


loadData();  // Trigger excution


function loadData() {

    let loader = new THREE.FileLoader();
    loader.load("./data/chr1_5kb_miniMDS_structure.tsv", function(data_) {
        let data = data_.split(/(\s+)/).filter( e => e.trim().length > 0 );
        data.splice(0, 3);  // delete chr, resolution, startPos

        for (let i = 0; i < data.length; i+=4) {
            if (data[i+1] === "nan") continue;
            posData.push(Number(data[i]));
            coordData.push(Number(data[i+1])*50.0, Number(data[i+2])*50.0, Number(data[i+3])*50.0);
        }
        data = [];

        initScene();
    });

}


function initScene() {

    container = document.createElement( "div" );
    document.body.appendChild( container );

    // camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 100;    

    //////////////////////////////////////////////////////////////
    // Process data
    let curveData = [];
    let i;
    for (i = 0; i < coordData.length; i+=3) {

        curveData.push( new THREE.Vector3(coordData[i], coordData[i+1], coordData[i+2]) );
    }

    for (i=0; i<200; i+=1) {
        
        curve[i] = new THREE.CatmullRomCurve3( curveData.slice(i*100, (i+1)*100) );
    }

    //////////////////////////////////////////////////////////////
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x050505 );
    scene.fog = new THREE.Fog( 0x050505, 10, 400);

    selectScene = new THREE.Scene();

    // temp
    let geo = new THREE.SphereBufferGeometry( 0.5 );
    let mat = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    sphere = new THREE.Mesh(geo, mat);
    sphere.visible = false;
    scene.add(sphere);

    // Light
    let ambientLight = new THREE.AmbientLight(0x444444, renderConfig.ambientIntensity);
    scene.add( ambientLight );

    let lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

    lights[ 0 ].position.set( 0, 0, 200 );
    lights[ 1 ].position.set( 100, 200, 100 );
    lights[ 2 ].position.set( - 100, - 200, - 100 );

    scene.add( lights[ 0 ] );
    // scene.add( lights[ 1 ] );
    // scene.add( lights[ 2 ] );

    // Geometry
    chromosome = new THREE.Object3D();
    scene.add(chromosome);

    bindTube(chromosome);

    selectChromosome = new THREE.Object3D();
    selectScene.add(selectChromosome);

    bindLine(selectChromosome);

    // GUI logic
    let gui = new dat.GUI();
    guiHandler(gui, scene, chromosome, ambientLight);

    //////////////////////////////////////////////////////////////

    renderer = new THREE.WebGLRenderer( {precision: "mediump"} );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    // gamma correction
    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    container.appendChild( renderer.domElement );

    //////////////////////////////////////////////////////////////

    stats = new Stats();
    container.appendChild( stats.dom );

    //////////////////////////////////////////////////////////////

    rayCaster = new THREE.Raycaster();

    //////////////////////////////////////////////////////////////

    controls = new THREE.TrackballControls( camera, renderer.domElement );
    // Warning: Controler must be assigned a domElement explictly to avoid conflict with GUI.

    //////////////////////////////////////////////////////////////

    document.addEventListener( "mousemove", onDocumentMouseMove, false );
    window.addEventListener( "resize", onWindowResize, false );

    animate();
}

/////////////////////////////////////////////////////////////////////

function animate() {

    requestAnimationFrame( animate );

    controls.update();

    render();
    stats.update();
}


function render() {

    // Find intersects
    rayCaster.setFromCamera( mouse, camera );

    // let time = Date.now();
    let intersects = rayCaster.intersectObjects( selectChromosome.children, false );
    // console.log(Date.now() - time, " ms");

    if (intersects.length > 0) {

        sphere.visible = true;
        sphere.position.copy( intersects[0].point );
        // console.log(intersects.length);
    } else {

        sphere.visible = false;
    }

    //renderer.autoClear = false;
    //renderer.clear();
    renderer.render( scene, camera );
    //renderer.clearDepth();
    //renderer.render( selectScene, camera );
}


// End of main.js
