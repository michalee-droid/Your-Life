import { getGameState, setGameState } from '../state/gameState.js';
import { saveToLocalStorage } from '../state/storage.js';

export function renderCharacterCreationView(onComplete) {
    const app = document.getElementById('app');

    app.innerHTML = `
        <div class="module-view" style="justify-content: center; align-items: center; text-align: center; padding: 20px;">
            <div class="card" style="width: 100%; max-width: 360px; padding: 20px;">
                <h2 style="color: #38bdf8; margin-bottom: 10px;">👶 Kehidupan Baru</h2>
                <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 20px;">Tentukan identitas awal karakter Anda sebelum memulai simulasi.</p>

                <div style="text-align: left; margin-bottom: 15px;">
                    <label style="font-size: 0.85rem; color: #cbd5e1; display: block; margin-bottom: 5px;">Nama Lengkap:</label>
                    <input type="text" id="input-name" placeholder="Contoh: Budi Santoso" style="width: 100%; padding: 10px; border-radius: 6px; background: #1e293b; border: 1px solid #475569; color: white;">
                </div>

                <div style="text-align: left; margin-bottom: 20px;">
                    <label style="font-size: 0.85rem; color: #cbd5e1; display: block; margin-bottom: 5px;">Jenis Kelamin:</label>
                    <select id="select-gender" style="width: 100%; padding: 10px; border-radius: 6px; background: #1e293b; border: 1px solid #475569; color: white;">
                        <option value="Pria">Pria</option>
                        <option value="Wanita">Wanita</option>
                    </select>
                </div>

                <button id="btn-start-life" class="card-btn" style="width: 100%; padding: 12px; font-size: 1rem; background: #10b981;">Lahir ke Dunia</button>
            </div>
        </div>
    `;

    document.getElementById('btn-start-life').addEventListener('click', () => {
        const nameInput = document.getElementById('input-name').value.trim();
        const genderInput = document.getElementById('select-gender').value;

        if (!nameInput) {
            alert("Harap masukkan nama karakter!");
            return;
        }

        const state = getGameState();
        state.hasCreatedCharacter = true;
        state.profile.name = nameInput;
        state.profile.gender = genderInput;
        state.logs = [`Anda lahir ke dunia sebagai seorang ${genderInput} bernama ${nameInput}.`];

        setGameState(state);
        saveToLocalStorage(state);

        if (onComplete) onComplete(state);
    });
}
