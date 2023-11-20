// import './styles.css'

import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

import TWEEN from '@tweenjs/tween.js'
const renderer = new THREE.WebGLRenderer({ alpha: true });
const canvasContainer = document.getElementById('canvas-container');
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
canvasContainer.appendChild(renderer.domElement);

// renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

renderer.setClearColor( 0xffffff, 1); 

const camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 1, 5000);
camera.rotation.y = 45/180*Math.PI;
camera.position.x = 2300;
camera.position.y = 0;
camera.position.z = -2500;
camera.lookAt(0,0,0);

const loaded = new THREE.TextureLoader();
loaded.load('background.jpg' , function(texture)
            {
             scene.background = texture;
             scene.background.encoding = THREE.sRGBEncoding;
            });


let zoomedin = false;
const orbit = new OrbitControls(camera, renderer.domElement);

orbit.update();

orbit.enablePan = false;

const grid = new THREE.GridHelper(30,30);
scene.add(grid);

let hlight = new THREE.AmbientLight (0x404040,100);
scene.add(hlight);

// let directionalLight = new THREE.DirectionalLight(0xffffff,100);
// directionalLight.position.set(0,1,0);
// directionalLight.castShadow = true;
// scene.add(directionalLight);

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

function tweenToClick(intersection){
    var startRotation = new THREE.Euler().copy(camera.rotation);

    camera.lookAt(intersection.point);
    var endRotation = new THREE.Euler().copy(camera.rotation);

    camera.rotation.copy(startRotation);

    new TWEEN.Tween( camera ).to( { rotation: endRotation }, 600 ).start();
}

/*function fitCameraToObject( camera, object, offset, controls ) {

    offset = offset || 1.25;

    const boundingBox = object.geometry.boundingBox;
    console.log(object.geometry.boundingBox);

    // get bounding box of object - this will be used to setup controls and camera
    const minX =  object.geometry.boundingBox.min.x;
    const maxX = object.geometry.boundingBox.max.x;

    const minY =  object.geometry.boundingBox.min.y;
    const maxY = object.geometry.boundingBox.max.y;

    const miniZ =  object.geometryo.boundingBox.min.z;
    const maxZ = object.geometry.boundingBx.max.z;



    const center =  new THREE.Vector3(object.geometry.boundingBox);

    const size = object.geometry.boundingBox.getSize();

    // get the max side of the bounding box (fits to width OR height as needed )
    const maxDim = Math.max( size.x, size.y, size.z );
    const fov = camera.fov * ( Math.PI / 180 );
    let cameraZ = Math.abs( maxDim / 4 * Math.tan( fov * 2 ) );

    cameraZ *= offset; // zoom out a little so that objects don't fill the screen

    camera.position.z = cameraZ;

    const minZ = boundingBox.min.z;
    const cameraToFar (file:///home/georgy/capstone/UnboxingEngineering/node_modules/vite/dist/node/chunks/dep-df561101.js:43993:46)
    at TransformContext.error (file:///home/georgy/capstone/UnboxingEngineering/node_modules/vite/dist/node/chunks/dep-df561101.js:43989:19)
    at TransformContext.transform (file:///home/georgy/capstone/UnboxingEngineering/node_modules/vite/dist/node/chunks/dep-df561101.js:41740:22)
    at async Object.transform (file:///home/georgy/capstone/UnboxingEngineering/node_modules/vite/dist/node/chunks/dep-df561101.js:44283:30)
    at async loadAndTransform (file:///home/georgy/capstone/UnboxingEngineering/node_modules/vite/dist/node/chunks/dep-df561101.js:54950:29)
    at async viteTransformMiddrEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;
}*/

function hide(object, targetObject){
    if (object.children.length == 0){
        if (object != targetObject){
            object.visible = false
            return;
        }
    }else{
        for(let i = 0; i < object.children.length; i++){
            if (object.children[i] != targetObject){
                hide(object.children[i], targetObject)
                object.visible = false;
                return;
            } 
        }
    }
}

function unhide(object){
    if (object.children.length == 0){
            console.log(object)
            object.visible = true
        
    }else{
        console.log(object.children.length)
        for(let i = 0; i < object.children.length; i++){
            unhide(object.children[i])
            object.visible = true;
            return;
        }
    }
}

