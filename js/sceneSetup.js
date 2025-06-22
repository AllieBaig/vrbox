
/*
  Purpose: Procedural world generator for VRBox v9 sandbox
  Key features: Sets up lighting, camera, ground, and uses modular town builders
  Dependencies: three.module.min.js
  Related helpers: humanoid.js, controls.js, recorder.js, townBuilder.js
  Function names: createScene, getSceneObjects
  MIT License: https://github.com/AllieBaig/vrbox/blob/main/LICENSE
  Timestamp: 2025-06-22 19:10 | File: js/sceneSetup.js
*/

import {
  addHouses,
  addTrees,
  addBenches,
  addStreetlights
} from './js/townBuilder.js';

let benches = [];
let indoorGroup, sofa, bed;

export function createScene(THREE) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0c8f0);

  const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 80, 100);
  camera.lookAt(0, 0, -100);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Lighting
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 20, 10);
  dirLight.castShadow = true;
  scene.add(dirLight);

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 300),
    new THREE.MeshLambertMaterial({ color: 0x99cc99 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // ✅ Modular Town Builder Functions
  generateProceduralCity(scene);

  // Indoor Room (initially hidden)
  indoorGroup = new THREE.Group();
  scene.add(indoorGroup);

  const indoorFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshLambertMaterial({ color: 0xeaeaea })
  );
  indoorFloor.rotation.x = -Math.PI / 2;
  indoorFloor.position.set(0, 0, -200);
  indoorGroup.add(indoorFloor);

  sofa = new THREE.Mesh(
    new THREE.BoxGeometry(3, 1, 1),
    new THREE.MeshLambertMaterial({ color: 0x8B0000 })
  );
  sofa.position.set(-4, 0.5, -200);
  indoorGroup.add(sofa);

  bed = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.5, 2),
    new THREE.MeshLambertMaterial({ color: 0x4682B4 })
  );
  bed.position.set(4, 0.25, -200);
  indoorGroup.add(bed);

  indoorGroup.visible = false;

  return { scene, camera, renderer };
}

export function getSceneObjects() {
  return { benches, indoorGroup, sofa, bed };
}

function generateProceduralCity(scene) {
  benches = []; // Reset if reloading
  addHouses(scene);
  addTrees(scene);
  addBenches(scene);
  addStreetlights(scene);
}
