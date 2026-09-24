// Main Game Controller, Radar Minimap, Codex, Certificate, and Fast Travel Handler

class CyberCTFGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.composer = null;
        this.world = null;
        this.player = null;
        this.clock = new THREE.Clock();

        this.currentViewMode = '3d'; // '3d' or 'dashboard'
        this.nearbyTerminal = null;
        this.isInteracting = false;
        this.selectedTier = 'all';

        this.init();
    }

    init() {
        // 1. Three.js Scene & Camera (Kilometer Scale)
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3500);

        // 2. WebGL Renderer
        const canvas = document.getElementById('game-canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        // Cinematic Shadows & ACES Filmic Tone Mapping (Vibrant Modern City Contrast)
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.05;

        // 3. Build World & Player
        this.world = new CyberBunkerWorld(this.scene);
        this.player = new CyberHackerAvatar(this.scene);

        // 4. Post-Processing: Neon Bloom + PBR Environment Reflections
        this.initPostProcessing();

        // 5. UI Bindings
        this.setupUI();

        // 6. Window Resize Handler
        window.addEventListener('resize', () => this.onWindowResize());

        // 7. Start Loop
        this.animate();
    }

    initPostProcessing() {
        if (!THREE.EffectComposer || !THREE.UnrealBloomPass || !THREE.RenderPass) {
            console.warn('GHOSTBIT: post-processing scripts missing, using direct render.');
            return;
        }
        try {
            this.composer = new THREE.EffectComposer(this.renderer);
            this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));

            const bloomPass = new THREE.UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                0.8,
                0.45,
                0.6
            );
            this.composer.addPass(bloomPass);

            this.buildNightEnvironment();
        } catch (err) {
            console.warn('GHOSTBIT: bloom init failed, using direct render.', err);
            this.composer = null;
        }
    }

    buildNightEnvironment() {
        const pmrem = new THREE.PMREMGenerator(this.renderer);
        const envScene = new THREE.Scene();

        // Night gradient sky dome
        const skyCanvas = document.createElement('canvas');
        skyCanvas.width = 1024;
        skyCanvas.height = 512;
        const ctx = skyCanvas.getContext('2d');
        const g = ctx.createLinearGradient(0, 0, 0, 512);
        g.addColorStop(0, '#01030a');
        g.addColorStop(0.45, '#0a1128');
        g.addColorStop(0.72, '#16234f');
        g.addColorStop(1, '#1e2f5e');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 1024, 512);

        // Distant city-light band near the horizon
        const cityColors = ['#ffd98a', '#7fd8ff', '#ff2d95', '#f8fafc'];
        for (let i = 0; i < 140; i++) {
            const x = Math.random() * 1024;
            const y = 390 + Math.random() * 110;
            ctx.fillStyle = cityColors[i % 4];
            ctx.globalAlpha = 0.35 + Math.random() * 0.65;
            ctx.fillRect(x, y, 2 + Math.random() * 3, 6 + Math.random() * 6);
        }
        ctx.globalAlpha = 1;

        const skyTex = new THREE.CanvasTexture(skyCanvas);
        skyTex.mapping = THREE.EquirectangularReflectionMapping;
        const sky = new THREE.Mesh(
            new THREE.SphereGeometry(100, 32, 16),
            new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide })
        );
        envScene.add(sky);

        // Neon strips ringing the environment for glossy reflections
        const neonColors = [0xff2d95, 0x00f0ff, 0x7fd8ff, 0xffd98a];
        for (let i = 0; i < 14; i++) {
            const strip = new THREE.Mesh(
                new THREE.BoxGeometry(16, 0.5, 0.5),
                new THREE.MeshBasicMaterial({ color: neonColors[i % 4] })
            );
            const a = (i / 14) * Math.PI * 2;
            strip.position.set(Math.cos(a) * 55, 9 + Math.random() * 6, Math.sin(a) * 55);
            strip.lookAt(0, strip.position.y, 0);
            envScene.add(strip);
        }

        try {
            const rt = pmrem.fromScene(envScene, 0.04);
            this.scene.environment = rt.texture;
        } catch (err) {
            console.warn('GHOSTBIT: environment map generation failed.', err);
        }
        if (pmrem.dispose) pmrem.dispose();
    }

    showBannerNotification(message, type = 'info') {
        const banner = document.getElementById('world-event-banner');
        if (!banner) return;
        banner.innerText = message;
        banner.className = `world-event-banner show ${type}`;
        setTimeout(() => {
            banner.className = 'world-event-banner hidden';
        }, 5500);
    }

    setupUI() {
        // Mission Pill click & TAB / M hotkeys for Dashboard
        const missionsPill = document.getElementById('pill-missions');
        if (missionsPill) {
            missionsPill.addEventListener('click', () => this.toggleDashboard());
        }

        window.addEventListener('keydown', (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            if (e.key === 'Tab' || e.code === 'KeyM') {
                e.preventDefault();
                this.toggleDashboard();
            } else if (e.code === 'KeyC') {
                this.toggleCodex();
            } else if (e.code === 'KeyG') {
                this.toggleCertificate();
            }
        });

        // Tier Filter in Dashboard
        document.querySelectorAll('.tier-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tier-filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.selectedTier = e.target.dataset.tier;
                this.renderDashboard();
                if (window.sounds) window.sounds.playClick();
            });
        });

        // Cyber Codex Modal
        const btnOpenCodex = document.getElementById('btn-open-codex');
        const modalCodex = document.getElementById('codex-modal');
        const btnCloseCodex = document.getElementById('btn-close-codex');

        if (btnOpenCodex) btnOpenCodex.addEventListener('click', () => this.toggleCodex(true));
        if (btnCloseCodex) btnCloseCodex.addEventListener('click', () => this.toggleCodex(false));

        document.querySelectorAll('.codex-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.codex-tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const target = e.target.dataset.codex;
                document.querySelectorAll('.codex-content').forEach(c => c.classList.add('hidden'));
                const show = document.getElementById(`codex-${target}`);
                if (show) show.classList.remove('hidden');
                if (window.sounds) window.sounds.playClick();
            });
        });

        // Certificate Modal
        const btnOpenCert = document.getElementById('btn-open-cert');
        const modalCert = document.getElementById('certificate-modal');
        const btnCloseCert = document.getElementById('btn-close-cert');
        const btnRenderCert = document.getElementById('btn-render-cert');

        if (btnOpenCert) btnOpenCert.addEventListener('click', () => this.toggleCertificate(true));
        if (btnCloseCert) btnCloseCert.addEventListener('click', () => this.toggleCertificate(false));
        if (btnRenderCert) btnRenderCert.addEventListener('click', () => this.updateCertificateDisplay());

        const certNameInput = document.getElementById('cert-student-name');
        if (certNameInput && window.gameSettings) {
            const savedName = window.gameSettings.load().certName;
            if (savedName) certNameInput.value = savedName;
        }

        // Sound Mute Toggle
        const btnAudio = document.getElementById('btn-toggle-audio');
        if (btnAudio) {
            const syncMuteLabel = () => {
                const muted = window.sounds.isMuted;
                btnAudio.innerHTML = muted
                    ? '🔇 <span class="btn-label">SOUND: OFF</span>'
                    : '🔊 <span class="btn-label">SOUND: ON</span>';
                btnAudio.classList.toggle('muted', muted);
            };
            syncMuteLabel();
            btnAudio.addEventListener('click', () => {
                window.sounds.toggleMute();
                syncMuteLabel();
            });
        }

        // Help Modal Toggle
        const btnHelp = document.getElementById('btn-open-help');
        const modalHelp = document.getElementById('help-modal');
        const btnCloseHelp = document.getElementById('btn-close-help');

        if (btnHelp && modalHelp) {
            btnHelp.addEventListener('click', () => {
                modalHelp.classList.remove('hidden');
                if (window.sounds) window.sounds.playClick();
            });
            if (btnCloseHelp) {
                btnCloseHelp.addEventListener('click', () => {
                    modalHelp.classList.add('hidden');
                    if (window.sounds) window.sounds.playClick();
                });
            }
        }

        // Terminal Modal Controls
        const btnCloseTerminal = document.getElementById('btn-close-terminal');
        if (btnCloseTerminal) {
            btnCloseTerminal.addEventListener('click', () => {
                window.terminalUI.closeTerminal();
            });
        }

        // Terminal Tabs
        document.querySelectorAll('.terminal-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                window.terminalUI.switchTab(tab);
            });
        });

        // Flag Submission Handler
        const btnSubmitFlag = document.getElementById('btn-submit-flag');
        const inputFlag = document.getElementById('terminal-flag-input');
        const resultFlag = document.getElementById('terminal-flag-result');

        const handleFlagSubmit = () => {
            if (!window.terminalUI.activeChallenge) return;
            const res = window.challengeManager.submitFlag(
                window.terminalUI.activeChallenge.id,
                inputFlag.value
            );

            if (res.success) {
                if (window.sounds) window.sounds.playSuccess();
                if (window.confetti) {
                    window.confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 } });
                }
                resultFlag.className = 'flag-result-box success';
                resultFlag.innerHTML = `✔ ${res.message}`;
                this.renderDashboard();
            } else {
                if (window.sounds) window.sounds.playError();
                resultFlag.className = 'flag-result-box error';
                resultFlag.innerHTML = `✖ ${res.message}`;
            }
        };

        if (btnSubmitFlag) btnSubmitFlag.addEventListener('click', handleFlagSubmit);
        if (inputFlag) inputFlag.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleFlagSubmit(); });

        // Listen for 'E' key to interact with nearby terminal
        window.addEventListener('keydown', (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            if (e.code === 'KeyE') {
                if (this.nearbyTerminal) {
                    const modal = document.getElementById('terminal-modal');
                    if (modal.classList.contains('hidden')) {
                        window.terminalUI.openTerminal(this.nearbyTerminal.id);
                    } else {
                        window.terminalUI.closeTerminal();
                    }
                }
            } else if (e.code === 'Escape') {
                window.terminalUI.closeTerminal();
                if (modalHelp) modalHelp.classList.add('hidden');
                if (modalCodex) modalCodex.classList.add('hidden');
                if (modalCert) modalCert.classList.add('hidden');
            }
        });

        // Auto start audio upon first canvas interaction
        document.body.addEventListener('click', () => {
            if (window.sounds && !window.sounds.isAmbientPlaying) {
                window.sounds.startAmbient();
            }
        }, { once: true });
    }

    toggleCodex(forceOpen) {
        const modal = document.getElementById('codex-modal');
        if (!modal) return;
        const shouldOpen = forceOpen !== undefined ? forceOpen : modal.classList.contains('hidden');
        modal.classList.toggle('hidden', !shouldOpen);
        if (window.sounds) window.sounds.playClick();
    }

    toggleCertificate(forceOpen) {
        const modal = document.getElementById('certificate-modal');
        if (!modal) return;
        const shouldOpen = forceOpen !== undefined ? forceOpen : modal.classList.contains('hidden');
        modal.classList.toggle('hidden', !shouldOpen);
        if (shouldOpen) this.updateCertificateDisplay();
        if (window.sounds) window.sounds.playClick();
    }

    updateCertificateDisplay() {
        const nameInp = document.getElementById('cert-student-name');
        const nameDisp = document.getElementById('cert-display-name');
        const rankDisp = document.getElementById('cert-display-rank');
        const solvedDisp = document.getElementById('cert-display-solved');
        const scoreDisp = document.getElementById('cert-display-score');
        const dateDisp = document.getElementById('cert-display-date');

        if (nameInp && window.gameSettings) {
            window.gameSettings.save({ certName: nameInp.value });
        }

        const score = window.challengeManager.score;
        const solved = window.challengeManager.solvedCount;
        const playable = window.challengeManager.challenges.filter(c => !c.isDecoy).length;

        const rank = window.challengeManager.getRank();

        if (nameDisp) nameDisp.innerText = nameInp ? nameInp.value || 'Cyber Cadet' : 'Cyber Cadet';
        if (rankDisp) rankDisp.innerText = rank;
        if (solvedDisp) solvedDisp.innerText = `${solved} / ${playable}`;
        if (scoreDisp) scoreDisp.innerText = `${score} PTS`;
        if (dateDisp) dateDisp.innerText = new Date().toISOString().split('T')[0];

        const dashClear = document.getElementById('dash-clearance-status');
        if (dashClear) dashClear.innerText = rank;
    }

    switchTo3D() {
        this.currentViewMode = '3d';
        const v3d = document.getElementById('game-container-3d');
        const vDash = document.getElementById('dashboard-container');
        if (v3d) v3d.classList.remove('hidden');
        if (vDash) vDash.classList.add('hidden');
        if (window.sounds) window.sounds.playClick();
    }

    toggleDashboard() {
        if (this.currentViewMode === '3d') {
            this.currentViewMode = 'dashboard';
            const v3d = document.getElementById('game-container-3d');
            const vDash = document.getElementById('dashboard-container');
            if (v3d) v3d.classList.add('hidden');
            if (vDash) vDash.classList.remove('hidden');
            this.renderDashboard();
        } else {
            this.switchTo3D();
        }
        if (window.sounds) window.sounds.playClick();
    }

    teleportToStation(stationId) {
        const ch = window.challengeManager.getChallenge(stationId);
        if (!ch || !ch.pos) return;

        if (this.player) {
            this.player.teleportTo(ch.pos.x, ch.pos.z + 3.0);
        }

        this.switchTo3D();
        if (window.sounds) window.sounds.playInteract();
        this.showBannerNotification(`⚡ FAST TRAVEL: Teleported to ${ch.title}`, 'info');
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        if (this.composer) this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    checkTerminalProximity() {
        if (!this.world || !this.player) return;

        const playerPos = this.player.position;
        let foundNearby = null;
        let minDistance = Infinity;

        this.world.terminals.forEach(term => {
            const dist = Math.hypot(playerPos.x - term.pos.x, playerPos.z - term.pos.z);
            if (dist < term.radius) {
                if (dist < minDistance) {
                    minDistance = dist;
                    foundNearby = term;
                }
            }
        });

        const prompt = document.getElementById('interaction-prompt');
        const foundId = foundNearby ? foundNearby.id : null;

        if (foundId !== this.lastPromptTerminalId) {
            this.lastPromptTerminalId = foundId;
            if (foundNearby) {
                if (prompt) {
                    prompt.classList.remove('hidden');
                    prompt.innerHTML = `
                        <div class="prompt-key">E</div>
                        <div class="prompt-text">
                            <span class="prompt-action">ACCESS TERMINAL</span>
                            <span class="prompt-station">${foundNearby.challenge.title}</span>
                        </div>
                    `;
                }
                this.nearbyTerminal = foundNearby;
            } else {
                this.nearbyTerminal = null;
                if (prompt) prompt.classList.add('hidden');
            }
        }
    }

    renderRadarMinimap() {
        const canvas = document.getElementById('radar-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        const center = size / 2;
        const scale = (size - 16) / 1200;

        // Clear background
        ctx.fillStyle = 'rgba(10, 14, 22, 0.95)';
        ctx.fillRect(0, 0, size, size);

        // 1. Ocean Bay
        const oceanX = center + 220 * scale;
        ctx.fillStyle = '#0f293d';
        ctx.fillRect(oceanX, 4, size - 4 - oceanX, size - 8);

        // 2. Central Park
        const cpX = center + (-480) * scale;
        const cpY = center + (-250) * scale;
        ctx.fillStyle = '#143828';
        ctx.fillRect(cpX, cpY, 320 * scale, 500 * scale);

        // 3. Roads
        ctx.fillStyle = '#1f2937';
        const avenues = [-400, -260, -130, 0, 130];
        avenues.forEach(ax => {
            const rx = center + ax * scale;
            ctx.fillRect(rx - 2, 4, 4, size - 8);
        });

        // 4. Targets
        const challenges = window.challengeManager ? window.challengeManager.challenges : [];
        challenges.forEach(ch => {
            if (!ch.pos) return;
            const mapX = center + ch.pos.x * scale;
            const mapY = center + ch.pos.z * scale;

            ctx.beginPath();
            ctx.arc(mapX, mapY, ch.isDecoy ? 2.5 : 3.5, 0, Math.PI * 2);
            ctx.fillStyle = ch.solved ? '#00ff66' : (ch.color || '#ff007f');
            ctx.fill();
        });

        // 5. Player Arrow
        if (this.player) {
            const playerX = center + this.player.position.x * scale;
            const playerY = center + this.player.position.z * scale;
            ctx.save();
            ctx.translate(playerX, playerY);
            ctx.rotate(this.player.rotation);
            ctx.beginPath();
            ctx.moveTo(0, 6);
            ctx.lineTo(-4, -4);
            ctx.lineTo(4, -4);
            ctx.closePath();
            ctx.fillStyle = '#00f0ff';
            ctx.fill();
            ctx.restore();
        }
    }

    renderDashboard() {
        const grid = document.getElementById('dash-challenges-grid');
        if (!grid) return;

        grid.innerHTML = '';
        let challenges = window.challengeManager.challenges;

        if (this.selectedTier !== 'all') {
            const tierNum = parseInt(this.selectedTier);
            challenges = challenges.filter(c => c.tier === tierNum || (c.isDecoy && tierNum === 1));
        }

        challenges.forEach(ch => {
            const card = document.createElement('div');
            card.className = `dash-card ${ch.solved ? 'solved' : ''}`;
            card.innerHTML = `
                <div class="dash-card-header" style="border-left-color: ${ch.color}">
                    <span class="dash-icon">${ch.icon}</span>
                    <span class="dash-cat" style="color: ${ch.color}">${ch.category}</span>
                    <span class="dash-points">${ch.isDecoy ? 'UTILITY' : '+' + ch.points + ' PTS'}</span>
                </div>
                <div class="dash-card-body">
                    <div class="dash-tier-badge tier-${ch.tier || 1}">${ch.tierName ? 'TIER ' + ch.tier + ': ' + ch.tierName : 'UTILITY RELAY'}</div>
                    <h4>${ch.title}</h4>
                    <p class="dash-summary">${ch.summary}</p>
                    <div class="dash-card-footer mt-3">
                        <span class="dash-status-badge ${ch.solved ? 'solved' : 'pending'}">
                            ${ch.solved ? '✔ COMPLETED' : '● PENDING'}
                        </span>
                        <div class="dash-btn-group">
                            <button class="cyber-btn sm primary" onclick="window.game.teleportToStation('${ch.id}')" title="Instant GPS Teleport">
                                ⚡ TELEPORT
                            </button>
                            <button class="cyber-btn sm" onclick="window.game.openTerminalDirectly('${ch.id}')">
                                ${ch.solved ? 'VIEW INTEL' : 'HACK'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    openTerminalDirectly(challengeId) {
        this.switchTo3D();
        window.terminalUI.openTerminal(challengeId);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();

        if (this.currentViewMode === '3d') {
            this.player.update(delta, this.camera);
            this.world.update(delta, this.player.position, window.challengeManager.score);
            this.checkTerminalProximity();
            this.renderRadarMinimap();
            if (this.composer) {
                this.composer.render();
            } else {
                this.renderer.render(this.scene, this.camera);
            }
        }
    }
}

// Global Game Instance
window.addEventListener('DOMContentLoaded', () => {
    window.game = new CyberCTFGame();
});
