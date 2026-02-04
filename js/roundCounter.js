// Round Counter Module - Contador de Rondas
// Task 05 implementation

class RoundCounter extends Timer {
    constructor(options = {}) {
        super(options);
        this.type = 'rounds';
        this.name = options.name || 'Contador de Rondas';
        this.rounds = options.rounds || 0;
        this.step = options.step || 1;
        this.target = options.target || null;
    }

    increment() {
        this.rounds += this.step;
        this.onTick(this);
    }

    decrement() {
        this.rounds = Math.max(0, this.rounds - this.step);
        this.onTick(this);
    }

    reset() {
        this.rounds = 0;
        this.onReset(this);
    }

    getFormattedTime() {
        return this.rounds.toString();
    }

    render() {
        const card = document.createElement('div');
        card.className = 'timer-card';
        card.id = `timer-${this.id}`;
        
        const progressPercent = this.target ? (this.rounds / this.target) * 100 : 0;
        
        card.innerHTML = `
            <div class="timer-card-header">
                <h3 class="timer-card-title">
                    <span>🔢</span>
                    <span>${this.name}</span>
                </h3>
                <div class="timer-card-actions">
                    <button class="btn btn-icon btn-edit" title="Editar">✏️</button>
                    <button class="btn btn-icon btn-delete" title="Eliminar">🗑️</button>
                </div>
            </div>
            <div class="timer-card-body">
                <div class="round-counter-display">
                    <button class="btn round-counter-btn btn-decrement">−</button>
                    <div class="round-counter-value">${this.rounds}</div>
                    <button class="btn round-counter-btn btn-increment">+</button>
                </div>
                ${this.target ? `
                    <div class="interval-progress">
                        <div class="interval-progress-bar" style="width: ${Math.min(progressPercent, 100)}%"></div>
                    </div>
                    <p class="target-text">Meta: ${this.target} rondas</p>
                ` : ''}
                <div class="timer-controls">
                    <button class="btn btn-reset">🔄 Reiniciar</button>
                </div>
                <div class="round-settings">
                    <label>
                        Incremento:
                        <input type="number" class="step-input" value="${this.step}" min="1" max="10">
                    </label>
                    <label>
                        Meta (opcional):
                        <input type="number" class="target-input" value="${this.target || ''}" min="1" placeholder="Sin meta">
                    </label>
                </div>
            </div>
        `;
        
        // Event listeners
        const incrementBtn = card.querySelector('.btn-increment');
        const decrementBtn = card.querySelector('.btn-decrement');
        const resetBtn = card.querySelector('.btn-reset');
        const deleteBtn = card.querySelector('.btn-delete');
        const editBtn = card.querySelector('.btn-edit');
        const stepInput = card.querySelector('.step-input');
        const targetInput = card.querySelector('.target-input');
        
        incrementBtn?.addEventListener('click', () => {
            this.increment();
            if (this.target && this.rounds >= this.target) {
                AudioSystem.playTimerEnd();
            }
        });
        
        decrementBtn?.addEventListener('click', () => {
            this.decrement();
        });
        
        resetBtn?.addEventListener('click', () => {
            this.reset();
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
        
        stepInput?.addEventListener('change', (e) => {
            this.step = parseInt(e.target.value) || 1;
        });
        
        targetInput?.addEventListener('change', (e) => {
            this.target = e.target.value ? parseInt(e.target.value) : null;
            updateTimerDisplay(this);
        });
        
        // Setup callbacks - solo actualizar display en tick, re-render en cambios de estado
        this.onTick = () => updateTimerDisplay(this, true);
        this.onReset = () => updateTimerDisplay(this, true);
        
        return card;
    }
}
