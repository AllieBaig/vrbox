
/*
  Purpose: Entry point for VRBox v7 with full free camera using OrbitControls
  Key features: Imports scene, humanoid, controls, recorder, OrbitControls free camera navigation
  Dependencies: three.module.min.js, OrbitControls.js, ES Module imports
  Related helpers: sceneSetup.js, humanoid.js, controls.js, recorder.js
  Function names: (entry point only)
  MIT License: https://github.com/AllieBaig/vrbox/blob/main/LICENSE
  Timestamp: 2025-06-21 18:10 | File: js/main.js
*/

import * as THREE from './libs/three.module.min.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { createScene, getSceneObjects } from './sceneSetup.js';
import { createHumanoid } from './humanoid.js';
import { setupControls, getControlState } from './controls.js';
import { setupRecorder, recordStep, exportEpisodes, updateActionState } from './recorder.js';

document.addEventListener("DOMContentLoaded", () => {

  // Create scene and camera
  const { scene, camera, renderer } = createScene(THREE);
  const { benches, indoorGroup, sofa, bed } = getSceneObjects();

  // Create humanoid character
  const humanoid = createHumanoid(THREE);
  scene.add(humanoid);

  // Setup controls
  setupControls();

  // Setup RL recorder
  setupRecorder(humanoid, benches, sofa, bed, indoorGroup);

  // Bind export button
  document.getElementById("exportButton").addEventListener("click", exportEpisodes);

  // ✅ Setup OrbitControls free camera
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, -100);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 1.0;
  controls.maxPolarAngle = Math.PI / 2; // Prevent camera going below ground
  controls.minDistance = 5;
  controls.maxDistance = 200;
  controls.update();

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    const { moveX, moveZ, sitAction } = getControlState();

    humanoid.position.x += moveX * 0.2;
    humanoid.position.z += moveZ * 0.2;

    const leftLeg = humanoid.getObjectByName("leftLeg");
    const rightLeg = humanoid.getObjectByName("rightLeg");

    if (moveX !== 0 || moveZ !== 0) {
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

  animate();
});
