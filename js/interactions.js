// Interactive Tables with Easter Eggs
// This is the main class that handles all the cool stuff on the tables
class TableInteractions {
    constructor() {
        // The famous Konami code! up up down down left right left right B A
        // I learned this from old video games lol
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        // This keeps track of where we are in the konami code sequence
        this.konamiIndex = 0;
        // Array to store the last few cells that were clicked
        this.clickSequence = [];
        // Set to remember which secrets we already found (so they don't repeat)
        this.secretsFound = new Set();

        // Start everything up!
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

    // This sets up all the event listeners
    // Event listeners are like "hey, when this happens, do that"
    setupEventListeners() {
        // Listen for keyboard presses (for the Konami code!)
        document.addEventListener('keydown', (e) => this.handleKonamiCode(e));

        // Find all cells that can be clicked and add listeners to them
        // querySelectorAll gets ALL elements with that class
        document.querySelectorAll('.clickable-cell').forEach(cell => {
            // Single click
            cell.addEventListener('click', (e) => this.handleCellClick(e));
            // Double click (click twice fast)
            cell.addEventListener('dblclick', (e) => this.handleDoubleClick(e));
        });

        // Schedule cells have their own special click behavior
        document.querySelectorAll('.schedule-cell').forEach(cell => {
            cell.addEventListener('click', (e) => this.handleScheduleClick(e));
        });

        // When you click the egg emoji in the corner, show a hint
        document.getElementById('easterEggIndicator').addEventListener('click', () => {
            this.showSecretMessage('🎮 Try the Konami Code! ↑↑↓↓←→←→BA');
        });
    }

    // Changes the emoji in the corner based on what time it is
    setupEasterEggIndicator() {
        // Get the egg indicator element from the HTML
        const indicator = document.getElementById('easterEggIndicator');

        // Get the current hour (0-23)
        const hour = new Date().getHours();

        // Change emoji based on time of day
        // I think this is cool because it makes the page feel alive
        if (hour >= 6 && hour < 12) {
            indicator.textContent = '🌅'; // Morning sunrise
        } else if (hour >= 12 && hour < 18) {
            indicator.textContent = '☀️'; // Afternoon sun
        } else if (hour >= 18 && hour < 22) {
            indicator.textContent = '🌆'; // Evening sunset
        } else {
            indicator.textContent = '🌙'; // Night moon
        }
    }

    // Does different things depending on what time it is
    // This makes the page more fun at different times of day
    setupTimeBasedEffects() {
        // Get current hour
        const hour = new Date().getHours();

        // If it's late at night or early morning, turn on dark mode
        // 22 = 10pm, 6 = 6am
        if (hour >= 22 || hour < 6) {
            document.body.classList.add('dark-mode'); // Add the dark-mode CSS class
            this.showSecretMessage('🌙 Night mode activated!');
        }

        // If it's lunch time, make the lunch cells bounce!
        // Because everyone loves lunch lol
        if (hour >= 12 && hour <= 14) {
            document.querySelectorAll('.lunch-break').forEach(cell => {
                // infinite means it keeps bouncing forever (or until page refresh)
                cell.style.animation = 'bounce 2s infinite';
            });
        }
    }

    // Makes tables spin when you double click them
    // I thought this would be a fun surprise
    setupDoubleClickEffects() {
        // Get all tables with the interactive-table class
        document.querySelectorAll('.interactive-table').forEach(table => {
            // Listen for double clicks
            table.addEventListener('dblclick', (e) => {
                // Make sure we clicked the table itself, not a cell
                if (e.target.tagName === 'TABLE') {
                    this.tableSpinEffect(table); // Spin it!
                }
            });
        });
    }

    // This checks if the user is typing the Konami code
    // It's called every time a key is pressed
    handleKonamiCode(e) {
        // Check if the key pressed matches the next key in the sequence
        // e.code is the key that was pressed
        // this.konamiIndex tells us which key in the sequence we're expecting
        if (e.code === this.konamiCode[this.konamiIndex]) {
            // Correct key! Move to the next one
            this.konamiIndex++;

            // Did we complete the whole code?
            if (this.konamiIndex === this.konamiCode.length) {
                // YES! Activate the ultimate easter egg!
                this.activateKonamiMode();
                // Reset the index so they can do it again
                this.konamiIndex = 0;
            }
        } else {
            // Wrong key pressed, start over from the beginning
            // This is important because if you mess up, you have to start again
            this.konamiIndex = 0;
        }
    }

    // This runs when someone clicks a cell
    handleCellClick(e) {
        // e.target is the element that was clicked
        const cell = e.target;
        // Check if this cell has a secret (from data-secret attribute in HTML)
        const secret = cell.dataset.secret;

        // Add this cell to our click history
        // We keep track of the last 5 clicks to detect patterns
        this.clickSequence.push(cell);
        if (this.clickSequence.length > 5) {
            // If we have more than 5, remove the oldest one
            // shift() removes the first item from an array
            this.clickSequence.shift();
        }

        // Show the cool ripple effect when clicked
        this.cellClickEffect(cell);

        // If this cell has a secret AND we haven't found it yet
        if (secret && !this.secretsFound.has(secret)) {
            // Activate the secret!
            this.activateSecret(secret, cell);
            // Remember that we found this one
            this.secretsFound.add(secret);
        }

        // Check if the user clicked cells in a special pattern
        this.checkClickPatterns();
    }

    // When someone double clicks a cell
    handleDoubleClick(e) {
        const cell = e.target; // Get the cell that was double clicked
        this.cellDoubleClickEffect(cell); // Do the double click effect
    }

    // Special handler for schedule table cells
    handleScheduleClick(e) {
        const cell = e.target;

        // Check if the cell is empty (trim removes spaces)
        if (cell.textContent.trim() === '') {
            // Array of random subject emojis
            const subjects = ['📚', '💻', '🔬', '📊', '🎨', '🏃‍♂️'];
            // Pick a random one from the array
            // Math.random() gives a number between 0 and 1
            // Multiply by length and floor it to get a random index
            const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
            // Put the emoji in the cell
            cell.textContent = randomSubject;
            // Give it a random color background
            cell.style.background = this.getRandomColor();

            // Show a message
            this.showSecretMessage('📅 Class added!');
        }
    }

    // Creates a cool ripple effect when you click a cell
    // Like when you drop something in water
    cellClickEffect(cell) {
        // Create a new div element for the ripple
        const ripple = document.createElement('div');
        // Set all the CSS styles at once using cssText
        // This makes a small white circle that will expand
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

        // Make sure the cell can contain the ripple
        cell.style.position = 'relative';
        // Add the ripple to the cell
        cell.appendChild(ripple);

        // Remove the ripple after the animation finishes (600ms)
        setTimeout(() => ripple.remove(), 600);

        // Add the ripple animation CSS if it doesn't exist yet
        // We only need to add this once, not every time
        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style'; // Give it an ID so we can check if it exists
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            // Add the style to the page head
            document.head.appendChild(style);
        }
    }

