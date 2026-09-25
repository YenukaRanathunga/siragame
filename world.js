// 1.2-Kilometer Metropolis with Cities: Skylines Vibrant Visuals & Solid Building Collisions
// High-Contrast Daylight, Azure Sky, Royal Blue Glass Skyscraper Skyline, Lush Greenery & Colorful City Life

class CyberBunkerWorld {
    constructor(scene) {
        this.scene = scene;
        this.terminals = [];
        this.animatedObjects = [];
        this.clouds = [];
        this.waterMesh = null;
        this.policeLights = [];
        this.colliders = [];
        this.walkableMeshes = [];
        this.streetLightMaterials = [];
        this.streetPointLights = [];
        this.policeCruisers = [];
        this.policeAlertLevel = 0;
        this.policeHelicopter = null;
        this.isBlackout = false;
        this.billboardCanvas = null;
        this.billboardTexture = null;
        this.beacons = [];
        this.rainSystem = null;
        this.elapsed = 0;

        // Build rich procedural texture palette for vibrant Cyberpunk Night aesthetic
        this.textures = this.initProceduralTextures();

        this.initAtmosphere();
        this.buildSkyAndClouds();
        this.buildMountainBackdrop();
        this.buildRoadsSidewalksAndLawns();
        this.buildWaterfrontHarborAndPiers();
        this.buildOceanCruiseLiner();
        this.buildCargoContainerShip();
        this.buildTexturedCityBlocks();
        this.buildFlatironLandmarkBuilding();
        this.buildCentralParkDistrict();
        this.buildStreetPropsAndLighting();
        this.buildMetropolisVehicles();
        this.buildChallengeStations();
        this.buildPoliceHelicopter();
        this.buildRainSystem();

        // Export colliders and walkable surfaces globally
        window.worldColliders = this.colliders;
        window.walkableMeshes = this.walkableMeshes;
        window.world = this;
    }

    addBoxCollider(x, z, width, depth) {
        this.colliders.push({
            minX: x - width / 2,
            maxX: x + width / 2,
            minZ: z - depth / 2,
            maxZ: z + depth / 2
        });
    }

    initAtmosphere() {
        // Deep Midnight Indigo Fog
        this.scene.fog = new THREE.Fog(0x060913, 300, 2400);

        // Moonlight (Silvery blue, sharp shadows, cinematic night contrast)
        this.sunLight = new THREE.DirectionalLight(0x93c5fd, 0.85);
        this.sunLight.position.set(240, 450, 180);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 10;
        this.sunLight.shadow.camera.far = 1400;
        this.sunLight.shadow.camera.left = -400;
        this.sunLight.shadow.camera.right = 400;
        this.sunLight.shadow.camera.top = 400;
        this.sunLight.shadow.camera.bottom = -400;
        this.sunLight.shadow.bias = -0.0003;
        this.scene.add(this.sunLight);

        // Vibrant Night Sky & City Glow Bounce
        this.hemiLight = new THREE.HemisphereLight(0x1e293b, 0x090d16, 0.55);
        this.scene.add(this.hemiLight);

        // Subtle ambient blue fill
        this.fillLight = new THREE.DirectionalLight(0x1e3a8a, 0.35);
        this.fillLight.position.set(-200, 250, -200);
        this.scene.add(this.fillLight);
    }

    initProceduralTextures() {
        const emissive = this.createEmissiveMaps();
        const bumps = this.createBumpMaps();
        return {
            lushGrass: this.createLushGrassTexture(),
            darkAsphaltRoad: this.createDarkAsphaltRoadTexture(),
            concreteSidewalk: this.createConcreteSidewalkTexture(),
            zebraCrosswalk: this.createZebraCrosswalkTexture(),
            blueGlassTower: this.createBlueGlassTexture(),
            tealAquaTower: this.createTealAquaTexture(),
            whiteModernTower: this.createWhiteModernTexture(),
            terracottaBrick: this.createTerracottaBrickTexture(),
            colorfulRetailPodium: this.createRetailPodiumTexture(),
            billboardAds: this.createBillboardTexture(),
            helipadRoof: this.createHelipadTexture(),
            roofGravel: this.createRoofGravelTexture(),
            emissiveBlue: emissive.blue,
            emissiveTeal: emissive.teal,
            emissiveWhite: emissive.white,
            emissiveTerra: emissive.terra,
            emissiveRetail: emissive.retail,
            bumpBlue: bumps.blue,
            bumpTeal: bumps.teal,
            bumpWhite: bumps.white,
            bumpTerra: bumps.terra,
            bumpRetail: bumps.retail
        };
    }

