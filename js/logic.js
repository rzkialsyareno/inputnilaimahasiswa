// Import Firebase modules
import {
  db,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "./firebase-config.js";

/**
 * FUNGSI 1: VALIDASI INPUT
 * Fungsi untuk validasi input form
 *
 * Proses validasi:
 * - Memeriksa apakah semua field terisi
 * - Memvalidasi format NIM (harus angka minimal 8 digit)
 * - Memvalidasi range nilai (0-100)
 *
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

  // Jika semua validasi lolos, return data yang valid
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
 * FUNGSI 2: SIMPAN DATA
 * Fungsi untuk menyimpan data ke Firebase Firestore
 *
 * Proses:
 * - Menerima data yang sudah tervalidasi
 * - Menyimpan ke collection "nilaimahasiswa" di Firestore
 * - Menambahkan timestamp otomatis dari server
 *
 * @param {Object} data - Data yang akan disimpan (hasil dari validasiInput)
 * @returns {Promise<boolean>} - Status keberhasilan penyimpanan (true/false)
 */
async function simpanData(data) {
  try {
    // Simpan ke Firebase Firestore collection "nilaimahasiswa"
    const docRef = await addDoc(collection(db, "nilaimahasiswa"), {
      nim: data.nim,
      nama: data.namaLengkap,
      mataKuliah: data.mataKuliah,
      nilai: data.nilai,
      timestamp: serverTimestamp(), // Timestamp otomatis dari server Firebase
    });

    console.log("✅ Data berhasil disimpan dengan ID:", docRef.id);
    return true; // Return true jika berhasil
  } catch (error) {
    console.error("❌ Error saat menyimpan data ke Firebase:", error);
    return false; // Return false jika gagal
  }
}

/**
 * FUNGSI 3: LOAD DATA
 * Fungsi untuk mengambil dan menampilkan data dari Firebase Firestore
 *
 * Proses:
 * - Mengambil semua dokumen dari collection "nilaimahasiswa"
 * - Mengkonversi data Firestore menjadi array JavaScript
 * - Mengembalikan array data untuk ditampilkan di UI
 *
 * @returns {Promise<Array>} - Array berisi data nilai mahasiswa
 */
async function loadData() {
  try {
    // Ambil data dari Firebase Firestore collection "nilaimahasiswa"
    const querySnapshot = await getDocs(collection(db, "nilaimahasiswa"));

    const dataNilai = [];

    // Loop setiap dokumen dan tambahkan ke array
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      dataNilai.push({
        id: doc.id, // Document ID dari Firestore
        namaLengkap: data.nama,
        nim: data.nim,
        mataKuliah: data.mataKuliah,
        nilai: data.nilai,
        timestamp: data.timestamp,
      });
    });

    console.log(
      "✅ Data berhasil dimuat dari Firebase:",
      dataNilai.length,
      "dokumen"
    );
    return dataNilai; // Return array data
  } catch (error) {
    console.error("❌ Error saat memuat data dari Firebase:", error);
    return []; // Return array kosong jika gagal
  }
}

// Export fungsi-fungsi utama untuk digunakan di file lain
export { validasiInput, simpanData, loadData };
