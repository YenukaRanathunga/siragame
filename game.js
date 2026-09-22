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
        // 1. Three.js Scene & Camera
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

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
        const scale = (size - 16) / 60; // 60x60 world map scale

        // Clear background
        ctx.fillStyle = 'rgba(6, 12, 22, 0.85)';
        ctx.fillRect(0, 0, size, size);

        // Bunker outer boundary
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(8, 8, size - 16, size - 16);

        // Grid lines on radar
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(center, 8);
        ctx.lineTo(center, size - 8);
        ctx.moveTo(8, center);
        ctx.lineTo(size - 8, center);
        ctx.stroke();

        // Draw Terminals
        const challenges = window.challengeManager.challenges;
        challenges.forEach(ch => {
            const mapX = center + ch.pos.x * scale;
            const mapY = center + ch.pos.z * scale;

            ctx.beginPath();
            ctx.arc(mapX, mapY, 4, 0, Math.PI * 2);
            if (ch.solved) {
                ctx.fillStyle = '#00ff66';
            } else {
                ctx.fillStyle = ch.color || '#ff007f';
            }
            ctx.fill();

            // Ring around terminal
            ctx.strokeStyle = ch.solved ? '#00ff66' : 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Draw Player Arrow
        const playerX = center + this.player.position.x * scale;
        const playerY = center + this.player.position.z * scale;
        const angle = this.player.rotation;

        ctx.save();
        ctx.translate(playerX, playerY);
        ctx.rotate(angle);

        // Draw triangle pointer
        ctx.beginPath();
        ctx.moveTo(0, 7);
        ctx.lineTo(-4, -5);
        ctx.lineTo(4, -5);
        ctx.closePath();
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 6;
        ctx.fill();

        ctx.restore();
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
