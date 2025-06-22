
/*
  Purpose: Handle RL episode recording and export to JSON file
  Key features: Records state, actions, rewards per frame for reinforcement learning
  Dependencies: DOM export button, control state, humanoid position
  Related helpers: main.js, controls.js, humanoid.js
  Function names: setupRecorder, recordStep, exportEpisodes
  MIT License: https://github.com/AllieBaig/vrbox/blob/main/LICENSE
  Timestamp: 2025-06-21 17:25 | File: js/recorder.js
*/

let humanoidRef;
let benchesRef;
let sofaRef;
let bedRef;
let indoorGroupRef;
let currentEpisode = { states: [], actions: [], rewards: [] };

export function setupRecorder(humanoid, benches, sofa, bed, indoorGroup) {
  humanoidRef = humanoid;
  benchesRef = benches;
  sofaRef = sofa;
  bedRef = bed;
  indoorGroupRef = indoorGroup;
}

export function recordStep() {
  let nearBench = benchesRef.some(b => b.position.distanceTo(humanoidRef.position) < 2) ? 1 : 0;
  let nearSofa = indoorGroupRef.visible && sofaRef.position.distanceTo(humanoidRef.position) < 2 ? 1 : 0;
  let nearBed = indoorGroupRef.visible && bedRef.position.distanceTo(humanoidRef.position) < 2 ? 1 : 0;

  const state = [
    humanoidRef.position.x,
    humanoidRef.position.z,
    nearBench,
    nearSofa,
    nearBed
  ];

  const action = [
    currentMoveX,
    currentMoveZ,
    currentSitAction
  ];

  let reward = 0;
  if (currentSitAction === 1) {
    if (nearBench) reward = 1;
    if (nearSofa) reward = 2;
    if (nearBed) reward = 3;
  }

  currentEpisode.states.push(state);
  currentEpisode.actions.push(action);
  currentEpisode.rewards.push(reward);
}

// These are updated every frame by main.js to pass current action values
let currentMoveX = 0;
let currentMoveZ = 0;
let currentSitAction = 0;

export function updateActionState(moveX, moveZ, sitAction) {
  currentMoveX = moveX;
  currentMoveZ = moveZ;
  currentSitAction = sitAction;
}

export function exportEpisodes() {
  const dataStr = JSON.stringify([currentEpisode]);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "humanoid_episodes.json";
  a.click();
}
