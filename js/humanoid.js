
/*
  Purpose: Build simple 3D humanoid model composed of primitives (for RL training)
  Key features: Spheres, boxes, cylinders for head, torso, arms, legs
  Dependencies: three.module.min.js
  Related helpers: sceneSetup.js, controls.js, recorder.js
  Function names: createHumanoid
  MIT License: https://github.com/AllieBaig/vrbox/blob/main/LICENSE
  Timestamp: 2025-06-21 17:10 | File: js/humanoid.js
*/

export function createHumanoid(THREE) {
  const humanoid = new THREE.Group();

  // Torso
  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 0.5),
    new THREE.MeshLambertMaterial({ color: 0x00bfff })
  );
  torso.position.set(0, 1, 0);
  humanoid.add(torso);

  // Head
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshLambertMaterial({ color: 0xffcc99 })
  );
  head.position.set(0, 2.5, 0);
  humanoid.add(head);

  // Left Leg
  const leftLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 1.2, 16),
    new THREE.MeshLambertMaterial({ color: 0x0000ff })
  );
  leftLeg.position.set(-0.3, -0.1, 0);
  leftLeg.name = "leftLeg";
  humanoid.add(leftLeg);

  // Right Leg
  const rightLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 1.2, 16),
    new THREE.MeshLambertMaterial({ color: 0x0000ff })
  );
  rightLeg.position.set(0.3, -0.1, 0);
  rightLeg.name = "rightLeg";
  humanoid.add(rightLeg);

  // Left Arm
  const leftArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 1, 16),
    new THREE.MeshLambertMaterial({ color: 0xff0000 })
  );
  leftArm.position.set(-0.8, 1.5, 0);
  leftArm.rotation.z = Math.PI / 2;
  humanoid.add(leftArm);

  // Right Arm
  const rightArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 1, 16),
    new THREE.MeshLambertMaterial({ color: 0xff0000 })
  );
  rightArm.position.set(0.8, 1.5, 0);
  rightArm.rotation.z = Math.PI / 2;
  humanoid.add(rightArm);

  // Initial position
  humanoid.position.set(0, 0.6, 0);
  return humanoid;
}
