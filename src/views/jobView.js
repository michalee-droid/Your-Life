import { getGameState, setGameState } from '../state/gameState.js';
import { saveToLocalStorage } from '../state/storage.js';

// Katalog Lowongan Kerja Sederhana
const JOB_OPENINGS = [
    { title: "Pekerja Lepas / Serabutan", minAge: 15, minIq: 30, salary: 1500000, fatigue: 20 },
    { title: "Staf Administrasi", minAge: 18, minIq: 50, salary: 4500000, fatigue: 30 },
    { title: "Junior Software Engineer", minAge: 18, minIq: 70, salary: 8000000, fatigue: 45 },
    { title: "Manajer Operasional", minAge: 22, minIq: 80, salary: 15000000, fatigue: 60 }
];

/**
 * Merender Tampilan Modul Pekerjaan
 */
export function renderJobView(state, onStateChange) {
    const app = document.getElementById('app');
    const age = state.profile.age;
    const currentJob = state.job;

    let contentHTML = '';

    if (currentJob.monthlySalary > 0) {
        contentHTML = `
            <div class="card">
                <div class="card-title">💼 ${currentJob.title}</div>
                <div class="card-desc">Perusahaan: ${currentJob.company}</div>
                <div class="card-desc">Gaji Bulanan: Rp ${currentJob.monthlySalary.toLocaleString('id-ID')}</div>
                <div class="card-desc">Tingkat Kelelahan: ${currentJob.fatigue}%</div>
                <div style="display: flex; gap: 10px; margin-top: 5px;">
                    <button id="btn-overtime" class="card-btn">⚡ Lembur (+Gaji Bonus)</button>
                    <button id="btn-quit-job" class="card-btn btn-danger">🚪 Resign</button>
                </div>
            </div>
        `;
    } else {
        // Filter pekerjaan yang memenuhi syarat umur dan IQ
        const availableJobs = JOB_OPENINGS.filter(j => age >= j.minAge && state.stats.iq >= j.minIq);

        if (availableJobs.length > 0) {
            contentHTML = availableJobs.map((j, index) => `
                <div class="card">
                    <div class="card-title">💼 ${j.title}</div>
                    <div class="card-desc">Gaji: Rp ${j.salary.toLocaleString('id-ID')}/bulan</div>
                    <div class="card-desc">Syarat IQ: ${j.minIq} | Kelelahan: ${j.fatigue}%</div>
                    <button class="card-btn btn-apply-job" data-index="${index}" style="margin-top: 5px;">Lamar Pekerjaan</button>
                </div>
            `).join('');
        } else {
            contentHTML = `<div class="card"><div class="card-desc">Belum ada lowongan pekerjaan yang cocok untuk kualifikasi dan usiamu saat ini.</div></div>`;
        }
    }

    app.innerHTML = `
        <div class="module-view">
            <div class="module-header">
                <div class="module-title">💼 Modul Karir & Pekerjaan</div>
                <p style="font-size: 0.85rem; color: #94a3b8;">Dapatkan arus kas bulanan untuk menopang kehidupan dan investasi.</p>
            </div>

            ${contentHTML}
        </div>
    `;

    // Event Listeners
    document.querySelectorAll('.btn-apply-job').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.getAttribute('data-index');
            const availableJobs = JOB_OPENINGS.filter(j => age >= j.minAge && state.stats.iq >= j.minIq);
            const selectedJob = availableJobs[idx];

            const currentState = getGameState();
            currentState.job = {
                title: selectedJob.title,
                company: "PT Maju Bersama",
                monthlySalary: selectedJob.salary,
                hoursPerWeek: 40,
                fatigue: selectedJob.fatigue
            };
            currentState.finances.monthlyIncome = selectedJob.salary;
            currentState.logs.unshift(`Umur ${age}: Diterima bekerja sebagai ${selectedJob.title}.`);

            setGameState(currentState);
            saveToLocalStorage(currentState);
            if (onStateChange) onStateChange(currentState);
        });
    });

    const btnQuit = document.getElementById('btn-quit-job');
    if (btnQuit) {
        btnQuit.addEventListener('click', () => {
            const currentState = getGameState();
            currentState.logs.unshift(`Umur ${age}: Anda memutuskan mengundurkan diri dari pekerjaan ${currentState.job.title}.`);
            currentState.job = { title: "Pengangguran", company: "Tidak Ada", monthlySalary: 0, hoursPerWeek: 0, fatigue: 0 };
            currentState.finances.monthlyIncome = 0;

            setGameState(currentState);
            saveToLocalStorage(currentState);
            if (onStateChange) onStateChange(currentState);
        });
    }

    const btnOvertime = document.getElementById('btn-overtime');
    if (btnOvertime) {
        btnOvertime.addEventListener('click', () => {
            const currentState = getGameState();
            const bonus = Math.floor(currentState.job.monthlySalary * 0.2);
            currentState.finances.cash += bonus;
            currentState.stats.happiness = Math.max(0, currentState.stats.happiness - 5);
            currentState.stats.health = Math.max(0, currentState.stats.health - 5);
            currentState.logs.unshift(`Umur ${age}: Anda mengambil lembur dan mendapat bonus Rp ${bonus.toLocaleString('id-ID')}.`);

            setGameState(currentState);
            saveToLocalStorage(currentState);
            if (onStateChange) onStateChange(currentState);
        });
    }
}
