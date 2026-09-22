// High-Fidelity 1.2-Kilometer Coastal Metropolis (Cities: Skylines Style)
// Textured Buildings, Glass Windows, Brick Facades, Raised Sidewalks, Mountain Backdrop & Harbor Piers

class CyberBunkerWorld {
    constructor(scene) {
        this.scene = scene;
        this.terminals = [];
        this.animatedObjects = [];
        this.clouds = [];
        this.waterMesh = null;
        this.policeLights = [];

        // Build procedural texture palette
        this.textures = this.initProceduralTextures();

        this.initAtmosphere();
        this.buildSkyAndClouds();
        this.buildMountainBackdrop();
        this.buildRoadsSidewalksAndLawns();
        this.buildWaterfrontHarborAndPiers();
        this.buildOceanCruiseLiner();
        this.buildCargoContainerShip();
        this.buildTexturedCityBlocks();
        this.buildCentralParkDistrict();
        this.buildStreetPropsAndFoliage();
        this.buildMetropolisVehicles();
        this.buildChallengeStations();
    }

    initAtmosphere() {
        // Bright, crisp aerial perspective (matching Cities: Skylines)
        this.scene.fog = new THREE.Fog(0x9bd2f8, 350, 2400);

        // High-contrast Golden Sunlight
        const sunLight = new THREE.DirectionalLight(0xfffaec, 2.05);
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

        // Natural Sky & Ground Bounce (Rich sky blue and vibrant grass green)
        const hemiLight = new THREE.HemisphereLight(0x6eb5ff, 0x5a8a42, 1.25);
        this.scene.add(hemiLight);

        // Soft secondary fill
        const fillLight = new THREE.DirectionalLight(0xb5dcf8, 0.45);
        fillLight.position.set(-220, 260, -220);
        this.scene.add(fillLight);
    }

    initProceduralTextures() {
        // High-Resolution Procedural Canvas Textures for Buildings & Surfaces
        return {
            glassOffice: this.createGlassOfficeTexture(),
            brickFacade: this.createBrickFacadeTexture(),
            modernStucco: this.createModernStuccoTexture(),
            storefront: this.createStorefrontTexture(),
            roofGravel: this.createRoofGravelTexture(),
            asphalt: this.createAsphaltRoadTexture(),
            sidewalk: this.createSidewalkTexture()
        };
    }

    createGlassOfficeTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 512;
        const ctx = c.getContext('2d');

        // Dark corporate steel background
        ctx.fillStyle = '#1e2430';
        ctx.fillRect(0, 0, 512, 512);

        // Grid of reflective glass office windows
        const cols = 8;
        const rows = 12;
        const cellW = 512 / cols;
        const cellH = 512 / rows;

