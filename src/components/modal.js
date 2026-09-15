/**
 * Komponen Modal Dialog Universal
 */

let modalElement = null;

/**
 * Inisialisasi wadah modal ke DOM
 */
export function initModal() {
    // Cegah duplikasi jika modal sudah terpasang
    if (document.getElementById('modal-overlay')) return;

    const gameContainer = document.getElementById('game-container');
    const modalHTML = `
        <div id="modal-overlay" class="modal-overlay">
            <div class="modal-box">
                <div class="modal-header">
                    <h3 id="modal-title" class="modal-title">Peristiwa Baru</h3>
                </div>
                <p id="modal-description" class="modal-description"></p>
                <div id="modal-choices" class="modal-choices"></div>
            </div>
        </div>
    `;

    gameContainer.insertAdjacentHTML('beforeend', modalHTML);
    modalElement = document.getElementById('modal-overlay');
}

/**
 * Menampilkan Pop-up Modal Event
 * @param {Object} eventData - Data event berisi title, description, dan choices
 * @param {Function} onSelectChoice - Callback saat pemain memilih opsi
 */
export function showModal(eventData, onSelectChoice) {
    if (!modalElement) initModal();

    const titleEl = document.getElementById('modal-title');
    const descEl = document.getElementById('modal-description');
    const choicesEl = document.getElementById('modal-choices');

    titleEl.textContent = eventData.title;
    descEl.textContent = eventData.description;

    // Bersihkan opsi lama
    choicesEl.innerHTML = '';

    // Render daftar opsi pilihan
    eventData.choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice.text;

        btn.addEventListener('click', () => {
            hideModal();
            onSelectChoice(choice);
        });

        choicesEl.appendChild(btn);
    });

    modalElement.classList.add('active');
}

/**
 * Menyembunyikan Pop-up Modal
 */
export function hideModal() {
    if (modalElement) {
        modalElement.classList.remove('active');
    }
}
