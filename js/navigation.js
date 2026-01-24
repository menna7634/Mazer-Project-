import { StorageSystem } from "./storage/storage.js";

const levelSoundTracks = {
  0: "../assets/sounds/Ancient Egyptian Music – The Nile River.mp3",
  1: "../assets/sounds/Ancient Arabian Music – Ali Baba and the Forty Thieves.mp3",
  2: "../assets/sounds/Epic Egyptian Music – Tomb Raiders.mp3",
  3: "../assets/sounds/Middle Eastern Music - Magic Palace.mp3",
};

let currentMusic = new Audio(levelSoundTracks[0]);
currentMusic.loop = true;
currentMusic.volume = 0.3;

export function playLevelMusic(level) {
  if (levelSoundTracks[level]) {
    const wasPlaying = !currentMusic.paused;
    currentMusic.pause();
    currentMusic.src = levelSoundTracks[level];
    if (wasPlaying || document.getElementById("toggle-music").checked) {
      currentMusic.play();
    }
  }
}

document.body.addEventListener(
  "click",
  () => {
    if (currentMusic.paused && document.getElementById("toggle-music").checked) {
      currentMusic.play();
    }
  },
  { once: true },
);

document.getElementById("toggle-music").addEventListener("change", (e) => {
  if (e.target.checked) {
    currentMusic.play();
  } else {
    currentMusic.pause();
  }
});

const btnSfx = new Audio("../assets/sounds/menu-button-stone-41289.mp3");
btnSfx.volume = 0.5;

function playBtnSound() {
  if (document.getElementById("toggle-sfx").checked) {
    btnSfx.currentTime = 0;
    btnSfx.play();
  }
}

document.querySelectorAll(".menu-btn").forEach((btn) => {
  btn.addEventListener("click", playBtnSound);
});

const gateCloseSfx = new Audio("../assets/sounds/stoneGateClosing.mp3");
const gateOpenSfx = new Audio("../assets/sounds/stoneGateOpenning.mp3");

export function gateModal(onMiddle) {
  document.querySelector(".gate-modal").classList.add("closing");
  
  if (document.getElementById("toggle-sfx").checked) {
    gateCloseSfx.currentTime = 0;
    gateCloseSfx.play();
  }

  setTimeout(() => {
    if (onMiddle) {
      onMiddle();
    }
    document.querySelector(".gate-modal").classList.remove("closing");
    document.querySelector(".gate-modal").classList.add("opening");

    if (document.getElementById("toggle-sfx").checked) {
      gateOpenSfx.currentTime = 0;
      gateOpenSfx.play();
    }
  }, 2500);

  setTimeout(() => {
    document.querySelector(".gate-modal").classList.remove("opening");
    gateOpenSfx.pause();
    gateOpenSfx.currentTime = 0;
  }, 1500);
}

export function showScreen(screenClass) {
  if (screenClass === "home") {
    playLevelMusic(0);
  }
  
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  
  const screen = document.querySelector(`.screen.${screenClass}`);
  if (screen) {
    screen.classList.add("active");
  }
}

document.getElementById("btn-new-game").addEventListener("click", () => {
  gateModal(() => {
    showScreen("game");
    if (window.game) {
      window.game.start();
    }
  });
});

document.getElementById("btn-load-game").addEventListener("click", () => {
  refreshSlots();
  showScreen("load-game");
});

document.getElementById("btn-settings").addEventListener("click", () => {
  showScreen("settings");
});

document.getElementById("btn-back").addEventListener("click", () => {
  showScreen("home");
});

document.getElementById("btn-settings-back").addEventListener("click", () => {
  showScreen("home");
});

document.getElementById("btn-win-home").addEventListener("click", () => {
  showScreen("home");
});

document.getElementById("btn-win-new-game").addEventListener("click", () => {
  gateModal(() => {
    showScreen("game");
    if (window.game) {
      window.game.start();
    }
  });
});

document.getElementById("btn-lose-home").addEventListener("click", () => {
  showScreen("home");
});

document.getElementById("btn-lose-new-game").addEventListener("click", () => {
  gateModal(() => {
    showScreen("game");
    if (window.game) {
      window.game.start();
    }
  });
});

// Pause menu functions
window.resume = () => {
  if (window.game) {
    window.game.togglePause(false);
  }
  const pauseMenu = document.getElementById('pause-menu');
  if (pauseMenu) {
    pauseMenu.close();
  }
};

window.restart = () => {
  const pauseMenu = document.getElementById('pause-menu');
  if (pauseMenu) {
    pauseMenu.close();
  }
  
  if (window.game) {
    window.game.savedData = null;
    window.game.keys = 0;
    window.game.togglePause(false);
    window.game.loadLvl(window.game.lvl);
  }
};

window.quit = () => {
  const pauseMenu = document.getElementById('pause-menu');
  if (pauseMenu) {
    pauseMenu.close();
  }
  
  if (window.game) {
    window.game.running = false;
    window.game.paused = false;
    window.game.timer.stop();
    
    if (window.game.animationFrameId) {
      cancelAnimationFrame(window.game.animationFrameId);
    }
  }
  showScreen('home');
};



function refreshSlots() {
  const slots = StorageSystem.getAllSlots();
  
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const slotNumber = slot.slotNumber;

    const row = document.querySelector('.save-row[data-slot="' + slotNumber + '"]');
    if (!row) continue;

    const levelCell = row.querySelector(".slot-level");
    const scoreCell = row.querySelector(".slot-score");
    const dateCell = row.querySelector(".slot-date");
    const loadButton = row.querySelector(".btn-load");
    const deleteButton = row.querySelector(".btn-delete");

    if (slot.isEmpty) {
      levelCell.textContent = "-";
      scoreCell.textContent = "-";
      dateCell.textContent = "Empty";
      loadButton.disabled = true;
      deleteButton.disabled = true;
    } else {
      levelCell.textContent = "Level " + slot.data.level;
      scoreCell.textContent = slot.data.keys || 0;
      dateCell.textContent = new Date(slot.data.date).toLocaleDateString();
      loadButton.disabled = false;
      deleteButton.disabled = false;

      loadButton.onclick = function () {
        if (window.game) {
          window.game.load(slotNumber);
          showScreen("game");
        }
      };

      deleteButton.onclick = function () {
        if (confirm('Are you sure you want to delete this save?')) {
          StorageSystem.deleteSlot(slotNumber);
          refreshSlots();
        }
      };
    }
  }
}