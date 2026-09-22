// 1.2-Kilometer Coastal Metropolis with Solid Building Collisions
// Warm Golden Sandstone, Terracotta Brick, Glowing Windows & Paved Sidewalks (Matching Photo)

class CyberBunkerWorld {
    constructor(scene) {
        this.scene = scene;
        this.terminals = [];
        this.animatedObjects = [];
        this.clouds = [];
        this.waterMesh = null;
        this.policeLights = [];
        this.colliders = [];

        // Build procedural texture palette matching uploaded photo
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

        // Export colliders globally for player collision physics
        window.worldColliders = this.colliders;
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
        // Soft, warm atmospheric aerial haze
        this.scene.fog = new THREE.Fog(0xa4caf0, 320, 2400);

        // Warm Golden Sunlight (Matching Photo's Warm Tones)
        const sunLight = new THREE.DirectionalLight(0xfffae8, 2.05);
        sunLight.position.set(280, 480, 220);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 10;
        sunLight.shadow.camera.far = 1400;
        sunLight.shadow.camera.left = -380;
        sunLight.shadow.camera.right = 380;
        sunLight.shadow.camera.top = 380;
        sunLight.shadow.camera.bottom = -380;
        sunLight.shadow.bias = -0.0003;
        this.scene.add(sunLight);

        // Warm Ambient Sky Bounce (Soft blue sky and warm stone ground bounce)
        const hemiLight = new THREE.HemisphereLight(0x78a8d4, 0x7a6c56, 1.3);
        this.scene.add(hemiLight);

        // Secondary soft fill
        const fillLight = new THREE.DirectionalLight(0xb2d6f5, 0.45);
        fillLight.position.set(-220, 260, -220);
        this.scene.add(fillLight);
    }

    initProceduralTextures() {
        return {
            goldenSandstone: this.createGoldenSandstoneTexture(),
            terracottaBrick: this.createTerracottaBrickTexture(),
            charcoalGlass: this.createCharcoalGlassTexture(),
            navyStorefront: this.createNavyStorefrontTexture(),
            pavedStreet: this.createPavedStreetTexture(),
            flagstoneSidewalk: this.createFlagstoneSidewalkTexture(),
            roofGravel: this.createRoofGravelTexture()
        };
    }

