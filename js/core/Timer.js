// Timer.js

class Timer {
    constructor() {
        this.seconds = 0;
        this.intervalId = null;
        this.isPaused = false;
    }

    start() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        this.intervalId = setInterval(() => {
            if (!this.isPaused) {
                this.seconds++;
            }
        }, 1000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    reset() {
        this.seconds = 0;
        this.stop();
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }
}

export default Timer;
