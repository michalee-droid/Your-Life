import { getGameState, setGameState } from '../state/gameState.js';
import { saveToLocalStorage } from '../state/storage.js';
import { calculateRunway, calculateFSS } from '../engine/fssEngine.js';

const LIFESTYLE_OPTIONS = [
    { tier: "Hemat", cost: 300000, happinessDelta: -2 },
    { tier: "Minimalis", cost: 500000, happinessDelta: 0 },
    { tier: "Menengah", cost: 2000000, happinessDelta: 3 },
    { tier: "Mewah", cost: 10000000, happinessDelta: 8 }
];

export function renderFinanceView(state, onStateChange) {
    const app = document.getElementById('app');
    const fin = state.finances;

    const runway = calculateRunway(fin.cash, fin.monthlyExpenses);
    const netMonthly = fin.monthlyIncome - fin.monthlyExpenses;

    app.innerHTML = `
        <div class="module-view">
            <div class="module-header">
                <div class="module-title">💳 Diagnostik Keuangan & FSS</div>
                <p style="font-size: 0.85rem; color: #94a3b8;">Kelola tingkat pengeluaran, utang, dan kestabilan daya tahan finansial Anda.</p>
            </div>

            <!-- FSS & Survival Runway Diagnostic Card -->
            <div class="card" style="border-left: 4px solid #8b5cf6;">
                <div class="card-title">🛡️ FSS Score: ${state.stats.fss} / 100</div>
                <div class="card-desc"><strong>Survival Runway:</strong> ${runway >= 999 ? 'Tak Terbatas' : runway + ' Bulan'}</div>
                <div class="card-desc">Arus Kas Bulanan Bersih: <span style="color: ${netMonthly >= 0 ? '#10b981' : '#ef4444'}; font-weight: bold;">Rp ${netMonthly.toLocaleString('id-ID')}</span></div>
            </div>

            <!-- Pengaturan Gaya Hidup -->
            <div class="card">
                <div class="card-title">🍲 Tingkat Gaya Hidup</div>
                <div class="card-desc">Pilih pengeluaran bulanan sesuai kenyamanan:</div>
                <select id="select-lifestyle" style="width: 100%; padding: 8px; background: #334155; color: white; border: 1px solid #475569; border-radius: 6px; margin-top: 5px;">
                    ${LIFESTYLE_OPTIONS.map(opt => `
                        <option value="${opt.tier}" ${fin.lifestyleTier === opt.tier ? 'selected' : ''}>
                            ${opt.tier} (Rp ${opt.cost.toLocaleString('id-ID')}/bln)
                        </option>
                    `).join('')}
                </select>
            </div>

            <!-- Manajemen Utang -->
            <div class="card">
                <div class="card-title">🏦 Pusat Manajemen Utang</div>
                <div class="card-desc">Total Utang Aktif: <strong style="color: #ef4444;">Rp ${fin.debt.toLocaleString('id-ID')}</strong> (Bunga 10%/Thn)</div>
                <div style="display: flex; gap: 10px; margin-top: 8px;">
                    <button id="btn-borrow" class="card-btn">💳 Pinjam Rp 5.000.000</button>
                    ${fin.debt > 0 ? `<button id="btn-pay-debt" class="card-btn" style="background: #10b981;">💰 Bayar Utang Rp 5.000.000</button>` : ''}
                </div>
            </div>
        </div>
    `;

    // Event Listeners
    document.getElementById('select-lifestyle').addEventListener('change', (e) => {
        const selected = LIFESTYLE_OPTIONS.find(o => o.tier === e.target.value);
        const currentState = getGameState();

        currentState.finances.lifestyleTier = selected.tier;
        currentState.finances.monthlyExpenses = selected.cost;
        currentState.stats.fss = calculateFSS(currentState.finances);

        setGameState(currentState);
        saveToLocalStorage(currentState);
        if (onStateChange) onStateChange(currentState);
    });

    document.getElementById('btn-borrow').addEventListener('click', () => {
        const currentState = getGameState();
        currentState.finances.cash += 5000000;
        currentState.finances.debt += 5000000;
        currentState.stats.fss = calculateFSS(currentState.finances);
        currentState.logs.unshift(`Umur ${currentState.profile.age}: Mengambil pinjaman utang sebesar Rp 5.000.000.`);

        setGameState(currentState);
        saveToLocalStorage(currentState);
        if (onStateChange) onStateChange(currentState);
    });

    const btnPay = document.getElementById('btn-pay-debt');
    if (btnPay) {
        btnPay.addEventListener('click', () => {
            const currentState = getGameState();
            const payAmount = Math.min(5000000, currentState.finances.debt);

            if (currentState.finances.cash < payAmount) {
                alert("Uang tunai tidak mencukupi untuk membayar utang!");
                return;
            }

            currentState.finances.cash -= payAmount;
            currentState.finances.debt -= payAmount;
            currentState.stats.fss = calculateFSS(currentState.finances);
            currentState.logs.unshift(`Umur ${currentState.profile.age}: Membayar utang sebesar Rp ${payAmount.toLocaleString('id-ID')}.`);

            setGameState(currentState);
            saveToLocalStorage(currentState);
            if (onStateChange) onStateChange(currentState);
        });
    }
}
