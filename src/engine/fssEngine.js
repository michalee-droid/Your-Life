/**
 * Engine Kalkulasi FSS (Financial Stability Score) & Survival Runway
 */

/**
 * Menghitung Survival Runway (Berapa bulan kas bisa bertahan tanpa pendapatan)
 */
export function calculateRunway(cash, monthlyExpenses) {
    if (monthlyExpenses <= 0) return 999; // Fallback jika tidak ada pengeluaran
    if (cash <= 0) return 0;

    const months = cash / monthlyExpenses;
    return parseFloat(months.toFixed(1));
}

/**
 * Menghitung FSS Score (0 - 100) berdasarkan Rasio Cashflow, Utang, dan Runway
 */
export function calculateFSS(finances) {
    const { cash, monthlyIncome, monthlyExpenses, debt } = finances;

    let score = 50; // Base score

    // 1. Evaluasi Survival Runway
    const runwayMonths = calculateRunway(cash, monthlyExpenses);
    if (runwayMonths >= 12) score += 25; // Aman minimal 1 tahun
    else if (runwayMonths >= 6) score += 15;
    else if (runwayMonths >= 3) score += 5;
    else score -= 20; // Krisis runway

    // 2. Evaluasi Net Cashflow
    const netCashflow = monthlyIncome - monthlyExpenses;
    if (netCashflow > 0) score += 15;
    else if (netCashflow < 0) score -= 15;

    // 3. Penalti Utang
    if (debt > 0) {
        const debtRatio = debt / (cash + 1); // Tambah 1 untuk cegah div by zero
        if (debtRatio > 2) score -= 25;
        else if (debtRatio > 1) score -= 15;
        else score -= 5;
    } else {
        score += 10; // Bebas utang
    }

    // Clamp skor antara 0 - 100
    return Math.max(0, Math.min(100, Math.round(score)));
}
