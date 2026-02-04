// Audio Module - Sound alerts
// Task 08 implementation

const AudioSystem = {
    audioContext: null,
    settings: null,

    init(settings) {
        this.settings = settings || Storage.getSettings();
        
        // Initialize AudioContext on first user interaction
        document.addEventListener('click', () => this.ensureAudioContext(), { once: true });
        document.addEventListener('touchstart', () => this.ensureAudioContext(), { once: true });
    },

    ensureAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    },

    playBeep(frequency = 800, duration = 200, type = 'sine') {
        if (!this.settings?.soundEnabled) return;
        
        this.ensureAudioContext();
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        const volume = (this.settings.volume || 80) / 100;
        gainNode.gain.setValueAtTime(volume * 0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    },

    playTimerEnd() {
        // Triple beep for timer end
        this.playBeep(600, 150);
        setTimeout(() => this.playBeep(800, 150), 200);
        setTimeout(() => this.playBeep(1000, 300), 400);
    },

    playIntervalSwitch() {
        // Single higher beep for interval switch
        this.playBeep(1000, 150);
    },

    updateSettings(settings) {
        this.settings = settings;
    }
};
