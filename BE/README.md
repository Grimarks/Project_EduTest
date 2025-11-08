# Backend - Project TryOutOnline GDGoC

Ini adalah layanan backend REST API untuk aplikasi TryOutOnline. Proyek ini dibuat menggunakan Go (Fiber) dan telah di-container-kan sepenuhnya menggunakan Docker.

## Fitur Utama

* **Autentikasi Aman:** Stateful JWT (Access Token di HttpOnly Cookie, Refresh Token divalidasi ke Redis).
* **Role-Based Access Control (RBAC):** Perbedaan hak akses antara `admin` dan `user`.
* **Manajemen Tes & Soal:** CRUD penuh untuk TryOut dan pertanyaannya.
* **Sistem Pembayaran:** Alur pemesanan (Order) penuh untuk tes/kelas premium.
* **Manajemen Kelas Premium:** CRUD untuk konten kelas premium.
* **Upload File:** Mendukung upload (misalnya bukti pembayaran) ke server.
* **Dokumentasi API:** Dokumentasi otomatis menggunakan Swagger.

## Tumpukan Teknologi (Tech Stack)

* **Go (Golang)**: Bahasa pemrograman utama.
* **Fiber**: *Framework* web yang cepat untuk Go.
* **GORM**: *ORM* untuk interaksi database.
* **MySQL**: Database SQL utama.
* **Redis**: *Cache* untuk menyimpan sesi *refresh token*.
* **Docker & Docker Compose**: Untuk *containerisasi* dan orkestrasi semua layanan (Go, MySQL, Redis).

---

## Cara Menjalankan (Getting Started)

Proyek ini dirancang untuk berjalan di dalam Docker. Seluruh lingkungan (Go, MySQL, dan Redis) akan berjalan dengan satu perintah.

### Prasyarat

* **Docker Desktop** terinstal dan sedang berjalan di komputer Anda.

### Langkah-langkah Instalasi

1.  **Clone repositori ini.**

2.  **Buat file Konfigurasi Docker (`.env.docker`)**
    Buat file baru bernama `.env.docker` di dalam folder `BE/` ini. Salin konten di bawah ini dan **pastikan** `DB_PASSWORD` di sini **sama** dengan `MYSQL_ROOT_PASSWORD` di `docker-compose.yml` Anda.

    ```env
    # --- Konfigurasi Database (untuk di dalam Docker) ---
    DB_HOST=db
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=admin123
    DB_NAME=tryout_online_db
    
    # --- Konfigurasi Redis (untuk di dalam Docker) ---
    REDIS_ADDR=redis:6379
    REDIS_PASSWORD=""
    REDIS_DB=0
    
    # --- Konfigurasi Aplikasi ---
    JWT_SECRET_KEY="ini_kunci_rahasia_anda_yang_sangat_aman"
    ```

3.  **Jalankan Docker Compose**
    Buka terminal di dalam folder `BE/` dan jalankan perintah berikut:

    docker-compose up --build

    * Perintah ini akan membangun *image* Go, mengunduh *image* MySQL dan Redis, dan menjalankan ketiganya secara bersamaan.
    * Biarkan terminal ini tetap berjalan.

4.  **Selesai!**
    * Backend Anda sekarang berjalan di: **`http://localhost:3000`**
    * Database Anda dapat diakses (dari luar) di: **`localhost:3307`**
    * Redis Anda dapat diakses (dari luar) di: **`localhost:6379`**