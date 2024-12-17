import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 2).normalize();
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Store reference to the loaded model
let earModel;

// Load the GLB file
const loader = new GLTFLoader();
loader.load(
    'models/kinda_ear.glb', // Path to your file
    (gltf) => {
        earModel = gltf.scene; // Store the loaded model in the earModel variable
        earModel.scale.set(0.7, 0.7, 0.7); // Scale the model
        scene.add(earModel); // Add the model to the scene
        console.log('Model loaded:', gltf);
    },
    undefined,
    (error) => {
        console.error('Error loading the GLB file:', error);
    }
);

// Mouse position
const mouse = { x: 0, y: 0 };

// Event listener for mouse movement
window.addEventListener('mousemove', (event) => {
    // Normalize mouse coordinates (-1 to +1 range)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (event.clientY / window.innerHeight) * 2 + 1;

    // Rotate the ear model if it's loaded
    if (earModel) {
        earModel.rotation.y = mouse.x * Math.PI * 0.7; // Rotate horizontally (limited)
        earModel.rotation.x = mouse.y * Math.PI * 0.7; // Rotate vertically (limited)
    }
});

// Position the Camera
camera.position.z = 2;

// Render Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Handle Window Resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});