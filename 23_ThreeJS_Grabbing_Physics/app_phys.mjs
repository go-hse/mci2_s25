import * as THREE from '../99_Lib/three.module.min.js';
import { AmmoPhysics } from '../99_Lib/jsm/physics/AmmoPhysics.js';

import { VRButton } from '../99_Lib/jsm/webxr/VRButton.js';
import { createVRcontrollers } from './js/vr.mjs';

import { keyboard, mouse } from './js/interaction2D.mjs';
import { createRay } from './js/ray.mjs';
import { add, createLine } from './js/geometry.mjs';

console.log("ThreeJs " + THREE.REVISION);

window.onload = async function () {

    const physics = await AmmoPhysics();

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.3, 2);

    const scene = new THREE.Scene();
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
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    // const floorShadowMaterial = new THREE.ShadowMaterial({ color: 0x554444 });
    const width = 0.1;
    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(10, width, 10),
        floorMaterial
    );
    floor.position.y = -width / 2;
    floor.receiveShadow = true;
    floor.userData.physics = { mass: 0 };
    floor.name = "floor";
    scene.add(floor);

    //////////////////////////////////////////////////////////////////////////////
    // Box
    const boxWidth = 0.2;
    const MAX_SPHERES = 1;

    // for (let i = 0; i < 10; ++i) {
    //     const box = new THREE.Mesh(new THREE.BoxGeometry(boxWidth, boxWidth, boxWidth), new THREE.MeshStandardMaterial({
    //         color: 0xff3333,
    //         roughness: 0.7,
    //         metalness: 0.0,
    //     }));
    //     box.name = `box_${i}`;
    //     box.position.x = 2 * Math.random() - 1;
    //     box.position.z = -1 * Math.random();
    //     box.position.y = boxWidth / 2;

    //     box.castShadow = true;
    //     box.receiveShadow = true;
    //     box.userData.physics = { mass: 1 };
    //     scene.add(box);
    // }

    //////////////////////////////////////////////////////////////////////////////
    // Spheres
    const physicalSpheres = [];
    for (let i = 0; i < MAX_SPHERES; ++i) {
        const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1, 3), new THREE.MeshStandardMaterial({
            color: 0xff3333,
            roughness: 0.7,
            metalness: 0.0,
        }));
        sphere.name = `sphere_${i}`;
        sphere.position.x = 2 * Math.random() - 1;
        sphere.position.z = -1 * Math.random();
        sphere.position.y = boxWidth / 2;
        sphere.position.x = 0;
        sphere.position.z = -1;
        sphere.position.y = 0.1;

        sphere.castShadow = true;
        // sphere.userData.physics = { mass: 0.9 };
        scene.add(sphere);
        physicalSpheres.push(sphere);
    }

    physicalSpheres.push(add(3, scene, 0, 0.2, -1));
    const rayFunc = createRay(physicalSpheres);
    const lineFunc = createLine(scene);


    const cursor = add(1, scene);
    cursor.castShadow = true;
    mouse(cursor);


    const addKey = keyboard();
    let triggered = false, triggeredBox = false;
    addKey(" ", active => {
        triggered = active;
    });
    addKey("a", active => {
        triggeredBox = active;
    });

    const cursor_position = new THREE.Vector3();
    const cursor_rotation = new THREE.Quaternion();
    const cursor_scale = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const velocity = new THREE.Vector3();
    const MOVESPEED = 15;

    const position = new THREE.Vector3();
    const rotation = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const endRay = new THREE.Vector3();

    physics.addScene(scene);
    //

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    //
    let last_active_controller;
    createVRcontrollers(scene, renderer, (controller, data, id) => {
        cursor.matrixAutoUpdate = false;
        cursor.visible = false;
        last_active_controller = controller;
        renderer.xr.enabled = true;
        console.log("verbinde", id, data.handedness)
    });


    // Renderer-Loop starten

    let squeeze = false;
    let grabbedObject, initialGrabbed, distance, selected, lastName = "";
    const maxDistance = 10;

    function render() {
        direction.set(0, 1, 0);

        if (last_active_controller) {
            cursor.matrix.copy(last_active_controller.matrix);
            const nsqueeze = last_active_controller.userData.isSqueezeing;
            if (nsqueeze !== squeeze) {
                squeeze = nsqueeze;
                if (squeeze) triggered = true;
            }
            direction.set(0, 0, -1);
        } else {
            direction.set(0, 1, 0);
        }

        cursor.matrix.decompose(position, rotation, scale);
        lineFunc(1, position);

        const intersectObject = rayFunc(position, direction);
        direction.applyQuaternion(rotation);
        if (intersectObject) {
            if (intersectObject.object.name !== lastName) {
                lastName = intersectObject.object.name;
                console.log(lastName);
            }
            endRay.addVectors(position, direction.multiplyScalar(intersectObject.distance));
            distance = intersectObject.distance;
        } else {
            endRay.addVectors(position, direction.multiplyScalar(maxDistance));
            distance = maxDistance;
        }

        lineFunc(0, endRay);
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(render);


}
