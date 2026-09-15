export const DEFAULT_STATE = {
    version: "1.0.0",
    profile: {
        name: "Budi Santoso",
        gender: "Pria",
        age: 0,
        archetype: "Pekerja Keras",
        isAlive: true
    },
    stats: {
        health: 100,
        happiness: 80,
        iq: 50,
        physical: 50,
        fss: 100
    },
    finances: {
        cash: 0,
        monthlyIncome: 0,
        monthlyExpenses: 500000, // Biaya hidup dasar (Rp 500rb/bulan)
        lifestyleTier: "Minimalis", // Options: "Hemat", "Minimalis", "Menengah", "Mewah"
        debt: 0,
        annualInterestRate: 0.10 // Bunga utang 10% per tahun
    },
    education: {
        currentLevel: "Belum Sekolah",
        schoolName: "Tidak Ada",
        isEnrolled: false,
        performance: 50
    },
    job: {
        title: "Pengangguran",
        company: "Tidak Ada",
        monthlySalary: 0,
        hoursPerWeek: 0,
        fatigue: 0
    },
    logs: [
        "Anda lahir ke dunia sebagai anak yang sehat."
    ],
    backgroundBgId: "default_birth_bg"
};

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
