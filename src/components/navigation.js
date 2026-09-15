/**
 * Merender Bottom Navigation Bar
 */
export function renderBottomNav(activeTab, onTabChange) {
    const navHTML = `
        <nav class="bottom-nav">
            <button class="nav-item ${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
                <span class="nav-icon">🏠</span>
                <span>Utama</span>
            </button>
            <button class="nav-item ${activeTab === 'education' ? 'active' : ''}" data-tab="education">
                <span class="nav-icon">🎓</span>
                <span>Pendidikan</span>
            </button>
            <button class="nav-item ${activeTab === 'job' ? 'active' : ''}" data-tab="job">
                <span class="nav-icon">💼</span>
                <span>Pekerjaan</span>
            </button>
        </nav>
    `;

    // Pasang Event Listener setelah elemen dimasukkan
    setTimeout(() => {
        document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.getAttribute('data-tab');
                if (onTabChange) onTabChange(targetTab);
            });
        });
    }, 0);

    return navHTML;
}
