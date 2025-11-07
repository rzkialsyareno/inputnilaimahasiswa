// Import fungsi dari logic.js
import { validasiInput, simpanData, loadData } from "./logic.js";

// ========== PAGINATION STATE ==========
let currentPage = 1;
let itemsPerPage = 10;
let allData = [];

/**
 * Fungsi untuk menampilkan alert/notifikasi di kanan atas
 * @param {string} message - Pesan yang akan ditampilkan
 * @param {string} type - Tipe alert (success, danger, warning, info)
 */
function tampilkanAlert(message, type = "info") {
  const alertContainer = document.getElementById("alertContainer");

  // Icon untuk setiap tipe alert
  const icons = {
    success: '<i class="bi bi-check-circle-fill"></i>',
    danger: '<i class="bi bi-exclamation-circle-fill"></i>',
    warning: '<i class="bi bi-exclamation-triangle-fill"></i>',
    info: '<i class="bi bi-info-circle-fill"></i>',
  };

  const titles = {
    success: "Berhasil!",
    danger: "Error!",
    warning: "Peringatan!",
    info: "Info:",
  };

  const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${icons[type]} <strong>${titles[type]}</strong> ${message}
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

  alertContainer.innerHTML = alertHTML;

  // Auto hide alert setelah 5 detik
  setTimeout(() => {
    const alert = alertContainer.querySelector(".alert");
    if (alert) {
      alert.classList.remove("show");
      setTimeout(() => {
        alertContainer.innerHTML = "";
      }, 300);
    }
  }, 5000);
}

/**
 * Fungsi untuk me-render data ke tabel dengan pagination
 * @param {Array} data - Array data nilai yang akan ditampilkan
 * @param {number} page - Halaman yang aktif
 */
function renderTabel(data, page = 1) {
  const tabelBody = document.getElementById("tabelNilai");

  if (!tabelBody) return;

  allData = data;
  currentPage = page;

  if (data.length === 0) {
    tabelBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    Belum ada data nilai mahasiswa
                </td>
            </tr>
        `;
    const paginationContainer = document.getElementById("paginationContainer");
    if (paginationContainer) paginationContainer.innerHTML = "";
    return;
  }

  // Calculate pagination
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  // Render table rows
  let html = "";
  paginatedData.forEach((item, index) => {
    // Ambil nama mata kuliah
    const namaMK = item.mataKuliah.split(" - ")[1] || item.mataKuliah;
    const globalIndex = startIndex + index + 1;

    html += `
            <tr>
                <td>${globalIndex}</td>
                <td>${item.namaLengkap}</td>
                <td>${item.nim}</td>
                <td>${namaMK}</td>
                <td><span class="badge bg-primary">${item.nilai}</span></td>
            </tr>
        `;
  });

  tabelBody.innerHTML = html;

  // Render pagination
  renderPagination(data.length, page);
}

/**
 * Fungsi untuk me-render pagination controls
 * @param {number} totalItems - Total jumlah data
 * @param {number} currentPage - Halaman yang aktif
 */
function renderPagination(totalItems, currentPage) {
  const paginationContainer = document.getElementById("paginationContainer");

  if (!paginationContainer) return;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let paginationHTML = "";

  // Previous button
  paginationHTML += `
    <button onclick="changePage(${currentPage - 1})" ${
    currentPage === 1 ? "disabled" : ""
  }>
      <i class="bi bi-chevron-left"></i>
    </button>
  `;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      paginationHTML += `
        <button onclick="changePage(${i})" class="${
        i === currentPage ? "active" : ""
      }">
          ${i}
        </button>
      `;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      paginationHTML += `<span class="pagination-info">...</span>`;
    }
  }

  // Next button
  paginationHTML += `
    <button onclick="changePage(${currentPage + 1})" ${
    currentPage === totalPages ? "disabled" : ""
  }>
      <i class="bi bi-chevron-right"></i>
    </button>
  `;

  paginationContainer.innerHTML = paginationHTML;
}

/**
 * Fungsi untuk mengubah halaman pagination
 * @param {number} page - Halaman yang akan ditampilkan
 */
window.changePage = function (page) {
  if (page < 1 || page > Math.ceil(allData.length / itemsPerPage)) return;
  renderTabel(allData, page);
};

/**
 * Fungsi untuk reset form input
 */
function resetForm() {
  document.getElementById("formInputNilai").reset();
}

// ========== EVENT LISTENERS ==========
document.addEventListener("DOMContentLoaded", function () {
  // Event Listener untuk Form Submit (halaman index.html)
  const form = document.getElementById("formInputNilai");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // STEP 1: Validasi input terlebih dahulu
      const validasi = validasiInput();

      if (!validasi.isValid) {
        // Jika validasi gagal, tampilkan pesan error
        tampilkanAlert(validasi.message, "danger");
        return;
      }

      // STEP 2: Jika validasi berhasil, lanjut simpan data
      const berhasil = await simpanData(validasi.data);

      if (berhasil) {
        // STEP 3: Jika penyimpanan berhasil, tampilkan alert sukses dan reset form
        tampilkanAlert("Data nilai berhasil disimpan!", "success");
        resetForm();
      } else {
        // Jika penyimpanan gagal, tampilkan pesan error
        tampilkanAlert("Gagal menyimpan data. Silakan coba lagi.", "danger");
      }
    });
  }

  // Event Listener untuk halaman lihat-data.html
  const tabelNilai = document.getElementById("tabelNilai");

  if (tabelNilai) {
    // Load data dari database dan tampilkan ke tabel
    loadData()
      .then((data) => {
        renderTabel(data);

        // Update total data di info badge
        const totalDataElement = document.getElementById("totalData");
        if (totalDataElement) {
          totalDataElement.textContent = data.length;
        }
      })
      .catch((error) => {
        tampilkanAlert("Gagal memuat data. Silakan refresh halaman.", "danger");
        console.error("Error loading data:", error);
      });
  }
});

// Export fungsi yang diperlukan
export { tampilkanAlert, renderTabel };
