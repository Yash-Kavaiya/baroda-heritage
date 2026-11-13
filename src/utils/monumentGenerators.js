import * as THREE from "three";

// Shared materials helper to allow switching render styles (Realistic, Blueprint, Night Glow, Sandstone)
export function getMaterials(renderMode = "realistic", timeOfDay = "day") {
  const isNight = timeOfDay === "night" || timeOfDay === "twilight";

  if (renderMode === "blueprint") {
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });

    return {
      sandstone: wireMat,
      brick: wireMat,
      marble: wireMat,
      gold: new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true }),
      dome: wireMat,
      water: new THREE.MeshBasicMaterial({ color: 0x172554, transparent: true, opacity: 0.6 }),
      roof: wireMat,
      grass: new THREE.MeshBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.3 }),
      foliage: wireMat,
      metal: wireMat,
      aluminum: wireMat,
      glass: wireMat,
      stone: wireMat,
      glow: new THREE.MeshBasicMaterial({ color: 0x93c5fd })
    };
  }

  if (renderMode === "sandstone") {
    const clayMat = new THREE.MeshStandardMaterial({
      color: 0xd97736,
      roughness: 0.85,
      metalness: 0.05
    });
    const clayLight = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.7,
      metalness: 0.1
    });
    return {
      sandstone: clayMat,
      brick: clayMat,
      marble: clayLight,
      gold: clayLight,
      dome: clayLight,
      water: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 }),
      roof: clayMat,
      grass: new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 }),
      foliage: clayMat,
      metal: clayMat,
      aluminum: clayLight,
      glass: clayLight,
      stone: clayMat,
      glow: clayLight
    };
  }

  // Realistic Materials
  const sandstoneMat = new THREE.MeshStandardMaterial({
    color: 0xc4a47d, // Warm natural stone for the stylized heritage palette
    roughness: 0.75,
    metalness: 0.08
  });

  const buffSandstoneMat = new THREE.MeshStandardMaterial({
    color: 0xe2ba8a,
    roughness: 0.65,
    metalness: 0.05
  });

  const marbleMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.25,
    metalness: 0.1
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.25,
    metalness: 0.92,
    emissive: isNight ? 0xd97706 : 0x000000,
    emissiveIntensity: isNight ? 0.35 : 0.0
  });

  const copperDomeMat = new THREE.MeshStandardMaterial({
    color: 0x718c73, // Muted verdigris copper dome
    roughness: 0.5,
    metalness: 0.3
  });

  const waterMat = new THREE.MeshStandardMaterial({
    color: isNight ? 0x03223f : 0x0284c7,
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.88
  });

  const roofTileMat = new THREE.MeshStandardMaterial({
    color: 0x9a3412,
    roughness: 0.8
  });

  const grassMat = new THREE.MeshStandardMaterial({
    color: isNight ? 0x0f291e : 0x879668,
    roughness: 0.9
  });

  const foliageMat = new THREE.MeshStandardMaterial({
    color: isNight ? 0x064e3b : 0x627e50,
    roughness: 0.85
  });

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.4,
    metalness: 0.8
  });

  const aluminumMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.2,
    metalness: 0.95
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: isNight ? 0xfef08a : 0x67e8f9,
    roughness: 0.1,
    metalness: 0.5,
    emissive: isNight ? 0xfef08a : 0x000000,
    emissiveIntensity: isNight ? 0.8 : 0.0
  });

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.85
  });

  const glowLightMat = new THREE.MeshStandardMaterial({
    color: 0xffd166,
    emissive: 0xffa200,
    emissiveIntensity: isNight ? 1.5 : 0.4
  });

  return {
    sandstone: sandstoneMat,
    brick: buffSandstoneMat,
    marble: marbleMat,
    gold: goldMat,
    dome: copperDomeMat,
    water: waterMat,
    roof: roofTileMat,
    grass: grassMat,
    foliage: foliageMat,
    metal: metalMat,
    aluminum: aluminumMat,
    glass: glassMat,
    stone: stoneMat,
    glow: glowLightMat
  };
}

