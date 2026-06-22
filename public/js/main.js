// Mobile menu toggle
document.getElementById('mobile-menu-btn').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});

// Fetch berita untuk landing page
async function loadBerita() {
  try {
    const res = await fetch('/api/berita');
    const berita = await res.json();
    const container = document.getElementById('berita-container');
    if (!container) return;

    // Ambil 3 berita terbaru
    const latest = berita.slice(0, 3);
    container.innerHTML = latest.map(item => `
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden card-hover">
        <div class="p-6">
          <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">${item.kategori}</span>
          <h3 class="text-lg font-bold mt-3 mb-2 text-gray-800">${item.judul}</h3>
          <p class="text-gray-600 text-sm">${item.konten.substring(0, 100)}...</p>
          <a href="/berita.html?id=${item.id}" class="mt-4 inline-block text-blue-600 font-medium text-sm hover:underline">Baca selengkapnya →</a>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Gagal memuat berita', err);
  }
}

document.addEventListener('DOMContentLoaded', loadBerita);
