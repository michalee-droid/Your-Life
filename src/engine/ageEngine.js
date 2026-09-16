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

    // 2. SISTEM MORTALITAS
    if (state.stats.health <= 0) {
        state.profile.isAlive = false;
        state.logs.unshift(`Umur ${age}: Anda meninggal dunia karena kondisi kesehatan yang memburuk.`);
        setGameState(state);
        saveToLocalStorage(state);
        return { state, triggeredEvent: null };
    }

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

    // 4. INFLASI PENGELUARAN HIDUP (3%/tahun)
    if (state.finances.monthlyExpenses > 0) {
        state.finances.monthlyExpenses = Math.floor(state.finances.monthlyExpenses * 1.03);
    }

    // 5. PROSES HASIL PROPERTI (Apresiasi Nilai & Passive Income)
    let totalPropertyNetIncome = 0;
    if (state.properties && state.properties.length > 0) {
        state.properties.forEach(p => {
            // Apresiasi nilai properti 3% - 5% per tahun
            const appreciationRate = 1 + (Math.random() * 0.02 + 0.03);
            p.currentValue = Math.floor(p.currentValue * appreciationRate);

            // Sewa bersih tahunan
            const netMonthly = p.rentalIncome - p.maintenanceCost;
            totalPropertyNetIncome += (netMonthly * 12);
        });
    }

    // 6. PROSES HASIL BISNIS (Fluktuasi Laba/Rugi Risiko)
    let totalBusinessNetIncome = 0;
    if (state.businesses && state.businesses.length > 0) {
        state.businesses.forEach(b => {
            // Margin fluktuasi acak berdasarkan risiko
            let riskMultiplier = 1.0;
            const roll = Math.random();
            if (b.riskLevel === 'Rendah') riskMultiplier = roll * 0.4 + 0.8; // 0.8x - 1.2x
            else if (b.riskLevel === 'Sedang') riskMultiplier = roll * 0.8 + 0.6; // 0.6x - 1.4x
            else if (b.riskLevel === 'Tinggi') riskMultiplier = roll * 1.6 + 0.2; // 0.2x - 1.8x

            const annualRev = Math.floor((b.monthlyRevenue * 12) * riskMultiplier);
            const annualExp = b.monthlyExpenses * 12;
            const netProfit = annualRev - annualExp;

            totalBusinessNetIncome += netProfit;
        });
    }

    // 7. ARUS KAS TOTAL & BUNGA UTANG
    if (state.finances.debt > 0) {
        const annualInterest = Math.floor(state.finances.debt * (state.finances.annualInterestRate || 0.10));
        state.finances.debt += annualInterest;
    }

    const jobIncomeAnnual = (state.finances.monthlyIncome || 0) * 12;
    const livingExpensesAnnual = (state.finances.monthlyExpenses || 0) * 12;

    const netAnnualCashflow = jobIncomeAnnual + totalPropertyNetIncome + totalBusinessNetIncome - livingExpensesAnnual;
    state.finances.cash += netAnnualCashflow;

    // 8. UPDATE FSS & PENALTI KESEHATAN
    state.stats.fss = calculateFSS(state.finances);

    let healthImpact = Math.floor(Math.random() * 3) - 2;
    if (state.job && state.job.fatigue > 50) healthImpact -= 4;
    if (state.finances.cash < 0) healthImpact -= 5;

    state.stats.health = clamp(state.stats.health + healthImpact);
    state.stats.happiness = clamp(state.stats.happiness + (Math.floor(Math.random() * 3) - 2));

    // 9. CATATAN LOG
    let logDetail = `Umur ${age} thn: Arus kas bersih: Rp ${netAnnualCashflow.toLocaleString('id-ID')}.`;
    if (totalPropertyNetIncome > 0) logDetail += ` (Properti: +Rp ${totalPropertyNetIncome.toLocaleString('id-ID')})`;
    if (totalBusinessNetIncome !== 0) logDetail += ` (Bisnis: ${totalBusinessNetIncome >= 0 ? '+' : ''}Rp ${totalBusinessNetIncome.toLocaleString('id-ID')})`;

    state.logs.unshift(logDetail);
    if (state.logs.length > 30) state.logs.pop();

    setGameState(state);
    saveToLocalStorage(state);

    const triggeredEvent = checkAndTriggerEvent(state);
    return { state, triggeredEvent };
}
