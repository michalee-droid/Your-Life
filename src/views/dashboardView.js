import { renderStatusBar } from '../components/statusBar.js';
import { renderWarningModal } from '../components/modal.js';
import { processMonthlyCycle } from '../engine/monthlyEngine.js';
import { triggerButtonEvent, applyChoiceImpact } from '../engine/eventEngine.js';
import { saveState } from '../state/storage.js';

export function renderDashboardView(gameState, eventsList, onStateUpdate) {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    ${renderStatusBar(gameState)}
    <div class="dashboard-body" style="padding: 2rem; max-width: 800px; margin: 0 auto; color: white;">
      <h2>Dashboard Utama</h2>
      <p>Kas Saat Ini: <strong>Rp ${gameState.finances.cash.toLocaleString('id-ID')}</strong></p>
      
      <div class="action-panel" style="display: flex; gap: 1rem; margin-top: 2rem;">
        <button id="btn-overtime" style="padding: 1rem; flex: 1;">Ambil Shift Lembur</button>
        <button id="btn-rest" style="padding: 1rem; flex: 1;">Istirahat & Meditasi</button>
        <button id="btn-next-month" style="padding: 1rem; flex: 1; background: #2563eb; color: white;">Proses Siklus Bulanan</button>
      </div>
    </div>
  `;

  // Listener: Aksi Lembur (dengan penanganan mitigasi jika Mental Clarity rendah)
  document.getElementById('btn-overtime').onclick = () => {
    const executeAction = () => {
      const triggeredEvent = triggerButtonEvent('btn_work_overtime', eventsList, gameState);
      if (triggeredEvent) {
        alert(`Event Terpicu: ${triggeredEvent.title}\n${triggeredEvent.description}`);
      } else {
        gameState.finances.cash += 250000;
        gameState.stats.fatigue = Math.min(gameState.stats.fatigue + 15, 100);
        saveState(gameState);
        onStateUpdate(gameState);
      }
    };

    if (gameState.stats.mental_clarity < 50) {
      renderWarningModal(
        "Pikiran Keruh (Mental Clarity < 50%)",
        "Mengambil lembur dalam kondisi ini meningkatkan risiko kesalahan fatal dan burnout parah. Yakin ingin melanjutkan?",
        executeAction
      );
    } else {
      executeAction();
    }
  };

  // Listener: Aksi Istirahat
  document.getElementById('btn-rest').onclick = () => {
    gameState.stats.fatigue = Math.max(gameState.stats.fatigue - 20, 0);
    gameState.stats.mental_clarity = Math.min(gameState.stats.mental_clarity + 15, 100);
    saveState(gameState);
    onStateUpdate(gameState);
  };

  // Listener: Siklus Bulanan
  document.getElementById('btn-next-month').onclick = () => {
    const { updatedState, report } = processMonthlyCycle(gameState);
    alert(report.warningMsg);
    saveState(updatedState);
    onStateUpdate(updatedState);
  };
}
