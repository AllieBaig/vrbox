
/*
  Purpose: Setup main scene environment (lighting, ground, road, benches, house, indoor objects)
  Key features: Creates full world geometry for RL sandbox
  Dependencies: three.module.min.js
  Related helpers: humanoid.js, controls.js, recorder.js, cameraControls.js
  Function names: createScene, getSceneObjects
  MIT License: https://github.com/AllieBaig/vrbox/blob/main/LICENSE
  Timestamp: 2025-06-21 17:05 | File: js/sceneSetup.js
*/

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
  const textureLoader = new THREE.TextureLoader();
  const groundTexture = textureLoader.load('../textures/grass.jpg');
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(8, 8);

  const groundGeo = new THREE.PlaneGeometry(40, 200);
  const groundMat = new THREE.MeshLambertMaterial({ map: groundTexture });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Road
  const roadMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const road = new THREE.Mesh(new THREE.BoxGeometry(10, 0.1, 200), roadMat);
  road.position.set(0, 0.05, -100);
  road.receiveShadow = true;
  scene.add(road);

  // Benches
  benches = [];
  for (let i = 0; i < 5; i++) {
    const benchGeo = new THREE.BoxGeometry(2, 0.5, 0.5);
    const benchMat = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.position.set((Math.random() - 0.5) * 8, 0.25, -i * 30 - 20);
    benches.push(bench);
    scene.add(bench);
  }

  // Obstacles
  for (let i = 0; i < 5; i++) {
    const coneGeo = new THREE.ConeGeometry(0.5, 1, 16);
    const coneMat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.set((Math.random() - 0.5) * 8, 0.5, -i * 40 - 50);
    scene.add(cone);
  }

  // House
  const houseGeo = new THREE.BoxGeometry(10, 8, 10);
  const houseMat = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
  const house = new THREE.Mesh(houseGeo, houseMat);
  house.position.set(0, 4, -170);
  scene.add(house);

  // Indoor Group
  indoorGroup = new THREE.Group();
  scene.add(indoorGroup);

  const indoorFloor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshLambertMaterial({ color: 0xeaeaea }));
  indoorFloor.rotation.x = -Math.PI / 2;
  indoorFloor.position.set(0, 0, -200);
  indoorGroup.add(indoorFloor);

  sofa = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 1), new THREE.MeshLambertMaterial({ color: 0x8B0000 }));
  sofa.position.set(-4, 0.5, -200);
  indoorGroup.add(sofa);

  bed = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 2), new THREE.MeshLambertMaterial({ color: 0x4682B4 }));
  bed.position.set(4, 0.25, -200);
  indoorGroup.add(bed);

  indoorGroup.visible = false;

  return { scene, camera, renderer };
}

export function getSceneObjects() {
  return { benches, indoorGroup, sofa, bed };
}