// ==========================================
// 1. LAXMI VILAS PALACE
// ==========================================
export function createLaxmiVilasPalace(renderMode, timeOfDay) {
  const group = new THREE.Group();
  const mats = getMaterials(renderMode, timeOfDay);

  // Grand Courtyard / Plinth
  const plinthGeo = new THREE.BoxGeometry(26, 0.8, 18);
  const plinth = new THREE.Mesh(plinthGeo, mats.stone);
  plinth.position.y = 0.4;
  plinth.receiveShadow = true;
  group.add(plinth);

  // Grass Lawns
  const lawnGeo = new THREE.BoxGeometry(25, 0.1, 8);
  const lawn = new THREE.Mesh(lawnGeo, mats.grass);
  lawn.position.set(0, 0.85, 4.5);
  lawn.receiveShadow = true;
  group.add(lawn);

  // Main Palace Central Wing
  const centerWingGeo = new THREE.BoxGeometry(10, 4.5, 6);
  const centerWing = new THREE.Mesh(centerWingGeo, mats.sandstone);
  centerWing.position.set(0, 3, -1);
  centerWing.castShadow = true;
  centerWing.receiveShadow = true;
  group.add(centerWing);

  // Upper Clerestory & Balconies
  const upperGeo = new THREE.BoxGeometry(8, 2, 5);
  const upper = new THREE.Mesh(upperGeo, mats.brick);
  upper.position.set(0, 6, -1);
  upper.castShadow = true;
  group.add(upper);

  // Grand Central Clock Tower (300 ft replica)
  const towerBaseGeo = new THREE.BoxGeometry(3, 8, 3);
  const towerBase = new THREE.Mesh(towerBaseGeo, mats.sandstone);
  towerBase.position.set(2, 6, 0);
  towerBase.castShadow = true;
  group.add(towerBase);

  // Clock Stage
  const clockStageGeo = new THREE.BoxGeometry(3.4, 2.2, 3.4);
  const clockStage = new THREE.Mesh(clockStageGeo, mats.brick);
  clockStage.position.set(2, 10.5, 0);
  clockStage.castShadow = true;
  group.add(clockStage);

  // 4 Clock Faces
  const clockDialGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 24);
  clockDialGeo.rotateX(Math.PI / 2);
  const clockNorth = new THREE.Mesh(clockDialGeo, mats.glass);
  clockNorth.position.set(2, 10.5, 1.72);
  group.add(clockNorth);

  const clockSouth = clockNorth.clone();
  clockSouth.position.set(2, 10.5, -1.72);
  group.add(clockSouth);

  const clockEast = clockNorth.clone();
  clockEast.rotation.y = Math.PI / 2;
  clockEast.position.set(3.72, 10.5, 0);
  group.add(clockEast);

  // Tower Steeples & Spire
  const steepleGeo = new THREE.ConeGeometry(2, 3.5, 8);
  const steeple = new THREE.Mesh(steepleGeo, mats.roof);
  steeple.position.set(2, 13, 0);
  steeple.castShadow = true;
  group.add(steeple);

  // Spire finial and Flagpole
  const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.5);
  const pole = new THREE.Mesh(poleGeo, mats.gold);
  pole.position.set(2, 15.2, 0);
  group.add(pole);

  // Tricolor Flag
  const flagGeo = new THREE.PlaneGeometry(1.2, 0.7);
  const flagMat = new THREE.MeshStandardMaterial({
    color: 0xff9933,
    side: THREE.DoubleSide
  });
  const flag = new THREE.Mesh(flagGeo, flagMat);
  flag.position.set(2.6, 16, 0);
  group.add(flag);

  // Central Grand Indo-Saracenic Ribbed Dome (Darbar Hall)
  const drumGeo = new THREE.CylinderGeometry(2.4, 2.6, 1.2, 16);
  const drum = new THREE.Mesh(drumGeo, mats.marble);
  drum.position.set(-2.5, 6, -1);
  group.add(drum);

  const domeGeo = new THREE.SphereGeometry(2.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const dome = new THREE.Mesh(domeGeo, mats.dome);
  dome.position.set(-2.5, 6.6, -1);
  dome.castShadow = true;
  group.add(dome);

  // Dome Kalash (Finial)
  const kalashGeo = new THREE.CylinderGeometry(0.1, 0.4, 1.2, 8);
  const kalash = new THREE.Mesh(kalashGeo, mats.gold);
  kalash.position.set(-2.5, 9.4, -1);
  group.add(kalash);

  // Left & Right Wings (Palace Quarters)
  const leftWingGeo = new THREE.BoxGeometry(6, 3.8, 5);
  const leftWing = new THREE.Mesh(leftWingGeo, mats.sandstone);
  leftWing.position.set(-8, 2.7, -1);
  leftWing.castShadow = true;
  group.add(leftWing);

  const rightWingGeo = new THREE.BoxGeometry(6, 3.8, 5);
  const rightWing = new THREE.Mesh(rightWingGeo, mats.sandstone);
  rightWing.position.set(8, 2.7, -1);
  rightWing.castShadow = true;
  group.add(rightWing);

  // Corner Octagonal Chhatris (Domed Pavilions)
  [-11, 11].forEach((xPos) => {
    const chhatriBase = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 4.5, 8), mats.brick);
    chhatriBase.position.set(xPos, 3, -1);
    group.add(chhatriBase);

    const chhatriDome = new THREE.Mesh(new THREE.SphereGeometry(1.3, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), mats.dome);
    chhatriDome.position.set(xPos, 5.25, -1);
    group.add(chhatriDome);
  });

  // Arched Colonnade Front Arcade (Cusped arches)
  for (let i = -4; i <= 4; i += 1.8) {
    const colGeo = new THREE.CylinderGeometry(0.18, 0.22, 2.8, 12);
    const col = new THREE.Mesh(colGeo, mats.marble);
    col.position.set(i, 2.2, 2.1);
    group.add(col);

    const archHead = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.15, 8, 16, Math.PI), mats.sandstone);
    archHead.position.set(i, 3.6, 2.1);
    group.add(archHead);
  }

  // Grand Italian Marble Fountain on Forecourt
  const fountainBaseGeo = new THREE.CylinderGeometry(2.5, 2.8, 0.4, 24);
  const fBase = new THREE.Mesh(fountainBaseGeo, mats.marble);
  fBase.position.set(0, 1.0, 5.5);
  group.add(fBase);

  const fWater = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, 0.1, 24), mats.water);
  fWater.position.set(0, 1.2, 5.5);
  group.add(fWater);

  const fPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 1.4), mats.marble);
  fPillar.position.set(0, 1.8, 5.5);
  group.add(fPillar);

  const fBowl = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.4, 0.35, 16), mats.marble);
  fBowl.position.set(0, 2.5, 5.5);
  group.add(fBowl);

  // Fountain animated spray particles
  const sprayCount = 40;
  const sprayGeo = new THREE.BufferGeometry();
  const sprayPos = new Float32Array(sprayCount * 3);
  for (let i = 0; i < sprayCount; i++) {
    const angle = (i / sprayCount) * Math.PI * 2;
    const r = 0.2 + Math.random() * 0.7;
    sprayPos[i * 3] = Math.cos(angle) * r;
    sprayPos[i * 3 + 1] = 2.6 + Math.random() * 1.2;
    sprayPos[i * 3 + 2] = 5.5 + Math.sin(angle) * r;
  }
  sprayGeo.setAttribute("position", new THREE.BufferAttribute(sprayPos, 3));
  const sprayMat = new THREE.PointsMaterial({
    color: 0xbae6fd,
    size: 0.18,
    transparent: true,
    opacity: 0.85
  });
  const fountainSpray = new THREE.Points(sprayGeo, sprayMat);
  fountainSpray.userData = { isFountainSpray: true };
  group.add(fountainSpray);

  // Royal Palm Trees along Driveway
  const palmCoords = [
    [-6, 4], [6, 4], [-8, 7], [8, 7], [-10, 2], [10, 2]
  ];
  palmCoords.forEach(([px, pz]) => {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 3.2, 8), mats.stone);
    trunk.position.set(px, 2.4, pz);
    group.add(trunk);

    const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.6, 6), mats.foliage);
    leaves.position.set(px, 4.3, pz);
    group.add(leaves);
  });

  // Windows with night glow
  for (let x = -7; x <= 7; x += 2.5) {
    if (Math.abs(x) > 1.5) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.1), mats.glass);
      win.position.set(x, 4.2, 2.05);
      group.add(win);
    }
  }

  return group;
}

