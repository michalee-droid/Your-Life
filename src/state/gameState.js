// gameState.js
export const gameState = {
  player: {
    name: null,
    gender: null,
    totalMonths: 216, // Default 18 tahun (18 * 12)
    age: 18,
    fatigue: 0,
    cash: 0
  }
};

// characterCreationView.js
import { gameState } from './gameState.js';

export function handleCharacterSubmit(inputName, inputGender) {
  if (!inputName?.trim() || !inputGender) {
    console.error("Inisialisasi gagal: Nama dan Gender tidak boleh kosong.");
    return false;
  }
  
  gameState.player.name = inputName.trim();
  gameState.player.gender = inputGender;
  return true; // Siap render ke dashboard
}
