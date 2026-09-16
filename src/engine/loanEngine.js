/**
 * Engine Pinjaman & Perhitungan Bunga
 */
export const LOAN_TYPES = {
  BANK: { id: 'bank', name: 'Bank Formal', monthlyRate: 0.10, maxTenor: 12 },
  LOAN_SHARK: { id: 'loan_shark', name: 'World Underworld', monthlyRate: 0.25, maxTenor: 3 }
};

export function calculateLoanDetails(principal, loanTypeKey, tenorMonths) {
  const loanType = LOAN_TYPES[loanTypeKey] || LOAN_TYPES.BANK;
  
  // Formula: Total = Principal * (1 + (Rate * Tenor))
  const totalRepayment = principal * (1 + (loanType.monthlyRate * tenorMonths));
  const monthlyInstallment = totalRepayment / tenorMonths;

  return {
    principal,
    totalRepayment: Math.round(totalRepayment),
    monthlyInstallment: Math.round(monthlyInstallment),
    monthlyRatePercentage: loanType.monthlyRate * 100,
    tenorMonths
  };
}

// Penalti Keterlambatan (Bunga Berkelanjutan)
export function applyLatePenalty(loanData) {
  const penaltyRate = 0.05; // Denda 5% per periode terlambat
  const penaltyAmount = loanData.remainingAmount * penaltyRate;
  
  return {
    ...loanData,
    remainingAmount: Math.round(loanData.remainingAmount + penaltyAmount),
    penaltyApplied: penaltyAmount
  };
}
