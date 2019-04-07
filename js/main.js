//
// main.js
//
/* jshint -W117 */

"use strict";

// Global core elements
let container, camera, scene, auxiScene, renderer, stats, controls, mousePick, gui, text;
let mouse = {position: new THREE.Vector2(-1, 1), lastMoveTime: 0};
let curve = [];
// Global input raw data
let coordData = [];
let posData = [];


loadData();  // Trigger execution


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

        init();
    });

}


function init() {

    container = document.getElementById("webGLContainer");

    // Override CSS setting to center "topInfoPanel"
    $("#topInfoPanel").css("margin-left" , Math.floor((window.innerWidth - 200)/2.0));

    //////////////////////////////////////////////////////////////
    // Process data
    // FIX ME
    let curveData = [];
    let i;
    for (i = 0; i < coordData.length; i+=3) {

        curveData.push( new THREE.Vector3(coordData[i], coordData[i+1], coordData[i+2]) );
    }
    coordData = [];

    for (i=0; i<200; i+=1) {
        
        curve[i] = new THREE.CatmullRomCurve3( curveData.slice(i*100, (i+1)*100) );
    }
    curveData = [];

    //////////////////////////////////////////////////////////////
    // Init configuration
    gui = new GUIManager();
    mousePick = new MousePick();

    // camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 140);
    camera.lookAt(0, 0, 0);

    // Scene
    let chromosome, auxiChromosome;
    createScene();
    
    // GUI
    document.getElementById("guiContainer").append(gui.gui.domElement);
        // Re-append GUI to custom div
    gui.bindParent(chromosome);
    gui.bindShadowParent(auxiChromosome);
    gui.activate();

    // Renderer
    renderer = new THREE.WebGLRenderer( {precision: "mediump", antialias: false} );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
        // gamma correction
    container.appendChild( renderer.domElement );

    // Stats
    stats = new Stats();
    container.appendChild( stats.dom );

    // TEXT
    text = new TEXT();

    // Controls
    controls = new THREE.TrackballControls( camera, renderer.domElement );
        // Warning: Controler must be assigned a domElement explictly to avoid conflict with GUI.
    controls.minDistance = 1;
    controls.maxDistance = 400;

    //////////////////////////////////////////////////////////////

    document.addEventListener( "mousemove", onDocumentMouseMove, false );
    // document.addEventListener( "mousedown", onDocumentMouseDown, false );
    // WARNING: call of 'onDocumentMouseDown' has been moved to 'controls.js'
    //          due to serious confict of event listener
    document.addEventListener( "dblclick", onDocumentDoubleClick, false );
    window.addEventListener( "resize", onWindowResize, false );

    animate();

/////////////////////////////////////////////////////////////////////

function createScene() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x1a1a1a );
    scene.fog = new THREE.Fog( 0x1a1a1a, 10, 400);

    auxiScene = new THREE.Scene();

    // Light
    let ambientLight = new THREE.AmbientLight(0x444444, 0.10);
    scene.add( ambientLight );

    let lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[0].position.set(0, 0, 200);
    scene.add( lights[0] );

    // Objects
    chromosome = new THREE.Object3D();
    scene.add(chromosome);
    bindTube(chromosome);

    auxiChromosome = new THREE.Object3D();
    auxiScene.add(auxiChromosome);
    bindLine(auxiChromosome);
}


function animate() {

    requestAnimationFrame( animate );

    controls.update();

    render();

    stats.update();
}


function render() {

    let preRenderTime = Date.now();

    if (preRenderTime - mousePick.lastMousePickCallTime > advancedConfig.mousePickInterval) {
    // Two calls of rayCaster should wait at least 'advancedConfig.mousePickInterval' ms
        if (preRenderTime - mouse.lastMoveTime > advancedConfig.mouseStayTime) {
        // Mouse should keep stayed for at least 'advancedConfig.mouseStayTime' ms

            mousePick.call(auxiChromosome.children, chromosome.children);
        } else {

            mousePick.onLeft();
        }
    }

    if (advancedConfig.auxiScene === true) {

        renderer.autoClear = false;
        renderer.clear();
        renderer.render( scene, camera );
        renderer.clearDepth();
        renderer.render( auxiScene, camera );
        renderer.autoClear = true;
    } else {

        renderer.render( scene, camera );
    }
}

}  // End of initScene()

// End of main.js
