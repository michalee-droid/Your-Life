import { getGameState, setGameState } from '../state/gameState.js';
import { saveToLocalStorage } from '../state/storage.js';

const JOB_OPENINGS = [
    // Pekerjaan Informal (Usia Muda)
    { title: "Membantu Jaga Warung", minAge: 5, minIq: 10, salary: 300000, fatigue: 15, isInformal: true },
    { title: "Pengamen / Semir Sepatu", minAge: 6, minIq: 10, salary: 500000, fatigue: 25, isInformal: true },
    { title: "Pencuci Piring Kedai", minAge: 10, minIq: 20, salary: 800000, fatigue: 30, isInformal: true },
    
    // Pekerjaan Formal
    { title: "Pekerja Lepas", minAge: 15, minIq: 30, salary: 1500000, fatigue: 20, isInformal: false },
    { title: "Staf Administrasi", minAge: 18, minIq: 50, salary: 4500000, fatigue: 30, isInformal: false },
    { title: "Software Engineer", minAge: 18, minIq: 70, salary: 8000000, fatigue: 45, isInformal: false }
];

export function renderJobView(state, onStateChange) {
    const app = document.getElementById('app');
    const age = state.profile.age;
    const currentJob = state.job;

    let contentHTML = '';

    if (currentJob.monthlySalary > 0) {
        contentHTML = `
            <div class="card">
                <div class="card-title">💼 ${currentJob.title}</div>
                <div class="card-desc">Gaji Bulanan: Rp ${currentJob.monthlySalary.toLocaleString('id-ID')}</div>
                <div class="card-desc">Kelelahan: ${currentJob.fatigue}%</div>
                <button id="btn-quit-job" class="card-btn btn-danger" style="margin-top: 8px;">Berhenti Kerja</button>
            </div>
        `;
    } else {
        const availableJobs = JOB_OPENINGS.filter(j => age >= j.minAge && state.stats.iq >= j.minIq);

        if (availableJobs.length > 0) {
            contentHTML = availableJobs.map((j, index) => `
                <div class="card">
                    <div class="card-title">${j.isInformal ? '🧹' : '💼'} ${j.title}</div>
                    <div class="card-desc">Gaji: Rp ${j.salary.toLocaleString('id-ID')}/bulan</div>
                    <div class="card-desc">Syarat Min. Umur: ${j.minAge} thn</div>
                    <button class="card-btn btn-apply-job" data-index="${index}" style="margin-top: 5px;">Ambil Pekerjaan</button>
                </div>
            `).join('');
        } else {
            contentHTML = `<div class="card"><div class="card-desc">Belum ada lowongan kerja untuk usiamu saat ini.</div></div>`;
        }
    }

    app.innerHTML = `
        <div class="module-view">
            <div class="module-header">
                <div class="module-title">💼 Modul Pekerjaan</div>
            </div>
            ${contentHTML}
        </div>
    `;

    document.querySelectorAll('.btn-apply-job').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.getAttribute('data-index');
            const availableJobs = JOB_OPENINGS.filter(j => age >= j.minAge && state.stats.iq >= j.minIq);
            const selectedJob = availableJobs[idx];

            const currentState = getGameState();
            currentState.job = {
                title: selectedJob.title,
                company: selectedJob.isInformal ? "Sektor Informal" : "PT Maju Bersama",
                monthlySalary: selectedJob.salary,
                hoursPerWeek: 20,
                fatigue: selectedJob.fatigue
            };
            currentState.finances.monthlyIncome = selectedJob.salary;
            currentState.logs.unshift(`Umur ${age}: Mulai bekerja sebagai ${selectedJob.title}.`);

            setGameState(currentState);
            saveToLocalStorage(currentState);
            if (onStateChange) onStateChange(currentState);
        });
    });

    const btnQuit = document.getElementById('btn-quit-job');
    if (btnQuit) {
        btnQuit.addEventListener('click', () => {
            const currentState = getGameState();
            currentState.job = { title: "Pengangguran", company: "Tidak Ada", monthlySalary: 0, hoursPerWeek: 0, fatigue: 0 };
            currentState.finances.monthlyIncome = 0;

            setGameState(currentState);
            saveToLocalStorage(currentState);
            if (onStateChange) onStateChange(currentState);
        });
    }
}
