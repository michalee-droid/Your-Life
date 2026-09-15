import { getGameState, setGameState, resetGameState } from './state/gameState.js';
import { loadFromLocalStorage, saveToLocalStorage } from './state/storage.js';
import { getCloudinaryUrl } from './config/cloudinary.js';
import { renderDashboardView } from './views/dashboardView.js';

/**
 * Inisialisasi Utama FYF Game Engine
 */
function initGame() {
    console.log("Memulai FYF Game Engine...");

    // 1. Cek & Muat Data Simpanan dari LocalStorage
    let state = loadFromLocalStorage();

    if (!state) {
        console.log("Tidak ada simpanan ditemukan. Membuat karakter baru...");
        state = resetGameState();
        saveToLocalStorage(state);
    } else {
        console.log("Data simpanan berhasil dimuat:", state);
        setGameState(state);
    }

    // 2. Jalankan Siklus Render Utama
    renderLoop(state);
}

/**
 * Siklus Render Terpusat
 * Dipanggil setiap kali terjadi perubahan data/state pada game
 */
function renderLoop(state) {
    // A. Update Latar Belakang jika URL Cloudinary sudah dikonfigurasi
    const bgOverlay = document.getElementById('bg-overlay');
    if (bgOverlay) {
        const bgUrl = getCloudinaryUrl(state.backgroundBgId);
        if (bgUrl && !bgUrl.includes('YOUR_CLOUD_NAME')) {
            bgOverlay.style.backgroundImage = `url('${bgUrl}')`;
        }
    }

    // B. Render Tampilan Dashboard Utama
    renderDashboardView(state, (newState) => {
        // Callback ini dipanggil saat terjadi aksi di UI (seperti tekan tombol Age Up)
        renderLoop(newState);
    });
}

// Jalankan Engine saat seluruh elemen DOM selesai dimuat
document.addEventListener('DOMContentLoaded', initGame);
