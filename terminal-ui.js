// Interactive Hacker Terminal UI, University Theory, and Challenge Simulators

class TerminalUIManager {
    constructor() {
        this.activeChallenge = null;
        this.linuxHistory = [];
        this.historyIndex = -1;
        this.shellDir = '/home/cadet';
        this.shellDirAdv = '/home/guest';
    }

    openTerminal(challengeId) {
        const ch = window.challengeManager.getChallenge(challengeId);
        if (!ch) return;

        this.activeChallenge = ch;
        if (window.sounds) window.sounds.playInteract();

        const modal = document.getElementById('terminal-modal');
        const title = document.getElementById('terminal-title');
        const tierBadge = document.getElementById('terminal-tier-badge');
        const badge = document.getElementById('terminal-category-badge');
        const points = document.getElementById('terminal-points-badge');
        const briefing = document.getElementById('terminal-briefing-content');
        const theory = document.getElementById('terminal-theory-content');
        const targetContainer = document.getElementById('terminal-interactive-container');
        const flagInput = document.getElementById('terminal-flag-input');
        const flagResult = document.getElementById('terminal-flag-result');
        const hintContent = document.getElementById('terminal-hint-content');

        // Populate header
        if (title) title.innerText = ch.title;
        if (tierBadge) {
            tierBadge.innerText = ch.tierName ? `TIER ${ch.tier}: ${ch.tierName.toUpperCase()}` : 'UTILITY';
            tierBadge.className = `badge tier-${ch.tier || 1}`;
        }
        if (badge) {
            badge.innerText = ch.category;
            badge.style.borderColor = ch.color;
            badge.style.color = ch.color;
        }
        if (points) points.innerText = `+${ch.points} PTS`;

        // Populate briefing, academic theory & hint
        if (briefing) briefing.innerHTML = ch.briefing || '';
        if (theory) theory.innerHTML = ch.academicTheory || '<p class="text-dim">Theory module not available for this node.</p>';
        if (hintContent) hintContent.innerHTML = ch.hint || '';

        // Reset inputs
        if (flagInput) flagInput.value = ch.solved ? ch.flag : '';
        if (flagResult) {
            flagResult.className = 'flag-result-box';
            flagResult.innerHTML = ch.solved 
                ? `<span class="text-success">✔ [COMPLETED] Station already pwned. Points secured: +${ch.points}</span>` 
                : '';
        }

        // Render specific interactive station tool
        if (targetContainer) this.renderInteractiveTool(ch, targetContainer);

        // Switch to briefing tab by default
        this.switchTab('briefing');

        // Show modal
        if (modal) modal.classList.remove('hidden');
    }

    closeTerminal() {
        const modal = document.getElementById('terminal-modal');
        if (modal) modal.classList.add('hidden');
        this.activeChallenge = null;
        if (window.sounds) window.sounds.playClick();
    }

