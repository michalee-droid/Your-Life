import { getGameState, setGameState } from '../state/gameState.js';
import { saveToLocalStorage } from '../state/storage.js';
import { checkAndTriggerEvent } from './eventEngine.js';
import { calculateFSS } from './fssEngine.js';

function clamp(val, min = 0, max = 100) {
    return Math.max(min, Math.min(max, val));
}

export function applyEventChoiceEffect(choice) {
    const state = getGameState();
    const effect = choice.effect;

    if (!effect) return state;

    if (effect.health) state.stats.health = clamp(state.stats.health + effect.health);
    if (effect.happiness) state.stats.happiness = clamp(state.stats.happiness + effect.happiness);
    if (effect.iq) state.stats.iq = clamp(state.stats.iq + effect.iq);
    if (effect.physical) state.stats.physical = clamp(state.stats.physical + effect.physical);

    if (effect.cash) state.finances.cash += effect.cash;

    // Recalculate FSS after state updates
    state.stats.fss = calculateFSS(state.finances);

    if (effect.log) {
        state.logs.unshift(`Umur ${state.profile.age}: ${effect.log}`);
        if (state.logs.length > 30) state.logs.pop();
    }

    setGameState(state);
    saveToLocalStorage(state);
    return state;
}

export function processAgeUp() {
    const state = getGameState();

    if (!state.profile.isAlive) return { state, triggeredEvent: null };

    // 1. Tambah Usia
    state.profile.age += 1;

    // 2. Hitung Bunga Utang Tahunan
    if (state.finances.debt > 0) {
        const annualInterest = Math.floor(state.finances.debt * (state.finances.annualInterestRate || 0.10));
        state.finances.debt += annualInterest;
    }

    // 3. Cashflow Net Tahunan
    const annualIncome = (state.finances.monthlyIncome || 0) * 12;
    const annualExpenses = (state.finances.monthlyExpenses || 0) * 12;
    const netCashflow = annualIncome - annualExpenses;

    state.finances.cash += netCashflow;

    // 4. Update Skor FSS Terkini
    state.stats.fss = calculateFSS(state.finances);

    // 5. Dampak Kelelahan Kerja & Fluktuasi Kesehatan
    const jobFatigue = state.job ? state.job.fatigue : 0;
    let healthImpact = Math.floor(Math.random() * 3) - 1;
    let happinessImpact = Math.floor(Math.random() * 3) - 1;

    if (jobFatigue > 50) {
        healthImpact -= 3;
        happinessImpact -= 4;
    }

    state.stats.health = clamp(state.stats.health + healthImpact);
    state.stats.happiness = clamp(state.stats.happiness + happinessImpact);

    // 6. Log Catatan Tahunan
    let ageLog = `Umur ${state.profile.age} tahun: Menjalani kehidupan. Net Cashflow: Rp ${netCashflow.toLocaleString('id-ID')}.`;
    state.logs.unshift(ageLog);
    if (state.logs.length > 30) state.logs.pop();

    setGameState(state);
    saveToLocalStorage(state);

    // 7. Cek Trigger Event
    const triggeredEvent = checkAndTriggerEvent(state);

    return { state, triggeredEvent };
}
