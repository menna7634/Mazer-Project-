
class StorageSystem {
  static #storage = localStorage;

  static #getKey(slotNumber) {
    return `mazer_save_slot_${slotNumber}`;
  }

  static saveToSlot(slotNumber, gameData) {
    if (slotNumber < 1 || slotNumber > 3) {
      return false;
    }

    const saveData = {
      level: gameData.level,
      hearts: gameData.hearts,
      keys: gameData.keys,
      time: gameData.time,
      playerPosition: gameData.playerPosition,
      mazeState: gameData.mazeState,
      date: new Date().toISOString()
    };

    this.#storage.setItem(this.#getKey(slotNumber), JSON.stringify(saveData));
    return true;
  }

  static loadFromSlot(slotNumber) {
    if (slotNumber < 1 || slotNumber > 3) {
      return null;
    }

    const savedData = this.#storage.getItem(this.#getKey(slotNumber));

    if (!savedData) {
      return null;
    }

    return JSON.parse(savedData);
  }

  static deleteSlot(slotNumber) {
    if (slotNumber < 1 || slotNumber > 3) {
      return false;
    }

    this.#storage.removeItem(this.#getKey(slotNumber));
    return true;
  }

  static isSlotEmpty(slotNumber) {
    return this.#storage.getItem(this.#getKey(slotNumber)) === null;
  }

  static getAllSlots() {
    const slots = [];

    for (let i = 1; i <= 3; i++) {
      const data = this.loadFromSlot(i);

      slots.push({
        slotNumber: i,
        isEmpty: data === null,
        data: data
      });
    }

    return slots;
  }

  static shiftSlotsDown() {
    const slot1 = this.loadFromSlot(1);
    const slot2 = this.loadFromSlot(2);
    
    if (slot2) this.saveToSlot(3, slot2);
    if (slot1) this.saveToSlot(2, slot1);
  }
}

export { StorageSystem };