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
        this.player = createPlayer({
          startX: 0,
          startY: 0,
          lives: 3, 
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
      } else if (this.checkWin(newPos)) {
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
    setTimeout(() => this.loadLvl(this.lvl + 1), 2000);
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
    const pos = this.player.getPlayerPosition();
    StorageSystem.saveToSlot(slot, {
      level: this.lvl,
      hearts: this.hearts,
      keys: this.keys,
      time: this.timer.seconds,
      playerPosition: pos
    });
  }

  load(slot) {
    const data = StorageSystem.loadFromSlot(slot);
    if (!data) return false;
    
    this.lvl = data.level;
    this.hearts = data.hearts;
    this.keys = data.keys;
    this.timer.seconds = data.time;
    
    this.loadLvl(this.lvl);
    
    if (data.playerPosition) {
      this.player.setPlayerPosition(data.playerPosition.x, data.playerPosition.y);
    }
    
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