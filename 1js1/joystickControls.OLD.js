
/* Purpose: Handle virtual joystick controls using nipplejs for VRBox v9.2 Key features: Maps analog joystick movement to RL movement state (moveX, moveZ) Dependencies: nipplejs.min.js (local) Related helpers: controls.js, main.js, recorder.js Function names: handleJoystick, getJoystickState MIT License: https://github.com/AllieBaig/vrbox/blob/main/LICENSE Timestamp: 2025-06-22 19:50 | File: js/joystickControls.js */

let moveX = 0; let moveZ = 0;

export function handleJoystick(containerId) { const joystickContainer = document.getElementById(containerId);

const manager = nipplejs.create({ zone: joystickContainer, mode: 'static', position: { left: '50%', top: '50%' }, color: 'blue', size: 120, multitouch: false });

manager.on('move', (evt, data) => { if (data && data.vector) { moveX = data.vector.x;  // X axis: sideways moveZ = -data.vector.y; // Invert Y axis for forward/backward moveX = clamp(moveX, -1, 1); moveZ = clamp(moveZ, -1, 1); } });

manager.on('end', () => { moveX = 0; moveZ = 0; }); }

export function getJoystickState() { return { moveX, moveZ }; }

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }


