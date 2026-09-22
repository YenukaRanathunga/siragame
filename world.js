// 1.2-Kilometer Open-World Coastal Metropolis (Harbor Piers, Cruise Ships, 100+ Skyscrapers, Central Park)

class CyberBunkerWorld {
    constructor(scene) {
        this.scene = scene;
        this.terminals = [];
        this.animatedObjects = [];
        this.clouds = [];
        this.waterMesh = null;
        this.policeLights = [];

        this.initAtmosphere();
        this.buildSkyAndClouds();
        this.build1200mRoadAndTerrain();
        this.buildWaterfrontHarborAndPiers();
        this.buildOceanCruiseLiner();
        this.buildCargoContainerShip();
        this.buildDowntownSkyscraperSkyline();
        this.buildCentralParkDistrict();
        this.buildHeritageAndResidentialDistrict();
        this.buildMetropolisVehicles();
        this.buildChallengeStations();
    }

    initAtmosphere() {
        // Vast aerial perspective haze across the 1.2km city
        this.scene.fog = new THREE.Fog(0x9bd0f7, 280, 2600);

        // Golden Sunlight (Directional Light illuminating the city)
        const sunLight = new THREE.DirectionalLight(0xfffaec, 1.9);
        sunLight.position.set(250, 450, 200);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 10;
        sunLight.shadow.camera.far = 1200;
        sunLight.shadow.camera.left = -350;
        sunLight.shadow.camera.right = 350;
        sunLight.shadow.camera.top = 350;
        sunLight.shadow.camera.bottom = -350;
        sunLight.shadow.bias = -0.0003;
        this.scene.add(sunLight);

        // Natural Hemisphere Sky Bounce
        const hemiLight = new THREE.HemisphereLight(0x78b8ff, 0x8b806d, 1.15);
        this.scene.add(hemiLight);

        // Soft secondary fill light
        const fillLight = new THREE.DirectionalLight(0xaad0f8, 0.45);
        fillLight.position.set(-200, 250, -200);
        this.scene.add(fillLight);
    }