// ==========================================
// 2. SURSAGAR LAKE & 111-FT GOLDEN SHIVA
// ==========================================
export function createSursagarLake(renderMode, timeOfDay) {
  const group = new THREE.Group();
  const mats = getMaterials(renderMode, timeOfDay);

  // Octagonal Stone Lake Embankment
  const outerWallGeo = new THREE.CylinderGeometry(14, 14.5, 1.2, 32);
  const outerWall = new THREE.Mesh(outerWallGeo, mats.stone);
  outerWall.position.y = 0.6;
  group.add(outerWall);

  // Stepped Stone Ghats (Steps leading into the water)
  for (let s = 1; s <= 3; s++) {
    const stepGeo = new THREE.CylinderGeometry(14 - s * 0.8, 14.5 - s * 0.8, 0.4, 32);
    const step = new THREE.Mesh(stepGeo, mats.brick);
    step.position.y = 0.6 - s * 0.15;
    group.add(step);
  }

  // Lake Water Basin (Rippling reflective surface)
  const waterGeo = new THREE.CylinderGeometry(12, 12, 0.6, 48);
  const water = new THREE.Mesh(waterGeo, mats.water);
  water.position.y = 0.35;
  water.userData = { isLakeWater: true };
  group.add(water);

  // Center Island Plinth
  const islandGeo = new THREE.CylinderGeometry(3.6, 4.2, 1.2, 24);
  const island = new THREE.Mesh(islandGeo, mats.stone);
  island.position.y = 0.8;
  island.receiveShadow = true;
  group.add(island);

  // Sacred Lotus Pedestal (Multi-tiered petals)
  const lotusBaseGeo = new THREE.CylinderGeometry(2.6, 3.2, 0.8, 16);
  const lotusBase = new THREE.Mesh(lotusBaseGeo, mats.marble);
  lotusBase.position.y = 1.6;
  group.add(lotusBase);

  // 111-ft Golden Lord Shiva Statue (Sarveshwar Mahadev)
  const shivaGroup = new THREE.Group();
  shivaGroup.position.y = 2.0;

  // Lotus Petals Layer
  const petals = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.3, 12, 16), mats.gold);
  petals.rotation.x = Math.PI / 2;
  petals.position.y = 0.3;
  shivaGroup.add(petals);

  // Legs / Seated Meditation Dhoti Base
  const lowerBodyGeo = new THREE.CylinderGeometry(1.1, 1.6, 1.8, 16);
  const lowerBody = new THREE.Mesh(lowerBodyGeo, mats.gold);
  lowerBody.position.y = 1.2;
  lowerBody.castShadow = true;
  shivaGroup.add(lowerBody);

  // Torso / Chest with sacred sacred yajnopavita thread
  const torsoGeo = new THREE.CylinderGeometry(1.2, 0.9, 2.2, 16);
  const torso = new THREE.Mesh(torsoGeo, mats.gold);
  torso.position.y = 2.9;
  torso.castShadow = true;
  shivaGroup.add(torso);

  // Shoulders & Head
  const headGeo = new THREE.SphereGeometry(0.7, 20, 16);
  const head = new THREE.Mesh(headGeo, mats.gold);
  head.position.y = 4.4;
  head.castShadow = true;
  shivaGroup.add(head);

  // Sacred Jatta (Tall Matted Hair Bundle)
  const jattaGeo = new THREE.CylinderGeometry(0.35, 0.65, 1.2, 12);
  const jatta = new THREE.Mesh(jattaGeo, mats.gold);
  jatta.position.y = 5.4;
  shivaGroup.add(jatta);

  // Crescent Moon (Chandra) on Jatta
  const moonGeo = new THREE.TorusGeometry(0.35, 0.08, 8, 16, Math.PI * 1.3);
  const moon = new THREE.Mesh(moonGeo, mats.marble);
  moon.position.set(-0.4, 5.5, 0.2);
  moon.rotation.z = 0.5;
  shivaGroup.add(moon);

  // Sacred Serpent (Vasuki) coiled around neck
  const snakeGeo = new THREE.TorusGeometry(0.7, 0.1, 8, 20);
  const snake = new THREE.Mesh(snakeGeo, mats.gold);
  snake.rotation.x = Math.PI / 2;
  snake.position.y = 3.9;
  shivaGroup.add(snake);

  // Right Hand in Abhaya Mudra (Blessing)
  const rArmGeo = new THREE.CylinderGeometry(0.2, 0.25, 1.8);
  const rArm = new THREE.Mesh(rArmGeo, mats.gold);
  rArm.position.set(1.4, 3.2, 0.4);
  rArm.rotation.z = -Math.PI / 4;
  shivaGroup.add(rArm);

  const palmGeo = new THREE.BoxGeometry(0.4, 0.6, 0.15);
  const palm = new THREE.Mesh(palmGeo, mats.gold);
  palm.position.set(1.9, 4.0, 0.7);
  shivaGroup.add(palm);

  // Left Arm holding the Trishul (Trident)
  const lArmGeo = new THREE.CylinderGeometry(0.2, 0.25, 1.8);
  const lArm = new THREE.Mesh(lArmGeo, mats.gold);
  lArm.position.set(-1.4, 2.9, 0.3);
  lArm.rotation.z = Math.PI / 6;
  shivaGroup.add(lArm);

  // Golden Trishul (Trident with Damru)
  const trishulPoleGeo = new THREE.CylinderGeometry(0.08, 0.08, 7.5);
  const trishulPole = new THREE.Mesh(trishulPoleGeo, mats.gold);
  trishulPole.position.set(-2.2, 4.8, 0.5);
  shivaGroup.add(trishulPole);

  // Center Prong of Trident
  const centerProng = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.4, 8), mats.gold);
  centerProng.position.set(-2.2, 8.8, 0.5);
  shivaGroup.add(centerProng);

  // Outer Curved Prongs
  const trishulArc = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.08, 8, 16, Math.PI), mats.gold);
  trishulArc.position.set(-2.2, 8.2, 0.5);
  trishulArc.rotation.z = Math.PI;
  shivaGroup.add(trishulArc);

  // Damru (Hourglass drum attached to trishul)
  const damru1 = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.4, 8), mats.gold);
  damru1.position.set(-2.2, 6.2, 0.5);
  const damru2 = damru1.clone();
  damru2.rotation.x = Math.PI;
  damru2.position.set(-2.2, 5.8, 0.5);
  shivaGroup.add(damru1, damru2);

  group.add(shivaGroup);

  // Underwater / Embankment Floodlights (Glowing at night)
  const lightAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  lightAngles.forEach((ang) => {
    const spot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.3, 12), mats.glow);
    spot.position.set(Math.cos(ang) * 4.8, 0.7, Math.sin(ang) * 4.8);
    group.add(spot);
  });

  // Perimeter Heritage Streetlamps along the Promenade
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2;
    const lx = Math.cos(ang) * 13.6;
    const lz = Math.sin(ang) * 13.6;

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.2), mats.metal);
    post.position.set(lx, 2.0, lz);
    group.add(post);

    const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), mats.glow);
    lantern.position.set(lx, 3.2, lz);
    group.add(lantern);
  }

  return group;
}

