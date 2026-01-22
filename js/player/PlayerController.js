import Player from "./Player.js";
import PlayerMovement from "./PlayerMovement.js";
import PlayerSprite from "./PlayerSprite.js";

export function createPlayer({
  startX,
  startY,
  lives,
  maze,
  spriteImage,
  spriteConfig
}) {
  const player = new Player(startX, startY, lives);
  const movement = new PlayerMovement(player, maze);
  const sprite = new PlayerSprite(
    spriteImage,
    spriteConfig.frameWidth,
    spriteConfig.frameHeight,
    spriteConfig.totalFrames
  );

  return {
    update(deltaTime) {
      sprite.update(deltaTime, player.isMoving());
      player.setMoving(false);
    },

    draw(ctx, cellSize, camera) {
      sprite.draw(
        ctx,
        player.getPlayerPosition(),
        player.getDirection(),
        cellSize,
        camera
      );
    },

    movePlayer: (dx, dy) => movement.movePlayer(dx, dy),
    resetPlayerPosition: () => player.resetPlayerPosition(),
    getPlayerPosition: () => player.getPlayerPosition(),
    loseLife: () => player.loseLife(),
    gainLife: () => player.gainLife(),
    getLivesCount: () => player.getLivesCount(),
    isPlayerAlive: () => player.isPlayerAlive()
  };
}
