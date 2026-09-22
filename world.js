// GTA & Mafia Style 3D Open-World Town (Intersections, 3D Cars, Storefronts, Pennants)

class CyberBunkerWorld {
    constructor(scene) {
        this.scene = scene;
        this.terminals = [];
        this.animatedObjects = [];
        this.policeLight = null;
        this.laserBarriers = [];

        this.initAtmosphere();
        this.buildTownRoads();
        this.buildSidewalksAndCurbs();
        this.buildTownStorefronts();
        this.buildParkedCars();
        this.buildOverheadPennants();
        this.buildSidewalkTreesAndProps();
        this.buildStreetLamps();
        this.buildChallengeStations();
    }

    initAtmosphere() {
        // Deep night sky atmosphere
        this.scene.fog = new THREE.FogExp2(0x10141e, 0.016);

        // Ambient Fill
        const ambientLight = new THREE.AmbientLight(0x222a3a, 1.3);
        this.scene.add(ambientLight);

        // Moon Directional Light
        const moonLight = new THREE.DirectionalLight(0x8fa8c6, 1.1);
        moonLight.position.set(-25, 45, -30);
        moonLight.castShadow = true;
        moonLight.shadow.mapSize.width = 2048;
        moonLight.shadow.mapSize.height = 2048;
        moonLight.shadow.camera.near = 0.5;
        moonLight.shadow.camera.far = 120;
        moonLight.shadow.camera.left = -45;
        moonLight.shadow.camera.right = 45;
        moonLight.shadow.camera.top = 45;
        moonLight.shadow.camera.bottom = -45;
        moonLight.shadow.bias = -0.0004;
        this.scene.add(moonLight);
    }

