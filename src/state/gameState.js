// Struktur Data Karakter Default
export const DEFAULT_STATE = {
    version: "1.0.0", // Untuk mitigasi risiko data korup jika ada update struktur
    profile: {
        name: "Belum Diberi Nama",
        gender: "Pria",
        age: 0,
        archetype: "Unknown",
        isAlive: true
    },
    stats: {
        health: 100,
        happiness: 100,
        iq: 50,
        physical: 50,
        fss: 100 // Financial Stability Score
    },
    finances: {
        cash: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0
    },
    // Modul Baru: Pendidikan
    education: {
        currentLevel: "Belum Sekolah", // "SD", "SMP", "SMA", "Universitas", dll.
        schoolName: "Tidak Ada",
        isEnrolled: false,
        performance: 50
    },
    // Modul Baru: Pekerjaan
    job: {
        title: "Pengangguran",
        company: "Tidak Ada",
        monthlySalary: 0,
        hoursPerWeek: 0,
        fatigue: 0 // Beban kelelahan (0 - 100)
    },
    logs: [
        "Anda lahir ke dunia sebagai anak yang sehat."
    ],
    backgroundBgId: "default_birth_bg" // Cloudinary Public ID contoh
};

// State Aktif Aplikasi (In-Memory)
let currentState = JSON.parse(JSON.stringify(DEFAULT_STATE));

export function getGameState() {
    return currentState;
}

export function setGameState(newState) {
    currentState = { ...currentState, ...newState };
}

export function resetGameState() {
    currentState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    return currentState;
}
