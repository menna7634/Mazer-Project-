export default class Player {
  #position;
  #lives;
  #startPosition;
  #maxLives;
  #keys;
  #score;
  #isMoving;
  #direction;
  constructor(startX, startY, lives = 3) {
    this.#startPosition = { x: startX, y: startY };
    this.#position = { x: startX, y: startY };
    this.#lives = lives;
    this.#maxLives = lives;
    this.#keys = 0;
    this.#score = 0;
    this.#isMoving = false;
    this.#direction = 2;
  }

  resetPlayerPosition() {
    this.#position = { ...this.#startPosition };
  }

  setPlayerPosition(x, y) {
    this.#position = { x, y };
  }

  getPlayerPosition() {
    return { ...this.#position };
  }

  loseLife() {
    this.#lives = Math.max(0, this.#lives - 1);
  }

  gainLife() {
    this.#lives = Math.min(this.#maxLives, this.#lives + 1);
  }

  getLivesCount() {
    return this.#lives;
  }

  isPlayerAlive() {
    return this.#lives > 0;
  }
  isMoving() {
    return this.#isMoving;
  }

  setMoving(value) {
    this.#isMoving = value;
  }

  getDirection() {
    return this.#direction;
  }

  setDirection(dir) {
    this.#direction = dir;
  }
  collectKey() {
    this.#keys++;
    this.#score += 100;
  }

  takeDamage(amount = 1) {
    this.#lives = Math.max(0, this.#lives - amount);
  }
}
