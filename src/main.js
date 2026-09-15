import { getGameState, setGameState, resetGameState } from './state/gameState.js';
import { loadFromLocalStorage, saveToLocalStorage } from './state/storage.js';
import { getCloudinaryUrl } from './config/cloudinary.js';

import { renderDashboardView } from './views/dashboardView.js';
import { renderEducationView } from './views/educationView.js';
import { renderJobView } from './views/jobView.js';

import { renderBottomNav } from './components/navigation.js';
import { initModal } from './components/modal.js';

let currentTab = 'dashboard'; // Default Tab Active

function initGame() {
    console.log("Memulai FYF Game Engine...");

    initModal();

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

    // Router Sederhana Berdasarkan Active Tab
    if (currentTab === 'dashboard') {
        renderDashboardView(state, (newState) => renderLoop(newState));
    } else if (currentTab === 'education') {
        renderEducationView(state, (newState) => renderLoop(newState));
    } else if (currentTab === 'job') {
        renderJobView(state, (newState) => renderLoop(newState));
    }

    // Selalu Tempelkan Bottom Navigation Bar di bagian bawah app container
    const app = document.getElementById('app');
    app.insertAdjacentHTML('beforeend', renderBottomNav(currentTab, (selectedTab) => {
        currentTab = selectedTab;
        renderLoop(getGameState());
    }));
}

document.addEventListener('DOMContentLoaded', initGame);
