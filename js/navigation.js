document.body.addEventListener(
  "click",
  () => {
    if (bgMusic.paused && document.getElementById("toggle-music").checked) {
      bgMusic.play();
    }
  },
  { once: true },
);

document.getElementById("toggle-music").addEventListener("change", (e) => {
  e.target.checked ? bgMusic.play() : bgMusic.pause();
});

document.querySelectorAll(".menu-btn").forEach((btn) => {
  btn.addEventListener("click", playBtnSound);
});
document.getElementById("btn-new-game").addEventListener("click", () => {
  document.querySelector(".gate-modal").classList.add("closing");

  setTimeout(() => {
    showScreen("game");
    document.querySelector(".gate-modal").classList.remove("closing");

    if (window.game) {
      window.game.startGame();
    }
  }, 3600);
  setTimeout(() => {
    document.querySelector(".gate-modal").classList.add("opening");
  }, 1800);
});
document
  .getElementById("btn-load-game")
  .addEventListener("click", () => showScreen("load-game"));
document
  .getElementById("btn-settings")
  .addEventListener("click", () => showScreen("settings"));
document
  .getElementById("btn-back")
  .addEventListener("click", () => showScreen("home"));
document
  .getElementById("btn-settings-back")
  .addEventListener("click", () => showScreen("home"));
function showScreen(screenClass) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.querySelector(`.screen.${screenClass}`)?.classList.add("active");
}

const bgMusic = new Audio(
  "../assets/sounds/Ancient Egyptian Music – The Nile River.mp3",
);
bgMusic.loop = true;
bgMusic.volume = 0.3;

const btnSfx = new Audio("../assets/sounds/menu-button-stone-41289.mp3");
btnSfx.volume = 0.5;

function playBtnSound() {
  if (document.getElementById("toggle-sfx").checked) {
    btnSfx.currentTime = 0;
    btnSfx.play();
  }
}
