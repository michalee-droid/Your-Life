import { DEFAULT_STATE } from './gameState.js';

const SAVE_KEY = 'FYF_GAME_SAVE_DATA';

/**
 * Menyimpan State Game ke LocalStorage
 */
export function saveToLocalStorage(state) {
    try {
        const serialized = JSON.stringify(state);
        localStorage.setItem(SAVE_KEY, serialized);
        return true;
    } catch (error) {
        console.error("Gagal menyimpan data game:", error);
        return false;
    }
}

/**
 * Memuat State Game dari LocalStorage dengan Proteksi Fallback
 */
export function loadFromLocalStorage() {
    try {
        const serialized = localStorage.getItem(SAVE_KEY);
        if (!serialized) return null;

        const data = JSON.parse(serialized);

        // Mitigasi Data Korup: Pastikan versi data sesuai
        if (!data.version || data.version !== DEFAULT_STATE.version) {
            console.warn("Versi simpanan tidak cocok. Menggunakan reset fallback.");
            return null;
        }

        return data;
    } catch (error) {
        console.error("Gagal memuat data simpanan:", error);
        return null;
    }
}
