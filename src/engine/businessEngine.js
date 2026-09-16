/**
 * Kalkulasi Hasil Bisnis Bulanan
 */
export function processBusinessYield(business, manager = null, isManual = false) {
  let profitMultiplier = 1.0;
  let fatigueCost = 0;
  let budgetLeakage = 0;

  if (isManual) {
    // Mode Manual: Profit maksimal (100%), tetapi menguras Fatigue pemain
    profitMultiplier = 1.0;
    fatigueCost = 20; 
  } else if (manager) {
    // Mode Delegasi: Tergantung Integritas Manajer
    const integrity = Math.min(Math.max(manager.integrity || 50, 0), 100);
    
    // Integritas rendah (di bawah 60) memicu kebocoran anggaran (Budget Leakage)
    if (integrity < 60) {
      const leakageRate = (60 - integrity) / 100; // Contoh: Integritas 40 -> Leakage 20%
      budgetLeakage = business.baseRevenue * leakageRate;
    }
    
    profitMultiplier = 0.85; // Efisiensi delegasi standar
  } else {
    // Tanpa Manajer & Tanpa Mode Manual -> Operasional lumpuh
    profitMultiplier = 0.2;
  }

  const grossRevenue = business.baseRevenue * profitMultiplier;
  const netProfit = Math.max(grossRevenue - business.operationalCost - budgetLeakage, 0);

  return {
    netProfit: Math.round(netProfit),
    budgetLeakage: Math.round(budgetLeakage),
    fatigueCost
  };
}
