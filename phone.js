// import './styles.css'

import * as THREE from 'three';

import * as VIEWER from './viewer.js'

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

import TWEEN from '@tweenjs/tween.js'

let opt = {
    cameraPosition: null,
    kiosk: false,
    model: "",
    preset: ""
}



window.VIEWER={}
let viewer = new VIEWER.Viewer(document.getElementById('canvas-container'), opt); 
let scene;

scene = viewer.scene;
const camera = viewer.defaultCamera
let clickedObject = new THREE.Object3D();
let navBarElements = [];
let zoomedin = false;


const renderer = viewer.renderer;
renderer.setClearColor(0x000000, 0)
const canvasContainer = document.getElementById('canvas-container');
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
renderer.domElement.addEventListener('click', onClick);

// Function to close the global purpose pop-up and run the tutorial
function closePopupTut() {
    document.getElementById('overlay').style.display = 'none';
    viewer.load("").then( () => { viewer.playAllClips()  
        const light1 = new THREE.AmbientLight("#FFFFFF", 5);
        light1.name = 'ambient_light';
        scene.add(light1);
    
        const light2 = new THREE.DirectionalLight("#FFFFFF", 0.8);
        light2.position.set(0.5, 0, 0.866); // ~60º
        light2.name = 'main_light';
        scene.add(light2);
        const light3 = new THREE.DirectionalLight("#FFFFFF", 0.8);
        light3.position.set(-0.5, 0, 0.866); // ~60º
        light3.name = 'main_light2';
        scene.add(light3);
    
        scene.background = null 
        viewer.defaultCamera.rotation.x = -2.73382;
        viewer.defaultCamera.rotation.y = 0.84599;
        viewer.defaultCamera.rotation.z = 2.8288;
        viewer.defaultCamera.position.x = 0.3624;
        viewer.defaultCamera.position.y = 0.12729;
        viewer.defaultCamera.position.z = -0.29466;
        // viewer.defaultCamera.near = 10;
        viewer.defaultCamera.lookAt(0,0,0);
        viewer.defaultCamera.updateProjectionMatrix()
        progressTutorial();
    }) 
}

// Function to close the global purpose pop-up and go to the main learning space
function closePopupMain() {
    document.getElementById('overlay').style.display = 'none'; 
    viewer.load("").then( () => { viewer.playAllClips()  
        const light1 = new THREE.AmbientLight("#FFFFFF", 5);
        light1.name = 'ambient_light';
        scene.add(light1);
    
        const light2 = new THREE.DirectionalLight("#FFFFFF", 0.8);
        light2.position.set(0.5, 0, 0.866); // ~60º
        light2.name = 'main_light';
        scene.add(light2);
        const light3 = new THREE.DirectionalLight("#FFFFFF", 0.8);
        light3.position.set(-0.5, 0, 0.866); // ~60º
        light3.name = 'main_light2';
        scene.add(light3);
    
        scene.background = null 
        viewer.defaultCamera.rotation.x = -2.73382;
        viewer.defaultCamera.rotation.y = 0.84599;
        viewer.defaultCamera.rotation.z = 2.8288;
        viewer.defaultCamera.position.x = 0.3624;
        viewer.defaultCamera.position.y = 0.12729;
        viewer.defaultCamera.position.z = -0.29466;
        // viewer.defaultCamera.near = 10;
        viewer.defaultCamera.lookAt(0,0,0);
        viewer.defaultCamera.updateProjectionMatrix()
    });
    viewer.inTutorial=false; 
}

// Global Purpose pop up functions, path_to_template is string path to template:
function showPopup(path_to_template) {
    //grab the overlay object and make it visible
    document.getElementById('overlay').style.display = 'flex';
    
    //thing popup content is being added to
    let popup_inner = document.getElementById('popup-inner');
    htmx.ajax("GET", path_to_template, {target: popup_inner, swap: "overlay"}).then(() => {
        //if this is the global pop-up, attach both the close and go to tutorial and skip tutorial
        //button events
        if(path_to_template == "/htmx-templates/global_pop_initial.html"){
            document.getElementById('runTut').addEventListener("click", closePopupTut);
            document.getElementById('skipTut').addEventListener("click", closePopupMain);
        }else{
            document.getElementById('global-close').addEventListener("click", closePopupMain);
        }
    });
}

