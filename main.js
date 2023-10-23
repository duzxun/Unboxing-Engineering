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
camera.position.setY(10);
camera.rotateX(-Math.PI/10)

renderer.render(scene,camera);

const geometry = new THREE.BoxGeometry(10, 10, 10, 5,5,5);
const material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe:true});
const box = new THREE.Mesh(geometry, material);
box.rotation.set(-3*Math.PI/6, 0 ,Math.PI/10);

scene.add(box);

function animate(){
    requestAnimationFrame(animate);
    box.rotation.z += 0.006;
    renderer.render(scene,camera);
}

animate();
