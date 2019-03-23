//
// main.js
//
/* jshint -W117 */

"use strict";

let camera, scene, renderer, stats, controls, material;

init();
animate();


function init() {

    camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 1, 3500);
    camera.position.z = 1500;

    controls = new THREE.FirstPersonControls( camera );
    controls.movementSpeed = 10.0;
    controls.activeLook = true;
    controls.lookSpeed = 0.0005;

    //////////////////////////////////////////////////////////////

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x050505 );
    scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

    // Light
    scene.add( new THREE.AmbientLight(0x444444) );

    let light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light1.position.set(1, 1, 1);
    scene.add(light1);

    let light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
    light2.position.set( 0, -1, 0 );
    scene.add(light2);

    // Geometry
    let triangles = 160000;

    let geometry = new THREE.BufferGeometry();

    let positions = [];
    let normals = [];
    let colors = [];

    let color = new THREE.Color();

    let n = 800, n2 = n / 2;
    let d = 12, d2 = d / 2;

    let va = new THREE.Vector3();
    let vb = new THREE.Vector3();
    let vc = new THREE.Vector3();

    let cb = new THREE.Vector3();
    let ab = new THREE.Vector3();

    for (let i = 0; i < triangles; i++) {

        // position
        let x = Math.random() * n - n2;
        let y = Math.random() * n - n2;
        let z = Math.random() * n - n2;
        let ax = x + Math.random() * d - d2;
        let ay = y + Math.random() * d - d2;
        let az = z + Math.random() * d - d2;
        let bx = x + Math.random() * d - d2;
        let by = y + Math.random() * d - d2;
        let bz = z + Math.random() * d - d2;
        let cx = x + Math.random() * d - d2;
        let cy = y + Math.random() * d - d2;
        let cz = z + Math.random() * d - d2;

        positions.push(ax, ay, az);
        positions.push(bx, by, bz);
        positions.push(cx, cy, cz);

        // face normals
        va.set(ax, ay, az);
        vb.set(bx, by, bz);
        vc.set(cx, cy, cz);
        cb.subVectors(vc, vb);
        ab.subVectors(va, vb);
        cb.cross(ab);

        cb.normalize();

        let nx = cb.x;
        let ny = cb.y;
        let nz = cb.z;

        normals.push(nx, ny, nz);
        normals.push(nx, ny, nz);
        normals.push(nx, ny, nz);

        // Color
        let vx = (x/n) + 0.5;
        let vy = (y/n) + 0.5;
        let vz = (z/n) + 0.5;

        color.setRGB(vx, vy, vz);

        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
    }

    geometry.addAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.addAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    positions = undefined;
    normals = undefined;
    colors = undefined;

    geometry.computeBoundingSphere();

    let material = new THREE.MeshPhongMaterial( {
        color: 0xaaaaaa, 
        specular: 0xffffff, 
        shininess: 250, 
        side: THREE.DoubleSide, 
        vertexColors: THREE.VertexColors
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

}


function onWindowResize(event) {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.resize( window.innerWidth, window.innerHeight );
}



/////////////////////////////////////////////////////////////////////

function animate() {

    requestAnimationFrame( animate );

    controls.update(1);

    render();
    stats.update();
}


function render() {

    renderer.render( scene, camera );
}


// End of main.js
