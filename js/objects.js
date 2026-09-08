// Interactive Game Objects: Golden Rings, Spring Pads, Dash Pads, Spikes, and Giant Goal Ring

class ObjectManager {
    constructor(scene, world = null) {
        this.scene = scene;
        this.world = world;
        this.rings = [];
        this.moons = [];
        this.springs = [];
        this.dashPads = [];
        this.spikes = [];
        this.sentinels = [];
        this.geysers = [];
        this.starPosts = [];
        this.scatteredRings = [];
        this.goalRing = null;
        this.sparkles = [];

        this.initMaterials();
        this.initRingFXPools();
        this.loadStageObjects('green_hill');
    }

    initMaterials() {
        // Celestial Golden Star Materials
        this.goldMat = new THREE.MeshStandardMaterial({
            color: 0xffea38,
            metalness: 0.88,
            roughness: 0.16,
            emissive: 0xffaa00,
            emissiveIntensity: 0.42
        });
        this.starMat = this.goldMat;
        this.starCoreMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.95
        });

        // Radiant Crescent Moon Materials
        this.moonMat = new THREE.MeshStandardMaterial({
            color: 0xfffae6,
            metalness: 0.65,
            roughness: 0.14,
            emissive: 0xffd700,
            emissiveIntensity: 0.65
        });
        this.moonHaloMat = new THREE.MeshBasicMaterial({
            color: 0xfff070,
            transparent: true,
            opacity: 0.35,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        // Bouncing Celestial Lotus Materials
        this.lotusPadMat = new THREE.MeshLambertMaterial({ color: 0x15803d });
        this.lotusPetalMat = new THREE.MeshLambertMaterial({ color: 0xf472b6, side: THREE.DoubleSide });
        this.lotusCoreMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            emissive: 0xca8a04,
            emissiveIntensity: 0.5,
            roughness: 0.25
        });

        // Vayu Wind Gale Pad Materials
        this.vayuStoneMat = new THREE.MeshLambertMaterial({ color: 0x163324, roughness: 0.7 });
        this.vayuGoldTrimMat = new THREE.MeshStandardMaterial({
            color: 0xfbbf24,
            metalness: 0.65,
            roughness: 0.3
        });
        this.vayuWindArrowMat = new THREE.MeshStandardMaterial({
            color: 0x00f0ff,
            emissive: 0x00b4d8,
            emissiveIntensity: 0.75,
            roughness: 0.2
        });

        // Asura Thorn Bramble Materials
        this.brambleMoundMat = new THREE.MeshLambertMaterial({ color: 0x142017, roughness: 0.85 });
        this.brambleWoodMat = new THREE.MeshLambertMaterial({ color: 0x271425, roughness: 0.7 });
        this.brambleTipMat = new THREE.MeshStandardMaterial({
            color: 0xdc2626,
            emissive: 0x991b1b,
            emissiveIntensity: 0.55,
            roughness: 0.25
        });

        // Asura Sentinel Patrol Minion Materials
        this.asuraSkinMat = new THREE.MeshLambertMaterial({ color: 0x1f5436 }); // Demonic emerald green skin
        this.asuraLoinclothMat = new THREE.MeshLambertMaterial({ color: 0x991b1b }); // Crimson cloth
        this.asuraGoldMat = new THREE.MeshStandardMaterial({
            color: 0xfbbf24,
            metalness: 0.7,
            roughness: 0.25
        });
        this.asuraEyeMat = new THREE.MeshBasicMaterial({ color: 0xff1500 });
        this.asuraClubMat = new THREE.MeshLambertMaterial({ color: 0x241722, roughness: 0.8 });

        // Naga Poison Geyser Materials
        this.geyserBaseMat = new THREE.MeshLambertMaterial({ color: 0x122418 });
        this.geyserWarningMat = new THREE.MeshBasicMaterial({
            color: 0x10b981,
            transparent: true,
            opacity: 0.55
        });
        this.geyserColumnMat = new THREE.MeshBasicMaterial({
            color: 0x059669,
            transparent: true,
            opacity: 0.78,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        this.geyserCoreMat = new THREE.MeshBasicMaterial({
            color: 0x34d399,
            transparent: true,
            opacity: 0.88,
            side: THREE.DoubleSide
        });

        this.springRedMat = this.lotusPetalMat;
        this.springYellowMat = this.lotusCoreMat;
        this.spikeMat = this.brambleTipMat;

        // Star Post Checkpoint Materials
        this.postPoleMat = new THREE.MeshStandardMaterial({
            color: 0xd0d0d8,
            metalness: 0.85,
            roughness: 0.25
        });
        this.postOrbBlueMat = new THREE.MeshStandardMaterial({
            color: 0x1188ff,
            emissive: 0x0044bb,
            metalness: 0.4,
            roughness: 0.2
        });
        this.postOrbRedMat = new THREE.MeshStandardMaterial({
            color: 0xff2222,
            emissive: 0xdd1100,
            metalness: 0.5,
            roughness: 0.2
        });
        this.postStarGoldMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            emissive: 0x664400,
            metalness: 0.8,
            roughness: 0.2
        });
    }

    createStarGeometry(points = 5, outerRadius = 0.52, innerRadius = 0.24, depth = 0.16) {
        const shape = new THREE.Shape();
        const step = Math.PI / points;
        for (let i = 0; i < 2 * points; i++) {
            const r = (i % 2 === 0) ? outerRadius : innerRadius;
            const a = i * step - Math.PI / 2;
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r;
            if (i === 0) shape.moveTo(x, y);
            else shape.lineTo(x, y);
        }
        shape.closePath();
        const geo = new THREE.ExtrudeGeometry(shape, {
            depth: depth,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 1,
            bevelSize: 0.05,
            bevelThickness: 0.05
        });
        geo.center();
        return geo;
    }

    createCrescentMoonGeometry(outerRadius = 0.95, innerRadius = 0.78, depth = 0.22) {
        const shape = new THREE.Shape();
        shape.absarc(0, 0, outerRadius, -Math.PI * 0.45, Math.PI * 0.45, false);
        shape.absarc(-0.32, 0, innerRadius, Math.PI * 0.42, -Math.PI * 0.42, true);
        shape.closePath();
        const geo = new THREE.ExtrudeGeometry(shape, {
            depth: depth,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 1,
            bevelSize: 0.07,
            bevelThickness: 0.07
        });
        geo.center();
        return geo;
    }

    initRingFXPools() {
        this.shockwavePool = [];
        this.sparklePool = [];
        this.lastShockwaveTime = 0;

        // 1. Sleek Compact Shockwave Pool (15 instances)
        // Reduced radius from 0.7 -> 0.38, tube from 0.05 -> 0.02
        const shockGeo = new THREE.TorusGeometry(0.38, 0.02, 8, 24);
        for (let i = 0; i < 15; i++) {
            const shockMat = new THREE.MeshBasicMaterial({
                color: 0xffea33,
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const mesh = new THREE.Mesh(shockGeo, shockMat);
            mesh.visible = false;
            this.scene.add(mesh);
            this.shockwavePool.push({
                mesh: mesh,
                material: shockMat,
                active: false,
                life: 0,
                maxLife: 0.14,      // Quick crisp 140ms pop (no lingering glare)
                startScale: 0.45,
                targetScale: 1.15   // Compact (1.15m max, down from 3.2m!)
            });
        }

        // 2. Delicate Flank Sparkle Particle Pool (60 instances)
        // Halved particle size from 0.13 -> 0.065
        const sparkleGeo = new THREE.OctahedronGeometry(0.065, 0);
        for (let i = 0; i < 60; i++) {
            const isAltColor = (i % 3 === 0);
            const sparkleMat = new THREE.MeshBasicMaterial({
                color: isAltColor ? 0x64ffda : 0xffe838,
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const mesh = new THREE.Mesh(sparkleGeo, sparkleMat);
            mesh.visible = false;
            this.scene.add(mesh);
            this.sparklePool.push({
                mesh: mesh,
                material: sparkleMat,
                active: false,
                life: 0,
                maxLife: 0.22,      // Fast 220ms dissipation
                vx: 0,
                vy: 0,
                vz: 0,
                rotX: 0,
                rotY: 0,
                rotZ: 0,
                baseScale: 1.0
            });
        }
    }

    spawnRingCollectFX(x, y, z) {
        const now = performance.now();

        // 1. Sleek Compact Shockwave (Throttled to max 1 per 90ms to prevent blinding glare when rushing through rows)
        if (now - this.lastShockwaveTime > 90) {
            this.lastShockwaveTime = now;
            const sw = this.shockwavePool.find(item => !item.active);
            if (sw) {
                sw.active = true;
                sw.life = sw.maxLife;
                sw.mesh.position.set(x, y, z);
                // Orient slightly tilted horizontally so it doesn't form a bullseye blocking forward vision
                sw.mesh.rotation.set(
                    Math.PI * 0.42,
                    0,
                    (Math.random() - 0.5) * 0.5
                );
                sw.mesh.scale.set(sw.startScale, sw.startScale, sw.startScale);
                sw.material.opacity = 0.45; // Soft opacity (down from 1.0)
                sw.mesh.visible = true;
            }
        }

        // 2. Lateral Flank Sparkles (Sliding/bursting OUTWARD to left and right flanks!)
        // 6 delicate particles that fan out laterally like speedboat wake, leaving center view 100% clear
        const count = 6;
        for (let i = 0; i < count; i++) {
            const sp = this.sparklePool.find(item => !item.active);
            if (!sp) break;

            sp.active = true;
            const duration = 0.16 + Math.random() * 0.08;
            sp.life = duration;
            sp.maxLife = duration;

            // Alternate side: left (-1) or right (+1)
            const side = (i % 2 === 0) ? -1 : 1;
            // Spawn slightly offset to flanks
            sp.mesh.position.set(x + side * 0.35, y, z);

            // Flank burst velocities:
            // High lateral velocity (vx) pushing away from center
            sp.vx = side * (4.2 + Math.random() * 4.0);
            // Gentle vertical float
            sp.vy = (Math.random() - 0.15) * 2.2;
            // Backward slipstream drift
            sp.vz = 2.0 + Math.random() * 4.0;

            sp.rotX = (Math.random() - 0.5) * 20.0;
            sp.rotY = (Math.random() - 0.5) * 20.0;
            sp.rotZ = (Math.random() - 0.5) * 20.0;

            const scale = 0.7 + Math.random() * 0.5;
            sp.baseScale = scale;
            sp.mesh.scale.set(scale, scale, scale);
            sp.material.opacity = 0.65;
            sp.mesh.visible = true;
        }
    }

    updateRingFX(dt) {
        // 1. Update Shockwaves (Fast fade & compact expansion)
        for (let i = 0; i < this.shockwavePool.length; i++) {
            const sw = this.shockwavePool[i];
            if (!sw.active) continue;

            sw.life -= dt;
            if (sw.life <= 0) {
                sw.active = false;
                sw.mesh.visible = false;
            } else {
                const progress = 1.0 - (sw.life / sw.maxLife);
                const curScale = THREE.MathUtils.lerp(sw.startScale, sw.targetScale, Math.pow(progress, 0.6));
                sw.mesh.scale.set(curScale, curScale, curScale);
                // Soft fade out
                sw.material.opacity = Math.max(0, 0.45 * (1.0 - Math.pow(progress, 1.8)));
            }
        }

        // 2. Update Sparkles (Lateral drift & smooth dissolution)
        for (let i = 0; i < this.sparklePool.length; i++) {
            const sp = this.sparklePool[i];
            if (!sp || !sp.active) continue;

            sp.life -= dt;
            if (sp.life <= 0) {
                sp.active = false;
                sp.mesh.visible = false;
            } else {
                const progress = 1.0 - (sp.life / sp.maxLife);
                sp.mesh.position.x += sp.vx * dt;
                sp.mesh.position.y += sp.vy * dt;
                sp.mesh.position.z += sp.vz * dt;

                // Air drag
                sp.vx *= 0.92;
                sp.vy = (sp.vy * 0.92) + (0.8 * dt);
                sp.vz *= 0.92;

                sp.mesh.rotation.x += sp.rotX * dt;
                sp.mesh.rotation.y += sp.rotY * dt;
                sp.mesh.rotation.z += sp.rotZ * dt;

                const curScale = sp.baseScale * Math.max(0, 1.0 - (progress * progress));
                sp.mesh.scale.set(curScale, curScale, curScale);
                sp.material.opacity = Math.max(0, 0.65 * (1.0 - progress));
            }
        }
    }

    resetRingFX() {
        if (this.shockwavePool) {
            this.shockwavePool.forEach(sw => {
                sw.active = false;
                sw.mesh.visible = false;
            });
        }
        if (this.sparklePool) {
            this.sparklePool.forEach(sp => {
                sp.active = false;
                sp.mesh.visible = false;
            });
        }
    }

    clearObjects() {
        const removeGroup = (arr) => {
            if (!arr) return;
            arr.forEach(item => {
                const obj = item.mesh || item;
                if (obj && obj.parent) {
                    obj.parent.remove(obj);
                } else if (obj) {
                    this.scene.remove(obj);
                }
            });
        };

        removeGroup(this.rings);
        removeGroup(this.springs);
        removeGroup(this.dashPads);
        removeGroup(this.spikes);
        removeGroup(this.sentinels);
        removeGroup(this.geysers);
        removeGroup(this.starPosts);
        removeGroup(this.scatteredRings);
        removeGroup(this.moons);

        if (this.goalRing && this.goalRing.group) {
            this.scene.remove(this.goalRing.group);
        }

        this.rings = [];
        this.moons = [];
        this.springs = [];
        this.dashPads = [];
        this.spikes = [];
        this.sentinels = [];
        this.geysers = [];
        this.starPosts = [];
        this.scatteredRings = [];
        this.goalRing = null;
    }

    loadStageObjects(stageId = 'green_hill') {
        this.clearObjects();
        this.currentStageId = stageId;

        if (stageId === 'chemical_plant') {
            this.spawnChemicalPlantObjects();
        } else if (stageId === 'hydrocity') {
            this.spawnHydrocityObjects();
        } else {
            this.spawnGreenHillObjects();
        }
    }

    spawnObjectsAlongTrack() {
        this.loadStageObjects('green_hill');
    }

    getSafeGroundY(x, z, fallbackY = 0.1) {
        const world = this.world || (window.game && window.game.world);
        if (world && world.getGroundHeight) {
            const gy = world.getGroundHeight(x, z);
            if (gy > -40) return gy + 0.1;
        }
        return fallbackY;
    }

    getSafeRingY(x, z, fallbackY = 1.8) {
        const world = this.world || (window.game && window.game.world);
        if (world && world.getGroundHeight) {
            const gy = world.getGroundHeight(x, z);
            if (gy > -40) return gy + 1.35;
        }
        return fallbackY;
    }

    spawnLoopRings(centerZ, radius = 16, groundY = 4, count = 8) {
        this.createLoopRings(0, groundY, centerZ, radius, -2.5, 2.5, count);
    }

    spawnChemicalPlantObjects() {
        // ========================================================
        // STAGE 2: CHEMICAL PLANT ZONE OBJECT PLACEMENT (4,800m)
        // ========================================================

        // --- 1. GOLDEN RINGS ---
        const chemRings = [
            // Starting Highway (z: 10 to -120)
            { startZ: -10, count: 6, spacing: 5, x: 0 },
            { startZ: -50, count: 8, spacing: 4.5, x: -4 },
            { startZ: -50, count: 8, spacing: 4.5, x: 4 },

            // Inside Glass Booster Tube #1 (z: -140 to -380, Warp Conduit)
            { startZ: -150, count: 12, spacing: 5.5, x: 0 },
            { startZ: -230, count: 10, spacing: 5.5, x: -2.5 },
            { startZ: -230, count: 10, spacing: 5.5, x: 2.5 },
            { startZ: -300, count: 12, spacing: 5.0, x: 0 },

            // Climbing Ramp over Mega Mack (z: -380 to -540)
            { startZ: -390, count: 16, spacing: 6.0, x: 0 },

            // High Skyway Catwalk (z: -540 to -680)
            { startZ: -550, count: 8, spacing: 5.5, x: -4 },
            { startZ: -550, count: 8, spacing: 5.5, x: 4 },
            { startZ: -610, count: 10, spacing: 5.0, x: 0 },

            // Steep Thrill Drop (z: -680 to -780)
            { startZ: -690, count: 12, spacing: 6.0, x: 0 },

            // Approach to Loop 1 & Loop 2 (z: -800 to -1150)
            { startZ: -800, count: 6, spacing: 4.5, x: 0 },
            { startZ: -920, count: 8, spacing: 5.0, x: 0 },
            { startZ: -1020, count: 6, spacing: 4.5, x: 0 },
            { startZ: -1120, count: 8, spacing: 5.0, x: 0 },

            // Low Bridge over Mega Mack (z: -1240 to -1540)
            { startZ: -1250, count: 14, spacing: 6.0, x: -3 },
            { startZ: -1250, count: 14, spacing: 6.0, x: 3 },
            { startZ: -1360, count: 18, spacing: 5.5, x: 0 },

            // Spiral Tower Climb (z: -1550 to -1750)
            { startZ: -1560, count: 16, spacing: 6.5, x: 0 },

            // Inside Glass Booster Tube #2 (z: -1760 to -2140)
            { startZ: -1770, count: 14, spacing: 5.0, x: 0 },
            { startZ: -1860, count: 12, spacing: 5.5, x: -2.5 },
            { startZ: -1860, count: 12, spacing: 5.5, x: 2.5 },
            { startZ: -1950, count: 16, spacing: 5.0, x: 0 },
            { startZ: -2050, count: 12, spacing: 5.0, x: 0 },

            // Split Catwalks (z: -2160 to -2440)
            { startZ: -2180, count: 12, spacing: 6.0, x: -12 },
            { startZ: -2180, count: 12, spacing: 6.0, x: 12 },
            { startZ: -2320, count: 10, spacing: 5.5, x: 0 },

            // Mega Mack Spillway & Coaster Drop (z: -2460 to -2840)
            { startZ: -2480, count: 16, spacing: 6.0, x: 0 },
            { startZ: -2620, count: 14, spacing: 5.5, x: -4 },
            { startZ: -2620, count: 14, spacing: 5.5, x: 4 },

            // Chemical Superhighway Sprint (z: -2860 to -4000)
            // 3-lane trails of speed rings
            { startZ: -2880, count: 20, spacing: 5.0, x: 0 },
            { startZ: -3000, count: 20, spacing: 5.0, x: -8 },
            { startZ: -3000, count: 20, spacing: 5.0, x: 8 },
            { startZ: -3150, count: 24, spacing: 5.0, x: 0 },
            { startZ: -3300, count: 22, spacing: 5.0, x: -6 },
            { startZ: -3300, count: 22, spacing: 5.0, x: 6 },
            { startZ: -3450, count: 25, spacing: 5.0, x: 0 },
            { startZ: -3620, count: 20, spacing: 5.0, x: -7 },
            { startZ: -3620, count: 20, spacing: 5.0, x: 7 },
            { startZ: -3750, count: 24, spacing: 5.0, x: 0 },
            { startZ: -3900, count: 18, spacing: 5.0, x: 0 },

            // Final Loop 3 & Finish Colosseum (z: -4020 to -4780)
            { startZ: -4050, count: 12, spacing: 5.0, x: 0 },
            { startZ: -4240, count: 16, spacing: 5.5, x: 0 },
            { startZ: -4360, count: 18, spacing: 5.0, x: -6 },
            { startZ: -4360, count: 18, spacing: 5.0, x: 6 },
            { startZ: -4500, count: 22, spacing: 5.0, x: 0 },
            { startZ: -4650, count: 16, spacing: 5.0, x: 0 }
        ];

        chemRings.forEach(row => {
            for (let i = 0; i < row.count; i++) {
                const z = row.startZ - i * row.spacing;
                const ringY = this.getSafeRingY(row.x, z, row.y || 1.8);
                this.createRing(row.x, ringY, z);
            }
        });

        // --- 1.1 MULTIDIMENSIONAL 3D STAR FORMATIONS (ขบวนดาว 3 มิติในนครขีดขิน) ---
        // 1. Slalom S-Curve Waves along the royal causeways
        this.createSlalomRings(-20, -110, 16, 4.5, 0);       // Starting marble bridge
        this.createSlalomRings(-1250, -1370, 18, 5.0, 5);    // Low bridge over Anodat sea
        this.createSlalomRings(-2880, -3100, 24, 6.0, 8);    // Kishkindha grand sprint lane 1
        this.createSlalomRings(-3450, -3680, 24, 6.0, 8);    // Kishkindha grand sprint lane 2

        // 2. Parabolic Jump Arcs over obstacles & ramps
        this.createJumpArc(0, -90, -115, 6, 4.5);            // Arc over start hazards
        this.createJumpArc(0, -745, -775, 7, 5.5);           // Arc over drop hazards
        this.createJumpArc(0, -1305, -1335, 7, 5.5);         // Arc over Anodat bridge hazards
        this.createJumpArc(0, -2565, -2595, 7, 5.5);         // Arc over spillway hazards
        this.createJumpArc(0, -3665, -3695, 7, 5.5);         // Arc over superhighway hazards

        // 3. Wedge & Diamond Constellation Clusters
        this.createWedgeCluster(0, -370, 0, 4.0, 2.5);       // Leading into ascent ramp
        this.createDiamondCluster(0, -610, 24, 3.5);         // High Skyway palace vista
        this.createDiamondCluster(0, -1450, 5, 3.5);         // Suspension bridge checkpoint
        this.createWedgeCluster(0, -1740, 28, 4.0, 2.5);     // Leading into high crystal canopy
        this.createWedgeCluster(0, -4060, 8, 4.0, 2.5);      // Leading into final loop
        this.createDiamondCluster(0, -4600, 8, 4.5);         // Finish arena approach

        // Loop Arcs for Loop 1 (z: -880), Loop 2 (z: -1080), and Loop 3 (z: -4160)
        this.spawnLoopRings(-880, 16, 4);
        this.spawnLoopRings(-1080, 18, 4);
        this.spawnLoopRings(-4160, 18, 4);

        // --- CRESCENT MOONS (พระจันทร์เสี้ยวเรืองแสง) ---
        this.createMoon(0, 24, -390);     // Ramp above Anodat Moat
        this.createMoon(0, 38, -610);     // High Skyway Catwalk
        this.createMoon(0, 36, -1900);    // Sacred Crystal Canopy Way #2 Exit
        this.createMoon(0, 26, -3550);    // Kishkindha Highway Leap
        this.createMoon(0, 24, -4600);    // Grand Throne Colosseum Sprint

        // --- 2. DASH BOOSTER PADS ---
        const chemDashPads = [
            // Entrance and inside Glass Booster Tube #1
            [0, 0.1, -125, 0, -1, 58],
            [0, 0.1, -210, 0, -1, 60],
            [0, 0.1, -300, 0, -1, 62],

            // Launch onto climbing ramp
            [0, 0.1, -370, 0, -1, 62],

            // Launch into Loop 1 and Loop 2
            [0, 4.1, -820, 0, -1, 65],
            [0, 4.1, -1020, 0, -1, 65],

            // Entrance and inside Glass Booster Tube #2
            [0, 28.1, -1730, 0, -1, 62],
            [0, 28.1, -1880, 0, -1, 65],
            [0, 28.1, -2020, 0, -1, 68],

            // High-speed Chemical Superhighway Boosters
            [-6, 8.1, -2880, 0, -1, 68], [6, 8.1, -2880, 0, -1, 68],
            [0, 8.1, -3100, 0, -1, 70],
            [-8, 8.1, -3320, 0, -1, 70], [8, 8.1, -3320, 0, -1, 70],
            [0, 8.1, -3550, 0, -1, 72],
            [-6, 8.1, -3780, 0, -1, 72], [6, 8.1, -3780, 0, -1, 72],

            // Approach into Loop 3
            [0, 8.1, -4080, 0, -1, 68],

            // Final sprint into Finish Colosseum
            [-5, 8.1, -4400, 0, -1, 72], [5, 8.1, -4400, 0, -1, 72],
            [0, 8.1, -4600, 0, -1, 75]
        ];

        chemDashPads.forEach(pos => {
            const padY = this.getSafeGroundY(pos[0], pos[2], pos[1]);
            const dirX = pos[3] !== undefined ? pos[3] : 0;
            const dirZ = pos[4] !== undefined ? pos[4] : -1;
            const force = pos[5] !== undefined ? pos[5] : 58;
            this.createDashPad(pos[0], padY, pos[2], dirX, dirZ, force);
        });

        // --- 3. INDUSTRIAL PISTON SPRINGS ---
        const chemSprings = [
            [-8, 0.1, -360, 24],  // High jump onto high catwalk
            [8, 0.1, -360, 24],
            [-6, 24.1, -660, 22],
            [6, 24.1, -660, 22],
            [-7, 5.1, -1240, 20],
            [7, 5.1, -1240, 20],
            [0, 5.1, -1530, 26],  // Boost up spiral climb
            [-10, 28.1, -2140, 20],
            [10, 28.1, -2140, 20],
            [0, 8.1, -2680, 22],
            [-8, 8.1, -3450, 24],
            [8, 8.1, -3450, 24],
            [0, 8.1, -4320, 22]
        ];

        chemSprings.forEach(sp => {
            const sprY = this.getSafeGroundY(sp[0], sp[2], sp[1]);
            this.createSpring(sp[0], sprY, sp[2], sp[3]);
        });

        // --- 4. CHECKPOINT STARPOSTS (4 Checkpoints in Chemical Plant) ---
        this.createStarPost(-10, 24, -600);   // Checkpoint 1: Skyway Catwalk
        this.createStarPost(9, 5, -1450);     // Checkpoint 2: Suspension Bridge
        this.createStarPost(-9, 28, -2380);   // Checkpoint 3: Split Catwalk Exit
        this.createStarPost(10, 8, -3600);    // Checkpoint 4: Superhighway Midpoint

        // --- 5. HAZARD SPIKES ---
        const chemSpikes = [
            [-5, 0.1, -100], [5, 0.1, -100],
            [0, 24.1, -580],
            [-5, 4.1, -760], [5, 4.1, -760],
            [0, 4.1, -940],
            [-4, 5.1, -1320], [4, 5.1, -1320],
            [0, 28.1, -1820],
            [-6, 28.1, -2260], [6, 28.1, -2260],
            [0, 8.1, -2580],
            [-6, 8.1, -3200], [6, 8.1, -3200],
            [0, 8.1, -3680],
            [-6, 8.1, -4280], [6, 8.1, -4280]
        ];

        chemSpikes.forEach(pos => {
            const spikeY = this.getSafeGroundY(pos[0], pos[2], pos[1]);
            this.createSpikes(pos[0], spikeY, pos[2]);
        });

        // --- 6. PATROLLING ASURA SENTINELS (ทหารยักษ์ลาดตระเวนสะพานขีดขิน) ---
        this.createAsuraSentinel(0, 0.1, -70, 5.0, 2.2);        // Marble bridge sentinel
        this.createAsuraSentinel(0, 24.1, -590, 4.0, 2.0);      // High skyway catwalk
        this.createAsuraSentinel(0, 5.1, -1300, 4.5, 2.4);      // Low Anodat bridge
        this.createAsuraSentinel(0, 5.1, -1420, 4.5, 2.2);      // Low Anodat bridge
        this.createAsuraSentinel(-12, 28.1, -2280, 2.5, 2.0);   // Split catwalk left
        this.createAsuraSentinel(12, 28.1, -2280, 2.5, 2.0);    // Split catwalk right
        this.createAsuraSentinel(0, 8.1, -3050, 6.0, 2.6);      // Kishkindha superhighway
        this.createAsuraSentinel(0, 8.1, -3500, 6.0, 2.6);      // Kishkindha superhighway
        this.createAsuraSentinel(0, 8.1, -3820, 6.0, 2.8);      // Approach to finish arena

        // --- 7. NAGA POISON GEYSERS (เสาไอพิษพญานาคคูเมือง) ---
        this.createNagaGeyser(-6, 0.1, -40, 0.0);
        this.createNagaGeyser(6, 0.1, -40, 2.0);
        this.createNagaGeyser(-5, 5.1, -1350, 0.5);
        this.createNagaGeyser(5, 5.1, -1350, 2.5);
        this.createNagaGeyser(-7, 8.1, -3250, 1.0);
        this.createNagaGeyser(7, 8.1, -3250, 3.0);
        this.createNagaGeyser(0, 8.1, -4450, 1.5);

        // --- 8. GIANT GOAL RING (At center of Kishkindha Royal Throne Arena, groundY = 8) ---
        this.createGoalRing(0, 8, -4800, 8.5);
    }

    spawnHydrocityObjects() {
        // ========================================================
        // STAGE 3: HYDROCITY ZONE OBJECT PLACEMENT (5,000m)
        // ========================================================

        // --- 1. GOLDEN RINGS (Over 480+ rings following aqueducts, drops, and water loops) ---
        const hydroRings = [
            // Starting Aqueduct (z: 20 to -200)
            { startZ: -10, count: 6, spacing: 5.0, x: 0 },
            { startZ: -40, count: 8, spacing: 4.5, x: -4 },
            { startZ: -40, count: 8, spacing: 4.5, x: 4 },
            { startZ: -90, count: 12, spacing: 5.0, x: 0 },

            // Climbing Slope to Palace Aqueduct (z: -220 to -400)
            { startZ: -230, count: 16, spacing: 6.0, x: 0 },
            { startZ: -260, count: 10, spacing: 5.5, x: -3.5 },
            { startZ: -260, count: 10, spacing: 5.5, x: 3.5 },

            // Upper Palace Aqueduct High Road (z: -400 to -600)
            { startZ: -410, count: 12, spacing: 5.5, x: 0 },
            { startZ: -480, count: 10, spacing: 5.0, x: -3 },
            { startZ: -480, count: 10, spacing: 5.0, x: 3 },

            // Drop into Hydro-Tube #1 (z: -600 to -760)
            { startZ: -610, count: 12, spacing: 5.5, x: 0 },

            // Inside Glass Hydro-Tube #1 (Water Flume) (z: -760 to -1200)
            { startZ: -770, count: 16, spacing: 5.0, x: 0 },
            { startZ: -860, count: 14, spacing: 5.5, x: -2.5 },
            { startZ: -860, count: 14, spacing: 5.5, x: 2.5 },
            { startZ: -950, count: 18, spacing: 5.0, x: 0 },
            { startZ: -1060, count: 14, spacing: 5.0, x: 0 },

            // Atlantis Colosseum & Loop #1 Approach (z: -1200 to -1420)
            { startZ: -1220, count: 10, spacing: 5.0, x: -3 },
            { startZ: -1220, count: 10, spacing: 5.0, x: 3 },
            { startZ: -1300, count: 12, spacing: 5.5, x: 0 },

            // Post Loop #1 Sprint (z: -1480 to -1780)
            { startZ: -1500, count: 14, spacing: 5.5, x: 0 },
            { startZ: -1600, count: 12, spacing: 5.0, x: -4 },
            { startZ: -1600, count: 12, spacing: 5.0, x: 4 },
            { startZ: -1700, count: 10, spacing: 5.5, x: 0 },

            // Water-Surface Sprintfast (Skimming across water) (z: -1800 to -2200)
            { startZ: -1810, count: 18, spacing: 5.5, x: 0 },
            { startZ: -1920, count: 14, spacing: 5.0, x: -3.5 },
            { startZ: -1920, count: 14, spacing: 5.0, x: 3.5 },
            { startZ: -2020, count: 16, spacing: 5.0, x: 0 },
            { startZ: -2120, count: 12, spacing: 5.5, x: 0 },

            // Rising Ramp to High Aqueduct (z: -2200 to -2400)
            { startZ: -2220, count: 14, spacing: 6.0, x: 0 },
            { startZ: -2320, count: 10, spacing: 5.5, x: 0 },

            // High Sunken Aqueduct & Drop to Tube #2 (z: -2400 to -2760)
            { startZ: -2410, count: 12, spacing: 5.0, x: -3 },
            { startZ: -2410, count: 12, spacing: 5.0, x: 3 },
            { startZ: -2500, count: 14, spacing: 5.5, x: 0 },
            { startZ: -2620, count: 12, spacing: 5.5, x: 0 },

            // Deep Abyss Hydro-Tube #2 (z: -2760 to -3300)
            { startZ: -2780, count: 16, spacing: 5.0, x: 0 },
            { startZ: -2880, count: 14, spacing: 5.5, x: -2.5 },
            { startZ: -2880, count: 14, spacing: 5.5, x: 2.5 },
            { startZ: -2980, count: 18, spacing: 5.0, x: 0 },
            { startZ: -3100, count: 16, spacing: 5.0, x: 0 },
            { startZ: -3200, count: 12, spacing: 5.5, x: 0 },

            // Climbing Rapids to Loop #2 (z: -3300 to -3620)
            { startZ: -3320, count: 14, spacing: 6.0, x: 0 },
            { startZ: -3420, count: 12, spacing: 5.5, x: -3.5 },
            { startZ: -3420, count: 12, spacing: 5.5, x: 3.5 },
            { startZ: -3520, count: 14, spacing: 5.0, x: 0 },

            // High Shelf Descent to Canal (z: -3680 to -4100)
            { startZ: -3700, count: 12, spacing: 5.5, x: 0 },
            { startZ: -3820, count: 16, spacing: 6.0, x: 0 },
            { startZ: -3940, count: 14, spacing: 5.5, x: -3 },
            { startZ: -3940, count: 14, spacing: 5.5, x: 3 },

            // Trident Grand Canal Sprint (z: -4100 to -4600)
            { startZ: -4120, count: 16, spacing: 5.5, x: 0 },
            { startZ: -4220, count: 14, spacing: 5.0, x: -4 },
            { startZ: -4220, count: 14, spacing: 5.0, x: 4 },
            { startZ: -4320, count: 18, spacing: 5.0, x: 0 },
            { startZ: -4450, count: 16, spacing: 5.5, x: 0 },

            // Final sprint into Poseidon Colosseum (z: -4600 to -4970)
            { startZ: -4620, count: 14, spacing: 5.0, x: -3 },
            { startZ: -4620, count: 14, spacing: 5.0, x: 3 },
            { startZ: -4720, count: 16, spacing: 5.0, x: 0 },
            { startZ: -4820, count: 14, spacing: 5.0, x: 0 },
            { startZ: -4900, count: 10, spacing: 5.0, x: 0 }
        ];

        hydroRings.forEach(row => {
            for (let i = 0; i < row.count; i++) {
                const rz = row.startZ - i * row.spacing;
                const rx = row.x;
                const ry = this.getSafeRingY(rx, rz);
                this.createRing(rx, ry, rz);
            }
        });

        // 360° Water Loop 1 & Loop 2 Ring Arcs
        this.spawnLoopRings(-1450, 16, 4, 10);
        this.spawnLoopRings(-3650, 18, 18, 10);

        // --- CRESCENT MOONS (พระจันทร์เสี้ยวเรืองแสง) ---
        this.createMoon(0, 30, -420);     // Water Aqueduct Leap
        this.createMoon(0, 36, -1550);    // Temple Waterfall Lookout
        this.createMoon(0, 28, -3100);    // Undersea Ruins Apex
        this.createMoon(0, 24, -4800);    // Final Lagoon Ascent

        // --- 2. HYDRO BOOSTERS (Cyan Water Jet Accelerators) ---
        const hydroBoosters = [
            [0, 0.1, -180, 0, -1, 55],       // Launch up Palace Aqueduct slope
            [0, 12.1, -580, 0, -1, 58],      // Launch into Hydro-Tube #1
            [0, 4.1, -850, 0, -1, 55],       // Inside Hydro-Tube #1 mid
            [0, 4.1, -1050, 0, -1, 55],      // Inside Hydro-Tube #1 exit
            [0, 4.1, -1400, 0, -1, 60],      // Boost into Water Loop #1!
            [0, 3.6, -1850, 0, -1, 58],      // Water-skimming hydro sprint!
            [0, 3.6, -2100, 0, -1, 55],      // Launch up rising ramp out of water
            [0, 16.1, -2560, 0, -1, 58],     // Launch into Deep Abyss Hydro-Tube #2
            [0, 6.1, -2850, 0, -1, 55],      // Inside Hydro-Tube #2
            [0, 6.1, -3150, 0, -1, 55],      // Inside Hydro-Tube #2
            [0, 6.1, -3280, 0, -1, 58],      // Launch up Climbing Rapids
            [0, 18.1, -3600, 0, -1, 60],     // Boost into Water Loop #2!
            [0, 18.1, -3780, 0, -1, 55],     // Launch down thrilling canal descent
            [0, 8.1, -4150, 0, -1, 58],      // Trident Grand Canal Sprint #1
            [0, 8.1, -4400, 0, -1, 58],      // Trident Grand Canal Sprint #2
            [0, 8.1, -4750, 0, -1, 55]       // Final Sprint into Poseidon Colosseum!
        ];

        hydroBoosters.forEach(dp => {
            const padY = this.getSafeGroundY(dp[0], dp[2], dp[1]);
            this.createDashPad(dp[0], padY, dp[2], dp[3], dp[4], dp[5]);
        });

        // --- 3. WATER BUBBLE GEYSERS (Vertical Water Spout Springs) ---
        const hydroSprings = [
            [-5, 0.1, -200, 22],
            [5, 0.1, -200, 22],
            [0, 12.1, -450, 24],
            [-6, 4.1, -1180, 26],
            [6, 4.1, -1180, 26],
            [0, 3.6, -1950, 20],
            [-8, 16.1, -2480, 22],
            [8, 16.1, -2480, 22],
            [0, 6.1, -2740, 24],
            [-7, 18.1, -3520, 22],
            [7, 18.1, -3520, 22],
            [0, 8.1, -4300, 22]
        ];

        hydroSprings.forEach(sp => {
            const sprY = this.getSafeGroundY(sp[0], sp[2], sp[1]);
            this.createSpring(sp[0], sprY, sp[2], sp[3]);
        });

        // --- 4. CHECKPOINT STARPOSTS (4 Checkpoints in Hydrocity) ---
        this.createStarPost(-9, 4, -1100);    // Checkpoint 1: Hydro-Tube #1 Exit
        this.createStarPost(9, 3.5, -2150);   // Checkpoint 2: Water-Surface Sprint
        this.createStarPost(-9, 6, -3250);    // Checkpoint 3: Hydro-Tube #2 Exit
        this.createStarPost(9, 8, -4250);     // Checkpoint 4: Trident Grand Canal

        // --- 5. HAZARD NAVAL SPIKES ---
        const hydroSpikes = [
            [-5, 0.1, -120], [5, 0.1, -120],
            [0, 12.1, -540],
            [-4, 4.1, -800], [4, 4.1, -800],
            [-4, 4.1, -1000], [4, 4.1, -1000],
            [0, 4.1, -1350],
            [-6, 3.6, -1880], [6, 3.6, -1880],
            [-6, 3.6, -2060], [6, 3.6, -2060],
            [0, 16.1, -2520],
            [-5, 6.1, -2950], [5, 6.1, -2950],
            [0, 18.1, -3740],
            [-6, 8.1, -4250], [6, 8.1, -4250],
            [-6, 8.1, -4550], [6, 8.1, -4550]
        ];

        hydroSpikes.forEach(pos => {
            const spikeY = this.getSafeGroundY(pos[0], pos[2], pos[1]);
            this.createSpikes(pos[0], spikeY, pos[2]);
        });

        // --- 6. GIANT GOAL RING (At center of Poseidon Grand Colosseum, groundY = 8) ---
        this.createGoalRing(0, 8, -5000, 8.5);
    }

    spawnGreenHillObjects() {
        // =========================================================================
        // DYNAMIC MULTIDIMENSIONAL STAR FORMATIONS (ป่าหิมพานต์ 5,600m)
        // Slalom S-Curves, Airborne Jump Arcs, Diamond Constellations & Wedge Clusters
        // =========================================================================

        // --- ZONE 1: Starting Sacred Avenue (z: 0 to -120) ---
        this.createWedgeCluster(0, -12, -1);
        this.createSlalomRings(-30, 48, 10, 4.5, 1.5);
        this.createJumpArc(0, 0, -80, 24, 8.5, 7); // Parabolic Jump Arc over start gap into Spring Pad!

        // --- ZONE 2: Sacred Slope Climbing (z: -120 to -240, rising from 0 to 22m) ---
        this.createTwinLaneRings(-4.5, 4.5, -125, 8, 6.5);
        this.createDiamondCluster(0, -185, 3.8);
        this.createJumpArc(0, 0, -205, 26, 7.5, 7); // Cresting the hill into high plateau

        // --- ZONE 3: High Plateau & Asura Brambles (z: -240 to -360) ---
        this.createWedgeCluster(0, -245, -1);
        this.createSlalomRings(-265, 55, 11, 5.2, 1.5); // Weaving between brambles at -315
        this.createDiamondCluster(0, -325, 3.8);
        this.createJumpArc(0, 0, -340, 26, 9.0, 7); // Jump Arc over plateau launch into Crescent Moon!

        // --- ZONE 4: Downhill Thrill Drop (z: -360 to -460, plunging 22m down to 4m) ---
        this.createSlalomRings(-368, 72, 13, 5.5, 2.0); // High-speed downhill S-curve!
        this.createJumpArc(0, 0, -445, 20, 6.5, 6); // Jump Arc over valley floor brambles

        // --- ZONE 5: Loop #1 & Sacred Cascade Bridge (z: -460 to -690) ---
        this.createLoopRings(0, 4, -510, 16, -2.5, 2.5, 12); // Inside Loop #1 360° Ring Arc!
        this.createWedgeCluster(0, -542, -1);
        this.createSlalomRings(-575, 75, 12, 4.5, 1.5); // Weaving across the turquoise cascade bridge
        this.createDiamondCluster(0, -660, 3.8);

        // --- ZONE 6: Mid-Course Himavanta Highway (z: -690 to -1080) ---
        this.createTwinLaneRings(-4.5, 4.5, -700, 7, 6.0);
        this.createJumpArc(0, 0, -735, 22, 7.0, 6); // Jump Arc over bramble at -740
        this.createSlalomRings(-770, 85, 13, 5.2, 1.5);
        this.createWedgeCluster(0, -870, -1);
        this.createTwinLaneRings(-5.0, 5.0, -895, 8, 6.5);
        this.createDiamondCluster(0, -960, 4.0);
        this.createJumpArc(0, 0, -980, 25, 7.5, 7);

        // --- ZONE 7: Mountain Ramp Climb & Corkscrew Ridge (z: -1080 to -1360, rising to 26m) ---
        this.createSlalomRings(-1085, 95, 14, 4.8, 1.5); // Climbing up mountain ramp
        this.createDiamondCluster(0, -1195, 4.0); // Checkpoint 2 vista
        this.createTwinLaneRings(-4.5, 4.5, -1220, 7, 6.0);
        this.createJumpArc(0, 0, -1265, 22, 7.0, 6); // Jump Arc over brambles at -1270
        this.createWedgeCluster(0, -1300, -1);

        // --- ZONE 8: Sky Islands & Ravine Bridges (z: -1360 to -1680) ---
        this.createSlalomRings(-1370, 75, 11, 4.5, 1.5);
        // Split routes onto Sky Islands
        for (let i = 0; i < 6; i++) {
            const z = -1510 - i * 6.5;
            this.createRing(-10, this.getSafeRingY(-10, z), z);
            this.createRing(10, this.getSafeRingY(10, z), z);
        }
        this.createRingArc(0, 36, -1630, 10, 20); // Massive Parabolic Jump Arc across Sky Ravine!

        // --- ZONE 9: Rollercoaster Dip & Rise (z: -1680 to -2000) ---
        this.createSlalomRings(-1685, 105, 14, 5.5, 2.0); // Sweeping 40m drop rollercoaster weave
        this.createDiamondCluster(0, -1810, 4.2);
        this.createWedgeCluster(0, -1880, -1);
        this.createJumpArc(0, 0, -1905, 22, 7.5, 6); // Jump Arc onto hill
        this.createSlalomRings(-1930, 65, 10, 4.5, 1.5);

        // --- ZONE 10: Loop #2 Entrance & 360° Arc (z: -2000 to -2240) ---
        this.createLoopRings(0, 6, -2120, 18, -2.5, 2.5, 12); // Inside Loop #2 360° Ring Arc!
        this.createWedgeCluster(0, -2155, -1);
        this.createTwinLaneRings(-4.5, 4.5, -2185, 7, 6.0);

        // --- ZONE 11: Winding Emerald Canyon (z: -2240 to -2540) ---
        this.createSlalomRings(-2240, 95, 14, 5.4, 2.5); // Tight curves hugging canyon walls
        this.createJumpArc(0, 0, -2315, 22, 7.0, 6); // Jump Arc over canyon brambles at -2320
        this.createDiamondCluster(0, -2390, 4.0);
        this.createSlalomRings(-2430, 75, 11, 4.5, 1.5);

        // --- ZONE 12: Supersonic Finish Speedway (z: -2540 to -2840) ---
        this.createTwinLaneRings(-5.0, 5.0, -2545, 9, 6.5);
        this.createJumpArc(0, 0, -2635, 22, 7.0, 6); // Jump Arc over brambles at -2640
        this.createWedgeCluster(0, -2675, -1);
        this.createSlalomRings(-2710, 85, 13, 5.0, 1.5);
        this.createDiamondCluster(0, -2810, 4.0);

        // --- ZONE 13: Sky Highway & Cloud Aqueduct (z: -2900 to -3400) ---
        this.createSlalomRings(-2910, 115, 15, 5.5, 2.0); // High sky highway weave
        this.createDiamondCluster(0, -3050, 4.2);
        // Cloud Path Split (Left & Right)
        for (let i = 0; i < 7; i++) {
            const z = -3190 - i * 6.5;
            this.createRing(-11, this.getSafeRingY(-11, z), z);
            this.createRing(11, this.getSafeRingY(11, z), z);
        }
        this.createJumpArc(0, 0, -3345, 32, 11.0, 8); // Grand Sky Launch Jump Arc into Crescent Moon!

        // --- ZONE 14: Giant Loop #3 & Coastal Waterfall (z: -3400 to -3700) ---
        this.createLoopRings(0, 10, -3530, 20, -2.5, 2.5, 14); // Inside Giant Loop #3 360° Ring Arc!
        this.createWedgeCluster(0, -3575, -1);
        this.createSlalomRings(-3620, 70, 10, 4.5, 1.5);

        // --- ZONE 15: Coastal Sunset Lagoon & Water Bridge (z: -3700 to -4250) ---
        this.createSlalomRings(-3715, 95, 14, 5.2, 2.0);
        this.createJumpArc(0, 0, -3795, 24, 7.0, 6); // Jump Arc over lagoon brambles at -3800
        this.createDiamondCluster(0, -3880, 4.2);
        this.createTwinLaneRings(-4.5, 4.5, -3950, 9, 6.5);
        this.createSlalomRings(-4060, 95, 14, 5.0, 2.0);
        this.createJumpArc(0, 0, -4195, 22, 7.0, 6);

        // --- ZONE 16: Rollercoaster Triple S-Curves (z: -4250 to -4850) ---
        this.createSlalomRings(-4250, 125, 18, 6.0, 2.5); // High-speed acrobatic slalom wave!
        this.createJumpArc(0, 0, -4355, 22, 7.0, 6); // Jump Arc over brambles at -4360
        this.createDiamondCluster(0, -4480, 4.2);
        this.createSlalomRings(-4530, 105, 15, 5.5, 2.0);
        this.createWedgeCluster(0, -4670, -1);

        // --- ZONE 17: Grand Supersonic Speedway (z: -4850 to -5450) ---
        this.createTwinLaneRings(-5.0, 5.0, -4870, 8, 6.5);
        this.createJumpArc(0, 0, -4975, 24, 7.0, 6); // Jump Arc over brambles at -4980
        this.createDiamondCluster(0, -5040, 4.2);
        this.createSlalomRings(-5080, 105, 15, 5.4, 2.0);
        this.createJumpArc(0, 0, -5175, 22, 7.0, 6); // Jump Arc over brambles at -5180
        this.createWedgeCluster(0, -5230, -1);
        this.createTwinLaneRings(-4.5, 4.5, -5260, 9, 6.5);

        // --- ZONE 18: Victory Pavilion & Himavanta Pinnacle (z: -5450 to -5600) ---
        this.createDiamondCluster(0, -5465, 4.0);
        this.createSlalomRings(-5485, 60, 10, 4.2, 1.5);
        this.createRingArc(0, 16, -5570, 8.5, 16); // Royal Triumphal Ring Arc into Giant Goal Ring!

        // --- CRESCENT MOONS (พระจันทร์เสี้ยวเรืองแสง หาวเป็นดาวเป็นเดือน) ---
        this.createMoon(0, 32, -95);      // Apex of Spring Launch #1
        this.createMoon(-18, 26, -140);   // Secret Left Sky Platform
        this.createMoon(0, 30, -345);     // High Plateau Lookout
        this.createMoon(0, 34, -1200);    // Above Corkscrew Ridge Checkpoint
        this.createMoon(0, 42, -1630);    // Over Sky Island Gap
        this.createMoon(0, 30, -2260);    // Peak of Emerald Canyon Checkpoint
        this.createMoon(0, 38, -3360);    // Sky Cloud Launch
        this.createMoon(0, 24, -3900);    // Coastal Lagoon Vista
        this.createMoon(0, 26, -5050);    // Grand Speedway Apex
        this.createMoon(0, 22, -5570);    // Final Triumph before Giant Goal Ring!

        // --- 2. STAR POST CHECKPOINTS (5 Milestone Checkpoints along 5,600m Course) ---
        this.createStarPost(-3.8, 4, -470, 0);   // Checkpoint 1: Loop 1 Valley Floor (z: -470)
        this.createStarPost(-3.8, 26, -1200, 1); // Checkpoint 2: Corkscrew Ridge
        this.createStarPost(-3.8, 10, -2260, 2); // Checkpoint 3: Emerald Canyon Entry
        this.createStarPost(-4.0, 10, -3560, 3); // Checkpoint 4: Coastal Lagoon (After Loop 3)
        this.createStarPost(-4.0, 10, -4720, 4); // Checkpoint 5: Grand Speedway Entry

        // --- 3. SPRING PADS ---
        this.createSpring(0, 0, -85, 32);              // Launch over start gap
        this.createSpring(-10, 0, -115, 30);           // Launch to left secret route
        this.createSpring(0, 22, -345, 34);            // Launch off plateau
        this.createSpring(10, 22, -260, 32);           // Launch to right high route
        this.createSpring(-8, 5, -670, 30);            // Bridge boost spring
        this.createSpring(12, 26, -1340, 34);          // Launch to upper sky island
        this.createSpring(-10, 28, -1630, 32);         // Left sky gap bounce
        this.createSpring(10, 28, -1630, 32);          // Right sky gap bounce
        this.createSpring(0, 4, -1910, 32);            // Launch over roller hill
        this.createSpring(-6, 10, -2360, 30);          // Canyon secret route bounce
        this.createSpring(0, 28, -3360, 34);           // Launch down into Loop #3 approach
        this.createSpring(-11, 28, -3280, 32);         // Left cloud bounce
        this.createSpring(11, 28, -3280, 32);          // Right cloud bounce
        this.createSpring(0, 8, -4510, 34);            // Rollercoaster triple-s wave bounce

        // --- 4. DASH BOOST PADS (Balanced 42 - 55 speed) ---
        this.createDashPad(0, 0, -30, 0, -1, 42);       // Straight boost
        this.createDashPad(0, 22, -280, 0, -1, 45);     // Plateau speedrun
        this.createDashPad(0, 4, -460, 0, -1, 48);      // Charge into loop 1!
        this.createDashPad(0, 5, -570, 0, -1, 44);      // Bridge dash
        this.createDashPad(0, 8, -700, 0, -1, 46);      // Sprint into highway
        this.createDashPad(0, 8, -850, 0, -1, 48);      // Accelerator 1
        this.createDashPad(0, 8, -980, 0, -1, 48);      // Accelerator 2
        this.createDashPad(0, 8, -1070, 0, -1, 48);     // Mountain ramp launch
        this.createDashPad(0, 4, -1870, 0, -1, 46);     // Coaster dip surge
        this.createDashPad(0, 12, -2020, 0, -1, 50);    // Charge into loop 2!
        this.createDashPad(0, 10, -2270, 0, -1, 46);    // Canyon dash
        this.createDashPad(0, 12, -2560, 0, -1, 48);    // Speedway accelerator 1
        this.createDashPad(0, 12, -2700, 0, -1, 50);    // Speedway accelerator 2
        this.createDashPad(0, 12, -2880, 0, -1, 48);    // Launch into Sky Highway
        this.createDashPad(0, 28, -3120, 0, -1, 50);    // Sky Highway sprint
        this.createDashPad(0, 10, -3480, 0, -1, 52);    // Mega launch into Giant Loop 3!
        this.createDashPad(0, 10, -3660, 0, -1, 46);    // Coastal sprint
        this.createDashPad(0, 14, -4220, 0, -1, 48);    // Rollercoaster surge
        this.createDashPad(0, 10, -4880, 0, -1, 50);    // Grand speedway booster 1
        this.createDashPad(0, 10, -5080, 0, -1, 52);    // Grand speedway booster 2
        this.createDashPad(0, 10, -5280, 0, -1, 54);    // Grand speedway booster 3
        this.createDashPad(0, 12, -5480, 0, -1, 55);    // Final sprint into Victory Colosseum Arena!

        // --- 5. SPIKE HAZARDS ---
        this.createSpikes(-5, 0, -65);
        this.createSpikes(5, 0, -65);
        this.createSpikes(0, 22, -315);
        this.createSpikes(-4, 5, -610);
        this.createSpikes(4, 5, -645);
        this.createSpikes(0, 8, -740);
        this.createSpikes(-6, 8, -910);
        this.createSpikes(6, 8, -910);
        this.createSpikes(-5, 26, -1270);
        this.createSpikes(5, 26, -1270);
        this.createSpikes(0, 26, -1450);
        this.createSpikes(-4, 28, -1570);
        this.createSpikes(4, 28, -1570);
        this.createSpikes(0, 10, -2320);
        this.createSpikes(-6, 12, -2640);
        this.createSpikes(6, 12, -2640);
        this.createSpikes(0, 12, -2760);
        this.createSpikes(-5, 28, -3160);
        this.createSpikes(5, 28, -3160);
        this.createSpikes(0, 10, -3800);
        this.createSpikes(-5, 14, -4060);
        this.createSpikes(5, 14, -4200);
        this.createSpikes(0, 30, -4360);
        this.createSpikes(-6, 10, -4980);
        this.createSpikes(6, 10, -4980);
        this.createSpikes(0, 10, -5180);

        // --- 6. PATROLLING ASURA SENTINELS (ทหารยักษ์ตรวจการณ์ - กระโดดเหยียบได้ + พุ่งชนได้) ---
        this.createAsuraSentinel(0, 16, -180, 4.5, 2.2);   // Mountain slope patrol
        this.createAsuraSentinel(0, 5, -620, 3.8, 2.0);    // Cascade bridge patrol
        this.createAsuraSentinel(0, 8, -840, 5.0, 2.3);    // Mid-course highway patrol
        this.createAsuraSentinel(0, 26, -1320, 4.5, 2.0);  // High ridge plateau patrol
        this.createAsuraSentinel(0, 4, -1760, 5.2, 2.4);   // Rollercoaster dip floor patrol
        this.createAsuraSentinel(0, 10, -2480, 4.2, 2.2);  // Canyon exit patrol
        this.createAsuraSentinel(0, 10, -4120, 5.0, 2.3);  // Coastal lagoon bridge patrol
        this.createAsuraSentinel(0, 10, -5120, 5.5, 2.5);  // Grand speedway final patrol

        // --- 7. NAGA POISON GEYSERS (เสาไอพิษพญานาคพุ่งปะทุ - Timing Hazard) ---
        this.createNagaGeyser(0, 22, -285, 0.0);           // High plateau geyser
        this.createNagaGeyser(-3.5, 4, -430, 1.6);         // Downhill foot geyser
        this.createNagaGeyser(3.5, 8, -760, 0.8);          // Highway verge geyser
        this.createNagaGeyser(0, 8, -1150, 2.2);           // Mountain ramp geyser
        this.createNagaGeyser(-4.0, 10, -2290, 1.2);       // Emerald Canyon geyser
        this.createNagaGeyser(4.0, 12, -2720, 2.8);        // Speedway geyser
        this.createNagaGeyser(0, 10, -4020, 0.5);          // Coastal bridge geyser
        this.createNagaGeyser(-4.0, 12, -4600, 3.2);       // Triple S-curve geyser

        // --- 8. GIANT GOAL RING (At end of 5,600m Victory Colosseum Arena, groundY = 10) ---
        this.createGoalRing(0, 10, -5600, 8.5);
    }

    createRing(x, y, z) {
        // Automatic Ground Elevation Safeguard:
        // Ensure star is NEVER buried underground on sloped hills, dips, or platforms
        const world = this.world || (window.game && window.game.world);
        if (world && world.getGroundHeight) {
            const groundY = world.getGroundHeight(x, z);
            if (groundY > -40) {
                if (y < groundY + 1.0) {
                    y = groundY + 1.35;
                }
            }
        }

        const group = new THREE.Group();
        if (!this.starGeo) {
            this.starGeo = this.createStarGeometry();
        }
        const mesh = new THREE.Mesh(this.starGeo, this.starMat);
        mesh.castShadow = true;
        group.add(mesh);

        // Core Sparkling Diamond Glint
        if (!this.starCoreGeo) {
            this.starCoreGeo = new THREE.OctahedronGeometry(0.16, 0);
        }
        const coreMesh = new THREE.Mesh(this.starCoreGeo, this.starCoreMat);
        group.add(coreMesh);

        group.position.set(x, y, z);
        this.scene.add(group);

        this.rings.push({
            group: group,
            mesh: mesh,
            coreMesh: coreMesh,
            baseY: y,
            collected: false,
            radius: 1.1
        });
    }

    createMoon(x, y, z) {
        const world = this.world || (window.game && window.game.world);
        if (world && world.getGroundHeight) {
            const groundY = world.getGroundHeight(x, z);
            if (groundY > -40 && y < groundY + 1.5) {
                y = groundY + 2.2;
            }
        }

        const group = new THREE.Group();
        if (!this.moonGeo) {
            this.moonGeo = this.createCrescentMoonGeometry();
        }
        const mesh = new THREE.Mesh(this.moonGeo, this.moonMat);
        mesh.castShadow = true;
        group.add(mesh);

        // Radiant Moon Halo Disc
        if (!this.moonHaloGeo) {
            this.moonHaloGeo = new THREE.CircleGeometry(1.35, 24);
        }
        const halo = new THREE.Mesh(this.moonHaloGeo, this.moonHaloMat);
        group.add(halo);

        group.position.set(x, y, z);
        this.scene.add(group);

        this.moons.push({
            group: group,
            mesh: mesh,
            halo: halo,
            baseY: y,
            collected: false,
            radius: 1.8
        });
    }

    spawnMoonCollectFX(x, y, z) {
        // Massive radiant shockwave + 30 sparkling star burst
        for (let i = 0; i < 3; i++) {
            this.spawnRingCollectFX(x + (Math.random() - 0.5) * 1.5, y + (Math.random() - 0.5) * 1.5, z + (Math.random() - 0.5) * 1.5);
        }
    }

    createRingArc(centerX, baseY, centerZ, arcHeight, length) {
        const count = 7;
        for (let i = 0; i < count; i++) {
            const t = i / (count - 1);
            const z = centerZ - (t - 0.5) * length;
            const y = baseY + Math.sin(t * Math.PI) * arcHeight;
            this.createRing(centerX, y, z);
        }
    }

    createLoopRings(centerX, groundY, centerZ, radius, entryX = -2.5, exitX = 2.5, count = 10) {
        for (let i = 0; i < count; i++) {
            const theta = ((i + 0.5) / count) * Math.PI * 2;
            const z = centerZ - radius * Math.sin(theta);
            const y = groundY + radius * (1 - Math.cos(theta)) + 1.2;
            const x = centerX + entryX + (exitX - entryX) * ((i + 0.5) / count);
            this.createRing(x, y, z);
        }
    }

    createSlalomRings(startZ, length, count = 10, amplitude = 5.0, cycles = 1.5, offsetX = 0) {
        for (let i = 0; i < count; i++) {
            const t = i / (count - 1);
            const z = startZ - t * length;
            const x = offsetX + Math.sin(t * Math.PI * 2 * cycles) * amplitude;
            const y = this.getSafeRingY(x, z);
            this.createRing(x, y, z);
        }
    }

    createJumpArc(startX, endX, startZ, length, arcHeight = 7.5, count = 7) {
        for (let i = 0; i < count; i++) {
            const t = i / (count - 1);
            const x = startX + (endX - startX) * t;
            const z = startZ - t * length;
            const baseGroundY = this.getSafeGroundY(x, z, 0);
            const y = baseGroundY + 1.35 + Math.sin(t * Math.PI) * arcHeight;
            this.createRing(x, y, z);
        }
    }

    createWedgeCluster(centerX, centerZ, dir = -1) {
        // 6-star aerodynamic V-wedge constellation
        const positions = [
            [centerX, centerZ],
            [centerX - 2.5, centerZ + dir * 3.5], [centerX + 2.5, centerZ + dir * 3.5],
            [centerX - 5.0, centerZ + dir * 7.0], [centerX, centerZ + dir * 7.0], [centerX + 5.0, centerZ + dir * 7.0]
        ];
        positions.forEach(p => {
            const y = this.getSafeRingY(p[0], p[1]);
            this.createRing(p[0], y, p[1]);
        });
    }

    createDiamondCluster(centerX, centerZ, radius = 3.8) {
        // 5-star diamond constellation
        const positions = [
            [centerX, centerZ],
            [centerX, centerZ - radius],
            [centerX, centerZ + radius],
            [centerX - radius, centerZ],
            [centerX + radius, centerZ]
        ];
        positions.forEach(p => {
            const y = this.getSafeRingY(p[0], p[1]);
            this.createRing(p[0], y, p[1]);
        });
    }

    createTwinLaneRings(leftX = -4.5, rightX = 4.5, startZ, count = 8, spacing = 6.0) {
        for (let i = 0; i < count; i++) {
            const z = startZ - i * spacing;
            this.createRing(leftX, this.getSafeRingY(leftX, z), z);
            this.createRing(rightX, this.getSafeRingY(rightX, z), z);
        }
    }

    createSpring(x, y, z, power = 35) {
        const world = this.world || (window.game && window.game.world);
        if (world && world.getGroundHeight) {
            const groundY = world.getGroundHeight(x, z);
            if (groundY > -40) y = groundY;
        }

        const group = new THREE.Group();

        // 1. Giant Sacred Lily Pad Base (ใบบัวทิพย์มรกตรองรับ)
        const padGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.16, 16);
        const padMesh = new THREE.Mesh(padGeo, this.lotusPadMat);
        padMesh.position.y = 0.08;
        padMesh.receiveShadow = true;
        group.add(padMesh);

        // Golden rim ring around lily pad base
        const rimGeo = new THREE.TorusGeometry(1.65, 0.08, 6, 20);
        const rim = new THREE.Mesh(rimGeo, this.vayuGoldTrimMat);
        rim.rotation.x = Math.PI / 2;
        rim.position.y = 0.12;
        group.add(rim);

        // 2. Bouncing Celestial Lotus Blossom Group (กลุ่มดอกบัวสวรรค์ดีดตัว)
        const lotusGroup = new THREE.Group();
        lotusGroup.position.y = 0.35;

        // Golden core pollen receptacle
        const coreGeo = new THREE.CylinderGeometry(0.95, 0.75, 0.32, 16);
        const core = new THREE.Mesh(coreGeo, this.lotusCoreMat);
        core.position.y = 0.16;
        core.castShadow = true;
        lotusGroup.add(core);

        // Radiant golden jewel in center
        const seedGeo = new THREE.SphereGeometry(0.32, 8, 8);
        const seed = new THREE.Mesh(seedGeo, this.goldMat);
        seed.position.y = 0.34;
        lotusGroup.add(seed);

        // Layer of 10 blooming celestial pink lotus petals around core
        const numPetals = 10;
        for (let i = 0; i < numPetals; i++) {
            const angle = (i / numPetals) * Math.PI * 2;
            const petalGeo = new THREE.ConeGeometry(0.48, 1.35, 5);
            petalGeo.scale(1, 0.2, 0.65);
            petalGeo.translate(0, 0.65, 0);
            const petal = new THREE.Mesh(petalGeo, this.lotusPetalMat);
            petal.position.set(Math.cos(angle) * 0.78, 0.08, Math.sin(angle) * 0.78);
            petal.rotation.y = -angle;
            petal.rotation.x = 0.65;
            petal.castShadow = true;
            lotusGroup.add(petal);
        }

        group.add(lotusGroup);
        group.position.set(x, y, z);
        this.scene.add(group);

        this.springs.push({
            group: group,
            topMesh: lotusGroup,
            power: power,
            x: x, y: y, z: z,
            radius: 1.8,
            bounceTimer: 0
        });
    }

    createDashPad(x, y, z, dirX = 0, dirZ = -1, force = 55) {
        if (dirX === undefined || isNaN(dirX)) dirX = 0;
        if (dirZ === undefined || isNaN(dirZ)) dirZ = -1;
        if (force === undefined || isNaN(force)) force = 55;

        const world = this.world || (window.game && window.game.world);
        if (world && world.getGroundHeight) {
            const groundY = world.getGroundHeight(x, z);
            if (groundY > -40) y = groundY;
        }

        const group = new THREE.Group();

        // 1. Octagonal Sacred Jade-Slate Base (แท่นศิลาศักดิ์สิทธิ์ยันต์พระพาย)
        const padGeo = new THREE.CylinderGeometry(2.3, 2.5, 0.22, 8);
        const padMesh = new THREE.Mesh(padGeo, this.vayuStoneMat);
        padMesh.position.y = 0.11;
        padMesh.receiveShadow = true;
        group.add(padMesh);

        // Golden Trim Border Ring
        const goldRingGeo = new THREE.TorusGeometry(2.4, 0.12, 6, 24);
        const goldRing = new THREE.Mesh(goldRingGeo, this.vayuGoldTrimMat);
        goldRing.rotation.x = Math.PI / 2;
        goldRing.position.y = 0.18;
        group.add(goldRing);

        // 2. Glowing Cyan Wind Gale Runes (ลูกศรคลื่นลมพระพาย 3 ชั้น)
        const windRunes = [];
        [-1.1, 0, 1.1].forEach((offsetZ, i) => {
            const arrowGeo = new THREE.ConeGeometry(0.85 - i * 0.1, 1.4 - i * 0.15, 3);
            arrowGeo.rotateX(Math.PI / 2);
            const arrowMesh = new THREE.Mesh(arrowGeo, this.vayuWindArrowMat);
            arrowMesh.position.set(0, 0.24, offsetZ);
            group.add(arrowMesh);
            windRunes.push(arrowMesh);
        });

        // Side Wind Swirl Accents
        [-1.3, 1.3].forEach(sideX => {
            const swirlGeo = new THREE.TorusGeometry(0.55, 0.09, 6, 12, Math.PI * 1.3);
            const swirl = new THREE.Mesh(swirlGeo, this.vayuWindArrowMat);
            swirl.rotation.x = Math.PI / 2;
            swirl.position.set(sideX, 0.23, 0);
            group.add(swirl);
        });

        group.position.set(x, y, z);
        this.scene.add(group);

        this.dashPads.push({
            group: group,
            windRunes: windRunes,
            dirX: dirX,
            dirZ: dirZ,
            force: force,
            x: x, y: y, z: z,
            width: 4.2, length: 4.8,
            cooldown: 0
        });
    }

    createSpikes(x, y, z) {
        const world = this.world || (window.game && window.game.world);
        if (world && world.getGroundHeight) {
            const groundY = world.getGroundHeight(x, z);
            if (groundY > -40) y = groundY;
        }

        const group = new THREE.Group();

        // 1. Mossy Earth & Dark Root Mound Base (โคนกอหนามเถาวัลย์อสูร)
        const baseGeo = new THREE.CylinderGeometry(1.6, 1.9, 0.24, 8);
        const baseMesh = new THREE.Mesh(baseGeo, this.brambleMoundMat);
        baseMesh.position.y = 0.12;
        baseMesh.receiveShadow = true;
        group.add(baseMesh);

        // Creeping dark root rings
        const rootGeo = new THREE.TorusGeometry(1.4, 0.12, 6, 16);
        const root = new THREE.Mesh(rootGeo, this.brambleWoodMat);
        root.rotation.x = Math.PI / 2;
        root.position.y = 0.15;
        group.add(root);

        // 2. Menacing Gnarled Asura Bramble Thorns (หนามเถาวัลย์อสูรปลายแดงชาด)
        const thornConfigs = [
            { x: 0, z: 0, h: 1.45, r: 0.24, rotX: 0.05, rotZ: -0.05 },
            { x: -0.75, z: -0.55, h: 1.3, r: 0.21, rotX: -0.12, rotZ: 0.18 },
            { x: 0.8, z: -0.6, h: 1.35, r: 0.22, rotX: -0.15, rotZ: -0.15 },
            { x: -0.85, z: 0.65, h: 1.25, r: 0.20, rotX: 0.16, rotZ: 0.14 },
            { x: 0.75, z: 0.7, h: 1.3, r: 0.21, rotX: 0.14, rotZ: -0.16 },
            { x: 0, z: -0.9, h: 1.15, r: 0.19, rotX: -0.22, rotZ: 0.02 },
            { x: 0, z: 0.95, h: 1.15, r: 0.19, rotX: 0.22, rotZ: -0.02 }
        ];

        thornConfigs.forEach(tc => {
            // Thorn body (Dark demonic wood)
            const stalkGeo = new THREE.ConeGeometry(tc.r, tc.h, 6);
            stalkGeo.translate(0, tc.h * 0.5, 0);
            const stalk = new THREE.Mesh(stalkGeo, this.brambleWoodMat);
            stalk.position.set(tc.x, 0.2, tc.z);
            stalk.rotation.x = tc.rotX;
            stalk.rotation.z = tc.rotZ;
            stalk.castShadow = true;
            group.add(stalk);

            // Razor-sharp Crimson Poison Tip (ปลายหนามแหลมคมสีแดงชาดเรืองแสง)
            const tipH = tc.h * 0.38;
            const tipGeo = new THREE.ConeGeometry(tc.r * 0.55, tipH, 6);
            tipGeo.translate(0, tipH * 0.5, 0);
            const tip = new THREE.Mesh(tipGeo, this.brambleTipMat);
            tip.position.set(tc.x + Math.sin(tc.rotZ) * (tc.h - tipH), 0.2 + (tc.h - tipH) * Math.cos(tc.rotX), tc.z - Math.sin(tc.rotX) * (tc.h - tipH));
            tip.rotation.x = tc.rotX;
            tip.rotation.z = tc.rotZ;
            group.add(tip);
        });

        group.position.set(x, y, z);
        this.scene.add(group);

        this.spikes.push({
            group: group,
            x: x, y: y, z: z,
            radius: 1.8
        });
    }

    createAsuraSentinel(x, y, z, patrolRange = 5.0, patrolSpeed = 2.0) {
        const world = this.world || (window.game && window.game.world);
        if (world && world.getGroundHeight) {
            const groundY = world.getGroundHeight(x, z);
            if (groundY > -40) y = groundY;
        }

        const group = new THREE.Group();
        group.position.set(x, y, z);

        const charGroup = new THREE.Group();

        // 1. Torso & Armor (ลำตัวยักษ์ & เกราะทอง)
        const chestGeo = new THREE.BoxGeometry(1.0, 0.9, 0.65);
        const chest = new THREE.Mesh(chestGeo, this.asuraSkinMat);
        chest.position.y = 1.25;
        chest.castShadow = true;
        charGroup.add(chest);

        const breastGeo = new THREE.BoxGeometry(0.7, 0.45, 0.68);
        const breast = new THREE.Mesh(breastGeo, this.asuraGoldMat);
        breast.position.set(0, 1.35, 0.05);
        charGroup.add(breast);

        const clothGeo = new THREE.BoxGeometry(0.95, 0.42, 0.68);
        const cloth = new THREE.Mesh(clothGeo, this.asuraLoinclothMat);
        cloth.position.y = 0.75;
        charGroup.add(cloth);

        const beltGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.7, 8);
        beltGeo.rotateX(Math.PI / 2);
        const belt = new THREE.Mesh(beltGeo, this.asuraGoldMat);
        belt.position.set(0, 0.85, 0.35);
        charGroup.add(belt);

        // 2. Head & Golden Crown (หัวยักษ์ & ชฎายอดแหลม)
        const headGeo = new THREE.BoxGeometry(0.72, 0.72, 0.65);
        const head = new THREE.Mesh(headGeo, this.asuraSkinMat);
        head.position.y = 2.05;
        head.castShadow = true;
        charGroup.add(head);

        // Fiery glowing eyes
        [-0.18, 0.18].forEach(eyeX => {
            const eyeGeo = new THREE.BoxGeometry(0.14, 0.09, 0.12);
            const eye = new THREE.Mesh(eyeGeo, this.asuraEyeMat);
            eye.position.set(eyeX, 2.12, 0.32);
            charGroup.add(eye);
        });

        // Upward-pointing white fangs
        [-0.24, 0.24].forEach(fangX => {
            const fangGeo = new THREE.ConeGeometry(0.06, 0.22, 4);
            const fang = new THREE.Mesh(fangGeo, new THREE.MeshLambertMaterial({ color: 0xffffff }));
            fang.position.set(fangX, 1.88, 0.34);
            fang.rotation.x = -0.35;
            charGroup.add(fang);
        });

        const crownBaseGeo = new THREE.CylinderGeometry(0.48, 0.42, 0.25, 8);
        const crownBase = new THREE.Mesh(crownBaseGeo, this.asuraGoldMat);
        crownBase.position.y = 2.45;
        charGroup.add(crownBase);

        const crownSpireGeo = new THREE.ConeGeometry(0.28, 0.85, 6);
        const crownSpire = new THREE.Mesh(crownSpireGeo, this.asuraGoldMat);
        crownSpire.position.y = 2.95;
        charGroup.add(crownSpire);

        // 3. Spiked Giant Club (กระบองยักษ์ปลายหนาม)
        const clubGroup = new THREE.Group();
        clubGroup.position.set(0.68, 1.1, 0.2);

        const shaftGeo = new THREE.CylinderGeometry(0.08, 0.1, 1.6, 8);
        const shaft = new THREE.Mesh(shaftGeo, this.asuraClubMat);
        shaft.position.y = 0.4;
        clubGroup.add(shaft);

        const clubHeadGeo = new THREE.CylinderGeometry(0.26, 0.18, 0.85, 8);
        const clubHead = new THREE.Mesh(clubHeadGeo, this.asuraClubMat);
        clubHead.position.y = 1.05;
        clubHead.castShadow = true;
        clubGroup.add(clubHead);

        for (let a = 0; a < 4; a++) {
            const ang = (a / 4) * Math.PI * 2;
            const spkGeo = new THREE.ConeGeometry(0.08, 0.28, 4);
            spkGeo.rotateZ(-Math.PI / 2);
            const spk = new THREE.Mesh(spkGeo, this.asuraGoldMat);
            spk.position.set(Math.cos(ang) * 0.28, 1.05, Math.sin(ang) * 0.28);
            spk.rotation.y = -ang;
            clubGroup.add(spk);
        }
        clubGroup.rotation.z = -0.25;
        clubGroup.rotation.x = 0.2;
        charGroup.add(clubGroup);

        // 4. Sturdy Legs
        const legGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.65, 8);
        legGeo.translate(0, -0.32, 0);

        const leftLeg = new THREE.Mesh(legGeo, this.asuraSkinMat);
        leftLeg.position.set(-0.28, 0.65, 0);
        charGroup.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeo, this.asuraSkinMat);
        rightLeg.position.set(0.28, 0.65, 0);
        charGroup.add(rightLeg);

        group.add(charGroup);
        this.scene.add(group);

        this.sentinels.push({
            group: group,
            charGroup: charGroup,
            leftLeg: leftLeg,
            rightLeg: rightLeg,
            clubGroup: clubGroup,
            startX: x,
            y: y,
            z: z,
            currentX: x,
            patrolRange: patrolRange,
            patrolSpeed: patrolSpeed,
            patrolTimer: Math.random() * Math.PI * 2,
            alive: true,
            defeatTimer: 0
        });
    }

    createNagaGeyser(x, y, z, cycleOffset = 0) {
        const world = this.world || (window.game && window.game.world);
        if (world && world.getGroundHeight) {
            const groundY = world.getGroundHeight(x, z);
            if (groundY > -40) y = groundY;
        }

        const group = new THREE.Group();
        group.position.set(x, y, z);

        // 1. Serpentine Stone Crater Maw (ปากปล่องหินพญานาค)
        const craterGeo = new THREE.CylinderGeometry(1.4, 1.7, 0.24, 10);
        const crater = new THREE.Mesh(craterGeo, this.geyserBaseMat);
        crater.position.y = 0.12;
        crater.receiveShadow = true;
        group.add(crater);

        const rimGeo = new THREE.TorusGeometry(1.2, 0.1, 6, 16);
        const rim = new THREE.Mesh(rimGeo, this.geyserWarningMat);
        rim.rotation.x = Math.PI / 2;
        rim.position.y = 0.22;
        group.add(rim);

        // 2. Warning Steam Sphere
        const warnGeo = new THREE.SphereGeometry(0.75, 10, 8);
        const warnMesh = new THREE.Mesh(warnGeo, this.geyserWarningMat);
        warnMesh.position.y = 0.5;
        warnMesh.visible = false;
        group.add(warnMesh);

        // 3. Erupting Poison Gas Cylinder Column (เสาไอพิษพุ่งปะทุ)
        const colGeo = new THREE.CylinderGeometry(1.1, 1.45, 6.5, 12, 1, true);
        colGeo.translate(0, 3.25, 0);
        const colMesh = new THREE.Mesh(colGeo, this.geyserColumnMat);
        colMesh.visible = false;
        group.add(colMesh);

        const coreGeo = new THREE.CylinderGeometry(0.65, 0.9, 6.2, 8, 1, true);
        coreGeo.translate(0, 3.1, 0);
        const coreMesh = new THREE.Mesh(coreGeo, this.geyserCoreMat);
        coreMesh.visible = false;
        group.add(coreMesh);

        this.scene.add(group);

        this.geysers.push({
            group: group,
            columnMesh: colMesh,
            coreMesh: coreMesh,
            warningMesh: warnMesh,
            x: x, y: y, z: z,
            radius: 1.6,
            timer: cycleOffset % 4.0,
            cycleDuration: 4.0,
            state: 'dormant'
        });
    }

    createStarPost(x, y, z, id) {
        const world = this.world || (window.game && window.game.world);
        if (world && world.getGroundHeight) {
            const groundY = world.getGroundHeight(x, z);
            if (groundY > -40) y = groundY;
        }

        const group = new THREE.Group();

        // 1. Pedestal Base (Sturdy arcade pedestal)
        const baseGeo = new THREE.CylinderGeometry(1.1, 1.45, 0.55, 16);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x3d3d44, metalness: 0.85, roughness: 0.25 });
        const baseMesh = new THREE.Mesh(baseGeo, baseMat);
        baseMesh.position.y = 0.275;
        baseMesh.castShadow = true;
        group.add(baseMesh);

        // 2. Metallic Post/Pole (Stately silver pillar with collar rings)
        const poleGeo = new THREE.CylinderGeometry(0.28, 0.35, 4.2, 16);
        const poleMesh = new THREE.Mesh(poleGeo, this.postPoleMat);
        poleMesh.position.y = 2.35;
        poleMesh.castShadow = true;
        group.add(poleMesh);

        // Decorative collar ring
        const collarGeo = new THREE.TorusGeometry(0.38, 0.08, 8, 16);
        const collarMesh = new THREE.Mesh(collarGeo, this.postStarGoldMat);
        collarMesh.rotation.x = Math.PI / 2;
        collarMesh.position.y = 4.35;
        group.add(collarMesh);

        // 3. Rotating Star Post Head Group (pivoting at pole top y = 4.4)
        const headGroup = new THREE.Group();
        headGroup.position.y = 4.4;

        // Central Orb (Blue glowing lamp before touch, Red/Gold blazing beacon after touch!)
        const orbGeo = new THREE.SphereGeometry(0.72, 20, 20);
        const orbMesh = new THREE.Mesh(orbGeo, this.postOrbBlueMat);
        orbMesh.castShadow = true;
        headGroup.add(orbMesh);

        // Horizontal Crossbar Wings
        const barGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.2, 10);
        const barMesh = new THREE.Mesh(barGeo, this.postPoleMat);
        barMesh.rotation.z = Math.PI / 2;
        headGroup.add(barMesh);

        // Crossbar End Sphere Accents (Golden Star Spheres)
        const endGeo = new THREE.SphereGeometry(0.28, 12, 12);
        [-1.1, 1.1].forEach(offsetX => {
            const endMesh = new THREE.Mesh(endGeo, this.postStarGoldMat);
            endMesh.position.x = offsetX;
            headGroup.add(endMesh);
        });

        // Crown Star Spikes (5-point golden finial on top of the orb)
        const starGeo = new THREE.ConeGeometry(0.32, 0.85, 5);
        const starMesh = new THREE.Mesh(starGeo, this.postStarGoldMat);
        starMesh.position.y = 0.82;
        headGroup.add(starMesh);

        group.add(headGroup);
        group.position.set(x, y, z);
        this.scene.add(group);

        this.starPosts.push({
            id: id,
            group: group,
            headGroup: headGroup,
            orbMesh: orbMesh,
            x: x, y: y, z: z,
            radius: 2.2,
            activated: false,
            spinSpeed: 0,
            glowTimer: 0
        });
    }

    createPortalTexture() {
        if (typeof document === 'undefined') return null;
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;

            const cx = 256, cy = 256;

            // Cosmic Radial Glow Gradient
            const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 256);
            grad.addColorStop(0.0, '#ffffff');      // Pure white energy singularity core
            grad.addColorStop(0.12, '#e0f2fe');     // Celestial sky shimmer
            grad.addColorStop(0.30, '#38bdf8');     // Radiant electric cyan
            grad.addColorStop(0.55, '#0284c7');     // Deep azure warp realm
            grad.addColorStop(0.78, '#1e1b4b');     // Midnight hyperspace void
            grad.addColorStop(0.92, '#06b6d4');     // Turquoise outer containment ring
            grad.addColorStop(1.0, 'rgba(2, 132, 199, 0.0)'); // Smooth edge dissipation

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, 256, 0, Math.PI * 2);
            ctx.fill();

            // 6 Curved spiral vortex galaxy arms (Sonic Special Stage Warp Ring)
            ctx.save();
            ctx.translate(cx, cy);
            for (let arm = 0; arm < 6; arm++) {
                ctx.rotate((Math.PI * 2) / 6);
                ctx.beginPath();
                for (let r = 12; r < 240; r += 4) {
                    const angle = r * 0.042;
                    const x = Math.cos(angle) * r;
                    const y = Math.sin(angle) * r;
                    if (r === 12) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
                ctx.lineWidth = 14;
                ctx.stroke();

                ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
                ctx.lineWidth = 8;
                ctx.stroke();
            }
            ctx.restore();

            // 90 Scattered Starlight sparkles
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 90; i++) {
                const rad = Math.random() * 230;
                const ang = Math.random() * Math.PI * 2;
                const px = cx + Math.cos(ang) * rad;
                const py = cy + Math.sin(ang) * rad;
                const sz = 1.2 + Math.random() * 3.0;
                ctx.beginPath();
                ctx.arc(px, py, sz, 0, Math.PI * 2);
                ctx.fill();
            }

            return new THREE.CanvasTexture(canvas);
        } catch (e) {
            return null;
        }
    }

    createGoalRing(x, groundY, z, radius = 8.5) {
        // Automatic Ground Elevation Safeguard
        const world = this.world || (window.game && window.game.world);
        if (world && typeof world.getGroundHeight === 'function') {
            const sampled = world.getGroundHeight(x, z);
            if (sampled > -40) groundY = sampled;
        }

        const group = new THREE.Group();
        const centerY = groundY + radius * 0.9; // 7.65m above ground

        // 1. Colossal Golden Torus Outer Ring
        const ringGeo = new THREE.TorusGeometry(radius, 0.85, 24, 48);
        const goldMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.92,
            roughness: 0.16,
            emissive: 0x553800
        });
        const ringMesh = new THREE.Mesh(ringGeo, goldMat);
        ringMesh.castShadow = true;
        group.add(ringMesh);

        // 2. Swirling Cosmic Warp Portal Glass Disc (16m diameter!)
        const portalTex = this.createPortalTexture();
        const portalGeo = new THREE.CircleGeometry(radius - 0.5, 48);
        const portalMat = new THREE.MeshBasicMaterial({
            map: portalTex || null,
            color: portalTex ? 0xffffff : 0x00d2ff,
            transparent: true,
            opacity: 0.85,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const portalMesh = new THREE.Mesh(portalGeo, portalMat);
        group.add(portalMesh);

        // 3. Inner Pulsing Core Disc (Additive Glowing Energy Center)
        const coreGeo = new THREE.CircleGeometry(radius * 0.68, 36);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0x67e8f9,
            transparent: true,
            opacity: 0.45,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const innerCoreMesh = new THREE.Mesh(coreGeo, coreMat);
        group.add(innerCoreMesh);

        // 4. Vertical Victory Light Column / Heavenly Sky Beam (100m tall)
        const beaconGeo = new THREE.CylinderGeometry(radius * 0.45, radius * 0.85, 100, 16, 1, true);
        const beaconMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.18,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
        beaconMesh.position.set(0, 50, 0);
        group.add(beaconMesh);

        // 5. Grand Architectural Foundation Dais (Ground Stepped Plinth)
        const daisGeo = new THREE.CylinderGeometry(radius * 1.5, radius * 1.65, 1.4, 36);
        const daisMat = new THREE.MeshStandardMaterial({
            color: (this.currentStageId === 'chemical_plant') ? 0xf8fafc : 0x8b6540,
            metalness: 0.3,
            roughness: 0.3
        });
        const daisMesh = new THREE.Mesh(daisGeo, daisMat);
        daisMesh.position.set(0, -radius * 0.9 + 0.7, 0);
        group.add(daisMesh);

        // Dais Glowing Border Rim
        const daisRimGeo = new THREE.TorusGeometry(radius * 1.52, 0.18, 12, 36);
        const daisRimMat = new THREE.MeshBasicMaterial({
            color: 0xffd700
        });
        const daisRim = new THREE.Mesh(daisRimGeo, daisRimMat);
        daisRim.rotation.x = Math.PI / 2;
        daisRim.position.set(0, -radius * 0.9 + 1.4, 0);
        group.add(daisRim);

        // 6. Grand Flanking Pylon Columns (Left & Right)
        const pillarColGeo = new THREE.CylinderGeometry(0.85, 1.15, radius * 1.85, 16);
        const pillarMat = new THREE.MeshStandardMaterial({
            color: (this.currentStageId === 'chemical_plant') ? 0xf1f5f9 : 0xab8860,
            metalness: 0.3,
            roughness: 0.3
        });
        const orbGeo = new THREE.SphereGeometry(1.2, 16, 16);
        const orbMat = new THREE.MeshBasicMaterial({
            color: 0xffd700
        });

        [-radius - 1.6, radius + 1.6].forEach(colX => {
            const pillar = new THREE.Mesh(pillarColGeo, pillarMat);
            pillar.position.set(colX, 0, 0);
            group.add(pillar);

            const orb = new THREE.Mesh(orbGeo, orbMat);
            orb.position.set(colX, radius * 0.95, 0);
            group.add(orb);
        });

        // 7. 16 Orbiting Chaos Energy Sparkles
        const sparkleGeo = new THREE.DodecahedronGeometry(0.42, 0);
        const sparkleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.goalSparkles = [];
        for (let i = 0; i < 16; i++) {
            const s = new THREE.Mesh(sparkleGeo, sparkleMat);
            group.add(s);
            this.goalSparkles.push(s);
        }

        group.position.set(x, centerY, z);
        this.scene.add(group);

        this.goalRing = {
            group: group,
            ringMesh: ringMesh,
            portalMesh: portalMesh,
            innerCoreMesh: innerCoreMesh,
            beaconMesh: beaconMesh,
            x: x,
            groundY: groundY,
            centerY: centerY,
            z: z,
            radius: radius,
            reached: false
        };
    }

    spawnScatteredRings(x, y, z, count = 12) {
        const actualCount = Math.min(count, 20);
        if (!this.scatterStarGeo) {
            this.scatterStarGeo = this.createStarGeometry(5, 0.38, 0.18, 0.12);
        }

        for (let i = 0; i < actualCount; i++) {
            const angle = (i / actualCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
            const horizSpeed = 6.5 + Math.random() * 8.5;
            const mesh = new THREE.Mesh(this.scatterStarGeo, this.starMat);
            mesh.position.set(x, y + 0.8, z);
            this.scene.add(mesh);

            this.scatteredRings.push({
                mesh: mesh,
                vx: Math.cos(angle) * horizSpeed,
                vy: 11.5 + Math.random() * 7.0, // Upward fountain arc
                vz: Math.sin(angle) * horizSpeed,
                life: 6.0, // Despawn after 6.0 seconds
                canCollectAfter: 0.35 // 0.35s before Sonic can recollect
            });
        }
    }

    update(dt, sonic, onGoalReached) {
        const time = performance.now() * 0.003;

        // Update 3D Ring Collection Visual Effects (Shockwaves & Sparkle Burst Pool)
        this.updateRingFX(dt);

        // 1. Update & Collect Standard Rings with Authentic Sonic Magnetism
        this.rings.forEach(ring => {
            if (!ring.collected) {
                // Center of Sonic (around chest/waist y + 0.85)
                const sonicCenter = sonic.position.clone();
                sonicCenter.y += 0.85;
                const dist = sonicCenter.distanceTo(ring.group.position);

                // Ring Magnetism:
                // Normal radius: 4.5m | Boost radius: 11.25m (ONLY when actively boosting with energy > 2.0 and NOT depleted)
                const baseMagnetRadius = 4.5;
                const isMagnetBoost = (sonic.isBoosting && sonic.boostEnergy > 2.0 && !sonic.boostDepleted);
                const magnetRadius = isMagnetBoost ? (baseMagnetRadius * 2.5) : baseMagnetRadius;
                if (dist < magnetRadius && !sonic.isLooping && !sonic.isDead) {
                    // Accelerate spin as ring rushes into Sonic
                    const boostSpinMult = isMagnetBoost ? 2.0 : 1.0;
                    ring.mesh.rotation.y += dt * (4.5 + (magnetRadius - dist) * 7.5) * boostSpinMult;
                    const pullSpeed = isMagnetBoost ? 28.0 : 16.0;
                    const pullAcc = isMagnetBoost ? 14.0 : 9.0;
                    const pullFactor = Math.min(1.0, dt * (pullSpeed + (magnetRadius - dist) * pullAcc));
                    ring.group.position.lerp(sonicCenter, pullFactor);
                } else {
                    // Standard spin & hover bobbing when undisturbed
                    ring.mesh.rotation.y += dt * 3.8;
                    ring.mesh.rotation.z = Math.sin(time * 2.0) * 0.15;
                    ring.group.position.y = ring.baseY + Math.sin(time + ring.group.position.z) * 0.18;
                }

                // Collection collision
                if (dist < ring.radius + 1.2 && !sonic.isDead) {
                    this.spawnRingCollectFX(ring.group.position.x, ring.group.position.y, ring.group.position.z);
                    ring.collected = true;
                    ring.group.visible = false;
                    sonic.addRing(1);
                }
            }
        });

        // 1.5 Update & Collect Radiant Crescent Moons (หาวเป็นดาวเป็นเดือน)
        this.moons.forEach(moon => {
            if (!moon.collected) {
                const sonicCenter = sonic.position.clone();
                sonicCenter.y += 0.85;
                const dist = sonicCenter.distanceTo(moon.group.position);

                // Moon gentle majestic rotation and floating bob
                moon.mesh.rotation.y += dt * 2.4;
                moon.mesh.rotation.z = Math.sin(time * 2.0) * 0.16;
                moon.group.position.y = moon.baseY + Math.sin(time * 2.5 + moon.group.position.z * 0.05) * 0.35;

                if (moon.halo) {
                    moon.halo.rotation.z += dt * 1.2;
                    const pulse = 1.0 + Math.sin(time * 3.5) * 0.12;
                    moon.halo.scale.set(pulse, pulse, pulse);
                }

                // Vacuum pull when boosting or near
                if (dist < 6.5 && !sonic.isDead) {
                    moon.group.position.lerp(sonicCenter, Math.min(1.0, dt * 18.0));
                }

                // Collection
                if (dist < moon.radius + 1.4 && !sonic.isDead) {
                    moon.collected = true;
                    moon.group.visible = false;
                    this.spawnMoonCollectFX(moon.group.position.x, moon.group.position.y, moon.group.position.z);
                    if (sonic.addMoon) {
                        sonic.addMoon();
                    } else {
                        sonic.addRing(20);
                        sonic.score += 5000;
                        sonic.boostEnergy = sonic.maxBoostEnergy;
                    }
                }
            }
        });

        // 2. Update Scattered Rings
        for (let i = this.scatteredRings.length - 1; i >= 0; i--) {
            const sRing = this.scatteredRings[i];
            sRing.life -= dt;
            sRing.canCollectAfter -= dt;

            // Physics
            sRing.vy -= 42 * dt; // Gravity
            sRing.mesh.position.x += sRing.vx * dt;
            sRing.mesh.position.y += sRing.vy * dt;
            sRing.mesh.position.z += sRing.vz * dt;
            sRing.mesh.rotation.y += dt * 6.5;

            // Accurate terrain ground bouncing
            const groundY = (this.world && this.world.getGroundHeight)
                ? this.world.getGroundHeight(sRing.mesh.position.x, sRing.mesh.position.z)
                : 0;
            const floorY = groundY + 0.35;

            if (sRing.mesh.position.y <= floorY) {
                sRing.mesh.position.y = floorY;
                if (Math.abs(sRing.vy) > 1.8) {
                    sRing.vy = -sRing.vy * 0.58; // Elastic bounce
                } else {
                    sRing.vy = 0;
                }
                sRing.vx *= 0.82;
                sRing.vz *= 0.82;
            }

            // Flashing when close to despawning (last 2.0 seconds)
            if (sRing.life < 2.0) {
                sRing.mesh.visible = Math.floor(sRing.life * 14) % 2 === 0;
            }

            // Recollect check with magnetism (Enhanced 2.5x ONLY when actively boosting with energy > 2.0 and NOT depleted)
            if (sRing.canCollectAfter <= 0 && !sonic.isDead) {
                const sonicCenter = sonic.position.clone();
                sonicCenter.y += 0.85;
                const dist = sonicCenter.distanceTo(sRing.mesh.position);
                const isScatterBoost = (sonic.isBoosting && sonic.boostEnergy > 2.0 && !sonic.boostDepleted);
                const sMagnetRadius = isScatterBoost ? (4.0 * 2.5) : 4.0;
                if (dist < sMagnetRadius) {
                    const sPull = isScatterBoost ? 28.0 : 15.0;
                    sRing.mesh.position.lerp(sonicCenter, Math.min(1.0, dt * sPull));
                }
                if (dist < 1.8) {
                    this.spawnRingCollectFX(sRing.mesh.position.x, sRing.mesh.position.y, sRing.mesh.position.z);
                    sonic.addRing(1);
                    this.scene.remove(sRing.mesh);
                    this.scatteredRings.splice(i, 1);
                    continue;
                }
            }

            if (sRing.life <= 0) {
                this.scene.remove(sRing.mesh);
                this.scatteredRings.splice(i, 1);
            }
        }

        // 3. Update Bouncing Celestial Lotus Springs
        this.springs.forEach(sp => {
            if (sp.bounceTimer > 0) {
                sp.bounceTimer -= dt;
                const progress = Math.max(0, sp.bounceTimer / 0.35);
                const bounce = Math.sin(progress * Math.PI * 3) * progress;
                sp.topMesh.position.y = 0.35 + bounce * 0.45;
                sp.topMesh.scale.set(1.0 - bounce * 0.25, 1.0 + bounce * 0.5, 1.0 - bounce * 0.25);
                if (sp.bounceTimer <= 0) {
                    sp.topMesh.position.y = 0.35;
                    sp.topMesh.scale.set(1, 1, 1);
                }
            }

            // Check if Hanuman lands on lotus
            const horizDist = Math.hypot(sonic.position.x - sp.x, sonic.position.z - sp.z);
            const vertDist = Math.abs(sonic.position.y - sp.y);
            if (horizDist < sp.radius && vertDist < 1.6 && sonic.velocity.y <= 2) {
                sonic.bounceSpring(sp.power);
                sp.bounceTimer = 0.35;
                if (window.soundManager && window.soundManager.playSpring) {
                    window.soundManager.playSpring();
                }
            }
        });

        // 4. Update Vayu Wind Gale Dash Pads
        this.dashPads.forEach(dp => {
            if (dp.cooldown > 0) dp.cooldown -= dt;

            // Gentle pulsing glow on the wind arrows
            if (dp.windRunes) {
                const pulse = 0.65 + Math.sin(performance.now() * 0.008) * 0.35;
                dp.windRunes.forEach(r => {
                    if (r.material && r.material.emissiveIntensity !== undefined) {
                        r.material.emissiveIntensity = pulse;
                    }
                });
            }

            const dx = Math.abs(sonic.position.x - dp.x);
            const dz = Math.abs(sonic.position.z - dp.z);
            const dy = Math.abs(sonic.position.y - dp.y);

            if (dx < dp.width / 2 && dz < dp.length / 2 && dy < 1.8 && dp.cooldown <= 0) {
                sonic.applyDash(dp.dirX, dp.dirZ, dp.force);
                dp.cooldown = 0.5; // Trigger cleanly once per pad pass
                if (window.soundManager && window.soundManager.playDash) {
                    window.soundManager.playDash();
                }
            }
        });

        // 5. Update Asura Bramble Thorns
        this.spikes.forEach(spk => {
            const dist = sonic.position.distanceTo(spk.group.position);
            if (dist < spk.radius + 0.6) {
                const lost = sonic.takeDamage();
                if (lost > 0) {
                    this.spawnScatteredRings(sonic.position.x, sonic.position.y, sonic.position.z, lost);
                }
            }
        });

        // 6. Update Patrolling Asura Sentinels
        this.sentinels.forEach(s => {
            if (!s.alive) {
                if (s.defeatTimer > 0) {
                    s.defeatTimer -= dt;
                    s.group.scale.multiplyScalar(0.90);
                    s.group.position.y += dt * 3.5;
                    if (s.defeatTimer <= 0) {
                        this.scene.remove(s.group);
                    }
                }
                return;
            }

            s.patrolTimer += dt * s.patrolSpeed;
            const offset = Math.sin(s.patrolTimer) * s.patrolRange;
            s.currentX = s.startX + offset;
            s.group.position.x = s.currentX;

            const gy = this.getSafeGroundY(s.currentX, s.z, s.y);
            s.group.position.y = gy;

            const movingRight = Math.cos(s.patrolTimer) > 0;
            s.charGroup.rotation.y = movingRight ? Math.PI * 0.45 : -Math.PI * 0.45;

            const step = Math.sin(s.patrolTimer * 5);
            s.leftLeg.rotation.x = step * 0.5;
            s.rightLeg.rotation.x = -step * 0.5;
            s.charGroup.position.y = Math.abs(step) * 0.12;

            // Collision check with Hanuman
            const dist = Math.hypot(sonic.position.x - s.currentX, sonic.position.z - s.z);
            const vertDist = sonic.position.y - s.group.position.y;

            if (dist < 1.9 && vertDist > -0.6 && vertDist < 2.8) {
                const isStomp = (vertDist > 1.0 && sonic.velocity.y <= 1.2) || sonic.isSpinning;
                const isBoostSmash = (sonic.isBoosting && sonic.boostEnergy > 1.0);

                if (isStomp || isBoostSmash) {
                    // DEFEAT ASURA SENTINEL!
                    s.alive = false;
                    s.defeatTimer = 0.4;
                    if (isStomp) {
                        sonic.velocity.y = 17.5; // Satisfying enemy bounce launch!
                        sonic.isGrounded = false;
                        sonic.isJumping = true;
                    }
                    this.spawnRingCollectFX(s.currentX, gy + 1.2, s.z);
                    if (window.soundManager && window.soundManager.playEnemyDefeat) {
                        window.soundManager.playEnemyDefeat();
                    }
                    // Reward with 3 bonus golden stars!
                    for (let k = -1; k <= 1; k++) {
                        this.createRing(s.currentX + k * 1.6, gy + 1.4, s.z + (Math.random() - 0.5) * 2);
                    }
                } else if (!sonic.isInvulnerable && !sonic.isDead) {
                    const lost = sonic.takeDamage();
                    if (lost > 0) {
                        this.spawnScatteredRings(sonic.position.x, sonic.position.y, sonic.position.z, lost);
                    }
                }
            }
        });

        // 7. Update Naga Poison Geysers (Timing Hazard)
        this.geysers.forEach(g => {
            g.timer = (g.timer + dt) % g.cycleDuration;

            // Phase 1: Dormant (0.0s to 2.0s)
            if (g.timer < 2.0) {
                g.state = 'dormant';
                g.columnMesh.visible = false;
                g.coreMesh.visible = false;
                g.warningMesh.visible = false;
            }
            // Phase 2: Warning Telegraph (2.0s to 2.8s - 0.8s advance notice)
            else if (g.timer < 2.8) {
                g.state = 'warning';
                g.warningMesh.visible = true;
                const warnProgress = (g.timer - 2.0) / 0.8;
                const pulse = Math.sin(warnProgress * Math.PI * 8) * 0.5 + 0.5;
                g.warningMesh.scale.set(0.8 + pulse * 0.8, 0.4 + pulse * 0.6, 0.8 + pulse * 0.8);
                g.warningMesh.material.opacity = 0.4 + pulse * 0.5;
                g.columnMesh.visible = false;
                g.coreMesh.visible = false;
            }
            // Phase 3: Eruption (2.8s to 4.0s - 1.2s surging pillar)
            else {
                g.state = 'erupting';
                g.warningMesh.visible = false;
                g.columnMesh.visible = true;
                g.coreMesh.visible = true;

                const eruptTime = (g.timer - 2.8) / 1.2;
                const surge = Math.sin(eruptTime * Math.PI);
                const colH = 6.5 * Math.min(1.0, eruptTime * 4.0) * (1.0 - Math.pow(eruptTime, 3));
                g.columnMesh.scale.set(1.0 + surge * 0.25, Math.max(0.01, colH / 6.5), 1.0 + surge * 0.25);
                g.coreMesh.scale.set(0.7, Math.max(0.01, colH / 6.2), 0.7);

                g.columnMesh.rotation.y += dt * 3.5;
                g.coreMesh.rotation.y -= dt * 4.5;

                // Collision with player during eruption!
                const dist = Math.hypot(sonic.position.x - g.x, sonic.position.z - g.z);
                const playerY = sonic.position.y - g.y;

                if (dist < g.radius && playerY >= 0 && playerY < colH + 0.5) {
                    if (!sonic.isInvulnerable && !sonic.isDead && !(sonic.isBoosting && sonic.boostEnergy > 2.0)) {
                        const lost = sonic.takeDamage();
                        if (lost > 0) {
                            this.spawnScatteredRings(sonic.position.x, sonic.position.y, sonic.position.z, lost);
                        }
                    }
                }
            }
        });

        // 6. Update Star Post Checkpoints
        this.starPosts.forEach(post => {
            // Spin animation
            if (post.activated) {
                post.headGroup.rotation.y += post.spinSpeed * dt;
                if (post.spinSpeed > 4.0) {
                    post.spinSpeed = Math.max(4.0, post.spinSpeed - dt * 14.0);
                }
                post.glowTimer += dt;
                const pulse = (Math.sin(post.glowTimer * 14) + 1) * 0.5;
                if (post.orbMesh.material && post.orbMesh.material.emissiveIntensity !== undefined) {
                    post.orbMesh.material.emissiveIntensity = 0.6 + pulse * 0.5;
                }
            } else {
                // Gentle idle rotation
                post.headGroup.rotation.y += dt * 1.5;
            }

            // Proximity detection with Sonic across the track lane
            if (!post.activated && !sonic.isDead) {
                const dz = Math.abs(sonic.position.z - post.z);
                const dx = Math.abs(sonic.position.x - post.x);
                const dy = Math.abs(sonic.position.y - post.y);
                if (dz < 3.2 && dx < 15.0 && dy < 4.5) {
                    post.activated = true;
                    post.spinSpeed = 34.0; // Fast 360 spin upon contact!
                    post.orbMesh.material = this.postOrbRedMat;
                    if (window.soundManager && window.soundManager.playStarPost) {
                        window.soundManager.playStarPost();
                    }
                    if (window.game && window.game.setActiveCheckpoint) {
                        // Safe respawn in the center of the track (x: 0) facing forward
                        window.game.setActiveCheckpoint(0, post.y, post.z, post.id);
                    }
                }
            }
        });

        // 7. Update Giant Goal Ring
        if (this.goalRing && !this.goalRing.reached) {
            // Swirl main cosmic portal vortex
            if (this.goalRing.portalMesh) {
                this.goalRing.portalMesh.rotation.z += dt * 1.8;
            }

            // Counter-swirl inner pulse core with rhythmic breathing
            if (this.goalRing.innerCoreMesh) {
                this.goalRing.innerCoreMesh.rotation.z -= dt * 2.5;
                const pulse = 1.0 + Math.sin(time * 3.5) * 0.06;
                this.goalRing.innerCoreMesh.scale.set(pulse, pulse, 1.0);
            }

            // Slowly rotate celestial light beacon & pulse intensity
            if (this.goalRing.beaconMesh) {
                this.goalRing.beaconMesh.rotation.y += dt * 0.4;
                if (this.goalRing.beaconMesh.material) {
                    this.goalRing.beaconMesh.material.opacity = 0.16 + Math.sin(time * 2.2) * 0.05;
                }
            }

            // 16 Orbiting Chaos Energy Sparkles
            if (this.goalSparkles) {
                this.goalSparkles.forEach((s, idx) => {
                    const a = time * 2.2 + (idx / this.goalSparkles.length) * Math.PI * 2;
                    const r = this.goalRing.radius + 1.1 + Math.sin(time * 3.0 + idx) * 0.35;
                    s.position.set(
                        Math.cos(a) * r,
                        Math.sin(a) * r,
                        Math.sin(a * 2.5) * 1.4
                    );
                    const sc = 0.75 + Math.sin(time * 4.0 + idx) * 0.25;
                    s.scale.set(sc, sc, sc);
                });
            }

            // Gateway Trigger Zone Detection:
            // Allows Sonic to cleanly trigger whether running flat on the road, rolling, or jumping!
            const dx = sonic.position.x - this.goalRing.x;
            const dz = sonic.position.z - this.goalRing.z;
            const dy = sonic.position.y - this.goalRing.groundY;

            // 1. Horizontal span (inside the 17m gateway opening + safety margin)
            const inHorizontal = Math.abs(dx) <= (this.goalRing.radius + 1.8);

            // 2. Vertical span (from track floor up to above the top of the ring)
            const inVertical = (dy >= -1.5 && dy <= (this.goalRing.radius * 2.0 + 4.0));

            // 3. Depth span (crossing or close to the gate's Z plane)
            const inDepth = Math.abs(dz) <= 4.5;

            // 4. Fallback 3D sphere from center
            const dist3D = sonic.position.distanceTo(this.goalRing.group.position);
            const inSphere = dist3D <= (this.goalRing.radius + 3.5);

            if ((inHorizontal && inVertical && inDepth) || inSphere) {
                this.goalRing.reached = true;

                // Dramatic warp entry expansion FX
                if (this.goalRing.portalMesh) {
                    this.goalRing.portalMesh.scale.multiplyScalar(1.35);
                }
                if (this.goalRing.innerCoreMesh && this.goalRing.innerCoreMesh.material) {
                    this.goalRing.innerCoreMesh.material.opacity = 1.0;
                }

                if (window.soundManager && window.soundManager.playVictory) {
                    window.soundManager.playVictory();
                }
                if (onGoalReached) onGoalReached();
            }
        }
    }
}

window.ObjectManager = ObjectManager;
