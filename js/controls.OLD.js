
/*
  Purpose: Handle keyboard and touch movement controls for humanoid character
  Key features: 4-direction movement (left, right, forward, backward), sit action
  Dependencies: DOM buttons from index.html
  Related helpers: main.js, humanoid.js, recorder.js, cameraControls.js
  Function names: setupControls, getControlState
  MIT License: https://github.com/AllieBaig/vrbox/blob/main/LICENSE
  Timestamp: 2025-06-21 17:15 | File: js/controls.js
*/

let moveX = 0;
let moveZ = 0;
let sitAction = 0;

export function setupControls() {
  // Keyboard controls
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

  // Touch controls for buttons
  bindButton("leftBtn", () => moveX = -1);
  bindButton("rightBtn", () => moveX = 1);
  bindButton("forwardBtn", () => moveZ = -1);
  bindButton("backwardBtn", () => moveZ = 1);
  bindButton("sitBtn", () => sitAction = 1);
}

function bindButton(id, action) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener("touchstart", action);
  btn.addEventListener("mousedown", action);
  btn.addEventListener("touchend", resetAll);
  btn.addEventListener("mouseup", resetAll);
}

function resetAll() {
  moveX = 0;
  moveZ = 0;
  sitAction = 0;
}

export function getControlState() {
  return { moveX, moveZ, sitAction };
}
