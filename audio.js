// Mr. Robot (Mac Quayle Style) Tense Electronic Pulse Audio Synthesizer

class SoundManager {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isAmbientPlaying = false;
        this.masterGain = null;
        this.bassGain = null;
        this.pulseInterval = null;
        this.step = 0;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
        }
        return this.isMuted;
    }

    // Mac Quayle style dark 124 BPM electronic clock-pulse arpeggiator
    startAmbient() {
        if (this.isAmbientPlaying || this.isMuted) return;
        this.init();

        try {
            // Low atmospheric NYC night street rumble
            const droneOsc = this.ctx.createOscillator();
            const droneGain = this.ctx.createGain();
            const droneFilter = this.ctx.createBiquadFilter();

            droneFilter.type = 'lowpass';
            droneFilter.frequency.setValueAtTime(140, this.ctx.currentTime);

            droneOsc.type = 'sawtooth';
            droneOsc.frequency.setValueAtTime(45, this.ctx.currentTime); // F#1
            droneGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

            droneOsc.connect(droneFilter);
            droneFilter.connect(droneGain);
            droneGain.connect(this.masterGain);
            droneOsc.start();

            // Tense clock pulse rhythm (120 BPM = 125ms per 16th note)
            const bassNotes = [55, 55, 55, 65.41, 55, 55, 73.42, 55]; // A1, C2, D2
            this.pulseInterval = setInterval(() => {
                if (this.isMuted || !this.ctx) return;

                const freq = bassNotes[this.step % bassNotes.length];
                this.step++;

                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const filter = this.ctx.createBiquadFilter();

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(320 + Math.sin(this.step * 0.1) * 120, now);

                osc.type = (this.step % 4 === 0) ? 'sawtooth' : 'triangle';
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.masterGain);

                osc.start(now);
                osc.stop(now + 0.12);
            }, 125);

            this.isAmbientPlaying = true;
        } catch (e) {
            console.warn("Audio waiting for user gesture:", e);
        }
    }

    // Realistic mechanical keyboard click
    playType() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400 + Math.random() * 400, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.025);
    }

    // UI Click
    playClick() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(650, now);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.04);
    }

    // Proximity interaction chime
    playInteract() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        [440, 659.25].forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.08);
            gain.gain.setValueAtTime(0.1, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.18);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.18);
        });
    }

    // Flag capture victory sting
    playSuccess() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        // Cinematic minor-to-major resolution: D4 -> F4 -> A4 -> D5
        const chords = [293.66, 349.23, 440.00, 587.33];
        chords.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.07);
            gain.gain.setValueAtTime(0.18, now + i * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.5);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + i * 0.07);
            osc.stop(now + i * 0.07 + 0.5);
        });
    }

    // Access Denied error buzz
    playError() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.linearRampToValueAtTime(70, now + 0.22);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.22);
    }

    playJump() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.12);
    }

    // Dynamic Police Siren (Authentic dual-tone wailing siren)
    startPoliceSiren() {
        if (this.isMuted || this.sirenActive) return;
        this.init();
        try {
            this.sirenActive = true;
            this.sirenOsc = this.ctx.createOscillator();
            this.sirenGain = this.ctx.createGain();
            this.sirenOsc.type = 'sawtooth';

            const now = this.ctx.currentTime;
            this.sirenGain.gain.setValueAtTime(0.001, now);
            this.sirenGain.gain.linearRampToValueAtTime(0.09, now + 0.5);

            // Modulate pitch between 620Hz and 980Hz
            this.sirenLfo = this.ctx.createOscillator();
            this.sirenLfoGain = this.ctx.createGain();
            this.sirenLfo.frequency.setValueAtTime(1.4, now); // Siren wail cycle speed
            this.sirenLfoGain.gain.setValueAtTime(180, now);
            this.sirenOsc.frequency.setValueAtTime(800, now);

            this.sirenLfo.connect(this.sirenLfoGain);
            this.sirenLfoGain.connect(this.sirenOsc.frequency);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1800, now);

            this.sirenOsc.connect(filter);
            filter.connect(this.sirenGain);
            this.sirenGain.connect(this.masterGain);

            this.sirenOsc.start(now);
            this.sirenLfo.start(now);
        } catch (e) {
            console.warn("Siren audio error:", e);
        }
    }

    stopPoliceSiren() {
        if (!this.sirenActive || !this.sirenGain) return;
        try {
            const now = this.ctx.currentTime;
            this.sirenGain.gain.linearRampToValueAtTime(0.0001, now + 0.4);
            setTimeout(() => {
                if (this.sirenOsc) {
                    try { this.sirenOsc.stop(); this.sirenOsc.disconnect(); } catch (e) {}
                }
                if (this.sirenLfo) {
                    try { this.sirenLfo.stop(); this.sirenLfo.disconnect(); } catch (e) {}
                }
                this.sirenActive = false;
            }, 450);
        } catch (e) {
            this.sirenActive = false;
        }
    }

    // Heavy Substation Grid Blackout Surge & Power-Down Hum
    playBlackoutSurge() {
        if (this.isMuted) return;
        this.init();
        try {
            const now = this.ctx.currentTime;
            // 1. Heavy power transformer blowout sub-bass
            const subOsc = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();
            subOsc.type = 'sawtooth';
            subOsc.frequency.setValueAtTime(160, now);
            subOsc.frequency.exponentialRampToValueAtTime(22, now + 1.8);
            subGain.gain.setValueAtTime(0.35, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

            const subFilter = this.ctx.createBiquadFilter();
            subFilter.type = 'lowpass';
            subFilter.frequency.setValueAtTime(320, now);
            subFilter.frequency.exponentialRampToValueAtTime(40, now + 1.8);

            subOsc.connect(subFilter);
            subFilter.connect(subGain);
            subGain.connect(this.masterGain);

            subOsc.start(now);
            subOsc.stop(now + 2.0);

            // 2. High-voltage electrical spark burst
            const bufSize = this.ctx.sampleRate * 0.4;
            const buffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.25));
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const noiseFilter = this.ctx.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.setValueAtTime(1200, now);
            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.25, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(this.masterGain);
            noise.start(now);
        } catch (e) {
            console.warn("Blackout audio error:", e);
        }
    }

    // Radio Police Dispatch / Heat Cleared Static Chime
    playRadioStatic() {
        if (this.isMuted) return;
        this.init();
        try {
            const now = this.ctx.currentTime;
            // Short burst of filtered white noise squelch
            const bufSize = this.ctx.sampleRate * 0.12;
            const buffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(2200, now);
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            noise.start(now);

            // Followed by clear beep
            const osc = this.ctx.createOscillator();
            const bGain = this.ctx.createGain();
            osc.frequency.setValueAtTime(880, now + 0.1);
            bGain.gain.setValueAtTime(0.08, now + 0.1);
            bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            osc.connect(bGain);
            bGain.connect(this.masterGain);
            osc.start(now + 0.1);
            osc.stop(now + 0.22);
        } catch (e) {}
    }
}

window.sounds = new SoundManager();

