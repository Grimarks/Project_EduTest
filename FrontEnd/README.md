# EduTest+ (dari sisi Frontend)

Aplikasi **Frontend** untuk **EduTest+**, platform simulasi tes online dan kelas premium.
Dibangun menggunakan **React + Vite**, dengan desain modern berbasis **Tailwind CSS** dan komponen dari **shadcn/ui**.
Terhubung langsung ke **Backend (Go)** yang mengatur autentikasi, data tes, dan sistem langganan.

---

## Fitur Utama

Aplikasi ini terdiri dari dua alur besar: **Pengguna (User)** dan **Admin**.

### Untuk Pengguna

* **Autentikasi:** Login, Register, Logout pakai JWT via Cookie `httpOnly`.
* **Halaman Utama:** Landing page berisi statistik & tes unggulan.
* **Daftar Tes:** Filter berdasarkan kategori, tingkat kesulitan, dan status premium.
* **Halaman Ujian:** Lengkap dengan timer, navigasi soal, dan submit otomatis.
* **Hasil Tes:** Menampilkan skor dan pembahasan.
* **Langganan Premium:** Sistem bulanan/tahunan, pembelian lewat order & verifikasi admin.
* **Dashboard Pribadi:** Lihat skor rata-rata, riwayat tes, dan status langganan.
* **Manajemen Pesanan:** Upload bukti pembayaran & pantau status verifikasi.
* **Manajemen Akun:** Ubah profil (nama, role).

### Untuk Admin

* **Proteksi Role:** Hanya `role=admin` yang bisa akses `/admin`.
* **Dashboard Statistik:** Total pengguna, tes, kelas, dan order pending.
* **CRUD Tes & Soal:** Tambah, edit, hapus, dan hubungkan soal dengan tes.
* **CRUD Kelas Premium:** Kelola konten kelas premium.
* **Manajemen Pengguna:** Ubah status premium dan role.
* **Manajemen Pesanan:** Verifikasi pembayaran manual (otomatis aktifkan premium).

---

## Teknologi Utama

| Kategori         | Teknologi                                                     |
| ---------------- | ------------------------------------------------------------- |
| Framework        | **React 19**, **Vite**                                        |
| Styling          | **Tailwind CSS**, **tailwind-merge**, **tailwindcss-animate** |
| UI Components    | **shadcn/ui**, **Radix UI**, **Lucide React Icons**           |
| Routing          | **React Router DOM (v7)**                                     |
| State Management | **Zustand**, **React Context (useAuth)**                      |
| Data Fetching    | **Axios**                                                     |
| Server Caching   | **TanStack React Query**                                      |
| Theme & Mode     | **next-themes** (dark/light mode)                             |
| Notification     | **sonner**                                                    |
| Linting          | **ESLint** (v9)                                               |

---

## Syarat

Sebelum menjalankan proyek, pastikan sudah menginstal:

1. **Node.js** v18 ke atas
2. **npm** atau **yarn**
3. **Backend Go Server** aktif di `http://localhost:3000/api`

---

## Instalasi

1. **Clone repository**

   ```bash
   git clone https://github.com/<username>/EduTest-Frontend.git
   cd EduTest-Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Jalankan Backend (Go)**
   Pastikan backend berjalan di port `3000`.

4. **Jalankan Frontend**

   ```bash
   npm run dev
   ```

   Akses di: [http://localhost:5173](http://localhost:5173)

---

## 🔧 Konfigurasi API

Atur endpoint backend di:
`src/api/axiosConfig.js`

```js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // penting untuk httpOnly cookie
});

export default instance;
```

---

## Konfigurasi Tambahan

### 1. Tailwind Setup (`tailwind.config.js`)

Pastikan file ini sudah ada:

```js
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [tailwindcssAnimate],
};
```

### 2. shadcn/ui Setup

Jika ingin generate komponen baru:

```bash
npx shadcn-ui@latest add button card badge input
```

### 3. Environment Variables

Jika butuh ganti URL API:

```bash
VITE_API_URL=http://localhost:3000/api
```

dan gunakan di `axiosConfig.js`:

```js
baseURL: import.meta.env.VITE_API_URL
```

---

## Catatan Developer

* Aplikasi pakai **httpOnly cookies** untuk autentikasi, bukan `localStorage`.
* Sistem premium berbasis **tanggal kedaluwarsa (PremiumExpiresAt)**.
* Dashboard admin menampilkan statistik real-time dari backend.
* Semua request terautentikasi dikirim pakai:

  ```js
  axios.get("/protected-route", { withCredentials: true });
  ```
