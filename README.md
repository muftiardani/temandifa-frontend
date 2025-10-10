# TemanDifa Frontend

Selamat datang di repositori *frontend* untuk aplikasi seluler **TemanDifa**. Aplikasi ini dibangun menggunakan React Native dan Expo, dirancang sebagai serangkaian alat bantu canggih berbasis AI untuk penyandang disabilitas, dengan fokus pada aksesibilitas dan keandalan.

## ✨ Fitur Utama

  - **Deteksi Objek Real-time**: Menggunakan kamera untuk mengidentifikasi objek di sekitar pengguna dan memberikan *feedback* suara secara langsung.
  - **Pemindai Teks (OCR)**: Memungkinkan pengguna memindai dokumen melalui kamera atau mengunggah gambar dari galeri. Teks yang dihasilkan dapat didengarkan melalui fitur *Text-to-Speech*.
  - **Transkripsi Suara**: Merekam suara dan mengubahnya menjadi teks, berguna untuk komunikasi atau pencatatan cepat.
  - **Panggilan Video Darurat yang Andal**: Fitur panggilan video *real-time* menggunakan **Agora SDK**, terintegrasi dengan *backend* untuk manajemen sesi yang tangguh, notifikasi *push*, dan pemulihan sesi panggilan.
  - **Antarmuka yang Dapat Disesuaikan**: Mendukung tema terang dan gelap (`light/dark mode`) serta multibahasa (Indonesia & Inggris) untuk kenyamanan pengguna.
  - **Pelaporan Error Otomatis**: Terintegrasi dengan **Sentry** untuk pemantauan *crash* dan pelaporan *error* secara *real-time*, memastikan stabilitas aplikasi.

## 🛠️ Tumpukan Teknologi

| Komponen | Teknologi |
| --- | --- |
| **Framework** | [React Native](https://reactnative.dev/), [Expo](https://expo.dev/) |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) |
| **Navigasi** | [React Navigation](https://reactnavigation.org/) |
| **Manajemen State** | [Zustand](https://github.com/pmndrs/zustand) |
| **Panggilan Video** | [Agora SDK for React Native](https://www.agora.io/en/) |
| **Pengujian** | [Jest](https://jestjs.io/), [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/) |
| **Pemantauan Error** | [Sentry](https://sentry.io/) |
| **Internasionalisasi** | [i18next](https://www.i18next.com/) |

## 🚀 Memulai

Pastikan Anda sudah menyiapkan [backend TemanDifa](https://www.google.com/search?q=https://github.com/muftiardani/temandifa-backend) dan menjalankannya.

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
    Buat file `.env` di direktori utama proyek. File ini digunakan untuk menyimpan konfigurasi penting yang terhubung ke layanan eksternal dan *backend*.

    ```env
    # URL base dari backend TemanDifa
    EXPO_PUBLIC_API_BASE_URL=http://<IP_ADDRESS_LOCAL_ANDA>:3000/api

    # Kredensial dari Agora untuk fitur panggilan video
    EXPO_PUBLIC_AGORA_APP_ID=AGORA_APP_ID_ANDA

    # DSN untuk integrasi Sentry (Error Reporting)
    EXPO_PUBLIC_SENTRY_DSN=SENTRY_DSN_ANDA

    # Kredensial Google untuk Otentikasi
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=ID_KLIEN_WEB_GOOGLE_ANDA
    EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=ID_KLIEN_ANDROID_GOOGLE_ANDA
    EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=ID_KLIEN_IOS_GOOGLE_ANDA
    ```

4.  **Jalankan aplikasi:**

    ```bash
    npm start
    ```

    Pindai kode QR yang muncul menggunakan aplikasi Expo Go di perangkat Anda, atau jalankan di simulator (Android/iOS).

## 🏗️ Struktur Proyek

```
temandifa-frontend/
├── src/
│   ├── components/     # Komponen UI generik yang dapat digunakan kembali
│   ├── config/         # Konfigurasi aplikasi (URL API, kunci eksternal)
│   ├── constants/      # Nilai konstan (warna, durasi animasi)
│   ├── hooks/          # Custom hooks untuk logika bisnis (panggilan, kamera, audio)
│   ├── i18n/           # Konfigurasi dan file terjemahan (internasionalisasi)
│   ├── navigation/     # Pengaturan alur navigasi aplikasi (React Navigation)
│   ├── screens/        # Komponen untuk setiap layar aplikasi
│   ├── services/       # Logika untuk berinteraksi dengan API backend
│   ├── store/          # Manajemen state global (Zustand stores)
│   └── types/          # Definisi tipe TypeScript
├── App.tsx             # Titik masuk utama aplikasi
└── package.json        # Dependensi dan skrip proyek
```

## 🧪 Pengujian

Untuk menjalankan unit test dan memastikan semua komponen berfungsi seperti yang diharapkan, gunakan perintah:

```bash
npm test
```

Proyek ini menggunakan Jest dan React Native Testing Library untuk pengujian komponen UI dan logika aplikasi.

## 📦 Membangun Aplikasi untuk Produksi

Untuk membuat *file* aplikasi yang dapat diinstal (*standalone build*), proyek ini menggunakan Expo Application Services (EAS).

1.  **Login ke Akun Expo Anda:**

    ```bash
    npx eas login
    ```

2.  **Konfigurasi Proyek (jika belum):**

    ```bash
    npx eas build:configure
    ```

3.  **Mulai Proses Build:**
    Pilih platform yang diinginkan (`android` atau `ios`):

    ```bash
    # Untuk Android
    npx eas build --platform android

    # Untuk iOS (memerlukan akun Apple Developer)
    npx eas build --platform ios
    ```

    Ikuti instruksi yang muncul di terminal. Setelah selesai, Anda akan mendapatkan tautan untuk mengunduh *file* aplikasi Anda.