export const DEFAULT_STATE = {
    version: "1.0.0",
    hasCreatedCharacter: false, // Flag status registrasi awal
    profile: {
        name: "",
        gender: "", // "Pria" / "Wanita"
        age: 0,
        archetype: "Belum Terdefinisi",
        isAlive: true
    },
    parents: {
        fatherName: "Ayah",
        motherName: "Ibu",
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
        monthlyExpenses: 0, // 0 jika ditanggung orang tua (< 15 tahun)
        lifestyleTier: "Minimalis",
        debt: 0,
        annualInterestRate: 0.10
    },
    education: {
        currentLevel: "Belum Sekolah",
        schoolName: "Tidak Ada",
        isEnrolled: false,
        performance: 50,
        yearsCompleted: 0,
        requiredYears: 0
    },
    job: {
        title: "Pengangguran",
        company: "Tidak Ada",
        monthlySalary: 0,
        hoursPerWeek: 0,
        fatigue: 0
    },
    properties: [],
    businesses: [],
    // Modul Baru: Relasi & Koneksi
    relationships: [
        { id: "father", name: "Ayah", relation: "Orang Tua", affinity: 80, isAlive: true },
        { id: "mother", name: "Ibu", relation: "Orang Tua", affinity: 85, isAlive: true }
    ],
    logs: [],
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