// ==========================================
// 3. SAYAJI BAUG & FLORAL CLOCK
// ==========================================
export function createSayajiBaug(renderMode, timeOfDay) {
  const group = new THREE.Group();
  const mats = getMaterials(renderMode, timeOfDay);

  // Expansive Botanical Garden Lawn
  const lawnGeo = new THREE.CylinderGeometry(15, 15.5, 0.6, 32);
  const lawn = new THREE.Mesh(lawnGeo, mats.grass);
  lawn.position.y = 0.3;
  lawn.receiveShadow = true;
  group.add(lawn);

  // Concentric Paved Walking Paths
  const pathGeo = new THREE.RingGeometry(9, 10.5, 32);
  pathGeo.rotateX(-Math.PI / 2);
  const path = new THREE.Mesh(pathGeo, mats.stone);
  path.position.y = 0.62;
  group.add(path);

  // ========================================
  // THE 20-FOOT FLORAL CLOCK
  // ========================================
  const clockGroup = new THREE.Group();
  clockGroup.position.set(0, 0.6, 0);

  // Slanted Floral Mound
  const moundGeo = new THREE.CylinderGeometry(4.2, 4.8, 0.8, 32);
  const mound = new THREE.Mesh(moundGeo, mats.grass);
  mound.position.y = 0.4;
  clockGroup.add(mound);

  // Stone Floral Clock Border Ring
  const ringGeo = new THREE.TorusGeometry(4.3, 0.25, 12, 32);
  ringGeo.rotateX(Math.PI / 2);
  const borderRing = new THREE.Mesh(ringGeo, mats.marble);
  borderRing.position.y = 0.8;
  clockGroup.add(borderRing);

  // 12 Floral Roman Numeral Bushes
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2;
    const fx = Math.sin(ang) * 3.4;
    const fz = -Math.cos(ang) * 3.4;

    const flowerBush = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 8, 8),
      new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? 0xef4444 : i % 2 === 0 ? 0xf59e0b : 0xa855f7,
        roughness: 0.8
      })
    );
    flowerBush.position.set(fx, 0.9, fz);
    clockGroup.add(flowerBush);
  }

  // Concentric Patterned Floral Carpet inside the clock
  const innerCarpet = new THREE.Mesh(
    new THREE.CircleGeometry(2.8, 24),
    new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 })
  );
  innerCarpet.rotation.x = -Math.PI / 2;
  innerCarpet.position.y = 0.82;
  clockGroup.add(innerCarpet);

  // Central Brass Mechanical Hub
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 0.3, 16), mats.gold);
  hub.position.y = 1.0;
  clockGroup.add(hub);

  // Hour Hand
  const hourHandGroup = new THREE.Group();
  hourHandGroup.position.set(0, 1.1, 0);
  const hourBlade = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 1.8), mats.metal);
  hourBlade.position.set(0, 0, -0.9);
  hourHandGroup.add(hourBlade);
  clockGroup.add(hourHandGroup);

  // Minute Hand (Longer)
  const minuteHandGroup = new THREE.Group();
  minuteHandGroup.position.set(0, 1.15, 0);
  const minuteBlade = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 2.7), mats.gold);
  minuteBlade.position.set(0, 0, -1.35);
  minuteHandGroup.add(minuteBlade);
  clockGroup.add(minuteHandGroup);

  // Attach reference for tick animation
  group.userData = {
    isFloralClock: true,
    hourHand: hourHandGroup,
    minuteHand: minuteHandGroup
  };

  group.add(clockGroup);

  // ========================================
  // SAYAJI BAUG MINIATURE TOY TRAIN
  // ========================================
  const trainGroup = new THREE.Group();
  // Circular train track
  const trackGeo = new THREE.RingGeometry(11.6, 12.0, 48);
  trackGeo.rotateX(-Math.PI / 2);
  const trackMesh = new THREE.Mesh(trackGeo, mats.metal);
  trackMesh.position.y = 0.63;
  group.add(trackMesh);

  // Toy Train Locomotive Engine
  const trainEngine = new THREE.Group();
  const boiler = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.4, 12), mats.metal);
  boiler.rotation.z = Math.PI / 2;
  boiler.position.y = 0.5;
  trainEngine.add(boiler);

  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.7), mats.sandstone);
  cab.position.set(-0.7, 0.65, 0);
  trainEngine.add(cab);

  const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.5), mats.gold);
  chimney.position.set(0.4, 1.1, 0);
  trainEngine.add(chimney);

  trainEngine.position.set(11.8, 0.65, 0);
  trainGroup.add(trainEngine);

  // 2 Passenger Carriages
  [-1.4, -2.8].forEach((offset) => {
    const carriage = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.65, 0.6), mats.brick);
    carriage.position.set(11.8 + offset * 0.2, 0.65, offset);
    trainGroup.add(carriage);
  });

  trainGroup.userData = { isToyTrain: true };
  group.add(trainGroup);

  // ========================================
  // SARDAR PATEL PLANETARIUM DOME
  // ========================================
  const planetariumGroup = new THREE.Group();
  planetariumGroup.position.set(-7, 0.6, -7);

  const pBase = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 1.0, 20), mats.stone);
  pBase.position.y = 0.5;
  planetariumGroup.add(pBase);

  const pDome = new THREE.Mesh(new THREE.SphereGeometry(2.2, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2), mats.marble);
  pDome.position.y = 1.0;
  planetariumGroup.add(pDome);

  // Planetary Brass Ring
  const saturnRing = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.1, 8, 32), mats.gold);
  saturnRing.rotation.x = Math.PI / 3;
  saturnRing.position.y = 2.2;
  planetariumGroup.add(saturnRing);

  group.add(planetariumGroup);

  // Shady Banyan & Jacaranda Trees
  const treePositions = [
    [-6, 5], [6, -6], [-9, 0], [7, 6], [0, 8]
  ];
  treePositions.forEach(([tx, tz]) => {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 2.2, 8), mats.stone);
    trunk.position.set(tx, 1.7, tz);
    group.add(trunk);

    const canopy = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6), mats.foliage);
    canopy.position.set(tx, 3.2, tz);
    group.add(canopy);
  });

  return group;
}

