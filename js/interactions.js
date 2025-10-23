// Interactive Tables with Easter Eggs
class TableInteractions {
    constructor() {
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        this.konamiIndex = 0;
        this.clickSequence = [];
        this.secretsFound = new Set();

        this.init();
    }

    // This function runs when the class is created
    // It sets up all the different features
    init() {
        this.setupEventListeners(); // Listen for clicks and keyboard
        this.setupEasterEggIndicator(); // Setup the egg emoji in corner
        this.setupTimeBasedEffects(); // Cool effects based on time of day
        this.setupDoubleClickEffects(); // What happens when you double click
    }

    setupEventListeners() {
        // Konami Code listener
        document.addEventListener('keydown', (e) => this.handleKonamiCode(e));

        // Cell click listeners
        document.querySelectorAll('.clickable-cell').forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
            cell.addEventListener('dblclick', (e) => this.handleDoubleClick(e));
        });

        // Schedule cell interactions
        document.querySelectorAll('.schedule-cell').forEach(cell => {
            cell.addEventListener('click', (e) => this.handleScheduleClick(e));
        });

        // Easter egg indicator
        document.getElementById('easterEggIndicator').addEventListener('click', () => {
            this.showSecretMessage('🎮 Try the Konami Code! ↑↑↓↓←→←→BA');
        });
    }

    setupEasterEggIndicator() {
        const indicator = document.getElementById('easterEggIndicator');

        // Change emoji based on time
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) {
            indicator.textContent = '🌅';
        } else if (hour >= 12 && hour < 18) {
            indicator.textContent = '☀️';
        } else if (hour >= 18 && hour < 22) {
            indicator.textContent = '🌆';
        } else {
            indicator.textContent = '🌙';
        }
    }

    setupTimeBasedEffects() {
        const hour = new Date().getHours();

        // Night mode
        if (hour >= 22 || hour < 6) {
            document.body.classList.add('dark-mode');
            this.showSecretMessage('🌙 Night mode activated!');
        }

        // Lunch time special effect
        if (hour >= 12 && hour <= 14) {
            document.querySelectorAll('.lunch-break').forEach(cell => {
                cell.style.animation = 'bounce 2s infinite';
            });
        }
    }

    setupDoubleClickEffects() {
        document.querySelectorAll('.interactive-table').forEach(table => {
            table.addEventListener('dblclick', (e) => {
                if (e.target.tagName === 'TABLE') {
                    this.tableSpinEffect(table);
                }
            });
        });
    }

    handleKonamiCode(e) {
        if (e.code === this.konamiCode[this.konamiIndex]) {
            this.konamiIndex++;

            if (this.konamiIndex === this.konamiCode.length) {
                this.activateKonamiMode();
                this.konamiIndex = 0;
            }
        } else {
            this.konamiIndex = 0;
        }
    }

    handleCellClick(e) {
        const cell = e.target;
        const secret = cell.dataset.secret;

        // Add to click sequence
        this.clickSequence.push(cell);
        if (this.clickSequence.length > 5) {
            this.clickSequence.shift();
        }

        // Cell click effect
        this.cellClickEffect(cell);

        // Check for secrets
        if (secret && !this.secretsFound.has(secret)) {
            this.activateSecret(secret, cell);
            this.secretsFound.add(secret);
        }

        // Check for click patterns
        this.checkClickPatterns();
    }

    handleDoubleClick(e) {
        const cell = e.target;
        this.cellDoubleClickEffect(cell);
    }

    handleScheduleClick(e) {
        const cell = e.target;

        if (cell.textContent.trim() === '') {
            // Add a random class or emoji
            const subjects = ['📚', '💻', '🔬', '📊', '🎨', '🏃‍♂️'];
            const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
            cell.textContent = randomSubject;
            cell.style.background = this.getRandomColor();

            this.showSecretMessage('📅 Class added!');
        }
    }

    cellClickEffect(cell) {
        // Ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            width: 20px;
            height: 20px;
            left: 50%;
            top: 50%;
            margin-left: -10px;
            margin-top: -10px;
        `;

        cell.style.position = 'relative';
        cell.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);

        // Add ripple animation if not exists
        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    cellDoubleClickEffect(cell) {
        cell.classList.add('shake-mode');
        setTimeout(() => cell.classList.remove('shake-mode'), 1000);

        // Random color change
        const originalBg = cell.style.background;
        cell.style.background = this.getRandomColor();

        setTimeout(() => {
            cell.style.background = originalBg;
        }, 2000);
    }

    tableSpinEffect(table) {
        table.style.transform = 'rotate(360deg)';
        table.style.transition = 'transform 1s ease-in-out';

        setTimeout(() => {
            table.style.transform = '';
        }, 1000);

        this.showSecretMessage('🌪️ Table spin activated!');
    }

    activateSecret(secret, cell) {
        switch (secret) {
            case 'rainbow':
                cell.classList.add('rainbow-mode');
                this.showSecretMessage('🌈 Rainbow mode activated!');
                setTimeout(() => cell.classList.remove('rainbow-mode'), 5000);
                break;

            case 'disco':
                document.querySelectorAll('.clickable-cell').forEach(c => {
                    c.classList.add('disco-mode');
                });
                this.showSecretMessage('🕺 Disco mode activated!');
                setTimeout(() => {
                    document.querySelectorAll('.clickable-cell').forEach(c => {
                        c.classList.remove('disco-mode');
                    });
                }, 5000);
                break;

            case 'matrix':
                cell.classList.add('matrix-mode');
                this.showSecretMessage('🔢 Welcome to the Matrix!');
                setTimeout(() => cell.classList.remove('matrix-mode'), 5000);
                break;

            case 'konami':
                this.showSecretMessage('🎮 Konami cell found! Try the full code!');
                break;
        }
    }

    activateKonamiMode() {
        // Ultimate easter egg
        document.body.style.animation = 'rainbow 3s infinite';

        document.querySelectorAll('.interactive-table').forEach(table => {
            table.style.animation = 'disco 2s infinite';
        });

        this.showSecretMessage('🎉 KONAMI CODE ACTIVATED! Ultimate mode!');

        // Play with all cells
        document.querySelectorAll('.clickable-cell').forEach((cell, index) => {
            setTimeout(() => {
                cell.classList.add('rainbow-mode');
                this.cellClickEffect(cell);
            }, index * 100);
        });

        // Reset after 10 seconds
        setTimeout(() => {
            document.body.style.animation = '';
            document.querySelectorAll('.interactive-table').forEach(table => {
                table.style.animation = '';
            });
            document.querySelectorAll('.clickable-cell').forEach(cell => {
                cell.classList.remove('rainbow-mode');
            });
        }, 10000);
    }

    checkClickPatterns() {
        // Check for specific click patterns
        if (this.clickSequence.length >= 3) {
            const lastThree = this.clickSequence.slice(-3);

            // Check if clicked same cell 3 times
            if (lastThree.every(cell => cell === lastThree[0])) {
                this.showSecretMessage('🎯 Triple click detected!');
                lastThree[0].style.transform = 'scale(1.5)';
                setTimeout(() => {
                    lastThree[0].style.transform = '';
                }, 1000);
            }
        }
    }

    showSecretMessage(message) {
        const messageEl = document.getElementById('secretMessage');
        messageEl.textContent = message;
        messageEl.style.display = 'block';

        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 6000);
    }

    getRandomColor() {
        const colors = [
            'linear-gradient(45deg, #ff6b6b, #ee5a24)',
            'linear-gradient(45deg, #4834d4, #686de0)',
            'linear-gradient(45deg, #00d2d3, #54a0ff)',
            'linear-gradient(45deg, #5f27cd, #a55eea)',
            'linear-gradient(45deg, #00d84a, #05c46b)',
            'linear-gradient(45deg, #ff3838, #ff6348)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Additional fun features
class TableGames {
    constructor() {
        this.setupTableGames();
    }

    setupTableGames() {
        // Tic-tac-toe in empty schedule cells
        this.setupTicTacToe();

        // Memory game with cells
        this.setupMemoryGame();
    }

    setupTicTacToe() {
        const emptyCells = document.querySelectorAll('.schedule-cell:empty');
        let currentPlayer = 'X';

        emptyCells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (cell.textContent === '') {
                    cell.textContent = currentPlayer;
                    cell.style.fontSize = '24px';
                    cell.style.fontWeight = 'bold';
                    cell.style.color = currentPlayer === 'X' ? '#ff6b6b' : '#4834d4';

                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                }
            });
        });
    }

    setupMemoryGame() {
        let sequence = [];
        let playerSequence = [];
        let isPlaying = false;

        // Add memory game trigger
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'm') {
                this.startMemoryGame();
            }
        });
    }

    startMemoryGame() {
        const cells = document.querySelectorAll('.clickable-cell');
        const sequence = [];

        // Generate random sequence
        for (let i = 0; i < 5; i++) {
            sequence.push(cells[Math.floor(Math.random() * cells.length)]);
        }

        // Show sequence
        sequence.forEach((cell, index) => {
            setTimeout(() => {
                cell.style.background = '#ffff00';
                setTimeout(() => {
                    cell.style.background = '';
                }, 500);
            }, index * 600);
        });

        // TODO: Add player input validation
        document.getElementById('secretMessage').textContent = '🧠 Memory game started! Remember the sequence!';
        document.getElementById('secretMessage').style.display = 'block';

        setTimeout(() => {
            document.getElementById('secretMessage').style.display = 'none';
        }, 3000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TableInteractions();
    new TableGames();

    // Add some helpful hints
    console.log('🎮 Easter Eggs Available:');
    console.log('- Try the Konami Code: ↑↑↓↓←→←→BA');
    console.log('- Click cells with special data attributes');
    console.log('- Double-click tables for spin effect');
    console.log('- Triple-click same cell for special effect');
    console.log('- Ctrl+M for memory game');
    console.log('- Click empty schedule cells for tic-tac-toe');
    console.log('- Time-based effects (night mode, lunch animations)');
});
