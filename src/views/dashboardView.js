import { renderStatusBar } from '../components/statusBar.js';
import { processAgeUp } from '../engine/ageEngine.js';

/**
 * Merender Tampilan Utama Dashboard
 */
export function renderDashboardView(state, onStateChange) {
    const app = document.getElementById('app');

    // Format mata uang Rupiah Sederhana
    const formattedCash = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(state.finances.cash);

    // Susun Log Kejadian
    const logsHTML = state.logs.map(log => `<div class="log-item">${log}</div>`).join('');

    app.innerHTML = `
        <div class="dashboard">
            <!-- Header Profil -->
            <div class="profile-header">
                <div class="profile-name">${state.profile.name}</div>
                <div class="profile-meta">Usia: ${state.profile.age} Tahun | Arketipe: ${state.profile.archetype}</div>
            </div>

            <!-- Status Bar Components -->
            ${renderStatusBar(state.stats)}

            <!-- Ringkasan Keuangan -->
            <div class="finance-summary">
                <span>💰 Tabungan: <strong>${formattedCash}</strong></span>
            </div>

            <!-- Log Aktivitas Kehidupan -->
            <div class="log-container">
                ${logsHTML}
            </div>

            <!-- Tombol Aksi Utama -->
            <div class="action-container">
                <button id="btn-age-up" class="btn-age-up">➕ Tambah Usia (+1 Tahun)</button>
            </div>
        </div>
    `;

    // Event Listener Tombol Age Up
    document.getElementById('btn-age-up').addEventListener('click', () => {
        const updatedState = processAgeUp();
        // Panggil callback untuk me-render ulang tampilan dengan state terbaru
        if (onStateChange) onStateChange(updatedState);
    });
}
