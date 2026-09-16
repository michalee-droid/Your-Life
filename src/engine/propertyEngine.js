/**
 * Kalkulator Recovery Buffs Tempat Tinggal & Fasilitas
 */
export function calculateHousingBuffs(activeProperty) {
  if (!activeProperty) {
    // Default jika tidak punya properti (sewa kamar standar)
    return { fatigueRecoveryBonus: 5, mentalClarityBonus: 2 };
  }

  let totalFatigueBonus = activeProperty.baseFatigueRecovery || 10;
  let totalClarityBonus = activeProperty.baseClarityRecovery || 5;

  // Akumulasi Buff dari Fasilitas Terpasang (Server Rig, Gym, Ruang Meditasi, Vault)
  if (activeProperty.installedFacilities && Array.isArray(activeProperty.installedFacilities)) {
    activeProperty.installedFacilities.forEach(facility => {
      totalFatigueBonus += facility.fatigueBuff || 0;
      totalClarityBonus += facility.clarityBuff || 0;
    });
  }

  return {
    fatigueRecoveryBonus: totalFatigueBonus,
    mentalClarityBonus: totalClarityBonus
  };
}
