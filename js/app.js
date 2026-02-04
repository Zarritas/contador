// Main Application Module
// Task 07, 09, 10, 13 implementation - Multiple timers, theme, fullscreen, settings

const App = {
    timers: [],
    settings: null,
    currentTheme: 'light',
    
    init() {
        // Initialize settings
        this.settings = Storage.getSettings();
        
        // Initialize audio
        AudioSystem.init(this.settings);
        
        // Load theme
        this.currentTheme = Storage.getTheme();
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Check for notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
        
        // Update empty state
        this.updateEmptyState();
        
        console.log('App initialized');
    },
    
    setupEventListeners() {
        // Add timer buttons
        document.getElementById('btn-add-timer')?.addEventListener('click', () => this.openModal('modal-add'));
        document.getElementById('btn-add-first')?.addEventListener('click', () => this.openModal('modal-add'));
        
        // Settings button
        document.getElementById('btn-settings')?.addEventListener('click', () => {
            this.loadSettings();
            this.openModal('modal-settings');
        });
        
        // Theme toggle
        document.getElementById('btn-theme')?.addEventListener('click', () => this.toggleTheme());
        
        // Fullscreen toggle
        document.getElementById('btn-fullscreen')?.addEventListener('click', () => this.toggleFullscreen());
        
        // Modal closes
        document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
            el.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) this.closeModal(modal.id);
            });
        });
        
        // Timer type selection
        document.querySelectorAll('.timer-type-card').forEach(card => {
            card.addEventListener('click', () => {
                const type = card.dataset.type;
                this.createTimer(type);
                this.closeModal('modal-add');
            });
        });
        
        // Settings form
        document.getElementById('setting-sound')?.addEventListener('change', (e) => {
            this.settings.soundEnabled = e.target.checked;
            Storage.saveSettings(this.settings);
            AudioSystem.updateSettings(this.settings);
        });
        
        document.getElementById('setting-volume')?.addEventListener('input', (e) => {
            this.settings.volume = parseInt(e.target.value);
            Storage.saveSettings(this.settings);
            AudioSystem.updateSettings(this.settings);
        });
        
        document.getElementById('setting-default-duration')?.addEventListener('change', (e) => {
            this.settings.defaultDuration = parseInt(e.target.value);
            Storage.saveSettings(this.settings);
        });
        
        document.getElementById('setting-round-step')?.addEventListener('change', (e) => {
            this.settings.roundStep = parseInt(e.target.value);
            Storage.saveSettings(this.settings);
        });
        
        // Clear data button
        document.getElementById('btn-clear-data')?.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.')) {
                Storage.clear();
                location.reload();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape to close modals
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    this.closeModal(modal.id);
                });
            }
            
            // Space to start/pause first timer
            if (e.key === ' ' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                const firstTimer = this.timers[0];
                if (firstTimer) {
                    if (firstTimer.state === 'running') {
                        firstTimer.pause();
                    } else {
                        firstTimer.start();
                    }
                    updateTimerDisplay(firstTimer, true);
                }
            }
        });
    },
    
    createTimer(type) {
        let timer;
        
        switch (type) {
            case 'stopwatch':
                timer = new Stopwatch({
                    name: `Cronómetro ${this.timers.filter(t => t.type === 'stopwatch').length + 1}`,
                    onFinish: () => this.onTimerFinish(timer)
                });
                break;
                
            case 'countdown':
                timer = new Countdown({
                    name: `Temporizador ${this.timers.filter(t => t.type === 'countdown').length + 1}`,
                    duration: this.settings.defaultDuration * 60000,
                    onFinish: () => this.onTimerFinish(timer)
                });
                break;
                
            case 'rounds':
                timer = new RoundCounter({
                    name: `Contador ${this.timers.filter(t => t.type === 'rounds').length + 1}`,
                    step: this.settings.roundStep
                });
                break;
                
            case 'interval':
                timer = new IntervalTimer({
                    name: `HIIT ${this.timers.filter(t => t.type === 'interval').length + 1}`,
                    onFinish: () => this.onTimerFinish(timer)
                });
                break;
                
            default:
                console.error('Unknown timer type:', type);
                return;
        }
        
        this.timers.push(timer);
        this.renderTimer(timer);
        this.updateEmptyState();
        
        return timer;
    },
    
    renderTimer(timer) {
        const container = document.getElementById('timers-container');
        const emptyState = document.getElementById('empty-state');
        
        if (emptyState) {
            emptyState.classList.add('hidden');
        }
        
        const card = timer.render();
        container.appendChild(card);
    },
    
    removeTimer(timerId) {
        const index = this.timers.findIndex(t => t.id === timerId);
        if (index === -1) return;
        
        const timer = this.timers[index];
        timer.destroy();
        this.timers.splice(index, 1);
        
        const card = document.getElementById(`timer-${timerId}`);
        if (card) {
            card.remove();
        }
        
        this.updateEmptyState();
    },
    
    updateEmptyState() {
        const emptyState = document.getElementById('empty-state');
        if (emptyState) {
            if (this.timers.length === 0) {
                emptyState.classList.remove('hidden');
            } else {
                emptyState.classList.add('hidden');
            }
        }
    },
    
    onTimerFinish(timer) {
        console.log('Timer finished:', timer.name);
    },
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
        }
    },
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        }
    },
    
    loadSettings() {
        document.getElementById('setting-sound').checked = this.settings.soundEnabled;
        document.getElementById('setting-volume').value = this.settings.volume;
        document.getElementById('setting-default-duration').value = this.settings.defaultDuration;
        document.getElementById('setting-round-step').value = this.settings.roundStep;
    },
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        Storage.saveTheme(this.currentTheme);
        this.updateThemeIcon();
    },
    
    updateThemeIcon() {
        const sunIcon = document.getElementById('icon-sun');
        const moonIcon = document.getElementById('icon-moon');
        
        if (this.currentTheme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    },
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
};

