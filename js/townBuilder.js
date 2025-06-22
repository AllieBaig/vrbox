
/**
 * Purpose: Build a simple low-poly town scene with basic geometries.
 * Key features: Adds houses, benches, trees, and streetlights with variation.
 * Dependencies: THREE, scene must already exist
 * Related helpers: sceneSetup.js, main.js
 * Function names: addHouses, addTrees, addBenches, addStreetlights
 * MIT License: https://github.com/AllieBaig/vrbox/blob/main/LICENSE
 * Timestamp: 2025-06-22 13:40 | File: js/townBuilder.js
 */

export function addHouses(scene) {
  const houseGeometry = new THREE.BoxGeometry(4, 3, 4);
  const roofGeometry = new THREE.ConeGeometry(2.8, 1.5, 4);

  for (let i = -40; i <= 40; i += 10) {
    for (let j = -40; j <= 40; j += 20) {
      const houseMat = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
      const roofMat = new THREE.MeshLambertMaterial({ color: 0x703c2a });

      const house = new THREE.Mesh(houseGeometry, houseMat);
      house.position.set(i, 1.5, j);

      const roof = new THREE.Mesh(roofGeometry, roofMat);
      roof.rotation.y = Math.PI / 4;
      roof.position.set(i, 4, j);

      scene.add(house);
      scene.add(roof);
    }
  }
}

export function addTrees(scene) {
  const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2);
  const leafGeometry = new THREE.ConeGeometry(1, 2.5);

  for (let i = -40; i <= 40; i += 15) {
    const treeMat = new THREE.MeshLambertMaterial({ color: 0x228b22 });
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x8b4513 });

    const trunk = new THREE.Mesh(trunkGeometry, trunkMat);
    trunk.position.set(i, 1, -15);

    const leaves = new THREE.Mesh(leafGeometry, treeMat);
    leaves.position.set(i, 3.5, -15);

    scene.add(trunk);
    scene.add(leaves);
  }
}

export function addBenches(scene) {
  const seatGeo = new THREE.BoxGeometry(2, 0.2, 0.5);
  const legGeo = new THREE.BoxGeometry(0.1, 0.5, 0.1);
  const benchMat = new THREE.MeshLambertMaterial({ color: 0x5c4033 });

  for (let i = -30; i <= 30; i += 15) {
    const seat = new THREE.Mesh(seatGeo, benchMat);
    seat.position.set(i, 0.2, 5);

    const leg1 = new THREE.Mesh(legGeo, benchMat);
    leg1.position.set(i - 0.9, 0.1, 5);

    const leg2 = new THREE.Mesh(legGeo, benchMat);
    leg2.position.set(i + 0.9, 0.1, 5);

    scene.add(seat, leg1, leg2);
  }
}

export function addStreetlights(scene) {
  const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 5);
  const lampGeo = new THREE.SphereGeometry(0.3, 8, 8);
  const poleMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
  const lampMat = new THREE.MeshBasicMaterial({ color: 0xffffaa });

  for (let i = -40; i <= 40; i += 20) {
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(i, 2.5, -8);

    const lamp = new THREE.Mesh(lampGeo, lampMat);
    lamp.position.set(i, 5.5, -8);

    scene.add(pole, lamp);
  }
}
