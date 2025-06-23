
/* Purpose: Unified keyboard control state for VRBox v9.3 Key features: Handles keyboard input, provides base control state Dependencies: joystickControls.js reads joystick state separately Related helpers: main.js, recorder.js Function names: setupControls, getControlState MIT License: https://github.com/AllieBaig/vrbox/blob/main/LICENSE Timestamp: 2025-06-22 20:20 | File: js/controls.js */

let moveX = 0; let moveZ = 0; let sitAction = 0;

export function setupControls() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveX = -1;
    if (e.key === 'ArrowRight') moveX = 1;
    if (e.key === 'ArrowUp') moveZ = -1;
    if (e.key === 'ArrowDown') moveZ = 1;
    if (e.key === 's') sitAction = 1;
  });

  document.addEventListener('keyup', (e) => {
    if (['ArrowLeft', 'ArrowRight'].includes(e.key)) moveX = 0;
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) moveZ = 0;
    if (e.key === 's') sitAction = 0;
  });
}

export function getControlState() {
  return { moveX, moveZ, sitAction };
}

export function toggleSitAction() {
  sitAction = sitAction === 1 ? 0 : 1;
}


