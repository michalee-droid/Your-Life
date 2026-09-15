import { getGameState, setGameState } from '../state/gameState.js';
import { saveToLocalStorage } from '../state/storage.js';

/**
 * Merender Tampilan Modul Pendidikan
 */
export function renderEducationView(state, onStateChange) {
    const app = document.getElementById('app');
    const age = state.profile.age;
    const edu = state.education;

    let contentHTML = '';

    if (edu.isEnrolled) {
        contentHTML = `
            <div class="card">
                <div class="card-title">🏫 ${edu.schoolName} (${edu.currentLevel})</div>
                <div class="card-desc">Status: Siswa/Mahasiswa Aktif</div>
                <div class="card-desc">Performa Akademik: ${edu.performance}%</div>
                <div style="display: flex; gap: 10px; margin-top: 5px;">
                    <button id="btn-study-hard" class="card-btn">📚 Belajar Lebih Giat (+IQ)</button>
                    <button id="btn-drop-out" class="card-btn btn-danger">🚪 Putus Sekolah</button>
                </div>
            </div>
        `;
    } else {
        // Pilihan Sekolah Berdasarkan Usia
        let availableSchool = null;
        if (age >= 6 && age < 12) availableSchool = { level: "SD", name: "SD Negeri 01", cost: 0 };
        else if (age >= 12 && age < 15) availableSchool = { level: "SMP", name: "SMP Negeri 01", cost: 0 };
        else if (age >= 15 && age < 18) availableSchool = { level: "SMA", name: "SMA Negeri 01", cost: 0 };
        else if (age >= 18) availableSchool = { level: "Universitas", name: "Universitas Negeri", cost: 5000000 };

        if (availableSchool) {
            contentHTML = `
                <div class="card">
                    <div class="card-title">🎓 Pendaftaran ${availableSchool.level}</div>
                    <div class="card-desc">Institusi: ${availableSchool.name}</div>
                    <div class="card-desc">Biaya: ${availableSchool.cost > 0 ? 'Rp ' + availableSchool.cost.toLocaleString('id-ID') + '/tahun' : 'Gratis'}</div>
                    <button id="btn-enroll" class="card-btn" style="margin-top: 5px;">Mendaftar Sekarang</button>
                </div>
            `;
        } else {
            contentHTML = `<div class="card"><div class="card-desc">Belum ada pilihan sekolah yang tersedia untuk usiamu saat ini (${age} tahun).</div></div>`;
        }
    }

    app.innerHTML = `
        <div class="module-view">
            <div class="module-header">
                <div class="module-title">🎓 Modul Pendidikan</div>
                <p style="font-size: 0.85rem; color: #94a3b8;">Tingkatkan Kecerdasan (IQ) untuk membuka karir bernilai tinggi.</p>
            </div>

            ${contentHTML}
        </div>
    `;

    // Event Listeners
    const btnEnroll = document.getElementById('btn-enroll');
    if (btnEnroll) {
        btnEnroll.addEventListener('click', () => {
            const currentState = getGameState();
            let newLevel = "SD";
            let schoolName = "SD Negeri 01";
            if (age >= 12 && age < 15) { newLevel = "SMP"; schoolName = "SMP Negeri 01"; }
            else if (age >= 15 && age < 18) { newLevel = "SMA"; schoolName = "SMA Negeri 01"; }
            else if (age >= 18) { newLevel = "Universitas"; schoolName = "Universitas Negeri"; }

            currentState.education = {
                currentLevel: newLevel,
                schoolName: schoolName,
                isEnrolled: true,
                performance: 60
            };
            currentState.logs.unshift(`Umur ${age}: Anda resmi terdaftar di ${schoolName}.`);
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
            currentState.logs.unshift(`Umur ${age}: Anda belajar dengan sangat giat (+3 IQ).`);
            setGameState(currentState);
            saveToLocalStorage(currentState);
            if (onStateChange) onStateChange(currentState);
        });
    }

    const btnDrop = document.getElementById('btn-drop-out');
    if (btnDrop) {
        btnDrop.addEventListener('click', () => {
            const currentState = getGameState();
            currentState.logs.unshift(`Umur ${age}: Anda memutuskan untuk berhenti dari ${currentState.education.schoolName}.`);
            currentState.education.isEnrolled = false;
            currentState.education.schoolName = "Tidak Ada";
            setGameState(currentState);
            saveToLocalStorage(currentState);
            if (onStateChange) onStateChange(currentState);
        });
    }
}
