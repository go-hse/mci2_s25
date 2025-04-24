import * as THREE from '../99_Lib/three.module.min.js';
import { add, NO_OF_GEOS } from './js/geometry.mjs';
import { mouse, keyboard } from './js/interaction2D.mjs';

console.log("ThreeJs " + THREE.REVISION);
window.onload = function () {
    const scene = new THREE.Scene();
    // Lichter
    scene.add(new THREE.HemisphereLight(0x808080, 0x606060));
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 2, 0);
    scene.add(light);
    // Kamera
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 1);
    scene.add(camera);
    // Geometrie
    const ground = new THREE.Mesh(new THREE.BoxGeometry(5, 0.1, 5), new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.7,
        metalness: 0.0,
    }));
    scene.add(ground);
    ground.position.y = -0.5;

    const arr = [];

    const addToKeyboard = keyboard();

    addToKeyboard(" ", (active) => {
        console.log("Space", active);
    });

    const cursor = add(1, scene);
    mouse(cursor);



    const delta = 0.3, z = -    1;
    for (let x = -2; x <= 2; x += delta * 2) {
        for (let y = -1; y <= 1; y += delta) {
            const id = Math.trunc(Math.random() * NO_OF_GEOS);
            arr.push(add(id, scene, x, y, z));
        }
    }


    // Renderer erstellen
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    // Renderer-Parameter setzen
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // Renderer-Loop starten
    function render() {

        for (const o of arr) {
            const x = Math.random() * 0.1;
            const y = Math.random() * 0.1;
            const z = Math.random() * 0.1;
            o.rotation.x += x;
            // o.rotation.y += y;
            o.rotation.z += z;
        }


        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(render);


};
