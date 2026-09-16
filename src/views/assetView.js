import { getGameState, setGameState } from '../state/gameState.js';
import { saveToLocalStorage } from '../state/storage.js';
import { calculateFSS } from '../engine/fssEngine.js';

// Katalog Properti yang Dapat Dibeli
const PROPERTY_CATALOG = [
    { id: 'prop_1', name: 'Rumah Perumnas Sederhana', buyPrice: 150000000, rentalIncome: 1000000, maintenanceCost: 300000 },
    { id: 'prop_2', name: 'Ruko Komersial 2 Lantai', buyPrice: 600000000, rentalIncome: 4500000, maintenanceCost: 1000000 },
    { id: 'prop_3', name: 'Apartemen Tengah Kota', buyPrice: 1200000000, rentalIncome: 9000000, maintenanceCost: 2000000 }
];

// Katalog Peluang Bisnis
const BUSINESS_CATALOG = [
    { id: 'biz_1', name: 'Toko Kelontong Modern', type: 'Ritel', capitalRequired: 30000000, baseRevenue: 5000000, baseExpenses: 2500000, riskLevel: 'Rendah' },
    { id: 'biz_2', name: 'Kedai Kopi Kekinian', type: 'F&B', capitalRequired: 100000000, baseRevenue: 18000000, baseExpenses: 10000000, riskLevel: 'Sedang' },
    { id: 'biz_3', name: 'Startup Agrotech', type: 'Teknologi', capitalRequired: 300000000, baseRevenue: 50000000, baseExpenses: 35000000, riskLevel: 'Tinggi' }
];

