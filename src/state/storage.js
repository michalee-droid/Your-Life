/**
 * Storage Utility untuk menyimpan dan membaca status permainan dari LocalStorage
 */

const STORAGE_KEY = 'your_life_state';

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Gagal menyimpan state ke LocalStorage:", error);
  }
}

export function loadState(defaultData = null) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultData;
  } catch (error) {
    console.error("Gagal membaca state dari LocalStorage:", error);
    return defaultData;
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Gagal menghapus state dari LocalStorage:", error);
  }
}

// --- Aliases Kompatibilitas Nama Lama ---
export const saveToLocalStorage = saveState;
export const loadFromLocalStorage = loadState;
export const getFromLocalStorage = loadState;
