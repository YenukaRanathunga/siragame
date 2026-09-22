// Interactive Hacker Terminal UI & Challenge Mini-Games

class TerminalUIManager {
    constructor() {
        this.activeChallenge = null;
        this.linuxHistory = [];
        this.historyIndex = -1;
        this.shellDir = '/home/guest';
    }

    openTerminal(challengeId) {
        const ch = window.challengeManager.getChallenge(challengeId);
        if (!ch) return;

        this.activeChallenge = ch;
        if (window.sounds) window.sounds.playInteract();

        const modal = document.getElementById('terminal-modal');
        const title = document.getElementById('terminal-title');
        const badge = document.getElementById('terminal-category-badge');
        const points = document.getElementById('terminal-points-badge');
        const briefing = document.getElementById('terminal-briefing-content');
        const targetContainer = document.getElementById('terminal-interactive-container');
        const flagInput = document.getElementById('terminal-flag-input');
        const flagResult = document.getElementById('terminal-flag-result');
        const hintContent = document.getElementById('terminal-hint-content');

        // Populate header
        title.innerText = ch.title;
        badge.innerText = ch.category;
        badge.style.borderColor = ch.color;
        badge.style.color = ch.color;
        points.innerText = `+${ch.points} PTS`;

        // Populate briefing & hint
        briefing.innerHTML = ch.briefing;
        hintContent.innerHTML = ch.hint;

        // Reset inputs
        flagInput.value = ch.solved ? ch.flag : '';
        flagResult.className = 'flag-result-box';
        flagResult.innerHTML = ch.solved 
            ? `<span class="text-success">✔ [COMPLETED] Station already pwned. Points secured: +${ch.points}</span>` 
            : '';

        // Render specific interactive station tool
        this.renderInteractiveTool(ch, targetContainer);

        // Switch to briefing tab by default
        this.switchTab('briefing');

        // Show modal
        modal.classList.remove('hidden');
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

        document.getElementById('tab-briefing').classList.toggle('hidden', tabName !== 'briefing');
        document.getElementById('tab-target').classList.toggle('hidden', tabName !== 'target');
        document.getElementById('tab-hints').classList.toggle('hidden', tabName !== 'hints');

        if (window.sounds) window.sounds.playClick();
    }

    renderInteractiveTool(ch, container) {
        container.innerHTML = '';

        switch (ch.interactiveType) {
            case 'web-login':
                this.renderWebLogin(container);
                break;
            case 'crypto-tool':
                this.renderCryptoTool(container);
                break;
            case 'linux-shell':
                this.renderLinuxShell(container);
                break;
            case 'hex-viewer':
                this.renderHexViewer(container);
                break;
            case 'rev-keygen':
                this.renderRevKeygen(container);
                break;
            case 'boss-core':
                this.renderBossCore(container);
                break;
            default:
                container.innerHTML = '<p class="text-dim">No interactive simulator needed. Analyze the briefing and submit flag.</p>';
        }
    }

    // 1. Web SQL Injection Simulator
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

        const executeSqli = () => {
            const u = userInp.value.trim();
            const p = passInp.value.trim();
            if (window.sounds) window.sounds.playType();

            // SQL Injection detection logic
            const isSqli = u.toLowerCase().includes("' or '1'='1") || 
                           u.toLowerCase().includes("' or 1=1") || 
                           u.toLowerCase().includes("admin' --") || 
                           u.toLowerCase().includes("' or 'a'='a") ||
                           u.includes("' OR '1'='1'");

            if (isSqli) {
                if (window.sounds) window.sounds.playSuccess();
                out.innerHTML = `
                    <div class="text-success">[+] SQL QUERY EXECUTED:</div>
                    <code>SELECT * FROM staff_users WHERE username = '${u}' AND password = '${p}';</code>
                    <div class="text-success mt-2"><strong>✔ AUTHENTICATION BYPASS SUCCESSFUL!</strong> Welcome Master Administrator.</div>
                    <div class="flag-reveal mt-2">
                        FLAG TOKEN: <span class="highlight-flag">CTF{sql_inject_admin_bypass_2026}</span>
                        <button class="cyber-btn sm" onclick="navigator.clipboard.writeText('CTF{sql_inject_admin_bypass_2026}'); alert('Flag copied to clipboard!');">COPY</button>
                    </div>
                `;
            } else {
                if (window.sounds) window.sounds.playError();
                out.innerHTML = `
                    <div class="text-danger">[-] SQL QUERY EXECUTED:</div>
                    <code>SELECT * FROM staff_users WHERE username = '${u}' AND password = '${p}';</code>
                    <div class="text-danger mt-1">[-] AUTHENTICATION FAILED: Invalid username or password hash.</div>
                `;
            }
        };

