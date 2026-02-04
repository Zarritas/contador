// Base Timer Class
// Task 02 implementation - Core Timer Engine

class Timer {
    constructor(options = {}) {
        this.id = options.id || this.generateId();
        this.name = options.name || 'Timer';
        this.type = options.type || 'generic';
        
        this.state = 'idle'; // idle, running, paused, finished
        this.startTime = null;
        this.elapsedTime = 0;
        this.intervalId = null;
        
        // Event callbacks
        this.onStart = options.onStart || (() => {});
        this.onPause = options.onPause || (() => {});
        this.onResume = options.onResume || (() => {});
        this.onReset = options.onReset || (() => {});
        this.onTick = options.onTick || (() => {});
        this.onFinish = options.onFinish || (() => {});
    }

    generateId() {
        return 'timer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    start() {
        if (this.state === 'running') return;
        
        this.state = 'running';
        this.startTime = Date.now() - this.elapsedTime;
        this.intervalId = setInterval(() => this.tick(), 100);
        
        this.onStart(this);
    }

    pause() {
        if (this.state !== 'running') return;
        
        this.state = 'paused';
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.elapsedTime = Date.now() - this.startTime;
        
        this.onPause(this);
    }

    resume() {
        if (this.state !== 'paused') return;
        
        this.state = 'running';
        this.startTime = Date.now() - this.elapsedTime;
        this.intervalId = setInterval(() => this.tick(), 100);
        
        this.onResume(this);
    }

    reset() {
        this.state = 'idle';
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.startTime = null;
        this.elapsedTime = 0;
        
        this.onReset(this);
    }

    tick() {
        this.elapsedTime = Date.now() - this.startTime;
        this.onTick(this);
    }

    finish() {
        this.state = 'finished';
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.onFinish(this);
    }

    getFormattedTime() {
        return this.formatTime(this.elapsedTime);
    }

    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const centiseconds = Math.floor((ms % 1000) / 10);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }

    destroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}

// Countdown Timer Class
class CountdownTimer extends Timer {
    constructor(options = {}) {
        super(options);
        this.type = 'countdown';
        this.duration = options.duration || 300000; // 5 minutes default
        this.remainingTime = this.duration;
    }

    tick() {
        this.elapsedTime = Date.now() - this.startTime;
        this.remainingTime = Math.max(0, this.duration - this.elapsedTime);
        
        this.onTick(this);
        
        if (this.remainingTime <= 0) {
            this.finish();
        }
    }

    getFormattedTime() {
        return this.formatTime(this.remainingTime);
    }

    reset() {
        super.reset();
        this.remainingTime = this.duration;
    }
}
