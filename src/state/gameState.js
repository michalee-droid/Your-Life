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
