const animationSpeed = 120;
export default class PlayerSprite {
    constructor(image) {
        this.image = image;
        this.frameWidth = image.width / 9;
        this.frameHeight = image.height / 4;
        this.currentFrame = 0;
        this.frameTimer = 0;
    }

    update(deltaTime, isMoving) {
        if (!isMoving) {
            this.currentFrame = 0;
            return;
        }
        this.frameTimer += deltaTime;
        if (this.frameTimer >= animationSpeed) {
            this.frameTimer = 0;
            this.currentFrame = (this.currentFrame + 1) % 9;
        }
    }

    draw(ctx, position, direction, cellSize, camera) {
        const srcX = this.currentFrame * this.frameWidth;
        const srcY = direction * this.frameHeight;
        ctx.drawImage(
            this.image,
            srcX, srcY, this.frameWidth, this.frameHeight,
            position.x * cellSize - camera.x,
            position.y * cellSize - camera.y,
            cellSize,
            cellSize
        );
    }

}