let clickedObject = new THREE.Object3D();
function onClick(event) {
  // Calculate mouse coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections
  const intersects = raycaster.intersectObjects(model.children, true);

  if (intersects.length > 0 && intersects[0].object.visible && !zoomedin) {
    // clickedObject = intersects[0].object;
    clickedObject.copy(intersects[0].object.parent, true)
    console.log(clickedObject);
    console.log('Clicked on:', clickedObject.name);
    camera.lookAt(mouse.x, mouse.y, 0);
    //tweenToClick(intersects[0]);
    hide(model.children[0], clickedObject);
    clickedObject.rotateX(-Math.PI*1/2)
    clickedObject.frustumCulled = true;
    clickedObject.scale.set(50,50,50);
    clickedObject.translateZ(-300);
      scene.add(clickedObject);
    console.log(clickedObject);

      for (var i = 1; i <= 2; i++) {
          var div = document.createElement("div");
          div.className = "info-column"; // Add the "info-column" class for styling
          div.textContent = "Column " + (i + 1); // Set content (you can add your own content here)
          document.body.appendChild(div);
      }

      renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);

      const newWidth = canvasContainer.clientWidth;
      const newHeight = canvasContainer.clientHeight;

      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;

      camera.updateProjectionMatrix();
      zoomedin = true;
  }
}

document.addEventListener('mousemove', onMouseMove);
let highlighted = 0;
let oldparent = new THREE.Object3D();
var popup = document.createElement("div");
popup.className = "main-popup";
document.body.appendChild(popup);

function onMouseMove(event) {
    // Calculate mouse coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections
    const intersects = raycaster.intersectObjects(model.children, true);

    if (intersects.length > 0 && !zoomedin) {
        // handle the popup
        const position = intersects[0].point.clone().project(camera);
        const x = (position.x + 1) / 2 * window.innerWidth;
        const y = -(position.y - 1) / 2 * window.innerHeight;
        popup.style.display = 'block';
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
        popup.innerHTML = intersects[0].object.parent.name.replace(/_/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase());
        if (intersects[0].object.parent != highlighted) {
            if (highlighted != 0) {
                highlighted.children.forEach(function(child) {
                    child.material.emissive.setHex(0x000000)
                })
            }


            oldparent.copy(intersects[0].object.parent, true)
            highlighted = intersects[0].object.parent;
            highlighted.children.forEach(function(child) {

                let newmat = child.material.clone()
                if (child.material.map != null) {
                    let newmap = child.material.map.clone()
                    child.material.map = newmap;
                } else {
                    child.material.map = null;
                }
                child.material = newmat;

                child.material.emissive.setHex(0x555555);
            })
    }
    } else if (highlighted != 0) {
        highlighted.children.forEach(function(child) {
            child.material.emissive.setHex(0x000000)
        })
        popup.style.display = 'none';
    }
} 


document.addEventListener('keydown', function(event) {
    // Check if Ctrl (or Command on Mac) and 'Z' key are pressed
    if (zoomedin) { 
        if (event.ctrlKey || event.metaKey) {
            if (event.key === 'z' || event.key === 'Z') {

                scene.remove(clickedObject);
                // Your Ctrl+Z key press logic here
                zoomedin = false;

                var cols = document.getElementsByClassName("info-column");
                var colsArr = Array.from(cols)
                colsArr.forEach(function(col) {
                    col.remove()
                });

                unhide(scene.children[2])

                renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);

                const newWidth = canvasContainer.clientWidth;
                const newHeight = canvasContainer.clientHeight;

                renderer.setSize(newWidth, newHeight);
                camera.aspect = newWidth / newHeight;

                clickedObject = new THREE.Object3D();

                camera.updateProjectionMatrix();
            }
        }
    }
});

let loader = new GLTFLoader();
loader.load('models/iphone12_less_parts/iphone12_less_parts.glb', function(gltf){
    model = gltf.scene;
    model.children[0].scale.set(4600,4600,4600);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;

    clips.forEach(function(clip) {
        const action = mixer.clipAction(clip);
        action.repetitions = 1;
        action.play();
    })
    model.traverse( function( object ) {

        object.frustumCulled = false;

    } );

    model.translateY(-300);
    scene.add(model);
    renderer.domElement.addEventListener('click', onClick);
})

const clock = new THREE.Clock();
// let clock;
let elapsed = 0
let curr = 0;
let stoptime = 19

function animate() {
    if(mixer) {
        curr = clock.getDelta()
        elapsed += curr;
        if (elapsed < stoptime) {
            mixer.update(curr);
        }
    }
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// window.addEventListener('resize', function() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// })

window.addEventListener('resize', () => {
    const newWidth = canvasContainer.clientWidth;
    const newHeight = canvasContainer.clientHeight;

    renderer.setSize(newWidth, newHeight);
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
});
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
