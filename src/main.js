import { getGameState, setGameState, resetGameState } from './state/gameState.js';
import { loadFromLocalStorage, saveToLocalStorage } from './state/storage.js';
import { getCloudinaryUrl } from './config/cloudinary.js';
import { renderDashboardView } from './views/dashboardView.js';
import { initModal } from './components/modal.js';

function initGame() {
    console.log("Memulai FYF Game Engine...");

    // 1. Inisialisasi Wadah Modal ke DOM
    initModal();

    // 2. Muat State
    let state = loadFromLocalStorage();

    if (!state) {
        state = resetGameState();
        saveToLocalStorage(state);
    } else {
        setGameState(state);
    }

    renderLoop(state);
}

function renderLoop(state) {
    const bgOverlay = document.getElementById('bg-overlay');
    if (bgOverlay) {
        const bgUrl = getCloudinaryUrl(state.backgroundBgId);
        if (bgUrl && !bgUrl.includes('YOUR_CLOUD_NAME')) {
            bgOverlay.style.backgroundImage = `url('${bgUrl}')`;
        }
    }

    renderDashboardView(state, (newState) => {
        renderLoop(newState);
    });
}

document.addEventListener('DOMContentLoaded', initGame);
