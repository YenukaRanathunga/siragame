// Elliot Alderson (Mr. Robot) 3D Realistic Character Controller

class CyberHackerAvatar {
    constructor(scene) {
        this.scene = scene;
        this.mesh = new THREE.Group();

        // Human Physics & Movement
        this.position = new THREE.Vector3(0, 0, 16);
        this.rotation = 0;
        this.velocity = new THREE.Vector3();
        this.isGrounded = true;
        this.walkSpeed = 5.2;
        this.runSpeed = 9.8;
        this.jumpForce = 7.5;
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
            distance: 4.8
        };

        this.buildElliotModel();
        this.setupEventListeners();
        this.scene.add(this.mesh);
    }

    buildElliotModel() {
        // Realistic Fabric & Denim Materials
        const blackHoodieMat = new THREE.MeshStandardMaterial({
            color: 0x14161a,
            roughness: 0.9,
            metalness: 0.05
        });

        const darkDenimMat = new THREE.MeshStandardMaterial({
            color: 0x181c24,
            roughness: 0.85,
            metalness: 0.1
        });

        const blackSneakerMat = new THREE.MeshStandardMaterial({
            color: 0x0c0d10,
            roughness: 0.7,
            metalness: 0.1
        });

        const whiteSoleMat = new THREE.MeshStandardMaterial({
            color: 0xd8d8d8,
            roughness: 0.5
        });

        const skinShadowMat = new THREE.MeshStandardMaterial({
            color: 0xb58a68,
            roughness: 0.7
        });

        const backpackMat = new THREE.MeshStandardMaterial({
            color: 0x0f1115,
            roughness: 0.85,
            metalness: 0.15
        });

        const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111111 });

        // Root Group
        this.characterRoot = new THREE.Group();

        // 1. Torso & Hoodie
        this.torsoGroup = new THREE.Group();
        this.torsoGroup.position.y = 1.25;

        // Upper Body (Chest & Waist)
        const chestGeo = new THREE.BoxGeometry(0.55, 0.75, 0.35);
        this.chestMesh = new THREE.Mesh(chestGeo, blackHoodieMat);
        this.chestMesh.castShadow = true;
        this.chestMesh.receiveShadow = true;
        this.torsoGroup.add(this.chestMesh);

        // Hoodie Zipper Seam line
        const zipGeo = new THREE.BoxGeometry(0.025, 0.72, 0.355);
        const zipMesh = new THREE.Mesh(zipGeo, new THREE.MeshStandardMaterial({ color: 0x333742, metalness: 0.8 }));
        this.torsoGroup.add(zipMesh);

        // Hoodie Pouch Pocket
        const pocketGeo = new THREE.BoxGeometry(0.42, 0.24, 0.06);
        const pocketMesh = new THREE.Mesh(pocketGeo, blackHoodieMat);
        pocketMesh.position.set(0, -0.15, 0.18);
        pocketMesh.castShadow = true;
        this.torsoGroup.add(pocketMesh);

        // Elliot's Iconic Black Backpack
        const packGeo = new THREE.BoxGeometry(0.44, 0.52, 0.22);
        const packMesh = new THREE.Mesh(packGeo, backpackMat);
        packMesh.position.set(0, 0.08, -0.24);
        packMesh.castShadow = true;
        this.torsoGroup.add(packMesh);

        // Backpack Straps
        const strapGeo = new THREE.BoxGeometry(0.08, 0.65, 0.04);
        const strapL = new THREE.Mesh(strapGeo, backpackMat);
        strapL.position.set(-0.18, 0.05, 0.12);
        this.torsoGroup.add(strapL);

        const strapR = strapL.clone();
        strapR.position.set(0.18, 0.05, 0.12);
        this.torsoGroup.add(strapR);

        // 2. Head with Deep Black Hood Pulled Up
        this.headGroup = new THREE.Group();
        this.headGroup.position.set(0, 1.82, 0);

        // Shadowed Face inside Hood
        const faceGeo = new THREE.BoxGeometry(0.28, 0.32, 0.26);
        const faceMesh = new THREE.Mesh(faceGeo, skinShadowMat);
        faceMesh.position.set(0, -0.02, 0.02);
        this.headGroup.add(faceMesh);

        // Intense Eyes peering from shadow
        const eyeGeo = new THREE.BoxGeometry(0.045, 0.025, 0.02);
        const eyeL = new THREE.Mesh(eyeGeo, eyeWhiteMat);
        eyeL.position.set(-0.07, 0.02, 0.15);
        this.headGroup.add(eyeL);

        const eyeR = eyeL.clone();
        eyeR.position.set(0.07, 0.02, 0.15);
        this.headGroup.add(eyeR);

        const pupilGeo = new THREE.BoxGeometry(0.02, 0.02, 0.022);
        const pupilL = new THREE.Mesh(pupilGeo, pupilMat);
        pupilL.position.set(-0.07, 0.02, 0.155);
        this.headGroup.add(pupilL);

        const pupilR = pupilL.clone();
        pupilR.position.set(0.07, 0.02, 0.155);
        this.headGroup.add(pupilR);

        // The Deep Hoodie Fabric (Encloses the head with an opening in front)
        const hoodOuterGeo = new THREE.BoxGeometry(0.38, 0.42, 0.38);
        const hoodOuter = new THREE.Mesh(hoodOuterGeo, blackHoodieMat);
        hoodOuter.castShadow = true;
        this.headGroup.add(hoodOuter);

        // Hood Visor Peak/Rim
        const hoodPeakGeo = new THREE.BoxGeometry(0.36, 0.08, 0.18);
        const hoodPeak = new THREE.Mesh(hoodPeakGeo, blackHoodieMat);
        hoodPeak.position.set(0, 0.18, 0.18);
        hoodPeak.castShadow = true;
        this.headGroup.add(hoodPeak);

        // 3. Arms with Realistic Sleeves
        const armGeo = new THREE.BoxGeometry(0.18, 0.68, 0.18);
        armGeo.translate(0, -0.28, 0); // Shoulder pivot

        // Left Arm
        this.leftArm = new THREE.Group();
        this.leftArm.position.set(-0.35, 1.55, 0);
        const lArmMesh = new THREE.Mesh(armGeo, blackHoodieMat);
        lArmMesh.castShadow = true;
        this.leftArm.add(lArmMesh);
        // Hand
        const handGeo = new THREE.BoxGeometry(0.12, 0.16, 0.14);
        const handL = new THREE.Mesh(handGeo, skinShadowMat);
        handL.position.set(0, -0.62, 0);
        this.leftArm.add(handL);

        // Right Arm
        this.rightArm = new THREE.Group();
        this.rightArm.position.set(0.35, 1.55, 0);
        const rArmMesh = new THREE.Mesh(armGeo, blackHoodieMat);
        rArmMesh.castShadow = true;
        this.rightArm.add(rArmMesh);
        // Hand
        const handR = new THREE.Mesh(handGeo, skinShadowMat);
        handR.position.set(0, -0.62, 0);
        this.rightArm.add(handR);

        // 4. Legs (Dark Denim) & Realistic Sneakers
        const legGeo = new THREE.BoxGeometry(0.20, 0.80, 0.22);
        legGeo.translate(0, -0.38, 0); // Hip pivot

        // Left Leg
        this.leftLeg = new THREE.Group();
        this.leftLeg.position.set(-0.16, 0.82, 0);
        const lLegMesh = new THREE.Mesh(legGeo, darkDenimMat);
        lLegMesh.castShadow = true;
        lLegMesh.receiveShadow = true;
        this.leftLeg.add(lLegMesh);

        // Sneaker Body
        const shoeGeo = new THREE.BoxGeometry(0.22, 0.12, 0.36);
        const shoeL = new THREE.Mesh(shoeGeo, blackSneakerMat);
        shoeL.position.set(0, -0.78, 0.05);
        shoeL.castShadow = true;
        this.leftLeg.add(shoeL);
        // White Sneaker Sole Rim
        const soleGeo = new THREE.BoxGeometry(0.23, 0.035, 0.37);
        const soleL = new THREE.Mesh(soleGeo, whiteSoleMat);
        soleL.position.set(0, -0.83, 0.05);
        this.leftLeg.add(soleL);

        // Right Leg
        this.rightLeg = new THREE.Group();
        this.rightLeg.position.set(0.16, 0.82, 0);
        const rLegMesh = new THREE.Mesh(legGeo, darkDenimMat);
        rLegMesh.castShadow = true;
        rLegMesh.receiveShadow = true;
        this.rightLeg.add(rLegMesh);

        const shoeR = new THREE.Mesh(shoeGeo, blackSneakerMat);
        shoeR.position.set(0, -0.78, 0.05);
        shoeR.castShadow = true;
        this.rightLeg.add(shoeR);

        const soleR = new THREE.Mesh(soleGeo, whiteSoleMat);
        soleR.position.set(0, -0.83, 0.05);
        this.rightLeg.add(soleR);

        // Assemble Character
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
                this.cameraAngle.distance = Math.max(2.2, Math.min(9.0, this.cameraAngle.distance + e.deltaY * 0.005));
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

        // Keep inside NYC street block
        const boundX = 26;
        const boundZ = 30;
        this.position.x = Math.max(-boundX, Math.min(boundX, this.position.x));
        this.position.z = Math.max(-boundZ, Math.min(boundZ, this.position.z));

        this.mesh.position.copy(this.position);

        this.animateAvatar(dt);
        this.updateCamera(camera);
    }

    animateAvatar(dt) {
        if (this.isMoving) {
            const freq = this.keys.sprint ? 14 : 9;
            const amp = this.keys.sprint ? 0.65 : 0.42;
            this.animTime += dt * freq;

            // Natural human gait: alternate limbs
            this.leftLeg.rotation.x = Math.sin(this.animTime) * amp;
            this.rightLeg.rotation.x = -Math.sin(this.animTime) * amp;

            this.leftArm.rotation.x = -Math.sin(this.animTime) * amp * 0.75;
            this.rightArm.rotation.x = Math.sin(this.animTime) * amp * 0.75;

            // Subtle Elliot slouched body bobbing
            this.torsoGroup.position.y = 1.25 + Math.abs(Math.sin(this.animTime)) * 0.05;
            this.headGroup.position.y = 1.82 + Math.abs(Math.sin(this.animTime)) * 0.05;
        } else {
            this.leftLeg.rotation.x *= 0.85;
            this.rightLeg.rotation.x *= 0.85;
            this.leftArm.rotation.x *= 0.85;
            this.rightArm.rotation.x *= 0.85;

            this.animTime += dt * 2.2;
            const breath = Math.sin(this.animTime) * 0.015;
            this.torsoGroup.position.y = 1.25 + breath;
            this.headGroup.position.y = 1.82 + breath;
        }
    }

    updateCamera(camera) {
        if (this.cameraMode === 'fpv') {
            camera.position.set(this.position.x, this.position.y + 1.8, this.position.z);
            const lookTarget = new THREE.Vector3(
                this.position.x - Math.sin(this.cameraAngle.theta) * 10,
                this.position.y + 1.8 - Math.sin(this.cameraAngle.phi) * 8,
                this.position.z - Math.cos(this.cameraAngle.theta) * 10
            );
            camera.lookAt(lookTarget);
        } else {
            // Cinematic 3rd person camera
            const dist = this.cameraAngle.distance;
            const theta = this.cameraAngle.theta;
            const phi = this.cameraAngle.phi;

            const camX = this.position.x + dist * Math.sin(theta) * Math.cos(phi);
            const camY = this.position.y + 1.6 + dist * Math.sin(phi);
            const camZ = this.position.z + dist * Math.cos(theta) * Math.cos(phi);

            camera.position.set(camX, camY, camZ);
            camera.lookAt(this.position.x, this.position.y + 1.3, this.position.z);
        }
    }
}

window.CyberHackerAvatar = CyberHackerAvatar;
