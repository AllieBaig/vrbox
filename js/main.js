
/* Purpose: Entry point for VRBox v9.3 with full joystick integration Key features: Scene setup, joystick control, OrbitControls camera, smooth RL-ready movement Dependencies: three.module.min.js, OrbitControls.js, joystickControls.js Related helpers: sceneSetup.js, humanoid.js, controls.js, recorder.js Function names: animate, updateLoop MIT License: https://github.com/AllieBaig/vrbox/blob/main/LICENSE Timestamp: 2025-06-22 20:10 | File: js/main.js */

import * as THREE from './libs/three.module.min.js'; import { OrbitControls } from './libs/OrbitControls.js'; import { handleJoystick, getJoystickState } from './joystickControls.js'; import { createScene, getSceneObjects } from './sceneSetup.js'; import { createHumanoid } from './humanoid.js'; import { setupControls, getControlState } from './controls.js'; import { setupRecorder, recordStep, exportEpisodes, updateActionState } from './recorder.js';

document.addEventListener("DOMContentLoaded", () => { // Start joystick handleJoystick("joystick-container");

const { scene, camera, renderer } = createScene(THREE); const { benches, indoorGroup, sofa, bed } = getSceneObjects();

const humanoid = createHumanoid(THREE); scene.add(humanoid);

setupControls(); setupRecorder(humanoid, benches, sofa, bed, indoorGroup);

document.getElementById("btn-export").addEventListener("click", exportEpisodes); document.getElementById("btn-sit").addEventListener("click", () => sitActionToggle());

const controls = new OrbitControls(camera, renderer.domElement); controls.target.set(0, 0, -100); controls.enableDamping = true; controls.dampingFactor = 0.05; controls.rotateSpeed = 0.5; controls.zoomSpeed = 1.0; controls.maxPolarAngle = Math.PI / 2; controls.minDistance = 5; controls.maxDistance = 200; controls.update();

document.getElementById("btn-zoom-in").addEventListener("click", () => { controls.minDistance = Math.max(2, controls.minDistance - 2); controls.update(); });

document.getElementById("btn-zoom-out").addEventListener("click", () => { controls.minDistance = Math.min(500, controls.minDistance + 2); controls.update(); });

let velocityX = 0; let velocityZ = 0; const maxSpeed = 0.5; const acceleration = 0.05; const damping = 0.90;

function animate() { requestAnimationFrame(animate); updateLoop(); }

function updateLoop() { // Combine keyboard and joystick states const keyboardState = getControlState(); const joystickState = getJoystickState();

// Priority to joystick if active
const moveX = (joystickState.moveX !== 0) ? joystickState.moveX : keyboardState.moveX;
const moveZ = (joystickState.moveZ !== 0) ? joystickState.moveZ : keyboardState.moveZ;
const sitAction = keyboardState.sitAction;

if (moveX !== 0) {
  velocityX += moveX * acceleration;
  velocityX = THREE.MathUtils.clamp(velocityX, -maxSpeed, maxSpeed);
}
if (moveZ !== 0) {
  velocityZ += moveZ * acceleration;
  velocityZ = THREE.MathUtils.clamp(velocityZ, -maxSpeed, maxSpeed);
}

velocityX *= damping;
velocityZ *= damping;

humanoid.position.x += velocityX;
humanoid.position.z += velocityZ;

const leftLeg = humanoid.getObjectByName("leftLeg");
const rightLeg = humanoid.getObjectByName("rightLeg");
if (Math.abs(velocityX) > 0.01 || Math.abs(velocityZ) > 0.01) {
  const walkCycle = Math.sin(Date.now() * 0.005) * 0.5;
  leftLeg.rotation.x = walkCycle;
  rightLeg.rotation.x = -walkCycle;
} else {
  leftLeg.rotation.x = 0;
  rightLeg.rotation.x = 0;
}

if (sitAction === 1) {
  leftLeg.rotation.x = -Math.PI / 2;
  rightLeg.rotation.x = -Math.PI / 2;
  humanoid.position.y = 0.3;
} else {
  humanoid.position.y = 0.6;
}

if (!indoorGroup.visible && humanoid.position.z < -160) {
  indoorGroup.visible = true;
}

updateActionState(moveX, moveZ, sitAction);
recordStep();

controls.update();
renderer.render(scene, camera);

}

function sitActionToggle() { const current = getControlState(); current.sitAction = (current.sitAction === 1) ? 0 : 1; }

animate(); });


