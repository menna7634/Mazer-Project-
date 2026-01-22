import { StorageSystem } from '../storage/storage.js';
import { mazes } from '../maze/MazeLevels.js';
import { loadLevelMaze } from '../maze/Maze.js';
import GameState from './GameState.js';
import Timer from './Timer.js';
import HUD from './HUD.js';
import CollisionHandler from './CollisionHandler.js';
import MoveValidator from './MoveValidator.js';
import LevelManager from './LevelManager.js';
import Player from '../player/Player.js';

class Game {
  constructor() {
    this.state = new GameState();
    this.timer = new Timer();
    this.state.player = new Player(0, 0, 3);
  }

  startGame() {
    this.state.reset();
    this.startLevel(1);
  }

  startLevel(level) {
    this.state.currentLevel = level;
    this.state.isGameRunning = true;
    this.state.isPaused = false;
    this.state.resetLevel();

    this.state.currentMaze = mazes[level - 1];
    loadLevelMaze(level);

    HUD.updateAll(this.state);
    this.timer.reset();
    this.timer.start();
  }

  restartLevel() {
    this.startLevel(this.state.currentLevel);
  }

  handlePlayerMove(direction) {
    if (!this.state.isGameRunning || this.state.isPaused) {
      return;
    }

    const currentPos = this.state.player.getPlayerPosition();
    const newPos = MoveValidator.getNewPosition(currentPos, direction);

    if (MoveValidator.canMove(this.state.currentMaze, newPos.x, newPos.y)) {
      this.state.player.setPlayerPosition(newPos.x, newPos.y);

      CollisionHandler.checkHeart(this.state.currentMaze, newPos.x, newPos.y, this.state);
      CollisionHandler.checkKey(this.state.currentMaze, newPos.x, newPos.y, this.state);
      const hitMonster = CollisionHandler.checkMonster(this.state.currentMaze, newPos.x, newPos.y, this.state);

      HUD.updateAll(this.state);

      if (hitMonster && this.state.playerHearts <= 0) {
        this.endGame();
      }

      if (LevelManager.isLevelComplete(this.state.currentMaze, currentPos)) {
        this.levelComplete();
      }
    }
  }

  levelComplete() {
    this.timer.stop();

    setTimeout(() => {
      this.startLevel(this.state.currentLevel + 1);
    }, 2000);
  }

  endGame() {
    this.state.isGameRunning = false;
    this.timer.stop();
    LevelManager.showGameOver(this.state.currentLevel);
  }

  pauseGame() {
    this.state.isPaused = true;
    this.timer.pause();
  }

  resumeGame() {
    this.state.isPaused = false;
    this.timer.resume();
  }

  saveGame(slotNumber) {
    let playerPosition = this.state.player.getPlayerPosition();

    const gameData = {
      level: this.state.currentLevel,
      hearts: this.state.playerHearts,
      keys: this.state.keysCollected,
      time: this.timer.seconds,
      playerPosition: playerPosition
    };

    StorageSystem.saveToSlot(slotNumber, gameData);
  }

  loadGame(slotNumber) {
    const saveData = StorageSystem.loadFromSlot(slotNumber);

    if (!saveData) {
      return false;
    }

    this.state.currentLevel = saveData.level;
    this.state.playerHearts = saveData.hearts;
    this.state.keysCollected = saveData.keys;
    this.timer.seconds = saveData.time;

    if (saveData.playerPosition) {
      this.state.player.setPlayerPosition(saveData.playerPosition.x, saveData.playerPosition.y);
    }

    this.startLevel(this.state.currentLevel);
    return true;
  }
}

const game = new Game();
window.game = game;

function onPause() {
  game.pauseGame();
  document.getElementById('pause-menu').showModal();
}

function onResume() {
  game.resumeGame();
  document.getElementById('pause-menu').close();
}

function onRestart() {
  game.restartLevel();
  document.getElementById('pause-menu').close();
}

function onQuit() {
  document.getElementById('pause-menu').close();
  game.state.isGameRunning = false;
  game.timer.stop();
}

window.onPause = onPause;
window.onResume = onResume;
window.onRestart = onRestart;
window.onQuit = onQuit;

document.addEventListener('keydown', (e) => {
  if (window.game && window.game.state.isGameRunning && !window.game.state.isPaused) {
    if (e.key === 'ArrowUp') window.game.handlePlayerMove('up');
    else if (e.key === 'ArrowDown') window.game.handlePlayerMove('down');
    else if (e.key === 'ArrowLeft') window.game.handlePlayerMove('left');
    else if (e.key === 'ArrowRight') window.game.handlePlayerMove('right');
  }
});