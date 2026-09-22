// Sunny 1950s/Mafia Coastal Metropolis (Palm-Tree Median, Distant Steel Arch Bridge, White Tower, Moulton's Theater)

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
        this.buildCoastalRoadNetwork();
        this.buildSteelArchBridge();
        this.buildWhiteClockTower();
        this.buildMoultonsTheater();
        this.buildRooftopBillboards();
        this.buildTerracottaStorefronts();
        this.buildCityBlocksAndBuildings();
        this.buildPalmTreesAndLandscaping();
        this.buildClassicVehicles();
        this.buildMarketPlaza();
        this.buildChallengeStations();
    }

    initAtmosphere() {
        // Bright sunny coastal atmosphere haze
        this.scene.fog = new THREE.Fog(0x9bd0f7, 85, 420);

        // Warm Golden Sunlight (Directional Light casting crisp soft shadows)
        const sunLight = new THREE.DirectionalLight(0xfffaec, 1.85);
        sunLight.position.set(70, 110, 60);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 1;
        sunLight.shadow.camera.far = 350;
        sunLight.shadow.camera.left = -115;
        sunLight.shadow.camera.right = 115;
        sunLight.shadow.camera.top = 115;
        sunLight.shadow.camera.bottom = -115;
        sunLight.shadow.bias = -0.0004;
        this.scene.add(sunLight);

        // Hemisphere Sky Light (Rich blue sky and warm ground bounce)
        const hemiLight = new THREE.HemisphereLight(0x75b6ff, 0x8a7f6c, 1.15);
        this.scene.add(hemiLight);

        // Secondary soft fill light
        const fillLight = new THREE.DirectionalLight(0xb0d8ff, 0.4);
        fillLight.position.set(-60, 50, -50);
        this.scene.add(fillLight);
    }

    buildSkyAndClouds() {
        // Procedural Sky Dome
        const skyGeo = new THREE.SphereGeometry(440, 32, 24);
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Vertical sky gradient (Deep blue zenith to sunny horizon cyan-white)
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0.0, '#1565c0'); // Deep azure blue
        grad.addColorStop(0.4, '#42a5f5'); // Cerulean sky
        grad.addColorStop(0.85, '#90caf9'); // Soft sky blue
        grad.addColorStop(1.0, '#e3f2fd'); // Warm golden-white horizon
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

        // Drifting 3D Puffy Cumulus Clouds
        const cloudMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.95,
            metalness: 0.05,
            flatShading: true
        });

        const cloudConfigs = [
            { x: -90, y: 105, z: -140, scale: 1.4 },
            { x: 30, y: 115, z: -110, scale: 1.6 },
            { x: 120, y: 95, z: -80, scale: 1.3 },
            { x: -140, y: 110, z: -20, scale: 1.8 },
            { x: -40, y: 120, z: 20, scale: 1.5 },
            { x: 80, y: 100, z: 40, scale: 1.7 },
            { x: -100, y: 115, z: 90, scale: 1.4 },
            { x: 50, y: 105, z: 120, scale: 1.5 },
            { x: -30, y: 95, z: 160, scale: 1.3 },
            { x: 130, y: 125, z: -10, scale: 1.6 }
        ];

        cloudConfigs.forEach(cfg => {
            const cloud = new THREE.Group();
            // Cluster of 6-8 puffy spheres
            const numPuffs = 6 + Math.floor(Math.random() * 3);
            for (let i = 0; i < numPuffs; i++) {
                const r = (10 + Math.random() * 9) * cfg.scale;
                const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 1), cloudMat);
                puff.position.set(
                    (Math.random() - 0.5) * 35 * cfg.scale,
                    (Math.random() * 8) * cfg.scale,
                    (Math.random() - 0.5) * 22 * cfg.scale
                );
                puff.scale.set(1.2, 0.75, 1.0);
                cloud.add(puff);
            }
            cloud.position.set(cfg.x, cfg.y, cfg.z);
            this.scene.add(cloud);
            this.clouds.push(cloud);
        });
    }

    buildCoastalRoadNetwork() {
        // High-res sunny asphalt road texture (200m x 200m)
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Warm sunlit asphalt
        ctx.fillStyle = '#3a404c';
        ctx.fillRect(0, 0, 1024, 1024);

        // Asphalt aggregate noise
        for (let i = 0; i < 45000; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 1024;
            const b = 55 + Math.random() * 25;
            ctx.fillStyle = `rgb(${b}, ${b+1}, ${b+3})`;
            ctx.fillRect(x, y, 2, 2);
        }

        // Central Grand Boulevard (North-South): centered at x = 512, width 140px (~28m)
        // Secondary Street East-West: centered at y = 512, width 110px (~22m)
        // Cross streets at y = 200 (~ -60m) and y = 824 (~ +60m)
        // Avenues at x = 200 (~ -60m) and x = 824 (~ +60m)

        // Tram / Cable Car Metal Rails (Recessed steel tracks like in Image 2)
        ctx.fillStyle = '#7d8594';
        // Rails along Central Boulevard
        [475, 482, 542, 549].forEach(rx => {
            ctx.fillRect(rx, 0, 3, 1024);
        });

        // Double Yellow Center Lines (On cross streets & side avenues)
        ctx.fillStyle = '#f0ad1b';
        ctx.fillRect(0, 510, 1024, 4); // Main E-W street
        ctx.fillRect(0, 200, 1024, 3);
        ctx.fillRect(0, 824, 1024, 3);
        ctx.fillRect(200, 0, 3, 1024);
        ctx.fillRect(824, 0, 3, 1024);

        // Dashed White Lane Dividers along Central Boulevard
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        for (let y = 10; y < 1024; y += 36) {
            ctx.fillRect(455, y, 2.5, 18);
            ctx.fillRect(569, y, 2.5, 18);
        }

        // Pedestrian Zebra Crossings
        const crossings = [
            { x: 512, y: 512 },
            { x: 512, y: 200 },
            { x: 512, y: 824 },
            { x: 200, y: 512 },
            { x: 824, y: 512 },
            { x: 200, y: 200 },
            { x: 824, y: 824 }
        ];

        crossings.forEach(pt => {
            for (let i = -40; i <= 40; i += 12) {
                ctx.fillRect(pt.x + i, pt.y - 75, 7, 20);
                ctx.fillRect(pt.x + i, pt.y + 55, 7, 20);
                ctx.fillRect(pt.x - 75, pt.y + i, 20, 7);
                ctx.fillRect(pt.x + 55, pt.y + i, 20, 7);
            }
        });

        const roadTex = new THREE.CanvasTexture(canvas);
        const roadMat = new THREE.MeshStandardMaterial({
            map: roadTex,
            roughness: 0.75,
            metalness: 0.15
        });

        const roadGeo = new THREE.PlaneGeometry(200, 200);
        const road = new THREE.Mesh(roadGeo, roadMat);
        road.rotation.x = -Math.PI / 2;
        road.receiveShadow = true;
        this.scene.add(road);

        // Coastal Bay / Ocean at the North Horizon (Z < -95)
        const waterGeo = new THREE.PlaneGeometry(350, 150);
        const waterMat = new THREE.MeshStandardMaterial({
            color: 0x1a789a,
            roughness: 0.18,
            metalness: 0.82
        });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.rotation.x = -Math.PI / 2;
        water.position.set(0, -0.4, -165);
        this.scene.add(water);
        this.waterMesh = water;

        // Sea Wall along the water edge (Z = -95)
        const seaWall = new THREE.Mesh(
            new THREE.BoxGeometry(200, 1.8, 2.5),
            new THREE.MeshStandardMaterial({ color: 0x8a9099, roughness: 0.9 })
        );
        seaWall.position.set(0, 0.5, -95);
        seaWall.castShadow = true;
        seaWall.receiveShadow = true;
        this.scene.add(seaWall);
    }

    buildSteelArchBridge() {
        // Distant Steel Arch Truss Bridge (Directly from Image 2)
        // Spans across the bay at Z = -105, from X = -50 to +50
        const bridgeGroup = new THREE.Group();
        bridgeGroup.position.set(0, 0, -105);

        const steelMat = new THREE.MeshStandardMaterial({
            color: 0x424956,
            roughness: 0.45,
            metalness: 0.75
        });

        const roadDeckMat = new THREE.MeshStandardMaterial({
            color: 0x2e333d,
            roughness: 0.8
        });

        // 1. Roadway Deck
        const deck = new THREE.Mesh(new THREE.BoxGeometry(110, 1.4, 16), roadDeckMat);
        deck.position.y = 7.5;
        deck.castShadow = true;
        bridgeGroup.add(deck);

        // 2. Concrete Bridge Support Piers
        [-48, 48].forEach(px => {
            const pier = new THREE.Mesh(new THREE.BoxGeometry(7, 14, 18), new THREE.MeshStandardMaterial({ color: 0xa0a5ad }));
            pier.position.set(px, 3.5, 0);
            pier.castShadow = true;
            bridgeGroup.add(pier);
        });

        // 3. Parabolic Steel Arch Ribs (East & West side of deck)
        [-7.5, 7.5].forEach(zOffset => {
            const curvePoints = [];
            const segments = 24;
            const span = 96;
            const archHeight = 28;

            for (let i = 0; i <= segments; i++) {
                const t = (i / segments) * 2 - 1; // -1 to 1
                const x = t * (span / 2);
                const y = 7.5 + archHeight * (1 - t * t);
                curvePoints.push(new THREE.Vector3(x, y, zOffset));
            }

            const curve = new THREE.CatmullRomCurve3(curvePoints);
            const archGeo = new THREE.TubeGeometry(curve, 32, 0.9, 8, false);
            const archMesh = new THREE.Mesh(archGeo, steelMat);
            archMesh.castShadow = true;
            bridgeGroup.add(archMesh);

            // Vertical Suspenders / Hanger Cables
            for (let i = 1; i < segments; i++) {
                const t = (i / segments) * 2 - 1;
                const x = t * (span / 2);
                const archY = 7.5 + archHeight * (1 - t * t);
                const hangerHeight = archY - 7.5;

                const hanger = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.12, 0.12, hangerHeight, 6),
                    steelMat
                );
                hanger.position.set(x, 7.5 + hangerHeight / 2, zOffset);
                bridgeGroup.add(hanger);
            }
        });

        // 4. Overhead Cross Braces between Arches
        for (let t = -0.7; t <= 0.7; t += 0.28) {
            const x = t * 48;
            const y = 7.5 + 28 * (1 - t * t);
            const brace = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 15, 6), steelMat);
            brace.rotateX(Math.PI / 2);
            brace.position.set(x, y, 0);
            bridgeGroup.add(brace);
        }

        this.scene.add(bridgeGroup);
    }

    buildWhiteClockTower() {
        // Grand White Neoclassical Tower / Campanile (Directly from Image 2)
        // Positioned at X = 36, Z = -35 (East side of the avenue)
        const towerGroup = new THREE.Group();
        towerGroup.position.set(36, 0, -35);

        const whiteStoneMat = new THREE.MeshStandardMaterial({
            color: 0xedebe8,
            roughness: 0.65,
            metalness: 0.1
        });
        const darkTrimMat = new THREE.MeshStandardMaterial({
            color: 0x3d434d,
            roughness: 0.7
        });

        // Tier 1: Massive Podium Base
        const base = new THREE.Mesh(new THREE.BoxGeometry(22, 16, 22), whiteStoneMat);
        base.position.y = 8;
        base.castShadow = true;
        base.receiveShadow = true;
        towerGroup.add(base);

        // Classical Entablature / Cornice
        const cornice1 = new THREE.Mesh(new THREE.BoxGeometry(23.5, 1.5, 23.5), whiteStoneMat);
        cornice1.position.y = 16.75;
        cornice1.castShadow = true;
        towerGroup.add(cornice1);

        // Tier 2: Main Shaft with Colonnade & Pilasters
        const shaft = new THREE.Mesh(new THREE.BoxGeometry(16, 36, 16), whiteStoneMat);
        shaft.position.y = 35;
        shaft.castShadow = true;
        shaft.receiveShadow = true;
        towerGroup.add(shaft);

        // Windows rows on Shaft
        for (let y = 22; y <= 48; y += 6) {
            [-8.1, 8.1].forEach(z => {
                [-4.5, 0, 4.5].forEach(x => {
                    const win = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.2, 0.2), darkTrimMat);
                    win.position.set(x, y, z);
                    towerGroup.add(win);
                });
            });
            [-8.1, 8.1].forEach(x => {
                [-4.5, 0, 4.5].forEach(z => {
                    const win = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.2, 1.6), darkTrimMat);
                    win.position.set(x, y, z);
                    towerGroup.add(win);
                });
            });
        }

        // Tier 3: Setback Colonnaded Loggia
        const cornice2 = new THREE.Mesh(new THREE.BoxGeometry(17.5, 1.6, 17.5), whiteStoneMat);
        cornice2.position.y = 53.8;
        cornice2.castShadow = true;
        towerGroup.add(cornice2);

        const loggia = new THREE.Mesh(new THREE.BoxGeometry(12, 14, 12), whiteStoneMat);
        loggia.position.y = 61;
        loggia.castShadow = true;
        towerGroup.add(loggia);

        // Classical Columns on Loggia
        [-5.2, 5.2].forEach(cx => {
            [-5.2, 0, 5.2].forEach(cz => {
                const col = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 13.8, 12), whiteStoneMat);
                col.position.set(cx, 61, cz);
                col.castShadow = true;
                towerGroup.add(col);
            });
        });

        // Tier 4: Classical Lantern Cupola & Dome
        const lanternBase = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 5.4, 6, 16), whiteStoneMat);
        lanternBase.position.y = 71;
        lanternBase.castShadow = true;
        towerGroup.add(lanternBase);

        const dome = new THREE.Mesh(new THREE.SphereGeometry(4.4, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), whiteStoneMat);
        dome.position.y = 74;
        dome.castShadow = true;
        towerGroup.add(dome);

        // Top Spire Needle
        const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.6, 9, 8), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.3 }));
        spire.position.y = 80;
        towerGroup.add(spire);

        this.scene.add(towerGroup);
    }

    buildMoultonsTheater() {
        // Moulton's Theater with 3D Vertical Marquee (Directly from Image 2)
        // Positioned at X = -32, Z = 5 (West side corner)
        const theaterGroup = new THREE.Group();
        theaterGroup.position.set(-32, 0, 5);

        const facadeMat = new THREE.MeshStandardMaterial({
            color: 0xd6d0c4,
            roughness: 0.7
        });

        // Main Theater Building
        const building = new THREE.Mesh(new THREE.BoxGeometry(20, 26, 24), facadeMat);
        building.position.y = 13;
        building.castShadow = true;
        building.receiveShadow = true;
        theaterGroup.add(building);

        // Arched Decorative Windows
        for (let y = 10; y <= 20; y += 6) {
            [-6, 0, 6].forEach(z => {
                const win = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.8, 2.4), new THREE.MeshStandardMaterial({ color: 0x22262e }));
                win.position.set(10.1, y, z);
                theaterGroup.add(win);
            });
        }

        // Horizontal Marquee Canopy Over Sidewalk
        const canopy = new THREE.Mesh(new THREE.BoxGeometry(5.5, 1.2, 12), new THREE.MeshStandardMaterial({ color: 0x1f232b, metalness: 0.5 }));
        canopy.position.set(12.7, 4.8, 0);
        canopy.castShadow = true;
        theaterGroup.add(canopy);

        // Canopy Neon Fascia: "MOULTON'S THEATER"
        const fasciaTex = this.createSignTexture("MOULTON'S THEATER", "#ffc107", "#11141a");
        const fascia = new THREE.Mesh(new THREE.PlaneGeometry(11.6, 0.9), new THREE.MeshBasicMaterial({ map: fasciaTex }));
        fascia.rotateY(Math.PI / 2);
        fascia.position.set(15.5, 4.8, 0);
        theaterGroup.add(fascia);

        // Vertical Iconic Marquee Sign: MOULTON'S (Reaches 22m tall on the corner)
        const verticalSign = new THREE.Group();
        verticalSign.position.set(10.4, 15, 10);

        // Steel lattice support
        const signPost = new THREE.Mesh(new THREE.BoxGeometry(0.8, 19, 2.6), new THREE.MeshStandardMaterial({ color: 0x1a1e24, metalness: 0.8 }));
        verticalSign.add(signPost);

        // Vertical letters sign face
        const letters = ['M', 'O', 'U', 'L', 'T', 'O', 'N', '\'', 'S'];
        const vertCanvas = document.createElement('canvas');
        vertCanvas.width = 128;
        vertCanvas.height = 512;
        const vCtx = vertCanvas.getContext('2d');

        vCtx.fillStyle = '#10141c';
        vCtx.fillRect(0, 0, 128, 512);

        // Gold bordered edge with incandescent bulb dots
        vCtx.strokeStyle = '#f5b700';
        vCtx.lineWidth = 6;
        vCtx.strokeRect(6, 6, 116, 500);

        // Draw vertical letters
        vCtx.font = 'bold 38px Impact, Arial Black';
        vCtx.fillStyle = '#ff3344';
        vCtx.textAlign = 'center';
        vCtx.textBaseline = 'middle';

        const step = 490 / letters.length;
        letters.forEach((l, idx) => {
            vCtx.fillStyle = '#ffffff';
            vCtx.fillText(l, 64, 28 + idx * step);
            // Red neon glow outline
            vCtx.strokeStyle = '#ff2233';
            vCtx.lineWidth = 2;
            vCtx.strokeText(l, 64, 28 + idx * step);
        });

        const vertTex = new THREE.CanvasTexture(vertCanvas);
        const vertMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2.4, 18),
            new THREE.MeshStandardMaterial({ map: vertTex, roughness: 0.3 })
        );
        vertMesh.rotateY(Math.PI / 2);
        vertMesh.position.set(0.42, 0, 0);
        verticalSign.add(vertMesh);

        theaterGroup.add(verticalSign);
        this.scene.add(theaterGroup);
    }

    buildRooftopBillboards() {
        // "COEN'S" Rooftop Billboard & Highway Advertising Frame (Directly from Image 2)
        // Positioned on rooftop at X = 28, Z = 15
        const bGroup = new THREE.Group();
        bGroup.position.set(28, 16, 15);

        const frameMat = new THREE.MeshStandardMaterial({
            color: 0x353a45,
            metalness: 0.85,
            roughness: 0.4
        });

        // 1. Structural Steel Lattice Truss Legs
        [-5, 5].forEach(lx => {
            [-2.5, 2.5].forEach(lz => {
                const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 7.5, 6), frameMat);
                leg.position.set(lx, 3.75, lz);
                bGroup.add(leg);
            });
            // Diagonal cross braces
            const diag = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 8.5, 6), frameMat);
            diag.rotateZ(0.6);
            diag.position.set(lx, 3.75, 0);
            bGroup.add(diag);
        });

        // 2. Large "COEN'S" Sign Board
        const coenTex = this.createCoensSignTexture();
        const coenSign = new THREE.Mesh(
            new THREE.BoxGeometry(11, 7, 0.4),
            new THREE.MeshStandardMaterial({
                map: coenTex,
                roughness: 0.5
            })
        );
        coenSign.position.set(0, 8.5, -2.5);
        coenSign.castShadow = true;
        bGroup.add(coenSign);

        // 3. Vintage Automobile Billboard
        const carBillTex = this.createCarBillboardTexture();
        const carBill = new THREE.Mesh(
            new THREE.BoxGeometry(12, 5.5, 0.3),
            new THREE.MeshStandardMaterial({
                map: carBillTex,
                roughness: 0.5
            })
        );
        carBill.position.set(0, 8.5, 2.5);
        carBill.rotateY(Math.PI);
        carBill.castShadow = true;
        bGroup.add(carBill);

        this.scene.add(bGroup);
    }

    buildTerracottaStorefronts() {
        // Terracotta Mediterranean Storefront with Fabric Awnings (Directly from Image 2 foreground right)
        // Positioned at X = 26, Z = 35
        const group = new THREE.Group();
        group.position.set(26, 0, 35);

        const stuccoMat = new THREE.MeshStandardMaterial({
            color: 0xded6c5, // Warm beige stucco
            roughness: 0.85
        });

        const terracottaMat = new THREE.MeshStandardMaterial({
            color: 0xb54d2a, // Rich Spanish terracotta orange-red
            roughness: 0.65
        });

        // Main 2-Story Building
        const building = new THREE.Mesh(new THREE.BoxGeometry(18, 11, 24), stuccoMat);
        building.position.y = 5.5;
        building.castShadow = true;
        building.receiveShadow = true;
        group.add(building);

        // Pitched Terracotta Tile Roof
        const roof = new THREE.Mesh(new THREE.ConeGeometry(13.5, 3.8, 4), terracottaMat);
        roof.rotateY(Math.PI / 4);
        roof.position.y = 12.8;
        roof.scale.set(1.15, 1, 1.45);
        roof.castShadow = true;
        group.add(roof);

        // Ground floor commercial windows
        [-6, 0, 6].forEach(z => {
            const win = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.2, 4.2), new THREE.MeshStandardMaterial({ color: 0x1a222c }));
            win.position.set(-9.1, 2.6, z);
            group.add(win);
        });

        // Colorful Fabric Awnings over Ground Floor Windows (Burgundy, Blue, Olive)
        const awningColors = [0x8b1e2a, 0x1e4f8b, 0x3d6b38];
        [-6, 0, 6].forEach((z, idx) => {
            const awnMat = new THREE.MeshStandardMaterial({
                color: awningColors[idx % awningColors.length],
                roughness: 0.7
            });
            // Sloped awning wedge
            const awn = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 4.4, 12, 1, false, 0, Math.PI / 2), awnMat);
            awn.rotateZ(-Math.PI / 2);
            awn.rotateY(Math.PI / 2);
            awn.position.set(-10.2, 4.4, z);
            awn.castShadow = true;
            group.add(awn);
        });

        this.scene.add(group);
    }

    buildCityBlocksAndBuildings() {
        // Multi-District Urban Architecture across the 200m Metropolis
        const blockMaterials = [
            new THREE.MeshStandardMaterial({ color: 0xded9cf, roughness: 0.7 }), // Cream limestone
            new THREE.MeshStandardMaterial({ color: 0xc4b9a5, roughness: 0.75 }), // Warm sandstone
            new THREE.MeshStandardMaterial({ color: 0x827060, roughness: 0.8 }), // Brownstone
            new THREE.MeshStandardMaterial({ color: 0x4a5465, roughness: 0.6 }), // Slate corporate
            new THREE.MeshStandardMaterial({ color: 0xb55743, roughness: 0.75 }) // Red brick
        ];

        const buildings = [
            // North-East District (Financial & Corporate Skyscraper)
            { x: 55, z: -55, w: 24, h: 58, d: 22, mat: blockMaterials[0] },
            { x: 75, z: -35, w: 20, h: 42, d: 20, mat: blockMaterials[3] },
            { x: 55, z: -15, w: 22, h: 28, d: 18, mat: blockMaterials[1] },

            // North-West District (Tech & Harbor District)
            { x: -55, z: -55, w: 26, h: 32, d: 24, mat: blockMaterials[3] },
            { x: -75, z: -35, w: 20, h: 26, d: 22, mat: blockMaterials[4] },
            { x: -55, z: -20, w: 22, h: 36, d: 20, mat: blockMaterials[0] },

            // South-West District (Chinatown, Saloons & Alleys)
            { x: -55, z: 35, w: 24, h: 22, d: 22, mat: blockMaterials[4] },
            { x: -75, z: 55, w: 20, h: 18, d: 20, mat: blockMaterials[2] },
            { x: -55, z: 70, w: 22, h: 24, d: 20, mat: blockMaterials[1] },

            // South-East District (Downtown & Entertainment)
            { x: 55, z: 35, w: 24, h: 30, d: 22, mat: blockMaterials[0] },
            { x: 75, z: 55, w: 20, h: 34, d: 20, mat: blockMaterials[1] },
            { x: 55, z: 70, w: 22, h: 26, d: 20, mat: blockMaterials[2] }
        ];

        buildings.forEach(b => {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), b.mat);
            mesh.position.set(b.x, b.h / 2, b.z);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);

            // Cornice roof ledge
            const ledge = new THREE.Mesh(
                new THREE.BoxGeometry(b.w + 1.2, 0.8, b.d + 1.2),
                new THREE.MeshStandardMaterial({ color: 0x2e333d })
            );
            ledge.position.set(b.x, b.h + 0.4, b.z);
            ledge.castShadow = true;
            this.scene.add(ledge);
        });

        // Raised Sidewalk Blocks along Avenue
        const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x9fa4ad, roughness: 0.85 });
        const sidewalkBlocks = [
            { x: -28, z: 0, w: 24, d: 180 },
            { x: 28, z: 0, w: 24, d: 180 }
        ];
        sidewalkBlocks.forEach(sb => {
            const sw = new THREE.Mesh(new THREE.BoxGeometry(sb.w, 0.25, sb.d), sidewalkMat);
            sw.position.set(sb.x, 0.125, sb.z);
            sw.receiveShadow = true;
            this.scene.add(sw);
        });
    }

    buildPalmTreesAndLandscaping() {
        // Landscaped Center Median with Palm Trees (Directly from Image 2)
        // Central Median Island (4m wide, runs down Z from -85 to +85)
        const medianCurbs = new THREE.Mesh(
            new THREE.BoxGeometry(3.6, 0.35, 175),
            new THREE.MeshStandardMaterial({ color: 0xabb0b8, roughness: 0.8 })
        );
        medianCurbs.position.set(0, 0.175, 0);
        medianCurbs.castShadow = true;
        medianCurbs.receiveShadow = true;
        this.scene.add(medianCurbs);

        // Lush green turf on median
        const grassMat = new THREE.MeshStandardMaterial({ color: 0x3b7a32, roughness: 0.9 });
        const grass = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.4, 174), grassMat);
        grass.position.set(0, 0.2, 0);
        grass.receiveShadow = true;
        this.scene.add(grass);

        // Plant Palm Trees along Median Island (Every 16 meters)
        for (let z = -76; z <= 76; z += 16) {
            this.createPalmTree(0, z, 1.1 + (z % 3) * 0.1, (z % 2 === 0 ? 0.08 : -0.08));
            // Bush cluster at base of palm
            const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1, 1), grassMat);
            bush.position.set(0, 0.7, z);
            bush.scale.set(1.4, 0.8, 1.4);
            bush.castShadow = true;
            this.scene.add(bush);
        }

        // Sidewalk Palm Trees (Along both sides of Central Boulevard)
        [-17, 17].forEach(xOffset => {
            for (let z = -70; z <= 70; z += 24) {
                this.createPalmTree(xOffset, z, 1.0, (xOffset < 0 ? -0.1 : 0.1));
            }
        });

        // Vintage Street Lamps along Sidewalks
        [-16.5, 16.5].forEach(x => {
            for (let z = -80; z <= 80; z += 20) {
                this.createVintageStreetLamp(x, z);
            }
        });
    }

    createPalmTree(x, z, scale = 1.0, leanAngle = 0.0) {
        const palmGroup = new THREE.Group();
        palmGroup.position.set(x, 0, z);

        const trunkMat = new THREE.MeshStandardMaterial({
            color: 0x6e523e,
            roughness: 0.85
        });

        const frondMat = new THREE.MeshStandardMaterial({
            color: 0x2e8535,
            roughness: 0.6,
            side: THREE.DoubleSide
        });

        // Segmented, gently curving trunk
        const trunkHeight = 11.5 * scale;
        const trunkSegments = 7;
        let prevY = 0;
        let prevX = 0;

        for (let i = 0; i < trunkSegments; i++) {
            const segH = trunkHeight / trunkSegments;
            const rBot = (0.55 - i * 0.04) * scale;
            const rTop = (0.51 - i * 0.04) * scale;

            const seg = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, segH, 8), trunkMat);
            const curX = prevX + (leanAngle * i * 0.3);
            seg.position.set(curX, prevY + segH / 2, 0);
            seg.rotation.z = -leanAngle * 0.8;
            seg.castShadow = true;
            palmGroup.add(seg);

            prevY += segH;
            prevX = curX;
        }

        // Crown of radiating tropical palm leaves / fronds
        const crownY = prevY;
        const crownX = prevX;
        const numFronds = 14;

        for (let i = 0; i < numFronds; i++) {
            const angle = (i / numFronds) * Math.PI * 2;
            const frondLen = 5.2 * scale;

            const frondGeo = new THREE.PlaneGeometry(1.2 * scale, frondLen, 1, 4);
            // Curve the frond downward
            const pos = frondGeo.attributes.position;
            for (let j = 0; j < pos.count; j++) {
                const y = pos.getY(j);
                const t = (y + frondLen / 2) / frondLen;
                pos.setZ(j, -t * t * 2.2 * scale); // Droop curve
            }
            frondGeo.computeVertexNormals();

            const frond = new THREE.Mesh(frondGeo, frondMat);
            frond.position.set(crownX, crownY, 0);
            frond.rotation.y = angle;
            frond.rotation.x = 0.55; // Spread angle
            frond.castShadow = true;
            palmGroup.add(frond);
        }

        this.scene.add(palmGroup);
    }

    createVintageStreetLamp(x, z) {
        const lamp = new THREE.Group();
        lamp.position.set(x, 0, z);

        const postMat = new THREE.MeshStandardMaterial({ color: 0x222a33, metalness: 0.85, roughness: 0.3 });
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 5.2, 8), postMat);
        post.position.y = 2.6;
        post.castShadow = true;
        lamp.add(post);

        // Curved arm
        const arm = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.08, 8, 12, Math.PI / 2), postMat);
        arm.position.set(x > 0 ? -0.5 : 0.5, 5.0, 0);
        arm.rotation.z = x > 0 ? 0 : Math.PI;
        lamp.add(arm);

        // Lantern globe
        const globe = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 12, 12),
            new THREE.MeshStandardMaterial({ color: 0xfff0cc, emissive: 0xffeaad, emissiveIntensity: 0.5 })
        );
        globe.position.set(x > 0 ? -1.0 : 1.0, 4.6, 0);
        lamp.add(globe);

        this.scene.add(lamp);
    }

    buildClassicVehicles() {
        // Classic 1950s Cars, NYC Yellow Cabs, Vintage Sedans & Flashing Police Cruiser
        const vehicles = [
            // NYC Yellow Taxi Cabs
            { type: 'taxi', x: 7.5, z: 25, rot: 0 },
            { type: 'taxi', x: -7.5, z: -35, rot: Math.PI },
            { type: 'taxi', x: 8.5, z: -60, rot: 0 },

            // Cream / Teal Vintage Sedans (Matching Images 1 & 2)
            { type: 'sedan', color: 0xe8e0cc, x: 13.5, z: 8, rot: 0 }, // Cream sedan
            { type: 'sedan', color: 0x356877, x: -13.5, z: 18, rot: Math.PI }, // Teal sedan (like Image 2)
            { type: 'sedan', color: 0x2c333a, x: 13.5, z: -22, rot: 0 }, // Black mafia sedan

            // Orange Delivery Van (Matching Image 1)
            { type: 'van', color: 0xd67a18, x: -14.0, z: -15, rot: Math.PI },

            // Vintage Police Cruiser with Flashing Beacons (Matching Image 3)
            { type: 'police', x: -13.5, z: -3, rot: Math.PI }
        ];

        vehicles.forEach(v => {
            let car;
            if (v.type === 'taxi') car = this.createYellowCab();
            else if (v.type === 'van') car = this.createDeliveryVan(v.color);
            else if (v.type === 'police') car = this.createPoliceCruiser();
            else car = this.createVintageSedan(v.color);

            car.position.set(v.x, 0, v.z);
            car.rotation.y = v.rot;
            this.scene.add(car);
        });
    }

    createVintageSedan(color = 0xdedede) {
        const car = new THREE.Group();
        const paintMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.35, metalness: 0.65 });
        const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.95, roughness: 0.1 });
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x1a2634, roughness: 0.1, metalness: 0.9 });
        const tireMat = new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.9 });

        // Lower Body with curved fenders
        const body = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.75, 4.6), paintMat);
        body.position.y = 0.65;
        body.castShadow = true;
        car.add(body);

        // Cabin
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.75, 2.4), glassMat);
        cabin.position.set(0, 1.35, -0.2);
        cabin.castShadow = true;
        car.add(cabin);

        // Chrome Bumpers
        [2.35, -2.35].forEach(z => {
            const bumper = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.22, 0.25), chromeMat);
            bumper.position.set(0, 0.45, z);
            car.add(bumper);
        });

        // 4 Tires with Chrome Hubcaps
        [-1.0, 1.0].forEach(x => {
            [-1.4, 1.4].forEach(z => {
                const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.3, 16), tireMat);
                tire.rotateZ(Math.PI / 2);
                tire.position.set(x, 0.38, z);
                tire.castShadow = true;
                car.add(tire);

                const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.32, 12), chromeMat);
                cap.rotateZ(Math.PI / 2);
                cap.position.set(x, 0.38, z);
                car.add(cap);
            });
        });

        return car;
    }

    createYellowCab() {
        const cab = this.createVintageSedan(0xf5b700);
        // Roof Taxi Medallion
        const sign = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.22, 0.35), new THREE.MeshStandardMaterial({ color: 0xffffff }));
        sign.position.set(0, 1.85, -0.2);
        cab.add(sign);
        return cab;
    }

    createDeliveryVan(color = 0xd67a18) {
        const van = new THREE.Group();
        const paintMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.5 });
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x1c232e, roughness: 0.2 });

        const box = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.8, 4.8), paintMat);
        box.position.y = 1.25;
        box.castShadow = true;
        van.add(box);

        const win = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.7, 1.2), glassMat);
        win.position.set(0, 1.45, 1.4);
        van.add(win);

        return van;
    }

    createPoliceCruiser() {
        const cruiser = this.createVintageSedan(0x1a202c);
        // Roof Lightbar
        const bar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.18, 0.35), new THREE.MeshStandardMaterial({ color: 0x111111 }));
        bar.position.set(0, 1.8, -0.2);
        cruiser.add(bar);

        // Flashing beacon light
        const pLight = new THREE.PointLight(0xff0022, 1.5, 12);
        pLight.position.set(0, 2.1, -0.2);
        cruiser.add(pLight);
        this.policeLights.push(pLight);

        return cruiser;
    }

    buildMarketPlaza() {
        // Market Plaza Stalls with Striped Canvas Awnings (Inspired by Image 1)
        // Positioned at X = -24, Z = 45
        const plazaGroup = new THREE.Group();
        plazaGroup.position.set(-24, 0, 45);

        const stallColors = [0xb52222, 0x1f5cb5, 0x228b3f, 0xc27e1f];

        [-12, 0, 12].forEach((offsetZ, i) => {
            const stall = new THREE.Group();
            stall.position.set(0, 0, offsetZ);

            // Wood counter
            const counter = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.0, 2.4), new THREE.MeshStandardMaterial({ color: 0x5c4228, roughness: 0.8 }));
            counter.position.y = 0.5;
            counter.castShadow = true;
            stall.add(counter);

            // 4 Timber Posts
            [-1.9, 1.9].forEach(px => {
                [-1.0, 1.0].forEach(pz => {
                    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.6, 6), new THREE.MeshStandardMaterial({ color: 0x422f1c }));
                    post.position.set(px, 1.8, pz);
                    stall.add(post);
                });
            });

            // Striped Canvas Roof
            const awning = new THREE.Mesh(new THREE.ConeGeometry(2.8, 1.0, 4), new THREE.MeshStandardMaterial({ color: stallColors[i % stallColors.length], roughness: 0.6 }));
            awning.rotateY(Math.PI / 4);
            awning.scale.set(1.4, 1.0, 0.95);
            awning.position.y = 3.4;
            awning.castShadow = true;
            stall.add(awning);

            plazaGroup.add(stall);
        });

        this.scene.add(plazaGroup);
    }

    buildChallengeStations() {
        // 6 Cybersecurity Challenge Workstations naturally integrated into this sunny coastal town
        const challenges = window.CHALLENGES_DATA || [];

        const stationConfigs = {
            'station-web': {
                title: "Ron's Cafe Sidewalk Patio",
                pos: { x: -16.0, z: 28.0 },
                color: 0x00f0ff,
                meshCreator: () => {
                    const g = new THREE.Group();
                    // Cafe table with striped parasol umbrella
                    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.85, 16), new THREE.MeshStandardMaterial({ color: 0x222630 }));
                    table.position.y = 0.42;
                    g.add(table);

                    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.2, 8), new THREE.MeshStandardMaterial({ color: 0x666666 }));
                    pole.position.y = 1.6;
                    g.add(pole);

                    const umbrella = new THREE.Mesh(new THREE.ConeGeometry(2.2, 0.8, 16), new THREE.MeshStandardMaterial({ color: 0x0088cc, roughness: 0.5 }));
                    umbrella.position.y = 3.1;
                    g.add(umbrella);

                    // Elliot's Thinkpad laptop
                    const laptop = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.04, 0.45), new THREE.MeshStandardMaterial({ color: 0x111111 }));
                    laptop.position.set(0, 0.88, 0);
                    g.add(laptop);

                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.03), new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.8 }));
                    screen.position.set(0, 1.1, -0.2);
                    screen.rotation.x = -0.2;
                    g.add(screen);

                    return { root: g, holo: screen };
                }
            },
            'station-crypto': {
                title: "Grand Tower Marble ATM",
                pos: { x: 25.0, z: -25.0 },
                color: 0xffb703,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const atm = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.7, 1.0), new THREE.MeshStandardMaterial({ color: 0x2a3342, metalness: 0.6 }));
                    atm.position.y = 1.35;
                    g.add(atm);

                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.05), new THREE.MeshStandardMaterial({ color: 0xffb703, emissive: 0xffb703, emissiveIntensity: 0.8 }));
                    screen.position.set(0, 1.65, 0.52);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-linux': {
                title: "Palm Median Telecom Terminal",
                pos: { x: 0.0, z: -10.0 },
                color: 0x00ff66,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const box = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.3, 0.9), new THREE.MeshStandardMaterial({ color: 0x26382b, metalness: 0.4 }));
                    box.position.y = 1.15;
                    g.add(box);

                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.05), new THREE.MeshStandardMaterial({ color: 0x00ff66, emissive: 0x00ff66, emissiveIntensity: 0.85 }));
                    screen.position.set(0, 1.35, 0.47);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-forensics': {
                title: "Police Cruiser Terminal",
                pos: { x: -13.5, z: -3.0 },
                color: 0xff007f,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.05), new THREE.MeshStandardMaterial({ color: 0xff007f, emissive: 0xff007f, emissiveIntensity: 0.9 }));
                    screen.position.set(0, 1.5, 0.4);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-rev': {
                title: "Chinatown Alley Arcade",
                pos: { x: -24.0, z: 42.0 },
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
                title: "E-Corp Vault Blast Gate",
                pos: { x: 36.0, z: -35.0 },
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

            // Ground glow ring
            const ringGeo = new THREE.RingGeometry(2.4, 2.8, 32);
            ringGeo.rotateX(-Math.PI / 2);
            const ringMat = new THREE.MeshBasicMaterial({
                color: config.color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.75
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.y = 0.05;
            root.add(ring);

            const pLight = new THREE.PointLight(config.color, 1.4, 8);
            pLight.position.set(0, 1.8, 0.5);
            root.add(pLight);

            this.scene.add(root);

            this.terminals.push({
                id: ch.id,
                challenge: ch,
                pos: config.pos,
                holo: holo,
                ring: ring,
                radius: 3.8,
                isBoss: config.isBoss || false
            });
        });
    }

    createSignTexture(text, textColor = '#ffffff', bgColor = '#000000') {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 128;
        const ctx = c.getContext('2d');
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 512, 128);

        ctx.font = 'bold 44px Arial, sans-serif';
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 256, 64);
        return new THREE.CanvasTexture(c);
    }

    createCoensSignTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 320;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#1a1f29';
        ctx.fillRect(0, 0, 512, 320);

        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 8;
        ctx.strokeRect(10, 10, 492, 300);

        ctx.font = 'bold 80px Impact, Arial Black';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText("COEN'S", 256, 110);

        ctx.font = '22px Arial, sans-serif';
        ctx.fillStyle = '#b0b5c0';
        ctx.fillText("FINE CLOTHIERS & TAILORS", 256, 165);
        ctx.fillText("ESTABLISHED 1928", 256, 205);
        ctx.fillText("SAN FRANCISCO - LOS ANGELES", 256, 245);
        return new THREE.CanvasTexture(c);
    }

    createCarBillboardTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 256;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#eeddc8';
        ctx.fillRect(0, 0, 512, 256);

        ctx.font = 'bold 44px Impact, Georgia';
        ctx.fillStyle = '#8b2222';
        ctx.textAlign = 'center';
        ctx.fillText("DRIVE THE LUXURY V8", 256, 75);

        ctx.fillStyle = '#1c222c';
        // Silhouette of vintage sedan
        ctx.beginPath();
        ctx.roundRect(80, 120, 350, 60, 15);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(140, 90, 200, 45, 12);
        ctx.fill();

        ctx.font = '20px Arial';
        ctx.fillStyle = '#444444';
        ctx.fillText("AT YOUR LOCAL HUDSON DEALER", 256, 220);
        return new THREE.CanvasTexture(c);
    }

    update(delta, playerPos, totalScore) {
        const time = performance.now() * 0.001;

        // Drift 3D Puffy Cumulus Clouds across the sunny sky
        this.clouds.forEach(cl => {
            cl.position.x += delta * 2.2;
            if (cl.position.x > 220) {
                cl.position.x = -220;
            }
        });

        // Flashing Police Cruiser Beacon
        this.policeLights.forEach(pl => {
            const isRed = Math.floor(time * 6) % 2 === 0;
            pl.color.setHex(isRed ? 0xff0022 : 0x0066ff);
        });

        // Pulsing terminal displays
        this.terminals.forEach(t => {
            if (t.holo && t.holo.material && t.holo.material.emissiveIntensity) {
                t.holo.material.emissiveIntensity = 0.8 + Math.sin(time * 6) * 0.12;
            }
            if (t.ring) {
                t.ring.rotation.z += delta * 0.5;
            }
        });
    }
}

window.CyberBunkerWorld = CyberBunkerWorld;
