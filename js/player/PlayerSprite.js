import { CONFIG } from "../config/GameConfig.js";
const animationSpeed = CONFIG.PLAYER.ANIMATION_SPEED;
const moveSpeed = CONFIG.PLAYER.MOVE_SPEED;

export default class PlayerSprite {
  constructor(image) {
    this.image = image;
    this.frameWidth = image.width / CONFIG.PLAYER.SPRITE_COLS;
    this.frameHeight = image.height / CONFIG.PLAYER.SPRITE_ROWS;
    this.currentFrame = 0;
    this.frameTimer = 0;

    this.visualX = null;
    this.visualY = null;
  }

  update(deltaTime, isMoving) {
    if (!isMoving && !this.isMoving()) {
      this.currentFrame = 0;
      return;
    }

    this.frameTimer += deltaTime;
    if (this.frameTimer >= animationSpeed) {
      this.frameTimer = 0;
      this.currentFrame = (this.currentFrame + 1) % CONFIG.PLAYER.SPRITE_COLS;
    }
  }

  isMoving() {
    if (this.visualX === null) return false;
    return this.targetX !== this.visualX || this.targetY !== this.visualY;
  }

  getVisualPosition() {
    if (this.visualX === null) {
      return { x: this.targetX || 0, y: this.targetY || 0 };
    }
    return { x: this.visualX, y: this.visualY };
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

    const closeEnough =
      Math.abs(this.targetX - this.visualX) < 0.1 &&
      Math.abs(this.targetY - this.visualY) < 0.1;

    if (closeEnough) {
      this.visualX = this.targetX;
      this.visualY = this.targetY;
      this.currentFrame = 0;
    }

    const srcX = this.currentFrame * this.frameWidth;
    const srcY = direction * this.frameHeight;
    ctx.drawImage(
      this.image,
      srcX,
      srcY,
      this.frameWidth,
      this.frameHeight,
      this.visualX * cellSize - camera.x,
      this.visualY * cellSize - camera.y,
      cellSize,
      cellSize,
    );
  }
}