// canvasContainer.appendChild(renderer.domElement);

// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// const camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 1, 5000);

let camera_state = new THREE.PerspectiveCamera();

const orbit = viewer.controls
orbit.update();
orbit.enablePan = false;
// orbit.minDistance= 3;
// orbit.maxDistance = 3500;
orbit.autoRotate = true;



// Show the pop-up when the window loads
window.onload = showPopup("/htmx-templates/global_pop_initial.html");

function addTutorialNextButton() {
    var button = document.createElement("button");
    button.innerHTML = "Next!";

    // Set an id for the button
    button.id = "tut-button";

    button.classList.add("popup-button");
    button.style.bottom = "10px"
    button.style.right = "10px"
    button.style.padding = "10px"
    // Get the container div
    var container = document.getElementById("tutorial-popup");

    // Add the onclick
    button.addEventListener("click", () => {
        progressTutorial()
    })

    // Append the button to the container
    container.appendChild(button);
}

// Tutorial functionality, uses global TutorialCounter to request the right files
var TutorialCounter = 0;
function progressTutorial() {
    console.log("----------------------------")
    console.log(TutorialCounter)
    console.log("----------------------------")

    // If no popup exists, want to create it
    var popup = document.getElementById("tutorial-popup")
    if (!document.getElementById("tutorial-popup")) {
        // Create a new div element for the popup
        var popup = document.createElement('div');
        popup.id = "tutorial-popup"

        // Set the popup content and style
        popup.style.position = 'fixed';
        popup.style.top = '10' + 'px';
        popup.style.left = '10' + 'px';
        popup.style.padding = '10px';
        popup.style.backgroundColor = '#f0f0f0';
        popup.style.border = '1px solid #ccc';
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '1000';
        popup.style.boxSizing = 'border-box';
        // popup.style.width = "25%"
        // popup.style.height = "15%"
        popup.style.maxWidth = "25%"
        document.body.appendChild(popup);
    }

    // The message is always updated, using the fixed tutorial htmx templates,
    // increasing by 1
    // popup.innerHTML = "testing";
    fetch("htmx-templates/tutorial/"+String(TutorialCounter)+".html")
        .then(response => response.text())
        .then(htmlContent => {
            // Set the fetched HTML content as the innerHTML of the popup
            popup.innerHTML = htmlContent;
        })
    TutorialCounter += 1;
}



var mouseDown = false
renderer.domElement.addEventListener('mousedown', () => {
    mouseDown = true
});
renderer.domElement.addEventListener('mouseup', () => {
    mouseDown = false
})
renderer.domElement.addEventListener('wheel', () => {
    if(TutorialCounter == 2) {
        addTutorialNextButton();
    }
})


// const grid = new THREE.GridHelper(0,0);
// scene.add(grid);
//
// let hlight = new THREE.AmbientLight (0x404040,150);
// scene.add(hlight);

let mixer;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let model = scene;

let loader = new GLTFLoader();

class navBarElement{
    constructor(name, icon, exists, content = ``, img=null){
        this.name = name;
        this.icon = icon;
        this.exists = exists;
        this.content = content;
        this.img = img;
    }
}

console.log(scene)

const autoRotateTimeout = 10000;
// Beginning of Georgy trying to do dynamic loading with HTMX
const listOfNavBarElements = []
function navSetup(){
    listOfNavBarElements.push(new navBarElement("Chemical", "fa-flask"));
    listOfNavBarElements.push(new navBarElement("Civil", "fa-drafting-compass"));
    listOfNavBarElements.push(new navBarElement("Computer", "fa-desktop"));
    listOfNavBarElements.push(new navBarElement("Electrical", "fa-microchip"));
    listOfNavBarElements.push(new navBarElement("Industrial", "fa-chart-line"));
    listOfNavBarElements.push(new navBarElement("Materials", "fa-atom"));
    listOfNavBarElements.push(new navBarElement("Mechanical", "fa-cogs"));
    listOfNavBarElements.push(new navBarElement("Mineral", "fa-gem"));
}
navSetup()

