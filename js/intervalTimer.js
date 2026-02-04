// Interval Timer Module - HIIT Intervalos
// Task 06 implementation

class IntervalTimer extends CountdownTimer {
    constructor(options = {}) {
        super(options);
        this.type = 'interval';
        this.name = options.name || 'Intervalos HIIT';
        
        this.workDuration = options.workDuration || 30000; // 30 seconds
        this.restDuration = options.restDuration || 10000; // 10 seconds
        this.rounds = options.rounds || 8;
        
        this.currentRound = 0;
        this.phase = 'idle'; // idle, work, rest
        this.totalRounds = options.rounds || 8;
        
        // Override duration for the first phase
        this.duration = this.workDuration;
        this.remainingTime = this.workDuration;
    }

    start() {
        if (this.state === 'idle') {
            this.currentRound = 1;
            this.phase = 'work';
            this.duration = this.workDuration;
            this.remainingTime = this.workDuration;
        }
        super.start();
    }

    tick() {
        this.elapsedTime = Date.now() - this.startTime;
        this.remainingTime = Math.max(0, this.duration - this.elapsedTime);
        
        this.onTick(this);
        
        if (this.remainingTime <= 0) {
            this.switchPhase();
        }
    }

    switchPhase() {
        AudioSystem.playIntervalSwitch();
        
        if (this.phase === 'work') {
            // Switch to rest
            this.phase = 'rest';
            this.duration = this.restDuration;
            this.elapsedTime = 0;
            this.startTime = Date.now();
        } else if (this.phase === 'rest') {
            // Switch to work or finish
            if (this.currentRound >= this.totalRounds) {
                this.finish();
                return;
            }
            this.currentRound++;
            this.phase = 'work';
            this.duration = this.workDuration;
            this.elapsedTime = 0;
            this.startTime = Date.now();
        }
    }

    reset() {
        super.reset();
        this.currentRound = 0;
        this.phase = 'idle';
        this.duration = this.workDuration;
        this.remainingTime = this.workDuration;
    }

    getFormattedTime() {
        return this.formatTime(this.remainingTime);
    }

    getPhaseLabel() {
        const labels = {
            idle: 'Listo',
            work: 'Trabajo',
            rest: 'Descanso'
        };
        return labels[this.phase] || 'Listo';
    }

    render() {
        const card = document.createElement('div');
        card.className = 'timer-card';
        card.id = `timer-${this.id}`;
        
        const totalTime = (this.workDuration + this.restDuration) * this.totalRounds;
        const elapsedTotal = ((this.currentRound - 1) * (this.workDuration + this.restDuration)) + 
                             (this.phase === 'work' ? 0 : this.workDuration) + 
                             (this.duration - this.remainingTime);
        const progressPercent = totalTime > 0 ? (elapsedTotal / totalTime) * 100 : 0;
        
        card.innerHTML = `
            <div class="timer-card-header">
                <h3 class="timer-card-title">
                    <span>🔁</span>
                    <span>${this.name}</span>
                </h3>
                <div class="timer-card-actions">
                    <button class="btn btn-icon btn-edit" title="Editar">✏️</button>
                    <button class="btn btn-icon btn-delete" title="Eliminar">🗑️</button>
                </div>
            </div>
            <div class="timer-card-body">
                <div class="interval-phase">
                    <div class="interval-phase-label">Fase</div>
                    <div class="interval-phase-value ${this.phase}">${this.getPhaseLabel()}</div>
                </div>
                <div class="timer-display ${this.state}">${this.getFormattedTime()}</div>
                <div class="interval-progress">
                    <div class="interval-progress-bar" style="width: ${Math.min(progressPercent, 100)}%"></div>
                </div>
                <div class="timer-info">
                    <div class="timer-info-item">
                        <span>🏁</span>
                        <span>Ronda ${this.currentRound} de ${this.totalRounds}</span>
                    </div>
                </div>
                <div class="timer-controls">
                    ${this.state === 'running' 
                        ? `<button class="btn btn-primary btn-pause">⏸️ Pausar</button>`
                        : this.state === 'paused'
                            ? `<button class="btn btn-primary btn-resume">▶️ Continuar</button>`
                            : `<button class="btn btn-primary btn-start">▶️ Iniciar</button>`
                    }
                    <button class="btn btn-reset">🔄 Reiniciar</button>
                </div>
                <div class="interval-settings ${this.state !== 'idle' ? 'hidden' : ''}">
                    <label>
                        Trabajo (seg):
                        <input type="number" class="work-input" value="${Math.floor(this.workDuration / 1000)}" min="5" max="300">
                    </label>
                    <label>
                        Descanso (seg):
                        <input type="number" class="rest-input" value="${Math.floor(this.restDuration / 1000)}" min="5" max="300">
                    </label>
                    <label>
                        Rondas:
                        <input type="number" class="rounds-input" value="${this.totalRounds}" min="1" max="50">
                    </label>
                </div>
            </div>
        `;
        
        // Event listeners
        const startBtn = card.querySelector('.btn-start, .btn-resume, .btn-pause');
        const resetBtn = card.querySelector('.btn-reset');
        const deleteBtn = card.querySelector('.btn-delete');
        const editBtn = card.querySelector('.btn-edit');
        const workInput = card.querySelector('.work-input');
        const restInput = card.querySelector('.rest-input');
        const roundsInput = card.querySelector('.rounds-input');
        
        startBtn?.addEventListener('click', () => {
            if (this.state === 'running') {
                this.pause();
            } else if (this.state === 'paused') {
                this.resume();
            } else {
                // Get values from inputs
                if (workInput) this.workDuration = parseInt(workInput.value) * 1000 || 30000;
                if (restInput) this.restDuration = parseInt(restInput.value) * 1000 || 10000;
                if (roundsInput) this.totalRounds = parseInt(roundsInput.value) || 8;
                this.duration = this.workDuration;
                this.remainingTime = this.workDuration;
                this.start();
            }
            updateTimerDisplay(this);
        });
        
        resetBtn?.addEventListener('click', () => {
            this.reset();
            updateTimerDisplay(this);
        });
        
        deleteBtn?.addEventListener('click', () => {
            App.removeTimer(this.id);
        });
        
        editBtn?.addEventListener('click', () => {
            const newName = prompt('Nuevo nombre:', this.name);
            if (newName) {
                this.name = newName;
                updateTimerDisplay(this);
            }
        });
        
        // Setup callbacks - solo actualizar display en tick, re-render en cambios de estado
        this.onTick = () => updateTimerDisplay(this, false);
        this.onStart = () => {
            updateTimerDisplay(this, true);
            AudioSystem.playIntervalSwitch();
        };
        this.onPause = () => updateTimerDisplay(this, true);
        this.onResume = () => updateTimerDisplay(this, true);
        this.onReset = () => updateTimerDisplay(this, true);
        this.onFinish = () => {
            updateTimerDisplay(this, true);
            AudioSystem.playTimerEnd();
        };
        
        return card;
    }
}
