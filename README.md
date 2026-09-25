# 🎮 GHOSTBIT // 3D Open-World CTF & Cyber Range

A 3D Cyberpunk Capture The Flag (CTF) game platform built for the browser. Players control a 3D hacker operative exploring an underground cyber facility, approaching interactive workstations, solving real cybersecurity challenges, submitting flags, and climbing the leaderboard.

---

## ⚡ Quick Start (Play Locally)

### Option 1: Double-Click Launcher (Recommended)
Just double click **`run.bat`** in this folder! It will start the local server and automatically open your default browser at `http://localhost:8080`.

### Option 2: PowerShell
Open PowerShell in this directory and run:
```powershell
.\server.ps1
```

### Option 3: VS Code / Any Static Server
You can open this folder in VS Code with "Live Server" extension, or run:
```bash
npx serve .
# or
python -m http.server 8080
```

---

## 🕹️ Controls (3D Mode)

| Key | Action |
| --- | --- |
| **W, A, S, D** / Arrows | Walk & navigate around the cyberpunk bunker |
| **Shift** | Sprint (High speed locomotion) |
| **Spacebar** | Jump |
| **Mouse Drag** | 360° Camera orbit / Scroll to zoom |
| **On-screen arrows** | D-pad (bottom-left) to walk, LOOK pad (bottom-right) to turn / tilt, `+` and `−` to zoom, plus **JUMP**, **RUN**, **HACK**, **VIEW** buttons. Tap-and-hold, works on touch and mouse. |
| **Key E** | Access / Hack terminal when close to a station |
| **Key V** | Toggle between **3rd-Person** and **1st-Person** camera views |
| **Key N** | Toggle the **Day / Night** lighting cycle |
| **Escape** | Close open terminal window |

---

## 🌐 Dual View Modes

1. **🎮 3D World Mode**: An interactive 3D virtual bunker with animated hacker character, proximity sensors, laser defenses, and radar minimap.
2. **📊 Web Dashboard Mode**: Traditional CTF web portal view (like HackTheBox / CTFd) with challenge cards, live statistics, and player leaderboard.

---

## 🎯 Challenges Included

| Sector | Category | Tier | Points | Description |
| --- | --- | --- | --- | --- |
| **Sector 01** | Linux & Shell | Novice | 100 PTS | Shadow log recon — `grep`, `tail`, permission inspection |
| **Sector 02** | Web Recon | Novice | 120 PTS | Metro transit gate auth — client-side validation bypass |
| **Sector 03** | Cryptography | Novice | 150 PTS | Multi-layer ROT13 + Base64 transmission cipher |
| **Sector 04** | Critical SCADA / IoT | Intermediate | 200 PTS | High-voltage substation override — frequency & voltage tuning |
| **Sector 05** | Web Exploitation | Intermediate | 200 PTS | SQL Injection authentication bypass (`admin' OR '1'='1' --`) |
| **Sector 06** | Network Forensics | Intermediate | 250 PTS | Network packet stream inspection & hex editor analysis |
| **Sector 07** | Radio / Telecommunications | Advanced | 250 PTS | Skyway broadcast tower hijack via UDP injection |
| **Sector 08** | Linux / PrivEsc | Advanced | 300 PTS | Interactive in-browser Bash shell with `sudo -l` inspection |
| **Sector 09** | Cryptography | Advanced | 300 PTS | Hashcat-style rainbow table cracking |
| **Sector 10** | Web Exploitation | Master | 350 PTS | Stored XSS against an admin review bot |
| **Sector 11** | Reverse Engineering | Master | 400 PTS | Decompiled serial license verification algorithm |
| **Sector 12** | Master Mainframe | Master | 500 PTS | Central boss supercomputer. Laser barrier unlocks at 600+ PTS! |

---

## 🚀 How to Deploy Online (Free)

Since this project uses pure HTML5, CSS3, JavaScript, and WebGL:
* **GitHub Pages**: Push this directory to a GitHub repository, go to `Settings > Pages`, and select `main` branch.
* **Vercel**: Run `vercel` or import the GitHub repo on vercel.com.
* **Netlify**: Drag-and-drop this folder into Netlify Drop (app.netlify.com/drop).