export function renderAssetView(state, onStateChange) {
    const app = document.getElementById('app');
    const age = state.profile.age;
    const properties = state.properties || [];
    const businesses = state.businesses || [];

    app.innerHTML = `
        <div class="module-view">
            <div class="module-header">
                <div class="module-title">🏛️ Properti & Bisnis</div>
                <p style="font-size: 0.85rem; color: #94a3b8;">Bangun portofolio aset dan bisnis untuk mencapai kebebasan finansial.</p>
            </div>

            <!-- TAB SEKSI 1: PROPERTI SAYA -->
            <div class="card">
                <div class="card-title">🏠 Properti Milik Anda (${properties.length})</div>
                ${properties.length === 0 ? '<div class="card-desc">Belum memiliki properti.</div>' : ''}
                ${properties.map((p, idx) => `
                    <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px; margin-top: 6px;">
                        <strong>${p.name}</strong><br>
                        <span class="card-desc">Nilai Pasar: Rp ${p.currentValue.toLocaleString('id-ID')}</span><br>
                        <span class="card-desc">Sewa Bersih: Rp ${(p.rentalIncome - p.maintenanceCost).toLocaleString('id-ID')}/bln</span>
                        <div style="margin-top: 5px;">
                            <button class="card-btn btn-danger btn-sell-prop" data-idx="${idx}">Jual Properti</button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- KATALOG PROPERTI TERSEDIA -->
            <div class="card">
                <div class="card-title">🛒 Pasar Properti Tersedia</div>
                ${PROPERTY_CATALOG.map((p) => `
                    <div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 6px; margin-top: 6px;">
                        <strong>${p.name}</strong><br>
                        <span class="card-desc">Harga: Rp ${p.buyPrice.toLocaleString('id-ID')}</span><br>
                        <span class="card-desc">Potensi Sewa: Rp ${p.rentalIncome.toLocaleString('id-ID')}/bln</span>
                        <div style="margin-top: 5px;">
                            <button class="card-btn btn-buy-prop" data-id="${p.id}">Beli Tunai</button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- TAB SEKSI 2: BISNIS SAYA -->
            <div class="card">
                <div class="card-title">🏢 Bisnis Milik Anda (${businesses.length})</div>
                ${businesses.length === 0 ? '<div class="card-desc">Belum memiliki bisnis aktif.</div>' : ''}
                ${businesses.map((b, idx) => `
                    <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px; margin-top: 6px;">
                        <strong>${b.name} (${b.type})</strong><br>
                        <span class="card-desc">Estimasi Laba/Rugi: Rp ${(b.monthlyRevenue - b.monthlyExpenses).toLocaleString('id-ID')}/bln</span><br>
                        <span class="card-desc">Tingkat Risiko: ${b.riskLevel}</span>
                        <div style="margin-top: 5px;">
                            <button class="card-btn btn-danger btn-close-biz" data-idx="${idx}">Tutup Bisnis</button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- KATALOG PELUANG BISNIS -->
            <div class="card">
                <div class="card-title">🚀 Peluang Kewirausahaan</div>
                ${BUSINESS_CATALOG.map((b) => `
                    <div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 6px; margin-top: 6px;">
                        <strong>${b.name}</strong><br>
                        <span class="card-desc">Modal Awal: Rp ${b.capitalRequired.toLocaleString('id-ID')}</span><br>
                        <span class="card-desc">Risiko: ${b.riskLevel}</span>
                        <div style="margin-top: 5px;">
                            <button class="card-btn btn-start-biz" data-id="${b.id}">Dirikan Bisnis</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // --- EVENT LISTENERS PROPERTI ---
    document.querySelectorAll('.btn-buy-prop').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const propId = e.target.getAttribute('data-id');
            const targetProp = PROPERTY_CATALOG.find(p => p.id === propId);
            const currentState = getGameState();

            if (currentState.finances.cash < targetProp.buyPrice) {
                alert("Uang tunai Anda tidak cukup untuk membeli properti ini!");
                return;
            }

            currentState.finances.cash -= targetProp.buyPrice;
            currentState.properties.push({
                id: targetProp.id,
                name: targetProp.name,
                buyPrice: targetProp.buyPrice,
                currentValue: targetProp.buyPrice,
                rentalIncome: targetProp.rentalIncome,
                maintenanceCost: targetProp.maintenanceCost
            });
            currentState.logs.unshift(`Umur ${age}: Membeli ${targetProp.name} seharga Rp ${targetProp.buyPrice.toLocaleString('id-ID')}.`);
            currentState.stats.fss = calculateFSS(currentState.finances);

            setGameState(currentState);
            saveToLocalStorage(currentState);
            if (onStateChange) onStateChange(currentState);
        });
    });

    document.querySelectorAll('.btn-sell-prop').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-idx'));
            const currentState = getGameState();
            const prop = currentState.properties[idx];

            currentState.finances.cash += prop.currentValue;
            currentState.logs.unshift(`Umur ${age}: Menjual ${prop.name} seharga Rp ${prop.currentValue.toLocaleString('id-ID')}.`);
            currentState.properties.splice(idx, 1);
            currentState.stats.fss = calculateFSS(currentState.finances);

            setGameState(currentState);
            saveToLocalStorage(currentState);
            if (onStateChange) onStateChange(currentState);
        });
    });

    // --- EVENT LISTENERS BISNIS ---
    document.querySelectorAll('.btn-start-biz').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const bizId = e.target.getAttribute('data-id');
            const targetBiz = BUSINESS_CATALOG.find(b => b.id === bizId);
            const currentState = getGameState();

            if (currentState.finances.cash < targetBiz.capitalRequired) {
                alert("Modal tunai Anda tidak mencukupi untuk mendirikan bisnis ini!");
                return;
            }

            currentState.finances.cash -= targetBiz.capitalRequired;
            currentState.businesses.push({
                id: targetBiz.id,
                name: targetBiz.name,
                type: targetBiz.type,
                capital: targetBiz.capitalRequired,
                monthlyRevenue: targetBiz.baseRevenue,
                monthlyExpenses: targetBiz.baseExpenses,
                riskLevel: targetBiz.riskLevel
            });
            currentState.logs.unshift(`Umur ${age}: Mendirikan bisnis ${targetBiz.name} dengan modal Rp ${targetBiz.capitalRequired.toLocaleString('id-ID')}.`);
            currentState.stats.fss = calculateFSS(currentState.finances);

            setGameState(currentState);
            saveToLocalStorage(currentState);
            if (onStateChange) onStateChange(currentState);
        });
    });

    document.querySelectorAll('.btn-close-biz').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-idx'));
            const currentState = getGameState();
            const biz = currentState.businesses[idx];

            currentState.logs.unshift(`Umur ${age}: Memutuskan menutup bisnis ${biz.name}.`);
            currentState.businesses.splice(idx, 1);
            currentState.stats.fss = calculateFSS(currentState.finances);

            setGameState(currentState);
            saveToLocalStorage(currentState);
            if (onStateChange) onStateChange(currentState);
        });
    });
}
