import { getGameState, setGameState } from '../state/gameState.js';
import { saveToLocalStorage } from '../state/storage.js';

function clamp(val, min = 0, max = 100) {
    return Math.max(min, Math.min(max, val));
}

export function processAgeUp() {
    const state = getGameState();

    if (!state.profile.isAlive) return { state, triggeredEvent: null };

    state.profile.age += 1;
    const age = state.profile.age;

    // 1. Poin 4: Biaya Hidup Ditanggung Orang Tua Sampai Usia 15-18 Tahun
    const isOrphan = state.parents && !state.parents.isAlive;
    if (age < 15 && !isOrphan) {
        state.finances.monthlyExpenses = 0; // Bebas biaya hidup
    } else if (age === 15 && !isOrphan) {
        state.finances.monthlyExpenses = 500000; // Mulai mandiri secara bertahap
    }

    // 2. Kematian Alami & Penyakit
    if (state.stats.health <= 0 || (age > 60 && Math.random() < (age - 60) * 0.03)) {
        state.profile.isAlive = false;
        state.logs.unshift(`Umur ${age}: Anda meninggal dunia.`);
        setGameState(state);
        saveToLocalStorage(state);
        return { state, triggeredEvent: null };
    }

    // 3. Hitung Cashflow
    const annualIncome = (state.finances.monthlyIncome || 0) * 12;
    const annualExpenses = (state.finances.monthlyExpenses || 0) * 12;
    const netCashflow = annualIncome - annualExpenses;

    state.finances.cash += netCashflow;

    state.logs.unshift(`Umur ${age} tahun: Menjalani kehidupan.`);
    setGameState(state);
    saveToLocalStorage(state);

    return { state, triggeredEvent: null };
}