var tmpA = []

var partsMapOfAvailableEngineering = {}

// Order of navbar elements is guaranteed, so define which to display
// Order can be seen in navSetup
// Chemical, Civil, Computer, Electrical, Industrial, Materials, Mechanical, Mineral
const disciplines = [
    'Chemical',
    'Civil',
    'Computer',
    'Electrical',
    'Industrial',
    'Materials',
    'Mechanical',
    'Mineral'
];
var currentlySelectedDiscipline = ""

// Have to hard code which disciplines are enabled for which part :)
partsMapOfAvailableEngineering["Battery"] = [true,true,true,true,true,true,true,false]
partsMapOfAvailableEngineering["Screen"] = [true,true,true,true,true,true,true,true]
partsMapOfAvailableEngineering["Wireless_Charging_Coil"] = [true,true,true,true,true,true,true,true]
partsMapOfAvailableEngineering["Chassis"] = [true,true,true,true,true,true,true,true]
partsMapOfAvailableEngineering["Front_Sensors"] = [true,true,true,true,true,true,true,true]
partsMapOfAvailableEngineering["Back_Cameras"] = [true,true,true,true,true,true,true,true]
partsMapOfAvailableEngineering["Vibration_Motor"] = [true,true,true,true,true,true,true,true]
partsMapOfAvailableEngineering["Microphone"] = [true,true,true,true,true,true,true,true]
partsMapOfAvailableEngineering["Earspeaker"] = [true,true,true,true,true,true,true,true]
partsMapOfAvailableEngineering["Front_Camera"] = [true,true,true,true,true,true,true,true]
partsMapOfAvailableEngineering["Volume_Off_Button"] = [true,true,true,true,true,true,true,true]
partsMapOfAvailableEngineering["Volume_Buttons"] = [true,true,true,true,true,true,true,true]
partsMapOfAvailableEngineering["Charging_Port"] = [true,true,true,true,true,true,true,true]
partsMapOfAvailableEngineering["Antenna"] = [true,true,true,true,true,true,true,true]
partsMapOfAvailableEngineering["Simholder"] = [true,true,true,true,true,true,true,true]
partsMapOfAvailableEngineering["Motherboard"] = [true,true,true,true,true,true,true,true]
partsMapOfAvailableEngineering["iPhone Box"] = [true,true,true,true,true,true,true,true]
// End of Georgy trying to do dynamic loading with HTMX


class objectContent{
    constructor(name, elements){
        this.name = name;
        this.elements = elements;
    }
}

function batteryContent(){
    let disciplineElements = []
    disciplineElements.push(new navBarElement("Chemical", "fa-flask", true,
        `Battery Chemistry: Chemical engineers are involved in selecting and 
        optimizing the chemical composition of the battery cells. They work to 
        improve energy density, lifespan, and safety of the battery through 
        advancements in battery chemistry.<br><br> Over time, a lithium-ion battery's 
        ability to hold a charge decreases. This is a natural part of the aging
        process for these batteries. However, advancements in battery technology 
        and careful usage can help prolong the overall lifespan of the battery.<br><br>
        Facility Design: Chemical engineers are involved in designing the layout of 
        battery manufacturing plants. They ensure that the facilities are optimized
        for efficient production, taking into account factors like workflow, safety 
        regulations, and environmental considerations.`, `https://www.vecteezy.com/vector-art
        /7003741-battery-lifetime-rgb-color-icon-accumulator-lifespan-and-durability-energy-cell-
        working-period-charge-and-discharge-cycles-number-isolated-vector-illustration-simple-
        filled-line-drawin` ));
    disciplineElements.push(new navBarElement("Civil", "fa-drafting-compass", true, `Manufacturing 
        Facilities: Civil engineers may be involved in the construction and layout of manufacturing
        facilities where the battery is produced. They ensure that the infrastructure meets
        safety standards and supports efficient production processes.`, ""));
    disciplineElements.push(new navBarElement("Computer", "fa-desktop" , true, `Embedded Systems: 
        Computer engineers are responsible for designing and implementing embedded systems within 
        the battery and the overall device. This includes programming the microcontrollers and 
        ensuring communication between the battery and other device components.`, `/diagrams/battery/comp_eng.webp`));
    disciplineElements.push(new navBarElement("Electrical", "fa-microchip", true, `Design of Battery 
        Management System (BMS): Electrical engineers play a crucial role in designing the Battery Management 
        System, which monitors and controls the charging and discharging of the battery to ensure safety and 
        efficiency.`, ""));
    disciplineElements.push(new navBarElement("Industrial", "fa-chart-line", true, `Process Optimization: Industrial 
        engineers work on optimizing the manufacturing processes involved in producing the battery. This includes 
        streamlining assembly lines, improving efficiency, minimizing waste and optimizing costs in the production 
        process.`, "/diagrams/battery/indy.jpg"));
    disciplineElements.push(new navBarElement("Materials", "fa-atom", true, `Material Selection:
        Materials engineers focus on selecting the appropriate materials for various components of 
        the battery, such as the electrodes and electrolytes, considering factors like conductivity, 
        durability, and weight.`, "/diagrams/battery/material.jpg"));
    disciplineElements.push(new navBarElement("Mechanical", "fa-cogs", true, `Enclosure Design: Mechanical 
        engineers contribute to the design of the iPhone 12's overall structure and housing, ensuring that the 
        battery fits securely within the device while also considering factors like heat dissipation and 
        weight distribution.`, "/diagrams/battery/mech.webp"));
    disciplineElements.push(new navBarElement("Mineral", "fa-gem", false));
    return disciplineElements;
}

