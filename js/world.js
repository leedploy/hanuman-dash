// Sonic 3D World Environment Builder (Multi-Stage Engine)
// Supports Stage 1: Green Hill Zone (Tropical Rolling Hills & Checkered Mesas)
// and Stage 2: Chemical Plant Zone (Cyberpunk Industrial Night, Glass Booster Tubes & Mega Mack Liquid)

class World {
    constructor(scene) {
        this.scene = scene;
        this.stageMeshes = [];
        this.platforms = [];
        this.clouds = [];
        this.sceneryObjects = [];
        this.loops = [];
        this.currentStageId = 'green_hill';
        
        this.generateTextures();
        this.createSkyAndLighting();
        this.loadStage('green_hill');
    }

    generateTextures() {
        // =======================================================
        // 1. HIMAVANTA MYSTIC FOREST ZONE TEXTURES & MATERIALS
        // =======================================================
        // 1.1 Natural Himavanta Cliff Strata with Raw Golden Veins & Hanging Moss (512x512)
        const cliffCanvas = document.createElement('canvas');
        cliffCanvas.width = 512;
        cliffCanvas.height = 512;
        const cliffCtx = cliffCanvas.getContext('2d');

        // Natural stratified rock base layers (หินผาธรรมชาติป่าหิมพานต์)
        cliffCtx.fillStyle = '#17271b';
        cliffCtx.fillRect(0, 0, 512, 512);

        // Horizontal sediment strata bands
        const strataColors = ['#1e3424', '#26402e', '#1c2f21', '#2c4734', '#203627', '#243a2b'];
        for (let y = 0; y < 512; y += 32) {
            const idx = Math.floor(y / 32) % strataColors.length;
            cliffCtx.fillStyle = strataColors[idx];
            cliffCtx.fillRect(0, y, 512, 32);

            // Natural strata fissure contour
            cliffCtx.strokeStyle = '#111d14';
            cliffCtx.lineWidth = 2.5;
            cliffCtx.beginPath();
            cliffCtx.moveTo(0, y);
            for (let x = 0; x <= 512; x += 40) {
                cliffCtx.lineTo(x, y + (Math.sin(x * 0.05 + y * 0.1) * 5));
            }
            cliffCtx.stroke();
        }

        // Raw Golden Mineral Veins embedded in rock fissures (สายแร่ทองคำแท้)
        cliffCtx.strokeStyle = 'rgba(255, 215, 0, 0.85)';
        cliffCtx.lineWidth = 3.0;
        cliffCtx.shadowColor = '#ffd700';
        cliffCtx.shadowBlur = 8;
        const veinPaths = [
            [[0, 45], [110, 85], [200, 75], [320, 125], [410, 105], [512, 145]],
            [[0, 235], [130, 265], [240, 245], [350, 285], [470, 265], [512, 280]],
            [[0, 395], [80, 425], [180, 385], [300, 435], [410, 405], [512, 445]]
        ];
        veinPaths.forEach(vp => {
            cliffCtx.beginPath();
            cliffCtx.moveTo(vp[0][0], vp[0][1]);
            for (let j = 1; j < vp.length; j++) {
                cliffCtx.lineTo(vp[j][0], vp[j][1]);
            }
            cliffCtx.stroke();
        });
        cliffCtx.shadowBlur = 0;

        // Hanging Emerald Moss & Fern Fronds cascading from top edge (ม่านเถาวัลย์และมอสเขียวชอุ่ม)
        cliffCtx.fillStyle = '#16a34a';
        for (let x = 0; x < 512; x += 16) {
            const vineLen = 22 + ((x * 13) % 48);
            cliffCtx.beginPath();
            cliffCtx.moveTo(x, 0);
            cliffCtx.lineTo(x + 8, vineLen);
            cliffCtx.lineTo(x + 16, 0);
            cliffCtx.fill();
        }
        cliffCtx.fillStyle = '#22c55e';
        for (let x = 8; x < 512; x += 24) {
            const vineLen = 14 + ((x * 17) % 32);
            cliffCtx.beginPath();
            cliffCtx.moveTo(x, 0);
            cliffCtx.lineTo(x + 6, vineLen);
            cliffCtx.lineTo(x + 12, 0);
            cliffCtx.fill();
        }

        this.checkerTexture = new THREE.CanvasTexture(cliffCanvas);
        this.checkerTexture.wrapS = THREE.RepeatWrapping;
        this.checkerTexture.wrapT = THREE.RepeatWrapping;

        // 1.2 Ancient Himavanta Sacred Pathway Running Surface (512x512)
        const tCanvas = document.createElement('canvas');
        tCanvas.width = 512;
        tCanvas.height = 512;
        const tCtx = tCanvas.getContext('2d');

        // Deep earthy slate base
        tCtx.fillStyle = '#1b2d20';
        tCtx.fillRect(0, 0, 512, 512);

        // Interlocking ancient sacred flagstones (แผ่นศิลาโบราณปูทางเดิน)
        const stoneLayout = [
            [0, 0, 130, 120, '#28412e'], [130, 0, 150, 110, '#233a29'], [280, 0, 110, 125, '#2c4733'], [390, 0, 122, 115, '#253e2b'],
            [0, 120, 160, 135, '#243b2a'], [160, 110, 120, 140, '#2b4532'], [280, 125, 130, 130, '#213727'], [410, 115, 102, 140, '#294330'],
            [0, 255, 120, 130, '#2a4431'], [120, 250, 150, 135, '#223828'], [270, 255, 140, 130, '#2c4733'], [410, 255, 102, 130, '#253e2b'],
            [0, 385, 145, 127, '#233a29'], [145, 385, 135, 127, '#294330'], [280, 385, 130, 127, '#243b2a'], [410, 385, 102, 127, '#2b4532']
        ];

        stoneLayout.forEach(st => {
            // Flagstone body
            tCtx.fillStyle = st[4];
            tCtx.fillRect(st[0] + 3, st[1] + 3, st[2] - 6, st[3] - 6);

            // Beveled flagstone edge highlight
            tCtx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
            tCtx.lineWidth = 2;
            tCtx.strokeRect(st[0] + 4, st[1] + 4, st[2] - 8, st[3] - 8);

            // Subtle stone surface grain
            tCtx.fillStyle = 'rgba(0, 0, 0, 0.12)';
            tCtx.fillRect(st[0] + 12, st[1] + (st[3] * 0.4), st[2] - 24, 2);
            tCtx.fillRect(st[0] + (st[2] * 0.3), st[1] + 10, 2, st[3] - 20);
        });

        // Crevice mortar & lush emerald moss between stones
        tCtx.strokeStyle = '#0f1e13';
        tCtx.lineWidth = 6;
        stoneLayout.forEach(st => {
            tCtx.strokeRect(st[0], st[1], st[2], st[3]);
        });

        // Emerald moss tufts in crevices
        tCtx.fillStyle = '#22c55e';
        for (let i = 0; i < 90; i++) {
            const mx = (i * 47) % 506 + 3;
            const my = (i * 71) % 506 + 3;
            const mr = 2 + (i % 4);
            tCtx.beginPath();
            tCtx.arc(mx, my, mr, 0, Math.PI * 2);
            tCtx.fill();
        }

        // Sacred Golden Glyphs & Thai Kranok Inlays (รอยจารึกอักขระมนตราและลายกนกทองคำ)
        tCtx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
        tCtx.lineWidth = 2.5;
        tCtx.shadowColor = '#ffd700';
        tCtx.shadowBlur = 6;

        const sacredMotifs = [
            [220, 60, 22], [80, 180, 20], [345, 190, 24], [195, 315, 22], [345, 450, 20]
        ];
        sacredMotifs.forEach(sm => {
            tCtx.beginPath();
            tCtx.arc(sm[0], sm[1], sm[2], 0, Math.PI * 2);
            tCtx.stroke();

            tCtx.beginPath();
            tCtx.arc(sm[0], sm[1], sm[2] * 0.5, 0, Math.PI * 1.5);
            tCtx.stroke();

            tCtx.fillStyle = 'rgba(255, 215, 0, 0.85)';
            tCtx.beginPath();
            tCtx.arc(sm[0], sm[1], 3.5, 0, Math.PI * 2);
            tCtx.fill();
        });
        tCtx.shadowBlur = 0;

        // Scattered Sacred Pink Lotus Petals (กลีบดอกบัวสวรรค์ร่วงโปรยปราย)
        const petals = [
            [65, 45, 0.4], [190, 130, 1.2], [320, 80, -0.6], [450, 170, 0.8],
            [95, 290, -1.1], [240, 260, 0.3], [380, 310, 1.4], [120, 440, -0.4],
            [290, 420, 0.9], [460, 460, -0.8]
        ];
        petals.forEach(p => {
            tCtx.save();
            tCtx.translate(p[0], p[1]);
            tCtx.rotate(p[2]);
            tCtx.fillStyle = '#f472b6';
            tCtx.beginPath();
            tCtx.ellipse(0, 0, 7, 3.5, 0, 0, Math.PI * 2);
            tCtx.fill();
            tCtx.fillStyle = '#fdf2f8';
            tCtx.beginPath();
            tCtx.ellipse(-1, 0, 4, 1.8, 0, 0, Math.PI * 2);
            tCtx.fill();
            tCtx.restore();
        });

        // Golden Celestial Dew / Star dust flecks
        tCtx.fillStyle = 'rgba(255, 235, 120, 0.9)';
        for (let i = 0; i < 50; i++) {
            const sx = (i * 37) % 508 + 2;
            const sy = (i * 59) % 508 + 2;
            tCtx.fillRect(sx, sy, 2, 2);
        }

        this.grassTexture = new THREE.CanvasTexture(tCanvas);
        this.grassTexture.wrapS = THREE.RepeatWrapping;
        this.grassTexture.wrapT = THREE.RepeatWrapping;

        // Himavanta Cliff Textures & Scenery Materials
        this.mesaCheckerTexture = this.checkerTexture.clone();
        this.mesaCheckerTexture.repeat.set(4, 6);
        this.mesaCheckerTexture.needsUpdate = true;
        this.mesaCheckerMat = new THREE.MeshLambertMaterial({
            map: this.mesaCheckerTexture,
            color: 0xffffff
        });
        this.mesaGrassMat = new THREE.MeshLambertMaterial({ color: 0x22c55e });

        // Sacred Turquoise Waterfalls & Foam
        this.waterfallMat = new THREE.MeshBasicMaterial({
            color: 0x00f5d4,
            transparent: true,
            opacity: 0.90,
            side: THREE.DoubleSide
        });
        this.waterfallFoamMat = new THREE.MeshBasicMaterial({
            color: 0xf0fdff,
            transparent: true,
            opacity: 0.88
        });

        // Layered Himalayan Mountains
        this.hillNearMat = new THREE.MeshLambertMaterial({ color: 0x1b6b33, flatShading: true }); // Rainforest emerald
        this.hillMidMat = new THREE.MeshLambertMaterial({ color: 0x154e28, flatShading: true });  // Mountain pine
        this.hillFarMat = new THREE.MeshLambertMaterial({ color: 0x1e384d, flatShading: true });  // Majestic purple-tinged peak

        // Sacred Flora & Tree Materials
        this.woodTrunkMat = new THREE.MeshLambertMaterial({ color: 0x5a2a18 });
        this.bubbleLeafMat1 = new THREE.MeshLambertMaterial({ color: 0x16a34a, flatShading: true }); // Emerald
        this.bubbleLeafMat2 = new THREE.MeshLambertMaterial({ color: 0xec4899, flatShading: true }); // Celestial Lotus Pink
        this.bubbleLeafMat3 = new THREE.MeshLambertMaterial({ color: 0x00e5ff, flatShading: true }); // Celestial Cyan
        this.himavantaFruitMat = new THREE.MeshLambertMaterial({ color: 0xffd700, emissive: 0xb8860b, emissiveIntensity: 0.4 });
        this.flowerStalkMat = new THREE.MeshLambertMaterial({ color: 0x15803d });
        this.flowerPetalMat = new THREE.MeshLambertMaterial({ color: 0xf472b6, side: THREE.DoubleSide }); // Lotus Pink
        this.flowerCenterMat = new THREE.MeshLambertMaterial({ color: 0xfacc15, emissive: 0xca8a04, emissiveIntensity: 0.5 }); // Radiant Gold
        this.ancientStoneMat = new THREE.MeshLambertMaterial({ color: 0x2d4336, roughness: 0.7 });
        this.pillarGoldTrimMat = new THREE.MeshLambertMaterial({ color: 0xfbbf24, roughness: 0.3, metalness: 0.4 });

        // ==========================================
        // 2. CHEMICAL PLANT ZONE TEXTURES & MATERIALS
        // ==========================================
        // Track Grating Texture: Metallic Blue Grating with Bright Yellow/Dark Diagonal Hazard Borders
        const cpCanvas = document.createElement('canvas');
        cpCanvas.width = 256;
        cpCanvas.height = 256;
        const cpCtx = cpCanvas.getContext('2d');

        // Dark industrial slate-blue base
        cpCtx.fillStyle = '#0f172a';
        cpCtx.fillRect(0, 0, 256, 256);

        // Center steel grating (width: 192px, from x=32 to 224)
        cpCtx.fillStyle = '#1e293b';
        cpCtx.fillRect(32, 0, 192, 256);

        // Steel grid mesh
        const gridSize = 16;
        cpCtx.strokeStyle = '#38bdf8';
        cpCtx.lineWidth = 1.5;
        for (let gx = 32; gx <= 224; gx += gridSize) {
            cpCtx.beginPath();
            cpCtx.moveTo(gx, 0);
            cpCtx.lineTo(gx, 256);
            cpCtx.stroke();
        }
        for (let gy = 0; gy <= 256; gy += gridSize) {
            cpCtx.beginPath();
            cpCtx.moveTo(32, gy);
            cpCtx.lineTo(224, gy);
            cpCtx.stroke();
        }

        // Rivets inside grating intersections
        cpCtx.fillStyle = '#7dd3fc';
        for (let gx = 32 + gridSize/2; gx < 224; gx += gridSize) {
            for (let gy = gridSize/2; gy < 256; gy += gridSize) {
                cpCtx.fillRect(gx - 1, gy - 1, 2, 2);
            }
        }

        // Hazard Caution Borders on left (0-32) and right (224-256)
        const drawHazardStripes = (startX, endX) => {
            cpCtx.save();
            cpCtx.beginPath();
            cpCtx.rect(startX, 0, endX - startX, 256);
            cpCtx.clip();
            cpCtx.fillStyle = '#ffd000'; // Bright Warning Yellow
            cpCtx.fillRect(startX, 0, endX - startX, 256);

            cpCtx.fillStyle = '#111827'; // Dark Black/Slate
            const stripeWidth = 14;
            for (let y = -50; y < 350; y += stripeWidth * 2) {
                cpCtx.beginPath();
                cpCtx.moveTo(startX - 10, y);
                cpCtx.lineTo(endX + 10, y + (endX - startX) + 10);
                cpCtx.lineTo(endX + 10, y + (endX - startX) + 10 + stripeWidth);
                cpCtx.lineTo(startX - 10, y + stripeWidth);
                cpCtx.closePath();
                cpCtx.fill();
            }
            cpCtx.restore();

            // Inner dividing neon cyan line
            cpCtx.strokeStyle = '#00f0ff';
            cpCtx.lineWidth = 3;
            cpCtx.beginPath();
            cpCtx.moveTo(startX === 0 ? endX : startX, 0);
            cpCtx.lineTo(startX === 0 ? endX : startX, 256);
            cpCtx.stroke();
        };

        drawHazardStripes(0, 32);
        drawHazardStripes(224, 256);

        this.chemTrackTexture = new THREE.CanvasTexture(cpCanvas);
        this.chemTrackTexture.wrapS = THREE.RepeatWrapping;
        this.chemTrackTexture.wrapT = THREE.RepeatWrapping;

        // Side Wall Texture: Industrial Blue Plating with Bracing
        const sideCanvas = document.createElement('canvas');
        sideCanvas.width = 256;
        sideCanvas.height = 256;
        const sCtx = sideCanvas.getContext('2d');
        sCtx.fillStyle = '#111c30';
        sCtx.fillRect(0, 0, 256, 256);

        sCtx.strokeStyle = '#2563eb';
        sCtx.lineWidth = 4;
        sCtx.strokeRect(4, 4, 248, 248);

        // X-Brace
        sCtx.strokeStyle = '#1d4ed8';
        sCtx.lineWidth = 3;
        sCtx.beginPath();
        sCtx.moveTo(4, 4);
        sCtx.lineTo(252, 252);
        sCtx.moveTo(252, 4);
        sCtx.lineTo(4, 252);
        sCtx.stroke();

        // Yellow caution tabs
        sCtx.fillStyle = '#facc15';
        sCtx.fillRect(10, 10, 16, 16);
        sCtx.fillRect(230, 10, 16, 16);

        this.chemSideTexture = new THREE.CanvasTexture(sideCanvas);
        this.chemSideTexture.wrapS = THREE.RepeatWrapping;
        this.chemSideTexture.wrapT = THREE.RepeatWrapping;

        // Mega Mack Toxic Pink Liquid Texture
        const mmCanvas = document.createElement('canvas');
        mmCanvas.width = 128;
        mmCanvas.height = 128;
        const mmCtx = mmCanvas.getContext('2d');
        mmCtx.fillStyle = '#fa26a0'; // Luminescent hot pink
        mmCtx.fillRect(0, 0, 128, 128);

        // Swirling highlights
        mmCtx.fillStyle = '#ff70a6';
        for (let i = 0; i < 8; i++) {
            const rx = Math.random() * 128;
            const ry = Math.random() * 128;
            const rw = 20 + Math.random() * 30;
            const rh = 10 + Math.random() * 15;
            mmCtx.beginPath();
            mmCtx.ellipse(rx, ry, rw, rh, Math.random() * Math.PI, 0, Math.PI * 2);
            mmCtx.fill();
        }
        // Glowing white bubbles
        mmCtx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        for (let b = 0; b < 14; b++) {
            mmCtx.beginPath();
            mmCtx.arc(Math.random() * 128, Math.random() * 128, 2 + Math.random() * 3, 0, Math.PI * 2);
            mmCtx.fill();
        }

        this.megaMackTexture = new THREE.CanvasTexture(mmCanvas);
        this.megaMackTexture.wrapS = THREE.RepeatWrapping;
        this.megaMackTexture.wrapT = THREE.RepeatWrapping;

        // Chemical Plant Materials
        this.chemTrackMat = new THREE.MeshLambertMaterial({
            map: this.chemTrackTexture,
            roughness: 0.35
        });
        this.chemSideMat = new THREE.MeshLambertMaterial({
            map: this.chemSideTexture,
            roughness: 0.5
        });
        this.megaMackMat = new THREE.MeshBasicMaterial({
            map: this.megaMackTexture,
            transparent: true,
            opacity: 0.90
        });

        this.glassTubeMat = new THREE.MeshLambertMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.28,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        this.neonYellowMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
        this.neonCyanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
        this.neonPinkMat = new THREE.MeshBasicMaterial({ color: 0xff007f });
        this.chemSteelMat = new THREE.MeshLambertMaterial({ color: 0x1e293b, flatShading: true });
        this.chemSiloMat = new THREE.MeshLambertMaterial({ color: 0x162032, flatShading: true });
        this.chemPipeMat = new THREE.MeshLambertMaterial({ color: 0xf59e0b });
        this.chemBeaconRedMat = new THREE.MeshBasicMaterial({ color: 0xff1e27 });

        // ==========================================
        // 3. HYDROCITY ZONE TEXTURES & MATERIALS
        // ==========================================
        // 1. Hydro Track: Atlantean Aqua & Deep Sapphire Tiles with Golden Wave Border
        const htCanvas = document.createElement('canvas');
        htCanvas.width = 256;
        htCanvas.height = 256;
        const htCtx = htCanvas.getContext('2d');
        if (htCtx) {
            htCtx.fillStyle = '#0a4261'; // Deep oceanic slate
            htCtx.fillRect(0, 0, 256, 256);

            // Sapphire & Aquamarine diamond mosaic tiles
            const tileCols = 4, tileRows = 4;
            const tw = 256 / tileCols, th = 256 / tileRows;
            for (let r = 0; r < tileRows; r++) {
                for (let c = 0; c < tileCols; c++) {
                    htCtx.fillStyle = (r + c) % 2 === 0 ? '#0284c7' : '#0369a1';
                    htCtx.fillRect(c * tw + 3, r * th + 3, tw - 6, th - 6);
                    htCtx.strokeStyle = '#38bdf8';
                    htCtx.lineWidth = 2;
                    htCtx.strokeRect(c * tw + 3, r * th + 3, tw - 6, th - 6);
                }
            }

            // Golden Aquatic Border trim
            htCtx.fillStyle = '#f59e0b';
            htCtx.fillRect(0, 0, 24, 256);
            htCtx.fillRect(232, 0, 24, 256);
            htCtx.fillStyle = '#fbbf24';
            for (let y = 0; y < 256; y += 32) {
                htCtx.fillRect(4, y + 4, 16, 16);
                htCtx.fillRect(236, y + 4, 16, 16);
            }
        }
        this.hydroTrackTexture = new THREE.CanvasTexture(htCanvas);
        this.hydroTrackTexture.wrapS = THREE.RepeatWrapping;
        this.hydroTrackTexture.wrapT = THREE.RepeatWrapping;

        // 2. Hydro Side: Submerged Classical Marble with Sea Moss Streaks
        const hsCanvas = document.createElement('canvas');
        hsCanvas.width = 256;
        hsCanvas.height = 256;
        const hsCtx = hsCanvas.getContext('2d');
        if (hsCtx) {
            hsCtx.fillStyle = '#0f2b3e'; // Dark aquatic stone
            hsCtx.fillRect(0, 0, 256, 256);
            hsCtx.strokeStyle = '#0284c7';
            hsCtx.lineWidth = 3;
            hsCtx.strokeRect(4, 4, 248, 248);

            // Marble veins & aquatic verdigris
            hsCtx.strokeStyle = '#38bdf8';
            hsCtx.lineWidth = 2;
            hsCtx.beginPath();
            hsCtx.moveTo(20, 4);
            hsCtx.bezierCurveTo(80, 120, 180, 80, 240, 250);
            hsCtx.stroke();

            hsCtx.fillStyle = '#06b6d4';
            hsCtx.fillRect(8, 8, 12, 12);
            hsCtx.fillRect(236, 236, 12, 12);
        }
        this.hydroSideTexture = new THREE.CanvasTexture(hsCanvas);
        this.hydroSideTexture.wrapS = THREE.RepeatWrapping;
        this.hydroSideTexture.wrapT = THREE.RepeatWrapping;

        // 3. Shimmering Caustic Water Surface Texture
        const hwCanvas = document.createElement('canvas');
        hwCanvas.width = 256;
        hwCanvas.height = 256;
        const hwCtx = hwCanvas.getContext('2d');
        if (hwCtx) {
            hwCtx.fillStyle = '#0284c7';
            hwCtx.fillRect(0, 0, 256, 256);
            hwCtx.fillStyle = 'rgba(255, 255, 255, 0.28)';
            for (let i = 0; i < 20; i++) {
                hwCtx.beginPath();
                hwCtx.arc(Math.random() * 256, Math.random() * 256, 12 + Math.random() * 24, 0, Math.PI * 2);
                hwCtx.fill();
            }
        }
        this.hydroWaterTexture = new THREE.CanvasTexture(hwCanvas);
        this.hydroWaterTexture.wrapS = THREE.RepeatWrapping;
        this.hydroWaterTexture.wrapT = THREE.RepeatWrapping;

        // Hydrocity Materials
        this.hydroWaterMat = new THREE.MeshBasicMaterial({
            map: this.hydroWaterTexture,
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.68,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        this.hydroTubeMat = new THREE.MeshLambertMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.32,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        this.hydroPillarMat = new THREE.MeshStandardMaterial({
            color: 0xe2e8f0,
            metalness: 0.15,
            roughness: 0.3
        });

        this.hydroGoldTrimMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.85,
            roughness: 0.2,
            emissive: 0x452200
        });

        this.hydroCoralPinkMat = new THREE.MeshLambertMaterial({ color: 0xf43f5e });
        this.hydroCoralCyanMat = new THREE.MeshLambertMaterial({ color: 0x06b6d4 });
        this.hydroCoralGoldMat = new THREE.MeshLambertMaterial({ color: 0xfbbf24 });
    }

