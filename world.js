// Mr. Robot Cinematic NYC Urban Hacker Environment & Hardware Stations

class CyberBunkerWorld {
    constructor(scene) {
        this.scene = scene;
        this.terminals = [];
        this.animatedObjects = [];
        this.steamParticles = null;
        this.laserBarriers = [];

        this.initAtmosphere();
        this.buildWetAsphaltStreet();
        this.buildBrownstoneBuildings();
        this.buildTimesSquareBillboards();
        this.buildStreetLamps();
        this.buildRealisticWorkstations();
        this.buildECorpVaultGate();
        this.buildSewerSteam();
    }

    initAtmosphere() {
        // Moody NYC Night Fog (Deep navy/charcoal)
        this.scene.fog = new THREE.FogExp2(0x0a0e16, 0.022);

        // Cold Moonlit Ambient Light
        const ambientLight = new THREE.AmbientLight(0x1a2638, 1.4);
        this.scene.add(ambientLight);

        // Soft Moon Directional Light
        const moonLight = new THREE.DirectionalLight(0x7391b4, 1.2);
        moonLight.position.set(-15, 35, -20);
        moonLight.castShadow = true;
        moonLight.shadow.mapSize.width = 2048;
        moonLight.shadow.mapSize.height = 2048;
        moonLight.shadow.camera.near = 0.5;
        moonLight.shadow.camera.far = 80;
        moonLight.shadow.camera.left = -30;
        moonLight.shadow.camera.right = 30;
        moonLight.shadow.camera.top = 30;
        moonLight.shadow.camera.bottom = -30;
        moonLight.shadow.bias = -0.0005;
        this.scene.add(moonLight);
    }

