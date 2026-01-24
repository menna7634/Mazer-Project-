
class StorageSystem {

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

    const key = `mazer_save_slot_${slotNumber}`;
    localStorage.setItem(key, JSON.stringify(saveData));
    return true;
  }

  static loadFromSlot(slotNumber) {
    if (slotNumber < 1 || slotNumber > 3) {
      return null;
    }

    const key = `mazer_save_slot_${slotNumber}`;
    const savedData = localStorage.getItem(key);

    if (!savedData) {
      return null;
    }

    return JSON.parse(savedData);
  }

  static deleteSlot(slotNumber) {
    if (slotNumber < 1 || slotNumber > 3) {
      return false;
    }

    const key = `mazer_save_slot_${slotNumber}`;
    localStorage.removeItem(key);
    return true;
  }

  static isSlotEmpty(slotNumber) {
    const key = `mazer_save_slot_${slotNumber}`;
    return localStorage.getItem(key) === null;
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

  static clearAll() {
    for (let i = 1; i <= 3; i++) {
      this.deleteSlot(i);
    }
    return true;
  }
}

export { StorageSystem };