    buildTownRoads() {
        // High-res asphalt texture with 4-way intersection markings
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Dark asphalt base
        ctx.fillStyle = '#161920';
        ctx.fillRect(0, 0, 1024, 1024);

        // Grain & asphalt noise
        for (let i = 0; i < 40000; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 1024;
            const b = 22 + Math.random() * 15;
            ctx.fillStyle = `rgb(${b}, ${b+1}, ${b+3})`;
            ctx.fillRect(x, y, 2, 2);
        }

        // Tarmac patch lines (like Image 5!)
        ctx.strokeStyle = '#12141a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(120, 200); ctx.lineTo(350, 210); ctx.lineTo(360, 280); ctx.lineTo(110, 270); ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(600, 700); ctx.lineTo(850, 720); ctx.lineTo(840, 800); ctx.lineTo(590, 780); ctx.closePath();
        ctx.stroke();

        // North-South Avenue Road Lines (between x: 412 and 612)
        // Double Yellow Center Line
        ctx.fillStyle = '#f5b700';
        ctx.fillRect(507, 0, 4, 380);
        ctx.fillRect(513, 0, 4, 380);
        ctx.fillRect(507, 644, 4, 380);
        ctx.fillRect(513, 644, 4, 380);

        // East-West Street Road Lines (between y: 412 and 612)
        ctx.fillRect(0, 507, 380, 4);
        ctx.fillRect(0, 513, 380, 4);
        ctx.fillRect(644, 507, 380, 4);
        ctx.fillRect(644, 513, 380, 4);

        // Pedestrian Zebra Crossings (White stripes around the 4-way intersection)
        ctx.fillStyle = 'rgba(215, 220, 230, 0.85)';
        // North Crossing
        for (let x = 425; x <= 595; x += 22) {
            ctx.fillRect(x, 380, 14, 30);
        }
        // South Crossing
        for (let x = 425; x <= 595; x += 22) {
            ctx.fillRect(x, 614, 14, 30);
        }
        // West Crossing
        for (let y = 425; y <= 595; y += 22) {
            ctx.fillRect(380, y, 30, 14);
        }
        // East Crossing
        for (let y = 425; y <= 595; y += 22) {
            ctx.fillRect(614, y, 30, 14);
        }

        // Stop Bars (Solid White lines before crossings)
        ctx.fillRect(420, 370, 84, 6);
        ctx.fillRect(520, 648, 84, 6);
        ctx.fillRect(370, 520, 6, 84);
        ctx.fillRect(648, 420, 6, 84);

        // Wet puddle areas reflecting light
        const puddles = [
            { x: 460, y: 490, r: 65 },
            { x: 570, y: 530, r: 80 },
            { x: 480, y: 720, r: 90 },
            { x: 300, y: 460, r: 70 },
            { x: 750, y: 550, r: 75 }
        ];

        puddles.forEach(p => {
            const rad = ctx.createRadialGradient(p.x, p.y, 5, p.x, p.y, p.r);
            rad.addColorStop(0, 'rgba(8, 10, 15, 0.92)');
            rad.addColorStop(0.7, 'rgba(12, 16, 24, 0.7)');
            rad.addColorStop(1, 'rgba(22, 25, 32, 0)');
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

        const roadGeo = new THREE.PlaneGeometry(80, 80);
        const road = new THREE.Mesh(roadGeo, roadMat);
        road.rotation.x = -Math.PI / 2;
        road.receiveShadow = true;
        this.scene.add(road);
    }

    buildSidewalksAndCurbs() {
        const sidewalkMat = new THREE.MeshStandardMaterial({
            color: 0x484f5c,
            roughness: 0.8,
            metalness: 0.1
        });

        // Yellow painted curb edge (matching Image 1 & 4!)
        const yellowCurbMat = new THREE.MeshStandardMaterial({
            color: 0xf5b700,
            roughness: 0.6
        });

        // 4 Corner Sidewalk Blocks: NW, NE, SW, SE
        const corners = [
            { x: -25, z: -25 }, // NW
            { x: 25, z: -25 },  // NE
            { x: -25, z: 25 },  // SW
            { x: 25, z: 25 }   // SE
        ];

        corners.forEach(c => {
            // Main Sidewalk Slab
            const slabGeo = new THREE.BoxGeometry(29, 0.25, 29);
            const slab = new THREE.Mesh(slabGeo, sidewalkMat);
            slab.position.set(c.x, 0.125, c.z);
            slab.receiveShadow = true;
            this.scene.add(slab);

            // Yellow Curbs lining the street facing edges
            const curbXGeo = new THREE.BoxGeometry(29.2, 0.28, 0.4);
            const curbZGeo = new THREE.BoxGeometry(0.4, 0.28, 29.2);

            const curbZPos = c.z < 0 ? c.z + 14.6 : c.z - 14.6;
            const curbXPos = c.x < 0 ? c.x + 14.6 : c.x - 14.6;

            const curb1 = new THREE.Mesh(curbXGeo, yellowCurbMat);
            curb1.position.set(c.x, 0.14, curbZPos);
            this.scene.add(curb1);

            const curb2 = new THREE.Mesh(curbZGeo, yellowCurbMat);
            curb2.position.set(curbXPos, 0.14, c.z);
            this.scene.add(curb2);
        });
    }

    buildTownStorefronts() {
        // Red Brick Canvas Texture
        const brickCanvas = document.createElement('canvas');
        brickCanvas.width = 512;
        brickCanvas.height = 512;
        const bCtx = brickCanvas.getContext('2d');
        bCtx.fillStyle = '#5c2d22';
        bCtx.fillRect(0, 0, 512, 512);
        bCtx.strokeStyle = '#381812';
        bCtx.lineWidth = 2;
        for (let y = 0; y < 512; y += 18) {
            const off = (y / 18) % 2 === 0 ? 0 : 18;
            for (let x = -36; x < 512; x += 36) {
                bCtx.strokeRect(x + off, y, 36, 18);
            }
        }
        const brickTex = new THREE.CanvasTexture(brickCanvas);
        brickTex.wrapS = THREE.RepeatWrapping;
        brickTex.wrapT = THREE.RepeatWrapping;
        brickTex.repeat.set(3, 4);

        const brickMat = new THREE.MeshStandardMaterial({ map: brickTex, roughness: 0.85 });
        const concreteMat = new THREE.MeshStandardMaterial({ color: 0x3d434f, roughness: 0.7 });
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x141e2b, roughness: 0.1, metalness: 0.9 });
        const warmLitMat = new THREE.MeshStandardMaterial({ color: 0xffb74d, emissive: 0xffb74d, emissiveIntensity: 0.7 });

        // 1. NORTH-WEST BLOCK: RON'S COFFEE & GLOBE LOAN (Images 1 & 4)
        const nwBuilding = new THREE.Mesh(new THREE.BoxGeometry(22, 18, 22), brickMat);
        nwBuilding.position.set(-25, 9, -25);
        nwBuilding.castShadow = true;
        nwBuilding.receiveShadow = true;
        this.scene.add(nwBuilding);

        // Ron's Coffee Shop Awning (Striped Green/White fabric)
        this.buildStoreAwning({ x: -14, y: 3.2, z: -14.2, width: 8, color1: 0x1e5631, color2: 0xffffff });

        // Ron's Coffee Backlit Sign
        this.buildStoreSign({
            text: "RON'S COFFEE // 24H",
            subtext: "FREE GUEST WI-FI",
            pos: { x: -14, y: 4.8, z: -13.9 },
            rotY: 0,
            bgColor: "#143820",
            textColor: "#55ff88"
        });

        // Globe Loan & Jewelry Sign (Image 4!)
        this.buildStoreSign({
            text: "GLOBE LOAN & JEWELRY",
            subtext: "PAWN • BUY • SELL",
            pos: { x: -13.9, y: 4.8, z: -20 },
            rotY: Math.PI / 2,
            bgColor: "#081b33",
            textColor: "#00d4ff"
        });

        // 2. SOUTH-WEST BLOCK: A-SIDE MUSIC STORE & PATTY'S PUB (Image 1!)
        const swBuilding = new THREE.Mesh(new THREE.BoxGeometry(22, 16, 22), brickMat);
        swBuilding.position.set(-25, 8, 25);
        swBuilding.castShadow = true;
        swBuilding.receiveShadow = true;
        this.scene.add(swBuilding);

        // A-Side Music Store Illuminated Box Sign (Image 1!)
        this.buildStoreSign({
            text: "A-SIDE MUSIC STORE",
            subtext: "VINYL • GUITARS • AUDIO",
            pos: { x: -14, y: 4.6, z: 14.2 },
            rotY: Math.PI,
            bgColor: "#801818",
            textColor: "#ffaa00"
        });

        // Patty's Pub Awning (Red Canvas)
        this.buildStoreAwning({ x: -20, y: 3.2, z: 14.2, width: 6, color1: 0x8b0000, color2: 0x111111 });

        // 3. NORTH-EAST BLOCK: E-CORP BANK & FINANCIAL TOWER (Skyscrapers!)
        const neBuilding = new THREE.Mesh(new THREE.BoxGeometry(22, 28, 22), concreteMat);
        neBuilding.position.set(25, 14, -25);
        neBuilding.castShadow = true;
        neBuilding.receiveShadow = true;
        this.scene.add(neBuilding);

        // E-Corp Bank Main Sign
        this.buildStoreSign({
            text: "E CORP BANK",
            subtext: "GLOBAL FINANCIAL VAULT",
            pos: { x: 14, y: 5.2, z: -13.9 },
            rotY: 0,
            bgColor: "#0a1120",
            textColor: "#00f0ff"
        });

        // Add lit office windows to E-Corp tower
        for (let floor = 2; floor < 7; floor++) {
            for (let w = -7; w <= 7; w += 3.5) {
                const win = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.2, 0.1), (w + floor) % 2 === 0 ? warmLitMat : glassMat);
                win.position.set(25 + w, floor * 3.8, -13.9);
                this.scene.add(win);
            }
        }

        // 4. SOUTH-EAST BLOCK: CREOLE KING & ALLSAFE SECURITY (Image 2!)
        const seBuilding = new THREE.Mesh(new THREE.BoxGeometry(22, 20, 22), brickMat);
        seBuilding.position.set(25, 10, 25);
        seBuilding.castShadow = true;
        seBuilding.receiveShadow = true;
        this.scene.add(seBuilding);

        // Creole King Hamburger Neon Marquee (Image 2!)
        this.buildStoreSign({
            text: "CREOLE KING HAMBURGER",
            subtext: "OPEN LATE • FAST FOOD",
            pos: { x: 14, y: 4.8, z: 14.2 },
            rotY: Math.PI,
            bgColor: "#8b1010",
            textColor: "#ffdd44"
        });
    }

    buildStoreAwning({ x, y, z, width, color1, color2 }) {
        const awningMat = new THREE.MeshStandardMaterial({ color: color1, roughness: 0.8 });
        const awningGeo = new THREE.BoxGeometry(width, 0.25, 1.8);
        awningGeo.rotateX(0.35); // Slanted awning slope
        const awning = new THREE.Mesh(awningGeo, awningMat);
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
        ctx.fillText(text, 256, 58);

        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(subtext, 256, 96);

        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.MeshBasicMaterial({ map: tex });
        const signGeo = new THREE.BoxGeometry(6.5, 1.6, 0.2);
        const sign = new THREE.Mesh(signGeo, mat);
        sign.position.set(pos.x, pos.y, pos.z);
        sign.rotation.y = rotY;
        this.scene.add(sign);
    }

    buildParkedCars() {
        // Build 4 detailed 3D vehicles parked along the curbs:
        // 1. Sedan (Beige / Vintage Cream - Image 1)
        this.createCar({
            type: 'sedan',
            color: 0xc8b282,
            pos: { x: 7.5, y: 0, z: 12 },
            rotY: 0
        });

        // 2. Retro Delivery Van (Yellow-Orange - Image 1)
        this.createCar({
            type: 'van',
            color: 0xcc7a00,
            pos: { x: -7.5, y: 0, z: 8 },
            rotY: Math.PI
        });

        // 3. Police Cruiser SUV (Black & White with flashing beacons - Image 3)
        this.createCar({
            type: 'police',
            color: 0x111622,
            pos: { x: 12, y: 0, z: -7.5 },
            rotY: Math.PI / 2
        });

        // 4. NYC Yellow Taxi Cab (Checker Cab - Image 5 & Mr Robot)
        this.createCar({
            type: 'taxi',
            color: 0xffbb00,
            pos: { x: -12, y: 0, z: -7.5 },
            rotY: -Math.PI / 2
        });
    }

    createCar({ type, color, pos, rotY }) {
        const carGroup = new THREE.Group();
        carGroup.position.set(pos.x, 0, pos.z);
        carGroup.rotation.y = rotY;

        const bodyMat = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.35,
            metalness: 0.6
        });

        const windowMat = new THREE.MeshStandardMaterial({
            color: 0x080c14,
            roughness: 0.1,
            metalness: 0.9
        });

        const bumperMat = new THREE.MeshStandardMaterial({
            color: 0xd0d5dd,
            roughness: 0.3,
            metalness: 0.9
        });

        const tireMat = new THREE.MeshStandardMaterial({
            color: 0x151618,
            roughness: 0.8
        });

        const wheelHubMat = new THREE.MeshStandardMaterial({
            color: 0xe0e0e0,
            metalness: 0.8
        });

        if (type === 'van') {
            // Retro Van Body (Tall Boxy Cabin)
            const vanGeo = new THREE.BoxGeometry(2.1, 1.9, 4.4);
            const van = new THREE.Mesh(vanGeo, bodyMat);
            van.position.y = 1.25;
            van.castShadow = true;
            carGroup.add(van);

            // Windshield
            const windGeo = new THREE.BoxGeometry(1.95, 0.7, 0.05);
            const wind = new THREE.Mesh(windGeo, windowMat);
            wind.position.set(0, 1.5, 2.22);
            carGroup.add(wind);

        } else if (type === 'police') {
            // Police SUV Body
            const suvGeo = new THREE.BoxGeometry(2.2, 0.9, 4.6);
            const suv = new THREE.Mesh(suvGeo, bodyMat);
            suv.position.y = 0.85;
            suv.castShadow = true;
            carGroup.add(suv);

            // Police White Doors panel
            const doorGeo = new THREE.BoxGeometry(2.22, 0.65, 1.8);
            const doorMesh = new THREE.Mesh(doorGeo, new THREE.MeshStandardMaterial({ color: 0xffffff }));
            doorMesh.position.set(0, 0.85, 0);
            carGroup.add(doorMesh);

            // Cabin Roof
            const cabGeo = new THREE.BoxGeometry(1.85, 0.75, 2.6);
            const cab = new THREE.Mesh(cabGeo, windowMat);
            cab.position.set(0, 1.6, -0.2);
            carGroup.add(cab);

            // Rooftop Police Emergency Lightbar (Red & Blue!)
            const barGeo = new THREE.BoxGeometry(1.2, 0.15, 0.3);
            const barMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
            const lightbar = new THREE.Mesh(barGeo, barMat);
            lightbar.position.set(0, 2.05, -0.2);
            carGroup.add(lightbar);

            // Red Beacon
            const redB = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.28), new THREE.MeshBasicMaterial({ color: 0xff0022 }));
            redB.position.set(-0.35, 2.05, -0.2);
            carGroup.add(redB);

            // Blue Beacon
            const blueB = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.28), new THREE.MeshBasicMaterial({ color: 0x0066ff }));
            blueB.position.set(0.35, 2.05, -0.2);
            carGroup.add(blueB);

            // Flashing Light in scene
            const pLight = new THREE.PointLight(0x0066ff, 1.5, 15);
            pLight.position.set(0, 2.5, -0.2);
            carGroup.add(pLight);
            this.policeLight = pLight;

        } else if (type === 'taxi') {
            // Yellow Taxi Sedan Body
            const bodyGeo = new THREE.BoxGeometry(2.0, 0.75, 4.4);
            const body = new THREE.Mesh(bodyGeo, bodyMat);
            body.position.y = 0.75;
            body.castShadow = true;
            carGroup.add(body);

            // Passenger Cabin & Windows
            const cabGeo = new THREE.BoxGeometry(1.75, 0.65, 2.3);
            const cab = new THREE.Mesh(cabGeo, windowMat);
            cab.position.set(0, 1.4, -0.15);
            carGroup.add(cab);

            // Taxi Roof Sign
            const sign = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.3), new THREE.MeshBasicMaterial({ color: 0xfff0a0 }));
            sign.position.set(0, 1.82, -0.15);
            carGroup.add(sign);

        } else {
            // Standard Vintage Sedan (Image 1 style)
            const bodyGeo = new THREE.BoxGeometry(2.0, 0.7, 4.3);
            const body = new THREE.Mesh(bodyGeo, bodyMat);
            body.position.y = 0.7;
            body.castShadow = true;
            carGroup.add(body);

            const cabGeo = new THREE.BoxGeometry(1.7, 0.6, 2.2);
            const cab = new THREE.Mesh(cabGeo, windowMat);
            cab.position.set(0, 1.3, -0.2);
            carGroup.add(cab);
        }

        // 4 Wheels
        const wheelPositions = [
            { x: -1.05, z: 1.3 },
            { x: 1.05, z: 1.3 },
            { x: -1.05, z: -1.3 },
            { x: 1.05, z: -1.3 }
        ];

        wheelPositions.forEach(wp => {
            const wheelGroup = new THREE.Group();
            wheelGroup.position.set(wp.x, 0.38, wp.z);

            const tireGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.25, 16);
            tireGeo.rotateZ(Math.PI / 2);
            const tire = new THREE.Mesh(tireGeo, tireMat);
            wheelGroup.add(tire);

            const hubGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.26, 12);
            hubGeo.rotateZ(Math.PI / 2);
            const hub = new THREE.Mesh(hubGeo, wheelHubMat);
            wheelGroup.add(hub);

            carGroup.add(wheelGroup);
        });

        // Headlights (Warm White Glow)
        const hlMat = new THREE.MeshBasicMaterial({ color: 0xfff0c0 });
        const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.05), hlMat);
        hlL.position.set(-0.7, 0.75, 2.2);
        carGroup.add(hlL);

        const hlR = hlL.clone();
        hlR.position.x = 0.7;
        carGroup.add(hlR);

        // Chrome Bumpers
        const bumpF = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.18, 0.15), bumperMat);
        bumpF.position.set(0, 0.5, 2.25);
        carGroup.add(bumpF);

        const bumpB = bumpF.clone();
        bumpB.position.z = -2.25;
        carGroup.add(bumpB);

        this.scene.add(carGroup);
    }

    buildOverheadPennants() {
        // String triangle festival / street bunting banners across the street (Image 4!)
        const buntingZ = [12, -12];
        const colors = [0xff3333, 0xffffff, 0x3366ff, 0xffbb00];

        buntingZ.forEach(z => {
            // Connecting Catenary Cable
            const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, 28, 6);
            wireGeo.rotateZ(Math.PI / 2);
            const wire = new THREE.Mesh(wireGeo, new THREE.MeshBasicMaterial({ color: 0x333333 }));
            wire.position.set(0, 6.8, z);
            this.scene.add(wire);

            // Hanging Triangle Buntings
            for (let x = -13; x <= 13; x += 1.3) {
                const c = colors[Math.abs(Math.floor(x * 3)) % colors.length];
                const triGeo = new THREE.ConeGeometry(0.35, 0.7, 3);
                triGeo.rotateZ(Math.PI); // Point downwards
                const flag = new THREE.Mesh(triGeo, new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }));
                flag.position.set(x, 6.4, z);
                this.scene.add(flag);
            }
        });
    }

    buildSidewalkTreesAndProps() {
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3e271a, roughness: 0.9 });
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x2e4a28, roughness: 0.8 });
        const autumnMat = new THREE.MeshStandardMaterial({ color: 0xa85522, roughness: 0.8 });

        // Sidewalk Trees (Images 1 & 4!)
        const treeLocations = [
            { x: -12, z: -18, autumn: true },
            { x: 12, z: -18, autumn: false },
            { x: -12, z: 18, autumn: false },
            { x: 12, z: 18, autumn: true }
        ];

        treeLocations.forEach(tl => {
            const treeGroup = new THREE.Group();
            treeGroup.position.set(tl.x, 0, tl.z);

            // Trunk
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 5, 8), trunkMat);
            trunk.position.y = 2.5;
            trunk.castShadow = true;
            treeGroup.add(trunk);

            // Leafy Canopy
            const canopyMat = tl.autumn ? autumnMat : leafMat;
            const canopy1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8, 1), canopyMat);
            canopy1.position.y = 5.2;
            canopy1.castShadow = true;
            treeGroup.add(canopy1);

            const canopy2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4, 1), canopyMat);
            canopy2.position.set(0.4, 6.2, 0.2);
            treeGroup.add(canopy2);

            this.scene.add(treeGroup);
        });

        // Sidewalk Benches
        const benchMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, metalness: 0.8 });
        const benchNW = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 0.7), benchMat);
        benchNW.position.set(-13, 0.45, -10);
        this.scene.add(benchNW);

        // Fire Hydrants (Red with silver caps - Image 4)
        const hydMat = new THREE.MeshStandardMaterial({ color: 0xd92626 });
        const hyd1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.75, 8), hydMat);
        hyd1.position.set(-11.5, 0.45, -9);
        this.scene.add(hyd1);

        const hyd2 = hyd1.clone();
        hyd2.position.set(11.5, 0.45, 9);
        this.scene.add(hyd2);
    }

    buildStreetLamps() {
        const lampMat = new THREE.MeshStandardMaterial({ color: 0x1a261c, roughness: 0.4, metalness: 0.8 });

        const lampPositions = [
            { x: -11.5, z: -11.5 },
            { x: 11.5, z: -11.5 },
            { x: -11.5, z: 11.5 },
            { x: 11.5, z: 11.5 }
        ];

        lampPositions.forEach(p => {
            const lamp = new THREE.Group();
            lamp.position.set(p.x, 0, p.z);

            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 6.8, 8), lampMat);
            post.position.y = 3.4;
            post.castShadow = true;
            lamp.add(post);

            // Curved neck arm
            const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 1.4), lampMat);
            arm.position.set(p.x < 0 ? 0.6 : -0.6, 6.7, 0);
            lamp.add(arm);

            // Fixture & Bulb
            const fixture = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.2, 0.45), lampMat);
            fixture.position.set(p.x < 0 ? 1.2 : -1.2, 6.6, 0);
            lamp.add(fixture);

            const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffeaad }));
            bulb.position.copy(fixture.position);
            bulb.position.y -= 0.12;
            lamp.add(bulb);

            // Warm Spot Light casting soft shadows onto road
            const spot = new THREE.SpotLight(0xffeaad, 2.2, 22, Math.PI / 3.2, 0.6, 1.2);
            spot.position.copy(bulb.position);
            spot.target.position.set(p.x < 0 ? p.x + 2.5 : p.x - 2.5, 0, p.z);
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

        // Realistic town locations for the 6 stations:
        const stationPlacements = {
            'station-web': {
                title: "Ron's Coffee Cafe Table",
                pos: { x: -13.5, z: -13.5 },
                color: 0x00f0ff,
                meshCreator: () => {
                    // Cafe Table + Elliot's Thinkpad
                    const g = new THREE.Group();
                    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.8, 16), new THREE.MeshStandardMaterial({ color: 0x222222 }));
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
                pos: { x: 13.5, z: -13.5 },
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
                title: "Street Telecom Box",
                pos: { x: -13.5, z: 13.5 },
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
                pos: { x: 12.0, z: -7.5 },
                color: 0xff007f,
                meshCreator: () => {
                    // Mobile Data Terminal (MDT) inside Police car
                    const g = new THREE.Group();
                    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.04), new THREE.MeshStandardMaterial({ color: 0xff007f, emissive: 0xff007f, emissiveIntensity: 0.9 }));
                    screen.position.set(0, 1.5, 0.3);
                    g.add(screen);
                    return { root: g, holo: screen };
                }
            },
            'station-rev': {
                title: "Patty's Pub Alley Arcade",
                pos: { x: 13.5, z: 13.5 },
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
                pos: { x: 25.0, z: -25.0 },
                color: 0xb026ff,
                isBoss: true,
                meshCreator: () => {
                    const g = new THREE.Group();
                    const frame = new THREE.Mesh(new THREE.BoxGeometry(7, 8, 1.5), new THREE.MeshStandardMaterial({ color: 0x1e222d, metalness: 0.9 }));
                    frame.position.y = 4;
                    g.add(frame);

                    const door = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 0.8, 32), new THREE.MeshStandardMaterial({ color: 0x2e3544, metalness: 0.9 }));
                    door.rotateX(Math.PI / 2);
                    door.position.set(0, 4, 0.6);
                    g.add(door);

                    const wheel = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.1, 12, 24), new THREE.MeshStandardMaterial({ color: 0xd0d5dd, metalness: 0.9 }));
                    wheel.position.set(0, 4, 1.1);
                    g.add(wheel);

                    return { root: g, holo: wheel };
                }
            }
        };

        challenges.forEach(ch => {
            const config = stationPlacements[ch.id];
            if (!config) return;

            // Overwrite positions with town placements
            ch.pos = config.pos;

            const { root, holo } = config.meshCreator();
            root.position.set(config.pos.x, 0, config.pos.z);

            // Proximity ground glowing ring
            const ringGeo = new THREE.RingGeometry(2.2, 2.5, 32);
            ringGeo.rotateX(-Math.PI / 2);
            const ringMat = new THREE.MeshBasicMaterial({
                color: config.color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.6
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.y = 0.03;
            root.add(ring);

            // Point light
            const pLight = new THREE.PointLight(config.color, 1.2, 8);
            pLight.position.set(0, 1.6, 0.5);
            root.add(pLight);

            this.scene.add(root);

            this.terminals.push({
                id: ch.id,
                challenge: ch,
                pos: config.pos,
                holo: holo,
                ring: ring,
                radius: 3.5,
                isBoss: config.isBoss || false
            });
        });
    }

    update(delta, playerPos, totalScore) {
        const time = performance.now() * 0.001;

        // Flash Police Cruiser Emergency Beacons (Red & Blue flashing!)
        if (this.policeLight) {
            const isRed = Math.floor(time * 6) % 2 === 0;
            this.policeLight.color.setHex(isRed ? 0xff0022 : 0x0066ff);
        }

        // Animate screens
        this.terminals.forEach(t => {
            if (t.holo && t.holo.material && t.holo.material.emissiveIntensity) {
                t.holo.material.emissiveIntensity = 0.85 + Math.sin(time * 8) * 0.08;
            }
        });
    }
}

window.CyberBunkerWorld = CyberBunkerWorld;
