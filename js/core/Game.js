import { StorageSystem } from "../storage/storage.js";
import {
  loadLevelMaze,
  renderMaze,
  getStartPosition,
  hasTrap,
  hasLife,
  getMummyPositions,
  getMaze,
} from "../maze/Maze.js";
import { createPlayer } from "../player/PlayerController.js";
import { createEnemy } from "../enemies/EnemyController.js";
import HUD from "./HUD.js";
import Timer from "./Timer.js";
import Camera from "./Camera.js";
import { gateModal, showScreen, playLevelMusic } from "../navigation.js";

class Game {
  constructor() {
    this.lvl = 1;
    this.keys = 0;
    this.running = false;
    this.paused = false;
    this.maze = null;
    this.player = null;
    this.enemies = [];
    this.timer = new Timer();
    this.timeForLevel = 0;

    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.TILE_SIZE = 120;

    this.camera = new Camera(
      this.canvas ? this.canvas.width : 800,
      this.canvas ? this.canvas.height : 600,
      this.TILE_SIZE,
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
    this.enemies = [];
    this.startingTime = new Date().getSeconds();
    let savedKeys = null;
    let savedMaze = null;
    let savedTime = null;
    let savedHearts = null;
    let savedPosition = null;

    if (this.savedData) {
      savedKeys = this.savedData.keys;
      savedMaze = this.savedData.mazeState;
      savedTime = this.savedData.time;
      savedHearts = this.savedData.hearts;
      savedPosition = this.savedData.playerPosition;
      this.savedData = null;
    }

    if (savedKeys !== null) {
      this.keys = savedKeys;
    } else {
      this.keys = 0;
    }

    if (savedMaze) {
      this.maze = savedMaze.map((row) => [...row]);
    } else {
      this.maze = getMaze(num).map((row) => [...row]);
    }

    playLevelMusic(num);

    loadLevelMaze().then(() => {
      const sprite = new Image();
      const enemySprite = new Image();

      sprite.onload = () => {
        let startX = 0;
        let startY = 0;
        let lives = 3;

        if (savedPosition) {
          startX = savedPosition.x;
          startY = savedPosition.y;
        } else {
          const startPos = getStartPosition();
          startX = startPos.col;
          startY = startPos.row;
        }

        if (savedHearts) {
          lives = savedHearts;
        }

        this.player = createPlayer({
          startX: startX,
          startY: startY,
          lives: lives,
          maze: this.maze,
          spriteImage: sprite,
        });

        this.updateUI();
        this.startGameLoop();
      };

      enemySprite.onload = () => {
        this.spawnEnemies(enemySprite);
      };

      sprite.src = "assets/sprites/player/player.png";
      enemySprite.src =
        "assets/images/gameplay/characters/enimies/mummy-02.png";

      this.updateUI();

      if (num === 1) this.timeForLevel = 90;
      if (num === 2) this.timeForLevel = 120;
      if (num === 3) this.timeForLevel = 180;

      if (savedTime) {
        this.timeForLevel = savedTime;
      }

      this.timer.startCountdown(this.timeForLevel, this);
    });
  }

  spawnEnemies(spriteImage) {
    const mummyPositions = getMummyPositions();
    mummyPositions.forEach(({ x, y }) => {
      const enemy = createEnemy({
        x: x,
        y: y,
        maze: this.maze,
        spriteImage: spriteImage,
      });
      this.enemies.push(enemy);
      this.maze[y][x] = 0;
    });
  }

  move(dir) {
    if (!this.running || this.paused || !this.player) return;

    let dx = 0;
    let dy = 0;

    if (dir === "left") dx = -1;
    if (dir === "right") dx = 1;
    if (dir === "up") dy = -1;
    if (dir === "down") dy = 1;

    if (this.player.movePlayer(dx, dy)) {
      const newPos = this.player.getPlayerPosition();
      this.handleTile(newPos.x, newPos.y);
      this.updateUI();
      if (this.checkWin(newPos)) {
        this.nextLvl();
      }
    }
  }

  checkEnemyCollision(playerX, playerY) {
    for (let enemy of this.enemies) {
      const enemyPos = enemy.getPosition();
      if (enemyPos.x === playerX && enemyPos.y === playerY) {
        this.player.loseLife();
        if (this.player.isPlayerAlive()) {
          this.player.resetPlayerPosition();
        } else {
          this.gameOver();
          break;
        }
      }
    }
  }

  handleTile(x, y) {
    if (hasTrap(y, x, this.lvl)) {
      this.player.loseLife();
    } else if (hasLife(y, x, this.lvl)) {
      this.player.gainLife();
      this.maze[y][x] = 0;
    } else if (this.maze[y][x] === 3) {
      this.keys++;
      this.maze[y][x] = 0;
    }
    //check if the player is still alive after handling the tile
    if (!this.player.isPlayerAlive()) {
      this.gameOver();
    }

    if (this.keys === 3) {
      this.maze[this.maze.length - 1][
        this.maze[this.maze.length - 1].length - 1
      ] = 6;
    }
  }

  checkWin(pos) {
    const tile = this.maze[pos.y][pos.x];
    return tile === 6;
  }

  nextLvl() {
    this.timer.stop();
    this.lvl = this.lvl + 1;
    gateModal(() => {
      if (this.lvl > 3) {
        showScreen("win-screen");
      } else {
        this.loadLvl(this.lvl);
      }
    });
  }

  gameOver() {
    this.running = false;
    this.timer.stop();

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    gateModal(() => {
      showScreen("lose-screen");
    });
  }

  togglePause(shouldPause) {
    this.paused = shouldPause;

    if (shouldPause) {
      this.timer.pause();
    } else {
      this.timer.resume();
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
      renderMaze(this.maze, this.camera);
    }

    if (!this.paused) {
      for (let enemy of this.enemies) {
        enemy.update(deltaTime);
        enemy.draw(this.ctx, this.TILE_SIZE, this.camera);
        const playerPos = this.player.getPlayerPosition();
        this.checkEnemyCollision(playerPos.x, playerPos.y);
      }

      if (this.player) {
        this.player.update(deltaTime);
        this.renderPlayer();
      }
    } else {
      for (let enemy of this.enemies) {
        enemy.draw(this.ctx, this.TILE_SIZE, this.camera);
      }
      if (this.player) {
        this.renderPlayer();
      }
    }

    if (this.player && this.ctx) {
      this.lightCircle();
    }

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  renderPlayer() {
    if (!this.player || !this.ctx) return;
    this.player.draw(this.ctx, this.TILE_SIZE, this.camera);
  }

  load(slot) {
    const data = StorageSystem.loadFromSlot(slot);
    if (!data) return false;

    this.savedData = data;
    this.loadLvl(data.level);

    return true;
  }

  lightCircle() {
    if (!this.player || !this.camera) return;

    const playerPos = this.player.getVisualPosition();

    const playerXCord =
      playerPos.x * this.TILE_SIZE - this.camera.x + this.TILE_SIZE / 2;
    const playerYCord =
      playerPos.y * this.TILE_SIZE - this.camera.y + this.TILE_SIZE / 2;

    const lightRadius = 200;
    const fadeWidth = 60;

    this.ctx.save();

    const maxRadius = Math.sqrt(
      Math.pow(this.canvas.width, 2) + Math.pow(this.canvas.height, 2),
    );

    const darknessGradient = this.ctx.createRadialGradient(
      playerXCord,
      playerYCord,
      0,
      playerXCord,
      playerYCord,
      maxRadius,
    );

    const startFade = (lightRadius - fadeWidth) / maxRadius;
    const endFade = lightRadius / maxRadius;

    darknessGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    darknessGradient.addColorStop(Math.max(0, startFade), "rgba(0, 0, 0, 0)");
    darknessGradient.addColorStop(endFade, "rgba(0, 0, 0, 0.98)");
    darknessGradient.addColorStop(1, "rgba(0, 0, 0, 0.98)");

    this.ctx.fillStyle = darknessGradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.globalCompositeOperation = "lighter";
    const glowGradient = this.ctx.createRadialGradient(
      playerXCord,
      playerYCord,
      0,
      playerXCord,
      playerYCord,
      lightRadius,
    );

    glowGradient.addColorStop(0, "rgba(255, 200, 100, 0.1)");
    glowGradient.addColorStop(0.4, "rgba(255, 150, 50, 0.2)");
    glowGradient.addColorStop(0.7, "rgba(255, 100, 0, 0.1)");
    glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    this.ctx.fillStyle = glowGradient;
    this.ctx.beginPath();
    this.ctx.arc(playerXCord, playerYCord, lightRadius, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  saveGame() {
    StorageSystem.shiftSlotsDown();
    StorageSystem.saveToSlot(1, {
      level: this.lvl,
      hearts: this.player.getLivesCount(),
      keys: this.keys,
      time: this.timeForLevel - (new Date().getSeconds() - this.startingTime),
      playerPosition: this.player.getPlayerPosition(),
      mazeState: this.maze,
    });
  }
}

const game = new Game();
window.game = game;

window.onResume = function () {
  game.togglePause(false);
  document.getElementById("pause-menu").close();
};

window.onSave = function () {
  game.saveGame();
  window.onResume();
};

window.onRestart = function () {
  document.getElementById("pause-menu").close();
  game.loadLvl(game.lvl);
};

window.onQuit = function () {
  document.getElementById("pause-menu").close();
  game.running = false;
  game.timer.stop();
  showScreen("home");
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (game.running) {
      e.preventDefault();

      if (game.paused) {
        window.onResume();
      } else {
        game.togglePause(true);
        const pauseMenu = document.getElementById("pause-menu");
        if (pauseMenu) {
          pauseMenu.showModal();
          setTimeout(() => {
            document.activeElement.blur();
          }, 0);
        }
      }
      return;
    }
  }
  //handles s to save whenever it is pressed
  if (e.key === "s" && game.running) {
    game.saveGame();
  }

  if (!game.running || game.paused) return;

  const keys = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
  };

  if (keys[e.key]) {
    game.move(keys[e.key]);
  }
});
