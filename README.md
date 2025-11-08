# EduTest+ : Platform Simulasi Tes & Kelas Premium

EduTest+ adalah platform aplikasi web modern yang dirancang untuk simulasi tes online dan penyediaan kelas premium. Aplikasi ini dibangun dengan arsitektur yang terpisah antara backend dan frontend, menggunakan Go untuk performa di sisi server dan React untuk antarmuka pengguna yang interaktif.

## Tumpukan Teknologi (Tech Stack)

Arsitektur proyek dibagi menjadi dua komponen utama:

### Backend (Go)

Dibangun menggunakan **Go (Golang)** dengan fokus pada performa, konkurensi, dan keterbacaan kode.

| Kategori | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | **Fiber** | Framework web ekspresif yang terinspirasi oleh Express.js, dibangun di atas Fasthttp. |
| **Database** | **MySQL** | Sistem manajemen basis data relasional untuk menyimpan data utama. |
| **ORM** | **GORM** | Toolkit ORM yang ramah developer untuk Go. |
| **Caching & Sesi** | **Redis** | Digunakan untuk menyimpan cache dan mengelola token sesi (refresh token). |
| **Autentikasi** | **JWT** | Menggunakan JSON Web Tokens (JWT) yang disimpan dalam *httpOnly cookies* untuk keamanan. |
| **Validasi** | `validator/v10` | Untuk validasi struct pada request body yang masuk. |
| **Kontainerisasi** | **Docker** | Dikonfigurasi dengan `docker-compose.yml` untuk lingkungan pengembangan yang konsisten. |

### Frontend (React)

Dibangun menggunakan **React** dengan **Vite** untuk pengalaman pengembangan yang cepat dan modern.

| Kategori | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | **React 19** | Library utama untuk membangun antarmuka pengguna. |
| **UI Components** | **shadcn/ui** & **Radix UI** | Kumpulan komponen UI yang dapat disesuaikan dan aksesibel. |
| **Styling** | **Tailwind CSS** | Framework CSS utility-first untuk desain yang cepat dan kustom. |
| **Routing** | **React Router DOM** | Untuk navigasi dan routing di sisi klien. |
| **Data Fetching** | **Axios** | Klien HTTP berbasis promise untuk berinteraksi dengan API Backend. |
| **Notifikasi** | **Sonner** | Pustaka untuk menampilkan notifikasi (toast) yang elegan. |

---

## Alur Utama Website

Aplikasi ini memiliki dua alur utama yang saling terhubung: alur untuk **Pengguna (Siswa)** dan alur untuk **Admin**.

### 1. Alur Pengguna (Siswa)

Alur standar bagi pengguna yang ingin mengerjakan tes dan mengelola akun mereka.

1.  **Registrasi & Login**: Pengguna membuat akun baru atau masuk ke akun yang sudah ada. Sesi dikelola menggunakan JWT yang disimpan dengan aman di `httpOnly` cookie.
2.  **Dashboard**: Setelah login, pengguna diarahkan ke dashboard pribadi (`/dashboard`) yang berisi ringkasan statistik, seperti skor rata-rata, tes yang telah selesai, dan rekomendasi tes.
3.  **Mengerjakan Tes**:
    * Pengguna memilih tes dari daftar (`/tests`), yang dapat difilter berdasarkan kategori atau kesulitan.
    * Pengguna mengerjakan soal di halaman tes (`/test/:testId`) yang dilengkapi *timer* dan navigasi soal.
    * Jawaban dikirim ke backend (`POST /api/test-results`) untuk penilaian instan.
4.  **Melihat Hasil**: Pengguna langsung diarahkan ke halaman hasil (`/result`) untuk melihat skor, performa, dan pembahasan soal yang mendetail.
5.  **Mengelola Akun**: Pengguna dapat melihat detail akun dan melakukan *logout* melalui halaman `/account`.

### 2. Alur Langganan Premium (User & Admin)

Alur ini menjelaskan bagaimana pengguna mendapatkan akses premium melalui sistem order dan verifikasi manual oleh admin.

1.  **Pembuatan Order (User)**:
    * Pengguna memilih paket premium (misalnya, bulanan/tahunan) di halaman order (`/order/...`).
    * Sistem membuat entri order baru di database dengan status `pending` (`POST /api/orders`).
2.  **Upload Bukti Bayar (User)**:
    * Pengguna diarahkan ke halaman "My Orders" (`/my-orders`).
    * Di halaman ini, pengguna mengunggah gambar bukti transfer.
    * File dikirim ke `POST /api/upload`, yang menyimpan file di server dan mengembalikan URL.
    * URL gambar tersebut kemudian ditautkan ke order terkait (`PUT /api/orders/:id/payment-proof`).
3.  **Verifikasi (Admin)**:
    * Admin login dan membuka panel "Manage Orders" (`/admin/orders`).
    * Admin melihat daftar order yang berstatus `pending` dan dapat mengklik "Lihat Bukti Bayar" untuk meninjau gambar yang diunggah pengguna.
    * Jika valid, Admin menekan tombol "Verifikasi".
4.  **Aktivasi Akun (Sistem)**:
    * Tombol "Verifikasi" memanggil endpoint `PUT /api/orders/:id/verify`.
    * Backend mengubah status order menjadi `completed`.
    * Backend juga meng-update data pengguna: `IsPremium` menjadi `true` dan mengatur `PremiumExpiresAt` (misal, 1 bulan atau 1 tahun dari sekarang).
    * Pengguna tersebut sekarang memiliki akses penuh ke semua konten premium di platform.

### 3. Alur Manajemen Konten (Admin)

Admin memiliki panel khusus (`/admin`) yang dilindungi untuk mengelola seluruh konten dan pengguna platform.

* **CRUD Tes**: Admin dapat membuat, melihat, mengedit, dan menghapus tes (`/admin/tests`).
* **CRUD Soal**: Admin dapat menambah, mengedit, dan menghapus soal untuk setiap tes (`/admin/questions/:testId`).
* **CRUD Kelas**: Admin mengelola daftar kelas premium (`/admin/classes`).
* **Manajemen Pengguna**: Admin dapat melihat semua pengguna terdaftar dan mengubah `role` (misal, dari 'user' ke 'admin') atau status `is_premium` mereka secara manual (`/admin/users`).
