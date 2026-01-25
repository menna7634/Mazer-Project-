export default class Camera {
  constructor(canvasWidth, canvasHeight, tileSize) {
    this.x = 0;
    this.y = 0;
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.tileSize = tileSize;
  }
  follow(playerX, playerY) {
    this.x = playerX * this.tileSize - this.width / 2 + this.tileSize / 2;
    this.y = playerY * this.tileSize - this.height / 2 + this.tileSize / 2;
  }

  clamp(mazeWidth, mazeHeight) {
    const maxX = mazeWidth * this.tileSize - this.width;
    const maxY = mazeHeight * this.tileSize - this.height;

    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.x > maxX) this.x = maxX;
    if (this.y > maxY) this.y = maxY;
  }
}
