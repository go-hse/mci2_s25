import * as THREE from '../99_Lib/three.module.min.js';
import { keyboard, mouse } from './js/interaction2D.mjs';
import { add, createLine, loadGLTFcb, randomMaterial } from './js/geometry.mjs';
import { createRay } from './js/ray.mjs';

// VR- Buttons zum Starten des immersiven Modus  
import { VRButton } from '../99_Lib/jsm/webxr/VRButton.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';

import { createVRcontrollers } from './js/vr.mjs';

window.onload = async function () {
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.3, 2);

    const scene = new THREE.Scene();
    const world = new THREE.Group();
    world.matrixAutoUpdate = false;
    scene.add(world);

    scene.background = new THREE.Color(0x666666);

    const hemiLight = new THREE.HemisphereLight();
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = true;
    dirLight.shadow.camera.zoom = 2;
    scene.add(dirLight);

    //////////////////////////////////////////////////////////////////////////////
    // FLOOR

    const width = 0.1;
    const box = new THREE.BoxGeometry(10, width, 10, 10, 1, 10);
    const floor = new THREE.Mesh(box, randomMaterial());
    floor.position.y = -1;
    floor.receiveShadow = true;
    floor.userData.physics = { mass: 0 };
    floor.name = "floor";

    const wireframe = new THREE.WireframeGeometry(box);
    const wireframeFloor = new THREE.LineSegments(wireframe);
    wireframeFloor.material.opacity = 0.25;
    wireframeFloor.material.transparent = true;
    wireframeFloor.position.y = floor.position.y;
    scene.add(wireframeFloor);
    scene.add(floor);

    function FloorVisible(active) {
        floor.visible = active;
        wireframeFloor.visible = active;
    }


    const cursor = add(1, scene);
    const isMouseButton = mouse(cursor);

    let objects = [];
    let x = -0.8, y = 0.3, z = -0.5, delta = 0.4;
    for (let i = 0; i < 5; ++i) {
        objects.push(add(i, world, x, y, z)); x += delta;
    }

    loadGLTFcb('./models/cube_with_inner_sphere.glb', (gltf) => {
        gltf.scene.traverse(child => {
            if (child.name.includes("geo")) {
                objects.push(child);
                child.scale.set(0.2, 0.2, 0.2) // scale here
                child.position.set(1, 0.5, 0);
                child.updateMatrix();
                child.matrixAutoUpdate = false;
            }
        });
        world.add(gltf.scene);
    });


    const planeGroup = new THREE.Group();
    planeGroup.matrixAutoUpdate = false;
    planeGroup.visible = false;
    scene.add(planeGroup);

    const planeOffset = new THREE.Group();
    planeGroup.add(planeOffset);

    loadGLTFcb('./models/plane.gltf', (gltf) => {
        gltf.scene.traverse(child => {
            if (child.name === "Plane") {
                console.log("plane:", child.name);
                child.scale.set(0.1, 0.1, 0.1) // scale here
                child.position.set(0, 0, 0);
                child.rotation.set(0, 0, 0);
                child.updateMatrix();
                child.rotation.z = Math.PI / 2;
                child.updateMatrix();
                planeOffset.add(child);
            }
        });
    });


    const lineFunc = createLine(scene);
    const rayFunc = createRay(objects);

    let position = new THREE.Vector3();
    let rotation = new THREE.Quaternion();
    let scale = new THREE.Vector3();
    let endRay = new THREE.Vector3();
    let direction = new THREE.Vector3();

    // Renderer erstellen
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
    });

    // Renderer-Parameter setzen
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // VR 
    document.body.appendChild(VRButton.createButton(renderer));
    document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

    // VR: Callback, wenn Benutzer in VR/AR-Modus wechselt 
    const controllers = {}, mainhand = "left", scndhand = mainhand === "left" ? "right" : "left";
    createVRcontrollers(scene, renderer, (controller, data, id) => {

        // Flug-Modus-Anzeige: andere Drehung
        planeOffset.rotation.x = -Math.PI / 2;
        planeOffset.scale.set(0.5, 0.5, 0.5) // scale here

        // Linker/rechter Controller
        controllers[data.handedness] = {
            controller, data
        };

        cursor.matrixAutoUpdate = false;
        cursor.visible = false;
        renderer.xr.enabled = true;
        console.log("verbinde", id, data.handedness)
    });

    window.addEventListener('resize', onWindowResize);
    function onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        composer.setSize(width, height);
    }


    const addKey = keyboard();
    addKey("Escape", active => {
        console.log("Escape", active);
    });

    let grabbed = false, squeezed = false;
    addKey(" ", active => {
        console.log("Space: Grabbed", active);
        grabbed = active;
    });

    addKey("s", active => {
        console.log("S: Squeeze", active);
        squeezed = active;
    });

    addKey("f", active => {
        if (active) {
            console.log("F: toggle floor", active, floor.visible);
            floor.visible = !floor.visible;
        }
    });

    addKey("r", active => {
        console.log("R: reset world", active, floor.visible);
        world.matrix.identity();
    });

    let wireframeFlag = false;
    function ToWireframe(active) {
        if (wireframeFlag !== active) {
            wireframeFlag = active;
            scene.traverse((object) => {
                if (object.isMesh) {
                    if (Array.isArray(object.material)) {
                        // Wenn das Mesh mehrere Materialien verwendet
                        object.material.forEach((mat) => {
                            mat.wireframe = active;
                        });
                    } else {
                        // Einzelnes Material
                        object.material.wireframe = active;
                    }
                }
            });
        }
    }


    addKey("w", active => {
        ToWireframe(active);
    });


    const maxDistance = 10;
    direction.set(0, 1, 0);

    let grabbedObject, initialGrabbed, distance, inverseHand, inverseWorld;
    const deltaFlyRotation = new THREE.Quaternion();
    const differenceMatrix = new THREE.Matrix4();
    const flySpeedRotationFactor = 0.01;
    const flySpeedTranslationFactor = -0.02;
    const euler = new THREE.Euler();

    function fmt(n) {
        return n % 1 === 0 ? n : n.toFixed(1);
    }


    // Renderer-Loop starten

    let laststr;
    function render(timestamp, frame) {
        if (frame) {
            console.log(timestamp, frame);
        }

        // VR 
        if (controllers[mainhand]) {
            const controller = controllers[mainhand].controller;
            cursor.matrix.copy(controller.matrix);
            squeezed = controller.userData.isSqueezeing;
            grabbed = controller.userData.isSelecting;
            const mainGamepad = controllers[mainhand].data.gamepad;
            const scndGamepad = controllers[scndhand].data.gamepad;

            let bs = "Btn "
            for (let i = 0; i < mainGamepad.buttons.length; ++i) {
                const btn = mainGamepad.buttons[i].value;
                bs += ` [${i}: ${fmt(btn)}] `;
            }

            const str = `${controllers[mainhand].data.handedness}: ${fmt(mainGamepad.axes[2])}/ ${fmt(mainGamepad.axes[3])} ${bs}`;
            if (str !== laststr) {
                laststr = str;
                console.log(laststr);
            }

            if (mainGamepad.buttons[4].value) ToWireframe(true);
            if (mainGamepad.buttons[5].value) ToWireframe(false);
            if (scndGamepad.buttons[4].value) FloorVisible(true);
            if (scndGamepad.buttons[5].value) FloorVisible(false);

            direction.set(0, 0, -1);
        } else {
            direction.set(0, 1, 0);
        }

        cursor.matrix.decompose(position, rotation, scale);
        lineFunc(0, position);

        direction.applyQuaternion(rotation);

        let firstObjectHitByRay;
        if (grabbedObject === undefined) {
            firstObjectHitByRay = rayFunc(position, direction);
            if (firstObjectHitByRay) {
                // console.log(firstObjectHitByRay.object.name, firstObjectHitByRay.distance);
                distance = firstObjectHitByRay.distance;
            } else {
                distance = maxDistance;
            }
            endRay.addVectors(position, direction.multiplyScalar(distance));
            lineFunc(1, endRay);
        }


        if (grabbed) {
            if (grabbedObject) {
                endRay.addVectors(position, direction.multiplyScalar(distance));
                lineFunc(1, endRay);
                if (grabbedObject === world) {
                    world.matrix.copy(cursor.matrix.clone().multiply(initialGrabbed));
                } else {
                    grabbedObject.matrix.copy(inverseWorld.clone().multiply(cursor.matrix).multiply(initialGrabbed));
                }
            } else if (firstObjectHitByRay) {
                grabbedObject = firstObjectHitByRay.object;
                inverseWorld = world.matrix.clone().invert();
                initialGrabbed = cursor.matrix.clone().invert().multiply(world.matrix).multiply(grabbedObject.matrix);
            } else {
                grabbedObject = world;
                initialGrabbed = cursor.matrix.clone().invert().multiply(world.matrix);
            }
        } else {
            grabbedObject = undefined;
        }

        // Navigation
        if (squeezed) {
            lineFunc(1, position);

            if (inverseHand !== undefined) {
                lineFunc(0, position);
                let differenceHand = cursor.matrix.clone().multiply(inverseHand);
                differenceHand.decompose(position, rotation, scale);

                // Navigation: Skalierung der Rotationsgeschwindigkeit
                deltaFlyRotation.set(0, 0, 0, 1);
                deltaFlyRotation.slerp(rotation.conjugate(), flySpeedRotationFactor);

                // Beschränkung der Rotation beim Fliegen
                euler.setFromQuaternion(deltaFlyRotation);
                euler.x = 0;
                euler.z = 0;
                deltaFlyRotation.setFromEuler(euler);

                differenceMatrix.compose(position.multiplyScalar(flySpeedTranslationFactor), deltaFlyRotation, scale);
                world.matrix.premultiply(differenceMatrix);
            } else {
                planeGroup.visible = true; // Flugzeug als Feedback sichtbar
                planeGroup.matrix.copy(cursor.matrix);
                inverseHand = cursor.matrix.clone().invert();
            }
        } else {
            planeGroup.visible = false;
            inverseHand = undefined;
        }
        renderer.render(scene, camera);
        // composer.render();

    }
    renderer.setAnimationLoop(render);
};


/*
- Laden von Objekten
- 


*/