        for (let r = 0; r < rows; r++) {
            // Horizontal metallic floor spandrel
            ctx.fillStyle = '#2d3545';
            ctx.fillRect(0, r * cellH, 512, 4);

            for (let cIdx = 0; cIdx < cols; cIdx++) {
                const wx = cIdx * cellW + 4;
                const wy = r * cellH + 6;
                const ww = cellW - 8;
                const wh = cellH - 10;

                // Reflective window pane gradient (sky reflection)
                const winGrad = ctx.createLinearGradient(wx, wy, wx, wy + wh);
                const isLit = (cIdx + r * 3) % 7 === 0;
                if (isLit) {
                    winGrad.addColorStop(0, '#fce088');
                    winGrad.addColorStop(1, '#d49b28');
                } else {
                    winGrad.addColorStop(0, '#508ec2');
                    winGrad.addColorStop(0.5, '#2e5d87');
                    winGrad.addColorStop(1, '#1a3754');
                }
                ctx.fillStyle = winGrad;
                ctx.fillRect(wx, wy, ww, wh);

                // Window frame mullions
                ctx.strokeStyle = '#141821';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(wx, wy, ww, wh);
            }
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    createBrickFacadeTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 512;
        const ctx = c.getContext('2d');

        // Warm red/brown masonry brick
        ctx.fillStyle = '#8f4637';
        ctx.fillRect(0, 0, 512, 512);

        // Brick mortar lines
        ctx.fillStyle = '#6e3326';
        for (let y = 0; y < 512; y += 8) {
            ctx.fillRect(0, y, 512, 1.5);
            const offset = (y / 8) % 2 === 0 ? 0 : 12;
            for (let x = offset; x < 512; x += 24) {
                ctx.fillRect(x, y, 1.5, 8);
            }
        }

        // Window bays with stone lintels
        const cols = 6;
        const rows = 8;
        const cellW = 512 / cols;
        const cellH = 512 / rows;

        for (let r = 0; r < rows; r++) {
            for (let col = 0; col < cols; col++) {
                const wx = col * cellW + 12;
                const wy = r * cellH + 16;
                const ww = cellW - 24;
                const wh = cellH - 28;

                // White stone lintel & sill
                ctx.fillStyle = '#edeae4';
                ctx.fillRect(wx - 2, wy - 4, ww + 4, 4); // Top lintel
                ctx.fillRect(wx - 4, wy + wh, ww + 8, 4); // Bottom sill

                // Glass pane
                ctx.fillStyle = '#1c2e42';
                ctx.fillRect(wx, wy, ww, wh);

                // White window sash frame
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(wx, wy, ww, wh);
                ctx.beginPath();
                ctx.moveTo(wx + ww / 2, wy);
                ctx.lineTo(wx + ww / 2, wy + wh);
                ctx.moveTo(wx, wy + wh / 2);
                ctx.lineTo(wx + ww, wy + wh / 2);
                ctx.stroke();
            }
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    createModernStuccoTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 512;
        const ctx = c.getContext('2d');

        // Warm architectural cream concrete
        ctx.fillStyle = '#e5dfd3';
        ctx.fillRect(0, 0, 512, 512);

        // Concrete panel joint lines
        ctx.strokeStyle = '#c7beaf';
        ctx.lineWidth = 2;
        for (let y = 0; y < 512; y += 64) {
            ctx.beginPath();
            ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
        }
        for (let x = 0; x < 512; x += 128) {
            ctx.beginPath();
            ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
        }

        // Horizontal ribbon windows
        for (let y = 18; y < 512; y += 64) {
            ctx.fillStyle = '#22364c';
            ctx.fillRect(10, y, 492, 28);
            // Window dividers
            ctx.fillStyle = '#3a4e63';
            for (let x = 10; x < 500; x += 38) {
                ctx.fillRect(x, y, 2.5, 28);
            }
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    createStorefrontTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 256;
        const ctx = c.getContext('2d');

        ctx.fillStyle = '#2b313d';
        ctx.fillRect(0, 0, 512, 256);

        // Ground floor commercial displays
        const shops = ["CAFE BISTRO", "CITY MARKET", "BOOKSTORE", "BOUTIQUE"];
        const colors = ["#b32727", "#1e5c99", "#247a3e", "#c27c1f"];

        for (let i = 0; i < 4; i++) {
            const sx = i * 128;

            // Striped Canvas Awning
            const awnColor = colors[i];
            for (let ax = sx; ax < sx + 128; ax += 16) {
                ctx.fillStyle = (ax / 16) % 2 === 0 ? awnColor : '#ffffff';
                ctx.fillRect(ax, 30, 16, 45);
            }

            // Signboard
            ctx.fillStyle = '#181e28';
            ctx.fillRect(sx + 6, 8, 116, 20);
            ctx.fillStyle = '#f5b700';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(shops[i], sx + 64, 22);

            // Large shop display glass
            ctx.fillStyle = '#182b3d';
            ctx.fillRect(sx + 10, 80, 108, 160);
            ctx.strokeStyle = '#48586c';
            ctx.lineWidth = 2;
            ctx.strokeRect(sx + 10, 80, 108, 160);

            // Center entrance door
            ctx.fillStyle = '#3f2c1c';
            ctx.fillRect(sx + 44, 110, 40, 130);
            ctx.strokeStyle = '#f5b700';
            ctx.strokeRect(sx + 44, 110, 40, 130);
        }

        return new THREE.CanvasTexture(c);
    }

    createRoofGravelTexture() {
        const c = document.createElement('canvas');
        c.width = 256;
        c.height = 256;
        const ctx = c.getContext('2d');

        ctx.fillStyle = '#262b33';
        ctx.fillRect(0, 0, 256, 256);

        // Tar & gravel noise
        for (let i = 0; i < 6000; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const b = 30 + Math.random() * 30;
            ctx.fillStyle = `rgb(${b}, ${b}, ${b+2})`;
            ctx.fillRect(x, y, 2, 2);
        }

        // AC unit box footprint
        ctx.fillStyle = '#3f4754';
        ctx.fillRect(30, 30, 80, 60);
        ctx.fillRect(150, 140, 70, 70);

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    createAsphaltRoadTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 512;
        const ctx = c.getContext('2d');

        // Fine textured dark asphalt
        ctx.fillStyle = '#313642';
        ctx.fillRect(0, 0, 512, 512);

        for (let i = 0; i < 25000; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const b = 42 + Math.random() * 24;
            ctx.fillStyle = `rgb(${b}, ${b+1}, ${b+2})`;
            ctx.fillRect(x, y, 1.5, 1.5);
        }

        // Road markings: Double yellow center line
        ctx.fillStyle = '#f5b700';
        ctx.fillRect(253, 0, 2.5, 512);
        ctx.fillRect(258, 0, 2.5, 512);

        // White outer edge lines
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(18, 0, 3, 512);
        ctx.fillRect(491, 0, 3, 512);

        // Dashed white lane dividers
        for (let y = 10; y < 512; y += 42) {
            ctx.fillRect(135, y, 2.5, 22);
            ctx.fillRect(375, y, 2.5, 22);
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 16);
        return tex;
    }

    createSidewalkTexture() {
        const c = document.createElement('canvas');
        c.width = 256;
        c.height = 256;
        const ctx = c.getContext('2d');

        ctx.fillStyle = '#b8bcc4';
        ctx.fillRect(0, 0, 256, 256);

        // Paved flagstone grid
        ctx.strokeStyle = '#9ca1ab';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 256; i += 32) {
            ctx.beginPath();
            ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(8, 8);
        return tex;
    }

    buildSkyAndClouds() {
        // Vibrant Sky Dome
        const skyGeo = new THREE.SphereGeometry(2200, 32, 24);
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0.0, '#1050a8'); // Azure zenith
        grad.addColorStop(0.35, '#358de8'); // Clear sky
        grad.addColorStop(0.75, '#84beee'); // Sunny horizon
        grad.addColorStop(1.0, '#dcedfc');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 512);

        const skyTex = new THREE.CanvasTexture(canvas);
        const sky = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false }));
        this.scene.add(sky);

        // 3D Puffy Cumulus Clouds
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
        // Majestic Rolling Green Mountains in the Far Distance (Directly from Image 1)
        const mountainGroup = new THREE.Group();
        const mountainMat = new THREE.MeshStandardMaterial({
            color: 0x3d7033, // Rich mountain green
            roughness: 0.9,
            flatShading: true
        });

        // 1. North Mountain Ridge (Z = -650, spanning X = -600 to 400)
        for (let x = -550; x <= 450; x += 110) {
            const peakH = 140 + Math.sin(x * 0.02) * 50 + Math.random() * 40;
            const peakR = 90 + Math.random() * 30;
            const peak = new THREE.Mesh(new THREE.ConeGeometry(peakR, peakH, 8), mountainMat);
            peak.position.set(x, peakH / 2 - 10, -680);
            peak.scale.set(1.4, 1.0, 1.1);
            mountainGroup.add(peak);
        }

        // 2. West Mountain Ridge (X = -650, spanning Z = -500 to 500)
        for (let z = -450; z <= 450; z += 120) {
            const peakH = 120 + Math.cos(z * 0.02) * 45 + Math.random() * 35;
            const peakR = 85 + Math.random() * 25;
            const peak = new THREE.Mesh(new THREE.ConeGeometry(peakR, peakH, 8), mountainMat);
            peak.position.set(-680, peakH / 2 - 10, z);
            peak.scale.set(1.1, 1.0, 1.4);
            mountainGroup.add(peak);
        }

        // 3. Distant Suspension Bay Bridge connecting city to the green hills (Matching Image 1)
        const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x4a5462, metalness: 0.7, roughness: 0.4 });
        const bDeck = new THREE.Mesh(new THREE.BoxGeometry(220, 2.5, 16), bridgeMat);
        bDeck.position.set(-420, 32, -620);
        mountainGroup.add(bDeck);

        // Bridge Suspension Towers
        [-480, -360].forEach(tx => {
            const tower = new THREE.Mesh(new THREE.BoxGeometry(7, 75, 18), bridgeMat);
            tower.position.set(tx, 45, -620);
            mountainGroup.add(tower);
        });

        this.scene.add(mountainGroup);
    }

    buildRoadsSidewalksAndLawns() {
        // Ground base with green turf
        const grassMat = new THREE.MeshStandardMaterial({ color: 0x4a8c3d, roughness: 0.85 });
        const baseGround = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200), grassMat);
        baseGround.rotation.x = -Math.PI / 2;
        baseGround.position.y = -0.02;
        baseGround.receiveShadow = true;
        this.scene.add(baseGround);

        // Avenues and Streets with Crisp Asphalt & Repeating Textures
        const roadMat = new THREE.MeshStandardMaterial({
            map: this.textures.asphalt,
            roughness: 0.8,
            metalness: 0.15
        });

        // 1. Coastal Highway (North-South along X = 200)
        const hwGeo = new THREE.PlaneGeometry(26, 1160);
        const hwMesh = new THREE.Mesh(hwGeo, roadMat);
        hwMesh.rotation.x = -Math.PI / 2;
        hwMesh.position.set(200, 0.05, 0);
        hwMesh.receiveShadow = true;
        this.scene.add(hwMesh);

        // Concrete Highway Guardrail
        const guardMat = new THREE.MeshStandardMaterial({ color: 0x9ea3ab, roughness: 0.8 });
        const guard = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 1160), guardMat);
        guard.position.set(213, 0.5, 0);
        guard.castShadow = true;
        this.scene.add(guard);

        // 2. City Grid Avenues (North-South)
        const avenues = [-400, -260, -120, 20, 160];
        avenues.forEach(ax => {
            const avMesh = new THREE.Mesh(new THREE.PlaneGeometry(18, 1160), roadMat);
            avMesh.rotation.x = -Math.PI / 2;
            avMesh.position.set(ax, 0.05, 0);
            avMesh.receiveShadow = true;
            this.scene.add(avMesh);

            // Raised Sidewalks with Curbs on both sides of Avenue
            const swMat = new THREE.MeshStandardMaterial({ map: this.textures.sidewalk, roughness: 0.8 });
            [-11, 11].forEach(swOffset => {
                const sw = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.25, 1160), swMat);
                sw.position.set(ax + swOffset, 0.125, 0);
                sw.receiveShadow = true;
                this.scene.add(sw);

                // Concrete curb edge
                const curb = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 1160), guardMat);
                curb.position.set(ax + (swOffset > 0 ? swOffset - 1.8 : swOffset + 1.8), 0.15, 0);
                curb.castShadow = true;
                this.scene.add(curb);
            });
        });

        // 3. Cross Streets (East-West)
        const streets = [-450, -320, -190, -60, 70, 200, 330, 460];
        streets.forEach(sz => {
            const stTex = this.textures.asphalt.clone();
            stTex.repeat.set(1, 10);
            stTex.needsUpdate = true;
            const stMat = new THREE.MeshStandardMaterial({ map: stTex, roughness: 0.8 });

            const stMesh = new THREE.Mesh(new THREE.PlaneGeometry(16, 620), stMat);
            stMesh.rotation.x = -Math.PI / 2;
            stMesh.rotation.z = Math.PI / 2;
            stMesh.position.set(-110, 0.06, sz);
            stMesh.receiveShadow = true;
            this.scene.add(stMesh);
        });
    }

    buildWaterfrontHarborAndPiers() {
        // Deep Coastal Ocean Bay (X = 220 to 650, Z = -600 to 600)
        const waterGeo = new THREE.PlaneGeometry(450, 1240);
        const waterMat = new THREE.MeshStandardMaterial({
            color: 0x146886,
            roughness: 0.18,
            metalness: 0.85
        });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.rotation.x = -Math.PI / 2;
        water.position.set(435, -0.6, 0);
        this.scene.add(water);
        this.waterMesh = water;

        // Harbor Seawall Promenade (Along X = 220)
        const promenade = new THREE.Mesh(
            new THREE.BoxGeometry(18, 1.8, 1180),
            new THREE.MeshStandardMaterial({ map: this.textures.sidewalk, roughness: 0.85 })
        );
        promenade.position.set(221, 0.4, 0);
        promenade.castShadow = true;
        promenade.receiveShadow = true;
        this.scene.add(promenade);

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
        // 140m Ocean Cruise Liner docked at Pier 2 (Z = -210, X = 315)
        const ship = new THREE.Group();
        ship.position.set(315, 0, -188);

        const hullMat = new THREE.MeshStandardMaterial({ color: 0x1c2b44, roughness: 0.35, metalness: 0.5 });
        const whiteSuperMat = new THREE.MeshStandardMaterial({ color: 0xf5f7fa, roughness: 0.4, metalness: 0.1 });
        const funnelMat = new THREE.MeshStandardMaterial({ color: 0xd92626, roughness: 0.4 });
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x1b3a57, roughness: 0.1, metalness: 0.9 });

        // Hull
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

        // Passenger Decks
        const cabins1 = new THREE.Mesh(new THREE.BoxGeometry(105, 4.5, 18.5), whiteSuperMat);
        cabins1.position.set(-6, 9.4, 0);
        cabins1.castShadow = true;
        ship.add(cabins1);

        const cabins2 = new THREE.Mesh(new THREE.BoxGeometry(92, 4.2, 17.5), whiteSuperMat);
        cabins2.position.set(-10, 13.6, 0);
        cabins2.castShadow = true;
        ship.add(cabins2);

        // Funnels
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
    }

    buildCargoContainerShip() {
        // 120m Cargo Container Ship docked at Pier 4 (Z = 70, X = 310)
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

        // Containers
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
    }

    buildTexturedCityBlocks() {
        // Architectural Building Palette with Canvas Textures
        const matGlass = new THREE.MeshStandardMaterial({
            map: this.textures.glassOffice,
            roughness: 0.3,
            metalness: 0.7
        });

        const matBrick = new THREE.MeshStandardMaterial({
            map: this.textures.brickFacade,
            roughness: 0.85
        });

        const matStucco = new THREE.MeshStandardMaterial({
            map: this.textures.modernStucco,
            roughness: 0.75
        });

        const matStore = new THREE.MeshStandardMaterial({
            map: this.textures.storefront,
            roughness: 0.6
        });

        const matRoof = new THREE.MeshStandardMaterial({
            map: this.textures.roofGravel,
            roughness: 0.9
        });

        // 1. Landmark 160m Art Deco Spire Tower (Empire State style)
        this.buildArtDecoSpireTower(40, -80, matBrick, matGlass);

        // 2. Landmark 115m Crystal Mega-Tower (Faceted Glass)
        this.buildCrystalMegaTower(-40, -180, matGlass);

        // 3. Dense City Blocks with Window Grids & Rooftop Details
        const buildingDefinitions = [
            // Block 1 (X: -90 to -30, Z: -120 to -30)
            { x: -65, z: -80, w: 28, d: 26, h: 86, type: 'glass' },
            { x: -95, z: -55, w: 22, d: 20, h: 58, type: 'brick' },
            { x: -45, z: -45, w: 24, d: 22, h: 68, type: 'stucco' },

            // Block 2 (X: 10 to 80, Z: -150 to -70)
            { x: 15, z: -125, w: 28, d: 26, h: 94, type: 'glass' },
            { x: 65, z: -135, w: 24, d: 22, h: 76, type: 'stucco' },

            // Block 3 (X: 100 to 170, Z: -120 to -30)
            { x: 135, z: -75, w: 32, d: 28, h: 82, type: 'glass' },
            { x: 140, z: -25, w: 26, d: 24, h: 64, type: 'brick' },

            // Block 4 (X: -110 to -30, Z: -260 to -170)
            { x: -85, z: -220, w: 28, d: 26, h: 80, type: 'stucco' },
            { x: -50, z: -245, w: 24, d: 22, h: 72, type: 'glass' },

            // Block 5 (X: 20 to 110, Z: -270 to -180)
            { x: 55, z: -230, w: 30, d: 28, h: 90, type: 'glass' },
            { x: 95, z: -245, w: 22, d: 24, h: 64, type: 'brick' },

            // Block 6 (X: 120 to 180, Z: -280 to -180)
            { x: 150, z: -235, w: 28, d: 26, h: 74, type: 'stucco' },

            // Block 7 (X: -120 to -30, Z: -420 to -310)
            { x: -85, z: -370, w: 34, d: 30, h: 84, type: 'glass' },
            { x: -45, z: -340, w: 24, d: 22, h: 62, type: 'brick' },

            // Block 8 (X: 10 to 100, Z: -430 to -320)
            { x: 50, z: -380, w: 32, d: 28, h: 96, type: 'glass' },
            { x: 85, z: -345, w: 24, d: 22, h: 68, type: 'stucco' },

            // Block 9 (X: 115 to 180, Z: -430 to -320)
            { x: 145, z: -375, w: 30, d: 26, h: 78, type: 'glass' },

            // Mid-rise Downtown Storefront Blocks (Z: 0 to 150)
            { x: -60, z: 20, w: 28, d: 26, h: 42, type: 'store' },
            { x: -60, z: 65, w: 26, d: 24, h: 36, type: 'brick' },
            { x: 70, z: 20, w: 28, d: 26, h: 46, type: 'store' },
            { x: 65, z: 65, w: 26, d: 24, h: 38, type: 'brick' },
            { x: 145, z: 20, w: 26, d: 24, h: 44, type: 'store' }
        ];

        // Additional city blocks to fill the 1.2km metropolis
        for (let bx = -140; bx <= 165; bx += 40) {
            for (let bz = -460; bz <= 90; bz += 44) {
                if (Math.abs(bx - 40) < 28 && Math.abs(bz + 80) < 28) continue;
                if (Math.abs(bx + 40) < 28 && Math.abs(bz + 180) < 28) continue;

                const types = ['glass', 'brick', 'stucco', 'store'];
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

        // Residential Brick Brownstones in the South District (Z = 180 to 520)
        for (let rx = -440; rx <= 140; rx += 65) {
            for (let rz = 220; rz <= 500; rz += 75) {
                const rh = 18 + Math.floor(Math.random() * 16);
                buildingDefinitions.push({
                    x: rx,
                    z: rz,
                    w: 48,
                    d: 52,
                    h: rh,
                    type: (rx % 2 === 0 ? 'brick' : 'stucco')
                });
            }
        }

        buildingDefinitions.forEach(b => {
            let facadeMat;
            if (b.type === 'glass') facadeMat = matGlass;
            else if (b.type === 'brick') facadeMat = matBrick;
            else if (b.type === 'store') facadeMat = matStore;
            else facadeMat = matStucco;

            const bGroup = new THREE.Group();
            bGroup.position.set(b.x, 0, b.z);

            // Main Building Box with Procedural Textured Facade
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), facadeMat);
            mesh.position.y = b.h / 2;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            bGroup.add(mesh);

            // Roof with Gravel Texture & Parapet Ledge
            const roof = new THREE.Mesh(new THREE.BoxGeometry(b.w, 0.6, b.d), matRoof);
            roof.position.y = b.h + 0.3;
            bGroup.add(roof);

            const parapet = new THREE.Mesh(
                new THREE.BoxGeometry(b.w + 0.8, 1.2, b.d + 0.8),
                new THREE.MeshStandardMaterial({ color: 0x3d434d })
            );
            parapet.position.y = b.h + 0.6;
            parapet.castShadow = true;
            bGroup.add(parapet);

            // Rooftop AC units, Vents & Water Tanks
            if (b.h > 50) {
                // AC Chiller boxes
                const ac = new THREE.Mesh(
                    new THREE.BoxGeometry(b.w * 0.35, 2.5, b.d * 0.3),
                    new THREE.MeshStandardMaterial({ color: 0x5a6373, metalness: 0.8, roughness: 0.3 })
                );
                ac.position.set(b.w * 0.15, b.h + 1.8, -b.d * 0.15);
                bGroup.add(ac);

                // Water tank
                const tank = new THREE.Mesh(
                    new THREE.CylinderGeometry(2.2, 2.2, 4.2, 12),
                    new THREE.MeshStandardMaterial({ color: 0x594232, roughness: 0.9 })
                );
                tank.position.set(-b.w * 0.2, b.h + 3.5, b.d * 0.2);
                bGroup.add(tank);
            }

            this.scene.add(bGroup);
        });
    }

    buildArtDecoSpireTower(x, z, brickMat, glassMat) {
        // 160m Art Deco Skyscraper with Spire & Beacon
        const g = new THREE.Group();
        g.position.set(x, 0, z);

        const stoneMat = new THREE.MeshStandardMaterial({ map: this.textures.brickFacade, roughness: 0.65 });
        const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd8dde6, metalness: 0.95, roughness: 0.1 });

        // Tier 1 Base
        const base = new THREE.Mesh(new THREE.BoxGeometry(36, 24, 36), stoneMat);
        base.position.y = 12;
        base.castShadow = true;
        g.add(base);

        // Tier 2 Shaft
        const t2 = new THREE.Mesh(new THREE.BoxGeometry(28, 46, 28), glassMat);
        t2.position.y = 47;
        t2.castShadow = true;
        g.add(t2);

        // Tier 3 Shaft
        const t3 = new THREE.Mesh(new THREE.BoxGeometry(22, 42, 22), glassMat);
        t3.position.y = 91;
        t3.castShadow = true;
        g.add(t3);

        // Tier 4 Crown
        const t4 = new THREE.Mesh(new THREE.BoxGeometry(16, 26, 16), stoneMat);
        t4.position.y = 125;
        t4.castShadow = true;
        g.add(t4);

        // Radiator Crown
        const crown = new THREE.Mesh(new THREE.ConeGeometry(9, 14, 4), chromeMat);
        crown.rotateY(Math.PI / 4);
        crown.position.y = 145;
        crown.castShadow = true;
        g.add(crown);

        // 160m Spire & Beacon
        const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 1.2, 24, 8), chromeMat);
        spire.position.y = 164;
        g.add(spire);

        const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0022 }));
        beacon.position.y = 176;
        g.add(beacon);

        this.scene.add(g);
    }

    buildCrystalMegaTower(x, z, glassMat) {
        // 115m Faceted Glass Mega-Tower
        const g = new THREE.Group();
        g.position.set(x, 0, z);

        const tower = new THREE.Mesh(new THREE.CylinderGeometry(14, 24, 115, 8), glassMat);
        tower.position.y = 57.5;
        tower.castShadow = true;
        tower.receiveShadow = true;
        g.add(tower);

        this.scene.add(g);
    }

    buildCentralParkDistrict() {
        // 340m x 500m Central Park (X = -480 to -160, Z = -250 to 250)
        const parkGroup = new THREE.Group();
        parkGroup.position.set(-320, 0, 0);

        // Lush Green Grass Turf
        const grassMat = new THREE.MeshStandardMaterial({ color: 0x3d8235, roughness: 0.9 });
        const turf = new THREE.Mesh(new THREE.BoxGeometry(310, 0.4, 490), grassMat);
        turf.position.y = 0.2;
        turf.receiveShadow = true;
        parkGroup.add(turf);

        // Central Park Lake
        const lakeMat = new THREE.MeshStandardMaterial({ color: 0x1b4d3e, roughness: 0.15, metalness: 0.75 });
        const lake = new THREE.Mesh(new THREE.CylinderGeometry(36, 42, 0.6, 24), lakeMat);
        lake.position.set(0, 0.3, 0);
        parkGroup.add(lake);

        // Paved Walking Paths
        const pathMat = new THREE.MeshStandardMaterial({ color: 0x8f867a, roughness: 0.85 });
        const mainPath = new THREE.Mesh(new THREE.BoxGeometry(12, 0.45, 480), pathMat);
        mainPath.position.set(0, 0.23, 0);
        parkGroup.add(mainPath);

        const crossPath = new THREE.Mesh(new THREE.BoxGeometry(300, 0.45, 10), pathMat);
        crossPath.position.set(0, 0.23, 0);
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

    buildStreetPropsAndFoliage() {
        // Victorian Streetlamps along Sidewalks
        const lampMat = new THREE.MeshStandardMaterial({ color: 0x222830, metalness: 0.85, roughness: 0.3 });
        const globeMat = new THREE.MeshStandardMaterial({ color: 0xfffae0, emissive: 0xffe899, emissiveIntensity: 0.6 });

        const lampPositions = [
            { x: 10, z: -10 }, { x: 10, z: 20 }, { x: 10, z: -40 },
            { x: -10, z: -10 }, { x: -10, z: 20 }, { x: -10, z: -40 },
            { x: 188, z: -10 }, { x: 188, z: 40 }, { x: 188, z: -60 },
            { x: 212, z: -10 }, { x: 212, z: 40 }, { x: 212, z: -60 }
        ];

        lampPositions.forEach(p => {
            const lamp = new THREE.Group();
            lamp.position.set(p.x, 0, p.z);

            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 5.2, 8), lampMat);
            post.position.y = 2.6;
            post.castShadow = true;
            lamp.add(post);

            const globe = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), globeMat);
            globe.position.set(0, 5.2, 0);
            lamp.add(globe);

            this.scene.add(lamp);
        });

        // Fire Hydrants
        const hydrantMat = new THREE.MeshStandardMaterial({ color: 0xcc2222, roughness: 0.4 });
        [-8, 12, 192].forEach(hx => {
            [-15, 35].forEach(hz => {
                const hyd = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.8, 8), hydrantMat);
                hyd.position.set(hx, 0.4, hz);
                hyd.castShadow = true;
                this.scene.add(hyd);
            });
        });

        // Trees along Sidewalks
        const treeMat = new THREE.MeshStandardMaterial({ color: 0x2e752e, roughness: 0.7 });
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3625, roughness: 0.9 });

        [-12, 12].forEach(tx => {
            for (let tz = -80; tz <= 80; tz += 22) {
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

        // Drift clouds
        this.clouds.forEach(cl => {
            cl.position.x += delta * 4.5;
            if (cl.position.x > 650) {
                cl.position.x = -650;
            }
        });

        // Police flashing emergency lights
        this.policeLights.forEach(pl => {
            const isRed = Math.floor(time * 6) % 2 === 0;
            pl.color.setHex(isRed ? 0xff0022 : 0x0066ff);
        });

        // Terminals pulse
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
