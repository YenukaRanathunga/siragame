// Cyber Leek Tactical Operative (Custom Character from Reference)

class CyberHackerAvatar {
    constructor(scene) {
        this.scene = scene;
        this.mesh = new THREE.Group();

        // Movement physics (Kilometer Scale)
        this.position = new THREE.Vector3(0, 0, 16);
        this.rotation = 0;
        this.velocity = new THREE.Vector3();
        this.isGrounded = true;
        this.walkSpeed = 9.0;
        this.runSpeed = 26.0; // High-speed tactical sprint for 1.2km metropolis
        this.jumpForce = 10.5;
        this.gravity = -22.0;

        // Input
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            sprint: false,
            jump: false
        };

        this.animTime = 0;
        this.isMoving = false;

        // Camera: Third Person (Cinematic Over-The-Shoulder) & First Person
        this.cameraMode = 'tpv';
        this.cameraAngle = {
            theta: Math.PI,
            phi: 0.28,
            distance: 5.2
        };

        this.buildCyberLeekModel();
        this.setupEventListeners();
        this.scene.add(this.mesh);
    }

    buildCyberLeekModel() {
        // Palette from the uploaded reference image:
        const leekSkinMat = new THREE.MeshStandardMaterial({
            color: 0xd8f5b5, // Pale scallion green
            roughness: 0.65,
            metalness: 0.05
        });

        const leekHairGreen = new THREE.MeshStandardMaterial({
            color: 0x3cb043, // Vibrant leaf green
            roughness: 0.55,
            metalness: 0.1
        });

        const leekHairDark = new THREE.MeshStandardMaterial({
            color: 0x247a2a, // Dark leaf green shadow
            roughness: 0.55
        });

        const leekStalkTipMat = new THREE.MeshStandardMaterial({
            color: 0x16501a, // Hollow stalk tip
            roughness: 0.6
        });

        const cobaltBlueMat = new THREE.MeshStandardMaterial({
            color: 0x1668f2, // High-tech cobalt blue tactical suit
            roughness: 0.5,
            metalness: 0.2
        });

        const navyArmorMat = new THREE.MeshStandardMaterial({
            color: 0x0a162e, // Deep navy ballistic chestplate
            roughness: 0.4,
            metalness: 0.6
        });

        const cyanGlowMat = new THREE.MeshStandardMaterial({
            color: 0x00e5ff,
            emissive: 0x00e5ff,
            emissiveIntensity: 0.9,
            roughness: 0.2
        });

        const darkBootMat = new THREE.MeshStandardMaterial({
            color: 0x070d18, // Armored combat boots
            roughness: 0.5,
            metalness: 0.5
        });

        const sunglassesMat = new THREE.MeshBasicMaterial({ color: 0x06080e });
        const shadesGlowMat = new THREE.MeshBasicMaterial({ color: 0x0099ff });

        // 1. Torso & Tactical Armor Suit
        this.torsoGroup = new THREE.Group();
        this.torsoGroup.position.y = 1.25;

        // Base Jacket / Under-suit (Cobalt Blue)
        const jacketGeo = new THREE.BoxGeometry(0.62, 0.78, 0.42);
        const jacket = new THREE.Mesh(jacketGeo, cobaltBlueMat);
        jacket.castShadow = true;
        this.torsoGroup.add(jacket);

        // High Upturned Sci-Fi Collar
        const collarGeo = new THREE.BoxGeometry(0.58, 0.35, 0.48);
        const collar = new THREE.Mesh(collarGeo, cobaltBlueMat);
        collar.position.set(0, 0.38, -0.02);
        collar.castShadow = true;
        this.torsoGroup.add(collar);

        // Heavy Navy Ballistic Chestplate
        const chestplateGeo = new THREE.BoxGeometry(0.56, 0.58, 0.16);
        const chestplate = new THREE.Mesh(chestplateGeo, navyArmorMat);
        chestplate.position.set(0, 0.04, 0.18);
        chestplate.castShadow = true;
        this.torsoGroup.add(chestplate);

        // Glowing Cyan Armor Seams & Reactor Accents
        const seamTop = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.04, 0.04), cyanGlowMat);
        seamTop.position.set(0, 0.22, 0.27);
        this.torsoGroup.add(seamTop);

        const seamBot = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.03, 0.04), cyanGlowMat);
        seamBot.position.set(0, -0.15, 0.27);
        this.torsoGroup.add(seamBot);

        // Tactical Utility Belt
        const beltGeo = new THREE.BoxGeometry(0.66, 0.14, 0.46);
        const belt = new THREE.Mesh(beltGeo, navyArmorMat);
        belt.position.y = -0.36;
        this.torsoGroup.add(belt);

        // Side Utility Pouches
        const pouchGeo = new THREE.BoxGeometry(0.12, 0.16, 0.18);
        const pouchL = new THREE.Mesh(pouchGeo, navyArmorMat);
        pouchL.position.set(-0.35, -0.34, 0.05);
        this.torsoGroup.add(pouchL);

        const pouchR = pouchL.clone();
        pouchR.position.x = 0.35;
        this.torsoGroup.add(pouchR);

        // 2. Scallion / Leek Head & Backward Sweeping Hair Stalks
        this.headGroup = new THREE.Group();
        this.headGroup.position.set(0, 1.9, 0);

        // Pale Green Scallion Head Base
        const headBaseGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.72, 16);
        const headBase = new THREE.Mesh(headBaseGeo, leekSkinMat);
        headBase.castShadow = true;
        this.headGroup.add(headBase);

        // Sweeping Leek Leaf Hair Stalks (Curving backward and up!)
        this.hairGroup = new THREE.Group();
        this.hairGroup.position.set(0, 0.25, 0);

        // Central Main Tall Leaf Stalk (Curved backward)
        const stalk1Geo = new THREE.CylinderGeometry(0.12, 0.18, 1.2, 12);
        stalk1Geo.rotateX(-0.48); // Curve backwards
        stalk1Geo.translate(0, 0.55, -0.28);
        const stalk1 = new THREE.Mesh(stalk1Geo, leekHairGreen);
        stalk1.castShadow = true;
        this.hairGroup.add(stalk1);

        // Leaf Tip extension
        const stalk1TipGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.65, 10);
        stalk1TipGeo.rotateX(-0.85); // Sharper curve back
        stalk1TipGeo.translate(0, 1.15, -0.68);
        const stalk1Tip = new THREE.Mesh(stalk1TipGeo, leekHairDark);
        stalk1Tip.castShadow = true;
        this.hairGroup.add(stalk1Tip);

        // Hollow tip ring
        const stalk1Cap = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.02, 10), leekStalkTipMat);
        stalk1Cap.position.set(0, 1.38, -0.92);
        stalk1Cap.rotation.x = -0.85;
        this.hairGroup.add(stalk1Cap);

        // Left Secondary Leaf Stalk
        const stalk2Geo = new THREE.CylinderGeometry(0.09, 0.14, 0.9, 10);
        stalk2Geo.rotateX(-0.45);
        stalk2Geo.rotateZ(0.25);
        stalk2Geo.translate(-0.12, 0.45, -0.22);
        const stalk2 = new THREE.Mesh(stalk2Geo, leekHairGreen);
        stalk2.castShadow = true;
        this.hairGroup.add(stalk2);

        // Right Secondary Leaf Stalk
        const stalk3Geo = new THREE.CylinderGeometry(0.09, 0.14, 0.9, 10);
        stalk3Geo.rotateX(-0.45);
        stalk3Geo.rotateZ(-0.25);
        stalk3Geo.translate(0.12, 0.45, -0.22);
        const stalk3 = new THREE.Mesh(stalk3Geo, leekHairGreen);
        stalk3.castShadow = true;
        this.hairGroup.add(stalk3);

        this.headGroup.add(this.hairGroup);

        // Pixelated Cyber Sunglasses (The iconic black cyber shades!)
        const shadesGroup = new THREE.Group();
        shadesGroup.position.set(0, 0.04, 0.25);

        // Left Lens
        const lensL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.10, 0.04), sunglassesMat);
        lensL.position.x = -0.11;
        shadesGroup.add(lensL);

        // Right Lens
        const lensR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.10, 0.04), sunglassesMat);
        lensR.position.x = 0.11;
        shadesGroup.add(lensR);

        // Bridge
        const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.03), sunglassesMat);
        shadesGroup.add(bridge);

        // Blue Cyber Lens Frame Rim
        const frameRim = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.02, 0.05), shadesGlowMat);
        frameRim.position.y = 0.055;
        shadesGroup.add(frameRim);

        this.headGroup.add(shadesGroup);

        // Cute Smug / Cat Mouth (:3)
        const mouthGeo = new THREE.BoxGeometry(0.12, 0.025, 0.02);
        const mouth = new THREE.Mesh(mouthGeo, new THREE.MeshBasicMaterial({ color: 0x247a2a }));
        mouth.position.set(0, -0.14, 0.25);
        this.headGroup.add(mouth);

        // 3. Arms (Cobalt Blue with Shoulder Armor & Pale Green Fists)
        const armGeo = new THREE.BoxGeometry(0.20, 0.70, 0.22);
        armGeo.translate(0, -0.30, 0); // Shoulder pivot

        // Left Arm
        this.leftArm = new THREE.Group();
        this.leftArm.position.set(-0.42, 1.55, 0);
        const lArmMesh = new THREE.Mesh(armGeo, cobaltBlueMat);
        lArmMesh.castShadow = true;
        this.leftArm.add(lArmMesh);

        // Shoulder Armor Cap
        const shoulderL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.26), navyArmorMat);
        shoulderL.position.set(-0.02, -0.05, 0);
        this.leftArm.add(shoulderL);

        // Cyan Wrist Bracer
        const bracerL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.10, 0.24), navyArmorMat);
        bracerL.position.set(0, -0.52, 0);
        this.leftArm.add(bracerL);

        // Pale Green Fist/Hand
        const handL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.16, 0.16), leekSkinMat);
        handL.position.set(0, -0.66, 0);
        this.leftArm.add(handL);

        // Right Arm
        this.rightArm = new THREE.Group();
        this.rightArm.position.set(0.42, 1.55, 0);
        const rArmMesh = new THREE.Mesh(armGeo, cobaltBlueMat);
        rArmMesh.castShadow = true;
        this.rightArm.add(rArmMesh);

        const shoulderR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.26), navyArmorMat);
        shoulderR.position.set(0.02, -0.05, 0);
        this.rightArm.add(shoulderR);

        const bracerR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.10, 0.24), navyArmorMat);
        bracerR.position.set(0, -0.52, 0);
        this.rightArm.add(bracerR);

        const handR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.16, 0.16), leekSkinMat);
        handR.position.set(0, -0.66, 0);
        this.rightArm.add(handR);

        // 4. Legs (Cobalt Blue Combat Pants, Navy Knee Guards & Combat Boots)
        const legGeo = new THREE.BoxGeometry(0.24, 0.82, 0.26);
        legGeo.translate(0, -0.38, 0); // Hip pivot

        // Left Leg
        this.leftLeg = new THREE.Group();
        this.leftLeg.position.set(-0.18, 0.82, 0);
        const lLegMesh = new THREE.Mesh(legGeo, cobaltBlueMat);
        lLegMesh.castShadow = true;
        this.leftLeg.add(lLegMesh);

        // Knee Armor Pad
        const kneeL = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.10), navyArmorMat);
        kneeL.position.set(0, -0.42, 0.14);
        this.leftLeg.add(kneeL);

        // Combat Boot
        const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.16, 0.40), darkBootMat);
        bootL.position.set(0, -0.76, 0.06);
        bootL.castShadow = true;
        this.leftLeg.add(bootL);

        // Right Leg
        this.rightLeg = new THREE.Group();
        this.rightLeg.position.set(0.18, 0.82, 0);
        const rLegMesh = new THREE.Mesh(legGeo, cobaltBlueMat);
        rLegMesh.castShadow = true;
        this.rightLeg.add(rLegMesh);

        const kneeR = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.10), navyArmorMat);
        kneeR.position.set(0, -0.42, 0.14);
        this.rightLeg.add(kneeR);

        const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.16, 0.40), darkBootMat);
        bootR.position.set(0, -0.76, 0.06);
        bootR.castShadow = true;
        this.rightLeg.add(bootR);

        // Assemble Character Root
        this.mesh.add(this.torsoGroup);
        this.mesh.add(this.headGroup);
        this.mesh.add(this.leftArm);
        this.mesh.add(this.rightArm);
        this.mesh.add(this.leftLeg);
        this.mesh.add(this.rightLeg);

        this.mesh.position.copy(this.position);
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            switch(e.code) {
                case 'KeyW':
                case 'ArrowUp':
                    this.keys.forward = true;
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    this.keys.backward = true;
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    this.keys.left = true;
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    this.keys.right = true;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    this.keys.sprint = true;
                    break;
                case 'Space':
                    if (this.isGrounded) {
                        this.velocity.y = this.jumpForce;
                        this.isGrounded = false;
                        if (window.sounds) window.sounds.playJump();
                    }
                    break;
                case 'KeyV':
                    this.cameraMode = (this.cameraMode === 'tpv') ? 'fpv' : 'tpv';
                    this.mesh.visible = (this.cameraMode === 'tpv');
                    if (window.sounds) window.sounds.playClick();
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            switch(e.code) {
                case 'KeyW':
                case 'ArrowUp':
                    this.keys.forward = false;
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    this.keys.backward = false;
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    this.keys.left = false;
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    this.keys.right = false;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    this.keys.sprint = false;
                    break;
            }
        });

        // Mouse Drag to Orbit Camera
        let isMouseDown = false;
        let lastMouseX = 0;
        let lastMouseY = 0;

        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            canvas.addEventListener('mousedown', (e) => {
                isMouseDown = true;
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
                if (window.sounds) window.sounds.startAmbient();
            });

            window.addEventListener('mouseup', () => {
                isMouseDown = false;
            });

            window.addEventListener('mousemove', (e) => {
                if (!isMouseDown) return;
                const deltaX = e.clientX - lastMouseX;
                const deltaY = e.clientY - lastMouseY;
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;

                this.cameraAngle.theta -= deltaX * 0.005;
                this.cameraAngle.phi += deltaY * 0.004;
                this.cameraAngle.phi = Math.max(0.05, Math.min(Math.PI / 2.3, this.cameraAngle.phi));
            });

            canvas.addEventListener('wheel', (e) => {
                this.cameraAngle.distance = Math.max(2.5, Math.min(10.0, this.cameraAngle.distance + e.deltaY * 0.005));
            });
        }
    }

    update(delta, camera) {
        const dt = Math.min(delta, 0.1);

        const moveDir = new THREE.Vector3();
        if (this.keys.forward) moveDir.z -= 1;
        if (this.keys.backward) moveDir.z += 1;
        if (this.keys.left) moveDir.x -= 1;
        if (this.keys.right) moveDir.x += 1;

        this.isMoving = moveDir.lengthSq() > 0;

        if (this.isMoving) {
            moveDir.normalize();

            const angle = this.cameraAngle.theta;
            const rotatedX = moveDir.x * Math.cos(angle) - moveDir.z * Math.sin(angle);
            const rotatedZ = moveDir.x * Math.sin(angle) + moveDir.z * Math.cos(angle);

            const speed = this.keys.sprint ? this.runSpeed : this.walkSpeed;
            this.position.x += rotatedX * speed * dt;
            this.position.z += rotatedZ * speed * dt;

            this.rotation = Math.atan2(rotatedX, rotatedZ);
            this.mesh.rotation.y = this.rotation;
        }

        // Apply Gravity & Ground
        this.velocity.y += this.gravity * dt;
        this.position.y += this.velocity.y * dt;

        if (this.position.y <= 0) {
            this.position.y = 0;
            this.velocity.y = 0;
            this.isGrounded = true;
        }

        // TRUE 1.2-KILOMETER METROPOLIS BOUNDS [-580, 580]
        const bound = 580;
        this.position.x = Math.max(-bound, Math.min(bound, this.position.x));
        this.position.z = Math.max(-bound, Math.min(bound, this.position.z));

        this.mesh.position.copy(this.position);

        this.animateAvatar(dt);
        this.updateCamera(camera);
    }

    animateAvatar(dt) {
        if (this.isMoving) {
            const freq = this.keys.sprint ? 15 : 10;
            const amp = this.keys.sprint ? 0.70 : 0.44;
            this.animTime += dt * freq;

            // Energetic tactical limb swings
            this.leftLeg.rotation.x = Math.sin(this.animTime) * amp;
            this.rightLeg.rotation.x = -Math.sin(this.animTime) * amp;

            this.leftArm.rotation.x = -Math.sin(this.animTime) * amp * 0.8;
            this.rightArm.rotation.x = Math.sin(this.animTime) * amp * 0.8;

            // Bouncy Leek Leaf Hair oscillation!
            if (this.hairGroup) {
                this.hairGroup.rotation.x = -Math.abs(Math.sin(this.animTime)) * 0.18;
                this.hairGroup.rotation.z = Math.sin(this.animTime * 0.5) * 0.08;
            }

            // Body bounce
            this.torsoGroup.position.y = 1.25 + Math.abs(Math.sin(this.animTime)) * 0.08;
            this.headGroup.position.y = 1.9 + Math.abs(Math.sin(this.animTime)) * 0.08;
        } else {
            // Idle stance
            this.leftLeg.rotation.x *= 0.85;
            this.rightLeg.rotation.x *= 0.85;
            this.leftArm.rotation.x *= 0.85;
            this.rightArm.rotation.x *= 0.85;

            this.animTime += dt * 2.5;
            const breath = Math.sin(this.animTime) * 0.02;
            this.torsoGroup.position.y = 1.25 + breath;
            this.headGroup.position.y = 1.9 + breath;

            if (this.hairGroup) {
                this.hairGroup.rotation.x = Math.sin(this.animTime * 1.2) * 0.04;
            }
        }
    }

    updateCamera(camera) {
        if (this.cameraMode === 'fpv') {
            camera.position.set(this.position.x, this.position.y + 1.9, this.position.z);
            const lookTarget = new THREE.Vector3(
                this.position.x - Math.sin(this.cameraAngle.theta) * 10,
                this.position.y + 1.9 - Math.sin(this.cameraAngle.phi) * 8,
                this.position.z - Math.cos(this.cameraAngle.theta) * 10
            );
            camera.lookAt(lookTarget);
        } else {
            // Cinematic 3rd person follow
            const dist = this.cameraAngle.distance;
            const theta = this.cameraAngle.theta;
            const phi = this.cameraAngle.phi;

            const camX = this.position.x + dist * Math.sin(theta) * Math.cos(phi);
            const camY = this.position.y + 1.8 + dist * Math.sin(phi);
            const camZ = this.position.z + dist * Math.cos(theta) * Math.cos(phi);

            camera.position.set(camX, camY, camZ);
            camera.lookAt(this.position.x, this.position.y + 1.4, this.position.z);
        }
    }
}

window.CyberHackerAvatar = CyberHackerAvatar;
