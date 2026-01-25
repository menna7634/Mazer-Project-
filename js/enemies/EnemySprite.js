import { CONFIG } from "../config/GameConfig.js";

const animationSpeed = CONFIG.ENEMY.ANIMATION_SPEED;
const moveSpeed = CONFIG.ENEMY.MOVE_SPEED;

export default class EnemySprite {
  constructor(image) {
    this.image = image;
    this.frameWidth = image.width / CONFIG.ENEMY.SPRITE_COLS;
    this.frameHeight = image.height / CONFIG.ENEMY.SPRITE_ROWS; 
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.visualX = null;
    this.visualY = null;
    this.targetX = 0;
    this.targetY = 0;
  }

  update(deltaTime, isMoving) {
    if (!isMoving && !this.isMoving()) {
      this.currentFrame = 0;
      return;
    }

    this.frameTimer += deltaTime;
    if (this.frameTimer >= animationSpeed) {
      this.frameTimer = 0;
      this.currentFrame = (this.currentFrame + 1) % CONFIG.ENEMY.SPRITE_COLS; 
    }
  }

  isMoving() {
    return this.visualX !== this.targetX || this.visualY !== this.targetY;
  }

  draw(ctx, position, direction, cellSize, camera) {
    if (this.visualX === null) {
      this.visualX = position.x;
      this.visualY = position.y;
    }

    this.targetX = position.x;
    this.targetY = position.y;

    this.visualX += (this.targetX - this.visualX) * moveSpeed;
    this.visualY += (this.targetY - this.visualY) * moveSpeed;

    const directionMap = {
    0: 0, // up    
    1: 3, // left  
    2: 2, // down  
    3: 1  // right 
  };

  const spriteDirection = directionMap[direction];

  const srcX = this.currentFrame * this.frameWidth;
  const srcY = spriteDirection * this.frameHeight;

    ctx.drawImage(
      this.image,
      srcX, srcY, this.frameWidth, this.frameHeight,
      this.visualX * cellSize - camera.x,
      this.visualY * cellSize - camera.y,
      cellSize,
      cellSize
    );
  }
}