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
        // 2. KISHKINDHA KINGDOM (STAGE 2) TEXTURES & MATERIALS
        // ==========================================
        // Track: Royal White Marble with Ancient Thai Gold Kranok Border Trims
        const cpCanvas = document.createElement('canvas');
        cpCanvas.width = 256;
        cpCanvas.height = 256;
        const cpCtx = cpCanvas.getContext('2d');

        // Polished Ivory-White Marble Base Slabs
        cpCtx.fillStyle = '#f8fafc';
        cpCtx.fillRect(0, 0, 256, 256);

        // Subtle marble grain veins
        cpCtx.strokeStyle = 'rgba(203, 213, 225, 0.65)';
        cpCtx.lineWidth = 1.2;
        for (let v = 0; v < 8; v++) {
            cpCtx.beginPath();
            cpCtx.moveTo(35, v * 32);
            cpCtx.bezierCurveTo(90, v * 32 + 15, 160, v * 32 - 15, 220, v * 32 + 10);
            cpCtx.stroke();
        }

        // Center Royal Ceremonial Stone Path (x: 36 to 220)
        cpCtx.fillStyle = '#f1f5f9';
        cpCtx.fillRect(36, 0, 184, 256);

        // Stone slab joint lines
        cpCtx.strokeStyle = '#cbd5e1';
        cpCtx.lineWidth = 2;
        cpCtx.strokeRect(36, 0, 184, 256);
        for (let gy = 0; gy <= 256; gy += 64) {
            cpCtx.beginPath();
            cpCtx.moveTo(36, gy);
            cpCtx.lineTo(220, gy);
            cpCtx.stroke();
        }

        // Center Gold Lotus Inlay Cartouche in each slab
        for (let cy = 32; cy < 256; cy += 64) {
            // Diamond flower core
            cpCtx.fillStyle = 'rgba(245, 158, 11, 0.45)';
            cpCtx.beginPath();
            cpCtx.moveTo(128, cy - 14);
            cpCtx.lineTo(142, cy);
            cpCtx.lineTo(128, cy + 14);
            cpCtx.lineTo(114, cy);
            cpCtx.closePath();
            cpCtx.fill();

            cpCtx.fillStyle = '#ffd700';
            cpCtx.beginPath();
            cpCtx.arc(128, cy, 3.5, 0, Math.PI * 2);
            cpCtx.fill();
        }

        // Ancient Thai Gold Kranok Border Trims (left: 0-36, right: 220-256)
        const drawKranokBorder = (startX, endX) => {
            const w = endX - startX;
            // Rich Royal Amber/Bronze Base
            cpCtx.fillStyle = '#78350f';
            cpCtx.fillRect(startX, 0, w, 256);

            // Shimmering Gold Border Stripe
            cpCtx.fillStyle = '#f59e0b';
            cpCtx.fillRect(startX + 3, 0, w - 6, 256);

            // Repeated Sacred Kranok Flame motif
            cpCtx.fillStyle = '#ffd700';
            for (let y = 0; y < 256; y += 32) {
                // Outer curving flame leaf
                cpCtx.beginPath();
                const midX = startX + w * 0.5;
                cpCtx.moveTo(midX, y + 4);
                cpCtx.quadraticCurveTo(midX + (startX === 0 ? 8 : -8), y + 16, midX, y + 28);
                cpCtx.quadraticCurveTo(midX + (startX === 0 ? -6 : 6), y + 18, midX, y + 4);
                cpCtx.closePath();
                cpCtx.fill();

                // Ruby/Emerald jewel dot
                cpCtx.fillStyle = (y % 64 === 0) ? '#dc2626' : '#059669';
                cpCtx.beginPath();
                cpCtx.arc(midX, y + 16, 2.2, 0, Math.PI * 2);
                cpCtx.fill();
                cpCtx.fillStyle = '#ffd700';
            }

            // Gilded inner divider line
            cpCtx.strokeStyle = '#fde047';
            cpCtx.lineWidth = 3.5;
            cpCtx.beginPath();
            const divX = (startX === 0) ? endX : startX;
            cpCtx.moveTo(divX, 0);
            cpCtx.lineTo(divX, 256);
            cpCtx.stroke();
        };

        drawKranokBorder(0, 36);
        drawKranokBorder(220, 256);

        this.chemTrackTexture = new THREE.CanvasTexture(cpCanvas);
        this.chemTrackTexture.wrapS = THREE.RepeatWrapping;
        this.chemTrackTexture.wrapT = THREE.RepeatWrapping;

        // Side Wall Texture: Ancient Royal Carved Sandstone & Golden Lotus Relief
        const sideCanvas = document.createElement('canvas');
        sideCanvas.width = 256;
        sideCanvas.height = 256;
        const sCtx = sideCanvas.getContext('2d');
        // Warm Terracotta / Ancient Khmer-Thai Sandstone
        sCtx.fillStyle = '#78350f';
        sCtx.fillRect(0, 0, 256, 256);

        // Stone frieze block bevels
        sCtx.strokeStyle = '#92400e';
        sCtx.lineWidth = 5;
        sCtx.strokeRect(4, 4, 248, 248);

        // Multi-tiered Lotus Petal Relief (บัวคว่ำ บัวหงาย)
        sCtx.fillStyle = '#b45309';
        for (let bx = 16; bx < 256; bx += 48) {
            // Upper lotus petal
            sCtx.beginPath();
            sCtx.arc(bx, 28, 18, 0, Math.PI);
            sCtx.fill();
            // Lower inverted lotus petal
            sCtx.beginPath();
            sCtx.arc(bx, 228, 18, Math.PI, 0);
            sCtx.fill();
        }

        // Center Royal Vanara Sun Relief Diamond
        sCtx.fillStyle = '#f59e0b';
        sCtx.beginPath();
        sCtx.moveTo(128, 64);
        sCtx.lineTo(192, 128);
        sCtx.lineTo(128, 192);
        sCtx.lineTo(64, 128);
        sCtx.closePath();
        sCtx.fill();

        sCtx.fillStyle = '#ffd700';
        sCtx.beginPath();
        sCtx.arc(128, 128, 22, 0, Math.PI * 2);
        sCtx.fill();

        sCtx.fillStyle = '#78350f';
        sCtx.beginPath();
        sCtx.arc(128, 128, 10, 0, Math.PI * 2);
        sCtx.fill();

        this.chemSideTexture = new THREE.CanvasTexture(sideCanvas);
        this.chemSideTexture.wrapS = THREE.RepeatWrapping;
        this.chemSideTexture.wrapT = THREE.RepeatWrapping;

        // Sacred Anodat Lotus Moat & Royal Pool Water Texture
        const mmCanvas = document.createElement('canvas');
        mmCanvas.width = 256;
        mmCanvas.height = 256;
        const mmCtx = mmCanvas.getContext('2d');
        // Sacred Deep Emerald-Teal Water
        mmCtx.fillStyle = '#064e3b';
        mmCtx.fillRect(0, 0, 256, 256);

        // Shimmering Turquoise & Jade Water Ripples
        mmCtx.fillStyle = '#0d9488';
        for (let i = 0; i < 14; i++) {
            const rx = Math.random() * 256;
            const ry = Math.random() * 256;
            const rw = 25 + Math.random() * 45;
            const rh = 12 + Math.random() * 20;
            mmCtx.beginPath();
            mmCtx.ellipse(rx, ry, rw, rh, Math.random() * Math.PI, 0, Math.PI * 2);
            mmCtx.fill();
        }

        // Floating Sacred Emerald Lotus Pads
        for (let lp = 0; lp < 8; lp++) {
            const px = 20 + Math.random() * 216;
            const py = 20 + Math.random() * 216;
            const pr = 12 + Math.random() * 10;
            mmCtx.fillStyle = '#059669';
            mmCtx.beginPath();
            mmCtx.arc(px, py, pr, 0.2, Math.PI * 1.85);
            mmCtx.lineTo(px, py);
            mmCtx.fill();

            // Lotus pad golden vein
            mmCtx.strokeStyle = '#34d399';
            mmCtx.lineWidth = 1.5;
            mmCtx.beginPath();
            mmCtx.arc(px, py, pr * 0.65, 0, Math.PI * 2);
            mmCtx.stroke();
        }

        // Glowing Golden Pollen & Water Sparkles
        mmCtx.fillStyle = 'rgba(253, 224, 71, 0.85)';
        for (let b = 0; b < 24; b++) {
            mmCtx.beginPath();
            mmCtx.arc(Math.random() * 256, Math.random() * 256, 2 + Math.random() * 3, 0, Math.PI * 2);
            mmCtx.fill();
        }

        this.megaMackTexture = new THREE.CanvasTexture(mmCanvas);
        this.megaMackTexture.wrapS = THREE.RepeatWrapping;
        this.megaMackTexture.wrapT = THREE.RepeatWrapping;

        // Kishkindha Kingdom Materials
        this.chemTrackMat = new THREE.MeshLambertMaterial({
            map: this.chemTrackTexture,
            roughness: 0.25
        });
        this.chemSideMat = new THREE.MeshLambertMaterial({
            map: this.chemSideTexture,
            roughness: 0.55
        });
        this.megaMackMat = new THREE.MeshBasicMaterial({
            map: this.megaMackTexture,
            transparent: true,
            opacity: 0.92
        });

        // Sacred Crystal Canopy Material (replacing glass tube)
        this.glassTubeMat = new THREE.MeshLambertMaterial({
            color: 0xfffaed,
            transparent: true,
            opacity: 0.32,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        // Vanara & Royal Palace Architecture Materials
        this.vanaraGoldMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.88,
            roughness: 0.2,
            emissive: 0x4a3200
        });
        this.vanaraBronzeMat = new THREE.MeshLambertMaterial({ color: 0x92400e, flatShading: true });
        this.royalMarbleWhiteMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc, flatShading: true });
        this.royalCrimsonMat = new THREE.MeshLambertMaterial({ color: 0xb91c1c, flatShading: true });
        this.royalEmeraldMat = new THREE.MeshLambertMaterial({ color: 0x047857, flatShading: true });
        this.sacredFireMat = new THREE.MeshBasicMaterial({ color: 0xff7700 });
        this.sacredFireGlowMat = new THREE.MeshBasicMaterial({ color: 0xffdd44 });
        this.sacredTorchWoodMat = new THREE.MeshLambertMaterial({ color: 0x451a03 });

        // Compatibility color aliases
        this.neonYellowMat = this.vanaraGoldMat;
        this.neonCyanMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        this.neonPinkMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
        this.chemSteelMat = this.vanaraBronzeMat;
        this.chemSiloMat = this.chemSideMat;
        this.chemPipeMat = this.vanaraGoldMat;
        this.chemBeaconRedMat = new THREE.MeshBasicMaterial({ color: 0xff3b30 });

        // ==========================================
        // 3. LANKA OCEAN & SUVANNAMACCHA DEEP TEXTURES & MATERIALS
        // ==========================================
        // 1. Rama's Causeway Track: Oceanic slate tiles with Mother-of-Pearl inlays & Golden Naga borders
        const htCanvas = document.createElement('canvas');
        htCanvas.width = 256;
        htCanvas.height = 256;
        const htCtx = htCanvas.getContext('2d');
        if (htCtx) {
            // Deep oceanic slate foundation (หินศิลาใต้สมุทร)
            htCtx.fillStyle = '#0a2540';
            htCtx.fillRect(0, 0, 256, 256);

            // Carved sea-temple stone slabs
            const tileCols = 4, tileRows = 4;
            const tw = 256 / tileCols, th = 256 / tileRows;
            for (let r = 0; r < tileRows; r++) {
                for (let c = 0; c < tileCols; c++) {
                    htCtx.fillStyle = (r + c) % 2 === 0 ? '#0d3b66' : '#072744';
                    htCtx.fillRect(c * tw + 3, r * th + 3, tw - 6, th - 6);
                    htCtx.strokeStyle = '#0284c7';
                    htCtx.lineWidth = 2;
                    htCtx.strokeRect(c * tw + 3, r * th + 3, tw - 6, th - 6);

                    // Shimmering Mother-of-Pearl central diamonds (มุกประกายคราม)
                    htCtx.fillStyle = '#67e8f9';
                    htCtx.beginPath();
                    htCtx.arc(c * tw + tw * 0.5, r * th + th * 0.5, 4, 0, Math.PI * 2);
                    htCtx.fill();
                }
            }

            // Sacred Golden Naga Scale Border trim (ลวดลายเกล็ดพญานาคสีทองคำ)
            htCtx.fillStyle = '#d97706';
            htCtx.fillRect(0, 0, 26, 256);
            htCtx.fillRect(230, 0, 26, 256);
            htCtx.fillStyle = '#fbbf24';
            for (let y = 0; y < 256; y += 24) {
                // Naga scale chevron shapes
                htCtx.beginPath();
                htCtx.moveTo(2, y);
                htCtx.lineTo(24, y + 12);
                htCtx.lineTo(2, y + 24);
                htCtx.fill();

                htCtx.beginPath();
                htCtx.moveTo(254, y);
                htCtx.lineTo(232, y + 12);
                htCtx.lineTo(254, y + 24);
                htCtx.fill();
            }

            // Border inner cyan glow line
            htCtx.fillStyle = '#38bdf8';
            htCtx.fillRect(26, 0, 3, 256);
            htCtx.fillRect(227, 0, 3, 256);
        }
        this.hydroTrackTexture = new THREE.CanvasTexture(htCanvas);
        this.hydroTrackTexture.wrapS = THREE.RepeatWrapping;
        this.hydroTrackTexture.wrapT = THREE.RepeatWrapping;

        // 2. Causeway Retaining Wall: Submerged Naga Carved Stone with Sea Moss & Verdigris
        const hsCanvas = document.createElement('canvas');
        hsCanvas.width = 256;
        hsCanvas.height = 256;
        const hsCtx = hsCanvas.getContext('2d');
        if (hsCtx) {
            hsCtx.fillStyle = '#071e30'; // Dark undersea abyssal stone
            hsCtx.fillRect(0, 0, 256, 256);

            // Submerged masonry blocks
            hsCtx.strokeStyle = '#0e4a6d';
            hsCtx.lineWidth = 2.5;
            for (let y = 0; y < 256; y += 64) {
                hsCtx.beginPath();
                hsCtx.moveTo(0, y);
                hsCtx.lineTo(256, y);
                hsCtx.stroke();

                const xOffset = (y / 64) % 2 === 0 ? 0 : 64;
                for (let x = xOffset; x < 256; x += 128) {
                    hsCtx.beginPath();
                    hsCtx.moveTo(x, y);
                    hsCtx.lineTo(x, y + 64);
                    hsCtx.stroke();
                }
            }

            // Naga Wave engraving & verdigris emerald sea moss
            hsCtx.strokeStyle = '#06b6d4';
            hsCtx.lineWidth = 2;
            hsCtx.beginPath();
            hsCtx.moveTo(10, 10);
            hsCtx.bezierCurveTo(70, 80, 190, 40, 246, 120);
            hsCtx.bezierCurveTo(180, 200, 60, 170, 10, 246);
            hsCtx.stroke();

            // Golden studs
            hsCtx.fillStyle = '#f59e0b';
            hsCtx.fillRect(10, 10, 8, 8);
            hsCtx.fillRect(238, 10, 8, 8);
            hsCtx.fillRect(10, 238, 8, 8);
            hsCtx.fillRect(238, 238, 8, 8);
        }
        this.hydroSideTexture = new THREE.CanvasTexture(hsCanvas);
        this.hydroSideTexture.wrapS = THREE.RepeatWrapping;
        this.hydroSideTexture.wrapT = THREE.RepeatWrapping;

        // 3. Lanka Ocean Water Surface with Golden Mermaid Shimmer (Suvannamaccha's Deep)
        const hwCanvas = document.createElement('canvas');
        hwCanvas.width = 256;
        hwCanvas.height = 256;
        const hwCtx = hwCanvas.getContext('2d');
        if (hwCtx) {
            // Sapphire blue deep ocean gradient
            hwCtx.fillStyle = '#0284c7';
            hwCtx.fillRect(0, 0, 256, 256);

            // Shimmering turquoise water caustic ripples
            hwCtx.fillStyle = 'rgba(103, 232, 249, 0.32)';
            for (let i = 0; i < 22; i++) {
                hwCtx.beginPath();
                hwCtx.arc(Math.random() * 256, Math.random() * 256, 10 + Math.random() * 22, 0, Math.PI * 2);
                hwCtx.fill();
            }

            // Suvannamaccha Golden Mermaid Scale Glimmer (ประกายเกล็ดทองคำนางสุพรรณมัจฉา)
            hwCtx.fillStyle = 'rgba(251, 191, 36, 0.38)';
            for (let i = 0; i < 18; i++) {
                hwCtx.beginPath();
                hwCtx.arc(Math.random() * 256, Math.random() * 256, 4 + Math.random() * 8, 0, Math.PI * 2);
                hwCtx.fill();
            }
        }
        this.hydroWaterTexture = new THREE.CanvasTexture(hwCanvas);
        this.hydroWaterTexture.wrapS = THREE.RepeatWrapping;
        this.hydroWaterTexture.wrapT = THREE.RepeatWrapping;

        // Lanka Ocean & Suvannamaccha Undersea Materials
        this.hydroWaterMat = new THREE.MeshBasicMaterial({
            map: this.hydroWaterTexture,
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.72,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        // Crystal Abyss Flume (อุโมงค์แก้วบาดาลเรืองแสง)
        this.hydroTubeMat = new THREE.MeshLambertMaterial({
            color: 0x06b6d4,
            transparent: true,
            opacity: 0.35,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        // Ancient Lanka Ocean Sea-Stone
        this.hydroPillarMat = new THREE.MeshStandardMaterial({
            color: 0x0f293d,
            metalness: 0.25,
            roughness: 0.45
        });

        // Royal Naga Gold (ทองคำพญานาคราช)
        this.nagaGoldMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.85,
            roughness: 0.22,
            emissive: 0x452200
        });
        this.hydroGoldTrimMat = this.nagaGoldMat; // Compatibility alias

        // Mother-of-Pearl Shell (ไข่มุกมรกตบาดาล)
        this.pearlShellMat = new THREE.MeshStandardMaterial({
            color: 0xf1f5f9,
            metalness: 0.55,
            roughness: 0.25
        });

        // Bioluminescent Sea Crystal (ผลึกแก้วมณีใต้สมุทร)
        this.seaCrystalMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.85
        });

        // Sacred Coral & Kelp Materials
        this.coralPinkMat = new THREE.MeshLambertMaterial({ color: 0xf43f5e });
        this.kelpGreenMat = new THREE.MeshLambertMaterial({ color: 0x059669 });
        this.coralGoldMat = new THREE.MeshLambertMaterial({ color: 0xfbbf24 });
        this.hydroCoralPinkMat = this.coralPinkMat;
        this.hydroCoralCyanMat = new THREE.MeshLambertMaterial({ color: 0x06b6d4 });
        this.hydroCoralGoldMat = this.coralGoldMat;

        // ==========================================
        // 4. LANKA MOLTEN RAVINE TEXTURES & MATERIALS (STAGE 4)
        // ==========================================
        // 1. Basalt Lava Track Surface (512x512)
        const mrCanvas = document.createElement('canvas');
        mrCanvas.width = 512;
        mrCanvas.height = 512;
        const mrCtx = mrCanvas.getContext('2d');
        if (mrCtx) {
            // Charcoal black volcanic basalt foundation
            mrCtx.fillStyle = '#0f0c0e';
            mrCtx.fillRect(0, 0, 512, 512);

            // Dark textured stone pavers
            const cols = 4, rows = 4;
            const pw = 512 / cols, ph = 512 / rows;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    mrCtx.fillStyle = ((r + c) % 2 === 0) ? '#181216' : '#140f12';
                    mrCtx.fillRect(c * pw + 4, r * ph + 4, pw - 8, ph - 8);
                    mrCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                    mrCtx.lineWidth = 2;
                    mrCtx.strokeRect(c * pw + 6, r * ph + 6, pw - 12, ph - 12);
                }
            }

            // Glowing magma fissures & molten veins cutting through pavers
            mrCtx.strokeStyle = '#ea580c';
            mrCtx.lineWidth = 4;
            mrCtx.shadowColor = '#f97316';
            mrCtx.shadowBlur = 10;
            const fissures = [
                [[40, 10], [120, 90], [210, 160], [330, 180], [480, 240]],
                [[20, 320], [110, 360], [220, 340], [310, 420], [420, 490]],
                [[260, 20], [270, 140], [250, 270], [280, 390], [260, 500]]
            ];
            fissures.forEach(pts => {
                mrCtx.beginPath();
                mrCtx.moveTo(pts[0][0], pts[0][1]);
                for (let i = 1; i < pts.length; i++) {
                    mrCtx.lineTo(pts[i][0], pts[i][1]);
                }
                mrCtx.stroke();
            });

            // Bright molten core of fissures (Yellow-hot center)
            mrCtx.strokeStyle = '#fef08a';
            mrCtx.lineWidth = 1.8;
            mrCtx.shadowBlur = 4;
            fissures.forEach(pts => {
                mrCtx.beginPath();
                mrCtx.moveTo(pts[0][0], pts[0][1]);
                for (let i = 1; i < pts.length; i++) {
                    mrCtx.lineTo(pts[i][0], pts[i][1]);
                }
                mrCtx.stroke();
            });
            mrCtx.shadowBlur = 0;

            // Obsidian border trims on track edges
            mrCtx.fillStyle = '#b91c1c';
            mrCtx.fillRect(0, 0, 16, 512);
            mrCtx.fillRect(496, 0, 16, 512);
            mrCtx.fillStyle = '#f59e0b';
            mrCtx.fillRect(16, 0, 4, 512);
            mrCtx.fillRect(492, 0, 4, 512);
        }

        this.moltenTrackTexture = new THREE.CanvasTexture(mrCanvas);
        this.moltenTrackTexture.wrapS = THREE.RepeatWrapping;
        this.moltenTrackTexture.wrapT = THREE.RepeatWrapping;

        // 2. Volcanic Cliff / Side Material (Jagged Black Basalt with Magma Strata)
        const msCanvas = document.createElement('canvas');
        msCanvas.width = 256;
        msCanvas.height = 256;
        const msCtx = msCanvas.getContext('2d');
        if (msCtx) {
            msCtx.fillStyle = '#120a0d';
            msCtx.fillRect(0, 0, 256, 256);

            for (let y = 16; y < 256; y += 36) {
                msCtx.fillStyle = '#1c1015';
                msCtx.fillRect(0, y, 256, 22);

                msCtx.strokeStyle = '#dc2626';
                msCtx.lineWidth = 2.5;
                msCtx.shadowColor = '#ea580c';
                msCtx.shadowBlur = 6;
                msCtx.beginPath();
                msCtx.moveTo(0, y + 10);
                for (let x = 0; x <= 256; x += 32) {
                    msCtx.lineTo(x, y + 10 + (Math.sin(x * 0.1) * 6));
                }
                msCtx.stroke();
            }
            msCtx.shadowBlur = 0;
        }

        this.moltenSideTexture = new THREE.CanvasTexture(msCanvas);
        this.moltenSideTexture.wrapS = THREE.RepeatWrapping;
        this.moltenSideTexture.wrapT = THREE.RepeatWrapping;

        // 3. Boiling Magma Sea Texture (Floor of the Abyss at y = -35)
        const lavaCanvas = document.createElement('canvas');
        lavaCanvas.width = 256;
        lavaCanvas.height = 256;
        const lavaCtx = lavaCanvas.getContext('2d');
        if (lavaCtx) {
            lavaCtx.fillStyle = '#7f1d1d';
            lavaCtx.fillRect(0, 0, 256, 256);

            for (let i = 0; i < 20; i++) {
                const lx = (i * 37) % 256;
                const ly = (i * 53) % 256;
                const rad = 25 + (i % 5) * 12;
                const grad = lavaCtx.createRadialGradient(lx, ly, 2, lx, ly, rad);
                grad.addColorStop(0, '#fef08a');
                grad.addColorStop(0.35, '#f97316');
                grad.addColorStop(0.7, '#dc2626');
                grad.addColorStop(1, '#450a0a');
                lavaCtx.fillStyle = grad;
                lavaCtx.beginPath();
                lavaCtx.arc(lx, ly, rad, 0, Math.PI * 2);
                lavaCtx.fill();
            }
        }
        this.lavaSeaTexture = new THREE.CanvasTexture(lavaCanvas);
        this.lavaSeaTexture.wrapS = THREE.RepeatWrapping;
        this.lavaSeaTexture.wrapT = THREE.RepeatWrapping;
        this.lavaSeaTexture.repeat.set(30, 30);

        this.moltenTrackMat = new THREE.MeshStandardMaterial({
            map: this.moltenTrackTexture,
            roughness: 0.55,
            metalness: 0.15
        });
        this.moltenSideMat = new THREE.MeshStandardMaterial({
            map: this.moltenSideTexture,
            roughness: 0.75,
            metalness: 0.1
        });
        this.lavaSeaMat = new THREE.MeshBasicMaterial({
            map: this.lavaSeaTexture,
            transparent: true,
            opacity: 0.95
        });

        // Volcanic rock architecture
        this.obsidianPillarMat = new THREE.MeshStandardMaterial({
            color: 0x181014,
            roughness: 0.4,
            metalness: 0.35
        });
        this.magmaGlowMat = new THREE.MeshBasicMaterial({
            color: 0xff4400,
            transparent: true,
            opacity: 0.85
        });
        this.fireEmbersMat = new THREE.MeshBasicMaterial({
            color: 0xffaa22,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });

        // ==========================================
        // 5. CELESTIAL CLOUD SANCTUARY (เขาไกรลาส - STAGE 5)
        // ==========================================
        // 1. Celestial White-Gold Marble Track (512x512)
        const csCanvas = document.createElement('canvas');
        csCanvas.width = 512;
        csCanvas.height = 512;
        const csCtx = csCanvas.getContext('2d');
        if (csCtx) {
            // Pure pearlescent marble base
            csCtx.fillStyle = '#f8fafc';
            csCtx.fillRect(0, 0, 512, 512);

            // Subtle marble tile divisions
            const cols = 4, rows = 4;
            const tw = 512 / cols, th = 512 / rows;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    csCtx.fillStyle = ((r + c) % 2 === 0) ? '#ffffff' : '#f1f5f9';
                    csCtx.fillRect(c * tw + 4, r * th + 4, tw - 8, th - 8);
                    csCtx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
                    csCtx.lineWidth = 2;
                    csCtx.strokeRect(c * tw + 4, r * th + 4, tw - 8, th - 8);

                    // Central diamond lotus gem inlay
                    csCtx.fillStyle = '#06b6d4';
                    csCtx.beginPath();
                    const cx = c * tw + tw * 0.5;
                    const cy = r * th + th * 0.5;
                    csCtx.moveTo(cx, cy - 8);
                    csCtx.lineTo(cx + 8, cy);
                    csCtx.lineTo(cx, cy + 8);
                    csCtx.lineTo(cx - 8, cy);
                    csCtx.closePath();
                    csCtx.fill();

                    csCtx.fillStyle = '#38bdf8';
                    csCtx.beginPath();
                    csCtx.arc(cx, cy, 3, 0, Math.PI * 2);
                    csCtx.fill();
                }
            }

            // Divine Golden Kranok Borders along edges
            csCtx.fillStyle = '#d97706';
            csCtx.fillRect(0, 0, 24, 512);
            csCtx.fillRect(488, 0, 24, 512);
            csCtx.fillStyle = '#fbbf24';
            for (let y = 0; y < 512; y += 32) {
                csCtx.beginPath();
                csCtx.moveTo(2, y);
                csCtx.lineTo(22, y + 16);
                csCtx.lineTo(2, y + 32);
                csCtx.fill();

                csCtx.beginPath();
                csCtx.moveTo(510, y);
                csCtx.lineTo(490, y + 16);
                csCtx.lineTo(510, y + 32);
                csCtx.fill();
            }

            // Inner cyan celestial energy piping
            csCtx.fillStyle = '#00f0ff';
            csCtx.fillRect(24, 0, 3, 512);
            csCtx.fillRect(485, 0, 3, 512);
        }
        this.celestialTrackTexture = new THREE.CanvasTexture(csCanvas);
        this.celestialTrackTexture.wrapS = THREE.RepeatWrapping;
        this.celestialTrackTexture.wrapT = THREE.RepeatWrapping;

        // 2. Celestial Retaining Wall Side Texture (256x256)
        const cSideCanvas = document.createElement('canvas');
        cSideCanvas.width = 256;
        cSideCanvas.height = 256;
        const cSideCtx = cSideCanvas.getContext('2d');
        if (cSideCtx) {
            cSideCtx.fillStyle = '#e2e8f0';
            cSideCtx.fillRect(0, 0, 256, 256);

            // Carved blocks
            cSideCtx.strokeStyle = 'rgba(203, 213, 225, 0.8)';
            cSideCtx.lineWidth = 2.5;
            for (let y = 0; y < 256; y += 64) {
                cSideCtx.beginPath();
                cSideCtx.moveTo(0, y);
                cSideCtx.lineTo(256, y);
                cSideCtx.stroke();
                const offset = (y / 64) % 2 === 0 ? 0 : 64;
                for (let x = offset; x < 256; x += 128) {
                    cSideCtx.beginPath();
                    cSideCtx.moveTo(x, y);
                    cSideCtx.lineTo(x, y + 64);
                    cSideCtx.stroke();
                }
            }

            // Golden lotus relief carvings
            cSideCtx.fillStyle = '#fbbf24';
            for (let y = 16; y < 256; y += 64) {
                for (let x = 32; x < 256; x += 64) {
                    cSideCtx.beginPath();
                    cSideCtx.arc(x, y, 6, 0, Math.PI * 2);
                    cSideCtx.fill();
                }
            }
        }
        this.celestialSideTexture = new THREE.CanvasTexture(cSideCanvas);
        this.celestialSideTexture.wrapS = THREE.RepeatWrapping;
        this.celestialSideTexture.wrapT = THREE.RepeatWrapping;

        // 3. Sea of Clouds Bottomless Abyss Texture (256x256)
        const cloudCanvas = document.createElement('canvas');
        cloudCanvas.width = 256;
        cloudCanvas.height = 256;
        const cloudCtx = cloudCanvas.getContext('2d');
        if (cloudCtx) {
            cloudCtx.fillStyle = '#e0f2fe';
            cloudCtx.fillRect(0, 0, 256, 256);
            for (let i = 0; i < 24; i++) {
                const cx = (i * 47) % 256;
                const cy = (i * 61) % 256;
                const rad = 28 + (i % 5) * 14;
                const grad = cloudCtx.createRadialGradient(cx, cy, 4, cx, cy, rad);
                grad.addColorStop(0, '#ffffff');
                grad.addColorStop(0.5, '#bae6fd');
                grad.addColorStop(1, 'rgba(186, 230, 253, 0)');
                cloudCtx.fillStyle = grad;
                cloudCtx.beginPath();
                cloudCtx.arc(cx, cy, rad, 0, Math.PI * 2);
                cloudCtx.fill();
            }
        }
        this.cloudSeaTexture = new THREE.CanvasTexture(cloudCanvas);
        this.cloudSeaTexture.wrapS = THREE.RepeatWrapping;
        this.cloudSeaTexture.wrapT = THREE.RepeatWrapping;
        this.cloudSeaTexture.repeat.set(24, 24);

        this.celestialTrackMat = new THREE.MeshStandardMaterial({
            map: this.celestialTrackTexture,
            roughness: 0.25,
            metalness: 0.15
        });
        this.celestialSideMat = new THREE.MeshStandardMaterial({
            map: this.celestialSideTexture,
            roughness: 0.45,
            metalness: 0.1
        });
        this.cloudSeaMat = new THREE.MeshBasicMaterial({
            map: this.cloudSeaTexture,
            color: 0xffffff,
            transparent: true,
            opacity: 0.88
        });

        // Sacred architecture materials
        this.celestialMarbleMat = new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            roughness: 0.2,
            metalness: 0.12
        });
        this.celestialGoldTrimMat = new THREE.MeshStandardMaterial({
            color: 0xfbbf24,
            roughness: 0.18,
            metalness: 0.88,
            emissive: 0x553500
        });
        this.celestialCrystalMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.88
        });
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
            // Kishkindha: Kingdom of the Monkeys (นครขีดขิน & พระราชวังศิลาทอง)
            // Royal Twilight & Golden Hour Sunset Atmosphere
            this.scene.background = new THREE.Color(0x1a0f2e);   // Deep royal twilight indigo-violet
            this.scene.fog = new THREE.FogExp2(0x2d1838, 0.0016); // Warm golden twilight mist

            this.hemiLight.color.setHex(0xfbbf24);        // Warm golden sky light
            this.hemiLight.groundColor.setHex(0x3b1448);   // Deep royal purple & sandstone ground bounce
            this.dirLight.color.setHex(0xffe082);          // Radiant golden sunset light
            this.dirLight.intensity = 1.45;

            // Spawn Majestic Sunset Twilight Clouds with Golden Edges
            for (let i = 0; i < 45; i++) {
                const cloudColor = (i % 2 === 0) ? 0x6b306b : 0x8a457a;
                const cloud = this.createCloud(cloudColor);
                cloud.position.set(
                    (Math.random() - 0.5) * 650,
                    45 + Math.random() * 50,
                    -Math.random() * 4900 + 60
                );
                this.scene.add(cloud);
                this.stageMeshes.push(cloud);
                this.clouds.push(cloud);
            }

            this.buildChemicalPlantCourse();
            this.buildChemicalPlantScenery();
        } else if (stageId === 'hydrocity') {
            // Lanka Ocean & Suvannamaccha's Deep Atmosphere (มหาสมุทรลงกา & วังบาดาล)
            this.scene.background = new THREE.Color(0x02182e);   // Deep sapphire-abyssal sea depth
            this.scene.fog = new THREE.FogExp2(0x042c44, 0.0016); // Radiant turquoise deep sea mist

            this.hemiLight.color.setHex(0x38bdf8);      // Shimmering turquoise water sky reflection
            this.hemiLight.groundColor.setHex(0x031926); // Abyssal sea trench floor bounce
            this.dirLight.color.setHex(0x7dd3fc);        // Piercing celestial sun rays filtering through ocean waves
            this.dirLight.intensity = 1.45;

            // 1. Continuous Lanka Ocean Shimmering Surface (ครอบคลุมตลอดเส้นทาง 5,000 เมตร)
            const oceanGeo = new THREE.PlaneGeometry(1600, 5600);
            const oceanMesh = new THREE.Mesh(oceanGeo, this.hydroWaterMat);
            oceanMesh.rotation.x = -Math.PI / 2;
            oceanMesh.position.set(0, 0.0, -2500);
            oceanMesh.receiveShadow = true;
            this.scene.add(oceanMesh);
            this.stageMeshes.push(oceanMesh);

            // 2. Continuous Sunken Lanka Seabed Floor (พื้นทรายใต้สมุทรลงกา)
            const seabedGeo = new THREE.PlaneGeometry(1600, 5600);
            const seabedMat = new THREE.MeshLambertMaterial({ color: 0x011b2b, roughness: 0.95 });
            const seabedMesh = new THREE.Mesh(seabedGeo, seabedMat);
            seabedMesh.rotation.x = -Math.PI / 2;
            seabedMesh.position.set(0, -14.0, -2500);
            this.scene.add(seabedMesh);
            this.stageMeshes.push(seabedMesh);

            // Spawn Floating Luminescent Oxygen Bubbles & Golden Mermaid Sparkles
            for (let i = 0; i < 60; i++) {
                const bubble = this.createWaterBubble();
                bubble.position.set(
                    (Math.random() - 0.5) * 480,
                    4 + Math.random() * 32,
                    -Math.random() * 5000 + 40
                );
                this.scene.add(bubble);
                this.stageMeshes.push(bubble);
                this.clouds.push(bubble);
            }

            this.buildHydrocityCourse();
            this.buildHydrocityScenery();
        } else if (stageId === 'molten_ravine') {
            // Lanka Molten Ravine Atmosphere (Stage 4 - หุบเหวศิลาเพลิงลงกา)
            this.scene.background = new THREE.Color(0x140406);   // Dark volcanic charcoal-crimson sky
            this.scene.fog = new THREE.FogExp2(0x2e0a0d, 0.0017); // Ominous crimson sulfur ash haze

            this.hemiLight.color.setHex(0xff7733);        // Fiery volcanic ash sky glow
            this.hemiLight.groundColor.setHex(0x450a0a);   // Molten lava abyss floor bounce
            this.dirLight.color.setHex(0xff5511);          // Blazing magma glare
            this.dirLight.intensity = 1.5;

            // 1. Bottomless Boiling Magma Sea Floor (ครอบคลุมตลอดเส้นทาง 4,600 เมตร ที่ความลึก y = -35)
            const lavaGeo = new THREE.PlaneGeometry(1600, 5200);
            const lavaMesh = new THREE.Mesh(lavaGeo, this.lavaSeaMat);
            lavaMesh.rotation.x = -Math.PI / 2;
            lavaMesh.position.set(0, -35.0, -2300);
            this.scene.add(lavaMesh);
            this.stageMeshes.push(lavaMesh);

            // 2. Floating Firefly Embers & Volcanic Ash (สะเก็ดเถ้าถ่านไฟลอยละล่อง)
            for (let i = 0; i < 65; i++) {
                const ember = this.createVolcanicEmber();
                ember.position.set(
                    (Math.random() - 0.5) * 500,
                    -15 + Math.random() * 45,
                    -Math.random() * 4700 + 40
                );
                this.scene.add(ember);
                this.stageMeshes.push(ember);
                this.clouds.push(ember);
            }

            this.buildMoltenRavineCourse();
            this.buildMoltenRavineScenery();
        } else if (stageId === 'celestial_sanctuary') {
            // Celestial Cloud Sanctuary Atmosphere (Stage 5 - วิมานลอยฟ้าบนสรวงสวรรค์ / เขาไกรลาส)
            this.scene.background = new THREE.Color(0x181a3a);   // Celestial twilight with aurora aura
            this.scene.fog = new THREE.FogExp2(0x272b5c, 0.0014); // Ethereal lavender-gold heavenly mist

            this.hemiLight.color.setHex(0xfffae0);        // Pure warm celestial morning sun
            this.hemiLight.groundColor.setHex(0x3b2d6a);   // Soft lavender/cyan cloud bounce
            this.dirLight.color.setHex(0xfff2b2);          // Radiant divine rays
            this.dirLight.intensity = 1.6;

            // 1. Endless Rolling Sea of Clouds Floor (ครอบคลุมตลอดเส้นทาง 5,500 เมตร ที่ความลึก y = -35.0)
            const cloudSeaGeo = new THREE.PlaneGeometry(1800, 5800);
            const cloudSeaMesh = new THREE.Mesh(cloudSeaGeo, this.cloudSeaMat);
            cloudSeaMesh.rotation.x = -Math.PI / 2;
            cloudSeaMesh.position.set(0, -35.0, -2600);
            this.scene.add(cloudSeaMesh);
            this.stageMeshes.push(cloudSeaMesh);

            // 2. Floating Golden Lotus Sparkles & Ethereal Stardust Particles
            for (let i = 0; i < 70; i++) {
                const spark = this.createCelestialSparkle();
                spark.position.set(
                    (Math.random() - 0.5) * 520,
                    -10 + Math.random() * 50,
                    -Math.random() * 5400 + 40
                );
                this.scene.add(spark);
                this.stageMeshes.push(spark);
                this.clouds.push(spark);
            }

            // 3. Floating Sacred Celestial Cumulus Clouds at varying altitudes
            for (let i = 0; i < 48; i++) {
                const cloudTint = (i % 2 === 0) ? 0xffffff : 0xfef08a;
                const cloud = this.createCloud(cloudTint);
                cloud.position.set(
                    (Math.random() - 0.5) * 600,
                    35 + Math.random() * 60,
                    -Math.random() * 5300 + 60
                );
                this.scene.add(cloud);
                this.stageMeshes.push(cloud);
                this.clouds.push(cloud);
            }

            this.buildCelestialSanctuaryCourse();
            this.buildCelestialSanctuaryScenery();
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

    createVolcanicEmber() {
        const group = new THREE.Group();
        const rad = 0.35 + Math.random() * 0.55;
        const emberGeo = new THREE.DodecahedronGeometry(rad, 0);
        const ember = new THREE.Mesh(emberGeo, this.fireEmbersMat);
        group.add(ember);
        return group;
    }

    createCelestialSparkle() {
        const group = new THREE.Group();
        const rad = 0.45 + Math.random() * 0.55;
        const sparkGeo = new THREE.OctahedronGeometry(rad, 0);
        const spark = new THREE.Mesh(sparkGeo, (Math.random() > 0.5) ? this.celestialGoldTrimMat : this.celestialCrystalMat);
        group.add(spark);
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

    getMoltenTrackMaterial(repeatX = 1, repeatZ = 1) {
        const tex = this.moltenTrackTexture.clone();
        tex.needsUpdate = true;
        tex.repeat.set(repeatX, repeatZ);
        return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, metalness: 0.15 });
    }

    getMoltenSideMaterial(repeatX = 1, repeatZ = 1) {
        const tex = this.moltenSideTexture.clone();
        tex.needsUpdate = true;
        tex.repeat.set(repeatX, repeatZ);
        return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.75, metalness: 0.1 });
    }

    getCelestialTrackMaterial(repeatX = 1, repeatZ = 1) {
        const tex = this.celestialTrackTexture.clone();
        tex.needsUpdate = true;
        tex.repeat.set(repeatX, repeatZ);
        return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.25, metalness: 0.15 });
    }

    getCelestialSideMaterial(repeatX = 1, repeatZ = 1) {
        const tex = this.celestialSideTexture.clone();
        tex.needsUpdate = true;
        tex.repeat.set(repeatX, repeatZ);
        return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.45, metalness: 0.1 });
    }

    addRoadSegment(x, y, z, width, length, rollAngle = 0, customTopMat = null, customSideMat = null) {
        const isHydro = (this.currentStageId === 'hydrocity');
        const isMolten = (this.currentStageId === 'molten_ravine');
        const isCelestial = (this.currentStageId === 'celestial_sanctuary');
        const boxH = isHydro ? 24 : ((isMolten || isCelestial) ? 20 : 10);
        const boxGeo = new THREE.BoxGeometry(width, boxH, length);
        let topMat, sideMat, frontBackMat;

        if (this.currentStageId === 'chemical_plant') {
            topMat = customTopMat || this.getChemTrackMaterial(width / 6, length / 6);
            sideMat = customSideMat || this.getChemSideMaterial(length / 6, 2);
            frontBackMat = sideMat;
        } else if (this.currentStageId === 'hydrocity') {
            topMat = customTopMat || this.getHydroTrackMaterial(width / 6, length / 6);
            sideMat = customSideMat || this.getHydroSideMaterial(length / 6, 4);
            frontBackMat = sideMat;
        } else if (this.currentStageId === 'molten_ravine') {
            topMat = customTopMat || this.getMoltenTrackMaterial(width / 6, length / 6);
            sideMat = customSideMat || this.getMoltenSideMaterial(length / 6, 4);
            frontBackMat = sideMat;
        } else if (this.currentStageId === 'celestial_sanctuary') {
            topMat = customTopMat || this.getCelestialTrackMaterial(width / 6, length / 6);
            sideMat = customSideMat || this.getCelestialSideMaterial(length / 6, 4);
            frontBackMat = sideMat;
        } else {
            topMat = customTopMat || this.getGrassTopMaterial(width / 4, length / 4);
            sideMat = customSideMat || this.getGroundMaterial(length / 4, 2);
            frontBackMat = customSideMat || this.getGroundMaterial(width / 4, 2);
        }

        const materials = [sideMat, sideMat, topMat, sideMat, frontBackMat, frontBackMat];
        const mesh = new THREE.Mesh(boxGeo, materials);
        mesh.position.set(x, y - boxH * 0.5, z);
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
        const isHydro = (this.currentStageId === 'hydrocity');
        const isMolten = (this.currentStageId === 'molten_ravine');
        const isCelestial = (this.currentStageId === 'celestial_sanctuary');
        const boxH = isHydro ? 24 : ((isMolten || isCelestial) ? 20 : 8);
        const boxGeo = new THREE.BoxGeometry(width, boxH, length);
        let topMat, sideMat;

        if (this.currentStageId === 'chemical_plant') {
            topMat = customTopMat || this.getChemTrackMaterial(width / 6, length / 6);
            sideMat = customSideMat || this.getChemSideMaterial(length / 6, 2);
        } else if (this.currentStageId === 'hydrocity') {
            topMat = customTopMat || this.getHydroTrackMaterial(width / 6, length / 6);
            sideMat = customSideMat || this.getHydroSideMaterial(length / 6, 4);
        } else if (this.currentStageId === 'molten_ravine') {
            topMat = customTopMat || this.getMoltenTrackMaterial(width / 6, length / 6);
            sideMat = customSideMat || this.getMoltenSideMaterial(length / 6, 4);
        } else if (this.currentStageId === 'celestial_sanctuary') {
            topMat = customTopMat || this.getCelestialTrackMaterial(width / 6, length / 6);
            sideMat = customSideMat || this.getCelestialSideMaterial(length / 6, 4);
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

        mesh.position.set(x, midY - boxH * 0.5, midZ);
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

    addViaductPillars(startX, startY, startZ, length, width, spacing = 32) {
        const numPillars = Math.floor(length / spacing);
        const halfW = width * 0.42;
        for (let i = 0; i <= numPillars; i++) {
            const pz = startZ - i * spacing;
            [-halfW, halfW].forEach(px => {
                const pillarH = startY + 14.0; // from startY down to seabed at y = -14
                const pillarGeo = new THREE.CylinderGeometry(2.0, 2.6, pillarH, 12);
                const pillarMesh = new THREE.Mesh(pillarGeo, this.hydroPillarMat);
                pillarMesh.position.set(startX + px, startY - pillarH * 0.5, pz);
                pillarMesh.castShadow = true;
                this.scene.add(pillarMesh);
                this.stageMeshes.push(pillarMesh);

                // Ornate Lotus Capitol under deck
                const capGeo = new THREE.BoxGeometry(4.8, 1.8, 4.8);
                const capMesh = new THREE.Mesh(capGeo, this.nagaGoldMat);
                capMesh.position.set(startX + px, startY - 0.9, pz);
                this.scene.add(capMesh);
                this.stageMeshes.push(capMesh);
            });
        }
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
        const isMolten = (this.currentStageId === 'molten_ravine');
        const isCelestial = (this.currentStageId === 'celestial_sanctuary');
        const trackWidth = 18;
        const geo = this.buildLoopTrackBand(radius, trackWidth);

        // Track running surface
        const topMat = isChem ? this.getChemTrackMaterial(4, 16) : (isHydro ? this.getHydroTrackMaterial(4, 16) : (isMolten ? this.getMoltenTrackMaterial(4, 16) : (isCelestial ? this.getCelestialTrackMaterial(4, 16) : this.getGrassTopMaterial(4, 16))));
        topMat.side = THREE.DoubleSide;
        const trackMesh = new THREE.Mesh(geo, topMat);
        trackMesh.castShadow = true;
        trackMesh.receiveShadow = true;
        loopGroup.add(trackMesh);

        // Under-ribbon casing
        const underMat = isChem ? this.getChemSideMaterial(4, 16) : (isHydro ? this.getHydroSideMaterial(4, 16) : (isMolten ? this.getMoltenSideMaterial(4, 16) : (isCelestial ? this.getCelestialSideMaterial(4, 16) : this.getGroundMaterial(4, 16))));
        underMat.side = THREE.DoubleSide;
        const underGeo = this.buildLoopTrackBand(radius + 0.45, trackWidth + 0.8);
        const underMesh = new THREE.Mesh(underGeo, underMat);
        loopGroup.add(underMesh);

        // Side Guardrail Trusses
        [-trackWidth/2 - 0.4, trackWidth/2 + 0.4].forEach(edgeX => {
            const rimGeo = new THREE.TorusGeometry(radius, 0.45, 8, 48);
            const rimMat = isChem ? this.neonYellowMat : (isHydro ? this.hydroGoldTrimMat : (isMolten ? this.magmaGlowMat : (isCelestial ? this.celestialGoldTrimMat : (this.pillarGoldTrimMat || new THREE.MeshLambertMaterial({ color: 0xf59e0b })))));
            const rim = new THREE.Mesh(rimGeo, rimMat);
            rim.position.set(edgeX, radius, 0);
            rim.rotation.y = Math.PI / 2;
            loopGroup.add(rim);
        });

        // Glowing Chevron Entry Runway Lights on the floor
        const arrowGeo = new THREE.ConeGeometry(0.9, 1.8, 3);
        const arrowMat = isChem ? (this.sacredFireGlowMat || this.vanaraGoldMat) : (isHydro ? this.hydroWaterMat : (isMolten ? this.magmaGlowMat : (isCelestial ? this.celestialCrystalMat : (this.himavantaFruitMat || this.neonYellowMat))));
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
    // KISHKINDHA KINGDOM (STAGE 2) SPECIALTY GIMMICKS & ARCHITECTURE
    // ============================================================
    addGlassTube(startX, startY, startZ, length, radius = 14.0) {
        const group = new THREE.Group();

        // 1. Transparent Sacred Crystal Royal Canopy (สะพานแก้วทิพย์มังคลาภิเษก)
        const tubeGeo = new THREE.CylinderGeometry(radius, radius, length, 32, 1, true);
        const tubeMesh = new THREE.Mesh(tubeGeo, this.glassTubeMat);
        tubeMesh.rotation.x = Math.PI * 0.5;
        const centerY = startY + 7.5;
        tubeMesh.position.set(startX, centerY, startZ - length * 0.5);
        group.add(tubeMesh);

        // 2. Sacred Golden Vanara Kranok Torus Ribs every 24 units
        const numRings = Math.floor(length / 24);
        for (let i = 0; i <= numRings; i++) {
            const ringGeo = new THREE.TorusGeometry(radius + 0.35, 0.45, 8, 32);
            const ringMesh = new THREE.Mesh(ringGeo, this.vanaraGoldMat);
            ringMesh.position.set(startX, centerY, startZ - i * 24);
            group.add(ringMesh);

            // Glowing sacred ruby / emerald jewel nodes on the arch
            const nodeGeo = new THREE.SphereGeometry(0.7, 8, 8);
            const nodeMat = (i % 2 === 0) ? this.royalCrimsonMat : this.royalEmeraldMat;
            const topNode = new THREE.Mesh(nodeGeo, nodeMat);
            topNode.position.set(startX, centerY + radius + 0.35, startZ - i * 24);
            group.add(topNode);
        }

        this.scene.add(group);
        this.stageMeshes.push(group);
        return group;
    }

    addChemicalBasin(x, z, width, length) {
        const group = new THREE.Group();

        // 1. Shimmering Sacred Anodat Lotus Moat & Royal Pool (สระอโนดาตและคูเมืองขีดขิน)
        const liquidGeo = new THREE.PlaneGeometry(width, length);
        const liquidMesh = new THREE.Mesh(liquidGeo, this.megaMackMat);
        liquidMesh.rotation.x = -Math.PI / 2;
        liquidMesh.position.set(x, -2.5, z);
        group.add(liquidMesh);

        // 2. Carved White Marble & Gold Border Terrace
        const borderGeo = new THREE.BoxGeometry(width + 4, 1.4, length + 4);
        const borderMesh = new THREE.Mesh(borderGeo, this.chemSideMat);
        borderMesh.position.set(x, -3.2, z);
        group.add(borderMesh);

        // 3. Floating 3D Sacred Lotus Blossoms on water
        const numLotus = Math.min(18, Math.floor((width * length) / 4000));
        for (let l = 0; l < numLotus; l++) {
            const lx = x + (Math.random() - 0.5) * (width * 0.85);
            const lz = z + (Math.random() - 0.5) * (length * 0.85);
            const lotusPad = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.4, 0.1, 10), this.royalEmeraldMat);
            lotusPad.position.set(lx, -2.4, lz);
            group.add(lotusPad);

            const flower = new THREE.Mesh(new THREE.ConeGeometry(1.2, 1.6, 6), this.vanaraGoldMat);
            flower.position.set(lx, -1.6, lz);
            group.add(flower);
        }

        this.scene.add(group);
        this.stageMeshes.push(group);
        return group;
    }

    createVanaraGuardPillar(height = 10, radius = 1.0) {
        const group = new THREE.Group();

        // Base Plinth
        const baseGeo = new THREE.BoxGeometry(radius * 2.5, 1.2, radius * 2.5);
        const base = new THREE.Mesh(baseGeo, this.royalMarbleWhiteMat);
        base.position.y = 0.6;
        base.castShadow = true;
        group.add(base);

        const goldBaseRing = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.3, 0.18, 6, 16), this.vanaraGoldMat);
        goldBaseRing.rotation.x = Math.PI / 2;
        goldBaseRing.position.y = 1.2;
        group.add(goldBaseRing);

        // Fluted White Marble Pillar Shaft
        const shaftGeo = new THREE.CylinderGeometry(radius * 0.85, radius * 1.05, height, 10);
        const shaft = new THREE.Mesh(shaftGeo, this.royalMarbleWhiteMat);
        shaft.position.y = height * 0.5 + 1.2;
        shaft.castShadow = true;
        group.add(shaft);

        // Golden Vanara Warrior Head Capital
        const capY = height + 1.2;
        const capGeo = new THREE.CylinderGeometry(radius * 1.6, radius * 1.15, 1.2, 8);
        const cap = new THREE.Mesh(capGeo, this.vanaraGoldMat);
        cap.position.y = capY + 0.6;
        group.add(cap);

        // 4 Golden Vanara Face Masks on cardinal directions
        for (let a = 0; a < 4; a++) {
            const angle = (a / 4) * Math.PI * 2;
            const maskGeo = new THREE.ConeGeometry(radius * 0.45, radius * 0.9, 4);
            const mask = new THREE.Mesh(maskGeo, this.vanaraGoldMat);
            mask.position.set(Math.cos(angle) * radius * 1.3, capY + 0.6, Math.sin(angle) * radius * 1.3);
            mask.rotation.y = -angle;
            group.add(mask);
        }

        // Golden Spire Crown
        const spireGeo = new THREE.ConeGeometry(radius * 0.5, radius * 1.5, 6);
        const spire = new THREE.Mesh(spireGeo, this.vanaraGoldMat);
        spire.position.y = capY + 1.8;
        group.add(spire);

        // Sacred Fire Brazier on Top
        const bowlGeo = new THREE.CylinderGeometry(radius * 1.4, radius * 0.7, 0.8, 8);
        const bowl = new THREE.Mesh(bowlGeo, this.vanaraGoldMat);
        bowl.position.y = capY + 1.4;
        group.add(bowl);

        const flameGeo = new THREE.ConeGeometry(radius * 0.75, 1.8, 6);
        const flame = new THREE.Mesh(flameGeo, this.sacredFireMat);
        flame.position.y = capY + 2.5;
        group.add(flame);

        const flameCore = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.4, 6, 6), this.sacredFireGlowMat);
        flameCore.position.y = capY + 2.1;
        group.add(flameCore);

        return group;
    }

    createVanaraMonument(height = 65, radius = 20) {
        const group = new THREE.Group();

        // 1. Octagonal Ancient Sandstone Fortress Bastion
        const bodyGeo = new THREE.CylinderGeometry(radius * 0.88, radius * 1.05, height * 0.6, 8);
        const body = new THREE.Mesh(bodyGeo, this.chemSideMat);
        body.position.y = height * 0.3;
        body.castShadow = true;
        group.add(body);

        // 2. 4 Golden Vanara Masks at mid-height
        for (let a = 0; a < 4; a++) {
            const angle = (a / 4) * Math.PI * 2;
            const mask = new THREE.Mesh(new THREE.ConeGeometry(radius * 0.28, radius * 0.65, 4), this.vanaraGoldMat);
            mask.position.set(Math.cos(angle) * (radius * 0.95), height * 0.35, Math.sin(angle) * (radius * 0.95));
            mask.rotation.y = -angle;
            group.add(mask);
        }

        // 3. Golden Balcony Gallery
        const balconyGeo = new THREE.CylinderGeometry(radius * 1.15, radius * 1.05, 2.8, 8);
        const balcony = new THREE.Mesh(balconyGeo, this.vanaraGoldMat);
        balcony.position.y = height * 0.6;
        group.add(balcony);

        // 4 Burning Corner Braziers on the Balcony
        for (let a = 0; a < 4; a++) {
            const angle = (a / 4) * Math.PI * 2 + Math.PI / 4;
            const bz = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.2, 5), this.sacredFireMat);
            bz.position.set(Math.cos(angle) * (radius * 1.05), height * 0.6 + 2.5, Math.sin(angle) * (radius * 1.05));
            group.add(bz);
        }

        // 4. White Marble Upper Shrine Chamber
        const shrineGeo = new THREE.CylinderGeometry(radius * 0.65, radius * 0.85, height * 0.22, 8);
        const shrine = new THREE.Mesh(shrineGeo, this.royalMarbleWhiteMat);
        shrine.position.y = height * 0.72;
        group.add(shrine);

        // 5. Majestic Golden Lotus Stupa Peak (ยอดเจดีย์ทรงบัวตูมทองคำ)
        const stupaGeo = new THREE.ConeGeometry(radius * 0.52, height * 0.32, 8);
        const stupa = new THREE.Mesh(stupaGeo, this.vanaraGoldMat);
        stupa.position.y = height * 0.96;
        group.add(stupa);

        // Glowing Beacon Jewel on apex
        const beacon = new THREE.Mesh(new THREE.SphereGeometry(1.8, 8, 8), this.sacredFireGlowMat);
        beacon.position.y = height + height * 0.12;
        group.add(beacon);

        return group;
    }

    createChemicalSilo(height = 65, radius = 22) {
        return this.createVanaraMonument(height, radius);
    }

    createKishkindhaPalace(w = 42, h = 115, d = 42) {
        const group = new THREE.Group();

        // Tier 1: Polished White Marble Base Pavilion
        const t1H = h * 0.32;
        const tier1Geo = new THREE.BoxGeometry(w, t1H, d);
        const tier1 = new THREE.Mesh(tier1Geo, this.royalMarbleWhiteMat);
        tier1.position.y = t1H * 0.5;
        tier1.castShadow = true;
        group.add(tier1);

        // Tier 1 Roof Eaves (Royal Crimson with Gold Rim)
        const roof1Geo = new THREE.BoxGeometry(w * 1.18, 3.2, d * 1.18);
        const roof1 = new THREE.Mesh(roof1Geo, this.royalCrimsonMat);
        roof1.position.y = t1H + 1.6;
        group.add(roof1);

        // Tier 1 Chofa Spires (4 Golden Horns on roof corners)
        [-1, 1].forEach(sx => {
            [-1, 1].forEach(sz => {
                const chofa = new THREE.Mesh(new THREE.ConeGeometry(1.2, 5.5, 4), this.vanaraGoldMat);
                chofa.position.set(sx * (w * 0.58), t1H + 4.2, sz * (d * 0.58));
                chofa.rotation.z = -sx * 0.35;
                chofa.rotation.x = sz * 0.35;
                group.add(chofa);
            });
        });

        // Tier 2: Royal Upper Hall
        const t2H = h * 0.26;
        const tier2Geo = new THREE.BoxGeometry(w * 0.72, t2H, d * 0.72);
        const tier2 = new THREE.Mesh(tier2Geo, this.royalMarbleWhiteMat);
        tier2.position.y = t1H + 3.2 + t2H * 0.5;
        tier2.castShadow = true;
        group.add(tier2);

        // Tier 2 Roof Eaves (Royal Emerald & Gold)
        const roof2Y = t1H + 3.2 + t2H;
        const roof2Geo = new THREE.BoxGeometry(w * 0.88, 2.8, d * 0.88);
        const roof2 = new THREE.Mesh(roof2Geo, this.royalEmeraldMat);
        roof2.position.y = roof2Y + 1.4;
        group.add(roof2);

        // Tier 3: Golden Pavilion Top
        const t3H = h * 0.16;
        const tier3Geo = new THREE.BoxGeometry(w * 0.48, t3H, d * 0.48);
        const tier3 = new THREE.Mesh(tier3Geo, this.vanaraGoldMat);
        tier3.position.y = roof2Y + 2.8 + t3H * 0.5;
        group.add(tier3);

        // Soaring Needle Spire (ยอดปราสาทศิลาทอง)
        const spireBaseY = roof2Y + 2.8 + t3H;
        const ringsGeo = new THREE.CylinderGeometry(w * 0.18, w * 0.32, 5, 8);
        const rings = new THREE.Mesh(ringsGeo, this.vanaraGoldMat);
        rings.position.y = spireBaseY + 2.5;
        group.add(rings);

        const needleGeo = new THREE.ConeGeometry(1.8, 32, 8);
        const needle = new THREE.Mesh(needleGeo, this.vanaraGoldMat);
        needle.position.y = spireBaseY + 21;
        needle.castShadow = true;
        group.add(needle);

        // Radiant Celestial Star Beacon at Apex
        const beacon = new THREE.Mesh(new THREE.SphereGeometry(1.8, 8, 8), this.sacredFireGlowMat);
        beacon.position.y = spireBaseY + 38;
        group.add(beacon);

        return group;
    }

    createCyberSkyscraper(w = 42, h = 140, d = 42) {
        return this.createKishkindhaPalace(w, h, d);
    }

    createRoyalGateway(span = 72, height = 32) {
        const group = new THREE.Group();

        // Left & Right Massive Fluted White Marble Columns
        [-span * 0.46, span * 0.46].forEach(colX => {
            const colGeo = new THREE.CylinderGeometry(2.2, 3.0, height, 12);
            const col = new THREE.Mesh(colGeo, this.royalMarbleWhiteMat);
            col.position.set(colX, height * 0.5, 0);
            col.castShadow = true;
            group.add(col);

            // Column Capital with burning sacred fire altar
            const cap = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 2.6, 2.0, 8), this.vanaraGoldMat);
            cap.position.set(colX, height + 1.0, 0);
            group.add(cap);

            const fire = new THREE.Mesh(new THREE.ConeGeometry(1.8, 3.8, 6), this.sacredFireMat);
            fire.position.set(colX, height + 3.8, 0);
            group.add(fire);
        });

        // Gilded Thai Archway Crossbeam
        const beamGeo = new THREE.BoxGeometry(span, 3.8, 5.0);
        const beam = new THREE.Mesh(beamGeo, this.vanaraGoldMat);
        beam.position.set(0, height, 0);
        group.add(beam);

        // Center Thai Pediment Arch (หน้าบันทรงสามเหลี่ยมยอดปรางค์)
        const pedGeo = new THREE.ConeGeometry(9.0, 8.5, 4);
        pedGeo.rotateY(Math.PI / 4);
        const ped = new THREE.Mesh(pedGeo, this.vanaraGoldMat);
        ped.position.set(0, height + 6.2, 0);
        group.add(ped);

        // Central Golden Vanara Relief Crest
        const crest = new THREE.Mesh(new THREE.SphereGeometry(2.4, 8, 8), this.vanaraGoldMat);
        crest.position.set(0, height + 5.0, 2.4);
        group.add(crest);

        // Hanging Crimson & Gold Royal Victory Banners (ธงทิวชัยโบราณขีดขิน)
        [-span * 0.28, span * 0.28].forEach(bx => {
            const bannerGeo = new THREE.BoxGeometry(2.4, 15, 0.2);
            const banner = new THREE.Mesh(bannerGeo, this.royalCrimsonMat);
            banner.position.set(bx, height - 8, 0);
            group.add(banner);

            const fringe = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.4, 0.3), this.vanaraGoldMat);
            fringe.position.set(bx, height - 15.7, 0);
            group.add(fringe);
        });

        return group;
    }

    createOverheadPipeline(span = 70, height = 34) {
        return this.createRoyalGateway(span, height);
    }

    buildChemicalColosseum(x, y, z, radius = 68) {
        const group = new THREE.Group();

        // 1. Royal Grand Throne Colosseum of Kishkindha (มณฑปทองคำท้องพระโรงนครขีดขิน)
        const arenaGeo = new THREE.CylinderGeometry(radius, radius * 1.06, 10, 32);
        const arenaMesh = new THREE.Mesh(arenaGeo, this.royalMarbleWhiteMat);
        arenaMesh.position.set(x, y - 5, z);
        group.add(arenaMesh);

        const goldRim = new THREE.Mesh(new THREE.TorusGeometry(radius + 0.5, 0.8, 8, 32), this.vanaraGoldMat);
        goldRim.rotation.x = Math.PI / 2;
        goldRim.position.set(x, y + 0.2, z);
        group.add(goldRim);

        // 2. 8 Golden Vanara Guardian Statues around Arena Perimeter
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const tx = x + Math.cos(angle) * (radius - 6);
            const tz = z + Math.sin(angle) * (radius - 6);

            // Marble Pedestal
            const pedGeo = new THREE.CylinderGeometry(2.5, 3.2, 12, 8);
            const ped = new THREE.Mesh(pedGeo, this.royalMarbleWhiteMat);
            ped.position.set(tx, y + 6, tz);
            group.add(ped);

            // Golden Warrior Statue
            const statueGeo = new THREE.CylinderGeometry(1.6, 1.8, 14, 8);
            const statue = new THREE.Mesh(statueGeo, this.vanaraGoldMat);
            statue.position.set(tx, y + 19, tz);
            group.add(statue);

            // Golden Head & Crown
            const head = new THREE.Mesh(new THREE.SphereGeometry(1.6, 8, 8), this.vanaraGoldMat);
            head.position.set(tx, y + 27, tz);
            group.add(head);

            const crown = new THREE.Mesh(new THREE.ConeGeometry(1.0, 3.2, 6), this.vanaraGoldMat);
            crown.position.set(tx, y + 29.5, tz);
            group.add(crown);

            // Battle Trident Weapon (ตรีศูลทองคำ)
            const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 22, 8), this.vanaraGoldMat);
            staff.position.set(tx + 1.2, y + 20, tz);
            group.add(staff);

            const prong = new THREE.Mesh(new THREE.ConeGeometry(0.7, 4.0, 4), this.vanaraGoldMat);
            prong.position.set(tx + 1.2, y + 32, tz);
            group.add(prong);

            // Sacred Fire Brazier flanking statue
            const flame = new THREE.Mesh(new THREE.ConeGeometry(1.4, 3.2, 6), this.sacredFireMat);
            flame.position.set(tx - 1.5, y + 13.5, tz);
            group.add(flame);
        }

        // 3. Grand Finish Line Gateway: 7-Tiered Royal Parasol Arch (ซุ้มประตูฉัตรทองคำ)
        const archL = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.5, 26, 8), this.royalMarbleWhiteMat);
        archL.position.set(x - 14, y + 13, z + 20);
        group.add(archL);

        const archR = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.5, 26, 8), this.royalMarbleWhiteMat);
        archR.position.set(x + 14, y + 13, z + 20);
        group.add(archR);

        const beam = new THREE.Mesh(new THREE.BoxGeometry(34, 4.0, 4.0), this.vanaraGoldMat);
        beam.position.set(x, y + 26, z + 20);
        group.add(beam);

        // 7-Tiered Royal Golden Parasols (ฉัตรทองคำ) above finish line
        [-8, 0, 8].forEach(cx => {
            for (let t = 0; t < 5; t++) {
                const tier = new THREE.Mesh(new THREE.ConeGeometry(2.4 - t * 0.4, 0.9, 8), this.vanaraGoldMat);
                tier.position.set(x + cx, y + 29 + t * 1.1, z + 20);
                group.add(tier);
            }
        });

        this.scene.add(group);
        this.stageMeshes.push(group);
        return group;
    }

    // ============================================================
    // STAGE 2: KISHKINDHA KINGDOM COURSE DEFINITION (4,800m)
    // ============================================================
    buildChemicalPlantCourse() {
        // 1. Starting Royal Marble Causeway (z: 40 to -140, y: 0, length: 180, center: -50)
        this.addRoadSegment(0, 0, -50, 36, 180, 0);

        // Flanking Guard Pillars at Start
        [-16, 16].forEach(px => {
            [20, -20, -60, -100].forEach(pz => {
                const pillar = this.createVanaraGuardPillar(10, 1.0);
                pillar.position.set(px, 0, pz);
                this.scene.add(pillar);
                this.stageMeshes.push(pillar);
                this.sceneryObjects.push(pillar);
            });
        });

        // 2. High-Speed Sacred Crystal Canopy Way #1 (z: -140 to -380, y: 0, length: 240, center: -260)
        this.addRoadSegment(0, 0, -260, 24, 240, 0);
        this.addGlassTube(0, 0, -140, 240, 14.0);

        // 3. Sacred Anodat Lotus Moat & Royal Pool #1 below track
        this.addChemicalBasin(0, -600, 220, 480);

        // 4. Grand Ascending Marble Ramp over Anodat Pool (z: -380 to -540, climbing y: 0 -> 24)
        this.addSlopedRoad(0, 0, -380, 30, 160, 24);

        // 5. High Royal Catwalk Skyway (z: -540 to -680, y: 24, length: 140, center: -610)
        this.addRoadSegment(0, 24, -610, 28, 140, 0);

        // Flanking Guard Pillars on Skyway
        [-13, 13].forEach(px => {
            [-560, -610, -660].forEach(pz => {
                const pillar = this.createVanaraGuardPillar(8, 0.9);
                pillar.position.set(px, 24, pz);
                this.scene.add(pillar);
                this.stageMeshes.push(pillar);
                this.sceneryObjects.push(pillar);
            });
        });

        // 6. Steep Thrill Drop (z: -680 to -780, dropping y: 24 -> 4)
        this.addSlopedRoad(0, 24, -680, 28, 100, -20);

        // 7. Twin Vanara Carved Stone Loops (z: -880 and z: -1080, y: 4, spanning -780 to -1230 solid continuous ground)
        this.addRoadSegment(0, 4, -1005, 32, 450, 0);
        this.buildLoopSection(0, 4, -880, 16);
        this.buildLoopSection(0, 4, -1080, 18);

        // 8. Low Royal Causeway over Massive Anodat Lotus Sea (z: -1230 to -1550, y: 5, length: 320, center: -1390)
        this.addChemicalBasin(0, -1400, 260, 400);
        this.addRoadSegment(0, 5, -1390, 24, 320, 0);

        // Flanking Guard Pillars on Low Bridge
        [-11, 11].forEach(px => {
            [-1260, -1320, -1380, -1440, -1500].forEach(pz => {
                const pillar = this.createVanaraGuardPillar(9, 0.95);
                pillar.position.set(px, 5, pz);
                this.scene.add(pillar);
                this.stageMeshes.push(pillar);
                this.sceneryObjects.push(pillar);
            });
        });

        // 9. Spiral Palace Tower Ascent (z: -1550 to -1750, climbing y: 5 -> 28, length: 200)
        this.addSlopedRoad(0, 5, -1550, 28, 200, 23);

        // 10. High-Altitude Sacred Crystal Canopy Way #2 (z: -1750 to -2150, y: 28, length: 400, center: -1950)
        this.addRoadSegment(0, 28, -1950, 24, 400, 0);
        this.addGlassTube(0, 28, -1750, 400, 14.0);

        // 11. Split Catwalks & Elevated Sky Crossing (z: -2150 to -2450, y: 28, length: 300, center: -2300)
        this.addRoadSegment(-12, 28, -2300, 16, 300, 0); // Left route
        this.addRoadSegment(12, 28, -2300, 16, 300, 0);  // Right route
        this.addRoadSegment(0, 28, -2300, 10, 300, 0);   // Center connector

        // 12. Sacred Spillway & Coaster Drop (z: -2450 to -2850, y: 28 -> 8)
        this.addChemicalBasin(0, -2700, 240, 450);
        this.addSlopedRoad(0, 28, -2450, 32, 180, -20);
        this.addRoadSegment(0, 8, -2740, 34, 220, 0);

        // 13. The Grand Kishkindha Superhighway Sprint (z: -2850 to -4000, y: 8, length: 1150 continuous)
        this.addRoadSegment(0, 8, -3000, 42, 300, 0); // -2850 to -3150
        this.addRoadSegment(0, 8, -3300, 42, 300, 0); // -3150 to -3450
        this.addRoadSegment(0, 8, -3600, 42, 300, 0); // -3450 to -3750
        this.addRoadSegment(0, 8, -3875, 42, 250, 0); // -3750 to -4000

        // Flanking Pillars along the Grand Sprint
        [-19, 19].forEach(px => {
            [-2900, -3100, -3300, -3500, -3700, -3900].forEach(pz => {
                const pillar = this.createVanaraGuardPillar(11, 1.1);
                pillar.position.set(px, 8, pz);
                this.scene.add(pillar);
                this.stageMeshes.push(pillar);
                this.sceneryObjects.push(pillar);
            });
        });

        // 14. Rollercoaster Dip & Final Vanara Loop #3 (z: -4000 to -4300, y: 8 -> 4 -> 8)
        this.addSlopedRoad(0, 8, -4000, 34, 80, -4);
        this.addRoadSegment(0, 4, -4160, 36, 160, 0);
        this.buildLoopSection(0, 4, -4160, 18);
        this.addSlopedRoad(0, 4, -4240, 34, 60, 4);

        // 15. Kishkindha Grand Royal Throne Arena (Finish Arena) (z: -4300 to -4900, y: 8)
        this.addRoadSegment(0, 8, -4450, 48, 300, 0);
        this.addRoadSegment(0, 8, -4750, 64, 300, 0);
        this.buildChemicalColosseum(0, 8, -4800, 68);
    }

    buildChemicalPlantScenery() {
        // Distribute Kishkindha Royal Palaces, Vanara Monuments, and Royal Gateways across the 4,800m track
        const totalBackdrop = 80;
        for (let i = 0; i < totalBackdrop; i++) {
            const side = (i % 2 === 0) ? 1 : -1;
            const progress = i / totalBackdrop;
            const z = 80 - progress * 4900;

            if (i % 3 === 0) {
                // Ancient Vanara Stone Fortress Bastion & Shrine
                const h = 55 + Math.random() * 30;
                const r = 18 + Math.random() * 8;
                const monument = this.createVanaraMonument(h, r);
                const dist = 75 + Math.random() * 45;
                monument.position.set(side * dist, -5, z);
                this.scene.add(monument);
                this.stageMeshes.push(monument);
                this.sceneryObjects.push(monument);
            } else if (i % 3 === 1) {
                // Grand Royal Thai Multi-Tiered Palace Pavilion
                const w = 36 + Math.random() * 18;
                const h = 95 + Math.random() * 45;
                const palace = this.createKishkindhaPalace(w, h, w);
                const dist = 120 + Math.random() * 65;
                palace.position.set(side * dist, -5, z);
                this.scene.add(palace);
                this.stageMeshes.push(palace);
                this.sceneryObjects.push(palace);
            } else {
                // Towering Golden Mount Monolith Palace
                const w = 48 + Math.random() * 24;
                const h = 125 + Math.random() * 60;
                const palace = this.createKishkindhaPalace(w, h, w);
                const dist = 210 + Math.random() * 80;
                palace.position.set(side * dist, -10, z);
                this.scene.add(palace);
                this.stageMeshes.push(palace);
                this.sceneryObjects.push(palace);
            }
        }

        // Grand Royal Gateways crossing overhead with fluttering victory banners
        const gatewayLocations = [-100, -380, -750, -1200, -1700, -2150, -2600, -3100, -3600, -4100, -4500];
        gatewayLocations.forEach(pz => {
            const gateway = this.createRoyalGateway(72, 32);
            gateway.position.set(0, 0, pz);
            this.scene.add(gateway);
            this.stageMeshes.push(gateway);
            this.sceneryObjects.push(gateway);
        });
    }

    // ============================================================
    // STAGE 3: HYDROCITY ZONE COURSE DEFINITION (5,000m)
    // ============================================================
    buildHydrocityCourse() {
        // 1. Starting Sunken Aqueduct & Palace Gates (z: 60 to -240, y: 2.0, length: 300, center: -90)
        this.addRoadSegment(0, 2.0, -90, 36, 300, 0);

        // 2. Slope Rising to Grand Aqueduct Viaduct #1 (z: -240 to -400, y: 2.0 -> 6.0, length: 160)
        this.addSlopedRoad(0, 2.0, -240, 34, 160, 4.0);

        // 3. Grand Aqueduct Viaduct High Road #1 (z: -400 to -640, y: 6.0, length: 240, center: -520)
        this.addRoadSegment(0, 6.0, -520, 34, 240, 0);
        this.addViaductPillars(0, 6.0, -400, 240, 34, 32);

        // 4. Thrill Drop into Crystal Abyss Flume #1 (z: -640 to -780, y: 6.0 -> 1.0, length: 140)
        this.addSlopedRoad(0, 6.0, -640, 30, 140, -5.0);

        // 5. Submerged Crystal Abyss Flume #1 (z: -780 to -1220, y: 1.0, length: 440, center: -1000)
        this.addRoadSegment(0, 1.0, -1000, 28, 440, 0);
        this.addHydroTube(0, 1.0, -780, 440, 15.0);

        // 6. Atlantis Colosseum & Water Loop #1 (z: -1220 to -1780, y: 2.0, length: 560, center: -1500)
        this.addRoadSegment(0, 2.0, -1500, 36, 560, 0);
        this.buildLoopSection(0, 2.0, -1450, 16);

        // 7. Water-Surface Sprintfast (Skimming across ocean surface) (z: -1780 to -2240, y: 0.8, length: 460, center: -2010)
        this.addRoadSegment(0, 0.8, -2010, 42, 460, 0);

        // 8. Rising Ramp to Upper Causeway Viaduct #2 (z: -2240 to -2420, y: 0.8 -> 6.0, length: 180)
        this.addSlopedRoad(0, 0.8, -2240, 34, 180, 5.2);

        // 9. Upper Causeway Viaduct #2 (z: -2420 to -2660, y: 6.0, length: 240, center: -2540)
        this.addRoadSegment(0, 6.0, -2540, 34, 240, 0);
        this.addViaductPillars(0, 6.0, -2420, 240, 34, 32);

        // 10. Thrill Plunge into Deep Abyss Flume #2 (z: -2660 to -2800, y: 6.0 -> 1.0, length: 140)
        this.addSlopedRoad(0, 6.0, -2660, 30, 140, -5.0);

        // 11. Deep Abyss Crystal Flume #2 (z: -2800 to -3320, y: 1.0, length: 520, center: -3060)
        this.addRoadSegment(0, 1.0, -3060, 28, 520, 0);
        this.addHydroTube(0, 1.0, -2800, 520, 15.0);

        // 12. Gentle Slope to Water Loop #2 (z: -3320 to -3480, y: 1.0 -> 2.0, length: 160)
        this.addSlopedRoad(0, 1.0, -3320, 34, 160, 1.0);

        // 13. Water Loop #2 & Sacred Rapids (z: -3480 to -3820, y: 2.0, length: 340, center: -3650)
        this.addRoadSegment(0, 2.0, -3650, 36, 340, 0);
        this.buildLoopSection(0, 2.0, -3650, 16);

        // 14. Coastal Causeway Bridge (z: -3820 to -4100, y: 2.0, length: 280, center: -3960)
        this.addRoadSegment(0, 2.0, -3960, 38, 280, 0);

        // 15. Trident Grand Ocean Canal Sprint (z: -4100 to -4600, y: 2.0, length: 500, center: -4350)
        this.addRoadSegment(0, 2.0, -4350, 44, 500, 0);

        // 16. Lanka Causeway Grand Pavilion Approach (z: -4600 to -4900, y: 2.5, length: 300, center: -4750)
        this.addRoadSegment(0, 2.5, -4750, 56, 300, 0);

        // 17. Lanka Causeway Finish Pavilion & Arena (z: -4900 to -5050, y: 2.5, length: 150, center: -4975)
        this.addRoadSegment(0, 2.5, -4975, 72, 150, 0);
        this.buildPoseidonColosseum(0, 2.5, -5000, 72);
    }

    buildHydrocityScenery() {
        // 1. Triumphal Suvannamaccha Archways crossing overhead (ซุ้มประตูสุพรรณมัจฉาข้ามสมุทร)
        // Dynamically rooted to the road surface at each location!
        const archwaysZ = [-200, -500, -1350, -1650, -2350, -2550, -3450, -3750, -4200, -4450];
        archwaysZ.forEach(az => {
            const groundY = this.getGroundHeight(0, az);
            const safeY = (groundY > -40) ? groundY : 2.0;
            const arch = this.createSuvannamacchaArchway(46, 26);
            arch.position.set(0, safeY, az);
            this.scene.add(arch);
            this.stageMeshes.push(arch);
            this.sceneryObjects.push(arch);
        });

        // 2. Flanking Naga Ocean Guardians & Distant Sea Monoliths
        const totalPillars = 64;
        for (let i = 0; i < totalPillars; i++) {
            const side = (i % 2 === 0) ? 1 : -1;
            const progress = i / totalPillars;
            const z = 40 - progress * 5000;
            const roadY = this.getGroundHeight(0, z);
            const safeY = (roadY > -40) ? roadY : 2.0;

            if (i % 2 === 0) {
                // Flanking Causeway Naga Pillar right beside the road edge
                const dist = 22 + (i % 3) * 3;
                const pillar = this.createNagaOceanPillar(20 + Math.random() * 8, 1.8);
                pillar.position.set(side * dist, safeY, z);
                this.scene.add(pillar);
                this.stageMeshes.push(pillar);
                this.sceneryObjects.push(pillar);
            } else {
                // Distant Ocean Colossus Pillar rooted in the sea floor
                const dist = 55 + (i % 4) * 20;
                const pillar = this.createNagaOceanPillar(38 + Math.random() * 12, 2.4);
                pillar.position.set(side * dist, 0.0, z);
                this.scene.add(pillar);
                this.stageMeshes.push(pillar);
                this.sceneryObjects.push(pillar);
            }

            // Sacred Coral & Kelp Reef cluster in the water beside causeway
            if (i % 2 === 0) {
                const coral = this.createSacredKelpReef(8 + Math.random() * 5);
                coral.position.set(side * (30 + (i % 3) * 6), 0.0, z + (Math.random() - 0.5) * 14);
                this.scene.add(coral);
                this.stageMeshes.push(coral);
                this.sceneryObjects.push(coral);
            }
        }
    }

    addCrystalAbyssFlume(startX, startY, startZ, length, radius = 15.0) {
        const group = new THREE.Group();

        // Transparent Aqua-Glass Crystal Flume Cylinder (อุโมงค์แก้วผลึกบาดาล)
        const tubeGeo = new THREE.CylinderGeometry(radius, radius, length, 32, 1, true);
        const tubeMesh = new THREE.Mesh(tubeGeo, this.hydroTubeMat);
        tubeMesh.rotation.x = Math.PI * 0.5;
        const centerY = startY + 5.0;
        tubeMesh.position.set(startX, centerY, startZ - length * 0.5);
        group.add(tubeMesh);

        // Sacred Golden Naga Rib Torus Rings every 24m
        const numRings = Math.floor(length / 24);
        for (let i = 0; i <= numRings; i++) {
            const ringGeo = new THREE.TorusGeometry(radius + 0.35, 0.5, 8, 32);
            const ringMesh = new THREE.Mesh(ringGeo, (i % 2 === 0) ? this.nagaGoldMat : this.seaCrystalMat);
            ringMesh.position.set(startX, centerY, startZ - i * 24);
            group.add(ringMesh);
        }

        this.scene.add(group);
        this.stageMeshes.push(group);
        return group;
    }
    addHydroTube(startX, startY, startZ, length, radius = 14.0) {
        return this.addCrystalAbyssFlume(startX, startY, startZ, length, radius);
    }

    createNagaOceanPillar(height = 32, radius = 2.0) {
        const group = new THREE.Group();

        // 1. Base Octagonal Plinth (ฐานศิลารองรับเสา)
        const baseGeo = new THREE.CylinderGeometry(radius * 2.8, radius * 3.2, 2.4, 8);
        const base = new THREE.Mesh(baseGeo, this.hydroPillarMat);
        base.position.y = 1.2;
        group.add(base);

        // Golden Lotus Trim on Base
        const lotusRing = new THREE.Mesh(new THREE.TorusGeometry(radius * 2.6, 0.4, 8, 16), this.nagaGoldMat);
        lotusRing.rotation.x = Math.PI * 0.5;
        lotusRing.position.y = 2.4;
        group.add(lotusRing);

        // 2. Main Fluted Sea-Stone Column Shaft (เสาศิลาใต้สมุทร)
        const colGeo = new THREE.CylinderGeometry(radius * 0.95, radius * 1.2, height, 16);
        const col = new THREE.Mesh(colGeo, this.hydroPillarMat);
        col.position.y = height * 0.5 + 1.5;
        col.castShadow = true;
        group.add(col);

        // Coiled Naga Body Trim at mid-height
        const midRing = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.45, 0.35, 8, 24), this.nagaGoldMat);
        midRing.rotation.x = Math.PI * 0.5;
        midRing.position.y = height * 0.5;
        group.add(midRing);

        // 3. Golden Naga Capital Head on Top (หัวเสาพญานาคสีทองคำ)
        const capGeo = new THREE.BoxGeometry(radius * 2.8, 2.6, radius * 2.8);
        const cap = new THREE.Mesh(capGeo, this.nagaGoldMat);
        cap.position.y = height + 1.5;
        group.add(cap);

        // Naga Hood Wing Crests (ปีกเศียรนาคราช)
        [-radius * 1.3, radius * 1.3].forEach(wx => {
            const wingGeo = new THREE.ConeGeometry(radius * 0.7, 3.2, 5);
            const wing = new THREE.Mesh(wingGeo, this.nagaGoldMat);
            wing.position.set(wx, height + 3.0, 0);
            wing.rotation.z = (wx > 0) ? -0.4 : 0.4;
            group.add(wing);
        });

        // 4. Glowing Deep-Sea Pearl Crystal Orb on Top (ลูกแก้วมณีสมุทรเรืองแสง)
        const orbGeo = new THREE.SphereGeometry(radius * 0.9, 16, 16);
        const orb = new THREE.Mesh(orbGeo, this.seaCrystalMat);
        orb.position.y = height + 3.4;
        group.add(orb);

        return group;
    }
    createPoseidonPillar(height = 32, radius = 2.0) {
        return this.createNagaOceanPillar(height, radius);
    }

    createSuvannamacchaArchway(span = 46, height = 26) {
        const group = new THREE.Group();

        // 1. Left & Right Naga Pillars (เสาพญานาคคู่ขนาบสะพาน)
        [-span * 0.45, span * 0.45].forEach(colX => {
            const colGeo = new THREE.CylinderGeometry(1.9, 2.6, height, 12);
            const col = new THREE.Mesh(colGeo, this.hydroPillarMat);
            col.position.set(colX, height * 0.5, 0);
            group.add(col);

            // Golden Naga coil around pillar
            const coilGeo = new THREE.TorusGeometry(2.8, 0.4, 8, 16);
            const coil = new THREE.Mesh(coilGeo, this.nagaGoldMat);
            coil.rotation.x = Math.PI * 0.5;
            coil.position.set(colX, height * 0.65, 0);
            group.add(coil);

            // Capital lotus
            const cap = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.0, 5.2), this.nagaGoldMat);
            cap.position.set(colX, height, 0);
            group.add(cap);
        });

        // 2. Arch Beam across top with Golden Thai Wave Carvings
        const beamGeo = new THREE.BoxGeometry(span, 3.4, 4.2);
        const beam = new THREE.Mesh(beamGeo, this.nagaGoldMat);
        beam.position.set(0, height + 0.8, 0);
        group.add(beam);

        // 3. Suvannamaccha Golden Mermaid Crest at Center (ยอดซุ้มรูปหางสุพรรณมัจฉา & มุกมณีสมุทร)
        // Center Naga/Mermaid Spire
        const spireMesh = new THREE.Mesh(new THREE.ConeGeometry(1.6, 6.5, 8), this.nagaGoldMat);
        spireMesh.position.set(0, height + 5.5, 0);
        group.add(spireMesh);

        // Golden Mermaid Tail Flukes (ครีบหางสุพรรณมัจฉาสีทองคำ)
        [-2.8, 2.8].forEach(fx => {
            const flukeGeo = new THREE.ConeGeometry(0.9, 4.8, 6);
            const fluke = new THREE.Mesh(flukeGeo, this.nagaGoldMat);
            fluke.position.set(fx, height + 4.8, 0);
            fluke.rotation.z = (fx > 0) ? -0.55 : 0.55;
            group.add(fluke);
        });

        // Center Radiant Ocean Pearl Medallion (มุกมณีแก้วกลางซุ้ม)
        const pearlMesh = new THREE.Mesh(new THREE.SphereGeometry(1.4, 16, 16), this.seaCrystalMat);
        pearlMesh.position.set(0, height + 2.8, 0);
        group.add(pearlMesh);

        return group;
    }
    createAncientArchway(span = 46, height = 26) {
        return this.createSuvannamacchaArchway(span, height);
    }

    createSacredKelpReef(radius = 8) {
        const group = new THREE.Group();
        const colors = [this.coralPinkMat, this.seaCrystalMat, this.coralGoldMat, this.kelpGreenMat];

        const numBranches = 8;
        for (let b = 0; b < numBranches; b++) {
            const angle = (b / numBranches) * Math.PI * 2;
            const dist = Math.random() * radius * 0.65;
            const h = 4 + Math.random() * 8.5;
            const r = 0.5 + Math.random() * 0.65;

            const branchGeo = new THREE.ConeGeometry(r, h, 6);
            const mat = colors[b % colors.length];
            const branch = new THREE.Mesh(branchGeo, mat);
            branch.position.set(Math.cos(angle) * dist, h * 0.5, Math.sin(angle) * dist);
            branch.rotation.z = (Math.random() - 0.5) * 0.38;
            branch.rotation.x = (Math.random() - 0.5) * 0.38;
            group.add(branch);
        }

        // Center glowing sea pearl
        const centerPearl = new THREE.Mesh(new THREE.SphereGeometry(1.0, 12, 12), this.seaCrystalMat);
        centerPearl.position.set(0, 1.2, 0);
        group.add(centerPearl);

        return group;
    }
    createCoralReef(radius = 8) {
        return this.createSacredKelpReef(radius);
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

    buildLankaCausewayPavilion(x, y, z, radius = 72) {
        const group = new THREE.Group();

        // 1. Classical Sunken Lanka Ocean Arena Base (ลานแท่นศิลาจองถนนข้ามสมุทร)
        const baseGeo = new THREE.CylinderGeometry(radius, radius, 14, 36);
        const baseMat = this.getHydroSideMaterial(8, 2);
        const topMat = this.getHydroTrackMaterial(12, 12);
        const baseMesh = new THREE.Mesh(baseGeo, [baseMat, topMat, baseMat]);
        baseMesh.position.set(x, y - 7, z);
        baseMesh.receiveShadow = true;
        group.add(baseMesh);

        // 2. 16 Surrounding Golden Naga Guardian Columns (เสาศิลาพญานาคราชล้อมรอบ)
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const px = x + Math.cos(angle) * (radius - 5);
            const pz = z + Math.sin(angle) * (radius - 5);

            const pillarGeo = new THREE.CylinderGeometry(2.1, 2.8, 38, 12);
            const pillar = new THREE.Mesh(pillarGeo, this.hydroPillarMat);
            pillar.position.set(px, y + 19, pz);
            pillar.castShadow = true;
            group.add(pillar);

            // Golden Naga Capital on top
            const capGeo = new THREE.BoxGeometry(5.4, 2.6, 5.4);
            const cap = new THREE.Mesh(capGeo, this.nagaGoldMat);
            cap.position.set(px, y + 38, pz);
            group.add(cap);

            // Glowing Ocean Crystal Orb atop every alternate pillar
            if (i % 2 === 0) {
                const orb = new THREE.Mesh(new THREE.SphereGeometry(1.8, 14, 14), this.seaCrystalMat);
                orb.position.set(px, y + 41, pz);
                group.add(orb);
            }
        }

        // 3. Grand Entrance Archway with Suvannamaccha Mermaid Crest
        const archL = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.0, 32, 12), this.hydroPillarMat);
        archL.position.set(x - 16, y + 16, z + 28);
        group.add(archL);

        const archR = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.0, 32, 12), this.hydroPillarMat);
        archR.position.set(x + 16, y + 16, z + 28);
        group.add(archR);

        const archBeam = new THREE.Mesh(new THREE.BoxGeometry(36, 4.2, 4.8), this.nagaGoldMat);
        archBeam.position.set(x, y + 32, z + 28);
        group.add(archBeam);

        // Suvannamaccha Golden Mermaid Tail & Spire Emblem atop the Arch
        const spire = new THREE.Mesh(new THREE.ConeGeometry(2.2, 9.5, 8), this.nagaGoldMat);
        spire.position.set(x, y + 38.5, z + 28);
        group.add(spire);

        [-3.8, 3.8].forEach(tx => {
            const fluke = new THREE.Mesh(new THREE.ConeGeometry(1.2, 6.8, 6), this.nagaGoldMat);
            fluke.position.set(x + tx, y + 38, z + 28);
            fluke.rotation.z = (tx > 0) ? -0.55 : 0.55;
            group.add(fluke);
        });

        // Glowing center ocean pearl medallion
        const centerPearl = new THREE.Mesh(new THREE.SphereGeometry(2.0, 16, 16), this.seaCrystalMat);
        centerPearl.position.set(x, y + 33, z + 28);
        group.add(centerPearl);

        this.scene.add(group);
        this.stageMeshes.push(group);
        return group;
    }
    buildPoseidonColosseum(x, y, z, radius = 72) {
        return this.buildLankaCausewayPavilion(x, y, z, radius);
    }

    // ============================================================
    // STAGE 4: LANKA MOLTEN RAVINE COURSE DEFINITION (4,550m)
    // ============================================================
    buildMoltenRavineCourse() {
        // 1. Starting Volcanic Causeway (z: 40 to -300, y: 0, length: 340, center: -130)
        this.addRoadSegment(0, 0, -130, 36, 340, 0);

        // 2. Chasm 1: The First Fissure (Warmup Leap - Adjusted to 30m Standard Challenge)
        // Takeoff ramp leading up to cliff edge: z: -300 to -325, y: 0 -> 3.5, length: 25
        this.addSlopedRoad(0, 0, -300, 32, 25, 3.5);
        // >>> GAP / CHASM 1: z: -325 to -355 (30m chasm - ท้าทายกำลังดี โดดพ้นสวยงาม) <<<
        // Landing road: z: -355 to -550, y: 3.5, length: 195, center: -452.5
        this.addRoadSegment(0, 3.5, -452.5, 34, 195, 0);

        // 3. Slope descending back to base: z: -550 to -630, y: 3.5 -> 0, length: 80
        this.addSlopedRoad(0, 3.5, -550, 34, 80, -3.5);

        // 4. Molten Highway Straightaway: z: -630 to -780, y: 0, length: 150, center: -705
        this.addRoadSegment(0, 0, -705, 34, 150, 0);

        // 5. Chasm 2: Double Ravine with Floating Basalt Island (28m + 28m)
        // Cliff edge at z: -780
        // >>> GAP 1: z: -780 to -808 (28m chasm) <<<
        // Floating Stepping Island: z: -808 to -848, y: 0, length: 40, width: 30, center: -828
        this.addRoadSegment(0, 0, -828, 30, 40, 0);
        // >>> GAP 2: z: -848 to -876 (28m chasm) <<<
        // Landing road: z: -876 to -1450, y: 0, length: 574, center: -1163
        this.addRoadSegment(0, 0, -1163, 34, 574, 0);

        // 6. Chasm 3: The Molten Cataract Leap (Adjusted to 32m + Lotus Spring)
        // Cliff edge at z: -1450. Lotus spring at z: -1445 available or manual jump!
        // >>> GAP: z: -1450 to -1482 (32m chasm - ท้าทายกำลังดี) <<<
        // Landing road: z: -1482 to -2020, y: 2.0, length: 538, center: -1751
        this.addRoadSegment(0, 2.0, -1751, 36, 538, 0);

        // 7. 3D Loop-the-Loop suspended over Boiling Magma:
        // Approach road into loop: z: -2020 to -2090, y: 2.0, length: 70, center: -2055
        this.addRoadSegment(0, 2.0, -2055, 36, 70, 0);
        // Loop at z: -2150
        this.buildLoopSection(0, 2.0, -2150, 24);
        // Exit road from loop: z: -2210 to -2780, y: 2.0, length: 570, center: -2495
        this.addRoadSegment(0, 2.0, -2495, 34, 570, 0);

        // 8. Chasm 4: Triple Stepping Stone Islands across Boiling Magma Sea (25m gaps)
        // Cliff edge at z: -2780
        // >>> GAP to Island 1: z: -2780 to -2805 (25m) <<<
        // Island 1 (Left flank): x: -5, z: -2805 to -2830, y: 2.0, length: 25, width: 20, center: -2817.5
        this.addRoadSegment(-5, 2.0, -2817.5, 20, 25, 0);
        // >>> GAP to Island 2: z: -2830 to -2855 (25m) <<<
        // Island 2 (Right flank): x: 5, z: -2855 to -2880, y: 3.5, length: 25, width: 20, center: -2867.5
        this.addRoadSegment(5, 3.5, -2867.5, 20, 25, 0);
        // >>> GAP to Island 3: z: -2880 to -2905 (25m) <<<
        // Island 3 (Center lane): x: 0, z: -2905 to -2930, y: 2.0, length: 25, width: 22, center: -2917.5
        this.addRoadSegment(0, 2.0, -2917.5, 22, 25, 0);
        // >>> GAP to Mainland: z: -2930 to -2955 (25m) <<<
        // Landing road: z: -2955 to -3450, y: 2.0, length: 495, center: -3202.5
        this.addRoadSegment(0, 2.0, -3202.5, 34, 495, 0);

        // 9. Chasm 5: Supersonic Vayu Gale Launch (Adjusted to 32m)
        // Cliff edge at z: -3450. Dash Pad at z: -3435
        // >>> GAP: z: -3450 to -3482 (32m chasm - ท้าทายกำลังดี) <<<
        // Landing road: z: -3482 to -4100, y: 4.0, length: 618, center: -3791
        this.addRoadSegment(0, 4.0, -3791, 34, 618, 0);

        // 10. Chasm 6: Final Ski-Jump Ramp & Ravana's Obsidian Fortress Arena (Adjusted to 30m)
        // Takeoff ramp: z: -4100 to -4160, y: 4.0 -> 10.0, length: 60
        this.addSlopedRoad(0, 4.0, -4100, 34, 60, 6.0);
        // >>> FINAL CHASM: z: -4160 to -4190 (30m ski leap!) <<<
        // Ravana's Obsidian Fortress Arena: z: -4190 to -4550, y: 6.0, length: 360, width: 76, center: -4370
        this.addRoadSegment(0, 6.0, -4370, 76, 360, 0);
        this.buildRavanaFortressArena(0, 6.0, -4450, 76);
    }

    buildRavanaFortressArena(x, y, z, radius = 76) {
        const group = new THREE.Group();

        // 1. Massive Basalt Obsidian Arena Plinth (placed at y - 6 so top surface is perfectly flush with road at y = 6.0)
        const baseGeo = new THREE.CylinderGeometry(radius, radius * 1.05, 12, 32);
        const baseMesh = new THREE.Mesh(baseGeo, this.obsidianPillarMat);
        baseMesh.position.set(x, y - 6, z);
        baseMesh.receiveShadow = true;
        group.add(baseMesh);

        // Glowing Magma Fissure Rim around Arena Edge
        const rimGeo = new THREE.TorusGeometry(radius + 0.5, 1.2, 8, 32);
        const rimMesh = new THREE.Mesh(rimGeo, this.magmaGlowMat);
        rimMesh.rotation.x = Math.PI / 2;
        rimMesh.position.set(x, y + 0.1, z);
        group.add(rimMesh);

        // 2. 8 Demonic Obsidian Obelisks around perimeter (leaving center corridor at x = 0 completely wide open!)
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + Math.PI / 8; // Offset 22.5 deg to keep x = 0 corridor completely free
            const px = x + Math.cos(angle) * (radius - 8);
            const pz = z + Math.sin(angle) * (radius - 8);

            // Spire Pillar
            const spireGeo = new THREE.CylinderGeometry(2.2, 3.5, 34, 6);
            const spire = new THREE.Mesh(spireGeo, this.obsidianPillarMat);
            spire.position.set(px, y + 17, pz);
            spire.castShadow = true;
            group.add(spire);

            // Glowing Magma Crystal Spike atop pillar
            const crystalGeo = new THREE.OctahedronGeometry(2.4, 0);
            const crystal = new THREE.Mesh(crystalGeo, this.magmaGlowMat);
            crystal.position.set(px, y + 36, pz);
            group.add(crystal);
        }

        // 3. Grand Finish Entrance Archway (Colossal Ravana Fortress Gate at approach)
        const archL = new THREE.Mesh(new THREE.BoxGeometry(5.0, 32, 5.0), this.obsidianPillarMat);
        archL.position.set(x - 22, y + 16, z + 60);
        group.add(archL);

        const archR = new THREE.Mesh(new THREE.BoxGeometry(5.0, 32, 5.0), this.obsidianPillarMat);
        archR.position.set(x + 22, y + 16, z + 60);
        group.add(archR);

        const lintel = new THREE.Mesh(new THREE.BoxGeometry(52, 4.5, 5.5), this.obsidianPillarMat);
        lintel.position.set(x, y + 32, z + 60);
        group.add(lintel);

        const crown = new THREE.Mesh(new THREE.ConeGeometry(3.5, 8.0, 6), this.magmaGlowMat);
        crown.position.set(x, y + 38, z + 60);
        group.add(crown);

        this.scene.add(group);
        this.stageMeshes.push(group);
        return group;
    }

    buildMoltenRavineScenery() {
        // 1. Towering Obsidian Spires & Sharp Basalt Peaks flanking the chasms
        const totalSpires = 56;
        for (let i = 0; i < totalSpires; i++) {
            const side = (i % 2 === 0) ? 1 : -1;
            const progress = i / totalSpires;
            const z = 30 - progress * 4550;
            const groundY = this.getGroundHeight(0, z);
            const safeY = (groundY > -40) ? groundY : 0.0;
            const dist = 24 + (i % 4) * 8;
            const spireH = 30 + (i % 5) * 14;
            const spire = this.createObsidianSpire(spireH, 3.5);
            spire.position.set(side * dist, safeY - 5.0, z);
            this.scene.add(spire);
            this.stageMeshes.push(spire);
            this.sceneryObjects.push(spire);
        }

        // 2. Menacing Ravana Demonic Archways at key milestone locations
        const archZ = [-260, -680, -1400, -1980, -2700, -3380, -4050];
        archZ.forEach(az => {
            const groundY = this.getGroundHeight(0, az);
            const safeY = (groundY > -40) ? groundY : 0.0;
            const arch = this.createRavanaArchway(48, 28);
            arch.position.set(0, safeY, az);
            this.scene.add(arch);
            this.stageMeshes.push(arch);
            this.sceneryObjects.push(arch);
        });
    }

    createObsidianSpire(height = 36, radius = 4.0) {
        const group = new THREE.Group();
        const coneGeo = new THREE.ConeGeometry(radius, height, 6);
        coneGeo.translate(0, height * 0.5, 0);
        const coneMesh = new THREE.Mesh(coneGeo, this.obsidianPillarMat);
        coneMesh.castShadow = true;
        coneMesh.receiveShadow = true;
        group.add(coneMesh);

        // Glowing magma fissure ribbon cutting up the spire
        const ribbonGeo = new THREE.CylinderGeometry(radius * 0.45, radius * 0.65, height * 0.6, 4);
        ribbonGeo.translate(0, height * 0.35, 0);
        const ribbonMesh = new THREE.Mesh(ribbonGeo, this.magmaGlowMat);
        group.add(ribbonMesh);
        return group;
    }

    createRavanaArchway(width = 46, height = 26) {
        const group = new THREE.Group();
        // Left & Right Colossal Obsidian Pillars
        const pillarGeo = new THREE.BoxGeometry(4.5, height, 4.5);
        pillarGeo.translate(0, height * 0.5, 0);
        const leftPillar = new THREE.Mesh(pillarGeo, this.obsidianPillarMat);
        leftPillar.position.x = -width * 0.5;
        group.add(leftPillar);

        const rightPillar = new THREE.Mesh(pillarGeo, this.obsidianPillarMat);
        rightPillar.position.x = width * 0.5;
        group.add(rightPillar);

        // Overhead Jagged Lintel
        const lintelGeo = new THREE.BoxGeometry(width + 8, 4.0, 5.5);
        const lintelMesh = new THREE.Mesh(lintelGeo, this.obsidianPillarMat);
        lintelMesh.position.y = height + 1.5;
        group.add(lintelMesh);

        // Glowing Demonic Crown / Eye
        const eyeGeo = new THREE.OctahedronGeometry(2.2, 0);
        const eyeMesh = new THREE.Mesh(eyeGeo, this.magmaGlowMat);
        eyeMesh.position.y = height + 4.5;
        group.add(eyeMesh);

        return group;
    }

    // ============================================================
    // STAGE 5: CELESTIAL CLOUD SANCTUARY COURSE DEFINITION (5,200m)
    // ============================================================
    buildCelestialSanctuaryCourse() {
        // 1. Starting Heavenly Terrace (z: 40 to -310, y: 0, length: 350, center: -135)
        this.addRoadSegment(0, 0, -135, 36, 350, 0);

        // 2. Chasm 1: "ทัณฑเมฆาแรก (First Cloud Rift)" (28m gap - graceful warm-up leap over Sea of Clouds)
        // Takeoff ramp: z: -310 to -335, y: 0 -> 3.5, length: 25
        this.addSlopedRoad(0, 0, -310, 34, 25, 3.5);
        // >>> GAP / CHASM 1: z: -335 to -363 (28m chasm over Sea of Clouds!) <<<
        // Landing road: z: -363 to -580, y: 3.5, length: 217, center: -471.5
        this.addRoadSegment(0, 3.5, -471.5, 34, 217, 0);

        // 3. Slope descending back to base: z: -580 to -660, y: 3.5 -> 0, length: 80
        this.addSlopedRoad(0, 3.5, -580, 34, 80, -3.5);

        // 4. Celestial Highway Straightaway: z: -660 to -810, y: 0, length: 150, center: -735
        this.addRoadSegment(0, 0, -735, 34, 150, 0);

        // 5. Chasm 2: "เกาะลอยฟ้าผลึกมณีแฝด (Twin Crystal Stepping Islets)" (26m + 26m)
        // Cliff edge at z: -810
        // >>> GAP 1: z: -810 to -836 (26m chasm) <<<
        // Floating Stepping Island: z: -836 to -876, y: 0, length: 40, width: 30, center: -856
        this.addRoadSegment(0, 0, -856, 30, 40, 0);
        // >>> GAP 2: z: -876 to -902 (26m chasm) <<<
        // Landing road: z: -902 to -1450, y: 0, length: 548, center: -1176
        this.addRoadSegment(0, 0, -1176, 34, 548, 0);

        // 6. Chasm 3: "เวหาเหินดอกบัวทิพย์ (Celestial Lotus Leap)" (30m chasm + Lotus Spring)
        // Cliff edge at z: -1450
        // >>> GAP: z: -1450 to -1480 (30m chasm) <<<
        // Landing road: z: -1480 to -2020, y: 2.0, length: 540, center: -1750
        this.addRoadSegment(0, 2.0, -1750, 36, 540, 0);

        // 7. 3D Celestial Loop-the-Loop suspended over Sea of Clouds:
        // Approach road: z: -2020 to -2090, y: 2.0, length: 70, center: -2055
        this.addRoadSegment(0, 2.0, -2055, 36, 70, 0);
        // Loop at z: -2150
        this.buildLoopSection(0, 2.0, -2150, 24);
        // Exit road: z: -2210 to -2780, y: 2.0, length: 570, center: -2495
        this.addRoadSegment(0, 2.0, -2495, 34, 570, 0);

        // 8. Chasm 4: "มหาเกาะลอยฟ้าตรัยจักร (Triple Floating Sanctuaries)" (25m gaps)
        // Cliff edge at z: -2780
        // >>> GAP to Island 1: z: -2780 to -2805 (25m) <<<
        // Island 1 (Left flank): x: -5, z: -2805 to -2830, y: 2.0, length: 25, width: 22, center: -2817.5
        this.addRoadSegment(-5, 2.0, -2817.5, 22, 25, 0);
        // >>> GAP to Island 2: z: -2830 to -2855 (25m) <<<
        // Island 2 (Right flank): x: 5, z: -2855 to -2880, y: 3.5, length: 25, width: 22, center: -2867.5
        this.addRoadSegment(5, 3.5, -2867.5, 22, 25, 0);
        // >>> GAP to Island 3: z: -2880 to -2905 (25m) <<<
        // Island 3 (Center lane): x: 0, z: -2905 to -2930, y: 2.0, length: 25, width: 24, center: -2917.5
        this.addRoadSegment(0, 2.0, -2917.5, 24, 25, 0);
        // >>> GAP to Mainland: z: -2930 to -2955 (25m) <<<
        // Landing road: z: -2955 to -3450, y: 2.0, length: 495, center: -3202.5
        this.addRoadSegment(0, 2.0, -3202.5, 34, 495, 0);

        // 9. Chasm 5: "เวหาพายุวายุบุตรทะยานเมฆ (Supersonic Cloud Catapult)" (30m chasm)
        // Cliff edge at z: -3450
        // >>> GAP: z: -3450 to -3480 (30m chasm) <<<
        // Landing road: z: -3480 to -4120, y: 4.0, length: 640, center: -3800
        this.addRoadSegment(0, 4.0, -3800, 34, 640, 0);

        // 10. Chasm 6: "ผาทะยานฟ้าสู่ยอดเขาไกรลาส (Kailash Summit Ski-Jump)" (30m ski leap)
        // Takeoff ramp: z: -4120 to -4180, y: 4.0 -> 10.0, length: 60
        this.addSlopedRoad(0, 4.0, -4120, 34, 60, 6.0);
        // >>> FINAL CELESTIAL CHASM: z: -4180 to -4210 (30m ski leap!) <<<
        // Grand Kailash Palace Summit Arena: z: -4210 to -5200, y: 6.0, length: 990, width: 76, center: -4705
        this.addRoadSegment(0, 6.0, -4705, 76, 990, 0);
        this.buildKailashPalaceArena(0, 6.0, -5100, 76);
    }

    buildKailashPalaceArena(x, y, z, radius = 76) {
        const group = new THREE.Group();

        // 1. Massive White Marble Celestial Plinth (flush with road surface at y = 6.0)
        const baseGeo = new THREE.CylinderGeometry(radius, radius * 1.05, 12, 36);
        const baseMesh = new THREE.Mesh(baseGeo, this.celestialMarbleMat);
        baseMesh.position.set(x, y - 6, z);
        baseMesh.receiveShadow = true;
        group.add(baseMesh);

        // Shimmering Golden Lotus Rim around Arena Edge
        const rimGeo = new THREE.TorusGeometry(radius + 0.5, 1.4, 8, 36);
        const rimMesh = new THREE.Mesh(rimGeo, this.celestialGoldTrimMat);
        rimMesh.rotation.x = Math.PI / 2;
        rimMesh.position.set(x, y + 0.1, z);
        group.add(rimMesh);

        // 2. 12 Celestial Spires around perimeter (offset by 15 deg to keep x = 0 corridor wide open!)
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 + Math.PI / 12;
            const px = x + Math.cos(angle) * (radius - 8);
            const pz = z + Math.sin(angle) * (radius - 8);

            // White marble pillar shaft
            const spireGeo = new THREE.CylinderGeometry(2.0, 3.2, 38, 8);
            const spire = new THREE.Mesh(spireGeo, this.celestialMarbleMat);
            spire.position.set(px, y + 19, pz);
            spire.castShadow = true;
            group.add(spire);

            // Golden lotus capitol
            const capGeo = new THREE.CylinderGeometry(3.6, 2.0, 3.2, 8);
            const cap = new THREE.Mesh(capGeo, this.celestialGoldTrimMat);
            cap.position.set(px, y + 39, pz);
            group.add(cap);

            // Radiant Cyan Diamond Crystal atop each pillar
            const crystalGeo = new THREE.OctahedronGeometry(2.2, 0);
            const crystal = new THREE.Mesh(crystalGeo, this.celestialCrystalMat);
            crystal.position.set(px, y + 42, pz);
            group.add(crystal);
        }

        // 3. Grand Kailash Celestial Entrance Torana Gate (at z + 70 approach)
        const archL = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.4, 34, 8), this.celestialMarbleMat);
        archL.position.set(x - 22, y + 17, z + 70);
        group.add(archL);

        const archR = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.4, 34, 8), this.celestialMarbleMat);
        archR.position.set(x + 22, y + 17, z + 70);
        group.add(archR);

        const lintel = new THREE.Mesh(new THREE.BoxGeometry(52, 4.5, 5.5), this.celestialGoldTrimMat);
        lintel.position.set(x, y + 33, z + 70);
        group.add(lintel);

        // Thai Prasat Crown Spire atop Gate
        const crown = new THREE.Mesh(new THREE.ConeGeometry(3.2, 10.0, 8), this.celestialGoldTrimMat);
        crown.position.set(x, y + 40, z + 70);
        group.add(crown);

        // Sacred Radiant Crystal Crest
        const crest = new THREE.Mesh(new THREE.SphereGeometry(1.8, 14, 14), this.celestialCrystalMat);
        crest.position.set(x, y + 34, z + 70);
        group.add(crest);

        this.scene.add(group);
        this.stageMeshes.push(group);
        return group;
    }

    buildCelestialSanctuaryScenery() {
        // 1. Towering White-Gold Celestial Spires flanking the chasms
        const totalSpires = 60;
        for (let i = 0; i < totalSpires; i++) {
            const side = (i % 2 === 0) ? 1 : -1;
            const progress = i / totalSpires;
            const z = 30 - progress * 5150;
            const groundY = this.getGroundHeight(0, z);
            const safeY = (groundY > -40) ? groundY : 0.0;
            const dist = 24 + (i % 4) * 8;
            const spireH = 32 + (i % 5) * 14;
            const spire = this.createCelestialPillar(spireH, 3.2);
            spire.position.set(side * dist, safeY - 5.0, z);
            this.scene.add(spire);
            this.stageMeshes.push(spire);
            this.sceneryObjects.push(spire);
        }

        // 2. Grand Celestial Torana Archways at key milestone locations
        const archZ = [-280, -700, -1420, -2000, -2740, -3420, -4080];
        archZ.forEach(az => {
            const groundY = this.getGroundHeight(0, az);
            const safeY = (groundY > -40) ? groundY : 0.0;
            const arch = this.createCelestialArchway(48, 28);
            arch.position.set(0, safeY, az);
            this.scene.add(arch);
            this.stageMeshes.push(arch);
            this.sceneryObjects.push(arch);
        });
    }

    createCelestialPillar(height = 36, radius = 3.6) {
        const group = new THREE.Group();
        // White marble column
        const colGeo = new THREE.CylinderGeometry(radius * 0.75, radius, height, 8);
        colGeo.translate(0, height * 0.5, 0);
        const colMesh = new THREE.Mesh(colGeo, this.celestialMarbleMat);
        colMesh.castShadow = true;
        colMesh.receiveShadow = true;
        group.add(colMesh);

        // Golden Lotus Capitol
        const capGeo = new THREE.CylinderGeometry(radius * 1.3, radius * 0.75, 4.0, 8);
        capGeo.translate(0, height + 2.0, 0);
        const capMesh = new THREE.Mesh(capGeo, this.celestialGoldTrimMat);
        group.add(capMesh);

        // Cyan Glowing Jewel
        const gemGeo = new THREE.OctahedronGeometry(radius * 0.8, 0);
        gemGeo.translate(0, height + 5.5, 0);
        const gemMesh = new THREE.Mesh(gemGeo, this.celestialCrystalMat);
        group.add(gemMesh);

        return group;
    }

    createCelestialArchway(width = 46, height = 26) {
        const group = new THREE.Group();
        // Left & Right Pillars
        const pillarGeo = new THREE.CylinderGeometry(2.4, 3.2, height, 8);
        pillarGeo.translate(0, height * 0.5, 0);
        const leftPillar = new THREE.Mesh(pillarGeo, this.celestialMarbleMat);
        leftPillar.position.x = -width * 0.5;
        group.add(leftPillar);

        const rightPillar = new THREE.Mesh(pillarGeo, this.celestialMarbleMat);
        rightPillar.position.x = width * 0.5;
        group.add(rightPillar);

        // Overhead Lintel
        const lintelGeo = new THREE.BoxGeometry(width + 8, 4.0, 5.0);
        const lintelMesh = new THREE.Mesh(lintelGeo, this.celestialGoldTrimMat);
        lintelMesh.position.y = height + 1.5;
        group.add(lintelMesh);

        // Thai Prasat Crown Spire atop Arch
        const crown = new THREE.Mesh(new THREE.ConeGeometry(2.8, 8.5, 8), this.celestialGoldTrimMat);
        crown.position.y = height + 7.0;
        group.add(crown);

        // Glowing Blue Star Medallion
        const star = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 12), this.celestialCrystalMat);
        star.position.y = height + 2.5;
        group.add(star);

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

        // Animate Molten Lava flow and floating firefly embers in Molten Ravine
        if (this.currentStageId === 'molten_ravine') {
            if (this.lavaSeaTexture) {
                this.lavaSeaTexture.offset.y = (this.lavaSeaTexture.offset.y + dt * 0.035) % 1;
                this.lavaSeaTexture.offset.x = (this.lavaSeaTexture.offset.x + dt * 0.015) % 1;
            }
            this.clouds.forEach(ember => {
                ember.position.y += dt * 3.5;
                ember.position.x += Math.sin(ember.position.y * 0.5) * dt * 2.0;
                if (ember.position.y > 35) {
                    ember.position.y = -25;
                }
            });
        }

        // Animate Celestial Sea of Clouds and floating celestial sparkles in Stage 5
        if (this.currentStageId === 'celestial_sanctuary') {
            if (this.cloudSeaTexture) {
                this.cloudSeaTexture.offset.y = (this.cloudSeaTexture.offset.y + dt * 0.02) % 1;
                this.cloudSeaTexture.offset.x = (this.cloudSeaTexture.offset.x + dt * 0.01) % 1;
            }
            this.clouds.forEach(spark => {
                spark.position.y += dt * 2.5;
                spark.position.x += Math.sin(spark.position.y * 0.4) * dt * 1.5;
                if (spark.position.y > 50) {
                    spark.position.y = -5;
                }
            });
        }
    }
}

window.World = World;
