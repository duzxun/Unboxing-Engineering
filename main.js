import './styles.css'

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene,camera);

const geometry = new THREE.BoxGeometry(10, 10, 10, 5,5,5);
const material = new THREE.MeshBasicMaterial({color: 0x3343A3, wireframe:true});
const box = new THREE.Mesh(geometry, material);

scene.add(box);

function animate(){
    requestAnimationFrame(animate);
    box.rotation.x += 0.006;
    box.rotation.y += 0.001;
    box.rotation.z += 0.006;
    renderer.render(scene,camera);
}

animate();