let batteryStuff = batteryContent();
let batteryInfo = new objectContent("battery", batteryStuff);

// let directionalLight = new THREE.DirectionalLight(0xffffff,100);
// directionalLight.position.set(0,1,0);
// directionalLight.castShadow = true;
// scene.add(directionalLight);
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

//Used to setup navbar list that can be iterated through
function setupNav(){
    navBarElements.push(new navBarElement("Chemical", "fa-flask"));
    navBarElements.push(new navBarElement("Civil", "fa-drafting-compass"));
    navBarElements.push(new navBarElement("Computer", "fa-desktop"));
    navBarElements.push(new navBarElement("Electrical", "fa-microchip"));
    navBarElements.push(new navBarElement("Industrial", "fa-chart-line"));
    navBarElements.push(new navBarElement("Materials", "fa-atom"));
    navBarElements.push(new navBarElement("Mechanical", "fa-cogs"));
    navBarElements.push(new navBarElement("Mineral", "fa-gem"));
}

function tweenToClick(intersection){
    var startRotation = new THREE.Euler().copy(camera.rotation);

    camera.lookAt(intersection.point);
    var endRotation = new THREE.Euler().copy(camera.rotation);

    camera.rotation.copy(startRotation);

    new TWEEN.Tween( camera ).to( { rotation: endRotation }, 600 ).start();
}

function enableAutoRotate(){
    orbit.autoRotate = true;
}
// function showPopup(message) {
//     // Create a new div element for the popup
//     var popup = document.createElement('div');
//     popup.id = "tutorial-popup"
//
//     // Set the popup content and style
//     popup.innerHTML = message;
//     popup.style.position = 'fixed';
//     popup.style.top = '10' + 'px';
//     popup.style.left = '10' + 'px';
//     popup.style.padding = '10px';
//     popup.style.backgroundColor = '#f0f0f0';
//     popup.style.border = '1px solid #ccc';
//     popup.style.borderRadius = '5px';
//     popup.style.zIndex = '1000';
//
//     // Append the popup to the body
//     document.body.appendChild(popup);
//
// }
//
// showPopup("Testing!");

/*      HIDING AND UNHIDING PIECES      */

    // function that hides an object that has been clicked on recursively
function hide(object, targetObject){
    // base case that checks whether we've reached the end of component tree
    if (object.children.length == 0){
        // if this object isn't the object clicked on, hide it
        if (object != targetObject){
            object.visible = false
            return;
        }
        // recursive case that runs through all the children of a component and
        // recursively calls hide
    }else{
        for(let i = 0; i < object.children.length; i++){
            if (object.children[i] != targetObject){
                // call hide on the child of this component
                hide(object.children[i], targetObject)
                object.visible = false;
                return;
            } 
        }
    }
}

