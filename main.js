import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const container = document.getElementById( 'container' );

let renderer, scene, camera;
let testEar, leftEar;

init();

function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    container.appendChild( renderer.domElement );

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 2, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 100;

    const controls = new OrbitControls( camera, renderer.domElement );
	controls.minDistance = 50;
	controls.maxDistance = 200;

    scene.add( new THREE.AmbientLight( 0x666666 ) );

    const dirLight1 = new THREE.DirectionalLight( 0xffddcc, 3 );
    dirLight1.position.set( 1, 0.75, 0.5 );
    scene.add( dirLight1 );

    const dirLight2 = new THREE.DirectionalLight( 0xccccff, 3 );
    dirLight2.position.set( - 1, 0.75, - 0.5 );
    scene.add( dirLight2 );

    loadEar();

}

//
// LOADING FUNCTIONS
//

function loadEar() {
    const loader = new GLTFLoader();

    const testTex = new THREE.TextureLoader().load('testing_ear.jpg');
    testTex.colorSpace = THREE.SRGBColorSpace;

    loader.load('testing_ear.glb', function (gltf) {
        testEar = gltf.scene;

        testEar.material = new THREE.MeshBasicMaterial( { map: testTex } );

        /*testEar.traverse((child) => {
            if (child.isMesh) {
                child.material.map = testTex;
                child.material.needsUpdate = true;
            }
        });*/

        // Setting the model's position, so it looks decent upon start up
        testEar.scale.set(0.7, 0.7, 0.7); 
        testEar.rotation.y = THREE.MathUtils.degToRad(210); 

        scene.add(testEar);
        console.log('Ear model loaded successfully!');
    },
    undefined,
    function (error) {
        console.error('Error loading the GLTF file:', error);
    });
}

function animate() {
	renderer.render( scene, camera );

}