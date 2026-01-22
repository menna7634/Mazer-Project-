// GameState.js

class GameState {
    constructor() {
        this.currentLevel = 1;
        this.playerHearts = 3;
        this.keysCollected = 0;
        this.timeInSeconds = 0;
        this.isGameRunning = false;
        this.isPaused = false;
        this.currentMaze = null;
        this.player = null;
    }

    reset() {
        this.currentLevel = 1;
        this.playerHearts = 3;
        this.keysCollected = 0;
        this.timeInSeconds = 0;
    }

    resetLevel() {
        this.keysCollected = 0;
        this.timeInSeconds = 0;
    }
}

export default GameState;
