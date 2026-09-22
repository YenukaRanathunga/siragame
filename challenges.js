// CTF Challenges Database & Verification Engine

window.CHALLENGES_DATA = [
    {
        id: "station-web",
        title: "Station 01: Nexus Portal Auth Bypass",
        category: "Web Exploitation",
        points: 100,
        color: "#00f0ff",
        threeColor: 0x00f0ff,
        icon: "🌐",
        pos: { x: -14, z: -10 },
        flag: "CTF{sql_inject_admin_bypass_2026}",
        solved: false,
        summary: "Bypass the internal administrative authorization portal via SQL Injection vulnerability.",
        briefing: `
            <h3>[ TARGET: NEXUS ACCESS CONTROL ]</h3>
            <p>The facility's administrative gateway is running a legacy authentication script. Vulnerability scanners indicate unsanitized user inputs in the authorization query:</p>
            <pre class="code-block">SELECT * FROM staff_users WHERE username = '$user' AND password = '$password';</pre>
            <p><strong>OBJECTIVE:</strong> Bypass the login screen without knowing the administrator's password to gain root authorization token.</p>
        `,
        interactiveType: "web-login",
        hint: "Try universal SQL injection payloads in the username field such as: <code>admin' OR '1'='1' --</code> or <code>' OR 1=1#</code>"
    },
    {
        id: "station-crypto",
        title: "Station 02: Enigma Crypt-Vault",
        category: "Cryptography",
        points: 150,
        color: "#ffb703",
        threeColor: 0xffb703,
        icon: "🔐",
        pos: { x: 14, z: -10 },
        flag: "CTF{cyber_crypto_cipher_master}",
        solved: false,
        summary: "Decode a military intercepted multi-stage encrypted transmission (ROT13 + Base64).",
        briefing: `
            <h3>[ INTERCEPTED TRANSMISSION: FREQ 142.85 MHz ]</h3>
            <p>An encrypted satellite packet was captured from the bunker's uplink transceiver. The payload was scrambled using a two-stage cipher:</p>
            <div class="crypto-box">
                <span class="label">INTERCEPTED CYPHERTEXT:</span>
                <div class="ciphertext-text">UEdTe3Bsb3JlX3BlbGNnYl9wdmN1cmVfem5mZ3JlZX0=</div>
            </div>
            <p><strong>ANALYSIS:</strong> Intelligence reports indicate the raw flag was first rotated using the ancient ROT13 cipher, and then encoded into standard Base64 representation.</p>
        `,
        interactiveType: "crypto-tool",
        hint: "First decode the Base64 string into text, then apply ROT13 (shift 13 alphabet characters) on the result!"
    },
    {
        id: "station-linux",
        title: "Station 03: Vortex Linux Terminal",
        category: "Linux / PrivEsc",
        points: 200,
        color: "#00ff66",
        threeColor: 0x00ff66,
        icon: "🐧",
        pos: { x: -16, z: 12 },
        flag: "CTF{linux_priv_esc_root_pwned_77}",
        solved: false,
        summary: "Interact with a real simulated Linux shell, inspect restricted directories, and escalate privileges.",
        briefing: `
            <h3>[ SECURE BASH SHELL ACCESS: SESSION #4029 ]</h3>
            <p>You have connected via SSH as unprivileged user <code>guest@bunker-core</code>. Root permissions are required to access <code>/root/flag.txt</code>.</p>
            <p>Use the interactive terminal below to explore the file system, check sudo permissions, or inspect backup archives.</p>
        `,
        interactiveType: "linux-shell",
        hint: "Type <code>help</code> to see commands. Check <code>sudo -l</code>, inspect <code>/var/backups</code> or view <code>/etc/shadow.bak</code>!"
    },
    {
        id: "station-forensics",
        title: "Station 04: Packet Stream Forensics",
        category: "Digital Forensics",
        points: 250,
        color: "#ff007f",
        threeColor: 0xff007f,
        icon: "🔍",
        pos: { x: 16, z: 12 },
        flag: "CTF{wireshark_packet_hex_hunter_99}",
        solved: false,
        summary: "Analyze raw packet stream hex dumps to locate hidden transmission signatures.",
        briefing: `
            <h3>[ RAW NETWORK STREAM CAPTURE ]</h3>
            <p>A covert telemetry stream was dumped from network interface <code>eth0</code> during an intrusion attempt. A hidden authentication token is buried inside the TCP data payload.</p>
            <p>Inspect the hexadecimal and ASCII stream dump below to uncover the exfiltrated flag.</p>
        `,
        interactiveType: "hex-viewer",
        hint: "Look at packet offset <code>0x0050</code> or use the search filter for 'CTF' to pinpoint the string!"
    },
    {
        id: "station-rev",
        title: "Station 05: Quantum Keygen Logic",
        category: "Reverse Engineering",
        points: 300,
        color: "#ff3333",
        threeColor: 0xff3333,
        icon: "⚡",
        pos: { x: 0, z: -18 },
        flag: "CTF{quantum_rev_keygen_cracked_88}",
        solved: false,
        summary: "Decompile the access control validation function and synthesize an authorized serial key.",
        briefing: `
            <h3>[ DECOMPILED VALIDATION LOGIC ]</h3>
            <p>The bunker's blast doors are governed by a cryptographic key verification binary. We have decompiled the assembly into JavaScript pseudo-code:</p>
            <pre class="code-block">
function verifySerial(key) {
    // Key format expected: CYBER-XXXX-YYYY
    const parts = key.split('-');
    if (parts.length !== 3 || parts[0] !== 'CYBER') return false;
    
    // Check Part 1:
    const num1 = parseInt(parts[1]);
    if (isNaN(num1) || num1 !== 7701) return false;
    
    // Check Part 2:
    const num2 = parseInt(parts[2]);
    if ((num2 ^ 42) !== 9920) return false; // (9920 XOR 42 = 9946)
    
    return true; // Unlocks Flag
}
            </pre>
            <p><strong>OBJECTIVE:</strong> Calculate the correct serial key (Format: <code>CYBER-7701-????</code>) and enter it into the verification module to generate the flag.</p>
        `,
        interactiveType: "rev-keygen",
        hint: "To find YYYY: calculate <code>9920 ^ 42</code> which equals <code>9946</code>! The serial key is <code>CYBER-7701-9946</code>."
    },
    {
        id: "station-boss",
        title: "Station 06: THE OMEGA CORE MAINFRAME",
        category: "Master Mainframe",
        points: 500,
        color: "#b026ff",
        threeColor: 0xb026ff,
        icon: "👑",
        pos: { x: 0, z: 2 },
        flag: "CTF{omega_core_master_mainframe_neutralized_2026}",
        solved: false,
        summary: "The ultimate security mainframe. Requires at least 500 points from surrounding stations to bypass laser shields.",
        briefing: `
            <h3>[ FACILITY CENTRAL MAINFRAME ]</h3>
            <p>This supercomputer controls the entire facility. It is guarded by a high-voltage laser barrier that only deactivates when security clearance of <strong>500+ Points</strong> has been attained.</p>
            <div id="boss-lock-status" class="lock-status-box"></div>
        `,
        interactiveType: "boss-core",
        hint: "Solve at least 3-4 other stations first to acquire 500+ points and deactivate the defense grid!"
    }
];

