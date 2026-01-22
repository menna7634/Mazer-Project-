import Player from "./Player.js";
import PlayerMovement from "./PlayerMovement.js";
import PlayerSprite from "./PlayerSprite.js";

export default class PlayerController {
  constructor(config) {
    this.player = new Player(
      config.startX,
      config.startY,
      config.lives
    );

    this.movement = new PlayerMovement(
      this.player,
      config.isWalkable
    );

    this.sprite = new PlayerSprite(
      config.spriteImage,
      config.cellSize
    );
  }


  createPlayer() {
    return this;
  }

  resetPlayerPosition() {
    this.player.resetPlayerPosition();
  }

  movePlayer(dx, dy, maze) {
    return this.movement.move(dx, dy, maze);
  }

  getPlayerPosition() {
    return this.player.getPlayerPosition();
  }

  setPlayerPosition(x, y) {
    this.player.setPlayerPosition(x, y);
  }

  loseLife() {
    this.player.loseLife();
  }

  gainLife() {
    this.player.gainLife();
  }

  getLivesCount() {
    return this.player.getLivesCount();
  }

  isPlayerAlive() {
    return this.player.isPlayerAlive();
  }

  draw(ctx) {
    this.sprite.draw(ctx, this.getPlayerPosition());
  }
}
