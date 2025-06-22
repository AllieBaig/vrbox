/*
  Purpose: Entry point for VRBox modular RL sandbox
  Key features: Imports scene setup, humanoid, controls, camera, and recorder
  Dependencies: three.module.min.js, ES Module imports
  Related helpers: sceneSetup.js, humanoid.js, controls.js, recorder.js, cameraControls.js
  Function names: (entry point only)
  MIT License: https://github.com/AllieBaig/vrbox/blob/main/LICENSE
  Timestamp: 2025-06-21 17:00 | File: js/main.js
*/

import * as THREE from './libs/three.module.min.js';
import { createScene, getSceneObjects } from './sceneSetup.js';
import { createHumanoid } from './humanoid.js';
import { setupControls, getControlState } from './controls.js';
import { setupCameraControls } from './cameraControls.js';
import { setupRecorder, recordStep, exportEpisodes, updateActionState } from './recorder.js';

document.addEventListener("DOMContentLoaded", () => {

  // Create scene and camera
  const { scene, camera, renderer } = createScene(THREE);
  
  // Create world objects
  const { benches, indoorGroup, sofa, bed } = getSceneObjects();

  // Create humanoid character
  const humanoid = createHumanoid(THREE);
  scene.add(humanoid);

  // Setup controls
  setupControls();

  // Setup camera control buttons
  setupCameraControls(camera);

  // Setup RL recorder
  setupRecorder(humanoid, benches, sofa, bed, indoorGroup);

  // Bind export button
  document.getElementById("exportButton").addEventListener("click", exportEpisodes);

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    const { moveX, moveZ, sitAction } = getControlState();

    // Move humanoid
    humanoid.position.x += moveX * 0.2;
    humanoid.position.z += moveZ * 0.2;

    // Simple walk animation
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

    // Sit action
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
      camera.lookAt(0, 0, -200);
    }

    updateActionState(moveX, moveZ, sitAction);
    recordStep();
    renderer.render(scene, camera);
  }

  animate();
});

