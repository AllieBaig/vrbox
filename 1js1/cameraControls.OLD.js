
/*
  Purpose: Handle camera rotation controls for scene navigation
  Key features: Rotate camera left/right using buttons
  Dependencies: DOM buttons from index.html
  Related helpers: main.js, sceneSetup.js
  Function names: setupCameraControls
  MIT License: https://github.com/AllieBaig/vrbox/blob/main/LICENSE
  Timestamp: 2025-06-21 17:20 | File: js/cameraControls.js
*/

export function setupCameraControls(camera) {
  let rotationY = 0;

  const camLeftBtn = document.getElementById("camLeftBtn");
  const camRightBtn = document.getElementById("camRightBtn");

  if (camLeftBtn) {
    camLeftBtn.addEventListener("click", () => {
      rotationY -= Math.PI / 16;
      applyCameraRotation();
    });
  }

  if (camRightBtn) {
    camRightBtn.addEventListener("click", () => {
      rotationY += Math.PI / 16;
      applyCameraRotation();
    });
  }

  function applyCameraRotation() {
    const radius = 100;
    const center = { x: 0, z: -100 };
    const newX = center.x + radius * Math.sin(rotationY);
    const newZ = center.z + radius * Math.cos(rotationY);
    camera.position.set(newX, 80, newZ);
    camera.lookAt(center.x, 0, center.z);
  }
}
