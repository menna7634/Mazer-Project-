// HUD.js - updates the game display

class HUD {

    static updateHearts(hearts) {
        const element = document.querySelector('.heart-hud .hud-content');
        if (element) {
            element.textContent = '❤️'.repeat(hearts);
        }
    }

    static updateKeys(keys) {
        const element = document.querySelector('.key-hud .hud-content');
        if (element) {
            element.textContent = `🔑 ${keys}/5`;
        }
    }

    static updateLevel(level) {
        const element = document.querySelector('.level-hud .hud-content');
        if (element) {
            element.textContent = `Level ${level}`;
        }
    }

    static updateTimer(seconds) {
        const element = document.querySelector('.timer-hud .hud-content');
        if (element) {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            const formatted = String(minutes).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
            element.textContent = formatted;
        }
    }

    static updateAll(state) {
        this.updateHearts(state.playerHearts);
        this.updateKeys(state.keysCollected);
        this.updateLevel(state.currentLevel);
        this.updateTimer(state.timeInSeconds);
    }
}

export default HUD;
