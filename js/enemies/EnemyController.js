import Enemy from './Enemy.js';
import EnemyMovement from './EnemyMovement.js';
import EnemySprite from './EnemySprite.js';

export function createEnemy({ x, y, maze, spriteImage }) {
  const enemy = new Enemy(x, y);

 
  const movement = new EnemyMovement(enemy, maze);

  const sprite = new EnemySprite(spriteImage);

  return {
    update(deltaTime) {
      movement.update();
      sprite.update(deltaTime, enemy.isMoving());
      enemy.setMoving(false);
    },

    draw(ctx, cellSize, camera) {
      sprite.draw(
        ctx,
        enemy.getPosition(),
        enemy.getDirection(),
        cellSize,
        camera
      );
    },

    getPosition() {
      return enemy.getPosition();
    }
  };
}
