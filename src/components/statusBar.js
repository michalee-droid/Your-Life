/**
 * Komponen penyedia HTML untuk indikator status karakter
 */
export function renderStatusBar(stats) {
    return `
        <div class="status-container">
            <!-- Health -->
            <div class="stat-row">
                <span class="stat-label">❤️ Kesehatan</span>
                <div class="stat-bar-outer">
                    <div class="stat-bar-inner bg-health" style="width: ${stats.health}%;"></div>
                </div>
                <span class="stat-value">${stats.health}%</span>
            </div>

            <!-- Happiness -->
            <div class="stat-row">
                <span class="stat-label">😄 Kebahagiaan</span>
                <div class="stat-bar-outer">
                    <div class="stat-bar-inner bg-happiness" style="width: ${stats.happiness}%;"></div>
                </div>
                <span class="stat-value">${stats.happiness}%</span>
            </div>

            <!-- IQ -->
            <div class="stat-row">
                <span class="stat-label">🧠 Kecerdasan</span>
                <div class="stat-bar-outer">
                    <div class="stat-bar-inner bg-iq" style="width: ${stats.iq}%;"></div>
                </div>
                <span class="stat-value">${stats.iq}</span>
            </div>

            <!-- Physical -->
            <div class="stat-row">
                <span class="stat-label">💪 Fisik</span>
                <div class="stat-bar-outer">
                    <div class="stat-bar-inner bg-physical" style="width: ${stats.physical}%;"></div>
                </div>
                <span class="stat-value">${stats.physical}</span>
            </div>

            <!-- FSS (Financial Stability Score) -->
            <div class="stat-row">
                <span class="stat-label">🛡️ FSS Meter</span>
                <div class="stat-bar-outer">
                    <div class="stat-bar-inner bg-fss" style="width: ${stats.fss}%;"></div>
                </div>
                <span class="stat-value">${stats.fss}</span>
            </div>
        </div>
    `;
}
