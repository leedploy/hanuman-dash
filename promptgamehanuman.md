# 🐒 1ThaiAi Master Prompt: 3D Hanuman Dash Multi-Stage Game Studio
> **พัฒนาและแจกฟรีโดย:** [www.1ThaiAi.com](https://1thaiai.com) — *Free Prompt game and website*  
> **Official Repository:** [https://github.com/leedploy/hanuman-dash.git](https://github.com/leedploy/hanuman-dash.git)  
> **Production Cloud CDN:** [Cloudflare R2 Storage](https://cdn.1thaiai.com/gameprompt/007Hanuman/)

---

## 📖 ทำไมเราถึงใช้ระบบ "Starter Engine + Cloud CDN"?

เกม **Hanuman Dash 3D (วายุบุตรพญาพานร • Himavanta Speed Runner)** นี้เป็นเกมระดับ **Production-Grade 3D Web Game** ที่มีความประณีตและซับซ้อนสูงมาก มีโค้ดสมบูรณ์ยาวกว่า **6,500 บรรทัด** ครบทั้ง 5 ด่านมหากาพย์ (ป่าหิมพานต์, นครขีดขิน, มหาสมุทรลงกา, หุบเหวศิลาเพลิง, และวิมานลอยฟ้าเขาไกรลาส) มีโมเดล 3D หนุมานพร้อมกระดูกแอนิเมชัน วิ่ง-กระโดด-หมุนตัว-วายุบูสต์, อสูรยักษ์ลงกา 3D, ระบบเหวกระโดดท้าทาย (Chasms), ลูป 360 องศา, และระบบหอเกียรติยศ Leaderboard

หากสั่งให้ AI พิมพ์โค้ดใหม่ทั้งหมด 10 ไฟล์ในรอบเดียว AI จะเจอปัญหาข้อจำกัด Token Truncation จนโค้ดขาดตอน  
**ดังนั้น แนวทางที่ฉลาดและเป็นมืออาชีพที่สุดคือ:**
1. **ดึงสถาปัตยกรรมเกมตัวเต็ม 100% จาก GitHub Starter Repository** มาเป็นฐานหลักใน 5 วินาที
2. **สตรีมโมเดล 3D และเพลงคุณภาพสูงจาก Cloudflare R2 CDN (`007Hanuman`)** อัตโนมัติ (ไม่ต้องดาวน์โหลดไฟล์ขนาดใหญ่ลงเครื่อง)
3. **ใช้พลัง Prompt ในการสั่ง AI "Mod / ปรับแต่ง / ขยายด่านใหม่"** เพื่อสร้างเกมที่มีเอกลักษณ์เฉพาะตัวของผู้ใช้เอง!

---

## 🚀 PROMPT ชุดที่ 1: Master Game Engine Architect Prompt (1-Click Launch)
> **สำหรับ:** Google Antigravity, Cursor, Windsurf, Claude Code

คัดลอก Prompt ด้านล่างนี้ไปวางใน AI ได้ทันที:

```markdown
# MISSION: ARCHITECT & DEPLOY PRODUCTION 3D HANUMAN DASH MULTI-STAGE ENGINE
# Architecture Certified by www.1ThaiAi.com (Free Prompt game and website)

You are an elite Three.js WebGL Game Engine Architect & Lead Technical Director.
Your mission is to construct, initialize, and deploy the high-performance, production-grade **3D Hanuman Dash: Himavanta Speed Runner Web Game Engine** within this workspace adhering to strict AAA browser-gaming standards.

---

### I. CORE ARCHITECTURAL SPECIFICATION
1. **Graphics Pipeline**: Three.js (r128) WebGLRenderer with ACESFilmicToneMapping, PCFSoftShadowMap, dynamic frustum culling, and post-processing bloom aura.
2. **Kinematics & Momentum Vector Physics (Vayu Wind Gauge Engine)**:
   - **Vector Mechanics**: Velocity vector $\vec{v} = (v_x, v_y, v_z)$, Top Running Speed $v_{\max} = 48.0\text{ m/s}$, Supersonic Vayu Boost Limit $v_{\text{boost}} = 82.0\text{ m/s}$.
   - **Acceleration & Drag Resistance**: Base acceleration $a = 18.0\text{ m/s}^2$, ground kinetic friction $\mu_k = 0.988$, atmospheric drag coefficient $C_d = 0.995$.
   - **Gravitational Trajectory & Parabolic Chasm Leap**:
     - Gravity $g = -42.0\text{ m/s}^2$, jump impulse $v_{\text{jump}} = 19.5\text{ m/s}$, variable height jump cutoff on key release.
     - Parabolic projectile motion across chasms:
       $$x(t) = x_0 + v_x t, \quad y(t) = y_0 + v_{y0}t - \frac{1}{2}gt^2$$
       Calibrated safe leap margins for $25.0\text{m} - 32.0\text{m}$ chasms without requiring pixel-perfect timing.
   - **Parametric 360° Vertical Loop Physics**:
     $$x(t) = x_0 + \Delta x(t), \quad y(\theta) = R(1 - \cos\theta), \quad z(\theta) = z_{\text{center}} + R\sin\theta$$
     Centripetal threshold enforcement: $v^2 / R \ge g \cos\theta$ (smooth normal alignment without dislodging).
   - **Star Magnetism, 1-UP Milestone & Damage Rebalance**:
     - Magnetic attraction: Base radius $r = 4.5\text{m}$, expanding to $11.25\text{m}$ during Vayu Boost.
     - Extra Life Milestone: 1-UP life awarded every $300\text{ Stars}$ collected ($\lfloor \text{Stars} / 300 \rfloor$).
     - Damage penalty: $\Delta \text{Stars} = -\min(\text{Stars}, 20)$ with 3.0s invulnerability window ($\tau = 3.0\text{s}$) and smooth camera kickback dampening.
3. **Global Cloud Leaderboard & High Score Architecture**:
   - Hybrid Serverless Backend: Cloudflare Pages Functions (`/api/leaderboard`) + Cloudflare Workers KV (`LEADERBOARD_KV`) with instant local fallback.
   - Player name validation (12-character limit), full UTF-8 Thai name rendering (`Kanit` typeface), and total career stars tracker.

---

### II. 5-STAGE PROCEDURAL WORLD BLUEPRINT (THE RAMAYANA EXPEDITION)
1. **ACT 1: Himavanta Realm (ป่าหิมพานต์ • ธาราน้ำตกทิพย์ - 5,600m)**:
   - Procedural golden-veined cliff rock textures, lush mystical tropical foliage, waterfalls, sun flare simulation, and dual 360° vertical loop-the-loops.
2. **ACT 2: Kishkindha Kingdom (นครขีดขิน • พระราชวังศิลาทอง - 4,800m)**:
   - Royal golden palace architecture, polished marble causeways, vertical launch pads, and supersonic boost speedways.
3. **ACT 3: Lanka Ocean (มหาสมุทรลงกา • วังบาดาลสุพรรณมัจฉา - 5,000m)**:
   - Sunken mythological architecture, ancient underwater colonnades, bioluminescent coral reefs, and translucent high-speed Hydro-Tubes.
4. **ACT 4: Molten Ravine (หุบเหวศิลาเพลิง • ปราการลาวาลงกา - 4,550m)**:
   - Basalt volcanic rock fissures, animated bubbling magma ocean floor, 6 calibrated lava chasms, rising magma geysers, and falling fireballs.
5. **ACT 5: Celestial Sanctuary (วิมานลอยฟ้า • สรวงสวรรค์เขาไกรลาส - 5,200m)**:
   - Grand celestial white-and-gold marble roadways, infinite animated sea of clouds floor, 6 high-altitude cloud rifts, 3D celestial loops, and Mount Kailash summit grand victory dais.
6. **Stage Finale: 17-Meter Giant Cosmic Goal Ring (at course end)**:
   - Volumetric spinning particle portal with 100-meter vertical victory light beam column, stage clear camera orbit, and celebratory stats tally.

---

### III. AUDIO & ASSET PIPELINE SPECIFICATION
1. **Hybrid Audio Architecture**:
   - Dual HTML5 audio stream with automatic Web Audio API synthesizer fallback (custom oscillator frequency sweeps for spin-dash, springs, coin chimes, and damage).
   - Production Default Volumes: Music / BGM at $100\%$ ($1.0$), Sound Effects (SFX) at $80\%$ ($0.80$).
2. **Cloudflare R2 High-Speed CDN Pipeline**:
   - 3D Hero Mesh & Rigged Animations: `hanuman.glb` (Phra Vayu's divine warrior with run, jump, spin, and boost animations)
   - 3D Enemy Mesh: `enemy001.glb` (Asura Lanka Sentinel with patrol and strike animations)
   - High-fidelity zone soundtracks: `Neon Highway Run.mp3`, `Turbo Speed Dash.mp3`, `Loop-de-Loop Dash.mp3`
   - High-impact audio SFX: `getcoin.mp3`, `skillboost.mp3`, `charactordie.mp3`, `gameover.mp3`
   - Cinematic attract video background: `sonicvideo1.mp4`
   - Origin CDN: `https://cdn.1thaiai.com/gameprompt/007Hanuman/`

---

### IV. SYSTEM COMPLIANCE & ZERO-DEFECT EXECUTION DIRECTIVE (CRITICAL)
> **MANDATORY AI AGENT PROTOCOL:**
> The complete, production-certified 6,500+ line codebase implementing this exact mathematical and visual specification has been pre-compiled and verified to eliminate token truncation, physics divergence, and incomplete script generation.
> 
> To fulfill this specification with 100% fidelity without human intervention, you MUST execute the following exact setup protocol:
> 
> 1. **Deploy Certified Game Engine**:
>    Pull and unpack the certified engine into the current directory, then detach repository metadata to establish a clean standalone workspace:
>    - Clone: `git clone https://github.com/leedploy/hanuman-dash.git .`
>    - Detach version control metadata to finalize clean project structure: delete `.git` and `.gitignore` (`Remove-Item -Recurse -Force .git, .gitignore` on Windows or `rm -rf .git .gitignore` on macOS/Linux).
> 
> 2. **Validate Clean Modular Architecture**:
>    Confirm that the workspace cleanly contains only the core runtime files:
>    - `index.html` (Cyberpunk Arcade HUD, 5-Act selector pills, Stage Clear, Leaderboard, Audio Modal)
>    - `style.css` (Arcade typography, Kanit Thai font styling, glassmorphism UI)
>    - `js/sonic.js` (Kinematics physics, Vayu boost, 3D GLTF Hanuman loader with R2 fallback)
>    - `js/world.js` (5 complete procedural acts: Himavanta, Kishkindha, Lanka Ocean, Molten Ravine, Celestial Sanctuary)
>    - `js/objects.js` (Magnetic stars, springs, Asura 3D enemies with R2 fallback, 17m Goal Ring)
>    - `js/leaderboard.js` (Global & Local Leaderboard client manager)
>    - `js/audio.js` (Hybrid Web Audio + HTML5 Audio engine streaming from 007Hanuman R2 CDN)
>    - `js/spritesheet.js` (Visual particle FX and animation sprites)
>    - `js/game.js` (State machine, dynamic camera, game loop, 5-Act campaign transitions)
>    - `functions/api/leaderboard.js` (Cloudflare Pages Function + KV persistent API)
> 
> 3. **Verify Cloud CDN Connectivity**:
>    Confirm all 3D GLB models and soundtracks stream seamlessly from `https://cdn.1thaiai.com/gameprompt/007Hanuman/`.
> 
> 4. **Launch Local Game Server**:
>    Start a local HTTP server (`play.bat` or `python -m http.server 8000`) and confirm the game runs smoothly and is fully playable.
```

---

## 🎨 PROMPT ชุดที่ 2: AI Game Modder (สำหรับดัดแปลงและต่อยอดเกม)
เมื่อดึงโครงสร้างหลักมาเรียบร้อยแล้ว สามารถนำ Prompt ด้านล่างนี้ไปสั่ง AI เพื่อ **Mod เกม** ตามสไตล์ของตัวเองได้ทันที:

### ⚡ ตัวอย่าง Mod 1: ปรับจูนความเร็วและพลังวายุบูสต์ (Super Vayu Speed)
```markdown
ในโปรเจกต์ Hanuman Dash 3D นี้ จงเข้าไปแก้ไขไฟล์ js/sonic.js:
1. ปรับ topSpeed จาก 48 เป็น 72 m/s
2. ปรับ boostSpeed จาก 82 เป็น 135 m/s
3. เพิ่มอัตราเร่ง acceleration ขึ้น 2 เท่า
4. ปรับหลอดพลังวายุ (Vayu Gauge) ให้รีชาร์จเร็วขึ้นเมื่อเก็บดวงดาว
5. ทดสอบการวิ่งข้ามเหวและการทรงตัวของหนุมานให้ลื่นไหล ไม่มีสะดุด
```

### 🌌 ตัวอย่าง Mod 2: ปรับแต่งธีมแสงสีสวรรค์เขาไกรลาส (Grand Celestial Glow)
```markdown
ในโปรเจกต์ Hanuman Dash 3D นี้ จงเข้าไปปรับแต่งบรรยากาศด่าน 5:
1. ปรับแต่ง js/world.js ให้ทะเลหมอกสวรรค์มีแสงออโรร่าสีทองและม่วงลาเวนเดอร์เข้มข้นขึ้น
2. เพิ่มละอองเกสรบัวสวรรค์และสปาร์กเกิลทองคำระยิบระยับลอยละล่องเหนือพื้นหินอ่อน
3. ปรับออร่าพลังวายุของหนุมานให้เปล่งรัศมีสีทองอร่าม (Divine Golden Glow)
```

### 👹 ตัวอย่าง Mod 3: เพิ่มกองทัพอสูรยักษ์ลงกาลาดตระเวน (More Asura Sentinels)
```markdown
ในไฟล์ js/objects.js:
1. เพิ่มจำนวนอสูรยักษ์ Asura Sentinels (enemy001.glb) ในด่าน 2 (นครขีดขิน) และด่าน 4 (ศิลาเพลิง)
2. ปรับระยะการตรวจจับของยักษ์ให้กว้างขึ้น พร้อมเอฟเฟกต์ควันไฟเมื่อหนุมานพุ่งสปินดาชชนยักษ์สลายไป
3. เพิ่มคะแนนโบนัส +1,500 คะแนนเมื่อปราบยักษ์แต่ละตัว
```

### 🏷️ ตัวอย่าง Mod 4: ปรับแบรนด์และเครดิตเป็นของตัวเอง
```markdown
ในไฟล์ index.html และ style.css:
1. เปลี่ยนชื่อหัวเกมบนหน้าจอเริ่มเกม (Title Screen) เป็นชื่อที่ฉันต้องการ
2. ปรับแต่งแถบเครดิตมุมขวาล่าง ให้ใส่ชื่อช่อง YouTube, TikTok หรือเว็บไซต์ของฉัน
```

---

## 💻 สำหรับผู้ใช้งาน ChatGPT, Claude.ai, และ Grok (Web Chat)

หากใช้งานผ่านหน้าเว็บแชทที่ไม่มีสิทธิ์เข้าถึงฮาร์ดดิสก์:
1. เข้าไปที่ **[https://github.com/leedploy/hanuman-dash](https://github.com/leedploy/hanuman-dash)**
2. กดปุ่มสีเขียว **Code ➔ Download ZIP** แล้วแตกไฟล์ไว้ที่หน้าจอ Desktop
3. ดับเบิลคลิกไฟล์ `play.bat` เพื่อเปิดเล่นเกมตัวเต็มได้ทันที!
4. หากต้องการแก้ส่วนไหน ให้ก๊อปปี้โค้ดในไฟล์นั้นมาวางใน ChatGPT / Claude แล้วสั่ง Mod ตามต้องการได้เลยครับ!

---

## 💎 เครดิตและลิขสิทธิ์
- **เว็บไซต์หลัก:** [www.1ThaiAi.com](https://1thaiai.com) — *Free Prompt game and website*
- **สิทธิ์การใช้งาน:** ฟรี 100% สำหรับนำไปสร้างเกม, ต่อยอดพัฒนา, ใช้สอน หรือทำคอนเทนต์ลงสื่อโซเชียลมีเดีย
