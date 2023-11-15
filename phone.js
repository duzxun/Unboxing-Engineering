// import './styles.css'

import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 1, 5000);
camera.rotation.y = 45/180*Math.PI;
camera.position.x = 1100;
camera.position.y = 400;
camera.position.z = 1100;

scene.background = new THREE.Color(0xdddddd);

const orbit = new OrbitControls(camera, renderer.domElement);

orbit.update();

const grid = new THREE.GridHelper(30,30);
scene.add(grid);

let hlight = new THREE.AmbientLight (0x404040,100);
scene.add(hlight);

let directionalLight = new THREE.DirectionalLight(0xffffff,100);
directionalLight.position.set(0,1,0);
directionalLight.castShadow = true;
scene.add(directionalLight);

// let light = new THREE.PointLight(0xc4c4c4,10);
// light.position.set(0,300,500);
// scene.add(light);
//
// let light2 = new THREE.PointLight(0xc4c4c4,10);
// light2.position.set(500,100,0);
// scene.add(light2);
//
// let light3 = new THREE.PointLight(0xc4c4c4,10);
// light3.position.set(0,100,-500);
// scene.add(light3);
//
// let light4 = new THREE.PointLight(0xc4c4c4,10);
// light4.position.set(-500,300,500);
// scene.add(light4);

let mixer;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let model;
function onClick(event) {
  // Calculate mouse coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections
  const intersects = raycaster.intersectObjects(model.children, true);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    console.log('Clicked on:', clickedObject.userData.name);
  }
}

let loader = new GLTFLoader();
loader.load('models/iphone12_less_parts/iphone12_less_parts.glb', function(gltf){
    model = gltf.scene;
    let phone = gltf.scene.children[0];
    phone.scale.set(4600,4600,4600);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;

    clips.forEach(function(clip) {
        const action = mixer.clipAction(clip);
        action.play();
    })

    scene.add(model);
    renderer.domElement.addEventListener('click', onClick);
})

const clock = new THREE.Clock();
function animate() {
    if(mixer) {
        mixer.update(clock.getDelta());
    }
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

// let scene = new THREE.Scene();
// scene.background = new THREE.Color(0xdddddd);
//
// let camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,1,5000);
// camera.rotation.y = 45/180*Math.PI;
// camera.position.x = 1100;
// camera.position.y = 400;
// camera.position.z = 1100;
//
// let renderer = new THREE.WebGLRenderer({antialias:true});
// renderer.setSize(window.innerWidth,window.innerHeight);
// document.body.appendChild(renderer.domElement);
//
// let hlight = new THREE.AmbientLight (0x404040,100);
// scene.add(hlight);
//
// let directionalLight = new THREE.DirectionalLight(0xffffff,100);
// directionalLight.position.set(0,1,0);
// directionalLight.castShadow = true;
// scene.add(directionalLight);
//
// let light = new THREE.PointLight(0xc4c4c4,10);
// light.position.set(0,300,500);
// scene.add(light);
//
// let light2 = new THREE.PointLight(0xc4c4c4,10);
// light2.position.set(500,100,0);
// scene.add(light2);
//
// let light3 = new THREE.PointLight(0xc4c4c4,10);
// light3.position.set(0,100,-500);
// scene.add(light3);
//
// let light4 = new THREE.PointLight(0xc4c4c4,10);
// light4.position.set(-500,300,500);
// scene.add(light4);
//
// function animate() {
//     renderer.render(scene,camera);
//     requestAnimationFrame(animate);
//     car.rotation.z += 0.01;
// }
//
// let loader = new GLTFLoader();
// let car;
// loader.load('models/testing/test.glb', function(gltf){
//   car = gltf.scene.children[0];
//   console.log(gltf.scene.children.length);
//
//   car.scale.set(4600,4600,4600);
//   if (car) car.rotation.y += 0.01;
//   scene.add(gltf.scene);
//   animate();
// });