    createGoldenSandstoneTexture() {
        // Warm Honey-Gold Sandstone with Glowing Windows (Directly from Photo)
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 512;
        const ctx = c.getContext('2d');

        // Warm golden sandstone base
        ctx.fillStyle = '#d6be8c';
        ctx.fillRect(0, 0, 512, 512);

        // Stone ashlar block joints
        ctx.strokeStyle = '#baa16f';
        ctx.lineWidth = 2;
        for (let y = 0; y < 512; y += 42) {
            ctx.beginPath();
            ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
            const offset = (y / 42) % 2 === 0 ? 0 : 32;
            for (let x = offset; x < 512; x += 64) {
                ctx.beginPath();
                ctx.moveTo(x, y); ctx.lineTo(x, y + 42); ctx.stroke();
            }
        }

        // Quoin corner stones on vertical edges
        ctx.fillStyle = '#c5ac77';
        for (let y = 0; y < 512; y += 28) {
            ctx.fillRect(0, y, (y / 28) % 2 === 0 ? 24 : 14, 26);
            ctx.fillRect(512 - ((y / 28) % 2 === 0 ? 24 : 14), y, 24, 26);
        }

        // Window bays with warm glowing interior lights (Matching Photo!)
        const cols = 6;
        const rows = 8;
        const cellW = 512 / cols;
        const cellH = 512 / rows;

        for (let r = 0; r < rows; r++) {
            for (let col = 0; col < cols; col++) {
                const wx = col * cellW + 14;
                const wy = r * cellH + 16;
                const ww = cellW - 28;
                const wh = cellH - 30;

                // Stone pediment lintel & sill
                ctx.fillStyle = '#ebd8b2';
                ctx.fillRect(wx - 3, wy - 5, ww + 6, 5); // Lintel
                ctx.fillRect(wx - 4, wy + wh, ww + 8, 4); // Sill

                // Dark bronze window frame
                ctx.fillStyle = '#2b2319';
                ctx.fillRect(wx, wy, ww, wh);

                // Warm glowing interior amber light (Matching Photo)
                const isLit = (col + r * 2) % 3 !== 0;
                if (isLit) {
                    const glow = ctx.createLinearGradient(wx, wy, wx, wy + wh);
                    glow.addColorStop(0, '#fff0a6');
                    glow.addColorStop(0.6, '#ffd56b');
                    glow.addColorStop(1, '#e6ab27');
                    ctx.fillStyle = glow;
                    ctx.fillRect(wx + 2, wy + 2, ww - 4, wh - 4);
                } else {
                    ctx.fillStyle = '#1c242e';
                    ctx.fillRect(wx + 2, wy + 2, ww - 4, wh - 4);
                }

                // Window pane sash
                ctx.strokeStyle = '#3a2d1d';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(wx + ww / 2, wy);
                ctx.lineTo(wx + ww / 2, wy + wh);
                ctx.stroke();
            }
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    createTerracottaBrickTexture() {
        // Deep Warm Red/Brown Terracotta Brick (Matching Photo's Red Tower)
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 512;
        const ctx = c.getContext('2d');

        // Warm earthy terracotta brick
        ctx.fillStyle = '#8f3e2d';
        ctx.fillRect(0, 0, 512, 512);

        // Masonry mortar coursing
        ctx.fillStyle = '#6e2b1d';
        for (let y = 0; y < 512; y += 8) {
            ctx.fillRect(0, y, 512, 1.5);
            const offset = (y / 8) % 2 === 0 ? 0 : 12;
            for (let x = offset; x < 512; x += 24) {
                ctx.fillRect(x, y, 1.5, 8);
            }
        }

        // Horizontal white limestone decorative belt courses
        ctx.fillStyle = '#eddac0';
        ctx.fillRect(0, 128, 512, 6);
        ctx.fillRect(0, 256, 512, 6);
        ctx.fillRect(0, 384, 512, 6);

        // Windows with warm amber interior glow
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

                ctx.fillStyle = '#eddac0';
                ctx.fillRect(wx - 2, wy - 4, ww + 4, 4);
                ctx.fillRect(wx - 3, wy + wh, ww + 6, 4);

                ctx.fillStyle = '#1e1c1b';
                ctx.fillRect(wx, wy, ww, wh);

                // Warm interior lamp glow
                const glow = ctx.createRadialGradient(wx + ww / 2, wy + wh / 2, 2, wx + ww / 2, wy + wh / 2, ww);
                glow.addColorStop(0, '#ffefa3');
                glow.addColorStop(0.5, '#ffd25a');
                glow.addColorStop(1, '#946618');
                ctx.fillStyle = glow;
                ctx.fillRect(wx + 2, wy + 2, ww - 4, wh - 4);
            }
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    createCharcoalGlassTexture() {
        // Deep Charcoal & Navy Corporate Skyscraper (Matching Background Tower)
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 512;
        const ctx = c.getContext('2d');

        ctx.fillStyle = '#1a2029';
        ctx.fillRect(0, 0, 512, 512);

        const cols = 8;
        const rows = 14;
        const cellW = 512 / cols;
        const cellH = 512 / rows;

        for (let r = 0; r < rows; r++) {
            ctx.fillStyle = '#262e3d';
            ctx.fillRect(0, r * cellH, 512, 3);

            for (let col = 0; col < cols; col++) {
                const wx = col * cellW + 4;
                const wy = r * cellH + 5;
                const ww = cellW - 8;
                const wh = cellH - 8;

                const isLit = (col + r * 5) % 6 === 0;
                if (isLit) {
                    ctx.fillStyle = '#fce290';
                } else {
                    ctx.fillStyle = '#142a42';
                }
                ctx.fillRect(wx, wy, ww, wh);

                ctx.strokeStyle = '#0e1217';
                ctx.lineWidth = 1;
                ctx.strokeRect(wx, wy, ww, wh);
            }
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    createNavyStorefrontTexture() {
        // Navy Blue & Dark Charcoal Retail Storefront (Matching Photo's Street Level)
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 256;
        const ctx = c.getContext('2d');

        // Dark charcoal stone base
        ctx.fillStyle = '#1e2229';
        ctx.fillRect(0, 0, 512, 256);

        for (let i = 0; i < 4; i++) {
            const sx = i * 128;

            // Deep Navy Blue Fabric Awning (Matching Photo)
            ctx.fillStyle = '#1b3b6f';
            ctx.fillRect(sx + 4, 30, 120, 48);
            ctx.fillStyle = '#2b5294';
            ctx.fillRect(sx + 4, 74, 120, 6);

            // Illuminated Gold Signboard
            ctx.fillStyle = '#131821';
            ctx.fillRect(sx + 8, 8, 112, 20);
            ctx.fillStyle = '#f5c542';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            const names = ["JEWELRY & GOLD", "FINE TAILORS", "BOULEVARD CAFE", "METROPOLIS BOOKS"];
            ctx.fillText(names[i], sx + 64, 22);

            // Warm Glowing Boutique Display Windows
            ctx.fillStyle = '#ffd978';
            ctx.fillRect(sx + 10, 85, 108, 155);
            const winGrad = ctx.createLinearGradient(sx + 10, 85, sx + 10, 240);
            winGrad.addColorStop(0, '#fff4cc');
            winGrad.addColorStop(0.5, '#ffd269');
            winGrad.addColorStop(1, '#a67b24');
            ctx.fillStyle = winGrad;
            ctx.fillRect(sx + 12, 87, 104, 151);

            // Dark window mullions
            ctx.strokeStyle = '#181b22';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(sx + 10, 85, 108, 155);

            // Center Entrance Door
            ctx.fillStyle = '#2c2219';
            ctx.fillRect(sx + 46, 110, 36, 130);
            ctx.strokeStyle = '#e0b848';
            ctx.strokeRect(sx + 46, 110, 36, 130);
        }

        return new THREE.CanvasTexture(c);
    }

    createPavedStreetTexture() {
        // Fine Paved Stone Street Texture (Matching Photo's Street)
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 512;
        const ctx = c.getContext('2d');

        ctx.fillStyle = '#3a3f47';
        ctx.fillRect(0, 0, 512, 512);

        // Cobblestone / paved block grid
        ctx.strokeStyle = '#2b3038';
        ctx.lineWidth = 1.5;
        for (let y = 0; y < 512; y += 16) {
            ctx.beginPath();
            ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
            const offset = (y / 16) % 2 === 0 ? 0 : 12;
            for (let x = offset; x < 512; x += 24) {
                ctx.beginPath();
                ctx.moveTo(x, y); ctx.lineTo(x, y + 16); ctx.stroke();
            }
        }

        // Road double yellow center line
        ctx.fillStyle = '#f5b700';
        ctx.fillRect(253, 0, 2.5, 512);
        ctx.fillRect(258, 0, 2.5, 512);

        // Solid white outer border lines
        ctx.fillStyle = 'rgba(240, 245, 255, 0.9)';
        ctx.fillRect(16, 0, 3, 512);
        ctx.fillRect(493, 0, 3, 512);

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 16);
        return tex;
    }

    createFlagstoneSidewalkTexture() {
        // Light Gray Paving Slabs with Dark Borders (Matching Photo's Sidewalk!)
        const c = document.createElement('canvas');
        c.width = 256;
        c.height = 256;
        const ctx = c.getContext('2d');

        // Light gray center flagstones
        ctx.fillStyle = '#b8bec7';
        ctx.fillRect(0, 0, 256, 256);

        // Flagstone joints
        ctx.strokeStyle = '#9ea5b0';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 256; i += 32) {
            ctx.beginPath();
            ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
        }

        // Dark charcoal border pavers (Like in photo)
        ctx.fillStyle = '#4d535e';
        ctx.fillRect(0, 0, 256, 8);
        ctx.fillRect(0, 248, 256, 8);

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(8, 8);
        return tex;
    }

    createRoofGravelTexture() {
        const c = document.createElement('canvas');
        c.width = 256;
        c.height = 256;
        const ctx = c.getContext('2d');

        ctx.fillStyle = '#2c313a';
        ctx.fillRect(0, 0, 256, 256);

        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const b = 35 + Math.random() * 25;
            ctx.fillStyle = `rgb(${b}, ${b+1}, ${b+3})`;
            ctx.fillRect(x, y, 2, 2);
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    buildSkyAndClouds() {
        // Atmospheric Sky Dome with Golden Warm Horizon
        const skyGeo = new THREE.SphereGeometry(2200, 32, 24);
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0.0, '#1c4a80'); // Deep atmospheric blue
        grad.addColorStop(0.35, '#427db8');
        grad.addColorStop(0.7, '#8fbde6');
        grad.addColorStop(1.0, '#e8eef8'); // Warm horizon
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 512);

        const skyTex = new THREE.CanvasTexture(canvas);
        const sky = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false }));
        this.scene.add(sky);

        // Drifting 3D Cumulus Clouds
        const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, flatShading: true });
        for (let i = 0; i < 18; i++) {
            const cloud = new THREE.Group();
            const puffs = 6 + Math.floor(Math.random() * 4);
            const scale = 2.4 + Math.random() * 1.8;

            for (let j = 0; j < puffs; j++) {
                const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(18 * scale, 1), cloudMat);
                puff.position.set((Math.random() - 0.5) * 60 * scale, (Math.random() * 14) * scale, (Math.random() - 0.5) * 45 * scale);
                puff.scale.set(1.3, 0.75, 1.0);
                cloud.add(puff);
            }
            cloud.position.set((Math.random() - 0.5) * 1100, 250 + Math.random() * 100, (Math.random() - 0.5) * 1100);
            this.scene.add(cloud);
            this.clouds.push(cloud);
        }
    }

    buildMountainBackdrop() {
        const mountainGroup = new THREE.Group();
        const mountainMat = new THREE.MeshStandardMaterial({ color: 0x3d7033, roughness: 0.9, flatShading: true });

        for (let x = -550; x <= 450; x += 110) {
            const peakH = 140 + Math.sin(x * 0.02) * 50 + Math.random() * 40;
            const peakR = 90 + Math.random() * 30;
            const peak = new THREE.Mesh(new THREE.ConeGeometry(peakR, peakH, 8), mountainMat);
            peak.position.set(x, peakH / 2 - 10, -680);
            peak.scale.set(1.4, 1.0, 1.1);
            mountainGroup.add(peak);
        }

        for (let z = -450; z <= 450; z += 120) {
            const peakH = 120 + Math.cos(z * 0.02) * 45 + Math.random() * 35;
            const peakR = 85 + Math.random() * 25;
            const peak = new THREE.Mesh(new THREE.ConeGeometry(peakR, peakH, 8), mountainMat);
            peak.position.set(-680, peakH / 2 - 10, z);
            peak.scale.set(1.1, 1.0, 1.4);
            mountainGroup.add(peak);
        }

        this.scene.add(mountainGroup);
    }

    buildRoadsSidewalksAndLawns() {
        // Ground base with green turf
        const grassMat = new THREE.MeshStandardMaterial({ color: 0x488a38, roughness: 0.85 });
        const baseGround = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200), grassMat);
        baseGround.rotation.x = -Math.PI / 2;
        baseGround.position.y = -0.02;
        baseGround.receiveShadow = true;
        this.scene.add(baseGround);

        const roadMat = new THREE.MeshStandardMaterial({
            map: this.textures.pavedStreet,
            roughness: 0.75,
            metalness: 0.15
        });

        // 1. Coastal Highway (Along X = 200)
        const hwMesh = new THREE.Mesh(new THREE.PlaneGeometry(26, 1160), roadMat);
        hwMesh.rotation.x = -Math.PI / 2;
        hwMesh.position.set(200, 0.05, 0);
        hwMesh.receiveShadow = true;
        this.scene.add(hwMesh);

        // Highway Concrete Barriers & Collider
        const guardMat = new THREE.MeshStandardMaterial({ color: 0x9ea3ab, roughness: 0.8 });
        const guard = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 1160), guardMat);
        guard.position.set(213, 0.5, 0);
        guard.castShadow = true;
        this.scene.add(guard);
        this.addBoxCollider(213, 0, 0.8, 1160);

        // 2. City Grid Avenues (North-South)
        const avenues = [-400, -260, -120, 20, 160];
        avenues.forEach(ax => {
            const avMesh = new THREE.Mesh(new THREE.PlaneGeometry(18, 1160), roadMat);
            avMesh.rotation.x = -Math.PI / 2;
            avMesh.position.set(ax, 0.05, 0);
            avMesh.receiveShadow = true;
            this.scene.add(avMesh);

            // Raised Sidewalks with Curbs on both sides of Avenue
            const swMat = new THREE.MeshStandardMaterial({ map: this.textures.flagstoneSidewalk, roughness: 0.8 });
            [-11, 11].forEach(swOffset => {
                const sw = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.25, 1160), swMat);
                sw.position.set(ax + swOffset, 0.125, 0);
                sw.receiveShadow = true;
                this.scene.add(sw);
            });
        });

        // 3. Cross Streets (East-West)
        const streets = [-450, -320, -190, -60, 70, 200, 330, 460];
        streets.forEach(sz => {
            const stTex = this.textures.pavedStreet.clone();
            stTex.repeat.set(1, 10);
            stTex.needsUpdate = true;
            const stMat = new THREE.MeshStandardMaterial({ map: stTex, roughness: 0.75 });

            const stMesh = new THREE.Mesh(new THREE.PlaneGeometry(16, 620), stMat);
            stMesh.rotation.x = -Math.PI / 2;
            stMesh.rotation.z = Math.PI / 2;
            stMesh.position.set(-110, 0.06, sz);
            stMesh.receiveShadow = true;
            this.scene.add(stMesh);
        });
    }

    buildWaterfrontHarborAndPiers() {
        // Coastal Ocean Bay (X = 220 to 650)
        const waterGeo = new THREE.PlaneGeometry(450, 1240);
        const waterMat = new THREE.MeshStandardMaterial({ color: 0x146886, roughness: 0.18, metalness: 0.85 });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.rotation.x = -Math.PI / 2;
        water.position.set(435, -0.6, 0);
        this.scene.add(water);
        this.waterMesh = water;

        // Seawall Promenade
        const promenade = new THREE.Mesh(
            new THREE.BoxGeometry(18, 1.8, 1180),
            new THREE.MeshStandardMaterial({ map: this.textures.flagstoneSidewalk, roughness: 0.85 })
        );
        promenade.position.set(221, 0.4, 0);
        promenade.castShadow = true;
        promenade.receiveShadow = true;
        this.scene.add(promenade);
        this.addBoxCollider(229, 0, 2, 1180); // Seawall drop-off collider

        // 6 Walkable Finger Piers
        const pierZs = [-350, -210, -70, 70, 210, 350];
        const pierWoodMat = new THREE.MeshStandardMaterial({ color: 0x4d3b2b, roughness: 0.9 });

        pierZs.forEach((pz, idx) => {
            const pierLen = (idx === 1 || idx === 3) ? 120 : 95;
            const pierW = (idx === 1 || idx === 3) ? 22 : 18;

            const pier = new THREE.Group();
            pier.position.set(220 + pierLen / 2, 0.7, pz);

            const deck = new THREE.Mesh(new THREE.BoxGeometry(pierLen, 0.9, pierW), pierWoodMat);
            deck.castShadow = true;
            deck.receiveShadow = true;
            pier.add(deck);

            // Pilings
            for (let px = -pierLen / 2 + 8; px < pierLen / 2; px += 16) {
                [-pierW / 2 + 1.5, pierW / 2 - 1.5].forEach(pzOff => {
                    const piling = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 3.8, 8), new THREE.MeshStandardMaterial({ color: 0x221a14 }));
                    piling.position.set(px, -1.5, pzOff);
                    pier.add(piling);
                });
            }

            this.scene.add(pier);
        });
    }

    buildOceanCruiseLiner() {
        // 140m Cruise Liner docked at Pier 2
        const ship = new THREE.Group();
        ship.position.set(315, 0, -188);

        const hullMat = new THREE.MeshStandardMaterial({ color: 0x1c2b44, roughness: 0.35, metalness: 0.5 });
        const whiteSuperMat = new THREE.MeshStandardMaterial({ color: 0xf5f7fa, roughness: 0.4, metalness: 0.1 });
        const funnelMat = new THREE.MeshStandardMaterial({ color: 0xd92626, roughness: 0.4 });

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
        const gangway = new THREE.Mesh(new THREE.BoxGeometry(16, 0.6, 3.5), new THREE.MeshStandardMaterial({ color: 0x88909c }));
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

        const hullMat = new THREE.MeshStandardMaterial({ color: 0xa82b2b, roughness: 0.5 });
        const superMat = new THREE.MeshStandardMaterial({ color: 0xe6ebf2, roughness: 0.5 });
        const colors = [0x1f5ea8, 0xb53526, 0x228045, 0xc98616];

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
        // Materials matching the uploaded photo's warm palette
        const matGold = new THREE.MeshStandardMaterial({ map: this.textures.goldenSandstone, roughness: 0.7 });
        const matTerra = new THREE.MeshStandardMaterial({ map: this.textures.terracottaBrick, roughness: 0.8 });
        const matCharcoal = new THREE.MeshStandardMaterial({ map: this.textures.charcoalGlass, roughness: 0.35, metalness: 0.65 });
        const matStore = new THREE.MeshStandardMaterial({ map: this.textures.navyStorefront, roughness: 0.6 });
        const matRoof = new THREE.MeshStandardMaterial({ map: this.textures.roofGravel, roughness: 0.9 });

        // 1. Landmark 160m Art Deco Spire Tower (Matching Chrysler/Empire Style)
        this.buildArtDecoSpireTower(40, -80, matGold, matCharcoal);

        // 2. Landmark 115m Crystal Mega-Tower
        this.buildCrystalMegaTower(-40, -180, matCharcoal);

        // 3. Dense City Blocks with Window Grids & Solid Colliders
        const buildingDefinitions = [
            // Block 1 (X: -90 to -30, Z: -120 to -30) - Warm Sandstone & Terracotta
            { x: -65, z: -80, w: 28, d: 26, h: 86, type: 'gold' },
            { x: -95, z: -55, w: 22, d: 20, h: 58, type: 'terra' },
            { x: -45, z: -45, w: 24, d: 22, h: 68, type: 'gold' },

            // Block 2 (X: 10 to 80, Z: -150 to -70) - Charcoal & Gold
            { x: 15, z: -125, w: 28, d: 26, h: 94, type: 'charcoal' },
            { x: 65, z: -135, w: 24, d: 22, h: 76, type: 'gold' },

            // Block 3 (X: 100 to 170, Z: -120 to -30) - Terracotta & Gold
            { x: 135, z: -75, w: 32, d: 28, h: 82, type: 'terra' },
            { x: 140, z: -25, w: 26, d: 24, h: 64, type: 'gold' },

            // Block 4 (X: -110 to -30, Z: -260 to -170)
            { x: -85, z: -220, w: 28, d: 26, h: 80, type: 'gold' },
            { x: -50, z: -245, w: 24, d: 22, h: 72, type: 'charcoal' },

            // Block 5 (X: 20 to 110, Z: -270 to -180)
            { x: 55, z: -230, w: 30, d: 28, h: 90, type: 'gold' },
            { x: 95, z: -245, w: 22, d: 24, h: 64, type: 'terra' },

            // Block 6 (X: 120 to 180, Z: -280 to -180)
            { x: 150, z: -235, w: 28, d: 26, h: 74, type: 'gold' },

            // Block 7 (X: -120 to -30, Z: -420 to -310)
            { x: -85, z: -370, w: 34, d: 30, h: 84, type: 'charcoal' },
            { x: -45, z: -340, w: 24, d: 22, h: 62, type: 'terra' },

            // Block 8 (X: 10 to 100, Z: -430 to -320)
            { x: 50, z: -380, w: 32, d: 28, h: 96, type: 'gold' },
            { x: 85, z: -345, w: 24, d: 22, h: 68, type: 'gold' },

            // Block 9 (X: 115 to 180, Z: -430 to -320)
            { x: 145, z: -375, w: 30, d: 26, h: 78, type: 'charcoal' },

            // Mid-rise Streetlevel Storefront Blocks (Directly around player, matching photo!)
            { x: -60, z: 20, w: 28, d: 26, h: 44, type: 'store' },
            { x: -60, z: 65, w: 26, d: 24, h: 48, type: 'terra' },
            { x: 70, z: 20, w: 28, d: 26, h: 46, type: 'store' },
            { x: 65, z: 65, w: 26, d: 24, h: 52, type: 'gold' },
            { x: 145, z: 20, w: 26, d: 24, h: 44, type: 'store' }
        ];

        // Additional city blocks to fill the 1.2km metropolis
        for (let bx = -140; bx <= 165; bx += 40) {
            for (let bz = -460; bz <= 90; bz += 44) {
                if (Math.abs(bx - 40) < 28 && Math.abs(bz + 80) < 28) continue;
                if (Math.abs(bx + 40) < 28 && Math.abs(bz + 180) < 28) continue;
                if (Math.abs(bx - 20) < 28 && Math.abs(bz + 90) < 28) continue;

                const types = ['gold', 'terra', 'charcoal', 'store'];
                const curType = types[Math.floor(Math.random() * types.length)];
                const h = 34 + Math.floor(Math.random() * 48);

                buildingDefinitions.push({
                    x: bx + (Math.random() - 0.5) * 6,
                    z: bz + (Math.random() - 0.5) * 6,
                    w: 24 + Math.floor(Math.random() * 6),
                    d: 22 + Math.floor(Math.random() * 6),
                    h: h,
                    type: curType
                });
            }
        }

        // Residential Terracotta Brick Brownstones in the South District (Z = 180 to 520)
        for (let rx = -440; rx <= 140; rx += 65) {
            for (let rz = 220; rz <= 500; rz += 75) {
                const rh = 18 + Math.floor(Math.random() * 16);
                buildingDefinitions.push({
                    x: rx,
                    z: rz,
                    w: 48,
                    d: 52,
                    h: rh,
                    type: (rx % 2 === 0 ? 'terra' : 'gold')
                });
            }
        }

        buildingDefinitions.forEach(b => {
            let facadeMat;
            if (b.type === 'gold') facadeMat = matGold;
            else if (b.type === 'terra') facadeMat = matTerra;
            else if (b.type === 'store') facadeMat = matStore;
            else facadeMat = matCharcoal;

            const bGroup = new THREE.Group();
            bGroup.position.set(b.x, 0, b.z);

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
                new THREE.BoxGeometry(b.w + 0.8, 1.2, b.d + 0.8),
                new THREE.MeshStandardMaterial({ color: 0x3d352b })
            );
            parapet.position.y = b.h + 0.6;
            parapet.castShadow = true;
            bGroup.add(parapet);

            // Rooftop AC and Water Tanks
            if (b.h > 50) {
                const ac = new THREE.Mesh(
                    new THREE.BoxGeometry(b.w * 0.35, 2.5, b.d * 0.3),
                    new THREE.MeshStandardMaterial({ color: 0x5a6373, metalness: 0.8, roughness: 0.3 })
                );
                ac.position.set(b.w * 0.15, b.h + 1.8, -b.d * 0.15);
                bGroup.add(ac);

                const tank = new THREE.Mesh(
                    new THREE.CylinderGeometry(2.2, 2.2, 4.2, 12),
                    new THREE.MeshStandardMaterial({ color: 0x594232, roughness: 0.9 })
                );
                tank.position.set(-b.w * 0.2, b.h + 3.5, b.d * 0.2);
                bGroup.add(tank);
            }

            this.scene.add(bGroup);

            // Register Solid Bounding Box Collider (Prevents player walking through wall!)
            this.addBoxCollider(b.x, b.z, b.w, b.d);
        });
    }

    buildFlatironLandmarkBuilding() {
        // Triangular Flatiron-Style Landmark Skyscraper (Directly from Photo Vista!)
        // Positioned at X = 20, Z = -95
        const g = new THREE.Group();
        g.position.set(20, 0, -95);

        const stoneMat = new THREE.MeshStandardMaterial({ map: this.textures.goldenSandstone, roughness: 0.7 });

        // Wedge / Triangular Tier 1
        const t1 = new THREE.Mesh(new THREE.BoxGeometry(24, 52, 20), stoneMat);
        t1.position.y = 26;
        t1.castShadow = true;
        t1.receiveShadow = true;
        g.add(t1);

        // Stepped Back Crown Tier 2
        const t2 = new THREE.Mesh(new THREE.BoxGeometry(18, 22, 16), stoneMat);
        t2.position.y = 63;
        t2.castShadow = true;
        g.add(t2);

        // Decorative Cornices
        const cornice = new THREE.Mesh(new THREE.BoxGeometry(25.5, 1.6, 21.5), stoneMat);
        cornice.position.y = 52.8;
        g.add(cornice);

        const cornice2 = new THREE.Mesh(new THREE.BoxGeometry(19.5, 1.4, 17.5), stoneMat);
        cornice2.position.y = 74.7;
        g.add(cornice2);

        this.scene.add(g);
        this.addBoxCollider(20, -95, 24, 20); // Solid collider
    }

    buildArtDecoSpireTower(x, z, goldMat, charcoalMat) {
        const g = new THREE.Group();
        g.position.set(x, 0, z);

        const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd8dde6, metalness: 0.95, roughness: 0.1 });

        const base = new THREE.Mesh(new THREE.BoxGeometry(36, 24, 36), goldMat);
        base.position.y = 12;
        base.castShadow = true;
        g.add(base);

        const t2 = new THREE.Mesh(new THREE.BoxGeometry(28, 46, 28), charcoalMat);
        t2.position.y = 47;
        t2.castShadow = true;
        g.add(t2);

        const t3 = new THREE.Mesh(new THREE.BoxGeometry(22, 42, 22), charcoalMat);
        t3.position.y = 91;
        t3.castShadow = true;
        g.add(t3);

        const t4 = new THREE.Mesh(new THREE.BoxGeometry(16, 26, 16), goldMat);
        t4.position.y = 125;
        t4.castShadow = true;
        g.add(t4);

        const crown = new THREE.Mesh(new THREE.ConeGeometry(9, 14, 4), chromeMat);
        crown.rotateY(Math.PI / 4);
        crown.position.y = 145;
        crown.castShadow = true;
        g.add(crown);

        const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 1.2, 24, 8), chromeMat);
        spire.position.y = 164;
        g.add(spire);

        const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0022 }));
        beacon.position.y = 176;
        g.add(beacon);

        this.scene.add(g);
        this.addBoxCollider(x, z, 36, 36); // Solid collider
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
        this.addBoxCollider(x, z, 26, 26); // Solid collider
    }

    buildCentralParkDistrict() {
        const parkGroup = new THREE.Group();
        parkGroup.position.set(-320, 0, 0);

        const grassMat = new THREE.MeshStandardMaterial({ color: 0x3d8235, roughness: 0.9 });
        const turf = new THREE.Mesh(new THREE.BoxGeometry(310, 0.4, 490), grassMat);
        turf.position.y = 0.2;
        turf.receiveShadow = true;
        parkGroup.add(turf);

        const lakeMat = new THREE.MeshStandardMaterial({ color: 0x1b4d3e, roughness: 0.15, metalness: 0.75 });
        const lake = new THREE.Mesh(new THREE.CylinderGeometry(36, 42, 0.6, 24), lakeMat);
        lake.position.set(0, 0.3, 0);
        parkGroup.add(lake);

        const pathMat = new THREE.MeshStandardMaterial({ color: 0x8f867a, roughness: 0.85 });
        const mainPath = new THREE.Mesh(new THREE.BoxGeometry(12, 0.45, 480), pathMat);
        mainPath.position.set(0, 0.23, 0);
        mainPath.receiveShadow = true;
        parkGroup.add(mainPath);

        const crossPath = new THREE.Mesh(new THREE.BoxGeometry(300, 0.45, 10), pathMat);
        crossPath.position.set(0, 0.23, 0);
        crossPath.receiveShadow = true;
        parkGroup.add(crossPath);

        // 120+ Park Trees
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4d3826, roughness: 0.9 });
        const leavesMat = new THREE.MeshStandardMaterial({ color: 0x2e782e, roughness: 0.7 });

        for (let i = 0; i < 100; i++) {
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

            const canopy = new THREE.Mesh(new THREE.DodecahedronGeometry(3.6 + Math.random() * 2.0, 1), leavesMat);
            canopy.position.y = th + 2.5;
            canopy.scale.set(1.1, 1.2, 1.1);
            canopy.castShadow = true;
            tree.add(canopy);

            parkGroup.add(tree);
        }

        this.scene.add(parkGroup);
    }

    buildStreetPropsAndLighting() {
        // Modern Cantilever Streetlights (Matching Photo's Sleek Streetlamps)
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x8a929e, metalness: 0.9, roughness: 0.2 });
        const lampHeadMat = new THREE.MeshStandardMaterial({ color: 0x3d434d, metalness: 0.8 });
        const lightGlowMat = new THREE.MeshStandardMaterial({ color: 0xfff2b8, emissive: 0xffe680, emissiveIntensity: 0.8 });

        const lampPositions = [
            { x: 11, z: -10, rot: 0 }, { x: 11, z: 25, rot: 0 }, { x: 11, z: -45, rot: 0 },
            { x: -11, z: -10, rot: Math.PI }, { x: -11, z: 25, rot: Math.PI }, { x: -11, z: -45, rot: Math.PI },
            { x: 188, z: -10, rot: 0 }, { x: 188, z: 40, rot: 0 }, { x: 188, z: -60, rot: 0 }
        ];

        lampPositions.forEach(p => {
            const lamp = new THREE.Group();
            lamp.position.set(p.x, 0, p.z);
            lamp.rotation.y = p.rot;

            // Slender brushed metal pole
            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 6.2, 8), poleMat);
            pole.position.y = 3.1;
            pole.castShadow = true;
            lamp.add(pole);

            // Cantilever horizontal arm
            const arm = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.15, 0.2), poleMat);
            arm.position.set(0.7, 6.1, 0);
            lamp.add(arm);

            // Rectangular modern lamp head
            const head = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 0.45), lampHeadMat);
            head.position.set(1.4, 6.1, 0);
            lamp.add(head);

            // Downward glowing light panel
            const panel = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.05, 0.35), lightGlowMat);
            panel.position.set(1.4, 5.95, 0);
            lamp.add(panel);

            this.scene.add(lamp);
        });

        // Dark Street Bollards (Matching Photo's Foreground Bollards)
        const bollardMat = new THREE.MeshStandardMaterial({ color: 0x1f2329, metalness: 0.7, roughness: 0.3 });
        [-9.5, 9.5].forEach(bx => {
            for (let bz = -30; bz <= 30; bz += 15) {
                const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 1.1, 8), bollardMat);
                bollard.position.set(bx, 0.55, bz);
                bollard.castShadow = true;
                this.scene.add(bollard);
            }
        });

        // Street Trees along Sidewalks
        const treeMat = new THREE.MeshStandardMaterial({ color: 0x2e752e, roughness: 0.7 });
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3625, roughness: 0.9 });

        [-12, 12].forEach(tx => {
            for (let tz = -80; tz <= 80; tz += 24) {
                const tree = new THREE.Group();
                tree.position.set(tx, 0, tz);

                const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 5.5, 8), trunkMat);
                trunk.position.y = 2.75;
                trunk.castShadow = true;
                tree.add(trunk);

                const canopy = new THREE.Mesh(new THREE.DodecahedronGeometry(2.8, 1), treeMat);
                canopy.position.y = 5.8;
                canopy.castShadow = true;
                tree.add(canopy);

                this.scene.add(tree);
            }
        });
    }

    buildMetropolisVehicles() {
        const carLocations = [
            { type: 'taxi', x: 206, z: -180, rot: 0 },
            { type: 'sedan', color: 0x325f7a, x: 194, z: -120, rot: Math.PI },
            { type: 'taxi', x: 206, z: 40, rot: 0 },
            { type: 'police', x: 195, z: 50, rot: Math.PI },
            { type: 'taxi', x: 228, z: -210, rot: Math.PI / 2 },
            { type: 'sedan', color: 0x1f2329, x: 228, z: -225, rot: Math.PI / 2 },
            { type: 'taxi', x: 25, z: -70, rot: 0 },
            { type: 'sedan', color: 0xd9822b, x: 15, z: -40, rot: Math.PI },
            { type: 'taxi', x: -115, z: -120, rot: 0 }
        ];

        carLocations.forEach(c => {
            let mesh;
            if (c.type === 'taxi') mesh = this.createVehicleMesh(0xf5b700, true);
            else if (c.type === 'police') mesh = this.createPoliceVehicle();
            else mesh = this.createVehicleMesh(c.color || 0xdedede);

            mesh.position.set(c.x, 0, c.z);
            mesh.rotation.y = c.rot;
            this.scene.add(mesh);
            this.addBoxCollider(c.x, c.z, 2.4, 5.0); // Solid car collider
        });
    }

    createVehicleMesh(color = 0xdedede, isTaxi = false) {
        const car = new THREE.Group();
        const paint = new THREE.MeshStandardMaterial({ color: color, roughness: 0.35, metalness: 0.65 });
        const glass = new THREE.MeshStandardMaterial({ color: 0x1a2634, roughness: 0.1, metalness: 0.9 });
        const tire = new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.9 });

        const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 4.8), paint);
        body.position.y = 0.65;
        body.castShadow = true;
        car.add(body);

        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 2.6), glass);
        cabin.position.set(0, 1.4, -0.2);
        cabin.castShadow = true;
        car.add(cabin);

        [-1.1, 1.1].forEach(x => {
            [-1.5, 1.5].forEach(z => {
                const t = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.32, 12), tire);
                t.rotateZ(Math.PI / 2);
                t.position.set(x, 0.4, z);
                car.add(t);
            });
        });

        if (isTaxi) {
            const med = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.22, 0.4), new THREE.MeshStandardMaterial({ color: 0xffffff }));
            med.position.set(0, 1.9, -0.2);
            car.add(med);
        }

        return car;
    }

    createPoliceVehicle() {
        const cruiser = this.createVehicleMesh(0x161c28);
        const pLight = new THREE.PointLight(0xff0022, 1.6, 15);
        pLight.position.set(0, 2.1, -0.2);
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
                    const table = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.9, 16), new THREE.MeshStandardMaterial({ color: 0x222630 }));
                    table.position.y = 0.45;
                    g.add(table);

                    const laptop = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.5), new THREE.MeshStandardMaterial({ color: 0x111111 }));
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
                pos: { x: 40.0, z: -60.0 },
                color: 0xffb703,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const atm = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.8, 1.0), new THREE.MeshStandardMaterial({ color: 0x252e3d, metalness: 0.6 }));
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
                    const box = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 1.0), new THREE.MeshStandardMaterial({ color: 0x223628, metalness: 0.4 }));
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
                pos: { x: -120.0, z: 300.0 },
                color: 0xff3333,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const arcade = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.7, 1.0), new THREE.MeshStandardMaterial({ color: 0x1f1a26 }));
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
                pos: { x: -40.0, z: -155.0 },
                color: 0xb026ff,
                isBoss: true,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const frame = new THREE.Mesh(new THREE.BoxGeometry(8, 9, 1.5), new THREE.MeshStandardMaterial({ color: 0x2e3544, metalness: 0.85 }));
                    frame.position.y = 4.5;
                    g.add(frame);

                    const door = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.8, 32), new THREE.MeshStandardMaterial({ color: 0x3d4554, metalness: 0.9 }));
                    door.rotateX(Math.PI / 2);
                    door.position.set(0, 4.5, 0.6);
                    g.add(door);

                    const wheel = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.12, 12, 24), new THREE.MeshStandardMaterial({ color: 0xd0d5dd, metalness: 0.9 }));
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
                opacity: 0.8
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.y = 0.08;
            root.add(ring);

            const pLight = new THREE.PointLight(config.color, 1.6, 12);
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
            if (cl.position.x > 650) {
                cl.position.x = -650;
            }
        });

        this.policeLights.forEach(pl => {
            const isRed = Math.floor(time * 6) % 2 === 0;
            pl.color.setHex(isRed ? 0xff0022 : 0x0066ff);
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
