import { getGameState, setGameState, resetGameState } from './state/gameState.js';
import { loadFromLocalStorage, saveToLocalStorage } from './state/storage.js';
import { getCloudinaryUrl } from './config/cloudinary.js';

// Fungsi Inisialisasi Aplikasi
function initGame() {
    console.log("Memulai FYF Game Engine...");

    // 1. Cek apakah ada data simpanan sebelumnya
    let state = loadFromLocalStorage();

    if (!state) {
        console.log("Tidak ada simpanan ditemukan. Membuat karakter baru...");
        state = resetGameState();
        saveToLocalStorage(state);
    } else {
        console.log("Data simpanan berhasil dimuat:", state);
        setGameState(state);
    }

    // 2. Render Tampilan Sederhana (Pengujian)
    renderTestUI(state);
}

// Render Pengujian
function renderTestUI(state) {
    const app = document.getElementById('app');
    const bgOverlay = document.getElementById('bg-overlay');

    // Set background via Cloudinary helper (jika CLOUD_NAME sudah diisi)
    const bgUrl = getCloudinaryUrl(state.backgroundBgId);
    if (bgUrl && !bgUrl.includes('YOUR_CLOUD_NAME')) {
        bgOverlay.style.backgroundImage = `url('${bgUrl}')`;
    }

    app.innerHTML = `
        <div style="text-align: center; margin-top: 40px;">
            <h1 style="color: #38bdf8; margin-bottom: 10px;">FYF Simulation</h1>
            <p style="color: #cbd5e1;">Pondasi Sistem Engine Aktif</p>
        </div>

        <div style="background: rgba(15, 23, 42, 0.6); padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Data Karakter:</h3>
            <p><strong>Nama:</strong> ${state.profile.name}</p>
            <p><strong>Usia:</strong> ${state.profile.age} Tahun</p>
            <p><strong>Kesehatan:</strong> ${state.stats.health}%</p>
            <p><strong>FSS Score:</strong> ${state.stats.fss}</p>
        </div>

        <div style="margin-bottom: 20px;">
            <button id="btn-save-test" style="width: 100%; padding: 12px; background: #0284c7; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                Uji Simpan Data (Tambah Usia +1)
            </button>
        </div>
    `;

    // Event Listener Sederhana untuk Uji Coba Auto-Save
    document.getElementById('btn-save-test').addEventListener('click', () => {
        const currentState = getGameState();
        currentState.profile.age += 1;
        setGameState(currentState);
        saveToLocalStorage(currentState);
        
        // Render ulang tampilan
        renderTestUI(currentState);
    });
}

// Jalankan Engine saat DOM siap
document.addEventListener('DOMContentLoaded', initGame);
