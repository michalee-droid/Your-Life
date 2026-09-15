import { getGameState, setGameState } from '../state/gameState.js';
import { saveToLocalStorage } from '../state/storage.js';
import { checkAndTriggerEvent } from './eventEngine.js';

/**
 * Membatasi nilai status antara 0 dan 100
 */
function clamp(val, min = 0, max = 100) {
    return Math.max(min, Math.min(max, val));
}

/**
 * Menerapkan efek pilihan event secara aman ke State Karakter
 */
export function applyEventChoiceEffect(choice) {
    const state = getGameState();
    const effect = choice.effect;

    if (!effect) return state;

    // Update Stats dengan Pengaman (Clamp)
    if (effect.health) state.stats.health = clamp(state.stats.health + effect.health);
    if (effect.happiness) state.stats.happiness = clamp(state.stats.happiness + effect.happiness);
    if (effect.iq) state.stats.iq = clamp(state.stats.iq + effect.iq);
    if (effect.physical) state.stats.physical = clamp(state.stats.physical + effect.physical);
    if (effect.fss) state.stats.fss = clamp(state.stats.fss + effect.fss);

    // Update Keuangan
    if (effect.cash) state.finances.cash += effect.cash;

    // Catat ke Log Narasi
    if (effect.log) {
        state.logs.unshift(`Umur ${state.profile.age}: ${effect.log}`);
        if (state.logs.length > 30) state.logs.pop();
    }

    setGameState(state);
    saveToLocalStorage(state);
    return state;
}

/**
 * Memproses logika pertambahan usia (Age Up) & Memeriksa Trigger Event
 */
export function processAgeUp() {
    const state = getGameState();

    if (!state.profile.isAlive) return { state, triggeredEvent: null };

    // 1. Tambah Usia
    state.profile.age += 1;

    // 2. Hitung Pendapatan & Pengeluaran Tahunan
    const annualIncome = (state.finances.monthlyIncome || 0) * 12;
    const annualExpenses = (state.finances.monthlyExpenses || 0) * 12;
    const netCashflow = annualIncome - annualExpenses;

    state.finances.cash += netCashflow;

    // 3. Efek Kelelahan Pekerjaan terhadap Kesehatan & Kebahagiaan
    const jobFatigue = state.job ? state.job.fatigue : 0;
    let healthImpact = Math.floor(Math.random() * 3) - 1;
    let happinessImpact = Math.floor(Math.random() * 3) - 1;

    if (jobFatigue > 50) {
        healthImpact -= 3;
        happinessImpact -= 4;
    }

    state.stats.health = clamp(state.stats.health + healthImpact);
    state.stats.happiness = clamp(state.stats.happiness + happinessImpact);

    // 4. Catat Log Tahun Baru & Finansial
    let ageLog = `Umur ${state.profile.age} tahun: Menjalani kehidupan.`;
    if (annualIncome > 0) {
        ageLog += ` Pendapatan bersih tahunan: Rp ${netCashflow.toLocaleString('id-ID')}.`;
    }
    state.logs.unshift(ageLog);

    if (state.logs.length > 30) state.logs.pop();

    setGameState(state);
    saveToLocalStorage(state);

    // 5. Cek Trigger Event Acak
    const triggeredEvent = checkAndTriggerEvent(state);

    return { state, triggeredEvent };
}
