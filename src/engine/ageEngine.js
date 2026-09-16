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

    // Biaya hidup ditanggung orang tua hingga usia 15-18 tahun
    const isOrphan = state.parents && !state.parents.isAlive;
    if (age < 15 && !isOrphan) {
        state.finances.monthlyExpenses = 0;
    } else if (age === 15 && !isOrphan) {
        state.finances.monthlyExpenses = 500000;
    }

    // Kematian alami / kesehatan kritis
    if (state.stats.health <= 0 || (age > 60 && Math.random() < (age - 60) * 0.03)) {
        state.profile.isAlive = false;
        state.logs.unshift(`Umur ${age}: Anda meninggal dunia.`);
        setGameState(state);
        saveToLocalStorage(state);
        return { state, triggeredEvent: null };
    }

    // Hitung arus kas tahunan
    const annualIncome = (state.finances.monthlyIncome || 0) * 12;
    const annualExpenses = (state.finances.monthlyExpenses || 0) * 12;
    const netCashflow = annualIncome - annualExpenses;

    state.finances.cash += netCashflow;

    state.logs.unshift(`Umur ${age} tahun: Menjalani kehidupan.`);
    setGameState(state);
    saveToLocalStorage(state);

    return { state, triggeredEvent: null };
}

// Fungsi yang sebelumnya hilang/belum di-export
export function applyEventChoiceEffect(effect) {
    const state = getGameState();
    if (!effect) return state;

    if (effect.stats) {
        for (const statKey in effect.stats) {
            if (state.stats[statKey] !== undefined) {
                state.stats[statKey] = clamp(state.stats[statKey] + effect.stats[statKey]);
            }
        }
    }

    if (effect.finances) {
        for (const finKey in effect.finances) {
            if (state.finances[finKey] !== undefined) {
                state.finances[finKey] += effect.finances[finKey];
            }
        }
    }

    setGameState(state);
    saveToLocalStorage(state);
    return state;
}
