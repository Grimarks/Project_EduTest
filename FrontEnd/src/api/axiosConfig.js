import axios from 'axios';

// Buat instance axios agar tidak bentrok dengan konfigurasi global lain
const instance = axios.create({
    baseURL: 'http://localhost:3000/api', // ganti sesuai URL backend kamu
    withCredentials: true, // penting jika backend pakai cookie untuk autentikasi
});

// Interceptor: otomatis sisipkan token di header Authorization
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;