// ==========================================
// 4. KIRTI MANDIR (TEMPLE OF FAME)
// ==========================================
export function createKirtiMandir(renderMode, timeOfDay) {
  const group = new THREE.Group();
  const mats = getMaterials(renderMode, timeOfDay);

  // Elevated River Terrace Plinth (Vishwamitri Bank)
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(22, 1.0, 16), mats.stone);
  plinth.position.y = 0.5;
  group.add(plinth);

  // E-Shaped Cenotaph Wings (North, Central, South)
  // Back Spine
  const spine = new THREE.Mesh(new THREE.BoxGeometry(3, 4.2, 14), mats.sandstone);
  spine.position.set(-6, 2.6, 0);
  spine.castShadow = true;
  group.add(spine);

  // Center Hall & Shikhara Wing
  const centerWing = new THREE.Mesh(new THREE.BoxGeometry(9, 4.2, 4), mats.sandstone);
  centerWing.position.set(-1.5, 2.6, 0);
  centerWing.castShadow = true;
  group.add(centerWing);

  // North Wing (Fresco Gallery)
  const northWing = new THREE.Mesh(new THREE.BoxGeometry(8, 3.6, 3), mats.brick);
  northWing.position.set(-2, 2.3, 5.5);
  group.add(northWing);

  // South Wing (Memorial Gallery)
  const southWing = new THREE.Mesh(new THREE.BoxGeometry(8, 3.6, 3), mats.brick);
  southWing.position.set(-2, 2.3, -5.5);
  group.add(southWing);

  // Central Soaring 35-meter Shikhara (Temple Spire)
  const shikharaStages = 5;
  for (let i = 0; i < shikharaStages; i++) {
    const width = 3.6 - i * 0.5;
    const stage = new THREE.Mesh(new THREE.BoxGeometry(width, 1.2, width), mats.sandstone);
    stage.position.set(0, 4.8 + i * 1.15, 0);
    stage.castShadow = true;
    group.add(stage);
  }

  // Amalaka (Ribbed Stone Disc)
  const amalaka = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.5, 0.4, 16), mats.sandstone);
  amalaka.position.set(0, 10.7, 0);
  group.add(amalaka);

  // Golden Sun, Moon, and Earth Finial
  const globe = new THREE.Mesh(new THREE.SphereGeometry(0.75, 16, 16), mats.gold);
  globe.position.set(0, 11.6, 0);
  group.add(globe);

  // Sunburst Rays on the globe
  const sunRays = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.08, 8, 24), mats.gold);
  sunRays.position.set(0, 11.6, 0);
  group.add(sunRays);

  // Ornate Jali Balconies & Stone Pillars
  for (let z = -5; z <= 5; z += 2.5) {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 3.2), mats.marble);
    pillar.position.set(2.5, 2.1, z);
    group.add(pillar);
  }

  // Corner Chhatris on Wings
  [[-2, 6.5], [-2, -6.5], [-7, 6.5], [-7, -6.5]].forEach(([cx, cz]) => {
    const chDome = new THREE.Mesh(new THREE.SphereGeometry(1.0, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2), mats.marble);
    chDome.position.set(cx, 4.3, cz);
    group.add(chDome);
  });

  // Steps leading down to Vishwamitri River
  for (let s = 1; s <= 4; s++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(6, 0.25, 0.6), mats.stone);
    step.position.set(8 + s * 0.5, 0.5 - s * 0.12, 0);
    group.add(step);
  }

  return group;
}

