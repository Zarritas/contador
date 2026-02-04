// Countdown Timer Module - Temporizador
// Task 04 implementation

class Countdown extends CountdownTimer {
    constructor(options = {}) {
        super(options);
        this.type = 'countdown';
        this.name = options.name || 'Temporizador';
    }

    render() {
        const card = document.createElement('div');
        card.className = 'timer-card';
        card.id = `timer-${this.id}`;
        
        card.innerHTML = `
            <div class="timer-card-header">
                <h3 class="timer-card-title">
                    <span>⏲️</span>
                    <span>${this.name}</span>
                </h3>
                <div class="timer-card-actions">
                    <button class="btn btn-icon btn-edit" title="Editar">✏️</button>
                    <button class="btn btn-icon btn-delete" title="Eliminar">🗑️</button>
                </div>
            </div>
            <div class="timer-card-body">
                <div class="timer-display ${this.state}">${this.getFormattedTime()}</div>
                <div class="duration-setting ${this.state !== 'idle' ? 'hidden' : ''}">
                    <label>
                        Duración (min):
                        <input type="number" class="duration-input" value="${Math.floor(this.duration / 60000)}" min="1" max="120">
                    </label>
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
            </div>
        `;
        
        // Event listeners
        const startBtn = card.querySelector('.btn-start, .btn-resume, .btn-pause');
        const resetBtn = card.querySelector('.btn-reset');
        const deleteBtn = card.querySelector('.btn-delete');
        const editBtn = card.querySelector('.btn-edit');
        const durationInput = card.querySelector('.duration-input');
        
        startBtn?.addEventListener('click', () => {
            if (this.state === 'running') {
                this.pause();
            } else if (this.state === 'paused') {
                this.resume();
            } else {
                // Get duration from input before starting
                if (durationInput) {
                    const minutes = parseInt(durationInput.value) || 5;
                    this.duration = minutes * 60000;
                    this.remainingTime = this.duration;
                }
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
            // Show notification if supported
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('¡Tiempo terminado!', { body: `${this.name} ha finalizado` });
            }
        };
        
        return card;
    }
}
