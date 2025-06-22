
/*
  Purpose: Handle camera rotation and zoom controls for scene navigation
  Key features: Rotate camera left/right, zoom in/out using buttons
  Dependencies: DOM buttons from index.html
  Related helpers: main.js, sceneSetup.js
  Function names: setupCameraControls
  MIT License: https://github.com/AllieBaig/vrbox/blob/main/LICENSE
  Timestamp: 2025-06-21 17:30 | File: js/cameraControls.js
*/

export function setupCameraControls(camera) {
  let rotationY = 0;
  let radius = 100; // Default camera distance

  const center = { x: 0, z: -100 };

  const camLeftBtn = document.getElementById("camLeftBtn");
  const camRightBtn = document.getElementById("camRightBtn");
  const zoomInBtn = document.getElementById("zoomInBtn");
  const zoomOutBtn = document.getElementById("zoomOutBtn");

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

  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", () => {
      radius = Math.max(20, radius - 10);
      applyCameraRotation();
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", () => {
      radius = Math.min(200, radius + 10);
      applyCameraRotation();
    });
  }

  function applyCameraRotation() {
    const newX = center.x + radius * Math.sin(rotationY);
    const newZ = center.z + radius * Math.cos(rotationY);
    camera.position.set(newX, 80, newZ);
    camera.lookAt(center.x, 0, center.z);
  }
}
