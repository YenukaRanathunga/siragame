// CTF Challenges Database & Verification Engine
// 12 Tiered International-Grade Challenges + Living World Mechanics & Educational Theory

window.CHALLENGES_DATA = [
    // ==========================================
    // TIER 1: NOVICE / SCRIPT KIDDIE (BEGINNER)
    // ==========================================
    {
        id: "station-linux-novice",
        tier: 1,
        tierName: "Novice",
        title: "Sector 01: Linux Shadow Logs Recon",
        category: "Linux & Shell",
        points: 100,
        color: "#00ff66",
        threeColor: 0x00ff66,
        icon: "🐧",
        pos: { x: -14, z: -10 },
        flag: "CTF{linux_cli_recon_master_2026}",
        solved: false,
        summary: "Inspect simulated unprivileged bash shell, locate hidden files, and read access logs.",
        briefing: `
            <h3>[ MISSION 01: PERIMETER RECONNAISSANCE ]</h3>
            <p>An operative has left an unattended workstation terminal in the Boulevard Plaza. You have established a remote session as unprivileged user <code>cadet@metropolis-core</code>.</p>
            <p><strong>OBJECTIVE:</strong> Search the filesystem to locate the hidden log file buried in <code>/var/log/.shadow_trace</code> to extract the infiltrator token.</p>
            <div class="code-preview-box">
                <span class="preview-badge">COMMAND HINT</span>
                <code>ls -la /var/log/</code> &bull; <code>cat /var/log/.shadow_trace</code>
            </div>
        `,
        academicTheory: `
            <div class="theory-card">
                <h4>🎓 ACADEMIC THEORY: UNIX Filesystem Hierarchy & Hidden Files</h4>
                <p>In Unix/Linux operating systems, files beginning with a period (<code>.</code>) are classified as <strong>hidden files</strong> (e.g. <code>.bash_history</code>, <code>.ssh</code>). Standard <code>ls</code> omits them unless the <code>-a</code> (all) flag is supplied.</p>
                <div class="theory-table">
                    <div><strong>Key Directory</strong></div><div><strong>Purpose</strong></div>
                    <div><code>/var/log</code></div><div>System logs, authentication records (auth.log, syslog)</div>
                    <div><code>/etc</code></div><div>System-wide configuration files and password hashes</div>
                    <div><code>/home</code></div><div>User directory environments and shell configurations</div>
                </div>
                <h5>🛡️ Industry Defense & Remediation:</h5>
                <p>Enforce strict permission masks (<code>umask 027</code>). Ensure log files are owned by <code>root:adm</code> with permissions <code>0640</code> to prevent unprivileged users from auditing sensitive system telemetry.</p>
            </div>
        `,
        interactiveType: "linux-shell-novice",
        hint: "Run <code>ls -la /var/log</code> to reveal the hidden dotfile, then view it with <code>cat /var/log/.shadow_trace</code>!"
    },
    {
        id: "station-web-recon",
        tier: 1,
        tierName: "Novice",
        title: "Sector 02: Metro Transit Gate Auth",
        category: "Web Recon",
        points: 120,
        color: "#00f0ff",
        threeColor: 0x00f0ff,
        icon: "🚇",
        pos: { x: -26, z: 80 },
        flag: "CTF{client_side_validation_is_not_security}",
        solved: false,
        summary: "Audit DOM source code and bypass disabled client-side verification to generate a VIP transit pass.",
        briefing: `
            <h3>[ MISSION 02: TRANSIT GRID BYPASS ]</h3>
            <p>The city's automated subway turnstiles are locked down. The municipal web portal has disabled the ticket issuance button via client-side DOM properties:</p>
            <pre class="code-block">&lt;button id="auth-btn" disabled="true" class="locked"&gt;ACCESS RESTRICTED&lt;/button&gt;</pre>
            <p><strong>OBJECTIVE:</strong> Inspect the HTML/JavaScript DOM, remove the disabled restriction, and trigger the internal authorization token generator.</p>
        `,
        academicTheory: `
            <div class="theory-card">
                <h4>🎓 ACADEMIC THEORY: OWASP A04:2021 &ndash; Insecure Design (Client-Side Trap)</h4>
                <p>One of the most frequent beginner development blunders is trusting client-side logic for access control. Disabling an HTML button or hiding an element with CSS (<code>display: none;</code>) only controls the browser view&mdash;any user can edit DOM attributes via DevTools or invoke backend endpoints directly via <code>curl</code>.</p>
                <h5>🛡️ Industry Defense & Remediation:</h5>
                <p><strong>Zero Client Trust:</strong> Never authorize privileges based on frontend flags. The server must validate every incoming HTTP transaction against the authenticated user's session token and role permissions (RBAC).</p>
            </div>
        `,
        interactiveType: "web-recon-dom",
        hint: "Inspect the DOM elements! Click 'Unlock Button' or call <code>issueTransitPass()</code> in the console simulator."
    },
    {
        id: "station-crypto-basic",
        tier: 1,
        tierName: "Novice",
        title: "Sector 03: Intercepted Enigma Cipher",
        category: "Cryptography",
        points: 150,
        color: "#ffb703",
        threeColor: 0xffb703,
        icon: "🔐",
        pos: { x: 14, z: -10 },
        flag: "CTF{cyber_crypto_cipher_master}",
        solved: false,
        summary: "Decode a two-stage intercepted military transmission combining ROT13 and Base64.",
        briefing: `
            <h3>[ MISSION 03: SATELLITE INTERCEPT ]</h3>
            <p>A covert satellite transmission was intercepted from the bunker's microwave antenna:</p>
            <div class="crypto-box">
                <span class="label">INTERCEPTED CYPHERTEXT:</span>
                <div class="ciphertext-text">UEdTe3Bsb3JlX3BlbGNnYl9wdmN1cmVfem5mZ3JlZX0=</div>
            </div>
            <p><strong>INTEL:</strong> The plaintext flag was rotated using the Caesar substitution cipher (ROT13) and then encoded into standard RFC 4648 Base64.</p>
        `,
        academicTheory: `
            <div class="theory-card">
                <h4>🎓 ACADEMIC THEORY: Encoding vs. Encryption vs. Hashing</h4>
                <p><strong>Encoding (e.g. Base64, Hex):</strong> Reversible data formatting without a key. Purpose: ensure binary data safely travels over ASCII channels. <em>Provides ZERO confidentiality!</em></p>
                <p><strong>Encryption (e.g. AES, RSA):</strong> Cryptographic transformation requiring a secret key to decipher. Protects confidentiality.</p>
                <p><strong>Hashing (e.g. SHA-256, bcrypt):</strong> One-way mathematical digestion. Irreversible by design. Protects integrity and password storage.</p>
            </div>
        `,
        interactiveType: "crypto-tool",
        hint: "Step 1: Decode Base64 into text. Step 2: Shift alphabet characters by 13 positions (ROT13) to reveal CTF{...}!"
    },

    // ==========================================
    // TIER 2: INTERMEDIATE / PRACTITIONER
    // ==========================================
    {
        id: "station-power-grid",
        tier: 2,
        tierName: "Intermediate",
        title: "Sector 04: High-Voltage Substation Override",
        category: "Critical SCADA / IoT",
        points: 200,
        color: "#ef4444",
        threeColor: 0xef4444,
        icon: "⚡",
        pos: { x: -65, z: -120 },
        flag: "CTF{blackout_scada_grid_collapse_2026}",
        solved: false,
        summary: "Infiltrate the city's power grid relays and trip the main circuit breaker. TRIGGERS CITY-WIDE BLACKOUT!",
        briefing: `
            <h3>[ MISSION 04: CRITICAL INFRASTRUCTURE TAKEOVER ]</h3>
            <p>The municipal power grid is controlled by a Modbus-connected industrial SCADA terminal. By synchronizing the bus phase angle to <strong>60.0 Hz</strong> and setting the master voltage overload to <strong>440 kV</strong>, the primary breaker can be tripped.</p>
            <p><strong class="text-danger">⚠️ CAUTION:</strong> Overriding this station will trigger a real-time electrical grid blackout across the entire 3D metropolis!</p>
        `,
        academicTheory: `
            <div class="theory-card">
                <h4>🎓 ACADEMIC THEORY: Industrial Control Systems (ICS / SCADA) Security</h4>
                <p>Real-world incidents (such as the 2015 Ukraine Power Grid attack by Sandworm/BlackEnergy and Stuxnet) demonstrated how legacy industrial protocols like <strong>Modbus TCP</strong> and <strong>DNP3</strong> lack authentication, encryption, and anti-replay safeguards.</p>
                <h5>🛡️ Industry Defense & Remediation:</h5>
                <p>Isolate OT (Operational Technology) networks from corporate IT networks using the <strong>Purdue Model</strong>. Mandate unidirectional security gateways (data diodes), enforce VPN with MFA for remote maintenance, and implement deep packet inspection (DPI) on Modbus commands.</p>
            </div>
        `,
        interactiveType: "scada-power-grid",
        hint: "Align the Frequency slider to 60 Hz, set the Voltage knob to 440 kV, then toggle the red MASTER TRIP BREAKER!"
    },
    {
        id: "station-web-sqli",
        tier: 2,
        tierName: "Intermediate",
        title: "Sector 05: Nexus Portal Auth Bypass",
        category: "Web Exploitation",
        points: 200,
        color: "#00f0ff",
        threeColor: 0x00f0ff,
        icon: "🌐",
        pos: { x: 232, z: -210 },
        flag: "CTF{sql_inject_admin_bypass_2026}",
        solved: false,
        summary: "Bypass internal administrative gateway via SQL Injection vulnerability in database authentication query.",
        briefing: `
            <h3>[ MISSION 05: NEXUS GATEWAY BREACH ]</h3>
            <p>The administrative portal on the Pier 2 Cruise Liner Terminal executes unsanitized user inputs directly in an SQL query:</p>
            <pre class="code-block">SELECT * FROM staff_users WHERE username = '$user' AND password = '$password';</pre>
            <p><strong>OBJECTIVE:</strong> Inject a boolean SQL injection payload into the username field to force the query to evaluate to TRUE without requiring a valid password.</p>
        `,
        academicTheory: `
            <div class="theory-card">
                <h4>🎓 ACADEMIC THEORY: OWASP A03:2021 &ndash; SQL Injection (SQLi)</h4>
                <p>SQL Injection occurs when untrusted user input is directly concatenated into a dynamic SQL query string. By entering <code>' OR '1'='1' --</code>, the single quote breaks out of the string literal, <code>OR '1'='1'</code> forces the condition to always be true, and the comment delimiter (<code>--</code> or <code>#</code>) discards the password check.</p>
                <h5>🛡️ Industry Defense & Remediation:</h5>
                <pre class="code-block">// SECURE CODE (Parameterized Queries / PreparedStatements):
const stmt = db.prepare('SELECT * FROM staff_users WHERE username = ? AND password_hash = ?');
stmt.bind(1, username);
stmt.bind(2, hashedPassword);
const user = stmt.execute();</pre>
                <p>Never concatenate strings into queries. Always use parameterized queries (PDO, Hibernate, SQLAlchemy) or modern Object-Relational Mappers (ORMs).</p>
            </div>
        `,
        interactiveType: "web-login",
        hint: "Try universal SQL injection payloads in the username field: <code>admin' OR '1'='1' --</code> or <code>' OR 1=1#</code>!"
    },
    {
        id: "station-net-pcap",
        tier: 2,
        tierName: "Intermediate",
        title: "Sector 06: Fiber-Optic Tap Sniffer",
        category: "Network Forensics",
        points: 250,
        color: "#ff007f",
        threeColor: 0xff007f,
        icon: "🔍",
        pos: { x: 16, z: 12 },
        flag: "CTF{wireshark_packet_hex_hunter_99}",
        solved: false,
        summary: "Analyze raw packet stream hex dumps to locate hidden transmission signatures.",
        briefing: `
            <h3>[ MISSION 06: TELEMETRY STREAM AUDIT ]</h3>
            <p>A covert telemetry stream was dumped from network interface <code>eth0</code> during an intrusion attempt. A hidden authentication token is buried inside the TCP data payload.</p>
            <p>Inspect the hexadecimal and ASCII stream dump below to uncover the exfiltrated flag.</p>
        `,
        academicTheory: `
            <div class="theory-card">
                <h4>🎓 ACADEMIC THEORY: Network Protocol Analysis & Wireshark Fundamentals</h4>
                <p>Unencrypted protocols (such as raw HTTP, Telnet, FTP, and DNS) transmit application layer data in cleartext across the network wire. Anyone on the local broadcast domain or in an ARP-spoofing MITM position can capture and inspect payloads.</p>
                <h5>🛡️ Industry Defense & Remediation:</h5>
                <p>Mandate TLS 1.3 for all in-transit communications. Implement HTTP Strict Transport Security (HSTS), deploy DNS over HTTPS (DoH), and configure 802.1X port security and dynamic ARP inspection (DAI) on corporate switches.</p>
            </div>
        `,
        interactiveType: "hex-viewer",
        hint: "Look at packet offset <code>0x0050</code> or use the search filter for 'CTF' to pinpoint the string!"
    },

    // ==========================================
    // TIER 3: ADVANCED / PENETRATION TESTER
    // ==========================================
    {
        id: "station-broadcast",
        tier: 3,
        tierName: "Advanced",
        title: "Sector 07: Skyway Broadcast Tower Hijack",
        category: "Radio / Telecommunications",
        points: 250,
        color: "#a855f7",
        threeColor: 0xa855f7,
        icon: "📺",
        pos: { x: 65, z: 120 },
        flag: "CTF{skyway_billboard_broadcast_hijacked}",
        solved: false,
        summary: "Spoof digital signage multiplexer and hijack commercial billboards across the city skyline. TRIGGERS BILLBOARD TAKEOVER!",
        briefing: `
            <h3>[ MISSION 07: SKYLINE MEDIA HIJACK ]</h3>
            <p>The city's electronic advertising jumbotrons are fed via an unauthenticated UDP multicast stream on port <code>9940</code>. Transmit a customized media packet stream to hijack the feed.</p>
            <p><strong class="text-success">✨ WORLD EFFECT:</strong> Successfully overriding this station will re-skin all commercial billboards across the city with the Ghostbit Hacker Collective logo!</p>
        `,
        academicTheory: `
            <div class="theory-card">
                <h4>🎓 ACADEMIC THEORY: Software Defined Radio & UDP Multicast Vulnerabilities</h4>
                <p>Legacy broadcast systems and digital sign controllers frequently rely on UDP multicast groups (e.g. <code>239.255.0.1</code>) without cryptographic message authentication codes (HMAC). Without authentication, any host on the subnet can spoof source IP packets and take over the display.</p>
                <h5>🛡️ Industry Defense & Remediation:</h5>
                <p>Deploy signed firmware, implement Datagram Transport Layer Security (DTLS), and restrict multicast broadcast groups to isolated VLANs with strict Access Control Lists (ACLs).</p>
            </div>
        `,
        interactiveType: "broadcast-spoof",
        hint: "Set the UDP Multicast address to <code>239.255.40.1</code>, enter frequency <code>9940</code>, and click 'TRANSMIT GHOSTBIT OVERRIDE'!"
    },
    {
        id: "station-linux-privesc",
        tier: 3,
        tierName: "Advanced",
        title: "Sector 08: Vortex Linux Terminal PrivEsc",
        category: "Linux / PrivEsc",
        points: 300,
        color: "#00ff66",
        threeColor: 0x00ff66,
        icon: "🛡️",
        pos: { x: -16, z: 12 },
        flag: "CTF{linux_priv_esc_root_pwned_77}",
        solved: false,
        summary: "Interact with real simulated Linux shell, abuse SUID misconfigurations and escalate to root.",
        briefing: `
            <h3>[ MISSION 08: ROOT ESCALATION ]</h3>
            <p>You have connected via SSH as unprivileged user <code>guest@bunker-core</code>. Root permissions are required to access <code>/root/flag.txt</code>.</p>
            <p>Explore the file system, inspect SUID binaries, check <code>sudo -l</code>, or audit backup files in <code>/var/backups</code>.</p>
        `,
        academicTheory: `
            <div class="theory-card">
                <h4>🎓 ACADEMIC THEORY: Unix SUID Binaries & GTFOBins</h4>
                <p>The Set-User-ID (<strong>SUID</strong>) bit allows executable files to run with the permissions of the file owner (often <code>root</code>). If a binary capable of shell escapes (such as <code>find</code>, <code>vim</code>, <code>nmap</code>, <code>python</code>) has the SUID bit set (<code>chmod u+s</code>), an unprivileged user can spawn a root shell.</p>
                <h5>🛡️ Industry Defense & Remediation:</h5>
                <p>Audit SUID binaries with <code>find / -perm -4000 -type f 2>/dev/null</code>. Remove SUID flags from scripting interpreters and text editors. Mount <code>/home</code> and <code>/tmp</code> with the <code>nosuid</code> option in <code>/etc/fstab</code>.</p>
            </div>
        `,
        interactiveType: "linux-shell",
        hint: "Type <code>help</code>. Check <code>sudo -l</code>, inspect <code>/var/backups</code> or view <code>/etc/shadow.bak</code>!"
    },
    {
        id: "station-crypto-hash",
        tier: 3,
        tierName: "Advanced",
        title: "Sector 09: Shadow Vault Hash Cracker",
        category: "Cryptography",
        points: 300,
        color: "#f59e0b",
        threeColor: 0xf59e0b,
        icon: "⛏️",
        pos: { x: -80, z: 180 },
        flag: "CTF{hashcat_rockyou_rainbow_cracked}",
        solved: false,
        summary: "Identify hash formats, perform dictionary attacks with wordlists, and crack administrative hashes.",
        briefing: `
            <h3>[ MISSION 09: PASSWORD CRACKING VAULT ]</h3>
            <p>A database dump yielded an administrative user password hash: <code>5f4dcc3b5aa765d61d8327deb882cf99</code>.</p>
            <p><strong>OBJECTIVE:</strong> Identify the cryptographic hash algorithm (MD5), cross-reference with common dictionary lists (rockyou.txt), and submit the cracked flag.</p>
        `,
        academicTheory: `
            <div class="theory-card">
                <h4>🎓 ACADEMIC THEORY: Modern Password Storage & Salt Defense</h4>
                <p>Fast hashes like <strong>MD5</strong> and <strong>SHA-1</strong> were designed for high-throughput checksums, making them catastrophically unsuitable for password storage because modern GPUs can compute over 100 billion MD5 hashes per second.</p>
                <h5>🛡️ Industry Defense & Remediation:</h5>
                <p>Use modern, memory-hard, computationally expensive key derivation functions: <strong>Argon2id</strong> (winner of the Password Hashing Competition), <strong>bcrypt</strong> (work factor 12+), or <strong>PBKDF2</strong> with unique cryptographic per-user salts.</p>
            </div>
        `,
        interactiveType: "hash-cracker",
        hint: "The hash is MD5 format. Test common dictionary words like 'password', 'admin', 'qwerty', or run the automated Hashcat tool!"
    },

    // ==========================================
    // TIER 4: MASTER / RED TEAM OPERATOR
    // ==========================================
    {
        id: "station-web-xss",
        tier: 4,
        tierName: "Master",
        title: "Sector 10: Executive Portal Stored XSS",
        category: "Web Exploitation",
        points: 350,
        color: "#3b82f6",
        threeColor: 0x3b82f6,
        icon: "💉",
        pos: { x: 180, z: -80 },
        flag: "CTF{stored_xss_session_hijack_pwned}",
        solved: false,
        summary: "Inject stored JavaScript payload into employee bulletin board to hijack administrator session cookie.",
        briefing: `
            <h3>[ MISSION 10: CLIENT-SIDE INJECTION (XSS) ]</h3>
            <p>The corporate executive feedback system stores employee comments in a database and displays them without sanitization. An automated VIP bot regularly audits new comments.</p>
            <p><strong>OBJECTIVE:</strong> Submit a malicious payload (<code>&lt;script&gt;fetch('/log?c='+document.cookie)&lt;/script&gt;</code>) to extract the VIP session token.</p>
        `,
        academicTheory: `
            <div class="theory-card">
                <h4>🎓 ACADEMIC THEORY: OWASP A03:2021 &ndash; Cross-Site Scripting (XSS)</h4>
                <p>Stored XSS occurs when an application receives untrusted data and stores it in a database, which is later rendered into web pages for other users without proper contextual HTML entity encoding. Attackers can execute arbitrary JavaScript in the victim's browser context.</p>
                <h5>🛡️ Industry Defense & Remediation:</h5>
                <p>1. <strong>Context-Aware Encoding:</strong> Encode all dynamic data (e.g. <code>DOMPurify</code> in frontend, HTML escaping on backend).<br>2. <strong>HttpOnly Cookies:</strong> Mark sensitive session cookies with the <code>HttpOnly</code> flag so JavaScript cannot read <code>document.cookie</code>.<br>3. <strong>Content Security Policy (CSP):</strong> Disallow inline scripts with <code>Content-Security-Policy: default-src 'self';</code>.</p>
            </div>
        `,
        interactiveType: "web-xss",
        hint: "Submit a standard XSS payload: <code>&lt;script&gt;alert(document.cookie)&lt;/script&gt;</code> or <code>&lt;img src=x onerror=stealCookie()&gt;</code>!"
    },
    {
        id: "station-rev-keygen",
        tier: 4,
        tierName: "Master",
        title: "Sector 11: Quantum Keygen Logic Decompile",
        category: "Reverse Engineering",
        points: 400,
        color: "#ff3333",
        threeColor: 0xff3333,
        icon: "⚙️",
        pos: { x: 0, z: -18 },
        flag: "CTF{quantum_rev_keygen_cracked_88}",
        solved: false,
        summary: "Decompile access control validation function, solve bitwise XOR equations, and synthesize valid serial key.",
        briefing: `
            <h3>[ MISSION 11: DECOMPILED VALIDATION LOGIC ]</h3>
            <p>The bunker's blast doors are governed by a cryptographic key verification binary. We have decompiled the assembly into JavaScript pseudo-code:</p>
            <pre class="code-block">
function verifySerial(key) {
    // Format: CYBER-XXXX-YYYY
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
        academicTheory: `
            <div class="theory-card">
                <h4>🎓 ACADEMIC THEORY: Software Reverse Engineering & Assembly Analysis</h4>
                <p>Reverse engineering involves analyzing compiled software binaries (using tools like Ghidra, IDA Pro, or Binary Ninja) to deduce algorithms, identify proprietary protocols, or discover software vulnerabilities.</p>
                <h5>🛡️ Mathematical XOR Property:</h5>
                <p>XOR is self-inverting: If <code>A ^ B = C</code>, then <code>C ^ B = A</code>. Therefore, solving for <code>num2 ^ 42 = 9920</code> simply requires calculating <code>9920 ^ 42 = 9946</code>.</p>
            </div>
        `,
        interactiveType: "rev-keygen",
        hint: "Calculate <code>9920 ^ 42 = 9946</code>! The serial key is <code>CYBER-7701-9946</code>."
    },
    {
        id: "station-boss-omega",
        tier: 4,
        tierName: "Master",
        title: "Sector 12: THE OMEGA MAINFRAME",
        category: "Master Mainframe",
        points: 500,
        color: "#b026ff",
        threeColor: 0xb026ff,
        icon: "👑",
        pos: { x: 0, z: 2 },
        flag: "CTF{omega_core_master_mainframe_neutralized_2026}",
        solved: false,
        summary: "The ultimate security mainframe. Requires at least 600 points from surrounding stations to bypass laser shields.",
        briefing: `
            <h3>[ MISSION 12: FACILITY CENTRAL MAINFRAME ]</h3>
            <p>This supercomputer controls the entire facility. It is guarded by a high-voltage laser barrier that only deactivates when security clearance of <strong>600+ Points</strong> has been attained.</p>
            <div id="boss-lock-status" class="lock-status-box"></div>
        `,
        academicTheory: `
            <div class="theory-card">
                <h4>🎓 ACADEMIC THEORY: Defense-in-Depth & Zero-Trust Architecture</h4>
                <p>Modern cybersecurity strategies abandon the assumption that internal networks are inherently safe. <strong>Zero Trust</strong> mandates continuous authentication, least-privilege access, micro-segmentation, and end-to-end telemetry monitoring across all operational assets.</p>
            </div>
        `,
        interactiveType: "boss-core",
        hint: "Solve at least 4-5 other stations first to acquire 600+ points and deactivate the defense grid!"
    },

    // ==========================================
    // DECOY PROXY RELAY (HEAT PURGE NODE)
    // ==========================================
    {
        id: "station-decoy-proxy",
        isDecoy: true,
        title: "Decoy Proxy Relay // Counter-Surveillance",
        category: "Counter-Surveillance",
        points: 0,
        color: "#22c55e",
        threeColor: 0x22c55e,
        icon: "📡",
        pos: { x: -32, z: 45 },
        flag: "",
        solved: false,
        summary: "Alleyway covert antenna node. Hack into this terminal to purge network traces and reset Police Wanted Heat to 0.",
        briefing: `
            <h3>[ DECOY PROXY NODE // COUNTER-SURVEILLANCE ]</h3>
            <p>Municipal police dispatchers are tracking your RF MAC address. Accessing this scrambler node broadcasts spoofed telemetry packets across the metropolitan subnet, instantly resetting your <strong>Wanted Heat Level to 0</strong>.</p>
            <button class="cyber-btn primary mt-3" onclick="window.challengeManager.purgeHeat();">
                🛡️ TRANSMIT COUNTER-SPOOF // RESET WANTED HEAT
            </button>
        `,
        academicTheory: `
            <div class="theory-card">
                <h4>🎓 ACADEMIC THEORY: Network Attribution & Anti-Forensics</h4>
                <p>Network forensic investigators trace adversaries by correlating NetFlow records, ISP routing logs, and TLS fingerprinting. Threat actors attempt to evade attribution through multi-hop onion routing (Tor), proxy chains, and compromised jump hosts.</p>
            </div>
        `,
        interactiveType: "proxy-decoy",
        hint: "Click the 'Reset Wanted Heat' button above to call off all police pursuit!"
    }
];

class ChallengeManager {
    constructor() {
        this.challenges = window.CHALLENGES_DATA;
        this.score = 0;
        this.solvedCount = 0;
        this.wantedLevel = 0; // 0 to 5 Stars
        this.hintsUnlocked = new Set();
        this.loadProgress();
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('cyber_ctf_progress');
            if (saved) {
                const data = JSON.parse(saved);
                this.score = data.score || 0;
                this.wantedLevel = data.wantedLevel || 0;
                const solvedList = data.solved || [];
                this.challenges.forEach(ch => {
                    if (solvedList.includes(ch.id)) {
                        ch.solved = true;
                    }
                });
            }
        } catch (e) {
            console.warn("Could not read saved progress:", e);
        }
        this.updateStats();
    }

    saveProgress() {
        try {
            const solved = this.challenges.filter(c => c.solved).map(c => c.id);
            localStorage.setItem('cyber_ctf_progress', JSON.stringify({
                score: this.score,
                wantedLevel: this.wantedLevel,
                solved: solved
            }));
        } catch (e) {
            console.warn("Could not save progress:", e);
        }
    }

    setWantedLevel(level) {
        this.wantedLevel = Math.max(0, Math.min(5, level));
        
        // Update HUD Stars
        const starElem = document.getElementById('hud-wanted-stars');
        if (starElem) {
            const starsFilled = "★".repeat(this.wantedLevel);
            const starsEmpty = "☆".repeat(5 - this.wantedLevel);
            starElem.innerText = starsFilled + starsEmpty;
            starElem.className = `wanted-stars level-${this.wantedLevel}`;
        }

        // Notify 3D World and Audio
        if (window.world && typeof window.world.setPoliceAlertLevel === 'function') {
            window.world.setPoliceAlertLevel(this.wantedLevel);
        }
        if (window.sounds) {
            if (this.wantedLevel >= 3) {
                window.sounds.startPoliceSiren();
            } else {
                window.sounds.stopPoliceSiren();
            }
        }

        this.saveProgress();
    }

    addHeat(amount = 1) {
        this.setWantedLevel(this.wantedLevel + amount);
        if (window.game && typeof window.game.showBannerNotification === 'function') {
            window.game.showBannerNotification(`⚠️ POLICE ALERT LEVEL ELEVATED: ${this.wantedLevel} STARS!`, 'warning');
        }
    }

    purgeHeat() {
        this.setWantedLevel(0);
        if (window.sounds) window.sounds.playRadioStatic();
        if (window.game && typeof window.game.showBannerNotification === 'function') {
            window.game.showBannerNotification(`✔ TRACE CLEARED // POLICE PURSUIT CANCELLED`, 'success');
        }
        const res = document.getElementById('terminal-flag-result');
        if (res) {
            res.className = 'flag-result-box success';
            res.innerHTML = '✔ Network trace purged. Police heat reset to 0.';
        }
    }

    updateStats() {
        const playable = this.challenges.filter(c => !c.isDecoy);
        this.solvedCount = playable.filter(c => c.solved).length;
        this.score = playable.filter(c => c.solved).reduce((sum, c) => sum + c.points, 0);

        // Update DOM elements
        const scoreElem = document.getElementById('hud-score');
        const solvedElem = document.getElementById('hud-solved');
        const dashScore = document.getElementById('dash-total-score');
        const dashSolved = document.getElementById('dash-solved-count');

        if (scoreElem) scoreElem.innerText = this.score;
        if (solvedElem) solvedElem.innerText = `${this.solvedCount}/${playable.length}`;
        if (dashScore) dashScore.innerText = this.score;
        if (dashSolved) dashSolved.innerText = `${this.solvedCount}/${playable.length}`;

        // Update Wanted level display
        this.setWantedLevel(this.wantedLevel);
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

            // World reaction triggers:
            if (ch.id === 'station-power-grid' && window.world && typeof window.world.triggerCityBlackout === 'function') {
                window.world.triggerCityBlackout(true);
            }
            if (ch.id === 'station-broadcast' && window.world && typeof window.world.triggerBillboardTakeover === 'function') {
                window.world.triggerBillboardTakeover();
            }

            return {
                success: true,
                points: ch.points,
                message: `ACCESS GRANTED! +${ch.points} Points awarded! System bypassed successfully.`
            };
        } else {
            // Failed exploit increases police heat!
            this.addHeat(1);
            return {
                success: false,
                message: `ACCESS DENIED: Invalid flag token! Intrusion Alarm Triggered (+1 Wanted Star).`
            };
        }
    }

    resetAll() {
        this.challenges.forEach(c => c.solved = false);
        this.score = 0;
        this.solvedCount = 0;
        this.wantedLevel = 0;
        localStorage.removeItem('cyber_ctf_progress');
        this.updateStats();
    }
}

window.challengeManager = new ChallengeManager();
