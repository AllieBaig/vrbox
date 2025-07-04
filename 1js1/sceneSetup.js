
/* Purpose: Procedural world generator for VRBox v9.3 Key features: Modular city layout with roads, buildings, trees, benches; indoor room for RL Dependencies: three.module.min.js Related helpers: humanoid.js, controls.js, recorder.js Function names: createScene, getSceneObjects MIT License: https://github.com/AllieBaig/vrbox/blob/main/LICENSE Timestamp: 2025-06-22 20:40 | File: js/sceneSetup.js */

let benches = []; let indoorGroup, sofa, bed;

export function createScene(THREE) { const scene = new THREE.Scene(); scene.background = new THREE.Color(0xa0c8f0); // Sky blue

const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000); camera.position.set(0, 80, 100); camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true }); renderer.setSize(window.innerWidth, window.innerHeight); renderer.shadowMap.enabled = true; document.body.appendChild(renderer.domElement);

// Lighting const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0); hemiLight.position.set(0, 50, 0); scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8); dirLight.position.set(5, 20, 10); dirLight.castShadow = true; scene.add(dirLight);

// Ground const ground = new THREE.Mesh( new THREE.PlaneGeometry(400, 400), new THREE.MeshLambertMaterial({ color: 0x99cc99 }) ); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

// Generate city layout generateProceduralCity(scene, THREE);

// Indoor area indoorGroup = new THREE.Group(); scene.add(indoorGroup);

const indoorFloor = new THREE.Mesh( new THREE.PlaneGeometry(20, 20), new THREE.MeshLambertMaterial({ color: 0xeaeaea }) ); indoorFloor.rotation.x = -Math.PI / 2; indoorFloor.position.set(0, 0, -200); indoorGroup.add(indoorFloor);

sofa = new THREE.Mesh( new THREE.BoxGeometry(3, 1, 1), new THREE.MeshLambertMaterial({ color: 0x8B0000 }) ); sofa.position.set(-4, 0.5, -200); indoorGroup.add(sofa);

bed = new THREE.Mesh( new THREE.BoxGeometry(3, 0.5, 2), new THREE.MeshLambertMaterial({ color: 0x4682B4 }) ); bed.position.set(4, 0.25, -200); indoorGroup.add(bed);

indoorGroup.visible = false;

return { scene, camera, renderer }; }

export function getSceneObjects() { return { benches, indoorGroup, sofa, bed }; }

function generateProceduralCity(scene, THREE) { benches = []; const gridSize = 5; const blockSize = 40;

for (let gx = -gridSize; gx <= gridSize; gx++) { for (let gz = -gridSize; gz <= gridSize; gz++) { const centerX = gx * blockSize; const centerZ = gz * blockSize;

// Roads
  const road = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.1, blockSize),
    new THREE.MeshLambertMaterial({ color: 0x333333 })
  );
  road.position.set(centerX, 0.05, centerZ);
  road.receiveShadow = true;
  scene.add(road);

  // Buildings
  if (Math.random() < 0.7) {
    const house1 = new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 10),
      new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
    );
    house1.position.set(centerX + 15, 5, centerZ + (Math.random() - 0.5) * 20);
    scene.add(house1);
  }

  if (Math.random() < 0.7) {
    const house2 = new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 10),
      new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
    );
    house2.position.set(centerX - 15, 5, centerZ + (Math.random() - 0.5) * 20);
    scene.add(house2);
  }

  // Benches
  if (Math.random() < 0.4) {
    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.5, 0.5),
      new THREE.MeshLambertMaterial({ color: 0x8b4513 })
    );
    bench.position.set(centerX + (Math.random() - 0.5) * 20, 0.25, centerZ + (Math.random() - 0.5) * 20);
    benches.push(bench);
    scene.add(bench);
  }

  // Trees
  if (Math.random() < 0.5) {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 2, 8),
      new THREE.MeshLambertMaterial({ color: 0x8B4513 })
    );
    trunk.position.set(centerX + (Math.random() - 0.5) * 20, 1, centerZ + (Math.random() - 0.5) * 20);
    scene.add(trunk);

    const foliage = new THREE.Mesh(
      new THREE.SphereGeometry(1, 8, 8),
      new THREE.MeshLambertMaterial({ color: 0x228B22 })
    );
    foliage.position.set(trunk.position.x, 2.5, trunk.position.z);
    scene.add(foliage);
  }
}

} }

