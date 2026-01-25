import HUD from "./HUD.js";

class Timer {
  constructor() {
    this.timeLeft = 0;
    this.timerId = null;
    this.isPaused = false;
    this.gameReference = null;
  }

  startCountdown(seconds, game) {
    this.timeLeft = seconds;
    this.gameReference = game;
    this.isPaused = false;

    if (this.timerId) {
      clearInterval(this.timerId);
    }

    HUD.updateTimer(this.timeLeft);

    this.timerId = setInterval(() => {
      if (!this.isPaused) {
        this.timeLeft = this.timeLeft - 1;
        HUD.updateTimer(this.timeLeft);

        if (this.timeLeft <= 0) {
          this.stop();
          this.gameReference.gameOver();
        }
      }
    }, 1000);
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }
}

export default Timer;