    // What happens when you double click a cell
    cellDoubleClickEffect(cell) {
        // Add shake animation
        cell.classList.add('shake-mode');
        // Remove it after 1 second (1000 milliseconds)
        setTimeout(() => cell.classList.remove('shake-mode'), 1000);

        // Save the original background color so we can restore it
        const originalBg = cell.style.background;
        // Change to a random color
        cell.style.background = this.getRandomColor();

        // Change it back after 2 seconds
        setTimeout(() => {
            cell.style.background = originalBg;
        }, 2000);
    }

    // Makes a table spin 360 degrees
    // This is just for fun lol
    tableSpinEffect(table) {
        // rotate(360deg) makes it spin all the way around
        table.style.transform = 'rotate(360deg)';
        // transition makes it smooth instead of instant
        // 1s = 1 second, ease-in-out makes it start slow, speed up, then slow down
        table.style.transition = 'transform 1s ease-in-out';

        // After the spin is done (1 second), reset it
        setTimeout(() => {
            table.style.transform = ''; // Empty string removes the transform
        }, 1000);

        // Show a message
        this.showSecretMessage('🌪️ Table spin activated!');
    }

    // Activates different secret effects based on which secret was found
    // switch is like a bunch of if statements but cleaner
    activateSecret(secret, cell) {
        switch (secret) {
            case 'rainbow':
                // Make this cell rainbow colored
                cell.classList.add('rainbow-mode');
                this.showSecretMessage('🌈 Rainbow mode activated!');
                // Turn it off after 5 seconds (5000 milliseconds)
                setTimeout(() => cell.classList.remove('rainbow-mode'), 5000);
                break; // break stops the switch from continuing

            case 'disco':
                // Make ALL cells disco! This one is crazy
                document.querySelectorAll('.clickable-cell').forEach(c => {
                    c.classList.add('disco-mode');
                });
                this.showSecretMessage('🕺 Disco mode activated!');
                // Turn off disco mode after 5 seconds
                setTimeout(() => {
                    document.querySelectorAll('.clickable-cell').forEach(c => {
                        c.classList.remove('disco-mode');
                    });
                }, 5000);
                break;

            case 'matrix':
                // Matrix style green text on black
                cell.classList.add('matrix-mode');
                this.showSecretMessage('🔢 Welcome to the Matrix!');
                setTimeout(() => cell.classList.remove('matrix-mode'), 5000);
                break;

            case 'konami':
                // This is just a hint that there's a bigger secret
                this.showSecretMessage('🎮 Konami cell found! Try the full code!');
                break;
        }
    }

