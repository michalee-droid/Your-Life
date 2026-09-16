let isMenuExpanded = false;

export function renderBottomNav(activeTab, state, onTabChange) {
    const age = state.profile.age;
    const isOrphan = state.parents && !state.parents.isAlive;

    // Poin 2 & 4: Syarat pembukaan modul
    const canAccessEdu = age >= 6;
    const canAccessJob = age >= 6 || (isOrphan && age >= 5); // Pekerjaan informal buka di umur 6 (atau 5 jika yatim piatu)
    const canAccessAsset = age >= 17;
    const canAccessFinance = age >= 6;

    const navHTML = `
        <div style="position: fixed; bottom: 15px; right: 15px; z-index: 999; display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
            <!-- Sub-Tombol Menu (Muncul jika Menu Utama ditekan) -->
            <div id="sub-menu-container" style="display: ${isMenuExpanded ? 'flex' : 'none'}; flex-direction: column; gap: 6px; background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(255,255,255,0.1); padding: 10px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                <button class="card-btn ${activeTab === 'dashboard' ? 'btn-danger' : ''}" data-tab="dashboard">🏠 Utama</button>
                ${canAccessEdu ? `<button class="card-btn ${activeTab === 'education' ? 'btn-danger' : ''}" data-tab="education">🎓 Pendidikan</button>` : ''}
                ${canAccessJob ? `<button class="card-btn ${activeTab === 'job' ? 'btn-danger' : ''}" data-tab="job">💼 Pekerjaan</button>` : ''}
                ${canAccessAsset ? `<button class="card-btn ${activeTab === 'asset' ? 'btn-danger' : ''}" data-tab="asset">🏛️ Aset</button>` : ''}
                ${canAccessFinance ? `<button class="card-btn ${activeTab === 'finance' ? 'btn-danger' : ''}" data-tab="finance">💳 Keuangan</button>` : ''}
                <button class="card-btn ${activeTab === 'relationship' ? 'btn-danger' : ''}" data-tab="relationship">🤝 Relasi</button>
            </div>

            <!-- Tombol Utama Pengendali Navigasi -->
            <button id="btn-toggle-main-menu" style="width: 50px; height: 50px; border-radius: 50%; background: #38bdf8; color: #0f172a; border: none; font-size: 1.4rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.4);">
                ${isMenuExpanded ? '✕' : '☰'}
            </button>
        </div>
    `;

    setTimeout(() => {
        const toggleBtn = document.getElementById('btn-toggle-main-menu');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                isMenuExpanded = !isMenuExpanded;
                if (onTabChange) onTabChange(activeTab); // Re-render menu toggle state
            });
        }

        document.querySelectorAll('#sub-menu-container button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.getAttribute('data-tab');
                isMenuExpanded = false;
                if (onTabChange) onTabChange(targetTab);
            });
        });
    }, 0);

    return navHTML;
}