class ChallengeManager {
    constructor() {
        this.challenges = window.CHALLENGES_DATA;
        this.score = 0;
        this.solvedCount = 0;
        this.hintsUnlocked = new Set();
        this.loadProgress();
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('cyber_ctf_progress');
            if (saved) {
                const data = JSON.parse(saved);
                this.score = data.score || 0;
                const solvedList = data.solved || [];
                this.challenges.forEach(ch => {
                    if (solvedList.includes(ch.id)) {
                        ch.solved = true;
                    }
                });
                this.updateStats();
            }
        } catch (e) {
            console.warn("Could not read saved progress:", e);
        }
    }

    saveProgress() {
        try {
            const solved = this.challenges.filter(c => c.solved).map(c => c.id);
            localStorage.setItem('cyber_ctf_progress', JSON.stringify({
                score: this.score,
                solved: solved
            }));
        } catch (e) {
            console.warn("Could not save progress:", e);
        }
    }

    updateStats() {
        this.solvedCount = this.challenges.filter(c => c.solved).length;
        this.score = this.challenges.filter(c => c.solved).reduce((sum, c) => sum + c.points, 0);

        // Update DOM elements
        const scoreElem = document.getElementById('hud-score');
        const solvedElem = document.getElementById('hud-solved');
        const dashScore = document.getElementById('dash-total-score');
        const dashSolved = document.getElementById('dash-solved-count');

        if (scoreElem) scoreElem.innerText = this.score;
        if (solvedElem) solvedElem.innerText = `${this.solvedCount}/${this.challenges.length}`;
        if (dashScore) dashScore.innerText = this.score;
        if (dashSolved) dashSolved.innerText = `${this.solvedCount}/${this.challenges.length}`;
    }

    getChallenge(id) {
        return this.challenges.find(c => c.id === id);
    }

    submitFlag(challengeId, submittedFlag) {
        const ch = this.getChallenge(challengeId);
        if (!ch) return { success: false, message: "Unknown Challenge Station." };
        if (ch.solved) return { success: true, alreadySolved: true, message: "Flag already captured for this station!" };

        const clean = (submittedFlag || "").trim();
        if (clean === ch.flag) {
            ch.solved = true;
            this.updateStats();
            this.saveProgress();
            return {
                success: true,
                points: ch.points,
                message: `ACCESS GRANTED! +${ch.points} Points awarded! System bypassed successfully.`
            };
        } else {
            return {
                success: false,
                message: "ACCESS DENIED: Invalid flag token sequence. Verification failed."
            };
        }
    }

    resetAll() {
        this.challenges.forEach(c => c.solved = false);
        this.score = 0;
        this.solvedCount = 0;
        localStorage.removeItem('cyber_ctf_progress');
        this.updateStats();
    }
}

window.challengeManager = new ChallengeManager();
