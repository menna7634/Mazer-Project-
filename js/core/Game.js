import { StorageSystem } from '../storage/storage.js';
import { mazes } from '../maze/MazeLevels.js';
import { loadLevelMaze, drawMaze, animateKeys } from '../maze/Maze.js';
import { createPlayer } from '../player/PlayerController.js';
import HUD from './HUD.js';
import Timer from './Timer.js';
import Camera from './Camera.js';

class Game {
  constructor() {
    this.lvl = 1;
    this.keys = 0;
    this.running = false;
    this.paused = false;
    this.maze = null;
    this.player = null;
    this.timer = new Timer();
    
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.TILE_SIZE = 80;
    
    this.camera = new Camera(
      this.canvas ? this.canvas.width : 800,
      this.canvas ? this.canvas.height : 600,
      this.TILE_SIZE
    );
    
    this.lastFrameTime = 0;
    this.animationFrameId = null;
  }

  start() {
    this.lvl = 1;
    this.keys = 0;
    this.loadLvl(1);
  }

  loadLvl(num) {
    this.lvl = num;
    this.running = true;
    this.paused = false;
    this.keys = 0;
    
    this.maze = mazes[num - 1];
    
    loadLevelMaze(num).then(() => {
      const sprite = new Image();
      sprite.onload = () => {
        let startX = 0;
        let startY = 0;
        let lives = 3;
        
        if (this.savedData) {
          if (this.savedData.playerPosition) {
            startX = this.savedData.playerPosition.x;
            startY = this.savedData.playerPosition.y;
          }
          if (this.savedData.hearts) {
            lives = this.savedData.hearts;
          }
          if (this.savedData.keys) {
            this.keys = this.savedData.keys;
          }
        }
        
        this.player = createPlayer({
          startX: startX,
          startY: startY,
          lives: lives, 
          maze: this.maze,
          spriteImage: sprite
        });
        
        // // حدّث الكاميرا بناءً على حجم الـ maze
        // this.camera.width = this.maze[0].length * this.TILE_SIZE;
        // this.camera.height = this.maze.length * this.TILE_SIZE;
        
        this.startGameLoop();
      };
      sprite.src = 'assets/sprites/player/player.png';
      
      this.updateUI();
      
      let timeForLevel = 60; 
      if (num === 1) timeForLevel = 90;
      if (num === 2) timeForLevel = 120;
      if (num === 3) timeForLevel = 180;
      
      if (this.savedData && this.savedData.time) {
        timeForLevel = this.savedData.time;
        this.savedData = null; 
      }
      
      this.timer.startCountdown(timeForLevel, this);
    })
  }

  move(dir) {
    if (!this.running || this.paused || !this.player) return;
    let dx = 0, dy = 0;

    if (dir === 'left') dx = -1;
    if (dir === 'right') dx = 1;
    if (dir === 'up') dy = -1;
    if (dir === 'down') dy = 1;
    
    if (this.player.movePlayer(dx, dy)) {
      const newPos = this.player.getPlayerPosition();
      this.handleTile(newPos.x, newPos.y);
      this.updateUI();
      
      if (!this.player.isPlayerAlive()) {
        this.gameOver();
      } 
      else if (this.checkWin(newPos)) {
        this.nextLvl();
      }
    }
  }

  handleTile(x, y) {
    const tile = this.maze[y][x];
    
    if (tile === 4) {
      this.player.loseLife();
    } 
    else if (tile === 2) {
      this.player.gainLife();
      this.maze[y][x] = 0; 
    } 
    else if (tile === 3) {
      this.keys++;
      this.maze[y][x] = 0; 
    }
  }

  checkWin(pos) {
    if (this.maze[pos.y][pos.x] !== 5) return false;
    
    for (let row of this.maze) {
      for (let tile of row) {
        if (tile === 3) return false; 
      }
    }
    return true;
  }

