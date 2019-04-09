//
// main.js
//
/* jshint -W117 */

"use strict";

// Global core elements
let camera, scene, auxiScene, renderer, mousePick, gui, text;


function init() {

    let container = document.getElementById("webGLContainer");

    // Override CSS setting to center "topInfoPanel"
    $("#topInfoPanel").css("margin-left" , Math.floor((window.innerWidth - 200)/2.0));

    //////////////////////////////////////////////////////////////
    // Init configuration
    gui = new GUIManager();
    mousePick = new MousePick();
    text = new TEXT();

    // camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 140);
    camera.lookAt(0, 0, 0);

    // Scene
    let chromosome, auxiChromosome, lights;  // Only one light source is allowed
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
    let stats = new Stats();
    stats.domElement.style.position = "absolute";
    document.getElementById("statsContainer").append(stats.domElement);

    // Controls
    let controls = new THREE.TrackballControls( camera, renderer.domElement, lights[0] );
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

    lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[0].position.set(0, 0, 200);
    scene.add( lights[0] );

    // Objects
    chromosome = new THREE.Object3D();
    scene.add(chromosome);
    data.bindTube(chromosome);

    auxiChromosome = new THREE.Object3D();
    auxiScene.add(auxiChromosome);
    data.bindLine(auxiChromosome);
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
        if (preRenderTime - mousePick.mouse.lastMoveTime > advancedConfig.mouseStayTime) {
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
