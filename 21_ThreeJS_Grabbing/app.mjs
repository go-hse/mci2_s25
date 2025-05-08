import * as THREE from '../99_Lib/three.module.min.js';
import { add, NO_OF_GEOS, createLine } from './js/geometry.mjs';
import { mouse, keyboard, createRay } from './js/interaction2D.mjs';

console.log("ThreeJs " + THREE.REVISION);
window.onload = function () {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("hsla(253, 73.10%, 49.60%, 0.73)");
    // Lichter
    scene.add(new THREE.HemisphereLight(0x808080, 0x606060));
    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = true;
    dirLight.shadow.camera.zoom = 2;
    scene.add(dirLight);
    // Kamera
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 1);
    scene.add(camera);
    //////////////////////////////////////////////////////////////////////////////
    // FLOOR
    // const floorMaterial = await shaderMaterial("./shaders/floorVertexShader.glsl", "./shaders/floorFragmentShader.glsl")


    const width = 0.1;
    const box = new THREE.BoxGeometry(10, width, 10, 20, 1, 20);
    const floor = new THREE.Mesh(box, new THREE.MeshStandardMaterial({
        color: new THREE.Color("hsl(0, 54.80%, 93.90%)"),
        roughness: 0.2,
        metalness: 0.4
    }));
    floor.position.y = -1;
    scene.add(floor);
    floor.receiveShadow = true;

    const linematerial = new THREE.LineBasicMaterial({
        color: new THREE.Color("hsl(65, 16.40%, 28.60%)")
    });

    const wireframe = new THREE.WireframeGeometry(box);
    const line = new THREE.LineSegments(wireframe, linematerial);
    line.position.y = floor.position.y;
    scene.add(line);


    const arr = [];

    const addToKeyboard = keyboard();

    addToKeyboard(" ", (active) => {
        console.log("Space", active);
    });

    const cursor = add(1, scene);
    mouse(cursor);


    const setLinePos = createLine(scene);
    const position = new THREE.Vector3();
    const rotation = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const endRay = new THREE.Vector3();



    const delta = 0.7, z = -1;
    for (let x = -2; x <= 2; x += delta * 2) {
        for (let y = -1; y <= 1; y += delta) {
            const id = Math.trunc(Math.random() * NO_OF_GEOS);
            arr.push(add(id, scene, x, y, z));
        }
    }

    const rayFunc = createRay(arr);




    // Renderer erstellen
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    // Renderer-Parameter setzen
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = Math.pow(1, 4.0);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    // Renderer-Loop starten

    let grabbedObject, intersectObject, distance;
    const maxDistance = 10;

    // Lokale Achsenvektoren extrahieren
    const xAxis = new THREE.Vector3();
    const yAxis = new THREE.Vector3();
    const zAxis = new THREE.Vector3();


    function render() {
        // Erste, zweite, dritte Spalte extrahieren
        cursor.matrix.extractBasis(xAxis, yAxis, zAxis);

        cursor.matrix.decompose(position, rotation, scale);
        direction.set(0, 1, 0);
        direction.applyQuaternion(rotation);

        if (intersectObject) {
            intersectObject.object.material.emissive.set(0x000000);
            intersectObject = undefined;
        }

        if (grabbedObject === undefined) {
            intersectObject = rayFunc(position, direction);
            if (intersectObject) {
                intersectObject.object.material.emissive.set(0x444444);
                distance = intersectObject.distance;
            } else {
                distance = maxDistance;
            }
            endRay.addVectors(position, yAxis.multiplyScalar(distance));
        }

        setLinePos(0, cursor.position);
        setLinePos(1, endRay);


        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(render);


};
