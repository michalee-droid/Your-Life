import { getGameState, setGameState } from '../state/gameState.js';
import { saveToLocalStorage } from '../state/storage.js';

export function renderRelationshipView(state, onStateChange) {
    const app = document.getElementById('app');
    const rels = state.relationships || [];

    app.innerHTML = `
        <div class="module-view">
            <div class="module-header">
                <div class="module-title">🤝 Relasi & Koneksi</div>
                <p style="font-size: 0.85rem; color: #94a3b8;">Jaga hubungan baik dengan keluarga dan kolega Anda.</p>
            </div>

            <div class="card">
                <div class="card-title">👥 Daftar Koneksi</div>
                ${rels.map((r, idx) => `
                    <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 6px; margin-top: 8px;">
                        <strong>${r.name}</strong> (${r.relation})<br>
                        <span class="card-desc">Tingkat Keakraban: ${r.affinity}% | Status: ${r.isAlive ? 'Hidup' : 'Meninggal'}</span>
                        ${r.isAlive ? `
                            <div style="display: flex; gap: 8px; margin-top: 6px;">
                                <button class="card-btn btn-interact" data-idx="${idx}" data-action="talk">💬 Sapa / Bincang</button>
                                ${state.profile.age < 18 ? `<button class="card-btn btn-interact" data-idx="${idx}" data-action="money" style="background: #10b981;">💵 Minta Uang Saku</button>` : ''}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.querySelectorAll('.btn-interact').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-idx'));
            const action = e.target.getAttribute('data-action');
            const currentState = getGameState();
            const rel = currentState.relationships[idx];

            if (action === 'talk') {
                rel.affinity = Math.min(100, rel.affinity + 5);
                currentState.stats.happiness = Math.min(100, currentState.stats.happiness + 2);
                currentState.logs.unshift(`Umur ${currentState.profile.age}: Berbincang hangat dengan ${rel.name}.`);
            } else if (action === 'money') {
                if (rel.affinity < 40) {
                    alert(`${rel.name} menolak memberikan uang saku karena hubungan kurang akrab.`);
                } else {
                    const allowance = 50000;
                    currentState.finances.cash += allowance;
                    rel.affinity = Math.max(0, rel.affinity - 2);
                    currentState.logs.unshift(`Umur ${currentState.profile.age}: Mendapat uang saku Rp ${allowance.toLocaleString('id-ID')} dari ${rel.name}.`);
                }
            }

            setGameState(currentState);
            saveToLocalStorage(currentState);
            if (onStateChange) onStateChange(currentState);
        });
    });
}