    // THE BIG ONE! This is what happens when you complete the Konami code
    // I made this super flashy because it's supposed to be the ultimate reward
    activateKonamiMode() {
        // Make the whole page rainbow!
        document.body.style.animation = 'rainbow 3s infinite';

        // Make all tables disco spin
        document.querySelectorAll('.interactive-table').forEach(table => {
            table.style.animation = 'disco 2s infinite';
        });

        // Show the victory message
        this.showSecretMessage('🎉 KONAMI CODE ACTIVATED! Ultimate mode!');

        // Animate all the cells one by one
        // This creates a cool wave effect across all the tables
        document.querySelectorAll('.clickable-cell').forEach((cell, index) => {
            // setTimeout delays each cell's animation
            // index * 100 means each cell waits 100ms more than the previous one
            setTimeout(() => {
                cell.classList.add('rainbow-mode'); // Make it rainbow
                this.cellClickEffect(cell); // Add the ripple effect
            }, index * 100);
        });

        // Turn everything off after 30 seconds (changed from 10 to make it last longer!)
        // 30000 milliseconds = 30 seconds
        setTimeout(() => {
            // Remove all the animations by setting them to empty string
            document.body.style.animation = '';
            document.querySelectorAll('.interactive-table').forEach(table => {
                table.style.animation = '';
            });
            document.querySelectorAll('.clickable-cell').forEach(cell => {
                cell.classList.remove('rainbow-mode');
            });
        }, 30000); // Changed from 10000 to 30000!
    }

    // Checks if the user clicked cells in a special pattern
    checkClickPatterns() {
        // Only check if we have at least 3 clicks recorded
        if (this.clickSequence.length >= 3) {
            // Get the last 3 cells that were clicked
            // slice(-3) gets the last 3 items from the array
            const lastThree = this.clickSequence.slice(-3);

            // Check if all 3 clicks were on the same cell
            // every() checks if all items pass the test
            if (lastThree.every(cell => cell === lastThree[0])) {
                // They clicked the same cell 3 times! Easter egg!
                this.showSecretMessage('🎯 Triple click detected!');
                // Make the cell bigger
                lastThree[0].style.transform = 'scale(1.5)';
                // Return it to normal size after 1 second
                setTimeout(() => {
                    lastThree[0].style.transform = '';
                }, 1000);
            }
        }
    }

