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

        // Build rich procedural texture palette for vibrant Cities: Skylines aesthetic
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

        // Export colliders and walkable surfaces globally
        window.worldColliders = this.colliders;
        window.walkableMeshes = this.walkableMeshes;
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
        // Crisp, vivid atmospheric depth (Fog pushed far out so city is crystal clear & vibrant)
        this.scene.fog = new THREE.Fog(0x82b9e8, 700, 3200);

        // Bright, crisp high-noon sunlight (High contrast, sharp shadows, non-washed-out)
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.45);
        sunLight.position.set(240, 450, 180);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 10;
        sunLight.shadow.camera.far = 1400;
        sunLight.shadow.camera.left = -400;
        sunLight.shadow.camera.right = 400;
        sunLight.shadow.camera.top = 400;
        sunLight.shadow.camera.bottom = -400;
        sunLight.shadow.bias = -0.0003;
        this.scene.add(sunLight);

        // Vibrant Sky & Ground Bounce (Rich azure sky bounce and lush grass bounce)
        const hemiLight = new THREE.HemisphereLight(0x5ba4e6, 0x2e7d32, 0.72);
        this.scene.add(hemiLight);

        // Subtle ambient fill to keep deep shadows crisp
        const fillLight = new THREE.DirectionalLight(0xbbdefb, 0.25);
        fillLight.position.set(-200, 250, -200);
        this.scene.add(fillLight);
    }

    initProceduralTextures() {
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
            roofGravel: this.createRoofGravelTexture()
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

        return new THREE.CanvasTexture(c);
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

    buildSkyAndClouds() {
        // Deep Azure Summer Sky Dome
        const skyGeo = new THREE.SphereGeometry(2400, 32, 24);
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0.0, '#0d47a1'); // Deep sapphire blue
        grad.addColorStop(0.3, '#1976d2');
        grad.addColorStop(0.65, '#42a5f5'); // Vibrant azure
        grad.addColorStop(1.0, '#90caf9'); // Soft bright horizon
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 512);

        const skyTex = new THREE.CanvasTexture(canvas);
        const sky = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false }));
        this.scene.add(sky);

        // Fluffy 3D White Cumulus Clouds
        const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, flatShading: true });
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

        allBuildings.forEach(b => {
            let facadeMat;
            if (b.type === 'blue') facadeMat = matBlue;
            else if (b.type === 'teal') facadeMat = matTeal;
            else if (b.type === 'white') facadeMat = matWhite;
            else if (b.type === 'terra') facadeMat = matTerra;
            else facadeMat = matRetail;

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

            // Tower main body
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), facadeMat);
            mesh.position.y = b.h / 2;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            bGroup.add(mesh);

            // Roof & Parapet
            const roof = new THREE.Mesh(new THREE.BoxGeometry(b.w, 0.6, b.d), matRoof);
            roof.position.y = b.h + 0.3;
            bGroup.add(roof);

            const parapet = new THREE.Mesh(
                new THREE.BoxGeometry(b.w + 0.8, 1.4, b.d + 0.8),
                new THREE.MeshStandardMaterial({ color: 0x334155 })
            );
            parapet.position.y = b.h + 0.7;
            parapet.castShadow = true;
            bGroup.add(parapet);

            // Rooftop HVAC Units, Satellite Dishes, and Water Tanks
            if (b.h > 48) {
                const ac = new THREE.Mesh(
                    new THREE.BoxGeometry(b.w * 0.35, 2.8, b.d * 0.3),
                    new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85, roughness: 0.25 })
                );
                ac.position.set(b.w * 0.15, b.h + 1.9, -b.d * 0.15);
                bGroup.add(ac);

                const tank = new THREE.Mesh(
                    new THREE.CylinderGeometry(2.4, 2.4, 4.6, 12),
                    new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.85 })
                );
                tank.position.set(-b.w * 0.2, b.h + 3.6, b.d * 0.2);
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
        const lightGlowMat = new THREE.MeshStandardMaterial({ color: 0xfff3b0, emissive: 0xffe680, emissiveIntensity: 0.9 });

        // Streetlights along Sidewalks of Grand Central Boulevard (X = -13 and X = 13)
        for (let lz = -480; lz <= 480; lz += 35) {
            [-13, 13].forEach(lx => {
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
        const pLight = new THREE.PointLight(0xff0022, 1.8, 18);
        pLight.position.set(0, 2.2, -0.2);
        cruiser.add(pLight);
        this.policeLights.push(pLight);
        return cruiser;
    }

    buildChallengeStations() {
        const challenges = window.CHALLENGES_DATA || [];

        const stationConfigs = {
            'station-web': {
                title: "Pier 2 Cruise Liner Terminal",
                pos: { x: 232.0, z: -210.0 },
                color: 0x00f0ff,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const table = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.9, 16), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
                    table.position.y = 0.45;
                    g.add(table);

                    const laptop = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.5), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
                    laptop.position.set(0, 0.92, 0);
                    g.add(laptop);

                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.03), new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.9 }));
                    screen.position.set(0, 1.15, -0.2);
                    screen.rotation.x = -0.2;
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-crypto': {
                title: "Wall Street Spire Bank ATM",
                pos: { x: 34.0, z: -35.0 }, // Placed directly on East Boulevard sidewalk!
                color: 0xffb703,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const atm = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.8, 1.0), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6 }));
                    atm.position.y = 1.4;
                    g.add(atm);

                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.65, 0.05), new THREE.MeshStandardMaterial({ color: 0xffb703, emissive: 0xffb703, emissiveIntensity: 0.85 }));
                    screen.position.set(0, 1.7, 0.52);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-linux': {
                title: "Central Park Telecom Pavilion",
                pos: { x: -300.0, z: 0.0 },
                color: 0x00ff66,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const box = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 1.0), new THREE.MeshStandardMaterial({ color: 0x14532d, metalness: 0.4 }));
                    box.position.y = 1.2;
                    g.add(box);

                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.05), new THREE.MeshStandardMaterial({ color: 0x00ff66, emissive: 0x00ff66, emissiveIntensity: 0.9 }));
                    screen.position.set(0, 1.4, 0.52);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-forensics': {
                title: "Highway Police Cruiser Terminal",
                pos: { x: 195.0, z: 50.0 },
                color: 0xff007f,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.45, 0.05), new THREE.MeshStandardMaterial({ color: 0xff007f, emissive: 0xff007f, emissiveIntensity: 0.9 }));
                    screen.position.set(0, 1.6, 0.4);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-rev': {
                title: "Chinatown Heritage Arcade",
                pos: { x: -34.0, z: 25.0 }, // Placed directly on West Boulevard sidewalk!
                color: 0xff3333,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const arcade = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.7, 1.0), new THREE.MeshStandardMaterial({ color: 0x3b0764 }));
                    arcade.position.y = 1.35;
                    g.add(arcade);

                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.05), new THREE.MeshStandardMaterial({ color: 0xff3333, emissive: 0xff3333, emissiveIntensity: 0.9 }));
                    screen.position.set(0, 1.7, 0.52);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-boss': {
                title: "Metropolis Vault Blast Gate",
                pos: { x: 0.0, z: -175.0 }, // Placed at the Flatiron Plaza landmark!
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

    update(delta, playerPos, totalScore) {
        const time = performance.now() * 0.001;

        this.clouds.forEach(cl => {
            cl.position.x += delta * 4.5;
            if (cl.position.x > 750) {
                cl.position.x = -750;
            }
        });

        this.policeLights.forEach(pl => {
            const isRed = Math.floor(time * 6) % 2 === 0;
            pl.color.setHex(isRed ? 0xff0022 : 0x00f0ff);
        });

        this.terminals.forEach(t => {
            if (t.holo && t.holo.material && t.holo.material.emissiveIntensity) {
                t.holo.material.emissiveIntensity = 0.8 + Math.sin(time * 6) * 0.15;
            }
            if (t.ring) {
                t.ring.rotation.z += delta * 0.6;
            }
        });
    }
}

window.CyberBunkerWorld = CyberBunkerWorld;
