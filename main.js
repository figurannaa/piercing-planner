import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const container = document.getElementById( 'container' );

let renderer, scene, camera;

let line;
let raycaster;

let mouseHelper;
const mouse = new THREE.Vector2();

const intersection = {
    intersects: false,
    point: new THREE.Vector3(),
    normal: new THREE.Vector3()
};
const intersects = [];

const piercings = [];

let rightEar,leftEar;

const params = {
    color: 0xd3d3d3,
    size: 0.08,
    shininess: 0.2,
    metalness: 1
};

init();

function init() {

    // Init setup
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    container.appendChild( renderer.domElement );

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 2, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 100;

    // Mouse control
    const controls = new OrbitControls( camera, renderer.domElement );
	controls.minDistance = 50;
	controls.maxDistance = 200;

    // Lights
    scene.add( new THREE.AmbientLight( 0x666666 ) );

    const dirLight1 = new THREE.DirectionalLight( 0xffddcc, 3 );
    dirLight1.position.set( 1, 0.75, 0.5 );
    scene.add( dirLight1 );

    const dirLight2 = new THREE.DirectionalLight( 0xccccff, 3 );
    dirLight2.position.set( - 1, 0.75, - 0.5 );
    scene.add( dirLight2 );

    // Line creation
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);

    line = new THREE.Line(geometry, new THREE.LineBasicMaterial());
    scene.add(line);

    loadEar();

    raycaster = new THREE.Raycaster();

    mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
    mouseHelper.visible = false;
    scene.add( mouseHelper );

    window.addEventListener( 'resize', onWindowResize );

    let moved = false;

    controls.addEventListener( 'change', function () {

        moved = true;

    } );

    window.addEventListener( 'pointerdown', function () {

        moved = false;

    } );

    window.addEventListener( 'pointerup', function ( event ) {

        if ( moved === false ) {

            checkIntersection( event.clientX, event.clientY );

            if ( intersection.intersects ) pierce();

        }

    } );

    window.addEventListener('pointermove', onPointerMove);
    function onPointerMove(event) {
        if (event.isPrimary) {
            checkIntersection(event.clientX, event.clientY);
        }
    }

    document.getElementById('clear').addEventListener('click', removePiercings);

    //
    // CHECKING IF THE CURSOR IS INTERSECTING WITH THE OBJECT
    //
    function checkIntersection( x, y ) {

        if ( rightEar === undefined ) return;

        mouse.x = ( x / window.innerWidth ) * 2 - 1;
        mouse.y = - ( y / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );
        raycaster.intersectObject( rightEar, false, intersects );

        if ( intersects.length > 0 ) {

            const p = intersects[ 0 ].point;
            mouseHelper.position.copy( p );
            intersection.point.copy( p );

            const normalMatrix = new THREE.Matrix3().getNormalMatrix( rightEar.matrixWorld );

            const n = intersects[ 0 ].face.normal.clone();
            n.applyNormalMatrix( normalMatrix );
            n.multiplyScalar( 0.5 );
            n.add( intersects[ 0 ].point );

            intersection.normal.copy( intersects[ 0 ].face.normal );
            mouseHelper.lookAt( n );

            const positions = line.geometry.attributes.position;
            positions.setXYZ( 0, p.x, p.y, p.z );
            positions.setXYZ( 1, n.x, n.y, n.z );
            positions.needsUpdate = true;

            intersection.intersects = true;

            intersects.length = 0;

        } else {

            intersection.intersects = false;

        }

    }

    //
    // GUI
    //
    const gui = new GUI();

    gui.add( params, 'size', 0.04, 0.2 );
    gui.addColor( params, 'color');
    gui.add( params, 'shininess', 0, 0.5);
    gui.add( params, 'metalness', 0, 1);
    gui.open();
}

//
// LOADING FUNCTIONS
//
function loadEar() {
    const loader = new GLTFLoader();

    //const testTex = new THREE.TextureLoader().load('testing_ear.jpg');
    //testTex.colorSpace = THREE.SRGBColorSpace;

    loader.load('testing_ear.glb', function (gltf) {

        rightEar = gltf.scene.children[0];
        //rightEar.material = new THREE.MeshBasicMaterial( { map: testTex } );

        // Setting the model's position, so it looks decent upon start up
        rightEar.scale.set(0.7, 0.7, 0.7); 
        rightEar.rotation.z = THREE.MathUtils.degToRad(150); 

        scene.add(rightEar);
        console.log('Ear model loaded successfully!');
    },
    undefined,
    function (error) {
        console.error('Error loading the GLTF file:', error);
    });
}

//
// PIERCING FUNCTIONS
//
function pierce() {
    const sphereSize = params.size;

    const position = intersection.point.clone();
    rightEar.worldToLocal(position);

    console.log(params.color);
    

    const geometry = new THREE.SphereGeometry(sphereSize, 32, 32); 
    const material = new THREE.MeshStandardMaterial({ 
        color: params.color, 
        metalness: params.metalness,    
        roughness: params.shininess,  
    });

    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy(position);
    sphere.renderOrder = piercings.length; 

    piercings.push(sphere);
    rightEar.add(sphere);
}

function removePiercings() {
    piercings.forEach( function ( d ) {
        rightEar.remove( d );
    } );

    piercings.length = 0;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
	renderer.render( scene, camera );

}