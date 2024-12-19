import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById( 'container' );

let renderer, scene, camera;

init();

function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    container.appendChild( renderer.domElement );

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 2, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 120;

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

function loadEar() {
    const loader = new GLTFLoader();

    loader.load( 'models/kinda_ear.glb', function ( gltf ) {
        scene.add( gltf.scene );
    },
    undefined,
    function ( error ) {
        console.error('Error loading the GLB file:', error);
    } );
}

function animate() {
	renderer.render( scene, camera );

}