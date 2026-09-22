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
}

window.sounds = new SoundManager();
