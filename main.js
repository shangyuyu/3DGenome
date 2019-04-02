//
// main.js
//
/* jshint -W117 */

"use strict";

// Global core elements
let camera, scene, renderer, stats, controls, material;
let mesh;
let curve = [];
// Global input raw data
let coordData = [];
let posData = [];


loadData();  // Trigger excution


function loadData() {

    let loader = new THREE.FileLoader();
    loader.load("chr1_5kb_miniMDS_structure.tsv", function(data_) {
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


function bindTube(parent) {
    // Re-create Geometry and Material, bind them to mesh and add to Object3D

    /*
    if (mesh !== undefined) {
        parent.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
    }
    */

    for (let i=0; i<200; i+=1) {

        let geometry = new THREE.TubeBufferGeometry(
            curve[i], 
            100 * renderConfig.tubularSegment, 
            renderConfig.radius, 
            renderConfig.radialSegment, 
            false  // 'closed' should be kept false
        );  

        let material = new THREE.MeshPhongMaterial( {
            color: Number( renderConfig.materialColor.replace("#", "0x") ), 
            emissive: Number( renderConfig.materialEmissive.replace("#", "0x") ), 
            specular: Number( renderConfig.materialSpecular.replace("#", "0x") ),
            side: THREE.DoubleSide, 
            flatShading: false
        } );

        // bind Geometry and Material
        mesh = new THREE.Mesh(geometry, material);
        parent.add(mesh);
    }
}


function initScene() {

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

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x050505 );
    scene.fog = new THREE.Fog( 0x050505, 10, 400);

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
    let chromosome = new THREE.Object3D();
    scene.add(chromosome);

    bindTube(chromosome);

    // GUI logic
    let gui = new dat.GUI();
    guiHandler(gui, scene, chromosome, ambientLight);

    //////////////////////////////////////////////////////////////

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    // gamma correction
    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    document.body.appendChild( renderer.domElement );

    //////////////////////////////////////////////////////////////

    stats = new Stats();
    document.body.appendChild( stats.dom );

    //////////////////////////////////////////////////////////////

    

    //////////////////////////////////////////////////////////////

    controls = new THREE.TrackballControls( camera, renderer.domElement );
    // Warning: Controler must be assigned a domElement explictly to avoid conflict with GUI.

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