    buildSkyAndClouds() {
        // Giant Sky Dome (Radius 2200m)
        const skyGeo = new THREE.SphereGeometry(2200, 32, 24);
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0.0, '#1357b3'); // Deep sapphire blue
        grad.addColorStop(0.35, '#3b9bf0'); // Clear daylight cerulean
        grad.addColorStop(0.8, '#8ec8f8'); // Soft coastal sky
        grad.addColorStop(1.0, '#dcedfc'); // Sunny horizon
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 512);

        const skyTex = new THREE.CanvasTexture(canvas);
        const skyMat = new THREE.MeshBasicMaterial({
            map: skyTex,
            side: THREE.BackSide,
            fog: false
        });
        const sky = new THREE.Mesh(skyGeo, skyMat);
        this.scene.add(sky);

        // Drifting 3D Cumulus Clouds across the 1.2km sky
        const cloudMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.95,
            metalness: 0.05,
            flatShading: true
        });

        for (let i = 0; i < 20; i++) {
            const cloud = new THREE.Group();
            const numPuffs = 6 + Math.floor(Math.random() * 5);
            const baseScale = 2.2 + Math.random() * 2.0;

            for (let j = 0; j < numPuffs; j++) {
                const r = (16 + Math.random() * 14) * baseScale;
                const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 1), cloudMat);
                puff.position.set(
                    (Math.random() - 0.5) * 70 * baseScale,
                    (Math.random() * 16) * baseScale,
                    (Math.random() - 0.5) * 50 * baseScale
                );
                puff.scale.set(1.3, 0.7, 1.0);
                cloud.add(puff);
            }

            cloud.position.set(
                (Math.random() - 0.5) * 1100,
                240 + Math.random() * 120,
                (Math.random() - 0.5) * 1100
            );
            this.scene.add(cloud);
            this.clouds.push(cloud);
        }
    }

    build1200mRoadAndTerrain() {
        // Massive 1200m x 1200m Ground Plane
        // High-res asphalt texture
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Dark city asphalt
        ctx.fillStyle = '#323742';
        ctx.fillRect(0, 0, 1024, 1024);

        // Asphalt grain
        for (let i = 0; i < 40000; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 1024;
            const b = 45 + Math.random() * 25;
            ctx.fillStyle = `rgb(${b}, ${b+1}, ${b+2})`;
            ctx.fillRect(x, y, 2, 2);
        }

        // Major Grid Lines on Texture
        ctx.fillStyle = '#f5b700'; // Yellow center lines
        // Avenues (Vertical lines)
        [180, 300, 420, 530, 650, 710].forEach(gx => {
            ctx.fillRect(gx, 0, 2, 1024);
        });
        // Streets (Horizontal lines)
        [120, 240, 360, 480, 600, 720, 840, 940].forEach(gy => {
            ctx.fillRect(0, gy, 720, 2);
        });

        // Zebra Crossings
        ctx.fillStyle = 'rgba(235, 240, 250, 0.85)';
        [180, 300, 420, 530, 650].forEach(gx => {
            [120, 240, 360, 480, 600, 720, 840].forEach(gy => {
                for (let i = -16; i <= 16; i += 6) {
                    ctx.fillRect(gx + i, gy - 25, 3, 10);
                    ctx.fillRect(gx + i, gy + 15, 3, 10);
                    ctx.fillRect(gx - 25, gy + i, 10, 3);
                    ctx.fillRect(gx + 15, gy + i, 10, 3);
                }
            });
        });

        const groundTex = new THREE.CanvasTexture(canvas);
        groundTex.wrapS = THREE.RepeatWrapping;
        groundTex.wrapT = THREE.RepeatWrapping;
        groundTex.repeat.set(1, 1);

        const groundGeo = new THREE.PlaneGeometry(1200, 1200);
        const groundMat = new THREE.MeshStandardMaterial({
            map: groundTex,
            roughness: 0.8,
            metalness: 0.15
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Multi-lane Coastal Highway along X = 200 (Runs from Z = -580 to +580)
        const hwMat = new THREE.MeshStandardMaterial({ color: 0x2b303b, roughness: 0.7 });
        const hw = new THREE.Mesh(new THREE.BoxGeometry(26, 0.3, 1160), hwMat);
        hw.position.set(200, 0.15, 0);
        hw.receiveShadow = true;
        this.scene.add(hw);

        // Highway Concrete Barriers & Streetlights
        const barrierMat = new THREE.MeshStandardMaterial({ color: 0x9fa4ad, roughness: 0.8 });
        const barrier = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.1, 1160), barrierMat);
        barrier.position.set(213, 0.55, 0);
        barrier.castShadow = true;
        this.scene.add(barrier);

        // Highway Center Divider
        const divider = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1160), barrierMat);
        divider.position.set(200, 0.45, 0);
        divider.castShadow = true;
        this.scene.add(divider);
    }

    buildWaterfrontHarborAndPiers() {
        // Deep Coastal Ocean Bay (X = 220 to 650, Z = -600 to 600)
        const waterGeo = new THREE.PlaneGeometry(450, 1240);
        const waterMat = new THREE.MeshStandardMaterial({
            color: 0x125f7a,
            roughness: 0.15,
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
            new THREE.MeshStandardMaterial({ color: 0x828894, roughness: 0.85 })
        );
        promenade.position.set(221, 0.4, 0);
        promenade.castShadow = true;
        promenade.receiveShadow = true;
        this.scene.add(promenade);

        // 6 Walkable Finger Piers extending into Ocean
        const pierZs = [-350, -210, -70, 70, 210, 350];
        const pierWoodMat = new THREE.MeshStandardMaterial({ color: 0x4d3b2b, roughness: 0.9 });
        const pierPilingMat = new THREE.MeshStandardMaterial({ color: 0x2b221a, roughness: 0.95 });

        pierZs.forEach((pz, idx) => {
            const pierLen = (idx === 1 || idx === 3) ? 120 : 95;
            const pierW = (idx === 1 || idx === 3) ? 22 : 18;

            const pier = new THREE.Group();
            pier.position.set(220 + pierLen / 2, 0.7, pz);

            // Pier Deck
            const deck = new THREE.Mesh(new THREE.BoxGeometry(pierLen, 0.9, pierW), pierWoodMat);
            deck.castShadow = true;
            deck.receiveShadow = true;
            pier.add(deck);

            // Support Pilings beneath pier
            for (let px = -pierLen / 2 + 8; px < pierLen / 2; px += 16) {
                [-pierW / 2 + 1.5, pierW / 2 - 1.5].forEach(pzOff => {
                    const piling = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 3.8, 8), pierPilingMat);
                    piling.position.set(px, -1.5, pzOff);
                    pier.add(piling);
                });
            }

            // Mooring Bollards / Cleats on Pier Edge
            for (let px = -pierLen / 2 + 10; px < pierLen / 2 - 5; px += 18) {
                const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.7, 8), new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 }));
                bollard.position.set(px, 0.8, pierW / 2 - 1);
                bollard.castShadow = true;
                pier.add(bollard);
            }

            // Pier Sign
            const signTex = this.createLabelTexture(`PIER ${idx + 1}`, "#ffcc00", "#181e28");
            const sign = new THREE.Mesh(new THREE.BoxGeometry(6, 1.8, 0.4), new THREE.MeshStandardMaterial({ map: signTex }));
            sign.position.set(-pierLen / 2 + 4, 2.2, 0);
            sign.rotateY(Math.PI / 2);
            pier.add(sign);

            this.scene.add(pier);
        });
    }

    buildOceanCruiseLiner() {
        // Massive 140m Ocean Cruise Liner docked at Pier 2 (Z = -210, X = 320)
        const ship = new THREE.Group();
        ship.position.set(315, 0, -188);

        const hullMat = new THREE.MeshStandardMaterial({ color: 0x1c2b44, roughness: 0.35, metalness: 0.5 });
        const whiteSuperMat = new THREE.MeshStandardMaterial({ color: 0xf5f7fa, roughness: 0.4, metalness: 0.1 });
        const funnelMat = new THREE.MeshStandardMaterial({ color: 0xd92626, roughness: 0.4 });
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x1b3a57, roughness: 0.1, metalness: 0.9 });
        const teakMat = new THREE.MeshStandardMaterial({ color: 0x99754d, roughness: 0.85 });

        // 1. Lower Ship Hull
        const hull = new THREE.Mesh(new THREE.BoxGeometry(138, 7.5, 21), hullMat);
        hull.position.y = 2.8;
        hull.castShadow = true;
        ship.add(hull);

        // Bulbous Bow / Tapered Front
        const bow = new THREE.Mesh(new THREE.ConeGeometry(12, 28, 4), hullMat);
        bow.rotateZ(-Math.PI / 2);
        bow.rotateY(Math.PI / 4);
        bow.position.set(78, 3.2, 0);
        bow.scale.set(0.6, 1.0, 0.9);
        bow.castShadow = true;
        ship.add(bow);

        // 2. Main Teak Promenade Deck
        const deck1 = new THREE.Mesh(new THREE.BoxGeometry(130, 0.8, 20.4), teakMat);
        deck1.position.y = 6.95;
        deck1.receiveShadow = true;
        ship.add(deck1);

        // 3. Multi-Tiered Passenger Decks (Decks 2 - 5)
        const cabins1 = new THREE.Mesh(new THREE.BoxGeometry(105, 4.5, 18.5), whiteSuperMat);
        cabins1.position.set(-6, 9.4, 0);
        cabins1.castShadow = true;
        ship.add(cabins1);

        const cabins2 = new THREE.Mesh(new THREE.BoxGeometry(92, 4.2, 17.5), whiteSuperMat);
        cabins2.position.set(-10, 13.6, 0);
        cabins2.castShadow = true;
        ship.add(cabins2);

        // Rows of Cabin Balconies / Windows
        for (let x = -48; x <= 34; x += 6) {
            [-9.3, 9.3].forEach(z => {
                const balc = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.8, 0.3), glassMat);
                balc.position.set(x, 9.5, z);
                ship.add(balc);
                const balc2 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.8, 0.3), glassMat);
                balc2.position.set(x, 13.8, z);
                ship.add(balc2);
            });
        }

        // 4. Navigation Bridge Deck
        const bridge = new THREE.Mesh(new THREE.BoxGeometry(18, 3.8, 22), whiteSuperMat);
        bridge.position.set(38, 15.5, 0);
        bridge.castShadow = true;
        ship.add(bridge);

        const bridgeGlass = new THREE.Mesh(new THREE.BoxGeometry(14, 1.6, 22.2), glassMat);
        bridgeGlass.position.set(40, 16.2, 0);
        ship.add(bridgeGlass);

        // 5. Sun Deck with Swimming Pool
        const sunDeck = new THREE.Mesh(new THREE.BoxGeometry(78, 1.0, 16.5), teakMat);
        sunDeck.position.set(-15, 16.0, 0);
        sunDeck.receiveShadow = true;
        ship.add(sunDeck);

        const pool = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 8), new THREE.MeshStandardMaterial({ color: 0x00a8ff, roughness: 0.1 }));
        pool.position.set(-20, 16.6, 0);
        ship.add(pool);

        // 6. Two Aerodynamic Red & Black Cruise Funnels
        [-2, -32].forEach(fx => {
            const funnel = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.6, 8.5, 16), funnelMat);
            funnel.position.set(fx, 20.8, 0);
            funnel.scale.set(1.4, 1.0, 0.85);
            funnel.castShadow = true;
            ship.add(funnel);

            // Black cap
            const cap = new THREE.Mesh(new THREE.CylinderGeometry(2.82, 2.82, 1.6, 16), new THREE.MeshStandardMaterial({ color: 0x111111 }));
            cap.position.set(fx, 24.2, 0);
            cap.scale.set(1.4, 1.0, 0.85);
            ship.add(cap);
        });

        // 7. Radar Mast
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.6, 12, 8), new THREE.MeshStandardMaterial({ color: 0xcccccc }));
        mast.position.set(30, 21.0, 0);
        ship.add(mast);

        // Walkable Gangway bridge connecting Pier 2 to Ship
        const gangway = new THREE.Mesh(
            new THREE.BoxGeometry(16, 0.6, 3.5),
            new THREE.MeshStandardMaterial({ color: 0x88909c, metalness: 0.7 })
        );
        gangway.position.set(-20, 6.7, -13);
        gangway.rotateY(Math.PI / 6);
        gangway.castShadow = true;
        ship.add(gangway);

        this.scene.add(ship);
    }

    buildCargoContainerShip() {
        // 120m Cargo Container Ship docked at Pier 4 (Z = 70, X = 320)
        const ship = new THREE.Group();
        ship.position.set(310, 0, 92);

        const hullMat = new THREE.MeshStandardMaterial({ color: 0xa82b2b, roughness: 0.5 });
        const superMat = new THREE.MeshStandardMaterial({ color: 0xe6ebf2, roughness: 0.5 });
        const containerColors = [0x1f5ea8, 0xb53526, 0x228045, 0xc98616, 0x48505e];

        // Hull
        const hull = new THREE.Mesh(new THREE.BoxGeometry(118, 6.5, 19), hullMat);
        hull.position.y = 2.4;
        hull.castShadow = true;
        ship.add(hull);

        // Bridge Superstructure at Stern
        const bridge = new THREE.Mesh(new THREE.BoxGeometry(16, 14, 17), superMat);
        bridge.position.set(-42, 10.0, 0);
        bridge.castShadow = true;
        ship.add(bridge);

        // Stacks of Shipping Containers (Cargo Deck)
        let cIdx = 0;
        for (let x = -26; x <= 42; x += 12) {
            for (let z = -6.5; z <= 6.5; z += 4.5) {
                for (let y = 6.2; y <= 11.0; y += 2.6) {
                    const cMat = new THREE.MeshStandardMaterial({
                        color: containerColors[(cIdx++) % containerColors.length],
                        roughness: 0.6,
                        metalness: 0.3
                    });
                    const container = new THREE.Mesh(new THREE.BoxGeometry(11.2, 2.4, 4.0), cMat);
                    container.position.set(x, y, z);
                    container.castShadow = true;
                    ship.add(container);
                }
            }
        }

        // Deck Crane
        const cranePost = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 12, 8), new THREE.MeshStandardMaterial({ color: 0xf5b700 }));
        cranePost.position.set(10, 11, 0);
        ship.add(cranePost);

        const craneArm = new THREE.Mesh(new THREE.BoxGeometry(22, 0.8, 0.8), new THREE.MeshStandardMaterial({ color: 0xf5b700 }));
        craneArm.position.set(18, 16.5, 0);
        craneArm.rotateZ(0.2);
        ship.add(craneArm);

        this.scene.add(ship);
    }

    buildDowntownSkyscraperSkyline() {
        // 80+ Skyscrapers & Towers across Downtown Core (X = -140 to 180, Z = -480 to 120)
        const materials = [
            new THREE.MeshStandardMaterial({ color: 0x3d668f, roughness: 0.2, metalness: 0.8 }), // Azure Glass
            new THREE.MeshStandardMaterial({ color: 0xdedcd7, roughness: 0.65, metalness: 0.1 }), // White Limestone
            new THREE.MeshStandardMaterial({ color: 0x485161, roughness: 0.45, metalness: 0.6 }), // Slate Corporate
            new THREE.MeshStandardMaterial({ color: 0x8a7a6a, roughness: 0.75 }), // Warm Sandstone
            new THREE.MeshStandardMaterial({ color: 0x222a36, roughness: 0.3, metalness: 0.85 }), // Obsidian Glass
            new THREE.MeshStandardMaterial({ color: 0xa86048, roughness: 0.8 }) // Classic Red Brick
        ];

        // 1. Landmark 160m Art Deco Spire Tower (Empire State / Chrysler style)
        this.buildArtDecoSpireTower(40, -80);

        // 2. Landmark 115m Crystal Mega-Tower (One World style)
        this.buildCrystalMegaTower(-40, -180);

        // 3. Dense Skyline Grid (Organized in City Blocks)
        const blocks = [
            // Block 1 (X: -100 to -40, Z: -120 to -40)
            { x: -70, z: -80, w: 26, d: 24, h: 88, mat: 0 },
            { x: -95, z: -55, w: 20, d: 18, h: 62, mat: 2 },
            { x: -45, z: -55, w: 22, d: 20, h: 72, mat: 1 },

            // Block 2 (X: 0 to 80, Z: -160 to -100)
            { x: 15, z: -130, w: 28, d: 26, h: 96, mat: 4 },
            { x: 65, z: -140, w: 24, d: 22, h: 78, mat: 1 },

            // Block 3 (X: 100 to 170, Z: -120 to -30)
            { x: 135, z: -75, w: 32, d: 28, h: 84, mat: 0 },
            { x: 140, z: -25, w: 26, d: 24, h: 68, mat: 3 },

            // Block 4 (X: -120 to -30, Z: -260 to -180)
            { x: -85, z: -220, w: 28, d: 26, h: 82, mat: 2 },
            { x: -50, z: -245, w: 24, d: 22, h: 74, mat: 1 },

            // Block 5 (X: 20 to 110, Z: -270 to -190)
            { x: 55, z: -230, w: 30, d: 28, h: 92, mat: 0 },
            { x: 95, z: -245, w: 22, d: 24, h: 66, mat: 4 },

            // Block 6 (X: 120 to 180, Z: -280 to -190)
            { x: 150, z: -235, w: 28, d: 26, h: 76, mat: 1 },

            // Block 7 (X: -130 to -40, Z: -420 to -320)
            { x: -85, z: -370, w: 34, d: 30, h: 86, mat: 4 },
            { x: -45, z: -340, w: 24, d: 22, h: 64, mat: 3 },

            // Block 8 (X: 10 to 100, Z: -430 to -330)
            { x: 50, z: -380, w: 32, d: 28, h: 98, mat: 0 },
            { x: 85, z: -345, w: 24, d: 22, h: 70, mat: 2 },

            // Block 9 (X: 115 to 180, Z: -430 to -330)
            { x: 145, z: -375, w: 30, d: 26, h: 80, mat: 1 },

            // Block 10 (X: -90 to -20, Z: -20 to 60)
            { x: -55, z: 20, w: 26, d: 24, h: 56, mat: 3 },
            { x: -55, z: 50, w: 24, d: 22, h: 48, mat: 5 },

            // Block 11 (X: 30 to 110, Z: -20 to 60)
            { x: 70, z: 20, w: 28, d: 26, h: 62, mat: 1 },
            { x: 65, z: 50, w: 24, d: 22, h: 52, mat: 0 },

            // Block 12 (X: 120 to 180, Z: -20 to 60)
            { x: 150, z: 20, w: 26, d: 24, h: 58, mat: 2 }
        ];

        // Additional procedural background towers to reach 80+ skyscrapers
        for (let bx = -140; bx <= 170; bx += 38) {
            for (let bz = -460; bz <= 80; bz += 42) {
                // Skip areas already defined
                if (Math.abs(bx - 40) < 30 && Math.abs(bz + 80) < 30) continue;
                if (Math.abs(bx + 40) < 30 && Math.abs(bz + 180) < 30) continue;

                const h = 42 + Math.floor(Math.sin(bx * 0.05 + bz * 0.05) * 22 + Math.random() * 26);
                const matIdx = Math.floor(Math.random() * materials.length);
                blocks.push({
                    x: bx + (Math.random() - 0.5) * 8,
                    z: bz + (Math.random() - 0.5) * 8,
                    w: 22 + Math.floor(Math.random() * 8),
                    d: 20 + Math.floor(Math.random() * 8),
                    h: h,
                    mat: matIdx
                });
            }
        }

        blocks.forEach(b => {
            const mat = materials[b.mat];
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), mat);
            mesh.position.set(b.x, b.h / 2, b.z);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);

            // Detailed Rooftops: Water Towers, Helipads, Antennas
            if (b.h > 70) {
                // Helipad on tall towers
                const heliPad = new THREE.Mesh(
                    new THREE.CylinderGeometry(b.w * 0.35, b.w * 0.35, 0.4, 16),
                    new THREE.MeshStandardMaterial({ color: 0x1f242e, roughness: 0.8 })
                );
                heliPad.position.set(b.x, b.h + 0.2, b.z);
                this.scene.add(heliPad);

                // "H" marking
                const hMark = new THREE.Mesh(
                    new THREE.BoxGeometry(3.5, 0.5, 1.0),
                    new THREE.MeshBasicMaterial({ color: 0xf5b700 })
                );
                hMark.position.set(b.x, b.h + 0.3, b.z);
                this.scene.add(hMark);
            } else if (b.h > 50) {
                // Iconic NYC Wooden Water Tank on steel stilts
                const tankGroup = new THREE.Group();
                tankGroup.position.set(b.x + b.w * 0.2, b.h, b.z + b.d * 0.2);

                const stilts = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.2, 4.5, 6), new THREE.MeshStandardMaterial({ color: 0x2b303a, metalness: 0.8 }));
                stilts.position.y = 2.25;
                tankGroup.add(stilts);

                const barrel = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 4.0, 12), new THREE.MeshStandardMaterial({ color: 0x5a4332, roughness: 0.9 }));
                barrel.position.y = 6.5;
                tankGroup.add(barrel);

                const cone = new THREE.Mesh(new THREE.ConeGeometry(2.6, 2.0, 12), new THREE.MeshStandardMaterial({ color: 0x423124 }));
                cone.position.y = 9.5;
                tankGroup.add(cone);

                this.scene.add(tankGroup);
            }
        });
    }

    buildArtDecoSpireTower(x, z) {
        // 160m Art Deco Skyscraper (Spire Tower)
        const g = new THREE.Group();
        g.position.set(x, 0, z);

        const stoneMat = new THREE.MeshStandardMaterial({ color: 0xe8e6e1, roughness: 0.65, metalness: 0.1 });
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x1d2733, roughness: 0.2, metalness: 0.8 });
        const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd8dde6, metalness: 0.95, roughness: 0.1 });

        // Tier 1: Podium Base (Width 36m, Height 24m)
        const base = new THREE.Mesh(new THREE.BoxGeometry(36, 24, 36), stoneMat);
        base.position.y = 12;
        base.castShadow = true;
        g.add(base);

        // Tier 2: Lower Shaft (Width 28m, Height 46m)
        const t2 = new THREE.Mesh(new THREE.BoxGeometry(28, 46, 28), stoneMat);
        t2.position.y = 47;
        t2.castShadow = true;
        g.add(t2);

        // Tier 3: Mid Shaft (Width 22m, Height 42m)
        const t3 = new THREE.Mesh(new THREE.BoxGeometry(22, 42, 22), stoneMat);
        t3.position.y = 91;
        t3.castShadow = true;
        g.add(t3);

        // Tier 4: Upper Stepped Crown (Width 16m, Height 26m)
        const t4 = new THREE.Mesh(new THREE.BoxGeometry(16, 26, 16), stoneMat);
        t4.position.y = 125;
        t4.castShadow = true;
        g.add(t4);

        // Art Deco Chrome Radiator Crown
        const crown = new THREE.Mesh(new THREE.ConeGeometry(9, 14, 4), chromeMat);
        crown.rotateY(Math.PI / 4);
        crown.position.y = 145;
        crown.castShadow = true;
        g.add(crown);

        // 160m Metallic Antenna Needle & Beacon
        const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 1.2, 24, 8), chromeMat);
        spire.position.y = 164;
        g.add(spire);

        const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0033 }));
        beacon.position.y = 176;
        g.add(beacon);

        this.scene.add(g);
    }

    buildCrystalMegaTower(x, z) {
        // 115m Faceted Glass Mega-Tower
        const g = new THREE.Group();
        g.position.set(x, 0, z);

        const glassMat = new THREE.MeshStandardMaterial({
            color: 0x226294,
            roughness: 0.12,
            metalness: 0.9
        });

        // Faceted Glass Obelisk
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(14, 24, 115, 8), glassMat);
        tower.position.y = 57.5;
        tower.castShadow = true;
        tower.receiveShadow = true;
        g.add(tower);

        // Roof Helipad & Crown Ring
        const ring = new THREE.Mesh(new THREE.TorusGeometry(14.5, 0.9, 8, 16), new THREE.MeshStandardMaterial({ color: 0x9fa8b8, metalness: 0.85 }));
        ring.rotateX(Math.PI / 2);
        ring.position.y = 115;
        g.add(ring);

        this.scene.add(g);
    }

    buildCentralParkDistrict() {
        // 340m x 500m Central Park (X = -480 to -160, Z = -250 to 250)
        const parkGroup = new THREE.Group();
        parkGroup.position.set(-320, 0, 0);

        // Rolling Green Grass Turf
        const grassMat = new THREE.MeshStandardMaterial({ color: 0x387038, roughness: 0.9 });
        const turf = new THREE.Mesh(new THREE.BoxGeometry(310, 0.4, 490), grassMat);
        turf.position.y = 0.2;
        turf.receiveShadow = true;
        parkGroup.add(turf);

        // Central Park Lake / Reservoir
        const lakeMat = new THREE.MeshStandardMaterial({ color: 0x1b4d3e, roughness: 0.15, metalness: 0.75 });
        const lake = new THREE.Mesh(new THREE.CylinderGeometry(36, 42, 0.6, 24), lakeMat);
        lake.position.set(0, 0.3, 0);
        parkGroup.add(lake);

        // Lake Fountain
        const fountain = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.5, 3.5, 12), new THREE.MeshStandardMaterial({ color: 0xdedede }));
        fountain.position.y = 1.8;
        parkGroup.add(fountain);

        // Winding Paved Walking Paths
        const pathMat = new THREE.MeshStandardMaterial({ color: 0x8a7f72, roughness: 0.85 });
        const mainPath = new THREE.Mesh(new THREE.BoxGeometry(12, 0.45, 480), pathMat);
        mainPath.position.set(0, 0.23, 0);
        mainPath.receiveShadow = true;
        parkGroup.add(mainPath);

        const crossPath = new THREE.Mesh(new THREE.BoxGeometry(300, 0.45, 10), pathMat);
        crossPath.position.set(0, 0.23, 0);
        crossPath.receiveShadow = true;
        parkGroup.add(crossPath);

        // 120+ Trees inside Central Park
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4d3826, roughness: 0.9 });
        const leavesMat = new THREE.MeshStandardMaterial({ color: 0x2e6b2e, roughness: 0.7 });
        const autumnMat = new THREE.MeshStandardMaterial({ color: 0x995c24, roughness: 0.7 });

        for (let i = 0; i < 110; i++) {
            const tx = (Math.random() - 0.5) * 280;
            const tz = (Math.random() - 0.5) * 450;
            // Skip lake center
            if (Math.hypot(tx, tz) < 45) continue;

            const tree = new THREE.Group();
            tree.position.set(tx, 0.4, tz);

            const th = 8 + Math.random() * 6;
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, th, 8), trunkMat);
            trunk.position.y = th / 2;
            trunk.castShadow = true;
            tree.add(trunk);

            const mat = (i % 5 === 0) ? autumnMat : leavesMat;
            const canopy = new THREE.Mesh(new THREE.DodecahedronGeometry(3.5 + Math.random() * 2.0, 1), mat);
            canopy.position.y = th + 2.5;
            canopy.scale.set(1.1, 1.2, 1.1);
            canopy.castShadow = true;
            tree.add(canopy);

            parkGroup.add(tree);
        }

        this.scene.add(parkGroup);
    }

    buildHeritageAndResidentialDistrict() {
        // Heritage Brick Brownstones & Commercial District (X = -480 to 180, Z = 160 to 550)
        const brickMat = new THREE.MeshStandardMaterial({ color: 0x8a4538, roughness: 0.85 });
        const creamMat = new THREE.MeshStandardMaterial({ color: 0xd9d0c1, roughness: 0.75 });
        const brownstoneMat = new THREE.MeshStandardMaterial({ color: 0x664939, roughness: 0.9 });

        for (let x = -440; x <= 140; x += 65) {
            for (let z = 220; z <= 500; z += 75) {
                const h = 18 + Math.floor(Math.random() * 18);
                const mats = [brickMat, creamMat, brownstoneMat];
                const curMat = mats[Math.floor(Math.random() * mats.length)];

                const building = new THREE.Mesh(new THREE.BoxGeometry(45, h, 50), curMat);
                building.position.set(x, h / 2, z);
                building.castShadow = true;
                building.receiveShadow = true;
                this.scene.add(building);

                // Cornice
                const cornice = new THREE.Mesh(new THREE.BoxGeometry(47, 1.0, 52), new THREE.MeshStandardMaterial({ color: 0x222630 }));
                cornice.position.set(x, h + 0.5, z);
                this.scene.add(cornice);
            }
        }
    }

    buildMetropolisVehicles() {
        // Classic Sedans, Yellow Cabs, Trucks, and Police Cruisers across the 1.2km City
        const carLocations = [
            // Highway Cars
            { type: 'taxi', x: 206, z: -180, rot: 0 },
            { type: 'sedan', color: 0x325f7a, x: 194, z: -120, rot: Math.PI },
            { type: 'taxi', x: 206, z: 40, rot: 0 },
            { type: 'police', x: 195, z: 50, rot: Math.PI },
            { type: 'sedan', color: 0xdedede, x: 206, z: 250, rot: 0 },

            // Pier 2 Cruise Terminal Area
            { type: 'taxi', x: 228, z: -210, rot: Math.PI / 2 },
            { type: 'sedan', color: 0x1f2329, x: 228, z: -225, rot: Math.PI / 2 },

            // Downtown Avenues
            { type: 'taxi', x: 25, z: -70, rot: 0 },
            { type: 'sedan', color: 0xd9822b, x: 15, z: -40, rot: Math.PI },
            { type: 'taxi', x: -115, z: -120, rot: 0 },
            { type: 'police', x: -125, z: 80, rot: Math.PI }
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
        // 6 Cybersecurity Challenge Workstations across the 1.2 KM Metropolis
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

    createLabelTexture(text, textColor = '#ffffff', bgColor = '#000000') {
        const c = document.createElement('canvas');
        c.width = 256;
        c.height = 128;
        const ctx = c.getContext('2d');
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 256, 128);

        ctx.font = 'bold 36px Arial, sans-serif';
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 128, 64);
        return new THREE.CanvasTexture(c);
    }

    update(delta, playerPos, totalScore) {
        const time = performance.now() * 0.001;

        // Drift clouds across the 1.2km sky
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
