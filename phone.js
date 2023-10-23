import './styles.css'

import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

let camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,1,5000);
camera.rotation.y = 45/180*Math.PI;
camera.position.x = 1000;
camera.position.y = 400;
camera.position.z = 1000;

let renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

let hlight = new THREE.AmbientLight (0x404040,100);
scene.add(hlight);

let directionalLight = new THREE.DirectionalLight(0xffffff,100);
directionalLight.position.set(0,1,0);
directionalLight.castShadow = true;
scene.add(directionalLight);

let light = new THREE.PointLight(0xc4c4c4,10);
light.position.set(0,300,500);
scene.add(light);

let light2 = new THREE.PointLight(0xc4c4c4,10);
light2.position.set(500,100,0);
scene.add(light2);

let light3 = new THREE.PointLight(0xc4c4c4,10);
light3.position.set(0,100,-500);
scene.add(light3);

let light4 = new THREE.PointLight(0xc4c4c4,10);
light4.position.set(-500,300,500);
scene.add(light4);

function animate() {
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
    car.rotation.z += 0.01;
}

let loader = new GLTFLoader();
let car;
loader.load('models/testing/test.glb', function(gltf){
  car = gltf.scene.children[0];
  console.log(gltf.scene.children.length);

  car.scale.set(5000,5000,5000);
  if (car) car.rotation.y += 0.01;
  scene.add(gltf.scene);
  animate();
});
