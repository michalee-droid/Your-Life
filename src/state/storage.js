import { DEFAULT_STATE } from './gameState.js';

const SAVE_KEY = 'FYF_GAME_SAVE_DATA';

export function saveToLocalStorage(state) {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
        return true;
    } catch (error) {
        console.error("Gagal menyimpan data:", error);
        return false;
    }
}

export function loadFromLocalStorage() {
    try {
        const serialized = localStorage.getItem(SAVE_KEY);
        if (!serialized) return null;

        const data = JSON.parse(serialized);

        // Gabungkan data lama dengan DEFAULT_STATE agar variabel baru tidak undefined
        return {
            ...DEFAULT_STATE,
            ...data,
            stats: { ...DEFAULT_STATE.stats, ...data.stats },
            finances: { ...DEFAULT_STATE.finances, ...data.finances },
            education: { ...DEFAULT_STATE.education, ...data.education },
            job: { ...DEFAULT_STATE.job, ...data.job }
        };
    } catch (error) {
        console.error("Gagal memuat data:", error);
        return null;
    }
}