    // Shows a message in the center of the screen
    // Used for all the easter egg messages
    showSecretMessage(message) {
        // Get the message element from the HTML
        const messageEl = document.getElementById('secretMessage');
        // Set the text to whatever message we want to show
        messageEl.textContent = message;
        // Make it visible (it's hidden by default)
        messageEl.style.display = 'block';

        // Hide it after 6 seconds (6000 milliseconds)
        // I increased this from 3 seconds so people have more time to read it
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 6000);
    }

    // Returns a random gradient color from our list
    // I picked colors that look nice together
    getRandomColor() {
        // Array of gradient colors (they look cooler than solid colors)
        const colors = [
            'linear-gradient(45deg, #ff6b6b, #ee5a24)', // Red/orange
            'linear-gradient(45deg, #4834d4, #686de0)', // Purple/blue
            'linear-gradient(45deg, #00d2d3, #54a0ff)', // Cyan/blue
            'linear-gradient(45deg, #5f27cd, #a55eea)', // Purple
            'linear-gradient(45deg, #00d84a, #05c46b)', // Green
            'linear-gradient(45deg, #ff3838, #ff6348)'  // Red
        ];
        // Pick a random color from the array
        // Math.random() * colors.length gives us a random number
        // Math.floor() rounds it down to get a valid array index
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Additional fun features
// This class adds games you can play with the tables
class TableGames {
    constructor() {
        // Start setting up the games
        this.setupTableGames();
    }

    // Initialize all the games
    setupTableGames() {
        // Tic-tac-toe in empty schedule cells
        this.setupTicTacToe();

        // Memory game with cells
        this.setupMemoryGame();
    }

    // Sets up tic-tac-toe game in empty schedule cells
    // You can play with a friend!
    setupTicTacToe() {
        // Find all empty cells in the schedule
        // :empty is a CSS selector that finds empty elements
        const emptyCells = document.querySelectorAll('.schedule-cell:empty');
        // Start with player X
        let currentPlayer = 'X';

        // Add click listener to each empty cell
        emptyCells.forEach(cell => {
            cell.addEventListener('click', () => {
                // Only place a mark if the cell is still empty
                if (cell.textContent === '') {
                    // Put X or O in the cell
                    cell.textContent = currentPlayer;
                    // Make it bigger and bold
                    cell.style.fontSize = '24px';
                    cell.style.fontWeight = 'bold';
                    // X is red, O is blue (using ternary operator)
                    // condition ? valueIfTrue : valueIfFalse
                    cell.style.color = currentPlayer === 'X' ? '#ff6b6b' : '#4834d4';

                    // Switch to the other player
                    // If it's X, make it O. If it's O, make it X
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                }
            });
        });
    }

    // Sets up the memory game
    // Press Ctrl+M to start it
    setupMemoryGame() {
        // These variables would be used for tracking the game
        // I haven't finished implementing the full game yet
        // TODO: finish the memory game logic
        let sequence = []; // Will store the sequence to remember
        let playerSequence = []; // Will store what the player clicks
        let isPlaying = false; // Track if game is active

        // Listen for Ctrl+M to start the game
        document.addEventListener('keydown', (e) => {
            // e.ctrlKey checks if Ctrl is pressed
            // e.key checks which key was pressed
            if (e.ctrlKey && e.key === 'm') {
                this.startMemoryGame(); // Start the game!
            }
        });
    }

    // Starts the memory game
    // Shows a sequence of cells lighting up that you need to remember
    startMemoryGame() {
        // Get all the cells we can use
        const cells = document.querySelectorAll('.clickable-cell');
        const sequence = []; // Array to store the sequence

        // Generate a random sequence of 5 cells
        // for loop runs 5 times (i = 0, 1, 2, 3, 4)
        for (let i = 0; i < 5; i++) {
            // Pick a random cell and add it to the sequence
            sequence.push(cells[Math.floor(Math.random() * cells.length)]);
        }

        // Show the sequence to the player
        // forEach loops through each cell in the sequence
        sequence.forEach((cell, index) => {
            // Delay each cell's flash based on its position
            // index * 600 means: 0ms, 600ms, 1200ms, 1800ms, 2400ms
            setTimeout(() => {
                // Flash the cell yellow
                cell.style.background = '#ffff00';
                // Turn it back to normal after 500ms
                setTimeout(() => {
                    cell.style.background = '';
                }, 500);
            }, index * 600);
        });

        // TODO: Add player input validation
        // Right now it just shows the sequence but doesn't check if you got it right
        // That's something I need to add later
        document.getElementById('secretMessage').textContent = '🧠 Memory game started! Remember the sequence!';
        document.getElementById('secretMessage').style.display = 'block';

        // Hide the message after 3 seconds
        setTimeout(() => {
            document.getElementById('secretMessage').style.display = 'none';
        }, 3000);
    }
}

// Initialize everything when DOM is loaded
// DOMContentLoaded fires when the HTML is fully loaded
// We wait for this so all the elements exist before we try to use them
document.addEventListener('DOMContentLoaded', () => {
    // Create new instances of our classes
    // This starts up all the interactive features
    new TableInteractions(); // Main interactions
    new TableGames(); // Games like tic-tac-toe

    // Print helpful hints to the browser console
    // Open DevTools (F12) to see these!
    console.log('🎮 Easter Eggs Available:');
    console.log('- Try the Konami Code: ↑↑↓↓←→←→BA');
    console.log('- Click cells with special data attributes');
    console.log('- Double-click tables for spin effect');
    console.log('- Triple-click same cell for special effect');
    console.log('- Ctrl+M for memory game');
    console.log('- Click empty schedule cells for tic-tac-toe');
    console.log('- Time-based effects (night mode, lunch animations)');
});
