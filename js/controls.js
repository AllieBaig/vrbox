
/*
  Purpose: Handle both keyboard and virtual joystick controls for humanoid character
  Key features: Analog continuous movement using touch drag, fallback to keyboard control
  Dependencies: DOM touchArea from index.html
  Related helpers: main.js, recorder.js
  Function names: setupControls, getControlState
  MIT License: https://github.com/AllieBaig/vrbox/blob/main/LICENSE
  Timestamp: 2025-06-21 19:05 | File: js/controls.js
*/

let moveX = 0;
let moveZ = 0;
let sitAction = 0;

// Internal raw touch drag offset
let dragOffsetX = 0;
let dragOffsetZ = 0;

export function setupControls() {
  // Keyboard controls (fallback)
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

  // Touch joystick
  const touchArea = document.getElementById("touchArea");
  if (touchArea) {
    let touchActive = false;
    let startX = 0;
    let startY = 0;

    touchArea.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      touchActive = true;
    });

    touchArea.addEventListener("touchmove", (e) => {
      if (!touchActive) return;
      const touch = e.touches[0];
      dragOffsetX = (touch.clientX - startX) / 50;  // Sensitivity divisor
      dragOffsetZ = (touch.clientY - startY) / 50;
      dragOffsetX = THREE.MathUtils.clamp(dragOffsetX, -1, 1);
      dragOffsetZ = THREE.MathUtils.clamp(dragOffsetZ, -1, 1);
    });

    touchArea.addEventListener("touchend", () => {
      dragOffsetX = 0;
      dragOffsetZ = 0;
      touchActive = false;
    });
  }
}

export function getControlState() {
  // If joystick active, override keyboard move values
  const effectiveMoveX = dragOffsetX !== 0 ? dragOffsetX : moveX;
  const effectiveMoveZ = dragOffsetZ !== 0 ? dragOffsetZ : moveZ;
  return { moveX: effectiveMoveX, moveZ: effectiveMoveZ, sitAction };
}
