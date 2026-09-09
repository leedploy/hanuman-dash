// 3D Sonic Character & Physics Controller
// Procedural stylized 3D model with running & spin ball animations, momentum physics, and effects.

class SonicPlayer {
    constructor(scene) {
        this.scene = scene;
        
        // Transform & Physics
        this.position = new THREE.Vector3(0, 1.2, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.rotationY = Math.PI; // Face forward down -Z along course
        this.forwardSpeed = 0;
        this.strafeVelLateral = 0; // Smooth lateral lane weaving velocity (- for left, + for right)
        this.strafeVelX = 0; // Backward compatible alias
        this.steerSpeed = 4.0; // Standstill 360-degree turning
        this.bankingAngle = 0;
        this.worldGroundHeight = 0;
        
        // Physics constants - Level 1 Balanced Speed Tuning
        this.accel = 30.0;
        this.maxSpeed = 34.0;
        this.boostMaxSpeed = 58.0;
        this.friction = 0.94;
        this.gravity = 42.0;
        this.jumpForce = 28.0;
        this.minJumpForce = 14.0;
        this.springForce = 52.0;
        
        // States
        this.isGrounded = false;
        this.isJumping = false;
        this.isSpringBouncing = false;
        this.isSpinning = false;
        this.isBoosting = false;
        this.isDashing = false;
        this.dashTimer = 0;
        this.boostEnergy = 100;
        this.maxBoostEnergy = 100;
        this.boostDepleted = false;
        this.rings = 0;
        this.totalRingsCollected = 0;
        this.score = 0;
        this.invulnerableTimer = 0;
        this.isHurt = false;
        this.hurtTimer = 0;
        this.isDead = false;
        this.deathTimer = 0;

        // Spin Dash Revving State
        this.isChargingSpinDash = false;
        this.spinDashCharge = 0;

        // 3D Loop-The-Loop Trajectory State
        this.isLooping = false;
        this.currentLoop = null;
        this.loopAngle = 0;
        this.loopPitch = 0;
        this.loopSpeed = 36;
        this.loopCooldown = 0;

        // Render Mode: 'hanuman' (Hanuman Dash 3D rigged model), 'mesh3d' (Articulated 3D Model) or 'sprite' (Retro 2D Sprite)
        this.renderMode = 'hanuman';
        this.hanumanModel = null;
        this.hanumanGroup = null;
        this.hanumanMixer = null;
        this.hanumanActions = {};
        this.hanumanIdleAction = null;
        this.hanumanRunAction = null;
        this.hanumanFastRunAction = null;
        this.hanumanJumpAction = null;
        this.hanumanDanceAction = null;
        this.currentHanumanAnim = 'idle';
        this.isHanumanLoaded = false;
        this.isDancing = false;
        this.idleTimer = 0;
        
        // Visual groups
        this.group = new THREE.Group();
        this.modelGroup = new THREE.Group();
        this.ballMesh = null;
        this.dustParticles = [];
        this.trailMeshes = [];
        
        // Animation tracking
        this.animTime = 0;
        this.currentSpeed = 0;

        // Sprite Sheet Animator
        this.spriteAnimator = new SonicSpriteAnimator();
        this.group.add(this.spriteAnimator.mesh);

        this.buildModel();
        this.buildSpinBall();
        this.buildBoostAura();
        this.buildEffects();
        this.loadHanumanModel();
        
        this.group.add(this.modelGroup);
        this.group.add(this.ballMesh);
        this.scene.add(this.group);

        this.applyRenderModeVisibility();
    }

    buildModel() {
        // High-Quality Materials with realistic lighting highlights
        const sonicBlue = 0x004ee6;
        const skinPeach = 0xffc49c;
        const shoeRed = 0xe60012;
        const gloveWhite = 0xffffff;
        const goldYellow = 0xffd700;
        const blackColor = 0x0a0a0a;
        const eyeGreen = 0x00d64f;

        const blueMat = new THREE.MeshStandardMaterial({ color: sonicBlue, roughness: 0.32, metalness: 0.08 });
        const skinMat = new THREE.MeshStandardMaterial({ color: skinPeach, roughness: 0.65 });
        const shoeMat = new THREE.MeshStandardMaterial({ color: shoeRed, roughness: 0.22, metalness: 0.08 });
        const whiteMat = new THREE.MeshStandardMaterial({ color: gloveWhite, roughness: 0.35 });
        const goldMat = new THREE.MeshStandardMaterial({ color: goldYellow, roughness: 0.18, metalness: 0.9 });
        const blackMat = new THREE.MeshBasicMaterial({ color: blackColor });
        const greenMat = new THREE.MeshStandardMaterial({ color: eyeGreen, roughness: 0.15 });

        // Root Character Model Group
        this.characterModel = new THREE.Group();

        // 1. Torso
        const bodyGeo = new THREE.SphereGeometry(0.54, 20, 20);
        const bodyMesh = new THREE.Mesh(bodyGeo, blueMat);
        bodyMesh.position.y = 0.82;
        bodyMesh.castShadow = true;
        this.characterModel.add(bodyMesh);

        // Peach Oval Belly Patch
        const bellyGeo = new THREE.SphereGeometry(0.39, 16, 16);
        bellyGeo.scale(0.82, 1.12, 0.45);
        const bellyMesh = new THREE.Mesh(bellyGeo, skinMat);
        bellyMesh.position.set(0, 0.8, 0.34);
        this.characterModel.add(bellyMesh);

        // 2 Back Spine Spikes on Torso
        [-0.15, 0.15].forEach(xOff => {
            const backSpkGeo = new THREE.ConeGeometry(0.12, 0.38, 8);
            const backSpk = new THREE.Mesh(backSpkGeo, blueMat);
            backSpk.position.set(xOff, 0.95, -0.48);
            backSpk.rotation.x = -Math.PI * 0.42;
            this.characterModel.add(backSpk);
        });

        // Pointed Tail pointing upward
        const tailGeo = new THREE.ConeGeometry(0.12, 0.48, 8);
        const tailMesh = new THREE.Mesh(tailGeo, blueMat);
        tailMesh.rotation.x = -Math.PI * 0.38;
        tailMesh.position.set(0, 0.72, -0.48);
        this.characterModel.add(tailMesh);

        // 2. Head Group
        this.headGroup = new THREE.Group();
        this.headGroup.position.set(0, 1.54, 0.06);

        // Head Sphere
        const headGeo = new THREE.SphereGeometry(0.64, 22, 22);
        const headMesh = new THREE.Mesh(headGeo, blueMat);
        headMesh.castShadow = true;
        this.headGroup.add(headMesh);

        // 6 Iconic Swept-back Quills (Sculpted curves)
        const quillConfigs = [
            // Top Quill (sweeps up & back)
            { pos: [0, 0.32, -0.52], rot: [-Math.PI * 0.52, 0, 0], scale: [0.32, 1.25, 0.32] },
            // Upper Sides (left & right)
            { pos: [0.34, 0.18, -0.48], rot: [-Math.PI * 0.46, 0.32, -0.28], scale: [0.26, 1.05, 0.26] },
            { pos: [-0.34, 0.18, -0.48], rot: [-Math.PI * 0.46, -0.32, 0.28], scale: [0.26, 1.05, 0.26] },
            // Mid Quill (central back)
            { pos: [0, -0.04, -0.58], rot: [-Math.PI * 0.42, 0, 0], scale: [0.3, 1.1, 0.3] },
            // Lower Sides (left & right downward curve)
            { pos: [0.3, -0.18, -0.48], rot: [-Math.PI * 0.38, 0.28, -0.2], scale: [0.24, 0.95, 0.24] },
            { pos: [-0.3, -0.18, -0.48], rot: [-Math.PI * 0.38, -0.28, 0.2], scale: [0.24, 0.95, 0.24] }
        ];

        quillConfigs.forEach(cfg => {
            const qGeo = new THREE.ConeGeometry(cfg.scale[0], cfg.scale[1], 12);
            const qMesh = new THREE.Mesh(qGeo, blueMat);
            qMesh.position.set(...cfg.pos);
            qMesh.rotation.set(...cfg.rot);
            qMesh.castShadow = true;
            this.headGroup.add(qMesh);
        });

        // Peach Muzzle
        const muzzleGeo = new THREE.SphereGeometry(0.39, 16, 14);
        muzzleGeo.scale(1.05, 0.72, 0.75);
        const muzzleMesh = new THREE.Mesh(muzzleGeo, skinMat);
        muzzleMesh.position.set(0, -0.15, 0.48);
        this.headGroup.add(muzzleMesh);

        // Confident Smirk (side smile notch)
        const smirkGeo = new THREE.TorusGeometry(0.08, 0.02, 6, 8, Math.PI * 0.8);
        const smirk = new THREE.Mesh(smirkGeo, blackMat);
        smirk.position.set(0.24, -0.18, 0.68);
        smirk.rotation.set(0, 0.35, -0.3);
        this.headGroup.add(smirk);

        // Glossy Black Nose
        const noseGeo = new THREE.SphereGeometry(0.095, 12, 12);
        const noseMesh = new THREE.Mesh(noseGeo, blackMat);
        noseMesh.position.set(0, -0.04, 0.78);
        this.headGroup.add(noseMesh);

        // Big Classic Connected Eyes (White Visor Sockets)
        const eyeSocketGeo = new THREE.SphereGeometry(0.35, 16, 16);
        eyeSocketGeo.scale(0.85, 1.08, 0.45);
        const leftEye = new THREE.Mesh(eyeSocketGeo, whiteMat);
        leftEye.position.set(-0.16, 0.14, 0.48);
        leftEye.rotation.y = -0.08;
        const rightEye = new THREE.Mesh(eyeSocketGeo, whiteMat);
        rightEye.position.set(0.16, 0.14, 0.48);
        rightEye.rotation.y = 0.08;
        this.headGroup.add(leftEye);
        this.headGroup.add(rightEye);

        // Determined Brow Ridge
        const browGeo = new THREE.BoxGeometry(0.68, 0.09, 0.22);
        const browMesh = new THREE.Mesh(browGeo, blueMat);
        browMesh.position.set(0, 0.45, 0.46);
        browMesh.rotation.x = 0.25;
        this.headGroup.add(browMesh);

        // Emerald Green Irises
        const pupilGeo = new THREE.SphereGeometry(0.13, 12, 12);
        pupilGeo.scale(0.68, 1.25, 0.3);
        const leftPupil = new THREE.Mesh(pupilGeo, greenMat);
        leftPupil.position.set(-0.13, 0.14, 0.68);
        const rightPupil = new THREE.Mesh(pupilGeo, greenMat);
        rightPupil.position.set(0.13, 0.14, 0.68);
        this.headGroup.add(leftPupil);
        this.headGroup.add(rightPupil);

        // Black Pupil Cores
        const coreGeo = new THREE.SphereGeometry(0.075, 10, 10);
        coreGeo.scale(0.65, 1.2, 0.3);
        const leftCore = new THREE.Mesh(coreGeo, blackMat);
        leftCore.position.set(-0.13, 0.14, 0.73);
        const rightCore = new THREE.Mesh(coreGeo, blackMat);
        rightCore.position.set(0.13, 0.14, 0.73);
        this.headGroup.add(leftCore);
        this.headGroup.add(rightCore);

        // Specular White Eye Highlights (gleaming sparkle!)
        const sparkleGeo = new THREE.SphereGeometry(0.035, 8, 8);
        const leftGleam = new THREE.Mesh(sparkleGeo, whiteMat);
        leftGleam.position.set(-0.11, 0.19, 0.75);
        const rightGleam = new THREE.Mesh(sparkleGeo, whiteMat);
        rightGleam.position.set(0.15, 0.19, 0.75);
        this.headGroup.add(leftGleam);
        this.headGroup.add(rightGleam);

        // Ears (Triangular, Blue outer, Peach inside)
        [-0.4, 0.4].forEach((xSide, i) => {
            const earGeo = new THREE.ConeGeometry(0.19, 0.42, 4);
            const earMesh = new THREE.Mesh(earGeo, blueMat);
            earMesh.position.set(xSide, 0.54, 0.05);
            earMesh.rotation.z = (i === 0 ? 0.38 : -0.38);
            earMesh.rotation.x = -0.15;

            const innerEarGeo = new THREE.ConeGeometry(0.12, 0.3, 4);
            const innerEarMesh = new THREE.Mesh(innerEarGeo, skinMat);
            innerEarMesh.position.set(0, 0, 0.05);
            earMesh.add(innerEarMesh);

            this.headGroup.add(earMesh);
        });

        this.characterModel.add(this.headGroup);

        // 3. Articulated Arms (Shoulder -> Upper Arm -> Forearm & Glove)
        this.leftArm = this.createArticulatedArm(skinMat, whiteMat, -1);
        this.rightArm = this.createArticulatedArm(skinMat, whiteMat, 1);
        this.characterModel.add(this.leftArm.group);
        this.characterModel.add(this.rightArm.group);

        // 4. Articulated Legs & Sleek Red Sneakers
        this.leftLeg = this.createArticulatedLeg(blueMat, shoeMat, whiteMat, goldMat, -1);
        this.rightLeg = this.createArticulatedLeg(blueMat, shoeMat, whiteMat, goldMat, 1);
        this.characterModel.add(this.leftLeg.group);
        this.characterModel.add(this.rightLeg.group);

        this.modelGroup.add(this.characterModel);
    }

    createArticulatedArm(skinMat, whiteMat, side) {
        const armGroup = new THREE.Group();
        armGroup.position.set(side * 0.48, 0.98, 0);

        // Upper Arm
        const upperGeo = new THREE.CylinderGeometry(0.08, 0.075, 0.32, 8);
        upperGeo.translate(0, -0.16, 0);
        const upperMesh = new THREE.Mesh(upperGeo, skinMat);
        armGroup.add(upperMesh);

        // Elbow Joint & Forearm
        const elbowGroup = new THREE.Group();
        elbowGroup.position.set(0, -0.3, 0);

        const foreGeo = new THREE.CylinderGeometry(0.075, 0.07, 0.28, 8);
        foreGeo.translate(0, -0.14, 0);
        const foreMesh = new THREE.Mesh(foreGeo, skinMat);
        elbowGroup.add(foreMesh);

        // White Glove Cuff Torus
        const cuffGeo = new THREE.TorusGeometry(0.15, 0.065, 8, 16);
        cuffGeo.rotateX(Math.PI / 2);
        const cuffMesh = new THREE.Mesh(cuffGeo, whiteMat);
        cuffMesh.position.set(0, -0.28, 0);
        elbowGroup.add(cuffMesh);

        // White Puffy Glove Hand
        const handGeo = new THREE.SphereGeometry(0.19, 14, 14);
        handGeo.scale(1, 1.1, 1.1);
        const handMesh = new THREE.Mesh(handGeo, whiteMat);
        handMesh.position.set(0, -0.38, 0);
        elbowGroup.add(handMesh);

        armGroup.add(elbowGroup);

        return {
            group: armGroup,
            elbow: elbowGroup
        };
    }

    createArticulatedLeg(blueMat, shoeMat, whiteMat, goldMat, side) {
        const legGroup = new THREE.Group();
        legGroup.position.set(side * 0.24, 0.58, 0);

        // Thigh (Blue)
        const thighGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.32, 8);
        thighGeo.translate(0, -0.16, 0);
        const thighMesh = new THREE.Mesh(thighGeo, blueMat);
        legGroup.add(thighMesh);

        // Knee Joint & Shin
        const kneeGroup = new THREE.Group();
        kneeGroup.position.set(0, -0.3, 0);

        const shinGeo = new THREE.CylinderGeometry(0.08, 0.075, 0.3, 8);
        shinGeo.translate(0, -0.15, 0);
        const shinMesh = new THREE.Mesh(shinGeo, blueMat);
        kneeGroup.add(shinMesh);

        // Sock Cuff (White Torus)
        const sockGeo = new THREE.TorusGeometry(0.16, 0.07, 8, 16);
        sockGeo.rotateX(Math.PI / 2);
        const sockMesh = new THREE.Mesh(sockGeo, whiteMat);
        sockMesh.position.set(0, -0.3, 0);
        kneeGroup.add(sockMesh);

        // Iconic Red Sneaker (Aerodynamic racing shoe shape)
        const shoeGroup = new THREE.Group();
        shoeGroup.position.set(0, -0.4, 0.1);

        // Main Shoe Body
        const shoeBodyGeo = new THREE.BoxGeometry(0.3, 0.24, 0.64);
        const shoeMesh = new THREE.Mesh(shoeBodyGeo, shoeMat);
        shoeMesh.castShadow = true;
        shoeGroup.add(shoeMesh);

        // Upturned Curved Toe
        const toeGeo = new THREE.SphereGeometry(0.16, 12, 10);
        toeGeo.scale(0.9, 0.7, 1.2);
        const toeMesh = new THREE.Mesh(toeGeo, shoeMat);
        toeMesh.position.set(0, 0.02, 0.28);
        shoeGroup.add(toeMesh);

        // White Central Racing Stripe
        const stripeGeo = new THREE.BoxGeometry(0.32, 0.26, 0.14);
        const stripeMesh = new THREE.Mesh(stripeGeo, whiteMat);
        stripeMesh.position.set(0, 0.01, 0.04);
        shoeGroup.add(stripeMesh);

        // Shiny Gold Buckle on Outer Side
        const buckleGeo = new THREE.BoxGeometry(0.06, 0.14, 0.16);
        const buckleMesh = new THREE.Mesh(buckleGeo, goldMat);
        buckleMesh.position.set(side * 0.17, 0.03, 0.04);
        shoeGroup.add(buckleMesh);

        // White Athletic Sole
        const soleGeo = new THREE.BoxGeometry(0.32, 0.06, 0.68);
        const soleMesh = new THREE.Mesh(soleGeo, whiteMat);
        soleMesh.position.set(0, -0.12, 0.02);
        shoeGroup.add(soleMesh);

        kneeGroup.add(shoeGroup);
        legGroup.add(kneeGroup);

        return {
            group: legGroup,
            knee: kneeGroup,
            shoe: shoeGroup
        };
    }

