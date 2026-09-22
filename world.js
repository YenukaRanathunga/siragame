// Massive 200m x 200m Open-World Metropolis (8+ Blocks, Districts, Cars, Storefronts)

class CyberBunkerWorld {
    constructor(scene) {
        this.scene = scene;
        this.terminals = [];
        this.animatedObjects = [];
        this.policeLights = [];
        this.laserBarriers = [];

        this.initAtmosphere();
        this.buildMassiveRoadNetwork();
        this.buildCityBlocksAndSidewalks();
        this.buildDistrictBuildings();
        this.buildCityVehicles();
        this.buildOverheadPennants();
        this.buildStreetTreesAndProps();
        this.buildStreetLamps();
        this.buildChallengeStations();
    }

    initAtmosphere() {
        // Deep cinematic night sky fog
        this.scene.fog = new THREE.FogExp2(0x10141e, 0.010);

        // Ambient Lighting
        const ambientLight = new THREE.AmbientLight(0x242e40, 1.4);
        this.scene.add(ambientLight);

        // Moon Directional Light
        const moonLight = new THREE.DirectionalLight(0x94b0d0, 1.2);
        moonLight.position.set(-60, 80, -60);
        moonLight.castShadow = true;
        moonLight.shadow.mapSize.width = 2048;
        moonLight.shadow.mapSize.height = 2048;
        moonLight.shadow.camera.near = 1;
        moonLight.shadow.camera.far = 250;
        moonLight.shadow.camera.left = -110;
        moonLight.shadow.camera.right = 110;
        moonLight.shadow.camera.top = 110;
        moonLight.shadow.camera.bottom = -110;
        moonLight.shadow.bias = -0.0005;
        this.scene.add(moonLight);
    }

    buildMassiveRoadNetwork() {
        // High-resolution procedural asphalt road texture (200m x 200m)
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Dark asphalt ground
        ctx.fillStyle = '#161922';
        ctx.fillRect(0, 0, 1024, 1024);

        // Grain & road noise
        for (let i = 0; i < 50000; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 1024;
            const b = 20 + Math.random() * 16;
            ctx.fillStyle = `rgb(${b}, ${b+1}, ${b+3})`;
            ctx.fillRect(x, y, 2, 2);
        }

        // Multiple Interconnected Avenues & Streets
        // Center Avenue (North-South): x ~ 512, width 100px
        // Center Boulevard (East-West): y ~ 512, width 100px
        // Secondary Street North: y ~ 200, width 80px
        // Secondary Street South: y ~ 824, width 80px
        // Secondary Avenue West: x ~ 200, width 80px
        // Secondary Avenue East: x ~ 824, width 80px

        // Double Yellow Center Lines
        ctx.fillStyle = '#f5b700';
        // Main N-S Avenue center line
        ctx.fillRect(510, 0, 4, 1024);
        // Main E-W Boulevard center line
        ctx.fillRect(0, 510, 1024, 4);

        // Secondary yellow road lines
        ctx.fillRect(200, 0, 3, 1024);
        ctx.fillRect(824, 0, 3, 1024);
        ctx.fillRect(0, 200, 1024, 3);
        ctx.fillRect(0, 824, 1024, 3);

        // Pedestrian Zebra Crossings on Intersections
        ctx.fillStyle = 'rgba(215, 220, 230, 0.85)';
        const intersections = [
            { x: 512, y: 512 },
            { x: 200, y: 200 },
            { x: 824, y: 200 },
            { x: 200, y: 824 },
            { x: 824, y: 824 }
        ];

        intersections.forEach(pt => {
            // N, S, E, W zebra stripes around intersection
            for (let i = -35; i <= 35; i += 12) {
                ctx.fillRect(pt.x + i, pt.y - 65, 8, 20);
                ctx.fillRect(pt.x + i, pt.y + 45, 8, 20);
                ctx.fillRect(pt.x - 65, pt.y + i, 20, 8);
                ctx.fillRect(pt.x + 45, pt.y + i, 20, 8);
            }
        });

        // Wet puddles with specular highlights
        const puddles = [
            { x: 480, y: 530, r: 70 },
            { x: 540, y: 490, r: 85 },
            { x: 220, y: 230, r: 60 },
            { x: 810, y: 810, r: 75 },
            { x: 350, y: 512, r: 80 },
            { x: 700, y: 512, r: 90 }
        ];

        puddles.forEach(p => {
            const rad = ctx.createRadialGradient(p.x, p.y, 10, p.x, p.y, p.r);
            rad.addColorStop(0, 'rgba(8, 10, 16, 0.95)');
            rad.addColorStop(0.7, 'rgba(14, 18, 26, 0.75)');
            rad.addColorStop(1, 'rgba(22, 25, 34, 0)');
            ctx.fillStyle = rad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });

        const roadTex = new THREE.CanvasTexture(canvas);
        const roadMat = new THREE.MeshStandardMaterial({
            map: roadTex,
            roughness: 0.38,
            metalness: 0.35
        });

        const roadGeo = new THREE.PlaneGeometry(200, 200);
        const road = new THREE.Mesh(roadGeo, roadMat);
        road.rotation.x = -Math.PI / 2;
        road.receiveShadow = true;
        this.scene.add(road);
    }