        btn.addEventListener('click', executeSqli);
        userInp.addEventListener('keypress', (e) => { if (e.key === 'Enter') executeSqli(); });
        passInp.addEventListener('keypress', (e) => { if (e.key === 'Enter') executeSqli(); });
    }

    // 2. Cryptography Decoder Tool
    renderCryptoTool(container) {
        container.innerHTML = `
            <div class="sim-box crypto-sim">
                <div class="sim-header">
                    <span>🔐 CYPHER-DECK DECRYPTION SUITE</span>
                </div>
                <div class="sim-body">
                    <label>INPUT CIPHERTEXT:</label>
                    <textarea id="crypto-input" rows="3" class="code-area">UEdTe3Bsb3JlX3BlbGNnYl9wdmN1cmVfem5mZ3JlZX0=</textarea>
                    
                    <div class="btn-group mt-2">
                        <button class="cyber-btn sm" id="btn-b64-decode">DECODE BASE64</button>
                        <button class="cyber-btn sm" id="btn-rot13">APPLY ROT13</button>
                        <button class="cyber-btn sm" id="btn-hex-decode">HEX TO ASCII</button>
                        <button class="cyber-btn sm danger" id="btn-reset-crypto">RESET</button>
                    </div>

                    <label class="mt-3">OUTPUT STREAM:</label>
                    <div id="crypto-output" class="crypto-output-box">Press a decryption algorithm above...</div>
                </div>
            </div>
        `;

        const input = document.getElementById('crypto-input');
        const output = document.getElementById('crypto-output');

        document.getElementById('btn-b64-decode').onclick = () => {
            if (window.sounds) window.sounds.playType();
            try {
                const res = atob(input.value.trim());
                output.innerHTML = `<span class="text-success">[BASE64 DECODED]:</span> <strong>${res}</strong>`;
                input.value = res;
            } catch (e) {
                output.innerHTML = `<span class="text-danger">[-] Base64 Decode Error: Invalid base64 sequence.</span>`;
            }
        };

        document.getElementById('btn-rot13').onclick = () => {
            if (window.sounds) window.sounds.playType();
            const text = input.value;
            const res = text.replace(/[a-zA-Z]/g, (c) => {
                const base = c <= 'Z' ? 65 : 97;
                return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
            });
            output.innerHTML = `<span class="text-success">[ROT13 APPLIED]:</span> <strong>${res}</strong>`;
            input.value = res;
        };

        document.getElementById('btn-hex-decode').onclick = () => {
            if (window.sounds) window.sounds.playType();
            try {
                const hex = input.value.replace(/\s+/g, '');
                let str = '';
                for (let i = 0; i < hex.length; i += 2) {
                    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
                }
                output.innerHTML = `<span class="text-success">[HEX DECODED]:</span> <strong>${str}</strong>`;
                input.value = str;
            } catch (e) {
                output.innerHTML = `<span class="text-danger">[-] Hex Decode Error</span>`;
            }
        };

        document.getElementById('btn-reset-crypto').onclick = () => {
            input.value = 'UEdTe3Bsb3JlX3BlbGNnYl9wdmN1cmVfem5mZ3JlZX0=';
            output.innerText = 'Reset to original captured ciphertext.';
        };
    }

    // 3. Linux Terminal Shell Simulator
    renderLinuxShell(container) {
        container.innerHTML = `
            <div class="sim-box shell-sim">
                <div class="sim-header">
                    <span>🐧 BASH // guest@bunker-core:~</span>
                    <span>SSH-2.0-OpenSSH_9.2</span>
                </div>
                <div id="shell-terminal-window" class="shell-window">
                    <div class="shell-line">Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-31-generic x86_64)</div>
                    <div class="shell-line">* Bunker internal node: vortex-alpha</div>
                    <div class="shell-line">* Type 'help' for available commands.</div>
                    <div id="shell-output-stream"></div>
                    <div class="shell-prompt-line">
                        <span class="shell-prompt">guest@bunker-core:~$</span>
                        <input type="text" id="shell-cli-input" autofocus autocomplete="off" spellcheck="false">
                    </div>
                </div>
            </div>
        `;

        const input = document.getElementById('shell-cli-input');
        const stream = document.getElementById('shell-output-stream');
        const termWindow = document.getElementById('shell-terminal-window');

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                input.value = '';
                if (!cmd) return;

                if (window.sounds) window.sounds.playType();

                // Echo typed command
                const echoDiv = document.createElement('div');
                echoDiv.className = 'shell-line';
                echoDiv.innerHTML = `<span class="shell-prompt">guest@bunker-core:~$</span> ${cmd}`;
                stream.appendChild(echoDiv);

                // Handle command execution
                this.executeLinuxCommand(cmd, stream);

                // Scroll to bottom
                termWindow.scrollTop = termWindow.scrollHeight;
            }
        });
    }

    executeLinuxCommand(cmd, stream) {
        const out = document.createElement('div');
        out.className = 'shell-output';

        const parts = cmd.split(' ').filter(Boolean);
        const base = parts[0].toLowerCase();

        switch (base) {
            case 'help':
                out.innerHTML = `
Commands available:
  ls [-la]             List directory contents
  cat &lt;file&gt;         Concatenate and display file
  cd &lt;dir&gt;           Change directory
  pwd                 Print working directory
  sudo -l             List permitted sudo privileges
  sudo &lt;command&gt;      Execute a command with root privileges
  whoami              Print effective user ID
  id                  Print user and group IDs
  find &lt;path&gt;         Search for files in directory hierarchy
  clear               Clear screen terminal
                `;
                break;
            case 'clear':
                stream.innerHTML = '';
                return;
            case 'whoami':
                out.innerText = 'guest';
                break;
            case 'id':
                out.innerText = 'uid=1001(guest) gid=1001(guest) groups=1001(guest)';
                break;
            case 'pwd':
                out.innerText = this.shellDir;
                break;
            case 'ls':
                if (this.shellDir === '/home/guest') {
                    out.innerHTML = `notes.txt   tools/   backup/`;
                } else if (this.shellDir === '/var/backups') {
                    out.innerHTML = `apt.extended_states   shadow_flag.bak`;
                } else if (this.shellDir === '/root') {
                    out.innerHTML = `<span class="text-danger">ls: cannot open directory '/root': Permission denied</span>`;
                } else {
                    out.innerHTML = `bin   etc   home   root   usr   var`;
                }
                break;
            case 'cd':
                const target = parts[1] || '~';
                if (target === '~' || target === '/home/guest') {
                    this.shellDir = '/home/guest';
                } else if (target === '/var/backups' || target === 'backup') {
                    this.shellDir = '/var/backups';
                } else if (target === '/root') {
                    out.innerHTML = `<span class="text-danger">bash: cd: /root: Permission denied</span>`;
                } else {
                    out.innerHTML = `bash: cd: ${target}: No such directory or restricted`;
                }
                break;
            case 'cat':
                const file = parts[1];
                if (!file) {
                    out.innerText = 'cat: missing operand';
                } else if (file === 'notes.txt') {
                    out.innerHTML = `[SYSADMIN NOTE]: Root left an unshadowed security backup in /var/backups/shadow_flag.bak for emergency failover.`;
                } else if (file === 'shadow_flag.bak' || file === '/var/backups/shadow_flag.bak') {
                    out.innerHTML = `
root:$6$cyberSalt$hash...:19420:0:99999:7:::
guest:$6$guestSalt$hash...:19420:0:99999:7:::
<span class="text-success">FLAG: CTF{linux_priv_esc_root_pwned_77}</span>
                    `;
                } else if (file.includes('/root/flag.txt')) {
                    out.innerHTML = `<span class="text-danger">cat: /root/flag.txt: Permission denied</span>`;
                } else {
                    out.innerText = `cat: ${file}: No such file or directory`;
                }
                break;
            case 'sudo':
                if (parts[1] === '-l') {
                    out.innerHTML = `
Matching Defaults entries for guest on bunker-core:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin

User guest may run the following commands on bunker-core:
    (root) NOPASSWD: /usr/bin/cat /root/flag.txt
                    `;
                } else if (parts[1] === 'cat' && parts[2] === '/root/flag.txt') {
                    out.innerHTML = `<span class="text-success">[ROOT PRIVILEGE GRANTED]:\nCTF{linux_priv_esc_root_pwned_77}</span>`;
                } else {
                    out.innerHTML = `sudo: ${parts.slice(1).join(' ')}: command not allowed for user guest`;
                }
                break;
            case 'find':
                out.innerHTML = `
/home/guest/notes.txt
/var/backups/shadow_flag.bak
/root/flag.txt (Permission denied)
                `;
                break;
            default:
                out.innerHTML = `bash: ${base}: command not found. Type 'help'.`;
        }

        stream.appendChild(out);
    }

    // 4. Forensics Hex Viewer
    renderHexViewer(container) {
        container.innerHTML = `
            <div class="sim-box hex-sim">
                <div class="sim-header">
                    <span>🔍 RAW TCP PACKET STREAM (PCAP EXCERPT)</span>
                    <input type="text" id="hex-search-input" placeholder="Search string..." class="search-hex-input">
                </div>
                <div class="hex-viewer-body" id="hex-dump-content">
                    <pre class="hex-stream">
OFFSET   00 01 02 03 04 05 06 07  08 09 0A 0B 0C 0D 0E 0F  ASCII
-----------------------------------------------------------------------
0x0000   45 00 00 54 a1 f2 40 00  40 06 72 3b c0 a8 01 64  E..T..@.@.r;...d
0x0010   c0 a8 01 01 1f 90 00 50  b2 c3 4d 1a 00 00 00 00  .......P..M.....
0x0020   80 18 01 f5 fe 2a 00 00  01 01 08 0a 31 a2 c8 11  .....*......1...
0x0030   50 4f 53 54 20 2f 61 70  69 2f 74 65 6c 65 6d 20  POST /api/telem 
0x0040   48 54 54 50 2f 31 2e 31  0d 0a 48 6f 73 74 3a 20  HTTP/1.1..Host: 
<span class="hex-highlight-row">0x0050   43 54 46 7b 77 69 72 65  73 68 61 72 6b 5f 70 61  CTF{wireshark_pa</span>
<span class="hex-highlight-row">0x0060   63 6b 65 74 5f 68 65 78  5f 68 75 6e 74 65 72 5f  cket_hex_hunter_</span>
<span class="hex-highlight-row">0x0070   39 39 7d 0d 0a 0d 0a 00  00 00 00 00 00 00 00 00  99}.............</span>
                    </pre>
                </div>
                <div class="mt-2 text-dim text-sm">
                    Flag extracted from packet payload offset 0x0050 to 0x0072.
                </div>
            </div>
        `;

        const search = document.getElementById('hex-search-input');
        search.addEventListener('input', () => {
            if (window.sounds) window.sounds.playType();
            const val = search.value.trim().toLowerCase();
            const rows = document.querySelectorAll('.hex-highlight-row');
            rows.forEach(r => {
                if (val && r.innerText.toLowerCase().includes(val)) {
                    r.style.backgroundColor = 'rgba(255, 0, 127, 0.4)';
                    r.style.color = '#fff';
                } else {
                    r.style.backgroundColor = '';
                    r.style.color = '';
                }
            });
        });
    }

    // 5. Reverse Engineering Keygen Validator
    renderRevKeygen(container) {
        container.innerHTML = `
            <div class="sim-box rev-sim">
                <div class="sim-header">
                    <span>⚡ QUANTUM SERIAL KEY VALIDATOR</span>
                </div>
                <div class="sim-body">
                    <p class="text-sm">Input the calculated license key format: <code>CYBER-XXXX-YYYY</code></p>
                    <div class="form-group">
                        <label>SERIAL LICENSE KEY:</label>
                        <input type="text" id="rev-serial-input" placeholder="CYBER-7701-????" value="CYBER-7701-">
                    </div>
                    <button class="cyber-btn primary" id="rev-verify-btn">VERIFY SERIAL KEY</button>
                    <div id="rev-result-log" class="query-log-box mt-3">Awaiting license key input...</div>
                </div>
            </div>
        `;

        const input = document.getElementById('rev-serial-input');
        const btn = document.getElementById('rev-verify-btn');
        const log = document.getElementById('rev-result-log');

        const verifyKey = () => {
            const key = input.value.trim();
            if (window.sounds) window.sounds.playType();

            const parts = key.split('-');
            if (parts.length !== 3 || parts[0] !== 'CYBER') {
                log.innerHTML = `<span class="text-danger">[-] Invalid Format. Expected: CYBER-XXXX-YYYY</span>`;
                if (window.sounds) window.sounds.playError();
                return;
            }

            const num1 = parseInt(parts[1]);
            const num2 = parseInt(parts[2]);

            if (num1 === 7701 && (num2 ^ 42) === 9920) {
                if (window.sounds) window.sounds.playSuccess();
                log.innerHTML = `
                    <div class="text-success">[+] VALIDATION CHECK PASSED!</div>
                    <div>Part 1: 7701 == 7701 (VERIFIED)</div>
                    <div>Part 2: (${num2} XOR 42) == 9920 (VERIFIED)</div>
                    <div class="flag-reveal mt-2">
                        FLAG: <span class="highlight-flag">CTF{quantum_rev_keygen_cracked_88}</span>
                    </div>
                `;
            } else {
                if (window.sounds) window.sounds.playError();
                log.innerHTML = `<span class="text-danger">[-] CHECKSUM MISMATCH: Mathematical constraint failed. Check the pseudo-code hint!</span>`;
            }
        };

        btn.onclick = verifyKey;
        input.onkeypress = (e) => { if (e.key === 'Enter') verifyKey(); };
    }

    // 6. Boss Central Mainframe
    renderBossCore(container) {
        const score = window.challengeManager.score;
        const required = 500;
        const isUnlocked = score >= required;

        if (!isUnlocked) {
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
                        <p class="text-warning mt-2">Solve challenges at Stations 1 through 5 to gain sufficient clearance.</p>
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
                    window.confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                }
                log.innerHTML = `
                    <div class="text-success">[+] MASTER OVERRIDE EXECUTED!</div>
                    <div class="text-success">[+] FACILITY SECURED. ALL DATA VAULTS DUMPED.</div>
                    <div class="flag-reveal mt-3">
                        FINAL MASTER FLAG:<br>
                        <span class="highlight-flag">CTF{omega_core_master_mainframe_neutralized_2026}</span>
                    </div>
                `;
            };
        }
    }
}

window.terminalUI = new TerminalUIManager();
