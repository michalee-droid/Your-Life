export function renderWarningModal(title, message, onConfirm, onCancel) {
  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-overlay';
  modalContainer.style = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; z-index: 9999;';

  modalContainer.innerHTML = `
    <div class="modal-content" style="background: #1e1e1e; color: #fff; padding: 2rem; border-radius: 8px; max-width: 450px; border: 2px solid #ef4444; text-align: center;">
      <h3 style="color: #ef4444; margin-top: 0;">⚠️ PERINGATAN MITIGASI RISIKO</h3>
      <h4>${title}</h4>
      <p style="color: #ccc; font-size: 0.95rem;">${message}</p>
      <div style="display: flex; justify-content: space-around; margin-top: 1.5rem;">
        <button id="btn-modal-cancel" style="padding: 0.5rem 1rem; background: #4b5563; color: white; border: none; border-radius: 4px; cursor: pointer;">Batalkan Aksi</button>
        <button id="btn-modal-confirm" style="padding: 0.5rem 1rem; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;">Tetap Eksekusi (Risiko Tinggi)</button>
      </div>
    </div>
  `;

  document.body.appendChild(modalContainer);

  document.getElementById('btn-modal-cancel').onclick = () => {
    document.body.removeChild(modalContainer);
    if (onCancel) onCancel();
  };

  document.getElementById('btn-modal-confirm').onclick = () => {
    document.body.removeChild(modalContainer);
    if (onConfirm) onConfirm();
  };
}
