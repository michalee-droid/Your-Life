import { resetGameState } from '../state/gameState.js';
import { saveToLocalStorage } from '../state/storage.js';

export function renderGameOverView(state, onRestart) {
    const app = document.getElementById('app');

    app.innerHTML = `
        <div class="module-view" style="justify-content: center; align-items: center; text-align: center; padding: 20px;">
            <div class="card" style="width: 100%; max-width: 360px; padding: 25px; border: 1px solid #ef4444;">
                <h1 style="color: #ef4444; margin-bottom: 10px;">💀 Anda Meninggal</h1>
                <p style="font-size: 0.95rem; color: #f8fafc; margin-bottom: 10px;">Perjalanan hidup <strong>${state.profile.name}</strong> telah berakhir pada usia <strong>${state.profile.age} tahun</strong>.</p>
                
                <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px; margin: 15px 0; font-size: 0.8rem; color: #cbd5e1; text-align: left; max-height: 120px; overflow-y: auto;">
                    <strong>Catatan Akhir:</strong><br>
                    ${state.logs[0] || 'Meninggal dunia.'}
                </div>

                <button id="btn-restart-game" class="card-btn btn-danger" style="width: 100%; padding: 12px; font-size: 1rem;">🔄 Mulai Hidup Baru</button>
            </div>
        </div>
    `;

    document.getElementById('btn-restart-game').addEventListener('click', () => {
        const freshState = resetGameState();
        saveToLocalStorage(freshState);
        if (onRestart) onRestart(freshState);
    });
}