// ==========================================
// 5. NYAY MANDIR (TEMPLE OF JUSTICE)
// ==========================================
export function createNyayMandir(renderMode, timeOfDay) {
  const group = new THREE.Group();
  const mats = getMaterials(renderMode, timeOfDay);

  // Foundation Plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(20, 0.8, 14), mats.stone);
  plinth.position.y = 0.4;
  group.add(plinth);

  // Main High Court Block
  const mainBlock = new THREE.Mesh(new THREE.BoxGeometry(16, 5.0, 10), mats.sandstone);
  mainBlock.position.set(0, 3.3, 0);
  mainBlock.castShadow = true;
  group.add(mainBlock);

  // Central Clock Tower
  const tower = new THREE.Mesh(new THREE.BoxGeometry(4.5, 8.5, 4.5), mats.brick);
  tower.position.set(0, 7.0, 2);
  tower.castShadow = true;
  group.add(tower);

  // Gothic Gable Roof & Rose Window Stage
  const gable = new THREE.Mesh(new THREE.ConeGeometry(3.2, 3.0, 4), mats.roof);
  gable.rotation.y = Math.PI / 4;
  gable.position.set(0, 12.5, 2);
  group.add(gable);

  // Byzantine Rose Window
  const roseWin = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.15, 12, 24), mats.gold);
  roseWin.position.set(0, 7.5, 4.3);
  group.add(roseWin);

  const glassInlay = new THREE.Mesh(new THREE.CircleGeometry(1.0, 16), mats.glass);
  glassInlay.position.set(0, 7.5, 4.28);
  group.add(glassInlay);

  // Tower Clock
  const clock = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.1, 20), mats.marble);
  clock.rotateX(Math.PI / 2);
  clock.position.set(0, 9.8, 4.3);
  group.add(clock);

  // Double-tier Pointed Arches (Indo-Saracenic Arcade)
  for (let x = -6; x <= 6; x += 2.4) {
    if (Math.abs(x) > 1.5) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 3.8), mats.marble);
      col.position.set(x, 2.7, 5.1);
      group.add(col);

      const arch = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.12, 8, 16, Math.PI), mats.sandstone);
      arch.position.set(x, 4.6, 5.1);
      group.add(arch);
    }
  }

  // Maharani Chimnabai Memorial Plinth at Entrance
  const statueBase = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 1.4), mats.marble);
  statueBase.position.set(0, 1.4, 6.2);
  group.add(statueBase);

  const statueBust = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 1.0, 12), mats.marble);
  statueBust.position.set(0, 2.5, 6.2);
  group.add(statueBust);

  return group;
}

// ==========================================
// 6. EME TEMPLE (DAKSHINAMURTI)
// ==========================================
export function createEMETemple(renderMode, timeOfDay) {
  const group = new THREE.Group();
  const mats = getMaterials(renderMode, timeOfDay);

  // Circular Military Lawn
  const lawn = new THREE.Mesh(new THREE.CylinderGeometry(14, 14.5, 0.6, 32), mats.grass);
  lawn.position.y = 0.3;
  group.add(lawn);

  // Stepped Circular Granite Foundation
  const basePlinth = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 9.2, 0.6, 32), mats.stone);
  basePlinth.position.y = 0.7;
  group.add(basePlinth);

  // Modernist Geodesic Aluminum Dome
  // Created with faceted icosahedron / polyhedral geometry for authentic geodesic look
  const domeGeo = new THREE.IcosahedronGeometry(5.2, 2);
  // Cut bottom half for hemisphere dome
  const domeMat = mats.aluminum;
  const dome = new THREE.Mesh(domeGeo, domeMat);
  dome.position.set(0, 4.2, 0);
  dome.scale.set(1.0, 0.85, 1.0);
  dome.castShadow = true;
  group.add(dome);

  // Crown Spire / Kalash (Harmonizing 5 Religions)
  const spireBase = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 1.2, 12), mats.gold);
  spireBase.position.set(0, 8.4, 0);
  group.add(spireBase);

  const goldenTower = new THREE.Mesh(new THREE.ConeGeometry(0.4, 2.2, 8), mats.gold);
  goldenTower.position.set(0, 9.8, 0);
  group.add(goldenTower);

  // Open Entrance Portico (Archway)
  const archPortico = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.5, 2.4), mats.marble);
  archPortico.position.set(0, 2.2, 4.8);
  group.add(archPortico);

  // Sacred Basalt Shiva Lingam inside
  const lingamBase = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 0.6, 16), mats.stone);
  lingamBase.position.set(0, 1.3, 0);
  group.add(lingamBase);

  const lingam = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.2, 16), new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.2 }));
  lingam.position.set(0, 2.1, 0);
  group.add(lingam);

  // Outdoor Sculpture Sanctuary (Ancient Gujarati idols from 6th-16th century)
  const idolCoords = [
    [-6, 4], [-7, 1], [-6, -4], [6, 4], [7, 1], [6, -4]
  ];
  idolCoords.forEach(([ix, iz]) => {
    const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), mats.stone);
    pedestal.position.set(ix, 0.8, iz);
    group.add(pedestal);

    const idol = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.0, 0.3), mats.stone);
    idol.position.set(ix, 1.7, iz);
    group.add(idol);
  });

  return group;
}