    buildCityBlocksAndSidewalks() {
        const sidewalkMat = new THREE.MeshStandardMaterial({
            color: 0x484f5c,
            roughness: 0.8,
            metalness: 0.1
        });

        const yellowCurbMat = new THREE.MeshStandardMaterial({
            color: 0xf5b700,
            roughness: 0.6
        });

        // 8 Major City Blocks across the 200m map
        const blocks = [
            // Inner Core 4 Blocks
            { x: -35, z: -35, w: 45, d: 45 }, // NW Inner
            { x: 35, z: -35, w: 45, d: 45 },  // NE Inner
            { x: -35, z: 35, w: 45, d: 45 },  // SW Inner
            { x: 35, z: 35, w: 45, d: 45 },   // SE Inner
            // Outer Ring 4 Blocks
            { x: -75, z: -75, w: 30, d: 30 },
            { x: 75, z: -75, w: 30, d: 30 },
            { x: -75, z: 75, w: 30, d: 30 },
            { x: 75, z: 75, w: 30, d: 30 }
        ];

        blocks.forEach(b => {
            // Raised Sidewalk Slab
            const slab = new THREE.Mesh(new THREE.BoxGeometry(b.w, 0.25, b.d), sidewalkMat);
            slab.position.set(b.x, 0.125, b.z);
            slab.receiveShadow = true;
            this.scene.add(slab);

            // Yellow Curbs
            const curbX = new THREE.Mesh(new THREE.BoxGeometry(b.w + 0.2, 0.28, 0.4), yellowCurbMat);
            curbX.position.set(b.x, 0.14, b.z < 0 ? b.z + b.d/2 : b.z - b.d/2);
            this.scene.add(curbX);

            const curbZ = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.28, b.d + 0.2), yellowCurbMat);
            curbZ.position.set(b.x < 0 ? b.x + b.w/2 : b.x - b.w/2, 0.14, b.z);
            this.scene.add(curbZ);
        });
    }

    buildDistrictBuildings() {
        // Textures & Materials
        const brickMat = new THREE.MeshStandardMaterial({ color: 0x58291e, roughness: 0.85 });
        const concreteMat = new THREE.MeshStandardMaterial({ color: 0x383e4a, roughness: 0.7 });
        const corporateGlass = new THREE.MeshStandardMaterial({ color: 0x142032, roughness: 0.1, metalness: 0.9 });
        const warmLitWindow = new THREE.MeshStandardMaterial({ color: 0xffaa40, emissive: 0xffaa40, emissiveIntensity: 0.75 });

        // 1. NE DISTRICT: E-CORP FINANCIAL SKYSCRAPERS
        const eCorpTower = new THREE.Mesh(new THREE.BoxGeometry(32, 48, 32), corporateGlass);
        eCorpTower.position.set(40, 24, -40);
        eCorpTower.castShadow = true;
        eCorpTower.receiveShadow = true;
        this.scene.add(eCorpTower);

        // E-Corp Lit Windows
        for (let floor = 2; floor < 12; floor++) {
            for (let x = -12; x <= 12; x += 4) {
                const win = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 0.1), (floor + x) % 3 === 0 ? warmLitWindow : corporateGlass);
                win.position.set(40 + x, floor * 3.8, -23.9);
                this.scene.add(win);
            }
        }

        this.buildStoreSign({
            text: "E CORP FINANCIAL TOWER",
            subtext: "GLOBAL ASSET MANAGEMENT",
            pos: { x: 26, y: 6.5, z: -23.8 },
            rotY: 0,
            bgColor: "#091222",
            textColor: "#00f0ff"
        });

        // 2. NW DISTRICT: TECH DATACENTER & TELECOM
        const techBuilding = new THREE.Mesh(new THREE.BoxGeometry(30, 26, 30), concreteMat);
        techBuilding.position.set(-40, 13, -40);
        techBuilding.castShadow = true;
        techBuilding.receiveShadow = true;
        this.scene.add(techBuilding);

        this.buildStoreSign({
            text: "ALLSAFE CYBER SECURITY",
            subtext: "DATA INFRASTRUCTURE & RECON",
            pos: { x: -26, y: 5.5, z: -24.8 },
            rotY: 0,
            bgColor: "#101e30",
            textColor: "#00ff66"
        });

        // 3. SW DISTRICT: CHINATOWN & DUMPLING TOWN (User's Photo 4!)
        const chinatownBuilding = new THREE.Mesh(new THREE.BoxGeometry(32, 22, 32), brickMat);
        chinatownBuilding.position.set(-40, 11, 40);
        chinatownBuilding.castShadow = true;
        chinatownBuilding.receiveShadow = true;
        this.scene.add(chinatownBuilding);

        // Bo Hai Dumpling Town Sign (Photo 4!)
        this.buildStoreSign({
            text: "BO HAI DUMPLING TOWN",
            subtext: "CHINATOWN SPECIALTIES • NOODLES",
            pos: { x: -26, y: 5.2, z: 23.8 },
            rotY: Math.PI,
            bgColor: "#851212",
            textColor: "#ffdd44"
        });

        // Globe Loan & Jewelry Sign (Photo 4!)
        this.buildStoreSign({
            text: "GLOBE LOAN & JEWELRY",
            subtext: "PAWN • BUY • SELL",
            pos: { x: -23.8, y: 5.2, z: 34 },
            rotY: Math.PI / 2,
            bgColor: "#081b33",
            textColor: "#00d4ff"
        });

        // Fire Escapes along Chinatown building
        for (let f = 1; f <= 3; f++) {
            const escape = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.15, 4.5), new THREE.MeshStandardMaterial({ color: 0x1f232b, metalness: 0.8 }));
            escape.position.set(-23.2, f * 4.5, 40);
            this.scene.add(escape);
        }

        // 4. SE DISTRICT: DOWNTOWN & ENTERTAINMENT (Photo 1 & Mr. Robot Cafe)
        const downtownBuilding = new THREE.Mesh(new THREE.BoxGeometry(32, 24, 32), brickMat);
        downtownBuilding.position.set(40, 12, 40);
        downtownBuilding.castShadow = true;
        downtownBuilding.receiveShadow = true;
        this.scene.add(downtownBuilding);

        // Ron's Coffee Awning & Sign
        this.buildStoreAwning({ x: 26, y: 3.2, z: 23.8, width: 8, color: 0x1e5631 });
        this.buildStoreSign({
            text: "RON'S COFFEE // 24H",
            subtext: "FREE GUEST WI-FI",
            pos: { x: 26, y: 5.2, z: 23.8 },
            rotY: Math.PI,
            bgColor: "#143820",
            textColor: "#55ff88"
        });

        // A-Side Music Store Sign (Photo 1!)
        this.buildStoreSign({
            text: "A-SIDE MUSIC STORE",
            subtext: "VINYL • GUITARS • AUDIO",
            pos: { x: 23.8, y: 5.2, z: 32 },
            rotY: -Math.PI / 2,
            bgColor: "#801818",
            textColor: "#ffaa00"
        });

        // Patty's Pub Awning & Sign (Photo 1!)
        this.buildStoreAwning({ x: 38, y: 3.2, z: 23.8, width: 7, color: 0x8b0000 });
        this.buildStoreSign({
            text: "PATTY'S PUB & BILLIARDS",
            subtext: "DRAUGHT BEER • ARCADE",
            pos: { x: 38, y: 5.2, z: 23.8 },
            rotY: Math.PI,
            bgColor: "#400808",
            textColor: "#ff8844"
        });
    }

    buildStoreAwning({ x, y, z, width, color }) {
        const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.8 });
        const geo = new THREE.BoxGeometry(width, 0.25, 1.8);
        geo.rotateX(0.35);
        const awning = new THREE.Mesh(geo, mat);
        awning.position.set(x, y, z);
        awning.castShadow = true;
        this.scene.add(awning);
    }

    buildStoreSign({ text, subtext, pos, rotY, bgColor, textColor }) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 512, 128);

        ctx.strokeStyle = textColor;
        ctx.lineWidth = 6;
        ctx.strokeRect(6, 6, 500, 116);

        ctx.fillStyle = textColor;
        ctx.font = 'bold 34px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(text, 256, 56);

        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(subtext, 256, 94);

        const tex = new THREE.CanvasTexture(canvas);
        const sign = new THREE.Mesh(new THREE.BoxGeometry(6.5, 1.6, 0.2), new THREE.MeshBasicMaterial({ map: tex }));
        sign.position.set(pos.x, pos.y, pos.z);
        sign.rotation.y = rotY;
        this.scene.add(sign);
    }

    buildCityVehicles() {
        // Multiple 3D vehicles parked along avenues and curbs across the huge town:
        const cars = [
            // Center Crossroad Vehicles
            { type: 'sedan', color: 0xc8b282, pos: { x: 8, z: 18 }, rotY: 0 },
            { type: 'van', color: 0xcc7a00, pos: { x: -8, z: 14 }, rotY: Math.PI },
            { type: 'police', color: 0x111622, pos: { x: 14, z: -8 }, rotY: Math.PI / 2 },
            { type: 'taxi', color: 0xffbb00, pos: { x: -14, z: -8 }, rotY: -Math.PI / 2 },
            // Outer District Vehicles
            { type: 'sedan', color: 0x224488, pos: { x: 45, z: 14 }, rotY: 0 },
            { type: 'taxi', color: 0xffbb00, pos: { x: -45, z: 14 }, rotY: Math.PI },
            { type: 'police', color: 0x111622, pos: { x: 14, z: -45 }, rotY: Math.PI / 2 },
            { type: 'van', color: 0x334455, pos: { x: -14, z: -45 }, rotY: -Math.PI / 2 }
        ];

        cars.forEach(c => this.createCar(c));
    }

    createCar({ type, color, pos, rotY }) {
        const carGroup = new THREE.Group();
        carGroup.position.set(pos.x, 0, pos.z);
        carGroup.rotation.y = rotY;

        const bodyMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.35, metalness: 0.6 });
        const windowMat = new THREE.MeshStandardMaterial({ color: 0x080c14, roughness: 0.1, metalness: 0.9 });
        const tireMat = new THREE.MeshStandardMaterial({ color: 0x151618, roughness: 0.8 });
        const bumperMat = new THREE.MeshStandardMaterial({ color: 0xd0d5dd, metalness: 0.9 });

        if (type === 'van') {
            const van = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.9, 4.4), bodyMat);
            van.position.y = 1.25;
            van.castShadow = true;
            carGroup.add(van);

            const wind = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.7, 0.05), windowMat);
            wind.position.set(0, 1.5, 2.22);
            carGroup.add(wind);
        } else if (type === 'police') {
            const suv = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 4.6), bodyMat);
            suv.position.y = 0.85;
            suv.castShadow = true;
            carGroup.add(suv);

            const door = new THREE.Mesh(new THREE.BoxGeometry(2.22, 0.65, 1.8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
            door.position.set(0, 0.85, 0);
            carGroup.add(door);

            const cab = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.75, 2.6), windowMat);
            cab.position.set(0, 1.6, -0.2);
            carGroup.add(cab);

            // Flashing Lightbar (Red/Blue)
            const pLight = new THREE.PointLight(0x0066ff, 1.6, 18);
            pLight.position.set(0, 2.5, -0.2);
            carGroup.add(pLight);
            this.policeLights.push(pLight);
        } else if (type === 'taxi') {
            const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.75, 4.4), bodyMat);
            body.position.y = 0.75;
            body.castShadow = true;
            carGroup.add(body);

            const cab = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.65, 2.3), windowMat);
            cab.position.set(0, 1.4, -0.15);
            carGroup.add(cab);

            const sign = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.3), new THREE.MeshBasicMaterial({ color: 0xfff0a0 }));
            sign.position.set(0, 1.82, -0.15);
            carGroup.add(sign);
        } else {
            const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.7, 4.3), bodyMat);
            body.position.y = 0.7;
            body.castShadow = true;
            carGroup.add(body);

            const cab = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.6, 2.2), windowMat);
            cab.position.set(0, 1.3, -0.2);
            carGroup.add(cab);
        }

        // 4 Wheels
        const wheelPositions = [{ x: -1.05, z: 1.3 }, { x: 1.05, z: 1.3 }, { x: -1.05, z: -1.3 }, { x: 1.05, z: -1.3 }];
        wheelPositions.forEach(wp => {
            const wheelGroup = new THREE.Group();
            wheelGroup.position.set(wp.x, 0.38, wp.z);
            const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.25, 16), tireMat);
            tire.rotateZ(Math.PI / 2);
            wheelGroup.add(tire);
            carGroup.add(wheelGroup);
        });

        // Headlights & Bumpers
        const hlMat = new THREE.MeshBasicMaterial({ color: 0xfff0c0 });
        const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.05), hlMat);
        hlL.position.set(-0.7, 0.75, 2.2);
        carGroup.add(hlL);
        const hlR = hlL.clone();
        hlR.position.x = 0.7;
        carGroup.add(hlR);

        const bumpF = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.18, 0.15), bumperMat);
        bumpF.position.set(0, 0.5, 2.25);
        carGroup.add(bumpF);

        this.scene.add(carGroup);
    }

    buildOverheadPennants() {
        const buntingLines = [15, -15];
        const colors = [0xff2222, 0xffffff, 0x2266ff, 0xffaa00];

        buntingLines.forEach(z => {
            const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 34, 6), new THREE.MeshBasicMaterial({ color: 0x333333 }));
            wire.rotateZ(Math.PI / 2);
            wire.position.set(0, 7.2, z);
            this.scene.add(wire);

            for (let x = -16; x <= 16; x += 1.4) {
                const c = colors[Math.abs(Math.floor(x * 2)) % colors.length];
                const flag = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.7, 3), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }));
                flag.rotateZ(Math.PI);
                flag.position.set(x, 6.7, z);
                this.scene.add(flag);
            }
        });
    }

    buildStreetTreesAndProps() {
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3e271a, roughness: 0.9 });
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x2e4a28, roughness: 0.8 });
        const autumnMat = new THREE.MeshStandardMaterial({ color: 0xa85522, roughness: 0.8 });

        const treeCoords = [
            { x: -14, z: -20, a: true }, { x: 14, z: -20, a: false },
            { x: -14, z: 20, a: false }, { x: 14, z: 20, a: true },
            { x: -50, z: -20, a: true }, { x: 50, z: -20, a: false },
            { x: -50, z: 20, a: false }, { x: 50, z: 20, a: true },
            { x: -20, z: -50, a: true }, { x: 20, z: -50, a: false }
        ];

        treeCoords.forEach(t => {
            const tree = new THREE.Group();
            tree.position.set(t.x, 0, t.z);

            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 5, 8), trunkMat);
            trunk.position.y = 2.5;
            trunk.castShadow = true;
            tree.add(trunk);

            const canopy = new THREE.Mesh(new THREE.DodecahedronGeometry(1.9, 1), t.a ? autumnMat : leafMat);
            canopy.position.y = 5.4;
            canopy.castShadow = true;
            tree.add(canopy);

            this.scene.add(tree);
        });

        // Fire Hydrants & Benches
        const hydMat = new THREE.MeshStandardMaterial({ color: 0xd92626 });
        const hyd1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.75, 8), hydMat);
        hyd1.position.set(-13.5, 0.45, -11);
        this.scene.add(hyd1);

        const hyd2 = hyd1.clone();
        hyd2.position.set(13.5, 0.45, 11);
        this.scene.add(hyd2);
    }

    buildStreetLamps() {
        const lampMat = new THREE.MeshStandardMaterial({ color: 0x1a261c, roughness: 0.4, metalness: 0.8 });

        const lamps = [
            { x: -13, z: -13 }, { x: 13, z: -13 }, { x: -13, z: 13 }, { x: 13, z: 13 },
            { x: -55, z: -13 }, { x: 55, z: -13 }, { x: -55, z: 13 }, { x: 55, z: 13 }
        ];

        lamps.forEach(p => {
            const lamp = new THREE.Group();
            lamp.position.set(p.x, 0, p.z);

            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 7.0, 8), lampMat);
            post.position.y = 3.5;
            post.castShadow = true;
            lamp.add(post);

            const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 1.4), lampMat);
            arm.position.set(p.x < 0 ? 0.6 : -0.6, 6.9, 0);
            lamp.add(arm);

            const fixture = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.2, 0.45), lampMat);
            fixture.position.set(p.x < 0 ? 1.2 : -1.2, 6.8, 0);
            lamp.add(fixture);

            const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffeaad }));
            bulb.position.copy(fixture.position);
            bulb.position.y -= 0.12;
            lamp.add(bulb);

            const spot = new THREE.SpotLight(0xffeaad, 2.2, 26, Math.PI / 3.2, 0.6, 1.2);
            spot.position.copy(bulb.position);
            spot.target.position.set(p.x < 0 ? p.x + 3 : p.x - 3, 0, p.z);
            spot.castShadow = true;
            spot.shadow.mapSize.width = 1024;
            spot.shadow.mapSize.height = 1024;

            this.scene.add(spot);
            this.scene.add(spot.target);
            this.scene.add(lamp);
        });
    }

    buildChallengeStations() {
        const challenges = window.CHALLENGES_DATA || [];

        // Realistic metropolis locations across town:
        const stationPlacements = {
            'station-web': {
                title: "Ron's Coffee Infiltration Table",
                pos: { x: 22.0, z: 18.0 },
                color: 0x00f0ff,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.8, 16), new THREE.MeshStandardMaterial({ color: 0x222222 }));
                    table.position.y = 0.4;
                    g.add(table);

                    const laptop = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.04, 0.45), new THREE.MeshStandardMaterial({ color: 0x14161a }));
                    laptop.position.set(0, 0.82, 0);
                    g.add(laptop);

                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.03), new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.9 }));
                    screen.position.set(0, 1.05, -0.2);
                    screen.rotation.x = -0.2;
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-crypto': {
                title: "E-Corp ATM Kiosk",
                pos: { x: 26.0, z: -20.0 },
                color: 0xffb703,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const atm = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.6, 0.8), new THREE.MeshStandardMaterial({ color: 0x1c2330 }));
                    atm.position.y = 1.3;
                    g.add(atm);

                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.55, 0.05), new THREE.MeshStandardMaterial({ color: 0xffb703, emissive: 0xffb703, emissiveIntensity: 0.85 }));
                    screen.position.set(0, 1.6, 0.42);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-linux': {
                title: "Allsafe Fiber Telecom Box",
                pos: { x: -22.0, z: -20.0 },
                color: 0x00ff66,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const box = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.1, 0.8), new THREE.MeshStandardMaterial({ color: 0x223625 }));
                    box.position.y = 1.05;
                    g.add(box);

                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.7, 0.05), new THREE.MeshStandardMaterial({ color: 0x00ff66, emissive: 0x00ff66, emissiveIntensity: 0.9 }));
                    screen.position.set(0, 1.25, 0.42);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-forensics': {
                title: "Police Cruiser Terminal",
                pos: { x: 14.0, z: -8.0 },
                color: 0xff007f,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.04), new THREE.MeshStandardMaterial({ color: 0xff007f, emissive: 0xff007f, emissiveIntensity: 0.9 }));
                    screen.position.set(0, 1.5, 0.3);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-rev': {
                title: "Chinatown Alley Arcade",
                pos: { x: -22.0, z: 22.0 },
                color: 0xff3333,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const arcade = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.7, 1.0), new THREE.MeshStandardMaterial({ color: 0x1f1a26 }));
                    arcade.position.y = 1.35;
                    g.add(arcade);

                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.05), new THREE.MeshStandardMaterial({ color: 0xff3333, emissive: 0xff3333, emissiveIntensity: 0.9 }));
                    screen.position.set(0, 1.7, 0.42);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-boss': {
                title: "E-Corp Vault Blast Gate",
                pos: { x: 50.0, z: -40.0 },
                color: 0xb026ff,
                isBoss: true,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const frame = new THREE.Mesh(new THREE.BoxGeometry(8, 9, 1.5), new THREE.MeshStandardMaterial({ color: 0x1e222d, metalness: 0.9 }));
                    frame.position.y = 4.5;
                    g.add(frame);

                    const door = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.8, 32), new THREE.MeshStandardMaterial({ color: 0x2e3544, metalness: 0.9 }));
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
            const config = stationPlacements[ch.id];
            if (!config) return;

            ch.pos = config.pos;

            const { root, holo } = config.meshCreator();
            root.position.set(config.pos.x, 0, config.pos.z);

            const ringGeo = new THREE.RingGeometry(2.4, 2.8, 32);
            ringGeo.rotateX(-Math.PI / 2);
            const ringMat = new THREE.MeshBasicMaterial({
                color: config.color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.65
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.y = 0.03;
            root.add(ring);

            const pLight = new THREE.PointLight(config.color, 1.4, 9);
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

    update(delta, playerPos, totalScore) {
        const time = performance.now() * 0.001;

        // Flash Police Cruiser Emergency Beacons
        this.policeLights.forEach(pl => {
            const isRed = Math.floor(time * 6) % 2 === 0;
            pl.color.setHex(isRed ? 0xff0022 : 0x0066ff);
        });

        // Animate screens
        this.terminals.forEach(t => {
            if (t.holo && t.holo.material && t.holo.material.emissiveIntensity) {
                t.holo.material.emissiveIntensity = 0.85 + Math.sin(time * 8) * 0.08;
            }
        });
    }
}

window.CyberBunkerWorld = CyberBunkerWorld;