    createSkyAndLighting() {
        // Sunlight / Moon Directional Light
        this.dirLight = new THREE.DirectionalLight(0xfff8e8, 1.35);
        this.dirLight.position.set(60, 120, 50);
        this.dirLight.castShadow = true;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
        this.dirLight.shadow.camera.near = 0.5;
        this.dirLight.shadow.camera.far = 400;
        const d = 90;
        this.dirLight.shadow.camera.left = -d;
        this.dirLight.shadow.camera.right = d;
        this.dirLight.shadow.camera.top = d;
        this.dirLight.shadow.camera.bottom = -d;
        this.scene.add(this.dirLight);
        this.scene.add(this.dirLight.target);

        // Ambient Hemisphere Light
        this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x3d8231, 0.7);
        this.hemiLight.position.set(0, 100, 0);
        this.scene.add(this.hemiLight);
    }

    clearStage() {
        // Remove and dispose all meshes created for the active stage
        this.stageMeshes.forEach(mesh => {
            this.scene.remove(mesh);
            if (mesh.geometry) mesh.geometry.dispose();
        });
        this.stageMeshes = [];
        this.platforms = [];
        this.loops = [];
        this.sceneryObjects = [];
        this.clouds = [];
    }

    loadStage(stageId = 'green_hill') {
        this.clearStage();
        this.currentStageId = stageId;

        if (stageId === 'chemical_plant') {
            // Cyberpunk Industrial Night Atmosphere
            this.scene.background = new THREE.Color(0x060b17);
            this.scene.fog = new THREE.FogExp2(0x0f172a, 0.0022);

            this.hemiLight.color.setHex(0x38bdf8);      // Electric cyan sky reflection
            this.hemiLight.groundColor.setHex(0x1e1b4b); // Deep indigo bounce
            this.dirLight.color.setHex(0xa5b4fc);        // Cool moonlight & industrial halide
            this.dirLight.intensity = 1.25;

            // Spawn Industrial Cyber Smog Clouds
            for (let i = 0; i < 40; i++) {
                const cloud = this.createCloud(0x1e293b);
                cloud.position.set(
                    (Math.random() - 0.5) * 600,
                    45 + Math.random() * 40,
                    -Math.random() * 4900 + 60
                );
                this.scene.add(cloud);
                this.stageMeshes.push(cloud);
                this.clouds.push(cloud);
            }

            this.buildChemicalPlantCourse();
            this.buildChemicalPlantScenery();
        } else if (stageId === 'hydrocity') {
            // Sunken Atlantis / Hydrocity Aquatic Atmosphere
            this.scene.background = new THREE.Color(0x02182b);
            this.scene.fog = new THREE.FogExp2(0x052841, 0.0019);

            this.hemiLight.color.setHex(0x38bdf8);      // Shimmering turquoise water sky reflection
            this.hemiLight.groundColor.setHex(0x082f49); // Deep abyss indigo bounce
            this.dirLight.color.setHex(0x7dd3fc);        // Sun rays filtering down through water
            this.dirLight.intensity = 1.3;

            // Spawn Floating Luminescent Oxygen Bubbles
            for (let i = 0; i < 50; i++) {
                const bubble = this.createWaterBubble();
                bubble.position.set(
                    (Math.random() - 0.5) * 450,
                    10 + Math.random() * 45,
                    -Math.random() * 5000 + 40
                );
                this.scene.add(bubble);
                this.stageMeshes.push(bubble);
                this.clouds.push(bubble);
            }

            this.buildHydrocityCourse();
            this.buildHydrocityScenery();
        } else {
            // Himavanta Mystic Forest Celestial Atmosphere
            this.scene.background = new THREE.Color(0x42b4e6);
            this.scene.fog = new THREE.FogExp2(0x5ebbe3, 0.0016);

            this.hemiLight.color.setHex(0xe0f7ff);       // Celestial morning sky
            this.hemiLight.groundColor.setHex(0x193b20);  // Sacred emerald canopy bounce
            this.dirLight.color.setHex(0xfff8d6);        // Warm golden morning sun rays
            this.dirLight.intensity = 1.45;

            // Spawn Soft Golden-White Celestial Clouds
            for (let i = 0; i < 54; i++) {
                const cloudTint = (i % 3 === 0) ? 0xfffbeb : 0xffffff;
                const cloud = this.createCloud(cloudTint);
                cloud.position.set(
                    (Math.random() - 0.5) * 550,
                    50 + Math.random() * 45,
                    -Math.random() * 5700 + 80
                );
                this.scene.add(cloud);
                this.stageMeshes.push(cloud);
                this.clouds.push(cloud);
            }

            this.buildGreenHillCourse();
            this.buildGreenHillScenery();
        }
    }

    createCloud(tintColor = 0xffffff) {
        const group = new THREE.Group();
        const mat = new THREE.MeshLambertMaterial({ color: tintColor, flatShading: true });
        const puffs = 4 + Math.floor(Math.random() * 4);
        for (let j = 0; j < puffs; j++) {
            const rad = 6 + Math.random() * 5;
            const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(rad, 1), mat);
            puff.position.set(
                (j - puffs / 2) * 5 + (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3
            );
            group.add(puff);
        }
        return group;
    }

    createWaterBubble() {
        const group = new THREE.Group();
        const rad = 1.2 + Math.random() * 2.5;
        const bubbleGeo = new THREE.SphereGeometry(rad, 12, 12);
        const bubbleMat = new THREE.MeshBasicMaterial({
            color: 0x67e8f9,
            transparent: true,
            opacity: 0.52,
            blending: THREE.AdditiveBlending
        });
        const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
        group.add(bubble);
        return group;
    }

    // Material helpers
    getGroundMaterial(repeatX = 1, repeatZ = 1) {
        const tex = this.checkerTexture.clone();
        tex.needsUpdate = true;
        tex.repeat.set(repeatX, repeatZ);
        return new THREE.MeshLambertMaterial({ color: 0xffffff, map: tex, roughness: 0.75 });
    }

    getGrassTopMaterial(repeatX = 1, repeatZ = 1) {
        const tex = this.grassTexture.clone();
        tex.needsUpdate = true;
        tex.repeat.set(repeatX, repeatZ);
        return new THREE.MeshLambertMaterial({ color: 0xffffff, map: tex, roughness: 0.65 });
    }

    getChemTrackMaterial(repeatX = 1, repeatZ = 1) {
        const tex = this.chemTrackTexture.clone();
        tex.needsUpdate = true;
        tex.repeat.set(repeatX, repeatZ);
        return new THREE.MeshLambertMaterial({ map: tex, roughness: 0.35 });
    }

    getChemSideMaterial(repeatX = 1, repeatZ = 1) {
        const tex = this.chemSideTexture.clone();
        tex.needsUpdate = true;
        tex.repeat.set(repeatX, repeatZ);
        return new THREE.MeshLambertMaterial({ map: tex, roughness: 0.5 });
    }

    getHydroTrackMaterial(repeatX = 1, repeatZ = 1) {
        const tex = this.hydroTrackTexture.clone();
        tex.needsUpdate = true;
        tex.repeat.set(repeatX, repeatZ);
        return new THREE.MeshLambertMaterial({ map: tex, roughness: 0.35 });
    }

    getHydroSideMaterial(repeatX = 1, repeatZ = 1) {
        const tex = this.hydroSideTexture.clone();
        tex.needsUpdate = true;
        tex.repeat.set(repeatX, repeatZ);
        return new THREE.MeshLambertMaterial({ map: tex, roughness: 0.45 });
    }

    addRoadSegment(x, y, z, width, length, rollAngle = 0, customTopMat = null, customSideMat = null) {
        const boxGeo = new THREE.BoxGeometry(width, 10, length);
        let topMat, sideMat, frontBackMat;

        if (this.currentStageId === 'chemical_plant') {
            topMat = customTopMat || this.getChemTrackMaterial(width / 6, length / 6);
            sideMat = customSideMat || this.getChemSideMaterial(length / 6, 2);
            frontBackMat = sideMat;
        } else if (this.currentStageId === 'hydrocity') {
            topMat = customTopMat || this.getHydroTrackMaterial(width / 6, length / 6);
            sideMat = customSideMat || this.getHydroSideMaterial(length / 6, 2);
            frontBackMat = sideMat;
        } else {
            topMat = customTopMat || this.getGrassTopMaterial(width / 4, length / 4);
            sideMat = customSideMat || this.getGroundMaterial(length / 4, 2);
            frontBackMat = customSideMat || this.getGroundMaterial(width / 4, 2);
        }

        const materials = [sideMat, sideMat, topMat, sideMat, frontBackMat, frontBackMat];
        const mesh = new THREE.Mesh(boxGeo, materials);
        mesh.position.set(x, y - 5, z);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        this.scene.add(mesh);
        this.stageMeshes.push(mesh);

        this.platforms.push({
            type: 'box',
            minX: x - width / 2,
            maxX: x + width / 2,
            minZ: z - length / 2,
            maxZ: z + length / 2,
            topY: y,
            slope: 0
        });
    }

    addSlopedRoad(x, startY, startZ, width, length, heightDelta, customTopMat = null, customSideMat = null) {
        const boxGeo = new THREE.BoxGeometry(width, 8, length);
        let topMat, sideMat;

        if (this.currentStageId === 'chemical_plant') {
            topMat = customTopMat || this.getChemTrackMaterial(width / 6, length / 6);
            sideMat = customSideMat || this.getChemSideMaterial(length / 6, 2);
        } else if (this.currentStageId === 'hydrocity') {
            topMat = customTopMat || this.getHydroTrackMaterial(width / 6, length / 6);
            sideMat = customSideMat || this.getHydroSideMaterial(length / 6, 2);
        } else {
            topMat = customTopMat || this.getGrassTopMaterial(width / 4, length / 4);
            sideMat = customSideMat || this.getGroundMaterial(length / 4, 2);
        }

        const materials = [sideMat, sideMat, topMat, sideMat, sideMat, sideMat];
        const mesh = new THREE.Mesh(boxGeo, materials);
        const angle = Math.atan2(heightDelta, length);
        const endZ = startZ - length;
        const midZ = startZ - length / 2;
        const midY = startY + heightDelta / 2;

        mesh.position.set(x, midY - 4, midZ);
        mesh.rotation.x = angle;
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        this.scene.add(mesh);
        this.stageMeshes.push(mesh);

        this.platforms.push({
            type: 'slope',
            minX: x - width / 2,
            maxX: x + width / 2,
            startZ: startZ,
            endZ: endZ,
            startY: startY,
            endY: startY + heightDelta,
            length: length
        });
    }

    buildLoopTrackBand(radius, trackWidth, segments = 64) {
        const geo = new THREE.BufferGeometry();
        const positions = [];
        const normals = [];
        const uvs = [];
        const indices = [];
        const halfW = trackWidth / 2;

        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            const cos = Math.cos(theta);
            const sin = Math.sin(theta);
            const y = radius * (1 - cos);
            const z = -radius * sin;

            positions.push(-halfW, y, z);
            positions.push(halfW, y, z);
            normals.push(0, cos, sin);
            normals.push(0, cos, sin);
            uvs.push(0, (i / segments) * 16);
            uvs.push(1, (i / segments) * 16);

            if (i < segments) {
                const base = i * 2;
                indices.push(base, base + 2, base + 1);
                indices.push(base + 1, base + 2, base + 3);
            }
        }

        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geo.setIndex(indices);
        return geo;
    }

    buildLoopSection(centerX, groundY, centerZ, radius = 16) {
        const loopGroup = new THREE.Group();
        loopGroup.position.set(centerX, groundY, centerZ);

        const isChem = (this.currentStageId === 'chemical_plant');
        const isHydro = (this.currentStageId === 'hydrocity');
        const trackWidth = 18;
        const geo = this.buildLoopTrackBand(radius, trackWidth);

        // Track running surface
        const topMat = isChem ? this.getChemTrackMaterial(4, 16) : (isHydro ? this.getHydroTrackMaterial(4, 16) : this.getGrassTopMaterial(4, 16));
        topMat.side = THREE.DoubleSide;
        const trackMesh = new THREE.Mesh(geo, topMat);
        trackMesh.castShadow = true;
        trackMesh.receiveShadow = true;
        loopGroup.add(trackMesh);

        // Under-ribbon casing
        const underMat = isChem ? this.getChemSideMaterial(4, 16) : (isHydro ? this.getHydroSideMaterial(4, 16) : this.getGroundMaterial(4, 16));
        underMat.side = THREE.DoubleSide;
        const underGeo = this.buildLoopTrackBand(radius + 0.45, trackWidth + 0.8);
        const underMesh = new THREE.Mesh(underGeo, underMat);
        loopGroup.add(underMesh);

        // Side Guardrail Trusses
        [-trackWidth/2 - 0.4, trackWidth/2 + 0.4].forEach(edgeX => {
            const rimGeo = new THREE.TorusGeometry(radius, 0.45, 8, 48);
            const rimMat = isChem ? this.neonYellowMat : (isHydro ? this.hydroGoldTrimMat : (this.pillarGoldTrimMat || new THREE.MeshLambertMaterial({ color: 0xf59e0b })));
            const rim = new THREE.Mesh(rimGeo, rimMat);
            rim.position.set(edgeX, radius, 0);
            rim.rotation.y = Math.PI / 2;
            loopGroup.add(rim);
        });

        // Glowing Chevron Entry Runway Lights on the floor
        const arrowGeo = new THREE.ConeGeometry(0.9, 1.8, 3);
        const arrowMat = isChem ? this.neonCyanMat : (isHydro ? this.hydroWaterMat : (this.himavantaFruitMat || this.neonYellowMat));
        [14, 10, 6].forEach(offsetZ => {
            const arrow = new THREE.Mesh(arrowGeo, arrowMat);
            arrow.rotation.x = Math.PI / 2;
            arrow.rotation.z = Math.PI;
            arrow.position.set(-2.5, 0.15, offsetZ);
            loopGroup.add(arrow);
        });

        this.scene.add(loopGroup);
        this.stageMeshes.push(loopGroup);

        this.loops.push({
            centerX: centerX,
            groundY: groundY,
            centerZ: centerZ,
            radius: radius,
            entryX: -2.5,
            exitX: 2.5,
            width: 16
        });
    }

    getLoopNear(x, y, z) {
        for (const loop of this.loops) {
            if (Math.abs(x - loop.centerX) <= loop.width / 2 &&
                z <= loop.centerZ + 16 && z >= loop.centerZ - 8 &&
                Math.abs(y - loop.groundY) <= 5.0) {
                return loop;
            }
        }
        return null;
    }

    // ============================================================
    // CHEMICAL PLANT SPECIALTY GIMMICKS & OBJECT BUILDERS
    // ============================================================
    addGlassTube(startX, startY, startZ, length, radius = 14.0) {
        const group = new THREE.Group();

        // 1. Transparent Cyan Glass Tunnel (Open ended cylinder)
        const tubeGeo = new THREE.CylinderGeometry(radius, radius, length, 32, 1, true);
        const tubeMesh = new THREE.Mesh(tubeGeo, this.glassTubeMat);
        tubeMesh.rotation.x = Math.PI * 0.5; // Lay along Z axis
        const centerY = startY + 7.5;
        tubeMesh.position.set(startX, centerY, startZ - length * 0.5);
        group.add(tubeMesh);

        // 2. Glowing Neon Accelerator Rings every 22 units
        const numRings = Math.floor(length / 22);
        for (let i = 0; i <= numRings; i++) {
            const ringGeo = new THREE.TorusGeometry(radius + 0.25, 0.35, 8, 32);
            const ringMesh = new THREE.Mesh(ringGeo, (i % 2 === 0) ? this.neonYellowMat : this.neonCyanMat);
            ringMesh.position.set(startX, centerY, startZ - i * 22);
            group.add(ringMesh);
        }

        this.scene.add(group);
        this.stageMeshes.push(group);
        return group;
    }

    addChemicalBasin(x, z, width, length) {
        const group = new THREE.Group();

        // Glowing Mega Mack liquid plane
        const liquidGeo = new THREE.PlaneGeometry(width, length);
        const liquidMesh = new THREE.Mesh(liquidGeo, this.megaMackMat);
        liquidMesh.rotation.x = -Math.PI / 2;
        liquidMesh.position.set(x, -2.5, z);
        group.add(liquidMesh);

        // Foam / Hazard boundary
        const borderGeo = new THREE.BoxGeometry(width + 4, 1.2, length + 4);
        const borderMesh = new THREE.Mesh(borderGeo, this.chemSteelMat);
        borderMesh.position.set(x, -3.2, z);
        group.add(borderMesh);

        this.scene.add(group);
        this.stageMeshes.push(group);
        return group;
    }

    createChemicalSilo(height = 65, radius = 22) {
        const group = new THREE.Group();

        // Main cylindrical steel tank body
        const tankGeo = new THREE.CylinderGeometry(radius, radius, height, 16);
        const tank = new THREE.Mesh(tankGeo, this.chemSiloMat);
        tank.position.y = height * 0.5;
        tank.castShadow = true;
        group.add(tank);

        // Top Rounded Dome
        const domeGeo = new THREE.SphereGeometry(radius * 0.98, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
        const dome = new THREE.Mesh(domeGeo, this.chemSiloMat);
        dome.position.y = height;
        group.add(dome);

        // Flashing Red Aviation Beacon on top
        const beacon = new THREE.Mesh(new THREE.SphereGeometry(1.6, 8, 8), this.chemBeaconRedMat);
        beacon.position.y = height + radius * 0.55;
        group.add(beacon);

        // Neon Yellow Hazard Ring around middle
        const ringGeo = new THREE.TorusGeometry(radius + 0.35, 0.6, 6, 24);
        const ring = new THREE.Mesh(ringGeo, this.neonYellowMat);
        ring.position.y = height * 0.55;
        ring.rotation.x = Math.PI * 0.5;
        group.add(ring);

        // Catwalk Railing Ring
        const catwalkGeo = new THREE.CylinderGeometry(radius + 2.5, radius + 2.5, 1.2, 16);
        const catwalk = new THREE.Mesh(catwalkGeo, this.chemSteelMat);
        catwalk.position.y = height * 0.85;
        group.add(catwalk);

        return group;
    }

    createCyberSkyscraper(w = 42, h = 140, d = 42) {
        const group = new THREE.Group();

        // Dark navy monolithic tower
        const towerGeo = new THREE.BoxGeometry(w, h, d);
        const tower = new THREE.Mesh(towerGeo, this.chemSteelMat);
        tower.position.y = h * 0.5;
        group.add(tower);

        // Illuminated neon window stripes
        const numStripes = 6;
        for (let i = 0; i < numStripes; i++) {
            const stripGeo = new THREE.BoxGeometry(w + 0.6, 1.8, d + 0.6);
            const mat = (i % 3 === 0) ? this.neonCyanMat : (i % 3 === 1 ? this.neonYellowMat : this.neonPinkMat);
            const strip = new THREE.Mesh(stripGeo, mat);
            strip.position.y = 20 + i * (h / (numStripes + 1));
            group.add(strip);
        }

        // Antenna Mast
        const antGeo = new THREE.CylinderGeometry(0.6, 1.4, 30, 8);
        const ant = new THREE.Mesh(antGeo, this.chemSteelMat);
        ant.position.y = h + 15;
        group.add(ant);

        const beacon = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 8), this.chemBeaconRedMat);
        beacon.position.y = h + 30;
        group.add(beacon);

        return group;
    }

    createOverheadPipeline(span = 70, height = 34) {
        const group = new THREE.Group();

        // Big yellow chemical conduit crossing overhead
        const pipeGeo = new THREE.CylinderGeometry(2.2, 2.2, span, 12);
        const pipe = new THREE.Mesh(pipeGeo, this.chemPipeMat);
        pipe.rotation.z = Math.PI * 0.5;
        pipe.position.set(0, height, 0);
        group.add(pipe);

        // Flanged connector joints
        [-span * 0.35, 0, span * 0.35].forEach(px => {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.45, 8, 16), this.neonCyanMat);
            ring.rotation.y = Math.PI * 0.5;
            ring.position.set(px, height, 0);
            group.add(ring);
        });

        // Vertical Pylons on each side
        [-span * 0.48, span * 0.48].forEach(px => {
            const legGeo = new THREE.CylinderGeometry(1.8, 2.6, height + 10, 8);
            const leg = new THREE.Mesh(legGeo, this.chemSteelMat);
            leg.position.set(px, (height + 10) * 0.5 - 5, 0);
            group.add(leg);
        });

        return group;
    }

    buildChemicalColosseum(x, y, z, radius = 68) {
        const group = new THREE.Group();

        // Cyberpunk Finish Line Arena
        const arenaGeo = new THREE.CylinderGeometry(radius, radius, 12, 32);
        const arenaMesh = new THREE.Mesh(arenaGeo, this.chemSideMat);
        arenaMesh.position.set(x, y - 6, z);
        group.add(arenaMesh);

        // 8 Surrounding Chemical Floodlight Towers
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const tx = x + Math.cos(angle) * (radius - 6);
            const tz = z + Math.sin(angle) * (radius - 6);

            const towerGeo = new THREE.CylinderGeometry(2.5, 4.0, 48, 8);
            const tower = new THREE.Mesh(towerGeo, this.chemSteelMat);
            tower.position.set(tx, y + 24, tz);
            group.add(tower);

            // Neon Searchlight Head
            const head = new THREE.Mesh(new THREE.SphereGeometry(3.2, 8, 8), (i % 2 === 0) ? this.neonCyanMat : this.neonYellowMat);
            head.position.set(tx, y + 48, tz);
            group.add(head);
        }

        // Finish Line Archway
        const archL = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 2.0, 24, 8), this.chemSteelMat);
        archL.position.set(x - 14, y + 12, z + 20);
        group.add(archL);

        const archR = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 2.0, 24, 8), this.chemSteelMat);
        archR.position.set(x + 14, y + 12, z + 20);
        group.add(archR);

        const beam = new THREE.Mesh(new THREE.BoxGeometry(32, 3.5, 3.5), this.neonYellowMat);
        beam.position.set(x, y + 23, z + 20);
        group.add(beam);

        this.scene.add(group);
        this.stageMeshes.push(group);
        return group;
    }

    // ============================================================
    // STAGE 2: CHEMICAL PLANT COURSE DEFINITION (4,800m)
    // ============================================================
    buildChemicalPlantCourse() {
        // 1. Starting Cyber Highway (z: 40 to -140, y: 0, length: 180, center: -50)
        // minZ: -140, maxZ: +40 -> Seamlessly bridges the gap to the booster tube!
        this.addRoadSegment(0, 0, -50, 36, 180, 0);

        // 2. High-Speed Glass Booster Tube #1 (Warp Conduit) (z: -140 to -380, y: 0, length: 240, center: -260)
        this.addRoadSegment(0, 0, -260, 24, 240, 0);
        this.addGlassTube(0, 0, -140, 240, 14.0);

        // 3. Mega Mack Vat #1 below track
        this.addChemicalBasin(0, -600, 220, 480);

        // 4. Climbing Ramp over Mega Mack (z: -380 to -540, climbing y: 0 -> 24)
        this.addSlopedRoad(0, 0, -380, 30, 160, 24);

        // 5. High Catwalk Skyway (z: -540 to -680, y: 24, length: 140, center: -610)
        this.addRoadSegment(0, 24, -610, 28, 140, 0);

        // 6. Steep Thrill Drop (z: -680 to -780, dropping y: 24 -> 4)
        this.addSlopedRoad(0, 24, -680, 28, 100, -20);

        // 7. Twin Industrial Steel Loops (z: -880 and z: -1080, y: 4, spanning -780 to -1230 solid continuous ground)
        this.addRoadSegment(0, 4, -1005, 32, 450, 0);
        this.buildLoopSection(0, 4, -880, 16);
        this.buildLoopSection(0, 4, -1080, 18);

        // 8. Low Suspension Bridge over Massive Mega Mack Sea (z: -1230 to -1550, y: 5, length: 320, center: -1390)
        this.addChemicalBasin(0, -1400, 260, 400);
        this.addRoadSegment(0, 5, -1390, 24, 320, 0);

        // 9. Spiral Tower Ascent (z: -1550 to -1750, climbing y: 5 -> 28, length: 200)
        this.addSlopedRoad(0, 5, -1550, 28, 200, 23);

        // 10. High-Altitude Glass Booster Tube #2 (z: -1750 to -2150, y: 28, length: 400, center: -1950)
        this.addRoadSegment(0, 28, -1950, 24, 400, 0);
        this.addGlassTube(0, 28, -1750, 400, 14.0);

        // 11. Split Catwalks & Elevated Sky Crossing (z: -2150 to -2450, y: 28, length: 300, center: -2300)
        this.addRoadSegment(-12, 28, -2300, 16, 300, 0); // Left route
        this.addRoadSegment(12, 28, -2300, 16, 300, 0);  // Right route
        this.addRoadSegment(0, 28, -2300, 10, 300, 0);   // Center connector

        // 12. Mega Mack Spillway & Coaster Drop (z: -2450 to -2850, y: 28 -> 8)
        this.addChemicalBasin(0, -2700, 240, 450);
        this.addSlopedRoad(0, 28, -2450, 32, 180, -20);
        this.addRoadSegment(0, 8, -2740, 34, 220, 0);

        // 13. The Chemical Superhighway Sprint (z: -2850 to -4000, y: 8, length: 1150 continuous)
        this.addRoadSegment(0, 8, -3000, 42, 300, 0); // -2850 to -3150
        this.addRoadSegment(0, 8, -3300, 42, 300, 0); // -3150 to -3450
        this.addRoadSegment(0, 8, -3600, 42, 300, 0); // -3450 to -3750
        this.addRoadSegment(0, 8, -3875, 42, 250, 0); // -3750 to -4000

        // 14. Rollercoaster Dip & Final Loop #3 (z: -4000 to -4300, y: 8 -> 4 -> 8)
        this.addSlopedRoad(0, 8, -4000, 34, 80, -4);
        this.addRoadSegment(0, 4, -4160, 36, 160, 0);
        this.buildLoopSection(0, 4, -4160, 18);
        this.addSlopedRoad(0, 4, -4240, 34, 60, 4);

        // 15. Chemical Plant Grand Colosseum (Finish Arena) (z: -4300 to -4900, y: 8)
        this.addRoadSegment(0, 8, -4450, 48, 300, 0);
        this.addRoadSegment(0, 8, -4750, 64, 300, 0);
        this.buildChemicalColosseum(0, 8, -4800, 68);
    }

    buildChemicalPlantScenery() {
        // Distribute Chemical Silos, Skyscrapers, and Overhead Pipelines across the 4,800m track
        const totalBackdrop = 80;
        for (let i = 0; i < totalBackdrop; i++) {
            const side = (i % 2 === 0) ? 1 : -1;
            const progress = i / totalBackdrop;
            const z = 80 - progress * 4900;

            if (i % 3 === 0) {
                // Chemical Storage Silo Tank
                const h = 55 + Math.random() * 35;
                const r = 18 + Math.random() * 10;
                const silo = this.createChemicalSilo(h, r);
                const dist = 75 + Math.random() * 45;
                silo.position.set(side * dist, -5, z);
                this.scene.add(silo);
                this.stageMeshes.push(silo);
                this.sceneryObjects.push(silo);
            } else if (i % 3 === 1) {
                // Cyberpunk Skyscraper Monolith
                const w = 35 + Math.random() * 20;
                const h = 90 + Math.random() * 65;
                const tower = this.createCyberSkyscraper(w, h, w);
                const dist = 130 + Math.random() * 70;
                tower.position.set(side * dist, -5, z);
                this.scene.add(tower);
                this.stageMeshes.push(tower);
                this.sceneryObjects.push(tower);
            } else {
                // Distant Mega Tower with aviation beacons
                const w = 50 + Math.random() * 30;
                const h = 130 + Math.random() * 80;
                const tower = this.createCyberSkyscraper(w, h, w);
                const dist = 220 + Math.random() * 90;
                tower.position.set(side * dist, -10, z);
                this.scene.add(tower);
                this.stageMeshes.push(tower);
                this.sceneryObjects.push(tower);
            }
        }

        // Overhead Pipeline Bridges crossing the track
        const pipelineLocations = [-100, -380, -750, -1200, -1700, -2150, -2600, -3100, -3600, -4100, -4500];
        pipelineLocations.forEach(pz => {
            const pipe = this.createOverheadPipeline(75, 34);
            pipe.position.set(0, 0, pz);
            this.scene.add(pipe);
            this.stageMeshes.push(pipe);
            this.sceneryObjects.push(pipe);
        });
    }

    // ============================================================
    // STAGE 3: HYDROCITY ZONE COURSE DEFINITION (5,000m)
    // ============================================================
    buildHydrocityCourse() {
        // 1. Starting Sunken Aqueduct & Palace Gates (z: 60 to -220, y: 0, length: 280, center: -80)
        this.addRoadSegment(0, 0, -80, 36, 280, 0);

        // 2. Slope Climbing to Upper Palace Aqueduct (z: -220 to -400, y: 0 -> 12, length: 180)
        this.addSlopedRoad(0, 0, -220, 32, 180, 12);

        // 3. Upper Palace Aqueduct High Road (z: -400 to -600, y: 12, length: 200, center: -500)
        this.addRoadSegment(0, 12, -500, 32, 200, 0);

        // 4. Thrill Drop into Hydro-Tube #1 (z: -600 to -760, y: 12 -> 4, length: 160)
        this.addSlopedRoad(0, 12, -600, 28, 160, -8);

        // 5. Submerged Glass Hydro-Tube #1 (Water Flume) (z: -760 to -1200, y: 4, length: 440, center: -980)
        this.addRoadSegment(0, 4, -980, 24, 440, 0);
        this.addHydroTube(0, 4, -760, 440, 14.0);

        // 6. Atlantis Colosseum & Water Loop #1 (z: -1200 to -1800, y: 4, length: 600, center: -1500)
        this.addRoadSegment(0, 4, -1500, 34, 600, 0);
        this.buildLoopSection(0, 4, -1450, 16);

        // 7. Water-Surface Sprintfast (Skimming across water) (z: -1800 to -2200, y: 3.5, length: 400, center: -2000)
        this.addRoadSegment(0, 3.5, -2000, 40, 400, 0);
        this.addWaterBasin(0, -2000, 240, 420, 2.8);

        // 8. Rising Ramp out of Water (z: -2200 to -2400, y: 3.5 -> 16, length: 200)
        this.addSlopedRoad(0, 3.5, -2200, 32, 200, 12.5);

        // 9. High Sunken Aqueduct (z: -2400 to -2600, y: 16, length: 200, center: -2500)
        this.addRoadSegment(0, 16, -2500, 32, 200, 0);

        // 10. Plunge into Deep Abyss Hydro-Tube #2 (z: -2600 to -2760, y: 16 -> 6, length: 160)
        this.addSlopedRoad(0, 16, -2600, 28, 160, -10);

        // 11. Deep Abyss Hydro-Tube #2 (z: -2760 to -3300, y: 6, length: 540, center: -3030)
        this.addRoadSegment(0, 6, -3030, 26, 540, 0);
        this.addHydroTube(0, 6, -2760, 540, 14.0);

        // 12. Climbing Rapids to Water Loop #2 (z: -3300 to -3500, y: 6 -> 18, length: 200)
        this.addSlopedRoad(0, 6, -3300, 32, 200, 12);

        // 13. High Shelf & Water Loop #2 (z: -3500 to -3800, y: 18, length: 300, center: -3650)
        this.addRoadSegment(0, 18, -3650, 34, 300, 0);
        this.buildLoopSection(0, 18, -3650, 18);

        // 14. Grand Thrill Descent to Trident Canal (z: -3800 to -4100, y: 18 -> 8, length: 300)
        this.addSlopedRoad(0, 18, -3800, 36, 300, -10);

        // 15. Trident Grand Canal Sprint (z: -4100 to -4600, y: 8, length: 500, center: -4350)
        this.addRoadSegment(0, 8, -4350, 44, 500, 0);

        // 16. Poseidon Grand Amphitheater Entrance (z: -4600 to -4900, y: 8, length: 300, center: -4750)
        this.addRoadSegment(0, 8, -4750, 56, 300, 0);

        // 17. Colosseum Arena Floor & Finish Line (z: -4900 to -5050, y: 8, length: 150, center: -4975)
        this.addRoadSegment(0, 8, -4975, 72, 150, 0);
        this.buildPoseidonColosseum(0, 8, -5000, 72);
    }

    buildHydrocityScenery() {
        // Distribute Poseidon Pillars, Sunken Archways, Water Basins, and Coral Reefs
        const totalPillars = 64;
        for (let i = 0; i < totalPillars; i++) {
            const side = (i % 2 === 0) ? 1 : -1;
            const progress = i / totalPillars;
            const z = 40 - progress * 5000;
            const dist = 32 + (i % 3) * 16;

            // Classical Fluted Marble Column
            const pillar = this.createPoseidonPillar(32 + Math.random() * 14, 2.0);
            pillar.position.set(side * dist, 0, z);
            this.scene.add(pillar);
            this.stageMeshes.push(pillar);
            this.sceneryObjects.push(pillar);

            // Coral Reef cluster beside pillar
            if (i % 2 === 0) {
                const coral = this.createCoralReef(6 + Math.random() * 4);
                coral.position.set(side * (dist - 8), 0, z + (Math.random() - 0.5) * 12);
                this.scene.add(coral);
                this.stageMeshes.push(coral);
                this.sceneryObjects.push(coral);
            }
        }

        // Triumphal Sunken Archways crossing overhead
        const archwaysZ = [-200, -500, -1350, -1650, -2350, -2550, -3450, -3750, -4200, -4450];
        archwaysZ.forEach(az => {
            const arch = this.createAncientArchway(46, 26);
            arch.position.set(0, 0, az);
            this.scene.add(arch);
            this.stageMeshes.push(arch);
            this.sceneryObjects.push(arch);
        });

        // Water Basins along track sides
        const basins = [
            { z: -350, w: 180, l: 300, y: -2 },
            { z: -1500, w: 220, l: 450, y: 1 },
            { z: -2900, w: 200, l: 400, y: 2 },
            { z: -4350, w: 240, l: 500, y: 4 }
        ];
        basins.forEach(b => {
            this.addWaterBasin(0, b.z, b.w, b.l, b.y);
        });
    }

    addHydroTube(startX, startY, startZ, length, radius = 14.0) {
        const group = new THREE.Group();

        // Transparent Aqua-Glass Water Flume Cylinder
        const tubeGeo = new THREE.CylinderGeometry(radius, radius, length, 32, 1, true);
        const tubeMesh = new THREE.Mesh(tubeGeo, this.hydroTubeMat);
        tubeMesh.rotation.x = Math.PI * 0.5;
        const centerY = startY + 7.5;
        tubeMesh.position.set(startX, centerY, startZ - length * 0.5);
        group.add(tubeMesh);

        // Golden Aquatic Bracing Torus Rings every 24m
        const numRings = Math.floor(length / 24);
        for (let i = 0; i <= numRings; i++) {
            const ringGeo = new THREE.TorusGeometry(radius + 0.3, 0.45, 8, 32);
            const ringMesh = new THREE.Mesh(ringGeo, (i % 2 === 0) ? this.hydroGoldTrimMat : this.neonCyanMat);
            ringMesh.position.set(startX, centerY, startZ - i * 24);
            group.add(ringMesh);
        }

        this.scene.add(group);
        this.stageMeshes.push(group);
        return group;
    }

    createPoseidonPillar(height = 32, radius = 2.0) {
        const group = new THREE.Group();

        // Main Fluted Marble Shaft
        const colGeo = new THREE.CylinderGeometry(radius * 0.9, radius * 1.15, height, 16);
        const col = new THREE.Mesh(colGeo, this.hydroPillarMat);
        col.position.y = height * 0.5;
        col.castShadow = true;
        group.add(col);

        // Golden Corinthian Capital Head
        const capGeo = new THREE.BoxGeometry(radius * 2.8, 2.2, radius * 2.8);
        const cap = new THREE.Mesh(capGeo, this.hydroGoldTrimMat);
        cap.position.y = height;
        group.add(cap);

        // Base Plinth
        const baseGeo = new THREE.BoxGeometry(radius * 3.0, 2.0, radius * 3.0);
        const base = new THREE.Mesh(baseGeo, this.hydroPillarMat);
        base.position.y = 1.0;
        group.add(base);

        // Glowing Sea-Orb on top
        const orbGeo = new THREE.SphereGeometry(radius * 0.8, 12, 12);
        const orb = new THREE.Mesh(orbGeo, this.hydroWaterMat);
        orb.position.y = height + 2.0;
        group.add(orb);

        return group;
    }

    createAncientArchway(span = 46, height = 26) {
        const group = new THREE.Group();

        // Left & Right Columns
        [-span * 0.45, span * 0.45].forEach(colX => {
            const colGeo = new THREE.CylinderGeometry(1.8, 2.4, height, 12);
            const col = new THREE.Mesh(colGeo, this.hydroPillarMat);
            col.position.set(colX, height * 0.5, 0);
            group.add(col);
        });

        // Arch Beam across top
        const beamGeo = new THREE.BoxGeometry(span, 3.2, 4.0);
        const beam = new THREE.Mesh(beamGeo, this.hydroGoldTrimMat);
        beam.position.set(0, height, 0);
        group.add(beam);

        // Golden Trident Crest
        const tridentStem = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 7, 8), this.hydroGoldTrimMat);
        tridentStem.position.set(0, height + 4.5, 0);
        group.add(tridentStem);

        [-2.5, 2.5].forEach(tx => {
            const prong = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 5, 8), this.hydroGoldTrimMat);
            prong.position.set(tx, height + 5.5, 0);
            group.add(prong);
        });

        return group;
    }

    createCoralReef(radius = 8) {
        const group = new THREE.Group();
        const colors = [this.hydroCoralPinkMat, this.hydroCoralCyanMat, this.hydroCoralGoldMat];

        const numBranches = 7;
        for (let b = 0; b < numBranches; b++) {
            const angle = (b / numBranches) * Math.PI * 2;
            const dist = Math.random() * radius * 0.6;
            const h = 4 + Math.random() * 8;
            const r = 0.5 + Math.random() * 0.6;

            const branchGeo = new THREE.ConeGeometry(r, h, 6);
            const mat = colors[b % colors.length];
            const branch = new THREE.Mesh(branchGeo, mat);
            branch.position.set(Math.cos(angle) * dist, h * 0.5, Math.sin(angle) * dist);
            branch.rotation.z = (Math.random() - 0.5) * 0.35;
            branch.rotation.x = (Math.random() - 0.5) * 0.35;
            group.add(branch);
        }

        return group;
    }

    addWaterBasin(x, z, width, length, y = 0) {
        const group = new THREE.Group();
        const waterGeo = new THREE.PlaneGeometry(width, length);
        const waterMesh = new THREE.Mesh(waterGeo, this.hydroWaterMat);
        waterMesh.rotation.x = -Math.PI / 2;
        waterMesh.position.set(x, y, z);
        group.add(waterMesh);

        this.scene.add(group);
        this.stageMeshes.push(group);
        return group;
    }

    buildPoseidonColosseum(x, y, z, radius = 72) {
        const group = new THREE.Group();

        // 1. Classical Sunken Arena Base
        const baseGeo = new THREE.CylinderGeometry(radius, radius, 14, 36);
        const baseMat = this.getHydroSideMaterial(8, 2);
        const topMat = this.getHydroTrackMaterial(12, 12);
        const baseMesh = new THREE.Mesh(baseGeo, [baseMat, topMat, baseMat]);
        baseMesh.position.set(x, y - 7, z);
        baseMesh.receiveShadow = true;
        group.add(baseMesh);

        // 2. 16 Surrounding Classical Poseidon Marble Columns
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const px = x + Math.cos(angle) * (radius - 5);
            const pz = z + Math.sin(angle) * (radius - 5);

            const pillarGeo = new THREE.CylinderGeometry(2.0, 2.6, 38, 12);
            const pillar = new THREE.Mesh(pillarGeo, this.hydroPillarMat);
            pillar.position.set(px, y + 19, pz);
            pillar.castShadow = true;
            group.add(pillar);

            // Golden Corinthian Capital on top
            const capGeo = new THREE.BoxGeometry(5.2, 2.5, 5.2);
            const cap = new THREE.Mesh(capGeo, this.hydroGoldTrimMat);
            cap.position.set(px, y + 38, pz);
            group.add(cap);

            // Water Spout Fountain atop every alternate pillar
            if (i % 2 === 0) {
                const orb = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 12), this.hydroWaterMat);
                orb.position.set(px, y + 41, pz);
                group.add(orb);
            }
        }

        // 3. Grand Entrance Archway with Golden Trident
        const archL = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.8, 30, 12), this.hydroPillarMat);
        archL.position.set(x - 16, y + 15, z + 28);
        group.add(archL);

        const archR = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.8, 30, 12), this.hydroPillarMat);
        archR.position.set(x + 16, y + 15, z + 28);
        group.add(archR);

        const archBeam = new THREE.Mesh(new THREE.BoxGeometry(36, 4.0, 4.5), this.hydroGoldTrimMat);
        archBeam.position.set(x, y + 30, z + 28);
        group.add(archBeam);

        // Giant Golden Trident Emblem atop the Arch
        const tridentStem = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 9, 8), this.hydroGoldTrimMat);
        tridentStem.position.set(x, y + 36, z + 28);
        group.add(tridentStem);

        [-3.5, 3.5].forEach(tx => {
            const prong = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 7, 8), this.hydroGoldTrimMat);
            prong.position.set(x + tx, y + 37, z + 28);
            group.add(prong);
        });

        this.scene.add(group);
        this.stageMeshes.push(group);
        return group;
    }

    // ============================================================
    // STAGE 1: GREEN HILL COURSE & SCENERY
    // ============================================================
    buildStageCourse() {
        this.buildGreenHillCourse();
    }

    buildGreenHillCourse() {
        // Multi-tier track definitions spanning from z: 40 down to z: -5600
        this.addRoadSegment(0, 0, -40, 36, 160, 0);
        this.addSlopedRoad(0, 0, -120, 32, 120, 22);
        this.addRoadSegment(0, 22, -300, 32, 120, 0);
        this.addSlopedRoad(0, 22, -360, 30, 100, -18);
        this.buildLoopSection(0, 4, -510, 16);
        this.addRoadSegment(0, 4, -515, 32, 110, 0);
        this.addRoadSegment(0, 5, -630, 26, 120, 0);
        this.buildWaterBasin(0, -630, 140, 140);
        this.addRoadSegment(0, 8, -755, 38, 130, 0);
        this.addRoadSegment(0, 8, -885, 42, 130, 0);
        this.addRoadSegment(0, 8, -1015, 42, 130, 0);
        this.addSlopedRoad(0, 8, -1080, 36, 140, 18);
        this.addRoadSegment(0, 26, -1290, 34, 140, 0);
        this.addRoadSegment(0, 26, -1430, 26, 140, 0);
        this.addSlopedRoad(0, 26, -1500, 28, 40, 2);
        this.addRoadSegment(-10, 28, -1590, 18, 100, 0);
        this.addRoadSegment(10, 28, -1590, 18, 100, 0);
        this.addRoadSegment(0, 28, -1590, 14, 100, 0);
        this.addRoadSegment(0, 28, -1660, 34, 40, 0);
        this.addSlopedRoad(0, 28, -1680, 32, 160, -24);
        this.addRoadSegment(0, 4, -1880, 32, 80, 0);
        this.addSlopedRoad(0, 4, -1920, 32, 80, 8);
        this.addSlopedRoad(0, 12, -2000, 32, 60, -6);
        this.buildLoopSection(0, 6, -2120, 18);
        this.addRoadSegment(0, 6, -2120, 36, 120, 0);
        this.buildWaterBasin(0, -2120, 160, 160);
        this.addSlopedRoad(0, 6, -2180, 34, 60, 4);
        this.addRoadSegment(0, 10, -2300, 36, 120, 0);
        this.addRoadSegment(0, 10, -2420, 38, 120, 0);
        this.addSlopedRoad(0, 10, -2480, 36, 80, 6);
        this.addRoadSegment(0, 16, -2580, 34, 120, 0);
        this.addRoadSegment(0, 16, -2700, 32, 120, 0);
        this.addSlopedRoad(0, 16, -2760, 32, 80, -6);
        this.addRoadSegment(0, 10, -2860, 34, 120, 0);
        this.addRoadSegment(0, 10, -2980, 36, 120, 0);
        this.addRoadSegment(0, 12, -3110, 36, 140, 0);
        this.addSlopedRoad(0, 12, -3180, 34, 140, 16);
        this.addRoadSegment(0, 28, -3390, 32, 140, 0);
        this.addSlopedRoad(0, 28, -3460, 32, 160, -20);
        this.addRoadSegment(0, 8, -3620, 36, 160, 0);
        this.buildWaterBasin(0, -3620, 180, 180);
        this.addRoadSegment(0, 10, -3780, 38, 160, 0);
        this.addSlopedRoad(0, 10, -3860, 36, 140, 10);
        this.addRoadSegment(0, 20, -4005, 34, 150, 0);
        this.addSlopedRoad(0, 20, -4080, 34, 120, -8);
        this.addRoadSegment(0, 12, -4205, 36, 130, 0);
        this.addRoadSegment(0, 12, -4335, 36, 130, 0);
        this.addRoadSegment(0, 12, -4465, 38, 130, 0);
        this.addRoadSegment(0, 12, -4595, 38, 130, 0);
        this.addRoadSegment(0, 10, -4730, 42, 140, 0);
        this.addSlopedRoad(0, 10, -4800, 40, 120, 6);
        this.addRoadSegment(0, 16, -4930, 40, 140, 0);
        this.addSlopedRoad(0, 16, -5000, 40, 120, -6);
        this.addRoadSegment(0, 10, -5130, 44, 140, 0);
        this.addRoadSegment(0, 10, -5270, 46, 140, 0);
        this.addRoadSegment(0, 10, -5410, 48, 140, 0);
        this.addRoadSegment(0, 10, -5550, 56, 140, 0);
        this.buildVictoryColosseum(0, 10, -5600, 72);
    }

    buildVictoryColosseum(x, y, z, radius = 72) {
        this.buildHimavantaShrine(x, y, z, radius);
    }

    buildHimavantaShrine(x, y, z, radius = 72) {
        const shrineGroup = new THREE.Group();

        // 1. Grand Sacred Stone Terrace (Multi-tiered base)
        const baseGeo1 = new THREE.CylinderGeometry(radius, radius * 1.05, 14, 32);
        const baseMat = this.ancientStoneMat;
        const topMat = this.getGrassTopMaterial(12, 12);
        const baseMesh1 = new THREE.Mesh(baseGeo1, [baseMat, topMat, baseMat]);
        baseMesh1.position.set(x, y - 7, z);
        baseMesh1.receiveShadow = true;
        shrineGroup.add(baseMesh1);

        // Golden rim ring around terrace edge
        const rimGeo = new THREE.TorusGeometry(radius, 1.2, 8, 36);
        const rim = new THREE.Mesh(rimGeo, this.pillarGoldTrimMat);
        rim.rotation.x = Math.PI / 2;
        rim.position.set(x, y + 0.5, z);
        shrineGroup.add(rim);

        // 2. Inner Sacred Dais (แท่นบูชาหิมพานต์)
        const innerGeo = new THREE.CylinderGeometry(radius * 0.45, radius * 0.48, 6, 24);
        const innerMesh = new THREE.Mesh(innerGeo, [this.pillarGoldTrimMat, topMat, this.pillarGoldTrimMat]);
        innerMesh.position.set(x, y + 3, z);
        shrineGroup.add(innerMesh);

        // 3. Ring of 16 Ancient Sacred Lotus Pillars
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const px = x + Math.cos(angle) * (radius - 6);
            const pz = z + Math.sin(angle) * (radius - 6);
            const pillar = this.createAncientHimavantaPillar(34);
            pillar.position.set(px, y, pz);
            shrineGroup.add(pillar);
        }

        // 4. Central Himavanta Celestial Golden Spire / Pavilion (มณฑปทองคำยอดเขาหิมพานต์)
        const spireGroup = new THREE.Group();
        spireGroup.position.set(x, y + 6, z - radius * 0.55);

        const tiers = [
            { w: 22, h: 4.5, y: 12 },
            { w: 17, h: 4.0, y: 18 },
            { w: 12, h: 3.5, y: 23 },
            { w: 8, h: 3.0, y: 27 }
        ];
        tiers.forEach(t => {
            const roofGeo = new THREE.ConeGeometry(t.w, t.h, 6);
            const roofMesh = new THREE.Mesh(roofGeo, this.pillarGoldTrimMat);
            roofMesh.position.y = t.y;
            spireGroup.add(roofMesh);
        });

        // Golden Pinnacle Finial (ยอดฉัตร)
        const spireGeo = new THREE.ConeGeometry(2.8, 18, 8);
        const spireMesh = new THREE.Mesh(spireGeo, this.pillarGoldTrimMat);
        spireMesh.position.y = 38;
        spireGroup.add(spireMesh);

        // Radiant Celestial Orb on Top
        const orbGeo = new THREE.SphereGeometry(3.2, 16, 16);
        const orbMesh = new THREE.Mesh(orbGeo, this.himavantaFruitMat);
        orbMesh.position.y = 48;
        spireGroup.add(orbMesh);

        shrineGroup.add(spireGroup);

        this.scene.add(shrineGroup);
        this.stageMeshes.push(shrineGroup);
    }

    buildWaterBasin(x, z, width, length) {
        const waterGeo = new THREE.PlaneGeometry(width, length);
        const waterMat = new THREE.MeshBasicMaterial({
            color: 0x00f5d4,
            transparent: true,
            opacity: 0.85
        });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.rotation.x = -Math.PI / 2;
        water.position.set(x, -8, z);
        this.scene.add(water);
        this.stageMeshes.push(water);
    }

    buildScenery() {
        this.buildGreenHillScenery();
    }

    buildGreenHillScenery() {
        const treeLocations = [
            [-22, 0, 10], [22, 0, 5],
            [-20, 0, -40], [20, 0, -50],
            [-21, 0, -90], [21, 0, -100],
            [-22, 22, -260], [22, 22, -280],
            [-22, 22, -320], [22, 22, -340],
            [-20, 4, -480], [20, 4, -540],
            [-18, 5, -600], [18, 5, -640],
            [-22, 8, -720], [22, 8, -730],
            [-22, 8, -780], [22, 8, -790],
            [-22, 8, -850], [22, 8, -870],
            [-22, 8, -980], [22, 8, -1000],
            [-23, 17, -1140], [23, 17, -1160],
            [-22, 26, -1250], [22, 26, -1270],
            [-22, 26, -1330], [22, 26, -1350],
            [-20, 26, -1450], [20, 26, -1470],
            [-22, 28, -1580], [22, 28, -1600],
            [-22, 28, -1650], [22, 28, -1660],
            [-22, 4, -1860], [22, 4, -1880],
            [-20, 6, -2080], [20, 6, -2140],
            [-22, 10, -2280], [22, 10, -2320],
            [-22, 16, -2560], [22, 16, -2600],
            [-22, 10, -2840], [22, 10, -2880],
            [-24, 12, -3100], [24, 12, -3120],
            [-22, 28, -3380], [22, 28, -3400],
            [-24, 8, -3600], [24, 8, -3640],
            [-24, 20, -3980], [24, 20, -4020],
            [-24, 12, -4300], [24, 12, -4350],
            [-26, 12, -4580], [26, 12, -4620],
            [-26, 10, -4850], [26, 10, -4900],
            [-28, 10, -5250], [28, 10, -5300],
            [-30, 10, -5500], [30, 10, -5520]
        ];

        treeLocations.forEach((loc, index) => {
            let obj;
            const floraRoll = (index % 7);
            if (floraRoll <= 3) {
                obj = this.createHimavantaTree();
            } else if (floraRoll <= 5) {
                obj = this.createHimavantaPinkTree();
            } else {
                obj = this.createSacredLotus();
                const side = loc[0] > 0 ? 1 : -1;
                obj.rotation.y = -side * 0.38;
            }
            obj.position.set(loc[0], loc[1], loc[2]);
            this.scene.add(obj);
            this.stageMeshes.push(obj);
            this.sceneryObjects.push(obj);
        });

        const totemLocations = [
            [-16, 0, -20], [16, 0, -20],
            [-17, 22, -250], [17, 22, -250],
            [-16, 8, -710], [16, 8, -710],
            [-18, 26, -1300], [18, 26, -1300],
            [-18, 28, -1650], [18, 28, -1650],
            [-18, 6, -2100], [18, 6, -2100],
            [-18, 10, -2480], [18, 10, -2480],
            [-22, 12, -2890], [22, 12, -2890],
            [-20, 28, -3320], [20, 28, -3320],
            [-22, 10, -3700], [22, 10, -3700],
            [-20, 14, -4180], [20, 14, -4180],
            [-22, 10, -4800], [22, 10, -4800],
            [-24, 10, -5400], [24, 10, -5400]
        ];

        totemLocations.forEach((loc, idx) => {
            let obj;
            if (idx % 2 === 0) {
                obj = this.createAncientHimavantaPillar(14);
            } else {
                obj = this.createSacredLotus();
                const side = loc[0] > 0 ? 1 : -1;
                obj.rotation.y = -side * 0.38;
            }
            obj.position.set(loc[0], loc[1], loc[2]);
            this.scene.add(obj);
            this.stageMeshes.push(obj);
            this.sceneryObjects.push(obj);
        });

        // Giant Himavanta Cliffs, Cascading Waterfalls & Layered Mountains
        const totalBackdropFormations = 75;
        for (let i = 0; i < totalBackdropFormations; i++) {
            const side = (i % 2 === 0) ? 1 : -1;
            const progress = i / totalBackdropFormations;
            const z = 80 - progress * 5750;

            if (i % 3 === 0) {
                const w = 55 + Math.random() * 25;
                const h = 75 + Math.random() * 35;
                const hasWaterfall = (i % 5 === 0);
                const cliff = this.createHimavantaCliff(w, h, w, hasWaterfall);
                const dist = 140 + Math.random() * 60;
                cliff.position.set(side * dist, -8, z);
                cliff.rotation.y = (side > 0) ? -Math.PI * 0.45 : Math.PI * 0.45;
                this.scene.add(cliff);
                this.stageMeshes.push(cliff);
                this.sceneryObjects.push(cliff);
            } else if (i % 3 === 1) {
                const r = 45 + Math.random() * 25;
                const hill = this.createRollingHill(r, 0.85 + Math.random() * 0.3, 'near');
                const dist = 160 + Math.random() * 80;
                hill.position.set(side * dist, -5, z);
                this.scene.add(hill);
                this.stageMeshes.push(hill);
                this.sceneryObjects.push(hill);
            } else {
                const r = 60 + Math.random() * 35;
                const hill = this.createRollingHill(r, 0.75 + Math.random() * 0.25, 'far');
                const dist = 240 + Math.random() * 100;
                hill.position.set(side * dist, -10, z);
                this.scene.add(hill);
                this.stageMeshes.push(hill);
                this.sceneryObjects.push(hill);
            }
        }
    }

    createHimavantaCliff(w = 55, h = 85, d = 55, hasWaterfall = false) {
        const group = new THREE.Group();

        // Layered mossy slate cliff body
        const rockGeo = new THREE.CylinderGeometry(w * 0.40, w * 0.54, h, 9);
        const rockMesh = new THREE.Mesh(rockGeo, this.mesaCheckerMat);
        rockMesh.position.y = h * 0.5;
        rockMesh.castShadow = true;
        rockMesh.receiveShadow = true;
        group.add(rockMesh);

        // Lush emerald sacred grass plateau cap
        const grassGeo = new THREE.CylinderGeometry(w * 0.43, w * 0.43, 4.0, 9);
        const grassMesh = new THREE.Mesh(grassGeo, this.mesaGrassMat);
        grassMesh.position.y = h + 1.5;
        grassMesh.castShadow = true;
        group.add(grassMesh);

        // Sacred cascading waterfall
        if (hasWaterfall) {
            const fallWidth = Math.max(8.0, w * 0.22);
            const fallGeo = new THREE.PlaneGeometry(fallWidth, h * 0.98);
            const fallMesh = new THREE.Mesh(fallGeo, this.waterfallMat);
            const slopeAngle = Math.atan2(w * 0.12, h);
            fallMesh.rotation.x = slopeAngle;
            fallMesh.position.set(0, h * 0.49, (w * 0.40 + w * 0.54) * 0.5 + 1.2);
            group.add(fallMesh);

            // Shimmering foam splash at base
            const foamGeo = new THREE.CylinderGeometry(fallWidth * 0.9, fallWidth * 1.6, 3.0, 8);
            const foamMesh = new THREE.Mesh(foamGeo, this.waterfallFoamMat);
            foamMesh.position.set(0, 1.5, w * 0.54 + 2.0);
            group.add(foamMesh);

            // Secondary crystal cascade ribbon
            const sideFallGeo = new THREE.PlaneGeometry(fallWidth * 0.35, h * 0.7);
            const sideFallMesh = new THREE.Mesh(sideFallGeo, this.waterfallMat);
            sideFallMesh.rotation.x = slopeAngle;
            sideFallMesh.position.set(fallWidth * 0.7, h * 0.35, (w * 0.40 + w * 0.54) * 0.5 + 1.0);
            group.add(sideFallMesh);
        }

        return group;
    }

    createCheckeredMesa(w = 55, h = 85, d = 55, hasWaterfall = false) {
        return this.createHimavantaCliff(w, h, d, hasWaterfall);
    }

    createRollingHill(r = 45, hScale = 1.0, tier = 'near') {
        const group = new THREE.Group();
        const mat = (tier === 'far') ? this.hillFarMat : (tier === 'mid' ? this.hillMidMat : this.hillNearMat);

        const domeGeo = new THREE.SphereGeometry(r, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.52);
        const mainDome = new THREE.Mesh(domeGeo, mat);
        mainDome.scale.set(1.0, hScale, 1.0);
        mainDome.castShadow = (tier !== 'far');
        group.add(mainDome);

        const r2 = r * (0.65 + Math.random() * 0.2);
        const domeGeo2 = new THREE.SphereGeometry(r2, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.52);
        const sideDome = new THREE.Mesh(domeGeo2, mat);
        const offsetX = (Math.random() > 0.5 ? 1 : -1) * (r * 0.55);
        const offsetZ = (Math.random() - 0.5) * (r * 0.4);
        sideDome.position.set(offsetX, 0, offsetZ);
        sideDome.scale.set(1.0, hScale * 0.85, 1.0);
        group.add(sideDome);

        return group;
    }

    createHimavantaTree() {
        const group = new THREE.Group();
        const trunkHeight = 10.0 + (Math.random() - 0.5) * 2.0;

        // Gnarled sacred tree trunk
        const segments = 6;
        const lean = (Math.random() - 0.5) * 0.4;
        for (let i = 0; i < segments; i++) {
            const radB = 0.9 - (i / segments) * 0.35;
            const radT = 0.9 - ((i + 1) / segments) * 0.35;
            const segH = trunkHeight / segments;
            const geo = new THREE.CylinderGeometry(radT, radB, segH, 8);
            const m = new THREE.Mesh(geo, this.woodTrunkMat);
            const curY = (i + 0.5) * segH;
            const curX = Math.sin((i / segments) * Math.PI * 0.7) * lean * 2.0;
            m.position.set(curX, curY, 0);
            m.castShadow = true;
            group.add(m);
        }

        // Outstretched ancient branches
        const branchAngles = [0.4, 2.2, 4.3];
        branchAngles.forEach(ang => {
            const bGeo = new THREE.CylinderGeometry(0.25, 0.4, 3.5, 6);
            const bMesh = new THREE.Mesh(bGeo, this.woodTrunkMat);
            bMesh.position.set(Math.cos(ang) * 1.2, trunkHeight * 0.75, Math.sin(ang) * 1.2);
            bMesh.rotation.z = Math.cos(ang) * 0.6;
            bMesh.rotation.x = Math.sin(ang) * 0.6;
            group.add(bMesh);
        });

        // Sacred Emerald Canopy Domes
        const topX = Math.sin(Math.PI * 0.7) * lean * 2.0;
        const leafClusters = [
            { r: 2.8, x: topX, y: trunkHeight + 2.0, z: 0, mat: this.bubbleLeafMat1 },
            { r: 2.2, x: topX - 1.8, y: trunkHeight + 1.4, z: 0.8, mat: this.bubbleLeafMat1 },
            { r: 2.3, x: topX + 1.9, y: trunkHeight + 1.6, z: -0.7, mat: this.bubbleLeafMat1 },
            { r: 1.8, x: topX + 0.5, y: trunkHeight + 3.4, z: 0.4, mat: this.bubbleLeafMat1 }
        ];

        leafClusters.forEach(cl => {
            const leafGeo = new THREE.SphereGeometry(cl.r, 9, 8);
            const leafMesh = new THREE.Mesh(leafGeo, cl.mat);
            leafMesh.position.set(cl.x, cl.y, cl.z);
            leafMesh.castShadow = true;
            group.add(leafMesh);
        });

        // Glowing Golden Sacred Fruits (ผลไม้มงคลหิมพานต์)
        const fruitPositions = [
            [topX - 1.2, trunkHeight + 0.4, 1.2],
            [topX + 1.4, trunkHeight + 0.6, -1.0],
            [topX - 0.8, trunkHeight + 0.2, -1.2],
            [topX + 1.2, trunkHeight + 0.5, 1.1]
        ];
        fruitPositions.forEach(fp => {
            const fruitGeo = new THREE.SphereGeometry(0.48, 8, 8);
            const fruit = new THREE.Mesh(fruitGeo, this.himavantaFruitMat);
            fruit.position.set(fp[0], fp[1], fp[2]);
            group.add(fruit);
        });

        const s = 0.95 + Math.random() * 0.2;
        group.scale.set(s, s, s);
        return group;
    }

    createPalmTree() {
        return this.createHimavantaTree();
    }

    createHimavantaPinkTree() {
        const group = new THREE.Group();
        const trunkHeight = 8.5 + (Math.random() - 0.5) * 1.5;

        // Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.55, 0.85, trunkHeight, 8);
        const trunk = new THREE.Mesh(trunkGeo, this.woodTrunkMat);
        trunk.position.y = trunkHeight * 0.5;
        trunk.castShadow = true;
        group.add(trunk);

        // Celestial Pink & Cyan Blossom Domes
        const clusters = [
            { r: 2.6, x: 0, y: trunkHeight + 1.8, z: 0, mat: this.bubbleLeafMat2 },
            { r: 2.0, x: -1.6, y: trunkHeight + 1.2, z: 0.6, mat: this.bubbleLeafMat2 },
            { r: 2.1, x: 1.5, y: trunkHeight + 1.4, z: -0.6, mat: this.bubbleLeafMat3 },
            { r: 1.6, x: 0.2, y: trunkHeight + 3.2, z: 0.3, mat: this.bubbleLeafMat2 }
        ];

        clusters.forEach(c => {
            const geo = new THREE.SphereGeometry(c.r, 9, 8);
            const m = new THREE.Mesh(geo, c.mat);
            m.position.set(c.x, c.y, c.z);
            m.castShadow = true;
            group.add(m);
        });

        // Hanging golden pollen drops
        for (let i = 0; i < 5; i++) {
            const a = (i / 5) * Math.PI * 2;
            const drop = new THREE.Mesh(new THREE.SphereGeometry(0.38, 8, 8), this.himavantaFruitMat);
            drop.position.set(Math.cos(a) * 1.5, trunkHeight + 0.3, Math.sin(a) * 1.5);
            group.add(drop);
        }

        const s = 0.95 + Math.random() * 0.2;
        group.scale.set(s, s, s);
        return group;
    }

    createBubbleTree() {
        return this.createHimavantaPinkTree();
    }

    createSacredLotus() {
        const group = new THREE.Group();

        // Giant Emerald Lily Pad Base (ใบบัวทิพย์)
        const padGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.12, 16);
        const padMesh = new THREE.Mesh(padGeo, this.mesaGrassMat);
        padMesh.position.y = 0.06;
        padMesh.castShadow = true;
        group.add(padMesh);

        // Curving Sacred Flower Stalk
        const stalkH = 3.6;
        const stalkGeo = new THREE.CylinderGeometry(0.18, 0.26, stalkH, 8);
        const stalk = new THREE.Mesh(stalkGeo, this.flowerStalkMat);
        stalk.position.set(0, stalkH * 0.5, -0.15);
        stalk.rotation.x = -0.06;
        stalk.castShadow = true;
        group.add(stalk);

        // Lotus Blossom Head
        const head = new THREE.Group();
        head.position.set(0, stalkH, 0);

        // Radiant Golden Core Receptacle (เกสรดอกบัวเรืองรอง)
        const coreGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.35, 16);
        const core = new THREE.Mesh(coreGeo, this.flowerCenterMat);
        head.add(core);

        // Glowing center jewel
        const jewelGeo = new THREE.SphereGeometry(0.42, 8, 8);
        const jewel = new THREE.Mesh(jewelGeo, this.himavantaFruitMat);
        jewel.position.y = 0.22;
        head.add(jewel);

        // Multi-layered Lotus Petals (กลีบบัวสวรรค์สีชมพูบานสะพรั่ง)
        const numPetals = 12;
        for (let i = 0; i < numPetals; i++) {
            const angle = (i / numPetals) * Math.PI * 2;
            const petalGeo = new THREE.ConeGeometry(0.55, 1.8, 5);
            petalGeo.scale(1, 0.18, 0.65);
            petalGeo.translate(0, 0.9, 0);
            const petal = new THREE.Mesh(petalGeo, this.flowerPetalMat);
            petal.position.set(Math.cos(angle) * 0.75, 0.1, Math.sin(angle) * 0.75);
            petal.rotation.y = -angle;
            petal.rotation.x = 0.85;
            petal.castShadow = true;
            head.add(petal);
        }

        group.add(head);
        const s = 1.0 + Math.random() * 0.25;
        group.scale.set(s, s, s);
        return group;
    }

    createGiantSunflower() {
        return this.createSacredLotus();
    }

    createAncientHimavantaPillar(height = 12) {
        const group = new THREE.Group();

        // Mossy Slate Hexagonal Base Pedestal
        const baseGeo = new THREE.CylinderGeometry(1.6, 2.0, 2.2, 6);
        const base = new THREE.Mesh(baseGeo, this.ancientStoneMat);
        base.position.y = 1.1;
        base.castShadow = true;
        group.add(base);

        // Pillar Shaft
        const shaftH = height - 3.5;
        const shaftGeo = new THREE.CylinderGeometry(1.1, 1.35, shaftH, 12);
        const shaft = new THREE.Mesh(shaftGeo, this.ancientStoneMat);
        shaft.position.y = 2.2 + shaftH * 0.5;
        shaft.castShadow = true;
        group.add(shaft);

        // Golden Inscribed Rings / Runes along shaft
        [0.3, 0.6, 0.9].forEach(f => {
            const ringGeo = new THREE.TorusGeometry(1.3, 0.15, 6, 16);
            const ring = new THREE.Mesh(ringGeo, this.pillarGoldTrimMat);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = 2.2 + shaftH * f;
            group.add(ring);
        });

        // Lotus Capital at Top
        const capGeo = new THREE.CylinderGeometry(1.8, 1.2, 1.2, 8);
        const cap = new THREE.Mesh(capGeo, this.pillarGoldTrimMat);
        cap.position.y = 2.2 + shaftH + 0.6;
        cap.castShadow = true;
        group.add(cap);

        // Radiant Celestial Spire Jewel on Top
        const orbGeo = new THREE.SphereGeometry(0.65, 12, 12);
        const orb = new THREE.Mesh(orbGeo, this.himavantaFruitMat);
        orb.position.y = 2.2 + shaftH + 1.8;
        group.add(orb);

        return group;
    }

    createTotemPole() {
        return this.createAncientHimavantaPillar(12);
    }

    createMountain() {
        return this.createRollingHill(45 + Math.random() * 20, 0.9, 'near');
    }

    getGroundHeight(x, z) {
        let bestHeight = -100;
        for (let i = 0; i < this.platforms.length; i++) {
            const p = this.platforms[i];
            if (p.type === 'box') {
                if (x >= p.minX && x <= p.maxX && z >= p.minZ && z <= p.maxZ) {
                    if (p.topY > bestHeight) {
                        bestHeight = p.topY;
                    }
                }
            } else if (p.type === 'slope') {
                if (x >= p.minX && x <= p.maxX) {
                    const minZ = Math.min(p.startZ, p.endZ);
                    const maxZ = Math.max(p.startZ, p.endZ);
                    if (z >= minZ && z <= maxZ) {
                        const t = (z - p.startZ) / (p.endZ - p.startZ);
                        const h = p.startY + t * (p.endY - p.startY);
                        if (h > bestHeight) {
                            bestHeight = h;
                        }
                    }
                }
            }
        }
        return bestHeight > -90 ? bestHeight : -50;
    }

    update(dt, playerZ) {
        // Slowly drift clouds across sky
        this.clouds.forEach(cloud => {
            cloud.position.x += dt * 3.5;
            if (cloud.position.x > 320) {
                cloud.position.x = -320;
            }
        });

        // Directional light tracks player along Z
        if (this.dirLight && playerZ !== undefined) {
            this.dirLight.position.z = playerZ + 45;
            this.dirLight.target.position.set(0, 10, playerZ);
            this.dirLight.target.updateMatrixWorld();
        }

        // Animate Mega Mack pink fluid surface shimmer in Chemical Plant
        if (this.currentStageId === 'chemical_plant' && this.megaMackTexture) {
            this.megaMackTexture.offset.x = (this.megaMackTexture.offset.x + dt * 0.08) % 1;
            this.megaMackTexture.offset.y = (this.megaMackTexture.offset.y + dt * 0.04) % 1;
        }

        // Animate Caustic Water and floating bubbles in Hydrocity
        if (this.currentStageId === 'hydrocity') {
            this.clouds.forEach(bubble => {
                bubble.position.y += dt * 4.5;
                if (bubble.position.y > 65) {
                    bubble.position.y = 6;
                }
            });
            if (this.hydroWaterTexture) {
                this.hydroWaterTexture.offset.x = (this.hydroWaterTexture.offset.x + dt * 0.05) % 1;
                this.hydroWaterTexture.offset.y = (this.hydroWaterTexture.offset.y + dt * 0.08) % 1;
            }
        }
    }
}

window.World = World;
