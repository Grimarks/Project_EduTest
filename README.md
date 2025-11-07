# Project-FE-BE-GDGoC

# EduTest+ : Platform Simulasi Tes & Kelas Premium

EduTest+ adalah platform aplikasi web yang dirancang untuk simulasi tes online dan penyediaan kelas premium, dibangun dengan stack Go (Backend) dan React (Frontend).

## Alur Utama Website

Aplikasi ini memiliki dua alur utama: alur untuk **Pengguna (Siswa)** dan alur untuk **Admin**.

### 1. Alur Pengguna (Siswa)

Alur standar bagi pengguna yang ingin mengerjakan tes dan mengelola akun.

1.  **Registrasi & Login**: Pengguna membuat akun baru dan melakukan login. Sesi dikelola menggunakan JWT yang disimpan di `httpOnly` cookie.
2.  **Dashboard**: Pengguna melihat dashboard pribadi (`/dashboard`) yang berisi ringkasan statistik, seperti skor rata-rata dan tes yang telah selesai.
3.  **Mengerjakan Tes**:
    * Pengguna memilih tes dari daftar (`/tests`).
    * Pengguna mengerjakan soal di halaman tes (`/test/:testId`) yang dilengkapi *timer*.
    * Jawaban dikirim ke backend (`POST /api/test-results`) untuk dinilai.
4.  **Melihat Hasil**: Pengguna diarahkan ke halaman hasil (`/result`) untuk melihat skor, performa, dan pembahasan soal.
5.  **Mengelola Akun**: Pengguna dapat melihat detail akun dan *logout* (`/account`).

### 2. Alur Langganan Premium (User & Admin)

Alur ini menjelaskan bagaimana pengguna mendapatkan akses premium melalui verifikasi manual oleh admin.

1.  **Pembuatan Order (User)**:
    * Pengguna memilih paket premium (misalnya, bulanan/tahunan) di halaman order (`/order/...`).
    * Sistem membuat order baru dengan status `pending` (`POST /api/orders`).
2.  **Upload Bukti Bayar (User)**:
    * Pengguna diarahkan ke halaman "My Orders" (`/my-orders`).
    * Pengguna mengunggah gambar bukti transfer.
    * File dikirim ke `POST /api/upload`, yang menyimpan file di server dan mengembalikan URL.
    * URL gambar tersebut kemudian ditautkan ke order (`PUT /api/orders/:id/payment-proof`).
3.  **Verifikasi (Admin)**:
    * Admin login dan membuka panel "Manage Orders" (`/admin/orders`).
    * Admin melihat daftar order `pending` dan dapat mengklik "Lihat Bukti Bayar" untuk meninjau gambar.
    * Jika valid, Admin menekan tombol "Verifikasi".
4.  **Aktivasi Akun (Sistem)**:
    * Tombol "Verifikasi" memanggil `PUT /api/orders/:id/verify`.
    * Backend mengubah status order menjadi `completed`.
    * Backend juga meng-update data pengguna: `IsPremium` menjadi `true` dan mengatur `PremiumExpiresAt` (misal, 1 bulan atau 1 tahun dari sekarang).
    * Pengguna tersebut sekarang memiliki akses penuh ke semua konten premium.

### 3. Alur Manajemen Konten (Admin)

Admin juga bertanggung jawab untuk mengelola semua konten melalui Panel Admin:

* **CRUD Tes**: Admin dapat membuat, melihat, mengedit, dan menghapus tes (`/admin/tests`).
* **CRUD Soal**: Admin dapat menambah, mengedit, dan menghapus soal untuk setiap tes (`/admin/questions/:testId`).
* **CRUD Kelas**: Admin mengelola daftar kelas premium (`/admin/classes`).
* **Manajemen Pengguna**: Admin dapat melihat semua pengguna dan mengubah status `role` atau `is_premium` mereka secara manual (`/admin/users`).
