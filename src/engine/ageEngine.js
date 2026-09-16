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
    const age = state.profile.age;

    // 2. SISTEM MORTALITAS (Kematian Karakter)
    if (state.stats.health <= 0) {
        state.profile.isAlive = false;
        state.logs.unshift(`Umur ${age}: Anda meninggal dunia karena kondisi kesehatan yang memburuk.`);
        setGameState(state);
        saveToLocalStorage(state);
        return { state, triggeredEvent: null };
    }

    // Peluang meninggal alami naik berjenjang setelah usia 60 tahun
    const naturalDeathChance = age > 60 ? (age - 60) * 0.03 : 0;
    if (Math.random() < naturalDeathChance || age >= 100) {
        state.profile.isAlive = false;
        state.logs.unshift(`Umur ${age}: Anda meninggal dunia dengan tenang di usia tua.`);
        setGameState(state);
        saveToLocalStorage(state);
        return { state, triggeredEvent: null };
    }

    // 3. LOGIKA KELULUSAN PENDIDIKAN
    if (state.education && state.education.isEnrolled) {
        state.education.yearsCompleted = (state.education.yearsCompleted || 0) + 1;
        if (state.education.yearsCompleted >= state.education.requiredYears) {
            state.logs.unshift(`🎉 Selamat! Anda telah LULUS dari ${state.education.schoolName} (${state.education.currentLevel}). (+15 IQ)`);
            state.stats.iq = clamp(state.stats.iq + 15);
            state.education.isEnrolled = false;
        }
    }

    // 4. TINGKAT KESULITAN: Inflasi Pengeluaran 3% / Tahun
    if (state.finances.monthlyExpenses > 0) {
        state.finances.monthlyExpenses = Math.floor(state.finances.monthlyExpenses * 1.03);
    }

    // 5. Bunga Utang & Cashflow
    if (state.finances.debt > 0) {
        const annualInterest = Math.floor(state.finances.debt * (state.finances.annualInterestRate || 0.10));
        state.finances.debt += annualInterest;
    }

    const annualIncome = (state.finances.monthlyIncome || 0) * 12;
    const annualExpenses = (state.finances.monthlyExpenses || 0) * 12;
    const netCashflow = annualIncome - annualExpenses;

    state.finances.cash += netCashflow;
    state.stats.fss = calculateFSS(state.finances);

    // Penurunan HP/Kenyamanan otomatis jika lelah atau miskin
    let healthImpact = Math.floor(Math.random() * 3) - 2; 
    if (state.job && state.job.fatigue > 50) healthImpact -= 4;
    if (state.finances.cash < 0) healthImpact -= 5; // Penalti HP jika memiliki kas negatif

    state.stats.health = clamp(state.stats.health + healthImpact);
    state.stats.happiness = clamp(state.stats.happiness + (Math.floor(Math.random() * 3) - 2));

    // Log Tahunan
    state.logs.unshift(`Umur ${age} tahun: Menjalani kehidupan. Net Cashflow: Rp ${netCashflow.toLocaleString('id-ID')}.`);
    if (state.logs.length > 30) state.logs.pop();

    setGameState(state);
    saveToLocalStorage(state);

    const triggeredEvent = checkAndTriggerEvent(state);
    return { state, triggeredEvent };
}
