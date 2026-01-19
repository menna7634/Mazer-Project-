
export const StorageSystem = {
    // keys I use to save data in the browser
    KEYS: { 
        LEVEL: 'mazer_level', 
        LIVES: 'mazer_lives',
    },

    // Function to save current game state
    save: function(level, lives) {
        try {
            localStorage.setItem(this.KEYS.LEVEL, level);
            localStorage.setItem(this.KEYS.LIVES, lives);

            // to look state saved for test
            console.log(`Saved: Level ${level}, Lives ${lives}`);
        } catch (error) {
            // If any thing wrong
            console.warn("Storage warning: Could not save data.");
        }
    },

    // Function to load saved data when game starts
    load: function() {
        const savedLevel = localStorage.getItem(this.KEYS.LEVEL);
        const savedLives = localStorage.getItem(this.KEYS.LIVES);
        
        // If there is no saved level return null I mean cnsider new game
        if (!savedLevel || !savedLives) {
            return null;
        }

        return {
            level: parseInt(savedLevel),
            lives: parseInt(savedLives),
        };
    },

    // Function to delete everything Game Over or New Game
    clear: function() {
        localStorage.removeItem(this.KEYS.LEVEL);
        localStorage.removeItem(this.KEYS.LIVES);
    }
};