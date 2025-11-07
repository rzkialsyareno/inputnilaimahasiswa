/**
 * Fungsi untuk validasi input form
 * @returns {Object} { isValid: boolean, data: object, message: string }
 */
function validasiInput() {
  // Ambil nilai dari form
  const namaLengkap = document.getElementById("namaLengkap").value.trim();
  const nim = document.getElementById("nim").value.trim();
  const mataKuliah = document.getElementById("mataKuliah").value;
  const nilaiMahasiswa = parseFloat(
    document.getElementById("nilaiMahasiswa").value
  );

  // Validasi: Cek apakah semua field terisi
  if (!namaLengkap || !nim || !mataKuliah || isNaN(nilaiMahasiswa)) {
    return {
      isValid: false,
      data: null,
      message: "Semua field harus diisi dengan benar!",
    };
  }

  // Validasi: Cek format NIM (harus angka dan minimal 8 digit)
  if (!/^\d{8,}$/.test(nim)) {
    return {
      isValid: false,
      data: null,
      message: "NIM harus berupa angka minimal 8 digit!",
    };
  }

  // Validasi: Cek range nilai (0-100)
  if (nilaiMahasiswa < 0 || nilaiMahasiswa > 100) {
    return {
      isValid: false,
      data: null,
      message: "Nilai harus antara 0 sampai 100!",
    };
  }

  // Jika semua validasi lolos
  return {
    isValid: true,
    data: {
      namaLengkap: namaLengkap,
      nim: nim,
      mataKuliah: mataKuliah,
      nilai: nilaiMahasiswa,
      timestamp: new Date().toISOString(),
    },
    message: "Validasi berhasil!",
  };
}

/**
 * Fungsi untuk menyimpan data ke database (sementara ke localStorage)
 * @param {Object} data - Data yang akan disimpan
 * @returns {Promise<boolean>} - Status keberhasilan penyimpanan
 */
async function simpanData(data) {
  try {
    // Simulasi delay untuk async operation
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Ambil data existing dari localStorage
    let dataNilai = JSON.parse(localStorage.getItem("dataNilai")) || [];

    // Tambahkan data baru
    dataNilai.push(data);

    // Simpan kembali ke localStorage
    localStorage.setItem("dataNilai", JSON.stringify(dataNilai));

    return true;
  } catch (error) {
    console.error("Error saat menyimpan data:", error);
    return false;
  }
}

/**
 * Fungsi untuk mengambil dan menampilkan data dari database
 * @returns {Promise<Array>} - Array berisi data nilai
 */
async function loadData() {
  try {
    // Simulasi delay untuk async operation
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Ambil data dari localStorage
    const dataNilai = JSON.parse(localStorage.getItem("dataNilai")) || [];

    return dataNilai;
  } catch (error) {
    console.error("Error saat memuat data:", error);
    return [];
  }
}

/**
 * Fungsi untuk menampilkan alert/notifikasi
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
 * Fungsi untuk me-render data ke tabel
 * @param {Array} data - Array data nilai yang akan ditampilkan
 */
function renderTabel(data) {
  const tabelBody = document.getElementById("tabelNilai");

  if (!tabelBody) return;

  if (data.length === 0) {
    tabelBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    Belum ada data nilai mahasiswa
                </td>
            </tr>
        `;
    return;
  }

  let html = "";
  data.forEach((item, index) => {
    // Ambil nama mata kuliah dari kode
    const namaMK = item.mataKuliah.split(" - ")[1] || item.mataKuliah;

    html += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.namaLengkap}</td>
                <td>${item.nim}</td>
                <td>${namaMK}</td>
                <td><span class="badge bg-primary">${item.nilai}</span></td>
            </tr>
        `;
  });

  tabelBody.innerHTML = html;
}

/**
 * Fungsi untuk reset form
 */
function resetForm() {
  document.getElementById("formInputNilai").reset();
}

// Event Listener untuk Form Submit (hanya di halaman index.html)
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formInputNilai");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // 1. Validasi input
      const validasi = validasiInput();

      if (!validasi.isValid) {
        tampilkanAlert(validasi.message, "danger");
        return;
      }

      // 2. Simpan data
      const berhasil = await simpanData(validasi.data);

      if (berhasil) {
        tampilkanAlert("Data nilai berhasil disimpan!", "success");
        resetForm();
      } else {
        tampilkanAlert("Gagal menyimpan data. Silakan coba lagi.", "danger");
      }
    });
  }

  // Load data untuk halaman lihat-data.html
  const tabelNilai = document.getElementById("tabelNilai");

  if (tabelNilai) {
    loadData()
      .then((data) => {
        renderTabel(data);

        // Tampilkan alert sukses jika ada data
        if (data.length > 0) {
          tampilkanAlert(
            `Berhasil memuat ${data.length} data nilai mahasiswa`,
            "success"
          );
        } else {
          tampilkanAlert(
            "Belum ada data nilai. Silakan tambahkan data terlebih dahulu.",
            "info"
          );
        }
      })
      .catch((error) => {
        tampilkanAlert("Gagal memuat data. Silakan refresh halaman.", "danger");
        console.error("Error loading data:", error);
      });
  }
});