// function that unhides an object recursively
function unhide(object){
    // base case that checks whether we've reached the end of the component tree
    if (object.children.length == 0){
        console.log(object)
        // make the component visible again
        object.visible = true

    }else{
        console.log(object.children.length)
        // recursive case that runs through all the children of a component
        // and recursively unhides them
        for(let i = 0; i < object.children.length; i++){
            unhide(object.children[i])
            object.visible = true;
            return;
        }
    }
}

/*      MAIN FUNCTIONS      */

    async function onClick(event) {
        if (viewer.inTutorial && TutorialCounter < 3) return;
        // Calculate mouse coordinates
        // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        // mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        orbit.autoRotate = false;
        setTimeout(enableAutoRotate, autoRotateTimeout);
        let canvas = document.querySelector('canvas');
        mouse.x = (event.offsetX / canvas.clientWidth) * 2 - 1;
        mouse.y = -(event.offsetY / canvas.clientHeight) * 2 + 1;

        // Update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // Check for intersections
        const intersects = raycaster.intersectObjects(model.children, true);

        console.log(intersects)

        if (intersects.length > 0 && intersects[0].object.visible && !zoomedin) {
            camera_state.copy(camera, true);
            // clickedObject = intersects[0].object;
            // clickedObject.copy(intersects[0].object.parent, true)
            if (!viewer.inTutorial) {
                clickedObject.copy(intersects[0].object.parent, true)
            } else {
                if (!intersects[0].object.parent.name.includes("Container")) return;
                clickedObject.copy(intersects[0].object.parent, true)
                clickedObject.name = "iPhone Box"
                clickedObject.rotation.x += Math.PI / 2;
                if (TutorialCounter == 3) {
                    addTutorialNextButton()
                }
            }

            console.log('Clicked on:', clickedObject.name);

            //tweenToClick(intersects[0]);
            if(!viewer.inTutorial) {
                hide(model.children[1], clickedObject);
            } else {
                hide(model.children[1], clickedObject);
            }
            popup.style.display = 'none';
            // console.log(model)
            clickedObject.rotateX(-Math.PI*1/2)
            clickedObject.frustumCulled = true;
            clickedObject.scale.set(0.1,0.1,0.1);

            const boundingBox = new THREE.Box3().setFromObject(clickedObject)
            const center = new THREE.Vector3()
            boundingBox.getCenter(center)
            clickedObject.position.sub(center)

            const boundingSphere = boundingBox.getBoundingSphere(new THREE.Sphere());
            const cameraDistance = boundingSphere.radius / Math.tan(Math.PI * 0.75 / 2); // Adjust the FOV (0.75 is used as an example)

            camera.position.copy(boundingSphere.center.clone().add(new THREE.Vector3(0, 0, cameraDistance)));
            camera.lookAt(boundingSphere.center);
            camera.updateProjectionMatrix();

            // clickedObject.translateZ(-0.1);
            console.log(clickedObject)
            // clickedObject.position.set(0,0,0)
            // clickedObject.translateZ(-0.6);
            scene.add(clickedObject);
            console.log(scene)

            // camera.lookAt(clickedObject.getWorldPosition);
            console.log(clickedObject.position)

            // tempLight = new THREE.AmbientLight(0x404040)
            // scene.add(tempLight)
            tmpA.push(clickedObject.name)
            // console.log(tmpA)

                var div = document.createElement("div");
                div.className = "info-column"; // Add the "info-column" class for styling
                var child = document.createElement("div");
                var navBar = document.createElement("div");
                navBar.className = "navbar";

                var navBarList = document.createElement("ul");  
                navBar.setAttribute("id", "navBar")
                child.appendChild(navBar)

                // Get the navbar using a GET request, replace it in-place
                htmx.ajax("GET", "/htmx-templates/navbar.html", {target: navBar, swap: "outerHTML"} ).then(() => {

                    // Now configure which icons are available for which parts
                    let iconList = document.getElementById("navbar-labels")
                    let liList = iconList.getElementsByTagName("li")

                    for (let i = 0; i < liList.length; i++) {
                        let listElement = liList[i]
                        if(i == 0){
                            let icon = listElement.getElementsByTagName("i")[0];
                            icon.title = "Description" ;
                            icon.addEventListener('click', function(event) {
                                // Replace the info-box title with the contents of the title of the icon
                                console.log(event.target)
                                let title = document.getElementById("title")
                                title.innerHTML = clickedObject.name + ": " + event.target.title

                                currentlySelectedDiscipline = event.target.title.split(" ")[0]

                                // Replace the content in the info-box with new content via HTMX ajax GET request
                                let textBox = document.getElementById("info-content") 
                                htmx.ajax("GET", "/htmx-templates/" + clickedObject.name + "/" + currentlySelectedDiscipline + ".html", {target: textBox, swap: "innerHTML"})

                                // Replace the img tag with the associated img
                                let imgBox = document.getElementById("diagram")
                                imgBox.setAttribute("src", "/diagrams/" + clickedObject.name + "/" + currentlySelectedDiscipline + "-image.jpg")
                                // htmx.ajax("GET", "/htmx-templates/" + clickedObject.name + "/" + currentlySelectedDiscipline + "-image.html", {target: imgBox, swap: "innerHTML"})
                            });
                        }
                        if (partsMapOfAvailableEngineering[clickedObject.name][i-1] == false) {
                            listElement.remove()
                        } else if (i > 0) {
                            let icon = listElement.getElementsByTagName("i")[0]
                            icon.title = disciplines[i-1] + " Engineering"
                            icon.addEventListener('click', function(event) {
                                // Replace the info-box title with the contents of the title of the icon
                                console.log(event.target)
                                let title = document.getElementById("title")
                                title.innerHTML = clickedObject.name + ": " + event.target.title

                                currentlySelectedDiscipline = event.target.title.split(" ")[0]

                                // Replace the content in the info-box with new content via HTMX ajax GET request
                                let textBox = document.getElementById("info-content") 
                                htmx.ajax("GET", "/htmx-templates/" + clickedObject.name + "/" + currentlySelectedDiscipline + ".html", {target: textBox, swap: "innerHTML"})

                                // Replace the img tag with the associated img
                                let imgBox = document.getElementById("diagram")
                                imgBox.setAttribute("src", "/diagrams/" + clickedObject.name + "/" + currentlySelectedDiscipline + "-image.jpg")
                                // htmx.ajax("GET", "/htmx-templates/" + clickedObject.name + "/" + currentlySelectedDiscipline + "-image.html", {target: imgBox, swap: "innerHTML"})
                            });
                        }
                    }
                })

                var info = document.createElement("div");
                info.className = "info-block";

                var title = document.createElement("div");
                title.className = "info-title";
                title.id = "title";
                title.innerHTML = "What is a " + clickedObject.name + "?"

                var content = document.createElement("div");
                content.className = "info-content";
                content.id = "info-content";

                info.appendChild(title);

                // Make an HTMX request to dynamically fill in the title of the default page
                info.appendChild(content)


                child.appendChild(info);
                let closer = document.createElement("button");
                closer.id = "X";
                closer.className = "X"
                closer.innerHTML = "X";
                closer.onclick = function(){
                    if (zoomedin) { 
                        var maxLighting = 2
                        // function deleteExcessLighting(object, parent) {
                        //     if (object instanceof THREE.Light) {
                        //         console.log('Light:', object);
                        //         index+=1;
                        //         console.log(index)
                        //         if (index > maxLighting) {
                        //             console.log("IWMNEF LIKOJHUWEGRFKOLJHWEGRF")
                        //             parent.remove(object)
                        //         }
                        //     }
                        //
                        //     if (object.children) {
                        //         object.children.forEach(function(child) {
                        //             deleteExcessLighting(child, object)
                        //         })
                        //     }
                        // }
                        //
                        // deleteExcessLighting(scene)

                        // console.log(camera.children)
                        // for (let index = 0; index < camera.children.length; index++) {
                        //     if (index > maxLighting) {
                        //         camera.remove(camera.children[index])
                        //         children[index].dispose()
                        //         console.log("QWREWSDFIYHSDKF")
                        //     }
                        // }

                        camera.copy(camera_state, true);
                        scene.remove(clickedObject);
                        // Your Ctrl+Z key press logic here
                        zoomedin = false;

                        var cols = document.getElementsByClassName("info-column");
                        var colsArr = Array.from(cols)
                        colsArr.forEach(function(col) {
                            col.remove()
                        });

                        unhide(scene.children[1])
                        // scene.remove(tempLight)

                        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);

                        const newWidth = canvasContainer.clientWidth;
                        const newHeight = canvasContainer.clientHeight;

                        renderer.setSize(newWidth, newHeight);
                        camera.aspect = newWidth / newHeight;

                        clickedObject = new THREE.Object3D();

                        camera.updateProjectionMatrix();
                        console.log(scene)
                    }
                };
                child.appendChild(closer);
            child.className = "info-container";
            div.appendChild(child);
            document.body.appendChild(div);

                // // TODO: WAITING FOR DEVS TO FIX LOST REQUEST :(
                // htmx.ajax("GET", "/htmx-templates/" + clickedObject.name + "/Default-image.html", {target: imgElem, swap: "innerHTML", source: imgElem})

                // For now fix with another hx-get inside of the content to replace the image ;)
                let contentElem = document.getElementById("info-content")
                htmx.ajax("GET", "/htmx-templates/" + clickedObject.name + "/Default-content.html", {target: contentElem, swap: "innerHTML", source: contentElem})
            renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);

            const newWidth = canvasContainer.clientWidth;
            const newHeight = canvasContainer.clientHeight;

            renderer.setSize(newWidth, newHeight);
            camera.aspect = newWidth / newHeight;

            camera.updateProjectionMatrix();
            zoomedin = true;
        }
    }

