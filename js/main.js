
/*
  Purpose: Entry point for VRBox v9.2 with free camera, velocity-based movement, and joystick-ready control system
  Key features: Scene setup, humanoid movement, OrbitControls camera, recorder logging, velocity damping system
  Dependencies: three.module.min.js, OrbitControls.js, sceneSetup.js, townBuilder.js, humanoid.js, controls.js, recorder.js
  Related helpers: joystickControls.js (external control state injection)
  Function names: animate, updateLoop
  MIT License: https://github.com/AllieBaig/vrbox/blob/main/LICENSE
  Timestamp: 2025-06-22 19:30 | File: js/main.js
*/

import * as THREE from './libs/three.module.min.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { createScene, getSceneObjects } from './sceneSetup.js';
import { createHumanoid } from './humanoid.js';
import { setupControls, getControlState } from './controls.js';
import { setupRecorder, recordStep, exportEpisodes, updateActionState } from './recorder.js';

export function init() {
  const { scene, camera, renderer } = createScene(THREE);
  const { benches, indoorGroup, sofa, bed } = getSceneObjects();

  const humanoid = createHumanoid(THREE);
  scene.add(humanoid);

  setupControls();
  setupRecorder(humanoid, benches, sofa, bed, indoorGroup);

  document.getElementById("btn-export").addEventListener("click", exportEpisodes);
  document.getElementById("btn-sit").addEventListener("click", () => sitActionToggle());

  // OrbitControls for free camera movement
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, -100);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 1.0;
  controls.maxPolarAngle = Math.PI / 2;
  controls.minDistance = 5;
  controls.maxDistance = 200;
  controls.update();

  // Zoom buttons
  document.getElementById("btn-zoom-in").addEventListener("click", () => {
    controls.minDistance = Math.max(2, controls.minDistance - 2);
    controls.update();
  });

  document.getElementById("btn-zoom-out").addEventListener("click", () => {
    controls.minDistance = Math.min(500, controls.minDistance + 2);
    controls.update();
  });

  // Smooth velocity-based movement variables
  let velocityX = 0;
  let velocityZ = 0;
  const maxSpeed = 0.5;
  const acceleration = 0.05;
  const damping = 0.90;

  function animate() {
    requestAnimationFrame(animate);
    updateLoop();
  }

  function updateLoop() {
    const { moveX, moveZ, sitAction } = getControlState();

    // Acceleration
    if (moveX !== 0) {
      velocityX += moveX * acceleration;
      velocityX = THREE.MathUtils.clamp(velocityX, -maxSpeed, maxSpeed);
    }
    if (moveZ !== 0) {
      velocityZ += moveZ * acceleration;
      velocityZ = THREE.MathUtils.clamp(velocityZ, -maxSpeed, maxSpeed);
    }

    // Damping
    velocityX *= damping;
    velocityZ *= damping;

    // Apply movement
    humanoid.position.x += velocityX;
    humanoid.position.z += velocityZ;

    // Animate legs
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

    // Sit toggle
    if (sitAction === 1) {
      leftLeg.rotation.x = -Math.PI / 2;
      rightLeg.rotation.x = -Math.PI / 2;
      humanoid.position.y = 0.3;
    } else {
      humanoid.position.y = 0.6;
    }

    // Indoor transition
    if (!indoorGroup.visible && humanoid.position.z < -160) {
      indoorGroup.visible = true;
    }

    updateActionState(moveX, moveZ, sitAction);
    recordStep();

    controls.update();
    renderer.render(scene, camera);
  }

  function sitActionToggle() {
    const current = getControlState();
    current.sitAction = (current.sitAction === 1) ? 0 : 1;
  }

  animate();
}
