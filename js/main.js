
import * as THREE from './libs/three.module.min.js';

// ===== Config =====
const CAMERA_START_POSITION = { x: 0, y: 80, z: 100 };
const CAMERA_LOOKAT_POSITION = { x: 0, y: 0, z: -100 };

// ===== Scene Setup =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0c8f0);

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(
  CAMERA_START_POSITION.x,
  CAMERA_START_POSITION.y,
  CAMERA_START_POSITION.z
);
camera.lookAt(
  CAMERA_LOOKAT_POSITION.x,
  CAMERA_LOOKAT_POSITION.y,
  CAMERA_LOOKAT_POSITION.z
);

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
const benches = [];
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
const indoorGroup = new THREE.Group();
scene.add(indoorGroup);

const indoorFloor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshLambertMaterial({ color: 0xeaeaea }));
indoorFloor.rotation.x = -Math.PI / 2;
indoorFloor.position.set(0, 0, -200);
indoorGroup.add(indoorFloor);

// Sofa
const sofa = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 1), new THREE.MeshLambertMaterial({ color: 0x8B0000 }));
sofa.position.set(-4, 0.5, -200);
indoorGroup.add(sofa);

// Bed
const bed = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 2), new THREE.MeshLambertMaterial({ color: 0x4682B4 }));
bed.position.set(4, 0.25, -200);
indoorGroup.add(bed);

indoorGroup.visible = false;

// ===== Humanoid Character =====
const humanoid = new THREE.Group();
scene.add(humanoid);

// Torso
const torso = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 0.5), new THREE.MeshLambertMaterial({ color: 0x00bfff }));
torso.position.set(0, 1, 0);
humanoid.add(torso);

// Head
const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshLambertMaterial({ color: 0xffcc99 }));
head.position.set(0, 2.5, 0);
humanoid.add(head);

// Left Leg
const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.2, 16), new THREE.MeshLambertMaterial({ color: 0x0000ff }));
leftLeg.position.set(-0.3, -0.1, 0);
humanoid.add(leftLeg);

// Right Leg
const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.2, 16), new THREE.MeshLambertMaterial({ color: 0x0000ff }));
rightLeg.position.set(0.3, -0.1, 0);
humanoid.add(rightLeg);

// Left Arm
const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1, 16), new THREE.MeshLambertMaterial({ color: 0xff0000 }));
leftArm.position.set(-0.8, 1.5, 0);
leftArm.rotation.z = Math.PI / 2;
humanoid.add(leftArm);

// Right Arm
const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1, 16), new THREE.MeshLambertMaterial({ color: 0xff0000 }));
rightArm.position.set(0.8, 1.5, 0);
rightArm.rotation.z = Math.PI / 2;
humanoid.add(rightArm);

// Initial humanoid position
humanoid.position.set(0, 0.6, 0);

// ===== Movement Controls =====
let moveX = 0;
let moveZ = 0;
let sitAction = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveX = -1;
    if (e.key === 'ArrowRight') moveX = 1;
    if (e.key === 'ArrowUp') moveZ = -1;
    if (e.key === 'ArrowDown') moveZ = 1;
    if (e.key === 's') sitAction = 1;
});
document.addEventListener('keyup', () => {
    moveX = 0;
    moveZ = 0;
    sitAction = 0;
});

// ===== Touch Controls =====
document.getElementById("leftBtn").addEventListener("touchstart", () => moveX = -1);
document.getElementById("rightBtn").addEventListener("touchstart", () => moveX = 1);
document.getElementById("forwardBtn").addEventListener("touchstart", () => moveZ = -1);
document.getElementById("backwardBtn").addEventListener("touchstart", () => moveZ = 1);
document.getElementById("sitBtn").addEventListener("touchstart", () => sitAction = 1);

document.querySelectorAll(".control-btn").forEach(btn => {
  btn.addEventListener("touchend", () => {
    moveX = 0; moveZ = 0; sitAction = 0;
  });
});

// ===== RL Episode Recorder =====
let currentEpisode = { states: [], actions: [], rewards: [] };

function recordStep() {
    let nearBench = benches.some(b => b.position.distanceTo(humanoid.position) < 2) ? 1 : 0;
    let nearSofa = indoorGroup.visible && sofa.position.distanceTo(humanoid.position) < 2 ? 1 : 0;
    let nearBed = indoorGroup.visible && bed.position.distanceTo(humanoid.position) < 2 ? 1 : 0;

    const state = [
        humanoid.position.x,
        humanoid.position.z,
        nearBench,
        nearSofa,
        nearBed
    ];

    const action = [moveX, moveZ, sitAction];

    let reward = 0;
    if (sitAction === 1) {
        if (nearBench) reward = 1;
        if (nearSofa) reward = 2;
        if (nearBed) reward = 3;
    }

    currentEpisode.states.push(state);
    currentEpisode.actions.push(action);
    currentEpisode.rewards.push(reward);
}

function exportEpisodes() {
    const dataStr = JSON.stringify([currentEpisode]);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "humanoid_episodes.json";
    a.click();
}

document.getElementById("exportButton").addEventListener("click", exportEpisodes);

// ===== Animation Loop =====
function animate() {
    requestAnimationFrame(animate);
    humanoid.position.x += moveX * 0.2;
    humanoid.position.z += moveZ * 0.2;

    // Very simple walking animation by rotating legs
    if (moveX !== 0 || moveZ !== 0) {
        const walkCycle = Math.sin(Date.now() * 0.005) * 0.5;
        leftLeg.rotation.x = walkCycle;
        rightLeg.rotation.x = -walkCycle;
    } else {
        leftLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;
    }

    // Sit animation
    if (sitAction === 1) {
        leftLeg.rotation.x = -Math.PI / 2;
        rightLeg.rotation.x = -Math.PI / 2;
        humanoid.position.y = 0.3;
    } else {
        humanoid.position.y = 0.6;
    }

    if (!indoorGroup.visible && humanoid.position.z < -160) {
        indoorGroup.visible = true;
        camera.lookAt(0, 0, -200);
    }

    recordStep();
    renderer.render(scene, camera);
}
animate();