    switchTab(tabName) {
        document.querySelectorAll('.terminal-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        const tabB = document.getElementById('tab-briefing');
        const tabT = document.getElementById('tab-target');
        const tabTh = document.getElementById('tab-theory');
        const tabH = document.getElementById('tab-hints');

        if (tabB) tabB.classList.toggle('hidden', tabName !== 'briefing');
        if (tabT) tabT.classList.toggle('hidden', tabName !== 'target');
        if (tabTh) tabTh.classList.toggle('hidden', tabName !== 'theory');
        if (tabH) tabH.classList.toggle('hidden', tabName !== 'hints');

        if (window.sounds) window.sounds.playClick();
    }

    renderInteractiveTool(ch, container) {
        container.innerHTML = '';

        switch (ch.interactiveType) {
            case 'linux-shell-novice':
                this.renderLinuxShellNovice(container);
                break;
            case 'web-recon-dom':
                this.renderWebReconDOM(container);
                break;
            case 'crypto-tool':
                this.renderCryptoTool(container);
                break;
            case 'scada-power-grid':
                this.renderScadaPowerGrid(container);
                break;
            case 'web-login':
                this.renderWebLogin(container);
                break;
            case 'hex-viewer':
                this.renderHexViewer(container);
                break;
            case 'broadcast-spoof':
                this.renderBroadcastSpoof(container);
                break;
            case 'linux-shell':
                this.renderLinuxShell(container);
                break;
            case 'hash-cracker':
                this.renderHashCracker(container);
                break;
            case 'web-xss':
                this.renderWebXSS(container);
                break;
            case 'rev-keygen':
                this.renderRevKeygen(container);
                break;
            case 'boss-core':
                this.renderBossCore(container);
                break;
            case 'proxy-decoy':
                this.renderProxyDecoy(container);
                break;
            default:
                container.innerHTML = '<p class="text-dim">No interactive simulator needed. Analyze the briefing and submit flag.</p>';
        }
    }

    // 1. Tier 1: Linux Novice Shell Simulator
    renderLinuxShellNovice(container) {
        container.innerHTML = `
            <div class="sim-box shell-sim">
                <div class="sim-header">
                    <span>🐧 BASH TERMINAL (cadet@metropolis-core:~)</span>
                    <span>SESSION #1092</span>
                </div>
                <div class="shell-screen" id="novice-shell-output">
                    <div>Welcome to Metropolis Linux Subsystem v5.15-generic</div>
                    <div>Type 'help' to view available system commands.</div>
                    <div>&nbsp;</div>
                </div>
                <div class="shell-input-line">
                    <span class="prompt-str">cadet@metropolis:~$</span>
                    <input type="text" id="novice-shell-input" autocomplete="off" spellcheck="false" placeholder="ls -la">
                </div>
            </div>
        `;

        const out = document.getElementById('novice-shell-output');
        const inp = document.getElementById('novice-shell-input');

        const runCmd = (cmd) => {
            const raw = cmd.trim();
            out.innerHTML += `<div><span class="prompt-str">cadet@metropolis:~$</span> ${raw}</div>`;
            if (window.sounds) window.sounds.playType();

            const parts = raw.split(' ').filter(Boolean);
            const base = parts[0] ? parts[0].toLowerCase() : '';

            if (base === 'help') {
                out.innerHTML += `<div>Available commands: <code>ls</code>, <code>ls -la</code>, <code>cat [file]</code>, <code>pwd</code>, <code>clear</code></div>`;
            } else if (base === 'pwd') {
                out.innerHTML += `<div>/home/cadet</div>`;
            } else if (base === 'clear') {
                out.innerHTML = '';
            } else if (base === 'ls') {
                if (raw.includes('-la') || raw.includes('-a')) {
                    if (raw.includes('/var/log')) {
                        out.innerHTML += `
                            <div>drwxr-xr-x 2 root adm  4096 Sep 24 04:00 .</div>
                            <div>drwxr-xr-x 8 root root 4096 Sep 24 02:00 ..</div>
                            <div>-rw-r----- 1 root adm  1240 Sep 24 04:12 syslog</div>
                            <div>-rw-r--r-- 1 root root  280 Sep 24 04:15 <strong class="text-success">.shadow_trace</strong></div>
                        `;
                    } else {
                        out.innerHTML += `
                            <div>drwxr-xr-x 3 cadet cadet 4096 Sep 24 04:00 .</div>
                            <div>drwxr-xr-x 4 root  root  4096 Sep 24 02:00 ..</div>
                            <div>-rw-r--r-- 1 cadet cadet  220 Sep 24 02:00 .bash_history</div>
                            <div>drwxr-xr-x 2 root  adm   4096 Sep 24 03:00 /var/log/</div>
                        `;
                    }
                } else if (raw.includes('/var/log')) {
                    out.innerHTML += `<div>syslog  auth.log  nginx.log</div><div class="text-dim">(Hint: Use -la to reveal hidden dotfiles)</div>`;
                } else {
                    out.innerHTML += `<div>notes.txt  downloads/  /var/log/</div>`;
                }
            } else if (base === 'cat') {
                const target = parts[1] || '';
                if (target.includes('.shadow_trace')) {
                    out.innerHTML += `
                        <div class="text-success">[!] LOG DUMP RETRIEVED:</div>
                        <div>2026-09-24 04:15:02 UTC - INTRUDER HANDSHAKE DETECTED</div>
                        <div>RECON TOKEN: <strong class="highlight-flag">CTF{linux_cli_recon_master_2026}</strong></div>
                    `;
                    document.getElementById('terminal-flag-input').value = 'CTF{linux_cli_recon_master_2026}';
                } else if (target === 'notes.txt') {
                    out.innerHTML += `<div>Log audit scheduled. Look in /var/log with -la flag.</div>`;
                } else {
                    out.innerHTML += `<div class="text-danger">cat: ${target}: No such file or directory</div>`;
                }
            } else if (raw !== '') {
                out.innerHTML += `<div class="text-danger">bash: ${base}: command not found. Type 'help'.</div>`;
            }

            out.scrollTop = out.scrollHeight;
            inp.value = '';
        };

        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') runCmd(inp.value);
        });
    }

    // 2. Tier 1: Web Recon & DOM Inspection Simulator
    renderWebReconDOM(container) {
        container.innerHTML = `
            <div class="sim-box web-sim">
                <div class="sim-header">
                    <span>🚇 METROPOLIS TRANSIT GATE INSPECTOR</span>
                    <span class="status-online">● GATE #04 ACTIVE</span>
                </div>
                <div class="sim-body">
                    <p class="text-dim">Simulated DOM Elements & Inspector Console:</p>
                    <div class="dom-preview-box">
                        <code>&lt;form id="transit-form"&gt;</code><br>
                        &nbsp;&nbsp;<code>&lt;span class="badge"&gt;STATUS: LOCKED&lt;/span&gt;</code><br>
                        &nbsp;&nbsp;<code>&lt;button id="auth-btn" <span id="dom-disabled-attr" class="text-danger">disabled="true"</span> class="locked-btn"&gt;ISSUE PASS&lt;/button&gt;</code><br>
                        <code>&lt;/form&gt;</code>
                    </div>

                    <div class="mt-3">
                        <button class="cyber-btn" id="btn-toggle-dom">⚡ DEVTOOLS: REMOVE 'disabled="true"' ATTRIBUTE</button>
                        <button class="cyber-btn disabled" id="interactive-gate-btn" disabled>ISSUE PASS (LOCKED)</button>
                    </div>

                    <div id="dom-output-log" class="query-log-box mt-3">Button disabled via client-side DOM. Bypass restriction to proceed...</div>
                </div>
            </div>
        `;

        const toggleBtn = document.getElementById('btn-toggle-dom');
        const gateBtn = document.getElementById('interactive-gate-btn');
        const domAttr = document.getElementById('dom-disabled-attr');
        const log = document.getElementById('dom-output-log');

        toggleBtn.onclick = () => {
            if (window.sounds) window.sounds.playClick();
            domAttr.className = 'text-success';
            domAttr.innerText = '/* disabled removed */';
            gateBtn.disabled = false;
            gateBtn.className = 'cyber-btn primary';
            gateBtn.innerText = '🔓 ISSUE PASS (UNLOCKED)';
            log.innerHTML = `<span class="text-success">[DOM MODIFIED] Client-side attribute stripped. Click 'ISSUE PASS' now!</span>`;
        };

        gateBtn.onclick = () => {
            if (gateBtn.disabled) return;
            if (window.sounds) window.sounds.playSuccess();
            log.innerHTML = `
                <div class="text-success">[+] VIP PASS AUTHORIZED!</div>
                <div>SESSION TOKEN: <span class="highlight-flag">CTF{client_side_validation_is_not_security}</span></div>
            `;
            document.getElementById('terminal-flag-input').value = 'CTF{client_side_validation_is_not_security}';
        };
    }

    // 3. Tier 1: Cryptography Decoder Tool
    renderCryptoTool(container) {
        container.innerHTML = `
            <div class="sim-box crypto-sim">
                <div class="sim-header">
                    <span>🔐 CYBERCHEF CIPHER DECODER</span>
                    <span>ALGORITHM: BASE64 + ROT13</span>
                </div>
                <div class="sim-body">
                    <div class="form-group">
                        <label>INPUT CIPHERTEXT:</label>
                        <input type="text" id="crypto-input" value="UEdTe2N5YmVyX2NyeXB0b19jaXBoZXJfbWFzdGVyfQ==">
                    </div>
                    <div class="btn-group">
                        <button class="cyber-btn primary" id="btn-decode-b64">1. DECODE BASE64</button>
                        <button class="cyber-btn" id="btn-decode-rot13">2. APPLY ROT13 DECRYPT</button>
                    </div>
                    <div class="form-group mt-3">
                        <label>OUTPUT BUFFER:</label>
                        <textarea id="crypto-output" rows="3" readonly></textarea>
                    </div>
                </div>
            </div>
        `;

        const inp = document.getElementById('crypto-input');
        const out = document.getElementById('crypto-output');

        document.getElementById('btn-decode-b64').onclick = () => {
            try {
                out.value = atob(inp.value.trim());
                if (window.sounds) window.sounds.playClick();
            } catch (e) {
                out.value = "Error: Invalid Base64 sequence!";
            }
        };

        document.getElementById('btn-decode-rot13').onclick = () => {
            const rot13 = (str) => str.replace(/[a-zA-Z]/g, c => {
                const base = c <= 'Z' ? 65 : 97;
                return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
            });
            out.value = rot13(out.value || inp.value.trim());
            if (out.value.includes('CTF{')) {
                if (window.sounds) window.sounds.playSuccess();
                document.getElementById('terminal-flag-input').value = out.value.trim();
            } else {
                if (window.sounds) window.sounds.playClick();
            }
        };
    }

    // 4. Tier 2: SCADA Power Grid Blackout Simulator
    renderScadaPowerGrid(container) {
        container.innerHTML = `
            <div class="sim-box scada-sim">
                <div class="sim-header text-danger">
                    <span>⚡ MUNICIPAL POWER SCADA // HIGH-VOLTAGE SUBSTATION</span>
                    <span class="status-online">● GRID SYNCED</span>
                </div>
                <div class="sim-body">
                    <p>Align the phase bus to <strong>60.0 Hz</strong> and master overload to <strong>440 kV</strong> to trip the main transformer breaker.</p>
                    
                    <div class="scada-controls-grid mt-3">
                        <div class="scada-knob-box">
                            <label>BUS FREQUENCY: <span id="scada-freq-val" class="cyber-cyan">52.4 Hz</span></label>
                            <input type="range" id="scada-freq-slider" min="45" max="75" step="0.5" value="52.4">
                        </div>
                        <div class="scada-knob-box">
                            <label>GRID VOLTAGE: <span id="scada-volt-val" class="cyber-yellow">320 kV</span></label>
                            <input type="range" id="scada-volt-slider" min="200" max="500" step="5" value="320">
                        </div>
                    </div>

                    <div class="mt-4 text-center">
                        <button class="cyber-btn danger lg" id="btn-scada-trip">⚠️ TRIP MASTER CIRCUIT BREAKER (BLACKOUT)</button>
                    </div>

                    <div id="scada-output-log" class="query-log-box mt-3">Substation telemetry nominal. Adjust parameters to overload...</div>
                </div>
            </div>
        `;

        const freqSlider = document.getElementById('scada-freq-slider');
        const voltSlider = document.getElementById('scada-volt-slider');
        const freqVal = document.getElementById('scada-freq-val');
        const voltVal = document.getElementById('scada-volt-val');
        const tripBtn = document.getElementById('btn-scada-trip');
        const log = document.getElementById('scada-output-log');

        freqSlider.oninput = () => { freqVal.innerText = `${freqSlider.value} Hz`; };
        voltSlider.oninput = () => { voltVal.innerText = `${voltSlider.value} kV`; };

        tripBtn.onclick = () => {
            const f = parseFloat(freqSlider.value);
            const v = parseFloat(voltSlider.value);

            if (Math.abs(f - 60.0) <= 1.0 && Math.abs(v - 440) <= 10) {
                if (window.world) window.world.triggerCityBlackout(true);
                log.innerHTML = `
                    <div class="text-danger">[CRITICAL ALARM] OVERLOAD TRIP EXECUTED!</div>
                    <div class="text-danger">[+] TRANSFORMER EXPLOSION INITIATED. CITY GRID BLACKED OUT.</div>
                    <div class="mt-2">INFRASTRUCTURE FLAG: <span class="highlight-flag">CTF{blackout_scada_grid_collapse_2026}</span></div>
                `;
                document.getElementById('terminal-flag-input').value = 'CTF{blackout_scada_grid_collapse_2026}';
            } else {
                if (window.sounds) window.sounds.playError();
                log.innerHTML = `<span class="text-warning">[-] Trip Rejected: Phase must be 60.0 Hz (current: ${f} Hz) and Voltage must be 440 kV (current: ${v} kV).</span>`;
            }
        };
    }

    // 5. Tier 2: SQL Injection Login Simulator
    renderWebLogin(container) {
        container.innerHTML = `
            <div class="sim-box web-sim">
                <div class="sim-header">
                    <span>🌐 NEXUS ADMIN PORTAL (HTTP/1.1)</span>
                    <span class="status-online">● ONLINE</span>
                </div>
                <div class="sim-body">
                    <div class="form-group">
                        <label>ADMIN USERNAME:</label>
                        <input type="text" id="sim-sqli-user" placeholder="admin" value="admin">
                    </div>
                    <div class="form-group">
                        <label>PASSWORD / TOKEN:</label>
                        <input type="password" id="sim-sqli-pass" placeholder="••••••••">
                    </div>
                    <button class="cyber-btn primary" id="sim-sqli-btn">LOGIN TO NEXUS</button>
                    <div id="sim-sqli-output" class="query-log-box mt-3">Ready for credentials...</div>
                </div>
            </div>
        `;

        const btn = document.getElementById('sim-sqli-btn');
        const userInp = document.getElementById('sim-sqli-user');
        const passInp = document.getElementById('sim-sqli-pass');
        const out = document.getElementById('sim-sqli-output');

        btn.onclick = () => {
            const user = userInp.value;
            const pass = passInp.value;
            const sql = `SELECT * FROM staff_users WHERE username = '${user}' AND password = '${pass}';`;
            
            const isInject = /('(\s*or\s*|\s*\|\|\s*)'?[0-9a-zA-Z]+'?\s*=\s*'?[0-9a-zA-Z]+'?|admin'|'\s*or\s*1\s*=\s*1|'\s*--|'#)/i.test(user);

            if (isInject) {
                if (window.sounds) window.sounds.playSuccess();
                out.innerHTML = `
                    <div class="text-success">[+] SQL QUERY EXECUTED:</div>
                    <div class="code-preview">${sql}</div>
                    <div class="text-success mt-2">✔ AUTHENTICATION BYPASSED! Administrator session token granted.</div>
                    <div class="flag-reveal mt-2">FLAG: <span class="highlight-flag">CTF{sql_inject_admin_bypass_2026}</span></div>
                `;
                document.getElementById('terminal-flag-input').value = "CTF{sql_inject_admin_bypass_2026}";
            } else {
                if (window.sounds) window.sounds.playError();
                out.innerHTML = `
                    <div class="text-danger">[-] SQL QUERY EXECUTED:</div>
                    <div class="code-preview">${sql}</div>
                    <div class="text-danger mt-2">✖ ACCESS DENIED: Invalid username or password hash.</div>
                `;
            }
        };
    }

    // 6. Tier 2: Network Packet Stream Forensics
    renderHexViewer(container) {
        const hexRows = [
            { offset: "0x0000", hex: "45 00 00 3c 1a 2b 40 00 40 06 b3 d1 c0 a8 01 0a", ascii: "E..<.+@.@.......", hint: false },
            { offset: "0x0010", hex: "c0 a8 01 01 9a 40 00 50 12 34 56 78 87 65 43 21", ascii: ".....@.P.4Vx.eC!", hint: false },
            { offset: "0x0020", hex: "50 18 01 f5 a2 c0 00 00 47 45 54 20 2f 61 70 69", ascii: "P.......GET /api", hint: false },
            { offset: "0x0030", hex: "2f 73 74 72 65 61 6d 20 48 54 54 50 2f 31 2e 31", ascii: "/stream HTTP/1.1", hint: false },
            { offset: "0x0040", hex: "0d 0a 48 6f 73 74 3a 20 62 75 6e 6b 65 72 2e 63", ascii: "..Host: bunker.c", hint: false },
            { offset: "0x0050", hex: "43 54 46 7b 77 69 72 65 73 68 61 72 6b 5f 70 61", ascii: "CTF{wireshark_pa", hint: true },
            { offset: "0x0060", hex: "63 6b 65 74 5f 68 65 78 5f 68 75 6e 74 65 72 5f", ascii: "cket_hex_hunter_", hint: true },
            { offset: "0x0070", hex: "39 39 7d 0d 0a 0d 0a 00 1f 8b 08 00 00 00 00 00", ascii: "99}.............", hint: true },
            { offset: "0x0080", hex: "03 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00", ascii: "................", hint: false }
        ];

        let html = `
            <div class="sim-box hex-sim">
                <div class="sim-header">
                    <span>🔍 RAW PCAP STREAM HEX VIEWER</span>
                    <span>TCP STREAM #4 (PORT 80)</span>
                </div>
                <div class="hex-filter-bar">
                    <input type="text" id="hex-search" placeholder="Search ASCII pattern (e.g. CTF)...">
                    <button class="cyber-btn sm" id="btn-hex-search">FILTER</button>
                </div>
                <div class="hex-grid-container" id="hex-grid">
        `;

        hexRows.forEach(r => {
            html += `
                <div class="hex-row ${r.hint ? 'highlight-row' : ''}">
                    <span class="hex-offset">${r.offset}</span>
                    <span class="hex-bytes">${r.hex}</span>
                    <span class="hex-ascii">${r.ascii}</span>
                </div>
            `;
        });

        html += `</div></div>`;
        container.innerHTML = html;

        document.getElementById('btn-hex-search').onclick = () => {
            const query = document.getElementById('hex-search').value.toLowerCase();
            document.querySelectorAll('.hex-row').forEach(row => {
                const ascii = row.querySelector('.hex-ascii').innerText.toLowerCase();
                row.classList.toggle('match', query && ascii.includes(query));
            });
            if (query.includes('ctf')) {
                document.getElementById('terminal-flag-input').value = 'CTF{wireshark_packet_hex_hunter_99}';
            }
        };
    }

    // 7. Tier 3: Skyway Broadcast Tower Spoof Simulator
    renderBroadcastSpoof(container) {
        container.innerHTML = `
            <div class="sim-box broadcast-sim">
                <div class="sim-header text-purple">
                    <span>📺 SKYWAY DIGITAL SIGNAGE TRANSMITTER</span>
                    <span>UDP MULTICAST PROTOCOL</span>
                </div>
                <div class="sim-body">
                    <p>Transmit an unauthenticated UDP multicast stream on port <strong>9940</strong> to address <strong>239.255.40.1</strong>.</p>
                    
                    <div class="form-group mt-3">
                        <label>MULTICAST GROUP IP:</label>
                        <input type="text" id="udp-ip" value="239.255.40.1">
                    </div>
                    <div class="form-group">
                        <label>TRANSMISSION PORT:</label>
                        <input type="text" id="udp-port" value="9940">
                    </div>
                    <div class="form-group">
                        <label>INJECTED MEDIA PAYLOAD:</label>
                        <input type="text" id="udp-payload" value="GHOSTBIT_TAKEOVER_OVERRIDE_STREAM_v4" readonly>
                    </div>

                    <button class="cyber-btn primary lg mt-2" id="btn-broadcast-hijack">🚀 INJECT MULTICAST STREAM (TAKEOVER BILLBOARDS)</button>
                    <div id="broadcast-output-log" class="query-log-box mt-3">Awaiting broadcast parameters...</div>
                </div>
            </div>
        `;

        const btn = document.getElementById('btn-broadcast-hijack');
        const log = document.getElementById('broadcast-output-log');

        btn.onclick = () => {
            const ip = document.getElementById('udp-ip').value.trim();
            const port = document.getElementById('udp-port').value.trim();

            if (ip === '239.255.40.1' && port === '9940') {
                if (window.world) window.world.triggerBillboardTakeover();
                if (window.sounds) window.sounds.playSuccess();
                log.innerHTML = `
                    <div class="text-success">[+] MULTICAST UDP PACKET INJECTED!</div>
                    <div class="text-success">[+] ALL CITY BILLBOARDS COMPROMISED WITH GHOSTBIT SIGNAL!</div>
                    <div class="mt-2">BROADCAST FLAG: <span class="highlight-flag">CTF{skyway_billboard_broadcast_hijacked}</span></div>
                `;
                document.getElementById('terminal-flag-input').value = 'CTF{skyway_billboard_broadcast_hijacked}';
            } else {
                if (window.sounds) window.sounds.playError();
                log.innerHTML = `<span class="text-danger">[-] Transmission Rejected: Check Multicast IP (239.255.40.1) and Port (9940).</span>`;
            }
        };
    }

    // 8. Tier 3: Advanced Linux Shell (SUID PrivEsc)
    renderLinuxShell(container) {
        container.innerHTML = `
            <div class="sim-box shell-sim">
                <div class="sim-header">
                    <span>🐧 BASH TERMINAL (guest@bunker-core:~)</span>
                    <span>SSH-2.0-OpenSSH_8.9p1</span>
                </div>
                <div class="shell-screen" id="adv-shell-output">
                    <div>Connected to bunker-core.local via SSH.</div>
                    <div>Type 'help' for command manual.</div>
                    <div>&nbsp;</div>
                </div>
                <div class="shell-input-line">
                    <span class="prompt-str" id="adv-prompt-str">guest@bunker-core:~$</span>
                    <input type="text" id="adv-shell-input" autocomplete="off" spellcheck="false" placeholder="sudo -l">
                </div>
            </div>
        `;

        const out = document.getElementById('adv-shell-output');
        const inp = document.getElementById('adv-shell-input');
        let isRoot = false;

        const runCmd = (cmd) => {
            const raw = cmd.trim();
            out.innerHTML += `<div><span class="prompt-str">${isRoot ? 'root@bunker-core:#' : 'guest@bunker-core:~$'}</span> ${raw}</div>`;
            if (window.sounds) window.sounds.playType();

            const parts = raw.split(' ').filter(Boolean);
            const base = parts[0] ? parts[0].toLowerCase() : '';

            if (base === 'help') {
                out.innerHTML += `<div>Commands: <code>sudo -l</code>, <code>find / -perm -4000 2>/dev/null</code>, <code>cat /etc/shadow.bak</code>, <code>whoami</code>, <code>id</code>, <code>clear</code></div>`;
            } else if (base === 'whoami') {
                out.innerHTML += `<div>${isRoot ? 'root' : 'guest'}</div>`;
            } else if (base === 'id') {
                out.innerHTML += `<div>${isRoot ? 'uid=0(root) gid=0(root) groups=0(root)' : 'uid=1001(guest) gid=1001(guest) groups=1001(guest)'}</div>`;
            } else if (base === 'clear') {
                out.innerHTML = '';
            } else if (raw.includes('sudo -l')) {
                out.innerHTML += `
                    <div>Matching Defaults entries for guest:</div>
                    <div>User guest may run the following commands on bunker-core:</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;(ALL : ALL) NOPASSWD: <strong class="text-success">/usr/bin/find</strong></div>
                `;
            } else if (raw.includes('/etc/shadow.bak') || raw.includes('/etc/shadow')) {
                out.innerHTML += `
                    <div>root:$6$cyber2026$pwnedRootHashMasterSequence:19000:0:99999:7:::</div>
                    <div>guest:$6$guestSalt$guestHashSequence:19000:0:99999:7:::</div>
                `;
            } else if (raw.includes('find') && (raw.includes('-exec') || raw.includes('/root') || raw.includes('sh'))) {
                isRoot = true;
                document.getElementById('adv-prompt-str').innerText = 'root@bunker-core:#';
                document.getElementById('adv-prompt-str').className = 'prompt-str text-danger';
                out.innerHTML += `
                    <div class="text-success">[!] SUID / SUDO EXPLOIT TRIGGERED! Spawning root shell...</div>
                    <div class="text-success">root@bunker-core:# cat /root/flag.txt</div>
                    <div class="flag-reveal mt-2">FLAG: <span class="highlight-flag">CTF{linux_priv_esc_root_pwned_77}</span></div>
                `;
                document.getElementById('terminal-flag-input').value = 'CTF{linux_priv_esc_root_pwned_77}';
            } else {
                out.innerHTML += `<div class="text-dim">Command executed. Try: sudo -l or find -exec sh.</div>`;
            }

            out.scrollTop = out.scrollHeight;
            inp.value = '';
        };

        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') runCmd(inp.value);
        });
    }

    // 9. Tier 3: Password Hash Cracker Simulator
    renderHashCracker(container) {
        container.innerHTML = `
            <div class="sim-box hash-sim">
                <div class="sim-header text-yellow">
                    <span>⛏️ HASHCAT GPU PASSWORD CRACKER v6.2</span>
                    <span>ALGORITHM: MD5 ($m=0)</span>
                </div>
                <div class="sim-body">
                    <div class="form-group">
                        <label>TARGET MD5 HASH:</label>
                        <input type="text" id="hash-target" value="5f4dcc3b5aa765d61d8327deb882cf99" readonly>
                    </div>
                    <div class="form-group">
                        <label>WORDLIST DICTIONARY:</label>
                        <select id="hash-wordlist" class="cyber-select">
                            <option value="rockyou">rockyou.txt (14,344,392 words)</option>
                            <option value="top1000">top-1000-passwords.txt</option>
                        </select>
                    </div>
                    <button class="cyber-btn primary" id="btn-run-hashcat">⚡ LAUNCH DICTIONARY CRACK</button>
                    <div id="hashcat-log" class="query-log-box mt-3">Hashcat ready. Click launch to initialize GPU compute...</div>
                </div>
            </div>
        `;

        const btn = document.getElementById('btn-run-hashcat');
        const log = document.getElementById('hashcat-log');

        btn.onclick = () => {
            log.innerHTML = `<div>[+] Initializing OpenCL compute kernel...</div><div>[+] Testing candidate passwords: 1,420,000 H/s...</div>`;
            if (window.sounds) window.sounds.playType();

            setTimeout(() => {
                if (window.sounds) window.sounds.playSuccess();
                log.innerHTML = `
                    <div class="text-success">[!] HASH MATCH FOUND:</div>
                    <div class="code-preview">5f4dcc3b5aa765d61d8327deb882cf99 : password</div>
                    <div class="text-success mt-2">✔ Plainspeech match verified against rockyou dictionary!</div>
                    <div class="mt-2">FLAG: <span class="highlight-flag">CTF{hashcat_rockyou_rainbow_cracked}</span></div>
                `;
                document.getElementById('terminal-flag-input').value = 'CTF{hashcat_rockyou_rainbow_cracked}';
            }, 800);
        };
    }

    // 10. Tier 4: Cross-Site Scripting (XSS) Simulator
    renderWebXSS(container) {
        container.innerHTML = `
            <div class="sim-box web-sim">
                <div class="sim-header">
                    <span>💉 EXECUTIVE PORTAL COMMENT BOARD (XSS LAB)</span>
                    <span class="status-online">● ADMIN BOT AUDITING</span>
                </div>
                <div class="sim-body">
                    <p class="text-dim">Comments submitted below are reviewed by an automated administrator bot in real-time. Test for Stored XSS payload vulnerabilities.</p>
                    
                    <div class="form-group mt-3">
                        <label>SUBMIT COMMENT:</label>
                        <input type="text" id="xss-input" placeholder="<script>fetch('/log?c='+document.cookie)</script>">
                    </div>
                    <button class="cyber-btn primary" id="btn-submit-xss">POST COMMENT TO BOARD</button>

                    <div class="comment-board-feed mt-3" id="xss-feed">
                        <div class="comment-item"><strong>Admin_CEO:</strong> Please post operational feedback here.</div>
                    </div>

                    <div id="xss-bot-log" class="query-log-box mt-3">Admin bot waiting for new comments...</div>
                </div>
            </div>
        `;

        const btn = document.getElementById('btn-submit-xss');
        const inp = document.getElementById('xss-input');
        const feed = document.getElementById('xss-feed');
        const log = document.getElementById('xss-bot-log');

        btn.onclick = () => {
            const val = inp.value.trim();
            if (!val) return;

            feed.innerHTML += `<div class="comment-item user"><strong>You:</strong> ${val.replace(/</g, '&lt;')}</div>`;
            log.innerHTML = `<div>[BOT] Auditing new comment ID #4092...</div>`;
            inp.value = '';

            const isXSS = /<script|onerror|onload|javascript:|document\.cookie/i.test(val);

            setTimeout(() => {
                if (isXSS) {
                    if (window.sounds) window.sounds.playSuccess();
                    log.innerHTML = `
                        <div class="text-success">[!] XSS EXECUTION CONFIRMED IN ADMIN BROWSER!</div>
                        <div class="text-success">[+] LEAKED COOKIE: session_token=CTF{stored_xss_session_hijack_pwned}</div>
                    `;
                    document.getElementById('terminal-flag-input').value = 'CTF{stored_xss_session_hijack_pwned}';
                } else {
                    log.innerHTML = `<span class="text-dim">[BOT] Comment audited. No script execution detected. Try injecting an XSS payload!</span>`;
                }
            }, 600);
        };
    }

    // 11. Tier 4: Reverse Engineering Keygen
    renderRevKeygen(container) {
        container.innerHTML = `
            <div class="sim-box rev-sim">
                <div class="sim-header">
                    <span>⚡ QUANTUM SERIAL KEYGEN VALIDATOR</span>
                    <span>TARGET: CYBER-7701-YYYY</span>
                </div>
                <div class="sim-body">
                    <div class="form-group">
                        <label>ENTER SERIAL KEY (CYBER-XXXX-YYYY):</label>
                        <input type="text" id="rev-key-input" placeholder="CYBER-7701-9946">
                    </div>
                    <button class="cyber-btn primary" id="btn-validate-key">VERIFY SERIAL KEY</button>
                    <div id="rev-output-log" class="query-log-box mt-3">Awaiting serial key input...</div>
                </div>
            </div>
        `;

        const btn = document.getElementById('btn-validate-key');
        const inp = document.getElementById('rev-key-input');
        const log = document.getElementById('rev-output-log');

        btn.onclick = () => {
            const key = inp.value.trim();
            const parts = key.split('-');

            if (parts.length === 3 && parts[0] === 'CYBER' && parseInt(parts[1]) === 7701 && (parseInt(parts[2]) ^ 42) === 9920) {
                if (window.sounds) window.sounds.playSuccess();
                log.innerHTML = `
                    <div class="text-success">[+] SERIAL KEY AUTHENTICATED! Logic constraints satisfied.</div>
                    <div class="flag-reveal mt-2">FLAG: <span class="highlight-flag">CTF{quantum_rev_keygen_cracked_88}</span></div>
                `;
                document.getElementById('terminal-flag-input').value = 'CTF{quantum_rev_keygen_cracked_88}';
            } else {
                if (window.sounds) window.sounds.playError();
                log.innerHTML = `<span class="text-danger">[-] INVALID SERIAL KEY: Decompile logic specifies (num2 ^ 42) === 9920. Calculate 9920 ^ 42!</span>`;
            }
        };
    }

    // 12. Tier 4: Omega Core Mainframe
    renderBossCore(container) {
        const score = window.challengeManager.score;
        const required = 600;

        if (score < required) {
            container.innerHTML = `
                <div class="sim-box boss-locked-sim">
                    <div class="sim-header text-danger">
                        <span>⛔ DEFENSE LASER MATRIX ACTIVE</span>
                    </div>
                    <div class="sim-body text-center">
                        <div class="laser-warning-icon">⚡⚡⚡</div>
                        <h3 class="text-danger">CLEARANCE LEVEL INSUFFICIENT</h3>
                        <p>The Omega Supercomputer requires at least <strong>${required} Points</strong> to shut down the high-voltage laser field.</p>
                        <div class="progress-bar-wrapper mt-3">
                            <div class="progress-bar-fill" style="width: ${Math.min(100, (score / required) * 100)}%;"></div>
                        </div>
                        <p class="mt-2 text-dim">Current Points: <strong>${score} / ${required}</strong></p>
                        <p class="text-warning mt-2">Solve challenges across Tier 1, 2, and 3 stations to acquire clearance.</p>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="sim-box boss-unlocked-sim">
                    <div class="sim-header text-success">
                        <span>👑 OMEGA CORE MAINFRAME OVERRIDE</span>
                        <span>CLEARANCE AUTHORIZED</span>
                    </div>
                    <div class="sim-body text-center">
                        <p class="text-success">✔ Laser barriers deactivated! Facility master controls exposed.</p>
                        <button class="cyber-btn primary lg mt-3" id="btn-override-core">TRIGGER SYSTEM OVERRIDE PROTOCOL</button>
                        <div id="boss-override-log" class="query-log-box mt-3 text-left">Awaiting master override command...</div>
                    </div>
                </div>
            `;

            const btn = document.getElementById('btn-override-core');
            const log = document.getElementById('boss-override-log');

            btn.onclick = () => {
                if (window.sounds) window.sounds.playSuccess();
                if (window.confetti) {
                    window.confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
                }
                log.innerHTML = `
                    <div class="text-success">[+] MASTER OVERRIDE EXECUTED!</div>
                    <div class="text-success">[+] METROPOLIS LIBERATED. ALL NEXUS VAULTS NEUTRALIZED.</div>
                    <div class="flag-reveal mt-3">
                        FINAL MASTER FLAG:<br>
                        <span class="highlight-flag">CTF{omega_core_master_mainframe_neutralized_2026}</span>
                    </div>
                `;
                document.getElementById('terminal-flag-input').value = 'CTF{omega_core_master_mainframe_neutralized_2026}';
            };
        }
    }

    // 13. Decoy Proxy Heat Purge Node
    renderProxyDecoy(container) {
        container.innerHTML = `
            <div class="sim-box proxy-sim">
                <div class="sim-header text-success">
                    <span>📡 COUNTER-SURVEILLANCE DECOY PROXY</span>
                    <span>ALLEYWAY RELAY #09</span>
                </div>
                <div class="sim-body text-center">
                    <p>Current Police Wanted Heat: <strong class="text-danger">${window.challengeManager.wantedLevel} Stars</strong></p>
                    <button class="cyber-btn primary lg mt-3" id="btn-purge-heat-tool">🛡️ PURGE TRACE // CANCEL POLICE PURSUIT</button>
                    <div id="decoy-purge-log" class="query-log-box mt-3 text-left">Node ready to broadcast spoofed telemetry...</div>
                </div>
            </div>
        `;

        document.getElementById('btn-purge-heat-tool').onclick = () => {
            window.challengeManager.purgeHeat();
            document.getElementById('decoy-purge-log').innerHTML = `<span class="text-success">✔ Telemetry scrambled. Police pursuit cancelled! Heat = 0 Stars.</span>`;
        };
    }
}

window.terminalUI = new TerminalUIManager();
