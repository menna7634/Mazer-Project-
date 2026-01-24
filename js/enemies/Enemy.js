export default class Enemy {
  #position;
  #direction;
  #isMoving;
  #speed;

  constructor(startX, startY, speed = 1) {
    this.#position = { x: startX, y: startY };
    this.#direction = 2; // down
    this.#isMoving = false;
    this.#speed = speed;
  }

  getPosition() {
    return { ...this.#position };
  }

  setPosition(x, y) {
    this.#position = { x, y };
  }

  getDirection() {
    return this.#direction;
  }

  setDirection(dir) {
    this.#direction = dir;
  }

  isMoving() {
    return this.#isMoving;
  }

  setMoving(val) {
    this.#isMoving = val;
  }

  getSpeed() {
    return this.#speed;
  }
}
