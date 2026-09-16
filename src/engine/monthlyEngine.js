/**
 * Eksekusi Siklus Bulanan & Auto-Debit
 */
export function processMonthlyCycle(gameState) {
  const { finances, stats, properties = [], businesses = [] } = gameState;

  // 1. Hitung Total Pemeliharaan & Pajak Properti
  const propertyMaintenance = properties.reduce((sum, prop) => sum + (prop.maintenanceCost || 0), 0);
  const propertyTax = properties.reduce((sum, prop) => sum + (prop.taxAmount || 0), 0);

  // 2. Hitung Total Pengeluaran Wajib Bulanan
  const totalExpenses = 
    finances.mandatory_expenses + 
    finances.debt_installment + 
    propertyMaintenance + 
    propertyTax;

  // 3. Hitung Pendapatan Bersih (Gaji + Hasil Bisnis)
  const businessProfit = businesses.reduce((sum, biz) => sum + (biz.lastMonthlyProfit || 0), 0);
  const totalIncome = finances.net_income + businessProfit;

  // 4. Update Saldo Kas
  const newCash = finances.cash + totalIncome - totalExpenses;
  const isLiquidityShortfall = newCash < 0;

  return {
    updatedState: {
      ...gameState,
      finances: {
        ...finances,
        cash: newCash
      }
    },
    report: {
      totalIncome,
      totalExpenses,
      netChange: totalIncome - totalExpenses,
      isLiquidityShortfall,
      warningMsg: isLiquidityShortfall ? "PERINGATAN: Kas Anda minus! Risiko disita/bangkrut!" : "Siklus bulanan berhasil diproses."
    }
  };
}
