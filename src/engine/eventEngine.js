/**
 * Pemicu Event Acak & Eksekusi Dampak Pilihan
 */
export function triggerButtonEvent(buttonId, eventsList, gameState) {
  const { stats } = gameState;

  // Filter event sesuai syarat tombol dan kondisi karakter
  const eligibleEvents = eventsList.filter(evt => {
    if (evt.trigger_button !== buttonId) return false;
    if (evt.conditions?.min_fatigue && stats.fatigue < evt.conditions.min_fatigue) return false;
    if (evt.conditions?.max_mental_clarity && stats.mental_clarity > evt.conditions.max_mental_clarity) return false;
    return true;
  });

  if (eligibleEvents.length === 0) return null;

  // Pilih satu event yang lolos kualifikasi secara acak
  const selectedEvent = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
  
  // Roll Probability
  const roll = Math.random();
  return roll <= selectedEvent.trigger_chance ? selectedEvent : null;
}

/**
 * Mengaplikasikan Dampak Pilihan dengan Safety Clamping (0 - 100)
 */
export function applyChoiceImpact(currentState, impact) {
  const updatedStats = { ...currentState.stats };
  const updatedFinances = { ...currentState.finances };

  // Update Stats (0 - 100 Guard)
  ['health', 'fatigue', 'willpower', 'mental_clarity'].forEach(statKey => {
    if (impact[statKey] !== undefined) {
      const newValue = updatedStats[statKey] + impact[statKey];
      updatedStats[statKey] = Math.min(Math.max(newValue, 0), 100);
    }
  });

  // Update Financials
  if (impact.money !== undefined) {
    updatedFinances.cash += impact.money;
  }

  return {
    ...currentState,
    stats: updatedStats,
    finances: updatedFinances
  };
}
