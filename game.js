// Main Game Controller, Radar Minimap, and Dual Mode Handler

class CyberCTFGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.world = null;
        this.player = null;
        this.clock = new THREE.Clock();

        this.currentViewMode = '3d'; // '3d' or 'dashboard'
        this.nearbyTerminal = null;
        this.isInteracting = false;

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

        // Cinematic Shadows & ACES Filmic Tone Mapping (Mr. Robot Film Look)
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.08;

        // 3. Build World & Player
        this.world = new CyberBunkerWorld(this.scene);
        this.player = new CyberHackerAvatar(this.scene);

        // 4. UI Bindings
        this.setupUI();

        // 5. Window Resize Handler
        window.addEventListener('resize', () => this.onWindowResize());

        // 6. Start Loop
        this.animate();
    }

    setupUI() {
        // Mode Switch Buttons
        const btn3D = document.getElementById('btn-mode-3d');
        const btnDash = document.getElementById('btn-mode-dash');
        const view3D = document.getElementById('game-container-3d');
        const viewDash = document.getElementById('dashboard-container');

        if (btn3D && btnDash) {
            btn3D.addEventListener('click', () => {
                this.currentViewMode = '3d';
                btn3D.classList.add('active');
                btnDash.classList.remove('active');
                view3D.classList.remove('hidden');
                viewDash.classList.add('hidden');
                if (window.sounds) window.sounds.playClick();
            });

            btnDash.addEventListener('click', () => {
                this.currentViewMode = 'dashboard';
                btnDash.classList.add('active');
                btn3D.classList.remove('active');
                view3D.classList.add('hidden');
                viewDash.classList.remove('hidden');
                this.renderDashboard();
                if (window.sounds) window.sounds.playClick();
            });
        }

        // Sound Mute Toggle
        const btnAudio = document.getElementById('btn-toggle-audio');
        if (btnAudio) {
            btnAudio.addEventListener('click', () => {
                const muted = window.sounds.toggleMute();
                btnAudio.innerHTML = muted ? '🔇 SOUND: OFF' : '🔊 SOUND: ON';
                btnAudio.classList.toggle('muted', muted);
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
                    window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                }
                resultFlag.className = 'flag-result-box success';
                resultFlag.innerHTML = `✔ ${res.message}`;
                // Refresh dashboard if visible
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
            }
        });

        // Auto start audio upon first canvas interaction
        document.body.addEventListener('click', () => {
            if (window.sounds && !window.sounds.isAmbientPlaying) {
                window.sounds.startAmbient();
            }
        }, { once: true });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
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

        if (foundNearby) {
            this.nearbyTerminal = foundNearby;
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
        } else {
            this.nearbyTerminal = null;
            if (prompt) prompt.classList.add('hidden');
        }
    }

    renderRadarMinimap() {
        const canvas = document.getElementById('radar-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        const center = size / 2;
        const scale = (size - 16) / 1200; // 1200m (1.2km) metropolis scale

        // Clear background (Dark urban base)
        ctx.fillStyle = 'rgba(14, 18, 26, 0.95)';
        ctx.fillRect(0, 0, size, size);

        // 1. Eastern Ocean Harbor Bay
        const oceanX = center + 220 * scale;
        ctx.fillStyle = '#166986';
        ctx.fillRect(oceanX, 4, size - 4 - oceanX, size - 8);

        // 2. Walkable Finger Piers extending into Ocean
        const pierZs = [-350, -210, -70, 70, 210, 350];
        ctx.fillStyle = '#6b7280';
        pierZs.forEach((pz, idx) => {
            const py = center + pz * scale;
            const pw = 95 * scale;
            const ph = Math.max(3, 16 * scale);
            ctx.fillRect(oceanX, py - ph/2, pw, ph);

            // Docked Ships on Pier 2 (Cruise Liner) & Pier 4 (Cargo Ship)
            if (idx === 1) { // Cruise Liner at Pier 2
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(oceanX + 15 * scale, py + ph/2 + 1, 110 * scale, 12 * scale);
                ctx.fillStyle = '#6b7280'; // restore
            } else if (idx === 3) { // Cargo Ship at Pier 4
                ctx.fillStyle = '#dc2626';
                ctx.fillRect(oceanX + 15 * scale, py - ph/2 - 13 * scale, 95 * scale, 11 * scale);
                ctx.fillStyle = '#6b7280'; // restore
            }
        });

        // 3. Central Park (West District)
        const cpX = center + (-480) * scale;
        const cpY = center + (-250) * scale;
        const cpW = 320 * scale;
        const cpH = 500 * scale;
        ctx.fillStyle = '#2d6a4f';
        ctx.fillRect(cpX, cpY, cpW, cpH);

        // Central Park Lake
        ctx.fillStyle = '#1b4d3e';
        ctx.beginPath();
        ctx.arc(cpX + cpW * 0.5, cpY + cpH * 0.5, 18 * scale, 0, Math.PI * 2);
        ctx.fill();

        // 4. Urban Road Grid (Asphalt Gray)
        ctx.fillStyle = '#374151';
        const roadW = Math.max(2, 14 * scale);
        const hwW = Math.max(3, 22 * scale);

        // Waterfront Coastal Highway (along x = 200)
        const hwX = center + 200 * scale;
        ctx.fillRect(hwX - hwW/2, 4, hwW, size - 8);

        // North-South Avenues
        const avenues = [-400, -260, -120, 20, 160];
        avenues.forEach(ax => {
            const rx = center + ax * scale;
            ctx.fillRect(rx - roadW/2, 4, roadW, size - 8);
        });

        // East-West Cross Streets
        const streets = [-450, -320, -190, -60, 70, 200, 330, 460];
        streets.forEach(sz => {
            const ry = center + sz * scale;
            ctx.fillRect(4, ry - roadW/2, oceanX - 4, roadW);
        });

        // Highway Yellow Lines
        ctx.strokeStyle = '#f5b700';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(hwX, 4);
        ctx.lineTo(hwX, size - 4);
        ctx.stroke();

        // Outer 1.2 KM Boundary
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(4, 4, size - 8, size - 8);

        // Draw Infiltration Targets
        const challenges = window.challengeManager ? window.challengeManager.challenges : [];
        challenges.forEach(ch => {
            if (!ch.pos) return;
            const mapX = center + ch.pos.x * scale;
            const mapY = center + ch.pos.z * scale;

            ctx.beginPath();
            ctx.arc(mapX, mapY, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = ch.solved ? '#00ff66' : (ch.color || '#ff007f');
            ctx.shadowColor = ch.solved ? '#00ff66' : '#ff007f';
            ctx.shadowBlur = 4;
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 0.8;
            ctx.stroke();
        });

        // Draw Player Arrow (GTA V style)
        if (this.player) {
            const playerX = center + this.player.position.x * scale;
            const playerY = center + this.player.position.z * scale;
            const angle = this.player.rotation;

            ctx.save();
            ctx.translate(playerX, playerY);
            ctx.rotate(angle);

            ctx.beginPath();
            ctx.moveTo(0, 6.5);
            ctx.lineTo(-4, -4.5);
            ctx.lineTo(4, -4.5);
            ctx.closePath();
            ctx.fillStyle = '#00f0ff';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 5;
            ctx.fill();
            ctx.shadowBlur = 0;

        }
    }

    renderDashboard() {
        const grid = document.getElementById('dash-challenges-grid');
        if (!grid) return;

        grid.innerHTML = '';
        const challenges = window.challengeManager.challenges;

        challenges.forEach(ch => {
            const card = document.createElement('div');
            card.className = `dash-card ${ch.solved ? 'solved' : ''}`;
            card.innerHTML = `
                <div class="dash-card-header" style="border-left-color: ${ch.color}">
                    <span class="dash-icon">${ch.icon}</span>
                    <span class="dash-cat" style="color: ${ch.color}">${ch.category}</span>
                    <span class="dash-points">+${ch.points} PTS</span>
                </div>
                <div class="dash-card-body">
                    <h4>${ch.title}</h4>
                    <p class="dash-summary">${ch.summary}</p>
                    <div class="dash-card-footer mt-3">
                        <span class="dash-status-badge ${ch.solved ? 'solved' : 'pending'}">
                            ${ch.solved ? '✔ COMPLETED' : '● PENDING'}
                        </span>
                        <button class="cyber-btn sm" onclick="window.game.openTerminalDirectly('${ch.id}')">
                            ${ch.solved ? 'VIEW INTEL' : 'SOLVE CHALLENGE'}
                        </button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    openTerminalDirectly(challengeId) {
        // Switch to 3D mode or open modal
        this.currentViewMode = '3d';
        document.getElementById('btn-mode-3d').classList.add('active');
        document.getElementById('btn-mode-dash').classList.remove('active');
        document.getElementById('game-container-3d').classList.remove('hidden');
        document.getElementById('dashboard-container').classList.add('hidden');

        window.terminalUI.openTerminal(challengeId);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();

        if (this.currentViewMode === '3d') {
            // Update 3D player movement & camera
            this.player.update(delta, this.camera);

            // Update world animations & laser barriers
            this.world.update(delta, this.player.position, window.challengeManager.score);

            // Check proximity to workstations
            this.checkTerminalProximity();

            // Render Radar Minimap
            this.renderRadarMinimap();

            // Render 3D Scene
            this.renderer.render(this.scene, this.camera);
        }
    }
}

// Global Game Instance
window.addEventListener('DOMContentLoaded', () => {
    window.game = new CyberCTFGame();
});
