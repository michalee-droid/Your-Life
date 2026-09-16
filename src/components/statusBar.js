import { calculateFSS } from '../engine/fssEngine.js';

export function renderStatusBar(gameState) {
  const { stats, finances } = gameState;
  const fssData = calculateFSS(finances);

  return `
    <div class="status-bar-container" style="display: flex; gap: 1rem; padding: 1rem; background: rgba(0,0,0,0.8); color: white; border-bottom: 2px solid #333;">
      <div class="stat-item">
        <span>❤️ Health: <strong>${stats.health}%</strong></span>
      </div>
      <div class="stat-item">
        <span>⚡ Fatigue: <strong>${stats.fatigue}%</strong></span>
      </div>
      <div class="stat-item">
        <span>🧠 Mental Clarity: <strong>${stats.mental_clarity}%</strong></span>
      </div>
      <div class="stat-item">
        <span>🔥 Willpower: <strong>${stats.willpower}%</strong></span>
      </div>
      <div class="stat-item" style="margin-left: auto;">
        <span>📊 FSS: <strong style="color: ${fssData.tierInfo.color}">${fssData.fssValue}% (${fssData.tierInfo.tier})</strong></span>
      </div>
    </div>
  `;
}