  nextLvl() {
    this.timer.stop();
    this.lvl = this.lvl + 1; 
    this.rollingSave();      
    setTimeout(() => this.loadLvl(this.lvl), 2000);
  }

  gameOver() {
    this.running = false;
    this.timer.stop();
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    alert('Game Over! You reached Level ' + this.lvl);
  }

  togglePause(shouldPause) {
    this.paused = shouldPause;
    shouldPause ? this.timer.pause() : this.timer.resume();
  }

  exitGame() {
    let wantSave = confirm('Do you want to save your progress?');
    
    if (wantSave) {
      this.rollingSave();
    }
    
    this.running = false;
    this.timer.stop();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  updateUI() {
    const hearts = this.player ? this.player.getLivesCount() : 3;
    HUD.updateHearts(hearts);
    HUD.updateKeys(this.keys);
    HUD.updateLevel(this.lvl);
    HUD.updateTimer(this.timer.timeLeft);
  }

  startGameLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    this.lastFrameTime = performance.now();
    this.gameLoop();
  }

  gameLoop = (currentTime) => {
    if (!this.running) return;
    
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    
    if (this.player) {
      const pos = this.player.getVisualPosition();
      this.camera.follow(pos.x, pos.y);
      this.camera.clamp(this.maze[0].length, this.maze.length);
    }
    
    if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    if (this.maze && this.ctx) {
        drawMaze(this.maze, this.camera);
    }
    
    animateKeys(this.camera); 
    if (!this.paused && this.player) {
      this.player.update(deltaTime);
      this.renderPlayer();
    } else if (this.player) {
        this.renderPlayer();
    }
    
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  }

  renderPlayer() {
    if (!this.player || !this.ctx) return;
    
    this.player.draw(this.ctx, this.TILE_SIZE, this.camera);
  }

  save(slot) {
    if (!this.player) return;
    let pos = this.player.getPlayerPosition();
    let hearts = this.player.getLivesCount();
    StorageSystem.saveToSlot(slot, {
      level: this.lvl,
      hearts: hearts,
      keys: this.keys,
      time: this.timer.timeLeft,
      playerPosition: pos
    });
  }

  rollingSave() {
    let slot1 = StorageSystem.loadFromSlot(1);
    let slot2 = StorageSystem.loadFromSlot(2);
    
    if (slot2) {
      StorageSystem.saveToSlot(3, slot2);
    }
    
    if (slot1) {
      StorageSystem.saveToSlot(2, slot1);
    }
    
    this.save(1);
  }

  load(slot) {
    let data = StorageSystem.loadFromSlot(slot);
    if (!data) return false;
    
    this.lvl = data.level;
    this.keys = data.keys;
    
    this.savedData = data;
    
    this.loadLvl(this.lvl);
    
    return true;
  }
}

const game = new Game();
window.game = game;

document.addEventListener('DOMContentLoaded', () => {
  const btnNewGame = document.getElementById('btn-new-game');
  if (btnNewGame) {
    btnNewGame.addEventListener('click', () => {
      game.start();
    });
  }
});

window.onPause = () => {
  game.togglePause(true);
  document.getElementById('pause-menu').showModal();
};

window.onResume = () => {
  game.togglePause(false);
  document.getElementById('pause-menu').close();
};

window.onRestart = () => {
  game.loadLvl(game.lvl);
  document.getElementById('pause-menu').close();
};

window.onQuit = () => {
  document.getElementById('pause-menu').close();
  game.running = false;
  game.timer.stop();
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && game.running) {
    if (game.paused) {
      window.onResume();
    } else {
      window.onPause();
    }
    return;
  }
  
  if (!game.running || game.paused) return;
  
  const keys = {
    'ArrowUp': 'up',
    'ArrowDown': 'down', 
    'ArrowLeft': 'left',
    'ArrowRight': 'right'
  };
  
  if (keys[e.key]) {
    game.move(keys[e.key]);
  }
});