// Global helper function to update timer display
// fullRender: true = re-render completo (cambios de estado), false = solo actualizar tiempo
function updateTimerDisplay(timer, fullRender = true) {
    const card = document.getElementById(`timer-${timer.id}`);
    if (!card) return;
    
    if (fullRender) {
        // Re-render completo para cambios de estado (start, pause, reset)
        const newCard = timer.render();
        card.replaceWith(newCard);
    } else {
        // Solo actualizar el display de tiempo sin re-renderizar
        const display = card.querySelector('.timer-display');
        if (display) {
            display.textContent = timer.getFormattedTime();
            // Actualizar clases de estado
            display.className = `timer-display ${timer.state}`;
        }
        
        // Para intervalos, actualizar también la fase y progreso
        if (timer.type === 'interval') {
            const phaseValue = card.querySelector('.interval-phase-value');
            if (phaseValue) {
                phaseValue.textContent = timer.getPhaseLabel();
                phaseValue.className = `interval-phase-value ${timer.phase}`;
            }
            
            const roundInfo = card.querySelector('.timer-info-item span:last-child');
            if (roundInfo) {
                roundInfo.textContent = `Ronda ${timer.currentRound} de ${timer.totalRounds}`;
            }
            
            const progressBar = card.querySelector('.interval-progress-bar');
            if (progressBar && timer.state !== 'idle') {
                const totalTime = (timer.workDuration + timer.restDuration) * timer.totalRounds;
                const elapsedTotal = ((timer.currentRound - 1) * (timer.workDuration + timer.restDuration)) + 
                                     (timer.phase === 'work' ? 0 : timer.workDuration) + 
                                     (timer.duration - timer.remainingTime);
                const progressPercent = totalTime > 0 ? (elapsedTotal / totalTime) * 100 : 0;
                progressBar.style.width = `${Math.min(progressPercent, 100)}%`;
            }
        }
        
        // Para countdown, actualizar display principal
        if (timer.type === 'countdown') {
            const display = card.querySelector('.timer-display');
            if (display) {
                display.textContent = timer.getFormattedTime();
                display.className = `timer-display ${timer.state}`;
            }
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
