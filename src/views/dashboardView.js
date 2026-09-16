import { renderStatusBar } from '../components/statusBar.js';
import { renderWarningModal } from '../components/modal.js';
import { processMonthlyCycle } from '../engine/monthlyEngine.js';
import { triggerButtonEvent } from '../engine/eventEngine.js';
import { saveState } from '../state/storage.js';

export function renderDashboardView(gameState = {}, eventsList = [], onStateUpdate = null) {
  const app = document.getElementById('app');
  
  // Safety Guard: Nilai standar jika data finances atau stats bernilai null/undefined
  const safeState = {
    ...gameState,
    stats: {
      health: 100,
      fatigue: 0,
      willpower: 100,
      mental_clarity: 100,
      ...(gameState?.stats || {})
    },
    finances: {
      cash: 0,
      mandatory_expenses: 0,
      debt_installment: 0,
      net_income: 0,
      fss: 0,
      ...(gameState?.finances || {})
    }
  };

  const currentCash = Number(safeState.finances.cash || 0);

  app.innerHTML = `
    ${renderStatusBar(safeState)}
    <div class="dashboard-body" style="padding: 2rem; max-width: 800px; margin: 0 auto; color: white;">
      <h2>Dashboard Utama</h2>
      <p>Kas Saat Ini: <strong>Rp ${currentCash.toLocaleString('id-ID')}</strong></p>
      
      <div class="action-panel" style="display: flex; gap: 1rem; margin-top: 2rem;">
        <button id="btn-overtime" style="padding: 1rem; flex: 1;">Ambil Shift Lembur</button>
        <button id="btn-rest" style="padding: 1rem; flex: 1;">Istirahat & Meditasi</button>
        <button id="btn-next-month" style="padding: 1rem; flex: 1; background: #2563eb; color: white;">Proses Siklus Bulanan</button>
      </div>
    </div>
  `;

  // Helper fungsi update aman
  const handleStateChange = (newState) => {
    saveState(newState);
    if (typeof onStateUpdate === 'function') {
      onStateUpdate(newState);
    } else {
      renderDashboardView(newState, eventsList, onStateUpdate);
    }
  };

  // Listener: Aksi Lembur
  document.getElementById('btn-overtime').onclick = () => {
    const executeAction = () => {
      const triggeredEvent = triggerButtonEvent('btn_work_overtime', eventsList || [], safeState);
      if (triggeredEvent) {
        alert(`Event Terpicu: ${triggeredEvent.title}\n${triggeredEvent.description}`);
      } else {
        safeState.finances.cash = (safeState.finances.cash || 0) + 250000;
        safeState.stats.fatigue = Math.min((safeState.stats.fatigue || 0) + 15, 100);
        handleStateChange(safeState);
      }
    };

    if ((safeState.stats.mental_clarity || 0) < 50) {
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
    safeState.stats.fatigue = Math.max((safeState.stats.fatigue || 0) - 20, 0);
    safeState.stats.mental_clarity = Math.min((safeState.stats.mental_clarity || 0) + 15, 100);
    handleStateChange(safeState);
  };

  // Listener: Siklus Bulanan
  document.getElementById('btn-next-month').onclick = () => {
    const { updatedState, report } = processMonthlyCycle(safeState);
    alert(report.warningMsg);
    handleStateChange(updatedState);
  };
}
