// Stopwatch Module - Cronómetro
// Task 03 implementation

class Stopwatch extends Timer {
    constructor(options = {}) {
        super(options);
        this.type = 'stopwatch';
        this.laps = [];
    }

    lap() {
        if (this.state !== 'running') return;
        
        const lapTime = this.elapsedTime;
        const previousLapTime = this.laps.length > 0 ? this.laps[this.laps.length - 1].totalTime : 0;
        const splitTime = lapTime - previousLapTime;
        
        this.laps.push({
            number: this.laps.length + 1,
            splitTime: splitTime,
            totalTime: lapTime
        });
    }

    reset() {
        super.reset();
        this.laps = [];
    }

    render() {
        const card = document.createElement('div');
        card.className = 'timer-card';
        card.id = `timer-${this.id}`;
        
        card.innerHTML = `
            <div class="timer-card-header">
                <h3 class="timer-card-title">
                    <span>⏱️</span>
                    <span>${this.name}</span>
                </h3>
                <div class="timer-card-actions">
                    <button class="btn btn-icon btn-edit" title="Editar nombre">✏️</button>
                    <button class="btn btn-icon btn-delete" title="Eliminar">🗑️</button>
                </div>
            </div>
            <div class="timer-card-body">
                <div class="timer-display ${this.state}">${this.getFormattedTime()}</div>
                <div class="timer-controls">
                    ${this.state === 'running' 
                        ? `<button class="btn btn-primary btn-pause">⏸️ Pausar</button>`
                        : `<button class="btn btn-primary btn-start">▶️ Iniciar</button>`
                    }
                    <button class="btn btn-lap" ${this.state !== 'running' ? 'disabled' : ''}>🏁 Vuelta</button>
                    <button class="btn btn-reset">🔄 Reiniciar</button>
                </div>
                <div class="laps-container ${this.laps.length === 0 ? 'hidden' : ''}">
                    <h4>Vueltas</h4>
                    <div class="laps-list">
                        ${this.laps.map(lap => `
                            <div class="lap-item">
                                <span>#${lap.number}</span>
                                <span>+${this.formatTime(lap.splitTime)}</span>
                                <span>${this.formatTime(lap.totalTime)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Event listeners
        const startBtn = card.querySelector('.btn-start, .btn-pause');
        const lapBtn = card.querySelector('.btn-lap');
        const resetBtn = card.querySelector('.btn-reset');
        const deleteBtn = card.querySelector('.btn-delete');
        const editBtn = card.querySelector('.btn-edit');
        
        startBtn?.addEventListener('click', () => {
            if (this.state === 'running') {
                this.pause();
            } else {
                this.start();
            }
            updateTimerDisplay(this);
        });
        
        lapBtn?.addEventListener('click', () => {
            this.lap();
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
        this.onReset = () => updateTimerDisplay(this, true);
        
        return card;
    }
}