window.addEventListener('resize', () => {
    const newWidth = canvasContainer.clientWidth;
    const newHeight = canvasContainer.clientHeight;

    renderer.setSize(newWidth, newHeight);
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
});


// to skip tut
document.addEventListener("keydown", (key) => {
    if (key.key == 'n') {
        viewer.inTutorial=false;
    }
})

/*  CODE FOR HIGHLIGHTING A PIECE   */

document.addEventListener('mousemove', onMouseMove);
let highlighted = 0;
let oldparent = new THREE.Object3D();
var popup = document.createElement("div");
popup.className = "main-popup";
document.body.appendChild(popup);


function onMouseMove(event) {
    if(TutorialCounter == 1 && mouseDown) {
        addTutorialNextButton();
        mouseDown = false
    }
    let canvas = document.querySelector('canvas');

    mouse.x = (event.offsetX / canvas.clientWidth) * 2 - 1;
    mouse.y = -(event.offsetY / canvas.clientHeight) * 2 + 1;
    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections
    const intersects = raycaster.intersectObjects(model.children, true);
    if (intersects.length == 0) popup.style.display = "none";

    if (intersects.length > 0 && !zoomedin) {
        // handle the popup
        const position = intersects[0].point.clone().project(camera);
        const x = (position.x + 1) / 2 * window.innerWidth;
        const y = -(position.y - 1) / 2 * window.innerHeight;
        popup.style.display = 'block';
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
        if (!viewer.inTutorial) {
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
        } else {
            if(intersects[0].object.parent.name.includes("Container")) {
                popup.innerHTML = intersects[0].object.name.replace(/_/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase());
            } else {
                popup.innerHTML = "iPhone"
            }
        }
    } else if (highlighted != 0) {
        highlighted.children.forEach(function(child) {
            child.material.emissive.setHex(0x000000)
        })
        popup.style.display = 'none';
        highlighted = 0;
    }
} 


/*      ARCHIVED FUNCTIONS      */

document.addEventListener('keydown', function(event) {
    if (event.key == 't') {
        if (viewer.inTutorial) viewer.inTutorial = false;   
        viewer.mixer.timeScale = 1
    }
})

    // Debug function that was used to close content info columns and set back to main phone model
document.addEventListener('keydown', function(event) {
    // Check if Ctrl (or Command on Mac) and 'Z' key are pressed
    if (zoomedin) { 
        if (event.ctrlKey || event.metaKey) {
            if (event.key === 'z' || event.key === 'Z') {

                camera.copy(camera_state, true);
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
