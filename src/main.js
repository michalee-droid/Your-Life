import { getGameState, setGameState, resetGameState } from './state/gameState.js';
import { loadFromLocalStorage, saveToLocalStorage } from './state/storage.js';

import { renderCharacterCreationView } from './views/characterCreationView.js';
import { renderGameOverView } from './views/gameOverView.js';
import { renderDashboardView } from './views/dashboardView.js';
import { renderEducationView } from './views/educationView.js';
import { renderJobView } from './views/jobView.js';
import { renderAssetView } from './views/assetView.js';
import { renderFinanceView } from './views/financeView.js';
import { renderRelationshipView } from './views/relationshipView.js';

import { renderBottomNav } from './components/navigation.js';

let currentTab = 'dashboard';

function initGame() {
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
    // 1. Jika Karakter Belum Dibuat -> Tampilkan Form Registrasi
    if (!state.hasCreatedCharacter) {
        renderCharacterCreationView((newState) => renderLoop(newState));
        return;
    }

    // 2. Poin 1: Jika Karakter Mati -> Tampilkan Game Over Screen
    if (!state.profile.isAlive) {
        renderGameOverView(state, (freshState) => renderLoop(freshState));
        return;
    }

    // 3. Routing Halaman
    if (currentTab === 'dashboard') renderDashboardView(state, (s) => renderLoop(s));
    else if (currentTab === 'education') renderEducationView(state, (s) => renderLoop(s));
    else if (currentTab === 'job') renderJobView(state, (s) => renderLoop(s));
    else if (currentTab === 'asset') renderAssetView(state, (s) => renderLoop(s));
    else if (currentTab === 'finance') renderFinanceView(state, (s) => renderLoop(s));
    else if (currentTab === 'relationship') renderRelationshipView(state, (s) => renderLoop(s));

    // 4. Poin 6: Render Single Menu Toggle Floating Button
    const app = document.getElementById('app');
    app.insertAdjacentHTML('beforeend', renderBottomNav(currentTab, state, (selectedTab) => {
        currentTab = selectedTab;
        renderLoop(getGameState());
    }));
}

document.addEventListener('DOMContentLoaded', initGame);
