import { getGameState, setGameState } from '../state/gameState.js';
import { saveToLocalStorage } from '../state/storage.js';

export function renderEducationView(state, onStateChange) {
    const app = document.getElementById('app');
    const age = state.profile.age;
    const edu = state.education;

    let contentHTML = '';

    if (edu.isEnrolled) {
        contentHTML = `
            <div class="card">
                <div class="card-title">🏫 ${edu.schoolName} (${edu.currentLevel})</div>
                <div class="card-desc">Progres Studi: Tahun ke-${(edu.yearsCompleted || 0) + 1} dari ${edu.requiredYears || 3} tahun</div>
                <div class="card-desc">Performa Akademik: ${edu.performance}%</div>
                <div style="display: flex; gap: 10px; margin-top: 8px;">
                    <button id="btn-study-hard" class="card-btn">📚 Belajar Lebih Giat (+IQ)</button>
                    <button id="btn-drop-out" class="card-btn btn-danger">🚪 Putus Sekolah</button>
                </div>
            </div>
        `;
    } else {
        let availableSchool = null;
        if (age >= 6 && age < 12) availableSchool = { level: "SD", name: "SD Negeri 01", cost: 0, years: 6 };
        else if (age >= 12 && age < 15) availableSchool = { level: "SMP", name: "SMP Negeri 01", cost: 1500000, years: 3 };
        else if (age >= 15 && age < 18) availableSchool = { level: "SMA", name: "SMA Negeri 01", cost: 3000000, years: 3 };
        else if (age >= 18) availableSchool = { level: "Universitas", name: "Universitas Negeri", cost: 15000000, years: 4 };

        if (availableSchool) {
            contentHTML = `
                <div class="card">
                    <div class="card-title">🎓 Pendaftaran ${availableSchool.level}</div>
                    <div class="card-desc">Institusi: ${availableSchool.name}</div>
                    <div class="card-desc">Biaya Masuk: Rp ${availableSchool.cost.toLocaleString('id-ID')}</div>
                    <div class="card-desc">Masa Studi: ${availableSchool.years} Tahun</div>
                    <button id="btn-enroll" class="card-btn" style="margin-top: 8px;">Mendaftar & Bayar</button>
                </div>
            `;
        } else {
            contentHTML = `<div class="card"><div class="card-desc">Belum ada institusi yang tersedia untuk usiamu saat ini (${age} tahun).</div></div>`;
        }
    }

    app.innerHTML = `
        <div class="module-view">
            <div class="module-header">
                <div class="module-title">🎓 Modul Pendidikan</div>
                <p style="font-size: 0.85rem; color: #94a3b8;">Tempuh pendidikan untuk membuka jenjang karir bernilai tinggi.</p>
            </div>
            ${contentHTML}
        </div>
    `;

    const btnEnroll = document.getElementById('btn-enroll');
    if (btnEnroll) {
        btnEnroll.addEventListener('click', () => {
            const currentState = getGameState();
            let selected = { level: "SD", name: "SD Negeri 01", cost: 0, years: 6 };
            if (age >= 12 && age < 15) selected = { level: "SMP", name: "SMP Negeri 01", cost: 1500000, years: 3 };
            else if (age >= 15 && age < 18) selected = { level: "SMA", name: "SMA Negeri 01", cost: 3000000, years: 3 };
            else if (age >= 18) selected = { level: "Universitas", name: "Universitas Negeri", cost: 15000000, years: 4 };

            if (currentState.finances.cash < selected.cost) {
                alert("Uang tunai Anda tidak mencukupi untuk pendaftaran!");
                return;
            }

            // Potong Kas & Set Status Pendidikan
            currentState.finances.cash -= selected.cost;
            currentState.education = {
                currentLevel: selected.level,
                schoolName: selected.name,
                isEnrolled: true,
                performance: 60,
                yearsCompleted: 0,
                requiredYears: selected.years
            };
            currentState.logs.unshift(`Umur ${age}: Mengeluarkan Rp ${selected.cost.toLocaleString('id-ID')} untuk masuk ${selected.name}.`);

            setGameState(currentState);
            saveToLocalStorage(currentState);
            if (onStateChange) onStateChange(currentState);
        });
    }

    const btnStudy = document.getElementById('btn-study-hard');
    if (btnStudy) {
        btnStudy.addEventListener('click', () => {
            const currentState = getGameState();
            currentState.stats.iq = Math.min(100, currentState.stats.iq + 3);
            currentState.stats.happiness = Math.max(0, currentState.stats.happiness - 2);
            currentState.education.performance = Math.min(100, currentState.education.performance + 10);
            currentState.logs.unshift(`Umur ${age}: Belajar giat (+3 IQ).`);

            setGameState(currentState);
            saveToLocalStorage(currentState);
            if (onStateChange) onStateChange(currentState);
        });
    }

    const btnDrop = document.getElementById('btn-drop-out');
    if (btnDrop) {
        btnDrop.addEventListener('click', () => {
            const currentState = getGameState();
            currentState.logs.unshift(`Umur ${age}: Berhenti dari ${currentState.education.schoolName}.`);
            currentState.education.isEnrolled = false;

            setGameState(currentState);
            saveToLocalStorage(currentState);
            if (onStateChange) onStateChange(currentState);
        });
    }
}
