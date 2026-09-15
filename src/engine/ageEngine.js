import { getGameState, setGameState } from '../state/gameState.js';
import { saveToLocalStorage } from '../state/storage.js';

/**
 * Fungsi utilitas untuk membatasi nilai status antara min (0) dan max (100)
 */
function clamp(val, min = 0, max = 100) {
    return Math.max(min, Math.min(max, val));
}

/**
 * Memproses logika pertambahan usia (Age Up)
 */
export function processAgeUp() {
    const state = getGameState();

    if (!state.profile.isAlive) {
        return state;
    }

    // 1. Tambah Usia
    state.profile.age += 1;

    // 2. Fluktuasi Status Acak Sederhana (Simulasi Awal)
    // Kesehatan sedikit fluktuatif, Kebahagiaan dinamis
    const healthDelta = Math.floor(Math.random() * 5) - 2; // -2 sampai +2
    const happinessDelta = Math.floor(Math.random() * 7) - 3; // -3 sampai +3

    state.stats.health = clamp(state.stats.health + healthDelta);
    state.stats.happiness = clamp(state.stats.happiness + happinessDelta);

    // 3. Tambahkan Log Kejadian Harian
    const newLog = `Umur ${state.profile.age} tahun: Menjalani kehidupan setahun lagi dengan lancar.`;
    
    // Unshift menambahkan ke awal array agar kejadian terbaru muncul di atas
    state.logs.unshift(newLog);

    // Mitigasi Memory Leak: Simpan maks 30 log terbaru saja
    if (state.logs.length > 30) {
        state.logs.pop();
    }

    // 4. Simpan Perubahan State
    setGameState(state);
    saveToLocalStorage(state);

    return state;
}