// ==========================================
// 7. CHAMPANER-PAVAGADH UNESCO HILL
// ==========================================
export function createPavagadhHill(renderMode, timeOfDay) {
  const group = new THREE.Group();
  const mats = getMaterials(renderMode, timeOfDay);

  // Massive Volcanic Rock Mountain Plateau
  const mtnGeo = new THREE.ConeGeometry(12, 10, 7);
  const mtn = new THREE.Mesh(mtnGeo, mats.sandstone);
  mtn.position.set(0, 5, 0);
  mtn.castShadow = true;
  group.add(mtn);

  // Tiered Cliffs (Machi Plateau)
  const cliff1 = new THREE.Mesh(new THREE.CylinderGeometry(6, 8, 3.5, 8), mats.stone);
  cliff1.position.set(0, 3.5, 0);
  group.add(cliff1);

  // Summit Pinnacle
  const pinnacle = new THREE.Mesh(new THREE.ConeGeometry(2.8, 4, 6), mats.sandstone);
  pinnacle.position.set(0, 9.5, -1);
  group.add(pinnacle);

  // Kalika Mata Temple on Peak
  const templeBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 2.4), mats.marble);
  templeBase.position.set(0, 11.2, -1);
  group.add(templeBase);

  const templeShikhara = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2.2, 4), mats.gold);
  templeShikhara.position.set(0, 12.8, -1);
  group.add(templeShikhara);

  // Fluttering Saffron Red Dhwaja (Sacred Flag)
  const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.5), mats.gold);
  flagPole.position.set(0, 14.2, -1);
  group.add(flagPole);

  const flag = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.8, 3), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
  flag.rotation.z = Math.PI / 2;
  flag.position.set(0.4, 14.5, -1);
  group.add(flag);

  // ========================================
  // PAVAGADH ROPEWAY (UDANKHATOLA CABLE CAR)
  // ========================================
  const ropewayGroup = new THREE.Group();

  // Lower & Upper Cable Pylons
  const pylon1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 5), mats.metal);
  pylon1.position.set(8, 2.5, 6);
  group.add(pylon1);

  const pylon2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 6), mats.metal);
  pylon2.position.set(2, 8.5, 0);
  group.add(pylon2);

  // Suspended Steel Cable (Line)
  const cableCurve = new THREE.LineCurve3(
    new THREE.Vector3(8, 4.8, 6),
    new THREE.Vector3(2, 11.2, 0)
  );
  const cableGeo = new THREE.TubeGeometry(cableCurve, 20, 0.04, 6, false);
  const cableMesh = new THREE.Mesh(cableGeo, mats.metal);
  group.add(cableMesh);

  // Cable Car Cabin 1 (Ascending)
  const cabin1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 0.7), mats.gold);
  cabin1.position.set(5.5, 7.5, 3.5);

  const cabinArm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6), mats.metal);
  cabinArm1.position.set(0, 0.6, 0);
  cabin1.add(cabinArm1);

  ropewayGroup.add(cabin1);

  // Cable Car Cabin 2 (Descending)
  const cabin2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 0.7), mats.sandstone);
  cabin2.position.set(3.5, 9.8, 1.5);

  const cabinArm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6), mats.metal);
  cabinArm2.position.set(0, 0.6, 0);
  cabin2.add(cabinArm2);

  ropewayGroup.add(cabin2);

  ropewayGroup.userData = { isRopeway: true, cabin1, cabin2 };
  group.add(ropewayGroup);

  // Ancient Fortified Ramparts & Atak Gate Ruins
  const wall = new THREE.Mesh(new THREE.BoxGeometry(8, 1.8, 1.2), mats.stone);
  wall.position.set(-4, 3.2, 3);
  wall.rotation.y = 0.4;
  group.add(wall);

  return group;
}

// ==========================================
// 8. KHANDERAO MARKET (VMC HEADQUARTERS)
// ==========================================
export function createKhanderaoMarket(renderMode, timeOfDay) {
  const group = new THREE.Group();
  const mats = getMaterials(renderMode, timeOfDay);

  // Plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(24, 0.8, 16), mats.stone);
  plinth.position.y = 0.4;
  group.add(plinth);

  // Main Palace-Market Facade (Songadh sandstone and red brick)
  const mainFacade = new THREE.Mesh(new THREE.BoxGeometry(18, 4.5, 5), mats.brick);
  mainFacade.position.set(0, 3, 2);
  mainFacade.castShadow = true;
  group.add(mainFacade);

  // Monumental Central Clock Tower
  const tower = new THREE.Mesh(new THREE.BoxGeometry(4.2, 9.5, 4.2), mats.sandstone);
  tower.position.set(0, 7.5, 2);
  tower.castShadow = true;
  group.add(tower);

  // Clock Stage with Roman Numeral Clock
  const clockDialGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.1, 24);
  clockDialGeo.rotateX(Math.PI / 2);
  const clockDial = new THREE.Mesh(clockDialGeo, mats.glass);
  clockDial.position.set(0, 10.2, 4.15);
  group.add(clockDial);

  // Clock Tower Steeple Cupola
  const steeple = new THREE.Mesh(new THREE.ConeGeometry(2.4, 3.2, 8), mats.roof);
  steeple.position.set(0, 13.8, 2);
  group.add(steeple);

  // Triple-Arch Gateway Portal
  for (let x = -2; x <= 2; x += 2) {
    const arch = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.14, 8, 16, Math.PI), mats.sandstone);
    arch.position.set(x, 2.6, 4.55);
    group.add(arch);
  }

  // Corner Octagonal Chhatris
  [-9, 9].forEach((xPos) => {
    const turret = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 6.0, 8), mats.brick);
    turret.position.set(xPos, 3.5, 2);
    group.add(turret);

    const cupola = new THREE.Mesh(new THREE.SphereGeometry(1.3, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), mats.dome);
    cupola.position.set(xPos, 6.5, 2);
    group.add(cupola);
  });

  // Inner Bazaar Courtyard with Colorful Market Stalls
  const courtyard = new THREE.Mesh(new THREE.BoxGeometry(18, 0.2, 8), mats.stone);
  courtyard.position.set(0, 0.8, -4);
  group.add(courtyard);

  // Colorful Market Canopies / Fruit & Flower Stalls
  const stallColors = [0xef4444, 0xf59e0b, 0x10b981, 0x3b82f6, 0xa855f7];
  for (let sx = -6; sx <= 6; sx += 3) {
    for (let sz = -6; sz <= -2; sz += 2.5) {
      const colIdx = Math.abs(Math.floor(sx + sz)) % stallColors.length;
      const canopy = new THREE.Mesh(
        new THREE.ConeGeometry(1.0, 0.6, 6),
        new THREE.MeshStandardMaterial({ color: stallColors[colIdx], roughness: 0.6 })
      );
      canopy.position.set(sx, 1.8, sz);
      group.add(canopy);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.0), mats.metal);
      pole.position.set(sx, 1.3, sz);
      group.add(pole);
    }
  }

  return group;
}

