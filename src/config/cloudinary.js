// Konfigurasi Cloudinary
// Gantilah 'YOUR_CLOUD_NAME' dengan Nama Cloud milik Anda di Dashboard Cloudinary nanti.
const CLOUD_NAME = 'YOUR_CLOUD_NAME';

/**
 * Membuat URL Gambar Cloudinary yang teroptimasi secara otomatis.
 * @param {string} publicId - ID atau nama file gambar di Cloudinary
 * @returns {string} URL Gambar teroptimasi
 */
export function getCloudinaryUrl(publicId) {
    if (!publicId) return '';
    
    // f_auto = Otomatis pilih format paling ringan (WebP/AVIF)
    // q_auto = Otomatis sesuaikan kualitas tanpa mengurangi visual secara kasat mata
    const transformations = 'f_auto,q_auto,w_1080';
    
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
}
