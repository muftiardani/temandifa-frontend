# TemanDifa Frontend

Selamat datang di repositori *frontend* untuk aplikasi seluler TemanDifa. Aplikasi ini dibangun menggunakan React Native dan Expo, dirancang khusus untuk memberikan serangkaian alat bantu berbasis AI bagi penyandang disabilitas.

## ✨ Fitur Utama

  - **Deteksi Objek Real-time**: Menggunakan kamera untuk mengidentifikasi objek di sekitar pengguna dan memberikan *feedback* suara.
  - **Pemindai Teks (OCR)**: Memungkinkan pengguna memindai dokumen melalui kamera atau mengunggah gambar dari galeri untuk diubah menjadi teks.
  - **Transkripsi Suara**: Merekam suara dan mengubahnya menjadi teks untuk kemudahan komunikasi atau pencatatan.
  - **Panggilan Video Darurat**: Fitur panggilan video terintegrasi menggunakan Agora untuk terhubung dengan kontak darurat secara cepat.
  - **Antarmuka yang Dapat Disesuaikan**: Mendukung tema terang dan gelap untuk kenyamanan visual pengguna.

## 🛠️ Tumpukan Teknologi

| Komponen | Teknologi |
| --- | --- |
| **Framework** | [React Native](https://reactnative.dev/), [Expo](https://expo.dev/) |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) |
| **Navigasi** | [React Navigation](https://reactnavigation.org/) |
| **Manajemen State** | [Zustand](https://github.com/pmndrs/zustand) |
| **Panggilan Video** | [Agora SDK](https://www.agora.io/en/) |
| **Pengujian** | [Jest](https://jestjs.io/), [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/) |

## 📋 Prasyarat

  - [Node.js](https://nodejs.org/en/) (v18 atau lebih baru)
  - [Expo CLI](https://docs.expo.dev/get-started/installation/)
  - Perangkat seluler dengan aplikasi Expo Go atau simulator (Android Studio / Xcode)

## 🚀 Memulai

1.  **Clone repositori ini:**

    ```bash
    git clone https://github.com/muftiardani/temandifa-frontend.git
    cd temandifa-frontend
    ```

2.  **Instal dependensi:**

    ```bash
    npm install
    ```

3.  **Konfigurasi Variabel Lingkungan:**
    Buat file `.env` di direktori utama proyek dan isi dengan variabel yang diperlukan. File ini akan digunakan untuk menyimpan konfigurasi seperti URL API backend dan kredensial layanan pihak ketiga.

    ```env
    # URL base dari backend TemanDifa
    API_BASE_URL=http://localhost:3000/api/v1

    # Kredensial dari Agora untuk fitur panggilan video
    AGORA_APP_ID=AGORA_APP_ID_ANDA
    AGORA_CHANNEL_NAME=NAMA_CHANNEL_ANDA
    AGORA_TOKEN=TOKEN_AGORA_ANDA
    ```

4.  **Jalankan aplikasi:**

    ```bash
    npm start
    ```

    Pindai kode QR yang muncul menggunakan aplikasi Expo Go di perangkat Anda, atau jalankan di simulator.

## 🏗️ Struktur Proyek

```
temandifa-frontend/
├── src/
│   ├── components/     # Komponen UI yang dapat digunakan kembali
│   ├── config/         # Konfigurasi aplikasi (URL API, dll.)
│   ├── constants/      # Nilai konstan (warna, string, gaya)
│   ├── navigation/     # Pengaturan alur navigasi aplikasi
│   ├── screens/        # Komponen untuk setiap layar aplikasi
│   ├── services/       # Logika untuk berinteraksi dengan API
│   ├── store/          # Manajemen state global (Zustand)
│   └── types/          # Definisi tipe TypeScript
├── App.tsx             # Titik masuk utama aplikasi
└── package.json        # Dependensi dan skrip proyek
```

## 🧪 Pengujian

Untuk menjalankan unit test dan memastikan semua komponen berfungsi seperti yang diharapkan, gunakan perintah:

```bash
npm test
```

Proyek ini menggunakan Jest dan React Native Testing Library untuk pengujian.