    buildWetAsphaltStreet() {
        // High-resolution procedural wet asphalt canvas texture
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Dark wet asphalt base
        ctx.fillStyle = '#12141a';
        ctx.fillRect(0, 0, 1024, 1024);

        // Asphalt surface grain noise
        for (let i = 0; i < 30000; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 1024;
            const brightness = 15 + Math.random() * 20;
            ctx.fillStyle = `rgb(${brightness}, ${brightness + 2}, ${brightness + 4})`;
            ctx.fillRect(x, y, 2, 2);
        }

        // Wet puddles with dark reflective sheen
        const puddleGradients = [
            { x: 300, y: 400, r: 120 },
            { x: 700, y: 250, r: 160 },
            { x: 512, y: 750, r: 140 },
            { x: 200, y: 850, r: 100 }
        ];

        puddleGradients.forEach(p => {
            const rad = ctx.createRadialGradient(p.x, p.y, 10, p.x, p.y, p.r);
            rad.addColorStop(0, 'rgba(8, 10, 14, 0.95)');
            rad.addColorStop(0.7, 'rgba(14, 18, 26, 0.8)');
            rad.addColorStop(1, 'rgba(18, 20, 26, 0)');
            ctx.fillStyle = rad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });

        // Double Yellow Center Lines
        ctx.fillStyle = '#cf9d22';
        ctx.fillRect(504, 0, 6, 1024);
        ctx.fillRect(514, 0, 6, 1024);

        // Weathered White Pedestrian Crosswalk Stripes
        ctx.fillStyle = 'rgba(190, 195, 205, 0.85)';
        for (let y = 100; y <= 350; y += 40) {
            ctx.fillRect(200, y, 624, 20);
        }

        // Cast-Iron NYC Manhole Covers
        const drawManhole = (cx, cy) => {
            ctx.fillStyle = '#22252c';
            ctx.beginPath();
            ctx.arc(cx, cy, 32, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#383d47';
            ctx.lineWidth = 4;
            ctx.stroke();

            // Inner rings
            ctx.beginPath();
            ctx.arc(cx, cy, 20, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = '#656d7c';
            ctx.font = 'bold 8px monospace';
            ctx.fillText("NYC SEWER", cx - 22, cy + 3);
        };

        drawManhole(420, 580);
        drawManhole(600, 200);

        const roadTex = new THREE.CanvasTexture(canvas);
        roadTex.wrapS = THREE.RepeatWrapping;
        roadTex.wrapT = THREE.RepeatWrapping;
        roadTex.repeat.set(1, 1);

        const roadGeo = new THREE.PlaneGeometry(60, 70);
        const roadMat = new THREE.MeshStandardMaterial({
            map: roadTex,
            roughness: 0.35, // Low roughness creates wet puddle sheen!
            metalness: 0.4
        });

        const road = new THREE.Mesh(roadGeo, roadMat);
        road.rotation.x = -Math.PI / 2;
        road.position.set(0, 0, 0);
        road.receiveShadow = true;
        this.scene.add(road);

        // Raised Concrete Sidewalks (West & East sides)
        const curbMat = new THREE.MeshStandardMaterial({
            color: 0x3a3f4a,
            roughness: 0.8,
            metalness: 0.1
        });

        const curbGeo = new THREE.BoxGeometry(10, 0.25, 70);

        // West Sidewalk
        const westWalk = new THREE.Mesh(curbGeo, curbMat);
        westWalk.position.set(-25, 0.125, 0);
        westWalk.receiveShadow = true;
        this.scene.add(westWalk);

        // East Sidewalk
        const eastWalk = new THREE.Mesh(curbGeo, curbMat);
        eastWalk.position.set(25, 0.125, 0);
        eastWalk.receiveShadow = true;
        this.scene.add(eastWalk);
    }

    buildBrownstoneBuildings() {
        // Red / Weathered NYC Brick Canvas Texture
        const brickCanvas = document.createElement('canvas');
        brickCanvas.width = 512;
        brickCanvas.height = 512;
        const bCtx = brickCanvas.getContext('2d');
        bCtx.fillStyle = '#4a251b'; // Dark brownstone brick
        bCtx.fillRect(0, 0, 512, 512);

        // Brick pattern
        bCtx.strokeStyle = '#2b1510';
        bCtx.lineWidth = 2;
        const bh = 16;
        const bw = 32;
        for (let y = 0; y < 512; y += bh) {
            const offset = (y / bh) % 2 === 0 ? 0 : bw / 2;
            for (let x = -bw; x < 512; x += bw) {
                bCtx.strokeRect(x + offset, y, bw, bh);
            }
        }

        const brickTex = new THREE.CanvasTexture(brickCanvas);
        brickTex.wrapS = THREE.RepeatWrapping;
        brickTex.wrapT = THREE.RepeatWrapping;
        brickTex.repeat.set(4, 6);

        const buildingMat = new THREE.MeshStandardMaterial({
            map: brickTex,
            roughness: 0.85,
            metalness: 0.1
        });

        const metalMat = new THREE.MeshStandardMaterial({
            color: 0x1f232b,
            roughness: 0.4,
            metalness: 0.8
        });

        const warmWindowMat = new THREE.MeshStandardMaterial({
            color: 0xffb74d,
            emissive: 0xffb74d,
            emissiveIntensity: 0.8,
            roughness: 0.2
        });

        const darkWindowMat = new THREE.MeshStandardMaterial({
            color: 0x111620,
            roughness: 0.1,
            metalness: 0.9
        });

        // Generate building blocks on West & East street perimeters
        const buildingConfigs = [
            // West side buildings
            { x: -31, z: -20, w: 12, h: 22, d: 25 },
            { x: -31, z: 12, w: 12, h: 26, d: 30 },
            // East side buildings
            { x: 31, z: -20, w: 12, h: 25, d: 25 },
            { x: 31, z: 12, w: 12, h: 21, d: 30 },
            // North End Street Wall (Alley end)
            { x: 0, z: -35, w: 62, h: 24, d: 8 }
        ];

        buildingConfigs.forEach(b => {
            const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
            const mesh = new THREE.Mesh(geo, buildingMat);
            mesh.position.set(b.x, b.h / 2, b.z);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);

            // Add windows to facades
            const isWest = b.x < 0;
            const faceX = isWest ? b.x + b.w / 2 + 0.05 : b.x - b.w / 2 - 0.05;

            if (b.x !== 0) { // Side buildings facing street
                for (let floor = 1; floor < 5; floor++) {
                    for (let col = -3; col <= 3; col += 2) {
                        const winGeo = new THREE.BoxGeometry(0.1, 1.6, 1.2);
                        const isLit = (col + floor) % 3 === 0;
                        const win = new THREE.Mesh(winGeo, isLit ? warmWindowMat : darkWindowMat);
                        win.position.set(faceX, floor * 4.5, b.z + col * 3.5);
                        this.scene.add(win);
                    }
                }

                // NYC Fire Escape Staircase (Exterior Iron Balconies)
                for (let floor = 1; floor < 4; floor++) {
                    const balconyGeo = new THREE.BoxGeometry(1.4, 0.15, 3.5);
                    const balcony = new THREE.Mesh(balconyGeo, metalMat);
                    balcony.position.set(isWest ? faceX + 0.7 : faceX - 0.7, floor * 4.5 - 0.8, b.z);
                    balcony.castShadow = true;
                    this.scene.add(balcony);

                    // Iron Railings
                    const railGeo = new THREE.BoxGeometry(1.4, 0.8, 0.08);
                    const rail = new THREE.Mesh(railGeo, metalMat);
                    rail.position.set(balcony.position.x, balcony.position.y + 0.45, balcony.position.z + 1.7);
                    this.scene.add(rail);

                    // Connecting Fire escape ladder
                    const ladderGeo = new THREE.CylinderGeometry(0.03, 0.03, 4.2, 6);
                    const ladder = new THREE.Mesh(ladderGeo, metalMat);
                    ladder.position.set(balcony.position.x, balcony.position.y + 2.1, balcony.position.z + 1.2);
                    this.scene.add(ladder);
                }
            }
        });
    }

    buildTimesSquareBillboards() {
        // 1. Giant E-Corp Corporate Billboard (Slanted 'E' Logo)
        const eCorpCanvas = document.createElement('canvas');
        eCorpCanvas.width = 512;
        eCorpCanvas.height = 256;
        const eCtx = eCorpCanvas.getContext('2d');

        eCtx.fillStyle = '#080c14';
        eCtx.fillRect(0, 0, 512, 256);

        // Corporate Grid
        eCtx.strokeStyle = 'rgba(0, 180, 255, 0.2)';
        eCtx.lineWidth = 1;
        for (let i = 0; i < 512; i += 32) {
            eCtx.beginPath(); eCtx.moveTo(i, 0); eCtx.lineTo(i, 256); eCtx.stroke();
        }

        // Slanted 'E' Logo (Iconic Mr. Robot E-Corp logo)
        eCtx.save();
        eCtx.translate(90, 128);
        eCtx.fillStyle = '#e63946';
        eCtx.fillRect(-50, -50, 22, 100);
        eCtx.fillRect(-50, -50, 75, 22);
        eCtx.fillRect(-50, -10, 55, 20);
        eCtx.fillRect(-50, 28, 75, 22);
        // Slanted top angle
        eCtx.fillStyle = '#e63946';
        eCtx.beginPath();
        eCtx.moveTo(25, -50);
        eCtx.lineTo(45, -30);
        eCtx.lineTo(25, -10);
        eCtx.fill();
        eCtx.restore();

        // Billboard Text
        eCtx.fillStyle = '#ffffff';
        eCtx.font = 'bold 36px Arial';
        eCtx.fillText("E CORP", 180, 110);
        eCtx.fillStyle = '#00f0ff';
        eCtx.font = 'bold 16px monospace';
        eCtx.fillText("POWER TO THE PEOPLE", 180, 140);
        eCtx.fillStyle = '#94a3b8';
        eCtx.font = '13px monospace';
        eCtx.fillText("ALL FINANCIAL ASSETS SECURED", 180, 168);

        const eCorpTex = new THREE.CanvasTexture(eCorpCanvas);
        const eCorpMat = new THREE.MeshBasicMaterial({ map: eCorpTex });

        const bbGeo = new THREE.BoxGeometry(16, 8, 0.5);
        const bbMesh = new THREE.Mesh(bbGeo, eCorpMat);
        bbMesh.position.set(-24.5, 17, -8);
        bbMesh.rotation.y = Math.PI / 2;
        this.scene.add(bbMesh);

        // Billboard light projection
        const bbLight = new THREE.PointLight(0x00d4ff, 1.8, 25);
        bbLight.position.set(-20, 17, -8);
        this.scene.add(bbLight);

        // 2. Glitching FSOCIETY Billboard ("OUR DEMOCRACY HAS BEEN HACKED")
        const fsoCanvas = document.createElement('canvas');
        fsoCanvas.width = 512;
        fsoCanvas.height = 256;
        const fCtx = fsoCanvas.getContext('2d');

        fCtx.fillStyle = '#0b0b0e';
        fCtx.fillRect(0, 0, 512, 256);

        // Red Alert Banner
        fCtx.fillStyle = '#ff1133';
        fCtx.fillRect(0, 0, 512, 45);
        fCtx.fillStyle = '#ffffff';
        fCtx.font = 'bold 22px monospace';
        fCtx.fillText("[!] FSOCIETY INFILTRATION BROADCAST", 20, 32);

        // Smiling Mask silhouette
        fCtx.fillStyle = '#ffffff';
        fCtx.beginPath();
        fCtx.ellipse(90, 150, 48, 60, 0, 0, Math.PI * 2);
        fCtx.fill();

        // Top Hat
        fCtx.fillStyle = '#111111';
        fCtx.fillRect(55, 80, 70, 35);
        fCtx.fillRect(40, 110, 100, 8);

        // Mask Eyes & Grin
        fCtx.fillStyle = '#000000';
        fCtx.beginPath(); fCtx.arc(75, 140, 8, 0, Math.PI * 2); fCtx.fill();
        fCtx.beginPath(); fCtx.arc(105, 140, 8, 0, Math.PI * 2); fCtx.fill();
        fCtx.beginPath();
        fCtx.arc(90, 165, 24, 0.2, Math.PI - 0.2);
        fCtx.lineWidth = 4;
        fCtx.stroke();

        // Slogan
        fCtx.fillStyle = '#00ff66';
        fCtx.font = 'bold 24px monospace';
        fCtx.fillText("HELLO, FRIEND.", 170, 115);
        fCtx.fillStyle = '#ff3344';
        fCtx.font = 'bold 18px monospace';
        fCtx.fillText("OUR DEMOCRACY HAS BEEN HACKED.", 170, 150);
        fCtx.fillStyle = '#cbd5e1';
        fCtx.font = '14px monospace';
        fCtx.fillText("ARE YOU A 1 OR A 0?", 170, 185);

        const fsoTex = new THREE.CanvasTexture(fsoCanvas);
        const fsoMat = new THREE.MeshBasicMaterial({ map: fsoTex });

        const fsoMesh = new THREE.Mesh(bbGeo, fsoMat);
        fsoMesh.position.set(24.5, 17, -8);
        fsoMesh.rotation.y = -Math.PI / 2;
        this.scene.add(fsoMesh);

        const fsoLight = new THREE.PointLight(0x00ff66, 1.8, 25);
        fsoLight.position.set(20, 17, -8);
        this.scene.add(fsoLight);
    }

    buildStreetLamps() {
        const lampMat = new THREE.MeshStandardMaterial({
            color: 0x1f2e22, // Dark green NYC iron street lamp post
            roughness: 0.4,
            metalness: 0.8
        });

        const lampPositions = [
            { x: -18, z: -15 },
            { x: -18, z: 12 },
            { x: 18, z: -15 },
            { x: 18, z: 12 }
        ];

        lampPositions.forEach(pos => {
            const lampGroup = new THREE.Group();
            lampGroup.position.set(pos.x, 0, pos.z);

            // Base post
            const post = new THREE.Mesh(
                new THREE.CylinderGeometry(0.18, 0.24, 6.5, 8),
                lampMat
            );
            post.position.y = 3.25;
            post.castShadow = true;
            lampGroup.add(post);

            // Curved Neck Arm
            const arm = new THREE.Mesh(
                new THREE.BoxGeometry(0.12, 0.12, 1.6),
                lampMat
            );
            arm.position.set(pos.x < 0 ? 0.7 : -0.7, 6.4, 0);
            lampGroup.add(arm);

            // Lantern Fixture
            const fixture = new THREE.Mesh(
                new THREE.BoxGeometry(0.5, 0.25, 0.5),
                lampMat
            );
            fixture.position.set(pos.x < 0 ? 1.4 : -1.4, 6.3, 0);
            lampGroup.add(fixture);

            // Glowing Bulb
            const bulb = new THREE.Mesh(
                new THREE.SphereGeometry(0.18, 8, 8),
                new THREE.MeshBasicMaterial({ color: 0xffe6a8 })
            );
            bulb.position.copy(fixture.position);
            bulb.position.y -= 0.15;
            lampGroup.add(bulb);

            // Warm Sodium Vapor Spotlight projecting onto wet road with realistic shadows!
            const spot = new THREE.SpotLight(0xffe6a8, 2.5, 24, Math.PI / 3.5, 0.6, 1.2);
            spot.position.copy(bulb.position);
            spot.position.y += 0.5;
            spot.target.position.set(pos.x < 0 ? pos.x + 3 : pos.x - 3, 0, pos.z);
            spot.castShadow = true;
            spot.shadow.mapSize.width = 1024;
            spot.shadow.mapSize.height = 1024;
            spot.shadow.bias = -0.001;

            this.scene.add(spot);
            this.scene.add(spot.target);
            this.scene.add(lampGroup);
        });
    }

    buildRealisticWorkstations() {
        const challenges = window.CHALLENGES_DATA || [];

        challenges.forEach(ch => {
            if (ch.id === 'station-boss') return; // Boss is E-Corp Vault

            const group = new THREE.Group();
            group.position.set(ch.pos.x, 0, ch.pos.z);

            let mainHardware;

            if (ch.id === 'station-web') {
                // STATION 1: Elliot's Thinkpad Laptop on a Weathered Wooden Crate
                const crateMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 });
                const crate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 1.2), crateMat);
                crate.position.y = 0.5;
                crate.castShadow = true;
                group.add(crate);

                // Laptop Base (Thinkpad)
                const laptopMat = new THREE.MeshStandardMaterial({ color: 0x181a1f, roughness: 0.4, metalness: 0.6 });
                const lapBase = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.5), laptopMat);
                lapBase.position.set(0, 1.02, 0);
                lapBase.castShadow = true;
                group.add(lapBase);

                // Opened Screen with glowing Kali Linux terminal
                const lapScreen = new THREE.Mesh(
                    new THREE.BoxGeometry(0.7, 0.48, 0.03),
                    new THREE.MeshStandardMaterial({
                        color: 0x00f0ff,
                        emissive: 0x00f0ff,
                        emissiveIntensity: 0.9
                    })
                );
                lapScreen.position.set(0, 1.26, -0.22);
                lapScreen.rotation.x = -0.25;
                group.add(lapScreen);
                mainHardware = lapScreen;

            } else if (ch.id === 'station-crypto') {
                // STATION 2: E-Corp Financial ATM / Street Kiosk
                const atmMat = new THREE.MeshStandardMaterial({ color: 0x222630, roughness: 0.3, metalness: 0.8 });
                const atm = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.8, 1.0), atmMat);
                atm.position.y = 1.4;
                atm.castShadow = true;
                group.add(atm);

                // ATM Screen
                const atmScreen = new THREE.Mesh(
                    new THREE.BoxGeometry(0.8, 0.6, 0.05),
                    new THREE.MeshStandardMaterial({
                        color: 0xffb703,
                        emissive: 0xffb703,
                        emissiveIntensity: 0.8
                    })
                );
                atmScreen.position.set(0, 1.75, 0.52);
                group.add(atmScreen);
                mainHardware = atmScreen;

            } else if (ch.id === 'station-linux') {
                // STATION 3: Open Street Telecom / Fiber Junction Utility Box
                const boxMat = new THREE.MeshStandardMaterial({ color: 0x243b2c, roughness: 0.5, metalness: 0.6 });
                const box = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.8), boxMat);
                box.position.y = 1.1;
                box.castShadow = true;
                group.add(box);

                // Open Ajar Door
                const door = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.1, 0.75), boxMat);
                door.position.set(0.65, 1.1, 0.3);
                door.rotation.y = 0.8;
                group.add(door);

                // Patch panel inside with green terminal screen
                const panel = new THREE.Mesh(
                    new THREE.BoxGeometry(0.9, 0.8, 0.05),
                    new THREE.MeshStandardMaterial({
                        color: 0x00ff66,
                        emissive: 0x00ff66,
                        emissiveIntensity: 0.9
                    })
                );
                panel.position.set(0, 1.3, 0.32);
                group.add(panel);
                mainHardware = panel;

            } else if (ch.id === 'station-forensics') {
                // STATION 4: Allsafe Server Blade Rack (Street bay)
                const rackMat = new THREE.MeshStandardMaterial({ color: 0x14161c, roughness: 0.3, metalness: 0.9 });
                const rack = new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.2, 1.2), rackMat);
                rack.position.y = 1.6;
                rack.castShadow = true;
                group.add(rack);

                // Glowing server blades with pink forensic readout
                const blades = new THREE.Mesh(
                    new THREE.BoxGeometry(1.1, 2.4, 0.05),
                    new THREE.MeshStandardMaterial({
                        color: 0xff007f,
                        emissive: 0xff007f,
                        emissiveIntensity: 0.85
                    })
                );
                blades.position.set(0, 1.6, 0.62);
                group.add(blades);
                mainHardware = blades;

            } else {
                // STATION 5: fsociety Secret Arcade Terminal
                const cabMat = new THREE.MeshStandardMaterial({ color: 0x1c1a24, roughness: 0.5 });
                const arcade = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.8, 1.2), cabMat);
                arcade.position.y = 1.4;
                arcade.castShadow = true;
                group.add(arcade);

                // CRT Monitor
                const crt = new THREE.Mesh(
                    new THREE.BoxGeometry(0.9, 0.7, 0.08),
                    new THREE.MeshStandardMaterial({
                        color: 0xff3333,
                        emissive: 0xff3333,
                        emissiveIntensity: 0.9
                    })
                );
                crt.position.set(0, 1.8, 0.45);
                group.add(crt);
                mainHardware = crt;
            }

            // Realistic Yellow/Black Hazard Ground Markings
            const markGeo = new THREE.RingGeometry(2.4, 2.7, 32);
            markGeo.rotateX(-Math.PI / 2);
            const markMat = new THREE.MeshBasicMaterial({
                color: ch.threeColor,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.6
            });
            const groundMarker = new THREE.Mesh(markGeo, markMat);
            groundMarker.position.y = 0.03;
            group.add(groundMarker);

            // Subtle Hardware Point Light
            const pLight = new THREE.PointLight(ch.threeColor, 1.4, 7);
            pLight.position.set(0, 1.8, 0.8);
            group.add(pLight);

            this.scene.add(group);

            this.terminals.push({
                id: ch.id,
                challenge: ch,
                pos: ch.pos,
                holo: mainHardware,
                ring: groundMarker,
                light: pLight,
                radius: 3.5
            });

            this.animatedObjects.push({
                obj: mainHardware,
                type: 'screen_flicker',
                baseIntensity: 0.85
            });
        });
    }

    buildECorpVaultGate() {
        const bossGroup = new THREE.Group();
        bossGroup.position.set(0, 0, -28);

        const steelMat = new THREE.MeshStandardMaterial({
            color: 0x1e2430,
            roughness: 0.35,
            metalness: 0.9
        });

        // Massive Reinforced Vault Portal Frame
        const frameGeo = new THREE.BoxGeometry(14, 10, 2.5);
        const frame = new THREE.Mesh(frameGeo, steelMat);
        frame.position.y = 5;
        bossGroup.add(frame);

        // Circular Steel Vault Door
        const doorGeo = new THREE.CylinderGeometry(3.5, 3.5, 1.2, 32);
        doorGeo.rotateX(Math.PI / 2);
        const door = new THREE.Mesh(doorGeo, steelMat);
        door.position.set(0, 5, 0.8);
        door.castShadow = true;
        bossGroup.add(door);

        // Rotating Vault Wheel Handle
        const wheelGeo = new THREE.TorusGeometry(1.2, 0.12, 12, 24);
        const wheel = new THREE.Mesh(wheelGeo, new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }));
        wheel.position.set(0, 5, 1.5);
        bossGroup.add(wheel);

        // Vault Lock Status Beacon
        const beaconGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.set(0, 9.2, 1.2);
        bossGroup.add(beacon);

        // Security Laser Beams blocking the Vault
        const laserMat = new THREE.MeshBasicMaterial({ color: 0xff0033, transparent: true, opacity: 0.85 });
        for (let x = -3.5; x <= 3.5; x += 1.2) {
            const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 8, 8), laserMat);
            beam.position.set(x, 5, 1.5);
            bossGroup.add(beam);
            this.laserBarriers.push(beam);
        }

        // Vault Ground Warning Ring
        const ringGeo = new THREE.RingGeometry(4.5, 5.0, 32);
        ringGeo.rotateX(-Math.PI / 2);
        const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xff0033, side: THREE.DoubleSide, opacity: 0.7, transparent: true }));
        ring.position.y = 0.04;
        bossGroup.add(ring);

        this.scene.add(bossGroup);

        this.terminals.push({
            id: 'station-boss',
            challenge: (window.CHALLENGES_DATA || []).find(c => c.id === 'station-boss') || { title: "Station 06: E-Corp Master Vault", points: 500 },
            pos: { x: 0, z: -28 },
            holo: wheel,
            ring: ring,
            radius: 6.0,
            isBoss: true
        });

        this.animatedObjects.push({
            obj: wheel,
            type: 'rotate_wheel'
        });
    }

    buildSewerSteam() {
        // Steam particle emitters rising from NYC manholes
        const particleCount = 120;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        const manholes = [
            { x: -5, z: 4 },
            { x: 6, z: -10 }
        ];

        for (let i = 0; i < particleCount; i++) {
            const m = manholes[i % manholes.length];
            positions[i * 3] = m.x + (Math.random() - 0.5) * 1.5;
            positions[i * 3 + 1] = Math.random() * 4.5;
            positions[i * 3 + 2] = m.z + (Math.random() - 0.5) * 1.5;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const mat = new THREE.PointsMaterial({
            color: 0xc8d6e5,
            size: 0.45,
            transparent: true,
            opacity: 0.28
        });

        this.steamParticles = new THREE.Points(geo, mat);
        this.scene.add(this.steamParticles);
    }

    update(delta, playerPos, totalScore) {
        const time = performance.now() * 0.001;

        // Animate screens & vault
        this.animatedObjects.forEach(item => {
            if (item.type === 'rotate_wheel') {
                item.obj.rotation.z += delta * 0.4;
            } else if (item.type === 'screen_flicker') {
                // Subtle realistic CRT / LCD scan flicker
                if (item.obj.material && item.obj.material.emissiveIntensity) {
                    item.obj.material.emissiveIntensity = item.baseIntensity + Math.sin(time * 12) * 0.08;
                }
            }
        });

        // Drift steam upward from sewer
        if (this.steamParticles) {
            const pos = this.steamParticles.geometry.attributes.position.array;
            for (let i = 1; i < pos.length; i += 3) {
                pos[i] += delta * 0.9;
                if (pos[i] > 5.0) pos[i] = 0.1; // Loop back to ground
            }
            this.steamParticles.geometry.attributes.position.needsUpdate = true;
        }

        // Deactivate E-Corp Vault lasers when score >= 500
        const isUnlocked = totalScore >= 500;
        this.laserBarriers.forEach(laser => {
            if (isUnlocked) {
                laser.material.color.setHex(0x00ff66);
                laser.scale.y = 0.05;
                laser.position.y = 0.5;
            } else {
                laser.material.color.setHex(0xff0033);
                laser.scale.y = 1.0;
                laser.position.y = 5;
            }
        });
    }
}

window.CyberBunkerWorld = CyberBunkerWorld;