    buildBoostAura() {
        // Vayu Divine Tornado Vortex (White & Celestial Cyan Whirlwind of the Wind God)
        const auraGroup = new THREE.Group();

        // 1. Outer Inverted Tornado Cone (Flares wide as it rises)
        const outerGeo = new THREE.CylinderGeometry(1.55, 0.45, 2.7, 18, 6, true);
        const outerMat = new THREE.MeshBasicMaterial({
            color: 0x64d2ff,
            transparent: true,
            opacity: 0.35,
            wireframe: true,
            side: THREE.DoubleSide
        });
        const outerFunnel = new THREE.Mesh(outerGeo, outerMat);
        outerFunnel.position.y = 1.35;
        auraGroup.add(outerFunnel);
        this.vayuOuterFunnel = outerFunnel;

        // 2. Inner Counter-Rotating Wind Current (Ethereal White-Cyan)
        const innerGeo = new THREE.CylinderGeometry(1.25, 0.35, 2.5, 14, 4, true);
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.28,
            wireframe: true,
            side: THREE.DoubleSide
        });
        const innerFunnel = new THREE.Mesh(innerGeo, innerMat);
        innerFunnel.position.y = 1.35;
        auraGroup.add(innerFunnel);
        this.vayuInnerFunnel = innerFunnel;

        // 3. Ascending Spiral Vortex Ribbons (4 ascending celestial rings)
        this.vayuSpiralRings = [];
        const ringColors = [0x00f0ff, 0xffffff, 0x80e5ff, 0xffe066];
        for (let i = 0; i < 4; i++) {
            const rGeo = new THREE.TorusGeometry(0.7 + i * 0.25, 0.042, 6, 28);
            const rMat = new THREE.MeshBasicMaterial({
                color: ringColors[i % ringColors.length],
                transparent: true,
                opacity: 0.65
            });
            const rMesh = new THREE.Mesh(rGeo, rMat);
            rMesh.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.25;
            rMesh.position.y = 0.3 + i * 0.65;
            rMesh.userData = {
                baseY: rMesh.position.y,
                phase: (i / 4) * Math.PI * 2,
                speedY: 2.2 + i * 0.3
            };
            auraGroup.add(rMesh);
            this.vayuSpiralRings.push(rMesh);
        }

        // 4. Ground Whirlwind Shockwave Ring (At feet kicking up wind currents)
        const groundGeo = new THREE.RingGeometry(0.35, 1.5, 24);
        const groundMat = new THREE.MeshBasicMaterial({
            color: 0x00e5ff,
            transparent: true,
            opacity: 0.55,
            side: THREE.DoubleSide
        });
        const groundRing = new THREE.Mesh(groundGeo, groundMat);
        groundRing.rotation.x = -Math.PI / 2;
        groundRing.position.y = 0.06;
        auraGroup.add(groundRing);
        this.vayuGroundRing = groundRing;

        // 5. Swirling Wind Sparkle Particles (24 particles orbiting in vertical vortex)
        this.vayuWindParticles = [];
        const pGeo = new THREE.SphereGeometry(0.065, 5, 5);
        for (let i = 0; i < 24; i++) {
            const isGold = (i % 5 === 0);
            const pMat = new THREE.MeshBasicMaterial({
                color: isGold ? 0xffd700 : (i % 2 === 0 ? 0xffffff : 0x00f0ff),
                transparent: true,
                opacity: 0.75
            });
            const p = new THREE.Mesh(pGeo, pMat);
            p.userData = {
                angle: (i / 24) * Math.PI * 2,
                height: (i / 24) * 2.6 + 0.1,
                speed: 9.0 + (i % 6) * 1.5,
                ySpeed: 2.0 + (i % 4) * 0.5
            };
            auraGroup.add(p);
            this.vayuWindParticles.push(p);
        }

        auraGroup.position.set(0, 0, 0);
        auraGroup.visible = false;
        this.boostAura = auraGroup;
        this.group.add(auraGroup);
    }

    buildSpinBall() {
        // Spin Dash / Jump Attack Ball
        const ballGroup = new THREE.Group();
        const ballGeo = new THREE.SphereGeometry(0.72, 16, 16);
        const ballMat = new THREE.MeshLambertMaterial({ 
            color: 0x0055ff,
            emissive: 0x002288
        });
        const sphereMesh = new THREE.Mesh(ballGeo, ballMat);
        ballGroup.add(sphereMesh);

        // Spikes sticking out of ball
        const spikeGeo = new THREE.ConeGeometry(0.28, 0.6, 8);
        const spikeMat = new THREE.MeshLambertMaterial({ color: 0x0033cc });
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const spk = new THREE.Mesh(spikeGeo, spikeMat);
            spk.position.set(Math.cos(angle) * 0.55, Math.sin(angle) * 0.55, 0);
            spk.rotation.z = angle - Math.PI / 2;
            ballGroup.add(spk);
        }

        // Energy glow ring
        const ringGeo = new THREE.TorusGeometry(0.85, 0.06, 8, 24);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x88ccff });
        const energyRing = new THREE.Mesh(ringGeo, ringMat);
        ballGroup.add(energyRing);

        ballGroup.position.y = 0.72;
        ballGroup.visible = false;
        this.ballMesh = ballGroup;
    }

    buildEffects() {
        // Dust particle pool for running / skidding
        const dustMat = new THREE.MeshBasicMaterial({ color: 0xdedede, transparent: true, opacity: 0.6 });
        for (let i = 0; i < 15; i++) {
            const p = new THREE.Mesh(new THREE.SphereGeometry(0.15, 6, 6), dustMat.clone());
            p.visible = false;
            p.life = 0;
            this.scene.add(p);
            this.dustParticles.push(p);
        }
    }

    spawnDust(x, y, z) {
        const p = this.dustParticles.find(d => !d.visible);
        if (p) {
            p.position.set(x + (Math.random() - 0.5) * 0.4, y + 0.1, z + (Math.random() - 0.5) * 0.4);
            p.visible = true;
            p.scale.set(1, 1, 1);
            p.material.opacity = 0.65;
            p.life = 1.0;
        }
    }

    loadHanumanModel() {
        if (typeof THREE.GLTFLoader === 'undefined') {
            console.warn('THREE.GLTFLoader is not available for Hanuman');
            return;
        }

        const loader = new THREE.GLTFLoader();
        const primaryPath = 'assets/hanuman.glb';
        const fallbackPath = 'assets/Meshy_AI_Meshy_Merged_Animations.glb';

        const setupHanumanGLTF = (gltf) => {
            const model = gltf.scene;
            this.hanumanModel = model;

            // Hanuman athletic heroic scale matching course gauge
            model.scale.set(1.15, 1.15, 1.15);

            // Compute exact bounding box after scaling
            const box = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            box.getCenter(center);

            // Ground base at feet Y=0, center X & Z
            model.position.set(-center.x, -box.min.y, -center.z);

            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material) {
                        child.material.roughness = 0.45;
                        child.material.metalness = 0.15;
                    }
                }
            });

            // Set up Animation Mixer and map all 5 essential actions
            if (gltf.animations && gltf.animations.length > 0) {
                this.hanumanMixer = new THREE.AnimationMixer(model);
                this.hanumanActions = {};

                gltf.animations.forEach((clip) => {
                    const action = this.hanumanMixer.clipAction(clip);
                    this.hanumanActions[clip.name] = action;
                });

                // Clip mappings (supports Idle_9, Regular_Jump, and future model variations)
                const findAction = (names, fallback) => {
                    for (const n of names) {
                        if (this.hanumanActions[n]) return this.hanumanActions[n];
                    }
                    for (const n of names) {
                        const key = Object.keys(this.hanumanActions).find(k => new RegExp(n, 'i').test(k) && !k.toLowerCase().includes('restpose'));
                        if (key) return this.hanumanActions[key];
                    }
                    return fallback;
                };

                this.hanumanIdleAction = findAction(['Idle_9', 'Idle_3', 'idle', 'stand'], null) || Object.values(this.hanumanActions)[0];
                this.hanumanRunAction = findAction(['Running', 'run'], Object.values(this.hanumanActions)[0]);
                this.hanumanFastRunAction = findAction(['RunFast', 'sprint', 'fast'], this.hanumanRunAction);
                this.hanumanJumpAction = findAction(['Regular_Jump', 'Jump_Over_Obstacle_2', 'Jump_and_Grab_Wall', 'jump'], this.hanumanRunAction);
                this.hanumanDanceAction = findAction(['Not_Your_Mom', 'dance'], this.hanumanIdleAction);

                if (this.hanumanIdleAction) {
                    this.hanumanIdleAction.setLoop(THREE.LoopRepeat);
                    this.hanumanIdleAction.play();
                }
                if (this.hanumanRunAction) this.hanumanRunAction.setLoop(THREE.LoopRepeat);
                if (this.hanumanFastRunAction) this.hanumanFastRunAction.setLoop(THREE.LoopRepeat);
                if (this.hanumanJumpAction) {
                    this.hanumanJumpAction.setLoop(THREE.LoopOnce);
                    this.hanumanJumpAction.clampWhenFinished = true;
                }
                if (this.hanumanDanceAction) this.hanumanDanceAction.setLoop(THREE.LoopRepeat);
            }

            this.hanumanGroup = new THREE.Group();
            this.hanumanGroup.add(model);
            this.group.add(this.hanumanGroup);

            this.isHanumanLoaded = true;
            this.renderMode = 'hanuman';
            this.currentHanumanAnim = 'idle';
            this.applyRenderModeVisibility();

            if (window.game && window.game.updateModeUI) {
                window.game.updateModeUI('hanuman');
            }

            console.log('Hanuman 3D Model successfully loaded! Clips:', Object.keys(this.hanumanActions || {}));
        };

        const cdnPath = 'https://cdn.1thaiai.com/gameprompt/007Hanuman/hanuman.glb';
        loader.load(primaryPath, setupHanumanGLTF, undefined, (err) => {
            console.log('Local assets/hanuman.glb not found, streaming from Cloudflare R2 CDN...');
            loader.load(cdnPath, setupHanumanGLTF, undefined, (cdnErr) => {
                console.warn('Could not load hanuman.glb from local or CDN:', cdnErr);
            });
        });
    }

    switchHanumanAnim(target, fadeDuration = 0.15) {
        if (this.currentHanumanAnim === target) return;
        const oldAction = this.getHanumanActionByName(this.currentHanumanAnim);
        const newAction = this.getHanumanActionByName(target);

        if (oldAction && oldAction !== newAction) {
            oldAction.fadeOut(fadeDuration);
        }
        if (newAction) {
            newAction.reset().fadeIn(fadeDuration).play();
        }
        this.currentHanumanAnim = target;
    }

    getHanumanActionByName(name) {
        if (name === 'idle') return this.hanumanIdleAction;
        if (name === 'run') return this.hanumanRunAction;
        if (name === 'runFast') return this.hanumanFastRunAction;
        if (name === 'jump') return this.hanumanJumpAction;
        if (name === 'dance') return this.hanumanDanceAction;
        return null;
    }

    toggleRenderMode() {
        if (this.renderMode === 'hanuman') {
            this.renderMode = 'sprite';
        } else if (this.renderMode === 'sprite') {
            this.renderMode = 'mesh3d';
        } else {
            this.renderMode = this.isHanumanLoaded ? 'hanuman' : 'mesh3d';
        }
        this.applyRenderModeVisibility();
        return this.renderMode;
    }

    applyRenderModeVisibility() {
        const isBall = (this.renderMode === 'hanuman')
            ? ((this.isSpinning && !this.isJumping) || this.isChargingSpinDash)
            : (this.isSpinning || this.isJumping || this.isChargingSpinDash);

        if (this.renderMode === 'sprite') {
            this.spriteAnimator.mesh.visible = true;
            this.modelGroup.visible = false;
            if (this.hanumanGroup) this.hanumanGroup.visible = false;
            this.ballMesh.visible = false;
        } else if (this.renderMode === 'hanuman') {
            this.spriteAnimator.mesh.visible = false;
            this.modelGroup.visible = false;
            if (this.hanumanGroup) this.hanumanGroup.visible = !isBall;
            this.ballMesh.visible = isBall;
        } else {
            // mesh3d
            this.spriteAnimator.mesh.visible = false;
            if (this.hanumanGroup) this.hanumanGroup.visible = false;
            this.modelGroup.visible = !isBall;
            this.ballMesh.visible = isBall;
        }
    }

    update(dt, input, world) {
        this.animTime += dt;

        // Idle detection for Easter Egg Dance (10 seconds without movement or inputs)
        const hasInput = !!(input.up || input.down || input.left || input.right || input.jump || input.boost || input.spin);
        const hasSpeed = Math.abs(this.forwardSpeed) > 0.4 || Math.abs(this.velocity.x) > 0.4 || Math.abs(this.strafeVelLateral) > 0.4;
        const canDance = !hasInput && !hasSpeed && this.isGrounded && !this.isHurt && !this.isDead && !this.isSpinning && !this.isChargingSpinDash;

        if (canDance) {
            this.idleTimer += dt;
            if (this.idleTimer >= 10.0) {
                this.isDancing = true;
            }
        } else {
            this.idleTimer = 0;
            this.isDancing = false;
        }

        if (this.loopCooldown > 0) {
            this.loopCooldown -= dt;
        }

        // 3D Loop-The-Loop Check & Execution
        if (!this.isLooping && this.loopCooldown <= 0 && world && world.getLoopNear) {
            const isHeadingForward = Math.cos(this.rotationY) < -0.4;
            const hasForwardMomentum = (this.forwardSpeed > 10) || (this.velocity.z < -10);
            if (isHeadingForward && hasForwardMomentum) {
                const nearLoop = world.getLoopNear(this.position.x, this.position.y, this.position.z);
                if (nearLoop) {
                    this.startLoop(nearLoop);
                }
            }
        }

        if (this.isDead) {
            this.deathTimer -= dt;
            this.velocity.y -= this.gravity * 0.9 * dt;
            this.position.y += this.velocity.y * dt;
            this.group.position.copy(this.position);
            // Dramatic flinch / tilt back during fatal drop
            if (this.hanumanGroup) {
                this.hanumanGroup.rotation.x = -0.55;
            } else if (this.modelGroup) {
                this.modelGroup.rotation.x = -0.55;
            }
            return;
        }

        if (this.isLooping) {
            this.updateLoop(dt);
            return;
        }

        // Invulnerable flash timer
        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer -= dt;
            this.group.visible = Math.floor(this.invulnerableTimer * 22) % 2 === 0;
            if (this.invulnerableTimer <= 0) {
                this.group.visible = true;
            }
        }

        // Boost handling: Requires holding boost key, not being locked out by depletion, and having energy
        if (input.boost && !this.boostDepleted && this.boostEnergy > 0) {
            if (!this.isBoosting) {
                if (window.soundManager && window.soundManager.playBoost) {
                    window.soundManager.playBoost();
                }
            }
            this.isBoosting = true;
            this.boostEnergy = Math.max(0, this.boostEnergy - dt * 25);
            if (this.boostEnergy <= 0) {
                this.isBoosting = false;
                this.boostDepleted = true; // Lockout boost until key is released and recharged!
            }
        } else {
            this.isBoosting = false;
            // Player must release boost key (input.boost is false) AND recover to at least 15% energy to clear lockout
            if (!input.boost && this.boostEnergy >= 15.0) {
                this.boostDepleted = false;
            }
            // Recharge boost slowly over time (reduced to dt * 3.5 for balanced pacing)
            this.boostEnergy = Math.min(this.maxBoostEnergy, this.boostEnergy + dt * 3.5);
        }

        const currentMaxSpeed = this.isBoosting ? this.boostMaxSpeed : this.maxSpeed;
        const currentAccel = this.isBoosting ? this.accel * 1.6 : this.accel;

        // 1. DYNAMIC SPEED-SENSITIVE STEERING & RUNNING STRAFE
        const isSprinting = (Math.abs(this.forwardSpeed) > 5.0);
        
        if (isSprinting) {
            // A. Responsive Running Strafe: Glide left/right relative to Sonic's facing angle
            const targetStrafe = (input.left ? -15.0 : 0) + (input.right ? 15.0 : 0);
            this.strafeVelLateral += (targetStrafe - this.strafeVelLateral) * Math.min(1.0, 16.0 * dt);

            // B. Responsive High-Speed Steering (Smooth turning without sudden jerk)
            const highSpeedSteer = 1.65;
            if (input.left) this.rotationY += highSpeedSteer * dt;
            if (input.right) this.rotationY -= highSpeedSteer * dt;

            // C. Auto-Realign towards active track direction (Forward -Z or Backward +Z)
            // Only assists when steering keys are released AND Sonic is already reasonably aligned (< 55°)
            // This allows the player to freely turn around 180° and run backward without getting pulled back!
            if (!input.left && !input.right) {
                const isHeadingForward = Math.cos(this.rotationY) < 0;
                const targetTrackHeading = isHeadingForward ? Math.PI : 0;
                
                let headingDiff = targetTrackHeading - this.rotationY;
                while (headingDiff > Math.PI) headingDiff -= Math.PI * 2;
                while (headingDiff < -Math.PI) headingDiff += Math.PI * 2;
                
                // Only gently straighten if player is already within ~55° of the track axis
                if (Math.abs(headingDiff) < 0.96) {
                    this.rotationY += headingDiff * Math.min(1.0, 3.5 * dt);
                }
            }
        } else {
            // Low speed or stationary: Full 360-degree free turn
            this.strafeVelLateral *= Math.pow(0.75, dt * 60);
            if (input.left) this.rotationY += this.steerSpeed * dt;
            if (input.right) this.rotationY -= this.steerSpeed * dt;
        }

        // Keep rotationY within [-PI, PI]
        while (this.rotationY > Math.PI) this.rotationY -= Math.PI * 2;
        while (this.rotationY < -Math.PI) this.rotationY += Math.PI * 2;

        this.strafeVelX = this.strafeVelLateral;

        // Smooth Banking Tilt (tilts into strafe & turns)
        const targetBank = isSprinting
            ? (this.strafeVelLateral / 15.0) * 0.35
            : ((input.left ? 0.32 : 0) - (input.right ? 0.32 : 0));
        this.bankingAngle += (targetBank - this.bankingAngle) * Math.min(1.0, 12.0 * dt);
        this.characterModel.rotation.z = this.bankingAngle;
        if (this.hanumanGroup) this.hanumanGroup.rotation.z = this.bankingAngle;

        // 2. SPIN DASH REVVING SYSTEM
        // When grounded and holding Down: tapping Jump revs the spin dash
        if (this.isGrounded && input.down && (input.jump || input.spinRevTrigger)) {
            this.isChargingSpinDash = true;
            this.forwardSpeed = 0;
            this.spinDashCharge = Math.min(6, this.spinDashCharge + 1);
            window.soundManager.playSpinRev(this.spinDashCharge);
            input.jump = false; // Consume jump
            if (input.spinRevTrigger) input.spinRevTrigger = false;
        }

        if (this.isChargingSpinDash) {
            this.forwardSpeed = 0;
            this.isSpinning = true;

            // Release spin dash when player releases DOWN key
            if (!input.down) {
                this.isChargingSpinDash = false;
                this.forwardSpeed = 26 + this.spinDashCharge * 3; // Balanced burst up to 44
                this.spinDashCharge = 0;
                window.soundManager.playSpinRelease();
            }
        } else if (this.isHurt) {
            // Hurt knockback physics: momentum carries Sonic backward, controls temporarily locked
            this.forwardSpeed *= Math.pow(0.92, dt * 60);
            this.strafeVelLateral *= Math.pow(0.85, dt * 60);
            this.hurtTimer -= dt;
            if ((this.isGrounded && this.hurtTimer <= 0.15) || this.hurtTimer <= 0) {
                this.isHurt = false;
            }
        } else {
            // 3. THROTTLE / BRAKE / REVERSE HANDLING
            if (this.dashTimer > 0) {
                this.dashTimer -= dt;
                // Gradually decay dash speed toward max speed instead of instant drop!
                this.forwardSpeed = Math.max(currentMaxSpeed, this.forwardSpeed - dt * 14.0);
                if (this.dashTimer <= 0) {
                    this.isDashing = false;
                }
            } else if (input.up) {
                // Accelerate forward in facing direction (smoothly handle high speeds)
                if (this.forwardSpeed > currentMaxSpeed) {
                    this.forwardSpeed = Math.max(currentMaxSpeed, this.forwardSpeed - dt * 18.0);
                } else {
                    this.forwardSpeed = Math.min(currentMaxSpeed, this.forwardSpeed + currentAccel * dt);
                }
            } else if (input.down) {
                if (this.forwardSpeed > 2.0) {
                    // Powerful responsive braking when moving forward
                    this.forwardSpeed = Math.max(0, this.forwardSpeed - currentAccel * 2.2 * dt);
                    if (Math.random() < 0.4) this.spawnDust(this.position.x, this.position.y, this.position.z);
                } else {
                    // Slow reverse backing up
                    this.forwardSpeed = Math.max(-12, this.forwardSpeed - currentAccel * 0.5 * dt);
                }
            } else {
                // Natural friction / deceleration when no throttle is applied
                // Preserve momentum during mid-air jumps with low air resistance
                const activeFriction = this.isGrounded ? this.friction : 0.995;
                this.forwardSpeed *= Math.pow(activeFriction, dt * 60);
                if (Math.abs(this.forwardSpeed) < 0.15) this.forwardSpeed = 0;
            }

            // Jump Handling (Variable Jump Height: Short Hop vs Full Hop)
            if (input.jump && this.isGrounded) {
                this.velocity.y = this.jumpForce;
                this.isGrounded = false;
                this.isJumping = true;
                this.isSpringBouncing = false;
                this.isSpinning = (this.renderMode !== 'hanuman');
                window.soundManager.playJump();
            }

            // Variable Jump Cut: When player releases jump button while still rising, clamp upward velocity for a quick short-hop
            if (!input.jump && this.isJumping && !this.isSpringBouncing && this.velocity.y > this.minJumpForce) {
                this.velocity.y = this.minJumpForce;
            }

            // Spin / Roll mode while running at speed
            if (input.spin && Math.abs(this.forwardSpeed) > 8 && this.isGrounded) {
                this.isSpinning = true;
            } else if (!this.isJumping && !input.spin) {
                this.isSpinning = false;
            }
        }

        // 4. SYNCHRONIZE VELOCITY WITH FACING ANGLE + LATERAL STRAFE
        const forwardVx = Math.sin(this.rotationY) * this.forwardSpeed;
        const forwardVz = Math.cos(this.rotationY) * this.forwardSpeed;
        const strafeVx = -Math.cos(this.rotationY) * this.strafeVelLateral;
        const strafeVz = Math.sin(this.rotationY) * this.strafeVelLateral;

        this.velocity.x = forwardVx + strafeVx;
        this.velocity.z = forwardVz + strafeVz;
        this.currentSpeed = Math.sqrt(this.forwardSpeed * this.forwardSpeed + this.strafeVelLateral * this.strafeVelLateral);

        // Update 3D model orientation smoothly
        this.modelGroup.rotation.y = this.rotationY;
        this.ballMesh.rotation.y = this.rotationY;
        this.spriteAnimator.mesh.rotation.y = this.rotationY;

        // Gravity
        this.velocity.y -= this.gravity * dt;

        // Move position
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        this.position.z += this.velocity.z * dt;

        // World Terrain Collision (Ground height check & Downhill Slope Adhesion)
        const groundHeight = world ? world.getGroundHeight(this.position.x, this.position.z) : 0;
        this.worldGroundHeight = groundHeight;
        const distAboveGround = this.position.y - groundHeight;

        // Downhill Slope Adhesion:
        // When running along the ground (not jumping upward), stick smoothly to descending slopes
        // within a generous snap window (up to 2.2m drop at high speed)
        const canSnapToSlope = !this.isJumping && this.velocity.y <= 0.5 && distAboveGround >= 0 && distAboveGround < 2.2 && groundHeight > -40;

        if (groundHeight > -40 && (this.position.y <= groundHeight || canSnapToSlope)) {
            this.position.y = groundHeight;
            this.velocity.y = 0;
            this.isGrounded = true;
            if (this.isJumping) {
                this.isJumping = false;
                this.isSpinning = false;
            }
            this.isSpringBouncing = false;
        } else {
            this.isGrounded = false;
        }

        // Update group position
        this.group.position.copy(this.position);

        // Animate Visuals
        this.updateAnimations(dt, this.currentSpeed);

        // Spawn dust when running or spin charging on ground
        if (this.isGrounded && (this.currentSpeed > 10 || this.isChargingSpinDash) && Math.random() < 0.6) {
            this.spawnDust(this.position.x, this.position.y, this.position.z);
        }

        // Update dust particles
        this.dustParticles.forEach(p => {
            if (p.visible) {
                p.life -= dt * 2.5;
                p.position.y += dt * 0.5;
                p.scale.addScalar(dt * 1.5);
                p.material.opacity = Math.max(0, p.life * 0.6);
                if (p.life <= 0) p.visible = false;
            }
        });
    }

    updateAnimations(dt, horizSpeed) {
        // When running through the 3D loop-the-loop, the character model 3D orientation (pitch, yaw, roll)
        // is controlled exclusively by updateLoop(). Only update skeletal limb motions here, do not overwrite rotations!
        if (this.isLooping) {
            if (this.renderMode === 'mesh3d') {
                const runCycleSpeed = Math.min(28, horizSpeed * 0.45 + 6.0);
                const swing = Math.sin(this.animTime * runCycleSpeed);
                this.leftLeg.group.rotation.x = swing * 1.15;
                this.rightLeg.group.rotation.x = -swing * 1.15;
                this.leftLeg.knee.rotation.x = Math.max(0, -swing * 1.25);
                this.rightLeg.knee.rotation.x = Math.max(0, swing * 1.25);
                this.leftArm.group.rotation.x = -swing * 0.95;
                this.rightArm.group.rotation.x = swing * 0.95;
                this.leftArm.elbow.rotation.x = 0.55 + Math.abs(swing) * 0.35;
                this.rightArm.elbow.rotation.x = 0.55 + Math.abs(swing) * 0.35;
            }
            if (this.hanumanMixer && this.hanumanFastRunAction) {
                this.hanumanFastRunAction.paused = false;
                this.hanumanFastRunAction.timeScale = Math.max(1.8, horizSpeed / 17.0);
                this.hanumanMixer.update(dt);
            }
            return;
        }

        // 1. Update 2D Sprite Animator
        const spriteState = (this.isSpinning || this.isChargingSpinDash || this.isJumping) ? 'spin' : 'run';
        this.spriteAnimator.update(dt, spriteState, horizSpeed, this.isGrounded, this.isBoosting);

        // 2. Update 3D Model Animations
        const isBallMode = (this.renderMode === 'hanuman')
            ? ((this.isSpinning && !this.isJumping) || this.isChargingSpinDash)
            : (this.isSpinning || this.isJumping || this.isChargingSpinDash);
        if (isBallMode) {
            // Spin Ball Mode
            this.characterModel.visible = false;
            if (this.hanumanGroup) this.hanumanGroup.visible = false;
            this.ballMesh.visible = (this.renderMode === 'mesh3d' || this.renderMode === 'hanuman');
            this.ballMesh.rotation.x -= Math.max(22, horizSpeed * 1.8) * dt;
        } else {
            // Regular 3D Character Mode
            this.characterModel.visible = (this.renderMode === 'mesh3d');
            this.ballMesh.visible = false;

            if (horizSpeed > 1.5) {
                // Running animation: leg & arm swings with knee and elbow articulation
                const runCycleSpeed = Math.min(26, horizSpeed * 0.45 + 6.0);
                const swing = Math.sin(this.animTime * runCycleSpeed);

                // Hip swing
                this.leftLeg.group.rotation.x = swing * 1.15;
                this.rightLeg.group.rotation.x = -swing * 1.15;

                // Knee dynamic bend (bends back when leg swings back)
                this.leftLeg.knee.rotation.x = Math.max(0, -swing * 1.25);
                this.rightLeg.knee.rotation.x = Math.max(0, swing * 1.25);

                // Shoulder swing
                this.leftArm.group.rotation.x = -swing * 0.95;
                this.rightArm.group.rotation.x = swing * 0.95;

                // Elbow pumping (bent arm athletic running form)
                this.leftArm.elbow.rotation.x = 0.55 + Math.abs(swing) * 0.35;
                this.rightArm.elbow.rotation.x = 0.55 + Math.abs(swing) * 0.35;

                // Aerodynamic forward lean into the wind
                const forwardLean = Math.min(0.65, horizSpeed / this.maxSpeed * 0.65);
                this.characterModel.rotation.x = forwardLean;
                this.headGroup.position.y = 1.54 + Math.abs(swing) * 0.08;

                // Reset foot idle tap
                this.rightLeg.shoe.rotation.x = 0;
            } else if (this.isDancing) {
                // Procedural rhythmic bounce/twist when idle >= 10s in 3D articulated mesh mode
                const beat = this.animTime * 7.5;
                this.characterModel.rotation.y = Math.sin(beat) * 0.4;
                this.characterModel.rotation.z = Math.cos(beat * 0.5) * 0.15;
                this.leftArm.group.rotation.x = Math.sin(beat) * 0.6;
                this.rightArm.group.rotation.x = -Math.sin(beat) * 0.6;
                this.leftArm.elbow.rotation.x = 0.8 + Math.abs(Math.sin(beat)) * 0.4;
                this.rightArm.elbow.rotation.x = 0.8 + Math.abs(Math.cos(beat)) * 0.4;
                this.headGroup.position.y = 1.54 + Math.abs(Math.sin(beat * 2)) * 0.09;
            } else {
                // Idle stance: breathing gently, right foot tapping impatiently
                const idleBreath = Math.sin(this.animTime * 3.5) * 0.035;
                const footTap = Math.sin(this.animTime * 6.0);

                this.leftLeg.group.rotation.x = 0;
                this.rightLeg.group.rotation.x = 0;
                this.leftLeg.knee.rotation.x = 0;
                this.rightLeg.knee.rotation.x = 0;

                // Right foot impatient tap
                this.rightLeg.shoe.rotation.x = Math.max(0, footTap * 0.3);

                this.leftArm.group.rotation.x = idleBreath * 0.4;
                this.rightArm.group.rotation.x = -idleBreath * 0.4;
                this.leftArm.elbow.rotation.x = 0.35;
                this.rightArm.elbow.rotation.x = 0.35;

                this.characterModel.rotation.x = 0;
                this.headGroup.position.y = 1.54 + idleBreath;
            }

            // B. Hanuman Skinned Skeletal 3D Motion (Idle, Run, FastRun, Jump, Dance)
            if (this.isHanumanLoaded && this.hanumanGroup) {
                this.hanumanGroup.visible = (this.renderMode === 'hanuman' && !isBallMode);
                if (this.renderMode === 'hanuman') {
                    this.hanumanGroup.rotation.y = this.rotationY;
                    this.hanumanGroup.rotation.z = this.bankingAngle;

                    const inAir = this.isJumping || (!this.isGrounded && (this.position.y - (this.worldGroundHeight || 0)) > 2.2);

                    if (inAir) {
                        // In-Air Jump Animation
                        this.isDancing = false;
                        this.idleTimer = 0;
                        if (this.currentHanumanAnim !== 'jump' && this.hanumanJumpAction) {
                            this.switchHanumanAnim('jump', 0.12);
                        }

                        // Aerodynamic forward lean while in the air
                        const forwardLean = Math.min(0.25, (horizSpeed / this.maxSpeed) * 0.25);
                        this.hanumanGroup.rotation.x = forwardLean;
                        this.hanumanGroup.position.y = 0;

                        if (this.hanumanMixer) {
                            this.hanumanMixer.update(dt);
                        }
                    } else {
                        // Ground / Run / FastRun / Dance / Idle State
                        if (this.isDancing && this.hanumanDanceAction) {
                            if (this.currentHanumanAnim !== 'dance') {
                                this.switchHanumanAnim('dance', 0.25);
                            }
                            this.hanumanGroup.rotation.x = 0;
                            this.hanumanGroup.position.y = 0;
                            if (this.hanumanMixer) {
                                this.hanumanMixer.update(dt);
                            }
                        } else if (horizSpeed > 1.2) {
                            const isReversing = (this.forwardSpeed < -0.5);
                            const forwardLean = isReversing ? -0.12 : Math.min(0.35, (horizSpeed / this.maxSpeed) * 0.35);
                            this.hanumanGroup.rotation.x = forwardLean;
                            this.hanumanGroup.position.y = 0;

                            const isFast = (this.isBoosting || horizSpeed > 28.0);
                            const targetAnim = isFast ? 'runFast' : 'run';

                            if (this.currentHanumanAnim !== targetAnim) {
                                this.switchHanumanAnim(targetAnim, 0.15);
                            }

                            if (this.hanumanMixer) {
                                const activeAction = (targetAnim === 'runFast') ? this.hanumanFastRunAction : this.hanumanRunAction;
                                if (activeAction) {
                                    activeAction.paused = false;
                                    const playbackRate = isReversing ? -0.65 : Math.max(0.7, horizSpeed / 16.0);
                                    activeAction.timeScale = playbackRate;
                                }
                                this.hanumanMixer.update(dt);
                            }
                        } else {
                            // Idle State
                            if (this.currentHanumanAnim !== 'idle') {
                                this.switchHanumanAnim('idle', 0.2);
                            }
                            this.hanumanGroup.rotation.x = 0;
                            this.hanumanGroup.position.y = 0;

                            if (this.hanumanMixer) {
                                if (this.hanumanIdleAction) {
                                    this.hanumanIdleAction.paused = false;
                                    this.hanumanIdleAction.timeScale = 1.0;
                                }
                                this.hanumanMixer.update(dt);
                            }
                        }
                    }
                }
            }
        }

        // 3. Vayu Divine Tornado Vortex Aura
        if (this.boostAura) {
            const showAura = (this.isBoosting || this.isChargingSpinDash) && (this.renderMode === 'mesh3d' || this.renderMode === 'hanuman');
            this.boostAura.visible = showAura;
            if (showAura) {
                // High-speed whirlwind funnel rotation
                if (this.vayuOuterFunnel) {
                    this.vayuOuterFunnel.rotation.y += dt * 14.0;
                    const breath = 1.0 + Math.sin(this.animTime * 24.0) * 0.08;
                    this.vayuOuterFunnel.scale.set(breath, 1.0, breath);
                }
                if (this.vayuInnerFunnel) {
                    this.vayuInnerFunnel.rotation.y -= dt * 18.0; // Counter-rotating vortex
                    const breath2 = 1.0 + Math.cos(this.animTime * 20.0) * 0.06;
                    this.vayuInnerFunnel.scale.set(breath2, 1.0, breath2);
                }
                if (this.vayuGroundRing) {
                    this.vayuGroundRing.rotation.z += dt * 12.0;
                    const gPulse = 1.0 + Math.sin(this.animTime * 18.0) * 0.12;
                    this.vayuGroundRing.scale.set(gPulse, gPulse, 1.0);
                }

                // Ascending spiral rings
                if (this.vayuSpiralRings) {
                    for (let i = 0; i < this.vayuSpiralRings.length; i++) {
                        const ring = this.vayuSpiralRings[i];
                        ring.position.y += dt * ring.userData.speedY;
                        if (ring.position.y > 2.7) {
                            ring.position.y = 0.2;
                        }
                        // Flare wider as it ascends
                        const flare = 0.45 + (ring.position.y / 2.7) * 0.85;
                        ring.scale.set(flare, flare, flare);
                        ring.rotation.z += dt * (10.0 + i * 2.0);
                    }
                }

                // Swirling wind particles in logarithmic conical vortex
                if (this.vayuWindParticles) {
                    for (let i = 0; i < this.vayuWindParticles.length; i++) {
                        const p = this.vayuWindParticles[i];
                        p.userData.angle += dt * p.userData.speed;
                        p.userData.height += dt * p.userData.ySpeed;
                        if (p.userData.height > 2.7) {
                            p.userData.height = 0.1;
                        }
                        // Radius expands with height (vortex funnel profile)
                        const radius = 0.35 + (p.userData.height / 2.7) * 1.15 + Math.sin(p.userData.angle * 3.0) * 0.08;
                        p.position.x = Math.cos(p.userData.angle) * radius;
                        p.position.z = Math.sin(p.userData.angle) * radius;
                        p.position.y = p.userData.height;
                    }
                }

                // Aerodynamic forward lean into the wind stream
                const forwardLean = Math.min(0.28, (horizSpeed / this.maxSpeed) * 0.28);
                this.boostAura.rotation.x = forwardLean;
                this.boostAura.rotation.z = this.bankingAngle * 0.7;
            }
        }

        this.applyRenderModeVisibility();
    }

    bounceSpring(power = null) {
        this.velocity.y = power || this.springForce;
        this.isGrounded = false;
        this.isJumping = true;
        this.isSpringBouncing = true;
        this.isSpinning = (this.renderMode !== 'hanuman');
        window.soundManager.playSpring();
    }

    applyDash(dirX = 0, dirZ = -1, force = 65) {
        if (dirX === undefined || isNaN(dirX)) dirX = 0;
        if (dirZ === undefined || isNaN(dirZ)) dirZ = -1;
        if (force === undefined || isNaN(force)) force = 65;

        this.rotationY = Math.atan2(dirX, dirZ);
        this.forwardSpeed = Math.max(this.forwardSpeed, force);
        this.velocity.x = Math.sin(this.rotationY) * this.forwardSpeed;
        this.velocity.z = Math.cos(this.rotationY) * this.forwardSpeed;
        this.isDashing = true;
        this.dashTimer = 1.25; // 1.25s sustained dash surge!
        this.isSpinning = (this.renderMode !== 'hanuman');

        if (window.soundManager && window.soundManager.playDash) {
            window.soundManager.playDash();
        }
    }

    triggerRocketStart(power = 60) {
        this.forwardSpeed = power; // Super speed ~216 KM/H launch!
        this.currentSpeed = power;
        this.rotationY = Math.PI; // Face straight down track
        this.velocity.x = 0;
        this.velocity.z = -power;
        this.isBoosting = true;
        this.boostEnergy = this.maxBoostEnergy;
        this.boostDepleted = false;
        this.isChargingSpinDash = false;
        this.isSpinning = false;
        this.isGrounded = true;
        this.isDancing = false;
        this.idleTimer = 0;
        this.score += 500;

        if (window.soundManager) {
            if (window.soundManager.playBoost) window.soundManager.playBoost();
            if (window.soundManager.playSpring) window.soundManager.playSpring();
        }

        if (this.currentHanumanAnim !== 'runFast' && this.hanumanFastRunAction) {
            this.switchHanumanAnim('runFast', 0.1);
        }
    }

    takeDamage() {
        if (this.invulnerableTimer > 0 || this.isDead) return 0;
        
        if (this.rings > 0) {
            const maxLoss = 20;
            const lostRings = Math.min(this.rings, maxLoss);
            this.rings -= lostRings;
            this.isHurt = true;
            this.hurtTimer = 0.45;
            this.invulnerableTimer = 3.0; // 3.0 seconds of invulnerability (generous recovery window)
            this.velocity.y = 12.0;
            this.forwardSpeed = -10; // Controlled knockback backwards
            this.velocity.x = Math.sin(this.rotationY) * this.forwardSpeed;
            this.velocity.z = Math.cos(this.rotationY) * this.forwardSpeed;
            this.isJumping = false;
            this.isSpinning = false;
            this.isChargingSpinDash = false;
            if (window.soundManager) {
                window.soundManager.playHurt();
                if (window.soundManager.playRingLoss) window.soundManager.playRingLoss();
            }
            return lostRings;
        } else {
            // 0 Rings: LETHAL HIT (DEATH)
            this.isDead = true;
            this.deathTimer = 1.8;
            this.velocity.set(0, 18, 0); // Classic death jump straight up
            this.forwardSpeed = 0;
            this.strafeVelLateral = 0;
            this.isJumping = false;
            this.isSpinning = false;
            this.isChargingSpinDash = false;
            if (window.soundManager && window.soundManager.playDeath) {
                window.soundManager.playDeath();
            }
            return -1;
        }
    }

    addRing(count = 1) {
        this.rings += count;
        this.totalRingsCollected = (this.totalRingsCollected || 0) + count;
        this.score += count * 100;
        if (window.soundManager) {
            window.soundManager.playRing();
        }
        if (window.game) {
            if (window.game.triggerHudRingBounce) window.game.triggerHudRingBounce();
            if (window.game.spawnFloatingStarScore) window.game.spawnFloatingStarScore(count, false);
        }
    }

    addMoon() {
        this.rings += 20;
        this.totalRingsCollected = (this.totalRingsCollected || 0) + 20;
        this.score += 5000;
        // 100% full Vayu Wind Boost!
        this.boostEnergy = this.maxBoostEnergy;
        this.boostDepleted = false;

        if (window.soundManager && window.soundManager.playMoonPickup) {
            window.soundManager.playMoonPickup();
        } else if (window.soundManager) {
            window.soundManager.playRing();
        }
        if (window.game) {
            if (window.game.triggerHudRingBounce) window.game.triggerHudRingBounce();
            if (window.game.spawnFloatingStarScore) window.game.spawnFloatingStarScore(20, true);
        }
        if (window.game && window.game.showToast) {
            window.game.showToast('🌙 หาวเป็นเดือน! วายุบูสต์ 100% +5,000 PTS!', true, 2400);
        }
    }

    startLoop(loop) {
        this.isLooping = true;
        this.currentLoop = loop;
        this.loopAngle = 0;
        this.loopPitch = 0;
        this.loopSpeed = Math.max(46, Math.abs(this.forwardSpeed) * 1.15);
        this.strafeVelLateral = 0;
        this.strafeVelX = 0;
        this.isGrounded = true;
        this.isJumping = false;
        this.isSpinning = false;
        if (window.soundManager) {
            window.soundManager.playDash();
        }
    }

    updateLoop(dt) {
        if (!this.isLooping || !this.currentLoop) return;

        const loop = this.currentLoop;
        const R = loop.radius;

        // Advance angle along loop
        const angularSpeed = this.loopSpeed / R;
        this.loopAngle += angularSpeed * dt;

        // 3D Parametric Loop Position
        const normProgress = Math.min(1.0, this.loopAngle / (Math.PI * 2));
        this.position.z = loop.centerZ - R * Math.sin(this.loopAngle);
        this.position.y = loop.groundY + R * (1.0 - Math.cos(this.loopAngle));
        this.position.x = loop.centerX + loop.entryX + (loop.exitX - loop.entryX) * normProgress;

        // Tangent velocity
        this.velocity.z = -this.loopSpeed * Math.cos(this.loopAngle);
        this.velocity.y = this.loopSpeed * Math.sin(this.loopAngle);
        this.velocity.x = 0;
        this.currentSpeed = this.loopSpeed;
        this.forwardSpeed = this.loopSpeed;
        this.rotationY = Math.PI;

        // Loop pitch: rotate around X axis (YXZ order)
        this.loopPitch = -this.loopAngle;
        this.bankingAngle = Math.sin(this.loopAngle) * 0.22;

        // Apply 3D character rotation (Inverts completely 180° upside down at loop apex theta = PI)
        const forwardLean = 0.22;
        const totalPitch = this.loopPitch + forwardLean;

        this.characterModel.rotation.set(0, 0, 0);
        this.modelGroup.rotation.set(totalPitch, this.rotationY, this.bankingAngle, 'YXZ');
        if (this.hanumanGroup) {
            this.hanumanGroup.rotation.set(totalPitch, this.rotationY, this.bankingAngle, 'YXZ');
        }
        if (this.ballMesh) {
            this.ballMesh.rotation.set(totalPitch, this.rotationY, this.bankingAngle, 'YXZ');
        }

        // Particle sparks
        if (Math.random() < 0.6) {
            this.spawnDust(this.position.x, this.position.y, this.position.z);
        }

        this.group.position.copy(this.position);

        // Animate running stride
        this.updateAnimations(dt, this.currentSpeed);

        // Completion of full 360 degree loop
        if (this.loopAngle >= Math.PI * 2) {
            this.isLooping = false;
            this.loopCooldown = 1.5;
            this.position.z = loop.centerZ - 12;
            this.position.y = loop.groundY;
            this.position.x = loop.centerX + loop.exitX;
            this.loopPitch = 0;
            this.characterModel.rotation.set(0, 0, 0);
            this.modelGroup.rotation.set(0, this.rotationY, 0);
            if (this.hanumanGroup) this.hanumanGroup.rotation.set(0, this.rotationY, 0);
            this.strafeVelLateral = 0;
            this.strafeVelX = 0;
            this.forwardSpeed = Math.max(this.loopSpeed, 46);
            this.velocity.set(0, 0, -this.forwardSpeed);
            this.isGrounded = true;
            this.currentLoop = null;
        }
    }
}

window.SonicPlayer = SonicPlayer;