// ==========================================
// 9. BARODA MUSEUM & PICTURE GALLERY
// ==========================================
export function createBarodaMuseum(renderMode, timeOfDay) {
  const group = new THREE.Group();
  const mats = getMaterials(renderMode, timeOfDay);

  // Lush Botanical Garden Lawn Base
  const lawn = new THREE.Mesh(new THREE.BoxGeometry(26, 0.6, 18), mats.grass);
  lawn.position.y = 0.3;
  group.add(lawn);

  // Natural History Museum Wing (Left)
  const museumWing = new THREE.Mesh(new THREE.BoxGeometry(8, 4.5, 10), mats.brick);
  museumWing.position.set(-6, 2.8, 0);
  museumWing.castShadow = true;
  group.add(museumWing);

  // Picture Gallery Wing (Right)
  const galleryWing = new THREE.Mesh(new THREE.BoxGeometry(8, 4.5, 10), mats.brick);
  galleryWing.position.set(6, 2.8, 0);
  galleryWing.castShadow = true;
  group.add(galleryWing);

  // Victorian Gabled Roofs on both wings
  [-6, 6].forEach((xPos) => {
    const roof = new THREE.Mesh(new THREE.ConeGeometry(4.5, 2.2, 4), mats.roof);
    roof.rotation.y = Math.PI / 4;
    roof.position.set(xPos, 6.1, 0);
    group.add(roof);

    // Arched Windows along facade
    for (let z = -3; z <= 3; z += 2) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.8), mats.glass);
      win.position.set(xPos > 0 ? 10.05 : -10.05, 3.2, z);
      group.add(win);
    }
  });

  // Connecting Covered Ornamental Gallery Bridge
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(5.5, 2.4, 3.2), mats.sandstone);
  bridge.position.set(0, 3.2, 0);
  group.add(bridge);

  const bridgeArch = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.2, 8, 16, Math.PI), mats.marble);
  bridgeArch.position.set(0, 2.0, 1.62);
  group.add(bridgeArch);

  // ========================================
  // THE FAMOUS 22-METER BLUE WHALE SKELETON
  // ========================================
  const whaleGroup = new THREE.Group();
  whaleGroup.position.set(0, 1.2, 5.5);

  // Spine / Backbone Vertebrae
  const spineGeo = new THREE.CylinderGeometry(0.1, 0.16, 7.0, 16);
  spineGeo.rotateZ(Math.PI / 2);
  const spine = new THREE.Mesh(spineGeo, mats.marble);
  whaleGroup.add(spine);

  // Whale Skull & Jaw
  const skull = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.8, 8), mats.marble);
  skull.rotation.z = -Math.PI / 2;
  skull.position.set(-4.0, 0, 0);
  whaleGroup.add(skull);

  // Ribcage Rib Arches
  for (let rx = -2.5; rx <= 1.5; rx += 0.6) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.06, 8, 16, Math.PI), mats.marble);
    rib.rotation.y = Math.PI / 2;
    rib.rotation.x = Math.PI;
    rib.position.set(rx, -0.1, 0);
    whaleGroup.add(rib);
  }

  // Whale Fluke / Tail Fin
  const fin1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.8), mats.marble);
  fin1.position.set(3.8, 0, 0.4);
  fin1.rotation.y = 0.4;
  const fin2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.8), mats.marble);
  fin2.position.set(3.8, 0, -0.4);
  fin2.rotation.y = -0.4;
  whaleGroup.add(fin1, fin2);

  // Display Pedestals
  [-3, 0, 3].forEach((px) => {
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8), mats.metal);
    stand.position.set(px, -0.4, 0);
    whaleGroup.add(stand);
  });

  group.add(whaleGroup);

  return group;
}

// Master monument router
export function createMonument(placeId, renderMode = "realistic", timeOfDay = "day") {
  switch (placeId) {
    case "laxmi-vilas-palace":
      return createLaxmiVilasPalace(renderMode, timeOfDay);
    case "sursagar-lake":
      return createSursagarLake(renderMode, timeOfDay);
    case "sayaji-baug":
      return createSayajiBaug(renderMode, timeOfDay);
    case "kirti-mandir":
      return createKirtiMandir(renderMode, timeOfDay);
    case "nyay-mandir":
      return createNyayMandir(renderMode, timeOfDay);
    case "eme-temple":
      return createEMETemple(renderMode, timeOfDay);
    case "pavagadh-champaner":
      return createPavagadhHill(renderMode, timeOfDay);
    case "khanderao-market":
      return createKhanderaoMarket(renderMode, timeOfDay);
    case "baroda-museum":
      return createBarodaMuseum(renderMode, timeOfDay);
    default:
      return createLaxmiVilasPalace(renderMode, timeOfDay);
  }
}
