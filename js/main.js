import * as THREE from '/build/three.module.js';
import {OrbitControls} from '/js/jsm/controls/OrbitControls.js';
import Stats from '/js/jsm/libs/stats.module.js';
import dat from '/js/jsm/libs/dat.gui.module.js';

"using strict";

let renderer, scene, camera, cameraControl, mesh, stats;
let meshArr = [];

let gui = new dat.GUI();
gui.domElement.id = 'gui';

// Position Menu
let posMenu = gui.addFolder("Model's Position Menu");

// Rotation Menu
let rotMenu = gui.addFolder("Model's Rotation Menu");

// Model's Appearance Menu
let appearMenu = gui.addFolder("Model's Appeareance Menu");

// model
let listColors = ["White", "Red", "Blue"];

function addMesh(shape) {
    let geometry, material;

    switch(shape) {
        case 'Cube':
            geometry = new THREE.BoxGeometry();
            material = new THREE.MeshBasicMaterial({color: "white", wireframe: true});
            mesh = new THREE.Mesh(geometry, material);
            mesh.name = "Cube";
            break;
        case 'Sphere':
            geometry = new THREE.SphereGeometry();
            material = new THREE.MeshBasicMaterial({color: "white", wireframe: true});
            mesh = new THREE.Mesh(geometry, material);
            mesh.name = "Sphere";
            break;
        case 'Cone':
            geometry = new THREE.ConeGeometry();
            material = new THREE.MeshBasicMaterial({color: "white", wireframe: true});
            mesh = new THREE.Mesh(geometry, material);
            mesh.name = "Cone";
            break;
    }
    scene.add(mesh);
    meshArr.push(mesh);
}

function init() {

    // RENDERER
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setClearColor(new THREE.Color(0.2, 0.2, 0.35));
    document.body.appendChild(renderer.domElement);

    // SCENE
    scene = new THREE.Scene();

    // CAMERA
    let fov = 60;
    let aspect = window.innerWidth / window.innerHeight;
    let near = 0.1;
    let far = 10000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 3);
    cameraControl = new OrbitControls(camera, renderer.domElement);

    addMesh('Cube');

    // General menu
    let generalMenu = gui.addFolder("General Menu");

    generalMenu.open();

    let model = {
        name: mesh.name,
        wireframe: mesh.material.wireframe,
        rotY: mesh.rotation.y * 180 / Math.PI,
        rotX: mesh.rotation.x * 180 / Math.PI,
        rotZ: mesh.rotation.z * 180 / Math.PI,
        posX: mesh.position.x,
        posY: mesh.position.y,
        posZ: mesh.position.z,
        posHome: function() {
            model.rotX = 0;
            model.rotY = 0;
            model.rotZ = 0;
            model.posX = 0;
            model.posY = 0;
            model.posZ = 0;
            mesh.position.x = model.posX;
            mesh.position.y = model.posY;
            mesh.position.z = model.posZ;
            mesh.rotation.y = model.rotY;
            mesh.rotation.x = model.rotX;
            mesh.rotation.z = model.rotZ;
        },
        listColors,
        defaultItem: listColors[0],
        colorPalette: [255, 255, 255]
    }

    // TextField Model Name
    let tfMeshName = generalMenu.add(model, "name").name("Model's Name").listen().onChange(function(value) {
        mesh.name = value;
    }).onFinishChange(function(value) {
        console.log(mesh.name);
    });

    let sliderPosX = posMenu.add(model, "posX").min(-5).max(5).step(0.5).name("X").listen().onChange(function(value) {
        mesh.position.x = value;
    });

    let sliderPosY = posMenu.add(model, "posY").min(-5).max(5).step(0.5).name("Y").listen().onChange(function(value) {
        mesh.position.y = value;
    });

    let sliderPosZ = posMenu.add(model, "posZ").min(-5).max(5).step(0.5).name("Z").listen().onChange(function(value) {
        mesh.position.z = value;
    });

    // Button Position Home
    let btnPosHome = posMenu.add(model, "posHome").name("HOME");


    // Model Orientation
    let sliderRotY = rotMenu.add(model, "rotY").min(-180).max(180).step(5).name("Y (deg)").listen().onChange(function(value) {
        mesh.rotation.y = value * Math.PI / 180;
    });

    // Model Orientation
    let sliderRotX = rotMenu.add(model, "rotX").min(-180).max(180).step(5).name("X (deg)").listen().onChange(function(value) {
        mesh.rotation.x = value * Math.PI / 180;
    });

    // Model Orientation
    let sliderRotZ = rotMenu.add(model, "rotZ").min(-180).max(180).step(5).name("Z (deg)").listen().onChange(function(value) {
        mesh.rotation.z = value * Math.PI / 180;
    });

    // Model Draw Mode
    let chbWireframe = appearMenu.add(model, "wireframe").setValue(true).name("Wireframe").listen().onChange(function(value) {
        mesh.material.wireframe = value;
    });
    let listColor = appearMenu.add(model, "defaultItem", model.listColors).name("Color List").onChange(function(item) {
        mesh.material.color = new THREE.Color(item.toLowerCase());
        model.colorPalette = [mesh.material.color.r * 255, mesh.material.color.g * 255, mesh.material.color.b * 255];
    });
    let colorPalette = appearMenu.addColor(model, "colorPalette").name("Color Palette").listen().onChange(function(color) {
        mesh.material.color = new THREE.Color(color[0]/255, color[1]/255, color[2]/255);
    });

    gui.close();


    // STATS
    stats = new Stats();
    stats.id = 'stats';
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    // OBJECT SELECT

    document.addEventListener( 'click', onDocumentMouseDown );

    function onDocumentMouseDown( event ) {
        event.preventDefault();
        var mouse3D = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1,
                                -( event.clientY / window.innerHeight ) * 2 + 1,
                                0.5 );
        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera( mouse3D, camera );
        var intersects = raycaster.intersectObjects( meshArr );

        if ( intersects.length > 0 ) {
            let color = Math.random() * 0xffffff;
            intersects[ 0 ].object.material.color.setHex( color );
            mesh = intersects[0].object;

            model.name = mesh.name;
            model.colorPalette = [mesh.material.color.r * 255, mesh.material.color.g * 255, mesh.material.color.b * 255];
            model.posX = mesh.position.x;
            model.posY = mesh.position.y;
            model.posZ = mesh.position.z;
            model.rotX = mesh.rotation.x / Math.PI * 180;
            model.rotY = mesh.rotation.y / Math.PI * 180;
            model.rotZ = mesh.rotation.z / Math.PI * 180;
            model.wireframe = mesh.material.wireframe;
        }
    }

    // BOOTSTRAP BUTTONS
    let addCubeBtn = document.getElementById("insert-cube");
    let addSphereBtn = document.getElementById("insert-sphere");
    let addConeBtn = document.getElementById("insert-cone");

    addCubeBtn.addEventListener('click', function(event) {
        event.preventDefault();
        addMesh('Cube');
    });

    addSphereBtn.addEventListener('click', function(event) {
        event.preventDefault();
        addMesh('Sphere');
    });

    addConeBtn.addEventListener('click', function(event) {
        event.preventDefault();
        addMesh('Cone');
    });

    // RENDER LOOP
    renderLoop();
}

function renderLoop() {
    stats.begin();
    renderer.render(scene, camera); // DRAW SCENE
    updateScene();
    stats.end();
    stats.update();
    requestAnimationFrame(renderLoop);
}

function updateScene() {

}

// EVENT LISTENERS & HANDLERS
document.addEventListener("DOMContentLoaded", init);

window.addEventListener("resize", function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
