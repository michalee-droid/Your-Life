import { renderStatusBar } from '../components/statusBar.js';
import { processAgeUp, applyEventChoiceEffect } from '../engine/ageEngine.js';
import { showModal } from '../components/modal.js';

/**
 * Merender Tampilan Utama Dashboard
 */
export function renderDashboardView(state, onStateChange) {
    const app = document.getElementById('app');

    const formattedCash = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(state.finances.cash);

    const logsHTML = state.logs.map(log => `<div class="log-item">${log}</div>`).join('');

    app.innerHTML = `
        <div class="dashboard">
            <div class="profile-header">
                <div class="profile-name">${state.profile.name}</div>
                <div class="profile-meta">Usia: ${state.profile.age} Tahun | Arketipe: ${state.profile.archetype}</div>
            </div>

            ${renderStatusBar(state.stats)}

            <div class="finance-summary">
                <span>💰 Tabungan: <strong>${formattedCash}</strong></span>
            </div>

            <div class="log-container">
                ${logsHTML}
            </div>

            <div class="action-container">
                <button id="btn-age-up" class="btn-age-up">➕ Tambah Usia (+1 Tahun)</button>
            </div>
        </div>
    `;

    // Event Listener Tombol Age Up
    document.getElementById('btn-age-up').addEventListener('click', () => {
        const result = processAgeUp();

        // A. Jika ada event yang terpicu, tampilkan Pop-up Modal
        if (result.triggeredEvent) {
            showModal(result.triggeredEvent, (selectedChoice) => {
                // Terapkan konsekuensi pilihan lalu render ulang UI
                const updatedState = applyEventChoiceEffect(selectedChoice);
                if (onStateChange) onStateChange(updatedState);
            });
        } else {
            // B. Jika tidak ada event acak, langsung render ulang UI
            if (onStateChange) onStateChange(result.state);
        }
    });
}
