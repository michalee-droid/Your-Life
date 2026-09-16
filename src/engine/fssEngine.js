/**
 * Menghitung Financial Stress Score (FSS) dan menentukan Zona Risiko
 * Formula: FSS = ((Mandatory Expenses + Debt) / Income * 50) + Strain Multiplier
 */
export function calculateFSS(finances, strainMultiplier = 0) {
  const { mandatory_expenses = 0, debt_installment = 0, net_income = 0 } = finances;

  // Defensive Guard: Cegah Division by Zero saat menganggur
  const safeIncome = net_income > 0 ? net_income : 1;
  const totalExpenses = mandatory_expenses + debt_installment;

  // Base Calculation
  let rawFSS = ((totalExpenses / safeIncome) * 50) + strainMultiplier;

  // Clamping 0 - 100%
  const finalFSS = Math.min(Math.max(rawFSS, 0), 100);

  return {
    fssValue: parseFloat(finalFSS.toFixed(1)),
    tierInfo: getFSSTier(finalFSS)
  };
}

function getFSSTier(fss) {
  if (fss <= 20) {
    return { tier: "Zona Aman", status: "Fresh Mind", errorRiskBonus: 0, color: "#22c55e" };
  } else if (fss <= 50) {
    return { tier: "Zona Waspada", status: "Stable", errorRiskBonus: 0, color: "#eab308" };
  } else if (fss <= 80) {
    return { tier: "Zona Krisis", status: "Clouded", errorRiskBonus: 0.20, color: "#f97316" };
  } else {
    return { tier: "Zona Bahaya", status: "Soul Fracture", errorRiskBonus: 0.50, color: "#ef4444" };
  }
}