    // 1. Lush Green Grass Texture (Cities: Skylines saturated emerald lawn)
    createLushGrassTexture() {
        const c = document.createElement('canvas');
        c.width = 256;
        c.height = 256;
        const ctx = c.getContext('2d');

        // Saturated park green
        ctx.fillStyle = '#348e38';
        ctx.fillRect(0, 0, 256, 256);

        // Turf organic variation
        for (let i = 0; i < 4000; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const greens = ['#2e7d32', '#388e3c', '#43a047', '#1b5e20', '#4caf50'];
            ctx.fillStyle = greens[Math.floor(Math.random() * greens.length)];
            ctx.fillRect(x, y, 2, 3);
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(32, 32);
        return tex;
    }

    // 2. Dark Asphalt Avenue Texture (Crisp white dashed lanes & double yellow center divider)
    createDarkAsphaltRoadTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 512;
        const ctx = c.getContext('2d');

        // Rich dark charcoal asphalt
        ctx.fillStyle = '#22252a';
        ctx.fillRect(0, 0, 512, 512);

        // Asphalt aggregate texture
        for (let i = 0; i < 3000; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const b = 28 + Math.random() * 18;
            ctx.fillStyle = `rgb(${b}, ${b+2}, ${b+4})`;
            ctx.fillRect(x, y, 2, 2);
        }

        // Double solid yellow center divider
        ctx.fillStyle = '#fbc02d';
        ctx.fillRect(253, 0, 2.5, 512);
        ctx.fillRect(258, 0, 2.5, 512);

        // White dashed lane dividers for multi-lane avenue
        ctx.fillStyle = '#ffffff';
        for (let y = 12; y < 512; y += 48) {
            ctx.fillRect(128, y, 3, 26);
            ctx.fillRect(384, y, 3, 26);
        }

        // Solid white outer road edge lines
        ctx.fillStyle = '#f5f7fa';
        ctx.fillRect(8, 0, 3.5, 512);
        ctx.fillRect(500, 0, 3.5, 512);

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 14);
        return tex;
    }

    // 3. Concrete Flagstone Sidewalk with Granite Borders
    createConcreteSidewalkTexture() {
        const c = document.createElement('canvas');
        c.width = 256;
        c.height = 256;
        const ctx = c.getContext('2d');

        // Clean light grey concrete pavers
        ctx.fillStyle = '#d5dbe2';
        ctx.fillRect(0, 0, 256, 256);

        // Paver joints
        ctx.strokeStyle = '#a4b0be';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 256; i += 32) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
        }

        // Dark charcoal border curb stones
        ctx.fillStyle = '#474f59';
        ctx.fillRect(0, 0, 256, 8);
        ctx.fillRect(0, 248, 256, 8);

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(8, 8);
        return tex;
    }

    // 4. Zebra Crosswalk Texture (Pedestrian intersections)
    createZebraCrosswalkTexture() {
        const c = document.createElement('canvas');
        c.width = 256;
        c.height = 128;
        const ctx = c.getContext('2d');

        ctx.fillStyle = '#22252a';
        ctx.fillRect(0, 0, 256, 128);

        // Thick crisp white pedestrian zebra stripes
        ctx.fillStyle = '#ffffff';
        for (let x = 16; x < 256; x += 36) {
            ctx.fillRect(x, 8, 22, 112);
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    // 5. Royal Blue Glass Skyscraper Facade (Signature Cities: Skylines commercial look)
    createBlueGlassTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 512;
        const ctx = c.getContext('2d');

        // Vibrant royal blue reflective curtain glass
        const grad = ctx.createLinearGradient(0, 0, 512, 512);
        grad.addColorStop(0, '#1565c0');
        grad.addColorStop(0.5, '#1976d2');
        grad.addColorStop(1, '#0d47a1');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        const cols = 8;
        const rows = 14;
        const cellW = 512 / cols;
        const cellH = 512 / rows;

        for (let r = 0; r < rows; r++) {
            // White horizontal structural spandrel bands
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(0, r * cellH, 512, 2.5);

            for (let col = 0; col < cols; col++) {
                const wx = col * cellW + 3;
                const wy = r * cellH + 4;
                const ww = cellW - 6;
                const wh = cellH - 6;

                // Crisp white vertical mullions
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 1.2;
                ctx.strokeRect(wx, wy, ww, wh);

                // Lit interior office rooms (Sunny yellow, daylight, aqua)
                const rand = (col * 7 + r * 13) % 11;
                if (rand === 0) {
                    ctx.fillStyle = '#fff59d'; // Warm office light
                    ctx.fillRect(wx + 1, wy + 1, ww - 2, wh - 2);
                } else if (rand === 1) {
                    ctx.fillStyle = '#80d8ff'; // Cyan tech terminal
                    ctx.fillRect(wx + 1, wy + 1, ww - 2, wh - 2);
                } else if (rand === 2) {
                    ctx.fillStyle = '#f8fafc'; // Bright fluorescent
                    ctx.fillRect(wx + 1, wy + 1, ww - 2, wh - 2);
                }
            }
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    // 6. Teal / Aqua Modern Glass Tower Texture
    createTealAquaTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 512;
        const ctx = c.getContext('2d');

        // Deep teal-cyan gradient glass
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#00838f');
        grad.addColorStop(0.5, '#0097a7');
        grad.addColorStop(1, '#006064');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        const cols = 6;
        const rows = 12;
        const cellW = 512 / cols;
        const cellH = 512 / rows;

        for (let r = 0; r < rows; r++) {
            ctx.fillStyle = '#004d40';
            ctx.fillRect(0, r * cellH, 512, 3);

            for (let col = 0; col < cols; col++) {
                const wx = col * cellW + 4;
                const wy = r * cellH + 5;
                const ww = cellW - 8;
                const wh = cellH - 8;

                ctx.strokeStyle = '#b2ebf2';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(wx, wy, ww, wh);

                if ((col + r * 3) % 5 === 0) {
                    ctx.fillStyle = '#e0f7fa';
                    ctx.fillRect(wx + 2, wy + 2, ww - 4, wh - 4);
                }
            }
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    // 7. White Contemporary Architectural Tower with Ribbon Windows
    createWhiteModernTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 512;
        const ctx = c.getContext('2d');

        // Crisp white architectural concrete / composite panels
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, 512, 512);

        const rows = 10;
        const rowH = 512 / rows;

        for (let r = 0; r < rows; r++) {
            const ry = r * rowH;

            // Dark ribbon windows across the facade
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(16, ry + 12, 480, rowH - 24);

            // Window division panes & interior golden lights
            for (let x = 20; x < 490; x += 36) {
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(x, ry + 12, 2, rowH - 24);

                if ((x + r * 50) % 7 === 0) {
                    ctx.fillStyle = '#fef08a';
                    ctx.fillRect(x + 4, ry + 14, 28, rowH - 28);
                }
            }

            // Clean white balcony balustrades
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(14, ry + rowH - 8, 484, 6);
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    // 8. Warm Terracotta Brick (Rich red-brown residential masonry)
    createTerracottaBrickTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 512;
        const ctx = c.getContext('2d');

        // Deep warm red terracotta brick
        ctx.fillStyle = '#b71c1c';
        ctx.fillRect(0, 0, 512, 512);

        // Brick masonry coursing
        ctx.fillStyle = '#7f0000';
        for (let y = 0; y < 512; y += 8) {
            ctx.fillRect(0, y, 512, 1.5);
            const offset = (y / 8) % 2 === 0 ? 0 : 12;
            for (let x = offset; x < 512; x += 24) {
                ctx.fillRect(x, y, 1.5, 8);
            }
        }

        // Horizontal white limestone decorative trim
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 128, 512, 5);
        ctx.fillRect(0, 256, 512, 5);
        ctx.fillRect(0, 384, 512, 5);

        // Residential windows with warm amber glow
        const cols = 5;
        const rows = 8;
        const cellW = 512 / cols;
        const cellH = 512 / rows;

        for (let r = 0; r < rows; r++) {
            for (let col = 0; col < cols; col++) {
                const wx = col * cellW + 18;
                const wy = r * cellH + 16;
                const ww = cellW - 36;
                const wh = cellH - 30;

                // White window frame & sill
                ctx.fillStyle = '#f8fafc';
                ctx.fillRect(wx - 2, wy - 3, ww + 4, 3);
                ctx.fillRect(wx - 3, wy + wh, ww + 6, 4);

                // Warm interior room glow
                const glow = ctx.createRadialGradient(wx + ww / 2, wy + wh / 2, 2, wx + ww / 2, wy + wh / 2, ww);
                glow.addColorStop(0, '#fef08a');
                glow.addColorStop(0.6, '#f59e0b');
                glow.addColorStop(1, '#78350f');
                ctx.fillStyle = glow;
                ctx.fillRect(wx, wy, ww, wh);
            }
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    // 9. Vibrant Retail Podium (Saturated Cherry Red, Canary Yellow, Emerald, Cobalt Storefronts)
    createRetailPodiumTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 256;
        const ctx = c.getContext('2d');

        // Dark charcoal base
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, 512, 256);

        const storeConfigs = [
            { bg: '#d32f2f', sign: '#ffffff', title: 'SUPERMART 24H', awning: '#b71c1c' },
            { bg: '#fbc02d', sign: '#000000', title: 'CYBER ROAST CAFE', awning: '#f57f17' },
            { bg: '#2e7d32', sign: '#ffffff', title: 'METRO PHARMACY', awning: '#1b5e20' },
            { bg: '#1976d2', sign: '#ffffff', title: 'TECH GADGETS & VR', awning: '#0d47a1' }
        ];

        for (let i = 0; i < 4; i++) {
            const sx = i * 128;
            const cfg = storeConfigs[i];

            // Striped Colorful Fabric Awning
            ctx.fillStyle = cfg.awning;
            ctx.fillRect(sx + 4, 34, 120, 46);
            ctx.fillStyle = '#ffffff';
            for (let ax = sx + 8; ax < sx + 120; ax += 20) {
                ctx.fillRect(ax, 34, 10, 46);
            }
            ctx.fillStyle = cfg.bg;
            ctx.fillRect(sx + 4, 76, 120, 6);

            // Bright Illuminated Signboard
            ctx.fillStyle = cfg.bg;
            ctx.fillRect(sx + 6, 8, 116, 22);
            ctx.fillStyle = cfg.sign;
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(cfg.title, sx + 64, 23);

            // Large Warm Boutique Display Windows
            const winGrad = ctx.createLinearGradient(sx + 8, 88, sx + 8, 245);
            winGrad.addColorStop(0, '#fffbeb');
            winGrad.addColorStop(0.5, '#fef3c7');
            winGrad.addColorStop(1, '#fde68a');
            ctx.fillStyle = winGrad;
            ctx.fillRect(sx + 8, 88, 112, 155);

            // Mullions
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(sx + 8, 88, 112, 155);

            // Glass door
            ctx.fillStyle = '#334155';
            ctx.fillRect(sx + 48, 115, 32, 128);
            ctx.strokeStyle = '#cbd5e1';
            ctx.strokeRect(sx + 48, 115, 32, 128);
        }

        return new THREE.CanvasTexture(c);
    }

    // 10. Colorful Neon Advertising Billboards on Skyscraper Facades
    createBillboardTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 256;
        const ctx = c.getContext('2d');

        // Dark metal mounting frame
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 512, 256);

        // Left Billboard: Magenta Cyberpunk Tech Ad
        ctx.fillStyle = '#e11d48';
        ctx.fillRect(10, 10, 240, 236);
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 24px sans-serif';
        ctx.fillText('NEXUS AI', 30, 80);
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('NEXT-GEN CYBERNETICS', 30, 115);
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(30, 135, 120, 28);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('UPGRADE NOW', 40, 154);

        // Right Billboard: Cyan / Yellow Solaris Energy Ad
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(262, 10, 240, 236);
        ctx.fillStyle = '#facc15';
        ctx.font = '900 22px sans-serif';
        ctx.fillText('SOLARIS ENERGY', 282, 80);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('100% CLEAN METROPOLIS', 282, 115);
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(382, 175, 32, 0, Math.PI * 2);
        ctx.fill();

        this.billboardCanvas = c;
        this.billboardTexture = new THREE.CanvasTexture(c);
        return this.billboardTexture;
    }

    // 11. Modern Rooftop Helipad Texture (Red Cross / Yellow H)
    createHelipadTexture() {
        const c = document.createElement('canvas');
        c.width = 256;
        c.height = 256;
        const ctx = c.getContext('2d');

        // Dark grey rooftop pad
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, 0, 256, 256);

        // Yellow warning boundary circle
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(128, 128, 95, 0, Math.PI * 2);
        ctx.stroke();

        // White "H" Landing Mark
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(78, 68, 20, 120);
        ctx.fillRect(158, 68, 20, 120);
        ctx.fillRect(78, 118, 100, 20);

        // Corner red flight-path chevrons
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(16, 16, 28, 8);
        ctx.fillRect(16, 16, 8, 28);
        ctx.fillRect(212, 16, 28, 8);
        ctx.fillRect(232, 16, 8, 28);

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    // 12. Dark Industrial Gravel Roof Texture
    createRoofGravelTexture() {
        const c = document.createElement('canvas');
        c.width = 256;
        c.height = 256;
        const ctx = c.getContext('2d');

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, 256, 256);

        for (let i = 0; i < 4000; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const b = 38 + Math.random() * 25;
            ctx.fillStyle = `rgb(${b}, ${b+2}, ${b+4})`;
            ctx.fillRect(x, y, 2, 2);
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    // 16. Grayscale Bump Height Maps (window recesses & mullion relief for PBR depth)
    createBumpMaps() {
        const make = (w, h, drawFn) => {
            const c = document.createElement('canvas');
            c.width = w;
            c.height = h;
            const ctx = c.getContext('2d');
            ctx.fillStyle = '#808080';
            ctx.fillRect(0, 0, w, h);
            drawFn(ctx);
            const tex = new THREE.CanvasTexture(c);
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            return tex;
        };

        return {
            blue: make(512, 512, (ctx) => {
                const cols = 8, rows = 14;
                const cellW = 512 / cols, cellH = 512 / rows;
                for (let r = 0; r < rows; r++) {
                    ctx.fillStyle = '#c8c8c8';
                    ctx.fillRect(0, r * cellH, 512, 2.5);
                    for (let col = 0; col < cols; col++) {
                        const wx = col * cellW + 3;
                        const wy = r * cellH + 4;
                        ctx.fillStyle = '#3c3c3c';
                        ctx.fillRect(wx, wy, cellW - 6, cellH - 6);
                        ctx.strokeStyle = '#dcdcdc';
                        ctx.lineWidth = 1.4;
                        ctx.strokeRect(wx, wy, cellW - 6, cellH - 6);
                    }
                }
            }),
            teal: make(512, 512, (ctx) => {
                const cols = 6, rows = 12;
                const cellW = 512 / cols, cellH = 512 / rows;
                for (let r = 0; r < rows; r++) {
                    ctx.fillStyle = '#b0b0b0';
                    ctx.fillRect(0, r * cellH, 512, 3);
                    for (let col = 0; col < cols; col++) {
                        const wx = col * cellW + 4;
                        const wy = r * cellH + 5;
                        ctx.fillStyle = '#464646';
                        ctx.fillRect(wx, wy, cellW - 8, cellH - 8);
                        ctx.strokeStyle = '#c8c8c8';
                        ctx.lineWidth = 1.5;
                        ctx.strokeRect(wx, wy, cellW - 8, cellH - 8);
                    }
                }
            }),
            white: make(512, 512, (ctx) => {
                const rows = 10;
                const rowH = 512 / rows;
                for (let r = 0; r < rows; r++) {
                    const ry = r * rowH;
                    ctx.fillStyle = '#404040';
                    ctx.fillRect(16, ry + 12, 480, rowH - 24);
                    for (let x = 20; x < 490; x += 36) {
                        ctx.fillStyle = '#a0a0a0';
                        ctx.fillRect(x, ry + 12, 2, rowH - 24);
                    }
                    ctx.fillStyle = '#d0d0d0';
                    ctx.fillRect(14, ry + rowH - 8, 484, 6);
                }
            }),
            terra: make(512, 512, (ctx) => {
                ctx.fillStyle = '#9a9a9a';
                for (let y = 0; y < 512; y += 8) {
                    ctx.fillRect(0, y, 512, 1.5);
                }
                const cols = 5, rows = 8;
                const cellW = 512 / cols, cellH = 512 / rows;
                for (let r = 0; r < rows; r++) {
                    for (let col = 0; col < cols; col++) {
                        const wx = col * cellW + 18;
                        const wy = r * cellH + 16;
                        const ww = cellW - 36;
                        const wh = cellH - 30;
                        ctx.fillStyle = '#dcdcdc';
                        ctx.fillRect(wx - 3, wy + wh, ww + 6, 4);
                        ctx.fillRect(wx - 2, wy - 3, ww + 4, 3);
                        ctx.fillStyle = '#3a3a3a';
                        ctx.fillRect(wx, wy, ww, wh);
                    }
                }
            }),
            retail: make(512, 256, (ctx) => {
                for (let i = 0; i < 4; i++) {
                    const sx = i * 128;
                    ctx.fillStyle = '#b8b8b8';
                    ctx.fillRect(sx + 6, 8, 116, 22);
                    ctx.fillStyle = '#c4c4c4';
                    ctx.fillRect(sx + 4, 34, 120, 46);
                    ctx.fillStyle = '#3c3c3c';
                    ctx.fillRect(sx + 8, 88, 112, 155);
                    ctx.fillStyle = '#282828';
                    ctx.fillRect(sx + 48, 115, 32, 128);
                }
            })
        };
    }
    // 15. Emissive Night Maps (black facades with glowing lit windows for bloom)
    createEmissiveMaps() {
        const make = (w, h, drawFn) => {
            const c = document.createElement('canvas');
            c.width = w;
            c.height = h;
            const ctx = c.getContext('2d');
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, w, h);
            drawFn(ctx);
            const tex = new THREE.CanvasTexture(c);
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            return tex;
        };

        return {
            blue: make(512, 512, (ctx) => {
                const cols = 8, rows = 14;
                const cellW = 512 / cols, cellH = 512 / rows;
                for (let r = 0; r < rows; r++) {
                    for (let col = 0; col < cols; col++) {
                        const wx = col * cellW + 3;
                        const wy = r * cellH + 4;
                        const ww = cellW - 6;
                        const wh = cellH - 6;
                        const rand = (col * 7 + r * 13) % 11;
                        if (rand === 0) ctx.fillStyle = '#ffd98a';
                        else if (rand === 1) ctx.fillStyle = '#7fd8ff';
                        else if (rand === 2) ctx.fillStyle = '#e8f4ff';
                        else continue;
                        ctx.fillRect(wx + 1, wy + 1, ww - 2, wh - 2);
                    }
                }
            }),
            teal: make(512, 512, (ctx) => {
                const cols = 6, rows = 12;
                const cellW = 512 / cols, cellH = 512 / rows;
                for (let r = 0; r < rows; r++) {
                    for (let col = 0; col < cols; col++) {
                        if ((col + r * 3) % 5 !== 0) continue;
                        const wx = col * cellW + 4;
                        const wy = r * cellH + 5;
                        ctx.fillStyle = '#bff4ff';
                        ctx.fillRect(wx + 2, wy + 2, cellW - 12, cellH - 12);
                    }
                }
            }),
            white: make(512, 512, (ctx) => {
                const rows = 10;
                const rowH = 512 / rows;
                for (let r = 0; r < rows; r++) {
                    const ry = r * rowH;
                    for (let x = 20; x < 490; x += 36) {
                        if ((x + r * 50) % 7 !== 0) continue;
                        ctx.fillStyle = '#ffe58a';
                        ctx.fillRect(x + 4, ry + 14, 28, rowH - 28);
                    }
                }
            }),
            terra: make(512, 512, (ctx) => {
                const cols = 5, rows = 8;
                const cellW = 512 / cols, cellH = 512 / rows;
                for (let r = 0; r < rows; r++) {
                    for (let col = 0; col < cols; col++) {
                        const wx = col * cellW + 18;
                        const wy = r * cellH + 16;
                        const ww = cellW - 36;
                        const wh = cellH - 30;
                        const glow = ctx.createRadialGradient(wx + ww / 2, wy + wh / 2, 2, wx + ww / 2, wy + wh / 2, ww);
                        glow.addColorStop(0, '#ffe9b0');
                        glow.addColorStop(0.55, '#ffb45e');
                        glow.addColorStop(1, '#5c2c08');
                        ctx.fillStyle = glow;
                        ctx.fillRect(wx, wy, ww, wh);
                    }
                }
            }),
            retail: make(512, 256, (ctx) => {
                const storeColors = ['#ff5a5a', '#ffe14d', '#69f0ae', '#6ec2ff'];
                for (let i = 0; i < 4; i++) {
                    const sx = i * 128;
                    // Signboard glow
                    ctx.fillStyle = storeColors[i];
                    ctx.fillRect(sx + 6, 8, 116, 22);
                    // Warm display window glow
                    const winGrad = ctx.createLinearGradient(sx + 8, 88, sx + 8, 245);
                    winGrad.addColorStop(0, '#fff6d8');
                    winGrad.addColorStop(0.5, '#ffe9a8');
                    winGrad.addColorStop(1, '#ffd166');
                    ctx.fillStyle = winGrad;
                    ctx.fillRect(sx + 8, 88, 112, 155);
                    // Dark glass door cutout
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(sx + 48, 115, 32, 128);
                }
            })
        };
    }

    buildSkyAndClouds() {
        // Deep Midnight Starry Sky Dome
        const skyGeo = new THREE.SphereGeometry(2400, 32, 24);
        this.skyCanvas = document.createElement('canvas');
        this.skyCanvas.width = 256;
        this.skyCanvas.height = 512;
        const ctx = this.skyCanvas.getContext('2d');

        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0.0, '#020617'); // Cosmic midnight zenith
        grad.addColorStop(0.35, '#0a0f1d'); // Midnight navy
        grad.addColorStop(0.7, '#0f172a'); // Slate indigo
        grad.addColorStop(1.0, '#1e1b4b'); // Cyberpunk violet horizon
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 512);

        // Distant city light-pollution glow hugging the horizon
        const glowBand = ctx.createLinearGradient(0, 380, 0, 512);
        glowBand.addColorStop(0, 'rgba(120, 60, 180, 0)');
        glowBand.addColorStop(0.55, 'rgba(255, 90, 160, 0.16)');
        glowBand.addColorStop(1, 'rgba(255, 150, 80, 0.30)');
        ctx.fillStyle = glowBand;
        ctx.fillRect(0, 380, 256, 132);
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 450; i++) {
            const sx = Math.random() * 256;
            const sy = Math.random() * 340;
            const r = Math.random() < 0.15 ? 1.4 : 0.75;
            ctx.globalAlpha = 0.35 + Math.random() * 0.65;
            ctx.beginPath();
            ctx.arc(sx, sy, r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        // Luminous Cyberpunk Moon with Soft Halo
        const mx = 205;
        const my = 130;
        const mr = 20;
        const halo = ctx.createRadialGradient(mx, my, mr * 0.6, mx, my, mr * 3.4);
        halo.addColorStop(0, 'rgba(222, 236, 255, 0.95)');
        halo.addColorStop(0.35, 'rgba(150, 190, 255, 0.28)');
        halo.addColorStop(1, 'rgba(150, 190, 255, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(mx, my, mr * 3.4, 0, Math.PI * 2);
        ctx.fill();

        const disc = ctx.createRadialGradient(mx - 6, my - 6, 2, mx, my, mr);
        disc.addColorStop(0, '#f8faff');
        disc.addColorStop(0.75, '#d6e4ff');
        disc.addColorStop(1, '#9fb8e8');
        ctx.fillStyle = disc;
        ctx.beginPath();
        ctx.arc(mx, my, mr, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(148, 174, 216, 0.5)';
        ctx.beginPath(); ctx.arc(mx - 7, my - 2, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(mx + 5, my + 6, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(mx + 2, my - 9, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(mx - 3, my + 10, 2, 0, Math.PI * 2); ctx.fill();

        this.skyTex = new THREE.CanvasTexture(this.skyCanvas);
        this.skyMesh = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ map: this.skyTex, side: THREE.BackSide, fog: false }));
        this.scene.add(this.skyMesh);

        // Moody 3D Night Clouds (unlit silhouettes that blend into the night sky)
        const cloudMat = new THREE.MeshBasicMaterial({ color: 0x1a2440 });
        for (let i = 0; i < 22; i++) {
            const cloud = new THREE.Group();
            const puffs = 7 + Math.floor(Math.random() * 5);
            const scale = 2.6 + Math.random() * 2.2;

            for (let j = 0; j < puffs; j++) {
                const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(18 * scale, 1), cloudMat);
                puff.position.set((Math.random() - 0.5) * 65 * scale, (Math.random() * 16) * scale, (Math.random() - 0.5) * 50 * scale);
                puff.scale.set(1.4, 0.75, 1.1);
                cloud.add(puff);
            }
            cloud.position.set((Math.random() - 0.5) * 1400, 270 + Math.random() * 110, (Math.random() - 0.5) * 1400);
            this.scene.add(cloud);
            this.clouds.push(cloud);
        }
    }

    buildMountainBackdrop() {
        const mountainGroup = new THREE.Group();
        const mountainMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.85, flatShading: true });
        const rockPeakMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9, flatShading: true });

        // North Mountain Ridge
        for (let x = -600; x <= 500; x += 90) {
            const peakH = 160 + Math.sin(x * 0.02) * 60 + Math.random() * 45;
            const peakR = 95 + Math.random() * 35;
            const isHigh = peakH > 180;
            const peak = new THREE.Mesh(new THREE.ConeGeometry(peakR, peakH, 8), isHigh ? rockPeakMat : mountainMat);
            peak.position.set(x, peakH / 2 - 10, -700);
            peak.scale.set(1.4, 1.0, 1.2);
            mountainGroup.add(peak);
        }

        // West Mountain Ridge
        for (let z = -500; z <= 500; z += 100) {
            const peakH = 140 + Math.cos(z * 0.02) * 55 + Math.random() * 40;
            const peakR = 90 + Math.random() * 30;
            const peak = new THREE.Mesh(new THREE.ConeGeometry(peakR, peakH, 8), mountainMat);
            peak.position.set(-700, peakH / 2 - 10, z);
            peak.scale.set(1.2, 1.0, 1.4);
            mountainGroup.add(peak);
        }

        // Foothill Rock Barrier Ridge along perimeter
        const rockWallMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9, flatShading: true });
        for (let rx = -500; rx <= 500; rx += 25) {
            const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(8 + Math.random() * 4, 1), rockWallMat);
            rock.position.set(rx, 4, -495);
            rock.scale.set(1.4, 0.8, 1.2);
            rock.castShadow = true;
            mountainGroup.add(rock);
        }
        for (let rz = -500; rz <= 500; rz += 25) {
            const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(8 + Math.random() * 4, 1), rockWallMat);
            rock.position.set(-495, 4, rz);
            rock.scale.set(1.2, 0.8, 1.4);
            rock.castShadow = true;
            mountainGroup.add(rock);
        }

        this.scene.add(mountainGroup);

        // Solid Mountain & Map Perimeter Colliders (Completely impenetrable boundaries)
        this.addBoxCollider(0, -495, 1200, 30);  // North Mountain Wall
        this.addBoxCollider(-495, 0, 30, 1200);  // West Mountain Wall
        this.addBoxCollider(0, 495, 1200, 30);   // South Boundary Wall
        this.addBoxCollider(385, 0, 30, 1200);   // East Ocean Deep-Water Barrier
    }

    buildRoadsSidewalksAndLawns() {
        // Base ground plane: Rich emerald green park turf
        const baseGround = new THREE.Mesh(
            new THREE.PlaneGeometry(1300, 1300),
            new THREE.MeshStandardMaterial({ map: this.textures.lushGrass, roughness: 0.85 })
        );
        baseGround.rotation.x = -Math.PI / 2;
        baseGround.position.y = -0.02;
        baseGround.receiveShadow = true;
        this.scene.add(baseGround);
        this.walkableMeshes.push(baseGround);

        const roadMat = new THREE.MeshStandardMaterial({
            map: this.textures.darkAsphaltRoad,
            roughness: 0.7,
            metalness: 0.1
        });
        const swMat = new THREE.MeshStandardMaterial({
            map: this.textures.concreteSidewalk,
            roughness: 0.8
        });

        // =========================================================================
        // 1. GRAND CENTRAL BOULEVARD (ALONG X = 0, WHERE PLAYER SPAWNS AT (0, 0, 16))
        // =========================================================================
        // 4-Lane Dark Asphalt Avenue
        const mainAvenue = new THREE.Mesh(new THREE.PlaneGeometry(24, 1200), roadMat);
        mainAvenue.rotation.x = -Math.PI / 2;
        mainAvenue.position.set(0, 0.05, 0);
        mainAvenue.receiveShadow = true;
        this.scene.add(mainAvenue);
        this.walkableMeshes.push(mainAvenue);

        // Center Parkway Median (Width 5m: X = -2.5 to 2.5) with lush grass, curb & flowerbeds
        const medianCurbs = new THREE.Mesh(
            new THREE.BoxGeometry(5.0, 0.28, 1200),
            new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.75 })
        );
        medianCurbs.position.set(0, 0.14, 0);
        medianCurbs.receiveShadow = true;
        this.scene.add(medianCurbs);
        this.walkableMeshes.push(medianCurbs);

        const medianTurf = new THREE.Mesh(
            new THREE.BoxGeometry(4.4, 0.32, 1200),
            new THREE.MeshStandardMaterial({ map: this.textures.lushGrass, roughness: 0.85 })
        );
        medianTurf.position.set(0, 0.16, 0);
        medianTurf.receiveShadow = true;
        this.scene.add(medianTurf);
        this.walkableMeshes.push(medianTurf);

        // Trees & Benches along the Central Median strip
        const medianTreeMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.65 });
        const medianTrunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 });
        for (let mz = -540; mz <= 540; mz += 38) {
            // Keep player spawn at (0, 0, 16) clear
            if (Math.abs(mz - 16) < 12) continue;
            // Keep boss vault plaza at (0, -160) clear
            if (Math.abs(mz + 160) < 14) continue;

            const mTree = new THREE.Group();
            mTree.position.set(0, 0.3, mz);

            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 5.2, 8), medianTrunkMat);
            trunk.position.y = 2.6;
            trunk.castShadow = true;
            mTree.add(trunk);

            const canopy = new THREE.Mesh(new THREE.DodecahedronGeometry(2.6, 1), medianTreeMat);
            canopy.position.y = 5.4;
            canopy.scale.set(1.1, 1.2, 1.1);
            canopy.castShadow = true;
            mTree.add(canopy);

            this.scene.add(mTree);
            this.addBoxCollider(0, mz, 1.0, 1.0); // Solid tree trunk collider
        }

        // Wide Sidewalks on Both Sides of Grand Central Boulevard
        // West Sidewalk (X = -15) & East Sidewalk (X = 15)
        [-15, 15].forEach(swX => {
            const sw = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.25, 1200), swMat);
            sw.position.set(swX, 0.125, 0);
            sw.receiveShadow = true;
            this.scene.add(sw);
            this.walkableMeshes.push(sw);
        });

        // =========================================================================
        // 2. ADDITIONAL CITY GRID AVENUES (NORTH-SOUTH)
        // =========================================================================
        const otherAvenues = [-400, -260, -130, 130];
        otherAvenues.forEach(ax => {
            const avMesh = new THREE.Mesh(new THREE.PlaneGeometry(18, 1200), roadMat);
            avMesh.rotation.x = -Math.PI / 2;
            avMesh.position.set(ax, 0.05, 0);
            avMesh.receiveShadow = true;
            this.scene.add(avMesh);
            this.walkableMeshes.push(avMesh);

            [-11, 11].forEach(swOffset => {
                const sw = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.25, 1200), swMat);
                sw.position.set(ax + swOffset, 0.125, 0);
                sw.receiveShadow = true;
                this.scene.add(sw);
                this.walkableMeshes.push(sw);
            });
        });

        // 3. Coastal Highway (Along X = 200)
        const hwMesh = new THREE.Mesh(new THREE.PlaneGeometry(26, 1200), roadMat);
        hwMesh.rotation.x = -Math.PI / 2;
        hwMesh.position.set(200, 0.05, 0);
        hwMesh.receiveShadow = true;
        this.scene.add(hwMesh);
        this.walkableMeshes.push(hwMesh);

        // Highway Concrete Barriers & Collider
        const guardMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
        const guard = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 1200), guardMat);
        guard.position.set(213, 0.5, 0);
        guard.castShadow = true;
        this.scene.add(guard);
        this.addBoxCollider(213, 0, 0.8, 1200);

        // =========================================================================
        // 4. CROSS STREETS & PEDESTRIAN ZEBRA CROSSINGS (EAST-WEST)
        // =========================================================================
        const crossStreets = [-450, -320, -190, -60, 70, 200, 330, 460];
        const zebraMat = new THREE.MeshStandardMaterial({ map: this.textures.zebraCrosswalk, roughness: 0.8 });

        crossStreets.forEach(sz => {
            const stTex = this.textures.darkAsphaltRoad.clone();
            stTex.repeat.set(1, 10);
            stTex.needsUpdate = true;
            const stMat = new THREE.MeshStandardMaterial({ map: stTex, roughness: 0.7 });

            const stMesh = new THREE.Mesh(new THREE.PlaneGeometry(16, 680), stMat);
            stMesh.rotation.x = -Math.PI / 2;
            stMesh.rotation.z = Math.PI / 2;
            stMesh.position.set(-80, 0.06, sz);
            stMesh.receiveShadow = true;
            this.scene.add(stMesh);
            this.walkableMeshes.push(stMesh);

            // Zebra Crossings at Central Boulevard intersection
            [-8, 8].forEach(crossZOffset => {
                const zebra = new THREE.Mesh(new THREE.PlaneGeometry(24, 4), zebraMat);
                zebra.rotation.x = -Math.PI / 2;
                zebra.position.set(0, 0.08, sz + crossZOffset);
                zebra.receiveShadow = true;
                this.scene.add(zebra);
            });

            // Traffic Signal Posts at Intersections
            this.buildIntersectionTrafficLights(sz);
        });
    }

    buildIntersectionTrafficLights(sz) {
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.2 });
        const housingMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });

        // Place 2 traffic light gantries at each major intersection
        [-13, 13].forEach((tx, idx) => {
            const gantry = new THREE.Group();
            gantry.position.set(tx, 0, sz + (idx === 0 ? -10 : 10));

            // Vertical pole
            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 7.5, 8), poleMat);
            pole.position.y = 3.75;
            pole.castShadow = true;
            gantry.add(pole);

            // Overhead cantilever arm
            const arm = new THREE.Mesh(new THREE.BoxGeometry(idx === 0 ? 9.5 : -9.5, 0.2, 0.2), poleMat);
            arm.position.set(idx === 0 ? 4.5 : -4.5, 7.2, 0);
            gantry.add(arm);

            // Traffic light head
            const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.8, 0.5), housingMat);
            head.position.set(idx === 0 ? 6.5 : -6.5, 6.8, 0);
            head.castShadow = true;
            gantry.add(head);

            // Glowing Green signal
            const greenLens = new THREE.Mesh(
                new THREE.SphereGeometry(0.2, 8, 8),
                new THREE.MeshStandardMaterial({ color: 0x00e676, emissive: 0x00e676, emissiveIntensity: 0.9 })
            );
            greenLens.position.set(idx === 0 ? 6.5 : -6.5, 6.2, 0.26);
            gantry.add(greenLens);

            // Yellow signal
            const yellowLens = new THREE.Mesh(
                new THREE.SphereGeometry(0.18, 8, 8),
                new THREE.MeshStandardMaterial({ color: 0x332a00 })
            );
            yellowLens.position.set(idx === 0 ? 6.5 : -6.5, 6.8, 0.26);
            gantry.add(yellowLens);

            // Red signal
            const redLens = new THREE.Mesh(
                new THREE.SphereGeometry(0.18, 8, 8),
                new THREE.MeshStandardMaterial({ color: 0x3a0d0d })
            );
            redLens.position.set(idx === 0 ? 6.5 : -6.5, 7.4, 0.26);
            gantry.add(redLens);

            this.scene.add(gantry);
            this.addBoxCollider(tx, sz + (idx === 0 ? -10 : 10), 0.6, 0.6);
        });
    }

    buildWaterfrontHarborAndPiers() {
        // Coastal Ocean Bay (X = 220 to 680) - Deep Azure Marina Water
        const waterGeo = new THREE.PlaneGeometry(460, 1260);
        const waterMat = new THREE.MeshStandardMaterial({
            color: 0x0284c7, // Vibrant maritime azure
            roughness: 0.15,
            metalness: 0.85
        });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.rotation.x = -Math.PI / 2;
        water.position.set(440, -0.6, 0);
        this.scene.add(water);
        this.waterMesh = water;

        // Seawall Promenade with Flagstone paving (Aligned to sidewalk level y = 0.25)
        const promenade = new THREE.Mesh(
            new THREE.BoxGeometry(18, 1.2, 1200),
            new THREE.MeshStandardMaterial({ map: this.textures.concreteSidewalk, roughness: 0.85 })
        );
        promenade.position.set(221, -0.35, 0);
        promenade.castShadow = true;
        promenade.receiveShadow = true;
        this.scene.add(promenade);
        this.walkableMeshes.push(promenade);
        this.addBoxCollider(229, 0, 2, 1200); // Seawall drop-off collider

        // 6 Walkable Finger Piers (Aligned to promenade height y = 0.25)
        const pierZs = [-350, -210, -70, 70, 210, 350];
        const pierWoodMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 });

        pierZs.forEach((pz, idx) => {
            const pierLen = (idx === 1 || idx === 3) ? 120 : 95;
            const pierW = (idx === 1 || idx === 3) ? 22 : 18;

            const pier = new THREE.Group();
            pier.position.set(220 + pierLen / 2, -0.35, pz);

            const deck = new THREE.Mesh(new THREE.BoxGeometry(pierLen, 1.2, pierW), pierWoodMat);
            deck.position.y = 0;
            deck.castShadow = true;
            deck.receiveShadow = true;
            pier.add(deck);
            this.walkableMeshes.push(deck);

            // Pilings
            for (let px = -pierLen / 2 + 8; px < pierLen / 2; px += 16) {
                [-pierW / 2 + 1.5, pierW / 2 - 1.5].forEach(pzOff => {
                    const piling = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 3.8, 8), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
                    piling.position.set(px, -1.5, pzOff);
                    pier.add(piling);
                });
            }

            this.scene.add(pier);
        });
    }

    buildOceanCruiseLiner() {
        // 140m Luxury Ocean Cruise Liner docked at Pier 2
        const ship = new THREE.Group();
        ship.position.set(315, 0, -188);

        const hullMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.5 });
        const whiteSuperMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.1 });
        const funnelMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35 });

        const hull = new THREE.Mesh(new THREE.BoxGeometry(138, 7.5, 21), hullMat);
        hull.position.y = 2.8;
        hull.castShadow = true;
        ship.add(hull);

        const bow = new THREE.Mesh(new THREE.ConeGeometry(12, 28, 4), hullMat);
        bow.rotateZ(-Math.PI / 2);
        bow.rotateY(Math.PI / 4);
        bow.position.set(78, 3.2, 0);
        bow.scale.set(0.6, 1.0, 0.9);
        bow.castShadow = true;
        ship.add(bow);

        const cabins1 = new THREE.Mesh(new THREE.BoxGeometry(105, 4.5, 18.5), whiteSuperMat);
        cabins1.position.set(-6, 9.4, 0);
        cabins1.castShadow = true;
        ship.add(cabins1);

        const cabins2 = new THREE.Mesh(new THREE.BoxGeometry(92, 4.2, 17.5), whiteSuperMat);
        cabins2.position.set(-10, 13.6, 0);
        cabins2.castShadow = true;
        ship.add(cabins2);

        [-2, -32].forEach(fx => {
            const funnel = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.6, 8.5, 16), funnelMat);
            funnel.position.set(fx, 20.8, 0);
            funnel.scale.set(1.4, 1.0, 0.85);
            funnel.castShadow = true;
            ship.add(funnel);
        });

        // Walkable Gangway
        const gangway = new THREE.Mesh(new THREE.BoxGeometry(16, 0.6, 3.5), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
        gangway.position.set(-20, 6.7, -13);
        gangway.rotateY(Math.PI / 6);
        ship.add(gangway);

        this.scene.add(ship);
        this.addBoxCollider(315, -188, 138, 21); // Solid ship hull collider
    }

    buildCargoContainerShip() {
        // 120m Cargo Container Ship docked at Pier 4
        const ship = new THREE.Group();
        ship.position.set(310, 0, 92);

        const hullMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5 });
        const superMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
        const colors = [0x2563eb, 0xdc2626, 0x16a34a, 0xf59e0b];

        const hull = new THREE.Mesh(new THREE.BoxGeometry(118, 6.5, 19), hullMat);
        hull.position.y = 2.4;
        hull.castShadow = true;
        ship.add(hull);

        const bridge = new THREE.Mesh(new THREE.BoxGeometry(16, 14, 17), superMat);
        bridge.position.set(-42, 10.0, 0);
        bridge.castShadow = true;
        ship.add(bridge);

        let cIdx = 0;
        for (let x = -26; x <= 42; x += 12) {
            for (let z = -6.5; z <= 6.5; z += 4.5) {
                for (let y = 6.2; y <= 11.0; y += 2.6) {
                    const c = new THREE.Mesh(new THREE.BoxGeometry(11.2, 2.4, 4.0), new THREE.MeshStandardMaterial({ color: colors[(cIdx++) % colors.length] }));
                    c.position.set(x, y, z);
                    c.castShadow = true;
                    ship.add(c);
                }
            }
        }

        this.scene.add(ship);
        this.addBoxCollider(310, 92, 118, 19); // Solid cargo ship collider
    }

    buildTexturedCityBlocks() {
        // High-Color Materials matching Cities: Skylines
        const matBlue = new THREE.MeshStandardMaterial({ map: this.textures.blueGlassTower, roughness: 0.25, metalness: 0.75 });
        const matTeal = new THREE.MeshStandardMaterial({ map: this.textures.tealAquaTower, roughness: 0.3, metalness: 0.7 });
        const matWhite = new THREE.MeshStandardMaterial({ map: this.textures.whiteModernTower, roughness: 0.5, metalness: 0.2 });
        const matTerra = new THREE.MeshStandardMaterial({ map: this.textures.terracottaBrick, roughness: 0.75 });
        const matRetail = new THREE.MeshStandardMaterial({ map: this.textures.colorfulRetailPodium, roughness: 0.5 });
        const matBillboard = new THREE.MeshStandardMaterial({ map: this.textures.billboardAds, roughness: 0.4 });
        const matHelipad = new THREE.MeshStandardMaterial({ map: this.textures.helipadRoof, roughness: 0.8 });
        const matRoof = new THREE.MeshStandardMaterial({ map: this.textures.roofGravel, roughness: 0.9 });

        // Emissive night windows for neon bloom
        const applyEmissive = (mat, tex, intensity) => {
            mat.emissive = new THREE.Color(0xffffff);
            mat.emissiveMap = tex;
            mat.emissiveIntensity = intensity;
        };
        applyEmissive(matBlue, this.textures.emissiveBlue, 0.9);
        applyEmissive(matTeal, this.textures.emissiveTeal, 0.95);
        applyEmissive(matWhite, this.textures.emissiveWhite, 0.85);
        applyEmissive(matTerra, this.textures.emissiveTerra, 0.9);
        applyEmissive(matRetail, this.textures.emissiveRetail, 0.75);

        // Bump relief for realistic facade depth
        const applyBump = (mat, tex, scale) => {
            mat.bumpMap = tex;
            mat.bumpScale = scale;
        };
        applyBump(matBlue, this.textures.bumpBlue, 0.35);
        applyBump(matTeal, this.textures.bumpTeal, 0.35);
        applyBump(matWhite, this.textures.bumpWhite, 0.3);
        applyBump(matTerra, this.textures.bumpTerra, 0.45);
        applyBump(matRetail, this.textures.bumpRetail, 0.3);

        // =========================================================================
        // 1. LANDMARK SKYSCRAPERS (FINANCIAL DISTRICT)
        // =========================================================================
        // A. 165m Art Deco Chrysler-Style Spire Tower
        this.buildArtDecoSpireTower(55, -80, matBlue, matWhite);

        // B. 125m Twin Tower Tech Center with Skybridge
        this.buildTwinTowersWithSkybridge(-65, -170, matBlue, matWhite);

        // C. 110m Crystal Aqua Mega-Tower
        this.buildCrystalMegaTower(65, -220, matTeal);

        // D. Modern Hospital / Corporate HQ with Rooftop Helipad
        this.buildHelipadHospitalComplex(-65, 30, matWhite, matHelipad);

        // =========================================================================
        // 2. VIBRANT BOULEVARD COMMERCIAL CORRIDOR (LINING GRAND CENTRAL AVENUE)
        // =========================================================================
        // Placed along West side (X = -32) and East side (X = 32)
        // Leaving the center avenue (X = -18 to 18) wide open for maximum visibility!
        const boulevardCorridor = [
            // West Corridor (X = -34)
            { x: -34, z: -35, w: 26, d: 24, h: 68, type: 'blue', billboard: true },
            { x: -34, z: 25, w: 26, d: 24, h: 54, type: 'retail', billboard: false },
            { x: -34, z: 85, w: 26, d: 26, h: 72, type: 'white', billboard: true },
            { x: -34, z: 145, w: 26, d: 24, h: 48, type: 'terra', billboard: false },
            { x: -34, z: -95, w: 26, d: 26, h: 84, type: 'teal', billboard: false },
            { x: -34, z: -155, w: 26, d: 26, h: 96, type: 'blue', billboard: true },

            // East Corridor (X = 34)
            { x: 34, z: -35, w: 26, d: 24, h: 74, type: 'teal', billboard: true },
            { x: 34, z: 25, w: 26, d: 24, h: 56, type: 'retail', billboard: false },
            { x: 34, z: 85, w: 26, d: 26, h: 64, type: 'blue', billboard: true },
            { x: 34, z: 145, w: 26, d: 24, h: 52, type: 'terra', billboard: false },
            { x: 34, z: -155, w: 26, d: 26, h: 88, type: 'white', billboard: false }
        ];

        // =========================================================================
        // 3. MID-TOWN & DOWNTOWN BLOCKS (DENSE COLORFUL METROPOLIS)
        // =========================================================================
        const midTownBlocks = [
            // Block Group 1 (X: -110 to -60)
            { x: -95, z: -35, w: 32, d: 28, h: 86, type: 'blue' },
            { x: -95, z: 85, w: 30, d: 28, h: 76, type: 'white' },
            { x: -95, z: 155, w: 30, d: 26, h: 62, type: 'terra' },
            { x: -95, z: -250, w: 34, d: 30, h: 92, type: 'teal' },

            // Block Group 2 (X: 80 to 140)
            { x: 105, z: -35, w: 32, d: 28, h: 90, type: 'white' },
            { x: 105, z: 85, w: 30, d: 28, h: 68, type: 'teal' },
            { x: 105, z: 155, w: 30, d: 26, h: 58, type: 'terra' },
            { x: 105, z: -250, w: 34, d: 30, h: 98, type: 'blue' },

            // High-Rise Core (Z = -280 to -440)
            { x: -35, z: -330, w: 36, d: 32, h: 110, type: 'blue' },
            { x: 35, z: -330, w: 36, d: 32, h: 105, type: 'teal' },
            { x: -95, z: -360, w: 32, d: 30, h: 88, type: 'white' },
            { x: 95, z: -360, w: 32, d: 30, h: 92, type: 'blue' }
        ];

        // Combine all building structures
        const allBuildings = [...boulevardCorridor, ...midTownBlocks];

        // Additional infill residential and commercial buildings across the 1.2km map
        for (let bx = -170; bx <= 160; bx += 55) {
            for (let bz = -460; bz <= 380; bz += 60) {
                // Keep the Grand Central Avenue corridor (X = -22 to 22) clear for player and traffic!
                if (Math.abs(bx) < 26) continue;
                // Avoid overlapping defined landmark coordinates
                if (Math.abs(bx - 55) < 30 && Math.abs(bz + 80) < 30) continue;
                if (Math.abs(bx + 65) < 30 && Math.abs(bz + 170) < 30) continue;
                if (Math.abs(bx - 65) < 30 && Math.abs(bz + 220) < 30) continue;
                if (Math.abs(bx + 65) < 30 && Math.abs(bz - 30) < 30) continue;
                if (Math.abs(bx + 320) < 180 && Math.abs(bz) < 260) continue; // Central park clearance

                const types = ['blue', 'teal', 'white', 'terra', 'retail'];
                const curType = types[Math.floor(Math.random() * types.length)];
                const h = (bz < -100) ? (55 + Math.floor(Math.random() * 55)) : (36 + Math.floor(Math.random() * 38));

                allBuildings.push({
                    x: bx,
                    z: bz,
                    w: 26 + Math.floor(Math.random() * 8),
                    d: 26 + Math.floor(Math.random() * 8),
                    h: h,
                    type: curType,
                    billboard: Math.random() > 0.65
                });
            }
        }

        const parapetMat = new THREE.MeshStandardMaterial({ color: 0x334155 });

        allBuildings.forEach(b => {
            let facadeMat;
            if (b.type === 'blue') facadeMat = matBlue;
            else if (b.type === 'teal') facadeMat = matTeal;
            else if (b.type === 'white') facadeMat = matWhite;
            else if (b.type === 'terra') facadeMat = matTerra;
            else facadeMat = matWhite; // Retail towers: white apartments above the colorful storefront podium

            const bGroup = new THREE.Group();
            bGroup.position.set(b.x, 0, b.z);

            // Ground floor colorful retail podium for avenue buildings
            if (b.h > 45) {
                const podium = new THREE.Mesh(new THREE.BoxGeometry(b.w + 1.2, 8, b.d + 1.2), matRetail);
                podium.position.y = 4;
                podium.castShadow = true;
                podium.receiveShadow = true;
                bGroup.add(podium);
            }

            // Tower main body — stepped setback tiers for realistic skyscraper silhouettes
            let topW = b.w;
            let topD = b.d;
            let baseTierH = b.h;
            let tierSpecs = null;
            if (b.h >= 90) {
                tierSpecs = [
                    { scale: 1.0, y0: 0, y1: Math.round(b.h * 0.45) },
                    { scale: 0.8, y0: Math.round(b.h * 0.45), y1: Math.round(b.h * 0.75) },
                    { scale: 0.6, y0: Math.round(b.h * 0.75), y1: b.h }
                ];
            } else if (b.h >= 60) {
                tierSpecs = [
                    { scale: 1.0, y0: 0, y1: Math.round(b.h * 0.55) },
                    { scale: 0.7, y0: Math.round(b.h * 0.55), y1: b.h }
                ];
            }

            if (tierSpecs) {
                tierSpecs.forEach(tier => {
                    const tw = b.w * tier.scale;
                    const td = b.d * tier.scale;
                    const th = tier.y1 - tier.y0;
                    const tierMesh = new THREE.Mesh(new THREE.BoxGeometry(tw, th, td), facadeMat);
                    tierMesh.position.y = tier.y0 + th / 2;
                    tierMesh.castShadow = true;
                    tierMesh.receiveShadow = true;
                    bGroup.add(tierMesh);

                    if (tier.y1 < b.h) {
                        const band = new THREE.Mesh(new THREE.BoxGeometry(tw + 0.6, 1.0, td + 0.6), parapetMat);
                        band.position.y = tier.y1 + 0.4;
                        band.castShadow = true;
                        bGroup.add(band);
                    }
                });
                const topSpec = tierSpecs[tierSpecs.length - 1];
                topW = b.w * topSpec.scale;
                topD = b.d * topSpec.scale;
                baseTierH = tierSpecs[0].y1;
            } else {
                const mesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), facadeMat);
                mesh.position.y = b.h / 2;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                bGroup.add(mesh);
            }

            // Roof & Parapet (sized to the topmost tier)
            const roof = new THREE.Mesh(new THREE.BoxGeometry(topW, 0.6, topD), matRoof);
            roof.position.y = b.h + 0.3;
            bGroup.add(roof);

            const parapet = new THREE.Mesh(
                new THREE.BoxGeometry(topW + 0.8, 1.4, topD + 0.8),
                parapetMat
            );
            parapet.position.y = b.h + 0.7;
            parapet.castShadow = true;
            bGroup.add(parapet);

            // Rooftop HVAC Units, Satellite Dishes, and Water Tanks
            if (b.h > 48) {
                const ac = new THREE.Mesh(
                    new THREE.BoxGeometry(topW * 0.35, 2.8, topD * 0.3),
                    new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85, roughness: 0.25 })
                );
                ac.position.set(topW * 0.15, b.h + 1.9, -topD * 0.15);
                bGroup.add(ac);

                const tank = new THREE.Mesh(
                    new THREE.CylinderGeometry(2.4, 2.4, 4.6, 12),
                    new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.85 })
                );
                tank.position.set(-topW * 0.2, b.h + 3.6, topD * 0.2);
                bGroup.add(tank);
            }

            // Colorful Illuminated Billboard Poster on facade
            if (b.billboard && b.h > 40) {
                const bb = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), matBillboard);
                // Face towards central avenue (X = 0)
                if (b.x < 0) {
                    bb.rotation.y = Math.PI / 2;
                    bb.position.set(b.w / 2 + 0.1, 24, 0);
                } else {
                    bb.rotation.y = -Math.PI / 2;
                    bb.position.set(-b.w / 2 - 0.1, 24, 0);
                }
                bGroup.add(bb);
            }

            // Neon corner light strips on tall towers (base tier height)
            if (b.h >= 70) {
                const neonCyan = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
                const neonPink = new THREE.MeshBasicMaterial({ color: 0xff2d95 });
                const stripGeo = new THREE.BoxGeometry(0.5, baseTierH, 0.5);
                const stripA = new THREE.Mesh(stripGeo, neonCyan);
                stripA.position.set(-b.w / 2 - 0.3, baseTierH / 2, -b.d / 2 - 0.3);
                const stripB = new THREE.Mesh(stripGeo, neonPink);
                stripB.position.set(b.w / 2 + 0.3, baseTierH / 2, b.d / 2 + 0.3);
                bGroup.add(stripA);
                bGroup.add(stripB);
            }

            // Blinking aviation rooftop beacon
            if (b.h >= 85) {
                const beacon = new THREE.Mesh(
                    new THREE.SphereGeometry(1.1, 8, 8),
                    new THREE.MeshBasicMaterial({ color: 0xff3333 })
                );
                beacon.position.set(0, b.h + 3.2, 0);
                bGroup.add(beacon);
                this.beacons.push({ mesh: beacon, phase: Math.random() * Math.PI * 2, speed: 1.4 + Math.random() * 1.2 });
            }

            this.scene.add(bGroup);

            // Register Solid Bounding Box Collider (Prevents player clipping into walls!)
            this.addBoxCollider(b.x, b.z, b.w + 1.2, b.d + 1.2);
        });
    }

    buildArtDecoSpireTower(x, z, blueMat, whiteMat) {
        const g = new THREE.Group();
        g.position.set(x, 0, z);

        const chromeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.95, roughness: 0.1 });

        const base = new THREE.Mesh(new THREE.BoxGeometry(36, 26, 36), whiteMat);
        base.position.y = 13;
        base.castShadow = true;
        g.add(base);

        const t2 = new THREE.Mesh(new THREE.BoxGeometry(28, 48, 28), blueMat);
        t2.position.y = 50;
        t2.castShadow = true;
        g.add(t2);

        const t3 = new THREE.Mesh(new THREE.BoxGeometry(22, 44, 22), blueMat);
        t3.position.y = 96;
        t3.castShadow = true;
        g.add(t3);

        const t4 = new THREE.Mesh(new THREE.BoxGeometry(16, 28, 16), whiteMat);
        t4.position.y = 132;
        t4.castShadow = true;
        g.add(t4);

        const crown = new THREE.Mesh(new THREE.ConeGeometry(9, 15, 4), chromeMat);
        crown.rotateY(Math.PI / 4);
        crown.position.y = 153;
        crown.castShadow = true;
        g.add(crown);

        const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 1.2, 26, 8), chromeMat);
        spire.position.y = 173;
        g.add(spire);

        const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff1744 }));
        beacon.position.y = 186;
        g.add(beacon);

        this.scene.add(g);
        this.addBoxCollider(x, z, 36, 36);
    }

    buildTwinTowersWithSkybridge(x, z, blueMat, whiteMat) {
        const g = new THREE.Group();
        g.position.set(x, 0, z);

        // Tower A
        const towerA = new THREE.Mesh(new THREE.BoxGeometry(22, 120, 22), blueMat);
        towerA.position.set(-16, 60, 0);
        towerA.castShadow = true;
        g.add(towerA);

        // Tower B
        const towerB = new THREE.Mesh(new THREE.BoxGeometry(22, 120, 22), blueMat);
        towerB.position.set(16, 60, 0);
        towerB.castShadow = true;
        g.add(towerB);

        // Skybridge at 85m height
        const skybridge = new THREE.Mesh(new THREE.BoxGeometry(32, 6, 8), whiteMat);
        skybridge.position.set(0, 85, 0);
        skybridge.castShadow = true;
        g.add(skybridge);

        this.scene.add(g);
        this.addBoxCollider(x - 16, z, 22, 22);
        this.addBoxCollider(x + 16, z, 22, 22);
    }

    buildCrystalMegaTower(x, z, glassMat) {
        const g = new THREE.Group();
        g.position.set(x, 0, z);

        const tower = new THREE.Mesh(new THREE.CylinderGeometry(14, 24, 115, 8), glassMat);
        tower.position.y = 57.5;
        tower.castShadow = true;
        tower.receiveShadow = true;
        g.add(tower);

        this.scene.add(g);
        this.addBoxCollider(x, z, 26, 26);
    }

    buildHelipadHospitalComplex(x, z, whiteMat, helipadMat) {
        const g = new THREE.Group();
        g.position.set(x, 0, z);

        // Modern curved medical & tech center
        const main = new THREE.Mesh(new THREE.BoxGeometry(38, 36, 34), whiteMat);
        main.position.y = 18;
        main.castShadow = true;
        g.add(main);

        // Rooftop Helipad Pad
        const heliPad = new THREE.Mesh(new THREE.CylinderGeometry(14, 14, 1.2, 24), helipadMat);
        heliPad.position.set(0, 36.6, 0);
        heliPad.castShadow = true;
        g.add(heliPad);

        this.scene.add(g);
        this.addBoxCollider(x, z, 38, 34);
    }

    buildFlatironLandmarkBuilding() {
        // Triangular Flatiron-Style Skyscraper at Avenue Fork (X = 0, Z = -180)
        const g = new THREE.Group();
        g.position.set(0, 0, -180);

        const stoneMat = new THREE.MeshStandardMaterial({ map: this.textures.blueGlassTower, roughness: 0.3, metalness: 0.7 });

        const t1 = new THREE.Mesh(new THREE.BoxGeometry(22, 54, 18), stoneMat);
        t1.position.y = 27;
        t1.castShadow = true;
        g.add(t1);

        const t2 = new THREE.Mesh(new THREE.BoxGeometry(16, 26, 14), stoneMat);
        t2.position.y = 67;
        t2.castShadow = true;
        g.add(t2);

        this.scene.add(g);
        this.addBoxCollider(0, -180, 22, 18);
    }

    buildCentralParkDistrict() {
        const parkGroup = new THREE.Group();
        parkGroup.position.set(-320, 0, 0);

        // Saturated park lawn
        const turf = new THREE.Mesh(
            new THREE.BoxGeometry(310, 0.4, 490),
            new THREE.MeshStandardMaterial({ map: this.textures.lushGrass, roughness: 0.9 })
        );
        turf.position.y = 0.2;
        turf.receiveShadow = true;
        parkGroup.add(turf);

        // Azure Lake
        const lakeMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.15, metalness: 0.85 });
        const lake = new THREE.Mesh(new THREE.CylinderGeometry(36, 42, 0.6, 24), lakeMat);
        lake.position.set(0, 0.3, 0);
        parkGroup.add(lake);

        // Paved Walking Paths
        const pathMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.85 });
        const mainPath = new THREE.Mesh(new THREE.BoxGeometry(12, 0.45, 480), pathMat);
        mainPath.position.set(0, 0.23, 0);
        mainPath.receiveShadow = true;
        parkGroup.add(mainPath);

        const crossPath = new THREE.Mesh(new THREE.BoxGeometry(300, 0.45, 10), pathMat);
        crossPath.position.set(0, 0.23, 0);
        crossPath.receiveShadow = true;
        parkGroup.add(crossPath);

        this.walkableMeshes.push(turf);
        this.walkableMeshes.push(mainPath);
        this.walkableMeshes.push(crossPath);

        // 120+ Lush Green Park Trees with Varied Canopy Tones
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 });
        const treeTones = [0x2e7d32, 0x388e3c, 0x43a047, 0x1b5e20];

        for (let i = 0; i < 110; i++) {
            const tx = (Math.random() - 0.5) * 280;
            const tz = (Math.random() - 0.5) * 450;
            if (Math.hypot(tx, tz) < 45) continue;

            const tree = new THREE.Group();
            tree.position.set(tx, 0.4, tz);

            const th = 8 + Math.random() * 6;
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, th, 8), trunkMat);
            trunk.position.y = th / 2;
            trunk.castShadow = true;
            tree.add(trunk);

            const canopyColor = treeTones[Math.floor(Math.random() * treeTones.length)];
            const canopy = new THREE.Mesh(
                new THREE.DodecahedronGeometry(3.8 + Math.random() * 2.2, 1),
                new THREE.MeshStandardMaterial({ color: canopyColor, roughness: 0.65 })
            );
            canopy.position.y = th + 2.6;
            canopy.scale.set(1.1, 1.25, 1.1);
            canopy.castShadow = true;
            tree.add(canopy);

            parkGroup.add(tree);
        }

        this.scene.add(parkGroup);
    }

    buildStreetPropsAndLighting() {
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
        const lampHeadMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
        const lightGlowMat = new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffb703, emissiveIntensity: 2.2 });
        this.streetLightMaterials.push(lightGlowMat);

        // Streetlights along Sidewalks of Grand Central Boulevard (X = -13 and X = 13)
        for (let lz = -480; lz <= 480; lz += 35) {
            [-13, 13].forEach(lx => {
                // Keep crypto terminal spot at (-14, 10) clear
                if (lx === -13 && lz === 10) return;

                const lamp = new THREE.Group();
                lamp.position.set(lx, 0, lz);
                lamp.rotation.y = (lx < 0) ? 0 : Math.PI;

                const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 6.2, 8), poleMat);
                pole.position.y = 3.1;
                pole.castShadow = true;
                lamp.add(pole);

                const arm = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 0.2), poleMat);
                arm.position.set(0.8, 6.1, 0);
                lamp.add(arm);

                const head = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 0.45), lampHeadMat);
                head.position.set(1.5, 6.1, 0);
                lamp.add(head);

                const panel = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.05, 0.35), lightGlowMat);
                panel.position.set(1.5, 5.95, 0);
                lamp.add(panel);

                if (Math.abs(lz) % 70 === 0) {
                    const streetP = new THREE.PointLight(0xffb703, 1.2, 28);
                    streetP.position.set(1.5, 5.5, 0);
                    lamp.add(streetP);
                    this.streetPointLights.push(streetP);
                }

                this.scene.add(lamp);
                this.addBoxCollider(lx, lz, 0.5, 0.5);
            });
        }

        // Sidewalk Trees with Green Canopies along Grand Central Boulevard
        const sidewalkTreeMat = new THREE.MeshStandardMaterial({ color: 0x388e3c, roughness: 0.65 });
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 });

        [-16.5, 16.5].forEach(tx => {
            for (let tz = -460; tz <= 460; tz += 28) {
                const tree = new THREE.Group();
                tree.position.set(tx, 0, tz);

                const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 5.2, 8), trunkMat);
                trunk.position.y = 2.6;
                trunk.castShadow = true;
                tree.add(trunk);

                const canopy = new THREE.Mesh(new THREE.DodecahedronGeometry(2.8, 1), sidewalkTreeMat);
                canopy.position.y = 5.6;
                canopy.scale.set(1.15, 1.25, 1.15);
                canopy.castShadow = true;
                tree.add(canopy);

                // Tree planter curb box
                const planter = new THREE.Mesh(
                    new THREE.BoxGeometry(2.0, 0.3, 2.0),
                    new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 })
                );
                planter.position.y = 0.15;
                tree.add(planter);

                this.scene.add(tree);
                this.addBoxCollider(tx, tz, 2.0, 2.0); // Solid planter collider
            }
        });

        // Fire Hydrants & Pedestrian Benches along sidewalks
        const hydrantMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.7, roughness: 0.3 });
        const benchWoodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
        const benchMetalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });

        for (let bz = -420; bz <= 420; bz += 56) {
            [-14.5, 14.5].forEach(bx => {
                // Bench
                const bench = new THREE.Group();
                bench.position.set(bx, 0, bz);
                bench.rotation.y = (bx < 0) ? Math.PI / 2 : -Math.PI / 2;

                const seat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 0.7), benchWoodMat);
                seat.position.y = 0.55;
                bench.add(seat);

                const back = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.55, 0.1), benchWoodMat);
                back.position.set(0, 0.85, -0.32);
                bench.add(back);

                [-0.9, 0.9].forEach(legX => {
                    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.55, 0.65), benchMetalMat);
                    leg.position.set(legX, 0.28, 0);
                    bench.add(leg);
                });

                this.scene.add(bench);
                this.addBoxCollider(bx, bz, 1.2, 2.4);

                // Red Fire Hydrant
                const hydrant = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.85, 8), hydrantMat);
                hydrant.position.set(bx > 0 ? bx - 1.2 : bx + 1.2, 0.42, bz + 8);
                hydrant.castShadow = true;
                this.scene.add(hydrant);
                this.addBoxCollider(bx > 0 ? bx - 1.2 : bx + 1.2, bz + 8, 0.6, 0.6);
            });
        }

        // Bus Stop Shelters with Glowing Ad Posters
        const busFrameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.3 });
        const busGlassMat = new THREE.MeshStandardMaterial({
            color: 0x9fd8ff, metalness: 0.9, roughness: 0.08,
            transparent: true, opacity: 0.32
        });
        const busAdMat = new THREE.MeshStandardMaterial({ map: this.textures.billboardAds, emissive: 0xffffff, emissiveMap: this.textures.billboardAds, emissiveIntensity: 0.55 });

        [-20.5, 20.5].forEach(sx => {
            [-200, -80, 80, 200].forEach(sz => {
                const stop = new THREE.Group();
                stop.position.set(sx, 0, sz);
                stop.rotation.y = (sx < 0) ? Math.PI / 2 : -Math.PI / 2;

                // Posts
                [-1.5, 1.5].forEach(px => {
                    const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.6, 0.12), busFrameMat);
                    post.position.set(px, 1.3, 0);
                    stop.add(post);
                });

                // Glass back wall
                const glass = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.9, 0.06), busGlassMat);
                glass.position.set(0, 1.15, 0.12);
                stop.add(glass);

                // Roof slab
                const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.14, 1.3), busFrameMat);
                roofSlab.position.set(0, 2.62, -0.4);
                roofSlab.castShadow = true;
                stop.add(roofSlab);

                // Bench
                const stopBench = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 0.5), benchWoodMat);
                stopBench.position.set(0, 0.5, -0.15);
                stop.add(stopBench);

                // Illuminated ad poster on the side
                const ad = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.5, 1.0), busAdMat);
                ad.position.set(1.72, 1.35, -0.4);
                stop.add(ad);

                this.scene.add(stop);
                this.addBoxCollider(sx, sz, 1.6, 3.6);
            });
        });
    }

    buildMetropolisVehicles() {
        // High-density colorful traffic (Taxis, Red Coupes, Blue Sedans, White SUVs, Police Cruisers)
        const carLocations = [
            // Boulevard Southbound Traffic (X = -7)
            { type: 'taxi', x: -7, z: -160, rot: Math.PI },
            { type: 'sedan', color: 0xdc2626, x: -7, z: -100, rot: Math.PI }, // Candy Red
            { type: 'sedan', color: 0x2563eb, x: -7, z: -30, rot: Math.PI },  // Royal Blue
            { type: 'taxi', x: -7, z: 35, rot: Math.PI },
            { type: 'sedan', color: 0xffffff, x: -7, z: 90, rot: Math.PI },  // White SUV
            { type: 'police', x: -7, z: 170, rot: Math.PI },

            // Boulevard Northbound Traffic (X = 7)
            { type: 'taxi', x: 7, z: 150, rot: 0 },
            { type: 'sedan', color: 0xf59e0b, x: 7, z: 80, rot: 0 },   // Amber Orange
            { type: 'sedan', color: 0x16a34a, x: 7, z: 10, rot: 0 },   // Emerald Green
            { type: 'taxi', x: 7, z: -60, rot: 0 },
            { type: 'sedan', color: 0x0284c7, x: 7, z: -130, rot: 0 }, // Sky Blue
            { type: 'sedan', color: 0xffffff, x: 7, z: -200, rot: 0 },

            // Coastal Highway (X = 206, 194)
            { type: 'taxi', x: 206, z: -180, rot: 0 },
            { type: 'sedan', color: 0xdc2626, x: 194, z: -120, rot: Math.PI },
            { type: 'police', x: 195, z: 50, rot: Math.PI },
            { type: 'taxi', x: 206, z: 40, rot: 0 },
            { type: 'sedan', color: 0x2563eb, x: 228, z: -225, rot: Math.PI / 2 }
        ];

        carLocations.forEach(c => {
            let mesh;
            if (c.type === 'taxi') mesh = this.createVehicleMesh(0xfbc02d, true);
            else if (c.type === 'police') mesh = this.createPoliceVehicle();
            else mesh = this.createVehicleMesh(c.color || 0xffffff);

            mesh.position.set(c.x, 0, c.z);
            mesh.rotation.y = c.rot;
            this.scene.add(mesh);
            this.addBoxCollider(c.x, c.z, 2.4, 5.0); // Solid car collider
        });
    }

    createVehicleMesh(color = 0xffffff, isTaxi = false) {
        const car = new THREE.Group();
        const paint = new THREE.MeshStandardMaterial({ color: color, roughness: 0.25, metalness: 0.7 });
        const glass = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 });
        const tire = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });

        // Car Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.85, 4.8), paint);
        body.position.y = 0.65;
        body.castShadow = true;
        car.add(body);

        // Cabin Glass
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.85, 2.6), glass);
        cabin.position.set(0, 1.45, -0.2);
        cabin.castShadow = true;
        car.add(cabin);

        // 4 Wheels
        [-1.15, 1.15].forEach(x => {
            [-1.5, 1.5].forEach(z => {
                const t = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.32, 12), tire);
                t.rotateZ(Math.PI / 2);
                t.position.set(x, 0.42, z);
                car.add(t);
            });
        });

        // Headlights & Taillights
        const headLightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.9 });
        const tailLightMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.9 });

        [-0.85, 0.85].forEach(lx => {
            const hl = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.18, 0.1), headLightMat);
            hl.position.set(lx, 0.7, 2.4);
            car.add(hl);

            const tl = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.18, 0.1), tailLightMat);
            tl.position.set(lx, 0.7, -2.4);
            car.add(tl);
        });

        if (isTaxi) {
            const med = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.24, 0.45), new THREE.MeshStandardMaterial({ color: 0xffffff }));
            med.position.set(0, 1.95, -0.2);
            car.add(med);
        }

        return car;
    }

    createPoliceVehicle() {
        const cruiser = this.createVehicleMesh(0x0f172a);

        // Police Lightbar on Roof
        const barGeo = new THREE.BoxGeometry(1.4, 0.18, 0.35);
        const barMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
        const lightbar = new THREE.Mesh(barGeo, barMat);
        lightbar.position.set(0, 1.95, -0.2);
        cruiser.add(lightbar);

        // Red Strobe Lens (Left)
        const rMat = new THREE.MeshStandardMaterial({ color: 0xff0033, emissive: 0xff0033, emissiveIntensity: 0.5 });
        const rMesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 0.3), rMat);
        rMesh.position.set(-0.35, 1.96, -0.2);
        cruiser.add(rMesh);

        // Blue Strobe Lens (Right)
        const bMat = new THREE.MeshStandardMaterial({ color: 0x0066ff, emissive: 0x0066ff, emissiveIntensity: 0.5 });
        const bMesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 0.3), bMat);
        bMesh.position.set(0.35, 1.96, -0.2);
        cruiser.add(bMesh);

        // Dual Flashing Pointlights
        const rLight = new THREE.PointLight(0xff0033, 0.0, 18);
        rLight.position.set(-0.35, 2.2, -0.2);
        cruiser.add(rLight);

        const bLight = new THREE.PointLight(0x0066ff, 0.0, 18);
        bLight.position.set(0.35, 2.2, -0.2);
        cruiser.add(bLight);

        this.policeCruisers.push({
            mesh: cruiser,
            rLight: rLight,
            bLight: bLight,
            rMat: rMat,
            bMat: bMat,
            baseZ: cruiser.position.z,
            dir: 1,
            speed: 22
        });

        return cruiser;
    }

    buildPoliceHelicopter() {
        const heli = new THREE.Group();
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
        const rotorMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });

        // Fuselage
        const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 5.5), bodyMat);
        body.position.y = 1.1;
        heli.add(body);

        // Tail Boom
        const tail = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 6.0), bodyMat);
        tail.position.set(0, 1.4, -4.8);
        heli.add(tail);

        // Main Rotor Mast & Blades
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8), rotorMat);
        mast.position.set(0, 2.4, 0);
        heli.add(mast);

        const rotor = new THREE.Group();
        rotor.position.set(0, 2.8, 0);
        const blade1 = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.06, 0.65), rotorMat);
        rotor.add(blade1);
        const blade2 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.06, 11.0), rotorMat);
        rotor.add(blade2);
        heli.add(rotor);

        // High-Intensity Police Searchlight
        const spot = new THREE.SpotLight(0xffffff, 0.0, 240, Math.PI / 6, 0.45);
        spot.position.set(0, 0, 1.8);
        spot.castShadow = true;
        heli.add(spot);

        const spotTarget = new THREE.Object3D();
        this.scene.add(spotTarget);
        spot.target = spotTarget;

        heli.position.set(0, 65, 0);
        heli.visible = false;
        this.scene.add(heli);

        this.policeHelicopter = {
            mesh: heli,
            rotor: rotor,
            spotLight: spot,
            target: spotTarget
        };
    }

    buildChallengeStations() {
        const challenges = window.CHALLENGES_DATA || [];

        const stationConfigs = {
            'station-linux-novice': {
                pos: { x: -14.0, z: -10.0 },
                color: 0x00ff66,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const table = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.9, 16), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
                    table.position.y = 0.45;
                    g.add(table);
                    const laptop = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.5), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
                    laptop.position.set(0, 0.92, 0);
                    g.add(laptop);
                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.03), new THREE.MeshStandardMaterial({ color: 0x00ff66, emissive: 0x00ff66, emissiveIntensity: 1.2 }));
                    screen.position.set(0, 1.15, -0.2);
                    screen.rotation.x = -0.2;
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-web-recon': {
                pos: { x: -26.0, z: 80.0 },
                color: 0x00f0ff,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 2.2, 12), new THREE.MeshStandardMaterial({ color: 0x334155 }));
                    pole.position.y = 1.1;
                    g.add(pole);
                    const screen = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.7, 0.1), new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 1.2 }));
                    screen.position.set(0, 1.9, 0);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-crypto-basic': {
                pos: { x: -14.0, z: 10.0 },
                color: 0xffb703,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const atm = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.8, 1.0), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6 }));
                    atm.position.y = 1.4;
                    g.add(atm);
                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.65, 0.05), new THREE.MeshStandardMaterial({ color: 0xffb703, emissive: 0xffb703, emissiveIntensity: 1.2 }));
                    screen.position.set(0, 1.7, 0.52);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-power-grid': {
                pos: { x: -65.0, z: -120.0 },
                color: 0xef4444,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const transformer = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.2, 1.8), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 }));
                    transformer.position.y = 1.6;
                    g.add(transformer);
                    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 0.1), new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 1.4 }));
                    panel.position.set(0, 2.0, 0.95);
                    g.add(panel);
                    return { root: g, holo: panel };
                }
            },
            'station-web-sqli': {
                pos: { x: 200.0, z: -210.0 },
                color: 0x00f0ff,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const table = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.9, 16), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
                    table.position.y = 0.45;
                    g.add(table);
                    const laptop = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.5), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
                    laptop.position.set(0, 0.92, 0);
                    g.add(laptop);
                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.03), new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 1.2 }));
                    screen.position.set(0, 1.15, -0.2);
                    screen.rotation.x = -0.2;
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-net-pcap': {
                pos: { x: 16.0, z: 12.0 },
                color: 0xff007f,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 1.4, 16), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
                    pedestal.position.y = 0.7;
                    g.add(pedestal);
                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.55, 0.05), new THREE.MeshStandardMaterial({ color: 0xff007f, emissive: 0xff007f, emissiveIntensity: 1.2 }));
                    screen.position.set(0, 1.6, 0);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-broadcast': {
                pos: { x: 65.0, z: 120.0 },
                color: 0xa855f7,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.8, 4.2, 8), new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 }));
                    tower.position.y = 2.1;
                    g.add(tower);
                    const dish = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0xa855f7, emissiveIntensity: 1.3, side: THREE.DoubleSide }));
                    dish.position.set(0, 4.2, 0);
                    dish.rotateX(Math.PI / 3);
                    g.add(dish);
                    return { root: g, holo: dish };
                }
            },
            'station-linux-privesc': {
                pos: { x: -300.0, z: 0.0 },
                color: 0x00ff66,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const box = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 1.0), new THREE.MeshStandardMaterial({ color: 0x14532d, metalness: 0.4 }));
                    box.position.y = 1.2;
                    g.add(box);
                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.05), new THREE.MeshStandardMaterial({ color: 0x00ff66, emissive: 0x00ff66, emissiveIntensity: 1.2 }));
                    screen.position.set(0, 1.4, 0.52);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-crypto-hash': {
                pos: { x: -80.0, z: 180.0 },
                color: 0xf59e0b,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const rack = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.0, 1.2), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 }));
                    rack.position.y = 1.5;
                    g.add(rack);
                    const screen = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.8, 0.05), new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 1.2 }));
                    screen.position.set(0, 1.8, 0.62);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-web-xss': {
                pos: { x: 180.0, z: -80.0 },
                color: 0x3b82f6,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const kiosk = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.6, 0.9), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
                    kiosk.position.y = 1.3;
                    g.add(kiosk);
                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.05), new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x3b82f6, emissiveIntensity: 1.2 }));
                    screen.position.set(0, 1.7, 0.48);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-rev-keygen': {
                pos: { x: 0.0, z: -18.0 },
                color: 0xff3333,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const arcade = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.7, 1.0), new THREE.MeshStandardMaterial({ color: 0x3b0764 }));
                    arcade.position.y = 1.35;
                    g.add(arcade);
                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.05), new THREE.MeshStandardMaterial({ color: 0xff3333, emissive: 0xff3333, emissiveIntensity: 1.2 }));
                    screen.position.set(0, 1.7, 0.52);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-boss-omega': {
                pos: { x: 0.0, z: -160.0 },
                color: 0xb026ff,
                isBoss: true,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const frame = new THREE.Mesh(new THREE.BoxGeometry(8, 9, 1.5), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85 }));
                    frame.position.y = 4.5;
                    g.add(frame);
                    const door = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.8, 32), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 }));
                    door.rotateX(Math.PI / 2);
                    door.position.set(0, 4.5, 0.6);
                    g.add(door);
                    const wheel = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.12, 12, 24), new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.9 }));
                    wheel.position.set(0, 4.5, 1.1);
                    g.add(wheel);
                    return { root: g, holo: wheel };
                }
            },
            'station-decoy-proxy': {
                pos: { x: -32.0, z: 45.0 },
                color: 0x22c55e,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const box = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 0.6), new THREE.MeshStandardMaterial({ color: 0x166534 }));
                    box.position.y = 0.8;
                    g.add(box);
                    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8), new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 1.5 }));
                    antenna.position.set(0, 2.0, 0);
                    g.add(antenna);
                    return { root: g, holo: antenna };
                }
            }
        };

        challenges.forEach(ch => {
            const config = stationConfigs[ch.id];
            if (!config) return;

            ch.pos = config.pos;

            const { root, holo } = config.meshCreator();
            root.position.set(config.pos.x, 0, config.pos.z);

            const ringGeo = new THREE.RingGeometry(2.8, 3.4, 32);
            ringGeo.rotateX(-Math.PI / 2);
            const ringMat = new THREE.MeshBasicMaterial({
                color: config.color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.85
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.y = 0.08;
            root.add(ring);

            const pLight = new THREE.PointLight(config.color, 1.8, 14);
            pLight.position.set(0, 2.0, 0.5);
            root.add(pLight);

            this.scene.add(root);

            this.terminals.push({
                id: ch.id,
                challenge: ch,
                pos: config.pos,
                holo: holo,
                ring: ring,
                radius: 4.8,
                isBoss: config.isBoss || false
            });
        });
    }

    // Dynamic City Power Grid Blackout Event
    triggerCityBlackout(isBlackout = true) {
        this.isBlackout = isBlackout;

        // 1. Extinguish or illuminate streetlights
        this.streetLightMaterials.forEach(mat => {
            mat.emissiveIntensity = isBlackout ? 0.0 : 2.2;
            mat.color.setHex(isBlackout ? 0x222222 : 0xffd166);
        });
        this.streetPointLights.forEach(p => {
            p.intensity = isBlackout ? 0.0 : 1.2;
        });

        // 2. Dim Sky & Lighting to pitch-black emergency level
        if (this.sunLight) this.sunLight.intensity = isBlackout ? 0.15 : 0.85;
        if (this.hemiLight) this.hemiLight.intensity = isBlackout ? 0.12 : 0.55;
        if (this.fillLight) this.fillLight.intensity = isBlackout ? 0.05 : 0.35;

        // 3. Audio & Banner Trigger
        if (isBlackout && window.sounds) {
            window.sounds.playBlackoutSurge();
        }
        if (window.game && typeof window.game.showBannerNotification === 'function') {
            window.game.showBannerNotification(
                isBlackout
                    ? "⚡ [CRITICAL SCADA FAILURE] METROPOLIS POWER GRID COLLAPSE // CITY BLACKOUT ACTIVE!"
                    : "✔ POWER GRID RESTORED // METROPOLIS LIGHTS ONLINE",
                isBlackout ? "danger" : "success"
            );
        }

        // Auto-restore the grid after a dramatic outage window
        clearTimeout(this.blackoutRestoreTimer);
        if (isBlackout) {
            this.blackoutRestoreTimer = setTimeout(() => {
                this.triggerCityBlackout(false);
            }, 25000);
        }
    }

    // Dynamic Police Alert & Wanted Level (0 to 5 Stars)
    setPoliceAlertLevel(level = 0) {
        this.policeAlertLevel = level;

        // Toggle Helicopter
        if (this.policeHelicopter) {
            this.policeHelicopter.mesh.visible = (level >= 4);
            this.policeHelicopter.spotLight.intensity = (level >= 4) ? 5.5 : 0.0;
        }

        // Toggle Cruiser Lightbars
        this.policeCruisers.forEach(pc => {
            if (level === 0) {
                pc.rLight.intensity = 0.0;
                pc.bLight.intensity = 0.0;
                pc.rMat.emissiveIntensity = 0.1;
                pc.bMat.emissiveIntensity = 0.1;
            }
        });
    }

    // Dynamic Electronic Billboard Takeover
    triggerBillboardTakeover() {
        if (!this.billboardCanvas || !this.billboardTexture) return;

        const ctx = this.billboardCanvas.getContext('2d');
        ctx.fillStyle = '#050b14';
        ctx.fillRect(0, 0, 512, 256);

        // Neon Green Matrix Cyberpunk Grid
        ctx.strokeStyle = 'rgba(0, 255, 102, 0.25)';
        ctx.lineWidth = 1;
        for (let x = 0; x < 512; x += 32) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
        }

        // Left Billboard: Hacker Skull & Compromised Notice
        ctx.fillStyle = '#00ff66';
        ctx.font = '900 24px monospace';
        ctx.fillText('⚡ GHOSTBIT TAKEOVER', 25, 70);
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#00f0ff';
        ctx.fillText('NETWORK OVERRIDE: ACTIVE', 25, 105);
        ctx.fillText('NEXUS SYNDICATE PWNED', 25, 130);
        ctx.fillStyle = '#ff007f';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('ACCESS ROOT // CTF SECURED', 25, 160);

        // Right Billboard: Freedom Cyber Signal
        ctx.fillStyle = '#00f0ff';
        ctx.font = '900 24px monospace';
        ctx.fillText('CITIZENS OF METROPOLIS', 275, 70);
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('SURVEILLANCE GRID IS DOWN', 275, 105);
        ctx.fillStyle = '#00ff66';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('CTF{skyway_billboard_broadcast_hijacked}', 275, 140);

        this.billboardTexture.needsUpdate = true;

        if (window.game && typeof window.game.showBannerNotification === 'function') {
            window.game.showBannerNotification("📺 [BROADCAST HIJACK] GHOSTBIT NETWORK TAKEOVER DISPLAYED CITY-WIDE!", "success");
        }
    }

    buildRainSystem() {
        const COUNT = 1800;
        const RANGE = 90;
        const HEIGHT = 120;

        const positions = new Float32Array(COUNT * 3);
        this.rainVelocities = new Float32Array(COUNT);
        for (let i = 0; i < COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * RANGE * 2;
            positions[i * 3 + 1] = Math.random() * HEIGHT;
            positions[i * 3 + 2] = (Math.random() - 0.5) * RANGE * 2;
            this.rainVelocities[i] = 34 + Math.random() * 18;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const mat = new THREE.PointsMaterial({
            color: 0x9db8d6,
            size: 0.16,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.rainSystem = new THREE.Points(geo, mat);
        this.rainSystem.frustumCulled = false;
        this.scene.add(this.rainSystem);
    }

    update(delta, playerPos, totalScore) {
        const time = performance.now() * 0.001;

        // 1. Drift clouds across the night sky
        this.clouds.forEach(cl => {
            cl.position.x += delta * 4.5;
            if (cl.position.x > 750) cl.position.x = -750;
        });

        // 1b. Ambient rain sheet follows the player
        if (this.rainSystem && playerPos) {
            const posArr = this.rainSystem.geometry.attributes.position.array;
            const windspeed = 6 * delta;
            for (let i = 0; i < this.rainVelocities.length; i++) {
                posArr[i * 3] -= windspeed;
                posArr[i * 3 + 1] -= this.rainVelocities[i] * delta;
                if (posArr[i * 3 + 1] < 0) {
                    posArr[i * 3] = playerPos.x + (Math.random() - 0.5) * 180;
                    posArr[i * 3 + 1] = 110 + Math.random() * 20;
                    posArr[i * 3 + 2] = playerPos.z + (Math.random() - 0.5) * 180;
                }
            }
            this.rainSystem.geometry.attributes.position.needsUpdate = true;
        }

        // 1c. Blink rooftop aviation beacons
        if (this.beacons.length) {
            this.elapsed += delta;
            for (let i = 0; i < this.beacons.length; i++) {
                const b = this.beacons[i];
                b.mesh.visible = Math.sin(this.elapsed * b.speed + b.phase) > -0.2;
            }
        }

        // 2. Animate Police Cruisers & Sirens during Wanted Alert
        if (this.policeAlertLevel >= 3) {
            const isRed = Math.floor(time * 9) % 2 === 0;
            this.policeCruisers.forEach(pc => {
                pc.rLight.intensity = isRed ? 2.5 : 0.0;
                pc.bLight.intensity = isRed ? 0.0 : 2.5;
                pc.rMat.emissiveIntensity = isRed ? 2.5 : 0.2;
                pc.bMat.emissiveIntensity = isRed ? 0.2 : 2.5;

                // Move cruisers along road
                pc.mesh.position.z += pc.dir * pc.speed * delta;
                if (pc.mesh.position.z > 220) { pc.dir = -1; pc.mesh.rotation.y = Math.PI; }
                if (pc.mesh.position.z < -220) { pc.dir = 1; pc.mesh.rotation.y = 0; }
            });
        }

        // 3. Animate Police Searchlight Helicopter during High Heat
        if (this.policeAlertLevel >= 4 && this.policeHelicopter && playerPos) {
            // Spin main rotor
            this.policeHelicopter.rotor.rotation.y += delta * 24.0;

            // Follow player overhead with slight sway
            const targetX = playerPos.x + Math.sin(time * 0.8) * 15;
            const targetZ = playerPos.z + Math.cos(time * 0.8) * 15;
            this.policeHelicopter.mesh.position.x += (targetX - this.policeHelicopter.mesh.position.x) * delta * 0.8;
            this.policeHelicopter.mesh.position.z += (targetZ - this.policeHelicopter.mesh.position.z) * delta * 0.8;

            // Point searchlight down at player
            this.policeHelicopter.target.position.set(playerPos.x, 0, playerPos.z);
        }

        // 4. Animate Terminal holographic pedestals & rings
        this.terminals.forEach(t => {
            if (t.holo && t.holo.material && t.holo.material.emissiveIntensity) {
                t.holo.material.emissiveIntensity = 0.9 + Math.sin(time * 6) * 0.2;
            }
            if (t.ring) {
                t.ring.rotation.z += delta * 0.6;
            }
        });
    }
}

window.CyberBunkerWorld = CyberBunkerWorld;

